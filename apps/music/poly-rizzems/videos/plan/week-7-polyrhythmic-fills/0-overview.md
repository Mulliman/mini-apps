# Week 7 Plan: Polyrhythmic Fills in 4

## Theme Overview

Week 7 explores **Polyrhythmic Drum & Synth Fills over a locked 4/4 backing**.

In modern drumming, gospel chops, and rhythm-section arranging, the band establishes a locked 4/4 groove for 3 bars, and on the 4th bar the drummer cuts loose with a syncopated fill before dropping back on the downbeat of bar 5.

Week 7 sonifies this classic phrasing mechanic using a lean, dynamic 4-lane architecture:
- **Lane 1 (Time Signature 1)**: Grounding downbeat bass pulse (whole notes)
- **Lane 2 (Time Signature 2)**: Half-note harmonic support (beats 1 & 3)
- **Lane 4 (Time Signature 4)**: The steady 4/4 quarter-note pulse (beats 1, 2, 3, 4)
- **Fill Lane (Time Signature $N \in \{3, 5, 6, 7, 9, 11, 13\}$)**: The soloist! For the first 3 bars of every 4-bar phrase, this lane stays muted (bouncing silently at 50% opacity to build visual anticipation). On the 4th bar, the quarter notes (Lane 4) mute while the Fill Lane un-mutes on the **exact same pitch**, cleanly replacing the quarter note subdivision with the polyrhythmic fill. On the turnaround, Lane 4 returns as the Fill Lane mutes and chords/tempo shift. At bar 20 (immediately after the 5th fill), the Fill Lane mutes immediately to avoid any ghost strikes into the fadeout.

### Harmonic Arc & Accelerando
To maximize dynamic variety and avoid repetition:
1. **Unique Starting Chord for Each Day**: Each day kicks off on a completely different chord/mode across the natural diatonic scale:
   - **Day 1**: **C Major** (`C3 - E3 - G3`) — Classic I start (C - Am - F - G - C)
   - **Day 2**: **A Minor** (`A3 - C4 - E4`) — Natural Aeolian minor (Am - F - C - G - Am)
   - **Day 3**: **F Major** (`F3 - A3 - C4`) — Lydian IV start (F - G - Em - Am - F)
   - **Day 4**: **D Minor** (`D3 - F3 - A3`) — Dorian ii groove (Dm - G - C - Am - Dm)
   - **Day 5**: **G Major** (`G3 - B3 - D4`) — Mixolydian V start (G - C - Dm - F - G)
   - **Day 6**: **E Minor** (`E3 - G3 - B3`) — Phrygian iii start (Em - F - G - Am - Em)
   - **Day 7**: **C4 High Major** (`C4 - E4 - G4`) — Grand octave cascade down to C3 climax (C4 - Am - F - G - C3)
2. **Tempo & Accelerando Across Phrases**:
   - **Phrases 1–3 (Bars 0–11)**: Locked groove at **125 BPM** (`barDuration: 1.92s`).
   - **Phrase 4 (Bars 12–15)**: The penultimate phrase accelerates to **150 BPM** (`barDuration: 1.60s`).
   - **Phrase 5 (Bars 16–19)**: The climactic final phrase and fill erupt at **175 BPM** (`barDuration: 1.37s`)!
   - **Total Runtime**: ~39.0s (`bars: 23`, punchy and optimal for YouTube Shorts).

---

## Schedule & Content Outline

- **Day 1**: `1-the-triplet-fill-3.md` — `3:4` The Triplet Fill (Starts C Major)
  - **Fill Signature**: `3` (Half-note triplet roll / 3 against 4)
  - **Spec**: `week7-day1-fill-3-triplet`
- **Day 2**: `2-the-quintuplet-fill-5.md` — `5:4` The Quintuplet Fill (Starts A Minor)
  - **Fill Signature**: `5` (Gospel chop quintuplet burst)
  - **Spec**: `week7-day2-fill-5-quintuplet`
- **Day 3**: `3-the-sextuplet-fill-6.md` — `6:4` The Sextuplet Fill (Starts F Major)
  - **Fill Signature**: `6` (Double-time sextuplet flurry / rock cadence)
  - **Spec**: `week7-day3-fill-6-sextuplet`
- **Day 4**: `4-the-septuplet-fill-7.md` — `7:4` The Septuplet Fill (Starts D Minor)
  - **Fill Signature**: `7` (Math-rock asymmetric septuplet cascade)
  - **Spec**: `week7-day4-fill-7-septuplet`
- **Day 5**: `5-the-nonuplet-fill-9.md` — `9:4` The Nonuplet Fill (Starts G Major)
  - **Fill Signature**: `9` (Jazz-fusion nonuplet rush)
  - **Spec**: `week7-day5-fill-9-nonuplet`
- **Day 6**: `6-the-undecuplet-fill-11.md` — `11:4` The Undecuplet Fill (Starts E Minor)
  - **Fill Signature**: `11` (Micro-rhythmic 11-tuplet precision roll)
  - **Spec**: `week7-day6-fill-11-undecuplet`
- **Day 7**: `7-the-tridecuplet-fill-13.md` — `13:4` The Tridecuplet Fill (Starts C4 High Major)
  - **Fill Signature**: `13` (Hyper-speed 13-tuplet grand master fill)
  - **Spec**: `week7-day7-fill-13-tridecuplet`

---

## Testing

Preview each spec directly in the browser:
- **Day 1 (3:4 Triplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day1-fill-3-triplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day1-fill-3-triplet&play=1)
- **Day 2 (5:4 Quintuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day2-fill-5-quintuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day2-fill-5-quintuplet&play=1)
- **Day 3 (6:4 Sextuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day3-fill-6-sextuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day3-fill-6-sextuplet&play=1)
- **Day 4 (7:4 Septuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day4-fill-7-septuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day4-fill-7-septuplet&play=1)
- **Day 5 (9:4 Nonuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day5-fill-9-nonuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day5-fill-9-nonuplet&play=1)
- **Day 6 (11:4 Undecuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day6-fill-11-undecuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day6-fill-11-undecuplet&play=1)
- **Day 7 (13:4 Tridecuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day7-fill-13-tridecuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week7-day7-fill-13-tridecuplet&play=1)

---

## Long-Form Compilation (YouTube)

- **Title**: Polyrhythmic Fills in 4/4 (From 3:4 to 13:4) | Complete Accelerando Suite | POLYRIZZEMS
- **Structure**: Continuous chronological compilation of all 7 polyrhythmic fill studies with seamless key bridge transitions. Total runtime approx. 5.5 minutes.
