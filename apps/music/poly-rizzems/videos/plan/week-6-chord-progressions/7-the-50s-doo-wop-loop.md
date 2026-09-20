# Day 7: `1-6-2-5` The 50s Doo-Wop Loop

- **Week**: 6 (Famous Chord Progressions)
- **Order**: 7
- **Target Spec Name**: `week6-day7-1-6-2-5-bebop`

---

## 1. Musical Concept

- **Chord Progression**: $\text{I} \to \text{vi7} \to \text{ii7} \to \text{V7}$ (`1-6-2-5`)
- **Featured Song Anchor**: **Frankie Lymon & The Teenagers — *"Why Do Fools Fall In Love"* ** (also The Marcels — *"Blue Moon"*, Dion & The Belmonts — *"A Teenager in Love"*, George Gershwin — *"I Got Rhythm"*)
- **Original Key**: **F Major**
- **Exact Chords**: `F` $\to$ `Dm7` $\to$ `Gm7` $\to$ `C7` (1 bar each, cycling across 24 bars)
- **Signatures Mapped**: `1, 6, 2, 5` (mapping the numeral degrees to polyrhythm lane speeds)
- **Voicing Strategy**:
  Classic 50s street-corner vocal harmony registers, holding common guide tones ($C4$ and $F4$) across bars with authentic doo-wop backing vocal movement.
  - **F Major**: `F3` (root, 174.61 Hz), `C4` (261.63 Hz), `F4` (349.23 Hz), `A4` (440.00 Hz)
  - **D Minor 7**: `D3` (root, 146.83 Hz), `C4` (261.63 Hz, held), `F4` (349.23 Hz, held), `A4` (440.00 Hz, held)
  - **G Minor 7**: `G3` (root, 196.00 Hz), `D4` (293.66 Hz), `F4` (349.23 Hz, held), `Bb4` (466.16 Hz)
  - **C Dominant 7**: `C3` (root, 130.81 Hz), `E4` (329.63 Hz), `G4` (392.00 Hz), `Bb4` (466.16 Hz, held)

### Arc Timeline (~57.6s Runtime, `bars: 24`, `barDuration: 2.4s`)
- **Bars 0–1**: Solo Downbeat Pulse (`F3`, Signature 1) — Sets the master tempo
- **Bar 2**: Full Polyrhythm Entry (`1, 6, 2, 5` in F Major)
- **Bars 3–21**: Harmonic Cycles — The 4 polyrhythm lanes mutate pitch and colour on every downbeat, cycling through `F → Dm7 → Gm7 → C7` 5 complete times
- **Bar 22**: Unwind — Polyrhythm lanes exit, leaving only the grounding `C3` bass pulse
- **Bar 23**: Bass pulse completes final ring
- **Bar 24**: Silent closing bar (End at Bar 24)

---

## 2. Spec Draft (`public/specs/week6-day7-1-6-2-5-bebop.json`)

```jsonc
{
  "name": "week6-day7-1-6-2-5-bebop",
  "title": "1-6-2-5 The 50s Doo-Wop Loop",
  "description": "The iconic 4-chord doo-wop progression from Frankie Lymon & The Teenagers \"Why Do Fools Fall in Love\" (also The Marcels \"Blue Moon\", George Gershwin \"I Got Rhythm\") played in its original key of F Major with a mutating 1 vs 6 vs 2 vs 5 polyrhythm.",
  "bars": 24,
  "barDuration": 2.4,
  "rhythms": [
    { "id": "day7-pulse", "timeSignature": 1, "noteName": "F3", "frequency": 174.61 }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: 1-6-2-5 The 50s Doo-Wop Loop Polyrhythm - POLYRIZZEMS #shorts
- **Description**:
  The iconic 4-chord doo-wop progression from Frankie Lymon & The Teenagers "Why Do Fools Fall in Love" (also The Marcels "Blue Moon", George Gershwin "I Got Rhythm") played in its original key of F Major with a mutating 1 vs 6 vs 2 vs 5 polyrhythm.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week6-day7-1-6-2-5-bebop&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #doowop #frankieLymon #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `5:45 - 6:43`
- **Transition Title**: Day 7: `1-6-2-5 The 50s Doo-Wop Loop` (F Major)
