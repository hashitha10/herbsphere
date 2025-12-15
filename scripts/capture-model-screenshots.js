import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

function createStaticServer(rootDir, port) {
  const localBase = `http://127.0.0.1:${port}`;
  const server = http.createServer((req, res) => {
    const parsed = new URL(req.url, localBase);
    let pathname = decodeURIComponent(parsed.pathname);
    if (pathname === '/') pathname = '/index.html';
      const filePath = path.join(rootDir, pathname);
      fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      res.setHeader('Content-Type', getContentType(filePath));
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.listen(port, (err) => (err ? reject(err) : resolve(server)));
  });
}

function getContentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.glb')) return 'model/gltf-binary';
  if (filePath.endsWith('.gltf')) return 'model/gltf+json';
  if (filePath.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

async function capture(modelPath, outPath, baseUrl) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  const url = `${baseUrl}/viewer.html?src=${encodeURIComponent(modelPath)}`;
  await page.goto(url);
  // Wait for model-viewer to dispatch 'load' event
  await page.evaluate(() => new Promise(resolve => {
    const mv = document.getElementById('mv');
    if (!mv) return resolve();
    if (mv.querySelector('mesh')) return resolve();
    mv.addEventListener('load', () => setTimeout(resolve, 250));
    // fallback timeout
    setTimeout(resolve, 8000);
  }));
  // Give a short delay to let auto-rotate stabilise
  await page.waitForTimeout(1500);
  const img = await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved ${outPath}`);
  await browser.close();
}

async function main() {
  const port = process.env.PORT || 5175;
  const baseUrl = `http://127.0.0.1:${port}`;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.join(__dirname, '..', 'public');
  const server = await createStaticServer(rootDir, port);
  console.log(`Static server running at ${baseUrl}`);
  const requested = [
    'models/ashwagandha.glb',
    'models/mint.glb',
    'models/lemongrass.glb',
    'models/brahmi.glb',
    'models/lemonbalm.glb',
    'models/gotu-kola.glb',
    'models/thuthuvalai.glb',
    'models/moringa.glb',
    'models/senna.glb',
    'models/amla.glb',
    'models/belladonna.glb',
    'models/nuxvomica.glb',
    'models/chamomile.glb'
  ];
  const outDir = path.join(__dirname, '..', 'public', 'images', 'model-previews');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  for (const m of requested) {
    const modelPath = '/' + m;
    const outPath = path.join(outDir, path.basename(m).replace('.glb', '.png'));
    await capture(modelPath, outPath, baseUrl);
  }
  await new Promise(resolve => server.close(resolve));
}

main().catch(err => { console.error(err); process.exit(1); });
