# Typography and colour research

## Measured, not asserted

Colour pairs were checked with `tools/design/contrast.mjs` against WCAG 2.1 thresholds. Two pairs failed on the first run and were changed. Full output is in `palettes.json`; current state: **13 pairs, 0 failures**.

| Palette | Pair | Ratio | Requirement |
|---|---|---|---|
| Ledger | ink `#14110F` on paper `#F4F1EA` | 16.67:1 | AA body |
| Ledger | grey `#6E675C` on paper (was `#8C8478`, 3.27:1 — failed) | 4.95:1 | AA body |
| Ledger | stamp `#B3261E` on paper | 5.79:1 | AA body |
| Threshold | bone `#E8DCC8` on void `#0B0908` | 14.67:1 | AA body |
| Threshold | lamp `#C97B3C` on void | 6.04:1 | AA body |
| Threshold | dust `#6B5E52` on void | 3.17:1 | AA large / non-text |
| Instrument | graphite `#161616` on bench `#F2EFE9` | 15.77:1 | AA body |
| Instrument | signal text `#B23A16` on bench (orange failed at 3.21:1) | 5.21:1 | AA body |
| Instrument | graphite on orange fill | 4.91:1 | AA body |

## What the failures taught us

The orange that looked right was 3.21:1 — fine as a fill, unusable for a label. The fix was not to abandon the colour but to **split its role**: `#E4572E` fills, `#B23A16` writes. That is the kind of decision a palette documented by eye never records, and the reason the checker exists.

The grey failure is the more common one: secondary text that looks "muted and tasteful" is usually below 4.5:1. Darkening it to `#6E675C` preserved the hierarchy and made it readable.

## Typeface candidates (all SIL Open Font License — verify at build time)

| Direction | Reading / body | Display | Metadata | Why |
|---|---|---|---|---|
| A. Ledger | Newsreader | — (use Newsreader at display sizes) | IBM Plex Mono | A text face with real italics and a bookish register. No second display face — authority through restraint. |
| B. Threshold | Public Sans | Fraunces | IBM Plex Mono | Fraunces' soft serifs read as lamplight, not luxury. Public Sans is quiet; it never competes with the light. |
| C. Instrument | Space Grotesk | Archivo Narrow | IBM Plex Mono | Grotesk reads as machined parts; the condensed face labels stations like equipment. Mono for readouts is literal and honest. |

### Rules that apply to all three

- **Two families maximum in production**, plus one mono. More is a costume change, not a system.
- **One type scale, defined in `rem`, with a documented ratio** (1.25 for A, 1.333 for B, 1.2 for C).
- **Measure**: 60–72 characters for body; never full-bleed paragraphs.
- **No letter-spaced all-caps for long text** — reserve tracking for short labels.
- **Numbers must be tabular** wherever they sit in a column or animate.

## Colour discipline

- One accent per direction, used for **state** only. If an accent is used for decoration, it stops meaning anything when it marks a real change.
- No gradients. If a gradient appears (Threshold's light beam), it must be the *only* one and must correspond to a physical light source.
- Dark does not mean black. `#0B0908` is warmer and photographs better than `#000000`.

## Fonts and honesty

Typography is the cheapest way to look expensive and the fastest way to look generic. The rule: **choose faces whose metrics you will actually use** — if the site does not need small caps, ligatures, or a display weight, do not pick a face for them.
