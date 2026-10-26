import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { strFromU8, unzipSync } from "fflate";

const pinned = fileURLToPath(new URL("../.wrangler/releases/release-2026-10-23-luna-first-output-builder-ui-r1/assets", import.meta.url));
// Use a complete verified snapshot when available. Normal checkouts can run the same
// regression against their built public catalogue and its complete skill assets.
const assetRoot = path.resolve(process.env.AUTO_MIND_EXPORT_ASSETS || (existsSync(pinned) ? pinned : fileURLToPath(new URL("../public", import.meta.url))));
const catalogueBytes = readFileSync(path.join(assetRoot, "data/blocks.json"));
const wire = JSON.parse(catalogueBytes);
const blocks = wire.blocks.map(b => ({ name: "", summary: "", headline: b.name ?? "", task: "set-up-ai", job: "ops", type: "skill", category: "general", role: "make", usedIn: 0, uses: [], boards: [], version: "1.0.0", ...b,
  inputs: (b.inputs ?? []).map(p => typeof p === "string" ? { type: p.replace(/\?$/, ""), required: !p.endsWith("?") } : p),
  outputs: (b.outputs ?? []).map(p => typeof p === "string" ? { type: p.replace(/\?$/, ""), required: !p.endsWith("?") } : p),
  steps: (b.steps ?? []).map(s => typeof s === "string" ? { uses: s, note: "" } : Array.isArray(s) ? { uses: s[0], note: s[1] } : s),
}));
const c = { ...wire, sourceHash: createHash("sha256").update(catalogueBytes).digest("hex"), blocks, bySlug: Object.fromEntries(blocks.map(b => [b.slug, b])) };
const built = await build({ stdin: { contents: [
  'export { finalize, plannerPrompt, selectionSchema } from "./src/lib/composer-core.ts";',
  'export { compositionFlow } from "./src/lib/composer-flow.ts";',
  'export { buildHandoffZip } from "./src/lib/handoff.ts";',
  'export { packFlow, unpackFlow } from "./src/lib/plan.ts";',
].join("\n"), resolveDir: fileURLToPath(new URL("..", import.meta.url)), sourcefile: "automatic-mind-export-entry.ts" }, bundle: true, write: false, format: "esm", platform: "browser" });
const { finalize, plannerPrompt, selectionSchema, compositionFlow, buildHandoffZip, packFlow, unpackFlow } = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString("base64")}`);
const councils = [["steve-jobs", "charlie-munger"], ["richard-feynman", "daniel-kahneman", "steve-jobs"]];
const goal = "Write a checked decision memo from my supplied evidence";
const rawPlan = () => ({ title: "Checked decision memo", summary: "Prepare a memo and check it against supplied evidence.", steps: [
  { slug: "request-acceptance-brief", reason: "Define the memo and evidence checks.", notes: "Use the original supplied facts. List unknowns and save the agreed brief.", minds: [...councils[0]] },
  { slug: "request-deliverable-drafter", reason: "Write and check the memo.", notes: "Read the brief and sources in full. Save memo.md and report unsupported claims instead of guessing.", minds: [...councils[1]] },
], questionIds: [], assumptions: [] });
const json = (files, name) => JSON.parse(strFromU8(files[name]));
const uniqueMinds = [...new Set(councils.flat())];
const normalize = text => text.replace(/\r\n?/g, "\n");

async function exportLocally(flow) {
  const previousFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async input => {
    const url = new URL(typeof input === "string" ? input : input.url, "https://offline-export.invalid");
    assert.equal(url.origin, "https://offline-export.invalid", "No external request is allowed in this regression");
    assert(url.pathname.startsWith("/skills/"), "Only complete local skill assets may be fetched");
    const file = path.resolve(assetRoot, "." + decodeURIComponent(url.pathname));
    assert(file.startsWith(assetRoot + path.sep), "Asset path must stay inside the verified root");
    calls.push(url.pathname);
    if (!existsSync(file)) return new Response("Not found", { status: 404 });
    return new Response(readFileSync(file), { headers: { "content-type": file.endsWith(".zip") ? "application/zip" : "text/plain; charset=utf-8" } });
  };
  try {
    const result = await buildHandoffZip(c, flow);
    assert(!result.error, result.error);
    const files = unzipSync(new Uint8Array(await result.blob.arrayBuffer()));
    return { files, calls };
  } finally { globalThis.fetch = previousFetch; }
}

function assertNoMinds(files) {
  assert.equal(files["TASK-COUNCIL.md"], undefined);
  const contract = json(files, "workflow.json");
  assert(contract.steps.every(step => step.mind === null && step.minds.length === 0 && step.council === null));
  assert(!strFromU8(files["HANDOFF.md"]).includes("**Task council:**"));
  const mindSlugs = new Set(blocks.filter(b => b.type === "mind").map(b => b.slug));
  assert(!Object.keys(files).some(file => file.startsWith("skills/") && mindSlugs.has(file.split("/")[1])), "Removed or unassigned Minds must not ship in the download");
}

test("automatic assignment schema and compact prompt expose the entire real Mind roster", () => {
  const minds = blocks.filter(b => b.type === "mind");
  assert(minds.length >= 505);
  if (assetRoot === pinned) assert.equal(minds.length, 505);
  for (const slug of uniqueMinds) assert.equal(c.bySlug[slug]?.type, "mind");
  const candidates = rawPlan().steps.map(s => c.bySlug[s.slug]);
  const roster = JSON.parse(plannerPrompt(goal, "", {}, candidates, [], minds).user).mindRoster;
  assert.equal(roster.length, minds.length);
  assert.deepEqual(roster.map(m => m.slug), minds.map(m => m.slug));
  assert(roster.every(m => m.name && Array.isArray(m.areas) && Array.isArray(m.expertise) && m.expertise.length));
  assert.deepEqual(selectionSchema(candidates, true, minds).properties.steps.items.properties.minds.items.enum, minds.map(m => m.slug));
});

test("validated AI councils export every complete Mind and its resources with executable council instructions", async () => {
  const plan = finalize(c, rawPlan(), "ai", undefined, true);
  const flow = compositionFlow(c, plan, goal);
  assert.deepEqual(flow.nodes.map(n => n.minds), councils);
  const { files } = await exportLocally(flow), contract = json(files, "workflow.json"), handoff = strFromU8(files["HANDOFF.md"]);
  assert.deepEqual(contract.steps.map(s => s.minds), councils);
  for (const step of contract.steps) assert.deepEqual(step.council, { protocol: "TASK-COUNCIL.md", rounds: 1, output: "one checked answer with unresolved dissent" });
  assert.match(strFromU8(files["TASK-COUNCIL.md"]), /challenge round/);
  assert.match(strFromU8(files["TASK-COUNCIL.md"]), /same task, inputs and constraints/);
  assert.match(strFromU8(files["TASK-COUNCIL.md"]), /unresolved dissent/);
  assert.match(strFromU8(files["TASK-COUNCIL.md"]), /first selected mind as the final writing voice/);
  assert.match(strFromU8(files["TASK-COUNCIL.md"]), /one AI simulated the discussion/);
  let resources = 0;
  for (const slug of uniqueMinds) {
    const skillPath = `skills/${slug}/SKILL.md`;
    assert.equal(strFromU8(files[skillPath]), normalize(readFileSync(path.join(assetRoot, skillPath), "utf8")));
    assert(handoff.includes(`skills/${slug}/SKILL.md`));
    if (c.bySlug[slug].hasFiles) {
      const source = unzipSync(readFileSync(path.join(assetRoot, "skills", slug + ".zip")));
      for (const [name, bytes] of Object.entries(source)) {
        if (name.endsWith("/") || name === `${slug}/SKILL.md`) continue;
        assert.deepEqual(files[`skills/${name}`], bytes, `Complete supporting file: ${name}`); resources++;
      }
    }
  }
  assert(resources > 0, "This must exercise real Mind supporting files, not only single-file profiles");
});

test("removing automatic Minds survives persisted reload and share roundtrip without changing skill files", async () => {
  const assigned = compositionFlow(c, finalize(c, rawPlan(), "ai", undefined, true), goal);
  const withMinds = (await exportLocally(assigned)).files;
  const removed = { ...assigned, nodes: assigned.nodes.map(n => ({ ...n, minds: [], mind: undefined })) };
  // Browser saving serializes this same Flow. Reload and sharing must preserve an intentional empty array.
  const reloaded = JSON.parse(JSON.stringify(removed));
  const restored = unpackFlow(c, packFlow(reloaded));
  assert(restored);
  assert(restored.nodes.every(n => n.minds.length === 0 && n.mind === undefined));
  assert.deepEqual(restored.nodes.map(n => [n.slug, n.notes]), removed.nodes.map(n => [n.slug, n.notes]));
  const withoutMinds = (await exportLocally(restored)).files;
  assertNoMinds(withoutMinds);
  const mindPrefixes = uniqueMinds.map(slug => `skills/${slug}/`);
  for (const [name, bytes] of Object.entries(withMinds)) {
    if (name.startsWith("skills/") && !mindPrefixes.some(prefix => name.startsWith(prefix))) assert.deepEqual(withoutMinds[name], bytes, `Original selected skill stays complete and unchanged: ${name}`);
  }
  assert.deepEqual(json(withoutMinds, "workflow.json").steps.map(s => s.your_notes), json(withMinds, "workflow.json").steps.map(s => s.your_notes));
});

test("legacy and explicitly disabled plans stay unassigned through conversion, reload and download", async () => {
  for (const mode of ["legacy", "off"]) {
    const raw = rawPlan();
    for (const step of raw.steps) { if (mode === "legacy") delete step.minds; else step.minds = []; }
    const plan = finalize(c, raw, "ai", undefined, mode === "off" ? false : undefined);
    const flow = compositionFlow(c, plan, goal), restored = unpackFlow(c, packFlow(JSON.parse(JSON.stringify(flow))));
    assert(restored); assert(restored.nodes.every(n => !n.mind && !n.minds?.length));
    assertNoMinds((await exportLocally(restored)).files);
  }
});
