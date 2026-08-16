# Day 7: The Circle Constant ($\tau = 6.2831853$)

- **Week**: 3 (Mathematical Constants)
- **Order**: 7
- **Target Spec Name**: `week3-day7-tau`

---

## 1. Musical Concept

- **Mathematical Constant**: Tau $\tau = 2\pi = 6.2831853$ (The True Circle Constant)
- **Decimal Digits Mapped**: `6, 2, 8, 3, 1, 8, 5, 3` (8 sequential significant digits without deduplication)
- **Harmonic Palette**: G Major 9 / Circular Double Resonance (`G3, D4, G4, B4, D5, E5, G5, B5`)
- **Special Feature**: Bookends the week with Day 1's $\pi$, posing the famous question: *"Is Tau the true circle rhythm?"*
- **Voicing Allocation**:
  - `6`: `G3` (Opening Digit 6. — Bass Root)
  - `2`: `D4` (1st Decimal Digit .2 — Fifth)
  - `8`: `G4` (2nd Decimal Digit .28 — Root Octave)
  - `3`: `B4` (3rd Decimal Digit .283 — Major Third)
  - `1`: `D5` (4th Decimal Digit .2831 — Fifth Octave)
  - `8`: `E5` (5th Decimal Digit .28318 — Sixth / Thirteenth)
  - `5`: `G5` (6th Decimal Digit .283185 — High Root)
  - `3`: `B5` (7th Decimal Digit .2831853 — High Third Shimmer)

### Arc Timeline (~58.5s Runtime, `barDuration: 2.25s`)
- **Bars 0–1**: Solo Digit `6` (`G3`) — Sets the master 6-beat tempo cycle (2 bars)
- **Bar 2**: Enter `2` (`D4`) — $\tau = 6.2$
- **Bar 3**: Enter `8` (`G4`) — $\tau = 6.28$ (The core Tau $\approx 6.28$)
- **Bar 4**: Enter `3` (`B4`) — $\tau = 6.283$
- **Bar 5**: Enter `1` (`D5`) — $\tau = 6.2831$
- **Bar 6**: Enter `8` (`E5`) — $\tau = 6.28318$
- **Bar 7**: Enter `5` (`G5`) — $\tau = 6.283185$
- **Bar 8**: Enter `3` (`B5`) — Full 8-digit Tau constellation ($6.2831853$)!
- **Bars 8–18 (10 bars)**: Hold the complete 8-lane Tau constellation
- **Bars 18–25**: Reverse unwind one lane per bar (`3`, `5`, `8`, `1`, `3`, `8`, `2`, `6`)
- **Bars 25–26**: Silent closing bar (End at Bar 26)

---

## 2. Spec Draft (`public/specs/week3-day7-tau.json`)

```jsonc
{
  "name": "The Circle Constant (tau = 6.2831853)",
  "title": "The Circle Constant (τ = 6.2831853)",
  "bars": 26,
  "barDuration": 2.25,
  "rhythms": [
    { "id": "tau-6a", "timeSignature": 6, "noteName": "G3" }
  ],
  "events": [
    { "at": 2, "type": "add", "rhythm": { "id": "tau-2", "timeSignature": 2, "noteName": "D4" } },
    { "at": 3, "type": "add", "rhythm": { "id": "tau-8a", "timeSignature": 8, "noteName": "G4" } },
    { "at": 4, "type": "add", "rhythm": { "id": "tau-3a", "timeSignature": 3, "noteName": "B4" } },
    { "at": 5, "type": "add", "rhythm": { "id": "tau-1", "timeSignature": 1, "noteName": "D5" } },
    { "at": 6, "type": "add", "rhythm": { "id": "tau-8b", "timeSignature": 8, "noteName": "E5" } },
    { "at": 7, "type": "add", "rhythm": { "id": "tau-5", "timeSignature": 5, "noteName": "G5" } },
    { "at": 8, "type": "add", "rhythm": { "id": "tau-3b", "timeSignature": 3, "noteName": "B5" } },
    { "at": 18, "type": "remove", "id": "tau-3b" },
    { "at": 19, "type": "remove", "id": "tau-5" },
    { "at": 20, "type": "remove", "id": "tau-8b" },
    { "at": 21, "type": "remove", "id": "tau-1" },
    { "at": 22, "type": "remove", "id": "tau-3a" },
    { "at": 23, "type": "remove", "id": "tau-8a" },
    { "at": 24, "type": "remove", "id": "tau-2" },
    { "at": 25, "type": "remove", "id": "tau-6a" }
  ]
}
```

---

## 3. YouTube Shorts Metadata (Automation)

- **Title**: What happens when you turn Tau into a polyrhythm? (6.2831853) - POLYRIZZEMS #shorts
- **Description**:
  The Circle Constant Tau $\tau = 2\pi$ (6.2831853) transformed into an 8-lane sequential polyrhythm in G Major 9. Is Tau the true circle rhythm?

  🕹️ Play this rhythm in your browser:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html?render=1&spec=week3-day7-tau&play=1

  🎹 Build & experiment with your own polyrhythms:
  https://miniapps.sammullins.co.uk/apps/music/poly-rizzems/index.html

  #polyrhythm #musictheory #polyrizzems #tau #math #shorts

---

## 4. Long-Form Compilation Notes

- **Timestamp**: `5:57 - 6:57`
- **Transition Title**: Day 7: The Circle Constant ($\tau = 6.2831853$)
