# Day 6: Pure Binary Acceleration (1, 2, 4, 8, 16)

- **Week**: 1 (Basics)
- **Order**: 6
- **Target Spec Name**: `week1-day6-binary-stack`

---

## 1. Musical Concept

- **Chord**: C Major (`C3`, `G3`, `C4`, `E5`)
- **Tempo Anchor**: Signature `1` (`C3`)
- **Primary Family**: Binary (`1`, `2`, `4`, `8`, `16`)
- **Voicing Allocation**:
  - `1`: `C3` (Tempo Anchor / Downbeat Pulse)
  - `2`: `C3` (Bass / Root)
  - `4`: `G3` (Fifth)
  - `8`: `C4` (Octave)
  - `16`: `E5` (Tenth)

### Arc Timeline (~57s Runtime)
- **Bars 0–3**: Solo Signature `1` (`C3`) — Sets the tempo
- **Bar 4**: Enter `2` (`C3`) — 1 ➔ 2
- **Bar 6**: Enter `4` (`G3`) — 1 ➔ 2 ➔ 4
- **Bar 8**: Enter `8` (`C4`) — 1 ➔ 2 ➔ 4 ➔ 8
- **Bar 10**: Enter `16` (`E5`) — Pure binary doubling acceleration (1 to 16)!
- **Bars 10–14**: Hold full binary stack (5 lanes sounding)
- **Bar 15**: Remove `16` (`E5`)
- **Bar 16**: Remove `8` (`C4`)
- **Bar 17**: Remove `4` (`G3`)
- **Bar 18**: Remove `2` (`C3`)
- **Bar 19**: Remove `1` (`C3`)
- **Bars 20–21**: Silent closing bar (End at Bar 22)

---

## 2. Spec Draft (`public/specs/week1-day6-binary-stack.json`)

```jsonc
{
  "name": "Binary Acceleration (1,2,4,8,16)",
  "title": "Pure Binary Stack",
  "bars": 22,
  "barDuration": 2.6,
  "rhythms": [
    { "id": "one", "timeSignature": 1, "noteName": "C3" }
  ],
  "events": [
    { "at": 4, "type": "add", "rhythm": { "id": "two", "timeSignature": 2, "noteName": "C3" } },
    { "at": 6, "type": "add", "rhythm": { "id": "four", "timeSignature": 4, "noteName": "G3" } },
    { "at": 8, "type": "add", "rhythm": { "id": "eight", "timeSignature": 8, "noteName": "C4" } },
    { "at": 10, "type": "add", "rhythm": { "id": "sixteen", "timeSignature": 16, "noteName": "E5" } },
    { "at": 15, "type": "remove", "id": "sixteen" },
    { "at": 16, "type": "remove", "id": "eight" },
    { "at": 17, "type": "remove", "id": "four" },
    { "at": 18, "type": "remove", "id": "two" },
    { "at": 19, "type": "remove", "id": "one" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: Doubling speeds: 1 ➔ 2 ➔ 4 ➔ 8 ➔ 16! ⚡ #shorts
- **Description**: Watch sub-divisions double in real time from 1 to 16! #polyrhythm #polyrizzems #music

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `4:45 - 5:42`
- **Transition Title**: Day 6: Binary Acceleration Stack
