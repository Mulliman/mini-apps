import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specsDir = resolve(appDir, 'public', 'specs');

const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C6: 1046.50
};

function volumeFor(freq) {
  const raw = 0.85 * Math.pow(261.63 / freq, 0.5);
  return Math.round(Math.min(1.0, Math.max(0.2, raw)) * 100) / 100;
}

const specs = [
  {
    name: 'week6-day1-1-5-6-4-pop',
    title: '1-5-6-4 The 4 Chords of Pop',
    description: 'The iconic I-V-vi-IV pop progression (Journey, Beatles "Let It Be", U2 "With Or Without You", Adele "Someone Like You") driven by a mutating 1 vs 5 vs 6 vs 4 polyrhythm.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'C3',
    // 4 polyrhythm lanes: 1, 5, 6, 4
    laneSignatures: [1, 5, 6, 4],
    chords: [
      { name: 'C', root: 'C3', notes: ['C3', 'G4', 'B4', 'E5'], colors: ['#ccff00', '#39ff14', '#00f0ff', '#00ffd0'], duration: 1 },
      { name: 'G', root: 'G3', notes: ['G3', 'D4', 'F4', 'B4'], colors: ['#ff073a', '#ff5f00', '#fffb00', '#ff007f'], duration: 1 },
      { name: 'Am', root: 'A3', notes: ['A3', 'E4', 'G4', 'C5'], colors: ['#ff00ea', '#b026ff', '#ff007f', '#00f0ff'], duration: 1 },
      { name: 'F', root: 'F3', notes: ['F3', 'C4', 'E4', 'A4'], colors: ['#00f0ff', '#39ff14', '#ccff00', '#fffb00'], duration: 1 }
    ]
  },
  {
    name: 'week6-day2-2-5-1-jazz',
    title: '2-5-1 Jazz Standard',
    description: 'The definitive ii-V-I jazz cadence ("Autumn Leaves", "Fly Me to the Moon", Miles Davis "Tune Up", Stevie Wonder "Sir Duke") powered by a mutating 2 vs 5 vs 1 polyrhythm.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'C3',
    // 3 polyrhythm lanes: 2, 5, 1
    laneSignatures: [2, 5, 1],
    chords: [
      { name: 'Dm', root: 'D3', notes: ['D3', 'F4', 'A4'], colors: ['#ff00ea', '#ff007f', '#b026ff'], duration: 1 },
      { name: 'G', root: 'G3', notes: ['G3', 'B4', 'D5'], colors: ['#ff073a', '#ff5f00', '#fffb00'], duration: 1 },
      { name: 'C', root: 'C3', notes: ['C3', 'E4', 'G4'], colors: ['#ccff00', '#39ff14', '#00f0ff'], duration: 2 }
    ]
  },
  {
    name: 'week6-day3-1-7-4-classic-rock',
    title: '1-7-4 Classic Rock Swagger',
    description: 'The swaggering I-bVII-IV groove ("Sweet Home Alabama", Beatles "Hey Jude" outro, Rolling Stones "Sympathy for the Devil", AC/DC) driven by a 1 vs 7 vs 4 polyrhythm.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'G3',
    // 3 polyrhythm lanes: 1, 7, 4
    laneSignatures: [1, 7, 4],
    chords: [
      { name: 'G', root: 'G3', notes: ['G3', 'B4', 'D5'], colors: ['#fffb00', '#ff5f00', '#ff073a'], duration: 1 },
      { name: 'F', root: 'F3', notes: ['F3', 'A4', 'C5'], colors: ['#ff007f', '#b026ff', '#ff00ea'], duration: 1 },
      { name: 'C', root: 'C3', notes: ['C3', 'E4', 'G4'], colors: ['#ccff00', '#39ff14', '#00f0ff'], duration: 2 }
    ]
  },
  {
    name: 'week6-day4-1-3-4-5-rising-ballad',
    title: '1-3-4-5 The Rising Ballad',
    description: 'The emotional ascending I-iii-IV-V progression (Oasis "Don\'t Look Back in Anger", Bill Withers "Lean on Me", Beatles "Here, There and Everywhere") driven by a 1 vs 3 vs 4 vs 5 polyrhythm.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'C3',
    // 4 polyrhythm lanes: 1, 3, 4, 5
    laneSignatures: [1, 3, 4, 5],
    chords: [
      { name: 'C', root: 'C3', notes: ['C3', 'E4', 'G4', 'C5'], colors: ['#00f0ff', '#00ffd0', '#39ff14', '#ccff00'], duration: 1 },
      { name: 'Em', root: 'E3', notes: ['E3', 'G4', 'B4', 'E5'], colors: ['#b026ff', '#ff00ea', '#ff007f', '#00f0ff'], duration: 1 },
      { name: 'F', root: 'F3', notes: ['F3', 'A4', 'C5', 'F5'], colors: ['#39ff14', '#ccff00', '#fffb00', '#ff5f00'], duration: 1 },
      { name: 'G', root: 'G3', notes: ['G3', 'B4', 'D5', 'G5'], colors: ['#ff5f00', '#ff073a', '#fffb00', '#ff007f'], duration: 1 }
    ]
  },
  {
    name: 'week6-day5-1-4-5-blues-rock',
    title: '1-4-5 Rock & Blues Cadence',
    description: 'The foundation of rock and blues (Beatles "Twist and Shout", "Wild Thing", "La Bamba", Chuck Berry "Johnny B. Goode") driven by a 1 vs 4 vs 5 polyrhythm cycling IV-V-I-I.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'C3',
    // 3 polyrhythm lanes: 1, 4, 5
    laneSignatures: [1, 4, 5],
    chords: [
      { name: 'F', root: 'F3', notes: ['F3', 'A4', 'C5'], colors: ['#ff5f00', '#b026ff', '#ff073a'], duration: 1 },
      { name: 'G', root: 'G3', notes: ['G3', 'B4', 'D5'], colors: ['#ccff00', '#00ffd0', '#ff00ea'], duration: 1 },
      { name: 'C', root: 'C3', notes: ['C3', 'E4', 'G4'], colors: ['#39ff14', '#ff007f', '#00f0ff'], duration: 2 }
    ]
  },
  {
    name: 'week6-day6-1-7-6-5-flamenco',
    title: '1-7-6-5 The Spanish Descent',
    description: 'The Spanish minor descent from Ray Charles "Hit the Road Jack" (also Dire Straits "Sultans of Swing", Muse "Hysteria") played in its original key of G# Minor with authentic parallel descending horn voicings.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'G#3',
    // 4 polyrhythm lanes: 1, 7, 6, 5
    laneSignatures: [1, 7, 6, 5],
    chords: [
      { name: 'G#m', root: 'G#3', notes: ['G#3', 'D#4', 'G#4', 'B4'], colors: ['#ff00ea', '#ff007f', '#b026ff', '#ff073a'], duration: 1 },
      { name: 'F#', root: 'F#3', notes: ['F#3', 'C#4', 'F#4', 'A#4'], colors: ['#ff073a', '#ff5f00', '#fffb00', '#ff007f'], duration: 1 },
      { name: 'E', root: 'E3', notes: ['E3', 'B3', 'E4', 'G#4'], colors: ['#ccff00', '#39ff14', '#00f0ff', '#00ffd0'], duration: 1 },
      { name: 'D#m', root: 'D#3', notes: ['D#3', 'A#3', 'D#4', 'F#4'], colors: ['#00ffd0', '#00f0ff', '#b026ff', '#ff00ea'], duration: 1 }
    ]
  },
  {
    name: 'week6-day7-1-6-2-5-bebop',
    title: '1-6-2-5 The 50s Doo-Wop Loop',
    description: 'The iconic 4-chord doo-wop progression from Frankie Lymon & The Teenagers "Why Do Fools Fall in Love" (also The Marcels "Blue Moon", George Gershwin "I Got Rhythm") played in its original key of F Major with a mutating 1 vs 6 vs 2 vs 5 polyrhythm.',
    bars: 24,
    barDuration: 2.4,
    initialPulse: 'F3',
    // 4 polyrhythm lanes: 1, 6, 2, 5
    laneSignatures: [1, 6, 2, 5],
    chords: [
      { name: 'F', root: 'F3', notes: ['F3', 'C4', 'F4', 'A4'], colors: ['#00f0ff', '#39ff14', '#ccff00', '#00ffd0'], duration: 1 },
      { name: 'Dm7', root: 'D3', notes: ['D3', 'C4', 'F4', 'A4'], colors: ['#ff00ea', '#b026ff', '#ff007f', '#00f0ff'], duration: 1 },
      { name: 'Gm7', root: 'G3', notes: ['G3', 'D4', 'F4', 'Bb4'], colors: ['#ff007f', '#b026ff', '#ff073a', '#ff5f00'], duration: 1 },
      { name: 'C7', root: 'C3', notes: ['C3', 'E4', 'G4', 'Bb4'], colors: ['#ff073a', '#ff5f00', '#fffb00', '#ff00ea'], duration: 1 }
    ]
  }
];

