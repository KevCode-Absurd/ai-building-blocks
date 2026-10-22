import type { Catalogue } from "./data";
import { orderFlow } from "./handoff";
import { uid, type Flow, type FlowEdge } from "./store";

/** Add an ordering boundary without discarding existing data connections or step settings. */
export function insertFlowSkill(c: Catalogue, flow: Flow, slug: string, at: number): Flow {
  const skill = c.bySlug[slug];
  if (!skill || skill.type === "mind" || skill.type === "agent" || skill.category === "orchestrator") throw Error("Choose a skill from the library.");
  if (flow.nodes.length >= 40) throw Error("This workflow already has 40 steps. Remove a step before adding another.");
  const ordered = orderFlow(flow);
  if (!ordered) throw Error("Remove the workflow's loop before adding a skill.");
  if (!Number.isInteger(at) || at < 0 || at > ordered.length) throw Error("Choose where to insert the skill.");
  const before = ordered.slice(0, at).map(o => o.node);
  const after = ordered.slice(at).map(o => o.node);
  const beforeIds = new Set(before.map(n => n.id)), afterIds = new Set(after.map(n => n.id));
  const anchor = before.at(-1) ?? after[0];
  const position = { x: anchor ? anchor.x + (before.length ? 360 : -360) : 40, y: anchor?.y ?? 110 };
  while (flow.nodes.some(n => Math.abs(n.x - position.x) < 240 && Math.abs(n.y - position.y) < 140)) position.y += 190;
  const node = { id: uid(), slug, ...position };
  const added: FlowEdge[] = [];
  // Only add dependencies across the chosen boundary. All old edges, bindings and branches stay.
  for (const prior of before.filter(n => !flow.edges.some(e => e.from === n.id && beforeIds.has(e.to)))) added.push({ id: uid(), from: prior.id, to: node.id });
  for (const next of after.filter(n => !flow.edges.some(e => e.to === n.id && afterIds.has(e.from)))) added.push({ id: uid(), from: node.id, to: next.id });
  return { ...flow, updated: Date.now(), nodes: [...before, node, ...after], edges: [...flow.edges, ...added] };
}
