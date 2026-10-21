# Licensing and rights

## Recorded facts

| Item | Source in repository | Status |
|---|---|---|
| NIRMAN six UI PNGs | `generate-screenshots.js` → sharp → PNG from SVG strings | **Owned but misrepresented**; not a licence problem, an accuracy problem |
| NIRMAN avatars | `fetch-avatars.js` downloads `og:image` / alphaCoders URLs | **No licence.** Must not ship |
| Rakshbandhan fonts | `app/fonts/*.woff2` (Kalam, Oswald, Space Mono) | Believed OFL; **verify the licence file for each** |
| Verde fonts | `@fontsource` packages (DM Sans, Manrope, Oswald, IBM Plex Mono) | Package licences apply; verify at install |
| SkillVerse fonts | various `@fontsource` | Same |
| Sound (if used) | none in repositories | Must be licensed or synthesised; record source |

## Rules for the portfolio

1. **Every asset gets a row** in this file before it is used: source, licence, attribution requirement, permission scope.
2. **No scraped imagery.** If it was downloaded by a script from a page, it is not licensed for reuse.
3. **Fonts:** prefer SIL OFL families; keep the licence text in the repository; subset where possible.
4. **Icons:** one set, licensed; do not mix.
5. **Screenshots:** captured from a real build, with the date and commit recorded in the filename or caption.
6. **Illustrations:** if generated for the site, label them as illustrations, never as product evidence.
7. **Music:** a licence that covers web use, with the credit line required by the licence.
8. **AI-generated imagery:** avoid for anything that claims to depict reality. Permitted for abstract texture only, and disclosed.

## The test

Would the rights holder recognise their asset and be content with how it is used and credited? If the answer is uncertain, the asset does not ship.

## Immediate actions before any build

- Replace or remove the NIRMAN avatars.
- Re-capture the six UI images from a running app, or caption them as illustrations.
- Confirm each font licence; delete any without one.
