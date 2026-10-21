# Accessibility procedure

**Reference standard:** WCAG 2.2 AA. **Status:** not audited, not claimed. This is a procedure, not a badge.

## Why this folder exists

Two of the subject's projects claim accessibility in their READMEs without evidence. That is exactly the failure this procedure prevents. The portfolio must either state a scoped, verified claim or state none.

## A. Structure

- [ ] One `h1` per page; headings descend without skipping levels.
- [ ] Landmarks: `header`, `nav`, `main`, `footer` present; `nav` labelled.
- [ ] Skip link is the first focusable element and becomes visible on focus.
- [ ] Page `title` describes the page, not the brand alone.
- [ ] Language set on `html`.

## B. Keyboard

- [ ] Every interactive element reachable by `Tab`, in visual order.
- [ ] Focus visible on every element, including custom controls; contrast of focus ring ≥ 3:1 against adjacent colours.
- [ ] No keyboard trap; `Esc` closes overlays and returns focus to the trigger.
- [ ] Custom controls implement expected keys (arrows for tabs/menus, `Space`/`Enter` for buttons).
- [ ] Skip link and index reachable within three presses.

## C. Motion

- [ ] `prefers-reduced-motion` removes parallax, pinning, autoplay idles and large travel.
- [ ] Reduced path preserves all content and state changes.
- [ ] No animation flashes more than three times per second.
- [ ] Nothing moves automatically for more than five seconds without a pause control.

## D. Perception

- [ ] Text contrast ≥ 4.5:1; large text ≥ 3:1; non-text UI ≥ 3:1 — measured with `tools/design/contrast.mjs`.
- [ ] Information never conveyed by colour alone; status stamps carry text.
- [ ] Text resizes to 200% without loss of content.
- [ ] Content reflows at 320 px width without two-dimensional scrolling.

## E. Semantics and state

- [ ] Images have `alt`; decorative images `alt=""`.
- [ ] Buttons are `button`; links are `a` with an `href`.
- [ ] Custom widgets expose name, role, value, and state (`aria-expanded`, `aria-pressed`, `aria-current`).
- [ ] Live regions used sparingly and only for changes the user caused or must know about.
- [ ] Forms have visible labels; errors are described in text and linked to the field.

## F. Media

- [ ] Audio never autoplays; a visible mute exists; preference persists.
- [ ] Video (if any) has captions and no autoplay with sound.
- [ ] Any recording used as evidence is described in text as well.

## G. Target size and input

- [ ] Targets ≥ 24 × 24 px (WCAG 2.2 AA); primary controls ≥ 44 × 44 px.
- [ ] Every drag interaction has a single-pointer and a keyboard alternative.
- [ ] No interaction requires a specific device (hover, precise pointer) to access content.

## Sign-off template

> Tested on **[date]** with **[browser + screen reader + OS]**, at **[viewports]**. Scope: **[routes]**. Known gaps: **[list]**. This is **not** a claim of full WCAG 2.2 AA conformance.

A checklist with unchecked boxes is honest. A badge without a procedure is not.
