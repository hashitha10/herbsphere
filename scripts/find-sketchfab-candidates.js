#!/usr/bin/env node

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'node-fetch' } }, (res) => {
      let data = '';
      res.on('data', (c) => data += c.toString());
      res.on('end', () => resolve({ ok: true, status: res.statusCode, body: data, url }));
      res.on('error', (e) => reject(e));
    }).on('error', (e) => reject(e));
  });
}

function parseSketchfabSearch(html) {
  // Look for /3d-model/slug-<id> links
  const matches = [...html.matchAll(/href=\"(\/3d-model\/[^"]+)\"/g)];
  return [...new Set(matches.map(m => 'https://sketchfab.com' + m[1]))];
}

function parseSketchfabLicense(html) {
  // Try to detect CC BY text
  const m = html.match(/Creative Commons(?: Attribution)?\s*\(?CC-BY\)?/i) || html.match(/CC BY/i) || html.match(/License:\s*([^<]+)/i);
  return m ? m[0] : null;
}

async function run() {
  if (!fs.existsSync(mappingPath)) {
    console.error('mapping not found at', mappingPath);
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const unresolved = Object.entries(mapping).filter(([f,m]) => !m.resolved || !m.sha256).map(([f]) => f);
  if (unresolved.length === 0) {
    console.log('No unresolved entries to search.');
    return;
  }
  const added = {};
  for (const file of unresolved) {
    const key = file.replace(/\.glb$|\.gltf$/i, '');
    const queries = [key, `${key} plant`, `${key} herb`];
    for (const q of queries) {
      const url = `https://sketchfab.com/search?q=${encodeURIComponent(q)}&downloadable=1`;
      try {
        const res = await fetch(url);
        if (res.status >= 400) continue;
        const pages = parseSketchfabSearch(res.body);
        for (const p of pages) {
          try {
            const page = await fetch(p);
            const lic = parseSketchfabLicense(page.body);
            // Accept CC BY or explicit Creative Commons Attribution
            if (lic && /CC/i.test(lic)) {
              // Append model page as candidate (manual download required)
              const meta = mapping[file];
              if (!Array.isArray(meta.src)) meta.src = [meta.src];
              if (!meta.src.includes(p)) {
                meta.src.push(p);
                meta.license = 'CC BY (Sketchfab candidate)';
                meta.note = (meta.note || '') + ` Added Sketchfab CC BY candidate: ${p}`;
                added[file] = added[file] || [];
                added[file].push(p);
                console.log('Added Sketchfab candidate for', file, p);
              }
            }
          } catch (e) { continue; }
        }
      } catch (e) { continue; }
    }
  }
  if (Object.keys(added).length) {
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log('Appended Sketchfab candidates for', Object.keys(added).length, 'files');
  } else {
    console.log('No Sketchfab CC BY candidates found');
  }
}

run().catch(e => { console.error(e); process.exit(1); });
