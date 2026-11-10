// The living brand file as data for packs: where it lives, how long each part stays fresh, and what each slice
// reads. The same lists are in site/src/jobs/brand-file.mjs and in the tool a pack ships as tools/brand-file.mjs
// (catalogue-items/general/brand-dna-capture/scripts/brand-file.mjs); site/test/brand-file-rules.test.mjs fails when
// the copies differ. The brand file lives in the client's own project; AI Blocks stores none of it.

/** One name everywhere: brand file. `replaces` lists the three old index-file names this one index takes over from. */
export const BRAND_FILE = {
  name: "brand file", folder: "context/brand-file", index: "context/brand-file/index.md", worked: "context/brand-file/worked.md",
  raw: "context/brand-dna.json", tool: "brand-file.mjs", capture: "capture-brand-dna.mjs", schema: "ai-blocks-brand-file/1",
  replaces: ["brand-brain/00-index.md", "brand-brain/INDEX.md", "00-start-here.md"],
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
  none: "Brand file: not needed for this job. Skip capture.",
  facts: "Brand file: facts only. Run brand-file.mjs status, refresh stale prices and stock, then take slice facts.",
  voice: "Brand file: facts and voice. Run brand-file.mjs status, refresh what is stale, then take slice voice.",
  look: "Brand file: facts and look. Run brand-file.mjs status, refresh what is stale, then take slice look.",
  full: "Brand file: facts, voice and look. Run brand-file.mjs status, refresh prices and stock first, then take slice full.",
};

/** The one short line for a slice level. Pass `contextNeed(family).level` from families.ts. */
export const brandFileLine = (level: BrandSlice): string => SLICE_LINES[level];
