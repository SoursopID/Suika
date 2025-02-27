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

/**
 * @typedef {string} CheckRule
 */

/** @type {CheckRule} */
export const MustAll = 'all';

/** @type {CheckRule} */
export const AllowOne = 'one';

/**
 * @typedef {Object} Plugin - Plugin configuration
 * @property {import('baileys').WASocket} sock - Baileys socket client
 * @property {import('./handler.js').Handler} handler - Plugin handler
 * @property {string} id - Unique identifier (auto-generated if not provided)
 * @property {string} desc - Plugin description
 * @property {string} usage - Usage instructions
 * @property {string[]} tags - Category tags (defaults to [])
 * @property {string[]} cmds - Command triggers (converted to lowercase)
 * @property {boolean} disabled - Whether plugin is disabled (defaults to false)
 * @property {number} timeout - Command timeout in ms (defaults to 0)
 * @property {boolean} noprefix - Skip command prefix (defaults to false)
 * @property {CheckRule} checkRule - Check rule type (defaults to MustAll)
 * @property {Array<(ctx: import('./ctx.js').Ctx) => boolean>} checks - Validation functions
 * @property {(ctx: import('./ctx.js').Ctx) => void} exec - Command execution function
 */

/** 
 * Plugin that can listen or execute commands
 * @class 
 */
export class Plugin {

  /**
   * Create a new plugin
   * @param {Plugin} options - Plugin configuration
   */
  constructor(options) {
    /** @type {import('baileys').WASocket} */
    this.sock = options.sock;

    /** @type {import('./handler.js').Handler} */
    this.handler = options.handler;

    /** @type {string} */
    this.id = options.id ?? genHEXID(6);

    /** @type {string} */
    this.desc = options.desc;

    /** @type {string} */
    this.usage = options.usage;

    /** @type {string[]} */
    this.tags = options.tags ?? [];

    /** @type {string[]} */
    this.cmds = options.cmds?.map(cmd => cmd.toLowerCase());

    /** @type {boolean} */
    this.disabled = options.disabled ?? false;

    /** @type {number} */
    this.timeout = options.timeout ?? 0;

    /** @type {boolean} */
    this.noprefix = options.noprefix ?? false;

    /** @type {CheckRule} */
    this.checkRule = options.checkRule ?? MustAll;

    /** @type {Array<Function>} */
    this.checks = options.checks ?? [];

    /** @type {Function} */
    this.exec = options.exec;
  }

  /**
   * Check if the plugin can execute for given context
   * @param {import('./ctx.js').Ctx} ctx - Message context
   * @returns {Promise<boolean>} True if all checks pass according to checkRule
   */
  async check(ctx) {
    if (this.disabled == true) {
      return false;
    }

    if (this.timeout > 0) {
      const diff = new Date().getTime() - ctx.timestamp;
      if (diff > this.timeout) {
        return false;
      }
    }

    if (this.checks) {
      let checkeds = [];
      for (const check of this.checks) {
        checkeds.push(await check(ctx));
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
