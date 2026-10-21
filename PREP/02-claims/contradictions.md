# Contradictions register

Every claim currently contradicted by evidence, with the cheapest honest fix. Cross-referenced to `../01-source-of-truth/corrections.md`.

| Ledger | Claim | Contradiction | Fix | Effort |
|---|---|---|---|---|
| CLM-002 | "Interactive Three.js background" | No `three` dependency; 2D canvas by design | Rewrite the sentence | 5 min |
| CLM-003 | "Live sensor telemetry" | `Math.random()` in `api/telemetry` | Add a visible `SIMULATED` state | 1 h |
| CLM-010 | "India's first AI-powered e-waste platform" | Unfalsifiable | Replace with factual descriptor | 5 min |
| CLM-011 | "18-second Genesis loader" | 4500 ms in all thirteen commits | Correct to 4.5 s | 2 min |
| CLM-012 | "reduced-motion fallbacks" | Phrase exists only in README | Implement or delete | 1 h / 2 min |
| CLM-017 | "WCAG AA compliant" | No audit, no test | Remove badge; run audit later | 2 min + audit |
| CLM-021 | RESONATE "cinematic platform" | Never deployed | Label as unshipped experiment | 10 min |
| CLM-032 | Profile links eight projects | All eight 404 on the new account | Repoint links to the old account or migrate repos | 20 min |

## What the register proves

Seven of eight fixes are copy edits. The expensive ones (simulated telemetry labelling, reduced motion) are small engineering tasks. **Nothing here requires rebuilding a project.** The credibility gap was never a technical problem; it was an editorial one, and it is cheaper to close than to defend.

## Rule

No contradiction is closed by adding evidence to the code unless that evidence would be worth building anyway. Correct the sentence first. If the feature matters, build it later and upgrade the grade at that point.
