#!/usr/bin/env node

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mappingPath = path.resolve(__dirname, '../public/models/model-sources.json');

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

function parseBlendswapSearch(html) {
  const matches = [...html.matchAll(/href=\"(\/3D-models\/[^"]+)\"/g)];
  return [...new Set(matches.map(m => 'https://www.blendswap.com' + m[1]))];
}

function parseBlendswapForGlb(html) {
  const matches = [...html.matchAll(/https?:\/\/(?:[\w\-\.]+)\/(?:[\w\-]+)\.glb/gi)];
  return [...new Set(matches.map(m => m[0]))];
}

function parseKenney(html) {
  const matches = [...html.matchAll(/https?:\/\/kenney\.nl\/[\w\-\/]+\.zip/gi)];
  return [...new Set(matches.map(m => m[0]))];
}

function parseQuaterniusHtmlForGlb(html) {
  const matches = [...html.matchAll(/https:\/\/static\.poly\.pizza\/[\w\-]+\.glb/gi)];
  return [...new Set(matches.map(m => m[0]))];
}

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
  for (const file of unresolved) {
    const key = file.replace(/\.glb$|\.gltf$/i, '');
    const candidates = new Set(Array.isArray(mapping[file].src) ? mapping[file].src : [mapping[file].src]);
    const queries = [key, `${key} plant`, `${key} herb`, `${key} tree`];
    for (const q of queries) {
      // Blendswap search
      const blendswapUrl = `https://www.blendswap.com/search/keywords/${encodeURIComponent(q)}`;
      try {
        const res = await fetch(blendswapUrl);
        if (res?.body) {
          const pages = parseBlendswapSearch(res.body);
          for (const p of pages.slice(0, 4)) {
            try {
              const page = await fetch(p);
              const glbs = parseBlendswapForGlb(page.body);
              glbs.forEach(g => candidates.add(g));
            } catch (e) { continue; }
          }
        }
      } catch (e) {}
      // Kenney packs
      const kenneyUrl = `https://kenney.nl/search?query=${encodeURIComponent(q)}`;
      try {
        const res = await fetch(kenneyUrl);
        if (res?.body) {
          const zips = parseKenney(res.body);
          zips.forEach(z => candidates.add(z));
        }
      } catch (e) {}
      // Quaternius via poly.pizza again (in case we missed glb links)
      const polySearch = `https://poly.pizza/search?q=${encodeURIComponent(q)}`;
      try {
        const res2 = await fetch(polySearch);
        if (res2?.body) {
          const matches = [...res2.body.matchAll(/href=\"(\/m\/[\w\-]+)\"/g)];
          for (const m of matches.slice(0, 6)) {
            try {
              const modelUrl = 'https://poly.pizza' + m[1];
              const page = await fetch(modelUrl);
              const glbs = parseQuaterniusHtmlForGlb(page.body);
              glbs.forEach(g => candidates.add(g));
            } catch (e) { continue; }
          }
        }
      } catch (e) {}
      if (candidates.size >= 6) break;
    }
    const existing = Array.isArray(mapping[file].src) ? mapping[file].src : [mapping[file].src];
    const newCandidates = [...candidates].filter(c => !existing.includes(c)).slice(0, 4);
    if (newCandidates.length) {
      mapping[file].src = existing.concat(newCandidates);
      mapping[file].note = (mapping[file].note || '') + ` Added blendswap/quaternius/kenney candidates: ${newCandidates.join(', ')}`;
      console.log('Added candidates for', file, newCandidates.join(', '));
    } else {
      console.log('No new candidates for', file);
    }
  }
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log('Updated mapping:', mappingPath);
}

run().catch(e => { console.error(e); process.exit(1); });
