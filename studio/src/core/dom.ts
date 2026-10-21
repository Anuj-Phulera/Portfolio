/** Minimal element builder. No framework, no runtime, testable. */

type Attrs = Record<string, string | number | boolean | undefined>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: Array<Node | string | null | undefined> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key === 'text') node.textContent = String(value);
    else if (key === 'class') node.className = String(value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children) {
    if (child === null || child === undefined) continue;
    node.append(child);
  }
  return node;
}

/**
 * Split text for animation while keeping one readable copy for assistive tech.
 * The visible fragments are aria-hidden; the full sentence is available once.
 */
export function splitWords(text: string): { root: HTMLElement; words: HTMLElement[] } {
  const root = el('span', { class: 'split' });
  const visible = el('span', { 'aria-hidden': 'true' });
  const words: HTMLElement[] = [];

  text.split(/(\s+)/).forEach((part) => {
    if (part.trim() === '') {
      if (part.length) visible.append(document.createTextNode(' '));
      return;
    }
    const word = el('span', { class: 'split__word' }, [part]);
    words.push(word);
    visible.append(word);
  });

  root.append(visible, el('span', { class: 'sr-only', text }));
  return { root, words };
}

export function qs<T extends Element>(selector: string, scope: ParentNode = document): T {
  const found = scope.querySelector<T>(selector);
  if (!found) throw new Error(`missing element: ${selector}`);
  return found;
}
