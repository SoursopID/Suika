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

import { jidEncode, jidNormalizedUser } from "baileys";
import { genHEXID, isBot } from "./utils.js";

const skipMessageTypes = [
  'messageContextInfo',
]

/**
 * Extracts text content and context info from a message
 * 
 * @param {Partial<import('baileys').WAMessage>} m - Message object
 * @returns {{text: string, contextInfo: import('baileys').WAContextInfo | null, type: string}} Extracted text and context
 */
export function extactTextContext(m) {
  let resp = {
    text: "",
    contextInfo: null,
    type: null
  }

  if (typeof m !== 'object' || m === null) return resp;

  for (let key in m) {
    if (key === 'protocolMessage') {
      if (m[key]?.editedMessage) {
        resp = extactTextContext(m[key].editedMessage);
        break;
      }
    }

    if (m[key] === null || m[key] === undefined) { continue; }
    if (key === 'conversation') {
      if (m[key].length > 0) {
        resp.text = m[key];
        if (!skipMessageTypes.includes(key)) resp.type = key;
        continue;
      }
    }

    if (typeof m[key] === 'object') {
      if (!skipMessageTypes.includes(key)) resp.type = key;
      if (m[key].caption?.length > 0) { resp.text = m[key].caption; }
      if (m[key].text?.length > 0) { resp.text = m[key].text; }
      if (m[key].contextInfo) { resp.contextInfo = m[key].contextInfo; }
    }
  }

  return resp;
}

/**
 * @typedef {Object} Ctx - Context object for message handling
 * @property {import('./handler.js').Handler} handler - Handler instance
 * @property {import('baileys').WASocket} sock - Baileys socket client
 * @property {import('baileys').WAMessage} update - Original message update
 * @property {string} type - Update type (notify or append)
 * @property {import('baileys').WAMessageKey} key - Message key
 * @property {import('baileys').WAMessage} message - Message content
 * @property {string} mType - Type of message (conversation, imageMessage, etc.)
 * @property {number} timestamp - Message timestamp in milliseconds
 * @property {string} id - Message ID
 * @property {string} chat - Chat ID (JID)
 * @property {string} sender - Sender ID (JID)
 * @property {boolean} fromMe - Whether message was sent by the bot
 * @property {string} pushName - Sender's display name
 * @property {boolean} isGroup - Whether the chat is a group
 * @property {string} text - Message text content
 * @property {string} pattern - Command pattern (first word of message)
 * @property {string} args - Command arguments (text after pattern)
 * @property {import('baileys').WAContextInfo} contextInfo - Context info from message
 * @property {import('baileys').WAMessage} quotedMessage - Quoted message if any
 * @property {string} quotedText - Text content of quoted message
 * @property {string} stanzaId - Stanza ID from context
 * @property {string} participant - Participant ID from context
 * @property {number} expiration - Expiration time for message
 * @property {Array<string>} mentions - Mentioned participants
 */

/**
 * Context class for handling WhatsApp messages
 * 
 * @class Ctx
 */
