/**
 * Smooth scroll, with the escape hatches built in.
 *
 * Lenis is used only when motion is allowed. Under reduced motion the module
 * returns a no-op controller and the document keeps native scrolling — the
 * cheapest correct behaviour, and the one most sites get wrong by applying
 * smooth scroll unconditionally.
 *
 * Keyboard paging (PageUp/PageDown/Home/End), find-in-page and anchor links
 * are left to the browser; Lenis's `autoRaf` is disabled so we drive frames
 * ourselves and can stop instantly.
 */
import Lenis from 'lenis';

export interface ScrollController {
  readonly enabled: boolean;
  destroy(): void;
  scrollTo(target: string | number | HTMLElement, opts?: { immediate?: boolean }): void;
  onProgress(cb: (p: number) => void): void;
}

const noop: ScrollController = {
  enabled: false,
  destroy() {},
  scrollTo(target) {
    if (typeof target === 'string') document.querySelector(target)?.scrollIntoView();
    else if (typeof target === 'number') window.scrollTo({ top: target });
    else target.scrollIntoView();
  },
  onProgress(cb) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      cb(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  },
};

export function createScroll(reduced: boolean): ScrollController {
  if (reduced || typeof window === 'undefined') return noop;

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    syncTouch: false,
  });

  let raf = 0;
  let running = true;
  const loop = (time: number) => {
    lenis.raf(time);
    if (running) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  // Anchor links keep working: intercept only same-document hashes.
  const onAnchor = (event: MouseEvent) => {
    const link = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (!el) return;
    event.preventDefault();
    lenis.scrollTo(el as HTMLElement, { offset: -72 });
    history.replaceState(null, '', id);
  };
  document.addEventListener('click', onAnchor);

  return {
    enabled: true,
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchor);
      lenis.destroy();
    },
    scrollTo(target, opts) {
      lenis.scrollTo(target as never, { immediate: opts?.immediate ?? false, offset: -72 });
    },
    onProgress(cb) {
      lenis.on('scroll', ({ progress }: { progress: number }) => cb(progress));
    },
  };
}
