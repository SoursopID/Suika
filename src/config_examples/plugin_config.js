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

import { Config } from '../config.js';

/**
 * Plugin Configuration Example
 * 
 * This example demonstrates how to use the Config class for plugin settings:
 * - Creating a plugin-specific config
 * - Setting plugin options
 * - Clearing plugin settings
 */

// Plugin-specific configuration
const geminiConfig = new Config({
  jsonName: 'config/plugins/gemini',  // Will become config/plugins/gemini.json
  autosave: true
});

// Set plugin configuration values
geminiConfig.set('enabled', true);
geminiConfig.set('options', {
  debug: false,
  logLevel: 'info',
  maxTokens: 1000
});

console.log('Plugin configuration saved');

// To clear all plugin settings:
// geminiConfig.clear(); 