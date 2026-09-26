# Day 5: `9:4` The Nonuplet Fill

- **Week**: 7 (Polyrhythmic Fills in 4)
- **Order**: 5
- **Target Spec Name**: `week7-day5-fill-9-nonuplet`

---

## 1. Musical Concept

- **Fill Ratio**: **9:4** (9 against 4)
- **Concept**: The jazz-fusion virtuoso fill. Nine subdivisions across a 4/4 measure produce rapid 9-tuplet streams (triplet sets of triplets), evoking the blistering, fluid runs of Vinnie Colaiuta, Dennis Chambers, and Chick Corea's Elektric Band.
- **Backing Foundation (4/4 Triad)**:
  - `1`: Downbeat master pulse (Whole notes) — Root
  - `2`: Half-note pulse (Beats 1 & 3) — Third
  - `4`: Quarter-note pulse (Beats 1, 2, 3, 4) — Fifth
- **Fill Lane**: Signature `9` (Nonuplets). Muted for bars 1–3 of each cycle, firing on bar 4. Harmonically, the fill lane is voiced on the **9th scale degree** of each chord, creating a lush, modern chord extension.
- **Harmonic Cycles & Accelerando**:
  - **Cycle 1 (Bars 1–4, 96 BPM / 2.50s)**: **C Major** (`C3 - E3 - G3`), Fill on Bar 4 plays `D4` (293.66 Hz, Add9)
  - **Cycle 2 (Bars 5–8, 109 BPM / 2.20s)**: **A Minor** (`A2 - C3 - E3`), Fill on Bar 8 plays `B3` (246.94 Hz, m9)
  - **Cycle 3 (Bars 9–12, 126 BPM / 1.90s)**: **F Major** (`F2 - A2 - C3`), Fill on Bar 12 plays `G3` (196.00 Hz, Add9)
  - **Cycle 4 (Bars 13–16, 145 BPM / 1.65s)**: **G Major** (`G2 - B2 - D3`), Fill on Bar 16 plays `A3` (220.00 Hz, 9th)
  - **Cycle 5 (Bars 17–20, 171 BPM / 1.40s)**: **C Major Climax** (`C3 - E3 - G3`), Fill on Bar 20 plays `D4` (293.66 Hz)
  - **Bars 21–23**: Final resolution on C Major and ring-out

### Arc Timeline (~43.9s Runtime, `bars: 23`, initial `barDuration: 2.50s`)
- **Bars 0–2 (Measures 1–3)**: 3 bars of locked 4/4 Backing (`1, 2, 4` in C Major). Fill lane `9` bounces visibly at 50% opacity, muted.
- **Bar 3 (Measure 4)**: **Fill 1** — Lane `9` un-mutes at downbeat of bar 3, firing a rapid 9:4 nonuplet stream across the 4th measure!
- **Bar 4 (Measure 5)**: Lane `9` mutes at bar 4. Chords shift to A Minor. Tempo accelerates to 109 BPM (`barDuration: 2.20s`).
- **Bar 7 (Measure 8)**: **Fill 2** — Lane `9` un-mutes in A Minor for the 8th measure.
- **Bar 8 (Measure 9)**: Lane `9` mutes. Chords shift to F Major. Tempo accelerates to 126 BPM (`barDuration: 1.90s`).
- **Bar 11 (Measure 12)**: **Fill 3** — Lane `9` un-mutes in F Major for the 12th measure.
- **Bar 12 (Measure 13)**: Lane `9` mutes. Chords shift to G Major. Tempo accelerates to 145 BPM (`barDuration: 1.65s`).
- **Bar 15 (Measure 16)**: **Fill 4** — Lane `9` un-mutes in G Major for the 16th measure.
- **Bar 16 (Measure 17)**: Lane `9` mutes. Return home to C Major. Tempo accelerates to 171 BPM (`barDuration: 1.40s`).
- **Bar 19 (Measure 20)**: **Climax Fill 5** — Lane `9` un-mutes for a torrential nonuplet crescendo in the 20th measure!
- **Bar 20 (Measure 21)**: Lane `9` removes. Backing triad sustains home C Major chord.
- **Bar 22 (Measure 23)**: Backing lanes remove, final silent ring-out bar (End at Bar 23).

---

## 2. Spec Draft (`public/specs/week7-day5-fill-9-nonuplet.json`)

```jsonc
{
  "name": "week7-day5-fill-9-nonuplet",
  "title": "9:4 The Nonuplet Fill",
  "description": "A locked 4/4 backing (1, 2, 4) accelerates through I-vi-IV-V while a fluid 9:4 jazz-fusion nonuplet fill drops on the 4th bar of every cycle.",
  "bars": 24,
  "barDuration": 2.5,
  "bounce": "equalSpeed",
  "rhythms": [
    { "id": "lane-1", "timeSignature": 1, "noteName": "C3", "frequency": 130.81, "color": "#00f0ff", "expression": "determined" },
    { "id": "lane-2", "timeSignature": 2, "noteName": "E3", "frequency": 164.81, "color": "#39ff14", "expression": "happy" },
    { "id": "lane-4", "timeSignature": 4, "noteName": "G3", "frequency": 196.00, "color": "#fffb00", "expression": "cool" },
    { "id": "lane-fill", "timeSignature": 9, "noteName": "D4", "frequency": 293.66, "color": "#ff007f", "expression": "starry", "isMuted": true }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 9:4 The Nonuplet Fill Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  Jazz fusion nonuplet fills in 4/4! A locked backing (1, 2, 4) accelerates from 96 to 171 BPM through I-vi-IV-V while a blistering 9:4 nonuplet fill voiced on the 9th degree erupts on bar 4!

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week7-day5-fill-9-nonuplet&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #nonuplet #jazzfusion #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `3:04 - 3:50`
- **Transition Title**: Day 5: `9:4 The Nonuplet Fill` (Jazz Fusion Accelerando)
