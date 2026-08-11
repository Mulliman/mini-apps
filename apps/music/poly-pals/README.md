<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8799290b-0f7e-4272-93cc-bc284f07045e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

# Making videos

PolyPals videos are **computed, not screen-recorded**. A video is a JSON *spec*; a
headless pass steps a fake clock frame by frame and pipes the result into ffmpeg.
Nothing runs in real time, so there are no cursors, no popups, no dropped frames,
and the same spec produces the same video on any machine.

## Render a spec

```bash
pnpm --filter @miniapps/poly-pals render golden-triad
```

Writes `out/golden-triad-9x16.mp4` and `out/golden-triad-16x9.mp4` — both 1080p60,
from the one spec. `out/` is git-ignored: **the spec is the source, the video is a
build artifact.**

| Flag | Default | |
|---|---|---|
| `--aspect` | `both` | `both`, `9x16`, `16x9` |
| `--fps` | `60` | |
| `--scale` | `2` | Supersample factor. Frames are captured at this multiple and downscaled, which cleans up the neon edges. `--scale 1` is roughly 2× faster for drafts. |
| `--bars` | all | Render only the first N bars — a quick smoke test |
| `--no-audio` | | |
| `--out` | `out/` | |

A full 32-second video takes about 9 minutes for both cuts at default quality.
No dev server needed — the renderer starts Vite itself on an ephemeral port.

## Preview a spec without rendering

Render mode is switched on by URL, so the exact page the renderer drives can be
watched live in a browser, full-screen and chrome-free:

```
/apps/music/poly-pals/index.html?render=1&spec=golden-triad&play=1
```

Drop `&play=1` and the page waits to be stepped by the renderer instead.

## Spec format

Specs live in `public/specs/*.json`. Times are in **bars**, not seconds — everything
lands on a downbeat, where the balls align.

```jsonc
{
  "name": "Layers",
  "bars": 16,              // total length in bars
  "barDuration": 3.2,      // seconds per bar at the start
  "rhythms": [ /* the arrangement at bar 0 */ ],
  "events": [
    { "at": 2,  "type": "add",    "rhythm": { /* … */ } },
    { "at": 9,  "type": "mute",   "id": "seven" },
    { "at": 11, "type": "unmute", "id": "seven" },
    { "at": 12, "type": "tempo",  "barDuration": 2.4 },
    { "at": 14, "type": "remove", "id": "three" },
    { "at": 15, "type": "update", "id": "four", "patch": { "timeSignature": 9 } }
  ]
}
```

`mute` is deliberately not `remove`: the ball keeps bouncing silently, so viewers
*see* the rhythm they stopped hearing. `update` keeps a lane in place, where
`remove` + `add` would make it visibly leave and return.

A spec with **no events loops seamlessly** — the renderer emits the half-open frame
range so the loop point isn't a duplicated frame, and the final decay tails are
folded back over the start. Any `add` or `remove` means the end state differs from
the start, so it can't loop.

## Record a spec instead of writing one

Press the ● button in the app. Recording starts on the next downbeat, and from then
on **your actions queue and land on the downbeat** — in the live app as well as in
the spec, so what you performed is exactly what renders. A pill shows what's queued
and how long until it lands. Press ■ to stop; the spec downloads as JSON. Drop it in
`public/specs/` and render it.

Pausing playback ends the take.

## How it stays in sync

The bounce is a pure function of time — `1 - 4(p - 0.5)²` — and every strike lands at
`k × barDuration / timeSignature`. Picture and sound are derived from the same
arithmetic, so they cannot drift apart regardless of how fast frames are produced.
That property is why `seek(t)` is random-access, and why a render could be split
across several browsers later.

It also constrains the code: nothing on screen during a render may depend on
wall-clock time. The ripple, lane entry/exit and lane reflow are therefore computed
from `t` rather than animated by motion/react, which is still used for the drawers
and modals that never appear in a video.
