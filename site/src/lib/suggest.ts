// What to add next to a workflow. Shared by the builder and the "Add to a workflow" pop-up.
import { type Block, type Catalogue, portLabel } from "./data";

export type Suggestion = { b: Block; why: string };

/** Strongest signal first: what follows this block in the ready workflows,
 *  then blocks that take what it hands back, then the same job. With nothing to follow: good places to start. */
export function suggestNext(c: Catalogue, anchor: string | null, inFlow: Set<string>, limit = 8): Suggestion[] {
  const pool = c.blocks.filter((b) => b.category !== "orchestrator" && !inFlow.has(b.slug));
  const flowsList = c.blocks.filter((b) => b.category === "orchestrator");
  if (!anchor || !c.bySlug[anchor]) {
    const firsts = new Set(flowsList.map((f) => f.steps[0]?.uses).filter(Boolean));
    return pool
      .map((b) => ({ b, score: (firsts.has(b.slug) ? 10 : 0) + (b.task === "brand-file" ? 4 : 0) + (b.task === "understand-customers" ? 3 : 0) + b.usedIn }))
      .filter((x) => x.score > 0).sort((x, y) => y.score - x.score).slice(0, Math.min(limit, 6))
      .map(({ b }) => ({ b, why: firsts.has(b.slug) ? "Where ready workflows start" : "A good first step" }));
  }
  const a = c.bySlug[anchor];
  const outs = new Set(a.outputs.map((p) => p.type));
  const follows = new Map<string, number>();
  for (const f of flowsList) f.steps.forEach((s, i) => { if (s.uses === anchor && f.steps[i + 1]) follows.set(f.steps[i + 1].uses, (follows.get(f.steps[i + 1].uses) ?? 0) + 1); });
  return pool
    .map((b) => {
      const used = b.inputs.filter((p) => outs.has(p.type));
      const score = (follows.get(b.slug) ?? 0) * 6 + (used.length ? 3 + (used.some((p) => p.required) ? 1 : 0) : 0) + (b.task === a.task ? 1 : 0) + b.usedIn * 0.1;
      const why = follows.has(b.slug) ? "Comes next in a ready workflow" : used.length ? `Uses its ${portLabel(used[0].type).toLowerCase()}` : "Same job";
      return { b, score, why };
    })
    .filter((x) => x.score >= 3).sort((x, y) => y.score - x.score).slice(0, limit)
    .map(({ b, why }) => ({ b, why }));
}
