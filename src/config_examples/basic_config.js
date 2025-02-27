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
 * Basic Config Usage Example
 * 
 * This example demonstrates the fundamental operations of the Config class:
 * - Creating a config
 * - Setting and getting values
 * - Checking for keys
 * - Deleting keys
 * - Saving changes
 */

// Basic usage with required jsonName
const basicConfig = new Config({ jsonName: 'config/basic.config' });
// Creates config/basic.config.json

// Setting and getting values
basicConfig.set('appName', 'Suika');
basicConfig.set('version', '1.0.0');
console.log('App name:', basicConfig.get('appName')); // Suika

// Checking if a key exists
if (basicConfig.has('version')) {
  console.log('Version is configured:', basicConfig.get('version'));
}

// Deleting a key
basicConfig.delete('version');
console.log('Has version after deletion:', basicConfig.has('version')); // false

// Save changes manually
  basicConfig.save(); 