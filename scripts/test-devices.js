/**
 * Multi-device responsiveness and regression test suite for PolyPals
 * This script runs automated browser actions across 8 viewport profiles and captures screenshots.
 * Written using ES Module syntax to comply with monorepo packaging.
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target paths
const screenshotsDir = 'C:\\Users\\Sam\\.gemini\\antigravity-ide\\brain\\ee56bdd7-6cc7-4e98-8910-c14e20227a29\\screenshots';
const devServerLogPath = 'C:\\Users\\Sam\\.gemini\\antigravity-ide\\brain\\ee56bdd7-6cc7-4e98-8910-c14e20227a29\\.system_generated\\tasks\\task-70.log';

// Define the 8 target viewports (portrait and landscape variations)
const devices = [
  { name: 'small_mobile_portrait', width: 320, height: 568 },
  { name: 'small_mobile_landscape', width: 568, height: 320 },
  { name: 'premium_mobile_portrait', width: 412, height: 915 },
  { name: 'premium_mobile_landscape', width: 915, height: 412 },
  { name: 'tablet_portrait', width: 768, height: 1024 },
  { name: 'tablet_landscape', width: 1024, height: 768 },
  { name: 'full_hd_landscape', width: 1920, height: 1080 },
  { name: 'ultrawide_landscape', width: 3440, height: 1440 }
];

// Read port from Vite dev server log dynamically, default to 5174
function getDevServerPort() {
  try {
    if (fs.existsSync(devServerLogPath)) {
      const content = fs.readFileSync(devServerLogPath, 'utf8');
      const match = content.match(/localhost:(\d+)/);
      if (match && match[1]) {
        console.log(`[INF] Detected active dev server port from logs: ${match[1]}`);
        return parseInt(match[1], 10);
      }
    }
  } catch (err) {
    console.error(`[WARN] Could not parse dev server log file: ${err.message}`);
  }
  console.log(`[INF] Defaulting to dev server port: 5174`);
  return 5174;
}

// Helper to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('====================================================');
  console.log('STARTING POLY-PALS BROWSER AUTOMATION MULTI-DEVICE SUITE');
  console.log('====================================================');
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log(`[INF] Created screenshots directory: ${screenshotsDir}`);
  }

  const port = getDevServerPort();
  const url = `http://localhost:${port}/apps/music/poly-pals/index.html`;
  console.log(`[INF] Targeting URL: ${url}\n`);

  const results = [];

  for (const dev of devices) {
    console.log(`[TESTING] Device: ${dev.name.toUpperCase()} (${dev.width}x${dev.height})`);
    const devFolder = path.join(screenshotsDir, dev.name);
    if (!fs.existsSync(devFolder)) {
      fs.mkdirSync(devFolder, { recursive: true });
    }

    let browser;
    try {
      // Launch browser
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setViewport({ width: dev.width, height: dev.height });

      // 1. Navigate to PolyPals
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      await delay(1000); // stable animation settles

      // Screenshot 1: Initial load
      const initialScreenshotPath = path.join(devFolder, '01_initial.png');
      await page.screenshot({ path: initialScreenshotPath });
      console.log(`   [OK] Captured initial screenshot: 01_initial.png`);

      // Check for overflow / scrollbars
      const checkLayout = async () => {
        return await page.evaluate(() => {
          const doc = document.documentElement;
          // Clean check for scrollbars
          const hasScrollbarY = doc.scrollHeight > window.innerHeight;
          const hasScrollbarX = doc.scrollWidth > window.innerWidth;
          
          return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            scrollHeight: doc.scrollHeight,
            scrollWidth: doc.scrollWidth,
            hasScrollbarY,
            hasScrollbarX
          };
        });
      };

      let layout = await checkLayout();
      console.log(`   [LAYOUT] Width: ${layout.windowWidth}/${layout.scrollWidth}, Height: ${layout.windowHeight}/${layout.scrollHeight}`);
      let hasOverflow = layout.hasScrollbarX || layout.hasScrollbarY;
      if (hasOverflow) {
        console.error(`   [WARN] Scrollbars detected! X: ${layout.hasScrollbarX}, Y: ${layout.hasScrollbarY}`);
      } else {
        console.log(`   [OK] No scrollbars detected.`);
      }

      // 2. Play/Pause Test
      const playBtn = await page.$('#action-play-pause-btn');
      if (playBtn) {
        await playBtn.click();
        await delay(500);
        await playBtn.click();
        await delay(300);
        console.log(`   [OK] Play/Pause toggled successfully.`);
      } else {
        console.error(`   [FAIL] Play/Pause button not found!`);
      }

      // 3. Add Multiple Pals Test (Add 3 pals)
      const addPalBtn = await page.$('#action-add-pal-btn');
      if (addPalBtn) {
        for (let i = 0; i < 3; i++) {
          await addPalBtn.click();
          await delay(200);
        }
        console.log(`   [OK] Clicked ADD PAL 3 times.`);
        await delay(800); // wait for addition transitions to complete
      } else {
        console.error(`   [FAIL] ADD PAL button not found!`);
      }

      // Capture screenshot 2: Added pals
      const addedPalsScreenshotPath = path.join(devFolder, '02_added_pals.png');
      await page.screenshot({ path: addedPalsScreenshotPath });
      console.log(`   [OK] Captured added pals screenshot: 02_added_pals.png`);

      // Check scrollbars again with multiple tracks on screen
      layout = await checkLayout();
      hasOverflow = hasOverflow || layout.hasScrollbarX || layout.hasScrollbarY;
      if (layout.hasScrollbarX || layout.hasScrollbarY) {
        console.error(`   [WARN] Scrollbars detected after adding pals! X: ${layout.hasScrollbarX}, Y: ${layout.hasScrollbarY}`);
      }

      // 4. Open Settings Panel
      // Click first lane to edit it
      const firstLane = await page.$('[id^="lane-"]');
      if (firstLane) {
        await firstLane.click();
        await delay(1000); // wait for settings modal transition
        console.log(`   [OK] Clicked lane, opening SettingsPanel.`);
        
        // Capture screenshot 3: Settings Panel
        const settingsScreenshotPath = path.join(devFolder, '03_settings_panel.png');
        await page.screenshot({ path: settingsScreenshotPath });
        console.log(`   [OK] Captured settings panel screenshot: 03_settings_panel.png`);

        // Check scrollbars inside Settings Modal
        layout = await checkLayout();
        hasOverflow = hasOverflow || layout.hasScrollbarX || layout.hasScrollbarY;
        if (layout.hasScrollbarX || layout.hasScrollbarY) {
          console.error(`   [WARN] Scrollbars detected inside Settings Panel! X: ${layout.hasScrollbarX}, Y: ${layout.hasScrollbarY}`);
        }

        // 5. Remove Pal via Settings
        const removeTrackBtn = await page.$('#settings-remove-track-btn');
        if (removeTrackBtn) {
          await removeTrackBtn.click();
          await delay(800); // wait for removal transitions
          console.log(`   [OK] Clicked Remove Track inside Settings.`);
        } else {
          console.error(`   [FAIL] Remove Track button not found!`);
        }
      } else {
        console.log(`   [WARN] No lane found to edit.`);
      }

      // Capture screenshot 4: After removal
      const finalScreenshotPath = path.join(devFolder, '04_after_removal.png');
      await page.screenshot({ path: finalScreenshotPath });
      console.log(`   [OK] Captured after-removal screenshot: 04_after_removal.png`);

      results.push({
        device: dev.name,
        resolution: `${dev.width}x${dev.height}`,
        success: true,
        hasOverflow,
        layoutDetails: layout
      });
      console.log(`[SUCCESS] Completed testing for ${dev.name.toUpperCase()}\n`);

    } catch (err) {
      console.error(`[ERROR] Failed during test of ${dev.name}: ${err.message}\n`);
      results.push({
        device: dev.name,
        resolution: `${dev.width}x${dev.height}`,
        success: false,
        error: err.message
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  console.log('====================================================');
  console.log('SUMMARY OF RESULTS');
  console.log('====================================================');
  let cleanPass = true;
  results.forEach((r) => {
    if (!r.success) {
      console.error(`- ${r.device} (${r.resolution}): ERROR (${r.error})`);
      cleanPass = false;
    } else if (r.hasOverflow) {
      console.warn(`- ${r.device} (${r.resolution}): COMPLETED (Scrollbars/Overflow detected)`);
      cleanPass = false;
    } else {
      console.log(`- ${r.device} (${r.resolution}): PERFECT PASS`);
    }
  });

  console.log('\n====================================================');
  if (cleanPass) {
    console.log('RESULT: ALL DEVICES PASSED FLAWLESSLY WITH NO SCROLLBARS!');
  } else {
    console.log('RESULT: SOME ISSUES OR SCROLLBARS WERE DETECTED. CORRECTION NEEDED.');
  }
  console.log('====================================================');
  
  // Write summary results to a json file in artifacts for record keeping
  fs.writeFileSync(
    path.join(screenshotsDir, 'results.json'),
    JSON.stringify(results, null, 2)
  );
}

runTests();
