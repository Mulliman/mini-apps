/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Compile a week's 7 landscape POLYRIZZEMS videos into a single long-form YouTube video.
 *
 *   pnpm --filter @miniapps/poly-rizzems compile-week week-1-basics
 *   node scripts/compile-week.mjs 1 --title "BASIC POLYRHYTHMS"
 *   node scripts/compile-week.mjs week-2-fast-basics
 *
 * The script:
 * 1. Resolves the week plan directory and 7 day specs.
 * 2. Verifies (or renders) the 7 landscape (16x9) videos.
 * 3. Generates a branded intro flash card (~2.5s) with the compilation title.
 * 4. Generates an end screen card (~10s) with logo & YouTube next video card placement space.
 * 5. Concatenates all segments in order into a single 1080p60 MP4.
 * 6. Generates a YouTube description file with exact calculated chapter timestamps.
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');
const planBaseDir = join(appDir, 'videos', 'plan');
const outDir = join(appDir, 'out');

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 60;

function findBinary(name) {
  if (process.env[`${name.toUpperCase()}_PATH`] && existsSync(process.env[`${name.toUpperCase()}_PATH`])) {
    return process.env[`${name.toUpperCase()}_PATH`];
  }
  const isWindows = process.platform === 'win32';
  const candidates = [
    name,
    isWindows ? `${name}.exe` : name,
    ...(isWindows ? [
      join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', `${name}.exe`),
      join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', `${name}.exe`),
      join('C:', 'Program Files', 'Shotcut', `${name}.exe`),
      join('C:', 'ProgramData', 'chocolatey', 'bin', `${name}.exe`),
    ] : ['/usr/bin/' + name, '/usr/local/bin/' + name, '/opt/homebrew/bin/' + name])
  ];

  for (const candidate of candidates) {
    try {
      execSync(`"${candidate}" -version`, { stdio: 'ignore' });
      return candidate;
    } catch {
      // try next
    }
  }
  return name;
}

const FFMPEG = findBinary('ffmpeg');
const FFPROBE = findBinary('ffprobe');

function parseArgs(argv) {
  const options = {
    weekArg: null,
    title: null,
    renderMissing: true,
    introSec: 2.5,
    outroSec: 10.0,
    out: outDir,
    fps: FPS,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      if (options.weekArg === null) options.weekArg = arg;
      continue;
    }
    const next = () => {
      const val = argv[++i];
      if (val === undefined) fail(`${arg} needs a value`);
      return val;
    };
    switch (arg) {
      case '--title': options.title = next(); break;
      case '--intro-sec': options.introSec = Number(next()); break;
      case '--outro-sec': options.outroSec = Number(next()); break;
      case '--no-render': options.renderMissing = false; break;
      case '--render-missing': options.renderMissing = true; break;
      case '--out': options.out = resolve(next()); break;
      case '--fps': options.fps = Number(next()); break;
      case '--help': usage(); process.exit(0); break;
      default: fail(`unknown flag ${arg}`);
    }
  }

  if (!options.weekArg) {
    usage();
    fail('no week specified (e.g. week-1-basics or 1)');
  }
  return options;
}

function usage() {
  console.log(`
Usage: node scripts/compile-week.mjs <week-dir-or-number> [options]

Arguments:
  <week>              Week folder name or number (e.g. "week-1-basics", "1", "week-2-fast-basics")

Options:
  --title <text>      Custom compilation title (default: parsed from plan or directory)
  --intro-sec <sec>   Intro card duration in seconds (default: 2.5)
  --outro-sec <sec>   End screen duration in seconds (default: 10.0)
  --no-render         Fail if any day video is missing instead of auto-rendering
  --out <dir>         Output directory (default: apps/music/poly-rizzems/out)
  --fps <n>           Frames per second (default: 60)
`);
}

function fail(message) {
  console.error(`compile-week: ${message}`);
  process.exit(1);
}

