/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Render a POLYRIZZEMS spec to video.
 *
 *   pnpm --filter @miniapps/poly-rizzems render golden-triad
 *
 * Starts Vite itself on an ephemeral port, drives the app's render mode through
 * puppeteer one frame at a time, and pipes those frames straight into ffmpeg
 * alongside an offline-rendered WAV. Nothing is captured in real time, so the
 * output is identical on every machine and every run.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { createServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');

const ASPECTS = {
  '9x16': { width: 1080, height: 1920 },
  '16x9': { width: 1920, height: 1080 },
};

function parseArgs(argv) {
  const options = {
    spec: null,
    aspect: 'both',
    fps: 60,
    scale: 2,
    out: join(appDir, 'out'),
    bars: null,
    audio: true,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      if (options.spec === null) options.spec = arg;
      continue;
    }
    const next = () => {
      const value = argv[++i];
      if (value === undefined) fail(`${arg} needs a value`);
      return value;
    };
    switch (arg) {
      case '--aspect': options.aspect = next(); break;
      case '--fps': options.fps = Number(next()); break;
      case '--scale': options.scale = Number(next()); break;
      case '--out': options.out = resolve(next()); break;
      case '--bars': options.bars = Number(next()); break;
      case '--no-audio': options.audio = false; break;
      case '--help': usage(); process.exit(0); break;
      default: fail(`unknown flag ${arg}`);
    }
  }

  if (!options.spec) usage(), fail('no spec given');
  if (options.aspect !== 'both' && !ASPECTS[options.aspect]) {
    fail(`--aspect must be one of both, ${Object.keys(ASPECTS).join(', ')}`);
  }
  if (!Number.isFinite(options.fps) || options.fps <= 0) fail('--fps must be positive');
  if (!Number.isFinite(options.scale) || options.scale <= 0) fail('--scale must be positive');
  return options;
}

function usage() {
  console.log(`
Usage: render <spec-name> [options]

  --aspect  both | 9x16 | 16x9   (default both)
  --fps     frames per second    (default 60)
  --scale   supersample factor   (default 2; frames are captured at this
                                  multiple then downscaled, which cleans up
                                  the neon edges — use 1 for fast drafts)
  --bars    render only the first N bars (quick smoke test)
  --no-audio
  --out     output directory     (default apps/music/poly-rizzems/out)
`);
}

function fail(message) {
  console.error(`render: ${message}`);
  process.exit(1);
}

/** Serve the app itself, so there's no "did I start the dev server" step. */
async function startServer() {
  // Renders take minutes, and you will edit a spec or a component while one is
  // running. Without this, Vite pushes the change, the page reloads, and the render
  // dies partway through with "execution context was destroyed". A render should be
  // a snapshot of the code as it was when the render started.
  process.env.DISABLE_HMR = 'true';

  const server = await createServer({
    root: appDir,
    configFile: join(appDir, 'vite.config.ts'),
    logLevel: 'warn',
    server: { port: 0, strictPort: false, host: '127.0.0.1', hmr: false, watch: null },
  });
  await server.listen();
  const address = server.httpServer.address();
  return { server, port: address.port };
}

async function openRenderPage(browser, port, spec, viewport, scale) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: scale });
  page.on('pageerror', (error) => console.error(`  page error: ${error.message}`));

  const url = `http://127.0.0.1:${port}/?render=1&spec=${encodeURIComponent(spec)}`;
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.waitForFunction(() => window.__polyrizzems?.ready || window.__polyrizzems?.error, { timeout: 30000 });
  const state = await page.evaluate(() => ({
    ready: window.__polyrizzems.ready,
    error: window.__polyrizzems.error ?? null,
    info: window.__polyrizzems.info ?? null,
  }));
  if (!state.ready) throw new Error(state.error || 'render mode failed to become ready');
  return { page, info: state.info };
}

function runFfmpeg(args, onExit, onError) {
  const ffmpeg = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let stderr = '';
  ffmpeg.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
  ffmpeg.on('error', (error) => {
    // Surfaced through the caller's promise rather than thrown from an event
    // handler, where it would become an uncaught exception and skip cleanup.
    onError(error.code === 'ENOENT' ? new Error('ffmpeg not found on PATH') : error);
  });
  ffmpeg.on('close', (code) => onExit(code, stderr));
  return ffmpeg;
}

/** Respect stdin backpressure, or a long render will balloon in memory. */
function write(stream, buffer) {
  return new Promise((resolveWrite) => {
    if (stream.write(buffer)) resolveWrite();
    else stream.once('drain', resolveWrite);
  });
}

