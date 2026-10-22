/**
 * Data used by the three instruments.
 *
 * DIAL_SERIES is a fixed array, not a recording. The lab note says so, and the
 * caption on the instrument says so. It exists to demonstrate the control rule,
 * not to stand in for the farm.
 */

export interface ModeObject {
  id: string;
  cls: string;
  title: string;
  body: string;
  relations: number;
}

export const MODE_OBJECTS: readonly ModeObject[] = [
  {
    id: "OBJ-014",
    cls: "nebula",
    title: "Orion complex",
    body: "A molecular cloud where the dust is cold enough to collapse. Most of what is visible is the part that has already collapsed.",
    relations: 6,
  },
  {
    id: "OBJ-022",
    cls: "cluster",
    title: "Crux field",
    body: "Four bright stars and a great deal of nothing. The nothing is catalogued separately, because it has structure.",
    relations: 4,
  },
  {
    id: "OBJ-031",
    cls: "void",
    title: "The quiet region",
    body: "A volume with almost no emission in any band. It was found by looking for what was missing from the survey.",
    relations: 3,
  },
] as const;

/** 24 readings, percent moisture, one per hour. Fixed, not random, not live. */
export const DIAL_SERIES: readonly number[] = [
  58, 56, 53, 51, 48, 46, 44, 45, 47, 44, 41, 39, 37, 35, 34, 36, 39, 42, 40, 37, 35, 33, 32, 31,
] as const;

export const DIAL_DEFAULT_THRESHOLD = 40;

export const GRADE_MEANING: Record<string, string> = {
  V: "verified against source",
  P: "partial — true, with a gap",
  U: "unverifiable without credentials or a browser",
  A: "aspirational",
  X: "contradicted by the source",
};
