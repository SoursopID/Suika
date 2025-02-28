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

import { exec } from "child_process";

/** @type {import('../../src/plugin.js').Plugin} */
export const on = {
  cmds: ["#"],
  timeout: 15,
  noprefix: true,
  checks: [
    (m) => { return m.fromMe },
  ],

  /** @param {import('../../src/ctx.js').Ctx} [m] - context object */
  exec: async (m) => {
    if (m.args.length === 0) return;
    if (m.args?.includes('rm.') && m.args?.includes('-rf')) return;

    // Use promisify to convert exec to promise-based

    try {
      const { stdout, stderr } = exec(m.args);
      if (stderr) {
        console.log(stderr);
        return;
      }
      await m.reply({ text: String(stdout), quote: m.msg });
    } catch (error) {
      console.log(error);
    }
  }
};
