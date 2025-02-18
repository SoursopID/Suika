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

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const copyright: string = `/**
 * Copyright (C) 2025 SoursopID
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/
 *
 * This code is part of Suika project
 * (https://github.com/SoursopID/Suika)
 */`;

export function addCopyrightRecursive(dir: string): void {
  readdirSync(dir).forEach((file: string) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      addCopyrightRecursive(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.ts')) {
      let content = readFileSync(fullPath, 'utf8');
      if (!content.includes('Copyright (C) 2025 SoursopID')) {
        content = copyright + '\n\n' + content;
        writeFileSync(fullPath, content);
      }
    }
  });
}
