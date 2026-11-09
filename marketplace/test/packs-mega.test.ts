// Mega agent packs: a persona with `mega` carries a mega kit (traction playbook, 19 channels, 19 channel specialists)
// on top of its normal pack. Uses a small fixture kit; the real one is packs/mega/traction/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPack, fileUrl, fillTemplate, filesIndex, packZip, BLOCK_PLACEHOLDERS, SIMPLE_PLACEHOLDERS, type PackInput, type RoleKit } from "../src/modules/packs/build.ts";
import { MEGA_CHANNEL_COUNT, countSources, sourcesSection, validateMegaKit, type MegaKit } from "../src/modules/packs/mega.ts";
import { readZip } from "../src/modules/packs/zip.ts";
import { TEMPLATE_MARKER } from "../src/modules/packs/format.ts";
import { MEGA_VARIANTS, type Persona } from "../src/core/types.ts";
import { FIXTURE_JOB_TYPES, NOVA } from "./fixtures.ts";

const CHANNEL_IDS = [
  "creators-and-newsletters", "publicity", "unconventional-pr", "search-ads", "social-and-display-ads", "offline-ads", "seo-aeo-geo",
  "content-marketing", "email-marketing", "viral-and-referral", "engineering-as-marketing", "business-development", "sales",
  "affiliate-programs", "existing-platforms", "trade-shows", "offline-events", "speaking-engagements", "community-building",
];
const title = (id: string) => id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
const sources = (n: number, host: string) => Array.from({ length: n }, (_, i) => `${i + 1}. Source ${i + 1}, Publisher, https://${host}/${i + 1}, checked 2026-11-06`).join("\n");

function fixtureKit(): MegaKit {
  const files: Record<string, string> = {
    "orchestrator.md": `# How I run traction\n\nBullseye: brainstorm, rank, test, focus [1].\n\n## Sources\n\n${sources(2, "orchestrator.example")}\n`,
    "prompts/bullseye-brainstorm.md": "# Bullseye brainstorm\n\n```\nList one idea per channel for {{business}}.\n```\n",
    "prompts/title-tags.md": "# Title tags for a launch page\n\n```\nWrite titles for {{launch}}.\n```\n",
    "workflows/weekly-traction-review.md": "# Weekly traction review\n\n1. Read the test numbers.\n",
    "training/interview.md": "# Traction interview\n\n1. Which channel found your first 100 customers?\n",
    "training/test-briefs.md": "# Traction test briefs\n\n## 1. No budget\n\nA great answer must:\n\n- pick three channels\n",
  };
  for (const v of MEGA_VARIANTS) files[`variants/${v}.md`] = `# First traction for ${v}\n\n## Who this is for\n\nA ${v} business.\n\n## Sources\n\n${sources(1, `${v}.example`)}\n`;
  for (const id of CHANNEL_IDS) {
    files[`channels/${id}.md`] = `# ${title(id)}\n\n## What this channel is now\n\nIt works [1].\n\n## Sources\n\n${sources(2, `${id}.example`)}\n`;
    files[`agents/${id}.md`] = `---\nname: ${id}-specialist\ndescription: Hand me work on ${title(id).toLowerCase()} when it is in the inner ring.\n---\n\n# ${title(id)} specialist\n\nI draft and propose. I never post, spend or send.\n`;
  }
  return {
    json: {
      id: "traction", name: "First traction", updated: "2026-11-05", review_every_days: 14, variants: [...MEGA_VARIANTS],
      channels: CHANNEL_IDS.map(id => ({ id, name: title(id), book_chapter: title(id) })),
    },
    files,
  };
}

const MEGA: Persona = { ...NOVA, id: "tara-traction", name: "Tara", title: "Growth marketer", role: "growth-marketer", mega: { kit: "traction", variant: "saas" } };
const OPTIONS = { version: "2026.11.06", updated: "2026-11-06" };
const build = (over: Partial<PackInput> & { kind?: "agent" | "train" } = {}) => {
  const { kind = "agent", ...rest } = over;
  return buildPack({ persona: MEGA, role: null, kit: null, mega: fixtureKit(), jobTypes: FIXTURE_JOB_TYPES, templates: {}, options: { ...OPTIONS, kind }, ...rest });
};

