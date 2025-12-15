#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mappingPath = path.resolve(__dirname, '../public/models/model-sources.json');

function usage() {
  console.log('Usage: node add-manual-candidate.js <modelFilename> <modelPageUrl>');
  process.exit(1);
}

if (process.argv.length < 4) usage();
const file = process.argv[2];
const url = process.argv[3];

if (!fs.existsSync(mappingPath)) {
  console.error('mapping not found at', mappingPath);
  process.exit(1);
}
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
if (!mapping[file]) {
  console.error('model file not found in mapping:', file);
  process.exit(1);
}
const meta = mapping[file];
if (!Array.isArray(meta.src)) meta.src = [meta.src];
if (meta.src.includes(url)) {
  console.log('url already present in candidates');
  process.exit(0);
}
meta.src.push(url);
meta.license = 'CC BY (Sketchfab candidate)';
meta.manual = true;
meta.note = (meta.note || '') + ` Manually added Sketchfab CC BY candidate: ${url}`;
fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
console.log('Added candidate to', mappingPath);
