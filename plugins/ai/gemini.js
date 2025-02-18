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

import { AllowOne, Plugin } from "../../dist/Plugin.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const MODEL_NAME = 'gemini-2.0-flash';
const model = genAI.getGenerativeModel({ model: MODEL_NAME });
const chat = model.startChat({});

export let replyIDs = new Map();

export const geminiAsk = async (m, query) => {
  if (query?.length > 0) {
    const resp = await chat.sendMessage(query)
    if (resp?.response?.text) {
      const re = await m.reply({ text: resp.response.text() });
      if (re) replyIDs.set(re.key?.id, m.chat);
    } else {
      console.log(resp);
    }
  }

}

export default new Plugin({
  name: "gemini",
  cmds: ["gm"],
  checkRule: AllowOne,
  checks: [
    (m) => { return m.fromMe },
  ],
  exec: async (m) => {
    let query = m.args;
    if (m.quotedText?.length > 0) query = m.quotedText;
    await geminiAsk(m, query);
  }
})
