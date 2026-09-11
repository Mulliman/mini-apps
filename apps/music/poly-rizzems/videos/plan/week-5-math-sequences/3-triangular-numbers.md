# Day 3: Triangular Numbers (Arithmetic Acceleration)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 3
- **Target Spec Name**: `week5-day3-triangular-numbers`

---

## 1. Musical Concept

- **Mathematical Sequence**: Triangular Numbers ($T_n = \frac{n(n+1)}{2} = 1, 3, 6, 10, 15$)
- **Signatures Mapped**: `1, 3, 6, 10, 15` (5 lanes of steady arithmetic acceleration: $+2, +3, +4, +5$)
- **Harmonic Palette**: F Major Triad (`F3, C4, F4, A4, C5` — pure warm harmonic consonance)
- **Voicing Allocation**:
  - `1`: `F3` ($T_1 = 1$ — Bass Root Downbeat Pulse)
  - `3`: `C4` ($T_2 = 3$ — Perfect Fifth)
  - `6`: `F4` ($T_3 = 6$ — Octave Root)
  - `10`: `A4` ($T_4 = 10$ — Major Third)
  - `15`: `C5` ($T_5 = 15$ — Fifth Octave, softened shimmer at volume 0.36)

### Arc Timeline (~57.75s Runtime, `barDuration: 2.75s`)
- **Bars 0–1**: Solo Signature `1` (`F3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `3` (`C4`) — $1:3$ Ternary pulse
- **Bar 4**: Enter `6` (`F4`) — $3:6$ Octave doubling
- **Bar 6**: Enter `10` (`A4`) — $6:10$ ($3:5$) Quinary syncopation
- **Bar 8**: Enter `15` (`C5`) — Full Triangular Numbers matrix ($1, 3, 6, 10, 15$)!
- **Bars 8–16 (8 bars)**: Peak hold of the triangular polyrhythmic structure
- **Bars 16–20 (4 bars)**: Reverse unwind one lane per bar (`15`, `10`, `6`, `3`, `1`)
- **Bars 20–21 (1 bar)**: Silent closing bar (End at Bar 21)

---

## 2. Spec Draft (`public/specs/week5-day3-triangular-numbers.json`)

```jsonc
{
  "name": "Triangular Numbers (1, 3, 6, 10, 15)",
  "title": "Triangular Numbers",
  "description": "The sequence of Triangular Numbers (1, 3, 6, 10, 15) mapped directly to a polyrhythm in F Major.",
  "bars": 21,
  "barDuration": 2.75,
  "rhythms": [
    { "id": "tri-1", "timeSignature": 1, "noteName": "F3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "tri-3", "timeSignature": 3, "noteName": "C4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "tri-6", "timeSignature": 6, "noteName": "F4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "tri-10", "timeSignature": 10, "noteName": "A4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "tri-15", "timeSignature": 15, "noteName": "C5", "volume": 0.36 } },
    { "at": 16, "type": "remove", "id": "tri-15" },
    { "at": 17, "type": "remove", "id": "tri-10" },
    { "at": 18, "type": "remove", "id": "tri-6" },
    { "at": 19, "type": "remove", "id": "tri-3" },
    { "at": 20, "type": "remove", "id": "tri-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: Triangular Numbers as a Polyrhythm (1, 3, 6, 10, 15) - POLYRIZZEMS #shorts
- **Description**:
  The sequence of Triangular Numbers (1, 3, 6, 10, 15) mapped directly to a polyrhythm in F Major 9.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day3-triangular-numbers&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #triangularnumbers #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `1:55 - 2:53`
- **Transition Title**: Day 3: Triangular Numbers ($1, 3, 6, 10, 15$)
