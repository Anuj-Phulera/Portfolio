/**
 * Bar charts as tables.
 *
 * A chart is a table with a picture in one column, so that is how it is marked
 * up: real rows, real numbers, and a bar drawn with SVG geometry attributes
 * rather than inline styles. It reads correctly with a screen reader, prints
 * sensibly, and needs no JavaScript.
 */

import { html, type Html } from "../html.ts";

export interface ChartRow {
  label: string;
  value: number;
}

interface ChartOptions {
  title: string;
  caption: string;
  unit?: string;
  /** Draw the largest bar in the signal colour; everything else in ink. */
  emphasiseMax?: boolean;
}

export function barChart(rows: ChartRow[], options: ChartOptions): Html {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const unit = options.unit ?? "";

  return html`
    <figure class="chart">
      <figcaption class="chart__title">${options.title}</figcaption>
      <table class="chart__table">
        <caption class="visually-hidden">${options.title}. ${options.caption}</caption>
        <tbody>
          ${rows.map((row) => {
            const percent = Math.round((row.value / max) * 100);
            const lead = options.emphasiseMax && row.value === max;
            return html`
              <tr>
                <th scope="row">${row.label}</th>
                <td class="chart__cell">
                  <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <rect width="${percent}" height="8" class="${lead ? "chart__bar chart__bar--lead" : "chart__bar"}"></rect>
                  </svg>
                </td>
                <td class="chart__value">${row.value}${unit}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
      <p class="chart__note">${options.caption}</p>
    </figure>
  `;
}
