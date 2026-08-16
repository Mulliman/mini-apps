# Day 6: Feigenbaum Constant ($\delta = 4.6692016$)

- **Week**: 3 (Mathematical Constants)
- **Order**: 6
- **Target Spec Name**: `week3-day6-feigenbaum-delta`

---

## 1. Musical Concept

- **Mathematical Constant**: Feigenbaum Bifurcation Constant $\delta = 4.6692016$ (Universal rate of period-doubling route to Chaos)
- **Decimal Digits Mapped**: `4, 6, 6, 9, 2, 0, 1, 6` (8 sequential significant digits without deduplication)
- **Harmonic Palette**: C Major 9 / Bifurcation Cascade (`C3, G3, D4, E4, B4, C5 (rest), D5, G5`)
- **Special Feature**: Combines the **`0` Rest/Void Lane** (styled in muted grey `#808080`) with sequential digits to showcase period-doubling dynamics dissolving into polyrhythmic chaos.
- **Voicing Allocation**:
  - `4`: `C3` (Opening Digit 4. — Bass Root)
  - `6`: `G3` (1st Decimal Digit .6 — Fifth)
  - `6`: `D4` (2nd Decimal Digit .66 — Ninth)
  - `9`: `E4` (3rd Decimal Digit .669 — Major Third)
  - `2`: `B4` (4th Decimal Digit .6692 — Major Seventh)
  - `0`: `C5` (5th Decimal Digit .66920 — Rest / Void Lane in grey `#808080`)
  - `1`: `D5` (6th Decimal Digit .669201 — High Ninth)
  - `6`: `G5` (7th Decimal Digit .6692016 — High Fifth Shimmer)

### Arc Timeline (~58.5s Runtime, `barDuration: 2.25s`)
- **Bars 0–1**: Solo Digit `4` (`C3`) — Pulse setup (2 bars)
- **Bar 2**: Enter `6` (`G3`) — $4.6$
- **Bar 3**: Enter `6` (`D4`) — $4.66$
- **Bar 4**: Enter `9` (`E4`) — $4.669$
- **Bar 5**: Enter `2` (`B4`) — $4.6692$
- **Bar 6**: Enter `0` (`C5`) — $4.66920$ (The Rest / Void lane rests peacefully in grey on the floor)
- **Bar 7**: Enter `1` (`D5`) — $4.669201$
- **Bar 8**: Enter `6` (`G5`) — Full 8-digit Feigenbaum chaos waterfall ($4.6692016$)!
- **Bars 8–18 (10 bars)**: Hold the complete Feigenbaum Chaos matrix (7 active lanes + 1 rest lane)
- **Bars 18–25**: Reverse unwind one lane per bar (`6`, `1`, `0`, `2`, `9`, `6`, `6`, `4`)
- **Bars 25–26**: Silent closing bar (End at Bar 26)

---

## 2. Spec Draft (`public/specs/week3-day6-feigenbaum-delta.json`)

```jsonc
{
  "name": "Feigenbaum Constant (delta = 4.6692016)",
  "title": "The Chaos Constant (δ = 4.6692016)",
  "bars": 26,
  "barDuration": 2.25,
  "rhythms": [
    { "id": "delta-4", "timeSignature": 4, "noteName": "C3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "delta-6a", "timeSignature": 6, "noteName": "G3" } },
    { "at": 3, "type": "add", "rhythm": { "id": "delta-6b", "timeSignature": 6, "noteName": "D4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "delta-9", "timeSignature": 9, "noteName": "E4" } },
    { "at": 5, "type": "add", "rhythm": { "id": "delta-2", "timeSignature": 2, "noteName": "B4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "delta-0", "timeSignature": 0, "noteName": "C5", "expression": "sleepy" } },
    { "at": 7, "type": "add", "rhythm": { "id": "delta-1", "timeSignature": 1, "noteName": "D5" } },
    { "at": 8, "type": "add", "rhythm": { "id": "delta-6c", "timeSignature": 6, "noteName": "G5" } },
    { "at": 18, "type": "remove", "id": "delta-6c" },
    { "at": 19, "type": "remove", "id": "delta-1" },
    { "at": 20, "type": "remove", "id": "delta-0" },
    { "at": 21, "type": "remove", "id": "delta-2" },
    { "at": 22, "type": "remove", "id": "delta-9" },
    { "at": 23, "type": "remove", "id": "delta-6b" },
    { "at": 24, "type": "remove", "id": "delta-6a" },
    { "at": 25, "type": "remove", "id": "delta-4" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Chaos Theory Constant in Polyrhythm (δ = 4.6692016) - POLYRIZZEMS #shorts
- **Description**:
  The Feigenbaum constant $\delta$ (4.6692016)—the universal constant behind chaos theory—turned into an 8-lane sequential polyrhythm in C Major 9.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week3-day6-feigenbaum-delta&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #chaostheory #math #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `4:57 - 5:57`
- **Transition Title**: Day 6: Feigenbaum Constant ($\delta = 4.6692016$)
