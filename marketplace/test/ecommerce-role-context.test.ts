import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Persona } from "../src/core/types.ts";
import personas from "../src/modules/directory/data/personas-ecommerce.json" with { type: "json" };
import verticalData from "../knowledge/ecommerce/vertical.json" with { type: "json" };
import { ecommerceRoleContext, renderEcommerceRoleContext, resolveEcommerceRole } from "../src/modules/directory/ecommerce-context.ts";
import { buildHousePackage } from "../src/modules/runner/packages.ts";
import { buildPack, oneFileText } from "../src/modules/packs/build.ts";
import { lintPack } from "../src/modules/packs/lint.ts";
import { personaModules, verticalBundle } from "../src/modules/knowledge/bundle.ts";
import type { Card, Source, Vertical } from "../src/modules/knowledge/cards.ts";
import { getJobType, listJobTypes, setCatalogueForTests } from "../src/modules/catalogue/index.ts";
import { LANDING_PAGE, NOVA } from "./fixtures.ts";

const team = personas as Persona[];
const source = (relative: string) => JSON.parse(readFileSync(new URL(relative, import.meta.url), "utf8"));
const sources = source("../knowledge/ecommerce/sources.json") as Source[];
const cards = readdirSync(new URL("../knowledge/ecommerce/cards/", import.meta.url)).filter(f => f.endsWith(".json")).flatMap(f => source(`../knowledge/ecommerce/cards/${f}`)) as Card[];
const bundle = verticalBundle(verticalData as Vertical, cards, sources);

test("all 76 role contracts preserve actual outcomes and canonical module routing backed by public sources", () => {
  assert.equal(team.length, 76);
  const workSignatures = new Set<string>();
  for (const p of team) {
    const ctx = ecommerceRoleContext(p)!;
    assert.equal(ctx.schema, "ecommerce-role-context/1");
    assert.deepEqual(ctx.primary_modules, personaModules(p, bundle));
    assert.deepEqual(ctx.constraint_modules, ["MEA", "FIN", "OPS"]);
    assert.deepEqual(ctx.unknown_modules, []);
    assert.deepEqual(ctx.outcomes, p.profile.outcomes.map(o => ({ id: o.id, title: o.title, deliverable: o.deliverable, job_type_id: o.job_type_id })));
    assert.ok(ctx.primary_modules.length > 0 && ctx.primary_modules.length <= 4);
    for (const m of [...ctx.primary_knowledge, ...ctx.conditional_modules]) {
      assert.ok(bundle.files[m.path], `${p.id}: unavailable public module ${m.path}`);
      assert.equal(m.name, bundle.vertical.modules.find(v => v.code === m.code)!.name);
      const included = bundle.cards.filter(c => c.modules.includes(m.code));
      assert.ok(included.length > 0);
      assert.ok(included.every(c => c.public && bundle.sources.some(s => s.id === c.source && s.public)));
    }
    assert.ok(ctx.conditional_modules.every(m => !ctx.primary_modules.includes(m.code) && m.when.length > 20));
    // Distinction must survive removing names and role IDs: finished work/evidence differ, not just persona labels.
    workSignatures.add(createHash("sha256").update(JSON.stringify({ outcomes: ctx.outcomes.map(o => o.deliverable), evidence: ctx.primary_knowledge.map(m => m.evidence) })).digest("hex"));
    const job = p.profile.outcomes.map(o => getJobType(o.job_type_id)).find(Boolean)!;
    assert.ok(job, p.id);
    const pkg = buildHousePackage(p, job);
    assert.ok(pkg.skill.instructions.includes(p.profile.method));
    assert.ok(pkg.skill.instructions.includes(renderEcommerceRoleContext(p)));
    assert.ok(pkg.skill.instructions.includes(JSON.stringify({ agent_id: p.id })), `${p.id}: connected lookup needs its exact role selector`);
    assert.match(pkg.skill.instructions, /exposed schema supports agent_id/);
    assert.match(pkg.skill.instructions, /same-name tool may differ; do not invent unsupported arguments/);
    assert.equal(pkg.files.find(f => f.path === "reference/ecommerce-role-context.md")?.content, renderEcommerceRoleContext(p) + "\n");
  }
  assert.equal(workSignatures.size, 76);
});

