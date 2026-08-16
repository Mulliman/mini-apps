/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Automated YouTube Video Uploader, Scheduler & Batch Queue for POLYRIZZEMS.
 *
 * Uploads daily YouTube Shorts and weekly long-form compilation videos directly to YouTube
 * with metadata (title, description, tags, category: Music) extracted from week plan files,
 * records upload history to `videos/upload-history.json`, and provides a seamless
 * "upload next batch" automated queue.
 *
 * Usage:
 *   node scripts/upload-week.mjs next                          # Automatically resolve and upload the next pending batch!
 *   node scripts/upload-week.mjs next --dry-run                # Preview next batch without uploading
 *   node scripts/upload-week.mjs status                        # Show visual dashboard of all weeks (uploaded vs pending)
 *   node scripts/upload-week.mjs sync                          # Sync/reconcile upload history with YouTube channel
 *   node scripts/upload-week.mjs 2 --start-date 2026-09-08     # Upload specific week with explicit date
 *   node scripts/upload-week.mjs 2 --days 5-7 --no-compilation # Upload specific days
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
const historyPath = join(appDir, 'videos', 'upload-history.json');
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

Uploads daily YouTube Shorts and long-form compilation videos with automated
metadata extraction, scheduled release dates, and persistent queue tracking.

Usage:
  node scripts/upload-week.mjs [command/week] [options]

Commands:
  next                        Automatically find, schedule, and upload the NEXT pending batch
  status                      Display upload and schedule status across all planned weeks
  sync                        Fetch channel uploads from YouTube to update upload-history.json
  <week>                      Week number (e.g. 1, 2) or directory slug (e.g. week-2-fast-basics)

Options:
  --start-date <YYYY-MM-DD>   Date for Day 1 Short release (or calculated automatically for 'next')
  --time <HH:MM>              Daily release time (default: 12:00 noon)
  --timezone <offset/name>    Timezone offset (e.g. +01:00, Z, -05:00) (default: local system TZ)
  --compilation-date <DATE>   Publish date for compilation (default: Day 1 date)
  --compilation-time <HH:MM>  Publish time for compilation (default: same as --time, 12:00 noon)
  --days <range>              Filter days to upload (e.g. '1-7', '1-4', '5-7', 'all') (default: 'all')
  --compilation               Include compilation upload
  --no-compilation            Skip compilation upload
  --compilation-only          Upload ONLY the compilation video
  --privacy <status>          Privacy status: 'private' (required for scheduled publishAt), 'unlisted', 'public'
  -y, --yes                   Skip interactive confirmation prompt
  --client-secrets <path>     Path to Google OAuth client secret JSON (default: auto-detected in app root)
  --token <path>              Path to cached OAuth tokens (default: .youtube-token.json)
  --dry-run                   Preview files, metadata, and scheduled dates without uploading
  -h, --help                  Show this help message

Examples:
  # Check overall status of all planned weeks:
  node scripts/upload-week.mjs status

  # Automatically preview what batch is queued next:
  node scripts/upload-week.mjs next --dry-run

  # Automatically upload the next batch:
  node scripts/upload-week.mjs next -y

  # Upload week 2 batch 2 manually:
  node scripts/upload-week.mjs 2 --start-date 2026-08-17 --days 5-7 --no-compilation -y
