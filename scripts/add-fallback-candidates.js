#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');

const herbFallback = 'https://poly.pizza/m/bfLOqIV5uP'; // generic houseplant (Quaternius)
const treeFallback = 'https://poly.pizza/m/etFGNvsiFv'; // trees collection (Quaternius)

function isTree(name) {
  const trees = ['amla', 'moringa'];
  return trees.includes(name);
}

function basenameToKey(file) {
  return path.basename(file).replace(/\.glb$|\.gltf$/i, '').toLowerCase();
}

function load() {
  if (!fs.existsSync(mappingPath)) {
    console.error('mapping not found at', mappingPath);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
}

function save(mapping) {
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
}

function addFallbacks() {
  const mapping = load();
  let changed = false;
  for (const [file, meta] of Object.entries(mapping)) {
    const key = basenameToKey(file);
    const hasResolved = !!meta.resolved && !!meta.sha256;
    if (hasResolved) continue;
    const candidates = Array.isArray(meta.src) ? meta.src : [meta.src];
    // if fallback already present, skip
    if (candidates.includes(herbFallback) || candidates.includes(treeFallback)) continue;
    const fallback = isTree(key) ? treeFallback : herbFallback;
    // append fallback as last candidate
    if (!Array.isArray(meta.src)) meta.src = [meta.src];
    meta.src.push(fallback);
    meta.note = (meta.note || '') + ` Added fallback candidate: ${fallback}`;
    console.log('Added fallback for', file, '->', fallback);
    changed = true;
  }
  if (changed) save(mapping);
  else console.log('No changes made (fallbacks already present or all resolved).');
}

addFallbacks();
