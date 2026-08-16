# Day 5: Euler-Mascheroni Constant ($\gamma = 0.577215664$)

- **Week**: 3 (Mathematical Constants)
- **Order**: 5
- **Target Spec Name**: `week3-day5-gamma-euler-mascheroni`

---

## 1. Musical Concept

- **Mathematical Constant**: Euler-Mascheroni Constant $\gamma = 0.577215664$ (Limiting difference between the harmonic series and natural logarithm)
- **Decimal Digits Mapped**: `5, 7, 7, 2, 1, 5, 6, 6, 4` (9 sequential significant digits without deduplication)
- **Harmonic Palette**: G13sus4 / Acoustic Harmonic Series Divergence (`G3, D4, G4, C5, D5, E5, F5, G5, A5`)
- **Voicing Allocation**:
  - `5`: `G3` (Opening Digit .5 — Bass Root)
  - `7`: `D4` (1st Decimal Digit .57 — Fifth)
  - `7`: `G4` (2nd Decimal Digit .577 — Root Octave)
  - `2`: `C5` (3rd Decimal Digit .5772 — Fourth)
  - `1`: `D5` (4th Decimal Digit .57721 — Fifth Octave)
  - `5`: `E5` (5th Decimal Digit .577215 — Sixth / Thirteenth)
  - `6`: `F5` (6th Decimal Digit .5772156 — Minor Seventh)
  - `6`: `G5` (7th Decimal Digit .57721566 — High Root)
  - `4`: `A5` (8th Decimal Digit .577215664 — Ninth)

### Arc Timeline (~58.5s Runtime, `barDuration: 2.25s`)
- **Bars 0–1**: Solo Digit `5` (`G3`) — Pulse setup (2 bars)
- **Bar 2**: Enter `7` (`D4`) — $0.57$
- **Bar 3**: Enter `7` (`G4`) — $0.577$
- **Bar 4**: Enter `2` (`C5`) — $0.5772$
- **Bar 5**: Enter `1` (`D5`) — $0.57721$
- **Bar 6**: Enter `5` (`E5`) — $0.577215$
- **Bar 7**: Enter `6` (`F5`) — $0.5772156$
- **Bar 8**: Enter `6` (`G5`) — $0.57721566$
- **Bar 9**: Enter `4` (`A5`) — Full 9-digit harmonic series matrix ($0.577215664$)!
- **Bars 9–17 (8 bars)**: Hold the complete Euler-Mascheroni divergence
- **Bars 17–25**: Reverse unwind one lane per bar (`4`, `6`, `6`, `5`, `1`, `2`, `7`, `7`, `5`)
- **Bars 25–26**: Silent closing bar (End at Bar 26)

---

## 2. Spec Draft (`public/specs/week3-day5-gamma-euler-mascheroni.json`)

```jsonc
{
  "name": "Euler-Mascheroni Constant (gamma = 0.577215664)",
  "title": "Euler-Mascheroni Constant (γ = 0.577215664)",
  "bars": 26,
  "barDuration": 2.25,
  "rhythms": [
    { "id": "gamma-5a", "timeSignature": 5, "noteName": "G3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "gamma-7a", "timeSignature": 7, "noteName": "D4" } },
    { "at": 3, "type": "add", "rhythm": { "id": "gamma-7b", "timeSignature": 7, "noteName": "G4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "gamma-2", "timeSignature": 2, "noteName": "C5" } },
    { "at": 5, "type": "add", "rhythm": { "id": "gamma-1", "timeSignature": 1, "noteName": "D5" } },
    { "at": 6, "type": "add", "rhythm": { "id": "gamma-5b", "timeSignature": 5, "noteName": "E5" } },
    { "at": 7, "type": "add", "rhythm": { "id": "gamma-6a", "timeSignature": 6, "noteName": "F5" } },
    { "at": 8, "type": "add", "rhythm": { "id": "gamma-6b", "timeSignature": 6, "noteName": "G5" } },
    { "at": 9, "type": "add", "rhythm": { "id": "gamma-4", "timeSignature": 4, "noteName": "A5" } },
    { "at": 17, "type": "remove", "id": "gamma-4" },
    { "at": 18, "type": "remove", "id": "gamma-6b" },
    { "at": 19, "type": "remove", "id": "gamma-6a" },
    { "at": 20, "type": "remove", "id": "gamma-5b" },
    { "at": 21, "type": "remove", "id": "gamma-1" },
    { "at": 22, "type": "remove", "id": "gamma-2" },
    { "at": 23, "type": "remove", "id": "gamma-7b" },
    { "at": 24, "type": "remove", "id": "gamma-7a" },
    { "at": 25, "type": "remove", "id": "gamma-5a" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Harmonic Series Constant in Polyrhythm (γ = 0.577215664) - POLYRIZZEMS #shorts
- **Description**:
  The Euler-Mascheroni constant $\gamma$ (0.577215664)—which governs the physics of the acoustic harmonic series—translated into 9 sequential polyrhythms in G13sus4.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week3-day5-gamma-euler-mascheroni&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #harmonicseries #math #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `3:58 - 4:57`
- **Transition Title**: Day 5: Euler-Mascheroni Constant ($\gamma = 0.577215664$)
