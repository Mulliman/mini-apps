/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Automated YouTube Video Uploader & Scheduler for POLYRIZZEMS.
 *
 * Uploads all 7 Shorts and the weekly long-form compilation video directly to YouTube
 * with metadata (title, description, tags, category: Music) extracted from week plan files,
 * and sets exact scheduled publish dates.
 *
 * Usage:
 *   node scripts/upload-week.mjs 2 --start-date 2026-09-01 --dry-run
 *   node scripts/upload-week.mjs week-2-fast-basics --start-date 2026-09-01 --time 17:00
 *   node scripts/upload-week.mjs 2 --start-date 2026-09-01 --days 1-5
 *   node scripts/upload-week.mjs 2 --start-date 2026-09-01 --days 6,7 --compilation
 *   node scripts/upload-week.mjs 2 --compilation-only --compilation-date 2026-09-07
 */

import { exec } from 'node:child_process';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import { basename, dirname, join, resolve } from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { google } from 'googleapis';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');
const planBaseDir = join(appDir, 'videos', 'plan');
const outDir = join(appDir, 'out');
const tokenPath = join(appDir, '.youtube-token.json');

// Load environment variables if present
dotenv.config({ path: join(appDir, '.env') });

const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

function printHelp() {
  console.log(`
POLYRIZZEMS YouTube Video Uploader & Scheduler
==============================================

Uploads 7 daily YouTube Shorts and 1 long-form compilation video with automated
metadata extraction and scheduled release dates.

Usage:
  node scripts/upload-week.mjs <week> [options]

Arguments:
  <week>                      Week number (e.g. 1, 2) or directory slug (e.g. week-2-fast-basics)

Options:
  --start-date <YYYY-MM-DD>   Date for Day 1 Short release (e.g. 2026-09-01)
  --time <HH:MM>              Daily release time (default: 12:00 noon)
  --timezone <offset/name>    Timezone offset (e.g. +01:00, Z, -05:00) (default: local system TZ)
  --compilation-date <DATE>   Publish date for compilation (default: Day 1 date)
  --compilation-time <HH:MM>  Publish time for compilation (default: same as --time, 12:00 noon)
  --days <range>              Filter days to upload (e.g. '1-7', '1-5', '6,7', '3', 'all') (default: 'all')
  --compilation               Include compilation upload
  --no-compilation            Skip compilation upload
  --compilation-only          Upload ONLY the compilation video
  --privacy <status>          Privacy status: 'private' (required for scheduled publishAt), 'unlisted', 'public'
  --client-secrets <path>     Path to Google OAuth client secret JSON (default: auto-detected in app root)
  --token <path>              Path to cached OAuth tokens (default: .youtube-token.json)
  --dry-run                   Preview files, metadata, and scheduled dates without uploading
  -h, --help                  Show this help message

Examples:
  # Test and preview schedule without uploading (defaults to 12:00 noon, Main video + Day 1 on Day 1):
  node scripts/upload-week.mjs 2 --start-date 2026-09-01 --dry-run

  # Upload all 7 shorts + main compilation video at 12:00 noon:
  node scripts/upload-week.mjs week-2-fast-basics --start-date 2026-09-01

  # Batch upload (to respect 10k daily API unit quota):
  node scripts/upload-week.mjs 2 --start-date 2026-09-01 --days 1-4 --compilation
  node scripts/upload-week.mjs 2 --start-date 2026-09-01 --days 5-7 --no-compilation
`);
}

function parseArgs(argv) {
  const options = {
    weekArg: null,
    startDate: null,
    time: '12:00',
    tz: null,
    compilationDate: null,
    compilationTime: null,
    days: 'all',
    compilation: null,
    compilationOnly: false,
    privacy: 'private',
    clientSecretsPath: null,
    tokenPath: tokenPath,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--compilation-only') {
      options.compilationOnly = true;
      options.compilation = true;
    } else if (arg === '--compilation') {
      options.compilation = true;
    } else if (arg === '--no-compilation') {
      options.compilation = false;
    } else if (arg === '--start-date') {
      options.startDate = argv[++i];
    } else if (arg === '--time') {
      options.time = argv[++i];
    } else if (arg === '--timezone' || arg === '--tz') {
      options.tz = argv[++i];
    } else if (arg === '--compilation-date') {
      options.compilationDate = argv[++i];
    } else if (arg === '--compilation-time') {
      options.compilationTime = argv[++i];
    } else if (arg === '--days') {
      options.days = argv[++i];
    } else if (arg === '--privacy') {
      options.privacy = argv[++i];
    } else if (arg === '--client-secrets') {
      options.clientSecretsPath = argv[++i];
    } else if (arg === '--token') {
      options.tokenPath = argv[++i];
    } else if (!arg.startsWith('--')) {
      if (options.weekArg === null) options.weekArg = arg;
    }
  }

  return options;
}

