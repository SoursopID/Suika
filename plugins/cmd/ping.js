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

import { AllowOne } from "../../dist/Plugin.js";

export default {
  cmds: ["ping", "p"],
  checkRule: AllowOne,
  checks: [
    (m) => { return m.fromMe },
  ],
  exec: (m) => {
    const start = Date.now();
    const est = Math.floor(start - m.timestamp * 1000);
    m.reply({ text: `${est}ms` });
  }
};
