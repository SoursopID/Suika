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
 * User Settings Example
 * 
 * This example demonstrates how to use the Config class for user settings:
 * - Creating a user settings config
 * - Setting user preferences
 * - Retrieving user preferences
 * - Creating backups
 */

// User settings configuration
const userConfig = new Config({ 
  jsonName: 'user_settings',  // Will become user_settings.json
});

// Setting user preferences
userConfig.set('username', 'JohnDoe');
userConfig.set('theme', 'dark');
userConfig.set('notifications', {
  email: true,
  push: false,
  desktop: true
});

// Getting user preferences
console.log('Username:', userConfig.get('username')); // JohnDoe
console.log('Theme:', userConfig.get('theme')); // dark
console.log('Email notifications:', userConfig.get('notifications').email); // true

// Save to a different file (backup)
userConfig.save('user_settings_backup.json'); 