`);
}

function parseArgs(argv) {
  const options = {
    command: null,
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
    autoYes: false,
    isNext: false,
    isStatus: false,
    isSync: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (arg === '-y' || arg === '--yes') {
      options.autoYes = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--next' || arg === '--next-batch' || arg === 'next') {
      options.isNext = true;
    } else if (arg === '--status' || arg === 'status') {
      options.isStatus = true;
    } else if (arg === '--sync' || arg === 'sync') {
      options.isSync = true;
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
      if (arg === 'next') options.isNext = true;
      else if (arg === 'status') options.isStatus = true;
      else if (arg === 'sync') options.isSync = true;
      else if (options.weekArg === null) options.weekArg = arg;
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

// -------------------------------------------------------------------------------------------------
// History Management
// -------------------------------------------------------------------------------------------------

function loadHistory() {
  if (existsSync(historyPath)) {
    try {
      const data = JSON.parse(readFileSync(historyPath, 'utf-8'));
      if (!data.uploads) data.uploads = {};
      return data;
    } catch (e) {
      console.warn(`Could not parse ${historyPath}: ${e.message}`);
    }
  }
  return { version: 1, lastUpdated: new Date().toISOString(), uploads: {} };
}

function saveHistory(history) {
  history.lastUpdated = new Date().toISOString();
  writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
}

function recordUpload(history, { id, weekSlug, weekNum, type, dayNum, title, videoId, publishAt }) {
  history.uploads[id] = {
    id,
    weekSlug,
    weekNum,
    type,
    dayNum: dayNum ?? null,
    title,
    videoId,
    watchUrl: `https://youtu.be/${videoId}`,
    publishAt: publishAt || null,
    uploadedAt: new Date().toISOString(),
  };
  saveHistory(history);
}

// -------------------------------------------------------------------------------------------------
// Week Discovery & Metadata Parsing
// -------------------------------------------------------------------------------------------------

