import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

const bundled = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/insert-flow-skill.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const { insertFlowSkill } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const orderedBundle = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/handoff.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const { orderFlow } = await import(`data:text/javascript;base64,${Buffer.from(orderedBundle.outputFiles[0].text).toString("base64")}`);
const c = { bySlug: { extra: { slug: "extra", type: "skill", category: "general" }, thinker: { type: "mind" }, agent: { type: "agent" } } };
const fixture = () => ({ id: "flow", name: "A reviewed workflow", goal: "Keep the approved work", notes: "Global rule", governingSkills: ["governor"], customSkills: [], team: { minds: ["editor"], mode: "together" }, ended: true, updated: 1,
  nodes: [{ id: "a", slug: "source", x: 0, y: 0, notes: "Read the source" }, { id: "b", slug: "branch-one", x: 360, y: 0, role: "Review", minds: ["editor"] }, { id: "c", slug: "branch-two", x: 360, y: 190 }, { id: "d", slug: "join", x: 720, y: 0, bindings: [{ type: "brief", from: "a", instruction: "Use the approved brief" }] }],
  edges: [{ id: "ab", from: "a", to: "b" }, { id: "ac", from: "a", to: "c" }, { id: "bd", from: "b", to: "d" }, { id: "cd", from: "c", to: "d" }, { id: "ad", from: "a", to: "d" }] });

for (const at of [0, 1, 2, 3, 4]) test(`inserting at position ${at} preserves branches, bindings and every original step`, () => {
  const original = fixture(), snapshot = structuredClone(original), before = orderFlow(original).map(o => o.node.id);
  const result = insertFlowSkill(c, original, "extra", at);
  assert.deepEqual(original, snapshot, "The source workflow must be immutable");
  const added = result.nodes.find(n => !before.includes(n.id));
  assert.deepEqual(orderFlow(result).map(o => o.node.id), [...before.slice(0, at), added.id, ...before.slice(at)]);
  for (const node of original.nodes) assert.deepEqual(result.nodes.find(n => n.id === node.id), node);
  for (const edge of original.edges) assert.deepEqual(result.edges.find(e => e.id === edge.id), edge);
  for (const key of ["goal", "notes", "governingSkills", "team", "customSkills", "ended"]) assert.deepEqual(result[key], original[key]);
});
test("an empty workflow accepts its first skill", () => {
  const result = insertFlowSkill(c, { ...fixture(), nodes: [], edges: [] }, "extra", 0);
  assert.equal(result.nodes.length, 1); assert.equal(result.edges.length, 0); assert.equal(orderFlow(result)[0].node.slug, "extra");
});
test("unknown skills, minds, cycles, invalid positions and over-limit workflows are rejected", () => {
  for (const slug of ["missing", "thinker", "agent"]) assert.throws(() => insertFlowSkill(c, fixture(), slug, 0), /Choose a skill/);
  for (const at of [-1, 5, 1.5]) assert.throws(() => insertFlowSkill(c, fixture(), "extra", at), /where to insert/);
  const cycle = fixture(); cycle.edges.push({ id: "loop", from: "d", to: "a" });
  assert.throws(() => insertFlowSkill(c, cycle, "extra", 0), /loop/);
  assert.throws(() => insertFlowSkill(c, { ...fixture(), nodes: Array.from({ length: 40 }, (_, i) => ({ id: String(i), slug: "source", x: i, y: 0 })), edges: [] }, "extra", 40), /40 steps/);
});
