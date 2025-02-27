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

/**
 * Connection-related event types
 * @type {string}
 */
export const CONNECTION_UPDATE = "connection.update";

/**
 * Credentials update event type
 * @type {string}
 */
export const CREDS_UPDATE = "creds.update";

/**
 * Messaging history set event type
 * @type {string}
 */
export const MESSAGING_HISTORY_SET = "messaging-history.set";

/**
 * All connection-related event types
 * @type {string[]}
 */
export const CONNECTION_EVENTS = [CONNECTION_UPDATE, CREDS_UPDATE, MESSAGING_HISTORY_SET];

// Chat events
/**
 * Chat upsert event type
 * @type {string}
 */
export const CHATS_UPSERT = "chats.upsert";

/**
 * Chat update event type
 * @type {string}
 */
export const CHATS_UPDATE = "chats.update";

/**
 * Chat delete event type
 * @type {string}
 */
export const CHATS_DELETE = "chats.delete";

/**
 * All chat-related event types
 * @type {string[]}
 */
export const CHAT_EVENTS = [CHATS_UPSERT, CHATS_UPDATE, CHATS_DELETE];

// Presence events
/**
 * Presence update event type
 * @type {string}
 */
export const PRESENCE_UPDATE = "presence.update";

/**
 * All presence-related event types
 * @type {string[]}
 */
export const PRESENCE_EVENTS = [PRESENCE_UPDATE];

// Contact events
/**
 * Contact upsert event type
 * @type {string}
 */
export const CONTACTS_UPSERT = "contacts.upsert";

/**
 * Contact update event type
 * @type {string}
 */
export const CONTACTS_UPDATE = "contacts.update";

/**
 * All contact-related event types
 * @type {string[]}
 */
export const CONTACT_EVENTS = [CONTACTS_UPSERT, CONTACTS_UPDATE];

// Message events
/**
 * Message delete event type
 * @type {string}
 */
export const MESSAGES_DELETE = "messages.delete";

/**
 * Message update event type
 * @type {string}
 */
export const MESSAGES_UPDATE = "messages.update";

/**
 * Message upsert event type
 * @type {string}
 */
export const MESSAGES_UPSERT = "messages.upsert";

/**
 * Message reaction event type
 * @type {string}
 */
export const MESSAGES_REACTION = "messages.reaction";

/**
 * Message receipt update event type
 * @type {string}
 */
export const MESSAGE_RECEIPT_UPDATE = "message-receipt.update";

/**
 * All message-related event types
 * @type {string[]}
 */
export const MESSAGE_EVENTS = [MESSAGES_DELETE, MESSAGES_UPDATE, MESSAGES_UPSERT, MESSAGES_REACTION, MESSAGE_RECEIPT_UPDATE];

// Group events
/**
 * Group upsert event type
 * @type {string}
 */
export const GROUPS_UPSERT = "groups.upsert";

/**
 * Group participants update event type
 * @type {string}
 */
export const GROUP_PARTICIPANTS_UPDATE = "group-participants.update";

/**
 * All group-related event types
 * @type {string[]}
 */
export const GROUP_EVENTS = [GROUPS_UPSERT, GROUP_PARTICIPANTS_UPDATE];

// Blocklist events
/**
 * Blocklist set event type
 * @type {string}
 */
export const BLOCKLIST_SET = "blocklist.set";

/**
 * Blocklist update event type
 * @type {string}
 */
export const BLOCKLIST_UPDATE = "blocklist.update";

/**
 * All blocklist-related event types
 * @type {string[]}
 */
export const BLOCKLIST_EVENTS = [BLOCKLIST_SET, BLOCKLIST_UPDATE];

// All events combined 
/**
 * All event types combined
 * @type {string[]}
 */
export const ALL_EVENTS = [
  ...CONNECTION_EVENTS,
  ...CHAT_EVENTS,
  ...PRESENCE_EVENTS,
  ...CONTACT_EVENTS,
  ...MESSAGE_EVENTS,
  ...GROUP_EVENTS,
  ...BLOCKLIST_EVENTS
];
