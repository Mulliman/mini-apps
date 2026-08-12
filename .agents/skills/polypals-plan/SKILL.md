---
name: polypals-plan
description: Plan a 7-day YouTube Shorts campaign and compiled long-form video for PolyPals under apps/music/poly-pals/videos/plan/week-N-<theme>/ from a prompt. Generates 7 ordered markdown files (1-title.md to 7-title.md) with complete spec parameters, musical voicings, and YouTube automation metadata.
---

# PolyPals Video Planning (`polypals-plan`)

Use this skill to generate a structured 7-day video release plan (plus long-form video compilation details) for PolyPals in response to a topic or prompt.

## Content & Directory Structure

All video plans live in:
`apps/music/poly-pals/videos/plan/week-<N>-<theme>/`

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

Optionally, include a `0-overview.md` for the week summarizing the long-form compiled video structure and schedule.

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

4. **YouTube Shorts Metadata** (For Automated Uploaders):
   - **Shorts Title** (Punchy, hook-driven, under 60 chars)
   - **Shorts Description & Hashtags** (`#polyrhythm #music #poly-pals #shorts`)
   - **Pinned Comment** (Engagement prompt)

5. **Long-Form Video Compilation Notes**:
   - Timestamp title for the 7-in-1 long-form YouTube video.
   - On-screen transition text or musical bridge explanation.

---

## Workflow for Generating a Plan

When the user asks to plan a week of videos:

1. **Identify Week Number & Theme**:
   - Parse or ask for the week number and theme keyword (e.g., `week-1-basics`, `week-3-jazz-chords`).
2. **Design 7 Concept Arc**:
   - Ensure a cohesive progression over the 7 days:
     - Day 1: Simple entry / foundational polyrhythm of the theme.
     - Days 2–5: Exploring variations, richer voicings, contrasting families.
     - Day 6: High complexity or unexpected harmonic rub.
     - Day 7: Climax / Master polyrhythm combining multiple concepts.
3. **Generate the 7 `.md` files**:
   - Write each file into `apps/music/poly-pals/videos/plan/week-<N>-<theme>/`.
4. **Cross-Reference `polypals-video`**:
   - Ensure all voicings follow PolyPals house rules: natural notes C3–C6 only, no manual volume/expression (derive via normaliser), arc build-and-unwind, under 60s runtime.
