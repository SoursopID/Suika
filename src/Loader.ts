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

import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { handler } from './Handler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadPluginsFromDir(dirPath: string, relativePath: string = ''): Promise<void> {
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      await loadPluginsFromDir(fullPath, join(relativePath, item));
    } else if (item.endsWith('.js')) {
      try {
        const importPath = join('..', 'plugins', relativePath, item);
        const { default: pluginFunction } = await import(importPath);
        if (typeof pluginFunction === 'object') {
          handler.add(pluginFunction);
        }
      } catch (error) {
        console.error(`Failed to load plugin ${join(relativePath, item)}:`, error);
      }
    }
  }
}

export async function loadPlugins(dirname: string): Promise<void> {
  const pluginsFolder = join(__dirname, dirname);
  console.log(`Loading plugins from: ${pluginsFolder}`);
  await loadPluginsFromDir(pluginsFolder);
}