test("mega kit check: exactly 19 channels, both files for each, every variant file, and the agents' names", () => {
  const kit = fixtureKit();
  assert.equal(MEGA_CHANNEL_COUNT, 19);
  assert.deepEqual(validateMegaKit("traction", kit), { errors: [], warnings: [] });
  const errorsOf = (k: { json: unknown; files: Record<string, string> }) => validateMegaKit("traction", k).errors;
  assert.ok(errorsOf({ ...kit, json: { ...kit.json, channels: kit.json.channels.slice(1) } }).some(e => /lists 18; it must list exactly 19/.test(e)));
  const noChannel = { ...kit, files: { ...kit.files } };
  delete noChannel.files["channels/sales.md"];
  assert.ok(errorsOf(noChannel).some(e => /channels\/sales\.md: missing/.test(e)));
  const noAgent = { ...kit, files: { ...kit.files } };
  delete noAgent.files["agents/publicity.md"];
  assert.ok(errorsOf(noAgent).some(e => /agents\/publicity\.md: missing/.test(e)));
  const noVariant = { ...kit, files: { ...kit.files } };
  delete noVariant.files["variants/local.md"];
  assert.ok(errorsOf(noVariant).some(e => /variants\/local\.md: missing/.test(e)));
  const badName = { ...kit, files: { ...kit.files, "agents/sales.md": "---\nname: sales\ndescription: x\n---\n" } };
  assert.ok(errorsOf(badName).some(e => /must be "sales-specialist"/.test(e)));
  assert.ok(errorsOf({ json: null, files: {} }).some(e => /kit\.json: missing/.test(e)));
  assert.equal(countSources(sourcesSection(kit.files["channels/sales.md"])), 2);
});