export function buildSpecs() {
  for (const s of specs) {
    const dayPrefix = s.name.split('-')[1];
    const pulseId = `${dayPrefix}-pulse`;
    const laneIds = s.laneSignatures.map((sig, idx) => `${dayPrefix}-lane-${sig}-${idx}`);

    // Initial rhythm setup at Bar 0: only Pulse
    const rhythms = [
      {
        id: pulseId,
        timeSignature: 1,
        noteName: s.initialPulse,
        color: '#a1a1aa',
        name: `Beat (1♩)`,
        frequency: NOTES[s.initialPulse],
        volume: volumeFor(NOTES[s.initialPulse]),
        expression: 'cool',
        isMuted: false
      }
    ];

    const events = [];

    // Bar 2: Add all polyrhythm lanes with Chord 0 notes & colors
    const firstChord = s.chords[0];
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

    s.laneSignatures.forEach((sig, idx) => {
      const note = firstChord.notes[idx];
      const color = firstChord.colors[idx];
      events.push({
        at: 2,
        type: 'add',
        rhythm: {
          id: laneIds[idx],
          timeSignature: sig,
          noteName: note,
          color: color,
          name: `${note} (${sig}♩)`,
          frequency: NOTES[note],
          volume: volumeFor(NOTES[note]),
          expression: 'cool',
          isMuted: false
        }
      });
    });

    // Generate cycles across bars 2 to 21
    // Total cycle length in bars = sum of chord durations (always 4 bars)
    const cycleLen = s.chords.reduce((sum, c) => sum + c.duration, 0); // 4 bars
    const maxBar = 21;

    for (let bar = 2; bar <= maxBar; ) {
      for (let cIdx = 0; cIdx < s.chords.length; cIdx++) {
        const chord = s.chords[cIdx];
        if (bar > 2) {
          // Update pulse note to chord root
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

          // Update each lane to chord note and color
          s.laneSignatures.forEach((sig, idx) => {
            const note = chord.notes[idx];
            const color = chord.colors[idx];
            events.push({
              at: bar,
              type: 'update',
              id: laneIds[idx],
              patch: {
                noteName: note,
                frequency: NOTES[note],
                volume: volumeFor(NOTES[note]),
                color: color,
                name: `${note} (${sig}♩)`
              }
            });
          });
        }
        bar += chord.duration;
        if (bar > maxBar) break;
      }
    }

    // Bar 22: Unwind / remove lanes
    laneIds.forEach(id => {
      events.push({ at: 22, type: 'remove', id });
    });
    events.push({ at: 23, type: 'remove', id: pulseId });

    const specJson = {
      name: s.name,
      title: s.title,
      description: s.description,
      bars: s.bars,
      barDuration: s.barDuration,
      rhythms,
      events
    };

    const targetPath = resolve(specsDir, `${s.name}.json`);
    writeFileSync(targetPath, JSON.stringify(specJson, null, 2), 'utf-8');
    console.log(`Generated: ${s.name}.json`);
  }
}

buildSpecs();
