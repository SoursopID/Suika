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

export function genHEXID(len) {
  const hex = '0123456789abcdef';
  let res = '';
  for (let i = 0; i < len; i++) {
    res += hex[Math.floor(Math.random() * hex.length)];
  }
  return res.toUpperCase();
}