import { WORKFLOW_NOTES_LIMIT } from "./workflow-limits.ts";
import { validateCustomSkills, withCustomSkills, type CustomSkill } from "./custom-skills";
import { assignedCustomMinds, validateCustomMinds, withCustomMinds, type CustomMind } from "./custom-minds";
// The builder's helpers that work on a whole workflow: what to gather, what passes along each connection,
// a tidy layout, a plan from a goal, and a link that carries the workflow. Plain code, same input, same answer.
import { deflateSync, Inflate, strFromU8, strToU8 } from "fflate";
import { type Catalogue, portLabel, wireSteps, workflowEntries } from "./data";
import { orderFlow } from "./handoff-core";
import { type Flow, type FlowEdge, type FlowNode, TEAM_MAX, uid } from "./store";

/** What one step hands the next: the types it makes that the next one reads. Empty when they don't match. */
export function passes(c: Catalogue, from: string, to: string): string[] {
  const a = c.bySlug[from], b = c.bySlug[to];
  if (!a || !b) return [];
  const reads = new Set(b.inputs.map((p) => p.type));
  return a.outputs.filter((p) => reads.has(p.type)).map((p) => p.type);
}
/** The words on a connection: "org context", "ad copy + brief". */
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
  const parent = c.blocks.find(b => b.name === name && ["workflow", "agent"].includes(b.type) && JSON.stringify(workflowEntries(b)) === JSON.stringify(slugs));
  const f: Flow = { id: uid(), name, nodes, edges, updated: Date.now(), ...(parent && !slugs.includes(parent.slug) ? { governingSkills: [parent.slug] } : {}) };
  return tidy(f) ?? f;
}

// ---- Share by link ----

// r and o are each step's role and notes; g and gn the Start node's goal and notes; k each step's mind; ov the overseer;
// t the team (tm its mode). All optional, so old links still open.
type Packed = { gs?: string[]; cm?: CustomMind[]; ks?: string[][]; cs?: CustomSkill[]; v: 1; n: string; s: string[]; p: [number, number][]; e: [number, number][]; m: number[]; r?: string[]; o?: string[]; g?: string; gn?: string; k?: string[]; ov?: string; t?: string[]; tm?: "split" | "together"; b?: { t: string; f: number; i: string }[][] };
const b64 = (u: Uint8Array) => {
  let text = "";
  for (let i = 0; i < u.length; i += 8192) text += String.fromCharCode(...u.subarray(i, i + 8192));
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (ch) => ch.charCodeAt(0));
function readPacked(code: string): Packed {
  if (code.length > 200000) throw Error("Workflow link is too large.");
  const chunks: Uint8Array[] = []; let total = 0;
  const stream = new Inflate(chunk => {
    total += chunk.length;
    if (total > 1048576) throw Error("Expanded workflow is too large.");
    chunks.push(chunk);
  });
  const input = unb64(code);
  for (let i = 0; i < input.length; i += 512) stream.push(input.subarray(i, i + 512), i + 512 >= input.length);
  const bytes = new Uint8Array(total); let at = 0;
  for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.length; }
  return JSON.parse(strFromU8(bytes));
}

/** The whole workflow (steps, connections, layout) packed small enough for a link. */
export function packFlow(flow: Flow): string {
  const idx = Object.fromEntries(flow.nodes.map((n, i) => [n.id, i]));
  const data: Packed = {
    v: 1, gs: flow.governingSkills, cm: assignedCustomMinds(flow, flow.customMinds ?? []), cs: flow.customSkills, n: flow.name, s: flow.nodes.map((n) => n.slug),
    p: flow.nodes.map((n) => [Math.round(n.x / 10), Math.round(n.y / 10)]),
    e: flow.edges.filter((e) => e.from in idx && e.to in idx).map((e) => [idx[e.from], idx[e.to]]),
    m: flow.nodes.flatMap((n, i) => (n.ecommerce ? [i] : [])),
  };
  if (flow.nodes.some((n) => n.role)) data.r = flow.nodes.map((n) => n.role ?? "");
  if (flow.nodes.some((n) => n.notes)) data.o = flow.nodes.map((n) => n.notes ?? "");
  if (flow.nodes.some(n => n.bindings?.length)) data.b = flow.nodes.map(n => (n.bindings ?? []).filter(b => b.from in idx).map(b => ({ t: b.type, f: idx[b.from], i: b.instruction })));
  if (flow.goal) data.g = flow.goal;
  if (flow.notes) data.gn = flow.notes;
  if (flow.nodes.some((n) => n.mind)) data.k = flow.nodes.map((n) => n.mind ?? "");
  if (flow.nodes.some(n => n.minds)) data.ks = flow.nodes.map(n => n.minds ?? (n.mind ? [n.mind] : []));
  if (flow.overseer) data.ov = flow.overseer;
  if (flow.team?.minds.length) { data.t = flow.team.minds; data.tm = flow.team.mode; }
  return b64(deflateSync(strToU8(JSON.stringify(data)), { level: 9 }));
}

