# Day 2: Square Numbers (Quadratic Symmetry)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 2
- **Target Spec Name**: `week5-day2-square-numbers`

---

## 1. Musical Concept

- **Mathematical Sequence**: Square Numbers ($1^2, 2^2, 3^2, 4^2 = 1, 4, 9, 16$)
- **Signatures Mapped**: `1, 4, 9, 16` (4 lanes of quadratic geometric power)
- **Harmonic Palette**: D Minor (`D3, A3, D4, F4`)
- **Voicing Allocation**:
  - `1`: `D3` ($1^2 = 1$ — Fundamental Bass Root Downbeat Pulse)
  - `4`: `A3` ($2^2 = 4$ — Perfect Fifth)
  - `9`: `D4` ($3^2 = 9$ — Octave Root)
  - `16`: `F4` ($4^2 = 16$ — Minor Third, softened shimmer at volume 0.38)

### Arc Timeline (~57.0s Runtime, `barDuration: 2.85s`)
- **Bars 0–1**: Solo Signature `1` (`D3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `4` (`A3`) — $1:4$ Metric baseline ($2^2$)
- **Bar 5**: Enter `9` (`D4`) — The $4:9$ quadratic rub ($2^2$ vs $3^2$)
- **Bar 8**: Enter `16` (`F4`) — Full Square Numbers matrix ($1, 4, 9, 16$)!
- **Bars 8–16 (8 bars)**: Peak hold of the quadratic polyrhythmic matrix
- **Bars 16–19 (3 bars)**: Reverse unwind one lane per bar (`16`, `9`, `4`, `1`)
- **Bars 19–20 (1 bar)**: Silent closing bar (End at Bar 20)

---

## 2. Spec Draft (`public/specs/week5-day2-square-numbers.json`)

```jsonc
{
  "name": "Square Numbers (1, 4, 9, 16)",
  "title": "Square Numbers",
  "description": "Square numbers (1, 4, 9, 16) sonified into a rhythm in D Minor.",
  "bars": 20,
  "barDuration": 2.85,
  "rhythms": [
    { "id": "sq-1", "timeSignature": 1, "noteName": "D3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "sq-4", "timeSignature": 4, "noteName": "A3" } },
    { "at": 5, "type": "add", "rhythm": { "id": "sq-9", "timeSignature": 9, "noteName": "D4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "sq-16", "timeSignature": 16, "noteName": "F4", "volume": 0.38 } },
    { "at": 16, "type": "remove", "id": "sq-16" },
    { "at": 17, "type": "remove", "id": "sq-9" },
    { "at": 18, "type": "remove", "id": "sq-4" },
    { "at": 19, "type": "remove", "id": "sq-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: Square Numbers as a Polyrhythm (1, 4, 9, 16) - POLYRIZZEMS #shorts
- **Description**:
  Square numbers (1, 4, 9, 16) sonified into a rhythm in D Minor 7.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day2-square-numbers&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #squarenumbers #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `0:58 - 1:55`
- **Transition Title**: Day 2: Square Numbers ($1, 4, 9, 16$)
