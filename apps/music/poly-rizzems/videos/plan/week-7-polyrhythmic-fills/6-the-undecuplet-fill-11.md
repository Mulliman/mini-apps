# Day 6: `11:4` The Undecuplet Fill

- **Week**: 7 (Polyrhythmic Fills in 4)
- **Order**: 6
- **Target Spec Name**: `week7-day6-fill-11-undecuplet`

---

## 1. Musical Concept

- **Fill Ratio**: **11:4** (11 against 4)
- **Concept**: The avant-garde micro-roll. Eleven strokes in a single measure of 4/4 creates an extraordinary, shimmering grain of rhythmic density. Pioneered in experimental jazz and modern composition (Frank Zappa's "The Black Page", Don Ellis, Conlon Nancarrow), an 11:4 fill sounds like a controlled gravitational wave rushing across the kit.
- **Backing Foundation (4/4 Triad)**:
  - `1`: Downbeat master pulse (Whole notes) — Root
  - `2`: Half-note pulse (Beats 1 & 3) — Third
  - `4`: Quarter-note pulse (Beats 1, 2, 3, 4) — Fifth
- **Fill Lane**: Signature `11` (Undecuplets). Muted for bars 1–3 of each cycle, firing on bar 4. Harmonically, the fill lane is voiced on the **11th degree** of each chord (including the striking #11 Lydian note on F Major), marrying harmonic tension to metric speed.
- **Harmonic Cycles & Accelerando**:
  - **Cycle 1 (Bars 1–4, 96 BPM / 2.50s)**: **C Major** (`C3 - E3 - G3`), Fill on Bar 4 plays `F4` (349.23 Hz, 11th)
  - **Cycle 2 (Bars 5–8, 109 BPM / 2.20s)**: **A Minor** (`A2 - C3 - E3`), Fill on Bar 8 plays `D4` (293.66 Hz, 11th)
  - **Cycle 3 (Bars 9–12, 126 BPM / 1.90s)**: **F Major** (`F2 - A2 - C3`), Fill on Bar 12 plays `B3` (246.94 Hz, #11 Lydian)
  - **Cycle 4 (Bars 13–16, 145 BPM / 1.65s)**: **G Major** (`G2 - B2 - D3`), Fill on Bar 16 plays `C4` (261.63 Hz, 11th)
  - **Cycle 5 (Bars 17–20, 171 BPM / 1.40s)**: **C Major Climax** (`C3 - E3 - G3`), Fill on Bar 20 plays `F4` (349.23 Hz)
  - **Bars 21–23**: Final resolution on C Major and ring-out

### Arc Timeline (~43.9s Runtime, `bars: 23`, initial `barDuration: 2.50s`)
- **Bars 0–2 (Measures 1–3)**: 3 bars of locked 4/4 Backing (`1, 2, 4` in C Major). Fill lane `11` bounces visibly at 50% opacity, muted.
- **Bar 3 (Measure 4)**: **Fill 1** — Lane `11` un-mutes at downbeat of bar 3, cutting loose with a razor-sharp 11:4 undecuplet roll across the 4th measure!
- **Bar 4 (Measure 5)**: Lane `11` mutes at bar 4. Chords shift to A Minor. Tempo accelerates to 109 BPM (`barDuration: 2.20s`).
- **Bar 7 (Measure 8)**: **Fill 2** — Lane `11` un-mutes in A Minor for the 8th measure.
- **Bar 8 (Measure 9)**: Lane `11` mutes. Chords shift to F Major. Tempo accelerates to 126 BPM (`barDuration: 1.90s`).
- **Bar 11 (Measure 12)**: **Fill 3** — Lane `11` un-mutes in F Major with the #11 Lydian edge for the 12th measure.
- **Bar 12 (Measure 13)**: Lane `11` mutes. Chords shift to G Major. Tempo accelerates to 145 BPM (`barDuration: 1.65s`).
- **Bar 15 (Measure 16)**: **Fill 4** — Lane `11` un-mutes in G Major for the 16th measure.
- **Bar 16 (Measure 17)**: Lane `11` mutes. Return home to C Major. Tempo accelerates to 171 BPM (`barDuration: 1.40s`).
- **Bar 19 (Measure 20)**: **Climax Fill 5** — Lane `11` un-mutes for a torrential 11-tuplet peak at 171 BPM in the 20th measure!
- **Bar 20 (Measure 21)**: Lane `11` removes. Backing triad sustains home C Major chord.
- **Bar 22 (Measure 23)**: Backing lanes remove, final silent ring-out bar (End at Bar 23).

---

## 2. Spec Draft (`public/specs/week7-day6-fill-11-undecuplet.json`)

```jsonc
{
  "name": "week7-day6-fill-11-undecuplet",
  "title": "11:4 The Undecuplet Fill",
  "description": "A locked 4/4 backing (1, 2, 4) accelerates through I-vi-IV-V while an avant-garde 11:4 micro-rhythmic fill drops on the 4th bar of every cycle.",
  "bars": 24,
  "barDuration": 2.5,
  "bounce": "equalSpeed",
  "rhythms": [
    { "id": "lane-1", "timeSignature": 1, "noteName": "C3", "frequency": 130.81, "color": "#00f0ff", "expression": "determined" },
    { "id": "lane-2", "timeSignature": 2, "noteName": "E3", "frequency": 164.81, "color": "#39ff14", "expression": "happy" },
    { "id": "lane-4", "timeSignature": 4, "noteName": "G3", "frequency": 196.00, "color": "#fffb00", "expression": "cool" },
    { "id": "lane-fill", "timeSignature": 11, "noteName": "F4", "frequency": 349.23, "color": "#ff007f", "expression": "mindblown", "isMuted": true }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 11:4 The Undecuplet Fill Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  11:4 polyrhythm drum chops! A locked 4/4 groove accelerates from 96 to 171 BPM through I-vi-IV-V while a precision 11:4 undecuplet roll voiced on the 11th degree drops on the turnaround!

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week7-day6-fill-11-undecuplet&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #undecuplet #oddmeter #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `3:50 - 4:36`
- **Transition Title**: Day 6: `11:4 The Undecuplet Fill` (Avant-Garde Precision Accelerando)
