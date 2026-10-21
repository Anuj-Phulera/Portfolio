# Motion lab — findings

**Run:** `node --test test/*.test.mjs` from this folder · **32 tests, 32 passing** (2026-10-21, Node 22.22.3).

## What was actually built

| Module | Question it answers |
|---|---|
| `lib/pacing.mjs` | Can a sequence enforce authored holds and cuts, and reject accidental timing? |
| `lib/classify.mjs` | What does a trustworthy adaptive interface require before it changes? |
| `lib/reveal.mjs` | Can content arrive once and never disappear? |
| `lib/motion-tokens.mjs` | Can motion be removed without breaking layout or meaning? |
| `lib/audio-consent.mjs` | Can sound be structurally impossible before a gesture? |
| `lib/split-text.mjs` | Can type animate without fragmenting what a screen reader reads? |

Three browser demos in `demos/` render these modules. They are lab instruments, not portfolio pages.

## Findings that changed the design

**1. Normalised scores make thresholds meaningless.**
The first classifier normalised paradigm scores to sum to 1. With six options, no winner could ever reach a 0.65 confidence threshold, so the engine would never act. Fixed by keeping raw comparable strengths and defining eligibility as *winner ≥ 0.65 and margin ≥ 0.15*. The test suite caught this, not review.

**2. Ambiguity must be a refusal, not a guess.**
Maximum speed plus maximum clicking produces two nearly tied paradigms (mosaic 0.95 vs console 0.77 in one fixture; 1.00 vs 0.95 in another). The guard refuses with *"not enough evidence"*. This is the behaviour that makes adaptation trustworthy — and it is now a test, so it cannot regress silently.

**3. A cut is a duration, not a style.**
Anything ≤ 200 ms reads as a cut; 200–1200 ms is a dissolve; beyond that it is a transition that will feel like lag. Encoding this in `pacing.mjs` means a future component cannot "accidentally" use a 600 ms fade between scenes and call it a cut.

**4. Reveals must be idempotent.**
The naive version — re-animate when an element re-enters — makes a page feel like it is constantly arriving. The state machine reveals once and never hides read content. A reader scrolling back up sees the page, not an animation.

**5. Accessible text is a structural problem, not a runtime one.**
`splitText` emits the visible split as `aria-hidden` plus one screen-reader copy of the full sentence. Without this, a word-by-word animation announces fragments. The test asserts the full sentence exists exactly once.

**6. Audio consent belongs in the architecture.**
The gate cannot create an `AudioContext`. It only reports whether sound is allowed; the caller creates the context inside a gesture handler. That makes autoplay a compile-time impossibility rather than a code-review promise.

## What was **not** measured

- **Perceived quality.** No browser is installed in this environment. Nothing here was watched, only executed.
- **Frame timing on real devices.** No profiler, no throttling, no mid-range phone.
- **Comprehension.** Whether a 700 ms hold improves understanding requires a user study; no such study was run. The timing defaults are craft judgments, clearly labelled as such.
- **Sound.** The oscillator in `demos/sound.html` was never heard here.

## Recommendation to the build phase

Start with **no animation library at all**. The six modules above are dependency-free and cover pacing, reveals, tokens, audio consent and accessible text. Add GSAP or Motion only for a sequence this baseline cannot express — and record which sequence, and why, in the decision log.

That is the inverse of the usual approach, and it is the only one consistent with the audit: build the constraint first, then earn the dependency.
