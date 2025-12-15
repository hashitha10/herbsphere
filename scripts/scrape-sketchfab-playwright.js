#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');

import { PLANTS } from '../src/data/plants.js';

async function run() {
  if (!fs.existsSync(mappingPath)) {
    console.error('mapping not found:', mappingPath);
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const unresolved = Object.entries(mapping).filter(([f,m]) => !m.resolved || !m.sha256).map(([f]) => f);
  if (unresolved.length === 0) {
    console.log('No unresolved entries');
    return;
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const added = {};
  for (const file of unresolved) {
    const key = file.replace(/\.glb$|\.gltf$/i, '');
    // find the plant entry by model path
    const modelPath = '/models/' + file;
    const plant = PLANTS.find(p => p.model === modelPath || p.model?.endsWith('/' + file));
    const common = plant?.commonName || key;
    const scientific = plant?.scientificName || '';
    const alt = (scientific ? [scientific] : []).concat([common]);
    const queries = [...alt, `${key} plant`, `${common} plant`, `${scientific} plant`].filter(Boolean);
    let found = 0;
    for (const q of queries) {
      const searchUrl = `https://sketchfab.com/search?q=${encodeURIComponent(q)}&downloadable=1`;
      try {
        await page.goto(searchUrl, { waitUntil: 'networkidle' });
        // wait for search results container, try multiple selectors
        try { await page.waitForSelector('a[href*="/3d-model/"]', { timeout: 4000 }); } catch (e) {}
        const links = await page.$$eval('a[href*="/3d-model/"]', (els) => els.map(e => e.href));
        const unique = [...new Set(links)].slice(0, 12);
        console.log('    Debug: found', unique.length, 'model links on', searchUrl);
        for (const p of unique) {
          try {
            await page.goto(p, { waitUntil: 'networkidle' });
            // look for license text
            const licenseText = await page.$$eval('a, span, p, div', els => els.map(e => e.innerText).join('\n'));
            if (/Creative Commons|CC BY/i.test(licenseText)) {
              const meta = mapping[file];
              if (!Array.isArray(meta.src)) meta.src = [meta.src];
              if (!meta.src.includes(p)) {
                meta.src.push(p);
                meta.license = 'CC BY (Sketchfab candidate)';
                meta.manual = true;
                meta.note = (meta.note || '') + ` Added Sketchfab CC BY candidate: ${p}`;
                added[file] = added[file] || [];
                added[file].push(p);
                console.log('Added', p, 'for', file);
                found++;
              }
            }
            if (found >= 2) break;
          } catch (e) { continue; }
        }
      } catch (e) { continue; }
      if (found >= 2) break;
    }
    if (!added[file]) console.log('No Sketchfab CC BY candidates found for', file);
  }
  await browser.close();
  if (Object.keys(added).length) {
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log('Saved updated mapping with Sketchfab candidates for', Object.keys(added).length);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
