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

import { Ctx } from "./ctx.js";
import { genHEXID } from "./utils.js";

export const DEFAULT_PREFIX = "/.";


export class Handler {
  constructor() {
    this.sock = null;
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

  add(p) {
    const id = genHEXID(6);
    if (!p.cmds) {
      this.listeners.set(genHEXID(6), p);
    } else {
      this.plugins.set(id, p);
      for (let c of p.cmds) {
        c = c.toLowerCase();
        if (p.noprefix) {
          this.pluginWithPrefix.set(c, id);
        } else {
          for (const pre of DEFAULT_PREFIX) {
            this.pluginWithPrefix.set(pre + c, id);
          }
        }
      }
    }
  }

  add_handler(e, h) {
    this.handlers.set(e, h);
  }

  attach(sock) {
    this.sock = sock;

    for (const [event, handler] of this.handlers) {
      sock.ev.on(event, (event) => {
        handler(sock, event);
      });
    }
  }
}


