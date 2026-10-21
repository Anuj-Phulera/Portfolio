/**
 * Demo 08 — scroll-driven animation, native first.
 *
 * Question: how much can be done with CSS `animation-timeline: scroll()`
 * before a JavaScript scroll listener is justified?
 *
 * The native path uses no JS at all. Where the timeline API is missing we do
 * not emulate scrubbing (which costs frames and breaks keyboard paging); we
 * degrade to a threshold reveal. The demo prints which path it chose.
 */
import { probeScrollTimeline } from '../core/capability';

export function mountScrollScene(root: HTMLElement, reduced: boolean): { destroy(): void } {
  const track = root.querySelector<HTMLElement>('[data-scene-track]');
  const badge = root.querySelector<HTMLElement>('[data-scene-path]');
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-scene-panel]'));
  if (!track || !badge) throw new Error('scroll scene markup missing');

  const probe = probeScrollTimeline();
  const native = probe.supported && !reduced;

  track.dataset.path = native ? 'native' : 'fallback';
  badge.textContent = reduced
    ? 'reduced motion — all panels shown, no scrubbing'
    : `${native ? 'native' : 'fallback'} · ${probe.note}`;

  if (reduced) {
    panels.forEach((p) => p.classList.add('is-in'));
    return { destroy() {} };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.5 },
  );
  panels.forEach((p) => observer.observe(p));

  return { destroy: () => observer.disconnect() };
}
