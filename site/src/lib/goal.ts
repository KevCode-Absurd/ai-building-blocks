// Starting from a goal: "a landing page for my best ad" becomes the steps that make it, or the pages to read.
// Plain code, no AI: the same words always give the same answer.
import { type Block, type Catalogue, kindOf, portLabel, taskOf, workflowEntries } from "./data";
import { GENERIC_PORTS, sameFamily } from "./next-steps.mjs";

export const GOAL_EXAMPLES = ["a landing page for my best ad", "video ads from my reviews", "find why my ads stopped selling"];

const STOP = new Set("a an the for my our your of to from and i we want need get make me with that this in on into it some new can do how help".split(" "));
const stem = (w: string) => w.replace(/ies$/, "y").replace(/(?<=\w{3})(es|s)$/, "").replace(/(?<=\w{3})(ing|ed)$/, "");
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean).map(stem);
// Verbs that say how, not what. A goal has to match on what it's about, not only on these.
const GENERIC = new Set("write find know turn check stop fix create build plan start run use show tell better more good best quick fast easy".split(" ").map(stem));
const tokens = (goal: string) => [...new Set(words(goal).filter((w) => !STOP.has(w) && w.length > 1))];
const hits = (toks: string[], text: string) => {
  const h = new Set(words(text));
  let n = 0;
  for (const t of toks) { if (h.has(t)) n++; else if (t.length >= 4) for (const w of h) if (w.startsWith(t)) { n++; break; } }
  return n;
};

export type Plan = { slugs: string[]; name: string; from: { workflow: Block } | { target: Block } };

/** Turns "a landing page for my best ad" into steps. A ready workflow that matches wins; otherwise it finds the
 *  block that makes the result, then works backwards to the steps that make what it needs, and ends with a check. */
export function planFromGoal(c: Catalogue, goal: string): Plan | null {
  const toks = tokens(goal);
  if (!toks.length) return null;
  const name = goal.trim().replace(/^./, (m) => m.toUpperCase()).slice(0, 80);
  const flowsList = c.blocks.filter((b) => b.category === "orchestrator");

  // A ready workflow's old titles and its slug say the job in plain words ("open-a-shopify-store-and-take-your-first-order").
  const topicalToks = toks.filter((t) => !GENERIC.has(t));
  const wf = flowsList
    .map((b) => { const text = `${b.name} ${b.headline} ${b.summary} ${(b.aliases ?? []).join(" ")} ${b.slug.replace(/-/g, " ")}`; return { b, h: hits(toks, text), topical: hits(topicalToks, text) }; })
    .filter((x) => x.h >= 2 && x.h / toks.length >= 0.6 && (!topicalToks.length || x.topical > 0))
    .sort((x, y) => y.h - x.h || y.topical - x.topical || y.b.steps.length - x.b.steps.length)[0];
  if (wf) return { slugs: workflowEntries(wf.b).filter((s) => c.bySlug[s]), name, from: { workflow: wf.b } };

  const pool = c.blocks.filter((b) => b.category !== "orchestrator" && b.type !== "agent");
  const scoreOf = (b: Block) => hits(toks, b.name) * 3 + hits(toks, `${b.headline} ${b.summary}`) + hits(toks, `${b.outputs.map((p) => portLabel(p.type)).join(" ")} ${taskOf(b).name}`) * 2;
  const ranked = pool.map((b) => ({ b, s: scoreOf(b) + (kindOf(b) === "skill" ? 0.5 : 0) + b.usedIn * 0.05 })).sort((x, y) => y.s - x.s);
  const topical = toks.filter((t) => !GENERIC.has(t));
  const about = (b: Block) => hits(topical, `${b.name} ${b.headline} ${b.summary} ${b.outputs.map((p) => portLabel(p.type)).join(" ")} ${taskOf(b).name}`);
  const target = ranked.find((x) => !topical.length || about(x.b) > 0);
  if (!target || target.s < Math.min(2, toks.length)) return null;

  const makers: Record<string, Block[]> = {};
  for (const b of pool) for (const p of b.outputs) (makers[p.type] ??= []).push(b);
  // Steps that came straight before a block in a ready workflow are the best evidence of what feeds it.
  const before = new Map<string, Set<string>>();
  for (const f of flowsList) f.steps.forEach((s, i) => { if (i) (before.get(s.uses) ?? before.set(s.uses, new Set()).get(s.uses)!).add(f.steps[i - 1].uses); });

  const picked: string[] = [];
  const have = new Set<string>();
  const add = (b: Block) => { if (!picked.includes(b.slug)) { picked.push(b.slug); b.outputs.forEach((p) => have.add(p.type)); } };
  const want = (b: Block, depth: number) => {
    // Brand details feed nearly everything, so a step that can read them gets them.
    // A check reads work the person already has, so only its brand details get a step of their own.
    const needed = b.inputs.filter((p) => p.type === "brand_brain" || (p.required && !(depth === 0 && b.role === "check")));
    for (const p of needed) {
      if (have.has(p.type) || !makers[p.type] || depth >= 3 || picked.length >= 5) continue;
      // A maker that needs things nobody has yet makes the chain longer, so it loses to one that can start now.
      // A maker from another line of work (a buyer brief for a budget, a brand file for a bug fix) is not a step before it.
      const best = makers[p.type]
        .filter((m) => m.slug !== b.slug && !picked.includes(m.slug) && (before.get(b.slug)?.has(m.slug) || (GENERIC_PORTS.has(p.type) ? m.task === b.task : sameFamily(m.task, b.task))))
        .map((m) => ({ m, s: (before.get(b.slug)?.has(m.slug) ? 6 : 0) + hits(toks, `${m.name} ${m.summary}`) * 2 + m.usedIn * 0.2 + (kindOf(m) === "skill" ? 1 : 0) - m.inputs.filter((q) => q.required && makers[q.type] && !have.has(q.type)).length * 2 }))
        .sort((x, y) => y.s - x.s)[0];
      if (best) want(best.m, depth + 1);
    }
    add(b);
  };
  want(target.b, 0);

  // Finish with a check that reads what the result is, if there is one.
  if (target.b.role !== "check") {
    const made = new Set(target.b.outputs.map((p) => p.type).filter((t) => !["brief", "brand_brain", "plan"].includes(t)));
    const check = pool
      .filter((b) => b.role === "check" && b.task !== "set-up-ai" && !picked.includes(b.slug) && b.inputs.some((p) => made.has(p.type)) && sameFamily(b.task, target.b.task))
      // A check built for this kind of work (it needs it) beats one that can also read it.
      .sort((x, y) => Number(y.inputs.some((p) => p.required && made.has(p.type))) - Number(x.inputs.some((p) => p.required && made.has(p.type))) || y.usedIn - x.usedIn)[0];
    if (check) add(check);
  }
  return { slugs: picked, name, from: { target: target.b } };
}
