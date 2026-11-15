// The step map: which step to start a request with, what goes before and after a step, and whether an ordered list of
// steps hands each one what it needs. Used by the public MCP and API (server/public-catalogue.ts); the site builder
// can use it too. Plain code, no AI: the same catalogue and request always give the same answer.
//
// One ranking everywhere. First steps are the builder's "Start with" picks (composer-core startPicks, on the library
// search in goal.ts). Before and after come from next-steps.mjs (previousSteps, nextSteps) with the options the
// builder's suggestBefore and suggestNext use; those two wrappers import browser modules (lib/data.ts), so the
// Worker calls the shared ranking directly.
import { startPicks, type Library, type Part } from "./composer-core.ts";
import { handsOver, isLoosePort, nextSteps, previousSteps } from "./next-steps.mjs";

/** The org context builder makes the product facts and buyers nearly every line of work reads (suggest-before.ts). */
const MAKERS = ["website-brand-brain-builder"];
const notAgent = (x: Part) => x.type === "agent";
const required = (b: Part) => b.inputs.filter(p => p.required).map(p => p.type);
const makes = (b: Part) => [...new Set(b.outputs.map(p => p.type))];

/** A step next to another one. `ports`: what is handed over between them (the receiver's inputs the giver makes),
 *  strongest first; `required`: the receiver cannot start without one of them; `basis`: the evidence. */
export type Handoff = { slug: string; name: string; ports: string[]; required: boolean; basis: "ready_workflow" | "hand_off" | "built_on" };
/** Each required input of a step and the best steps that make it (empty: the user gives it). */
export type Needs = { type: string; made_by: string[] }[];
export type Around = { before: Handoff[]; after: Handoff[]; needs: Needs };
export type Pick = { slug: string; name: string; summary: string; needs: string[]; makes: string[]; why: string };
export type FirstSteps = { steps: Pick[]; workflows: (Pick & { steps: string[] })[] };

export const pickOf = (b: Part, why = ""): Pick => ({ slug: b.slug, name: b.name, summary: b.summary, needs: required(b), makes: makes(b), why });
const basis = (follows: number, takes: string[]): Handoff["basis"] => follows ? "ready_workflow" : takes.length ? "hand_off" : "built_on";

/** First (anchor) steps for a request, best first: single steps that make what is asked for, and up to two ready
 *  workflows that already do the whole job. A fitting ready workflow should be used before assembling parts. */
export function firstSteps(c: Library, request: string, n = 5): FirstSteps {
  const { tasks, workflows } = startPicks(c, request, n);
  return {
    steps: tasks.map(t => pickOf(t.b, t.why)),
    workflows: workflows.map(w => ({ ...pickOf(w.b, w.why), steps: (w.b.steps ?? []).map(s => s.uses) })),
  };
}

/** The best makers of each of `types` among the steps that could go before `b` (previousSteps, with every
 *  candidate kept), at most `per` for each type. */
function makersOf(c: Library, b: Part, types: string[], per: number, skip: (x: Part) => boolean): Map<string, string[]> {
  const found = new Map(types.map(t => [t, [] as string[]]));
  if (!types.length) return found;
  for (const { x } of previousSteps(b, c.blocks, { max: 40, perTask: 40, floor: 0, exclude: skip, makers: MAKERS })) {
    const made = handsOver(x);
    for (const [t, list] of found) if (list.length < per && made.has(t)) list.push(x.slug);
  }
  return found;
}

/** What goes before a step (makers of what it reads) and after it (steps that take what it makes), best first, and
 *  `needs`: who makes each required input, so no required input is left to chance when the short lists miss it.
 *  `exclude` hides items (unpublished ones, or steps already chosen). */
export function around(c: Library, slug: string, { max = 5, floor, exclude = () => false }: { max?: number; floor?: number; exclude?: (x: Part) => boolean } = {}): Around {
  const b = c.bySlug[slug];
  if (!b) return { before: [], after: [], needs: [] };
  const skip = (x: Part) => notAgent(x) || exclude(x);
  const before = previousSteps(b, c.blocks, { max, floor, exclude: skip, makers: MAKERS }).map(({ x, follows, takes }) => ({
    slug: x.slug, name: x.name, ports: takes, required: takes.some(t => b.inputs.some(p => p.required && p.type === t)), basis: basis(follows, takes),
  }));
  const after = nextSteps(b, c.blocks, { max, floor, perTask: 3, siblings: false, exclude: skip }).map(({ x, follows, takes }) => ({
    slug: x.slug, name: x.name, ports: takes, required: takes.some(t => (x as Part).inputs.some(p => p.required && p.type === t)), basis: basis(follows, takes),
  }));
  const needs = [...makersOf(c, b, required(b), 2, skip)].map(([type, made_by]) => ({ type, made_by }));
  return { before, after, needs };
}

