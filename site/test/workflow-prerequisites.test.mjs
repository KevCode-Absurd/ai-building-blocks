import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { unzipSync, strFromU8 } from "fflate";
import { prerequisiteMarkdown, prerequisiteRegister } from "../src/lib/workflow-prerequisites.ts";
import { sha256 } from "../src/lib/workflow-execution.ts";

const bundled = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/handoff.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const { buildHandoffZip } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);
const flowBundle = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/composer-flow.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const { compositionFlow } = await import(`data:text/javascript;base64,${Buffer.from(flowBundle.outputFiles[0].text).toString("base64")}`);
const catalogue = { built: "fixture", blocks: [], bySlug: {}, renamed: {}, portTypes: {} };
const port = (type, required = true) => ({ type, required });
const skill = (slug, inputs, outputs) => ({ slug, name: slug, summary: "Use the provided inputs and check the result.", markdown: `---\nname: ${slug}\n---\n# Method\nUse supplied evidence.\n## Checks\nValidate the result against the inputs.\n`, role: "make", inputs, outputs });
const workflow = skills => ({ id: "prerequisite-test", name: "Evidence-based workflow", goal: "Make and check the requested work", updated: 0, customSkills: skills, nodes: skills.map((item, index) => ({ id: `s${index + 1}`, slug: item.slug, x: index * 360, y: 0 })), edges: skills.slice(1).map((_, index) => ({ id: `e${index + 1}`, from: `s${index + 1}`, to: `s${index + 2}` })) });
async function exportFiles(flow) {
  const result = await buildHandoffZip(catalogue, flow);
  assert.ok(!("error" in result), result.error);
  return { result, files: unzipSync(new Uint8Array(await result.blob.arrayBuffer())) };
}
const json = (files, name) => JSON.parse(strFromU8(files[name]));

test("marketing preparation is conditional on actual skill inputs and precedes generation", async () => {
  const f = workflow([skill("custom-ad", [port("brand_brain"), port("offer"), port("ad_copy", false), port("voc_reviews"), port("buyer_persona", false)], [port("ad_draft")])]);
  const { files } = await exportFiles(f), text = strFromU8(files["HANDOFF.md"]);
  for (const label of ["Brand Brain or brand file", "Offer", "Ad copy", "Reviews", "Persona"]) assert.ok(text.includes(`**${label}:`), label);
  assert.ok(text.indexOf("### Reuse existing material") < text.indexOf("### Step 1:"));
  assert.match(text, /Do you already have this\?/);
  assert.match(text, /attachment, folder\/file path or URL/);
  assert.match(text, /A path or URL is a reference, not proof of a read/);
  assert.match(text, /Create it once only when the person has authorised/);
  assert.match(text, /explicit workflow amendment/);
  assert.match(text, /Reuse never skips a declared step or its checks/);
  const entries = json(files, "templates/prerequisite-register.json").entries;
  assert.deepEqual(entries.map(entry => [entry.type, entry.required]), f.customSkills[0].inputs.map(input => [input.type, input.required]));
});

test("coding and finance packs gain no invented marketing inputs or example checklist", async () => {
  for (const [slug, input, output] of [["custom-code-check", "codebase", "code_review"], ["custom-cash-plan", "cash_flow", "cash_forecast"]]) {
    const { files } = await exportFiles(workflow([skill(slug, [port(input)], [port(output)])]));
    const contract = json(files, "workflow.json"), register = json(files, "templates/prerequisite-register.json");
    assert.deepEqual(contract.steps[0].inputs, [port(input)]);
    assert.deepEqual(contract.input_contracts.map(item => item.type), [input]);
    assert.deepEqual(register.entries.map(item => item.type), [input]);
    const preparation = strFromU8(files["HANDOFF.md"]).split("### Reuse existing material before making more")[1].split("## Steps")[0];
    for (const example of ["**Brand Brain or brand file:", "**Offer:", "**Ad copy:", "**Reviews:", "**Persona:"]) assert.ok(!preparation.includes(example));
  }
  assert.ok(!prerequisiteMarkdown(["brand_brain_output", "offer_audit"]).includes("**Brand Brain or brand file:"));
});

