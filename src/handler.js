import { Ctx } from "./ctx.js";

export const DEFAULT_PREFIX = "/.";

export function genHEXID(len) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
}

export class Handler {
  constructor() {
    this.listeners = new Map();
    this.plugins = new Map();
    this.pluginWithPrefix = new Map();

    this.connection_update
  }

  add(p) {
    const id = genHEXID(6);
    if (!p.cmds) {
      this.listeners.set(genHEXID(6), p);
    } else {
      this.plugins.set(id, p);
      for (let c of p.cmds) {
        c = c.toLowerCase();
        if (p.noprefix) {
          this.pluginWithPrefix.set(c, id);
        } else {
          for (const pre of DEFAULT_PREFIX) {
            this.pluginWithPrefix.set(pre + c, id);
          }
        }
      }
    }
  }

  handle(sock, msg) {
    try {
      const ctx = new Ctx(sock, msg);
      // looping through listeners
      for (const [id, listener] of this.listeners) {
        if (listener.check(ctx)) {
          try {
            listener.exec(ctx);
          } catch (error) {
            console.error(`Error executing listener ${id}:`, error);
          }
        }
      }

      // looping through plugins with prefix
      if (this.pluginWithPrefix.has(ctx.pattern)) {
        const id = this.pluginWithPrefix.get(ctx.pattern);
        const plugin = this.plugins.get(id);
        if (plugin.check(ctx)) {
          try {
            plugin.exec(ctx);
          } catch (error) {
            console.error(`Error executing plugin ${id}:`, error);
          }
        }
      }
    } catch (err) {
      console.error('Error handling message:', err);
      console.log('Message:', JSON.stringify(msg));
    }
  }

  countListeners() {
    return this.listeners.size;
  }

  countPlugins() {
    return this.plugins.size;
  }

  countPluginWithPrefix() {
    return this.pluginWithPrefix.size;
  }
}

