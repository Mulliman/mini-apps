---
name: polyrizzems-video
description: Compose POLYRIZZEMS polyrhythm video specs in the house style — turning briefs like "a Cmaj7 in 4s with a complementing chord in threes and sixes" into spec JSON, voicing chords across rhythmic families, shaping the build-and-unwind arc, then normalising and rendering. Use when creating, editing, reviewing or rendering a POLYRIZZEMS video, spec, or anything in apps/music/poly-rizzems/public/specs.
---

# Composing POLYRIZZEMS videos

A video is a spec: `apps/music/poly-rizzems/public/specs/<name>.json`. You write the
musical decisions; `normalise.mjs` fills in everything that is arithmetic. Read
`apps/music/poly-rizzems/README.md` for the spec format and the render pipeline.

**Never hand-write `volume`, `expression`, or `frequency`.** Leave those keys out
entirely and run the normaliser. Deriving them by hand is how the house style
drifts.

## Reading a brief

Briefs name a **chord** and a **rhythmic family**:

> "a C major 7 in 4s and then a nice complementing chord in threes and sixes"

- **"in 4s"** means the binary family — signatures `2, 4, 8, 16`. **"in 3s"** means
  `3, 6, 12`. "in 5s" means `5, 10`. Take as many members as the chord has notes.
- Members of one family are rhythmically *consonant* — they align on shared
  subdivisions. **The polyrhythm lives between families, never inside one.** A
  brief naming a single family has no polyrhythm in it; say so and ask for a
  second, or propose one.
- "a complementing chord" is your call. Something sharing tones with the first
  usually sits well (A minor under Cmaj7 gives a Cmaj13 colour); something with a
  foreign tone creates tension deliberately (F major against Cmaj7 puts F a
  semitone off E).

## Voicing

Sort the family's signatures ascending, then assign the chord's notes ascending in
pitch:

| Signature | 2 | 4 | 8 | 16 |
|---|---|---|---|---|
| Note | C3 | E4 | G4 | B4 |

**Slow lanes get low notes; fast lanes get high ones.** This pairs with the mix
curve — fast high lanes are the quietest, so they shimmer over the beat instead of
machine-gunning it. Put the root of the whole piece on the slowest lane of the
primary family, and keep it genuinely low (C3–G3) with the upper structure spread
across C4–C5.

## The arc

The house shape is **tempo set, build up, then unwind**:

1. **Set the tempo (Bars 0–1):** Open on **signature `1`** — the root note downbeat pulse solo for **2 bars**. This acts as the visual and auditory metronome, setting the bar tempo before subdivisions arrive.
2. **Build up:** Add one lane every **2 bars** (starting at Bar 2), primary family first, then the second family. The moment the second family enters is when the polyrhythm appears; give it room.
3. **Peak:** Hold the full arrangement for **2–4 bars**.
4. **Unwind:** Remove one lane every **1 bar**, in **reverse order of arrival** — it unwinds back down to the root. The descent can move faster than the build.
5. **Silence:** Remove the last lane **one bar before the end**, leaving exactly **one silent bar** to close on.

### Runtime Target

- **Aim for ~1 minute** (55s–60s) for Shorts to maximize retention while staying strictly under the 60s hard ceiling.
- Compute: `bars × barDuration ≈ 56–59s`.
  - For example: **24 bars at 2.4s** = 57.6s, or **22 bars at 2.6s** = 57.2s.

A spec with events cannot loop, which is fine for an arc. If you want a seamless
looper instead, use no events at all — the renderer then emits a half-open frame
range and folds the audio tail over the start.

## Bounce height

Leave `bounce` unset. It defaults to `equalSpeed`, which scales each lane's arc with
a smooth gradual roll-off (2 is 100%, 8 is ~57%, 16 is 15%) so slow lanes arc high and
lazy, fast ones stay comfortably visible and readable without collapsing to the floor.

This matters most for exactly the briefs this skill invites. A "4s" family spanning
2 to 16 is an 8× spread; with a single shared height the 16-lane crosses **four
ball-widths per frame at 60fps** and turns into an unreadable streak. Only reach
for `bounce: "uniform"` — the classic equal-height look — when fastest ÷ slowest is
about 4 or less.

## Colour

Give each rhythmic family its own end of the palette — cool for one, warm for the
other. Lanes lay out in order of arrival, so the families group on screen and the
polyrhythm becomes visible as well as audible.

Palette (from `src/types.ts`): `#ff007f #00f0ff #39ff14 #fffb00 #ff5f00 #b026ff
#ff073a #ccff00 #00ffd0 #ff00ea`.

## What the normaliser does

```bash
pnpm --filter @miniapps/poly-rizzems normalise <spec>          # rewrite in place
pnpm --filter @miniapps/poly-rizzems normalise <spec> --check  # report, exit 1 if it would change
```

- **Mix level from pitch** — `0.85 × (C4 / freq)^0.5`, so C3 sits at 0.95 and C6 at
  0.43. Roughly equal-loudness, since hearing peaks around 3–4 kHz and high notes
  otherwise dominate. It also keeps the downbeat from clipping.
- **Each lane's face from the interval it forms on arrival**, measured against the
  bass — with a semitone rub or a tritone against *any* sounding note overriding,
  because the ear flags those whatever the bass is doing.

| Semitones above bass | | | |
|---|---|---|---|
| 0 octave `sleepy` | 1 min 2nd `angry` | 2 maj 2nd `silly` | 3 min 3rd `sad` |
| 4 maj 3rd `happy` | 5 4th `none` | 6 tritone `sick` | 7 5th `cool` |
| 8 min 6th `sad` | 9 maj 6th `excited` | 10 min 7th `surprised` | 11 maj 7th `dizzy` |

The first lane is the root and gets `cool`. Pass `--keep-expressions` to hand-pick
faces instead.

It also validates: signatures in range, notes in the palette, ids unique among
sounding lanes, events landing on real bars and targeting live lanes.

## Constraints

- **Notes are naturals only, C3–C6** — no sharps or flats. Chords needing one (E
  major wants G♯) **cannot be voiced**. Say so rather than quietly substituting.
- `timeSignature` is an integer **1–19**, so the binary family stops at 16 and the
  ternary at 12. Signature 1 provides a single downbeat pulse per bar.
- `at` is a whole bar index and must be `< bars`.
- Ten lanes is the live app's cap; past about eight, a 1080-wide frame is crowded.

## Finishing

```bash
# watch it before committing minutes to a render
# /apps/music/poly-rizzems/index.html?render=1&spec=<name>&play=1

pnpm --filter @miniapps/poly-rizzems render <name>
```

Renders take roughly 9 minutes for both cuts of a 30s video, so preview first. Use
`--bars 2 --scale 1` for a fast look at the opening. Output lands in `out/`, which
is git-ignored — the spec is the artifact worth keeping.
