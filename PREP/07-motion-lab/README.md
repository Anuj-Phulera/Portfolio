# Motion and interaction lab

**Experimental. Disposable. Not connected to any production application.**

Six dependency-free modules answering six design questions, 32 unit tests, and three browser demos.

```bash
cd PREP/07-motion-lab
npm test          # 32 tests, no dependencies required
npm run serve     # http://localhost:8080/demos/cuts.html
```

## Files

```
lib/pacing.mjs          authored holds and cuts; rejects accidental timing
lib/classify.mjs        adaptation guard: evidence, margin, cooldown, pin
lib/reveal.mjs          reveal-once state machine
lib/motion-tokens.mjs   central durations + reduced-motion resolver
lib/audio-consent.mjs   sound gate that requires a gesture
lib/split-text.mjs      animated text with one accessible copy
demos/*.html            browser demonstrations (no build step)
findings.md             what was learned, and what was not measured
```

## Rules

- No experiment ships unless it answers a question stated in its header.
- No dependency until the native baseline fails a test.
- Nothing here is imported by the eventual portfolio without a decision-log entry.
