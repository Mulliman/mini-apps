import puppeteer from 'puppeteer';
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const COLOR_PALETTE = [
  { hex: "#ff007f", name: "Rave Pink" },
  { hex: "#00f0ff", name: "Cyber Cyan" },
  { hex: "#39ff14", name: "Neon Green" },
  { hex: "#fffb00", name: "Cosmic Yellow" },
  { hex: "#ff5f00", name: "Solar Orange" },
  { hex: "#b026ff", name: "Vapor Purple" },
  { hex: "#ff073a", name: "Laser Red" },
  { hex: "#ccff00", name: "Acid Lime" },
  { hex: "#00ffd0", name: "Ocean Mint" },
  { hex: "#ff00ea", name: "Sunset Magenta" },
];

const logoImgBase64 = readFileSync('c:/Development/MiniApps/monorepo/assets/logo/polyrizzems.png').toString('base64');
const logoDataUri = `data:image/png;base64,${logoImgBase64}`;

function getLanesHtml() {
  return COLOR_PALETTE.map((c, i) => `
    <div class="lane">
      <div class="ball" id="ball-${i}" style="background-color: ${c.hex};"></div>
    </div>
  `).join('');
}

const bounceScript = (barDuration = 2.5) => `
  const barDuration = ${barDuration};
  const maxBounce = 110;
  window.seek = function(t) {
    for (let i = 0; i < 10; i++) {
      const sig = i + 1;
      const continuousBeats = (t * sig) / barDuration;
      const progress = continuousBeats % 1;
      const bounce = Math.max(0, 1 - 4 * Math.pow(progress - 0.5, 2));
      const y = bounce * maxBounce;
      const ball = document.getElementById('ball-' + i);
      if (ball) {
        ball.style.transform = 'translate(-50%, ' + (-y) + 'px)';
      }
    }
  };
`;

/** Variant A: Text Logo + Title centered together dead in the middle */
function getVariantAHtml(titleText, barDuration = 2.5) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background-color: #000000;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }

    /* Dead middle center block */
    .center-block {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
      padding: 0 100px;
    }

    .logo {
      font-size: 96px;
      font-weight: 900;
      font-style: italic;
      letter-spacing: -0.05em;
      line-height: 1;
      color: #ffffff;
      margin-bottom: 24px;
    }
    .accent { color: #FF007A; }

    .title {
      font-size: 54px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #ffffff;
      max-width: 1500px;
      line-height: 1.2;
    }

    /* Bottom bouncing dots - no grey bars */
    .lanes-container {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      gap: 36px;
      height: 150px;
      width: 100%;
      max-width: 1200px;
    }

    .lane {
      position: relative;
      width: 24px;
      height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .ball {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      transform: translate(-50%, 0);
      will-change: transform;
    }
  </style>
</head>
<body>
  <div class="center-block">
    <div class="logo"><span class="accent">POLY</span>RIZZEMS<span class="accent">.</span></div>
    <div class="title">${titleText}</div>
  </div>

  <div class="lanes-container">
    ${getLanesHtml()}
  </div>

  <script>
    ${bounceScript(barDuration)}
  </script>
</body>
</html>`;
}

/** Variant B: Title dead center, Image Logo in middle between top of frame and top of text */
function getVariantBHtml(titleText, barDuration = 2.5) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background-color: #000000;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      overflow: hidden;
      position: relative;
    }

    /* Title dead in the middle */
    .title-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 58px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #ffffff;
      text-align: center;
      max-width: 1500px;
      line-height: 1.2;
      width: 100%;
      padding: 0 100px;
    }

    /* Logo halfway between top of frame (0px) and top of text (~500px) */
    .logo-container {
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .logo-img {
      width: 220px;
      height: 220px;
      object-fit: contain;
      border-radius: 50%;
    }

    /* Bottom bouncing dots - no grey bars */
    .lanes-container {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      gap: 36px;
      height: 150px;
      width: 100%;
      max-width: 1200px;
    }

    .lane {
      position: relative;
      width: 24px;
      height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .ball {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      transform: translate(-50%, 0);
      will-change: transform;
    }
  </style>
</head>
<body>
  <div class="logo-container">
    <img src="${logoDataUri}" alt="POLYRIZZEMS" class="logo-img" />
  </div>

  <div class="title-center">
    ${titleText}
  </div>

  <div class="lanes-container">
    ${getLanesHtml()}
  </div>

  <script>
    ${bounceScript(barDuration)}
  </script>
</body>
</html>`;
}

async function renderVariant(browser, name, html) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // 1. Render Still Snapshot at t = 0.6s
  await page.evaluate(() => window.seek(0.6));
  const jpg = await page.screenshot({ type: 'jpeg', quality: 95 });
  writeFileSync(`out/preview-intro-${name}.jpg`, jpg);
  writeFileSync(`C:/Users/Sam/.gemini/antigravity-ide/brain/46216b6f-2ac7-4023-a5a1-5da4e6a07128/preview-intro-${name}.jpg`, jpg);

  // 2. Render Animated GIF
  console.log(`Rendering GIF for ${name}...`);
  const framesDir = `out/temp-frames-${name}`;
  mkdirSync(framesDir, { recursive: true });

  const fps = 30;
  const duration = 2.5;
  const totalFrames = Math.round(fps * duration);

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    await page.evaluate((time) => window.seek(time), t);
    const frame = await page.screenshot({ type: 'png' });
    writeFileSync(`${framesDir}/frame_${String(f).padStart(3, '0')}.png`, frame);
  }

  await page.close();

  const gifCmd = `ffmpeg -y -framerate ${fps} -i "${framesDir}/frame_%03d.png" -vf "scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "out/preview-intro-${name}.gif"`;
  execSync(gifCmd, { stdio: 'inherit' });

  copyFileSync(`out/preview-intro-${name}.gif`, `C:/Users/Sam/.gemini/antigravity-ide/brain/46216b6f-2ac7-4023-a5a1-5da4e6a07128/preview-intro-${name}.gif`);
  rmSync(framesDir, { recursive: true, force: true });
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  console.log('Rendering Variant A (Text Logo + Title centered dead middle)...');
  await renderVariant(browser, 'variant-a', getVariantAHtml('POLYRHYTHM BASICS'));

  console.log('Rendering Variant B (Title dead middle + Image Logo at 25% height)...');
  await renderVariant(browser, 'variant-b', getVariantBHtml('POLYRHYTHM BASICS'));

  await browser.close();
  console.log('All variants generated successfully!');
}

main().catch(console.error);
