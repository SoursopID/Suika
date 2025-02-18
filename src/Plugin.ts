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

import { Ctx } from "./Ctx.js";
import { genHEXID } from "./Utils.js";

type CheckRule = string
const MustAll: CheckRule = "all";
const AllowOne: CheckRule = "one";

export interface IPlugin {
  id: string;
  cmds?: string[];
  noprefix?: boolean;
  checkRule?: CheckRule;
  checks?: ((ctx: Ctx) => boolean)[];
  check: (ctx: Ctx) => boolean;
  exec: (ctx: Ctx) => Promise<void> | void;
}

export class Plugin implements IPlugin {
  id: string;
  cmds?: string[];
  noprefix?: boolean;
  checkRule?: CheckRule;
  checks?: ((ctx: Ctx) => boolean)[];
  exec: (ctx: Ctx) => Promise<void> | void;

  constructor(p: IPlugin) {
    this.id = genHEXID(6);
    this.cmds = p.cmds;
    this.noprefix = p.noprefix;
    this.checkRule = p.checkRule ? p.checkRule : MustAll;
    this.checks = p.checks;

    this.exec = p.exec;
  }

  check(ctx: Ctx) {
    if (!this.checks) return true;

    if (this.checkRule === MustAll) {
      return this.checks.every(c => c(ctx));
    } else if (this.checkRule === AllowOne) {
      return this.checks.some(c => c(ctx));
    }

    return false;
  }

}

