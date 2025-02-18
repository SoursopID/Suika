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
import { handler } from "../../dist/Handler.js";

handler.add(new Plugin({
  check: (m) => { return m !== undefined },
  exec: (m) => {

    let snippet = "";
    if (m.args) {
      m.args?.forEach(arg => {
        if (snippet.length > 30) return false;
        snippet += arg + " ";

      })
    };

    snippet = snippet.replaceAll("\n", " ");

    console.log(
      m.timestamp,
      m.id,
      m.pushName, "on", m.key?.remoteJid,
      m.pattern, snippet);
  }
}));
