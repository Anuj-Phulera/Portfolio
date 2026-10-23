/**
 * The print island, tested without paper.
 *
 * jsdom has no print path, so this cannot prove that a print preview looks
 * right. It proves the part that was broken: that the receipts are open when
 * the snapshot is taken, that the page is put back exactly as it was, and that
 * a receipt the reader opened by hand survives the round trip.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { initPrint } from "./print.ts";

const MARKUP = `
  <details class="receipt" data-claim="CLM-001"><summary>one</summary><p>first</p></details>
  <details class="receipt" data-claim="CLM-002"><summary>two</summary><p>second</p></details>
  <details class="receipt" data-claim="CLM-003" open><summary>three</summary><p>third</p></details>
  <details><summary>not a receipt</summary><p>ignored</p></details>
`;

function fire(win: Window, type: string): void {
  win.dispatchEvent(new (win as unknown as { Event: typeof Event }).Event(type));
}

function mount(): { dom: JSDOM; win: Window; open: () => boolean[] } {
  const dom = new JSDOM(MARKUP, { pretendToBeVisual: true });
  const win = dom.window as unknown as Window;
  Object.defineProperty(win, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  const receipts = (): HTMLDetailsElement[] => [
    ...win.document.querySelectorAll<HTMLDetailsElement>("details.receipt"),
  ];
  return { dom, win, open: () => receipts().map((receipt) => receipt.open) };
}

test("printing opens every collapsed receipt", () => {
  const { win, open } = mount();
  initPrint(win);
  assert.deepEqual(open(), [false, false, true]);

  fire(win, "beforeprint");
  assert.deepEqual(open(), [true, true, true]);
});

test("printing closes what it opened and nothing else", () => {
  const { win, open, dom } = mount();
  initPrint(win);

  // The reader expands the middle receipt themselves before printing.
  const [, middle] = [...dom.window.document.querySelectorAll("details.receipt")];
  (middle as HTMLDetailsElement).open = true;

  fire(win, "beforeprint");
  assert.deepEqual(open(), [true, true, true]);

  fire(win, "afterprint");
  assert.deepEqual(open(), [false, true, true], "a receipt the reader opened stays open");
});

test("details that are not evidence panels are left alone", () => {
  const { win, dom } = mount();
  initPrint(win);
  fire(win, "beforeprint");
  const other = dom.window.document.querySelector("details:not(.receipt)") as HTMLDetailsElement;
  assert.equal(other.open, false);
});

test("a disposed island stops listening", () => {
  const { win, open } = mount();
  const dispose = initPrint(win);
  dispose();
  fire(win, "beforeprint");
  assert.deepEqual(open(), [false, false, true], "no listener should remain");
});

test("disposing restores the page it was handed", () => {
  const { win, open } = mount();
  const dispose = initPrint(win);
  fire(win, "beforeprint");
  assert.deepEqual(open(), [true, true, true]);
  dispose();
  assert.deepEqual(open(), [false, false, true]);
});
