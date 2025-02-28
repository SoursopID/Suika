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
 * Generate a random hexadecimal string of specified length
 * 
 * @param {number} len - Length of the desired hex string
 * @returns {string} Uppercase hexadecimal string
 */
export function genHEXID(len) {
  const hex = '0123456789abcdef';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += hex[Math.floor(Math.random() * hex.length)];
  }
  return res.toUpperCase();
}

/** 
 * Number of milliseconds in a second
 * @type {number}
 */
const SECOND = 1000;

/** 
 * Number of milliseconds in a minute
 * @type {number}
 */
const MINUTE = 60 * SECOND;

/** 
 * Number of milliseconds in an hour
 * @type {number}
 */
const HOUR = 60 * MINUTE;

/** 
 * Format elapsed time into human readable string
 * 
 * @param {number} elapse - Time in milliseconds
 * @returns {string} Formatted string (e.g. "5h 30m 20s", "45m 30s", "30s", "100ms")
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
 * Shorten a string by replacing middle characters with ".."
 * 
 * @param {string} str - Input string
 * @param {number} len - Desired total length
 * @returns {string} Shortened string or empty string if input is falsy
 * @example
 * shortTo("abcdefghijk", 5) // returns "ab..k"
 */
export function shortTo(str, len) {
  if (!str) return '';
  if (str.length > len) {
    return str.slice(0, Math.floor(len / 2)) + '..' + str.slice(-Math.floor(len / 2));
  } else {
    return str;
  }
}

/** 
 * Regular expression for matching URLs in text
 * @type {RegExp}
 */
const urlRegex = /(https?:\/\/[^\s]+)/g;

/**
 * Extract URLs from text content
 * 
 * @param {string} text - Text to search for URLs
 * @returns {Promise<string[]>} Array of found URLs, or empty array if none found
 */
export function extractURLs(text) {
  return text.match(urlRegex) ?? [];
}


const makeCRCTable = () => {
  let c;
  let crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  return crcTable;
}

/**
 * Calc CRC32 from of string
 *
 * @param {string} str - Input string
 * @returns {string} CRC32 value
 */
export function crc32s(str) {
  const crcTable = makeCRCTable()
  let crc = 0 ^ (-1);

  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
  }

  const dec = (crc ^ (-1)) >>> 0;
  return dec.toString('16').toUpperCase();
};
