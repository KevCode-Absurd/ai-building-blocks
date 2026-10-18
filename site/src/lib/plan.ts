// The builder's helpers that work on a whole workflow: what to gather, what passes along each connection,
// a tidy layout, a plan from a goal, and a link that carries the workflow. Plain code, same input, same answer.
import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { type Block, type Catalogue, kindOf, portLabel, taskOf, wireSteps } from "./data";
import { orderFlow } from "./handoff";
import { type Flow, type FlowEdge, type FlowNode, uid } from "./store";

/** What one step hands the next: the types it makes that the next one reads. Empty when they don't match. */
export function passes(c: Catalogue, from: string, to: string): string[] {
  const a = c.bySlug[from], b = c.bySlug[to];
  if (!a || !b) return [];
  const reads = new Set(b.inputs.map((p) => p.type));
  return a.outputs.filter((p) => reads.has(p.type)).map((p) => p.type);
}
/** The words on a connection: "brand file", "ad copy + brief". */
export function passLabel(c: Catalogue, from: string, to: string): string {
  const t = passes(c, from, to);
  const shown = t.length ? t : (c.bySlug[from]?.outputs ?? []).slice(0, 1).map((p) => p.type);
  return shown.slice(0, 2).map((x) => portLabel(x).toLowerCase()).join(" + ") + (t.length > 2 ? " +" : "");
}

const COL = 360, ROW = 190, PER_ROW = 3;
/** Lines the steps up: each one a column to the right of what it reads, three columns to a row.
 *  Returns null when the workflow loops, since there's no start to line up from. */
export function tidy(flow: Flow): Flow | null {
  const order = orderFlow(flow);
  if (!order) return null;
  const depth: Record<string, number> = {};
  for (const o of order) depth[o.node.id] = Math.max(-1, ...flow.edges.filter((e) => e.to === o.node.id).map((e) => depth[e.from] ?? -1)) + 1;
  const layers: FlowNode[][] = [];
  for (const o of order) (layers[depth[o.node.id]] ??= []).push(o.node);
  for (const l of layers) l.sort((a, b) => a.y - b.y || a.x - b.x);
  const pos: Record<string, { x: number; y: number }> = {};
  let top = 110;
  for (let band = 0; band * PER_ROW < layers.length; band++) {
    const cols = layers.slice(band * PER_ROW, band * PER_ROW + PER_ROW);
    cols.forEach((l, col) => l.forEach((n, row) => { pos[n.id] = { x: 40 + col * COL, y: top + row * ROW }; }));
    top += Math.max(...cols.map((l) => l.length)) * ROW;
  }
  return { ...flow, nodes: flow.nodes.map((n) => ({ ...n, ...pos[n.id] })) };
}

/** A workflow laid out from a list of steps, wired the usual way and tidied. */
export function flowFrom(c: Catalogue, name: string, slugs: string[]): Flow {
  const nodes: FlowNode[] = slugs.map((slug) => ({ id: uid(), slug, x: 0, y: 0 }));
  const edges: FlowEdge[] = wireSteps(c, slugs).map(([a, b]) => ({ id: uid(), from: nodes[a].id, to: nodes[b].id }));
  const f: Flow = { id: uid(), name, nodes, edges, updated: Date.now() };
  return tidy(f) ?? f;
}

// ---- Start from a goal ----

const STOP = new Set("a an the for my our your of to from and i we want need get make me with that this in on into it some new can do how help".split(" "));
const stem = (w: string) => w.replace(/ies$/, "y").replace(/(?<=\w{3})(es|s)$/, "").replace(/(?<=\w{3})(ing|ed)$/, "");
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean).map(stem);
// Verbs that say how, not what. A goal has to match on what it's about, not only on these.
const GENERIC = new Set("write find know turn check stop fix create build plan start run use show tell better more good best quick fast easy".split(" ").map(stem));
const tokens = (goal: string) => [...new Set(words(goal).filter((w) => !STOP.has(w) && w.length > 1))];
const hits = (toks: string[], text: string) => { const h = new Set(words(text)); return toks.filter((t) => h.has(t) || (t.length >= 4 && [...h].some((w) => w.startsWith(t)))).length; };

export type Plan = { slugs: string[]; name: string; from: { workflow: Block } | { target: Block } };

