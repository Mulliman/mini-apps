# Day 1: `1-5-6-4` The 4 Chords of Pop

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 1
- **Target Spec Name**: `week6-day1-1-5-6-4-pop`

---

## 1. Musical Concept

- **Chord Progression**: $\text{I} \to \text{V} \to \text{vi} \to \text{IV}$ (`1-5-6-4`)
- **Featured Song Anchor**: **Journey — *"Don't Stop Believin'"*** (also Bob Marley — *"No Woman, No Cry"*, U2 — *"With Or Without You"*, Adele — *"Someone Like You"*)
- **Original Key**: **E Major**
- **Exact Chords**: `E` $\to$ `B` $\to$ `C#m` $\to$ `A` (1 bar each, cycling across 24 bars)
- **Signatures Mapped**: `1, 5, 6, 4` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Jonathan Cain's signature piano register, keeping every chord full and grounded without shrill octave jumps. The top voice plays the falling hook: $G\#4 \to F\#4 \to E4 \to E4$.
  - **E Major**: `E3` (root, 164.81 Hz), `B3` (246.94 Hz), `E4` (329.63 Hz), `G#4` (415.30 Hz)
  - **B Major**: `B3` (root, 246.94 Hz), `F#3` (185.00 Hz), `D#4` (311.13 Hz), `F#4` (369.99 Hz)
  - **C# Minor**: `C#3` (root, 138.59 Hz), `G#3` (207.65 Hz), `C#4` (277.18 Hz), `E4` (329.63 Hz)
  - **A Major**: `A3` (root, 220.00 Hz), `E3` (164.81 Hz), `C#4` (277.18 Hz), `E4` (329.63 Hz)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`E3`, Signature 1) — Sets the master tempo and bar cycle
- **Bar 2**: Full Polyrhythm Entry (`1, 5, 6, 4` in E Major)
- **Bars 3–21**: Harmonic Cycles — The 4 polyrhythm lanes mutate pitch and colour on every downbeat, cycling through `E → B → C#m → A` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `E3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day1-1-5-6-4-pop.json`)

```jsonc
{
  "name": "week6-day1-1-5-6-4-pop",
  "title": "1-5-6-4 The 4 Chords of Pop",
  "description": "The most famous chord progression in modern music history (Journey \"Don't Stop Believin'\", Bob Marley \"No Woman No Cry\", U2 \"With Or Without You\") played in its original key of E Major with a mutating 1 vs 5 vs 6 vs 4 polyrhythm.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day1-pulse", "timeSignature": 1, "noteName": "E3", "frequency": 164.81 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 1-5-6-4 The 4 Chords of Pop Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  The most famous chord progression in modern music history (Journey "Don't Stop Believin'", Bob Marley "No Woman No Cry", U2 "With Or Without You") played in its original key of E Major with a mutating 1 vs 5 vs 6 vs 4 polyrhythm.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day1-1-5-6-4-pop&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #chordprogression #journey #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `0:00 - 0:58`
- **Transition Title**: Day 1: `1-5-6-4 The 4 Chords of Pop` (E Major)
