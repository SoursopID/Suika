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


export const CONNECTION_UPDATE = "connection.update";
export const CREDS_UPDATE = "creds.update";
export const MESSAGING_HISTORY_SET = "messaging-history.set";
export const CONNECTION_EVENTS = [
  CONNECTION_UPDATE,
  CREDS_UPDATE,
  MESSAGING_HISTORY_SET
];

// Chat events
export const CHATS_UPSERT = "chats.upsert";
export const CHATS_UPDATE = "chats.update";
export const CHATS_DELETE = "chats.delete";
export const CHAT_EVENTS = [
  CHATS_UPSERT,
  CHATS_UPDATE,
  CHATS_DELETE
];

// Presence events
export const PRESENCE_UPDATE = "presence.update";
export const PRESENCE_EVENTS = [
  PRESENCE_UPDATE
];

// Contact events
export const CONTACTS_UPSERT = "contacts.upsert";
export const CONTACTS_UPDATE = "contacts.update";
export const CONTACT_EVENTS = [
  CONTACTS_UPSERT,
  CONTACTS_UPDATE
];

// Message events
export const MESSAGES_DELETE = "messages.delete";
export const MESSAGES_UPDATE = "messages.update";
export const MESSAGES_UPSERT = "messages.upsert";
export const MESSAGES_REACTION = "messages.reaction";
export const MESSAGE_RECEIPT_UPDATE = "message-receipt.update";
export const MESSAGE_EVENTS = [
  MESSAGES_DELETE,
  MESSAGES_UPDATE,
  MESSAGES_UPSERT,
  MESSAGES_REACTION,
  MESSAGE_RECEIPT_UPDATE
];

// Group events
export const GROUPS_UPSERT = "groups.upsert";
export const GROUP_PARTICIPANTS_UPDATE = "group-participants.update";
export const GROUP_EVENTS = [
  GROUPS_UPSERT,
  GROUP_PARTICIPANTS_UPDATE
];

// Blocklist events
export const BLOCKLIST_SET = "blocklist.set";
export const BLOCKLIST_UPDATE = "blocklist.update";
export const BLOCKLIST_EVENTS = [
  BLOCKLIST_SET,
  BLOCKLIST_UPDATE
];

// All events combined 
export const ALL_EVENTS = [
  ...CONNECTION_EVENTS,
  ...CHAT_EVENTS,
  ...PRESENCE_EVENTS,
  ...CONTACT_EVENTS,
  ...MESSAGE_EVENTS,
  ...GROUP_EVENTS,
  ...BLOCKLIST_EVENTS
];
