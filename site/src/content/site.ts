export const SITE = {
  name: "Anuj Phulera",
  role: "I build systems, then publish what is actually true about them.",
  title: "Anuj Phulera — a bench of working systems",
  description:
    "Six entries, eight repositories, one site that shows its own working. Every factual sentence here resolves to an entry in a claims ledger, and the ones that did not survive the audit are still on the page.",
  email: "anuj.phulera.work@gmail.com",
  github: "https://github.com/Anuj-Phulera",
  source: "https://github.com/Anuj-Phulera/Portfolio",
  built: "2026-10-22",
  bench: "BENCH 01",
} as const;

export const NAV = [
  { href: "/", label: "Bench" },
  { href: "/work/", label: "Entries" },
  { href: "/notes/the-pattern/", label: "The pattern" },
  { href: "/about/", label: "About" },
  { href: "/colophon/", label: "Colophon" },
] as const;

export const STATUS_MEANINGS = [
  {
    status: "BUILT",
    meaning: "It exists and runs. What this site says about it has been checked against the source.",
  },
  {
    status: "PARTIAL",
    meaning: "It exists, and a named part of it does not. The gap is written next to the claim, not below it.",
  },
  {
    status: "WITHDRAWN",
    meaning: "Built, then removed from presentation because it could not be defended. It stays listed.",
  },
  {
    status: "UNBUILT",
    meaning: "Designed and partly written, never deployed. The work is real; the product is not.",
  },
  {
    status: "WITHHELD",
    meaning: "Built and private. Publishing it is not mine to decide alone.",
  },
] as const;

/** Used by the bench readout and the entries index. */
export const COUNTS = {
  entries: 6,
  repositories: 8,
} as const;
