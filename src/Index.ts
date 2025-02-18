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

import { 
  makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  WASocket,
  ConnectionState,
  AuthenticationState 
} from 'baileys';
import { handler } from './Handler.js';
import { loadPlugins } from './Loader.js';
import { addCopyrightRecursive } from './Copyright.js';

addCopyrightRecursive('src');
addCopyrightRecursive('plugins');

async function connectClient(): Promise<WASocket> {
  const { state, saveCreds }: { 
    state: AuthenticationState, 
    saveCreds: () => Promise<void> 
  } = await useMultiFileAuthState('session');

  const sock: WASocket = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ['macOS', 'Chrome', '10.15.6'],
  });

  sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectClient();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  handler.attach(sock);

  return sock;
}

connectClient().catch((err: Error) => {
  console.error('Error in client:', err);
});

await loadPlugins('../plugins');
console.log(`${handler.countListeners()} Loaded listeners`);
console.log(`${handler.countPlugins()} Loaded plugins ${handler.countPluginWithPrefix()} + prefix`);
