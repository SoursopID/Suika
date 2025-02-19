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

import { WASocket, WAMessage, WAContextInfo, WAMessageKey, proto, MiscMessageGenerationOptions } from 'baileys';
import { Handler } from './Handler.js';
import { genHEXID, extractTextContext } from './Utils.js';

export class Ctx {
  hand: Handler;
  sock: WASocket;
  update: WAMessage;
  key: WAMessageKey;
  message?: (proto.IMessage | null);
  timestamp?: (number | Long.Long) = Date.now();
  id: string = '';
  chat: string = '';
  sender: string = '';
  fromMe: boolean = false;
  pushName: string = '';

  text: string = '';
  pattern: string = '';
  args: string = '';

  contextInfo?: (WAContextInfo | null);
  quotedMessage?: (proto.IMessage | null);
  quotedText?: (string | null);
  stanzaId?: (string | null);
  participant?: (string | null);
  expiration: number = 0;
  mentions?: (string[] | null);

  constructor(hand: Handler, sock: WASocket, u: WAMessage) {
    this.hand = hand;
    this.sock = sock;
    this.update = u;
    this.key = this.update.key;

    this.parse();
  }

  private async parse(): Promise<void> {
    this.message = this.update.message
    this.key = this.update.key;

    this.timestamp = this.update?.messageTimestamp ?? Date.now();
    this.id = this.key?.id ?? '';
    this.chat = this.key?.remoteJid ?? '';
    this.sender = this.key?.participant ?? '';
    this.fromMe = this.key?.fromMe ?? false;
    this.pushName = this.update?.pushName ?? '';

    let ext = extractTextContext(this.message);
    if (this.message?.protocolMessage?.editedMessage) {
      ext = extractTextContext(this.message.protocolMessage.editedMessage);
    }

    this.text = ext.text;
    this.pattern = this.text?.split(' ')[0];
    this.args = this.text?.slice(this.pattern.length + 1) ?? '';

    this.contextInfo = ext.contextInfo;
    this.quotedMessage = ext.contextInfo?.quotedMessage;

    const qext = extractTextContext(this.quotedMessage);
    this.quotedText = qext.text;
    this.stanzaId = this.contextInfo?.stanzaId;
    this.participant = this.contextInfo?.participant;
    this.expiration = this.contextInfo?.expiration ?? 0;
    this.mentions = this.contextInfo?.mentionedJid ?? [];


  }

  async reply(m: any, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined> {
    if (this.expiration) {
      if (!m.contextInfo) m.contextInfo = {};
      m.contextInfo.expiration = this.expiration;
    }

    return this.send(this.chat, m, options);
  }

  async send(to: string, m: any, options?: MiscMessageGenerationOptions): Promise<proto.WebMessageInfo | undefined> {
    if (!options) options = {};
    options.messageId = await genHEXID(32);

    return this.sock.sendMessage(to, m, options);
  }
}