test("mega agent pack: traction playbook, 19 channels and 19 specialists, the team in AGENTS.md, pack.json and files.json", async () => {
  const pack = await build();
  const paths = pack.files.map(f => f.path);
  const file = (p: string) => pack.files.find(f => f.path === p)!;
  assert.ok(paths.indexOf("traction-playbook.md") === paths.indexOf("playbook.md") + 1);
  assert.match(file("traction-playbook.md").content, /^# How I run traction[\s\S]*# First traction for saas/);
  assert.doesNotMatch(file("traction-playbook.md").content, /First traction for local/);
  assert.deepEqual(paths.filter(p => p.startsWith("channels/")), CHANNEL_IDS.map(id => `channels/${id}.md`));
  assert.deepEqual(paths.filter(p => p.startsWith("agents/")), CHANNEL_IDS.map(id => `agents/${id}-specialist.md`));
  assert.equal(file("agents/sales-specialist.md").group, "team");
  assert.equal(file("channels/sales.md").group, "channel");
  // Prompts and workflows from the kit join the pack (no role kit here, so no prefix).
  assert.ok(paths.includes("prompts/bullseye-brainstorm.md") && paths.includes("workflows/weekly-traction-review.md"));
  assert.ok(!paths.some(p => p.startsWith("training/")), "training files are for the training pack");

  const agentsMd = file("AGENTS.md").content;
  assert.match(agentsMd, /## My channel team/);
  const team = [...agentsMd.matchAll(/^\d+\. \*\*([a-z-]+)-specialist\*\* \(([^)]+)\): (.+)$/gm)];
  assert.deepEqual(team.map(m => m[1]), CHANNEL_IDS);
  assert.match(team[0][3], /Hand me work on creators and newsletters/);
  assert.match(agentsMd, /works at the access level my brief gives it for each tool/);

  const manifest = JSON.parse(file("pack.json").content);
  assert.deepEqual(manifest.mega, { kit: "traction", variant: "saas" });
  assert.equal(manifest.team.length, 19);
  assert.deepEqual(manifest.team[0], { id: "creators-and-newsletters", name: "Creators And Newsletters", agent: "creators-and-newsletters-specialist", description: "Hand me work on creators and newsletters when it is in the inner ring." });
  // The kit counts as knowledge even before the role kit exists: its date, its sources, its review cycle.
  assert.deepEqual(manifest.knowledge, { status: "ready", updated: "2026-11-05", sources: 2 + 1 + 19 * 2, review_every_days: 14 });
  assert.match(file("knowledge.md").content, /channels\/ \(one file per channel\)/);

  // sources.md: every local Sources list, grouped by file.
  const src = file("sources.md").content;
  assert.match(src, /## First traction kit/);
  // Each file keeps its own Sources list; sources.md points to it once, so no list is in the pack twice.
  assert.match(src, /- Traction playbook: how I run traction: \d+ sources?, listed under Sources in `traction-playbook\.md`\./);
  assert.match(src, /- Traction playbook: saas: \d+ sources?, listed under Sources in `traction-playbook\.md`\./);
  assert.match(src, /- Channel: Sales: \d+ sources?, listed under Sources in `channels\/sales\.md`\./);
  assert.doesNotMatch(src, /https:\/\/sales\.example\/1/);
  assert.equal([...src.matchAll(/^- Channel: /gm)].length, 19);

  // files.json: the new kinds and the kit's shared urls.
  const index = filesIndex(pack);
  assert.deepEqual(index.mega, { kit: "traction", variant: "saas" });
  assert.equal(index.team!.length, 19);
  const kinds = new Set(index.files.map(f => f.kind));
  assert.ok(kinds.has("team") && kinds.has("channel"));
  assert.equal(fileUrl(pack, file("channels/sales.md")), "/packs/mega/traction/channels/sales.md");
  assert.equal(fileUrl(pack, file("agents/sales-specialist.md")), "/packs/mega/traction/agents/sales.md");
  assert.equal(fileUrl(pack, file("prompts/bullseye-brainstorm.md")), "/packs/mega/traction/prompts/bullseye-brainstorm.md");
  assert.equal(fileUrl(pack, file("traction-playbook.md")), "/packs/tara-traction/traction-playbook.md");
  assert.equal(file("agents/sales-specialist.md").content, fixtureKit().files["agents/sales.md"], "specialists are copied as they stand");

  // The zip: the specialists also in .claude/agents (zip only).
  const entries = await readZip(await packZip(pack), { maxEntries: 500, maxTotalBytes: 5e6 });
  const claudeAgents = entries.filter(e => e.path.startsWith("tara-traction/.claude/agents/")).map(e => e.path.slice("tara-traction/.claude/agents/".length));
  assert.deepEqual(claudeAgents, CHANNEL_IDS.map(id => `${id}-specialist.md`));
  assert.ok(!manifest.files.some((f: { path: string }) => f.path.startsWith(".")));
  assert.ok(!index.files.some(f => f.path.startsWith(".")));
});

test("mega with a role kit: clashing prompt and training names get the kit's prefix; the training pack keeps the team and marks the base method", async () => {
  const roleKit: RoleKit = {
    role: { id: "growth-marketer", name: "Growth marketer", department: "marketing", summary: "Finds the channels that win customers.", aliases: ["growth", "traction", "marketing plan"], updated: "2026-11-01", review_every_days: 30, changelog: [] },
    files: {
      "knowledge.md": "# Growth marketer: what I know\n\nThe basics.\n",
      "sources.json": JSON.stringify([{ n: 1, title: "A guide", publisher: "Pub", url: "https://role.example/1", checked: "2026-11-01", supports: "basics" }]),
      "prompts/title-tags.md": "# Role title tags\n\n```\n{{page}}\n```\n",
      "training/interview.md": "# Role interview\n\n1. Q?\n",
    },
  };
  const role = { id: "growth-marketer", name: "Growth marketer", department: "marketing" as const, summary: "Finds the channels that win customers.", aliases: ["growth", "traction", "marketing plan"] };
  const agent = await build({ role, kit: roleKit });
  const paths = agent.files.map(f => f.path);
  assert.ok(paths.includes("prompts/title-tags.md") && paths.includes("prompts/traction-title-tags.md"));
  assert.equal(agent.files.find(f => f.path === "prompts/title-tags.md")!.content, roleKit.files["prompts/title-tags.md"]);
  assert.equal(fileUrl(agent, agent.files.find(f => f.path === "prompts/traction-title-tags.md")!), "/packs/mega/traction/prompts/title-tags.md");
  const manifest = agent.manifest;
  assert.deepEqual(manifest.knowledge, { status: "ready", updated: "2026-11-05", sources: 1 + 41, review_every_days: 14 });
  assert.match(agent.files.find(f => f.path === "sources.md")!.content, /## Role knowledge \(knowledge\.md\)\n\n1\. \[A guide\]/);

  const train = await build({ kind: "train", role, kit: roleKit });
  const tp = train.files.map(f => f.path);
  const tfile = (p: string) => train.files.find(f => f.path === p)!.content;
  assert.ok(tfile("soul.md").startsWith(TEMPLATE_MARKER), "the persona's soul is not in the training pack");
  assert.ok(!train.files.some(f => f.content.includes(NOVA.profile.bio)));
  assert.match(tfile("traction-playbook.md"), /^> Base method: make it yours\./);
  assert.equal(tp.filter(p => p.startsWith("agents/")).length, 19);
  assert.equal(tp.filter(p => p.startsWith("channels/")).length, 19);
  assert.equal(tfile("training/interview.md"), roleKit.files["training/interview.md"]);
  assert.equal(tfile("training/traction-interview.md"), fixtureKit().files["training/interview.md"]);
  assert.equal(tfile("training/test-briefs.md"), fixtureKit().files["training/test-briefs.md"], "the kit's briefs replace the generic fallback");
  assert.match(tfile("AGENTS.md"), /## My channel team/);
  assert.deepEqual(train.manifest.mega, { kit: "traction", variant: "saas" });
  const trainZip = await readZip(await packZip(train), { maxEntries: 500, maxTotalBytes: 5e6 });
  assert.equal(trainZip.filter(e => e.path.includes("/.claude/agents/")).length, 19);
});

test("non-mega packs are unchanged, and {{team_list}} leaves no gap when empty", async () => {
  const plainInput: PackInput = { persona: NOVA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, options: { ...OPTIONS, kind: "agent" } };
  const a = await buildPack(plainInput);
  const b = await buildPack({ ...plainInput, mega: fixtureKit() }); // a kit given to a persona without `mega` is ignored
  assert.deepEqual(a, b);
  assert.doesNotMatch(a.files.find(f => f.path === "AGENTS.md")!.content, /My channel team|\n\n\n/);
  assert.ok(!a.files.some(f => f.group === "team" || f.group === "channel"));
  assert.equal(a.manifest.mega, undefined);
  assert.equal(a.notes.length, 0);
  const values = Object.fromEntries([...SIMPLE_PLACEHOLDERS, ...BLOCK_PLACEHOLDERS].map(k => [k, `<${k}>`])) as Parameters<typeof fillTemplate>[2];
  assert.equal(fillTemplate("AGENTS.md", "A\n\n{{team_list}}\n\nB", { ...values, team_list: "" }), "A\n\nB");
  assert.equal(fillTemplate("AGENTS.md", "A\n\n{{team_list}}\n\nB", values), "A\n\n<team_list>\n\nB");
});

test("a missing or incomplete mega kit gives a note and a normal pack, never a failure", async () => {
  const pack = await build({ mega: null });
  assert.ok(pack.notes.some(n => /traction mega kit is missing or incomplete/.test(n)));
  assert.equal(pack.manifest.knowledge.status, "pending");
  assert.equal(pack.manifest.mega, undefined);
  assert.ok(!pack.files.some(f => f.path === "traction-playbook.md" || f.path.startsWith("channels/")));
  // A kit without this agent's variant file counts as missing for it.
  const partial = fixtureKit();
  delete partial.files["variants/saas.md"];
  assert.ok((await build({ mega: partial })).notes.some(n => /variant saas/.test(n)));
  // A real AGENTS.md template without {{team_list}} still gets the team, at the end, with a note.
  const custom = await build({ templates: { "AGENTS.md": "# {{name}}\n\nRead soul.md first.\n" } });
  assert.match(custom.files.find(f => f.path === "AGENTS.md")!.content, /^# Tara\n\nRead soul\.md first\.\n\n## My channel team/);
  assert.ok(custom.notes.some(n => /has no \{\{team_list\}\}/.test(n)));
});
