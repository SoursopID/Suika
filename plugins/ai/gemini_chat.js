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

import { Config } from '../../src/config.js';
import { MustAll } from '../../src/plugin.js';
import { gemini } from './gemini.js';

const geminiWatchID = new Config({ jsonName: 'data/gemini_watch_id.json', autosave: true });

/**
 * @param {import('../../src/ctx.js').Ctx} m
 * @param {string} query
 */
async function geminiChat(m, query) {
  if (query.length > 0) {
    const resp = await gemini.send(m.chat, query);
    const sended = await m.reply({ text: resp.response?.text()?.trim() });
    if (sended) {
      if (sended.key?.id) {
        geminiWatchID.set(sended.key?.id, {
          id: m.id,
          chat: m.chat,
          sender: m.sender,
        });

        geminiWatchID.save();
      }
    }
  }
}

/** @type {import('../../src/plugin.js').Plugin} */
export const on = {
  cmds: ['gm', 'gemini'],
  timeout: 15,
  checks: [
    (m) => { return m.fromMe },
  ],

  /** @param {import('../../src/ctx.js').Ctx} m */
  exec: async (m) => {
    let query = m.args;
    if (m.quotedText?.length > 0 && query.length > 0) {
      query += '\n\n' + m.quotedText;
    } else if (query.length == 0 && m.quotedText?.length > 0) {
      query = m.quotedText;
    }

    await geminiChat(m, query);
  }
}

/** @type {import('../../src/plugin.js').Plugin[]} */
export const ons = [
  {
    checkRule: MustAll,
    checks: [
      (m) => { return m.fromMe },
      (m) => { return geminiWatchID.has(m.stanzaId) },
    ],
    exec: async (m) => {
      let query = m.text;

      geminiChat(m, query);
    }
  },
]

