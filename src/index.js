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
import { handler } from "./hand.js";
import { pino } from 'pino';

async function connectClient() {
  const { state, saveCreds } = await useMultiFileAuthState('session');

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
        connectClient();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  handler.attach(sock);

  return sock;
}

connectClient().catch(err => {
  console.error('Error in client:', err);
});

console.log(`${await handler.countListeners()} Loaded listeners`);
console.log(`${await handler.countCommands()} prefix`);



