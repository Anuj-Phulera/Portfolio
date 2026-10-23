export type Status = "BUILT" | "PARTIAL" | "WITHDRAWN" | "UNBUILT" | "WITHHELD";

export type InstrumentId = "mode" | "dial" | "ledger";

export type Block =
  | { kind: "lede"; text: string }
  | { kind: "prose"; text: string }
  /** Inline evidence. Renders as a <details> so it survives with JS off. */
  | { kind: "receipt"; claim: string; note?: string }
  | { kind: "facts"; title: string; rows: ReadonlyArray<readonly [string, string]> }
  | { kind: "instrument"; id: InstrumentId; caption: string }
  | { kind: "quote"; text: string; cite: string }
  | { kind: "source"; file: string; caption: string; lines: string[] }
  | { kind: "files"; title: string; rows: ReadonlyArray<readonly [string, string]> }
  | { kind: "list"; title: string; items: string[] }
  /** A table of measured values: real columns, a caption, and a note. */
  | {
      kind: "table";
      title: string;
      columns: ReadonlyArray<string>;
      rows: ReadonlyArray<ReadonlyArray<string>>;
      note?: string;
    }
  | { kind: "aside"; label: string; text: string }
  | {
      kind: "chart";
      title: string;
      caption: string;
      unit?: string;
      emphasiseMax?: boolean;
      rows: ReadonlyArray<{ label: string; value: number }>;
    }
  | { kind: "falsifier"; text: string }
  | { kind: "next"; text: string };

export interface Project {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  status: Status;
  statusNote: string;
  year: string;
  surface: string;
  repos: ReadonlyArray<{ label: string; href: string }>;
  attribution: string;
  question: string;
  blocks: Block[];
  nextSlug: string | null;
}

export interface StatusMeaning {
  status: Status;
  meaning: string;
}
