/**
 * Demo 05 — a scroll position readout that is honest.
 *
 * Question: what does the reader gain from knowing how far through a
 * sequence they are — and does smooth scrolling break the number?
 *
 * Wired to the same scroll controller the page uses, so the readout reflects
 * Lenis when it is active and native scroll when it is not.
 */
import type { ScrollController } from '../core/scroll';

export function mountScrollLine(root: HTMLElement, controller: ScrollController): { destroy(): void } {
  const bar = root.querySelector<HTMLElement>('[data-bar]');
  const label = root.querySelector<HTMLElement>('[data-label]');
  if (!bar || !label) throw new Error('scrollline markup missing');

  bar.style.transformOrigin = 'left center';

  controller.onProgress((p) => {
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
    label.textContent = `${Math.round(p * 100)}% · ${controller.enabled ? 'lenis' : 'native'}`;
  });

  return { destroy() {} };
}
