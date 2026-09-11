# Day 4: Fibonacci Sequence (The Golden Spiral)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 4
- **Target Spec Name**: `week5-day4-fibonacci`

---

## 1. Musical Concept

- **Mathematical Sequence**: Fibonacci Sequence ($F_1=1, F_2=2, F_3=3, F_4=5, F_5=8, F_6=13$)
- **Signatures Mapped**: `1, 2, 3, 5, 8, 13` (6 lanes forming the famous Golden Spiral ratios: $2:3, 3:5, 5:8, 8:13 \rightarrow \phi \approx 1.618$)
- **Harmonic Palette**: A Minor 7 (`A3, C4, E4, G4, A4, C5` — grounded warm golden intervals)
- **Voicing Allocation**:
  - `1`: `A3` ($F_1 = 1$ — Fundamental Bass Root Downbeat Pulse)
  - `2`: `C4` ($F_2 = 2$ — Minor Third)
  - `3`: `E4` ($F_3 = 3$ — Perfect Fifth)
  - `5`: `G4` ($F_4 = 5$ — Minor Seventh)
  - `8`: `A4` ($F_5 = 8$ — Octave Root)
  - `13`: `C5` ($F_6 = 13$ — Minor Third Octave, softened shimmer at volume 0.38)

### Arc Timeline (~58.3s Runtime, `barDuration: 2.65s`)
- **Bars 0–1**: Solo Signature `1` (`A3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `2` (`C4`) — The $1:2$ Seed
- **Bar 4**: Enter `3` (`E4`) — The fundamental $2:3$ Hemiola
- **Bar 6**: Enter `5` (`G4`) — The $3:5$ Golden Pulse
- **Bar 8**: Enter `8` (`A4`) — The $5:8$ Spiral expansion
- **Bar 10**: Enter `13` (`C5`) — Full Fibonacci constellation active ($1, 2, 3, 5, 8, 13$)!
- **Bars 10–16 (6 bars)**: Peak hold of the Golden Ratio polyrhythmic matrix
- **Bars 16–21 (5 bars)**: Reverse unwind one lane per bar (`13`, `8`, `5`, `3`, `2`, `1`)
- **Bars 21–22 (1 bar)**: Silent closing bar (End at Bar 22)

---

## 2. Spec Draft (`public/specs/week5-day4-fibonacci.json`)

```jsonc
{
  "name": "Fibonacci Sequence (1, 2, 3, 5, 8, 13)",
  "title": "Fibonacci Sequence",
  "description": "The Fibonacci sequence (1, 2, 3, 5, 8, 13) turned into a Golden Spiral polyrhythm in A Minor.",
  "bars": 22,
  "barDuration": 2.65,
  "rhythms": [
    { "id": "fib-1", "timeSignature": 1, "noteName": "A3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "fib-2", "timeSignature": 2, "noteName": "C4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "fib-3", "timeSignature": 3, "noteName": "E4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "fib-5", "timeSignature": 5, "noteName": "G4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "fib-8", "timeSignature": 8, "noteName": "A4" } },
    { "at": 10, "type": "add", "rhythm": { "id": "fib-13", "timeSignature": 13, "noteName": "C5", "volume": 0.38 } },
    { "at": 16, "type": "remove", "id": "fib-13" },
    { "at": 17, "type": "remove", "id": "fib-8" },
    { "at": 18, "type": "remove", "id": "fib-5" },
    { "at": 19, "type": "remove", "id": "fib-3" },
    { "at": 20, "type": "remove", "id": "fib-2" },
    { "at": 21, "type": "remove", "id": "fib-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Fibonacci Sequence as a Polyrhythm (1, 2, 3, 5, 8, 13) - POLYRIZZEMS #shorts
- **Description**:
  The Fibonacci sequence (1, 2, 3, 5, 8, 13) turned into a Golden Spiral polyrhythm in A Minor 9.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day4-fibonacci&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #fibonacci #goldenratio #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `2:53 - 3:51`
- **Transition Title**: Day 4: Fibonacci Sequence ($1, 2, 3, 5, 8, 13$)
