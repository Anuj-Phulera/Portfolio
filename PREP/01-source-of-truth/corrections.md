# Corrections required before any public claim

These are not suggestions. Each row is a statement currently contradicted by evidence, and the action required to make it true.

| # | Where | Current text | Reality | Action |
|---|---|---|---|---|
| C1 | `Verde-CBSE` README + badges | "Three.js 0.162", "Interactive Three.js background" | No `three` dependency; `NeuralField` is 2D canvas, by design | Rewrite as "custom 2D canvas field". Do not add three.js to make the README true. |
| C2 | `Verde-CBSE` live site | Telemetry presented as live | `Math.random()` in `api/telemetry` | Add a visible `SIMULATED` state, or feed it real data. |
| C3 | `Nirmaan-Portfolio-` README | "18-second Genesis loader" | 4500 ms in every commit | Delete the number or change it to 4.5 s. |
| C4 | `Nirmaan-Portfolio-` README | "`prefers-reduced-motion` fallbacks" | Phrase exists only in the README | Either implement it, or remove the sentence and record it as unfinished. |
| C5 | `Nirmaan-Portfolio-` UI | `VERDE_OS`, "Chlorophyll meets silicon", `0xVERDE_RESONATE_CORE` | Belongs to another project | Remove. |
| C6 | `nirmaan-app` README | "India's First AI-Powered E-Waste Management Platform" | Unfalsifiable | Replace with a factual descriptor. |
| C7 | `S2S` README | "WCAG AA compliant" badge | No audit, no automated check | Remove the badge until an audit is run and its scope documented. |
| C8 | `Rakshbandhan` repo | `.next/cache` committed, 121 MB | Build cache in version control | Add `.next/` to `.gitignore`; stop tracking the directory in a future, separately authorised operation. |
| C9 | `Resonate-Portfolio` | Claimed as a platform | Never deployed, no README | Add a README with status: "unshipped experiment, shaders included". |
| C10 | Profile README | Eight repository links | Several pointed to repos that did not exist at the time | Verify each link resolves before publication. |

| C11 | `PREP/02-claims/ledger.json` CLM-016 | "261 survey responses" | The file parses to 255 records from 254 respondents; the 262 figure was a line count, and eight free-text answers contain line breaks | Record CLM-035 with the re-derived count and its method. Leave CLM-016 in place as the record of what was believed on 21 October. |
| C12 | `Resonate-Portfolio` shaders | "Three custom ... shader pairs", and the site's "real source, not stock effects" | 76 of 189 code lines are Ashima Arts / Stefan Gustavson's MIT-licensed `webgl-noise`, with no attribution in the source. `neural.frag` and `singularity.frag` are 88% identical. `singularity.vert` defines `permute` and `taylorInvSqrt` and calls neither, under a header claiming simplex and curl noise. | Downgrade CLM-020 from verified to partial, record CLM-036 with the measured breakdown. Restore the MIT notice in both vertex shaders and delete the two dead helpers. Do not describe the noise as original while using it. |


## Principle for the fixes

Correct the **claim**, not the code. Do not add three.js to protect a badge; do not invent an 18-second loader to justify a sentence. The honest direction is always cheaper and always better.

## Note on C1

The code comment in `NeuralField.tsx` — *"Pure canvas: no shaders, no WebGL context stolen from the product scenes"* — is a better story than the false one. **The reasoning is the interesting part; the badge is the part that lies.** This is the general shape of every correction in this file.
