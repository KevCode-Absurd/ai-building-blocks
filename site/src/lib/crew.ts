// Minds working inside a workflow (docs/MINDS-PRD.md §6e): a mind on a step, one overseer for the whole run, and a team
// council of up to six. Plain code, so the same workflow always gives the same assignments.
import { type Block, type Catalogue, areasOf } from "./data";
import type { Ordered } from "./handoff";
import { TEAM_MAX, type Flow, type FlowNode } from "./store";

export const isMind = (c: Catalogue, slug: string | undefined) => !!slug && c.bySlug[slug]?.type === "mind";
export const mindName = (c: Catalogue, slug: string) => c.bySlug[slug]?.name.split(" (")[0] ?? slug;
export const mindsIn = (c: Catalogue) => c.blocks.filter((b) => b.type === "mind").sort((a, b) => a.name.localeCompare(b.name));

/** Minds whose area fits this step's job, best first, for the step panel's suggestions. */
export function suggestMinds(c: Catalogue, b: Block, n = 4): Block[] {
  // The minds whose work the skill comes from go first, in their order; then the best fits by area.
  const own = (b.minds ?? []).map((s) => c.bySlug[s]).filter((m): m is Block => !!m && m.type === "mind");
  const want = new Set(areasOf(b));
  const fit = (m: Block) => [m.area ?? "", ...(m.also ?? [])].reduce((s, a, i) => s + (want.has(a) ? (i === 0 ? 2 : 1) : 0), 0);
  const rest = mindsIn(c).filter((m) => !own.includes(m)).map((m) => ({ m, f: fit(m) })).filter((x) => x.f > 0).sort((a, b) => b.f - a.f || a.m.name.localeCompare(b.m.name)).map((x) => x.m);
  const matches = [...own, ...rest];
  // When there is no area match, offer a general critical-thinking perspective explicitly.
  const fallback = ["charlie-munger", "richard-feynman"].map(s => c.bySlug[s]).filter((m): m is Block => m?.type === "mind" && !matches.includes(m));
  return (matches.length ? matches : fallback).slice(0, n);
}

export const taskMinds = (c: Catalogue, node: Pick<FlowNode, "mind" | "minds">) => [...new Set(node.minds ?? (node.mind ? [node.mind] : []))].filter(s => isMind(c, s)).slice(0, TEAM_MAX);
export type Lead = { mind: string; from: "you" | "team"; minds?: string[] };

/** Who leads each step. A mind you picked for the step always wins. In a "split" team, every other step goes to the team
 *  member whose areas fit it best; ties go to whoever has fewer steps so far, then to the order you listed them.
 *  Steps that are minds themselves don't get another mind. */
export function leadsOf(c: Catalogue, flow: Flow, order: Ordered[]): Record<number, Lead> {
  const out: Record<number, Lead> = {};
  const team = (flow.team?.minds ?? []).filter((s) => isMind(c, s));
  const load: Record<string, number> = Object.fromEntries(team.map((s) => [s, 0]));
  for (const o of order) {
    const b = c.bySlug[o.node.slug];
    if (!b || b.type === "mind") continue;
    const selected = taskMinds(c, o.node);
    if (selected.length) { out[o.step] = { mind: selected[0], minds: selected, from: "you" }; continue; }
    if (flow.team?.mode !== "split" || !team.length) continue;
    const want = new Set(areasOf(b));
    const fit = (s: string) => { const m = c.bySlug[s]; return [m.area ?? "", ...(m.also ?? [])].reduce((n, a, i) => n + (want.has(a) ? (i === 0 ? 2 : 1) : 0), 0); };
    const pick = [...team].sort((x, y) => fit(y) - fit(x) || load[x] - load[y] || team.indexOf(x) - team.indexOf(y))[0];
    load[pick]++;
    out[o.step] = { mind: pick, from: "team" };
  }
  return out;
}

/** Every mind the download has to carry, in a fixed order: step leads, the overseer, then the team. */
export function crewSlugs(c: Catalogue, flow: Flow, order: Ordered[]): string[] {
  const leads = Object.values(leadsOf(c, flow, order)).flatMap((l) => l.minds ?? [l.mind]);
  return [...new Set([...leads, ...(isMind(c, flow.overseer) ? [flow.overseer!] : []), ...(flow.team?.minds ?? []).filter((s) => isMind(c, s))])];
}