async function renderAspect({ page, aspectName, viewport, scale, fps, frameCount, audioPath, outPath }) {
  const args = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (audioPath) args.push('-i', audioPath);

  const filters = [];
  if (scale !== 1) {
    // Frames were captured supersampled; lanczos back down to target keeps the
    // glow edges clean instead of aliased.
    filters.push(`scale=${viewport.width}:${viewport.height}:flags=lanczos`);
  }
  if (filters.length) args.push('-vf', filters.join(','));

  args.push(
    '-map', '0:v',
    ...(audioPath ? ['-map', '1:a'] : []),
    '-c:v', 'libx264',
    '-preset', 'slow',
    // Near-black backgrounds with soft neon glow are H.264's banding worst case;
    // a lower CRF than usual is cheap insurance against rings around each ball.
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-r', String(fps),
    '-g', String(fps * 2),
    ...(audioPath ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-movflags', '+faststart',
    outPath
  );

  let exitCode = null;
  let exitStderr = '';
  const done = new Promise((resolveDone, rejectDone) => {
    const ffmpeg = runFfmpeg(
      args,
      (code, stderr) => {
        exitCode = code;
        exitStderr = stderr;
        resolveDone();
      },
      rejectDone
    );
    // Rejecting rather than rethrowing: a throw inside this executor's catch is an
    // unhandled rejection, which tears the process down before the cleanup in
    // main()'s finally block can run.
    encodeFrames(ffmpeg).catch((error) => {
      try { ffmpeg.kill(); } catch { /* already gone */ }
      rejectDone(error);
    });
  });

  async function encodeFrames(ffmpeg) {
    const started = Date.now();
    for (let frame = 0; frame < frameCount; frame++) {
      // Half-open range: the frame at exactly `totalDuration` is identical to frame 0,
      // and including it makes every autoloop stutter on a duplicated frame.
      const t = frame / fps;
      let shot;
      try {
        await page.evaluate((time) => window.__polyrizzems.seek(time), t);
        shot = await page.screenshot({ type: 'png', captureBeyondViewport: false, optimizeForSpeed: true });
      } catch (error) {
        if (/execution context was destroyed|Target closed/i.test(String(error?.message))) {
          throw new Error(
            `the page reloaded at frame ${frame} of ${frameCount}. The render server runs with hot ` +
            `reload disabled, so this usually means the browser crashed or the process was interrupted.`
          );
        }
        throw error;
      }
      await write(ffmpeg.stdin, shot);

      if (frame % 60 === 0 || frame === frameCount - 1) {
        const pct = ((frame + 1) / frameCount) * 100;
        const rate = (frame + 1) / ((Date.now() - started) / 1000);
        process.stdout.write(
          `\r  ${aspectName}: ${String(frame + 1).padStart(5)}/${frameCount} frames (${pct.toFixed(1)}%, ${rate.toFixed(1)} fps)   `
        );
      }
    }
    ffmpeg.stdin.end();
    process.stdout.write('\n');
  }

  await done;
  if (exitCode !== 0) {
    console.error(exitStderr.split('\n').slice(-25).join('\n'));
    throw new Error(`ffmpeg exited with code ${exitCode}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const aspectNames = options.aspect === 'both' ? Object.keys(ASPECTS) : [options.aspect];

  const specFile = join(appDir, 'public', 'specs', `${options.spec}.json`);
  if (!existsSync(specFile)) fail(`no spec at ${specFile}`);

  mkdirSync(options.out, { recursive: true });

  console.log(`Rendering "${options.spec}" → ${aspectNames.join(', ')} @ ${options.fps}fps (×${options.scale} supersample)`);

  const { server, port } = await startServer();
  let browser;
  let audioPath = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        // rAF and timers are throttled in backgrounded renderers, which would stall
        // a headless render that nobody is looking at.
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        // Worth 5x here. Headless routes compositing through SwiftShader by default,
        // and every screenshot then waits ~300ms on a GPU frame it doesn't need;
        // the software raster path captures the same pixels in ~55ms.
        '--disable-gpu',
        '--hide-scrollbars',
        '--force-color-profile=srgb',
        '--font-render-hinting=none',
        '--mute-audio',
      ],
    });

    // Audio is viewport-independent, so it's rendered once and shared by both cuts.
    if (options.audio) {
      const first = ASPECTS[aspectNames[0]];
      const { page, info } = await openRenderPage(browser, port, options.spec, first, 1);
      process.stdout.write('  rendering audio... ');
      const audio = await page.evaluate(() => window.__polyrizzems.renderAudio());
      audioPath = join(options.out, `${options.spec}.wav`);
      writeFileSync(audioPath, Buffer.from(audio.base64, 'base64'));
      console.log(
        `${audio.duration.toFixed(2)}s, peak ${audio.peak.toFixed(2)}` +
          (audio.normalised < 1 ? `, scaled ${audio.normalised.toFixed(3)} to avoid clipping` : '') +
          (audio.tailFolded ? ', tail folded for a seamless loop' : '')
      );
      if (!info.isLoopable) {
        console.log('  note: this spec has events, so it does not loop — audio tails were faded instead.');
      }
      await page.close();
    }

    for (const aspectName of aspectNames) {
      const viewport = ASPECTS[aspectName];
      const { page, info } = await openRenderPage(browser, port, options.spec, viewport, options.scale);

      let duration = info.totalDuration;
      if (options.bars !== null) {
        duration = Math.min(duration, (info.totalDuration / info.bars) * options.bars);
      }
      const frameCount = Math.round(duration * options.fps);

      const outPath = join(options.out, `${options.spec}-${aspectName}.mp4`);
      await renderAspect({
        page,
        aspectName,
        viewport,
        scale: options.scale,
        fps: options.fps,
        frameCount,
        audioPath,
        outPath,
      });
      await page.close();
      console.log(`  → ${outPath}`);
    }
  } finally {
    if (browser) await browser.close();
    await server.close();
    if (audioPath && existsSync(audioPath)) rmSync(audioPath);
  }

  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
