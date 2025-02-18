import { readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadPluginsFromDir(dirPath, relativePath = '') {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Recursively load plugins from subdirectory
            await loadPluginsFromDir(fullPath, join(relativePath, item));
        } else if (item.endsWith('.js')) {
            try {
                const importPath = join('..', 'plugins', relativePath, item);
                const { default: pluginFunction } = await import(importPath);
                if (typeof pluginFunction === 'function') {
                    handler.listen(pluginFunction);
                }
                // console.log(`Loaded plugin: ${join(relativePath, item)}`);
            } catch (error) {
                console.error(`Failed to load plugin ${join(relativePath, item)}:`, error);
            }
        }
    }
}

export async function loadPlugins(dirname) {
    const pluginsFolder = join(__dirname, dirname);
    console.log(`Loading plugins from: ${pluginsFolder}`);
    await loadPluginsFromDir(pluginsFolder);
}

