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

/** @type {import('../../src/plugin.js').Plugin} */
export const on = {
  cmds: [">"],
  timeout: 15,
  noprefix: true,
  checks: [
    (m) => { return m.fromMe },
  ],

  /** @param {import('../../src/ctx.js').Ctx} [m] - context object */
  exec: (m) => {
    const resp = eval(m.args);

    m.reply({ text: String(resp), quote: m.msg });
  }
};
