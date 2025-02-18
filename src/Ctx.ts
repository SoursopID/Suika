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

import { WASocket, WAMessage, WAContextInfo, WAMessageKey, proto } from 'baileys';
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

  contextInfo?: WAContextInfo;
  quotedMessage?: WAMessage;
  quotedText?: string;
  stanzaId?: string;
  participant?: string;
  expiration: number = 0;

  constructor(hand: Handler, sock: WASocket, u: WAMessage) {
    this.hand = hand;
    this.sock = sock;
    this.update = u;
    this.key = this.update.key;

    this.parse();
  }

  private parse(): void {
    this.message = this.update.message
    this.key = this.update.key;

    this.timestamp = this.update?.messageTimestamp ?? Date.now();
    this.id = this.key?.id ?? '';
    this.chat = this.key?.remoteJid ?? '';
    this.sender = this.key?.participant ?? '';
    this.fromMe = this.key?.fromMe ?? false;
    this.pushName = this.update?.pushName ?? '';

    const ext = extractTextContext(this.message);
    this.text = ext.text;
    this.pattern = this.text?.split(' ')[0];
    this.args = this.text?.slice(this.pattern.length + 1) ?? '';


  }

  reply(m: any): void {
    if (this.expiration) {
      if (!m.contextInfo) m.contextInfo = {};
      m.contextInfo.expiration = this.expiration;
    }
    this.send(this.chat, m);
  }

  send(to: string, m: any): void {
    this.sock.sendMessage(to, m, { messageId: genHEXID(32) });
  }
}
