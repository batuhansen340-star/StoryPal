/**
 * StoryPal — App Store Screenshot Renderer
 *
 * Converts HTML mockup files to 1290x2796 PNG images
 * (iPhone 15 Pro Max resolution for App Store).
 *
 * Usage:
 *   npm install puppeteer-core --save-dev
 *   node screenshots/render-screenshots.js
 *
 * Uses your system Chrome — no extra download needed.
 * Output: screenshots/output/ folder with PNG files
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_WIDTH = 1284;
const SCREENSHOT_HEIGHT = 2778;

const SCREENSHOTS = [
  { file: '01-home.html', name: '01-home' },
  { file: '02-create-flow.html', name: '02-create-flow' },
  { file: '03-story-viewer.html', name: '03-story-viewer' },
  { file: '04-bedtime-mode.html', name: '04-bedtime-mode' },
  { file: '05-library.html', name: '05-library' },
  { file: '06-stats.html', name: '06-stats' },
];

// Find Chrome on macOS, Windows, or Linux
function findChrome() {
  const paths = [
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    // Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function renderScreenshots() {
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const chromePath = findChrome();
  if (!chromePath) {
    console.error('Chrome bulunamadı! Google Chrome yüklü olduğundan emin ol.');
    process.exit(1);
  }
  console.log(`Using Chrome: ${chromePath}`);
  console.log('Launching browser...');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const screenshot of SCREENSHOTS) {
    const filePath = path.join(__dirname, screenshot.file);
    const outputPath = path.join(outputDir, `${screenshot.name}.png`);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Skipping ${screenshot.file} — file not found`);
      continue;
    }

    console.log(`Rendering ${screenshot.file}...`);

    const page = await browser.newPage();
    await page.setViewport({
      width: SCREENSHOT_WIDTH,
      height: SCREENSHOT_HEIGHT,
      deviceScaleFactor: 1,
    });

    const fileUrl = `file://${filePath}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: SCREENSHOT_WIDTH,
        height: SCREENSHOT_HEIGHT,
      },
    });

    await page.close();
    console.log(`  ✓ Saved ${outputPath}`);
  }

  await browser.close();
  console.log(`\nDone! ${SCREENSHOTS.length} screenshots saved to screenshots/output/`);
}

renderScreenshots().catch((err) => {
  console.error('Error rendering screenshots:', err);
  process.exit(1);
});
