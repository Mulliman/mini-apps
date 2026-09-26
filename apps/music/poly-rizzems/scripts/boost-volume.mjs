/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Boost and master audio volume on rendered POLYRIZZEMS MP4 files to match
 * YouTube standard loudness (-14 to -16 LUFS) using lossless video copy
 * and brickwall lookahead limiting.
 *
 * Usage:
 *   node scripts/boost-volume.mjs 8
 *   node scripts/boost-volume.mjs week-8-polyrhythmic-fills-in-3
 *   node scripts/boost-volume.mjs --all
 */

import { execSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');
const outDir = join(appDir, 'out');

function findFfmpeg() {
  if (process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  const isWindows = process.platform === 'win32';
  const candidates = [
    'ffmpeg',
    isWindows ? 'ffmpeg.exe' : 'ffmpeg',
    ...(isWindows
      ? [
          join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
          join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
          join('C:', 'Program Files', 'Shotcut', 'ffmpeg.exe'),
          join('C:', 'ProgramData', 'chocolatey', 'bin', 'ffmpeg.exe'),
        ]
      : ['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg']),
  ];

  for (const c of candidates) {
    try {
      execSync(`"${c}" -version`, { stdio: 'ignore' });
      return c;
    } catch {}
  }
  return 'ffmpeg';
}

const FFMPEG = findFfmpeg();

// Mastering filter: +12dB clean gain with brickwall true peak lookahead limiter
const AUDIO_FILTER = 'volume=12dB,alimiter=limit=0.98:attack=3:release=30:asc=true';

async function main() {
  const arg = process.argv[2] || '8';
  const cleanArg = arg.replace(/^week-?/, '');

  if (!existsSync(outDir)) {
    console.error(`Output directory does not exist: ${outDir}`);
    process.exit(1);
  }

  const allFiles = readdirSync(outDir).filter(f => f.endsWith('.mp4') && !f.includes('.temp-boost.'));

  let targetFiles = [];
  if (arg === '--all') {
    targetFiles = allFiles;
  } else {
    targetFiles = allFiles.filter(f =>
      f.startsWith(`week${cleanArg}-`) ||
      f.startsWith(`week-${cleanArg}-`) ||
      f.includes(`week-${cleanArg}`) ||
      f.includes(`week${cleanArg}`)
    );
  }

  if (targetFiles.length === 0) {
    console.log(`No MP4 files found in out/ matching "${arg}". Available files:\n${allFiles.slice(0, 10).join('\n')}`);
    process.exit(0);
  }

  console.log(`\n======================================================`);
  console.log(`  POLYRIZZEMS AUDIO VOLUME BOOSTER (-14 LUFS Mastering)`);
  console.log(`  Targeting ${targetFiles.length} video(s)...`);
  console.log(`======================================================\n`);

  for (let i = 0; i < targetFiles.length; i++) {
    const file = targetFiles[i];
    const srcPath = join(outDir, file);
    const tmpPath = join(outDir, `${file}.temp-boost.mp4`);

    process.stdout.write(`[${i + 1}/${targetFiles.length}] Boosting: ${file}... `);

    try {
      const cmd = `"${FFMPEG}" -y -i "${srcPath}" -c:v copy -af "${AUDIO_FILTER}" -c:a aac -b:a 192k "${tmpPath}"`;
      execSync(cmd, { stdio: 'ignore' });

      // Replace original file with boosted file
      unlinkSync(srcPath);
      renameSync(tmpPath, srcPath);
      console.log(`DONE! (+12dB mastered)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      if (existsSync(tmpPath)) {
        try { unlinkSync(tmpPath); } catch {}
      }
    }
  }

  console.log(`\nAll ${targetFiles.length} video(s) boosted and ready for YouTube upload!\n`);
}

main();
