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

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * @typedef {Object} Gemini - Gemini AI model
 * @property {import('@google/generative-ai').GoogleGenerativeAI} [genAI] - Google Generative AI instance
 * @property {import('@google/generative-ai').GenerativeModel} [model] - Generative model instance
 * @property {Map<string,import('@google/generative-ai').ChatSession>} [chats] - Chat sessions map
 */

const DEFAULT_SYSTEM_INSTRUCTION = [
  'Kamu Soursop, suka ngoding. Bicara pake bahasa sehari-hari "lu" "gw"',
  'Sebisa mungkin persingkat kalimat, seperti sendang chat di WhatsApp',
];
/**
 * @class
 */
export class Gemini {

  /**
   * @param {Object} options - Options for the Gemini AI model
   * @param {string} options.apiKey - API key for the Gemini AI model
   * @param {string} options.modelName - Name of the Gemini AI model to use
   * @param {string} options.systemInstruction - System instruction for the Gemini AI model
   * @returns {Gemini}
   */
  constructor(options) {
    this.genAI = new GoogleGenerativeAI(options.apiKey ?? process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: options.modelName ?? 'gemini-2.0-flash',
      systemInstruction: options.systemInstruction ?? DEFAULT_SYSTEM_INSTRUCTION.join(' '),
    });
    this.chats = new Map();
  }

  /**
   * Sends a message to the Gemini AI model
   * @param {string} chatID - chat ID
   * @param {string} message - message to send
   */
  async send(chatID, part) {
    if (!this.chats.has(chatID)) this.chats.set(chatID, this.model.startChat({}));
    const chat = this.chats.get(chatID);

    return await chat.sendMessage(part);
  }
}

/** @type {Gemini} */
export const gemini = new Gemini({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: 'gemini-2.0-flash',
  systemInstruction: DEFAULT_SYSTEM_INSTRUCTION.join(' '),
});
