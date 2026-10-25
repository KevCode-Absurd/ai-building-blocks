import { finalize, type Composition } from "./composer-core";
import type { Catalogue } from "./data";
import { type Flow, uid } from "./store";
export function compositionFlow(c: Catalogue, plan: Composition, goal: string, context = ""): Flow {
  const checked = finalize(c, plan, plan.source);
  const nodes = checked.steps.map((s, i) => ({ id: uid(), slug: s.slug, ...(s.minds !== undefined ? { minds: [...s.minds], ...(s.minds[0] ? { mind: s.minds[0] } : {}) } : {}), x: 40 + (i % 3) * 360, y: 110 + Math.floor(i / 3) * 190, notes: [s.reason, s.notes, ...checked.bindings.filter(b => b.step === i + 1).map(b => `Read step ${b.from} as ${b.type}: ${b.instruction}`)].filter(Boolean).join("\n\n") }));
  const boundNodes = nodes.map((n, i) => ({ ...n, bindings: checked.bindings.filter(b => b.step === i + 1).map(b => ({ type: b.type, from: nodes[b.from - 1].id, instruction: b.instruction })) }));
  return { id: uid(), name: checked.title, goal, notes: [checked.summary, ...checked.assumptions, context && `Additional user context:\n${context}`, "Execute in the listed order. Each check reports evidence or marks itself not run. Repair and recheck at most twice; stop and list unresolved failures. Obtain concrete authorization before sending, publishing, spending or scheduling."].filter(Boolean).join("\n\n"), nodes: boundNodes, edges: checked.dependencies.map(([a, b]) => ({ id: uid(), from: nodes[a].id, to: nodes[b].id })), updated: Date.now() };
}
