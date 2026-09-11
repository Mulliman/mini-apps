/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Render all 7 daily videos for a week and optionally compile the long-form video.
 *
 *   node scripts/render-week.mjs 5
 *   node scripts/render-week.mjs week-5-math-sequences --scale 1
 *   node scripts/render-week.mjs 5 --aspect 9x16 --no-compile
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');
const planBaseDir = join(appDir, 'videos', 'plan');
const outDir = join(appDir, 'out');

function fail(msg) {
  console.error(`render-week: ${msg}`);
  process.exit(1);
}

function resolveWeekDir(weekArg) {
  const plans = readdirSync(planBaseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  if (plans.includes(weekArg)) return join(planBaseDir, weekArg);

  const cleanNum = weekArg.replace(/^week-?/, '');
  const matched = plans.find(p => p.startsWith(`week-${cleanNum}-`) || p === `week-${cleanNum}`);
  if (matched) return join(planBaseDir, matched);

  fail(`Could not find week folder matching "${weekArg}". Available: ${plans.join(', ')}`);
}

function parseWeekPlan(weekDir) {
  const files = readdirSync(weekDir);
  const overviewFile = files.find(f => f.startsWith('0-overview'));
  let weekTitle = null;

  if (overviewFile) {
    const content = readFileSync(join(weekDir, overviewFile), 'utf-8');
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) weekTitle = h1Match[1].replace(/#+\s*/, '').trim();
  }

  const days = [];
  for (let d = 1; d <= 7; d++) {
    const dayFile = files.find(f => f.startsWith(`${d}-`) && f.endsWith('.md'));
    if (!dayFile) fail(`Missing day file for Day ${d} in ${weekDir}`);

    const content = readFileSync(join(weekDir, dayFile), 'utf-8');
    const h1Match = content.match(/^#\s+(.+)$/m);
    const dayTitle = h1Match ? h1Match[1].replace(/Day\s*\d+:\s*/i, '').trim() : `Day ${d}`;

    const specMatch = content.match(/Target Spec Name[`*:\s]+([a-zA-Z0-9_-]+)/i) ||
                      content.match(/`public\/specs\/([a-zA-Z0-9_-]+)\.json`/i) ||
                      content.match(/spec=([a-zA-Z0-9_-]+)/i);

    if (!specMatch) fail(`Could not parse Target Spec Name in ${dayFile}`);
    const specName = specMatch[1].trim();

    days.push({
      day: d,
      file: dayFile,
      title: dayTitle,
      specName,
    });
  }

  return { weekDir, weekTitle, days };
}

function isValidVideo(filePath) {
  return existsSync(filePath) && statSync(filePath).size > 100000;
}

async function main() {
  const args = process.argv.slice(2);
  let weekArg = null;
  let aspect = 'both';
  let scale = 2;
  let compile = true;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--aspect') {
      aspect = args[++i];
    } else if (a === '--scale') {
      scale = Number(args[++i]);
    } else if (a === '--no-compile') {
      compile = false;
    } else if (a === '--compile') {
      compile = true;
    } else if (a === '--force') {
      force = true;
    } else if (!a.startsWith('--')) {
      weekArg = a;
    }
  }

  if (!weekArg) {
    fail('Usage: node scripts/render-week.mjs <week-number-or-slug> [--aspect both|9x16|16x9] [--scale 1|2] [--no-compile] [--force]');
  }

  const weekDir = resolveWeekDir(weekArg);
  const weekSlug = weekDir.split(/[\/\\]/).pop();
  const plan = parseWeekPlan(weekDir);

  console.log(`\n======================================================`);
  console.log(`  POLYRIZZEMS BATCH RENDER: ${weekSlug}`);
  console.log(`  Aspect: ${aspect} | Scale: ${scale}x | Auto-compile: ${compile}`);
  console.log(`======================================================\n`);

  const renderScript = join(appDir, 'scripts', 'render.mjs');
  const compileScript = join(appDir, 'scripts', 'compile-week.mjs');

  for (let i = 0; i < plan.days.length; i++) {
    const d = plan.days[i];
    console.log(`\n[${i + 1}/7] Day ${d.day}: ${d.title} (spec: ${d.specName})`);

    const path9x16 = join(outDir, `${d.specName}-9x16.mp4`);
    const path16x9 = join(outDir, `${d.specName}-16x9.mp4`);

    const needs9x16 = (aspect === 'both' || aspect === '9x16') && (!isValidVideo(path9x16) || force);
    const needs16x9 = (aspect === 'both' || aspect === '16x9') && (!isValidVideo(path16x9) || force);

    if (!needs9x16 && !needs16x9) {
      console.log(`  Already rendered, skipping.`);
      continue;
    }

    const renderAspect = (needs9x16 && needs16x9) ? 'both' : (needs9x16 ? '9x16' : '16x9');
    const cmdArgs = [
      renderScript,
      d.specName,
      '--aspect', renderAspect,
      '--scale', String(scale),
    ];

    console.log(`  Running: node scripts/render.mjs ${d.specName} --aspect ${renderAspect} --scale ${scale}`);
    const res = spawnSync('node', cmdArgs, {
      cwd: appDir,
      stdio: 'inherit',
    });

    if (res.status !== 0) {
      fail(`Render failed for Day ${d.day} (${d.specName}) with exit code ${res.status}`);
    }
  }

  if (compile && (aspect === 'both' || aspect === '16x9')) {
    console.log(`\n======================================================`);
    console.log(`  COMPILING LONG-FORM VIDEO: ${weekSlug}`);
    console.log(`======================================================\n`);

    const res = spawnSync('node', [compileScript, weekSlug], {
      cwd: appDir,
      stdio: 'inherit',
    });

    if (res.status !== 0) {
      fail(`Compilation failed for ${weekSlug} with exit code ${res.status}`);
    }
  }

  console.log(`\nAll done! Render outputs in: ${outDir}\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
