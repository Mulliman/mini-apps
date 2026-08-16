# Day 1: C Major Triad

- **Week**: 4 (Major Chord Degrees)
- **Order**: 1
- **Target Spec Name**: `week4-day1-c-major-triad`

---

## 1. Musical Concept

- **Chord / Structure**: C Major Triad (`C3, E4, G4`)
- **Degrees Mapped**: `1` (Root), `3` (Major 3rd), `5` (Perfect 5th)
- **Time Signatures**: `1, 3, 5`
- **Voicing Allocation**:
  - `1`: `C3` (Root downbeat pulse — deep bass anchor)
  - `3`: `E4` (Major 3rd — bright harmonic foundation)
  - `5`: `G4` (Perfect 5th — consonant acoustic overtone)

### Arc Timeline (~57.6s Runtime, `barDuration: 3.2s`)
- **Bars 0–1**: Solo Root `1` (`C3`) — Sets the downbeat tempo and cycle (2 bars)
- **Bar 2**: Enter `3` (`E4`) — 3-against-1 pulse ($3:1$)
- **Bar 3**: Enter `5` (`G4`) — Full $1:3:5$ triadic polyrhythm constellation
- **Bars 3–15 (12 bars)**: Hold the complete 3-lane C Major triadic groove
- **Bar 15**: Remove `5` (`G4`)
- **Bar 16**: Remove `3` (`E4`)
- **Bar 17**: Remove `1` (`C3`)
- **Bar 18**: Silent closing bar (End at Bar 18)

---

## 2. Spec Draft (`public/specs/week4-day1-c-major-triad.json`)

```jsonc
{
  "name": "C Major Triad",
  "title": "C Major Triad",
  "bars": 18,
  "barDuration": 3.2,
  "rhythms": [
    { "id": "c-maj-1", "timeSignature": 1, "noteName": "C3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "c-maj-3", "timeSignature": 3, "noteName": "E4" } },
    { "at": 3, "type": "add", "rhythm": { "id": "c-maj-5", "timeSignature": 5, "noteName": "G4" } },
    { "at": 15, "type": "remove", "id": "c-maj-5" },
    { "at": 16, "type": "remove", "id": "c-maj-3" },
    { "at": 17, "type": "remove", "id": "c-maj-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: What happens when you turn a C Major chord into a polyrhythm? - POLYRIZZEMS #shorts
- **Description**:
  The scale degrees of a C Major Triad (1, 3, 5) mapped directly into polyrhythmic time signatures: Root (1), Major 3rd (3), and 5th (5).

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week4-day1-c-major-triad&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #cmajor #piano #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `0:00 - 0:58`
- **Transition Title**: Day 1: C Major Triad
