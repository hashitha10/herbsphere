#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const modelsDir = path.resolve(repoRoot, '../public/models');
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');

function fileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(filePath);
    rs.on('data', (d) => hash.update(d));
    rs.on('end', () => resolve(hash.digest('hex')));
    rs.on('error', (e) => reject(e));
  });
}

async function run() {
  if (!fs.existsSync(modelsDir)) {
    console.error('models directory missing:', modelsDir);
    process.exit(1);
  }
  const files = fs.readdirSync(modelsDir).filter((f) => f.toLowerCase().endsWith('.glb') || f.toLowerCase().endsWith('.gltf'));
  const byHash = {};
  for (const f of files) {
    try {
      const p = path.resolve(modelsDir, f);
      const h = await fileHash(p);
      byHash[h] = byHash[h] || [];
      byHash[h].push(f);
    } catch (e) {
      console.error('fail hash for', f, e.message || e);
    }
  }
  const dupGroups = Object.entries(byHash).filter(([h, arr]) => arr.length > 1);
  if (dupGroups.length === 0) {
    console.log('No duplicate model hashes found.');
  } else {
    console.log(`Found ${dupGroups.length} duplicate hash group(s):`);
    dupGroups.forEach(([h, arr]) => {
      console.log('hash', h, '->', arr.join(', '));
    });
  }

  // read mapping
  const mapping = fs.existsSync(mappingPath) ? JSON.parse(fs.readFileSync(mappingPath, 'utf8')) : {};
  const unresolved = [];
  for (const [file, meta] of Object.entries(mapping)) {
    const hasResolved = !!meta.resolved && !!meta.sha256;
    if (!hasResolved) unresolved.push(file);
  }
  if (unresolved.length === 0) {
    console.log('All mapping entries have resolved candidates.');
  } else {
    console.log('Mapping entries missing resolved candidates:', unresolved.join(', '));
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
