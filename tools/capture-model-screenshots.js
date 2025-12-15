import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const host = process.env.HOST || 'http://localhost:5173';
  const models = [
    { id: 'ashwagandha', url: '/viewer.html?src=/models/ashwagandha.glb' },
    { id: 'mint', url: '/viewer.html?src=/models/mint.glb' }
  ];

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });

  for (const model of models) {
    const url = host + model.url;
    console.log('Capturing', url);
    await page.goto(url, { waitUntil: 'networkidle' });
    // Wait for the model-viewer element to be present
    await page.waitForSelector('model-viewer', { timeout: 10000 });
    // Wait for rotation / animation to stabilise
    await page.waitForTimeout(1000);
    const outDir = path.join(__dirname, '..', 'public', 'images', 'model-previews');
    const fs = await import('fs');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${model.id}.png`);
    await page.screenshot({ path: outPath });
    console.log('Saved to', outPath);
  }

  await browser.close();
})();
