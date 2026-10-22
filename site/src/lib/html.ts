/**
 * A very small HTML builder. Every interpolation is escaped unless it is
 * already an Html value, so a typo in the content cannot inject markup.
 * That is the whole reason this exists instead of string concatenation.
 */

export class Html {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function esc(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch);
}

/** Mark a string as already-safe markup. Only call this on strings you wrote. */
export function raw(value: string): Html {
  return new Html(value);
}

function render(part: unknown): string {
  if (part === null || part === undefined || part === false) return "";
  if (part instanceof Html) return part.value;
  if (Array.isArray(part)) return part.map(render).join("");
  return esc(String(part));
}

export function html(
  strings: TemplateStringsArray,
  ...parts: unknown[]
): Html {
  let out = strings[0] ?? "";
  for (let i = 0; i < parts.length; i += 1) {
    out += render(parts[i]) + (strings[i + 1] ?? "");
  }
  return new Html(out);
}

/** Escape a value for use inside a double-quoted attribute. */
export function attr(value: string | number | boolean): string {
  if (value === true) return "";
  if (value === false || value === null || value === undefined) return "";
  return esc(String(value));
}

/** A `<br>`-free paragraph splitter: blank lines become separate paragraphs. */
export function paragraphs(text: string): Html[] {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => html`<p>${block.replace(/\n/g, " ")}</p>`);
}
