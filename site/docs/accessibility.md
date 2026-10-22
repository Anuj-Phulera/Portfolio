# Accessibility

## Designed in

- Skip link first in the DOM.
- One `h1` per page; heading order checked by script.
- Receipts and lab notes are native `<details>`, so they work with JavaScript
  off, are keyboard operable, and are announced as expandable.
- All controls are buttons or inputs with visible labels. No icon-only control.
- Focus is visible on every interactive element: 2px steel outline, 3px offset.
- Status is never carried by colour alone: each stamp has a distinct border,
  fill or strike, and the word is always written out.
- Reduced motion is a path, not a switch: durations are tokens that go to zero,
  the mode engine starts static instead of idling, and no content changes.
- Touch targets: instrument buttons are at least 2.4rem tall; receipt summaries
  and lab-note summaries are at least 2.5rem.
- Print is a supported path: receipts stay closed but readable, controls and
  navigation are removed, external links print their URLs.

## Checked by script

`tools/quality/a11y-tree.mjs` runs the static rules in `a11y-static.mjs` over all
12 built pages: lang, title, one `h1`, heading order, image alt, button names,
empty links. Current result: **0 findings**.

That is not a conformance test. It cannot see contrast in context, focus order,
or what a screen reader actually says.

## Not checked

- No browser and no assistive technology were available while this was built.
- Contrast ratios are measured for the palette
  (`tools/design/contrast.mjs`, 13 pairs, 0 failures), but not for every
  rendered combination. Notably, text over the interlude band and over the
  cloth texture has not been measured as rendered.
- Keyboard traversal has been reasoned about and tested in jsdom (focus events
  drive the mode engine), but not walked in a real browser.
- Zoom, reflow at 400%, and forced-colours mode are untested.

These gaps are listed on the colophon page rather than discovered by a visitor.
