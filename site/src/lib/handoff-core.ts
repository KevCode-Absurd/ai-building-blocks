// Small workflow preview helpers; package assembly loads only on download.
import type {Flow, FlowNode} from "./store";
import type {Catalogue} from "./data";
import {portLabel} from "./port-label.ts";

export type Ordered = { node: FlowNode; step: number; from: number[] };

/** Topological order; ties go top to bottom, then left to right. Returns null if the graph has a cycle. */
export function orderFlow(flow: Flow): Ordered[] | null {
  const pos = (n: FlowNode) => [Math.round(n.y / 40), n.x] as const;
  const byId = Object.fromEntries(flow.nodes.map((n) => [n.id, n]));
  const indeg: Record<string, number> = Object.fromEntries(flow.nodes.map((n) => [n.id, 0]));
  const edges = flow.edges.filter((e) => byId[e.from] && byId[e.to]);
  for (const e of edges) indeg[e.to]++;
  const ready = flow.nodes.filter((n) => indeg[n.id] === 0);
  const out: FlowNode[] = [];
  const sortReady = () => ready.sort((a, b) => pos(a)[0] - pos(b)[0] || pos(a)[1] - pos(b)[1] || a.id.localeCompare(b.id));
  while (ready.length) {
    sortReady();
    const n = ready.shift()!;
    out.push(n);
    for (const e of edges) if (e.from === n.id && --indeg[e.to] === 0) ready.push(byId[e.to]);
  }
  if (out.length !== flow.nodes.length) return null;
  const stepOf = Object.fromEntries(out.map((n, i) => [n.id, i + 1]));
  return out.map((n) => ({ node: n, step: stepOf[n.id], from: edges.filter((e) => e.to === n.id).map((e) => stepOf[e.from]).sort((a, b) => a - b) }));
}

export const zipName = (name: string) => `${safeName(name)}-handoff.zip`;
export const safeName = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "workflow";

/** Something the person has to provide, because no earlier connected step makes it. */
export type Need = { type: string; label: string; about: string | null; steps: number[]; required: boolean };

export function needsOf(c: Catalogue, order: Ordered[]): Need[] {
  const blockOf = (o: Ordered) => c.bySlug[o.node.slug];
  const need = new Map<string, { steps: number[]; required: boolean }>();
  for (const o of order) {
    const b = blockOf(o);
    if (!b) continue;
    const fed = new Set(o.from.flatMap((s) => blockOf(order[s - 1])?.outputs.map((p) => p.type) ?? []));
    for (const binding of o.node.bindings ?? []) if (o.from.some(s => order[s - 1].node.id === binding.from)) fed.add(binding.type);
    for (const p of b.inputs) {
      if (fed.has(p.type)) continue;
      const n = need.get(p.type) ?? { steps: [], required: false };
      n.steps.push(o.step); n.required ||= p.required;
      need.set(p.type, n);
    }
  }
  return [...need]
    .sort((a, b) => Number(b[1].required) - Number(a[1].required) || a[1].steps[0] - b[1].steps[0])
    .map(([type, n]) => ({ type, label: portLabel(type), about: c.portTypes[type] ?? null, ...n }));
}

/** What the workflow hands back at the end: the outputs of its last steps. When a last step is a check,
 *  the work it checked comes back too, since that's what the person came for. */
export function finalOutputs(c: Catalogue, flow: Flow, order: Ordered[]) {
  const byId = Object.fromEntries(order.map((o) => [o.node.id, o.node]));
  const types: string[] = [];
  for (const o of order.filter((x) => !flow.edges.some((e) => e.from === x.node.id))) {
    const b = c.bySlug[o.node.slug];
    if (!b) continue;
    if (b.role === "check") {
      const reads = new Set(b.inputs.map((p) => p.type));
      for (const e of flow.edges.filter((x) => x.to === o.node.id)) {
        for (const p of c.bySlug[byId[e.from]?.slug]?.outputs ?? []) if (reads.has(p.type) && p.type !== "brand_brain") types.push(p.type);
      }
    }
    types.push(...b.outputs.map((p) => p.type));
  }
  return [...new Set(types.map(portLabel))];
}

