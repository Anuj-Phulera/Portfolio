import { STATUS_MEANINGS } from "../../content/site.ts";
import type { Status } from "../../content/types.ts";
import { html, type Html } from "../html.ts";

export function stamp(status: Status): Html {
  return html`<span class="stamp stamp--${status.toLowerCase()}">${status}</span>`;
}

export function statusLegend(): Html {
  return html`
    <div class="facts">
      <p class="facts__title">What the stamps mean</p>
      <dl>
        ${STATUS_MEANINGS.map(
          (row) => html`
            <div class="facts__row">
              <dt><span class="stamp stamp--${row.status.toLowerCase()}">${row.status}</span></dt>
              <dd>${row.meaning}</dd>
            </div>
          `,
        )}
      </dl>
    </div>
  `;
}
