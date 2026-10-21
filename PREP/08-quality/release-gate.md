# Release gate

Nothing is published until every line is true. The list is ordered by how expensive the failure is.

## Blocking

1. **Claims.** `node tools/claims/validate.mjs` passes; every public sentence traces to a ledger entry; no `X` entry appears publicly.
2. **Attribution.** VERDE credits Aarav Choudhary for hardware; SKILLVERSE states that individual contributions are not itemised; AI assistance is disclosed.
3. **Consent.** RAKSHABANDHAN is not published, referenced in detail, or linked without the subject's sister's explicit consent.
4. **Assets.** Every image, font, sound and screenshot has a recorded source and licence (`../09-assets/licensing.md`).
5. **Privacy.** No raw survey rows, no free-text answers, no identifiers, no credentials, no real API keys, no personal addresses.
6. **Accessibility procedure.** Keyboard, screen reader, reduced motion and zoom passes completed; scope and gaps recorded honestly.
7. **Performance.** Budgets measured on a real device with the method written down.
8. **Bugs.** No console errors on any route; no hydration warnings; no broken internal links.
9. **Placeholders.** `node tools/quality/audit.mjs` returns zero findings.
10. **Rollback.** A previous working deployment exists and can be restored in under five minutes.

## Non-blocking, but recorded

- Lighthouse scores (report them, do not chase a number).
- Cross-browser matrix beyond the tested set.
- Optional experiments (sound, instruments) — they ship only if they pass the same gate.

## The final read

Three people who have never seen the site are asked, separately:

1. What does this person do?
2. What is one thing they might build next?
3. What did you not believe?

Question 3 is the release gate's real test. If a viewer doubts a claim, the claim is not ready — regardless of the checklist.
