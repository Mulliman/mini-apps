// Pulls the third-party assets our apps load at runtime into dist/vendor/ and
// rewrites the references to point there.
//
// Why this exists: several apps came out of AI Studio wired to
// cdn.tailwindcss.com and Google Fonts. Those are cross-origin, so the Workbox
// precache (which only globs local files) can never cover them, which means
// those apps render unstyled with no network — and the whole point of the PWA /
// APK is a tablet that works in a car. Vendoring also stops the Tailwind Play
// CDN being re-fetched on every launch on modest hardware.
//
// Runs after all apps are built and copied into dist, but BEFORE the service
// worker is generated, so the vendored files land in the precache manifest.
//
// Failure is non-fatal by design: if a download fails we leave the original URL
// in place, so a flaky network during a deploy degrades the app to
// online-only rather than breaking the build.

import fs from 'fs-extra';
import path from 'path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const VENDOR_DIR = 'vendor';
const FONT_SUBDIR = 'fonts';

// Google Fonts serves different formats by User-Agent. Without a modern one we
// get ttf instead of woff2 — several times the bytes for the same glyphs.
const MODERN_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const VENDORED_HOSTS = ['cdn.tailwindcss.com', 'fonts.googleapis.com'];

// Latin and latin-ext only. Google ships every subset it has for a family
// (cyrillic, greek, vietnamese...), which is a few hundred KB of woff2 that a
// UK children's app will never render.
const KEPT_SUBSETS = /U\+0{1,4}-00FF|U\+0100-02AF/;

const SOURCE_EXTS = new Set(['.html', '.css']);

function shortHash(str) {
  return crypto.createHash('sha1').update(str).digest('hex').slice(0, 8);
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === VENDOR_DIR) continue; // never rewrite our own output
      walk(full, acc);
    } else if (SOURCE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      acc.push(full);
    }
  }
  return acc;
}

// Downloads are cached under node_modules/.cache, so repeat builds do not
// re-fetch. Asking Google Fonts for ~20 files in a burst is enough for it to
// start replying 404, so the fetches below are also paced and retried — a cold
// CI build has no cache to fall back on.
const CACHE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'node_modules/.cache/vendor-externals'
);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function download(url, { text = false } = {}) {
  fs.ensureDirSync(CACHE_DIR);
  const cached = path.join(CACHE_DIR, shortHash(url) + path.extname(new URL(url).pathname));

  if (fs.existsSync(cached)) {
    const buf = fs.readFileSync(cached);
    return text ? buf.toString('utf8') : buf;
  }

  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': MODERN_UA },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(cached, buf);
      return text ? buf.toString('utf8') : buf;
    } catch (err) {
      lastErr = err;
      if (attempt < 4) await sleep(500 * 2 ** (attempt - 1));
    }
  }
  throw lastErr;
}

// Bare-host matches come from <link rel="preconnect"> hints, which have nothing
// to fetch — stripDeadHints removes those tags instead.
function isVendorable(url) {
  const { host, pathname } = new URL(url);
  if (host === 'fonts.googleapis.com') return pathname.startsWith('/css');
  return true;
}

// Turns a remote font URL into a flat, collision-proof local filename:
// /s/fredoka/v14/X-9.woff2 -> s_fredoka_v14_X-9.woff2
function fontFileName(fontUrl) {
  return new URL(fontUrl).pathname.replace(/^\/+/, '').replace(/[^a-zA-Z0-9._-]/g, '_');
}

