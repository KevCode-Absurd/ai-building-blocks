// The four ecommerce buyers remain separate, downloadable agents with platform-scoped workflows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { housePersonas } from "../src/modules/directory/index.ts";
import { getRole, listRoles } from "../src/modules/directory/roles.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";
import { buildPack, filesIndex, packZip, validateRoleKit, type RoleKit } from "../src/modules/packs/build.ts";
import { bestRoute } from "../src/modules/packs/route.ts";
import { readZip } from "../src/modules/packs/zip.ts";
import { checkToolbox, leadAgentOfRole, renderLibraryItem, renderToolGuide, toolboxLibraryRefs, yamlLite, type LibraryItem, type ToolboxJson } from "../src/modules/packs/toolbox.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOGUE = path.join(ROOT, "..", "catalogue-items");
const read = (...parts: string[]) => readFileSync(path.join(...parts), "utf8");
const buyers = [
  { id: "lindsey-meta-media-buyer", name: "Lindsey", role: "meta-media-buyer", platform: "Meta", key: "meta", tracking: "Meta Pixel and Conversions API" },
  { id: "raymond-google-ads", name: "Raymond", role: "google-ads-media-buyer", platform: "Google", key: "google", tracking: "Google Ads conversion actions" },
  { id: "kelsey-snapchat-ads", name: "Kelsey", role: "snapchat-ads-media-buyer", platform: "Snapchat", key: "snapchat", tracking: "Snap Pixel and Conversions API" },
  { id: "zara-tiktok-ads", name: "Zara", role: "tiktok-ads-media-buyer", platform: "TikTok", key: "tiktok", tracking: "TikTok Pixel and Events API" },
];
const ecommerce = housePersonas().filter(p => p.vertical === "ecommerce");
const roles = new Set(listRoles().map(r => r.id));

function kitFor(role: string): RoleKit {
  const folder = path.join(ROOT, "packs", "roles", role);
  const files: Record<string, string> = {};
  const walk = (dir: string, prefix = "") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const rel = `${prefix}${entry.name}`;
      if (entry.isDirectory()) walk(path.join(dir, entry.name), `${rel}/`);
      else if (/\.(md|json)$/.test(rel)) files[rel] = read(dir, entry.name);
    }
  };
  walk(folder);
  const meta = JSON.parse(files["role.json"]);
  delete files["role.json"];
  return { role: meta, files };
}

// Resolve the real curated library, so a broken toolbox reference cannot pass with a stub.
function libraryFor(box: ToolboxJson): Record<string, LibraryItem> {
  return Object.fromEntries(toolboxLibraryRefs(box).map(({ slug, type }) => {
    if (type === "tool") return [slug, renderToolGuide(slug, read(CATALOGUE, "ai-tools", `${slug}.yaml`))];
    const dir = type === "mind" ? path.join(CATALOGUE, "minds", slug)
      : ["general", "ecommerce", "imported", "orchestrators", "agents"].map(g => path.join(CATALOGUE, g, slug)).find(d => existsSync(path.join(d, "SKILL.md")));
    assert.ok(dir, `Missing library source: ${slug}`);
    const meta = yamlLite(read(dir, type === "mind" ? "mind.yaml" : "item.yaml")) as Record<string, any>;
    return [slug, renderLibraryItem({ slug, type, name: meta.name, summary: meta.summary, main: read(dir, "SKILL.md"), uses: Array.isArray(meta.uses) ? meta.uses : [] })];
  }));
}