function getLocalTzOffset() {
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const absMin = Math.abs(offsetMin);
  const hours = String(Math.floor(absMin / 60)).padStart(2, '0');
  const mins = String(absMin % 60).padStart(2, '0');
  return `${sign}${hours}:${mins}`;
}

function resolveWeekDir(weekArg) {
  if (!existsSync(planBaseDir)) {
    throw new Error(`Plan directory not found: ${planBaseDir}`);
  }
  const entries = readdirSync(planBaseDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('week-'))
    .map(d => d.name);

  if (!weekArg) {
    if (entries.length === 1) return join(planBaseDir, entries[0]);
    throw new Error(`Please specify a week (available: ${entries.join(', ')})`);
  }

  if (entries.includes(weekArg)) {
    return join(planBaseDir, weekArg);
  }

  const numMatch = String(weekArg).match(/^(\d+)$/);
  if (numMatch) {
    const num = numMatch[1];
    const match = entries.find(e => e === `week-${num}` || e.startsWith(`week-${num}-`));
    if (match) return join(planBaseDir, match);
  }

  const prefixMatch = entries.find(e => e.startsWith(weekArg) || e.includes(weekArg));
  if (prefixMatch) return join(planBaseDir, prefixMatch);

  throw new Error(`Could not find week plan matching "${weekArg}". Available: ${entries.join(', ')}`);
}

function parseDayMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const filename = basename(filePath);

  // Day number
  const dayMatch = filename.match(/^([1-7])-/);
  const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : 1;

  // Spec Name
  const specMatch = content.match(/Target Spec Name[\*:\s`]+([a-zA-Z0-9_-]+)/i)
    || content.match(/public\/specs\/([a-zA-Z0-9_-]+)\.json/i);
  const specName = specMatch ? specMatch[1] : `day${dayNum}`;

  // Title
  let title = '';
  const titleMatch = content.match(/-\s+\*\*Title\*\*:\s*(.+)/i)
    || content.match(/^#+\s*(.+)/m);
  if (titleMatch) {
    title = titleMatch[1].trim().replace(/^`+|`+$/g, '');
  } else {
    title = `Polyrhythm Day ${dayNum} - POLYRIZZEMS #shorts`;
  }

  // Description
  let description = '';
  const descSectionMatch = content.match(/-\s+\*\*Description\*\*:\s*\n([\s\S]*?)(?=\n---\n|\n##|\n- \*\*|\n\*\*)/);
  if (descSectionMatch) {
    description = descSectionMatch[1].trim();
  } else {
    const shortsSection = content.match(/## 3\.\s*YouTube Shorts Metadata[\s\S]*?(?=## 4|\n---|\Z)/i);
    if (shortsSection) {
      const lines = shortsSection[0].split('\n').filter(l => !l.startsWith('##') && !l.startsWith('- **Title'));
      description = lines.join('\n').trim();
    }
  }

  // Extract tags from hashtags in description or default tags
  const hashTags = (description.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1));
  const tags = Array.from(new Set(['polyrhythm', 'musictheory', 'polyrizzems', 'music', 'shorts', ...hashTags]));

  return {
    dayNum,
    specName,
    title,
    description,
    tags,
    rawContent: content,
  };
}

function parseCompilationMetadata(weekDir, weekSlug) {
  const metaTxtPath = join(outDir, `${weekSlug}-compilation.txt`);
  let title = `POLYRIZZEMS: ${weekSlug.replace(/^week-\d+-/, '').replace(/-/g, ' ').toUpperCase()} (7 Essential Polyrhythms Compilation)`;
  let description = `Master the polyrhythms of the week with the complete POLYRIZZEMS 7-day masterclass!\n\n🕹️ PLAY ALL RHYTHMS INTERACTIVELY:\nhttps://miniapps.sammullins.co.uk/apps/music/poly-rizzems/\n\n#polyrhythm #musictheory #polyrizzems #music #compilation`;
  let tags = ['polyrhythm', 'musictheory', 'polyrizzems', 'music', 'compilation', 'rhythm'];

  if (existsSync(metaTxtPath)) {
    const raw = readFileSync(metaTxtPath, 'utf-8');
    const titleMatch = raw.match(/TITLE:\s*\n([^\n]+)/);
    if (titleMatch) title = titleMatch[1].trim();

    const descMatch = raw.match(/DESCRIPTION:\s*\n([\s\S]*?)(?=\n================|\Z)/);
    if (descMatch) description = descMatch[1].trim();

    const hashTags = (description.match(/#[a-zA-Z0-9_]+/g) || []).map(t => t.slice(1));
    tags = Array.from(new Set([...tags, ...hashTags]));
  }

  const videoPath = join(outDir, `${weekSlug}-compilation.mp4`);

  return {
    isCompilation: true,
    title,
    description,
    tags,
    videoPath,
    exists: existsSync(videoPath),
  };
}

function findShortVideoPath(specName, dayNum, weekSlug) {
  const candidates = [
    join(outDir, `${specName}-9x16.mp4`),
    join(outDir, `${specName}.mp4`),
    join(outDir, `${specName}-portrait.mp4`),
    join(outDir, `${specName}-vertical.mp4`),
    join(outDir, `${weekSlug}-day${dayNum}-9x16.mp4`),
    join(outDir, `${weekSlug}-day${dayNum}.mp4`),
    join(outDir, `day${dayNum}-9x16.mp4`),
    join(outDir, `day${dayNum}.mp4`),
  ];

  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return candidates[0]; // fallback expected path
}

function parseDaysSelection(daysOption) {
  if (!daysOption || daysOption.toLowerCase() === 'all') {
    return [1, 2, 3, 4, 5, 6, 7];
  }
  const result = new Set();
  const parts = String(daysOption).split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim(), 10));
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= 7) result.add(i);
      }
    } else {
      const n = parseInt(trimmed, 10);
      if (n >= 1 && n <= 7) result.add(n);
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

function normalizeDateInput(dateInput) {
  if (!dateInput) return null;
  const str = String(dateInput).trim();
  // DD-MM-YYYY or DD/MM/YYYY -> YYYY-MM-DD
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  return str;
}

function computeIsoPublishDate(dateStr, timeStr, tzOffset) {
  const normDate = normalizeDateInput(dateStr);
  // Format: YYYY-MM-DDTHH:MM:00+HH:MM
  const seconds = '00';
  const cleanTime = timeStr.length === 5 ? `${timeStr}:${seconds}` : timeStr;
  const isoWithOffset = `${normDate}T${cleanTime}${tzOffset}`;
  const parsed = new Date(isoWithOffset);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date/time combination: ${dateStr} ${timeStr} with TZ ${tzOffset}`);
  }
  return parsed.toISOString();
}

function addDaysToDate(dateStr, daysToAdd) {
  const normDate = normalizeDateInput(dateStr);
  const [year, month, day] = normDate.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + daysToAdd);
  return d.toISOString().slice(0, 10);
}

async function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function findClientSecrets(customPath) {
  if (customPath && existsSync(customPath)) return customPath;

  const appFiles = readdirSync(appDir);
  const secretFile = appFiles.find(f => f.startsWith('client_secret') && f.endsWith('.json'))
    || appFiles.find(f => f === 'oauth-credentials.json');

  if (secretFile) return join(appDir, secretFile);

  if (process.env.YOUTUBE_CLIENT_SECRET_FILE && existsSync(process.env.YOUTUBE_CLIENT_SECRET_FILE)) {
    return process.env.YOUTUBE_CLIENT_SECRET_FILE;
  }

  return null;
}

function openBrowser(url) {
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const cmd = isWindows ? `start "" "${url}"` : isMac ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

async function getAuthenticatedClient(clientSecretsPath, tokenStorePath) {
  let clientId = process.env.YOUTUBE_CLIENT_ID;
  let clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const PORT = 3333;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || `http://localhost:${PORT}/oauth2callback`;

  const secretsFile = findClientSecrets(clientSecretsPath);

  if (secretsFile) {
    const raw = JSON.parse(readFileSync(secretsFile, 'utf-8'));
    const creds = raw.installed || raw.web || raw;
    clientId = creds.client_id;
    clientSecret = creds.client_secret;
  }

  if (!clientId || !clientSecret) {
    throw new Error(
      `Google OAuth credentials missing!\n` +
      `Please provide OAuth 2.0 credentials using one of the following methods:\n` +
      `1. Download 'client_secret.json' from Google Cloud Console into apps/music/poly-rizzems/client_secret.json\n` +
      `2. Or set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in apps/music/poly-rizzems/.env\n` +
      `See .agents/skills/polyrizzems-upload/SKILL.md for setup instructions.`
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  // Save tokens on update
  oauth2Client.on('tokens', tokens => {
    let existing = {};
    if (existsSync(tokenStorePath)) {
      try {
        existing = JSON.parse(readFileSync(tokenStorePath, 'utf-8'));
      } catch {}
    }
    const combined = { ...existing, ...tokens };
    writeFileSync(tokenStorePath, JSON.stringify(combined, null, 2), 'utf-8');
  });

  // Check for cached token
  if (existsSync(tokenStorePath)) {
    try {
      const cached = JSON.parse(readFileSync(tokenStorePath, 'utf-8'));
      oauth2Client.setCredentials(cached);
      return oauth2Client;
    } catch (e) {
      console.warn(`Could not load cached tokens: ${e.message}. Starting fresh login...`);
    }
  }

  // Interactive OAuth authorization flow via local HTTP server
  console.log(`\nStarting Google OAuth 2.0 authorization flow...`);

  return new Promise((resolveAuth, rejectAuth) => {
    let isResolved = false;

    const cleanup = () => {
      if (!isResolved) {
        isResolved = true;
        try { server.close(); } catch {}
      }
    };

    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
        const code = reqUrl.searchParams.get('code');
        const error = reqUrl.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<h1>Authentication Failed</h1><p>${error}</p>`);
          cleanup();
          rejectAuth(new Error(`OAuth error: ${error}`));
          return;
        }

        if (code) {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          writeFileSync(tokenStorePath, JSON.stringify(tokens, null, 2), 'utf-8');

          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc;">
                <h1 style="color: #38bdf8;">Authorization Successful!</h1>
                <p>Your YouTube authentication token has been saved. You can close this tab and return to the terminal.</p>
              </body>
            </html>
          `);

          cleanup();
          console.log(`OAuth token received and saved to: ${tokenStorePath}`);
          resolveAuth(oauth2Client);
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error: ${err.message}`);
        cleanup();
        rejectAuth(err);
      }
    });

    server.listen(PORT, () => {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: OAUTH_SCOPES,
        prompt: 'consent',
      });

      console.log(`\nOpening browser for Google authorization:\n${authUrl}\n`);
      openBrowser(authUrl);
      console.log(`If the browser did not open automatically, copy and paste the URL above into your browser.\n`);
    });

    server.on('error', err => {
      cleanup();
      rejectAuth(new Error(`Failed to start local OAuth server on port ${PORT}: ${err.message}`));
    });
  });
}

async function uploadVideoWithProgress({ youtube, filePath, title, description, tags, publishAt, privacyStatus }) {
  const fileSize = statSync(filePath).size;
  const sizeMB = (fileSize / (1024 * 1024)).toFixed(1);

  console.log(`\n------------------------------------------------------------`);
  console.log(`Uploading: "${title}"`);
  console.log(`File:      ${filePath} (${sizeMB} MB)`);
  if (publishAt) {
    console.log(`Schedule:  Publishing on ${publishAt} (Private until release)`);
  } else {
    console.log(`Privacy:   ${privacyStatus}`);
  }
  console.log(`------------------------------------------------------------`);

  const requestBody = {
    snippet: {
      title,
      description,
      tags,
      categoryId: '10', // Music category
      defaultLanguage: 'en',
      defaultAudioLanguage: 'en',
    },
    status: {
      privacyStatus: privacyStatus || 'private',
      selfDeclaredMadeForKids: false,
      embeddable: true,
      license: 'youtube',
    },
  };

  if (publishAt && privacyStatus === 'private') {
    requestBody.status.publishAt = publishAt;
  }

  const mediaStream = createReadStream(filePath);
  let bytesUploaded = 0;
  let lastLoggedPercent = -1;

  mediaStream.on('data', chunk => {
    bytesUploaded += chunk.length;
    const percent = Math.floor((bytesUploaded / fileSize) * 100);
    if (percent !== lastLoggedPercent && percent % 10 === 0) {
      lastLoggedPercent = percent;
      process.stdout.write(`\r[Upload Progress] ${percent}% (${(bytesUploaded / 1024 / 1024).toFixed(1)} / ${sizeMB} MB)`);
    }
  });

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody,
    media: {
      body: mediaStream,
    },
  });

  process.stdout.write(`\r[Upload Progress] 100% (${sizeMB} MB) - Completed!\n`);

  const videoId = res.data.id;
  console.log(`SUCCESS! Video ID: ${videoId}`);
  console.log(`Watch URL:  https://youtu.be/${videoId}`);
  console.log(`Studio URL: https://studio.youtube.com/video/${videoId}/edit`);

  return res.data;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  console.log(`\n======================================================`);
  console.log(`  POLYRIZZEMS YouTube Video Uploader & Scheduler`);
  console.log(`======================================================\n`);

  // 1. Resolve Week Directory
  const weekDir = resolveWeekDir(options.weekArg);
  const weekSlug = basename(weekDir);
  console.log(`Week:       ${weekSlug}`);
  console.log(`Plan Dir:   ${weekDir}`);

  // 2. Resolve Start Date & Times
  let startDate = options.startDate;
  if (!startDate && !options.compilationOnly) {
    startDate = await promptUser(`Enter release start date for Day 1 Short (YYYY-MM-DD): `);
    if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      throw new Error(`Invalid start date format. Expected YYYY-MM-DD.`);
    }
  }

  const tzOffset = options.tz || getLocalTzOffset();
  console.log(`Timezone:   ${tzOffset}`);
  console.log(`Daily Time: ${options.time}`);

  // 3. Collect Plan Markdown Files (Days 1–7)
  const planFiles = readdirSync(weekDir)
    .filter(f => /^[1-7]-.+\.md$/.test(f))
    .sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));

  if (planFiles.length === 0) {
    throw new Error(`No daily plan files (1-*.md to 7-*.md) found in ${weekDir}`);
  }

  const selectedDays = parseDaysSelection(options.days);
  const uploadQueue = [];

  if (!options.compilationOnly) {
    for (const file of planFiles) {
      const filePath = join(weekDir, file);
      const dayData = parseDayMarkdown(filePath);

      if (!selectedDays.includes(dayData.dayNum)) continue;

      const videoFile = findShortVideoPath(dayData.specName, dayData.dayNum, weekSlug);
      const dateForDay = addDaysToDate(startDate, dayData.dayNum - 1);
      const publishAtIso = computeIsoPublishDate(dateForDay, options.time, tzOffset);

      uploadQueue.push({
        type: 'short',
        dayNum: dayData.dayNum,
        specName: dayData.specName,
        title: dayData.title,
        description: dayData.description,
        tags: dayData.tags,
        videoPath: videoFile,
        exists: existsSync(videoFile),
        publishDate: dateForDay,
        publishTime: options.time,
        publishAtIso,
      });
    }
  }

  // 4. Compilation Video (Main Masterclass Video - Day 1 at 12:00 noon)
  const shouldIncludeCompilation = options.compilationOnly ||
    options.compilation === true ||
    (options.compilation === null && (selectedDays.includes(1) || options.days === 'all'));

  if (shouldIncludeCompilation) {
    const compMeta = parseCompilationMetadata(weekDir, weekSlug);
    const compDate = normalizeDateInput(options.compilationDate || startDate);
    if (!compDate) {
      throw new Error(`Please specify --compilation-date YYYY-MM-DD for compilation upload`);
    }
    const compTime = options.compilationTime || options.time;
    const compPublishAtIso = computeIsoPublishDate(compDate, compTime, tzOffset);

    const compItem = {
      type: 'compilation',
      dayNum: null,
      specName: `${weekSlug}-compilation`,
      title: compMeta.title,
      description: compMeta.description,
      tags: compMeta.tags,
      videoPath: compMeta.videoPath,
      exists: compMeta.exists,
      publishDate: compDate,
      publishTime: compTime,
      publishAtIso: compPublishAtIso,
    };

    // If Day 1 is included, place compilation right at the start alongside Day 1
    if (uploadQueue.length > 0 && uploadQueue[0].dayNum === 1) {
      uploadQueue.unshift(compItem);
    } else {
      uploadQueue.push(compItem);
    }
  }

  // 5. Verification / Schedule Table Preview
  console.log(`\n---------------------------------------------------------------------------------------------------`);
  console.log(` SCHEDULE PREVIEW (${uploadQueue.length} Videos queued)`);
  console.log(`---------------------------------------------------------------------------------------------------`);
  console.log(
    `#`.padEnd(4) +
    `TYPE`.padEnd(14) +
    `DATE / TIME`.padEnd(20) +
    `EXISTS`.padEnd(8) +
    `TITLE`
  );
  console.log(`-`.repeat(95));

  for (const item of uploadQueue) {
    const numStr = item.dayNum ? `D${item.dayNum}` : `Full`;
    const typeStr = item.type.toUpperCase();
    const dateTimeStr = `${item.publishDate} ${item.publishTime}`;
    const existsStr = item.exists ? ' [OK] ' : ' [MISS] ';
    console.log(
      numStr.padEnd(4) +
      typeStr.padEnd(14) +
      dateTimeStr.padEnd(20) +
      existsStr.padEnd(8) +
      item.title
    );
  }
  console.log(`---------------------------------------------------------------------------------------------------\n`);

  // Check missing video files
  const missingFiles = uploadQueue.filter(i => !i.exists);
  if (missingFiles.length > 0) {
    console.warn(`WARNING: ${missingFiles.length} video file(s) are missing from disk:`);
    for (const m of missingFiles) {
      console.warn(`  - [Missing] ${m.videoPath}`);
    }
    console.warn(`Please run render / compile-week before performing the final upload.`);
    if (!options.dryRun) {
      throw new Error(`Cannot upload missing video files. Run with --dry-run or render missing videos first.`);
    }
  }

  // Quota calculation warning
  const estimatedUnits = uploadQueue.length * 1600;
  console.log(`[API Quota Estimate] ${uploadQueue.length} videos x 1,600 units = ${estimatedUnits.toLocaleString()} units`);
  if (estimatedUnits > 10000) {
    console.log(`NOTE: This batch requires > 10,000 units (default daily YouTube Data API quota).`);
    console.log(`      If you have not yet requested a quota bump, upload in 2 batches (e.g. --days 1-5 and --days 6,7 --compilation).`);
  }

  if (options.dryRun) {
    console.log(`\n======================================================`);
    console.log(`  DRY RUN COMPLETED (No changes made, 0 API units used)`);
    console.log(`======================================================\n`);
    return;
  }

  // Confirm before starting uploads
  const confirm = await promptUser(`\nProceed with uploading ${uploadQueue.length} video(s) to YouTube? (y/N): `);
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log(`Upload cancelled by user.`);
    return;
  }

  // Authenticate
  const auth = await getAuthenticatedClient(options.clientSecretsPath, options.tokenPath);
  const youtube = google.youtube({ version: 'v3', auth });

  const results = [];
  for (let i = 0; i < uploadQueue.length; i++) {
    const item = uploadQueue[i];
    console.log(`\n[${i + 1}/${uploadQueue.length}] Processing ${item.type.toUpperCase()}: ${item.title}`);

    try {
      const res = await uploadVideoWithProgress({
        youtube,
        filePath: item.videoPath,
        title: item.title,
        description: item.description,
        tags: item.tags,
        publishAt: item.publishAtIso,
        privacyStatus: options.privacy,
      });

      results.push({ item, success: true, videoId: res.id });
    } catch (err) {
      console.error(`\nFAILED to upload "${item.title}":`, err.message);
      results.push({ item, success: false, error: err.message });
      const proceed = await promptUser(`An error occurred. Continue with remaining videos? (y/N): `);
      if (proceed.toLowerCase() !== 'y') break;
    }
  }

  console.log(`\n======================================================`);
  console.log(`  UPLOAD SUMMARY`);
  console.log(`======================================================`);
  for (const r of results) {
    const status = r.success ? `SUCCESS (ID: ${r.videoId})` : `FAILED (${r.error})`;
    console.log(`- ${r.item.title}: ${status}`);
  }
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('\nUpload Execution Error:', err.message || err);
  process.exit(1);
});