/** Turns "a landing page for my best ad" into steps. A ready workflow that matches wins; otherwise it finds the
 *  block that makes the result, then works backwards to the steps that make what it needs, and ends with a check. */
export function planFromGoal(c: Catalogue, goal: string): Plan | null {
  const toks = tokens(goal);
  if (!toks.length) return null;
  const name = goal.trim().replace(/^./, (m) => m.toUpperCase()).slice(0, 80);
  const flowsList = c.blocks.filter((b) => b.category === "orchestrator");

  const wf = flowsList
    .map((b) => ({ b, h: hits(toks, `${b.name} ${b.headline} ${b.summary}`) }))
    .filter((x) => x.h >= 2 && x.h / toks.length >= 0.6)
    .sort((x, y) => y.h - x.h || y.b.steps.length - x.b.steps.length)[0];
  if (wf) return { slugs: wf.b.steps.map((s) => s.uses).filter((s) => c.bySlug[s]), name, from: { workflow: wf.b } };

  const pool = c.blocks.filter((b) => b.category !== "orchestrator");
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
      const best = makers[p.type]
        .filter((m) => m.slug !== b.slug && !picked.includes(m.slug))
        .map((m) => ({ m, s: (before.get(b.slug)?.has(m.slug) ? 6 : 0) + hits(toks, `${m.name} ${m.summary}`) * 2 + m.usedIn * 0.2 + (kindOf(m) === "skill" ? 1 : 0) - m.inputs.filter((q) => q.required && makers[q.type] && !have.has(q.type)).length * 0.5 }))
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
      .filter((b) => b.role === "check" && b.task !== "set-up-ai" && !picked.includes(b.slug) && b.inputs.some((p) => p.required && made.has(p.type)))
      .sort((x, y) => y.usedIn - x.usedIn)[0];
    if (check) add(check);
  }
  return { slugs: picked, name, from: { target: target.b } };
}

// ---- Share by link ----

type Packed = { v: 1; n: string; s: string[]; p: [number, number][]; e: [number, number][]; m: number[] };
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (ch) => ch.charCodeAt(0));

/** The whole workflow (steps, connections, layout) packed small enough for a link. */
export function packFlow(flow: Flow): string {
  const idx = Object.fromEntries(flow.nodes.map((n, i) => [n.id, i]));
  const data: Packed = {
    v: 1, n: flow.name, s: flow.nodes.map((n) => n.slug),
    p: flow.nodes.map((n) => [Math.round(n.x / 10), Math.round(n.y / 10)]),
    e: flow.edges.filter((e) => e.from in idx && e.to in idx).map((e) => [idx[e.from], idx[e.to]]),
    m: flow.nodes.flatMap((n, i) => (n.ecommerce ? [i] : [])),
  };
  return b64(deflateSync(strToU8(JSON.stringify(data)), { level: 9 }));
}

/** Opens a packed workflow as a new one. Steps no longer in the library are dropped. Null if the link is broken. */
export function unpackFlow(c: Catalogue, code: string): Flow | null {
  try {
    const d = JSON.parse(strFromU8(inflateSync(unb64(code)))) as Packed;
    if (d.v !== 1 || !Array.isArray(d.s)) return null;
    const ids = d.s.slice(0, 40).map(() => uid());
    const nodes: FlowNode[] = d.s.slice(0, 40).flatMap((slug, i) => (c.bySlug[slug] ? [{ id: ids[i], slug, x: (d.p?.[i]?.[0] ?? i * 30) * 10, y: (d.p?.[i]?.[1] ?? 11) * 10, ecommerce: d.m?.includes(i) || undefined }] : []));
    if (!nodes.length) return null;
    const kept = new Set(nodes.map((n) => n.id));
    const edges: FlowEdge[] = (d.e ?? []).filter(([a, b]) => kept.has(ids[a]) && kept.has(ids[b]) && a !== b).map(([a, b]) => ({ id: uid(), from: ids[a], to: ids[b] }));
    return { id: uid(), name: String(d.n || "Shared workflow").slice(0, 80), nodes, edges, updated: Date.now() };
  } catch {
    return null;
  }
}
export const shareUrl = (flow: Flow) => `${location.origin}/?flow=${packFlow(flow)}#build`;
