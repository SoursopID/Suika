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

/**
 * Generate a random hex string
 * @param {number} len - Length of the hex string
 * @returns {string}
 */
export function genHEXID(len) {
  const hex = '0123456789abcdef';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += hex[Math.floor(Math.random() * hex.length)];
  }
  return res.toUpperCase();
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/** 
  * Format elapse time to string
  * @param {number} i - Elapse time in milliseconds
  * @returns {string} Elapse time in string format
  */
export function formatElapse(elapse) {
  let est = `${elapse}ms`;
  if (elapse >= HOUR) {
    est = `${Math.floor(elapse / HOUR)}h ${Math.floor((elapse % HOUR) / MINUTE)}m ${Math.floor((elapse % MINUTE) / SECOND)}s`;
  } else if (elapse >= MINUTE) {
    est = `${Math.floor(elapse / MINUTE)}m ${Math.floor((elapse % MINUTE) / SECOND)}s`;
  } else if (elapse >= SECOND) {
    est = `${Math.floor(elapse / SECOND)}s`;
  }
  return est
}

/**
  * Shorten string to specified length to hide middle part
  * @param {string} str - String to be shortened
  * @param {number} len - Length to be shortened to
  * @returns {string} Shortened string
  */
export function shortTo(str, len) {
  if (!str) return '';
  if (str.length > len) {
    return str.slice(0, Math.floor(len / 2)) + '..' + str.slice(-Math.floor(len / 2));
  } else {
    return str;
  }
}


const urlRegex = /(https?:\/\/[^\s]+)/g;
/**
 * Extract URLs from text
 * @param {string} text - Text to extract URLs from
 * @returns {string[]} Array of URLs
 */
export async function extractURLs(text) {
  return text.match(urlRegex) | [];
}