test("support and channel specialists get selective evidence needs; lead scope is constraints, not all modules", () => {
  const support = ecommerceRoleContext(team.find(p => p.id === "darlene-support-lead")!)!;
  assert.deepEqual(support.primary_modules, ["OPS", "CXP"]);
  assert.ok(!support.primary_modules.includes("ADC"));
  assert.deepEqual(resolveEcommerceRole("margaret-job-orchestrator")?.modules, ["MEA", "FIN", "OPS"]);
  assert.deepEqual(resolveEcommerceRole("raymond-google-ads")?.modules, ["GAD"]);
  assert.deepEqual(resolveEcommerceRole("lindsey-meta-media-buyer")?.modules, ["ADC", "MCR", "MEA"]);
  assert.equal(resolveEcommerceRole("unknown"), null);
  const text = renderEcommerceRoleContext(team.find(p => p.id === "darlene-support-lead")!);
  assert.match(text, /unrelated support, copy or implementation job/);
  assert.deepEqual(support.conditional_modules, []); // OPS/CXP already cover one another; do not repeat them as fallback work.
  assert.match(renderEcommerceRoleContext(team.find(p => p.id === "raymond-google-ads")!), /fallback candidates, not an instruction to load them all/);
  assert.match(text, /a path or tool name is not loaded evidence/);
  assert.match(text, /top-five result count is not proof of completeness/);
});

test("all 76 downloadable and training packs wire the role prompt and machine scope to real bundled knowledge", async () => {
  for (const p of team) for (const kind of ["agent", "train"] as const) {
    const pack = await buildPack({ persona: p, role: null, kit: null, jobTypes: listJobTypes(), vertical: bundle,
      options: { kind, version: "2026.11.17", updated: "2026-11-17" } });
    const files = new Map(pack.files.map(f => [f.path, f.content]));
    const ctx = JSON.parse(files.get("role-context.json")!);
    assert.deepEqual(ctx, ecommerceRoleContext(p), `${p.id}/${kind}: CLI scope differs from runtime role`);
    assert.ok(ctx);
    assert.ok(files.get("ROLE-CONTEXT.md")!.includes(renderEcommerceRoleContext(p)));
    assert.match(files.get("AGENTS.md")!, /Read ROLE-CONTEXT\.md before planning or retrieving/);
    assert.match(files.get("AGENTS.md")!, /role-context\.json supplies the matching default lookup scope/);
    assert.equal(files.get("CLAUDE.md")!.trim(), "@AGENTS.md");
    for (const m of [...ctx.primary_knowledge, ...ctx.conditional_modules]) {
      assert.ok(files.get(m.path)?.trim(), `${p.id}/${kind}: missing source ${m.path}`);
    }
    if (kind === "agent") {
      const inline = oneFileText(pack);
      assert.ok(inline.includes("===== FILE: ROLE-CONTEXT.md ====="), `${p.id}/${kind}: chat upload loses role instructions`);
      assert.ok(inline.includes(renderEcommerceRoleContext(p)), `${p.id}/${kind}: chat upload truncates role context`);
    }
    if (kind === "train") {
      assert.match(files.get("ROLE-CONTEXT.md")!, /does not replace the identity/);
      assert.match(files.get("AGENTS.md")!, /without overriding your completed identity files/);
    }
  }
  const ordinary = await buildPack({ persona: NOVA, role: null, kit: null, jobTypes: [LANDING_PAGE],
    options: { kind: "agent", version: "2026.11.17", updated: "2026-11-17" } });
  assert.ok(!ordinary.files.some(f => ["ROLE-CONTEXT.md", "role-context.json"].includes(f.path)));
  assert.doesNotMatch(ordinary.files.find(f => f.path === "AGENTS.md")!.content, /Read ROLE-CONTEXT/);
});

test("legacy database metadata omission is repaired only for exact house IDs without replacing the stored profile", () => {
  const full = team.find(p => p.id === "raymond-google-ads")!;
  const row = { ...structuredClone(full), role: undefined, vertical: undefined, modules: undefined };
  row.profile.method += "\nKeep this stored account-specific method clarification.";
  assert.deepEqual(ecommerceRoleContext(row)?.primary_modules, ["GAD"]);
  const pkg = buildHousePackage(row, LANDING_PAGE);
  assert.match(pkg.skill.instructions, /stored account-specific method clarification/);
  assert.equal(ecommerceRoleContext({ ...row, kind: "expert" }), null);
  assert.equal(ecommerceRoleContext(NOVA), null);
  assert.equal(renderEcommerceRoleContext(NOVA), "");
  assert.ok(!buildHousePackage(NOVA, LANDING_PAGE).files.some(f => f.path === "reference/ecommerce-role-context.md"));
});

