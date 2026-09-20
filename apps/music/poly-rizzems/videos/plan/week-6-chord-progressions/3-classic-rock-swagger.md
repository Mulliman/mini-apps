# Day 3: `1-7-4` Classic Rock Swagger

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 3
- **Target Spec Name**: `week6-day3-1-7-4-classic-rock`

---

## 1. Musical Concept

- **Chord Progression**: $\text{I} \to \flat\text{VII} \to \text{IV}$ (`1-7-4`)
- **Featured Song Anchor**: **Lynyrd Skynyrd — *"Sweet Home Alabama"* ** (also The Rolling Stones — *"Sympathy for the Devil"*, AC/DC — *"You Shook Me All Night Long"*, Guns N' Roses — *"Sweet Child O' Mine"*)
- **Original Key**: **D Mixolydian**
- **Exact Chords**: `D` (1 bar) $\to$ `C` (1 bar) $\to$ `G` (2 bars, cycling across 24 bars)
- **Signatures Mapped**: `1, 7, 4` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Grounded southern rock guitar open voicings, keeping the G chord heavy and anchored in the lower-middle register without shrill thinning out.
  - **D Major**: `D3` (root, 146.83 Hz), `A3` (220.00 Hz), `F#4` (369.99 Hz)
  - **C Major**: `C3` (root, 130.81 Hz), `G3` (196.00 Hz), `E4` (329.63 Hz)
  - **G Major**: `G3` (root, 196.00 Hz), `D4` (293.66 Hz), `B4` (493.88 Hz)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`D3`, Signature 1) — Sets the master tempo
- **Bar 2**: Full Polyrhythm Entry (`1, 7, 4` in D Major)
- **Bars 3–21**: Harmonic Cycles — The 3 polyrhythm lanes mutate pitch and colour on bar boundaries, cycling through `D → C → G (2 bars)` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `G3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day3-1-7-4-classic-rock.json`)

```jsonc
{
  "name": "week6-day3-1-7-4-classic-rock",
  "title": "1-7-4 Classic Rock Swagger",
  "description": "The swaggering rock progression from Lynyrd Skynyrd \"Sweet Home Alabama\" (also The Rolling Stones \"Sympathy for the Devil\", AC/DC \"You Shook Me All Night Long\", Guns N' Roses \"Sweet Child O' Mine\") played in its original key of D Mixolydian with a mutating 1 vs 7 vs 4 polyrhythm.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day3-pulse", "timeSignature": 1, "noteName": "D3", "frequency": 146.83 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 1-7-4 Classic Rock Swagger Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  The swaggering rock progression from Lynyrd Skynyrd "Sweet Home Alabama" (also The Rolling Stones "Sympathy for the Devil", AC/DC "You Shook Me All Night Long", Guns N' Roses "Sweet Child O' Mine") played in its original key of D Mixolydian with a mutating 1 vs 7 vs 4 polyrhythm.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day3-1-7-4-classic-rock&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #classicrock #skynyrd #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `1:55 - 2:53`
- **Transition Title**: Day 3: `1-7-4 Classic Rock Swagger` (D Mixolydian)
