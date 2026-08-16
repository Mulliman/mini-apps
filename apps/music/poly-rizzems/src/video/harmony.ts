/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SampledLane } from './spec';

const PITCH_CLASSES: Record<string, number> = {
  C: 0, 'C#': 1, 'C♯': 1, Db: 1, 'D♭': 1,
  D: 2, 'D#': 3, 'D♯': 3, Eb: 3, 'E♭': 3,
  E: 4,
  F: 5, 'F#': 6, 'F♯': 6, Gb: 6, 'G♭': 6,
  G: 7, 'G#': 8, 'G♯': 8, Ab: 8, 'A♭': 8,
  A: 9, 'A#': 10, 'A♯': 10, Bb: 10, 'B♭': 10,
  B: 11,
};

const CHORD_PATTERNS: Array<{ intervals: number[]; name: string }> = [
  // 9ths / Extensions
  { intervals: [0, 4, 7, 11, 2], name: 'maj9' },
  { intervals: [0, 3, 7, 10, 2], name: 'm9' },
  { intervals: [0, 4, 7, 10, 2], name: '9' },
  { intervals: [0, 4, 7, 2], name: 'add9' },
  { intervals: [0, 3, 7, 2], name: 'm(add9)' },
  // 7ths
  { intervals: [0, 4, 7, 11], name: 'maj7' },
  { intervals: [0, 3, 7, 10], name: 'm7' },
  { intervals: [0, 4, 7, 10], name: '7' },
  { intervals: [0, 3, 6, 10], name: 'm7♭5' },
  { intervals: [0, 3, 6, 9], name: 'dim7' },
  // Triads
  { intervals: [0, 4, 7], name: ' Major' },
  { intervals: [0, 3, 7], name: ' Minor' },
  { intervals: [0, 3, 6], name: 'dim' },
  { intervals: [0, 4, 8], name: 'aug' },
  { intervals: [0, 5, 7], name: 'sus4' },
  { intervals: [0, 2, 7], name: 'sus2' },
  // Dyads
  { intervals: [0, 7], name: '5' },
  { intervals: [0, 4], name: ' (3rd)' },
  { intervals: [0, 3], name: 'm (3rd)' },
];

/**
 * Deterministically compute the harmonic chord name of currently sounding lanes.
 */
export function computeLiveChord(lanes: SampledLane[]): string {
  const activeLanes = lanes.filter(
    (l) => !l.rhythm.isMuted && l.enterProgress > 0.4 && l.exitProgress < 0.6
  );
  if (!activeLanes.length) return '—';

  // Find lowest frequency sounding lane as bass
  const bassLane = activeLanes.reduce((low, l) =>
    l.rhythm.frequency < low.rhythm.frequency ? l : low
  );

  const bassMatch = /^([A-G][♯♭#b]?)/.exec(bassLane.rhythm.noteName);
  if (!bassMatch) return '—';
  const bassRoot = bassMatch[1];
  const bassPitchClass = PITCH_CLASSES[bassRoot] ?? 0;

  // Collect unique pitch classes in the chord
  const pitchClasses = new Set<number>();
  for (const lane of activeLanes) {
    const m = /^([A-G][♯♭#b]?)/.exec(lane.rhythm.noteName);
    if (m && m[1] in PITCH_CLASSES) {
      pitchClasses.add(PITCH_CLASSES[m[1]]);
    }
  }

  if (pitchClasses.size === 1) {
    return `${bassRoot} (Root)`;
  }

  // Calculate interval set relative to bass
  const intervals = Array.from(pitchClasses)
    .map((pc) => (pc - bassPitchClass + 12) % 12)
    .sort((a, b) => a - b);

  // Match against patterns
  for (const { intervals: pattern, name } of CHORD_PATTERNS) {
    const matches = pattern.every((iv) => intervals.includes(iv));
    if (matches && intervals.length <= pattern.length + 1) {
      return `${bassRoot}${name}`;
    }
  }

  return `${bassRoot} Chord`;
}

/**
 * Deterministically compute the active polyrhythm ratio string.
 * Omits the 1 tempo anchor so ratios display cleanly (e.g. "2 : 3" or "3 : 4").
 */
export function computeLivePolyrhythm(lanes: SampledLane[]): string {
  const activeLanes = lanes.filter(
    (l) => !l.rhythm.isMuted && l.enterProgress > 0.4 && l.exitProgress < 0.6
  );
  if (!activeLanes.length) return '—';

  const sigs = Array.from(new Set(activeLanes.map((l) => l.rhythm.timeSignature))).sort(
    (a, b) => a - b
  );

  // Filter out the 1 metronome anchor when actual polyrhythmic lanes are active
  const polySigs = sigs.filter((s) => s !== 1);
  if (polySigs.length === 0) {
    return '1 Beat Pulse';
  }
  if (polySigs.length === 1) {
    return polySigs[0] === 0 ? 'Rest Lane (0♩)' : `${polySigs[0]} Beats`;
  }
  return polySigs.join(' : ');
}

/**
 * Quarter-note equivalent BPM.
 */
export function computeLiveBpm(barDuration: number): number {
  if (barDuration <= 0) return 0;
  return Math.round(240 / barDuration);
}
