# Shuffle Bus

A colour-matching bus puzzle for young children.

## How it works

- Tap a bus on the grid. If the path from that bus to the edge of the grid
  (in the direction its arrow points) is completely clear, it drives off
  into an empty bay.
- Passengers wait in a fixed FIFO queue. The passenger at the front of the
  queue boards any bay bus that matches their colour.
- When a bay bus is full, it departs and frees up that bay.
- Clear the grid, empty every bay, and empty the queue to win.

## Running it

This app is deliberately a **zero-dependency, zero-build, single-file**
vanilla app — everything (markup, styles, and game logic) lives in one
`index.html` with inline `<style>` and `<script>` tags. There is no React,
no Vite, and no npm dependencies.

- **Play it directly:** just double-click `index.html` and it runs straight
  from `file://` in your browser.
- **Produce a `dist/` build** (for the monorepo's combined deploy output):
  ```bash
  pnpm --filter @miniapps/shuffle-bus run build
  ```
  This copies `index.html` into `dist/index.html` unchanged.

## Difficulty tiers

- **Easy** — 6x6 grid
- **Medium** — 8x8 grid
- **Hard** — 10x10 grid
