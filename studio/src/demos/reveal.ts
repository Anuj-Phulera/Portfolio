/**
 * Demo 04 — reveal once, then stay revealed.
 *
 * Question: what changes when content arrives at a decided moment instead of
 * tracking the scrollbar?
 *
 * IntersectionObserver at 35% visibility; a 600ms hold before the fade; the
 * element is never hidden again. Under reduced motion the content is simply
 * present from the first frame.
 */
export function mountReveals(scope: ParentNode, reduced: boolean): { destroy(): void } {
  const items = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (reduced) {
    items.forEach((item) => item.classList.add('is-in'));
    return { destroy() {} };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        window.setTimeout(() => el.classList.add('is-in'), 600);
        observer.unobserve(el);
      }
    },
    { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
  );

  items.forEach((item) => observer.observe(item));
  return { destroy: () => observer.disconnect() };
}
