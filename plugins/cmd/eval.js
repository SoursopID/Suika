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

import { Plugin } from "../../dist/Plugin.js";

export default new Plugin({
  cmds: ["!"],
  noprefix: true,
  check: (m) => { return m.fromMe },
  exec: (m) => {
    const resp = eval(m.args);
    // console.log(resp);

    m.reply({ text: String(resp), quote: m.msg });
  }
});
