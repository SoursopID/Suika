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

import { BaileysEventMap } from "baileys/lib/index.js";


export const CONNECTION_UPDATE: keyof BaileysEventMap = "connection.update";
export const CREDS_UPDATE: keyof BaileysEventMap = "creds.update";
export const MESSAGING_HISTORY_SET: keyof BaileysEventMap = "messaging-history.set";
export const CONNECTION_EVENTS: (keyof BaileysEventMap)[] = [CONNECTION_UPDATE, CREDS_UPDATE, MESSAGING_HISTORY_SET];

// Chat events
export const CHATS_UPSERT: keyof BaileysEventMap = "chats.upsert";
export const CHATS_UPDATE: keyof BaileysEventMap = "chats.update";
export const CHATS_DELETE: keyof BaileysEventMap = "chats.delete";
export const CHAT_EVENTS: (keyof BaileysEventMap)[] = [CHATS_UPSERT, CHATS_UPDATE, CHATS_DELETE];

// Presence events
export const PRESENCE_UPDATE: keyof BaileysEventMap = "presence.update";
export const PRESENCE_EVENTS: (keyof BaileysEventMap)[] = [PRESENCE_UPDATE];

// Contact events
export const CONTACTS_UPSERT: keyof BaileysEventMap = "contacts.upsert";
export const CONTACTS_UPDATE: keyof BaileysEventMap = "contacts.update";
export const CONTACT_EVENTS: (keyof BaileysEventMap)[] = [CONTACTS_UPSERT, CONTACTS_UPDATE];

// Message events
export const MESSAGES_DELETE: keyof BaileysEventMap = "messages.delete";
export const MESSAGES_UPDATE: keyof BaileysEventMap = "messages.update";
export const MESSAGES_UPSERT: keyof BaileysEventMap = "messages.upsert";
export const MESSAGES_REACTION: keyof BaileysEventMap = "messages.reaction";
export const MESSAGE_RECEIPT_UPDATE: keyof BaileysEventMap = "message-receipt.update";
export const MESSAGE_EVENTS: (keyof BaileysEventMap)[] = [MESSAGES_DELETE, MESSAGES_UPDATE, MESSAGES_UPSERT, MESSAGES_REACTION, MESSAGE_RECEIPT_UPDATE];

// Group events
export const GROUPS_UPSERT: keyof BaileysEventMap = "groups.upsert";
export const GROUP_PARTICIPANTS_UPDATE: keyof BaileysEventMap = "group-participants.update";
export const GROUP_EVENTS: (keyof BaileysEventMap)[] = [GROUPS_UPSERT, GROUP_PARTICIPANTS_UPDATE];

// Blocklist events
export const BLOCKLIST_SET: keyof BaileysEventMap = "blocklist.set";
export const BLOCKLIST_UPDATE: keyof BaileysEventMap = "blocklist.update";
export const BLOCKLIST_EVENTS: (keyof BaileysEventMap)[] = [BLOCKLIST_SET, BLOCKLIST_UPDATE];

// All events combined 
export const ALL_EVENTS: (keyof BaileysEventMap)[] = [
  ...CONNECTION_EVENTS,
  ...CHAT_EVENTS,
  ...PRESENCE_EVENTS,
  ...CONTACT_EVENTS,
  ...MESSAGE_EVENTS,
  ...GROUP_EVENTS,
  ...BLOCKLIST_EVENTS
];