test("upstream candidates and repeated types never become accepted or silently shared prerequisites", async () => {
  const f = workflow([
    skill("custom-source", [port("offer")], [port("brand_brain")]),
    skill("custom-draft", [port("brand_brain"), port("offer")], [port("ad_copy")]),
    skill("custom-check", [port("brand_brain"), port("ad_copy")], [port("review")]),
  ]);
  const { files } = await exportFiles(f), register = json(files, "templates/prerequisite-register.json");
  assert.equal(register.status, "NOT_STARTED");
  assert.ok(register.entries.every(entry => entry.status === "MISSING" && entry.artifact === null && entry.acceptance_decision === null && entry.reuse_from_input_id === null && entry.read_evidence.length === 0 && entry.creation.status === "NOT_REQUESTED" && entry.creation.authorization === null));
  const draftBrand = register.entries.find(entry => entry.input_id === "s2-input-brand_brain");
  assert.deepEqual(draftBrand.producer_candidates, [{ step_id: "s1", artifact_id: "step-1-output", accepted_revision: null }]);
  const checkBrand = register.entries.find(entry => entry.input_id === "s3-input-brand_brain");
  assert.deepEqual(checkBrand.producer_candidates, [], "A disconnected earlier brand output cannot be assumed to feed this consumer");
  assert.ok(json(files, "inputs.json").inputs.every(input => input.status === "MISSING" && input.acceptance_decision === null));
  assert.match(strFromU8(files["HANDOFF.md"]), /same input type alone does not prove a match/);
  assert.match(strFromU8(files["HANDOFF.md"]), /Changed sources or revisions make affected acceptance and checks STALE/);
});

test("explicit adaptation bindings identify a producer without inventing source reads or authorization", () => {
  const register = prerequisiteRegister([
    { id: "source", step: 1, inputs: [], outputs: [port("customer_notes")], reads_from: [], input_bindings: [], output_contract: { artifact_id: "source-output" } },
    { id: "consumer", step: 2, inputs: [port("buyer_persona")], outputs: [], reads_from: [1], input_bindings: [{ type: "buyer_persona", from: "source" }], output_contract: { artifact_id: "consumer-output" } },
  ]);
  assert.deepEqual(register.entries[0].producer_candidates, [{ step_id: "source", artifact_id: "source-output", accepted_revision: null }]);
  assert.equal(register.entries[0].status, "MISSING");
  assert.deepEqual(register.entries[0].creation, { status: "NOT_REQUESTED", authorization: null, amendment: null, skill: null, artifact_revision: null });
});

test("new register is included in integrity manifest while original skills and strict execution contract stay intact", async () => {
  const f = workflow([skill("custom-preserve", [port("brief"), port("style", false)], [port("draft")])]);
  const { files, result } = await exportFiles(f), contract = json(files, "workflow.json");
  assert.equal(strFromU8(files["skills/custom-preserve/SKILL.md"]), f.customSkills[0].markdown);
  assert.equal(contract.prerequisites.register, "templates/prerequisite-register.json");
  assert.match(contract.prerequisites.creation_rule, /explicit workflow amendment/);
  assert.equal(contract.execution.scheduling.reuse_skips_step, false);
  assert.equal(contract.steps[0].state, "NOT_STARTED");
  assert.equal(contract.steps[0].checks[0].status, "NOT_RUN");
  const manifest = json(files, "manifest.json"), record = manifest.files.find(file => file.path === contract.prerequisites.register);
  assert.equal(record.sha256, await sha256(files[record.path]));
  assert.equal(record.bytes, files[record.path].length);
  const second = await buildHandoffZip(catalogue, f);
  assert.ok(!("error" in second), second.error);
  assert.deepEqual(new Uint8Array(await second.blob.arrayBuffer()), new Uint8Array(await result.blob.arrayBuffer()));
});

