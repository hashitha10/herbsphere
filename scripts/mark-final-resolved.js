#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mappingPath = path.resolve(__dirname, '../public/models/model-sources.json');
const modelsDir = path.resolve(__dirname, '../public/models');

function fileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(filePath);
    rs.on('data', (d) => hash.update(d));
    rs.on('end', () => resolve(hash.digest('hex')));
    rs.on('error', (e) => reject(e));
  });
}

async function main() {
  if (!fs.existsSync(mappingPath)) {
    console.error('mapping not found:', mappingPath);
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  let changed = false;
  for (const [file, meta] of Object.entries(mapping)) {
    if (!meta.final) continue;
    const modelPath = path.resolve(modelsDir, file);
    if (!fs.existsSync(modelPath)) {
      console.warn('model file missing:', file);
      continue;
    }
    try {
      const h = await fileHash(modelPath);
      if (meta.sha256 !== h || meta.resolved !== meta.finalSource) {
        meta.sha256 = h;
        meta.resolved = meta.finalSource || (Array.isArray(meta.src) ? meta.src[0] : meta.src);
        changed = true;
        console.log('Marked resolved for', file);
      }
    } catch (e) {
      console.error('hash failed for', file, e.message || e);
    }
  }
  if (changed) {
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log('Updated mapping with resolved sha256/resolved fields.');
  } else {
    console.log('No changes required.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
