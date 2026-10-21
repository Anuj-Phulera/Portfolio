# Implementation roadmap

Assumes a single builder working part-time. Durations are estimates, not commitments. **Nothing starts before the readiness criteria in `readiness-criteria.md` are met.**

## Stage 0 — Decisions (2–3 days)
- Choose a direction, or a dominant direction plus rules from the others.
- Answer blocking questions N1–N6 in `../09-assets/needed.md`.
- Lock the claims set that will be published; remove everything else.

**Exit:** a decision log with four signed entries and a one-page creative brief.

## Stage 1 — Vertical slice (5–7 days)
- Index + one project page, end to end, in the chosen direction.
- Real content for that project, corrected against the ledger.
- Reduced-motion path, keyboard pass, focus states, 404 and loading behaviour.
- Measured against the performance budget on a real phone.

**Exit:** a stranger can open the slice on a phone, understand one project, and name what the person might build next. If not, stop and fix the concept before adding pages.

## Stage 2 — Content production (5–7 days)
- Write the remaining project pages from `safe_wording` only.
- Capture real screens; correct every `X` claim's public copy.
- Produce the portrait decision (image or none) and the failure paragraphs.

**Exit:** all copy passes `tools/quality/audit.mjs` and every sentence has a ledger entry.

## Stage 3 — Second and third moments (7–10 days)
- Instrument two (watering dial, replay-labelled) **or** the second room, depending on direction.
- One scene transition, finished to the standard of the slice.
- Optional: sound gate, if it passes its own review.

**Exit:** two moments of genuine craft, not four of mediocrity.

## Stage 4 — Finish (3–5 days)
- Error boundaries, empty states, offline behaviour, print stylesheet if appropriate.
- Meta: title/description per route, OG images, favicon, sitemap, robots.
- Cross-browser and small-screen sweep.

**Exit:** the boring paths are as good as the showpiece.

## Stage 5 — Audit and release (3–4 days)
- Run the full test plan; record method and results.
- Three-person disbelief test.
- Deploy to a preview URL; verify with a second device and a second network.

**Exit:** every line of `release-gate.md` is true.

## Optional, after release
- A fourth instrument.
- Shader stills from RESONATE as an exhibit.
- A writing section, if the subject actually writes.
- Case-study depth for one project, if a specific reader asks for it.

## Explicitly out of scope for v1
- Accounts, comments, a CMS, analytics dashboards.
- A blog with a publishing cadence.
- Multiple languages.
- Motion on every section.

## The rule that protects the deadline

Each stage ships something usable. If a stage overruns by more than 50%, cut its optional half rather than borrowing from the next stage. A finished two-moment site beats an unfinished five-moment one — the same lesson the NIRMAN build demonstrated in public.
