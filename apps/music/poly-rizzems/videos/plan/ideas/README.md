# PolyPals Video Campaign Ideas Bank

This directory contains weekly campaign theme ideas for PolyPals video releases. Each `.md` file represents a unique thematic concept that can be passed into the `polypals-plan` skill to expand into a complete 7-day YouTube Shorts campaign (plus long-form compilation).

## Directory Structure

```text
apps/music/poly-pals/videos/plan/ideas/
├── 01-fibonacci-grooves.md       # Candidate ideas in root directory
├── 02-prime-time.md
├── ...
├── approved/                     # Reviewed and approved ideas ready for planning
└── rejected/                     # Discarded or non-viable ideas
```

## Idea Lifecycle & Workflow

1. **Generation & Duplicate Check**:
   - Every newly created idea MUST be checked against all existing files in `ideas/` (root, `approved/`, and `rejected/`) as well as existing `week-N-*` folders to ensure it does not duplicate rhythmic ratio combinations or harmonic concepts.
2. **Review & Classification**:
   - **Approved**: Move the idea `.md` file into `approved/` when ready to be turned into a 7-day video campaign.
   - **Rejected**: Move the idea `.md` file into `rejected/` if it fails constraints or is discarded.
3. **Execution**:
   - Use the `polypals-plan` skill with an approved idea file to generate the 7 ordered daily plan files in `apps/music/poly-pals/videos/plan/week-<N>-<theme>/`.

## Idea File Format Guidelines

Each idea file should outline:
- **Title & Theme Slug**
- **Core Musical Concept & Harmonic Palette** (Natural notes C3–C6 only)
- **Primary Rhythmic Families & Polyrhythmic Ratios** (Signatures 2–19)
- **7-Day Progression Arc Overview**
- **YouTube Shorts Hook & Target Audience Strategy**
