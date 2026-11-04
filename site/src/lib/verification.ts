// What the library can say about a block. "Tested" means it passed the safety scan (anything that fails is
// withheld from the site) and its page has a real input/output structure. scripts/build-index.mjs decides it.
import type { Block } from "./data";

export const isTested = (b: Pick<Block, "tested">) => b.tested?.result === "pass";
/** The badge text on a card: "Safety checked" or nothing. */
export const trustLabel = (b: Pick<Block, "tested">) => isTested(b) ? "Safety checked" : "";
