import test from "node:test";
import assert from "node:assert/strict";
import { resolveToolRefs } from "../src/modules/packs/build.ts";

const O = "https://agents.useaiblocks.com";
const none = new Set<string>();

test("commands keep their runnable relative path and say where to get a missing tool", () => {
  const out = resolveToolRefs("Run `node tools/capture-brand-dna.mjs <site>` first.", none, O);
  assert.equal(out, `Run \`node tools/capture-brand-dna.mjs <site>\` (get ${O}/tools/capture-brand-dna.mjs into a tools/ folder first) first.`);
  assert.doesNotMatch(out, /node https:/);
});

test("fenced blocks are left whole, with one note after them", () => {
  const out = resolveToolRefs("```\nnode tools/check-brand-fidelity.mjs --brand a.json\n```", none, O);
  assert.match(out, /^```\nnode tools\/check-brand-fidelity\.mjs/);
  assert.match(out, /\n\(Get https:\/\/agents\.useaiblocks\.com\/tools\/check-brand-fidelity\.mjs into a tools\/ folder first\.\)$/);
});

test("prose refs become links, present tools stay, and a second pass changes nothing", () => {
  const text = "See tools/ai-default-patterns.md and `tools/capture-brand-dna.mjs` (also at x). Use tools/brand-dna-snippet.js.";
  const once = resolveToolRefs(text, new Set(["ai-default-patterns.md"]), O);
  assert.equal(once, `See tools/ai-default-patterns.md and \`tools/capture-brand-dna.mjs\` (also at x). Use ${O}/tools/brand-dna-snippet.js.`);
  assert.equal(resolveToolRefs(once, new Set(["ai-default-patterns.md"]), O), once);
  const cmd = resolveToolRefs("`node tools/a.mjs`", none, O);
  assert.equal(resolveToolRefs(cmd, none, O), cmd);
});

test("'run tools/x.mjs' in prose becomes a runnable command", () => {
  const out = resolveToolRefs("Run tools/check-brand-fidelity.mjs (or its manual checklist).", none, O);
  assert.equal(out, `Run \`node tools/check-brand-fidelity.mjs\` (get ${O}/tools/check-brand-fidelity.mjs into a tools/ folder first) (or its manual checklist).`);
  assert.equal(resolveToolRefs(out, none, O), out);
});
