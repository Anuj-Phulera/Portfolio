/**
 * Behavioural tests for the three islands, without a browser.
 *
 * jsdom is not a rendering engine, so this proves nothing about layout. It does
 * prove that each island starts, responds to its controls, keeps its ARIA state
 * honest, and never needs the network. That is the part most likely to break.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { initDial } from "./dial.ts";
import { initLedger } from "./ledger.ts";
import { initMode } from "./mode.ts";
import { modeInstrument, dialInstrument, ledgerInstrument } from "../lib/render/instruments.ts";
import { INSTRUMENTS } from "../content/instruments.ts";
import { loadLedger } from "../lib/ledger.ts";

function mount(html: string): JSDOM {
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  const win = dom.window as unknown as Window & typeof globalThis;
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
  (globalThis as unknown as { window: unknown }).window = win;
  (globalThis as unknown as { document: unknown }).document = win.document;
  return dom;
}

const modeHtml = modeInstrument({ ...INSTRUMENTS.mode, caption: "c" }).value;
const dialHtml = dialInstrument({ ...INSTRUMENTS.dial, caption: "c" }).value;
const ledgerHtml = ledgerInstrument({ ...INSTRUMENTS.ledger, caption: "c", ledger: loadLedger() }).value;

function click(el: Element | null): void {
  assert.ok(el, "control missing");
  const win = el.ownerDocument.defaultView;
  assert.ok(win, "element is not in a document");
  el.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
}

test("the mode engine switches layout and exposes the choice", (t) => {
  const dom = mount(modeHtml);
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("[data-mode-root]");
  assert.ok(root);
  initMode(root);
  const stage = root.querySelector("[data-stage]");
  const mosaic = root.querySelector('[data-layout-btn="mosaic"]');
  click(mosaic);
  assert.equal(stage?.getAttribute("data-layout"), "mosaic");
  assert.equal(mosaic?.getAttribute("aria-pressed"), "true");
  assert.equal(root.querySelector('[data-layout-btn="codex"]')?.getAttribute("aria-pressed"), "false");
  assert.equal(root.querySelector("[data-mode]")?.textContent, "MOSAIC");
});

test("pinning stops the engine and says so", (t) => {
  const dom = mount(modeHtml);
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("[data-mode-root]");
  assert.ok(root);
  initMode(root);
  click(root.querySelector("[data-pin]"));
  assert.equal(root.querySelector("[data-pin]")?.getAttribute("aria-pressed"), "true");
  assert.equal(root.querySelector("[data-read]")?.textContent, "PINNED BY YOU");
  assert.equal(root.querySelector("[data-state]")?.textContent, "PINNED");
});

test("the dial applies the threshold and the manual override", (t) => {
  const dom = mount(dialHtml);
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("[data-dial-root]");
  assert.ok(root);
  initDial(root);
  const range = root.querySelector<HTMLInputElement>("[data-threshold]");
  assert.ok(range);

  range.value = "20";
  range.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(root.querySelector("[data-threshold-out]")?.textContent, "20");
  assert.equal(root.querySelector("[data-live-pump]")?.textContent, "OFF");

  range.value = "60";
  range.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  assert.equal(root.querySelector("[data-live-pump]")?.textContent, "ON");

  click(root.querySelector("[data-auto]"));
  const pump = root.querySelector<HTMLButtonElement>("[data-pump]");
  assert.equal(pump?.disabled, false);
  click(pump);
  assert.equal(pump?.getAttribute("aria-pressed"), "true");
  assert.equal(root.querySelector("[data-why]")?.textContent, "manual override");
});

test("the ledger filters by grade and reports the count", (t) => {
  const dom = mount(ledgerHtml);
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("[data-ledger-root]");
  assert.ok(root);
  initLedger(root);

  const visible = () =>
    Array.from(dom.window.document.querySelectorAll<HTMLElement>("[data-ledger-row]")).filter((row) => !row.hidden).length;
  assert.equal(visible(), 36);

  click(root.querySelector('[data-grade-btn="X"]'));
  assert.equal(visible(), 8);
  assert.equal(root.querySelector("[data-ledger-count]")?.textContent, "8");

  click(root.querySelector('[data-grade-btn="all"]'));
  assert.equal(visible(), 36);
});

test("every island survives being initialised twice", (t) => {
  const dom = mount(modeHtml);
  t.after(() => dom.window.close());
  const root = dom.window.document.querySelector("[data-mode-root]");
  assert.ok(root);
  initMode(root);
  initMode(root);
  assert.equal(root.querySelectorAll("[data-stage]").length, 1);
});
