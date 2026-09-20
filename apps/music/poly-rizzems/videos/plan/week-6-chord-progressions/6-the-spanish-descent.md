# Day 6: `1-7-6-5` The Spanish Descent

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 6
- **Target Spec Name**: `week6-day6-1-7-6-5-flamenco`

---

## 1. Musical Concept

- **Chord Progression**: $\text{i} \to \flat\text{VII} \to \flat\text{VI} \to \text{v}$ (`1-7-6-5`)
- **Featured Song Anchor**: **Ray Charles — *"Hit the Road Jack"* ** (also Dire Straits — *"Sultans of Swing"*, Muse — *"Hysteria"*)
- **Original Key**: **G# Minor**
- **Exact Chords**: `G#m` $\to$ `F#` $\to$ `E` $\to$ `D#m` (1 bar each, cycling across 24 bars)
- **Signatures Mapped**: `1, 7, 6, 5` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Parallel descending horn & rhythm section voicings, with every voice stepping downward in lockstep unison without jumping octaves.
  - **G# Minor**: `G#3` (root, 207.65 Hz), `D#4` (311.13 Hz), `G#4` (415.30 Hz), `B4` (493.88 Hz)
  - **F# Major**: `F#3` (root, 185.00 Hz), `C#4` (277.18 Hz), `F#4` (369.99 Hz), `A#4` (466.16 Hz)
  - **E Major**: `E3` (root, 164.81 Hz), `B3` (246.94 Hz), `E4` (329.63 Hz), `G#4` (415.30 Hz)
  - **D# Minor**: `D#3` (root, 155.56 Hz), `A#3` (233.08 Hz), `D#4` (311.13 Hz), `F#4` (369.99 Hz)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`G#3`, Signature 1) — Sets the master tempo
- **Bar 2**: Full Polyrhythm Entry (`1, 7, 6, 5` in G# Minor)
- **Bars 3–21**: Harmonic Cycles — The 4 polyrhythm lanes mutate pitch and colour on every downbeat, cycling through `G#m → F# → E → D#m` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `D#3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day6-1-7-6-5-flamenco.json`)

```jsonc
{
  "name": "week6-day6-1-7-6-5-flamenco",
  "title": "1-7-6-5 The Spanish Descent",
  "description": "The Spanish minor descent from Ray Charles \"Hit the Road Jack\" (also Dire Straits \"Sultans of Swing\", Muse \"Hysteria\") played in its original key of G# Minor with authentic parallel descending horn voicings.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day6-pulse", "timeSignature": 1, "noteName": "G#3", "frequency": 207.65 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 1-7-6-5 The Spanish Descent Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  The Spanish minor descent from Ray Charles "Hit the Road Jack" (also Dire Straits "Sultans of Swing", Muse "Hysteria") played in its original key of G# Minor with authentic parallel descending horn voicings.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day6-1-7-6-5-flamenco&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #raycharles #hittheroadjack #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `4:48 - 5:45`
- **Transition Title**: Day 6: `1-7-6-5 The Spanish Descent` (G# Minor)
