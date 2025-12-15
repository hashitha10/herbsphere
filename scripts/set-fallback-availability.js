import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLANTS } from '../src/data/plants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../src/data/plants.js');

const fallbackUrl = 'https://poly.pizza/m/bfLOqIV5uP';
const fallbackLicense = 'CC0 (Quaternius fallback)';
const unresolvedFiles = [
  'mint.glb', 'lemongrass.glb', 'brahmi.glb', 'lemonbalm.glb', 'gotu-kola.glb', 'thuthuvalai.glb', 'moringa.glb', 'senna.glb', 'amla.glb', 'belladonna.glb', 'nuxvomica.glb', 'chamomile.glb', 'adathoda.glb', 'ashwagandha.glb'
];

const updatedPlants = PLANTS.map(p => {
  if (!p.model) return p;
  const base = p.model.split('/').pop();
  if (unresolvedFiles.includes(base)) {
    return {
      ...p,
      modelSource: fallbackUrl,
      modelLicense: fallbackLicense,
      modelAvailable: true,
    };
  }
  return p;
});

function formatValue(val, indent = 4) {
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(i => formatValue(i, indent + 2));
    return `[\n${' '.repeat(indent + 2)}${items.join(`,\n${' '.repeat(indent + 2)}`)}\n${' '.repeat(indent)}]`;
  }
  if (typeof val === 'object' && val !== null) {
    const entries = Object.entries(val).map(([k, v]) => `\n${' '.repeat(indent + 2)}${k}: ${formatValue(v, indent + 2)}`);
    return `{${entries.join(',')}\n${' '.repeat(indent)}}`; 
  }
  if (typeof val === 'string') return `"${val.replace(/"/g, '\\"')}"`;
  return String(val);
}

function formatPlant(p) {
  const keys = Object.keys(p);
  const lines = keys.map(k => `  ${k}: ${formatValue(p[k], 2)}`);
  return `{\n${lines.join(',\n')}\n}`;
}

const fileContent = `// src/data/plants.js\nexport const PLANTS = [\n${updatedPlants.map(formatPlant).join(',\n\n')}\n];\n`;

// Backup original file
fs.copyFileSync(filePath, `${filePath}.bak`);
fs.writeFileSync(filePath, fileContent);
console.log('Updated plants.js; backups written to plants.js.bak');
