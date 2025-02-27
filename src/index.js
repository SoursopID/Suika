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

  console.log(`sessionDir:`, sessionDir);
  console.log(`pluginDir:`, pluginDir);
  console.log(`dataDir:`, dataDir);

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const handler = new Handler(options);

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ['macOS', 'Chrome', '10.15.6'],
    logger: pino({ level: 'warn' }),
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        clientStart(options);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  await handler.attach(sock);

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
    // Add any other environment-configurable options here
  };
}

// Get options from environment variables with fallbacks to defaults
const clientOptions = getOptionsFromEnv();

// Start the client with the configured options
clientStart(clientOptions).catch(err => {
  console.error('Error in client:', err);
});




