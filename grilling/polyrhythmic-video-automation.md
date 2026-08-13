# Grilling: Polyrhythmic video automation (POLYRIZZEMS)

Started: 2026-08-11
Status: complete

Subject: automating video production from `apps/music/poly-rizzems` — planning and/or
rendering polyrhythm videos without UI chrome, popups, cursors or click artifacts.

## Context gathered from the codebase (not up for debate, just facts)

- `App.tsx` runs a single RAF master clock: `currentTime = (currentTime + dt) % barDuration`.
- `RhythmTrack.tsx` is a **pure function of `currentTime`** — ball height is
  `1 - 4*(beatProgress - 0.5)^2`, beat index is `floor(t / (barDuration/sig)) % sig`.
  Nothing about the visual depends on wall-clock or history.
- Audio is fired as a side effect when the floored beat index changes
  (`playSynthNote` → live `AudioContext`), so it is realtime-bound today.
- Non-deterministic bits: `getRandomExpression()` per track, `localStorage`
  (`polyrhythm_tracks`, `polyrhythm_bar_duration`), motion/react ripple + layout springs.
- Chrome to hide: shared `Header`, bottom action bar, settings drawer, help modal,
  per-lane hover buttons.

**Implemented 2026-08-11.** See `apps/music/poly-rizzems/README.md` for the resulting
workflow. Three things were learned during implementation that this plan got wrong:

1. **`seek()` must not wait on `requestAnimationFrame.`** rAF stops firing whenever the
   page isn't compositing (backgrounded tab, occluded window, throttled headless), so a
   rAF-gated seek deadlocks. It resolves on React commit instead; CDP screenshots
   rasterise from committed DOM, so commit is the guarantee that matters.
2. **`--disable-gpu` is worth 5×.** Headless routes compositing through SwiftShader and
   every screenshot then waits ~300ms on a GPU frame it doesn't need. 3.3 → 18 fps.
3. **The ball overhangs the runway at *both* ends**, not just the apex — it's positioned
   by its centre, so at the floor it covered the beat counter. Layout reserves a radius
   of clearance top and bottom.

## Summary — the shared understanding

POLYRIZZEMS videos are **computed, not captured**. A video is a JSON *spec* — an initial
arrangement plus a list of delta events timed in bars — living in
`apps/music/poly-rizzems/public/specs/`. Opening `?render=1&spec=<name>` in any browser plays
that spec full-screen and chrome-free; that same URL is what a headless puppeteer session
drives, stepping an injected clock frame by frame and piping PNGs into ffmpeg. Because
every visual is made a pure function of `t` and every audio strike is analytic
(`k × barDuration / timeSignature`, rendered offline through `OfflineAudioContext`),
picture and sound derive from the same arithmetic and cannot drift. Each run emits both a
9:16 and a 16:9 1080p60 cut from the one spec.

Getting there requires four changes to the app itself, all of which improve it
independently of video: an injected clock instead of a self-owned RAF loop, three
motion/react flourishes reimplemented as formulas, `playSynthNote` taking an explicit
context and schedule time (which also fixes existing playback jitter), and a proportional
layout replacing today's fixed size caps.

A live **record** button comes second. It wraps the five existing state handlers and logs
events as you play — and while armed, your actions queue and land on the next downbeat in
the live app too, so what you performed is exactly what renders.

## Resolved

- **Recorder vs renderer**: Both, but they are layered — "record" is an *authoring*
  front-end that captures **config**, not pixels; the deterministic renderer consumes
  that config and produces the actual video. — *Improvisation stays possible without
  giving up deterministic, re-renderable, perfectly-synced output.*
- **Spec shape**: timeline of events — `{initial, events[]}` — with event times expressed
  in **bars/downbeats (cycles), not seconds**; everything snaps to the downbeat.
  — *The downbeat is the only musically honest edit point, and cycle-quantising tempo
  changes makes the `t % barDuration` phase-jump bug unrepresentable. No continuous
  tempo ramps in v1.*
- **Output format**: every render produces **both** 9:16 (1080×1920) and 16:9 (1920×1080)
  at 1080p, 60fps, from the same spec. Resolution is a render-time knob via
  `deviceScaleFactor`, not a bigger CSS viewport. — *Both platforms covered per run;
  audio is viewport-independent so it is rendered once and reused for both cuts.*
  **Consequence:** the app's layout caps must become viewport-relative or both cuts
  will be under-filled.