function firstFamilySlug(cssUrl) {
  const family = new URL(cssUrl).searchParams.get('family') || 'fonts';
  return family.split(':')[0].replace(/\+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
}

// Strips the subsets we do not need, then downloads what is left and points the
// @font-face src at the local copies.
async function localiseFontCss(cssText, vendorAbsDir, stats) {
  // Each @font-face is captured together with the /* subset */ comment that
  // labels it, so dropping a block takes its label with it.
  const blocks = cssText.match(/(?:\/\*[^*]*\*\/\s*)?@font-face\s*\{[^}]*\}/g) || [];
  const kept = [];
  let dropped = 0;

  for (const block of blocks) {
    if (/unicode-range/.test(block) && !KEPT_SUBSETS.test(block)) {
      dropped++;
      continue;
    }
    kept.push(block);
  }
  stats.subsetsDropped += dropped;

  let out = kept.join('\n');
  const fontUrls = [...new Set(out.match(/https:\/\/fonts\.gstatic\.com\/[^)"'\s]+/g) || [])];
  const fontsAbsDir = path.join(vendorAbsDir, FONT_SUBDIR);
  fs.ensureDirSync(fontsAbsDir);

  for (const fontUrl of fontUrls) {
    const name = fontFileName(fontUrl);
    const target = path.join(fontsAbsDir, name);
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, await download(fontUrl));
      stats.fontFiles++;
      await sleep(120); // be a polite client; bursts get throttled
    }
    out = out.split(fontUrl).join(`${FONT_SUBDIR}/${name}`);
  }

  return out;
}

// Drops preconnect/dns-prefetch hints to hosts we no longer talk to. They are
// harmless but they make the device attempt DNS on every launch, offline or not.
function stripDeadHints(html) {
  return html.replace(/[ \t]*<link\b[^>]*>\n?/g, tag => {
    const isHint = /rel=["'](?:preconnect|dns-prefetch)["']/i.test(tag);
    const isVendoredHost = /fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(tag);
    return isHint && isVendoredHost ? '' : tag;
  });
}

export async function vendorExternals(distDir) {
  const stats = { urls: 0, files: 0, fontFiles: 0, subsetsDropped: 0, failures: [] };

  if (typeof fetch !== 'function') {
    console.warn('⚠️  No global fetch (Node 18+ required) — skipping vendoring; apps stay online-only.');
    return stats;
  }

  const files = walk(distDir);
  const hostPattern = VENDORED_HOSTS.map(h => h.replace(/\./g, '\\.')).join('|');
  const urlPattern = new RegExp(`https://(?:${hostPattern})[^"'\\s)>]*`, 'g');

  // Pass 1: find every distinct external URL across the built output.
  const contents = new Map();
  const urls = new Set();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    contents.set(file, text);
    for (const url of text.match(urlPattern) || []) urls.add(url);
  }

  if (urls.size === 0) return stats;

  // Pass 2: fetch each one into dist/vendor/, remembering its local name.
  const vendorAbsDir = path.join(distDir, VENDOR_DIR);
  fs.ensureDirSync(vendorAbsDir);
  const localNames = new Map();

  for (const url of urls) {
    if (!isVendorable(url)) continue;
    const host = new URL(url).host;
    try {
      if (host === 'fonts.googleapis.com') {
        const css = await localiseFontCss(await download(url, { text: true }), vendorAbsDir, stats);
        // Named by content, so apps requesting the same families in different
        // orders end up sharing one file rather than duplicating it.
        const name = `fonts-${firstFamilySlug(url)}-${shortHash(css)}.css`;
        fs.writeFileSync(path.join(vendorAbsDir, name), css, 'utf8');
        localNames.set(url, name);
      } else {
        const name = `tailwind-play-${shortHash(url)}.js`;
        fs.writeFileSync(path.join(vendorAbsDir, name), await download(url));
        localNames.set(url, name);
      }
      stats.urls++;
      await sleep(120);
    } catch (err) {
      // Left as-is on purpose — see the note at the top of this file.
      console.warn(`⚠️  Could not vendor ${url}: ${err.message} (left pointing at the CDN)`);
      stats.failures.push(url);
    }
  }

  // Pass 3: rewrite references. Paths are relative to each file so the output
  // stays portable rather than assuming it is served from the domain root.
  for (const [file, original] of contents) {
    let text = original;
    for (const [url, name] of localNames) {
      if (!text.includes(url)) continue;
      const rel = path
        .relative(path.dirname(file), path.join(vendorAbsDir, name))
        .split(path.sep)
        .join('/');
      text = text.split(url).join(rel);
    }
    if (path.extname(file).toLowerCase() === '.html') text = stripDeadHints(text);
    if (text !== original) {
      fs.writeFileSync(file, text, 'utf8');
      stats.files++;
    }
  }

  return stats;
}
