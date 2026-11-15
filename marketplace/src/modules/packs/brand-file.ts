// The living org context as data for packs: where it lives, how long each part stays fresh, and what each slice
// reads. The same lists are in site/src/jobs/brand-file.mjs and in the tool a pack ships as tools/org-context.mjs
// (catalogue-items/general/brand-dna-capture/scripts/org-context.mjs); site/test/brand-file-rules.test.mjs fails when
// the copies differ. The org context lives in the client's own project; AI Blocks stores none of it.

/** One name everywhere: org context (it was the brand brain, then the brand file). `replaces` lists the old index-file names this one index takes over from; the old context/brand-file/ folder is still read until it is moved. */
export const BRAND_FILE = {
  name: "org context", folder: "context/org-context", index: "context/org-context/index.md", worked: "context/org-context/worked.md",
  raw: "context/brand-dna.json", tool: "org-context.mjs", capture: "capture-brand-dna.mjs", schema: "ai-blocks-org-context/1",
  replaces: ["brand-brain/00-index.md", "brand-brain/INDEX.md", "00-start-here.md", "brand-file/index.md"],
} as const;

/** Days a line stays fresh, by its `volatile` class. A line with no date is stale whatever its class. */
export const FRESH_DAYS: Record<"fast" | "slow" | "fixed", number | null> = { fast: 7, slow: 90, fixed: null };

/** The kinds of fact in the fast class. Everything else, and the look and the voice, is slow. */
export const FAST_KINDS: string[] = ["price", "offer", "stock", "shipping"];

export const SLICES = ["none", "facts", "voice", "look", "full"] as const;
export type BrandSlice = (typeof SLICES)[number];

/** The parts a slice reads. Stale or missing parts outside the slice never block a job. */
export const SLICE_PARTS: Record<BrandSlice, string[]> = {
  none: [], facts: ["offers", "facts"], voice: ["offers", "facts", "voice"], look: ["offers", "facts", "look"], full: ["offers", "facts", "voice", "look"],
};

/** The most words a slice may hand to a job. */
export const SLICE_WORDS: Record<BrandSlice, number> = { none: 40, facts: 600, voice: 600, look: 600, full: 1500 };

export const BRAND_FILE_PARTS: { id: string; file: string; holds: string; fresh: "fast" | "slow" | null }[] = [
  { id: "offers", file: "offers.json", holds: "Prices, promotions, stock and shipping", fresh: "fast" },
  { id: "facts", file: "facts.json", holds: "Lasting facts: the business, proof, policies, customers", fresh: "slow" },
  { id: "look", file: "look.json", holds: "Palette, type, shapes, buttons and imagery", fresh: "slow" },
  { id: "voice", file: "voice.md", holds: "Real lines, each with its source", fresh: "slow" },
  { id: "references", file: "references.md", holds: "Admired, avoided and competitors", fresh: null },
  { id: "worked", file: "worked.md", holds: "What the client kept, killed or asked for more of", fresh: null },
];

/** The short line a job skill or job context carries for each slice. */
export const SLICE_LINES: Record<BrandSlice, string> = {
  none: "Org context: not needed for this job. Skip capture.",
  facts: "Org context: facts only. Run org-context.mjs status, refresh stale prices and stock, then take slice facts.",
  voice: "Org context: facts and voice. Run org-context.mjs status, refresh what is stale, then take slice voice.",
  look: "Org context: facts and look. Run org-context.mjs status, refresh what is stale, then take slice look.",
  full: "Org context: facts, voice and look. Run org-context.mjs status, refresh prices and stock first, then take slice full.",
};

/** The one short line for a slice level. Pass `contextNeed(family).level` from families.ts. */
export const brandFileLine = (level: BrandSlice): string => SLICE_LINES[level];
