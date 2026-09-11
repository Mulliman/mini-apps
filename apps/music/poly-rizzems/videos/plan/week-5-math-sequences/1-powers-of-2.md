# Day 1: Powers of 2 (The Binary Pulse)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 1
- **Target Spec Name**: `week5-day1-powers-of-2`

---

## 1. Musical Concept

- **Mathematical Sequence**: Powers of 2 ($2^0, 2^1, 2^2, 2^3, 2^4 = 1, 2, 4, 8, 16$)
- **Signatures Mapped**: `1, 2, 4, 8, 16` (5 lanes of perfect binary doubling)
- **Harmonic Palette**: C Major Triad (`C3, G3, C4, E4, G4` — pure consonant harmony)
- **Voicing Allocation**:
  - `1`: `C3` ($2^0 = 1$ — Fundamental Bass Root Downbeat Pulse)
  - `2`: `G3` ($2^1 = 2$ — Perfect Fifth)
  - `4`: `C4` ($2^2 = 4$ — Octave Root)
  - `8`: `E4` ($2^3 = 8$ — Major Third)
  - `16`: `G4` ($2^4 = 16$ — Fifth Octave, softened shimmer)

### Arc Timeline (~57.0s Runtime, `barDuration: 2.85s`)
- **Bars 0–1**: Solo Signature `1` (`C3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `2` (`G3`) — $1:2$ Octave Doubling begins
- **Bar 4**: Enter `4` (`C4`) — $1:2:4$ Quarter-note subdivision
- **Bar 6**: Enter `8` (`E4`) — $1:2:4:8$ Major Third harmonic warmth
- **Bar 8**: Enter `16` (`G4`) — Full Powers of 2 constellation active ($1, 2, 4, 8, 16$)!
- **Bars 8–15 (7 bars)**: Peak hold of the complete binary matrix
- **Bars 15–19 (4 bars)**: Reverse unwind one lane per bar (`16`, `8`, `4`, `2`, `1`)
- **Bars 19–20 (1 bar)**: Silent closing bar (End at Bar 20)

---

## 2. Spec Draft (`public/specs/week5-day1-powers-of-2.json`)

```jsonc
{
  "name": "Powers of 2 (1, 2, 4, 8, 16)",
  "title": "Powers of 2",
  "description": "The pure mathematical sequence of Powers of 2 (1, 2, 4, 8, 16) turned into a rhythm in C Major.",
  "bars": 20,
  "barDuration": 2.85,
  "rhythms": [
    { "id": "pow-1", "timeSignature": 1, "noteName": "C3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "pow-2", "timeSignature": 2, "noteName": "G3" } },
    { "at": 4, "type": "add", "rhythm": { "id": "pow-4", "timeSignature": 4, "noteName": "C4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "pow-8", "timeSignature": 8, "noteName": "E4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "pow-16", "timeSignature": 16, "noteName": "G4", "volume": 0.40 } },
    { "at": 15, "type": "remove", "id": "pow-16" },
    { "at": 16, "type": "remove", "id": "pow-8" },
    { "at": 17, "type": "remove", "id": "pow-4" },
    { "at": 18, "type": "remove", "id": "pow-2" },
    { "at": 19, "type": "remove", "id": "pow-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: Powers of 2 as a Rhythm (1, 2, 4, 8, 16) - POLYRIZZEMS #shorts
- **Description**:
  The pure mathematical sequence of Powers of 2 (1, 2, 4, 8, 16) turned into a rhythm in C Major 7.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day1-powers-of-2&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #powersof2 #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `0:00 - 0:58`
- **Transition Title**: Day 1: Powers of 2 ($1, 2, 4, 8, 16$)
