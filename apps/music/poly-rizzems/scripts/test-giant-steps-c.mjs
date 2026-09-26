import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specsDir = resolve(appDir, 'public', 'specs');

const NOTES = {
  'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'D#3': 155.56, 'E3': 164.81,
  'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65,
  'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
};

function volumeFor(freq) {
  const raw = 0.85 * Math.pow(261.63 / freq, 0.5);
  return Math.round(Math.min(1.0, Math.max(0.2, raw)) * 100) / 100;
}

// 21 chord progression of Giant Steps
const giantStepsChords = [
  { name: 'Bmaj7', root: 'B3', notes: ['B3', 'D#4', 'F#4', 'A#4'], colors: ['#00f0ff', '#39ff14', '#fffb00', '#ff007f'] },
  { name: 'D7',    root: 'D3', notes: ['D3', 'F#4', 'A4', 'C4'],     colors: ['#ff5f00', '#ff073a', '#b026ff', '#00ffd0'] },
  { name: 'Gmaj7', root: 'G3', notes: ['G3', 'B3', 'D4', 'F#4'],     colors: ['#39ff14', '#00f0ff', '#ccff00', '#ff00ea'] },
  { name: 'Bb7',   root: 'Bb3',notes: ['Bb3', 'D4', 'F4', 'Ab4'],    colors: ['#ff073a', '#ff5f00', '#fffb00', '#b026ff'] },
  { name: 'Ebmaj7',root: 'Eb3',notes: ['Eb3', 'G4', 'Bb4', 'D4'],    colors: ['#00ffd0', '#39ff14', '#00f0ff', '#fffb00'] },
  { name: 'Am7',   root: 'A3', notes: ['A3', 'C4', 'E4', 'G4'],      colors: ['#b026ff', '#ff00ea', '#ff007f', '#00f0ff'] },
  { name: 'D7',    root: 'D3', notes: ['D3', 'F#4', 'A4', 'C4'],     colors: ['#ff5f00', '#ff073a', '#b026ff', '#00ffd0'] },
  { name: 'Gmaj7', root: 'G3', notes: ['G3', 'B3', 'D4', 'F#4'],     colors: ['#39ff14', '#00f0ff', '#ccff00', '#ff00ea'] },
  { name: 'Bb7',   root: 'Bb3',notes: ['Bb3', 'D4', 'F4', 'Ab4'],    colors: ['#ff073a', '#ff5f00', '#fffb00', '#b026ff'] },
  { name: 'Ebmaj7',root: 'Eb3',notes: ['Eb3', 'G4', 'Bb4', 'D4'],    colors: ['#00ffd0', '#39ff14', '#00f0ff', '#fffb00'] },
  { name: 'F#7',   root: 'F#3',notes: ['F#3', 'A#3', 'C#4', 'E4'],   colors: ['#ff007f', '#ff5f00', '#ff073a', '#b026ff'] },
  { name: 'Bmaj7', root: 'B3', notes: ['B3', 'D#4', 'F#4', 'A#4'], colors: ['#00f0ff', '#39ff14', '#fffb00', '#ff007f'] },
  { name: 'Fm7',   root: 'F3', notes: ['F3', 'Ab3', 'C4', 'Eb4'],    colors: ['#b026ff', '#ff00ea', '#ff073a', '#00ffd0'] },
  { name: 'Bb7',   root: 'Bb3',notes: ['Bb3', 'D4', 'F4', 'Ab4'],    colors: ['#ff073a', '#ff5f00', '#fffb00', '#b026ff'] },
  { name: 'Ebmaj7',root: 'Eb3',notes: ['Eb3', 'G4', 'Bb4', 'D4'],    colors: ['#00ffd0', '#39ff14', '#00f0ff', '#fffb00'] },
  { name: 'Am7',   root: 'A3', notes: ['A3', 'C4', 'E4', 'G4'],      colors: ['#b026ff', '#ff00ea', '#ff007f', '#00f0ff'] },
  { name: 'D7',    root: 'D3', notes: ['D3', 'F#4', 'A4', 'C4'],     colors: ['#ff5f00', '#ff073a', '#b026ff', '#00ffd0'] },
  { name: 'Gmaj7', root: 'G3', notes: ['G3', 'B3', 'D4', 'F#4'],     colors: ['#39ff14', '#00f0ff', '#ccff00', '#ff00ea'] },
  { name: 'C#m7',  root: 'C#3',notes: ['C#3', 'E4', 'G#3', 'B3'],    colors: ['#ff00ea', '#b026ff', '#ff007f', '#00f0ff'] },
  { name: 'F#7',   root: 'F#3',notes: ['F#3', 'A#3', 'C#4', 'E4'],   colors: ['#ff007f', '#ff5f00', '#ff073a', '#b026ff'] },
  { name: 'Bmaj7', root: 'B3', notes: ['B3', 'D#4', 'F#4', 'A#4'], colors: ['#00f0ff', '#39ff14', '#fffb00', '#ff007f'] }
];

