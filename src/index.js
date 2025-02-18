import { makeWASocket, DisconnectReason, useMultiFileAuthState } from "baileys";
import { handler } from "./hand.js";
import { loadPlugins } from "./loader.js";


async function connectClient() {
  const { state, saveCreds } = await useMultiFileAuthState('session');

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    browser: ['Admin', 'Chrome', '1.0.0']
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

  sock.ev.on('messages.upsert', async ({ messages }) => {
    if (messages.length === 0) return;

    const msg = messages[0];
    handler.handle(sock, msg);

  });

  return sock;
}

connectClient().catch(err => {
  console.error('Error in client:', err);
});

await loadPlugins('../plugins');
console.log(`${handler.countListeners()} Loaded listeners`);
console.log(`${handler.countPlugins()} Loaded plugins ${handler.countPluginWithPrefix()} + prefix`);



