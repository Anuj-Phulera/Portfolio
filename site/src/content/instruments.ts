export interface InstrumentMeta {
  index: string;
  title: string;
  labNote: { real: string; simplified: string; mocked: string; source: string };
}

export const INSTRUMENTS: Record<"mode" | "dial" | "ledger", InstrumentMeta> = {
  mode: {
    index: "01",
    title: "MODE ENGINE · STRATA, REDUCED",
    labNote: {
      real: "The decision rule, the visible read-out, the pin, and keyboard operation of every control. The six layouts exist in the real project; three are reproduced here.",
      simplified: "Three sample objects instead of thirty-five, and three layouts instead of six. The engine's margin rule is approximated with fixed thresholds.",
      mocked: "Nothing is faked. The objects are written copy, not the astronomy corpus.",
      source: "site/src/islands/mode.ts",
    },
  },
  dial: {
    index: "02",
    title: "WATERING DIAL · VERDE, REDUCED",
    labNote: {
      real: "The control rule: a threshold, an automatic decision, a manual override, and a read-out that states why the pump is in the state it is in.",
      simplified: "One sensor, one actuator, twenty-four points of history.",
      mocked: "Every reading. The series is a fixed array in this repository, not a recording from the board.",
      source: "site/src/lib/fixtures.ts",
    },
  },
  ledger: {
    index: "03",
    title: "CLAIMS LEDGER · THIS SITE",
      labNote: {
      real: "All thirty-five entries, their grades and their publish status, read from the same JSON the build uses.",
      simplified: "The filter works on grade only; the ledger also records public-use, evidence and review dates per entry.",
      mocked: "Nothing. If the JSON changes, this instrument changes with it.",
      source: "PREP/02-claims/ledger.json",
    },
  },
};
