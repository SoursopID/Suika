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

import { Handler } from "./handler.js";
import { MESSAGES_UPSERT } from "./event.js";
import { Ctx } from "./ctx.js";

export const handler = new Handler();
handler.add_handler(MESSAGES_UPSERT, async (sock, upsert) => {
    try {
        if (!upsert?.messages) return;
        for (const message of upsert.messages) {

            const ctx = new Ctx(sock, message);
            // looping through listeners
            for (const [id, listener] of handler.listeners) {
                if (listener.check(ctx)) {
                    try {
                        listener.exec(ctx);
                    } catch (error) {
                        console.error(`Error executing listener ${id}:`, error);
                    }
                }
            }

            // looping through plugins with prefix
            if (handler.pluginWithPrefix.has(ctx.pattern)) {
                const id = handler.pluginWithPrefix.get(ctx.pattern);
                const plugin = handler.plugins.get(id);
                if (plugin.check(ctx)) {
                    try {
                        plugin.exec(ctx);
                    } catch (error) {
                        console.error(`Error executing plugin ${id}:`, error);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error handling message:', err);
        console.log('Message:', JSON.stringify(upsert));
    }
});