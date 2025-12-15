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

function parseFree3dSearch(html) {
  const matches = [...html.matchAll(/href=\"(\/3d-model\/[^"]+)\"/g)];
  return [...new Set(matches.map(m => 'https://free3d.com' + m[1]))];
}

function parseFree3dPageForGlb(html) {
  const matches = [...html.matchAll(/https?:\/\/(?:[\w\-\.]+)\/[^\s"']+\.glb/gi)];
  return [...new Set(matches.map(m => m[0]))];
}

function parseLicense(html, site) {
  const cc0 = /CC0|Public Domain/i;
  const ccby = /CC\s*BY|Creative Commons Attribution|Attribution/i;
  if (cc0.test(html)) return 'CC0';
  if (ccby.test(html)) return 'CC BY';
  // site-specific fallback
  if (site.includes('cgtrader') && /Royalty Free/i.test(html)) return 'Royalty Free';
  return null;
}

async function searchFree3D(query) {
  const url = `https://free3d.com/search/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res || !res.body) return [];
    const pages = parseFree3dSearch(res.body);
    const results = [];
    for (const p of pages.slice(0, 8)) {
      try {
        const page = await fetch(p);
        const lic = parseLicense(page.body, 'free3d');
        const glb = parseFree3dPageForGlb(page.body)[0] || null;
        results.push({ page: p, glb, license: lic });
      } catch (e) { continue; }
    }
    return results;
  } catch (e) { return []; }
}

function parseCgtraderSearch(html) {
  const matches = [...html.matchAll(/href=\"(\/3d-models\/[^"]+)\"/g)];
  return [...new Set(matches.map(m => 'https://www.cgtrader.com' + m[1]))];
}

async function searchCgtrader(query) {
  const url = `https://www.cgtrader.com/3d-models?keywords=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res || !res.body) return [];
    const pages = parseCgtraderSearch(res.body);
    const results = [];
    for (const p of pages.slice(0, 8)) {
      try {
        const page = await fetch(p);
        const lic = parseLicense(page.body, 'cgtrader');
        // cgtrader may not provide direct glb; store page link
        results.push({ page: p, glb: null, license: lic });
      } catch (e) { continue; }
    }
    return results;
  } catch (e) { return []; }
}

function parseTurboSquidSearch(html) {
  const matches = [...html.matchAll(/href=\"(\/3d-models\/[^"]+)\"/g)];
  return [...new Set(matches.map(m => 'https://www.turbosquid.com' + m[1]))];
}

async function searchTurboSquid(query) {
  const url = `https://www.turbosquid.com/Search/3D-Models?keyword=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res || !res.body) return [];
    const pages = parseTurboSquidSearch(res.body);
    const results = [];
    for (const p of pages.slice(0, 8)) {
      try {
        const page = await fetch(p);
        const lic = parseLicense(page.body, 'turbosquid');
        results.push({ page: p, glb: null, license: lic });
      } catch (e) { continue; }
    }
    return results;
  } catch (e) { return []; }
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
      console.log('Searching Free3D for', q);
      const f3 = await searchFree3D(q);
      for (const f of f3) {
        if (!f.page) continue;
        const license = f.license || 'Unknown';
        if (license === 'CC0' || (f.glb && license === 'CC0')) {
          if (!Array.from(candidates).includes(f.glb || f.page)) candidates.add(f.glb || f.page);
        } else if (license === 'CC BY') {
          if (!Array.from(candidates).includes(f.page)) candidates.add(f.page);
        }
      }
      console.log('Searching CGTrader for', q);
      const cg = await searchCgtrader(q);
      for (const r of cg) {
        if (!r.page) continue;
        if (!Array.from(candidates).includes(r.page)) candidates.add(r.page);
      }
      console.log('Searching TurboSquid for', q);
      const ts = await searchTurboSquid(q);
      for (const r of ts) {
        if (!r.page) continue;
        if (!Array.from(candidates).includes(r.page)) candidates.add(r.page);
      }
      if (candidates.size >= 6) break;
    }
    const existing = Array.isArray(mapping[file].src) ? mapping[file].src : [mapping[file].src];
    const newCandidates = [...candidates].filter(c => !existing.includes(c)).slice(0, 4);
    if (newCandidates.length) {
      mapping[file].src = existing.concat(newCandidates);
      mapping[file].note = (mapping[file].note || '') + ` Added marketplace candidates: ${newCandidates.join(', ')}`;
      console.log('Added marketplace candidates for', file, newCandidates.join(', '));
    } else {
      console.log('No new marketplace candidates for', file);
    }
  }
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log('Updated mapping:', mappingPath);
}

run().catch(e => { console.error(e); process.exit(1); });
