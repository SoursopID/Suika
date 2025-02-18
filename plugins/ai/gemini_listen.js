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

import { MustAll, Plugin } from "../../dist/Plugin.js";
import { geminiAsk, replyIDs } from "./gemini.js";

export default new Plugin({
  tags: ["gemini"],
  checkRule: MustAll,
  checks: [
    (m) => { return replyIDs.has(m.stanzaId) },
  ],
  exec: async (m) => {
    let query = m.text;

    await geminiAsk(m, query);
  }
})
