// Minds working inside a workflow (docs/MINDS-PRD.md §6e): a mind on a step, one overseer for the whole run, and a team
// council of up to six. Plain code, so the same workflow always gives the same assignments.
import { type Block, type Catalogue, areasOf } from "./data";
import type { Ordered } from "./handoff";
import type { Flow } from "./store";

export const isMind = (c: Catalogue, slug: string | undefined) => !!slug && c.bySlug[slug]?.type === "mind";
export const mindName = (c: Catalogue, slug: string) => c.bySlug[slug]?.name.split(" (")[0] ?? slug;
export const mindsIn = (c: Catalogue) => c.blocks.filter((b) => b.type === "mind").sort((a, b) => a.name.localeCompare(b.name));

/** Minds whose area fits this step's job, best first, for the step panel's suggestions. */
export function suggestMinds(c: Catalogue, b: Block, n = 4): Block[] {
  const want = new Set(areasOf(b));
  const fit = (m: Block) => [m.area ?? "", ...(m.also ?? [])].reduce((s, a, i) => s + (want.has(a) ? (i === 0 ? 2 : 1) : 0), 0);
  return mindsIn(c).map((m) => ({ m, f: fit(m) })).filter((x) => x.f > 0).sort((a, b) => b.f - a.f || a.m.name.localeCompare(b.m.name)).slice(0, n).map((x) => x.m);
}

export type Lead = { mind: string; from: "you" | "team" };

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
    if (o.node.mind && isMind(c, o.node.mind)) { out[o.step] = { mind: o.node.mind, from: "you" }; continue; }
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
  const leads = Object.values(leadsOf(c, flow, order)).map((l) => l.mind);
  return [...new Set([...leads, ...(isMind(c, flow.overseer) ? [flow.overseer!] : []), ...(flow.team?.minds ?? []).filter((s) => isMind(c, s))])];
}
