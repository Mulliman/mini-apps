# Day 7: Grand Polyrhythmic Cascade (1, 2, 3, 4, 5, 6, 8)

- **Week**: 1 (Basics)
- **Order**: 7
- **Target Spec Name**: `week1-day7-grand-polyrhythm`

---

## 1. Musical Concept

- **Chord**: C Major 9 (`C3`, `E3`, `G4`, `B4`, `D5`, `G5`)
- **Tempo Anchor**: Signature `1` (`C3`)
- **Rhythmic Families**: Binary (`1`, `2`, `4`, `8`), Ternary (`3`, `6`), Quinary (`5`)
- **Voicing Allocation**:
  - `1`: `C3` (Tempo Anchor / Downbeat Pulse)
  - `2`: `C3` (Bass / Root)
  - `3`: `E3` (Third)
  - `4`: `G4` (Fifth)
  - `5`: `B4` (Seventh)
  - `6`: `D5` (Ninth)
  - `8`: `G5` (Octave Fifth)

### Arc Timeline (~58s Runtime)
- **Bars 0–3**: Solo Signature `1` (`C3`) — Sets the tempo
- **Bar 4**: Enter `2` (`C3`)
- **Bar 6**: Enter `3` (`E3`)
- **Bar 8**: Enter `4` (`G4`)
- **Bar 10**: Enter `5` (`B4`)
- **Bar 12**: Enter `6` (`D5`)
- **Bar 14**: Enter `8` (`G5`) — Grand 7-lane apex!
- **Bars 14–16**: Hold full arrangement (7 lanes sounding)
- **Bar 17**: Remove `8` (`G5`)
- **Bar 18**: Remove `6` (`D5`)
- **Bar 19**: Remove `5` (`B4`)
- **Bar 20**: Remove `4` (`G4`)
- **Bar 21**: Remove `3` (`E3`)
- **Bar 22**: Remove `2` (`C3`)
- **Bar 23**: Remove `1` (`C3`)
- **Bar 24**: Silent closing bar (End at Bar 24, $24 \times 2.4\text{s} = 57.6\text{s}$)

---

## 2. Spec Draft (`public/specs/week1-day7-grand-polyrhythm.json`)

```jsonc
{
  "name": "Grand Polyrhythmic Cascade",
  "title": "Grand Polyrhythm (1,2,3,4,5,6,8)",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "one", "timeSignature": 1, "noteName": "C3" }
  ],
  "events": [
    { "at": 4, "type": "add", "rhythm": { "id": "two", "timeSignature": 2, "noteName": "C3" } },
    { "at": 6, "type": "add", "rhythm": { "id": "three", "timeSignature": 3, "noteName": "E3" } },
    { "at": 8, "type": "add", "rhythm": { "id": "four", "timeSignature": 4, "noteName": "G4" } },
    { "at": 10, "type": "add", "rhythm": { "id": "five", "timeSignature": 5, "noteName": "B4" } },
    { "at": 12, "type": "add", "rhythm": { "id": "six", "timeSignature": 6, "noteName": "D5" } },
    { "at": 14, "type": "add", "rhythm": { "id": "eight", "timeSignature": 8, "noteName": "G5" } },
    { "at": 17, "type": "remove", "id": "eight" },
    { "at": 18, "type": "remove", "id": "six" },
    { "at": 19, "type": "remove", "id": "five" },
    { "at": 20, "type": "remove", "id": "four" },
    { "at": 21, "type": "remove", "id": "three" },
    { "at": 22, "type": "remove", "id": "two" },
    { "at": 23, "type": "remove", "id": "one" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Ultimate Polyrhythmic Cascade! 💥 (1,2,3,4,5,6,8) #shorts
- **Description**: All 6 rhythmic families colliding on a C Major 9 chord! Week 1 finale! #polyrhythm #polyrizzems #music #theory

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `5:42 - 6:40`
- **Transition Title**: Day 7: Grand Polyrhythm Finale
