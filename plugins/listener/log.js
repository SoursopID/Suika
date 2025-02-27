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


import { AllowOne } from "../../src/plugin.js";
import { formatElapse, shortTo } from "../../src/utils.js";

/** @type {import('../../src/plugin.js').Plugin} */
export const on = {
  checkRule: AllowOne,
  checks: [
    (m) => { return m !== undefined },
  ],

  /** @param {import('../../src/ctx.js').Ctx} [m] - context object */
  exec: async (m) => {
    let logs = [m.timestamp, m.type];

    let elapse = 0;
    if (m.timestamp) {
      elapse = Date.now() - m.timestamp;
    }
    logs.push(formatElapse(elapse))

    if (m.messageType) logs.push(m.messageType);

    logs.push(m.quotedMessage ? `${shortTo(m.id, 8)} => ${shortTo(m.stanzaId, 8)}` : shortTo(m.id, 8));

    let sender = m.pushName ?? m.sender;
    logs.push(sender);

    let snippet = "";
    if (m.args) {
      m.args?.split(' ')?.forEach(arg => {
        if (snippet.length > 30) return false;
        snippet += arg + " ";

      })
    };
    snippet = snippet.replaceAll("\n", " ");

    const chat = await m.getChatName() ?? m.chat;

    logs.push("on", chat, m.pattern, snippet);

    console.log(...logs);
  }
};

export const after = on;
