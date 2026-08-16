# Day 2: Euler's Growth ($e = 2.7182$)

- **Week**: 3 (Mathematical Constants)
- **Order**: 2
- **Target Spec Name**: `week3-day2-euler-e`

---

## 1. Musical Concept

- **Mathematical Constant**: Euler's Number $e = 2.7182$
- **Decimal Digits Mapped**: `2, 7, 1, 8, 2` (5 sequential digits, ending cleanly before the period repeats)
- **Harmonic Palette**: E Minor 11 / Exponential Growth (`E3, B3, G4, D5, A5`)
- **Voicing Allocation**:
  - `2`: `E3` (Opening Digit 2. — Bass Root)
  - `7`: `B3` (1st Decimal Digit .7 — Fifth)
  - `1`: `G4` (2nd Decimal Digit .71 — Minor Third)
  - `8`: `D5` (3rd Decimal Digit .718 — Minor Seventh)
  - `2`: `A5` (4th Decimal Digit .7182 — Eleventh)

### Arc Timeline (~58.5s Runtime, `barDuration: 2.25s`)
- **Bars 0–1**: Solo Digit `2` (`E3`) — Sets the tempo cycle (2 bars)
- **Bar 2**: Enter `7` (`B3`) — 2 against 7 polyrhythm collision ($2.7$)
- **Bar 4**: Enter `1` (`G4`) — 2 : 7 with downbeat pulse ($2.71$)
- **Bar 6**: Enter `8` (`D5`) — 7 against 8 micro-rub interlock ($2.718$)
- **Bar 8**: Enter `2` (`A5`) — Full Euler exponential constellation ($2.7182$)!
- **Bars 8–18 (10 bars)**: Hold the complete Euler growth matrix (5 lanes sounding)
- **Bars 18–24**: Reverse unwind (`2`, `8`, `1`, `7`, `2`)
- **Bars 25–26**: Silent closing bar (End at Bar 26)

---

## 2. Spec Draft (`public/specs/week3-day2-euler-e.json`)

```jsonc
{
  "name": "Euler's Growth (e = 2.7182)",
  "title": "Euler's Constant (e = 2.7182)",
  "bars": 26,
  "barDuration": 2.25,
  "rhythms": [
    { "id": "e-2a", "timeSignature": 2, "noteName": "E3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "e-7", "timeSignature": 7, "noteName": "B3" } },
    { "at": 4, "type": "add", "rhythm": { "id": "e-1", "timeSignature": 1, "noteName": "G4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "e-8", "timeSignature": 8, "noteName": "D5" } },
    { "at": 8, "type": "add", "rhythm": { "id": "e-2b", "timeSignature": 2, "noteName": "A5" } },
    { "at": 18, "type": "remove", "id": "e-2b" },
    { "at": 20, "type": "remove", "id": "e-8" },
    { "at": 22, "type": "remove", "id": "e-1" },
    { "at": 23, "type": "remove", "id": "e-7" },
    { "at": 24, "type": "remove", "id": "e-2a" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: Euler's Constant in Polyrhythm (e = 2.7182) - POLYRIZZEMS #shorts
- **Description**:
  Euler's number $e$ (2.7182) mapped to 2, 7, 1, 8, 2 polyrhythmic pulses in E Minor 11. Hear exponential growth turned into pure rhythm!

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week3-day2-euler-e&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #eulersnumber #math #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `0:59 - 1:58`
- **Transition Title**: Day 2: Euler's Constant ($e = 2.7182$)
