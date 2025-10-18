#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourcePath = resolve(__dirname, '../dist/vanilla-i18n-attr.js');
const targetPath = resolve(__dirname, '../dist/vanilla-i18n-attr.min.js');

(async () => {
  try {
    const source = await readFile(sourcePath, 'utf8');
    const banner = '/*! vanilla-i18n-attr v0.1.0 (manual build copy) */';
    await writeFile(targetPath, `${banner}\n${source}`);
    console.log('vanilla-i18n-attr: dist/vanilla-i18n-attr.min.js updated.');
  } catch (error) {
    console.error('Failed to build minified output:', error);
    process.exitCode = 1;
  }
})();
