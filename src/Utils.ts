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

import { WAContextInfo } from "baileys/lib/index.js";
import { proto } from "baileys/WAProto/index.js";

export function genHEXID(len: number): string {
  return Array.from(
    { length: len }, 
    () => Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase();
}

export function extractTextContext(m?: (proto.IMessage|null)): { text: string; contextInfo?: (WAContextInfo|null) } {
  let resp = {
    text: "",
    contextInfo: null
  };

  if (!m) return resp;

  const o: any = Object(m) 
  for (let key in o) {
    if (o[key] === null || o[key] === undefined) continue;
    
    if (key === 'conversation') {
      if (o[key].length > 0) {
        resp.text = o[key];
        continue;
      }
    }

    if (typeof o[key] === 'object') {
      if (o[key].caption?.length > 0) resp.text = o[key].caption;
      if (o[key].text?.length > 0) resp.text = o[key].text;
      if (o[key].contextInfo) resp.contextInfo = o[key].contextInfo;
    }
  }

  return resp;
}
