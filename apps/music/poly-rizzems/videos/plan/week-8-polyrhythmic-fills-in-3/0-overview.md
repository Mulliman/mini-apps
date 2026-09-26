# Week 8 Plan: Polyrhythmic Fills in 3/4

## Theme Overview

Week 8 explores **Polyrhythmic Drum & Synth Fills over a 3/4 Waltz Meter**.

Following the acclaimed phrasing mechanic established in Week 7, each piece locks into a groove for 3 bars in 3/4 time. On the 4th bar of each phrase, the steady quarter notes drop out and an escalating polyrhythmic fill ($N \in \{4, 5, 6, 7, 8, 12, 16\}$) takes over on the **exact same pitch** before dropping back on the downbeat of bar 5.

### The Architecture
- **Lane 1 (Time Signature 1)**: Grounding downbeat bass pulse (dotted half note on beat 1).
- **Lane 3 (Time Signature 3)**: Steady waltz quarter-note pulse (beats 1, 2, 3).
- **Fill Lane (Time Signature $N$)**: The soloist! Muted during bars 0–2 of each 4-bar phrase. On the 4th bar (bar index 3, 7, 11, 15, 19), Lane 3 mutes and the Fill Lane plays $N$ equidistant strikes across the 3-beat measure on the same note. On bar 20, the fill lane mutes immediately for a clean 3-bar tonic resolution.

### Harmonic Arc & Accelerando
1. **Unique Starting Chord for Each Day**:
   - **Day 1**: **C Major** (`C3 – G3`) &rarr; C – Am – F – G – C
   - **Day 2**: **A Minor** (`A3 – E4`) &rarr; Am – F – Dm – E7 – Am
   - **Day 3**: **F Major** (`F3 – C4`) &rarr; F – Dm – Bb – C – F
   - **Day 4**: **G Major** (`G3 – D4`) &rarr; G – Em – C – D – G
   - **Day 5**: **D Minor** (`D3 – A3`) &rarr; Dm – Bb – Gm – A7 – Dm
   - **Day 6**: **E Minor** (`E3 – B3`) &rarr; Em – C – Am – B7 – Em
   - **Day 7**: **Bb Major** (`Bb3 – F4`) &rarr; Bb – Gm – Eb – F – Bb

2. **Tempo & Accelerando Across Phrases**:
   - **Days 1–5 (Fills 4, 5, 6, 7, 8)**: Phrases 1–3 groove at **135 BPM** (`barDuration: 1.333s`), accelerating across Phrases 4–5 to **160 BPM** (`barDuration: 1.125s`).
   - **Day 6 (Fill 12)**: Phrases 1–3 groove at **95 BPM** (`barDuration: 1.895s`), accelerating across Phrases 4–5 to **115 BPM** (`barDuration: 1.565s`) so the 12-fill stays articulate at 7.7 notes/sec.
   - **Day 7 (Fill 16)**: Phrases 1–3 groove at **85 BPM** (`barDuration: 2.118s`), accelerating across Phrases 4–5 to **105 BPM** (`barDuration: 1.714s`) so the 16-fill peaks at 9.3 notes/sec (matching Week 7's peak speed).
   - **Outro (Bars 20–22)**: Immediate mute of fill lane on downbeat of bar 20, resolving on the tonic.

---

## Schedule & Content Outline

- **Day 1**: `1-the-quadruplet-fill-4.md` — `4:3 The Quadruplet Fill` (Starts C Major)
  - **Fill Signature**: `4` (The classic 4 against 3 hemiola fill)
  - **Spec**: `week8-day1-fill-4-quadruplet`
- **Day 2**: `2-the-quintuplet-fill-5.md` — `5:3 The Quintuplet Fill` (Starts A Minor)
  - **Fill Signature**: `5` (5-against-3 odd-meter waltz tension)
  - **Spec**: `week8-day2-fill-5-quintuplet`
- **Day 3**: `3-the-sextuplet-fill-6.md` — `6:3 The Sextuplet Fill` (Starts F Major)
  - **Fill Signature**: `6` (Eighth-note waltz roll, exactly 2 notes per beat)
  - **Spec**: `week8-day3-fill-6-sextuplet`
- **Day 4**: `4-the-septuplet-fill-7.md` — `7:3 The Septuplet Fill` (Starts G Major)
  - **Fill Signature**: `7` (7-against-3 fluid mathematical cascade)
  - **Spec**: `week8-day4-fill-7-septuplet`
- **Day 5**: `5-the-octuplet-fill-8.md` — `8:3 The Octuplet Fill` (Starts D Minor)
  - **Fill Signature**: `8` (8-against-3 cross-metric binary flurry)
  - **Spec**: `week8-day5-fill-8-octuplet`
- **Day 6**: `6-the-dodecuplet-fill-12.md` — `12:3 The Dodecuplet Fill` (Starts E Minor)
  - **Fill Signature**: `12` (Sixteenth-note waltz barrage, exactly 4 notes per beat)
  - **Spec**: `week8-day6-fill-12-dodecuplet`
- **Day 7**: `7-the-sedecuplet-fill-16.md` — `16:3 The Sedecuplet Fill` (Starts Bb Major)
  - **Fill Signature**: `16` (16-against-3 hyper-speed laser beam climax)
  - **Spec**: `week8-day7-fill-16-sedecuplet`

---

## Testing

Preview each spec directly in the browser:
- **Day 1 (4:3 Quadruplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day1-fill-4-quadruplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day1-fill-4-quadruplet&play=1)
- **Day 2 (5:3 Quintuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day2-fill-5-quintuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day2-fill-5-quintuplet&play=1)
- **Day 3 (6:3 Sextuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day3-fill-6-sextuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day3-fill-6-sextuplet&play=1)
- **Day 4 (7:3 Septuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day4-fill-7-septuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day4-fill-7-septuplet&play=1)
- **Day 5 (8:3 Octuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day5-fill-8-octuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day5-fill-8-octuplet&play=1)
- **Day 6 (12:3 Dodecuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day6-fill-12-dodecuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day6-fill-12-dodecuplet&play=1)
- **Day 7 (16:3 Sedecuplet Fill)**: [http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day7-fill-16-sedecuplet&play=1](http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=week8-day7-fill-16-sedecuplet&play=1)

---

## Long-Form Compilation (YouTube)

- **Title**: Polyrhythmic Fills in 3/4 Waltz Time (From 4:3 to 16:3) | Complete Accelerando Suite | POLYRIZZEMS
- **Structure**: Continuous chronological compilation of all 7 waltz polyrhythmic fill studies with seamless key bridge transitions. Total runtime approx. 3.5 minutes.
