/**
 * Copyright (C) 2025 SoursopID
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/
 *
 * This code is part of Suika project
 * (https://github.com/SoursopID/Suika)
 */

import { makeWASocket, DisconnectReason, useMultiFileAuthState } from "baileys";
import { pino } from 'pino';
import { Handler } from "./handler.js";
import { config } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';
import readline from "node:readline";

const question = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


/** @type {import('node:readline').Interface} */
const ask = (text) => new Promise((resolve) => question.question(text, resolve));

/** @type {import('node:timers').Timer} */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load environment variables from .env file if it exists
const envPath = path.resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  console.log(`Loading configuration from ${envPath}`);
  config();
}

/**
 * @typedef {Object} ClientOptions
 * @property {string} [sessionDir='session'] - Directory to store session files
 * @property {string} [pluginDir='./plugins'] - Directory to load plugins from
 * @property {string} [dataDir='./data'] - Directory to store data files
 * @property {string} [method='otp'] - WhatsApp phone number to connect to
 */

/** 
 * Starts a WhatsApp client with the specified options
 * 
 * @param {ClientOptions} options - Client configuration options
 * @returns {Promise<import('baileys').WASocket>} The connected WhatsApp socket
 */
async function clientStart(options) {
  const sessionDir = options?.sessionDir ?? 'session';
  const pluginDir = options?.pluginDir ?? './plugins';
  const dataDir = options?.dataDir ?? './data';
  const method = options?.method ?? 'qr';

  console.log(`sessionDir:`, sessionDir);
  console.log(`pluginDir:`, pluginDir);
  console.log(`dataDir:`, dataDir);

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const handler = new Handler(options);

  /** @type {import('baileys').UserFacingSocketConfig} */
  const socketOptions = {
    syncFullHistory: false,
    printQRInTerminal: method === 'qr',
    auth: state,
    browser: method === 'qr' ? ['macOS', 'Safari', '18.3'] : ['macOS', 'Chrome', '134.0.6998.31'],
    logger: pino({ level: 'error' }),
  };
  const sock = makeWASocket(socketOptions);
  await handler.attach(sock);

  // console.log(state);
  // exit(1)

  if (method !== 'qr' && !state?.creds?.registered) {
    await delay(1000);

    let phone
    while (!phone) {
      phone = await ask('Enter phone number: ');
      phone = phone?.replace(/[^+0-9]/g, '');
      phone = phone?.trim();

      if (!phone) console.log('Phone number cannot be empty!');
    }

    const otp = await sock.requestPairingCode(phone);
    if (otp) console.log(` Enter this OTP on your WhatsApp (${phone}) : ${otp}`);
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      console.log(connection, lastDisconnect);

      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        clientStart(options);
      }
    } else if (connection === 'open') {
      console.log('WhatsApp connected!');
    }
  });

  sock.ev.on('creds.update', saveCreds);


  console.log(`${await handler.countListeners()} listeners attached.`);
  console.log(`${await handler.countCommands()} commands loaded.`);

  return sock;
}

/**
 * Get options from environment variables with fallbacks
 * 
 * @returns {ClientOptions} Client options from environment or defaults
 */
function getOptionsFromEnv() {
  return {
    sessionDir: process.env.SUIKA_SESSION_DIR ?? './session',
    pluginDir: process.env.SUIKA_PLUGIN_DIR ?? './plugins',
    dataDir: process.env.SUIKA_DATA_DIR ?? './data',
    method: process.env.SUIKA_METHOD ?? 'otp',
    // Add any other environment-configurable options here
  };
}

// Get options from environment variables with fallbacks to defaults
const clientOptions = getOptionsFromEnv();

// Start the client with the configured options
try {
  await clientStart(clientOptions)
} catch (err) {
  console.error('Error in client:', err);
}



