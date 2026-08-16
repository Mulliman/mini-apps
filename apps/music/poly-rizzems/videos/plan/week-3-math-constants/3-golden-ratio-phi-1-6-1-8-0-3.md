# Day 3: The Golden Ratio ($\phi = 1.61803398$)

- **Week**: 3 (Mathematical Constants)
- **Order**: 3
- **Target Spec Name**: `week3-day3-phi-golden-ratio`

---

## 1. Musical Concept

- **Mathematical Constant**: Golden Ratio $\phi = 1.61803398$
- **Decimal Digits Mapped**: `1, 6, 1, 8, 0, 3, 3, 9, 8` (9 sequential significant digits without deduplication)
- **Harmonic Palette**: A Minor 9 / Golden Interval Proportions (`A3, C4, E4, F4, A4 (rest), C5, E5, B5, C6`)
- **Special Feature**: Utilizes the **`0` Rest/Void Lane** (styled in muted grey `#808080`) to represent the zero digit in $1.618\mathbf{0}3398$ as a peaceful sleeping ball on the floor.
- **Voicing Allocation**:
  - `1`: `A3` (Opening Digit 1. — Bass Root)
  - `6`: `C4` (1st Decimal Digit .6 — Minor Third)
  - `1`: `E4` (2nd Decimal Digit .61 — Fifth)
  - `8`: `F4` (3rd Decimal Digit .618 — Minor Sixth / Golden interval)
  - `0`: `A4` (4th Decimal Digit .6180 — Rest / Void Lane in grey `#808080`)
  - `3`: `C5` (5th Decimal Digit .61803 — Octave Third)
  - `3`: `E5` (6th Decimal Digit .618033 — Octave Fifth)
  - `9`: `B5` (7th Decimal Digit .6180339 — Ninth)
  - `8`: `C6` (8th Decimal Digit .61803398 — High Golden Shimmer)

### Arc Timeline (~58.5s Runtime, `barDuration: 2.25s`)
- **Bars 0–1**: Solo Digit `1` (`A3`) — Master tempo anchor (2 bars)
- **Bar 2**: Enter `6` (`C4`) — $1.6$
- **Bar 3**: Enter `1` (`E4`) — $1.61$
- **Bar 4**: Enter `8` (`F4`) — $1.618$ (Golden interval acoustic tension)
- **Bar 5**: Enter `0` (`A4`) — $1.6180$ (The Rest / Void lane rests peacefully in grey on the floor)
- **Bar 6**: Enter `3` (`C5`) — $1.61803$
- **Bar 7**: Enter `3` (`E5`) — $1.618033$
- **Bar 8**: Enter `9` (`B5`) — $1.6180339$
- **Bar 9**: Enter `8` (`C6`) — Full 9-digit Golden Ratio constellation ($1.61803398$)!
- **Bars 9–17 (8 bars)**: Hold the complete Golden Ratio polyrhythm
- **Bars 17–25**: Reverse unwind one lane per bar (`8`, `9`, `3`, `3`, `0`, `8`, `1`, `6`, `1`)
- **Bars 25–26**: Silent closing bar (End at Bar 26)

---

## 2. Spec Draft (`public/specs/week3-day3-phi-golden-ratio.json`)

```jsonc
{
  "name": "Golden Ratio (phi = 1.61803398)",
  "title": "The Golden Ratio (ϕ = 1.61803398)",
  "bars": 26,
  "barDuration": 2.25,
  "rhythms": [
    { "id": "phi-1a", "timeSignature": 1, "noteName": "A3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "phi-6", "timeSignature": 6, "noteName": "C4" } },
    { "at": 3, "type": "add", "rhythm": { "id": "phi-1b", "timeSignature": 1, "noteName": "E4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "phi-8a", "timeSignature": 8, "noteName": "F4" } },
    { "at": 5, "type": "add", "rhythm": { "id": "phi-0", "timeSignature": 0, "noteName": "A4", "expression": "sleepy" } },
    { "at": 6, "type": "add", "rhythm": { "id": "phi-3a", "timeSignature": 3, "noteName": "C5" } },
    { "at": 7, "type": "add", "rhythm": { "id": "phi-3b", "timeSignature": 3, "noteName": "E5" } },
    { "at": 8, "type": "add", "rhythm": { "id": "phi-9", "timeSignature": 9, "noteName": "B5" } },
    { "at": 9, "type": "add", "rhythm": { "id": "phi-8b", "timeSignature": 8, "noteName": "C6" } },
    { "at": 17, "type": "remove", "id": "phi-8b" },
    { "at": 18, "type": "remove", "id": "phi-9" },
    { "at": 19, "type": "remove", "id": "phi-3b" },
    { "at": 20, "type": "remove", "id": "phi-3a" },
    { "at": 21, "type": "remove", "id": "phi-0" },
    { "at": 22, "type": "remove", "id": "phi-8a" },
    { "at": 23, "type": "remove", "id": "phi-1b" },
    { "at": 24, "type": "remove", "id": "phi-6" },
    { "at": 25, "type": "remove", "id": "phi-1a" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Golden Ratio in Polyrhythm (1.61803398) - POLYRIZZEMS #shorts
- **Description**:
  The Golden Ratio $\phi$ (1.61803398) translated into polyrhythms in A Minor 9.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week3-day3-phi-golden-ratio&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #goldenratio #math #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `1:58 - 2:58`
- **Transition Title**: Day 3: The Golden Ratio ($\phi = 1.61803398$)