function listAllWeeks() {
  if (!existsSync(planBaseDir)) return [];
  return readdirSync(planBaseDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('week-'))
    .map(d => {
      const match = d.name.match(/^week-(\d+)(?:-(.*))?$/);
      return {
        slug: d.name,
        num: match ? parseInt(match[1], 10) : 999,
        theme: match && match[2] ? match[2] : d.name,
        dir: join(planBaseDir, d.name),
      };
    })
    .sort((a, b) => a.num - b.num);
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
  return candidates[0];
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

// -------------------------------------------------------------------------------------------------
// Status & Dashboard View
// -------------------------------------------------------------------------------------------------

function showStatus() {
  const history = loadHistory();
  const weeks = listAllWeeks();

  console.log(`\n===================================================================================================`);
  console.log(`  POLYRIZZEMS YouTube Publishing Status Dashboard`);
  console.log(`===================================================================================================\n`);

  for (const week of weeks) {
    console.log(`▶ WEEK ${week.num}: ${week.slug.toUpperCase()}`);
    console.log(`-`.repeat(99));
    console.log(
      `ITEM`.padEnd(14) +
      `STATUS`.padEnd(12) +
      `SCHEDULED / RELEASE`.padEnd(24) +
      `YOUTUBE ID`.padEnd(16) +
      `TITLE`
    );
    console.log(`-`.repeat(99));

    // Compilation
    const compId = `${week.slug}-compilation`;
    const compRecord = history.uploads[compId];
    const compStatus = compRecord ? '[UPLOADED]' : '[PENDING]';
    const compDate = compRecord ? (compRecord.publishAt ? compRecord.publishAt.slice(0, 16).replace('T', ' ') : 'Published') : '-';
    const compVideoId = compRecord ? compRecord.videoId : '-';
    const compMeta = parseCompilationMetadata(week.dir, week.slug);
    console.log(
      `Compilation`.padEnd(14) +
      compStatus.padEnd(12) +
      compDate.padEnd(24) +
      compVideoId.padEnd(16) +
      compMeta.title
    );

    // Days 1-7
    const planFiles = readdirSync(week.dir).filter(f => /^[1-7]-.+\.md$/.test(f)).sort();
    for (const file of planFiles) {
      const dayData = parseDayMarkdown(join(week.dir, file));
      const record = history.uploads[dayData.specName];
      const status = record ? '[UPLOADED]' : '[PENDING]';
      const date = record ? (record.publishAt ? record.publishAt.slice(0, 16).replace('T', ' ') : 'Published') : '-';
      const videoId = record ? record.videoId : '-';

      console.log(
        `Day ${dayData.dayNum}`.padEnd(14) +
        status.padEnd(12) +
        date.padEnd(24) +
        videoId.padEnd(16) +
        dayData.title
      );
    }
    console.log(`\n`);
  }

  const nextBatch = resolveNextBatch(history, weeks);
  if (nextBatch) {
    console.log(`---------------------------------------------------------------------------------------------------`);
    console.log(`👉 NEXT QUEUED BATCH: Week ${nextBatch.weekNum} (${nextBatch.batchName})`);
    console.log(`   Scope:        ${nextBatch.description}`);
    console.log(`   Calculated:   Start Date ${nextBatch.startDate} (at 12:00)`);
    console.log(`   Command:      node scripts/upload-week.mjs next -y`);
    console.log(`---------------------------------------------------------------------------------------------------\n`);
  } else {
    console.log(`🎉 All planned weeks and videos are currently uploaded!\n`);
  }
}

// -------------------------------------------------------------------------------------------------
// Next Batch Resolver
// -------------------------------------------------------------------------------------------------

function getLatestScheduledDate(history) {
  let latestDate = null;
  for (const item of Object.values(history.uploads || {})) {
    if (item.publishAt) {
      const d = item.publishAt.slice(0, 10);
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    }
  }
  return latestDate;
}

function resolveNextBatch(history, weeks) {
  for (const week of weeks) {
    const planFiles = readdirSync(week.dir).filter(f => /^[1-7]-.+\.md$/.test(f)).sort();
    const daysData = planFiles.map(f => parseDayMarkdown(join(week.dir, f)));

    const compId = `${week.slug}-compilation`;
    const compUploaded = Boolean(history.uploads[compId]);

    const batch1Days = daysData.filter(d => d.dayNum >= 1 && d.dayNum <= 4);
    const batch2Days = daysData.filter(d => d.dayNum >= 5 && d.dayNum <= 7);

    const batch1Uploaded = compUploaded && batch1Days.every(d => Boolean(history.uploads[d.specName]));
    const batch2Uploaded = batch2Days.every(d => Boolean(history.uploads[d.specName]));

    if (!batch1Uploaded) {
      // Week N Batch 1 is next
      // Start date: if previous week exists, next day after previous week's Day 7, or today/tomorrow
      const latestDate = getLatestScheduledDate(history);
      const startDate = latestDate ? addDaysToDate(latestDate, 1) : addDaysToDate(new Date().toISOString().slice(0, 10), 1);

      return {
        weekArg: String(week.num),
        weekNum: week.num,
        weekSlug: week.slug,
        batchNum: 1,
        batchName: 'Batch 1 (Compilation + Days 1–4)',
        days: '1-4',
        compilation: true,
        startDate,
        description: `Compilation Masterclass + Days 1–4 Shorts (5 videos, 8,000 units)`,
      };
    }

    if (!batch2Uploaded) {
      // Week N Batch 2 is next
      // Day 4 date is known from Batch 1!
      const day4Record = history.uploads[daysData.find(d => d.dayNum === 4)?.specName];
      let startDate = null;
      if (day4Record && day4Record.publishAt) {
        // Day 4 date is startDate + 3 days -> startDate = Day 4 date - 3 days
        const day4Date = day4Record.publishAt.slice(0, 10);
        startDate = addDaysToDate(day4Date, -3);
      } else {
        const latestDate = getLatestScheduledDate(history);
        startDate = latestDate ? addDaysToDate(latestDate, -3) : addDaysToDate(new Date().toISOString().slice(0, 10), 1);
      }

      return {
        weekArg: String(week.num),
        weekNum: week.num,
        weekSlug: week.slug,
        batchNum: 2,
        batchName: 'Batch 2 (Days 5–7)',
        days: '5-7',
        compilation: false,
        startDate,
        description: `Days 5–7 Shorts (3 videos, 4,800 units)`,
      };
    }
  }
  return null;
}

// -------------------------------------------------------------------------------------------------
// Sync with YouTube Channel
// -------------------------------------------------------------------------------------------------

async function syncWithYouTube(options) {
  console.log(`\n======================================================`);
  console.log(`  Syncing Upload History with YouTube Channel`);
  console.log(`======================================================\n`);

  const auth = await getAuthenticatedClient(options.clientSecretsPath, options.tokenPath);
  const youtube = google.youtube({ version: 'v3', auth });

  console.log(`Fetching uploaded videos from YouTube channel...`);
  const channelRes = await youtube.channels.list({
    mine: true,
    part: ['contentDetails', 'snippet'],
  });

  const uploadsPlaylistId = channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  const channelTitle = channelRes.data.items?.[0]?.snippet?.title;
  console.log(`Channel: ${channelTitle} (Uploads ID: ${uploadsPlaylistId})\n`);

  if (!uploadsPlaylistId) {
    throw new Error(`Could not find uploads playlist for authenticated YouTube channel.`);
  }

  let pageToken = undefined;
  const videoIds = [];
  do {
    const playlistRes = await youtube.playlistItems.list({
      playlistId: uploadsPlaylistId,
      part: ['snippet', 'contentDetails'],
      maxResults: 50,
      pageToken,
    });
    for (const item of playlistRes.data.items || []) {
      videoIds.push(item.contentDetails.videoId);
    }
    pageToken = playlistRes.data.nextPageToken;
  } while (pageToken);

  console.log(`Found ${videoIds.length} uploaded video(s) on channel.`);
  if (videoIds.length === 0) return loadHistory();

  const remoteVideos = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const videoRes = await youtube.videos.list({
      id: chunk,
      part: ['snippet', 'status'],
    });
    for (const v of videoRes.data.items || []) {
      remoteVideos.push(v);
    }
  }

  const history = loadHistory();
  const weeks = listAllWeeks();
  let matchedCount = 0;

  for (const week of weeks) {
    // Match Compilation
    const compMeta = parseCompilationMetadata(week.dir, week.slug);
    const matchedComp = remoteVideos.find(v => {
      const title = (v.snippet.title || '').toLowerCase();
      if (!title.includes('compilation') && !title.includes('masterclass')) return false;
      const slugClean = week.slug.replace(/^week-\d+-/, '').replace(/-/g, ' ').toLowerCase();
      const themeClean = week.theme.replace(/-/g, ' ').toLowerCase();
      const words = slugClean.split(' ').filter(w => w.length > 3);
      return title.includes(slugClean) || title.includes(themeClean) || words.some(w => title.includes(w)) || title.includes(`week ${week.num}`);
    });

    if (matchedComp) {
      const id = `${week.slug}-compilation`;
      history.uploads[id] = {
        id,
        weekSlug: week.slug,
        weekNum: week.num,
        type: 'compilation',
        dayNum: null,
        title: matchedComp.snippet.title,
        videoId: matchedComp.id,
        watchUrl: `https://youtu.be/${matchedComp.id}`,
        publishAt: matchedComp.status.publishAt || matchedComp.snippet.publishedAt,
        uploadedAt: matchedComp.snippet.publishedAt,
      };
      matchedCount++;
    }

    // Match Days 1-7
    const planFiles = readdirSync(week.dir).filter(f => /^[1-7]-.+\.md$/.test(f));
    for (const file of planFiles) {
      const dayData = parseDayMarkdown(join(week.dir, file));
      const id = dayData.specName;
      const matched = remoteVideos.find(v => {
        const title = (v.snippet.title || '').toLowerCase();
        const desc = (v.snippet.description || '').toLowerCase();
        if (title === dayData.title.toLowerCase()) return true;
        if (desc.includes(dayData.specName.toLowerCase())) return true;
        const cleanDayTitle = dayData.title.split('-')[0].trim().toLowerCase();
        return title.startsWith(cleanDayTitle);
      });

      if (matched) {
        history.uploads[id] = {
          id,
          weekSlug: week.slug,
          weekNum: week.num,
          type: 'short',
          dayNum: dayData.dayNum,
          title: matched.snippet.title,
          videoId: matched.id,
          watchUrl: `https://youtu.be/${matched.id}`,
          publishAt: matched.status.publishAt || matched.snippet.publishedAt,
          uploadedAt: matched.snippet.publishedAt,
        };
        matchedCount++;
      }
    }
  }

  saveHistory(history);
  console.log(`Successfully synced and updated ${matchedCount} matched video(s) in: ${historyPath}\n`);
  showStatus();
}

