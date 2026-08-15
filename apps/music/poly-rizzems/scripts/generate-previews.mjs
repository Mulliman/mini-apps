import puppeteer from 'puppeteer';
import { execSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';

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

function getIntroHtml(titleText, barDuration = 2.5) {
  const lanesHtml = COLOR_PALETTE.map((c, i) => {
    const signature = i + 1;
    return `
      <div class="lane" data-sig="${signature}">
        <div class="runway-line"></div>
        <div class="ball" id="ball-${i}" style="background-color: ${c.hex};"></div>
        <div class="floor-marker"></div>
      </div>
    `;
  }).join('');

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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 160px 80px 80px 80px;
    }

    /* Top/Center: Title Area */
    .title-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 40px;
    }

    .logo {
      font-size: 96px;
      font-weight: 900;
      font-style: italic;
      letter-spacing: -0.05em;
      line-height: 1;
      color: #ffffff;
      margin-bottom: 28px;
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

    /* Bottom: Polyrhythmic Bouncing Lanes */
    .lanes-container {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: center;
      gap: 36px;
      height: 180px;
      width: 100%;
      max-width: 1200px;
    }

    .lane {
      position: relative;
      width: 24px;
      height: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .runway-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 100%;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 1px;
    }

    .floor-marker {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 2px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 1px;
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
  <div class="title-block">
    <div class="logo"><span class="accent">POLY</span>RIZZEMS<span class="accent">.</span></div>
    <div class="title">${titleText}</div>
  </div>

  <div class="lanes-container">
    ${lanesHtml}
  </div>

  <script>
    const barDuration = ${barDuration};
    const maxBounce = 110; // max bounce height in px
    
    // Parabolic bounce matching the app physics
    window.seek = function(t) {
      for (let i = 0; i < 10; i++) {
        const sig = i + 1;
        const continuousBeats = (t * sig) / barDuration;
        const progress = continuousBeats % 1;
        // Parabola: 0 at floor (progress=0), 1 at apex (progress=0.5), 0 at floor (progress=1)
        const bounce = Math.max(0, 1 - 4 * Math.pow(progress - 0.5, 2));
        const y = bounce * maxBounce;
        const ball = document.getElementById('ball-' + i);
        if (ball) {
          ball.style.transform = 'translate(-50%, ' + (-y) + 'px)';
        }
      }
    };
  </script>
</body>
</html>`;
}

function getOutroHtml() {
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 60px 80px 50px 80px;
      overflow: hidden;
      position: relative;
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 10px;
    }

    .logo {
      font-size: 64px;
      font-weight: 900;
      font-style: italic;
      letter-spacing: -0.05em;
      line-height: 1;
      color: #ffffff;
    }
    .accent { color: #FF007A; }

    .space-center {
      flex: 1;
      width: 100%;
    }

    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }

    .app-link {
      color: #00E5FF;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"><span class="accent">POLY</span>RIZZEMS<span class="accent">.</span></div>
  </div>

  <div class="space-center"></div>

  <div class="footer">
    <span>Play interactively at</span>
    <span class="app-link">miniapps.sammullins.co.uk/apps/music/poly-rizzems</span>
  </div>
</body>
</html>`;
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  
  // 1. Render Intro Still at t = 0.6s (mid-bounce)
  await page.setContent(getIntroHtml('POLYRHYTHM BASICS', 2.5), { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.seek(0.6));
  const introJpg = await page.screenshot({ type: 'jpeg', quality: 95 });
  writeFileSync('out/preview-intro.jpg', introJpg);
  writeFileSync('C:/Users/Sam/.gemini/antigravity-ide/brain/46216b6f-2ac7-4023-a5a1-5da4e6a07128/preview-intro.jpg', introJpg);

  // 2. Render Outro Still
  await page.setContent(getOutroHtml(), { waitUntil: 'domcontentloaded' });
  const outroJpg = await page.screenshot({ type: 'jpeg', quality: 95 });
  writeFileSync('out/preview-outro.jpg', outroJpg);
  writeFileSync('C:/Users/Sam/.gemini/antigravity-ide/brain/46216b6f-2ac7-4023-a5a1-5da4e6a07128/preview-outro.jpg', outroJpg);

  // 3. Render animated sequence using window.seek(t) (2.5s @ 30fps) for GIF
  console.log('Rendering polyrhythmic bouncing frames for GIF...');
  await page.setContent(getIntroHtml('POLYRHYTHM BASICS', 2.5), { waitUntil: 'domcontentloaded' });
  
  const gifFramesDir = 'out/temp-gif-frames';
  mkdirSync(gifFramesDir, { recursive: true });

  const fps = 30;
  const duration = 2.5;
  const totalFrames = Math.round(fps * duration);

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    await page.evaluate((time) => window.seek(time), t);
    const frameBuffer = await page.screenshot({ type: 'png' });
    writeFileSync(`${gifFramesDir}/frame_${String(f).padStart(3, '0')}.png`, frameBuffer);
  }

  await browser.close();

  // Convert frame sequence into GIF using ffmpeg
  const gifCmd = `ffmpeg -y -framerate ${fps} -i "${gifFramesDir}/frame_%03d.png" -vf "scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "out/preview-intro.gif"`;
  execSync(gifCmd, { stdio: 'inherit' });

  // Copy GIF to artifacts
  copyFileSync('out/preview-intro.gif', 'C:/Users/Sam/.gemini/antigravity-ide/brain/46216b6f-2ac7-4023-a5a1-5da4e6a07128/preview-intro.gif');

  // Clean up temp gif frames
  rmSync(gifFramesDir, { recursive: true, force: true });

  console.log('Previews & Animated GIF with app-accurate polyrhythmic bouncing successfully generated!');
}

run().catch(console.error);
