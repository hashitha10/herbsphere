#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');
const plantsPath = path.resolve(repoRoot, '../src/data/plants.js');

function readMapping() {
  if (!fs.existsSync(mappingPath)) {
    console.error('No mapping found at', mappingPath);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
}

function readPlants() {
  if (!fs.existsSync(plantsPath)) {
    console.error('No plants file found at', plantsPath);
    process.exit(2);
  }
  const txt = fs.readFileSync(plantsPath, 'utf8');
  const start = txt.indexOf('export const PLANTS = [');
  const arrStart = txt.indexOf('[', start);
  const arrEnd = txt.lastIndexOf(']');
  const arrText = txt.slice(arrStart + 1, arrEnd);
  // A lightweight parse: split by '},' sequences on top-level braces
  const objs = [];
  let depth = 0;
  let startIdx = 0;
  for (let i = 0; i < arrText.length; i++) {
    const ch = arrText[i];
    if (ch === '{') {
      if (depth === 0) startIdx = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) objs.push(arrText.slice(startIdx, i + 1));
    }
  }
  const plants = objs.map((o) => {
    const m = o.match(/model\s*:\s*['"](\/models\/[^'"]+)['"]/);
    const id = (o.match(/id\s*:\s*(\d+)/) || [])[1] || null;
    const name = (o.match(/commonName\s*:\s*['"]([^'"]+)['"]/m) || [])[1] || null;
    const model = m ? m[1] : null;
    const modelSource = (o.match(/modelSource\s*:\s*['"]([^'"]+)['"]/m) || [])[1] || null;
    const modelLicense = (o.match(/modelLicense\s*:\s*['"]([^'"]+)['"]/m) || [])[1] || null;
    const modelAvailable = !!o.match(/modelAvailable\s*:\s*true/);
    return { id, name, model, modelSource, modelLicense, modelAvailable };
  });
  return plants;
}

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

function main() {
  const mapping = readMapping();
  const plants = readPlants();
  let errors = 0;
  // Check mapping final entries have resolved and sha256
  for (const [file, meta] of Object.entries(mapping)) {
    if (meta.final) {
      if (!meta.resolved) {
        console.error('Mapping final entry missing resolved:', file);
        errors++;
      }
      if (!meta.sha256) {
        console.error('Mapping final entry missing sha256:', file);
        errors++;
      }
    }
  }
  // Check plants for consistency: plant modelSource/license/available should match mapping finals
  for (const plant of plants) {
    if (!plant.model) continue;
    const file = plant.model.split('/').pop();
    const meta = mapping[file];
    if (!meta) continue;
    if (meta.final) {
      const finalSrc = meta.finalSource || meta.resolved;
      if (!finalSrc) {
        console.error('Mapping final for', file, 'has no finalSource nor resolved');
        errors++;
      } else if (plant.modelSource !== finalSrc && plant.modelSource !== meta.resolved) {
        console.error(`Plant ${plant.name} modelSource mismatch: expected ${finalSrc} got ${plant.modelSource}`);
        errors++;
      }
      const finalLic = meta.finalLicense || meta.license || '';
      if (plant.modelLicense !== finalLic) {
        console.error(`Plant ${plant.name} modelLicense mismatch: expected ${finalLic} got ${plant.modelLicense}`);
        errors++;
      }
      if (!plant.modelAvailable) {
        console.error(`Plant ${plant.name} modelAvailable is not true (expected true)`);
        errors++;
      }
    }
  }
  if (errors > 0) {
    fail(`CI checks failed: ${errors} errors`);
    process.exit(1);
  }
  console.log('CI checks passed. Mapping and plant metadata are consistent.');
}

main();
