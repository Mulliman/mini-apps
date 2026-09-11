# Day 7: Prime Numbers (The Ultimate Polyrhythm)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 7
- **Target Spec Name**: `week5-day7-prime-numbers`

---

## 1. Musical Concept

- **Mathematical Sequence**: The Prime Numbers ($2, 3, 5, 7, 11, 13$)
- **Signatures Mapped**: `2, 3, 5, 7, 11, 13` (6 lanes with zero shared factors, colliding in non-repeating micro-patterns until downbeats align)
- **Harmonic Palette**: C Major 7 (`C3, G3, C4, E4, G4, B4` — warm diatonic prime resonance)
- **Voicing Allocation**:
  - `2`: `C3` (1st Prime: 2 — Fundamental Bass Root Pulse)
  - `3`: `G3` (2nd Prime: 3 — Perfect Fifth)
  - `5`: `C4` (3rd Prime: 5 — Octave Root)
  - `7`: `E4` (4th Prime: 7 — Major Third)
  - `11`: `G4` (5th Prime: 11 — Fifth Octave, softened volume 0.42)
  - `13`: `B4` (6th Prime: 13 — Major Seventh Shimmer, softened volume 0.36)

### Arc Timeline (~58.3s Runtime, `barDuration: 2.65s`)
- **Bars 0–1**: Solo Signature `2` (`C3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `3` (`G3`) — The fundamental $2:3$ Prime Hemiola
- **Bar 4**: Enter `5` (`C4`) — The $2:3:5$ Prime Trinity
- **Bar 6**: Enter `7` (`E4`) — The $2:3:5:7$ Quad Prime collision
- **Bar 8**: Enter `11` (`G4`) — 5-lane Prime constellation
- **Bar 10**: Enter `13` (`B4`) — Full Prime Numbers apex active ($2, 3, 5, 7, 11, 13$)!
- **Bars 10–16 (6 bars)**: Peak hold of the ultimate prime polyrhythmic matrix
- **Bars 16–21 (5 bars)**: Reverse unwind one lane per bar (`13`, `11`, `7`, `5`, `3`, `2`)
- **Bars 21–22 (1 bar)**: Silent closing bar (End at Bar 22)

---

## 2. Spec Draft (`public/specs/week5-day7-prime-numbers.json`)

```jsonc
{
  "name": "Prime Numbers (2, 3, 5, 7, 11, 13)",
  "title": "Prime Numbers",
  "description": "The first 6 Prime Numbers (2, 3, 5, 7, 11, 13) transformed into the ultimate mathematical polyrhythm in C Major.",
  "bars": 22,
  "barDuration": 2.65,
  "rhythms": [
    { "id": "prm-2", "timeSignature": 2, "noteName": "C3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "prm-3", "timeSignature": 3, "noteName": "G3" } },
    { "at": 4, "type": "add", "rhythm": { "id": "prm-5", "timeSignature": 5, "noteName": "C4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "prm-7", "timeSignature": 7, "noteName": "E4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "prm-11", "timeSignature": 11, "noteName": "G4", "volume": 0.42 } },
    { "at": 10, "type": "add", "rhythm": { "id": "prm-13", "timeSignature": 13, "noteName": "B4", "volume": 0.36 } },
    { "at": 16, "type": "remove", "id": "prm-13" },
    { "at": 17, "type": "remove", "id": "prm-11" },
    { "at": 18, "type": "remove", "id": "prm-7" },
    { "at": 19, "type": "remove", "id": "prm-5" },
    { "at": 20, "type": "remove", "id": "prm-3" },
    { "at": 21, "type": "remove", "id": "prm-2" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Prime Numbers as a Polyrhythm (2, 3, 5, 7, 11, 13) - POLYRIZZEMS #shorts
- **Description**:
  The first 6 Prime Numbers (2, 3, 5, 7, 11, 13) transformed into the ultimate mathematical polyrhythm in C Major 13.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day7-prime-numbers&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #primenumbers #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `5:46 - 6:44`
- **Transition Title**: Day 7: Prime Numbers ($2, 3, 5, 7, 11, 13$)
