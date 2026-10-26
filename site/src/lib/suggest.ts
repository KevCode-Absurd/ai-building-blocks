// What to add next to a workflow. Shared by the builder and the "Add to a workflow" pop-up.
import { type Block, type Catalogue, portLabel } from "./data";
import { nextSteps } from "./next-steps.mjs";

export type Suggestion = { b: Block; why: string };

/** Strongest signal first: what follows this block in the ready workflows,
 *  then blocks that take what it hands back, then the same job. With nothing to follow: good places to start. */
export function suggestNext(c: Catalogue, anchor: string | null, inFlow: Set<string>, limit = 8): Suggestion[] {
  const pool = c.blocks.filter((b) => b.category !== "orchestrator" && b.type !== "agent" && !inFlow.has(b.slug));
  const flowsList = c.blocks.filter((b) => b.category === "orchestrator");
  if (!anchor || !c.bySlug[anchor]) {
    const firsts = new Set(flowsList.map((f) => f.steps[0]?.uses).filter(Boolean));
    return pool
      .map((b) => ({ b, score: (firsts.has(b.slug) ? 10 : 0) + (b.task === "brand-file" ? 4 : 0) + (b.task === "understand-customers" ? 3 : 0) + b.usedIn }))
      .filter((x) => x.score > 0).sort((x, y) => y.score - x.score).slice(0, Math.min(limit, 6))
      .map(({ b }) => ({ b, why: firsts.has(b.slug) ? "Where ready workflows start" : "A good first step" }));
  }
  const a = c.bySlug[anchor];
  // The same evidence as "After this" on block pages (next-steps.mjs): what follows it in reviewed workflows,
  // what takes a specific thing it makes, then the same job and subject. Agents and ready workflows stay out of the canvas pool.
  return nextSteps(a, c.blocks, { max: limit, perTask: 3, exclude: (b: Block) => b.type === "agent" || inFlow.has(b.slug) })
    .map(({ x, follows, takes }: { x: Block; follows: number; takes: string[] }) => ({
      b: x,
      why: follows ? "Comes next in a ready workflow" : takes.length ? `Uses its ${portLabel(takes[0]).toLowerCase()}` : "Same job",
    }));
}
