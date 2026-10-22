# The browser pass

Everything below needs a person with a browser. None of it has been done, and the
site says so on its colophon page rather than implying otherwise. Run it once
before the site is shown to anyone, and record the date and the device.

A scripted pass is not a substitute: `a11y-tree.mjs` reads markup, it cannot see
focus order, and `site-budget.mjs` measures bytes, not frames.

## 1. First paint — phone, throttled

- [ ] Load the home page on a mid-range phone, or DevTools at "Slow 4G" + 4× CPU.
- [ ] Text is readable before the fonts land (fallback stack is system sans/mono).
- [ ] Nothing shifts vertically when the fonts swap in.
- [ ] The instrument is visible without scrolling on a 390 px wide screen.

## 2. The three instruments

- [ ] Mode engine: hover each object, then check that the read-out changes.
- [ ] Mode engine: click each of the three layout buttons; Mosaic must reflow to
      one column on a narrow screen.
- [ ] Mode engine: press Pin, then move the pointer away — the layout must not change.
- [ ] Dial: drag the threshold to 60. The pump read-out must read ON and the
      conditions line must say "31% is below 60%".
- [ ] Dial: switch to Manual, toggle the pump, confirm the line says "manual override".
- [ ] Ledger: filter to X; eight rows should remain. Filter back to All; 34.
- [ ] Every one of the above works with the keyboard alone.

## 3. Motion

- [ ] Turn on the OS "reduce motion" setting and reload.
- [ ] The mode engine must start static and never idle-cycle.
- [ ] No element should animate, and nothing should disappear.
- [ ] Turn the setting off again and reload: the idle cycle returns.

## 4. Keyboard and screen reader

- [ ] Tab from the top: skip link, name, five nav items, then page content.
- [ ] The skip link is the first thing that receives focus and it is visible.
- [ ] Focus is visible on every control, including the details markers.
- [ ] Open a receipt with Enter; close with Enter. Focus stays on the summary.
- [ ] Read the home page with VoiceOver or NVDA: the headings should form a
      readable outline, and the stamps should be announced with their words.

## 5. Print

- [ ] Print preview the STRATA entry to PDF.
- [ ] Navigation, the edge marker and the instrument controls are gone.
- [ ] External links print their URLs.
- [ ] Nothing is clipped at the page edge.

## 6. The boring paths

- [ ] Visit a URL that does not exist: the 404 page appears, with two ways back.
- [ ] Disable JavaScript and reload: every page reads correctly, receipts open,
      the cloth opens, and only the instruments lose their interactivity.
- [ ] Zoom to 200% and 400%: no horizontal scrolling, no overlap.
- [ ] Force-colours / high-contrast mode: borders and stamps remain visible.

## Record the result

Add a line to `docs/verification-log.md` with the date, browser, device and what
failed. A checklist that has never failed is usually a checklist nobody ran.
