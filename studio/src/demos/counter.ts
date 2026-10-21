/**
 * Demo 10 — a counter that is only allowed to count real things.
 *
 * Question: what does an animated statistic have to prove before it may be
 * shown at all?
 *
 * Every figure passed in must declare its source and the commit it was
 * measured from. The component refuses to render a value without provenance,
 * which makes decorative "10x faster" numbers impossible to add by accident.
 */

export interface Figure {
  readonly value: number;
  readonly suffix?: string;
  readonly label: string;
  readonly source: string;
  readonly measuredAt: string;
}

export function validateFigure(figure: Figure): void {
  if (!Number.isFinite(figure.value)) throw new Error(`${figure.label}: value must be finite`);
  if (!figure.source.trim()) throw new Error(`${figure.label}: a figure without a source is not allowed`);
  if (!/^[0-9a-f]{7,40}$/.test(figure.measuredAt)) throw new Error(`${figure.label}: measuredAt must be a commit sha`);
}

export const FIGURES: readonly Figure[] = [
  {
    value: 34,
    label: 'routes in SkillVerse',
    source: 'S2S app/ — page.tsx count',
    measuredAt: '05f2383',
  },
  { value: 35, label: 'objects in STRATA', source: 'WEBE src/content/graph.ts', measuredAt: 'e8795c8' },
  { value: 79, label: 'typed relations', source: 'WEBE src/content/graph.ts', measuredAt: 'e8795c8' },
  { value: 261, label: 'survey responses', source: 'S2S submission pack, CSV rows minus header', measuredAt: '05f2383' },
];

export function mountCounter(root: HTMLElement, reduced: boolean): { play(): void } {
  const container = root.querySelector<HTMLElement>('[data-figures]');
  if (!container) throw new Error('counter markup missing');
  FIGURES.forEach(validateFigure);

  container.replaceChildren(
    ...FIGURES.map((figure) => {
      const wrap = document.createElement('div');
      wrap.className = 'figure';
      const value = document.createElement('span');
      value.className = 'figure__value';
      value.dataset.value = String(figure.value);
      value.textContent = reduced ? format(figure) : '0';
      const label = document.createElement('span');
      label.className = 'figure__label';
      label.textContent = figure.label;
      const source = document.createElement('span');
      source.className = 'figure__source';
      source.textContent = `source: ${figure.source} @ ${figure.measuredAt}`;
      wrap.append(value, label, source);
      return wrap;
    }),
  );

  const play = () => {
    const values = Array.from(container.querySelectorAll<HTMLElement>('[data-value]'));
    values.forEach((node, i) => {
      const figure = FIGURES[i];
      if (!figure) return;
      if (reduced) {
        node.textContent = format(figure);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 900);
        const eased = 1 - Math.pow(1 - t, 3);
        node.textContent = `${Math.round(figure.value * eased)}${figure.suffix ?? ''}`;
        if (t < 1) requestAnimationFrame(tick);
        else node.textContent = format(figure);
      };
      requestAnimationFrame(tick);
    });
  };

  play();
  return { play };
}

function format(figure: Figure): string {
  return `${figure.value}${figure.suffix ?? ''}`;
}
