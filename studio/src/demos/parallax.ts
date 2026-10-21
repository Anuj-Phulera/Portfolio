/**
 * Demo 03 — pointer-reactive depth, with a hard stop.
 *
 * Question: how little pointer motion is enough to make a surface feel
 * physical — and what happens when the pointer is a finger, or absent?
 *
 * Rules: transform only (no layout), rAF-throttled, capped at 6px of travel,
 * disabled for coarse pointers and under reduced motion.
 */
export function mountParallax(root: HTMLElement, reduced: boolean): { destroy(): void } {
  const layer = root.querySelector<HTMLElement>('[data-layer]');
  if (!layer) throw new Error('parallax markup missing');
  const fine = window.matchMedia?.('(pointer: fine)').matches ?? true;
  if (reduced || !fine) {
    layer.style.transform = 'translate3d(0,0,0)';
    return { destroy() {} };
  }

  let frame = 0;
  let targetX = 0;
  let targetY = 0;

  const apply = () => {
    frame = 0;
    layer.style.transform = `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0)`;
  };

  const onMove = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = Math.max(-6, Math.min(6, nx * 12));
    targetY = Math.max(-6, Math.min(6, ny * 12));
    if (!frame) frame = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    if (!frame) frame = requestAnimationFrame(apply);
  };

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);

  return {
    destroy() {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    },
  };
}
