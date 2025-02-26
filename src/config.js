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

/**
 * @typedef {Object} Config
 * @property {string} jsonName - The name of the JSON file.
 * @property {Map<string, any>} data - The data of the config.
 * @property {boolean} autosave - If true, the config will be saved automatically when changed.
 */

/**
 * The config class.
 * @class 
 */
export class Config {
  /**
   * 
   * @param {Object} options 
   * @param {string} options.jsonName
   * @param {string} options.unique
   * @param {boolean} options.autosave
   */
  constructor(options) {
    /** @type {string} */
    this.jsonName = options?.jsonName ?? `json_${options?.unique}.json`;

    /** @type {Map<string, any>} */
    this.data = new Map();

    /** @type {boolean} */
    this.autosave = options?.autosave ?? false;

    this.load(this.jsonName);
  }

  /**
   * Load the config from a JSON file.
   * @async
   * @param {string} filename 
   */
  async load(filename) {
    if (!filename) filename = this.jsonName;
    try {
      const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
      for (const [key, value] of Object.entries(data)) {
        this.data.set(key, value);
      }

      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  /**
   * Save the config to a JSON file.
   * @async
   * @param {string} filename 
   */
  async save(filename) {
    if (!filename) filename = this.jsonName;
    try {
      fs.writeFileSync(filename, JSON.stringify(Object.fromEntries(this.data), null, 2));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }

  }

  /** 
   * Get a value from the config.
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
    return this.data.get(key);
  }

  /**
   * Set a value to the config.
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value) {
    this.data.set(key, value);
    if (this.autosave) this.save();
  }

  /**
   * Delete a value from the config.
   * @param {string} key 
   */
  delete(key) {
    this.data.delete(key);
    if (this.autosave) this.save();
  }

  /**
   * Check if a key exists in the config.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.data.has(key);
  }

  /**
   * Clear the config.
   */
  clear() {
    this.data.clear();
    if (this.autosave) this.save();
  }

}
