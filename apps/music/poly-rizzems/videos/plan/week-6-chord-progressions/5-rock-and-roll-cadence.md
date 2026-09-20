# Day 5: `1-4-5` Rock & Roll Cadence

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 5
- **Target Spec Name**: `week6-day5-1-4-5-blues-rock`

---

## 1. Musical Concept

- **Chord Progression**: $\text{I} \to \text{IV} \to \text{V}$ (`1-4-5`)
- **Featured Song Anchor**: **Ritchie Valens — *"La Bamba"* ** (also The Troggs — *"Wild Thing"*, Chuck Berry — *"Johnny B. Goode"*)
- **Original Key**: **C Major**
- **Exact Chords**: `C` (1 bar) $\to$ `F` (1 bar) $\to$ `G` (2 bars, cycling across 24 bars)
- **Signatures Mapped**: `1, 4, 5` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Punchy Latin rock rhythm guitar voicings, driving upward from C to F and culminating in a full, bright G Major triad without losing bass weight.
  - **C Major**: `C3` (root, 130.81 Hz), `E4` (329.63 Hz), `G4` (392.00 Hz)
  - **F Major**: `F3` (root, 174.61 Hz), `C4` (261.63 Hz), `A4` (440.00 Hz)
  - **G Major**: `G3` (root, 196.00 Hz), `D4` (293.66 Hz), `B4` (493.88 Hz)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`C3`, Signature 1) — Sets the master tempo
- **Bar 2**: Full Polyrhythm Entry (`1, 4, 5` in C Major)
- **Bars 3–21**: Harmonic Cycles — The 3 polyrhythm lanes mutate pitch and colour on bar boundaries, cycling through `C → F → G (2 bars)` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `G3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day5-1-4-5-blues-rock.json`)

```jsonc
{
  "name": "week6-day5-1-4-5-blues-rock",
  "title": "1-4-5 Rock & Roll Cadence",
  "description": "The 3 foundational chords that built rock 'n' roll (Ritchie Valens \"La Bamba\", The Troggs \"Wild Thing\", Chuck Berry \"Johnny B. Goode\") played in its original key of C Major with a mutating 1 vs 4 vs 5 polyrhythm.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day5-pulse", "timeSignature": 1, "noteName": "C3", "frequency": 130.81 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 1-4-5 Rock & Roll Cadence Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  The 3 foundational chords that built rock 'n' roll (Ritchie Valens "La Bamba", The Troggs "Wild Thing", Chuck Berry "Johnny B. Goode") played in its original key of C Major with a mutating 1 vs 4 vs 5 polyrhythm.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day5-1-4-5-blues-rock&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #labamba #rocknroll #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `3:50 - 4:48`
- **Transition Title**: Day 5: `1-4-5 Rock & Roll Cadence` (C Major)
