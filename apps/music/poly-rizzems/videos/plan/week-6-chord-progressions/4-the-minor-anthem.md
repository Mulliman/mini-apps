# Day 4: `1-6-3-7` The Minor Anthem

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 4
- **Target Spec Name**: `week6-day4-1-6-3-7-minor-anthem`

---

## 1. Musical Concept

- **Chord Progression**: $\text{i} \to \text{VI} \to \text{III} \to \text{VII}$ (`1-6-3-7`)
- **Featured Song Anchor**: **The Cranberries — *"Zombie"* ** (also Alan Walker — *"Faded"*, Eminem / Rihanna — *"Love the Way You Lie"*, Of Monsters and Men — *"Little Talks"*)
- **Original Key**: **E Minor**
- **Exact Chords**: `Em` $\to$ `C` $\to$ `G` $\to$ `D` (1 bar each, cycling across 24 bars)
- **Signatures Mapped**: `1, 6, 3, 7` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Heavy alternative rock guitar power chords and full triads, keeping all 4 chords resonant in the 3rd and 4th octaves without high shrill notes.
  - **E Minor**: `E3` (root, 164.81 Hz), `B3` (246.94 Hz), `E4` (329.63 Hz), `G4` (392.00 Hz)
  - **C Major**: `C3` (root, 130.81 Hz), `G3` (196.00 Hz), `C4` (261.63 Hz), `E4` (329.63 Hz)
  - **G Major**: `G3` (root, 196.00 Hz), `D4` (293.66 Hz), `G4` (392.00 Hz), `B4` (493.88 Hz)
  - **D Major**: `D3` (root, 146.83 Hz), `A3` (220.00 Hz), `D4` (293.66 Hz), `F#4` (369.99 Hz)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`E3`, Signature 1) — Sets the master tempo
- **Bar 2**: Full Polyrhythm Entry (`1, 6, 3, 7` in E Minor)
- **Bars 3–21**: Harmonic Cycles — The 4 polyrhythm lanes mutate pitch and colour on every downbeat, cycling through `Em → C → G → D` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `E3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day4-1-6-3-7-minor-anthem.json`)

```jsonc
{
  "name": "week6-day4-1-6-3-7-minor-anthem",
  "title": "1-6-3-7 The Minor Anthem",
  "description": "The soaring minor progression made famous by The Cranberries \"Zombie\" (also Alan Walker \"Faded\", Eminem & Rihanna \"Love The Way You Lie\", Of Monsters and Men \"Little Talks\") played in its original key of E Minor with a mutating 1 vs 6 vs 3 vs 7 polyrhythm.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day4-pulse", "timeSignature": 1, "noteName": "E3", "frequency": 164.81 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 1-6-3-7 The Minor Anthem Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  The soaring minor progression made famous by The Cranberries "Zombie" (also Alan Walker "Faded", Eminem & Rihanna "Love The Way You Lie", Of Monsters and Men "Little Talks") played in its original key of E Minor with a mutating 1 vs 6 vs 3 vs 7 polyrhythm.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day4-1-6-3-7-minor-anthem&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #cranberries #zombie #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `2:53 - 3:50`
- **Transition Title**: Day 4: `1-6-3-7 The Minor Anthem` (E Minor)
