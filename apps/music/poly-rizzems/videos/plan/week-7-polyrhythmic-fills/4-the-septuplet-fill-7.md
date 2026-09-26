# Day 4: `7:4` The Septuplet Fill

- **Week**: 7 (Polyrhythmic Fills in 4)
- **Order**: 4
- **Target Spec Name**: `week7-day4-fill-7-septuplet`

---

## 1. Musical Concept

- **Fill Ratio**: **7:4** (7 against 4)
- **Concept**: The math-rock & modern jazz boundary. Seven pulses against four quarter notes is an asymmetric prime collision. When played as a drum or keyboard fill (like Tigran Hamasyan, Mark Guiliana, or Yussef Dayes), septuplets give an elastic, rushing feeling that bends time before snapping back into place on the downbeat.
- **Backing Foundation (4/4 Triad)**:
  - `1`: Downbeat master pulse (Whole notes) — Root
  - `2`: Half-note pulse (Beats 1 & 3) — Third
  - `4`: Quarter-note pulse (Beats 1, 2, 3, 4) — Fifth
- **Fill Lane**: Signature `7` (Septuplets). Muted for bars 1–3 of each cycle, firing on bar 4.
- **Harmonic Cycles & Accelerando**:
  - **Cycle 1 (Bars 1–4, 96 BPM / 2.50s)**: **C Major** (`C3 - E3 - G3`), Fill on Bar 4 plays `B4` (493.88 Hz, Maj7)
  - **Cycle 2 (Bars 5–8, 109 BPM / 2.20s)**: **A Minor** (`A2 - C3 - E3`), Fill on Bar 8 plays `G4` (392.00 Hz, m7)
  - **Cycle 3 (Bars 9–12, 126 BPM / 1.90s)**: **F Major** (`F2 - A2 - C3`), Fill on Bar 12 plays `E4` (329.63 Hz, Maj7)
  - **Cycle 4 (Bars 13–16, 145 BPM / 1.65s)**: **G Major** (`G2 - B2 - D3`), Fill on Bar 16 plays `F4` (349.23 Hz, Dom7)
  - **Cycle 5 (Bars 17–20, 171 BPM / 1.40s)**: **C Major Climax** (`C3 - E3 - G3`), Fill on Bar 20 plays `B4` (493.88 Hz)
  - **Bars 21–23**: Final resolution on C Major and ring-out

### Arc Timeline (~43.9s Runtime, `bars: 23`, initial `barDuration: 2.50s`)
- **Bars 0–2 (Measures 1–3)**: 3 bars of locked 4/4 Backing (`1, 2, 4` in C Major). Fill lane `7` bounces visibly at 50% opacity, muted.
- **Bar 3 (Measure 4)**: **Fill 1** — Lane `7` un-mutes at downbeat of bar 3, carving an asymmetric 7:4 septuplet cascade across the 4th measure!
- **Bar 4 (Measure 5)**: Lane `7` mutes at bar 4. Chords shift to A Minor. Tempo accelerates to 109 BPM (`barDuration: 2.20s`).
- **Bar 7 (Measure 8)**: **Fill 2** — Lane `7` un-mutes in A Minor for the 8th measure.
- **Bar 8 (Measure 9)**: Lane `7` mutes. Chords shift to F Major. Tempo accelerates to 126 BPM (`barDuration: 1.90s`).
- **Bar 11 (Measure 12)**: **Fill 3** — Lane `7` un-mutes in F Major for the 12th measure.
- **Bar 12 (Measure 13)**: Lane `7` mutes. Chords shift to G Major. Tempo accelerates to 145 BPM (`barDuration: 1.65s`).
- **Bar 15 (Measure 16)**: **Fill 4** — Lane `7` un-mutes in G Major for the 16th measure.
- **Bar 16 (Measure 17)**: Lane `7` mutes. Return home to C Major. Tempo accelerates to 171 BPM (`barDuration: 1.40s`).
- **Bar 19 (Measure 20)**: **Climax Fill 5** — Lane `7` un-mutes for a hyper-speed septuplet climax in the 20th measure!
- **Bar 20 (Measure 21)**: Lane `7` removes. Backing triad sustains home C Major chord.
- **Bar 22 (Measure 23)**: Backing lanes remove, final silent ring-out bar (End at Bar 23).

---

## 2. Spec Draft (`public/specs/week7-day4-fill-7-septuplet.json`)

```jsonc
{
  "name": "week7-day4-fill-7-septuplet",
  "title": "7:4 The Septuplet Fill",
  "description": "A locked 4/4 backing (1, 2, 4) accelerates through I-vi-IV-V while an asymmetric 7:4 math-rock septuplet fill drops on the 4th bar of every cycle.",
  "bars": 24,
  "barDuration": 2.5,
  "bounce": "equalSpeed",
  "rhythms": [
    { "id": "lane-1", "timeSignature": 1, "noteName": "C3", "frequency": 130.81, "color": "#00f0ff", "expression": "determined" },
    { "id": "lane-2", "timeSignature": 2, "noteName": "E3", "frequency": 164.81, "color": "#39ff14", "expression": "happy" },
    { "id": "lane-4", "timeSignature": 4, "noteName": "G3", "frequency": 196.00, "color": "#fffb00", "expression": "cool" },
    { "id": "lane-fill", "timeSignature": 7, "noteName": "B4", "frequency": 493.88, "color": "#ff007f", "expression": "shocked", "isMuted": true }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 7:4 The Septuplet Fill Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  7 against 4 math-rock drum fills! A locked 4/4 backing (1, 2, 4) accelerates from 96 to 171 BPM through I-vi-IV-V while an asymmetric 7:4 septuplet cascade hits the 4th bar turnaround!

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week7-day4-fill-7-septuplet&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #septuplet #mathrock #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `2:18 - 3:04`
- **Transition Title**: Day 4: `7:4 The Septuplet Fill` (Math-Rock Elastic Accelerando)
