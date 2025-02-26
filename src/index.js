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
 * @param {Object} options 
 * @param {string} options.sessionDir - directory to store session files
 * @param {string} options.pluginDir - directory to load plugins from
 * @param {string} options.dataDir - directory to store data files
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
        clientStart();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  handler.attach(sock);

  console.log(`${await handler.countListeners()} listeners attached.`);
  console.log(`${await handler.countCommands()} commands loaded.`);

  return sock;
}

const clientOptions = {
  sessionDir: './session',
  pluginDir: './plugins',
  dataDir: './data'
}

clientStart(clientOptions).catch(err => {
  console.error('Error in client:', err);
});




