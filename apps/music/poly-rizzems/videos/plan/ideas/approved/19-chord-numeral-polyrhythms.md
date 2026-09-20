# Idea 19: Chord Numeral Polyrhythms (Mutating Lanes Architecture)

- **Theme Slug**: `chord-progressions`
- **Category**: Harmonic Polyrhythms / Theory Concepts
- **Status**: Approved (Week 6 Campaign Plan & Production Specs Created)

## Core Concept
Taking legendary chord progressions from world-famous songs played in their **authentic original record keys** and using their Roman numeral / scale degree numbers as the polyrhythm signatures.

Instead of spawning 10+ lanes and muting 70% of them, the arrangement uses a **lean 4-to-5 lane mutating architecture**:
- **Track 1**: Master downbeat pulse (`1♩`), dynamically updating its root pitch on chord changes to anchor the live chord detection banner.
- **Tracks 2–4 (or 2–5)**: Persistent polyrhythm lanes matching the progression's numerals (e.g. 1, 5, 6, 4 or 2, 5, 1).
- At bar boundaries, persistent lanes mutate their **notes**, **frequencies**, and **color themes** via `type: "update"` patch events.
- **Authentic Pitch & Pure Harmony**: Every video plays in the **original key** of the song using exact frequencies in Hz. 4-lane pop/rock chords use **octave doublings** (`Root – 5th – Octave – 3rd`) rather than jazzy 7th chords, producing clean, powerful stadium-grade chords (**E Major**, **B Major**, **C# Minor**, **A Major**, etc.).
- **On-Screen Titles**: Clean, punchy titles without song names on screen (song references reserved for YouTube descriptions, tags, and compilation chapter separators).

### Structure & Progression Loop
- **Intro (Bars 0–1, 2 bars)**: Master downbeat pulse sets the tempo (`Beat 1♩`) on the starting chord root.
- **First Cycle Debut (Bar 2)**: Polyrhythm lanes enter with Chord 1's voicing and palette.
- **Continuous Cyclic Groove (Bars 2–21, ~48s)**: Smooth cyclic loops (1 bar per chord or 1-1-2 bars) running 5 full revolutions.
- **Outro (Bars 22–23)**: Lanes unwind at Bar 22, pulse clears at Bar 23.
- **Total Duration**: 24 bars @ 2.4s = 57.6s (strictly under YouTube Shorts' 60s limit).

---

## 7-Day Campaign Arc (Authentic Original Keys — 0 Beatles Songs)

### Day 1: `1-5-6-4` The 4 Chords of Pop
- **On-Screen Title**: `1-5-6-4 The 4 Chords of Pop`
- **Featured Song Anchor**: **Journey — *"Don't Stop Believin'"*** (also Bob Marley — *"No Woman, No Cry"*, U2 — *"With Or Without You"*, Adele — *"Someone Like You"*)
- **Original Key**: **E Major**
- **Exact Chords**: `I (E)` $\to$ `V (B)` $\to$ `vi (C#m)` $\to$ `IV (A)` (1 bar each)
- **Voicing**: Jonathan Cain's piano register (`E3-B3-E4-G#4`, `B3-F#3-D#4-F#4`, `C#3-G#3-C#4-E4`, `A3-E3-C#4-E4`), with the top line playing the iconic falling hook: $G\#4 \to F\#4 \to E4 \to E4$.
- **Polyrhythm Numbers**: `1`, `5`, `6`, `4`
- **Hook**: "Can 4 numbers predict 100 hit pop anthems? 1 vs 5 vs 6 vs 4 polyrhythm."

### Day 2: `2-5-1` The Jazz-Pop Groove
- **On-Screen Title**: `2-5-1 The Jazz-Pop Groove`
- **Featured Song Anchor**: **Maroon 5 — *"Sunday Morning"***
- **Original Key**: **C Major**
- **Exact Chords**: `ii (Dm)` [1 bar] $\to$ `V (G)` [1 bar] $\to$ `I (C)` [2 bars]
- **Voicing**: Warm, descending Rhodes piano triads (`D3-A3-F4`, `G3-B3-D4`, `C3-G3-E4`), with every voice stepping downward to settle into a deep, low C Major 1 chord.
- **Polyrhythm Numbers**: `2`, `5`, `1`
- **Hook**: "The most famous looping 2-5-1 in pop history plays Maroon 5's 'Sunday Morning'."

### Day 3: `1-7-4` Classic Rock Swagger
- **On-Screen Title**: `1-7-4 Classic Rock Swagger`
- **Featured Song Anchor**: **Lynyrd Skynyrd — *"Sweet Home Alabama"*** (also The Rolling Stones — *"Sympathy for the Devil"*, AC/DC — *"You Shook Me All Night Long"*, Guns N' Roses — *"Sweet Child O' Mine"*)
- **Original Key**: **D Mixolydian**
- **Exact Chords**: `I (D)` [1 bar] $\to$ `bVII (C)` [1 bar] $\to$ `IV (G)` [2 bars]
- **Voicing**: Grounded southern rock guitar cowboy voicings (`D3-A3-F#4`, `C3-G3-E4`, `G3-D4-B4`), keeping the G chord heavy and anchored.
- **Polyrhythm Numbers**: `1`, `7`, `4`
- **Hook**: "The swaggering classic rock riff powered by a 1 vs 7 vs 4 polyrhythm."

### Day 4: `1-6-3-7` The Minor Anthem
- **On-Screen Title**: `1-6-3-7 The Minor Anthem`
- **Featured Song Anchor**: **The Cranberries — *"Zombie"*** (also Alan Walker — *"Faded"*, Eminem / Rihanna — *"Love the Way You Lie"*, Of Monsters and Men — *"Little Talks"*)
- **Original Key**: **E Minor**
- **Exact Chords**: `i (Em)` $\to$ `VI (C)` $\to$ `III (G)` $\to$ `VII (D)` (1 bar each)
- **Voicing**: Heavy grunge guitar registers (`E3-B3-E4-G4`, `C3-G3-C4-E4`, `G3-D4-G4-B4`, `D3-A3-D4-F#4`), keeping all 4 chords full-bodied without high shrill spikes.
- **Polyrhythm Numbers**: `1`, `6`, `3`, `7`
- **Hook**: "The legendary chords of 'Zombie' powered by a 1 vs 6 vs 3 vs 7 polyrhythm."

### Day 5: `1-4-5` Rock & Roll Cadence
- **On-Screen Title**: `1-4-5 Rock & Roll Cadence`
- **Featured Song Anchor**: **Ritchie Valens — *"La Bamba"*** (also The Troggs — *"Wild Thing"*, Chuck Berry — *"Johnny B. Goode"*)
- **Original Key**: **C Major**
- **Exact Chords**: `I (C)` [1 bar] $\to$ `IV (F)` [1 bar] $\to$ `V (G)` [2 bars]
- **Voicing**: Punchy Latin rock rhythm guitar triads (`C3-E4-G4`, `F3-C4-A4`, `G3-D4-B4`), driving upward into a punchy G major without thinning out.
- **Polyrhythm Numbers**: `1`, `4`, `5`
- **Hook**: "The 3 chords that built rock 'n' roll played as a 1 vs 4 vs 5 groove."

### Day 6: `1-7-6-5` The Spanish Descent
- **On-Screen Title**: `1-7-6-5 The Spanish Descent`
- **Featured Song Anchor**: **Ray Charles — *"Hit the Road Jack"*** (also Dire Straits — *"Sultans of Swing"*, Muse — *"Hysteria"*)
- **Original Key**: **G# Minor**
- **Exact Chords**: `i (G#m)` $\to$ `bVII (F#)` $\to$ `bVI (E)` $\to$ `v (D#m)` (1 bar each)
- **Voicing**: Parallel descending horn & piano voicings (`G#3-D#4-G#4-B4`, `F#3-C#4-F#4-A#4`, `E3-B3-E4-G#4`, `D#3-A#3-D#4-F#4`), with all 4 voices cascading cleanly in unison.
- **Polyrhythm Numbers**: `1`, `7`, `6`, `5`
- **Hook**: "'Hit the Road Jack' Spanish descent played by a 1 vs 7 vs 6 vs 5 polyrhythm."

### Day 7: `1-6-2-5` The 50s Doo-Wop Loop
- **On-Screen Title**: `1-6-2-5 The 50s Doo-Wop Loop`
- **Featured Song Anchor**: **Frankie Lymon & The Teenagers — *"Why Do Fools Fall In Love"*** (also The Marcels — *"Blue Moon"*, Dion & The Belmonts — *"A Teenager in Love"*, George Gershwin — *"I Got Rhythm"*)
- **Original Key**: **F Major**
- **Exact Chords**: `I (F)` $\to$ `vi7 (Dm7)` $\to$ `ii7 (Gm7)` $\to$ `V7 (C7)` (1 bar each)
- **Voicing**: Classic 50s street-corner vocal harmony registers (`F3-C4-F4-A4`, `D3-C4-F4-A4`, `G3-D4-F4-Bb4`, `C3-E4-G4-Bb4`), holding guide tones across bars with authentic backing vocal movement.
- **Polyrhythm Numbers**: `1`, `6`, `2`, `5`
- **Hook**: "The 1950s loop that defined doo-wop: Frankie Lymon's 'Why Do Fools Fall In Love' as 1 vs 6 vs 2 vs 5."
