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
 * @typedef {Object} ConfigOptions
 * @property {string} jsonName - The required name of the JSON file to use for storage.
 * @property {boolean} [autosave=false] - If true, the config will be saved automatically when changed.
 */

/**
 * @typedef {Object} Config
 * @property {string} jsonName - The name of the JSON file.
 * @property {Object} data - The data stored in the config.
 * @property {boolean} autosave - If true, the config will be saved automatically when changed.
 * @property {boolean} dirty - Indicates whether the config has unsaved changes.
 */

/**
 * The Config class provides a simple interface for loading, modifying, and saving
 * configuration data to and from JSON files.
 * 
 * @class Config
 */
export class Config {
  /**
   * Creates a new Config instance.
   * 
   * @param {ConfigOptions} options - Configuration options
   * @param {string} options.jsonName - Required name of the JSON file to use
   * @param {boolean} [options.autosave=false] - Whether to automatically save changes
   */
  constructor(options) {
    if (!options || !options.jsonName) {
      throw new Error('Config requires a jsonName parameter');
    }

    /**
     * The name of the JSON file where config data is stored
     * @type {string} 
     */
    this.jsonName = options.jsonName;
    
    // Ensure the jsonName has the proper extension
    if (!this.jsonName.endsWith('.json')) {
      this.jsonName += '.json';
    }
    
    // If the path includes directories, ensure they exist
    const dir = this.jsonName.substring(0, this.jsonName.lastIndexOf('/'));
    if (dir && dir !== '' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    /** 
     * The configuration data object
     * @type {Object.<string, any>} 
     */
    this.data = {};

    /** 
     * Whether to automatically save after changes
     * @type {boolean} 
     */
    this.autosave = options.autosave ?? false;

    /** 
     * Whether the config has unsaved changes
     * @type {boolean} 
     */
    this.dirty = false;

    this.load(this.jsonName);
  }

  /**
   * Loads configuration data from a JSON file.
   * 
   * @param {string} [filename] - The filename to load from. Defaults to this.jsonName if not provided.
   * @returns {boolean} - True if loading was successful, false otherwise.
   */
  load(filename) {
    if (!filename) filename = this.jsonName;
    try {
      // Use a direct object instead of Map for better performance
      this.data = JSON.parse(fs.readFileSync(filename, 'utf8'));
      return true;
    } catch (e) {
      // Only log if it's not a file not found error
      if (e.code !== 'ENOENT') {
        console.log(e);
      }
      return false;
    }
  }

  /**
   * Saves the current configuration data to a JSON file.
   * 
   * @param {string} [filename] - The filename to save to. Defaults to this.jsonName if not provided.
   * @returns {boolean} - True if saving was successful, false otherwise.
   */
  save(filename) {
    if (!filename) filename = this.jsonName;
    if (!this.dirty && filename === this.jsonName) return true;
    
    try {
      fs.writeFileSync(filename, JSON.stringify(this.data, null, 2));
      this.dirty = false;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /** 
   * Gets a value from the config by key.
   * 
   * @param {string} key - The key to retrieve the value for
   * @returns {any} - The value associated with the key, or undefined if the key doesn't exist
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Sets a value in the config for the specified key.
   * If autosave is enabled, the config will be saved after setting the value.
   * 
   * @param {string} key - The key to set
   * @param {any} value - The value to associate with the key
   * @returns {void}
   */
  set(key, value) {
    this.data[key] = value;
    this.dirty = true;
    if (this.autosave) this.save();
  }

  /**
   * Deletes a key-value pair from the config.
   * If autosave is enabled, the config will be saved after deletion.
   * 
   * @param {string} key - The key to delete
   * @returns {void}
   */
  delete(key) {
    delete this.data[key];
    this.dirty = true;
    if (this.autosave) this.save();
  }

  /**
   * Checks if a key exists in the config.
   * 
   * @param {string} key - The key to check
   * @returns {boolean} - True if the key exists, false otherwise
   */
  has(key) {
    return key in this.data;
  }

  /**
   * Clears all data from the config.
   * If autosave is enabled, the empty config will be saved.
   * 
   * @returns {void}
   */
  clear() {
    this.data = {};
    this.dirty = true;
    if (this.autosave) this.save();
  }
}
