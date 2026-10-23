/**
 * The island that exists for paper.
 *
 * `print.css` claimed that every receipt opens when the page is printed. It
 * could not: no CSS property expands a `<details>`. The claim was wrong for as
 * long as it went unchecked, which is the sort of thing this project is meant
 * to catch, so the fix is here rather than a softer sentence in the comment.
 *
 * This opens every collapsed receipt before the print dialog takes its snapshot
 * and closes them again afterwards, so printing does not rearrange the screen.
 * Receipts the reader opened themselves are left alone: the restoration only
 * touches what this module opened.
 *
 * If the script never runs, the stylesheet falls back to saying a receipt is
 * collapsed, which is true. A printed page that says less than the screen is
 * honest; a printed page that silently loses half of an entry is not.
 */

/** jsdom and old engines may not implement matchMedia; the listener is optional. */
type MaybeMedia = {
  matchMedia?: (query: string) => MediaQueryList;
};

export function initPrint(win: Window = window): () => void {
  const opened = new Set<HTMLDetailsElement>();

  function openAll(): void {
    win.document.querySelectorAll<HTMLDetailsElement>("details.receipt").forEach((receipt) => {
      if (receipt.open) return;
      receipt.open = true;
      opened.add(receipt);
    });
  }

  function restore(): void {
    opened.forEach((receipt) => {
      receipt.open = false;
    });
    opened.clear();
  }

  win.addEventListener("beforeprint", openAll);
  win.addEventListener("afterprint", restore);

  // Chromium fires beforeprint asynchronously in some print flows, after the
  // snapshot has been taken. The media query change fires earlier, so keep both.
  const media = (win as unknown as MaybeMedia).matchMedia?.("print");
  const onMediaChange = (event: MediaQueryListEvent): void => {
    if (event.matches) openAll();
    else restore();
  };
  media?.addEventListener?.("change", onMediaChange);

  return () => {
    win.removeEventListener("beforeprint", openAll);
    win.removeEventListener("afterprint", restore);
    media?.removeEventListener?.("change", onMediaChange);
    restore();
  };
}
