# Direction A — THE LEDGER

*An archive of work, kept honestly.*

## Rationale
The audits found one consistent virtue in the subject's work: the numbers are exact. The Ledger turns that virtue into the interface. It is a portfolio that behaves like a well-kept record — dated entries, source notes, revisions, and a status stamp on everything. It is the only direction in which the subject's weaknesses (unfinished work, corrected claims) become structural features rather than liabilities.

## Atmosphere
Daylight. A reading room, not a cinema. Paper white, ink black, one stamp-red accent used sparingly for status. Quiet. The emotional effect is **trust**, and a slight surprise that a student built something this composed.

## Narrative
The visitor opens a record that begins with the present and moves backwards through the work, then forward into what is being built next. Each project is an entry with: what it is, what exists, what does not, who else built it, and what changed. The last page is a single dated line: *"Next entry: ______."*

## Visual language
- **Palette:** `#F4F1EA` paper, `#14110F` ink, `#8C8478` rule grey, `#B3261E` stamp red (status only, never decoration).
- **Type:** a text serif for reading (Newsreader or Source Serif 4, OFL), a mono for metadata (IBM Plex Mono, OFL), no display face. Headlines are set in the serif at reading sizes — authority comes from restraint.
- **Composition:** a wide outer margin used for marginalia; a single measured column; folio numbers; horizontal rules that behave like ledger lines.
- **Texture:** real paper grain at very low opacity, or none. No gradients.

## Navigation
A front index (like a book's contents) listing entries by date and status. Persistent margin rail showing where you are. No hidden menus. `J/K` and arrow keys move between entries; every entry has a URL.

## Signature interaction — the receipt
Any claim in an entry has a small superscript mark. Activating it (click, `Enter`, or focus + space) unfolds the evidence inline: a commit hash, a file path, a measurement, a recording, or the word **UNVERIFIED**. It is the same gesture everywhere, and it is the only "wow" the site needs.

## Status stamps
`BUILT` · `PARTIAL` · `UNBUILT` · `WITHDRAWN` — four stamps, one typographic treatment, applied to projects and to individual claims. Withdrawn work stays visible as a struck-through entry with a reason. This is the honest version of a project grid.

## Motion
- Page transitions: 180 ms crossfade with a 6 px rise. No parallax, no pinning.
- Receipts unfold in 220 ms with a height animation and a hairline draw.
- Type never animates word-by-word; it fades as a block, like print.
- Reduced motion: instant states, no fades.

## Text storyboard (first 40 seconds)
1. **0.0s** — Paper. One line, upper left: *"ANUJ PHULERA — A RECORD OF WORK, KEPT HONESTLY."* No animation.
2. **1.5s** — The line is joined by a date and a status: *"Entry 009 · 21 Oct 2026 · IN PROGRESS."*
3. **4s** — The index begins below, typeset like a contents page. Eight entries, four stamped.
4. **10s** — The visitor scrolls; the margin rail tracks position; a marginal note appears beside the first entry: *"This portfolio is the ninth project. It is being built in public."*
5. **25s** — They open an entry. It reads like a case study, with two superscripts visible.
6. **35s** — They activate a receipt. The evidence unfolds: `STRATA — 35 nodes, 79 edges — src/content/graph.ts — commit e8795c8`.

## What it is good at
- Credibility is structural, not asserted.
- Cheap to build, fast, accessible by default.
- Ages well; adding a project is writing an entry.
- The "unfinished" problem becomes the identity.

## Failure modes
- **Cold.** It may read as a documentation site with no pulse.
- **Undersells.** A visitor may not feel the ambition, only the discipline.
- **Weak on mobile if over-designed** — marginalia must collapse into inline notes, not disappear.
- **Generic if executed lazily:** "editorial minimal portfolio" is itself a genre.

## What would make it generic
Cream background, big serif, thin rules, and the word "selected work" — without the receipts and the status stamps, this is a template. The idea lives entirely in the evidence mechanics.
