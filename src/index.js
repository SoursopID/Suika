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

  console.log(`sessionDir:`, sessionDir);
  console.log(`pluginDir:`, pluginDir);

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
 * Default client options
 * @type {ClientOptions}
 */
const clientOptions = {
  sessionDir: './session',
  pluginDir: './plugins',
  dataDir: './data'
}

// Start the client with default options
clientStart(clientOptions).catch(err => {
  console.error('Error in client:', err);
});




