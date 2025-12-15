#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname);
const mappingPath = path.resolve(repoRoot, '../public/models/model-sources.json');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk.toString());
      res.on('end', () => resolve({ ok: true, status: res.statusCode, body: data, url }));
      res.on('error', (e) => reject(e));
    }).on('error', (e) => reject(e));
  });
}

function parsePolySearch(html) {
  // Return model page paths like /m/<id>
  const matches = [...html.matchAll(/href=\"(\/m\/[\w\-]+)\"/g)];
  return [...new Set(matches.map(m => 'https://poly.pizza' + m[1]))];
}

function parsePolyModelForGlb(html) {
  // look for https://static.poly.pizza/*.glb links
  const matches = [...html.matchAll(/https:\/\/static\.poly\.pizza\/[\w\-]+\.glb/gi)];
  return [...new Set(matches.map(m => m[0]))];
}

function parseOgaSearchForPages(html) {
  const matches = [...html.matchAll(/href=\"(\/content\/[\w\-]+)\"/g)];
  return [...new Set(matches.map(m => 'https://opengameart.org' + m[1]))];
}

function parseOgaPageForGlb(html) {
  const matches = [...html.matchAll(/https?:\/\/(?:[\w\-\.\/]+)\/(?:[\w\-]+)\.glb/gi)];
  return [...new Set(matches.map(m => m[0]))];
}

function getLicenseFromPoly(html) {
  const licMatch = html.match(/\b(CC0|CC-BY|CC-BY-SA|Public Domain)\b/i);
  return licMatch ? licMatch[0] : null;
}

function getLicenseFromOga(html) {
  const licMatch = html.match(/License:\s*<[^>]+>([\w\-\s0-9]+)<\/[^>]+>/i) || html.match(/(?:CC0|CC-BY|CC-BY-SA|Public Domain)/i);
  return licMatch ? licMatch[1] || licMatch[0] : null;
}

async function run() {
  if (!fs.existsSync(mappingPath)) {
    console.error('Mapping file not found at', mappingPath);
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const unresolved = Object.entries(mapping).filter(([f,m]) => !m.resolved || !m.sha256).map(([f]) => f);
  if (unresolved.length === 0) {
    console.log('All entries resolved; nothing to search');
    return;
  }
  for (const file of unresolved) {
    console.log('Searching candidates for', file);
    const key = file.replace(/\.glb$|\.gltf$/i, '');
    const queries = [key, `${key} plant`, `${key} herb`, `${key} tree`];
    const candidates = new Set(Array.isArray(mapping[file].src) ? mapping[file].src : [mapping[file].src]);
    for (const q of queries) {
      // poly.pizza search
      const searchUrl = `https://poly.pizza/search?q=` + encodeURIComponent(q);
      try {
        const res = await fetch(searchUrl);
        const pages = parsePolySearch(res.body);
        for (const p of pages) {
          try {
            const modelPage = await fetch(p);
            const lic = getLicenseFromPoly(modelPage.body);
            if (!lic || !/CC0/i.test(lic)) continue;
            const glbs = parsePolyModelForGlb(modelPage.body);
            for (const g of glbs) candidates.add(g);
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        // ignore network parse errors
      }
      // OpenGameArt search
      const ogaUrl = `https://opengameart.org/search?keys=` + encodeURIComponent(q);
      try {
        const ogares = await fetch(ogaUrl);
        const pages = parseOgaSearchForPages(ogares.body);
        for (const p of pages) {
          try {
            const pageRes = await fetch(p);
            const lic = getLicenseFromOga(pageRes.body);
            if (!lic || !/CC0/i.test(lic)) continue;
            const glbs = parseOgaPageForGlb(pageRes.body);
            for (const g of glbs) candidates.add(g);
          } catch (e) {
            continue;
          }
        }
      } catch (e) {}
      // stop early if we collected enough
      if (candidates.size >= 6) break;
    }
    // append new candidates to mapping
    const mappingObj = mapping[file];
    const existing = Array.isArray(mappingObj.src) ? mappingObj.src : [mappingObj.src];
    const newCandidates = [...candidates].filter(c => !existing.includes(c)).slice(0, 3);
    if (newCandidates.length) {
      mappingObj.src = existing.concat(newCandidates);
      mappingObj.note = (mappingObj.note || '') + ` Added programmatic CC0 candidates: ${newCandidates.join(', ')}`;
      console.log('  Added candidates for', file, newCandidates.join(', '));
    } else {
      console.log('  No new CC0 candidates found for', file);
    }
  }
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log('Updated', mappingPath);
}

run().catch(e => { console.error(e); process.exit(1); });
