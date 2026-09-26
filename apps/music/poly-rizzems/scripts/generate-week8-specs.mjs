/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Generate Week 8 Polyrhythmic Fills in 3/4 Specs
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const specsDir = join(__dirname, '..', 'public', 'specs');

const DAYS = [
  {
    day: 1,
    fillSig: 4,
    name: 'week8-day1-fill-4-quadruplet',
    title: '4:3 The Quadruplet Fill',
    ratio: '4:3',
    baseBpm: 135,
    fastBpm: 160,
    baseDuration: 1.333,
    fastDuration: 1.125,
    chords: [
      { name: 'C Major', bass: 'C3', pulse: 'G3' },
      { name: 'A Minor', bass: 'A3', pulse: 'E4' },
      { name: 'F Major', bass: 'F3', pulse: 'C4' },
      { name: 'G Major', bass: 'G3', pulse: 'D4' },
      { name: 'C Major', bass: 'C3', pulse: 'G3' },
    ],
  },
  {
    day: 2,
    fillSig: 5,
    name: 'week8-day2-fill-5-quintuplet',
    title: '5:3 The Quintuplet Fill',
    ratio: '5:3',
    baseBpm: 135,
    fastBpm: 160,
    baseDuration: 1.333,
    fastDuration: 1.125,
    chords: [
      { name: 'A Minor', bass: 'A3', pulse: 'E4' },
      { name: 'F Major', bass: 'F3', pulse: 'C4' },
      { name: 'D Minor', bass: 'D3', pulse: 'A3' },
      { name: 'E Minor', bass: 'E3', pulse: 'B3' },
      { name: 'A Minor', bass: 'A3', pulse: 'E4' },
    ],
  },
  {
    day: 3,
    fillSig: 6,
    name: 'week8-day3-fill-6-sextuplet',
    title: '6:3 The Sextuplet Fill',
    ratio: '6:3',
    baseBpm: 135,
    fastBpm: 160,
    baseDuration: 1.333,
    fastDuration: 1.125,
    chords: [
      { name: 'F Major', bass: 'F3', pulse: 'C4' },
      { name: 'D Minor', bass: 'D3', pulse: 'A3' },
      { name: 'C Major', bass: 'C3', pulse: 'G3' },
      { name: 'G Major', bass: 'G3', pulse: 'D4' },
      { name: 'F Major', bass: 'F3', pulse: 'C4' },
    ],
  },
  {
    day: 4,
    fillSig: 7,
    name: 'week8-day4-fill-7-septuplet',
    title: '7:3 The Septuplet Fill',
    ratio: '7:3',
    baseBpm: 135,
    fastBpm: 160,
    baseDuration: 1.333,
    fastDuration: 1.125,
    chords: [
      { name: 'G Major', bass: 'G3', pulse: 'D4' },
      { name: 'E Minor', bass: 'E3', pulse: 'B3' },
      { name: 'C Major', bass: 'C3', pulse: 'G3' },
      { name: 'D Minor', bass: 'D3', pulse: 'A3' },
      { name: 'G Major', bass: 'G3', pulse: 'D4' },
    ],
  },
  {
    day: 5,
    fillSig: 8,
    name: 'week8-day5-fill-8-octuplet',
    title: '8:3 The Octuplet Fill',
    ratio: '8:3',
    baseBpm: 135,
    fastBpm: 160,
    baseDuration: 1.333,
    fastDuration: 1.125,
    chords: [
      { name: 'D Minor', bass: 'D3', pulse: 'A3' },
      { name: 'C Major', bass: 'C3', pulse: 'G3' },
      { name: 'A Minor', bass: 'A3', pulse: 'E4' },
      { name: 'G Major', bass: 'G3', pulse: 'D4' },
      { name: 'D Minor', bass: 'D3', pulse: 'A3' },
    ],
  },
  {
    day: 6,
    fillSig: 12,
    name: 'week8-day6-fill-12-dodecuplet',
    title: '12:3 The Dodecuplet Fill',
    ratio: '12:3',
    baseBpm: 95,
    fastBpm: 115,
    baseDuration: 1.895,
    fastDuration: 1.565,
    chords: [
      { name: 'E Minor', bass: 'E3', pulse: 'B3' },
      { name: 'C Major', bass: 'C3', pulse: 'G3' },
      { name: 'A Minor', bass: 'A3', pulse: 'E4' },
      { name: 'D Minor', bass: 'D3', pulse: 'A3' },
      { name: 'E Minor', bass: 'E3', pulse: 'B3' },
    ],
  },
  {
    day: 7,
    fillSig: 16,
    name: 'week8-day7-fill-16-sedecuplet',
    title: '16:3 The Sedecuplet Fill',
    ratio: '16:3',
    baseBpm: 85,
    fastBpm: 105,
    baseDuration: 2.118,
    fastDuration: 1.714,
    chords: [
      { name: 'C4 High Major', bass: 'C4', pulse: 'G4' },
      { name: 'A Minor', bass: 'A3', pulse: 'E4' },
      { name: 'F Major', bass: 'F3', pulse: 'C4' },
      { name: 'G Major', bass: 'G3', pulse: 'D4' },
      { name: 'C3 Deep Home', bass: 'C3', pulse: 'G3' },
    ],
  },
];

