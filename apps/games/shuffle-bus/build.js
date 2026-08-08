// Zero-dependency build script for the Shuffle Bus static app.
//
// Shuffle Bus is a single self-contained index.html (no React, no Vite, no
// npm dependencies). It runs directly from file://. This script exists so
// that `pnpm run build` still produces a `dist/` folder, matching every
// other app in the workspace, which `scripts/build-combined.js` expects to
// find and copy into the combined deploy output.
//
// Uses only node:fs and node:path — no third-party packages.

import { existsSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcHtml = join(__dirname, 'index.html');
const distDir = join(__dirname, 'dist');
const distHtml = join(distDir, 'index.html');

function build() {
  if (!existsSync(srcHtml)) {
    console.error(`Build failed: could not find ${srcHtml}`);
    process.exit(1);
  }

  if (existsSync(distDir)) {
    console.log('Removing previous dist/...');
    rmSync(distDir, { recursive: true, force: true });
  }

  mkdirSync(distDir, { recursive: true });
  copyFileSync(srcHtml, distHtml);

  console.log(`Copied ${srcHtml} -> ${distHtml}`);
  console.log('Build complete.');
}

build();
