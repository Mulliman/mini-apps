# Day 6: Pure Binary Acceleration (2, 4, 8, 16)

- **Week**: 1 (Basics)
- **Order**: 6
- **Target Spec Name**: `week1-day6-binary-stack`

---

## 1. Musical Concept

- **Chord**: C Major (`C3`, `G3`, `C4`, `E5`)
- **Primary Family**: Binary (`2`, `4`, `8`, `16`)
- **Voicing Allocation**:
  - `2`: `C3`
  - `4`: `G3`
  - `8`: `C4`
  - `16`: `E5`

---

## 2. Spec Draft (`public/specs/week1-day6-binary-stack.json`)

```jsonc
{
  "name": "Binary Acceleration (2,4,8,16)",
  "title": "Pure Binary Stack",
  "bars": 16,
  "barDuration": 2.5,
  "rhythms": [
    { "id": "two", "timeSignature": 2, "note": "C3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "four", "timeSignature": 4, "note": "G3" } },
    { "at": 4, "type": "add", "rhythm": { "id": "eight", "timeSignature": 8, "note": "C4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "sixteen", "timeSignature": 16, "note": "E5" } },
    { "at": 11, "type": "remove", "id": "sixteen" },
    { "at": 12, "type": "remove", "id": "eight" },
    { "at": 13, "type": "remove", "id": "four" },
    { "at": 14, "type": "remove", "id": "two" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: Doubling speeds: 2 ➔ 4 ➔ 8 ➔ 16! ⚡ #shorts
- **Description**: Watch sub-divisions double in real time from 2 to 16! #polyrhythm #poly-pals #music
