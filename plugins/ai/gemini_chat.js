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
import { crc32s, genHEXID } from '../../src/utils.js';
import { gemini } from './gemini.js';
import { downloadContentFromMessage } from 'baileys';
import fs from 'fs';

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

  const parts = [];


  if (query.length > 0) {
    parts.push(query);
  }

  const attchs = [m.message, m.quotedMessage];

  const tempPath = './temp';
  try {
    fs.access(tempPath);
  } catch (e) {
    console.log('Created temp directory')
    fs.mkdir(tempPath, (err) => { });
  }

  for (const mm of attchs) {
    if (!mm) continue;
    const ext = extactTextContext(mm)
    if (!ext) continue;
    if (!attacements.includes(ext.type)) continue;

    let attType = "unknown";
    let unique = m.timestamp;
    let mimetype = "unknown";

    switch (ext.type) {
      case "audioMessage":
        attType = "audio";
        unique = crc32s(mm?.audioMessage?.fileSha256.toString());
        mimetype = mm?.audioMessage?.mimetype;
        break;
      case "imageMessage":
        attType = "image";
        unique = crc32s(mm?.imageMessage?.fileSha256.toString());
        mimetype = mm?.imageMessage?.mimetype;
        break;
      case "videoMessage":
        attType = "video";
        unique = crc32s(mm?.videoMessage?.fileSha256.toString());
        mimetype = mm?.videoMessage?.mimetype;
        break;
      case "documentMessage":
        attType = "document";
        unique = crc32s(mm?.documentMessage?.fileSha256.toString());
        mimetype = mm?.documentMessage?.mimetype;
        break;
      case "stickerMessage":
        attType = "sticker";
        unique = mm?.stickerMessage?.fileSha256.toString();
        mimetype = mm?.stickerMessage?.mimetype;
        break;
    }

    const tempFilename = `${tempPath}/${attType}-${unique}.bin`;
    const stream = await downloadContentFromMessage(mm, ext.type);
    const saved = fs.createWriteStream(tempFilename);

    process.stdin.pipe(stream).pipe(saved);

    saved.on('finish', async () => {
      const respUp = await gemini.uploadFile(tempFilename, {
        mimeType: mimetype,
        displayName: `${attType}-${unique}`,
      });

      parts.push(respUp);
    })
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