// -------------------------------------------------------------------------------------------------
// Upload Execution Core
// -------------------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------------------
// Main Routine
// -------------------------------------------------------------------------------------------------

async function main() {
  const options = parseArgs(process.argv.slice(2));

  // Handle status command
  if (options.isStatus) {
    showStatus();
    return;
  }

  // Handle sync command
  if (options.isSync) {
    await syncWithYouTube(options);
    return;
  }

  const history = loadHistory();
  const allWeeks = listAllWeeks();

  // Handle "next" batch automated resolution
  if (options.isNext || (!options.weekArg && !options.startDate)) {
    const nextBatch = resolveNextBatch(history, allWeeks);
    if (!nextBatch) {
      console.log(`\n🎉 All planned weeks have already been uploaded! Nothing pending.`);
      showStatus();
      return;
    }

    console.log(`\n======================================================`);
    console.log(`  POLYRIZZEMS Automated Queue: NEXT BATCH DETECTED`);
    console.log(`======================================================`);
    console.log(`Week:        Week ${nextBatch.weekNum} (${nextBatch.weekSlug})`);
    console.log(`Batch:       ${nextBatch.batchName}`);
    console.log(`Scope:       ${nextBatch.description}`);
    console.log(`Start Date:  ${options.startDate || nextBatch.startDate}`);
    console.log(`======================================================\n`);

    options.weekArg = nextBatch.weekArg;
    if (!options.startDate) options.startDate = nextBatch.startDate;
    options.days = nextBatch.days;
    options.compilation = nextBatch.compilation;
  }

  console.log(`\n======================================================`);
  console.log(`  POLYRIZZEMS YouTube Video Uploader & Scheduler`);
  console.log(`======================================================\n`);

  // 1. Resolve Week Directory
  const weekDir = resolveWeekDir(options.weekArg);
  const weekSlug = basename(weekDir);
  const weekMatch = weekSlug.match(/^week-(\d+)/);
  const weekNum = weekMatch ? parseInt(weekMatch[1], 10) : 1;

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
        id: dayData.specName,
        type: 'short',
        weekNum,
        weekSlug,
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
      id: `${weekSlug}-compilation`,
      type: 'compilation',
      weekNum,
      weekSlug,
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

  // Quota calculation
  const estimatedUnits = uploadQueue.length * 1600;
  console.log(`[API Quota Estimate] ${uploadQueue.length} videos x 1,600 units = ${estimatedUnits.toLocaleString()} units`);

  if (options.dryRun) {
    console.log(`\n======================================================`);
    console.log(`  DRY RUN COMPLETED (No changes made, 0 API units used)`);
    console.log(`======================================================\n`);
    return;
  }

  // Confirm before starting uploads
  if (!options.autoYes) {
    const confirm = await promptUser(`\nProceed with uploading ${uploadQueue.length} video(s) to YouTube? (y/N): `);
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log(`Upload cancelled by user.`);
      return;
    }
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

      // Record to persistent upload history
      recordUpload(history, {
        id: item.id,
        weekSlug: item.weekSlug,
        weekNum: item.weekNum,
        type: item.type,
        dayNum: item.dayNum,
        title: item.title,
        videoId: res.id,
        publishAt: item.publishAtIso,
      });

      results.push({ item, success: true, videoId: res.id });
    } catch (err) {
      console.error(`\nFAILED to upload "${item.title}":`, err.message);
      results.push({ item, success: false, error: err.message });
      if (!options.autoYes) {
        const proceed = await promptUser(`An error occurred. Continue with remaining videos? (y/N): `);
        if (proceed.toLowerCase() !== 'y') break;
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`  UPLOAD SUMMARY`);
  console.log(`======================================================`);
  for (const r of results) {
    const status = r.success ? `SUCCESS (ID: ${r.videoId})` : `FAILED (${r.error})`;
    console.log(`- ${r.item.title}: ${status}`);
  }
  console.log(`Upload history updated at: ${historyPath}`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('\nUpload Execution Error:', err.message || err);
  process.exit(1);
});
