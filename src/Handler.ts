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

import { BaileysEventMap, MessageUpsertType, WAMessage, WASocket } from "baileys/lib/index.js";
import { Ctx } from "./Ctx.js";
import { genHEXID } from "./Utils.js";
import { MESSAGES_UPSERT } from "./Event.js";
import { Plugin } from "./Plugin.js";

export const DEFAULT_PREFIX = "/.";


export class Handler {
  sock?: WASocket;
  handlers: Map<keyof BaileysEventMap, (sock: WASocket, event: any) => void>;
  listeners: Map<string, Plugin>;
  plugins: Map<string, Plugin>;
  pluginWithPrefix: Map<string, string>;

  constructor() {
    this.handlers = new Map();

    this.listeners = new Map();
    this.plugins = new Map();
    this.pluginWithPrefix = new Map();
  }

  countListeners() {
    return this.listeners.size;
  }

  countPlugins() {
    return this.plugins.size;
  }

  countPluginWithPrefix() {
    return this.pluginWithPrefix.size;
  }

  add(p: Plugin) {
    if (!p.id) p.id = genHEXID(16);
    if (!p.cmds) {
      this.listeners.set(p.id, p);
    } else {
      this.plugins.set(p.id, p);
      for (let c of p.cmds) {
        c = c.toLowerCase();
        if (p.noprefix) {
          this.pluginWithPrefix.set(c, p.id);
        } else {
          for (const pre of DEFAULT_PREFIX.split('')) {
            this.pluginWithPrefix.set(pre + c, p.id);
          }

        }
      }
    }
  }

  add_handler(e: keyof BaileysEventMap, h: (sock: WASocket, event: any) => void) {
    this.handlers.set(e, h);
  }

  attach(sock: WASocket) {
    this.sock = sock;

    for (const [e, handler] of this.handlers) {
      sock.ev.on(e, async (event: any) => {
        handler(sock, event);
      });
    }
  }
}

export const handler = new Handler();

handler.add_handler(MESSAGES_UPSERT, async (sock: WASocket, upsert: { messages: WAMessage[]; type: MessageUpsertType }) => {
  try {
    if (!upsert) return
    if (upsert?.messages?.length <= 0) return;

    for (const event of upsert.messages) {
      const ctx = new Ctx(handler, sock, event);

      for (const [id, listener] of handler.listeners) {
        if (listener.check(ctx)) {
          try {
            await listener.exec(ctx);
          } catch (error) {
            console.error(`Error executing listener ${id}:`, error);
          }
        }
      }

      const id = handler.pluginWithPrefix.get(ctx.pattern);
      if (id) {
        const plugin = handler.plugins.get(id);
        if (plugin && plugin?.check(ctx)) {
          try {
            await plugin.exec(ctx);
          } catch (error) {
            console.error(`Error executing plugin ${id}:`, error);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error handling message:', err);
    console.log('Message:', JSON.stringify(upsert));
  }
});
