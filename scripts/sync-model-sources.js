#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');
const plantsPath = path.resolve(repoRoot, '../src/data/plants.js');
const outMarkdown = path.resolve(repoRoot, '../public/models/MODEL_SOURCES.md');

function readMapping() {
  if (!fs.existsSync(mappingPath)) {
    console.error('No mapping found at', mappingPath);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
}

function backup(file) {
  const bak = file + '.bak';
  fs.copyFileSync(file, bak);
  console.log('Backed up', file, 'to', bak);
}

// Split array source objects by top-level braces
function splitObjects(arrayText) {
  const objs = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < arrayText.length; i++) {
    const ch = arrayText[i];
    if (ch === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        objs.push(arrayText.slice(start, i + 1));
      }
    }
  }
  return objs;
}

function addOrReplaceProperty(objText, propName, propValue) {
  const regex = new RegExp(`\\n\\s*${propName}\\s*:\\s*[^,\n]+,?`);
  const newLine = `\n    ${propName}: ${JSON.stringify(propValue)},`;
  if (regex.test(objText)) {
    return objText.replace(regex, newLine);
  }
  // insert before last closing brace
  return objText.replace(/}\s*$/, newLine + '\n  }');
}

function updatePlants(mapping) {
  const txt = fs.readFileSync(plantsPath, 'utf8');
  const start = txt.indexOf('export const PLANTS = [');
  if (start === -1) {
    console.error('plants.js parse error');
    process.exit(1);
  }
  const arrStart = txt.indexOf('[', start);
  const arrEnd = txt.lastIndexOf(']');
  const before = txt.slice(0, arrStart + 1);
  const after = txt.slice(arrEnd);
  const arrText = txt.slice(arrStart + 1, arrEnd);
  const objs = splitObjects(arrText);
  const updatedObjs = objs.map((o) => {
    const m = o.match(/model\s*:\s*['\"](\/models\/[^'\"]+)['\"]/);
    if (!m) return o;
    const modelPath = m[1];
    const file = modelPath.split('/').pop();
    const meta = mapping[file];
    if (!meta) return o;
    const src = meta.resolved || meta.finalSource || (Array.isArray(meta.src) ? meta.src[0] : meta.src) || '';
    const lic = meta.finalLicense || meta.license || '';
    const available = !!meta.resolved || !!meta.final;
    const manual = !!meta.manual;
    let n = o;
    n = addOrReplaceProperty(n, 'modelSource', src);
    n = addOrReplaceProperty(n, 'modelLicense', lic);
    n = addOrReplaceProperty(n, 'modelAvailable', available);
    if (manual) n = addOrReplaceProperty(n, 'manual', true);
    return n;
  });
  const newArrayText = '\n  ' + updatedObjs.join(',\n\n  ') + '\n';
  const newTxt = before + newArrayText + after;
  backup(plantsPath);
  fs.writeFileSync(plantsPath, newTxt, 'utf8');
  console.log('Updated plants.js with modelSource/modelLicense from mapping');
}

function writeMd(mapping) {
  const lines = ['# Model Sources', '', 'This file lists models, candidate sources, resolved source (if any), and license.'];
  lines.push('');
  for (const [file, meta] of Object.entries(mapping)) {
    lines.push(`## ${file}`);
    lines.push('');
    lines.push(`- **License:** ${meta.license || 'Unknown'}`);
    const status = meta.resolved ? 'Resolved' : (meta.manual ? 'Manual candidate available' : 'Unresolved (no unique CC0)');
    lines.push(`- **Status:** ${status}`);
    if (meta.resolved) lines.push(`- **Resolved:** ${meta.resolved} (sha256: ${meta.sha256 || 'unknown'})`);
    if (meta.src) {
      const srcs = Array.isArray(meta.src) ? meta.src : [meta.src];
      lines.push('- **Candidates:**');
      for (const s of srcs) lines.push(`  - ${s}`);
    }
    lines.push('');
  }
  fs.writeFileSync(outMarkdown, lines.join('\n'), 'utf8');
  console.log('Wrote MODEL_SOURCES.md to', outMarkdown);
}

function main() {
  const mapping = readMapping();
  updatePlants(mapping);
  writeMd(mapping);
}

main();
