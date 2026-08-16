# Day 4: Pythagoras' Constant ($\sqrt{2} = 1.41421356$)

- **Week**: 3 (Mathematical Constants)
- **Order**: 4
- **Target Spec Name**: `week3-day4-sqrt2-pythagoras`

---

## 1. Musical Concept

- **Mathematical Constant**: Pythagoras' Constant / Square Diagonal $\sqrt{2} = 1.41421356$
- **Decimal Digits Mapped**: `1, 4, 1, 4, 2, 1, 3, 5, 6` (9 sequential significant digits without deduplication)
- **Harmonic Palette**: D Dorian / Geometric Quartal Harmony (`D3, G3, C4, F4, A4, C5, D5, F5, B5`)
- **Voicing Allocation**:
  - `1`: `D3` (Opening Digit 1. — Bass Root)
  - `4`: `G3` (1st Decimal Digit .4 — Fourth)
  - `1`: `C4` (2nd Decimal Digit .41 — Seventh)
  - `4`: `F4` (3rd Decimal Digit .414 — Third)
  - `2`: `A4` (4th Decimal Digit .4142 — Fifth)
  - `1`: `C5` (5th Decimal Digit .41421 — High Seventh)
  - `3`: `D5` (6th Decimal Digit .414213 — High Root)
  - `5`: `F5` (7th Decimal Digit .4142135 — High Third)
  - `6`: `B5` (8th Decimal Digit .41421356 — Triradial Sixth Shimmer)

### Arc Timeline (~58.5s Runtime, `barDuration: 2.25s`)
- **Bars 0–1**: Solo Digit `1` (`D3`) — Master tempo anchor (2 bars)
- **Bar 2**: Enter `4` (`G3`) — $1.4$
- **Bar 3**: Enter `1` (`C4`) — $1.41$
- **Bar 4**: Enter `4` (`F4`) — $1.414$
- **Bar 5**: Enter `2` (`A4`) — $1.4142$
- **Bar 6**: Enter `1` (`C5`) — $1.41421$
- **Bar 7**: Enter `3` (`D5`) — $1.414213$
- **Bar 8**: Enter `5` (`F5`) — $1.4142135$
- **Bar 9**: Enter `6` (`B5`) — Full 9-digit Pythagorean matrix ($1.41421356$)!
- **Bars 9–17 (8 bars)**: Hold the complete geometric lattice
- **Bars 17–25**: Reverse unwind one lane per bar (`6`, `5`, `3`, `1`, `2`, `4`, `1`, `4`, `1`)
- **Bars 25–26**: Silent closing bar (End at Bar 26)

---

## 2. Spec Draft (`public/specs/week3-day4-sqrt2-pythagoras.json`)

```jsonc
{
  "name": "Pythagoras' Constant (sqrt2 = 1.41421356)",
  "title": "Pythagoras' Constant (√2 = 1.41421356)",
  "bars": 26,
  "barDuration": 2.25,
  "rhythms": [
    { "id": "sqrt-1a", "timeSignature": 1, "noteName": "D3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "sqrt-4a", "timeSignature": 4, "noteName": "G3" } },
    { "at": 3, "type": "add", "rhythm": { "id": "sqrt-1b", "timeSignature": 1, "noteName": "C4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "sqrt-4b", "timeSignature": 4, "noteName": "F4" } },
    { "at": 5, "type": "add", "rhythm": { "id": "sqrt-2", "timeSignature": 2, "noteName": "A4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "sqrt-1c", "timeSignature": 1, "noteName": "C5" } },
    { "at": 7, "type": "add", "rhythm": { "id": "sqrt-3", "timeSignature": 3, "noteName": "D5" } },
    { "at": 8, "type": "add", "rhythm": { "id": "sqrt-5", "timeSignature": 5, "noteName": "F5" } },
    { "at": 9, "type": "add", "rhythm": { "id": "sqrt-6", "timeSignature": 6, "noteName": "B5" } },
    { "at": 17, "type": "remove", "id": "sqrt-6" },
    { "at": 18, "type": "remove", "id": "sqrt-5" },
    { "at": 19, "type": "remove", "id": "sqrt-3" },
    { "at": 20, "type": "remove", "id": "sqrt-1c" },
    { "at": 21, "type": "remove", "id": "sqrt-2" },
    { "at": 22, "type": "remove", "id": "sqrt-4b" },
    { "at": 23, "type": "remove", "id": "sqrt-1b" },
    { "at": 24, "type": "remove", "id": "sqrt-4a" },
    { "at": 25, "type": "remove", "id": "sqrt-1a" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Square Root of 2 in Polyrhythm (1.41421356) - POLYRIZZEMS #shorts
- **Description**:
  The diagonal of the unit square $\sqrt{2}$ (1.41421356) turned into a 9-lane sequential polyrhythm in D Dorian Quartal harmony. Geometry brought to life!

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week3-day4-sqrt2-pythagoras&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #pythagoras #math #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `2:58 - 3:58`
- **Transition Title**: Day 4: Pythagoras' Constant ($\sqrt{2} = 1.41421356$)
