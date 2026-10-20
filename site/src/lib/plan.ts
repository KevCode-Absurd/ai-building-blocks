// The builder's helpers that work on a whole workflow: what to gather, what passes along each connection,
// a tidy layout, a plan from a goal, and a link that carries the workflow. Plain code, same input, same answer.
import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { type Catalogue, portLabel, wireSteps } from "./data";
import { orderFlow } from "./handoff";
import { type Flow, type FlowEdge, type FlowNode, TEAM_MAX, uid } from "./store";

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

export { planFromGoal, type Plan } from "./goal";

// ---- Share by link ----

// r and o are each step's role and notes; g and gn the Start node's goal and notes; k each step's mind; ov the overseer;
// t the team (tm its mode). All optional, so old links still open.
type Packed = { v: 1; n: string; s: string[]; p: [number, number][]; e: [number, number][]; m: number[]; r?: string[]; o?: string[]; g?: string; gn?: string; k?: string[]; ov?: string; t?: string[]; tm?: "split" | "together" };
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
  if (flow.nodes.some((n) => n.role)) data.r = flow.nodes.map((n) => n.role ?? "");
  if (flow.nodes.some((n) => n.notes)) data.o = flow.nodes.map((n) => n.notes ?? "");
  if (flow.goal) data.g = flow.goal;
  if (flow.notes) data.gn = flow.notes;
  if (flow.nodes.some((n) => n.mind)) data.k = flow.nodes.map((n) => n.mind ?? "");
  if (flow.overseer) data.ov = flow.overseer;
  if (flow.team?.minds.length) { data.t = flow.team.minds; data.tm = flow.team.mode; }
  return b64(deflateSync(strToU8(JSON.stringify(data)), { level: 9 }));
}

const clip = (s: unknown, n: number) => (typeof s === "string" && s.trim() ? s.slice(0, n) : undefined);

/** Opens a packed workflow as a new one. Steps no longer in the library are dropped. Null if the link is broken. */
export function unpackFlow(c: Catalogue, code: string): Flow | null {
  const mindOk = (s: unknown) => (typeof s === "string" && c.bySlug[s]?.type === "mind" ? s : undefined);
  try {
    const d = JSON.parse(strFromU8(inflateSync(unb64(code)))) as Packed;
    if (d.v !== 1 || !Array.isArray(d.s)) return null;
    const ids = d.s.slice(0, 40).map(() => uid());
    const nodes: FlowNode[] = d.s.slice(0, 40).flatMap((slug, i) => (c.bySlug[slug] ? [{ id: ids[i], slug, x: (d.p?.[i]?.[0] ?? i * 30) * 10, y: (d.p?.[i]?.[1] ?? 11) * 10, ecommerce: d.m?.includes(i) || undefined, role: clip(d.r?.[i], 120), notes: clip(d.o?.[i], 2000), mind: mindOk(d.k?.[i]) }] : []));
    const team = (d.t ?? []).filter((s) => mindOk(s)).slice(0, TEAM_MAX);
    if (!nodes.length && !team.length) return null;
    const kept = new Set(nodes.map((n) => n.id));
    const edges: FlowEdge[] = (d.e ?? []).filter(([a, b]) => kept.has(ids[a]) && kept.has(ids[b]) && a !== b).map(([a, b]) => ({ id: uid(), from: ids[a], to: ids[b] }));
    return { id: uid(), name: String(d.n || "Shared workflow").slice(0, 80), nodes, edges, updated: Date.now(), goal: clip(d.g, 2000), notes: clip(d.gn, 2000), overseer: mindOk(d.ov), team: team.length ? { minds: team, mode: d.tm === "together" ? "together" : "split" } : undefined };
  } catch {
    return null;
  }
}
export const shareUrl = (flow: Flow) => `${location.origin}/?flow=${packFlow(flow)}#build`;
