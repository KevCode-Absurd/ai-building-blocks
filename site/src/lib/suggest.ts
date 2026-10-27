// What to add next to a workflow. Shared by the builder and the "Add to a workflow" pop-up.
import { type Block, type Catalogue, portLabel } from "./data";
import { nextSteps } from "./next-steps.mjs";

/** `takes`: what the suggested step really takes from the anchor (port types, strongest first), when anything. */
export type Suggestion = { b: Block; why: string; takes?: string[] };

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
  // The same ranking as "After this" on block pages (next-steps.mjs): what follows it in reviewed workflows, then what
  // needs a specific thing it makes, then other hand-offs in the same job. A sibling with nothing to take is never
  // suggested here: a step added after this one must use what it made. Agents and ready workflows stay out of the canvas pool.
  // `takes` comes strongest first, so the reason names the hand-off that matters (ad copy before an optional brief).
  return nextSteps(a, c.blocks, { max: limit, perTask: 3, siblings: false, exclude: (b: Block) => b.type === "agent" || inFlow.has(b.slug) })
    .map(({ x, follows, takes }: { x: Block; follows: number; takes: string[] }) => ({
      b: x,
      why: follows ? "Comes next in a ready workflow" : takes.length ? `Uses its ${portLabel(takes[0]).toLowerCase()}` : "Same job",
      takes,
    }));
}