test("ecommerce keeps 76 agents and routes each media-buying role to its distinct buyer", () => {
  const source = JSON.parse(read(ROOT, "src/modules/directory/data/personas-ecommerce.json"));
  assert.equal(source.length, 76);
  assert.equal(new Set(source.map((p: { id: string }) => p.id)).size, 76);
  for (const buyer of buyers) {
    const p = ecommerce.find(p => p.id === buyer.id)!;
    assert.ok(p);
    assert.equal(p.name, buyer.name);
    assert.equal(p.role, buyer.role);
    assert.equal(p.title, `${buyer.platform} ads media buyer`);
    assert.equal(leadAgentOfRole(ecommerce, buyer.role)?.id, buyer.id);
  }
  const jared = ecommerce.find(p => p.id === "jared-performance-marketing")!;
  for (const buyer of buyers) assert.ok(jared.profile.method.includes(buyer.id));
  assert.doesNotMatch(jared.profile.method, /dustin-ad-deployment for Meta|ploy-tiktok-shop for TikTok/);
  const org = JSON.parse(read(ROOT, "src/modules/directory/data/team-org-chart.json"));
  const buildAgents = JSON.parse(read(ROOT, "build-specs/agents.json"));
  for (const buyer of buyers) {
    const p = ecommerce.find(p => p.id === buyer.id)!;
    const row = org.personas.find((row: { id: string }) => row.id === buyer.id);
    assert.equal(row.title, p.title);
    assert.deepEqual(row.roles, p.team!.roles);
    assert.equal(buildAgents.find((row: { id: string }) => row.id === buyer.id)?.title, p.title);
  }
  assert.doesNotMatch(read(ROOT, "packs/roles/meta-media-buyer/TEAM.md"), /kelsey-snapchat-ads/);
  const metaRoster = org.departments.flatMap((d: { roles: unknown[] }) => d.roles).find((r: { id: string }) => r.id === "meta-media-buyer");
  assert.ok(!metaRoster.persona_ids.includes("kelsey-snapchat-ads"));
});

for (const buyer of buyers) test(`${buyer.name} exports the correct platform workflow and routes work to it`, async () => {
  const persona = ecommerce.find(p => p.id === buyer.id)!;
  const kit = kitFor(buyer.role);
  assert.deepEqual(validateRoleKit(kit, roles).errors, []);
  const box = JSON.parse(kit.files["toolbox.json"]) as ToolboxJson;
  assert.deepEqual(checkToolbox(box, buyer.role, Object.keys(kit.files), roles).errors, []);
  const workflow = `workflows/${buyer.key}-media-buying.md`;
  assert.equal(box.always[0].ref, `kit:${workflow.slice(0, -3)}`);
  const templates = Object.fromEntries(["AGENTS.md", "WORK-METHOD.md", "README.md", "LICENSE.md"].map(p => [p, read(ROOT, "packs", "shared", p)]));
  const pack = await buildPack({ persona, role: getRole(buyer.role), kit, jobTypes: listJobTypes(), templates, library: libraryFor(box), options: { kind: "agent", version: "2026.11.17", updated: "2026-11-17" } });
  assert.equal(pack.manifest.agent_id, buyer.id);
  assert.equal(pack.manifest.role, buyer.role);
  assert.equal(pack.folder, buyer.id);
  const flow = pack.files.find(f => f.path === workflow)!;
  assert.equal(flow.group, "workflow");
  assert.equal(flow.source, "role");
  assert.ok(flow.content.includes(buyer.tracking));
  assert.ok(flow.content.includes(`context/media-buying/${buyer.key}/<account-id>/`));
  assert.ok(pack.files.find(f => f.path === "toolbox.md")!.content.includes(workflow));
  assert.ok(pack.files.find(f => f.path === "playbook.md")!.content.includes(workflow));
  assert.equal(bestRoute(`${buyer.platform} media buying`, pack.routes)?.candidate.path, workflow);
  const index = filesIndex(pack);
  assert.ok(index.routes.some(r => r.path === workflow));
  const zip = await readZip(await packZip(pack));
  const zippedFlow = zip.find(f => f.path === `${buyer.id}/${workflow}`)!;
  assert.ok(zippedFlow, "workflow ships in this buyer's downloadable zip");
  assert.equal(new TextDecoder().decode(zippedFlow.data), flow.content);
  const otherWorkflows = buyers.filter(b => b.id !== buyer.id).map(b => `workflows/${b.key}-media-buying.md`);
  for (const other of otherWorkflows) assert.ok(!pack.files.some(f => f.path === other), `Do not ship the other buyer's account workflow: ${other}`);
});
