// Checks an ordered workflow and suggests concrete changes: remove a repeated step, put the steps in data-flow order,
// add a step that makes a missing input, or swap a step for one that fits. No ranking of its own: the hand-off check
// is step-graph.ts chain, makers come from its previousSteps ranking, and swap options are the steps the shared
// ranking (next-steps.mjs nextSteps after the previous step, previousSteps before the next one) puts in that place.
// Plain code, no AI: the same workflow always gets the same suggestions. Used by prepare_workflow (public MCP and API).
import type { Library, Part } from "./composer-core.ts";
import { chain, type Chain } from "./step-graph.ts";
import { handsOver, nextSteps, previousSteps } from "./next-steps.mjs";

/** Step numbers are 0-based positions in the submitted list. */
export type Suggestion =
  | { kind: "remove"; step: number; duplicate_of: number }
  | { kind: "reorder"; order: number[]; moves: { step: number; before: number; type: string }[] }
  | { kind: "insert"; before: number; slug: string; makes: string[]; for_steps: number[]; alternatives: string[] }
  | { kind: "swap"; step: number; slug: string; fixes: string[] };
export type WorkflowCheck = {
  check: Chain; suggestions: Suggestion[];
  /** Up to `alternatives` steps that could take each step's place (the shared ranking around it), best first, and
   *  whether each fits: in that place, every required input it has is made earlier or given by the user. */
  alternatives: { slug: string; fits: boolean }[][];
  /** The workflow with the remove, reorder and insert suggestions applied (swaps stay a choice), and its check. */
  proposed: { steps: (string | Part)[]; from: (number | null)[]; check: Chain; changed: boolean };
};

const SPOTS = 20;
const partOf = (c: Library, s: string | Part) => typeof s === "string" ? c.bySlug[s] : s;
const slugOf = (s: string | Part) => typeof s === "string" ? s : s.slug;

/** Steps that could stand in for step `i`: ranked after the step before it and before the step after it, and making
 *  what step `i` hands on (or, as the last step, one of its results). */
export function swapOptions(c: Library, list: (string | Part)[], i: number, n = 3): string[] {
  const parts = list.map(s => partOf(c, s)), b = parts[i];
  if (!b || n < 1) return [];
  const prev = parts[i - 1], next = parts[i + 1], inFlow = new Set(list.map(slugOf));
  if (!prev && !next) return [];
  const skip = (x: Part) => x.type === "agent" || inFlow.has(x.slug);
  const after = prev ? new Map(nextSteps(prev, c.blocks, { max: SPOTS, perTask: SPOTS, floor: 0, siblings: false, exclude: skip }).map(s => [s.x.slug as string, s.score as number])) : null;
  const before = next ? new Map(previousSteps(next, c.blocks, { max: SPOTS, perTask: SPOTS, floor: 0, exclude: skip }).map(s => [s.x.slug as string, s.score as number])) : null;
  // A stand-in must make what this step hands on (or, when it hands nothing on, what it makes).
  const handed = next ? [...handsOver(b)].filter(t => next.inputs.some(p => p.type === t)) : [];
  const role = handed.length ? handed : [...new Set(b.outputs.map(p => p.type))];
  // Best: ranked on both sides. Then makers of what the next step needs, then steps after the previous one.
  const tiers: [string, number][][] = [[], [], []];
  for (const slug of new Set([...(after?.keys() ?? []), ...(before?.keys() ?? [])])) {
    const x = c.bySlug[slug];
    if (!x || (role.length && !role.some(t => (handsOver(x) as Set<string>).has(t)))) continue;
    const both = (!after || after.has(slug)) && (!before || before.has(slug));
    tiers[both ? 0 : before?.has(slug) ? 1 : 2].push([slug, (after?.get(slug) ?? 0) + (before?.get(slug) ?? 0)]);
  }
  return tiers.flatMap(t => t.sort((p, q) => q[1] - p[1] || p[0].localeCompare(q[0]))).slice(0, n).map(([slug]) => slug);
}

/** Data-flow order: each step after the steps it takes from (stable; the submitted order where nothing forces a move).
 *  `soft`: optional inputs only a later step makes (a check that can also read the design); kept when they fit. */
function dataFlowOrder(check: Chain, keep: number[], same: Map<number, number>, soft?: Map<number, Set<number>>): number[] | null {
  const deps = new Map(keep.map(i => [i, new Set<number>(soft?.get(i) ?? [])]));
  for (const i of keep) for (const p of check.steps[i]?.inputs ?? []) {
    const from = p.status === "from_step" ? p.from : p.status === "out_of_order" ? p.made_later_by : undefined;
    const dep = from === undefined ? undefined : same.get(from) ?? from;
    if (dep !== undefined && dep !== i && deps.has(dep)) deps.get(i)!.add(dep);
  }
  const placed: number[] = [], done = new Set<number>();
  while (placed.length < keep.length) {
    const ready = keep.find(i => !done.has(i) && [...deps.get(i)!].every(d => done.has(d)));
    if (ready === undefined) return null; // A cycle: no order satisfies every step, so the order is left alone.
    placed.push(ready); done.add(ready);
  }
  return placed;
}

