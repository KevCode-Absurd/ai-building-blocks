// What to add before a step: the steps that make what it needs. The mirror of suggestNext (suggest.ts), on the same
// ranking (next-steps.mjs previousSteps): a ready workflow runs it straight before this step, this step is built on
// it, or it makes something this step reads. Never a sibling that hands nothing over.
import { type Block, type Catalogue, portLabel } from "./data";
import { previousSteps } from "./next-steps.mjs";
import type { Suggestion } from "./suggest";

export function suggestBefore(c: Catalogue, anchor: string | null, inFlow: Set<string>, limit = 5): Suggestion[] {
  const b = anchor ? c.bySlug[anchor] : undefined;
  if (!b) return [];
  // The org context builder makes the product facts nearly every line of work reads, so it stays on the list when it fits.
  return previousSteps(b, c.blocks, { max: limit, exclude: (x: Block) => x.type === "agent" || inFlow.has(x.slug), makers: ["website-brand-brain-builder"] })
    .map(({ x, follows, takes }: { x: Block; follows: number; takes: string[] }) => ({
      b: x,
      why: follows ? "Comes before it in a ready workflow" : takes.length ? `Makes its ${portLabel(takes[0]).toLowerCase()}` : "It is built on this",
    }));
}
