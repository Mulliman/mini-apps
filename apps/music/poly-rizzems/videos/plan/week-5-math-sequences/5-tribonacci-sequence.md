# Day 5: Tribonacci Sequence (3-Step Recursive Matrix)

- **Week**: 5 (Famous Math Sequences)
- **Order**: 5
- **Target Spec Name**: `week5-day5-tribonacci`

---

## 1. Musical Concept

- **Mathematical Sequence**: Tribonacci Sequence ($T_n = T_{n-1} + T_{n-2} + T_{n-3} = 1, 2, 4, 7, 13$)
- **Signatures Mapped**: `1, 2, 4, 7, 13` (5 lanes combining binary powers with the angular odd-meter crunch of $7$ and $13$)
- **Harmonic Palette**: G Dominant 9 (`G3, D4, F4, B4, D5` — grounded recursive harmony)
- **Voicing Allocation**:
  - `1`: `G3` ($T_1 = 1$ — Bass Root Downbeat Pulse)
  - `2`: `D4` ($T_2 = 2$ — Perfect Fifth)
  - `4`: `F4` ($T_3 = 4$ — Dominant Seventh)
  - `7`: `B4` ($T_4 = 7$ — Major Third)
  - `13`: `D5` ($T_5 = 13$ — Fifth Octave, softened shimmer at volume 0.36)

### Arc Timeline (~57.75s Runtime, `barDuration: 2.75s`)
- **Bars 0–1**: Solo Signature `1` (`G3`) — Sets the tempo and master bar cycle (2 bars)
- **Bar 2**: Enter `2` (`D4`) — $1:2$ Binary ground
- **Bar 4**: Enter `4` (`F4`) — $2:4$ Dominant groove
- **Bar 6**: Enter `7` (`B4`) — The $4:7$ Tribonacci cross-rhythm erupts
- **Bar 8**: Enter `13` (`D5`) — Full Tribonacci matrix active ($1, 2, 4, 7, 13$)!
- **Bars 8–16 (8 bars)**: Peak hold of the 3-step recursive polyrhythmic matrix
- **Bars 16–20 (4 bars)**: Reverse unwind one lane per bar (`13`, `7`, `4`, `2`, `1`)
- **Bars 20–21 (1 bar)**: Silent closing bar (End at Bar 21)

---

## 2. Spec Draft (`public/specs/week5-day5-tribonacci.json`)

```jsonc
{
  "name": "Tribonacci Sequence (1, 2, 4, 7, 13)",
  "title": "Tribonacci Sequence",
  "description": "The Tribonacci sequence (1, 2, 4, 7, 13) sonified into a 3-step recursive polyrhythm in G Dominant 9. When Fibonacci's cousin adds the previous THREE numbers.",
  "bars": 21,
  "barDuration": 2.75,
  "rhythms": [
    { "id": "trib-1", "timeSignature": 1, "noteName": "G3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "trib-2", "timeSignature": 2, "noteName": "D4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "trib-4", "timeSignature": 4, "noteName": "F4" } },
    { "at": 6, "type": "add", "rhythm": { "id": "trib-7", "timeSignature": 7, "noteName": "B4" } },
    { "at": 8, "type": "add", "rhythm": { "id": "trib-13", "timeSignature": 13, "noteName": "D5", "volume": 0.36 } },
    { "at": 16, "type": "remove", "id": "trib-13" },
    { "at": 17, "type": "remove", "id": "trib-7" },
    { "at": 18, "type": "remove", "id": "trib-4" },
    { "at": 19, "type": "remove", "id": "trib-2" },
    { "at": 20, "type": "remove", "id": "trib-1" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: The Tribonacci Sequence as a Polyrhythm (1, 2, 4, 7, 13) - POLYRIZZEMS #shorts
- **Description**:
  The Tribonacci sequence (1, 2, 4, 7, 13) sonified into a 3-step recursive polyrhythm in G Dominant 9. When Fibonacci's cousin adds the previous THREE numbers.

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week5-day5-tribonacci&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #tribonacci #maths #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `3:51 - 4:49`
- **Transition Title**: Day 5: Tribonacci Sequence ($1, 2, 4, 7, 13$)
