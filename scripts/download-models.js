#!/usr/bin/env node

// Simple fetch script to download GLB files if direct .glb links are provided in model-sources.json
// If the URL is an HTML page, it will log and skip (manual download may be required).

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname);

const modelSourcesPath = path.resolve(repoRoot, '../public/models/model-sources.json');
const modelsDir = path.resolve(repoRoot, '../public/models');

async function run() {
  if (!fs.existsSync(modelSourcesPath)) {
    console.error('No model-sources.json found');
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync(modelSourcesPath, 'utf8'));

  // Build a set of sha256 hashes from existing model files so we can avoid duplicates
  const seenHashes = new Set();
  try {
    const existingFiles = fs.readdirSync(modelsDir).filter((f) => f.toLowerCase().endsWith('.glb') || f.toLowerCase().endsWith('.gltf'));
    for (const f of existingFiles) {
      try {
        const h = await fileHash(path.resolve(modelsDir, f));
        if (h) seenHashes.add(h);
      } catch (e) {}
    }
  } catch (e) {}

  for (const [file, meta] of Object.entries(mapping)) {
    console.log('Processing', file, Array.isArray(meta.src) ? meta.src.join(',') : meta.src);
    try {
      const candidates = Array.isArray(meta.src) ? meta.src : [meta.src];
      let downloaded = false;
      for (const url of candidates) {
        if (downloaded) break;
        if (!url || !url.startsWith('http')) {
          console.log('  Skipped: not an http URL', url);
          continue;
        }
        const lower = url.toLowerCase();
        const destPath = path.resolve(modelsDir, file);

        // Direct file candidate (.glb/.gltf/.zip)
        if (lower.endsWith('.glb') || lower.endsWith('.gltf') || lower.endsWith('.zip')) {
          const tmp = path.join(os.tmpdir(), `${file}.tmp`);
          try {
            await download(url, tmp);
            const h = await fileHash(tmp);
            if (seenHashes.has(h)) {
              console.log('  Candidate is duplicate (hash), skipping candidate:', url);
              try { fs.unlinkSync(tmp); } catch (e) {}
              continue;
            }
            fs.renameSync(tmp, destPath);
            seenHashes.add(h);
            console.log('  Downloaded to', destPath, 'from', url);
            mapping[file].resolved = url;
            mapping[file].sha256 = h;
            downloaded = true;
            break;
          } catch (e) {
            console.log('  Failed to download candidate:', url, e.message || e);
            try { fs.unlinkSync(tmp); } catch (e2) {}
            continue;
          }
        }

        // Try HEAD to see if page appears to be an asset
        let info = null;
        try {
          info = await head(url);
        } catch (e) {}
        if (!info) {
          console.log('  Head request failed or blocked; trying to parse page for direct asset links.');
        }
        const contentType = info?.headers['content-type'] || '';
        if (contentType && (contentType.includes('model/gltf-binary') || contentType.includes('application/octet-stream') || lower.includes('.glb'))) {
          const tmp = path.join(os.tmpdir(), `${file}.tmp`);
          try {
            await download(url, tmp);
            const h = await fileHash(tmp);
            if (seenHashes.has(h)) {
              console.log('  Candidate is duplicate (hash), skipping candidate:', url);
              try { fs.unlinkSync(tmp); } catch (e) {}
              continue;
            }
            fs.renameSync(tmp, destPath);
            seenHashes.add(h);
            console.log('  Downloaded to', destPath, 'from', url);
            mapping[file].resolved = url;
            mapping[file].sha256 = h;
            downloaded = true;
            break;
          } catch (err) {
            console.log('  Failed to download from candidate (HEAD claimed model):', url, err.message || err);
            try { fs.unlinkSync(tmp); } catch (e2) {}
            continue;
          }
        }

        // If not direct, try fetching the page HTML and locate .glb/.gltf links
        const assetUrl = await findAssetLink(url);
        if (assetUrl) {
          try {
            const tmp2 = path.join(os.tmpdir(), `${file}.tmp`);
            await download(assetUrl, tmp2);
            const h2 = await fileHash(tmp2);
            if (seenHashes.has(h2)) {
              console.log('  Parsed asset is duplicate (hash), skipping:', assetUrl);
              try { fs.unlinkSync(tmp2); } catch (e) {}
              continue;
            }
            fs.renameSync(tmp2, destPath);
            seenHashes.add(h2);
            mapping[file].resolved = assetUrl;
            mapping[file].sha256 = h2;
            console.log('  Downloaded direct asset from page to', destPath, 'from', assetUrl);
            downloaded = true;
            break;
          } catch (err) {
            console.log('  Failed to download parsed asset link; skipping.', err.message || err);
            try { fs.unlinkSync(tmp2); } catch (e) {}
            continue;
          }
        }

        console.log('  Not a direct glb/gltf/zip URL; manual download required for this candidate:', url);
      }
      if (!downloaded) console.log('  No candidate succeeded for', file, '; manual download required.');
    } catch (err) {
      console.error('  Error for', file, err.message || err);
    }
  }

  // Persist mapping with resolved urls and sha if we updated any
  try {
    fs.writeFileSync(modelSourcesPath, JSON.stringify(mapping, null, 2));
    console.log('Updated', modelSourcesPath);
  } catch (err) {}
}

function head(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url: res.responseUrl || url, headers: res.headers });
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve(true)));
      fileStream.on('error', (e) => reject(e));
    });
    req.on('error', (e) => reject(e));
  });
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk.toString());
      res.on('end', () => resolve(data));
      res.on('error', (e) => reject(e));
    }).on('error', (e) => reject(e));
  });
}

async function findAssetLink(pageUrl) {
  try {
    const html = await fetchHtml(pageUrl);
    // very simple regex search for .glb/.gltf links
    const glbMatch = html.match(/https?:\/\/[^"'<>\s]+\.(?:glb|gltf)/i);
    if (glbMatch) return glbMatch[0];
    // also look for /assets/.../model.glb relative links
    const relMatch = html.match(/(\/assets\/[\w\-\/]+\.(?:glb|gltf))/i);
    if (relMatch) {
      const base = new URL(pageUrl).origin;
      return base + relMatch[0];
    }
  } catch (err) {
    return null;
  }
  return null;
}

function fileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(filePath);
    rs.on('data', (d) => hash.update(d));
    rs.on('end', () => resolve(hash.digest('hex')));
    rs.on('error', (e) => reject(e));
  });
}

run();
