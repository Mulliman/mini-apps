# Day 2: `2-5-1` The Jazz-Pop Groove

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 2
- **Target Spec Name**: `week6-day2-2-5-1-jazz`

---

## 1. Musical Concept

- **Chord Progression**: $\text{ii} \to \text{V} \to \text{I}$ (`2-5-1`)
- **Featured Song Anchor**: **Maroon 5 — *"Sunday Morning"* **
- **Original Key**: **C Major**
- **Exact Chords**: `Dm` (1 bar) $\to$ `G` (1 bar) $\to$ `C` (2 bars, cycling across 24 bars)
- **Signatures Mapped**: `2, 5, 1` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Warm, descending Rhodes piano voicings that step downward naturally to settle into a deep, low, resonant C Major tonic (no high octave spikes).
  - **D Minor**: `D3` (root, 146.83 Hz), `A3` (220.00 Hz), `F4` (349.23 Hz)
  - **G Major**: `G3` (root, 196.00 Hz), `B3` (246.94 Hz), `D4` (293.66 Hz)
  - **C Major**: `C3` (root, 130.81 Hz), `G3` (196.00 Hz), `E4` (329.63 Hz)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`D3`, Signature 1) — Sets the master tempo
- **Bar 2**: Full Polyrhythm Entry (`2, 5, 1` in D Minor)
- **Bars 3–21**: Harmonic Cycles — The 3 polyrhythm lanes mutate pitch and colour on bar boundaries, cycling through `Dm → G → C (2 bars)` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `C3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day2-2-5-1-jazz.json`)

```jsonc
{
  "name": "week6-day2-2-5-1-jazz",
  "title": "2-5-1 The Jazz-Pop Groove",
  "description": "The quintessential jazz-pop progression from Maroon 5 \"Sunday Morning\" played in its original key of C Major with a mutating 2 vs 5 vs 1 polyrhythm.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day2-pulse", "timeSignature": 1, "noteName": "D3", "frequency": 146.83 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 2-5-1 The Jazz-Pop Groove Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  Common in all jazz inspired music this is also a pop progression from Maroon 5 "Sunday Morning" played in its original key of C Major with a mutating 2 vs 5 vs 1 polyrhythm.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day2-2-5-1-jazz&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #maroon5 #jazz #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `0:58 - 1:55`
- **Transition Title**: Day 2: `2-5-1 The Jazz-Pop Groove` (C Major)
