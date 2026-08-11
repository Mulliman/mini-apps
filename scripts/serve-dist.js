// Serves ./dist over plain HTTP so the combined build can be checked the way a
// browser will actually see it — service worker, precache, offline and all.
//
// `pnpm dev` runs the homepage from source and cannot do this: the service
// worker only exists after `pnpm build:deploy`, and http://localhost counts as
// a secure context, so registration works here without certificates.
//
// Zero dependencies, node:http only.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const port = Number(process.env.PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.webp': 'image/webp',
  '.map': 'application/json; charset=utf-8',
};

if (!fs.existsSync(distDir)) {
  console.error('No dist/ found. Run `pnpm build:deploy` first.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  // Resolve inside dist and refuse anything that escapes it.
  let filePath = path.join(distDir, pathname);
  if (!path.resolve(filePath).startsWith(path.resolve(distDir))) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 ${pathname}`);
    console.log(`404 ${pathname}`);
    return;
  }

  // no-store throughout: what we are testing is the service worker's cache, and
  // HTTP caching on top of it just muddies the result.
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`Serving dist/ on http://localhost:${port}`);
});
