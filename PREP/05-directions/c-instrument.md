# Direction C — THE INSTRUMENT

*A workbench you can operate.*

## Rationale
The north star is *"wanting to know what this person could create next."* The most direct way to produce that feeling is to let the visitor **use something he made** and feel its quality in their hands. Direction C turns each project into a small, honest, operable instrument — not a case study, not a card. The claim "I build systems" becomes a thing you can try.

## Atmosphere
Daylight workshop. Warm off-white bench, graphite ink, signal orange, steel blue. Tools laid out with intent. The feeling is **curiosity plus competence** — the pleasure of a well-machined object.

## Narrative
The visitor arrives at a bench with several instruments on it. Each instrument is a working miniature of a real system: the STRATA mode engine on three sample objects, a farm dial that changes a *clearly simulated* moisture reading, a survey slicer over anonymised aggregates. A "LAB NOTE" panel beside each instrument states what is real, what is simplified, and what is mocked. The final station is a half-built instrument under a cloth: the next thing.

## Visual language
- **Palette:** `#F2EFE9` bench, `#161616` graphite, `#E4572E` signal orange (state), `#2F5D62` steel blue (links/secondary), `#C9C2B6` rule.
- **Type:** Space Grotesk (OFL) for labels and UI, IBM Plex Mono (OFL) for readouts and lab notes, a single condensed face for station titles (Archivo Narrow, OFL).
- **Composition:** asymmetric bench layout; instruments at different scales; generous empty bench space so each object reads as an object. Sticky lab-note card that never covers the control being used.
- **Material:** flat colour, hairline rules, one shadow model. No glass, no glow, no gradients.

## Navigation
A slim tool rail (not icons-only — labelled): Bench · Instruments · Notes · Index · Contact. Instruments are also reachable directly by URL. Keyboard: `1–5` selects instruments, `Tab` enters controls, `Esc` returns to the bench.

## Interaction patterns
- **Direct manipulation, not scroll theatre.** The visitor drags, toggles, and types; the response is immediate (<100 ms) and physically plausible.
- **State is visible.** Every instrument shows its inputs and its outputs, labelled.
- **No hidden mechanics.** A "?" on each instrument opens a 60-word explanation of the rule being demonstrated.

## The four instruments (minimum viable set)
1. **The Mode Engine** — three sample objects; the visitor's reading behaviour (speed, clicks, revisits) selects one of three layouts, with a visible read-out and a pin control. This is STRATA, honestly reduced.
2. **The Watering Dial** — a moisture threshold and a pump toggle; the readout is labelled `SIMULATED` and runs from a recorded fixture, not random numbers.
3. **The Survey Slicer** — anonymised aggregates from the 261 responses: choose a platform, see distributions. No free-text answers, no identifiers.
4. **The Unbuilt Thing** — a cloth-covered object that reveals a single truthful line: what is not finished and why.

## Signature interaction — the lab note
Every instrument can be turned over (a flip, 400 ms, 3D but shallow) to reveal its construction: the real file path, the commit, the simplification, and a link to the repository. The back of the object is the receipt. This is how credibility is delivered without a single claim in the copy.

## Motion
- Springs for direct manipulation (stiffness ~300, damping ~30), 60–180 ms.
- No cinematic transitions; the bench is the world, and objects move within it.
- Hover raises an object by 2 px and 1 shadow step — nothing more.
- Reduced motion: flip becomes a crossfade; springs become linear 120 ms; no parallax.

## Text storyboard (first 40 seconds)
1. **0.0s** — Off-white bench. One object already in motion, slowly idling: the mode engine cycling three layouts on its own, as a demonstration.
2. **1.0s** — A label fades in above it: *"BENCH 01 — SEVEN SYSTEMS, FOUR YOU CAN TOUCH."*
3. **3.0s** — The visitor moves the pointer; the object reacts. A lab-note tab becomes visible: *"What am I looking at?"*
4. **8.0s** — They grab a control. The layout changes. A readout says: `READ: SKIMMER 0.62 · MODE: MOSAIC · CONFIDENCE: HIGH`.
5. **12.0s** — A small label appears: `PIN THIS MODE` — the escape hatch, always visible.
6. **20.0s** — They flip the instrument. The back shows: `src/engine/decide.ts · 243 lines · commit e8795c8`.
7. **30.0s** — They look right: three more instruments on the bench, one under a cloth.

## What it is good at
- **Directly produces the north-star feeling**: after using the instruments, a visitor can imagine what the author would build next.
- Proof of capability without a single claim.
- Naturally differentiated: almost no portfolio lets you operate the work.
- Extends cleanly: add an instrument, add a station.

## Failure modes
- **Gimmick risk.** If the instruments are shallow toys, it reads as a demo reel.
- **Build cost.** Four real miniatures are four real products. This is the most expensive direction by far.
- **Performance.** Four interactive canvases on one page will melt a mid-range phone unless only one is live at a time.
- **Trivialisation.** A simplified farm dial can make a serious system look like a toy unless the lab note is honest.
- **Accessibility.** Every drag needs a keyboard equivalent and a numeric input fallback.

## What would make it generic
A grid of "interactive playground" cards with neon borders. The idea only works if each instrument is genuinely operable, genuinely labelled, and genuinely part of the argument — and if the bench composition feels like a place rather than a layout.
