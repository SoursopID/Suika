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
 * Premium User Management Example
 * 
 * This example demonstrates how to use the Config class for premium user management:
 * - Creating a premium user config
 * - Adding premium users with expiration dates
 * - Checking premium status
 */

// Simple approach using standalone functions
const premiumConfig = new Config({
  jsonName: 'config/premium_users',
  autosave: true
});

// Add premium users with expiration dates
premiumConfig.set('user123', {
  name: 'John Doe',
  expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
  tier: 'gold'
});

premiumConfig.set('user456', {
  name: 'Jane Smith',
  expiresAt: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days from now
  tier: 'platinum'
});

/**
 * Checks if a user has premium status
 * 
 * @param {string} userId - The user ID to check
 * @returns {boolean} - True if the user has an active premium subscription
 */
function isPremium(userId) {
  // Check if user exists in premium config
  if (!premiumConfig.has(userId)) {
    return false;
  }
  
  const userData = premiumConfig.get(userId);
  const now = Date.now();
  
  // Check if premium has expired
  if (userData.expiresAt < now) {
    console.log(`Premium expired for user ${userId}`);
    return false;
  }
  
  return true;
}

// Example usage
console.log('Is user123 premium?', isPremium('user123')); // true 