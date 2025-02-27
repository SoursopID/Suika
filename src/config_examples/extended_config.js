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
 * Extended Config Class Example
 * 
 * This example demonstrates how to extend the Config class:
 * - Creating a specialized subclass
 * - Adding custom methods
 * - Using the extended functionality
 */

/**
 * Extends the Config class with premium user management functionality
 */
class PremiumConfig extends Config {
  constructor(options) {
    super(options);
  }
  
  /**
   * Checks if a user has premium status
   * 
   * @param {string} userId - The user ID to check
   * @returns {boolean} - True if the user has an active premium subscription
   */
  isPremium(userId) {
    // Check if user exists in premium config
    if (!this.has(userId)) {
      return false;
    }
    
    const userData = this.get(userId);
    const now = Date.now();
    
    // Check if premium has expired
    if (userData.expiresAt < now) {
      console.log(`Premium expired for user ${userId}`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Extends a user's premium subscription
   * 
   * @param {string} userId - The user ID to extend
   * @param {number} daysToAdd - Number of days to add to the subscription
   * @returns {boolean} - True if extension was successful
   */
  extendPremium(userId, daysToAdd) {
    if (!this.has(userId)) {
      console.log(`User ${userId} doesn't have a premium subscription to extend`);
      return false;
    }
    
    const userData = this.get(userId);
    const currentExpiry = userData.expiresAt;
    const newExpiry = currentExpiry + (daysToAdd * 24 * 60 * 60 * 1000);
    
    userData.expiresAt = newExpiry;
    this.set(userId, userData);
    
    console.log(`Extended premium for ${userId} by ${daysToAdd} days. New expiry: ${new Date(newExpiry).toLocaleDateString()}`);
    return true;
  }
}

// Using the PremiumConfig class
const premiumManager = new PremiumConfig({
  jsonName: 'config/premium_manager',
  autosave: true
});

// Add premium users with expiration dates
premiumManager.set('user789', {
  name: 'Alex Johnson',
  expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
  tier: 'gold'
});

// Now we can use the methods directly
console.log('Is user789 premium?', premiumManager.isPremium('user789')); // true

// Extend the premium subscription
premiumManager.extendPremium('user789', 15); 