- **Renderer engine**: (A) drive the real app in headless Chromium via **puppeteer**
  (already a root devDependency, already used in `scripts/test-devices.js`) with an
  injected clock; frames piped to **ffmpeg 7.0.2** (already on PATH). Not Remotion,
  not a standalone canvas reimplementation. — *The app is the single source of truth for
  the visuals; a second implementation would drift. Accepted cost: ~5–8 min to render
  both cuts of a 60s video.*
  **Consequence:** `App.tsx` must stop owning its RAF loop and accept an injected clock;
  live playback becomes "the RAF driver", rendering becomes "the stepping driver".
- **Frame purity**: `seek(t)` must be **pure** — every visual derives from `t` alone.
  The three wall-clock-driven motion/react animations get reimplemented as formulas:
  impact ripple (`RhythmTrack.tsx:127-142`), lane enter/exit (`App.tsx:299-323`),
  lane reflow `layout="position"` (`App.tsx:303`). Use the pure versions in **both**
  live and render mode so they can't diverge; motion/react stays for drawers and modals,
  which never appear in a render. — *motion animates on real RAF/`performance.now`, but
  the render loop steps the clock at its own pace, so flourishes would desync from the
  bounces and vary by machine. Purity also buys random-access seek, resumable renders,
  and parallel rendering across browser instances.*
- **Audio**: render the app's own synth offline via `OfflineAudioContext` in the same
  headless page, scheduling every strike analytically at `k × barDuration / timeSignature`,
  dump a WAV, let ffmpeg mux it. Rendered once, reused for both aspect cuts.
  — *Identical sound to the app with sample-accurate timing, no second implementation.*
  **Consequence:** `playSynthNote` must become `(ctx, when, freq, isAccent, volume)` —
  explicit context and explicit schedule time — instead of grabbing a module-global ctx
  at `ctx.currentTime`. Side benefit: this also fixes existing live-playback jitter,
  where notes fire from the RAF effect (`RhythmTrack.tsx:51-72`) up to a frame late.
- **Render-mode contract**: a URL flag `?render=1&spec=<name>` puts the app in render mode,
  which (1) hides all chrome, (2) disables localStorage read/write so a live session can't
  leak into a video, (3) swaps the RAF clock for manual stepping, (4) exposes
  `window.__polyrizzems.seek(t)` / `.renderAudio()` for puppeteer.
  — *The spec arriving via URL means the same link can be opened in a real browser to
  preview the video live and chrome-free — the dev loop comes free.*
- **Spec storage**: spec JSON files live in `apps/music/poly-rizzems/public/specs/*.json`,
  fetched **document-relative** (`./specs/<name>.json`) because the app sets `base: './'`
  and is served from a subpath in the combined deploy. — *Only option where dev preview,
  headless render, and a shareable link on the deployed site use one identical code path;
  specs stay version-controlled, diffable, hand-editable and glob-batchable.*
  Accepted: specs ship publicly with the site. Deferred: a `#s=<compressed>` inline
  share-link form as a later complement.
- **Determinism**: no PRNG seeding — `expression` becomes a required field in the spec
  (the `Rhythm` type already has it, `types.ts:23`), so `getRandomExpression()` never runs
  in render mode. — *Randomness is eliminated rather than tamed, and the faces become a
  deliberate creative choice.*
- **On-screen content in a render**: keep the per-lane `5♩ / G4` labels
  (`RhythmTrack.tsx:112`) and the beat-number boxes (`RhythmTrack.tsx:163`); drop the
  bordered/rounded/padded board frame (`App.tsx:297`) and go edge-to-edge black; add a
  small low-opacity POLYRIZZEMS wordmark in a corner. Title cards are **not** in v1.
  — *The numbers are the engagement hook — they let a viewer watch 5-against-7 resolve.
  The board frame reads as "screenshot of an app" and wastes frame area at 9:16.
  Baked-in title cards would mean re-rendering 3,600 frames to fix a typo; do them in a
  real editor.*
- **Layout**: one proportional system for both aspects — no per-aspect authoring. Delete
  the fixed caps (`max-w-[120px]` lane, `max-h-[600px]` + `h-[60vh] md:h-[50vh]` runway,
  `clamp(1.4rem,6vw,5.5rem)` ball) and derive everything from frame size and lane count:
  runway ≈ 72% of frame height, lane pitch = frame width ÷ lane count (capped, group
  centred), **ball diameter tied to runway height at roughly 1/8–1/10**.
  — *Per-aspect tuning would undo the "both cuts from one spec" decision and drift.
  Tying ball size to runway height is the single biggest visual win here: the classic
  look needs the parabola to read as travel, not a ball wobbling in place.*
  Accepted: 16:9 with only 2 lanes keeps empty side margins rather than stretching.
- **Event model**: events are **deltas**, not keyframes. `stateAt(t)` = fold of all events
  with `at ≤ currentBar`. — *Compact enough to hand-edit, natural for a recorder to emit,
  and folding ten items costs nothing so purity is untouched.*