/**
 * Checks `list` (catalogue slugs or custom parts, in order) and suggests changes. `supplied`: input types the user
 * gives. `labels` name steps in the check's messages. `alternatives`: swap options listed per step.
 */
export function checkWorkflow(c: Library, list: (string | Part)[], { supplied = [], labels, alternatives = 2 }: { supplied?: string[]; labels?: string[]; alternatives?: number } = {}): WorkflowCheck {
  const check = chain(c, list, { supplied, labels });
  const slugs = list.map(slugOf), suggestions: Suggestion[] = [];
  // 1. A step listed twice: keep the first.
  const first = new Map<string, number>(), same = new Map<number, number>(), keep: number[] = [];
  slugs.forEach((s, i) => {
    if (first.has(s)) { same.set(i, first.get(s)!); suggestions.push({ kind: "remove", step: i, duplicate_of: first.get(s)! }); }
    else { first.set(s, i); keep.push(i); }
  });
  // 2. Steps that need something only a later step makes: move the maker earlier (the whole data-flow order at once).
  // Only a move a required input forces is suggested; optional inputs made later then settle where the moved steps go.
  const parts = list.map(s => partOf(c, s)), made = parts.map(b => b ? handsOver(b) as Set<string> : new Set<string>());
  const soft = new Map(keep.map(i => [i, new Set(keep.filter(j => j > i && (parts[i]?.inputs ?? []).some(p => !p.required && made[j].has(p.type) && !made.slice(0, i).some(m => m.has(p.type)))))]));
  const forced = check.problems.some(p => p.problem === "out_of_order");
  const order = (forced ? dataFlowOrder(check, keep, same, soft) ?? dataFlowOrder(check, keep, same) : null) ?? keep;
  if (order.some((i, k) => i !== keep[k])) suggestions.push({ kind: "reorder", order, moves: check.problems.filter(p => p.problem === "out_of_order" && p.made_later_by !== undefined).map(p => ({ step: p.made_later_by!, before: p.step, type: p.type })) });
  // 3. A specific input no step makes: add its best maker right before the first step that needs it.
  const inserts = new Map<string, Extract<Suggestion, { kind: "insert" }>>();
  for (const p of check.problems) {
    if (p.problem !== "missing" || !p.makers?.length || same.has(p.step)) continue;
    const slug = p.makers[0], at = inserts.get(slug);
    if (at) { if (!at.makes.includes(p.type)) at.makes.push(p.type); if (!at.for_steps.includes(p.step)) at.for_steps.push(p.step); continue; }
    inserts.set(slug, { kind: "insert", before: p.step, slug, makes: [p.type], for_steps: [p.step], alternatives: p.makers.slice(1) });
  }
  for (const s of inserts.values()) s.before = order.find(i => s.for_steps.includes(i)) ?? s.before;
  suggestions.push(...inserts.values());
  // 4. A step with a missing input: a step in its place that the shared ranking puts there and that needs nothing missing.
  const fits = (i: number, slug: string) => !chain(c, list.map((s, k) => k === i ? slug : s), { supplied }).problems.some(p => p.step === i);
  const options = list.map((_, i) => swapOptions(c, list, i, Math.max(alternatives, check.problems.some(p => p.step === i && p.problem === "missing") ? 5 : 0)));
  for (const i of new Set(check.problems.filter(p => p.problem === "missing").map(p => p.step))) {
    const fixes = check.problems.filter(p => p.step === i && p.problem === "missing").map(p => p.type);
    const better = options[i].find(slug => fits(i, slug));
    if (better) suggestions.push({ kind: "swap", step: i, slug: better, fixes });
  }
  // The proposal: duplicates removed, data-flow order, makers added. Swaps stay the user's choice.
  const steps: (string | Part)[] = [], from: (number | null)[] = [];
  for (const i of order) {
    // Steps added in the same place go in data-flow order too: a maker of what another added step needs comes first.
    const here = [...inserts.values()].filter(s => s.before === i);
    while (here.length) {
      const k = Math.max(0, here.findIndex(s => !here.some(o => o !== s && (c.bySlug[s.slug]?.inputs ?? []).some(p => (handsOver(c.bySlug[o.slug]) as Set<string>).has(p.type)))));
      steps.push(here.splice(k, 1)[0].slug); from.push(null);
    }
    steps.push(list[i]); from.push(i);
  }
  const changed = steps.length !== list.length || from.some((f, k) => f !== k);
  return { check, suggestions, alternatives: options.map((o, i) => o.slice(0, alternatives).map(slug => ({ slug, fits: fits(i, slug) }))), proposed: { steps, from, check: changed ? chain(c, steps, { supplied }) : check, changed } };
}