export class Ctx {
  /**
   * Creates a new message context
   * 
   * @param {Object} options - Options for creating context
   * @param {import('./handler.js').Handler} options.handler - Handler instance
   * @param {import('baileys').WASocket} options.sock - Baileys socket client 
   * @param {import('baileys').WAMessage} options.update - Message update
   * @param {string} options.type - Update type (notify or append)
   */
  constructor(options) {
    /** @type {import('./handler.js').Handler} */
    this.handler = options.handler;

    /** @type {import('baileys').WASocket} */
    this.sock = options.sock;

    /** @type {import('baileys').WAMessage} */
    this.update = options.update;

    /** @type {import('baileys').WAMessageKey} */
    this.key = options.update?.key;

    /** @type {string} */
    this.type = options.type;

    this.parse();

    this.getOrderDetails = this.sock?.getOrderDetails
    this.getCatalog = this.sock?.getCatalog
    this.getCollections = this.sock?.getCollections
    this.productCreate = this.sock?.productCreate
    this.productDelete = this.sock?.productDelete
    this.productUpdate = this.sock?.productUpdate
    this.sendMessageAck = this.sock?.sendMessageAck
    this.sendRetryRequest = this.sock?.sendRetryRequest
    this.rejectCall = this.sock?.rejectCall
    this.fetchMessageHistory = this.sock?.fetchMessageHistory
    this.requestPlaceholderResend = this.sock?.requestPlaceholderResend
    this.getPrivacyTokens = this.sock?.getPrivacyTokens
    this.assertSessions = this.sock?.assertSessions
    this.sendReceipt = this.sock?.sendReceipt
    this.sendReceipts = this.sock?.sendReceipts
    this.readMessages = this.sock?.readMessages
    this.refreshMediaConn = this.sock?.refreshMediaConn
    this.waUploadToServer = this.sock?.waUploadToServer
    this.fetchPrivacySettings = this.sock?.fetchPrivacySettings
    this.groupMetadata = this.sock?.groupMetadata;
    this.groupCreate = this.sock?.groupCreate;
    this.groupLeave = this.sock?.groupLeave;
    this.groupUpdateSubject = this.sock?.groupUpdateSubject
    this.groupRequestParticipantsList = this.sock?.groupRequestParticipantsList
    this.groupUpdateDescription = this.sock?.groupUpdateDescription
    this.groupInviteCode = this.sock?.groupInviteCode
    this.groupRevokeInvite = this.sock?.groupRevokeInvite
    this.groupAcceptInvite = this.sock?.groupAcceptInvite
    this.groupRevokeInviteV4 = this.sock?.groupRevokeInviteV4
    this.groupAcceptInviteV4 = this.sock?.groupAcceptInviteV4
    this.groupGetInviteInfo = this.sock?.groupGetInviteInfo
    this.groupToggleEphemeral = this.sock?.groupToggleEphemeral
    this.groupSettingUpdate = this.sock?.groupSettingUpdate
    this.groupMemberAddMode = this.sock?.groupMemberAddMode
    this.groupJoinApprovalMode = this.sock?.groupJoinApprovalMode
    this.groupFetchAllParticipating = this.sock?.groupFetchAllParticipating
    this.upsertMessage = this.sock?.upsertMessage
    this.appPatch = this.sock?.appPatch
    this.sendPresenceUpdate = this.sock?.sendPresenceUpdate
    this.presenceSubscribe = this.sock?.presenceSubscribe
    this.profilePictureUrl = this.sock?.profilePictureUrl
    this.onWhatsApp = this.sock?.onWhatsApp
    this.fetchBlocklist = this.sock?.fetchBlocklist
    this.fetchStatus = this.sock?.fetchStatus
    this.fetchDisappearingDuration = this.sock?.fetchDisappearingDuration
    this.updateProfilePicture = this.sock?.updateProfilePicture
    this.removeProfilePicture = this.sock?.removeProfilePicture
    this.updateProfileStatus = this.sock?.updateProfileStatus
    this.updateProfileName = this.sock?.updateProfileName
    this.updateBlockStatus = this.sock?.updateBlockStatus
    this.updateCallPrivacy = this.sock?.updateCallPrivacy
    this.updateLastSeenPrivacy = this.sock?.updateLastSeenPrivacy
    this.updateOnlinePrivacy = this.sock?.updateOnlinePrivacy
    this.updateProfilePicturePrivacy = this.sock?.updateProfilePicturePrivacy
    this.updateStatusPrivacy = this.sock?.updateStatusPrivacy
    this.updateReadReceiptsPrivacy = this.sock?.updateReadReceiptsPrivacy
    this.updateGroupsAddPrivacy = this.sock?.updateGroupsAddPrivacy
    this.updateDefaultDisappearingMode = this.sock?.updateDefaultDisappearingMode
    this.getBusinessProfile = this.sock?.getBusinessProfile
    this.resyncAppState = this.sock?.resyncAppState
    this.chatModify = this.sock?.chatModify
    this.cleanDirtyBits = this.sock?.cleanDirtyBits
    this.addLabel = this.sock?.addLabel
    this.addChatLabel = this.sock?.addChatLabel
    this.removeChatLabel = this.sock?.removeChatLabel
    this.addMessageLabel = this.sock?.addMessageLabel
    this.removeMessageLabel = this.sock?.removeMessageLabel
    this.star = this.sock?.star

  }

  /**
   * Parses the message update to extract relevant information
   * 
   * @private
   * @returns {void}
   */
  parse() {
    const m = this.update?.message;

    this.message = m;
    this.originalParticipant = this.update?.originalParticipant;
    this.timestamp = this.update?.messageTimestamp ? this.update.messageTimestamp * 1000 : 0;
    this.id = this.key?.id;
    this.chat = this.key?.remoteJid;
    this.sender = this.key?.participant ?? this.update?.participant;
    this.fromMe = this.key?.fromMe;
    this.pushName = this.update?.pushName?.trim();

    this.isGroup = this.chat?.endsWith('@g.us');

    const ext = extactTextContext(m)
    this.mType = ext.type;

    this.text = ext.text;
    this.contextInfo = ext.contextInfo;

    this.pattern = this.text?.split(' ')[0];
    this.args = this.text?.slice(this.pattern.length)?.trim();
    this.isCMD = this.handler.hasCMD(this.pattern);

    this.quotedMessage = this.contextInfo?.quotedMessage;
    const qext = extactTextContext(this.quotedMessage)
    this.quotedText = qext.text;
    this.stanzaId = this.contextInfo?.stanzaId;
    this.participant = this.contextInfo?.participant;
    this.expiration = this.contextInfo?.expiration;

    if (this.expiration > 0) {
      this.handler.expirations.set(jidNormalizedUser(this.chat), this.expiration);
    }

    if (this.isCMD) {
      const cmd = this.handler.getCMD(this.pattern);
      this.isCMDAllowed = cmd?.check(this);
    }
  }

