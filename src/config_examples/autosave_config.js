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
 * Autosave Configuration Example
 * 
 * This example demonstrates how to use the autosave feature:
 * - Creating a config with autosave enabled
 * - Setting values that are automatically saved
 */

// Configuration with autosave enabled
const appConfig = new Config({
  jsonName: 'config/app.config',
  autosave: true
});

// Changes will be saved automatically
appConfig.set('apiEndpoint', 'https://api.example.com');
appConfig.set('maxRetries', 3);
appConfig.set('timeout', 30000);

console.log('Configuration saved automatically'); 