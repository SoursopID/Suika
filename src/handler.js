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
import { MESSAGES_UPSERT, GROUPS_UPSERT } from "./event.js";
import { Plugin } from "./plugin.js";
import { mkdirSync, readdirSync, statSync } from 'fs';
import { platform } from "os";
import { pathToFileURL } from "url";
import { Config } from "./config.js";

/**
 * Default command prefix
 * @type {string}
 */
export const DEFAULT_PREFIX = "/.";

/**
 * @typedef {Object} HandlerOptions
 * @property {string} pluginDir - Path to plugin directory
 * @property {string} dataDir - Path to data directory
 * @property {string} [prefix] - Command prefix (defaults to DEFAULT_PREFIX)
 */

/**
 * @typedef {Object} Handler - Plugin handler
 * @property {import('baileys').WASocket} sock - Baileys socket client
 * @property {Map<string, import('./plugin.js').Plugin>} plugins - Map of plugin ID to Plugin instance
 * @property {Array<string>} listeners - Array of listener plugin IDs
 * @property {Map<string, string>} commands - Map of command pattern to plugin ID
 * @property {string} pluginDir - Plugin directory path
 * @property {string} prefix - Command prefix
 * @property {Map<string, Function>} handlers - Map of event name to handler function
 * @property {Map<string, import('./plugin.js').Plugin>} afterSend - After-send handlers
 * @property {Promise<void>} ready - Plugin loading completion promise
 * @property {import('./config.js').Config} expirations - Expiration times for messages
 * @property {import('./config.js').Config} groupMetadata - Cached group metadata
 */

/**
 * Handler class for managing plugins and processing WhatsApp events
 * 
 * @class Handler
 */
export class Handler {
  /**
   * Creates a new Handler instance
   * 
   * @param {HandlerOptions} options - Handler configuration options
   * @throws {Error} If required options are missing
   */
  constructor(options) {
    if (!options) throw new Error('Handler options are required');
    if (!options?.pluginDir || options?.pluginDir?.length === 0) throw new Error('Plugin directory path is required');
    if (!options?.dataDir || options?.dataDir?.length === 0) throw new Error('Data directory path is required');

    const dataStat = statSync(options.dataDir);
    if (!dataStat?.isDirectory()) mkdirSync(options.dataDir, { recursive: true });

    this.pluginDir = path.resolve(options.pluginDir)
    this.prefix = options.prefix ?? DEFAULT_PREFIX;

    this.handlers = new Map();
    this.plugins = new Map();
    this.listeners = [];
    this.commands = new Map();
    this.afterSend = new Map();
    this.expirations = new Config({ jsonName: path.join(options.dataDir, 'expirations.json'), autosave: true });
    this.groupMetadata = new Config({ jsonName: path.join(options.dataDir, 'group_metadata.json'), autosave: true });


    this.handlers.set(MESSAGES_UPSERT, handle_message_upsert);
    this.handlers.set(GROUPS_UPSERT, handle_groups_upsert);

    this.ready = this.pluginReload(this.pluginDir);
  }

  /**
   * Returns the number of registered listeners
   * 
   * @async
   * @returns {Promise<number>} Number of listeners
   */
  async countListeners() {
    await this.ready;
    return this.listeners.length;
  }

  /**
   * Returns the number of loaded plugins
   * 
   * @async
   * @returns {Promise<number>} Number of plugins
   */
  async countPlugins() {
    await this.ready;
    return this.plugins.size;
  }

  /**
   * Returns the number of registered commands
   * 
   * @async
   * @returns {Promise<number>} Number of commands
   */
  async countCommands() {
    await this.ready;
    return this.commands.size;
  }

  /**
   * Registers an after-send plugin handler
   * 
   * @param {import('./plugin.js').Plugin} p - Plugin instance
   * @returns {void}
   */
  after(p) {
    const newp = new Plugin(p);
    this.afterSend.set(newp.id, newp);
  }

  /**
   * Executes after-send handlers for a message
   * 
   * @param {import('./ctx.js').Ctx} ctx - Message context
   * @returns {void}
   */
  after_send(ctx) {
    for (const [_, p] of this.afterSend.entries()) {
      if (p.exec) {
        p.exec(ctx);
      }
    }
  }

  /**
   * Registers a new plugin
   * 
   * @param {import('./plugin.js').Plugin} p - Plugin instance
   * @returns {void}
   */
  on(p) {
    const newp = new Plugin(p);
    this.plugins.set(newp.id, newp);
    this.reloadPlugins();
  }