test("generated task minds survive flow conversion and complete export with the council protocol", async () => {
  const skills = [skill("custom-source", [port("brief")], [port("brand_brain")]), skill("custom-review", [port("brand_brain")], [port("review")])];
  const minds = ["steve-jobs", "jeff-bezos"].map(slug => ({ slug, name: slug, type: "mind", category: "general", role: "make", summary: "A public method profile.", inputs: [], outputs: [], version: "1", hasFiles: false }));
  const blocks = [...skills.map(value => ({ ...value, type: "skill" })), ...minds];
  const c = { ...catalogue, blocks, bySlug: Object.fromEntries(blocks.map(value => [value.slug, value])) };
  const plan = { source: "ai", title: "Checked brand work", summary: "Use the supplied evidence.", steps: skills.map((value, index) => ({ slug: value.slug, reason: "Prepare this step.", notes: "Keep source evidence.", minds: index === 0 ? ["steve-jobs", "jeff-bezos"] : ["jeff-bezos"] })), questionIds: [], assumptions: [] };
  const flow = { ...compositionFlow(c, plan, "Check my supplied brand work", "Original context"), customSkills: skills };
  assert.deepEqual(flow.nodes[0].minds, ["steve-jobs", "jeff-bezos"]); assert.equal(flow.nodes[0].mind, "steve-jobs");
  assert.deepEqual(flow.nodes[1].minds, ["jeff-bezos"]); assert.equal(flow.nodes[1].mind, "jeff-bezos");
  assert.equal(flow.edges[0].from, flow.nodes[0].id); assert.equal(flow.edges[0].to, flow.nodes[1].id);
  assert.deepEqual(flow.nodes[1].bindings, []); assert.match(flow.nodes[1].notes, /Keep source evidence/);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => new Response(`# Complete public mind profile\nSource: ${url}\nFollow the supplied evidence and checks.\n`);
  try {
    const exportCatalogue = { ...catalogue, blocks: minds, bySlug: Object.fromEntries(minds.map(value => [value.slug, value])) };
    const result = await buildHandoffZip(exportCatalogue, flow); assert.ok(!("error" in result), result.error);
    const files = unzipSync(new Uint8Array(await result.blob.arrayBuffer()));
    for (const slug of ["steve-jobs", "jeff-bezos"]) assert.ok(files[`skills/${slug}/SKILL.md`]);
    assert.ok(files["TASK-COUNCIL.md"]); assert.match(strFromU8(files["TASK-COUNCIL.md"]), /one challenge round/);
    const contract = json(files, "workflow.json"); assert.deepEqual(contract.steps[0].minds, ["steve-jobs", "jeff-bezos"]);
    assert.equal(contract.steps[0].council.protocol, "TASK-COUNCIL.md"); assert.equal(contract.steps[0].state, "NOT_STARTED");
    assert.deepEqual(contract.steps[1].minds, ["jeff-bezos"]);
  } finally { globalThis.fetch = originalFetch; }
});

test("legacy plans remain unassigned and invalid mind choices cannot become generated flow nodes", () => {
  const producer = { ...skill("custom-producer", [], [port("draft")]), type: "skill" };
  const mind = { slug: "real-mind", name: "Real mind", type: "mind", inputs: [], outputs: [] };
  const c = { ...catalogue, blocks: [producer, mind], bySlug: { [producer.slug]: producer, [mind.slug]: mind } };
  const plan = { source: "ai", title: "Preserve the old plan", summary: "Existing work.", steps: [{ slug: producer.slug, reason: "Make the draft.", notes: "Keep the original scope." }], questionIds: [], assumptions: [] };
  const legacy = compositionFlow(c, plan, "An old goal");
  assert.equal(Object.hasOwn(legacy.nodes[0], "minds"), false); assert.equal(Object.hasOwn(legacy.nodes[0], "mind"), false);
  const off = compositionFlow(c, { ...plan, steps: [{ ...plan.steps[0], minds: [] }] }, "A new goal");
  assert.deepEqual(off.nodes[0].minds, []); assert.equal(Object.hasOwn(off.nodes[0], "mind"), false);
  for (const invalid of [["unknown-mind"], [producer.slug], ["real-mind", "real-mind"], ["real-mind", "a", "b", "c"]]) assert.throws(() => compositionFlow(c, { ...plan, steps: [{ ...plan.steps[0], minds: invalid }] }, "A new goal"), /invalid mind assignments/);
});
