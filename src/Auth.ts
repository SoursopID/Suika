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

import fs from 'fs';

export class Auth {
  filename: string;
  data: Map<string, any>;

  constructor(fname: string) {
    this.filename = fname;
    this.data = new Map();

  }

  async load(fname: string) {
    try {
      const data = JSON.parse(fs.readFileSync(fname, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        this.data.set(key, value);
      }
    } catch (e) {
      console.log(e);
      await this.save()
    }
  }

  async save() {
    const data = Object.fromEntries(this.data);
    fs.writeFileSync(this.filename, JSON.stringify(data));
  }

  async get(key: string) {
    return this.data.get(key);
  }

  async set(key: string, value: any) {
    this.data.set(key, value);
    this.save();
  }

  async delete(key: string) {
    this.data.delete(key);
    this.save();
  }

  async has(key: string) {
    return this.data.has(key);
  }

}