test("real shared training guides resolve memory dependencies while preserving the text-only Studio contract", async () => {
  const templates: Record<string, string> = {};
  function readTemplates(dir: URL, prefix = "") {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) readTemplates(new URL(`${entry.name}/`, dir), `${prefix}${entry.name}/`);
      else if (entry.name.endsWith(".md")) templates[prefix + entry.name] = readFileSync(new URL(entry.name, dir), "utf8");
    }
  }
  readTemplates(new URL("../packs/shared/", import.meta.url));
  // Real tool inputs are available to the builder, but must not leak executables into an uploadable training ZIP.
  const tools = {
    "org-context.mjs": readFileSync(new URL("../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs", import.meta.url), "utf8"),
    "evidence-packet.mjs": readFileSync(new URL("../packs/shared/tools/evidence-packet.mjs", import.meta.url), "utf8"),
    "EVIDENCE-PACKETS.md": templates["tools/EVIDENCE-PACKETS.md"],
  };
  for (const p of [NOVA, team.find(p => p.id === "darlene-support-lead")!]) {
    const pack = await buildPack({ persona: p, role: null, kit: null, jobTypes: listJobTypes(), templates, tools,
      ...(p.vertical === "ecommerce" ? { vertical: bundle } : {}),
      options: { kind: "train", version: "2026.11.17", updated: "2026-11-17" } });
    assert.ok(pack.files.every(f => /\.(md|json|txt|csv)$/i.test(f.path)), "Studio rejects script files in a training upload");
    assert.ok(!pack.files.some(f => f.path.startsWith("tools/")), "training keeps the existing external-tool contract");
    for (const name of ["MEMORY-ARCHITECTURE.md", "BRAND-CONTEXT-CONTRACT.md"]) {
      const guide = pack.files.find(f => f.path === name)!.content;
      assert.match(guide, /https:\/\/agents\.useaiblocks\.com\/tools\/EVIDENCE-PACKETS\.md/);
      assert.ok(guide.includes("into a tools/ folder first"));
    }
    const brand = pack.files.find(f => f.path === "BRAND-CONTEXT-CONTRACT.md")!.content;
    assert.match(brand, /https:\/\/agents\.useaiblocks\.com\/tools\/org-context\.mjs/);
    assert.deepEqual(lintPack(pack), [], `${p.id}: real shared templates must pass the production pack linter`);
  }
});

test("the actual stored-house runner sends role context on every model step without paid providers", async t => {
  const originalJobs = listJobTypes();
  const p = structuredClone(team.find(p => p.id === "darlene-support-lead")!);
  const job = getJobType("canned-replies-and-macros")!;
  const { testEnv } = await import("./helpers.ts");
  const { registerFake } = await import("../src/core/models.ts");
  const { seedHouseAgents, runAgentOnBrief } = await import("../src/modules/runner/service.ts");
  const env = await testEnv({}, { catalogue: [job] });
  t.after(() => { setCatalogueForTests(originalJobs); env.db.db.close(); });
  p.profile.method += "\nPreserve this stored support procedure.";
  await env.sql("INSERT INTO personas (id, kind, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'house', ?, ?, ?, ?, ?, 'live', ?, 'x', 'x')", p.id, p.name, p.title, p.tagline, p.area, JSON.stringify(p.profile), p.sort);
  await seedHouseAgents(env.env, "test");
  const [agent] = await env.sql("SELECT id, live_version FROM agents WHERE persona_id = ? AND job_type_id = ?", p.id, job.id);
  assert.ok(agent);
  const systems: string[] = [];
  for (const step of ["plan", "draft", "check_and_fix"]) registerFake(`runner.step.${step}`, req => { systems.push(req.system); return { text: "Illustrative support draft; no live action performed." }; });
  await runAgentOnBrief(env.env, { agentId: agent.id, version: agent.live_version, brief: "Draft a helpful reply for a delayed order from the supplied policy; do not send it.", kind: "test", actor: "test" });
  assert.equal(systems.length, 3);
  for (const system of systems) {
    assert.ok(system.includes(renderEcommerceRoleContext(p)));
    assert.match(system, /Preserve this stored support procedure/);
    assert.match(system, /OPS — Team, fulfilment and support/);
    assert.match(system, /CXP — Post-purchase experience/);
    assert.ok(system.includes('pass {"agent_id":"darlene-support-lead"}'));
    assert.match(system, /exposed schema supports agent_id/);
    assert.match(system, /same-name tool may differ; do not invent unsupported arguments/);
    assert.doesNotMatch(system, /private client facts from Gehna/i);
  }
  const calls = await env.sql("SELECT provider FROM model_calls");
  assert.ok(calls.length === 3 && calls.every(c => c.provider === "fake"));
});
