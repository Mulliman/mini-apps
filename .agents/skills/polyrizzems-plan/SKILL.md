---
name: polyrizzems-plan
description: Plan a 7-day YouTube Shorts campaign and compiled long-form video for POLYRIZZEMS under apps/music/poly-rizzems/videos/plan/week-N-<theme>/ from a prompt. Generates 7 ordered markdown files (1-title.md to 7-title.md) with complete spec parameters, musical voicings, and YouTube automation metadata.
---

# POLYRIZZEMS Video Planning (`polyrizzems-plan`)

Use this skill to generate a structured 7-day video release plan (plus long-form video compilation details) for POLYRIZZEMS in response to a topic or prompt.

## Content & Directory Structure

All video plans live in:
`apps/music/poly-rizzems/videos/plan/week-<N>-<theme>/`

Where:
- `<N>` is the week number (e.g., `1`, `2`, `11`, `22`).
- `<theme>` is a concise kebab-case descriptor (e.g., `basics`, `multiples`, `mozart`, `rock`, `collier-chords`).

Inside each week folder, generate exactly 7 markdown files corresponding to the 7 daily YouTube Shorts:
- `1-<title-slug>.md`
- `2-<title-slug>.md`
- `3-<title-slug>.md`
- `4-<title-slug>.md`
- `5-<title-slug>.md`
- `6-<title-slug>.md`
- `7-<title-slug>.md`

The first character of the filename MUST be the 1-indexed order integer (1 to 7), followed by a dash and the title slug.

Always include a `0-overview.md` for the week summarizing the schedule, the long-form compiled video structure, and a **`## Testing`** section listing the direct browser preview URLs for each day's spec (`http://localhost:5173/apps/music/poly-rizzems/index.html?render=1&spec=<spec-name>&play=1`).

### Ideas Bank & Lifecycle Structure

Campaign ideas are developed and stored in:
`apps/music/poly-rizzems/videos/plan/ideas/`

- `ideas/<NN>-<theme-slug>.md`: Candidate ideas awaiting review.
- `ideas/approved/`: Reviewed ideas approved for week plan expansion.
- `ideas/rejected/`: Ideas discarded or set aside.

---

## Duplicate Checking & Idea Generation Rules

Whenever a new idea or campaign plan is created:

1. **Inventory Scan**:
   - Scan all files in `apps/music/poly-rizzems/videos/plan/ideas/` (including `approved/` and `rejected/`) and existing `week-*` plan directories.
2. **Deduplication Audit**:
   - **Rhythmic Ratios**: Check that the proposed polyrhythmic collisions (e.g., 3:5, 5:7, 7:11) are not redundant with an existing week's core focus.
   - **Harmonic Theme**: Ensure the chord progressions and stylistic theme (e.g., Fibonacci, Neo-Soul, Math Rock) do not duplicate existing plans.
   - **Threshold**: If a candidate overlaps by >70% in concept or ratio combination with a previously generated idea/plan, modify or pivot the proposal before saving.
3. **Filing & Transition**:
   - Save new ideas to `ideas/<NN>-<theme-slug>.md`.
   - Upon user approval, move the idea to `ideas/approved/`.
   - If discarded by user review, move to `ideas/rejected/`.

---

## Plan Markdown Format

Each `N-<title-slug>.md` file must be a complete blueprint containing:

1. **Frontmatter / Header**:
   - Title
   - Day Number (1–7)
   - Week & Theme
   - Target Spec Name (e.g., `week1-day1-3vs4`)

2. **Musical Concept**:
   - **Chord / Harmony**: Chords, extensions, natural note voicings (C3–C6).
   - **Rhythmic Families**: Binary (2,4,8,16), Ternary (3,6,12), Quinary (5,10), etc.
   - **Voicing Strategy**: Ascending pitch mapped to ascending signature speed.
   - **Arc Timeline**: Entry & exit of lanes (bars, order of arrival/departure, final silent bar).

3. **Spec Outline**:
   - Target JSON spec draft or key configuration parameters (`bars`, `barDuration`, `rhythms`, `events`).

4. **YouTube Shorts Metadata** (For YouTube Studio / Automated Uploaders):
   - **Shorts Title**: Clean, declarative, professional title (e.g. `<Ratio / Concept> Polyrhythm - POLYRIZZEMS #shorts`). Avoid clickbait or question titles unless specifically requested.
   - **Shorts Description**:
     - Concise 1–2 sentence description of the harmonic & polyrhythmic interaction.
     - 🕹️ Direct interactive playback link: `https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=<spec-name>&play=1`
     - 🎹 Builder link: `https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html`
     - Core hashtags: `#polyrhythm #musictheory #polyrizzems #music #shorts` (plus any specific tag like `#hemiola` or `#oddmeter`).

5. **Long-Form Video Compilation Notes**:
   - Timestamp title for the 7-in-1 long-form YouTube video.
   - On-screen transition text or musical bridge explanation.

---

## Workflow for Generating a Plan

When the user asks to plan a week of videos:

1. **Check Ideas Bank & Perform Duplicate Audit**:
   - Select an idea from `ideas/approved/` or input prompt, verifying it passes duplicate checks against existing weeks.
2. **Identify Week Number & Theme**:
   - Parse or ask for the week number and theme keyword (e.g., `week-1-basics`, `week-3-jazz-chords`).
3. **Design 7 Concept Arc**:
   - Ensure a cohesive progression over the 7 days:
     - Day 1: Simple entry / foundational polyrhythm of the theme.
     - Days 2–5: Exploring variations, richer voicings, contrasting families.
     - Day 6: High complexity or unexpected harmonic rub.
     - Day 7: Climax / Master polyrhythm combining multiple concepts.
4. **Generate the 7 `.md` files**:
   - Write each file into `apps/music/poly-rizzems/videos/plan/week-<N>-<theme>/`.
5. **Cross-Reference `polyrizzems-video`**:
   - Ensure all voicings follow POLYRIZZEMS house rules: natural notes C3–C6 only, no manual volume/expression (derive via normaliser), 2 bars of signature 1 tempo setup, arc build-and-unwind, targeting ~1-minute runtime (55s–60s) for Shorts.
   - **Duplicate Signatures**: Duplicate time signatures (e.g. two 1s, two 5s) playing distinct pitches are fully valid and supported (especially for thematic digit sequences, chord inversions, and multi-octave layers).
   - **Single-Lane Entry Pacing**: Introduce lanes one by one (avoid adding multiple lanes simultaneously at the same bar unless explicitly intended as a simultaneous chord drop). For longer lane arrangements (7–10 lanes), 1-bar entry steps keep the arc within the 55s–60s Shorts ceiling.
   - **Mathematical / Series Continuity**: When sonifying constants or numerical series, include all sequential significant digits without deduplication, and truncate at an exact non-rounded terminal digit.
