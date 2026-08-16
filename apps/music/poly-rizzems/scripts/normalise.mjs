/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Apply the house rules to a spec.
 *
 *   pnpm --filter @miniapps/poly-rizzems normalise cmaj7-arc
 *   pnpm --filter @miniapps/poly-rizzems normalise cmaj7-arc --check
 *
 * Composition stays a human (or LLM) decision — which signatures, which notes,
 * how the arc is shaped. What lands here is only the part that is arithmetic and
 * would otherwise drift every time it was redone by hand:
 *
 *   - mix level from pitch, so high notes sit back instead of dominating
 *   - each lane's face from the interval it forms when it arrives
 *   - frequencies that actually match their note names
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** The app's palette — naturals only, C3 to C6 (see src/types.ts). */
const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5,
};

const PITCH_CLASS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/**
 * How an arriving note feels against the lowest note already sounding.
 * Every face is used, so the arrangement reads as a record of its own harmony.
 */
const EXPRESSION_BY_INTERVAL = {
  0: 'sleepy',    // octave or unison — doubling, nothing new
  1: 'angry',     // minor 2nd
  2: 'silly',     // major 2nd
  3: 'sad',       // minor 3rd
  4: 'happy',     // major 3rd
  5: 'excited',   // perfect 4th / 11th — open, suspended
  6: 'sick',      // tritone
  7: 'cool',      // perfect 5th
  8: 'sad',       // minor 6th
  9: 'excited',   // major 6th
  10: 'surprised',// minor 7th
  11: 'dizzy',    // major 7th
};

/** The first lane has nothing to be an interval against — it is the root. */
const ROOT_EXPRESSION = 'cool';

/**
 * Two notes closer than this rub against each other audibly. Pitch class alone
 * isn't enough to judge it: B and C a semitone apart is a harsh rub, but the same
 * two notes spread over an octave are the lush major 7th that defines a maj7
 * chord. Distance is what the ear is reacting to, so distance is what we measure.
 */
const RUB_DISTANCE = 2;

/**
 * How an arriving note feels against everything already sounding.
 *
 * The bass sets the basic quality, because that is what gives a chord its
 * character — but a semitone rub or a tritone against *any* sounding note
 * overrides it. Those two are flagged by the ear regardless of what the bass is
 * doing, and ignoring them produced obviously wrong faces (a note landing a
 * semitone above the ringing 7th came out "sleepy").
 */
function expressionFor(rhythm, sounding) {
  if (rhythm.timeSignature === 0) return { expression: 'sleepy', reason: 'rest lane — timeSignature 0' };

  const activeSounding = sounding.filter((r) => r.timeSignature > 0);
  if (activeSounding.length === 0) return { expression: ROOT_EXPRESSION, reason: 'root — nothing below it' };

  const self = semitonesOf(rhythm.noteName);
  const bass = activeSounding.reduce((low, r) => (r.frequency < low.frequency ? r : low));

  for (const other of activeSounding) {
    const distance = Math.abs(self - semitonesOf(other.noteName));
    if (distance > 0 && distance <= RUB_DISTANCE) {
      return { expression: 'angry', reason: `rubs against ${other.noteName} ${distance} semitone(s) away` };
    }
  }

  for (const other of sounding) {
    const pitchClass = Math.abs(self - semitonesOf(other.noteName)) % 12;
    if (pitchClass === 6) {
      return { expression: 'sick', reason: `tritone against ${other.noteName}` };
    }
  }

  const interval = intervalClass(bass.noteName, rhythm.noteName);
  return {
    expression: EXPRESSION_BY_INTERVAL[interval],
    reason: `${interval} semitones above ${bass.noteName}`,
  };
}

/**
 * Mix level from pitch.
 *
 * Hearing peaks around 3–4 kHz, so a high note at the same amplitude simply
 * sounds louder. Pulling it back is closer to equal loudness than flat gain is,
 * and it keeps the downbeat — where every lane strikes at once — from clipping.
 */
const VOLUME_REFERENCE_HZ = 261.63; // C4
const VOLUME_AT_REFERENCE = 0.85;
const VOLUME_EXPONENT = 0.5;
const VOLUME_MIN = 0.35;
const VOLUME_MAX = 0.95;

function volumeFor(frequency) {
  const raw = VOLUME_AT_REFERENCE * Math.pow(VOLUME_REFERENCE_HZ / frequency, VOLUME_EXPONENT);
  return Math.round(Math.min(VOLUME_MAX, Math.max(VOLUME_MIN, raw)) * 100) / 100;
}

function semitonesOf(noteName) {
  const match = /^([A-G])(\d)$/.exec(noteName ?? '');
  if (!match) return null;
  return PITCH_CLASS[match[1]] + Number(match[2]) * 12;
}

function intervalClass(fromNote, toNote) {
  const a = semitonesOf(fromNote);
  const b = semitonesOf(toNote);
  if (a === null || b === null) return null;
  return ((b - a) % 12 + 12) % 12;
}

