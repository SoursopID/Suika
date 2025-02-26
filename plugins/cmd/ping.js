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

import { formatElapse } from "../../src/utils.js";

/** @type {import('../../src/plugin.js').Plugin} */
export const on = {
  cmds: ["ping", "p"],
  timeout: 120,
  checks: [
    (m) => { return m.fromMe; }
  ],

  /** @param {import('../../src/ctx.js').Ctx} [m] - context object */
  exec: (m) => {
    const start = Date.now();
    const est = Math.floor(start - m.timestamp);
    m.reply({ text: formatElapse(est) });
  }
};