/** One input of one step in an ordered chain. `from`: the earlier step (0-based) that makes it. */
export type ChainInput = { type: string; required: boolean; status: "from_step" | "user" | "missing" | "out_of_order"; from?: number; made_later_by?: number; makers?: string[] };
export type ChainProblem = { step: number; slug: string; type: string; problem: "missing" | "out_of_order"; message: string; makers?: string[]; made_later_by?: number };
export type Chain = { ok: boolean; steps: { slug: string; inputs: ChainInput[] }[]; problems: ChainProblem[]; user_inputs: string[] };

/** Types no step makes: raw material only the user has (their results sheet, their page). */
const MADE = new WeakMap<Part[], Set<string>>();
function madeAnywhere(all: Part[]) {
  let found = MADE.get(all);
  if (!found) { found = new Set(all.filter(b => b.type !== "mind").flatMap(b => [...handsOver(b)] as string[])); MADE.set(all, found); }
  return found;
}

/**
 * Checks an ordered list of steps: for each step, which inputs an earlier step makes (the nearest one), which the
 * user supplies, and which are missing. A required input is the user's to give when it is the first step's, when the
 * user said they have it (`supplied`), when it is a loose type (a brief, a document, product facts: next-steps.mjs
 * isLoosePort) or when no step in the library makes it. A specific one (ad copy, a landing page) that no earlier step
 * makes is missing: add a step that makes it, or ask the user for an existing one. A required specific input that
 * only a later step makes means the steps are out of order. Steps may be catalogue slugs or custom parts; `labels`
 * name them in messages (default "Step 2 (slug)").
 */
export function chain(c: Library, list: (string | Part)[], { supplied = [], labels }: { supplied?: Iterable<string>; labels?: string[] } = {}): Chain {
  const have = new Set(supplied), parts = list.map(s => typeof s === "string" ? c.bySlug[s] : s);
  const named = (i: number) => labels?.[i] ?? `Step ${i + 1} (${parts[i]?.slug ?? list[i]})`;
  const made = parts.map(b => b ? handsOver(b) as Set<string> : new Set<string>());
  const problems: ChainProblem[] = [], asked = new Set<string>();
  const steps = parts.map((b, i) => {
    const slug = typeof list[i] === "string" ? list[i] as string : (list[i] as Part).slug;
    if (!b) return { slug, inputs: [] };
    const inputs: ChainInput[] = [];
    for (const p of b.inputs) {
      let from = -1;
      for (let j = i - 1; j >= 0; j--) if (made[j].has(p.type)) { from = j; break; }
      if (from >= 0) { inputs.push({ type: p.type, required: p.required, status: "from_step", from }); continue; }
      if (!p.required) continue;
      if (have.has(p.type)) { inputs.push({ type: p.type, required: true, status: "user" }); asked.add(p.type); continue; }
      // A loose type (a document, a plan) made later is a different one: the user gives this step its own.
      const loose = isLoosePort(p.type, c.blocks), later = loose ? -1 : made.findIndex((m, k) => k > i && m.has(p.type));
      if (later >= 0) {
        inputs.push({ type: p.type, required: true, status: "out_of_order", made_later_by: later });
        problems.push({ step: i, slug, type: p.type, problem: "out_of_order", made_later_by: later, message: `${named(i)} needs ${p.type}, which only a later step makes: ${named(later)}. Move that step earlier.` });
        continue;
      }
      if (i === 0 || loose || !madeAnywhere(c.blocks).has(p.type)) { inputs.push({ type: p.type, required: true, status: "user" }); asked.add(p.type); continue; }
      const makers = makersOf(c, b, [p.type], 2, notAgent).get(p.type)!;
      inputs.push({ type: p.type, required: true, status: "missing", makers });
      problems.push({ step: i, slug, type: p.type, problem: "missing", makers, message: `${named(i)} needs ${p.type}, but no earlier step makes it. Add a step that makes it${makers.length ? ` (such as ${makers.join(" or ")})` : ""}, or ask the user for an existing one.` });
    }
    return { slug, inputs };
  });
  return { ok: !problems.length, steps, problems, user_inputs: [...asked] };
}
