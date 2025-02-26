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

import { genHEXID } from "./utils.js";

const skipMessageTypes = [
  'messageContextInfo',
]

/**
 * Extracts text content and context info from a message
 * @param {Partial<import('baileys').WAMessage>} m - Message object
 * @returns {{text: string, contextInfo: import('baileys').WAContextInfo | null, type: string}} Extracted text and context
 */
function extactTextContext(m) {
  let resp = {
    text: "",
    contextInfo: null,
    type: null
  }

  if (typeof m !== 'object' || m === null) return resp;

  for (let key in m) {
    if (key === 'protocolMessage') {
      if (m[key]?.editedMessage) {
        resp = extactTextContext(m[key].editedMessage);
        break;
      }
    }

    if (m[key] === null || m[key] === undefined) { continue; }
    if (key === 'conversation') {
      if (m[key].length > 0) {
        resp.text = m[key];
        if (!skipMessageTypes.includes(key)) resp.type = key;
        continue;
      }
    }

    if (typeof m[key] === 'object') {
      if (!skipMessageTypes.includes(key)) resp.type = key;
      if (m[key].caption?.length > 0) { resp.text = m[key].caption; }
      if (m[key].text?.length > 0) { resp.text = m[key].text; }
      if (m[key].contextInfo) { resp.contextInfo = m[key].contextInfo; }
    }
  }

  return resp;
}

/**
 * @typedef {Object} Ctx - Context
 * @property {import('./handler.js').Handler} [handler] - Handler instance
 * @property {import('baileys').WASocket} [sock] - Baileys socket client
 * @property {import('baileys').WAMessage} [update] - Message update
 * @property {string} [type] - Update type
 * @property {import('baileys').WAMessageKey} [key] - Message key
 * @property {import('baileys').WAMessage} [message] - Message
 * @property {string} [messageType] - Message type
 * @property {number} [timestamp] - Message timestamp
 * @property {string} [id] - Message ID
 * @property {string} [chat] - Chat ID
 * @property {string} [sender] - Sender ID
 * @property {boolean} [fromMe] - From me
 * @property {string} [pushName] - Push name
 * @property {string} [text] - Message text
 * @property {string} [pattern] - Command pattern
 * @property {string} [args] - Command arguments
 * @property {import('baileys').WAContextInfo} [contextInfo] - Context info
 * @property {import('baileys').WAMessage} [quotedMessage] - Quoted message
 * @property {string} [quotedText] - Quoted message text
 * @property {string} [stanzaId] - Stanza ID
 * @property {string} [participant] - Participant ID
 * @property {number} [expiration] - Expiration time
 * @property {Array<string>} [mentions] - Mentioned participants
 */
export class Ctx {
  /**
   * @param {Object} options - Options for creating a new Context
   * @param {import('./handler.js').Handler} options.handler - Handler instance
   * @param {import('baileys').WASocket} options.sock - Baileys socket client 
   * @param {import('baileys').WAMessage} options.update - Message update
   * @param {string} options.type - Update type
   */
  constructor(options) {
    /** @type {import('./handler.js').Handler} */
    this.handler = options.handler;

    /** @type {import('baileys').WASocket} */
    this.sock = options.sock;

    /** @type {import('baileys').WAMessage} */
    this.update = options.update;

    /** @type {import('baileys').WAMessageKey} */
    this.key = options.update?.key;

    /** @type {string} */
    this.type = options.type;

    this.parse();
  }

  parse() {
    const m = this.update?.message;

    this.message = m;
    this.timestamp = this.update?.messageTimestamp ? this.update.messageTimestamp * 1000 : 0;
    this.id = this.key?.id;
    this.chat = this.key?.remoteJid;
    this.sender = this.key?.participant ?? this.update?.participant;
    this.fromMe = this.key?.fromMe;
    this.pushName = this.update?.pushName;

    const ext = extactTextContext(m)
    this.messageType = ext.type;

    this.text = ext.text;
    this.contextInfo = ext.contextInfo;

    this.pattern = this.text?.split(' ')[0];
    this.args = this.text?.slice(this.pattern.length)?.trim();

    this.quotedMessage = this.contextInfo?.quotedMessage;
    const qext = extactTextContext(this.quotedMessage)
    this.quotedText = qext.text;
    this.stanzaId = this.contextInfo?.stanzaId;
    this.participant = this.contextInfo?.participant;
    this.expiration = this.contextInfo?.expiration;

    if (this.expiration > 0) {
      this.handler.expirations.set(this.chat, this.expiration);
    }
  }

  /** 
   * Send message to chat
   * @param {string} to - Chat ID
   * @param {Partial<import('baileys').WAMessage>} m - Message object
   * @returns {Promise<import('baileys').WAProto.WebMessageInfo>}
   */
  send(to, m) {
    return this.sock.sendMessage(to, m, { messageId: genHEXID(32) });
  }

  /**
   * Reply to the current message
   * @param {Partial<import('baileys').WAMessage>} m - Message object to send as reply
   * @returns {Promise<import('baileys').WAProto.WebMessageInfo>}
   */
  reply(m) {

    const exp = this.expiration ?? this.handler.expirations.get(this.chat);
    if (exp) {
      if (m.contextInfo === undefined || m.contextInfo === null) m.contextInfo = {};
      m.contextInfo.expiration = exp;
    }

    return this.send(this.chat, m);
  }

  /**
   * React to a message with the given emoji
   * @param {string} to - 
   * @param {string} emo - Emoji to send 
   * @param {import('baileys').WAMessageKey} key - Message key
   */
  reactTo(to, emo, key) {
    return this.send(to, { react: { text: emo, key: key } })
  }

  /**
   * React to the current message with the given emoji
   * @param {string} emo - Emoji to send 
   */
  react(emo) {
    return this.reactTo(this.chat, emo, this.key)
  }



}
