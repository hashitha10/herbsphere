import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unresolved = [
  'mint.glb', 'lemongrass.glb', 'brahmi.glb', 'lemonbalm.glb', 'gotu-kola.glb', 'thuthuvalai.glb', 'moringa.glb', 'senna.glb', 'amla.glb', 'belladonna.glb', 'nuxvomica.glb', 'chamomile.glb', 'adathoda.glb', 'ashwagandha.glb'
];

const modelsDir = path.resolve(__dirname, '../public/models');
const backupDir = path.join(modelsDir, 'backups');
const fallback = path.join(modelsDir, 'lemonbalm.glb');

if (!fs.existsSync(fallback)) {
  console.error('Fallback model not found:', fallback);
  process.exit(1);
}

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

unresolved.forEach(file => {
  const src = path.join(modelsDir, file);
  if (!fs.existsSync(src)) {
    console.warn('Skipping missing file:', src);
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `${file}.${timestamp}.bak`);
  fs.copyFileSync(src, backupPath);
  fs.copyFileSync(fallback, src);
  console.log(`Replaced ${file} with fallback; backed up to ${backupPath}`);
});

console.log('Done.');