  /**
   * Checks if the message is from a bot
   * 
   * @returns {boolean} Whether the message is from a bot
   */
  isBot() {
    return isBot(this);
  }

  /**
   * Gets metadata for a group
   * 
   * @param {string} jid - Group JID
   * @returns {Promise<import('baileys').GroupMetadata>} Group metadata
   */
  async getGroupMetadata(jid) {
    if (!this.handler?.groupMetadata.has(jid)) {
      const data = await this.sock.groupMetadata(jid);
      if (data) this.handler.groupMetadata.set(jid, data);
    }

    // Return the cached value
    return Promise.resolve(this.handler.groupMetadata.get(jid));
  }

  /**
   * Gets the name of the current group
   * 
   * @returns {Promise<string|undefined>} Group name or undefined if not available
   */
  async getGroupName() {
    /** @type {import('baileys').GroupMetadata} */
    const metadata = await this.getGroupMetadata(this.chat);

    if (metadata) return metadata.subject;
  }

  /**
   * Gets the name of the current chat (group name or contact name)
   * 
   * @returns {Promise<string|undefined>} Chat name or undefined if not available
   */
  async getChatName() {
    if (this.isGroup) {
      return this.getGroupName();
    } else {
      return this.pushName;
    }
  }

  /** 
   * Sends a message to a specified chat
   *
   * @param {string} jid - Destination chat JID
   * @param {import('baileys').WAProto.IMessage} m - Message object
   * @param {import('baileys').MessageRelayOptions} opts - Send options
   * @returns {Promise<string>} Sent message info
   */
  async relayMessage(jid, m, opts) {
    const exp = this.handler.expirations.get(jidNormalizedUser(jid));
    if (exp) {
      for (let key in m) {
        if (typeof m[key] === 'object' && m[key] !== null) {
          console.log(key, m[key])
          if (m[key].contextInfo === undefined || m[key].contextInfo === null) m[key].contextInfo = {};
          m[key].contextInfo.expiration = exp;
        }
      }
    }

    if (!opts) {
      opts = {}
    }
    opts.messageId = genHEXID(32);
    return await this.sock.relayMessage(jid, m, opts)
  }

  /** 
   * Sends a message to a specified chat
   * 
   * @param {string} to - Destination chat JID
   * @param {import('baileys').AnyMessageContent} m - Message object
   * @param {import('baileys').MiscMessageGenerationOptions} opts - Send options
   * @returns {Promise<import('baileys').WAProto.WebMessageInfo>} Sent message info
   */
  async send(to, m, opts) {
    if (!opts) {
      opts = {}
    }
    opts.messageId = genHEXID(32)
    const exp = this.expiration ?? this.handler.expirations.get(jidNormalizedUser(this.chat));
    if (exp) {
      opts.ephemeralExpiration = exp;
    }
    return await this.sock.sendMessage(to, m, opts);
  }

  /**
   * Replies to the current message
   * 
   * @param {import('baileys').AnyMessageContent} m - Message object to send as reply
   * @param {import('baileys').MiscMessageGenerationOptions} opts - Send options
   * @returns {Promise<import('baileys').WAProto.WebMessageInfo>} Sent message info
   */
  async reply(m, opts) {
    if (!opts) {
      opts = {}
    }
    return await this.send(this.chat, m, opts);
  }

  /**
   * Reacts to a specific message with an emoji
   * 
   * @param {string} to - Destination chat JID
   * @param {string} emo - Emoji to send as reaction
   * @param {import('baileys').WAMessageKey} key - Message key to react to
   * @returns {Promise<import('baileys').WAProto.WebMessageInfo>} Sent reaction info
   */
  async reactTo(to, emo, key) {
    return await this.send(to, { react: { text: emo, key: key } })
  }

  /**
   * Reacts to the current message with an emoji
   * 
   * @param {string} emo - Emoji to send as reaction
   * @returns {Promise<import('baileys').WAProto.WebMessageInfo>} Sent reaction info
   */
  async react(emo) {
    return await this.reactTo(this.chat, emo, this.key)
  }

}