const NOTE_FREQS = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.5,
};

for (const d of DAYS) {
  const initialChord = d.chords[0];
  const spec = {
    name: d.name,
    title: d.title,
    description: `Starting on ${initialChord.name} at ${d.baseBpm} BPM across the first 3 phrases, this 3/4 waltz groove accelerates to ${d.fastBpm} BPM across the final 2 phrases. On the 4th bar of each cycle, the 3 quarter notes mute as the ${d.fillSig} fill takes over on the same pitch.`,
    bars: 23,
    barDuration: d.baseDuration,
    bounce: 'equalSpeed',
    rhythms: [
      {
        id: 'lane-1',
        timeSignature: 1,
        name: `${initialChord.bass} (1♩)`,
        noteName: initialChord.bass,
        frequency: NOTE_FREQS[initialChord.bass],
        volume: 0.95,
        expression: 'cool',
        color: '#00f0ff',
        isMuted: false,
      },
      {
        id: 'lane-3',
        timeSignature: 3,
        name: `${initialChord.pulse} (3♩)`,
        noteName: initialChord.pulse,
        frequency: NOTE_FREQS[initialChord.pulse],
        volume: 0.85,
        expression: 'cool',
        color: '#fffb00',
        isMuted: false,
      },
      {
        id: 'lane-fill',
        timeSignature: d.fillSig,
        name: `${initialChord.pulse} (${d.fillSig}♩)`,
        noteName: initialChord.pulse,
        frequency: NOTE_FREQS[initialChord.pulse],
        volume: 0.85,
        expression: 'cool',
        color: '#ff007f',
        isMuted: true,
      },
    ],
    events: [
      // Phrase 1 (Bars 0-3): Fill on Bar 3 (100 BPM)
      { at: 3, type: 'mute', id: 'lane-3' },
      { at: 3, type: 'unmute', id: 'lane-fill' },

      // Phrase 2 (Bars 4-7): Chord 2 (100 BPM)
      { at: 4, type: 'unmute', id: 'lane-3' },
      { at: 4, type: 'mute', id: 'lane-fill' },
      {
        at: 4,
        type: 'update',
        id: 'lane-1',
        patch: {
          noteName: d.chords[1].bass,
          frequency: NOTE_FREQS[d.chords[1].bass],
          name: `${d.chords[1].bass} (1♩)`,
        },
      },
      {
        at: 4,
        type: 'update',
        id: 'lane-3',
        patch: {
          noteName: d.chords[1].pulse,
          frequency: NOTE_FREQS[d.chords[1].pulse],
          name: `${d.chords[1].pulse} (3♩)`,
        },
      },
      {
        at: 4,
        type: 'update',
        id: 'lane-fill',
        patch: {
          noteName: d.chords[1].pulse,
          frequency: NOTE_FREQS[d.chords[1].pulse],
          name: `${d.chords[1].pulse} (${d.fillSig}♩)`,
        },
      },
      { at: 7, type: 'mute', id: 'lane-3' },
      { at: 7, type: 'unmute', id: 'lane-fill' },

      // Phrase 3 (Bars 8-11): Chord 3 (100 BPM)
      { at: 8, type: 'unmute', id: 'lane-3' },
      { at: 8, type: 'mute', id: 'lane-fill' },
      {
        at: 8,
        type: 'update',
        id: 'lane-1',
        patch: {
          noteName: d.chords[2].bass,
          frequency: NOTE_FREQS[d.chords[2].bass],
          name: `${d.chords[2].bass} (1♩)`,
        },
      },
      {
        at: 8,
        type: 'update',
        id: 'lane-3',
        patch: {
          noteName: d.chords[2].pulse,
          frequency: NOTE_FREQS[d.chords[2].pulse],
          name: `${d.chords[2].pulse} (3♩)`,
        },
      },
      {
        at: 8,
        type: 'update',
        id: 'lane-fill',
        patch: {
          noteName: d.chords[2].pulse,
          frequency: NOTE_FREQS[d.chords[2].pulse],
          name: `${d.chords[2].pulse} (${d.fillSig}♩)`,
        },
      },
      { at: 11, type: 'mute', id: 'lane-3' },
      { at: 11, type: 'unmute', id: 'lane-fill' },

      // Phrase 4 (Bars 12-15): Chord 4 + Shift to Tempo 2
      { at: 12, type: 'unmute', id: 'lane-3' },
      { at: 12, type: 'mute', id: 'lane-fill' },
      { at: 12, type: 'tempo', barDuration: d.fastDuration },
      {
        at: 12,
        type: 'update',
        id: 'lane-1',
        patch: {
          noteName: d.chords[3].bass,
          frequency: NOTE_FREQS[d.chords[3].bass],
          name: `${d.chords[3].bass} (1♩)`,
        },
      },
      {
        at: 12,
        type: 'update',
        id: 'lane-3',
        patch: {
          noteName: d.chords[3].pulse,
          frequency: NOTE_FREQS[d.chords[3].pulse],
          name: `${d.chords[3].pulse} (3♩)`,
        },
      },
      {
        at: 12,
        type: 'update',
        id: 'lane-fill',
        patch: {
          noteName: d.chords[3].pulse,
          frequency: NOTE_FREQS[d.chords[3].pulse],
          name: `${d.chords[3].pulse} (${d.fillSig}♩)`,
        },
      },
      { at: 15, type: 'mute', id: 'lane-3' },
      { at: 15, type: 'unmute', id: 'lane-fill' },

      // Phrase 5 (Bars 16-19): Chord 5 (Home Climax) continuing at Tempo 2 (160 BPM)
      { at: 16, type: 'unmute', id: 'lane-3' },
      { at: 16, type: 'mute', id: 'lane-fill' },
      {
        at: 16,
        type: 'update',
        id: 'lane-1',
        patch: {
          noteName: d.chords[4].bass,
          frequency: NOTE_FREQS[d.chords[4].bass],
          name: `${d.chords[4].bass} (1♩)`,
        },
      },
      {
        at: 16,
        type: 'update',
        id: 'lane-3',
        patch: {
          noteName: d.chords[4].pulse,
          frequency: NOTE_FREQS[d.chords[4].pulse],
          name: `${d.chords[4].pulse} (3♩)`,
        },
      },
      {
        at: 16,
        type: 'update',
        id: 'lane-fill',
        patch: {
          noteName: d.chords[4].pulse,
          frequency: NOTE_FREQS[d.chords[4].pulse],
          name: `${d.chords[4].pulse} (${d.fillSig}♩)`,
        },
      },
      { at: 19, type: 'mute', id: 'lane-3' },
      { at: 19, type: 'unmute', id: 'lane-fill' },

      // Outro & Unwind (Bars 20-22): Immediate fill mute on downbeat 20
      { at: 20, type: 'mute', id: 'lane-fill' },
      { at: 20, type: 'remove', id: 'lane-fill' },
      { at: 20, type: 'remove', id: 'lane-3' },
      { at: 22, type: 'remove', id: 'lane-1' },
    ],
  };

  const targetPath = join(specsDir, `${d.name}.json`);
  writeFileSync(targetPath, JSON.stringify(spec, null, 2), 'utf-8');
  console.log(`Wrote ${d.name}.json`);
}

console.log('Done generating all 7 Week 8 specs!');