/** Find the week directory given input like '1', 'week-1', or 'week-1-basics' */
function resolveWeekDir(weekArg) {
  const plans = readdirSync(planBaseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  if (plans.includes(weekArg)) return join(planBaseDir, weekArg);

  // Match by week number e.g. "1" or "week-1"
  const cleanNum = weekArg.replace(/^week-?/, '');
  const matched = plans.find(p => p.startsWith(`week-${cleanNum}-`) || p === `week-${cleanNum}`);
  if (matched) return join(planBaseDir, matched);

  fail(`Could not find week folder matching "${weekArg}". Available: ${plans.join(', ')}`);
}

/** Parse markdown files in the week folder to extract day specs and titles */
function parseWeekPlan(weekDir) {
  const files = readdirSync(weekDir);
  const overviewFile = files.find(f => f.startsWith('0-overview'));
  let weekTitle = null;
  let themeOverview = '';

  if (overviewFile) {
    const content = readFileSync(join(weekDir, overviewFile), 'utf-8');
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) weekTitle = h1Match[1].replace(/#+\s*/, '').trim();
    const overviewMatch = content.match(/## Theme Overview\s+([\s\S]*?)(?=##|$)/);
    if (overviewMatch) themeOverview = overviewMatch[1].trim();
  }

  const days = [];
  for (let d = 1; d <= 7; d++) {
    const dayFile = files.find(f => f.startsWith(`${d}-`) && f.endsWith('.md'));
    if (!dayFile) fail(`Missing day file for Day ${d} in ${weekDir}`);

    const content = readFileSync(join(weekDir, dayFile), 'utf-8');
    
    // Extract title
    const h1Match = content.match(/^#\s+(.+)$/m);
    const dayTitle = h1Match ? h1Match[1].replace(/Day\s*\d+:\s*/i, '').trim() : `Day ${d}`;

    // Extract spec name
    const specMatch = content.match(/Target Spec Name[`*:\s]+([a-zA-Z0-9_-]+)/i) ||
                      content.match(/`public\/specs\/([a-zA-Z0-9_-]+)\.json`/i) ||
                      content.match(/spec=([a-zA-Z0-9_-]+)/i);

    if (!specMatch) fail(`Could not parse Target Spec Name in ${dayFile}`);
    const specName = specMatch[1].trim();

    // Extract shorts title and description if present
    const shortsTitleMatch = content.match(/-\s+\*\*Title\*\*:\s*(.+)$/m) || content.match(/-\s+\*\*Shorts Title\*\*:\s*(.+)$/m);
    const shortsTitle = shortsTitleMatch ? shortsTitleMatch[1].trim() : `${dayTitle} - POLYRIZZEMS`;

    days.push({
      day: d,
      file: dayFile,
      title: dayTitle,
      specName,
      shortsTitle,
    });
  }

  return { weekDir, weekTitle, themeOverview, days };
}

/** Get exact duration of a video file in seconds, or null if invalid */
function tryGetVideoDuration(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    const out = execSync(`"${FFPROBE}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    const sec = parseFloat(out);
    if (Number.isFinite(sec) && sec > 0) return sec;
  } catch {
    // fallback via ffmpeg
  }

  try {
    const out = execSync(`"${FFMPEG}" -i "${filePath}" 2>&1`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    const match = out.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      return hours * 3600 + minutes * 60 + seconds;
    }
  } catch (e) {
    const match = e.toString().match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      return parseFloat(match[1]) * 3600 + parseFloat(match[2]) * 60 + parseFloat(match[3]);
    }
  }
  return null;
}

function getVideoDuration(filePath) {
  const dur = tryGetVideoDuration(filePath);
  if (dur !== null) return dur;
  throw new Error(`Could not determine duration for ${filePath}`);
}

/** Format seconds into MM:SS or HH:MM:SS */
function formatTimestamp(seconds) {
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

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
  const lanesHtml = COLOR_PALETTE.map((c, i) => `
    <div class="lane">
      <div class="ball" id="ball-${i}" style="background-color: ${c.hex};"></div>
    </div>
  `).join('');

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
    ${lanesHtml}
  </div>

  <script>
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
  </script>
</body>
</html>`;
}

/** Generate Outro / End Screen HTML */
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

/** Render an HTML template into an MP4 video clip with silent audio */
async function renderHtmlToClip(browser, htmlContent, durationSec, outClipPath, fps = FPS, animated = false) {
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  const totalFrames = Math.round(durationSec * fps);

  if (animated) {
    const tempDir = join(dirname(outClipPath), `temp-frames-${Date.now()}`);
    const { mkdirSync } = await import('node:fs');
    mkdirSync(tempDir, { recursive: true });

    for (let f = 0; f < totalFrames; f++) {
      const t = f / fps;
      await page.evaluate((time) => {
        if (typeof window.seek === 'function') window.seek(time);
      }, t);
      const shot = await page.screenshot({ type: 'png' });
      writeFileSync(join(tempDir, `f_${String(f).padStart(4, '0')}.png`), shot);
    }
    await page.close();

    const cmd = [
      `"${FFMPEG}" -y`,
      `-framerate ${fps} -i "${join(tempDir, 'f_%04d.png').replace(/\\/g, '/')}"`,
      `-f lavfi -t ${durationSec} -i anullsrc=r=48000:cl=stereo`,
      `-c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -r ${fps}`,
      `-c:a aac -b:a 192k -ar 48000 -ac 2`,
      `-shortest "${outClipPath}"`
    ].join(' ');

    try {
      execSync(cmd, { stdio: 'pipe' });
    } finally {
      if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
    }
  } else {
    // Static single frame looped
    const shotBuffer = await page.screenshot({ type: 'png' });
    await page.close();

    const tempImg = outClipPath.replace(/\.mp4$/, '.png');
    writeFileSync(tempImg, shotBuffer);

    const cmd = [
      `"${FFMPEG}" -y`,
      `-loop 1 -r ${fps} -t ${durationSec} -i "${tempImg}"`,
      `-f lavfi -t ${durationSec} -i anullsrc=r=48000:cl=stereo`,
      `-c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -r ${fps}`,
      `-c:a aac -b:a 192k -ar 48000 -ac 2`,
      `-shortest "${outClipPath}"`
    ].join(' ');

    try {
      execSync(cmd, { stdio: 'pipe' });
    } finally {
      if (existsSync(tempImg)) rmSync(tempImg);
    }
  }
}

/** Render missing day landscape video using scripts/render.mjs */
async function renderSpecVideo(specName) {
  console.log(`  Rendering missing video: ${specName} (16x9)...`);
  const renderScript = join(appDir, 'scripts', 'render.mjs');
  execSync(`node "${renderScript}" ${specName} --aspect 16x9`, {
    cwd: appDir,
    stdio: 'inherit',
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const weekDir = resolveWeekDir(options.weekArg);
  const weekSlug = weekDir.split(/[\/\\]/).pop();

  console.log(`\n========================================`);
  console.log(`  POLYRIZZEMS WEEK COMPILATION CREATOR`);
  console.log(`  Week Folder: ${weekSlug}`);
  console.log(`========================================\n`);

  const plan = parseWeekPlan(weekDir);
  const compilationTitle = options.title || 
    (plan.weekTitle ? plan.weekTitle.replace(/^Week\s*\d+\s*Plan:\s*/i, '').trim().toUpperCase() : weekSlug.replace(/^week-\d+-/, '').replace(/-/g, ' ').toUpperCase());

  console.log(`Compilation Title: "${compilationTitle}"`);
  console.log(`Days to concatenate:`);
  for (const d of plan.days) {
    console.log(`  Day ${d.day}: ${d.title} (spec: ${d.specName})`);
  }

  mkdirSync(options.out, { recursive: true });

  // 1. Verify / Render 16x9 Day Videos
  console.log(`\n[1/4] Checking day video files...`);
  const dayVideoPaths = [];
  for (const d of plan.days) {
    const videoFile = join(options.out, `${d.specName}-16x9.mp4`);
    const isPresentAndValid = existsSync(videoFile) && tryGetVideoDuration(videoFile) !== null;
    if (!isPresentAndValid) {
      if (options.renderMissing) {
        if (existsSync(videoFile)) {
          console.log(`  File exists but appears corrupt/incomplete, re-rendering: ${d.specName}`);
        }
        await renderSpecVideo(d.specName);
      } else {
        fail(`Missing or corrupt video: ${videoFile}. Run with --render-missing or render it first.`);
      }
    }
    if (!existsSync(videoFile) || tryGetVideoDuration(videoFile) === null) {
      fail(`Video file invalid or missing after render: ${videoFile}`);
    }
    dayVideoPaths.push({ ...d, videoFile });
  }

  // 2. Generate Intro and Outro Cards via Puppeteer
  console.log(`\n[2/4] Generating Intro and End Screen cards...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const introClipPath = join(options.out, `temp-${weekSlug}-intro.mp4`);
  const outroClipPath = join(options.out, `temp-${weekSlug}-outro.mp4`);

  try {
    process.stdout.write(`  Rendering Intro card (${options.introSec}s, animated dots)... `);
    const introHtml = getIntroHtml(compilationTitle);
    await renderHtmlToClip(browser, introHtml, options.introSec, introClipPath, options.fps, true);
    console.log('done.');

    process.stdout.write(`  Rendering End Screen card (${options.outroSec}s)... `);
    const outroHtml = getOutroHtml();
    await renderHtmlToClip(browser, outroHtml, options.outroSec, outroClipPath, options.fps);
    console.log('done.');
  } finally {
    await browser.close();
  }

  // 3. Compute Chapter Timestamps
  console.log(`\n[3/4] Calculating exact chapter timestamps...`);
  const segments = [
    { title: 'Intro', path: introClipPath, isIntro: true },
    ...dayVideoPaths.map(d => ({ title: `Day ${d.day}: ${d.title}`, path: d.videoFile, day: d.day })),
    { title: 'Next Videos & Interactive Play', path: outroClipPath, isOutro: true }
  ];

  let currentTimelineSec = 0;
  const chapters = [];

  for (const seg of segments) {
    const dur = getVideoDuration(seg.path);
    chapters.push({
      title: seg.title,
      timestamp: formatTimestamp(currentTimelineSec),
      startSec: currentTimelineSec,
      durationSec: dur,
    });
    currentTimelineSec += dur;
  }

  console.log(`Total Compilation Runtime: ${formatTimestamp(currentTimelineSec)} (${currentTimelineSec.toFixed(1)}s)`);
  console.log(`Chapters:`);
  for (const ch of chapters) {
    console.log(`  ${ch.timestamp} - ${ch.title}`);
  }

  // 4. Concatenate All Segments with ffmpeg filter_complex
  console.log(`\n[4/4] Concatenating ${segments.length} video segments...`);
  const finalVideoPath = join(options.out, `${weekSlug}-compilation.mp4`);
  const finalMetaPath = join(options.out, `${weekSlug}-compilation.txt`);

  const concatArgs = ['-y'];
  for (const s of segments) {
    concatArgs.push('-i', s.path);
  }

  const filterInputs = segments.map((_, idx) => `[${idx}:v][${idx}:a]`).join('');
  const filterExpr = `${filterInputs}concat=n=${segments.length}:v=1:a=1[v][a]`;

  concatArgs.push(
    '-filter_complex', filterExpr,
    '-map', '[v]',
    '-map', '[a]',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-r', String(options.fps),
    '-c:a', 'aac',
    '-b:a', '192k',
    '-ar', '48000',
    '-ac', '2',
    '-movflags', '+faststart',
    finalVideoPath
  );

  try {
    const res = spawnSync(FFMPEG, concatArgs, { stdio: 'inherit' });
    if (res.status !== 0) throw new Error(`ffmpeg concat failed with exit code ${res.status}`);
  } finally {
    if (existsSync(introClipPath)) rmSync(introClipPath);
    if (existsSync(outroClipPath)) rmSync(outroClipPath);
  }

  // 5. Generate YouTube Metadata & Description File
  const chaptersText = chapters.map(c => `${c.timestamp} ${c.title}`).join('\n');
  const metadataText = `=======================================================
YOUTUBE LONG-FORM METADATA
=======================================================

TITLE:
POLYRIZZEMS: ${compilationTitle} (7 Essential Polyrhythms Compilation)

DESCRIPTION:
Master the polyrhythms of the week with the complete POLYRIZZEMS 7-day masterclass! From fundamental 2-rhythm collisions to interlocking grooves, watch each rhythm develop bar-by-bar across the visual spectrum.

🕹️ PLAY ALL RHYTHMS INTERACTIVELY:
https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/

TIMESTAMPS:
${chaptersText}

---
🎹 Try the POLYRIZZEMS interactive synthesizer in your browser:
https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/

#polyrhythm #musictheory #polyrizzems #music #compilation
`;

  writeFileSync(finalMetaPath, metadataText, 'utf-8');

  console.log(`\n========================================`);
  console.log(`  COMPILATION COMPLETE!`);
  console.log(`  Video:    ${finalVideoPath}`);
  console.log(`  Metadata: ${finalMetaPath}`);
  console.log(`========================================\n`);
}

main().catch(err => {
  console.error('\nCompilation Error:', err);
  process.exit(1);
});