- **Event vocabulary (v1)**: `add`, `remove`, `mute`, `unmute`, `tempo`, `update`.
  `mute`/`unmute` are deliberately distinct from `add`/`remove` — the ball keeps bouncing
  silently, so you *see* the rhythm you stopped hearing. `update` is a partial patch that
  keeps the lane in place (no exit/enter, no reflow), unlike `remove`+`add`.
  Top-level `bars: N` gives total length in bars, not seconds.
  **Consequence:** with tempo changes, wall-clock duration is
  `Σ(bars_in_segment × barDuration_of_segment)` — only known after folding, which matters
  when targeting a sub-60s Short.
- **Recorder**: (A) a record button on the live app, not a timeline editor. It wraps the
  five existing handlers (`handleAddRhythm`, `handleRemoveRhythm`, `handleToggleMute`,
  `handleUpdateRhythm`, `setBarDuration` — `App.tsx:185-250`) and appends
  `{at: currentBar, type, payload}`; stop → download JSON. — *The six event types map
  onto those handlers exactly, so it's a few dozen lines.*
- **Quantised live actions while armed**: when recording, an action **queues and lands on
  the next downbeat** in the live app too, rather than applying instantly.
  — *What you saw while recording is exactly what renders, and it turns clicking into
  conducting (cf. Ableton clip launch).* Accepted cost: the app feels laggy while armed —
  mitigate with a ghosted pending lane counting down to the downbeat.
- **Tooling location**: `apps/music/poly-rizzems/scripts/render.mjs`, run as
  `pnpm --filter @miniapps/poly-rizzems render <spec>`. Deliberately **not** root `scripts/`
  despite `test-devices.js` living there. — *Keeps specs, renderer and the app they drive
  in one self-contained folder; root `scripts/` stays for genuinely cross-app tooling.*
- **Server management**: the script starts Vite programmatically on an ephemeral port and
  tears it down. — *One command, no "did I start the server", no port collisions with a
  normal dev session.* Flags: `--aspect both|9x16|16x9`, `--fps 60`, `--scale 2`, `--out`.
  Aspects render sequentially against one shared audio WAV; frames pipe into ffmpeg
  stdin (`image2pipe`) rather than writing 3,600 PNGs to disk.
  **Known caveat:** rendering against the dev server means un-minified, HMR-instrumented
  code — first suspect if a video ever diverges from the deployed site. Stub a `--dist`
  flag (build + serve `dist/`) as the escape hatch, but don't implement it in v1.
- **Outputs**: MP4s land in `apps/music/poly-rizzems/out/`, **git-ignored**, named
  `<spec>-<aspect>.mp4`, overwritten on re-render (no timestamps or version suffixes).
  — *The spec is the source, the video is a build artifact; determinism means re-rendering
  a spec reproduces the video, so archiving old cuts is clutter.* Accepted: no durable
  archive of "the exact file I posted on date X" — git history of the spec stands in.
- **Encoding**: `libx264 -preset slow -pix_fmt yuv420p -crf 16 -r 60 -g 120`,
  audio AAC 192k from the shared WAV.
  — *`yuv420p` is mandatory or QuickTime and several platforms show black/colour-shifted
  video. `crf 16` (not the usual 18–23) because near-black backgrounds with soft neon glow
  are H.264's worst case — banding shows as concentric rings around each ball. If rings
  persist, add a touch of `noise` dither rather than more bitrate. `-g 120` gives platform
  re-encodes clean cut points.*
- **Loop seam**: render the **half-open** range `[0, N)` — exactly
  `bars × barDuration × fps` frames, endpoint excluded. — *`t` wraps at `barDuration`, so
  the frame at `t = bars × barDuration` is identical to `t = 0`; including it duplicates a
  frame and every autoloop on Shorts/TikTok visibly stutters.* Perfect visual loop comes
  free for event-free specs only — `add` events mean the end state ≠ start state.
- **Audio tail-fold**: render audio ~1s longer than the video and fold the overhang back
  over the beginning, for event-free specs. — *Final beats have 0.24s/0.45s decay tails
  (`audio.ts:100`) that get chopped at the render boundary and click audibly on loop.*
- **Start position**: begin at `t = 0` with every ball on the floor striking together.
  No count-in, no fade. — *It's the natural downbeat and the money shot.*
- **Build order**: **renderer first**, driven by one hand-written spec; recorder second.
  — *The renderer holds all the risk (pure animations, audio sync, layout) and is the
  thing that can't be done today; a recorder emitting specs you can't yet render is
  building blind. Hand-writing one spec is twenty minutes.*
  Within the renderer track, in this order, each step independently eyeball-able:
  1. Layout + chrome-hiding (verifiable in a normal browser at 1080×1920, no tooling)
  2. Clock injection + pure animations (verifiable by scrubbing `seek()` in the console)
  3. `render.mjs` producing **silent** video (proves puppeteer + ffmpeg)
  4. Offline audio + mux (last, on top of known-good everything else)

