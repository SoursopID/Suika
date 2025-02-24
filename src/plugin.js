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

import { genHEXID } from './utils.js';

export const MustAll = 'all';
export const AllowOne = 'one';

/**
 * @typedef {Object} Plugin
 * @property {import('baileys').WASocket} [sock] - Baileys socket client
 * @property {import('./handler.js').Handler} [handler] - Plugin handler
 * @property {string} [id] - Unique identifier
 * @property {string} [desc] - Description
 * @property {string} [usage] - Usage instructions
 * @property {string[]} [tags] - Category tags
 * @property {string[]} [cmds] - Command triggers
 * @property {boolean} [disabled] - Whether the plugin is disabled
 * @property {number} [timeout] - Command timeout in ms
 * @property {boolean} [noprefix] - Skip command prefix
 * @property {string} [checkRule] - Check rule (MustAll or AllowOne)
 * @property {Array<Function>} [checks] - Validation functions
 * @property {Function} [check] - Single validation function
 * @property {Function} [exec] - Command execution function
 */
export class Plugin {

  /**
   * Create a new plugin
   * @param {PluginOptions} options - Plugin configuration
   */
  constructor(options) {
    this.sock = options.sock;
    this.handler = options.handler;
    this.id = options.id ?? genHEXID(6);
    this.desc = options.desc;
    this.usage = options.usage;
    this.tags = options.tags || [];
    this.cmds = options.cmds?.map(cmd => cmd.toLowerCase());
    this.disabled = options.disabled || false;
    this.timeout = options.timeout || 0;
    this.noprefix = options.noprefix || false;
    this.checkRule = options.checkRule || MustAll;
    this.checks = options.checks || [];
    this.exec = options.exec;
  }

  /**
   * Check if the plugin is valid
   * @param {import('./ctx.js').Ctx} ctx - Context
   * @returns {boolean}
   */
  check(ctx) {
    if (this.disabled == true) {
      return false;
    }

    if (this.timeout > 0) {
      const diff = now - (ctx.timestamp * 1000);

      if (diff > this.timeout) {
        return false;
      }
    }

    if (this.checks) {
      let checkeds = [];
      for (const check of this.checks) {
        checkeds.push(check(ctx));
      }
      if (this.checkRule === MustAll) {
        return checkeds.every(Boolean);
      } else if (this.checkRule === AllowOne) {
        return checkeds.some(Boolean);
      }
    }

    return true;
  }
}