export function createMeterSpec(signature, specName, title, barDuration = 2.3) {
  const bars = 25;
  const initialPulse = 'B3';
  const pulseId = 'meter-pulse';
  const laneIds = [0, 1, 2, 3].map(idx => `lane-${signature}-${idx}`);

  const rhythms = [
    {
      id: pulseId,
      timeSignature: 1,
      noteName: initialPulse,
      color: '#a1a1aa',
      name: `Beat (1♩)`,
      frequency: NOTES[initialPulse],
      volume: volumeFor(NOTES[initialPulse]),
      expression: 'cool',
      isMuted: false
    }
  ];

  const events = [];

  // Bar 2: Add all 4 chord lanes at the day's signature!
  const firstChord = giantStepsChords[0];
  events.push({
    at: 2,
    type: 'update',
    id: pulseId,
    patch: {
      noteName: firstChord.root,
      frequency: NOTES[firstChord.root],
      volume: volumeFor(NOTES[firstChord.root]),
      name: `Beat (1♩)`
    }
  });

  laneIds.forEach((id, idx) => {
    const note = firstChord.notes[idx];
    const color = firstChord.colors[idx];
    events.push({
      at: 2,
      type: 'add',
      rhythm: {
        id: id,
        timeSignature: signature,
        noteName: note,
        color: color,
        name: `${note} (${signature}♩)`,
        frequency: NOTES[note],
        volume: volumeFor(NOTES[note]),
        expression: 'cool',
        isMuted: false
      }
    });
  });

  // Bars 3 through 22: Mutate chord on each bar boundary!
  for (let i = 1; i < giantStepsChords.length; i++) {
    const bar = 2 + i; // bars 3 to 22
    const chord = giantStepsChords[i];

    events.push({
      at: bar,
      type: 'update',
      id: pulseId,
      patch: {
        noteName: chord.root,
        frequency: NOTES[chord.root],
        volume: volumeFor(NOTES[chord.root]),
        name: `Beat (1♩)`
      }
    });

    laneIds.forEach((id, idx) => {
      const note = chord.notes[idx];
      const color = chord.colors[idx];
      events.push({
        at: bar,
        type: 'update',
        id: id,
        patch: {
          noteName: note,
          frequency: NOTES[note],
          volume: volumeFor(NOTES[note]),
          color: color,
          name: `${note} (${signature}♩)`
        }
      });
    });
  }

  // Bar 23: Unwind - remove all chord lanes, leave pulse
  laneIds.forEach(id => {
    events.push({
      at: 23,
      type: 'remove',
      id: id
    });
  });

  // Bar 24: final pulse
  // Bar 25: end / silence

  const spec = {
    name: specName,
    title: title,
    description: `Giant Steps changes played in ${signature} meter (${signature} beats per bar) with 4 chord voices pulsing in unison against the downbeat.`,
    bars: bars,
    barDuration: barDuration,
    rhythms: rhythms,
    events: events
  };

  const outFile = resolve(specsDir, `${specName}.json`);
  writeFileSync(outFile, JSON.stringify(spec, null, 2));
  console.log(`Wrote ${outFile}`);
}

createMeterSpec(5, 'week7-test-giant-steps-5', 'Giant Steps in 5 (Test Option C)', 2.4);
createMeterSpec(3, 'week7-test-giant-steps-3', 'Giant Steps in 3 (Test Option C)', 2.1);
