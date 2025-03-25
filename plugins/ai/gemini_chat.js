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
import { extactTextContext } from '../../src/ctx.js';
import { MustAll } from '../../src/plugin.js';
import { crc32s } from '../../src/utils.js';
import { gemini } from './gemini.js';
import { downloadMediaMessage } from 'baileys';

const geminiWatchID = new Config({ jsonName: 'data/gemini_watch_id.json', autosave: true });

const attacements = [
  'audioMessage',
  'imageMessage',
  'videoMessage',
  'documentMessage',
  'stickerMessage',
];

/**
 * @param {import('../../src/ctx.js').Ctx} m
 * @param {string} query
 */
async function geminiChat(m, query) {

  /** @type {import('@google/generative-ai').Part[]} */
  const parts = [];


  if (query.length > 0) {
    parts.push(query);
  }

  const attchs = [m.message, m.quotedMessage];

  for (const mm of attchs) {
    if (!mm) continue;
    const ext = extactTextContext(mm)
    if (!ext) continue;
    if (!attacements.includes(ext.type)) continue;

    let attType = "unknown";
    let unique = m.timestamp;
    let mimetype = "unknown";
    let content = null;

    switch (ext.type) {
      case "audioMessage":
        attType = "audio";
        content = mm.audioMessage;
        mimetype = mm.audioMessage.mimetype;
        break;
      case "imageMessage":
        attType = "image";
        content = mm.imageMessage;
        mimetype = mm.imageMessage.mimetype;
        break;
      case "videoMessage":
        attType = "video";
        content = mm.videoMessage;
        mimetype = mm.videoMessage.mimetype;
        break;
      case "documentMessage":
        attType = "document";
        content = mm.documentMessage;
        mimetype = mm.documentMessage.mimetype;
        break;
      case "stickerMessage":
        attType = "sticker";
        content = mm.stickerMessage;
        mimetype = mm.stickerMessage.mimetype;
        break;
    }

    unique = content ? crc32s(content.fileSha256.toString(16)) : unique;

    const buff = await downloadMediaMessage({ message: mm }, "buffer", {});
    console.log(mimetype, buff);
    if (!buff) {
      continue;
    }
    parts.push({
      inlineData: {
        data: Buffer.from(buff).toString('base64'),
        mimeType: mimetype,
      }
    });

  }

  if (parts.length > 0) {
    const resp = await gemini.send(m.chat, parts);
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
  cmds: ['gm', 'gemini', 'sgm'],
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