const clip = (s: unknown, n: number) => (typeof s === "string" && s.trim() ? s.slice(0, n) : undefined);

/** Import is all-or-nothing. Missing skills and malformed plans must never become shorter workflows. */
export function unpackFlow(c: Catalogue, code: string): Flow | null {
  const mindOk = (s: unknown) => (typeof s === "string" && c.bySlug[s]?.type === "mind" ? s : undefined);
  try {
    const d = readPacked(code);
    if (d.v !== 1 || !Array.isArray(d.s)) return null;
    const customSkills = validateCustomSkills(d.cs), customMinds = validateCustomMinds(d.cm); c = withCustomMinds(withCustomSkills(c, customSkills), customMinds);
    if (d.s.length > 40 || d.s.some(s => typeof s !== "string" || !c.bySlug[s])) return null;
    for (const [values, limit] of [[d.r, 120], [d.o, 2000]] as const) if (values !== undefined && (!Array.isArray(values) || values.some(s => typeof s !== "string" || s.length > limit))) return null;
    if ((d.g !== undefined && (typeof d.g !== "string" || d.g.length > 10000)) || (d.gn !== undefined && (typeof d.gn !== "string" || d.gn.length > WORKFLOW_NOTES_LIMIT))) return null;
    if (d.t !== undefined && (!Array.isArray(d.t) || d.t.length > TEAM_MAX || d.t.some(s => !mindOk(s)))) return null;
    if ((d.ov && !mindOk(d.ov)) || (d.k !== undefined && (!Array.isArray(d.k) || d.k.some(s => s && !mindOk(s))))) return null;
    if (d.ks !== undefined && (!Array.isArray(d.ks) || d.ks.some(list => !Array.isArray(list) || list.length > TEAM_MAX || list.some(s => !mindOk(s))))) return null;
    const ids = d.s.map(() => uid());
    const nodes: FlowNode[] = d.s.map((slug, i) => ({ id: ids[i], slug, x: (d.p?.[i]?.[0] ?? i * 30) * 10, y: (d.p?.[i]?.[1] ?? 11) * 10, ecommerce: d.m?.includes(i) || undefined, role: clip(d.r?.[i], 120), notes: clip(d.o?.[i], 2000), mind: mindOk(d.k?.[i]) }));
    const team = d.t ?? [];
    if (!nodes.length && !team.length) return null;
    if (!Array.isArray(d.e) || d.e.some(pair => !Array.isArray(pair) || pair.length !== 2 || pair.some(n => !Number.isInteger(n) || n < 0 || n >= ids.length) || pair[0] === pair[1]) || new Set(d.e.map(pair => pair.join(","))).size !== d.e.length) return null;
    const edges: FlowEdge[] = d.e.map(([a, b]) => ({ id: uid(), from: ids[a], to: ids[b] }));
    if (!orderFlow({ nodes, edges } as Flow)) return null;
    if (d.b !== undefined && (!Array.isArray(d.b) || d.b.length > nodes.length || d.b.some((list, i) => !Array.isArray(list) || list.length > 20 || list.some(b => !b || typeof b.t !== "string" || b.t.length > 100 || typeof b.i !== "string" || b.i.length > 2000 || !Number.isInteger(b.f) || !edges.some(e => e.from === ids[b.f] && e.to === nodes[i]?.id) || !c.bySlug[nodes[i]?.slug]?.inputs.some(p => p.type === b.t))))) return null;
    for (const node of nodes) {
      const i = ids.indexOf(node.id);
      if (Array.isArray(d.ks?.[i])) node.minds = [...new Set(d.ks![i])];
      if (Array.isArray(d.b?.[i])) node.bindings = d.b![i].map(b => ({ type: b.t, from: ids[b.f], instruction: b.i }));
    }
    if (d.gs !== undefined && (!Array.isArray(d.gs) || d.gs.length > 20 || d.gs.some(s => typeof s !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(s)))) return null;
    return { governingSkills: d.gs, customMinds, customSkills, id: uid(), name: String(d.n || "Shared workflow").slice(0, 80), nodes, edges, updated: Date.now(), goal: clip(d.g, 10000), notes: clip(d.gn, WORKFLOW_NOTES_LIMIT), overseer: mindOk(d.ov), team: team.length ? { minds: team, mode: d.tm === "together" ? "together" : "split" } : undefined };
  } catch {
    return null;
  }
}
export const shareUrl = (flow: Flow) => `${location.origin}/?flow=${packFlow(flow)}#build`;