function fail(message) {
  console.error(`normalise: ${message}`);
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const keepExpressions = args.includes('--keep-expressions');
  const name = args.find((a) => !a.startsWith('--'));
  if (!name) fail('usage: normalise <spec-name> [--check] [--keep-expressions]');

  const file = join(appDir, 'public', 'specs', `${name.replace(/\.json$/, '')}.json`);
  if (!existsSync(file)) fail(`no spec at ${file}`);

  const original = readFileSync(file, 'utf8');
  const spec = JSON.parse(original);
  const changes = [];
  const problems = [];
  const warnings = [];
  const signatures = [];

  /** id -> rhythm, for lanes sounding at the moment a new one arrives. */
  const alive = new Map();

  const introduce = (rhythm, where) => {
    if (!rhythm || typeof rhythm.id !== 'string' || !rhythm.id) {
      problems.push(`${where}: every rhythm needs a string id`);
      return;
    }
    if (alive.has(rhythm.id)) problems.push(`${where}: id "${rhythm.id}" is already sounding`);
    if (!Number.isInteger(rhythm.timeSignature) || rhythm.timeSignature < 0 || rhythm.timeSignature > 19) {
      problems.push(`${where}: timeSignature ${rhythm.timeSignature} must be an integer 0–19`);
    }
    if (!(rhythm.noteName in NOTES)) {
      problems.push(`${where}: note "${rhythm.noteName}" is not in the palette (naturals C3–C6 only)`);
      return;
    }

    const frequency = NOTES[rhythm.noteName];
    if (rhythm.frequency !== frequency) {
      changes.push(`${rhythm.id}: frequency ${rhythm.frequency} → ${frequency} (matches ${rhythm.noteName})`);
      rhythm.frequency = frequency;
    }

    const volume = volumeFor(frequency);
    if (rhythm.volume !== volume) {
      changes.push(`${rhythm.id}: volume ${rhythm.volume ?? '—'} → ${volume} (${rhythm.noteName})`);
      rhythm.volume = volume;
    }

    if (!keepExpressions) {
      const { expression, reason } = expressionFor(rhythm, [...alive.values()]);
      if (rhythm.expression !== expression) {
        changes.push(`${rhythm.id}: expression ${rhythm.expression ?? '—'} → ${expression} (${reason})`);
        rhythm.expression = expression;
      }
    }

    const COLOR_PALETTE = [
      '#00f0ff', '#39ff14', '#ff007f', '#fffb00', '#ff5f00',
      '#b026ff', '#ff073a', '#ccff00', '#00ffd0', '#ff00ea'
    ];

    if (rhythm.timeSignature === 0) {
      if (rhythm.color !== '#808080') {
        changes.push(`${rhythm.id}: color ${rhythm.color ?? '—'} → #808080 (rest lane 0)`);
        rhythm.color = '#808080';
      }
    } else if (!rhythm.color || rhythm.color === '#808080') {
      const color = COLOR_PALETTE[alive.size % COLOR_PALETTE.length];
      changes.push(`${rhythm.id}: color ${rhythm.color ?? '—'} → ${color}`);
      rhythm.color = color;
    }

    if (!rhythm.name) {
      rhythm.name = `${rhythm.noteName} (${rhythm.timeSignature}♩)`;
    }

    if (rhythm.isMuted === undefined) rhythm.isMuted = false;
    signatures.push(rhythm.timeSignature);
    alive.set(rhythm.id, rhythm);
  };

  if (!Array.isArray(spec.rhythms) || spec.rhythms.length === 0) {
    fail('spec has no `rhythms` to start from');
  }
  for (const rhythm of spec.rhythms) introduce(rhythm, 'bar 0');

  const events = [...(spec.events ?? [])].sort((a, b) => a.at - b.at);
  for (const event of events) {
    const where = `bar ${event.at}`;
    if (!Number.isInteger(event.at) || event.at < 0) {
      problems.push(`${where}: \`at\` must be a whole bar index`);
      continue;
    }
    if (event.at >= spec.bars) problems.push(`${where}: past the end (bars: ${spec.bars}), so it never fires`);

    switch (event.type) {
      case 'add':
        introduce(event.rhythm, where);
        break;
      case 'remove':
        if (!alive.has(event.id)) problems.push(`${where}: removes "${event.id}", which is not sounding`);
        alive.delete(event.id);
        break;
      case 'mute':
      case 'unmute':
      case 'update':
        if (!alive.has(event.id)) problems.push(`${where}: ${event.type} targets "${event.id}", which is not sounding`);
        break;
      case 'tempo':
        if (!(event.barDuration > 0)) problems.push(`${where}: tempo needs a positive barDuration`);
        break;
      default:
        problems.push(`${where}: unknown event type "${event.type}"`);
    }
  }

  // A lane's peak speed is proportional to its signature, so with one shared
  // bounce height a wide spread leaves the fastest ball crossing several
  // ball-widths per frame — it stops reading as a bounce and its face is
  // unreadable. `equalSpeed` (the default) removes the problem entirely.
  const positiveSigs = signatures.filter((s) => s > 0);
  if (spec.bounce === 'uniform' && positiveSigs.length > 1) {
    const spread = Math.max(...positiveSigs) / Math.min(...positiveSigs);
    if (spread > 4) {
      warnings.push(
        `bounce is "uniform" with a ${spread.toFixed(0)}x signature spread ` +
          `(${Math.min(...positiveSigs)}–${Math.max(...positiveSigs)}); the fastest lane will ` +
          `smear at 60fps. Drop the \`bounce\` key to use equalSpeed.`
      );
    }
  }

  if (warnings.length) {
    console.warn('');
    for (const warning of warnings) console.warn(`  ! ${warning}`);
    console.warn('');
  }

  if (problems.length) {
    console.error(`\n${problems.length} problem(s) in ${name}:`);
    for (const problem of problems) console.error(`  ✗ ${problem}`);
    process.exit(1);
  }

  const updated = `${JSON.stringify(spec, null, 2)}\n`;

  if (changes.length === 0) {
    console.log(`${name}: already matches the house rules.`);
    return;
  }

  console.log(`${name}: ${changes.length} change(s)${check ? ' (check only, nothing written)' : ''}`);
  for (const change of changes) console.log(`  • ${change}`);

  if (check) process.exit(1);
  writeFileSync(file, updated);
  console.log(`\nwrote ${file}`);
}

main();
