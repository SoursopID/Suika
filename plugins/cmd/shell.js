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
import util from "util";

const filters = [
  /* hide ip */
  (s) => s.replace(/(\d{1,3})\.\d{1,3}\.\d{1,3}\.\d{1,3}/, "*.*.*.*"),
]

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
    const execPromise = util.promisify(exec);

    try {
      const { stdout, stderr } = await execPromise(m.args);
      if (stderr) {
        console.log(stderr);
        return;
      }

      let rest = String(stdout);
      for (const filter of filters) {
        rest = filter(rest);
      }

      await m.reply({ text: rest, quote: m.msg });
    } catch (error) {
      console.log(error);
    }
  }
};
