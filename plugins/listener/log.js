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
import * as pen from "./pen.js";
import * as emo from "../../src/emoji.js"

/** @type {import('../../src/plugin.js').Plugin} */
export const on = {
  checkRule: AllowOne,
  checks: [
    (m) => { return m !== undefined },
  ],

  /** @param {import('../../src/ctx.js').Ctx} [m] - context object */
  exec: async (m) => {
    const time = new Date(m.timestamp).toLocaleTimeString('id-ID', { hour12: false });
    let logs = [
      pen.red(time),
      m.type,
      m.fromMe ? emo.BustInSilhouette : emo.BustsInSilhouette,
    ];

    let elapse = 0;
    if (m.timestamp) {
      elapse = Date.now() - m.timestamp;
    }
    logs.push(formatElapse(elapse))

    if (m.messageType) logs.push(pen.green(m.messageType));

    logs.push(m.quotedMessage ? `${shortTo(m.id, 8)} ${pen.yellow('=>')} ${shortTo(m.stanzaId, 8)
      }` : shortTo(m.id, 8));

    let sender = m.pushName ?? m.sender;
    logs.push(pen.magenta(sender));

    const chat = await m.getChatName() ?? m.chat;

    logs.push("on", pen.cyan(chat));
    if (m.isCMD) {
      if (m.isCMDAllowed) {
        logs.push(pen.blue(m.pattern));
      } else {
        logs.push(pen.yellow(m.pattern));
      }
    } else {
      logs.push(m.pattern);
    }

    let snippet = "";
    if (m.args) {
      m.args?.split(' ')?.forEach(arg => {
        if (snippet.length > 30) return false;
        snippet += arg + " ";
      })
    };
    snippet = snippet.replaceAll("\n", " ");

    logs.push(snippet);

    console.log(...logs);
  }
};

export const after = on;