## Open branches

_(none — all resolved)_

## Transcript

### Q1: Is this a recorder (live MediaRecorder capture) or a renderer (declare a spec, headless deterministic render)?
Recommended: (B) renderer, because `RhythmTrack` is a pure function of `currentTime` and
audio is analytic, so video+audio derive from the same arithmetic and cannot drift.
Answer: Both — the recorder captures the **config**, which is then handed to the renderer.
Recording is an authoring UI, not a capture pipeline.

### Q2: One static config, or a timeline of events? If timeline, quantised how?
Recommended: (B) timeline, with `at` in cycles and snapped to the downbeat; no continuous
tempo ramps in v1 (they'd need explicit ramp semantics in both clock and renderer).
Answer: (B), quantised to downbeats/bars. Ramps deferred.

### Q3: Target format — 9:16 only, or also 16:9? At what fps/resolution?
Recommended: 9:16 primary at CSS viewport 1080×1920 with `deviceScaleFactor: 2`, 60fps;
16:9 as a later problem.
Answer: render **both** 9:16 and 16:9 at 1080p on every run, from one spec.

### Q4: Which render engine — headless real app, Remotion, or standalone canvas?
Recommended: (A) headless real app via puppeteer + ffmpeg, both already available.
Answer: (A) for now.

### Q5: Must `seek(t)` be pure, given motion/react runs on wall-clock time?
Recommended: (A) convert the 3 flourishes to formulas. (B) faking the clock is a gamble,
(C) disabling them in render mode is a valid stepping stone but loses polish.
Answer: (A).

### Q6: Where does the audio come from — offline render of the app's synth, a Node rewrite, or live capture?
Recommended: (A) `OfflineAudioContext` reusing the app's synth, requiring a
`playSynthNote(ctx, when, ...)` refactor.
Answer: (A).

### Q7: What is the renderer↔app contract, and does the spec arrive via URL?
Recommended: `?render=1&spec=…` flag + `window.__polyrizzems.seek()`; spec via URL so the
same link previews live in a browser; `expression` made explicit instead of seeded.
Answer: accepted, with a follow-up on the mechanics of serving the file.

### Q7b: How does the web app actually get the spec file?
Recommended: (A) `public/specs/*.json`, fetched document-relative — the only option where
dev preview, headless render and the deployed site share one code path.
Answer: (A) for now.

### Q8: What stays on screen — labels, beat counters, board frame, branding, title cards?
Recommended: keep labels + beat counters, drop the board frame for edge-to-edge black,
add a small wordmark, defer title cards to a real editor.
Answer: agreed on all points.

### Q9: One proportional layout for both aspects, or per-aspect compositions?
Recommended: (A) one proportional system, since per-aspect tuning undoes "both cuts from
one spec"; tie ball diameter to runway height.
Answer: (A).

### Q10: Deltas or keyframes, and what event types?
Recommended: deltas; `add`/`remove`/`mute`/`unmute`/`tempo`/`update`, with `bars: N` for
length. Flagged `update` as the one that overlaps with `remove`+`add`.
Answer: deltas, all six kept.

### Q11: What is the recorder — live record button, timeline editor, or hand-written JSON?
Recommended: (A) live record button wrapping the existing handlers, **with actions
quantised to the next downbeat in the live app while armed** so live == spec.
Answer: agreed, including the quantised-launch behaviour.

### Q12: Where does the render tool live, and does it manage its own dev server?
Recommended: `apps/music/poly-rizzems/scripts/render.mjs` (not root `scripts/`), starting
Vite itself on an ephemeral port; frames piped to ffmpeg stdin.
Answer: agreed.

### Q13: Where do MP4s go, and how are they encoded?
Recommended: `out/` git-ignored, `<spec>-<aspect>.mp4` overwritten; x264 crf 16, yuv420p,
because dark + neon glow is H.264's banding worst case.
Answer: agreed, git-ignore is fine.

### Q14: Does the video loop seamlessly, and what happens at the seam?
Recommended: half-open frame range `[0, N)`; audio tail-fold for event-free specs; start
at `t = 0` with all balls on the floor, no count-in.
Answer: agreed on all three, to be refined in practice.

### Q15: What ships first — renderer or recorder?
Recommended: renderer first, driven by a hand-written spec, in four independently
verifiable steps (layout → clock/purity → silent video → audio).
Answer: agreed.
