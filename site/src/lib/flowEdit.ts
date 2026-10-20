// Edit a saved workflow as a simple list of steps (the "Add to a workflow" pop-up).
// The builder stores a graph; this turns it into a list and back without losing hand-made connections.
import { type Catalogue, wireSteps } from "./data";
import { orderFlow } from "./handoff";
import { type Flow, type FlowEdge, type FlowNode, uid } from "./store";

export type Step = { id: string; slug: string; added?: boolean };

/** The steps in run order (top to bottom, left to right when there's a tie). */
export function stepsOf(flow: Flow): Step[] {
  const order = orderFlow(flow);
  const nodes = order ? order.map((o) => o.node) : flow.nodes;
  return nodes.map((n) => ({ id: n.id, slug: n.slug }));
}

const key = (e: { from: string; to: string }) => `${e.from}>${e.to}`;
const autoEdges = (c: Catalogue, steps: Step[]): FlowEdge[] =>
  wireSteps(c, steps.map((s) => s.slug)).map(([a, z]) => ({ id: uid(), from: steps[a].id, to: steps[z].id }));
const grid = (i: number) => ({ x: 40 + (i % 3) * 360, y: 110 + Math.floor(i / 3) * 190 });

/** True when the connections are the ones we'd draw ourselves, so rewiring loses nothing. */
export function isAutoWired(c: Catalogue, flow: Flow): boolean {
  const want = new Set(autoEdges(c, stepsOf(flow)).map(key));
  return flow.edges.length === want.size && flow.edges.every((e) => want.has(key(e)));
}

/** Build the saved workflow from the edited list. */
export function applySteps(c: Catalogue, base: Flow | null, name: string, steps: Step[], reordered: boolean): Flow {
  const old = base ? Object.fromEntries(base.nodes.map((n) => [n.id, n])) : {};
  const rewire = !base || reordered || isAutoWired(c, base);
  if (rewire) {
    const nodes: FlowNode[] = steps.map((s, i) => ({ id: s.id, slug: s.slug, ecommerce: old[s.id]?.ecommerce, role: old[s.id]?.role, notes: old[s.id]?.notes, ...grid(i) }));
    return { id: base?.id ?? uid(), name, updated: Date.now(), nodes, edges: autoEdges(c, steps), goal: base?.goal, notes: base?.notes, ended: base?.ended };
  }
  // Hand-made connections: keep them, close the gap where a step was removed, hang new steps after the one above.
  const keep = new Set(steps.filter((s) => old[s.id]).map((s) => s.id));
  let edges = base.edges.filter((e) => keep.has(e.from) && keep.has(e.to));
  for (const gone of base.nodes.filter((n) => !keep.has(n.id))) {
    const ins = base.edges.filter((e) => e.to === gone.id && keep.has(e.from)).map((e) => e.from);
    const outs = base.edges.filter((e) => e.from === gone.id && keep.has(e.to)).map((e) => e.to);
    for (const a of ins) for (const z of outs) if (!edges.some((e) => e.from === a && e.to === z)) edges.push({ id: uid(), from: a, to: z });
  }
  const nodes: FlowNode[] = base.nodes.filter((n) => keep.has(n.id));
  steps.forEach((s, i) => {
    if (old[s.id]) return;
    const prev = steps[i - 1] ? nodes.find((n) => n.id === steps[i - 1].id) : undefined;
    const pos = prev ? { x: prev.x + 360, y: prev.y } : { x: 40, y: Math.max(110, ...nodes.map((n) => n.y + 190)) };
    while (nodes.some((n) => Math.abs(n.x - pos.x) < 200 && Math.abs(n.y - pos.y) < 120)) pos.y += 190;
    nodes.push({ id: s.id, slug: s.slug, ...pos });
    if (!prev) return;
    const next = steps[i + 1];
    const between = next && edges.find((e) => e.from === prev.id && e.to === next.id);
    if (between) edges = [...edges.filter((e) => e !== between), { id: uid(), from: s.id, to: next.id }];
    edges = [...edges, { id: uid(), from: prev.id, to: s.id }];
  });
  return { ...base, name, updated: Date.now(), nodes, edges };
}