  /**
   * Reloads and reorganizes plugin commands and listeners
   * 
   * @private
   * @returns {void}
   */
  reloadPlugins() {
    // clear commands and listeners
    this.commands.clear();
    this.listeners.length = 0;

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
   * Adds an event handler
   * 
   * @param {string} e - Event name
   * @param {(handler: Handler, sock: import('baileys').WASocket, event: any) => void} f - Event handler function
   * @returns {void}
   */
  add_handler(e, f) {
    this.handlers.set(e, f);
  }

  /**
   * Attaches a socket client and registers event handlers
   * 
   * @param {import('baileys').WASocket} sock - Baileys socket client
   * @returns {Promise<void>}
   */
  async attach(sock) {
    this.sock = sock;

    for (const [event, handler] of this.handlers) {
      sock.ev.on(event, async (event) => {
        await handler(this, sock, event);
      });
    }
  }

  /**
   * Loads plugins from a directory
   * 
   * @async
   * @param {string} dir - Plugin directory path
   * @returns {Promise<void>}
   */
  async pluginReload(dir) {
    const files = readdirSync(dir);
    for (const file of files) {
      let path = `${dir}/${file}`.replaceAll('//', '/');

      if (statSync(path)?.isDirectory()) {
        await this.pluginReload(path);
      }

      if (file.endsWith('.js')) {
        try {
          if (platform() === 'win32') {
            path = pathToFileURL(path).href;
          }

          const plugin = await import(path);

          if (plugin.on) this.on(plugin.on)
          if (plugin.ons) {
            for (const p of plugin.ons) {
              this.on(p);
            }
          }

          if (plugin.after) this.after(plugin.after)
          if (plugin.afters) {
            for (const p of plugin.afters) {
              this.on(p);
            }
          }


          console.log('success', path);
        } catch (e) {
          console.log('error', path, e);
        }
      }
    }
  }
}

/**
 * Handles message upsert events from WhatsApp
 * 
 * @param {Handler} handler - Handler instance
 * @param {import('baileys').WASocket} sock - Baileys socket client
 * @param {Object} upsert - Message upsert event
 * @param {import('baileys').WAMessage[]} upsert.messages - Array of new/updated messages
 * @param {'append'|'notify'} upsert.type - Type of update (append for sent messages, notify for received)
 * @returns {Promise<void>}
 * @private
 */
async function handle_message_upsert(handler, sock, upsert) {
  try {
    if (!upsert?.messages) return;

    for (const message of upsert.messages) {
      const ctx = new Ctx({ handler: handler, sock: sock, update: message, type: upsert.type });
      if (upsert?.type === 'notify') {
        // Process listeners sequentially
        for (const pid of handler.listeners) {
          const listener = handler.plugins.get(pid);
          if (listener && await listener.check(ctx)) {
            try {
              await listener.exec(ctx);
            } catch (error) {
              console.error(`Error executing listener ${pid}:`, error);
            }
          }
        }

        // Process command plugins
        if (handler.commands.has(ctx.pattern)) {
          const id = handler.commands.get(ctx.pattern);
          const plugin = handler.plugins.get(id);
          if (plugin && await plugin.check(ctx)) {
            try {
              await plugin.exec(ctx);
            } catch (error) {
              console.error(`Error executing plugin ${id}:`, error);
            }
          }
        }
      } else if (upsert?.type === 'append') {
        // Process after-send handlers
        for (const [_, p] of handler.afterSend.entries()) {
          if (p.exec) {
            try {
              await p.exec(ctx);
            } catch (error) {
              console.error(`Error executing after-send handler:`, error);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error handling message:', err);
    console.log('Message:', JSON.stringify(upsert));
  }
}

/**
 * Handles group update events from WhatsApp
 * 
 * @param {Handler} handler - Handler instance
 * @param {import('baileys').WASocket} sock - Baileys socket client
 * @param {import('baileys').GroupMetadata[]} updates - Group update event
 * @returns {Promise<void>}
 * @private
 */
async function handle_groups_upsert(handler, sock, updates) {
  try {
    if (!updates) return;
    
    // Process each group update
    for (const group of updates) {
      // Store the updated group metadata in the cache
      if (group.id) {
        handler.groupMetadata.set(group.id, group);
        console.log(`Updated group metadata for: ${group.id}`);
      }
    }
  } catch (err) {
    console.error('Error handling group update:', err);
    console.log('Update:', JSON.stringify(update));
  }
}


