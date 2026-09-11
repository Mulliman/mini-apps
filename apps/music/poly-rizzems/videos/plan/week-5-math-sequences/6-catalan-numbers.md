# Day 6: Catalan Numbers (The Combinatorial Leap)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 6
- **Target Spec Name**: `week5-day6-catalan-numbers`

---

## 1. Musical Concept

- **Mathematical Sequence**: Catalan Numbers ($C_n = \frac{1}{n+1}\binom{2n}{n} = 1, 2, 5, 14$)
- **Signatures Mapped**: `1, 2, 5, 14` (4 lanes spanning binary grounding, quinary pulse, and a rapid 14-beat combinatorial flurry)
- **Harmonic Palette**: E Minor (`E3, B3, E4, G4` — deep grounded resonance)
- **Voicing Allocation**:
  - `1`: `E3` ($C_1 = 1$ — Fundamental Bass Root Downbeat Pulse)
  - `2`: `B3` ($C_2 = 2$ — Perfect Fifth)
  - `5`: `E4` ($C_3 = 5$ — Octave Root)
  - `14`: `G4` ($C_4 = 14$ — Minor Third, softened shimmer at volume 0.38)

### Arc Timeline (~57.0s Runtime, `barDuration: 2.85s`)
- **Bars 0–1**: Solo Signature `1` (`E3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `2` (`B3`) — $1:2$ Grounding
- **Bar 5**: Enter `5` (`E4`) — The $2:5$ Syncopated Quinary wave
- **Bar 8**: Enter `14` (`G4`) — Full Catalan matrix active ($1, 2, 5, 14$) with 14 hits per cycle!
- **Bars 8–16 (8 bars)**: Peak hold of the combinatorial polyrhythmic structure
- **Bars 16–19 (3 bars)**: Reverse unwind one lane per bar (`14`, `5`, `2`, `1`)
- **Bars 19–20 (1 bar)**: Silent closing bar (End at Bar 20)

---

## 2. Spec Draft (`public/specs/week5-day6-catalan-numbers.json`)

```jsonc
{
  "name": "Catalan Numbers (1, 2, 5, 14)",
  "title": "Catalan Numbers",
  "description": "The famous Catalan numbers (1, 2, 5, 14) as a combinatorial polyrhythm in E Minor.",
  "bars": 20,
  "barDuration": 2.85,
  "rhythms": [
    { "id": "cat-1", "timeSignature": 1, "noteName": "E3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "cat-2", "timeSignature": 2, "noteName": "B3" } },
    { "at": 5, "type": "add", "rhythm": { "id": "cat-5", "timeSignature": 5, "noteName": "E4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "cat-14", "timeSignature": 14, "noteName": "G4", "volume": 0.38 } },
    { "at": 16, "type": "remove", "id": "cat-14" },
    { "at": 17, "type": "remove", "id": "cat-5" },
    { "at": 18, "type": "remove", "id": "cat-2" },
    { "at": 19, "type": "remove", "id": "cat-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Catalan Numbers as a Polyrhythm (1, 2, 5, 14) - POLYRIZZEMS #shorts
- **Description**:
  The famous Catalan numbers (1, 2, 5, 14) as a combinatorial polyrhythm in E Minor 11.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day6-catalan-numbers&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #catalannumbers #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `4:49 - 5:46`
- **Transition Title**: Day 6: Catalan Numbers ($1, 2, 5, 14$)
