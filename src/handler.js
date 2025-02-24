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

import path from "path";
import { Ctx } from "./ctx.js";
import { MESSAGES_UPSERT } from "./event.js";
import { Plugin } from "./plugin.js";
import { readdirSync, statSync } from 'fs';



export const DEFAULT_PREFIX = "/.";

/**
 * @typedef {Object} Handler - Plugin handler
 * @property {import('baileys').WASocket} sock - Baileys socket client
 * @property {Map<string, import('./plugin.js').Plugin>} plugins - Plugins
 * @property {Array<string>} listeners - Listeners
 * @property {Map<string, string>} commands - Commands
 * @property {string} pluginDir - Plugin directory
 * @property {string} prefix - Command prefix
 * @property {Map<string, import('./plugin.js').Plugin>} afterSend - Handlers
 */
export class Handler {
  /**
   * @param {string} pluginDir - Plugin directory
   * @param {string} prefix - Command prefix
   */
  constructor(pluginDir, prefix) {
    console.log(pluginDir)
    this.pluginDir = pluginDir ? path.resolve(pluginDir) : '../plugins/';
    this.prefix = prefix ?? DEFAULT_PREFIX;

    this.handlers = new Map();
    this.plugins = new Map();
    this.listeners = [];
    this.commands = new Map();
    this.afterSend = new Map();

    this.handlers.set(MESSAGES_UPSERT, this.#handle_ipsert);

    this.pluginReload(this.pluginDir);
  }

  /**
   * @returns {number} - Number of listeners
   */
  countListeners() {
    return this.listeners.length;
  }

  /**
   * @returns {number} - Number of plugins
   */
  countPlugins() {
    return this.plugins.size;
  }

  /**
   * @returns {number} - Number of commands
   */
  countCommands() {
    return this.commands.size;
  }

  /**
   * @param {import('./plugin.js').Plugin} p - Plugin instance
   */
  after(p) {
    const newp = new Plugin(p);
    this.afterSend.set(newp.id, newp);
  }

  #after_send(ctx) {
    for (const [id, p] of this.afterSend.entries()) {
      p.exec(ctx);
    }
  }

  /**
   * @param {import('./plugin.js').Plugin} p - Plugin instance  
   */
  add(p) {
    const newp = new Plugin(p);
    this.plugins.set(newp.id, newp);
    this.reloadPlugins();
  }

  reloadPlugins() {
    // clear commands and listeners
    this.commands.clear();
    this.listeners = [];

    for (const [id, p] of this.plugins.entries()) {
      if (!p.cmds) {
        this.listeners.push(id);
      } else {
        for (let c of p.cmds) {
          c = c.toLowerCase();
          if (p.noprefix) {
            this.commands.set(c, id);
          } else {
            for (const pre of this.prefix) {
              this.commands.set(pre + c, id);
            }
          }
        }
      }
    }
  }

  /**
  * @param {string} e - Event name
  * @param {Function} f - Event handler
  */
  add_handler(e, f) {
    this.handlers.set(e, f);
  }

  /**
   * @param {import('baileys').WASocket} sock - Baileys socket client
   */
  attach(sock) {
    this.sock = sock;

    for (const [event, handler] of this.handlers) {
      sock.ev.on(event, (event) => {
        handler(this, sock, event);
      });
    }
  }

  /**
   * @param {Handler} handler 
   * @param {import('baileys').WASocket} sock - Baileys socket client
   * @param {{messages: import('baileys').WAMessage[], type: import('baileys').MessageUpsertType}} upsert - Message upsert
   */
  #handle_ipsert(handler, sock, upsert) {
    try {
      if (!upsert?.messages) return;

      for (const message of upsert.messages) {
        const ctx = new Ctx({ handler: handler, sock: sock, update: message });
        if (upsert?.type === 'notify') {
          // looping through listeners
          for (const pid of handler.listeners) {
            const listener = handler.plugins.get(pid);
            if (listener?.check(ctx)) {
              try {
                listener.exec(ctx);
              } catch (error) {
                console.error(`Error executing listener ${pid}:`, error);
              }
            }
          }

          // looping through plugins with prefix
          if (handler.commands.has(ctx.pattern)) {
            const id = handler.commands.get(ctx.pattern);
            const plugin = handler.plugins.get(id);
            if (plugin.check(ctx)) {
              try {
                plugin.exec(ctx);
              } catch (error) {
                console.error(`Error executing plugin ${id}:`, error);
              }
            }
          }
        } else if (upsert?.type === 'append') {
          handler.#after_send(ctx);
        }
      }
    } catch (err) {
      console.error('Error handling message:', err);
      console.log('Message:', JSON.stringify(upsert));
    }
  }

  /**
   * @param {string} dir - Plugin directory
   */
  async pluginReload(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
      const path = `${dir}/${file}`.replaceAll('//', '/');

      if (statSync(path)?.isDirectory()) {
        this.pluginReload(path);
      }

      if (file.endsWith('.js')) {
        try {
          const plugin = await import(path);
          if (plugin.on) {
            this.add(plugin.on);
          }

          if (plugin.after) {
            this.after(plugin.after);
          }

          console.log('success', path);
        } catch (e) {
          console.log('error', e.message);
        }
      }
    }
  }
}
