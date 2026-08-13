# Day 7: Grand Polyrhythmic Cascade (2, 3, 4, 5, 6, 8)

- **Week**: 1 (Basics)
- **Order**: 7
- **Target Spec Name**: `week1-day7-grand-polyrhythm`

---

## 1. Musical Concept

- **Chord**: C Major 9 (`C3`, `E3`, `G4`, `B4`, `D5`, `G5`)
- **Rhythmic Families**: Binary (`2`, `4`, `8`), Ternary (`3`, `6`), Quinary (`5`)
- **Voicing Allocation**:
  - `2`: `C3`
  - `3`: `E3`
  - `4`: `G4`
  - `5`: `B4`
  - `6`: `D5`
  - `8`: `G5`

---

## 2. Spec Draft (`public/specs/week1-day7-grand-polyrhythm.json`)

```jsonc
{
  "name": "Grand Polyrhythmic Cascade",
  "title": "Grand Polyrhythm (2,3,4,5,6,8)",
  "bars": 22,
  "barDuration": 2.5,
  "rhythms": [
    { "id": "two", "timeSignature": 2, "note": "C3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "three", "timeSignature": 3, "note": "E3" } },
    { "at": 4, "type": "add", "rhythm": { "id": "four", "timeSignature": 4, "note": "G4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "five", "timeSignature": 5, "note": "B4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "six", "timeSignature": 6, "note": "D5" } },
    { "at": 10, "type": "add", "rhythm": { "id": "eight", "timeSignature": 8, "note": "G5" } },
    { "at": 14, "type": "remove", "id": "eight" },
    { "at": 15, "type": "remove", "id": "six" },
    { "at": 16, "type": "remove", "id": "five" },
    { "at": 17, "type": "remove", "id": "four" },
    { "at": 18, "type": "remove", "id": "three" },
    { "at": 19, "type": "remove", "id": "two" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Ultimate Polyrhythmic Cascade! 💥 (2,3,4,5,6,8) #shorts
- **Description**: All 6 rhythmic families colliding on a C Major 9 chord! Week 1 finale! #polyrhythm #poly-pals #music #theory
