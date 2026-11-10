// Toolboxes: a role kit's toolbox.json becomes toolbox.md and the full text of every library item it names, so an
// agent picks its own tools and nothing is searched at job time. Uses two fixture toolboxes (graphic designer and
// bookkeeper) against the real role kits, personas, job types and library items.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  brandFacing, buildPack, fileUrl, filesIndex, freeWording, intakeAsks, oneFileText, packZip, PackBuildError, validateRoleKit,
  type BuiltPack, type PackInput, type RoleKit,
} from "../src/modules/packs/build.ts";
import { lintNotes, lintPack } from "../src/modules/packs/lint.ts";
import { readZip } from "../src/modules/packs/zip.ts";
import {
  TOOLBOX_WORD_BUDGET, checkToolbox, leadAgentOfRole, renderLibraryItem, renderToolGuide, resolveItemFiles, toolboxIndex, toolboxLibraryRefs,
  wordCount, yamlLite, type HelperRole, type LibraryItem, type LibraryType, type ToolboxJson,
} from "../src/modules/packs/toolbox.ts";
import { housePersonas } from "../src/modules/directory/index.ts";
import { getRole, listRoles } from "../src/modules/directory/roles.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOGUE = path.join(ROOT, "..", "catalogue-items");
const read = (...p: string[]) => readFileSync(path.join(...p), "utf8");
const shared = (p: string) => read(ROOT, "packs", "shared", p);
const TEMPLATES = Object.fromEntries(["AGENTS.md", "WORK-METHOD.md", "README.md", "LICENSE.md", "train/AGENTS.md", "train/README.md", "train/instructions.md", "train/soul.md", "train/personality.md"].map(p => [p, shared(p)]));
const TOOLS = { "capture-brand-dna.mjs": "// capture\nexport {};\n", "brand-dna-snippet.js": "// snippet\n", "check-brand-fidelity.mjs": "// check\nexport {};\n", "ai-default-patterns.md": "# AI default patterns\n\n- **web-template-stack**: the average landing page.\n" };

const fixture = (role: string): ToolboxJson => JSON.parse(read(ROOT, "test", "fixtures", "toolbox", `${role}.toolbox.json`));

/** A real role kit from packs/roles, with the fixture toolbox.json added (or not). */
function kitOf(roleId: string, toolbox: unknown | null = fixture(roleId)): RoleKit {
  const dir = path.join(ROOT, "packs", "roles", roleId);
  const files: Record<string, string> = {};
  const walk = (rel: string) => {
    for (const name of readdirSync(path.join(dir, rel)).sort()) {
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(path.join(dir, r)).isDirectory()) walk(r);
      else if (/\.(md|json)$/.test(r)) files[r] = read(dir, r);
    }
  };
  walk("");
  const role = JSON.parse(files["role.json"]);
  delete files["role.json"];
  // The fixture stands in for a curator's file, whatever the kit already holds.
  delete files["toolbox.json"];
  if (toolbox) files["toolbox.json"] = JSON.stringify(toolbox);
  return { role, files };
}

const ITEM_GROUPS = ["general", "ecommerce", "imported", "agents", "orchestrators"];
const itemDir = (slug: string) => ITEM_GROUPS.map(g => path.join(CATALOGUE, g, slug)).find(d => existsSync(path.join(d, "SKILL.md"))) ?? null;

/** The library items a toolbox names, read from catalogue-items the way scripts/build-packs.mjs does. */
function libraryFor(toolbox: ToolboxJson): Record<string, LibraryItem> {
  const out: Record<string, LibraryItem> = {};
  for (const { slug, type } of toolboxLibraryRefs(toolbox)) {
    if (type === "tool") out[slug] = renderToolGuide(slug, read(CATALOGUE, "ai-tools", `${slug}.yaml`));
    else if (type === "mind") {
      const meta = yamlLite(read(CATALOGUE, "minds", slug, "mind.yaml")) as Record<string, string>;
      out[slug] = renderLibraryItem({ slug, type, name: meta.name, summary: meta.summary, main: read(CATALOGUE, "minds", slug, "SKILL.md") });
    } else {
      const dir = itemDir(slug)!;
      const meta = yamlLite(read(dir, "item.yaml")) as Record<string, string | string[]>;
      out[slug] = renderLibraryItem({ slug, type: meta.type as Exclude<LibraryType, "tool">, name: meta.name as string, summary: meta.summary as string, main: read(dir, "SKILL.md"), uses: Array.isArray(meta.uses) ? meta.uses : [] });
    }
  }
  return out;
}

const HELPERS: Record<string, HelperRole> = Object.fromEntries(listRoles().map(r => {
  const lead = leadAgentOfRole(housePersonas(), r.id);
  return [r.id, { name: r.name, lead: lead ? { id: lead.id, name: lead.name, title: lead.title } : null }];
}));
const persona = (id: string) => housePersonas().find(p => p.id === id)!;

function build(agentId: string, over: Partial<PackInput> = {}, kind: "agent" | "train" = "agent") {
  const p = persona(agentId);
  const kit = over.kit === undefined ? kitOf(p.role!) : over.kit;
  const toolbox = kit?.files["toolbox.json"] ? JSON.parse(kit.files["toolbox.json"]) as ToolboxJson : null;
  return buildPack({
    persona: p, role: getRole(p.role), kit, jobTypes: listJobTypes(), templates: TEMPLATES, tools: TOOLS,
    library: toolbox ? libraryFor(toolbox) : {}, helpers: HELPERS, options: { kind, version: "2026.11.10", updated: "2026-11-10" }, ...over,
  });
}
const file = (pack: BuiltPack, p: string) => pack.files.find(f => f.path === p)?.content;

// ---------- The fixtures and the library reader ----------

test("the fixture toolboxes follow the spec, and every slug they name is a real library item", () => {
  const roleIds = new Set(listRoles().map(r => r.id));
  for (const role of ["graphic-designer", "bookkeeper"]) {
    const kit = kitOf(role);
    const checked = checkToolbox(fixture(role), role, Object.keys(kit.files), roleIds);
    assert.deepEqual(checked.errors, [], role);
    assert.equal(checked.toolbox!.role, role);
    // The fixtures are small on purpose; the size rules (10 to 24 tasks, 30 to 70 library items) come back as warnings.
    assert.ok(checked.warnings.some(w => /library item\(s\); the rule is 30 to 70/.test(w)), checked.warnings.join("\n"));
    assert.ok(!checked.warnings.some(w => /no task uses/.test(w)), `every kit skill, prompt and workflow is in a task: ${checked.warnings.join("; ")}`);
    for (const { slug, type } of toolboxLibraryRefs(checked.toolbox!)) {
      const there = type === "tool" ? existsSync(path.join(CATALOGUE, "ai-tools", `${slug}.yaml`)) : type === "mind" ? existsSync(path.join(CATALOGUE, "minds", slug, "SKILL.md")) : !!itemDir(slug);
      assert.ok(there, `${role}: library:${slug} (${type}) is in catalogue-items`);
      if (type !== "tool" && type !== "mind") assert.equal((yamlLite(read(itemDir(slug)!, "item.yaml")) as Record<string, string>).type, type, `${slug} has the type the fixture gives`);
    }
    assert.deepEqual(validateRoleKit(kit, roleIds).errors, []);
  }
});

test("the small YAML reader reads the library's item, mind and tool files", () => {
  const item = yamlLite(read(CATALOGUE, "orchestrators", "ad-landing-page", "item.yaml")) as Record<string, unknown>;
  assert.equal(item.type, "workflow");
  assert.equal(item.name, "Get a checked landing page for your best ad");
  assert.deepEqual(item.uses, ["website-brand-brain-builder", "ad-matched-landing-page-writer", "landing-page-design-planner", "landing-page-30-point-checker"]);
  const tool = yamlLite(read(CATALOGUE, "ai-tools", "adobe-firefly.yaml")) as Record<string, any>;
  assert.equal(tool.maker, "Adobe");
  assert.deepEqual(tool.use_cases, ["make-images", "make-video", "design"]);
  assert.equal(tool.pricing.model, "freemium");
  assert.ok(Array.isArray(tool.first_result.web) && tool.first_result.web.length >= 3);
  assert.match(tool.what_it_does[0], /^Makes images and vector graphics/);
  // Text that wraps onto the next line, a list of maps, and a file written as JSON.
  assert.deepEqual(yamlLite("summary: \"One line that\n  wraps.\"\nitems:\n  - id: a\n    name: First\n  - id: b\n    name: \"Second: two\"\nplain: yes # note\n"),
    { summary: "One line that wraps.", items: [{ id: "a", name: "First" }, { id: "b", name: "Second: two" }], plain: "yes" });
  assert.deepEqual(yamlLite('{"slug": "x", "also": ["a", "b"]}'), { slug: "x", also: ["a", "b"] });
  assert.equal((yamlLite(read(CATALOGUE, "minds", "david-carson", "mind.yaml")) as Record<string, string>).name, "David Carson");
});

test("a library item ships with a three-line header and without the parts only the website needs", () => {
  const dir = itemDir("layout-default-breaker")!;
  const item = renderLibraryItem({ slug: "layout-default-breaker", type: "skill", name: "Layout default breaker", summary: "Find the layout choices your software made for you.", main: read(dir, "SKILL.md") });
  assert.match(item.text, /^# Layout default breaker\n\nWhat it gives: Find the layout choices your software made for you\.\n\nSource: https:\/\/useaiblocks\.com\/skills\/layout-default-breaker \(AI Blocks library\)\n\n/);
  assert.doesNotMatch(item.text, /^---$/m, "no YAML front matter");
  assert.doesNotMatch(item.text, /<!--|add-needs\.mjs/, "no build markers");
  assert.doesNotMatch(item.text, /## After this|If they pick one and that skill is added here/, "no cross-sell block");
  assert.equal(item.text.match(/^# /gm)!.length, 1, "one top heading: the header's");
  assert.match(item.text, /## Steps/, "the method itself is whole");
  assert.ok(item.text.endsWith("\n") && !item.text.includes("\r"));
  assert.equal(item.url, "https://useaiblocks.com/skills/layout-default-breaker");
  // A workflow's step skills are named with the one page where each can be read: a lookup, not a search.
  const flowDir = itemDir("make-a-readable-event-poster")!;
  const flow = renderLibraryItem({ slug: "make-a-readable-event-poster", type: "workflow", name: "Make a readable event poster", summary: "A poster layout.", main: read(flowDir, "SKILL.md"), uses: ["type-led-poster-planner", "poster-designer", "colour-contrast-checker"] });
  assert.match(flow.text, /`type-led-poster-planner` \(https:\/\/useaiblocks\.com\/skills\/type-led-poster-planner\/SKILL\.md\)/);
  assert.match(flow.text, /Use your own copy when toolbox\.md lists that skill/);
  assert.equal(flow.url, "https://useaiblocks.com/workflows/make-a-readable-event-poster");
  // The item's own extra files point at the library's copy; a command keeps its path and says where to get the file.
  const fixed = resolveItemFiles("Read references/grid.md first. Run `python scripts/check.py page.html`. Update the README.md.", ["references/grid.md", "scripts/check.py", "README.md"], "https://useaiblocks.com/skills/x");
  assert.equal(fixed, "Read https://useaiblocks.com/skills/x/references/grid.md first. Run `python scripts/check.py page.html` (get https://useaiblocks.com/skills/x/scripts/check.py first). Update the README.md.");
  assert.equal(resolveItemFiles(fixed, ["references/grid.md", "scripts/check.py"], "https://useaiblocks.com/skills/x"), fixed, "safe to run twice");
  // An AI tool guide is written out from its YAML.
  const guide = renderToolGuide("adobe-firefly", read(CATALOGUE, "ai-tools", "adobe-firefly.yaml"));
  assert.match(guide.text, /^# Adobe Firefly\n\nWhat it gives: Make images, video and audio from a prompt/);
  assert.match(guide.text, /Source: https:\/\/useaiblocks\.com\/ai-tools\/adobe-firefly/);
  for (const h of ["## What it does", "## Best for", "## Not for", "## How to get a first result (web)", "## What you need", "## Sources"]) assert.ok(guide.text.includes(`\n${h}\n`), h);
  assert.equal(guide.type, "tool");
});

test("toolbox.json: a broken file stops the build with plain errors; size and quality rules are warnings", () => {
  const kit = kitOf("graphic-designer");
  const paths = Object.keys(kit.files);
  const base = fixture("graphic-designer");
  const errors = (change: (t: any) => void) => { const t = structuredClone(base) as any; change(t); return checkToolbox(t, "graphic-designer", paths).errors.join("\n"); };
  assert.match(errors(t => { t.schema = "toolbox/2"; }), /schema must be "ai-blocks-toolbox\/1"/);
  assert.match(errors(t => { t.role = "bookkeeper"; }), /role must be "graphic-designer"/);
  assert.match(errors(t => { t.tasks[0].items[0].ref = "kit:skills/no-such-skill"; }), /names skills\/no-such-skill\/SKILL\.md, which the role kit does not have/);
  assert.match(errors(t => { t.tasks[0].items[0].ref = "kit:skills/social-graphics-spec/SKILL.md"; }), /with no file ending/);
  assert.match(errors(t => { delete t.tasks[0].items[1].type; }), /a library item needs a type/);
  assert.match(errors(t => { t.tasks[0].items[1].use = "sell"; }), /use must be one of brief, explore, build, check, think/);
  assert.match(errors(t => { t.tasks[1].id = t.tasks[0].id; }), /the id is used twice/);
  assert.match(errors(t => { t.tasks[0].kind = "poster"; }), /kind must be one of web_page/);
  assert.match(errors(t => { t.tasks = []; }), /tasks must be a list with at least one task/);
  assert.match(errors(t => { t.tasks[0].items[0].ref = "social-graphics-spec"; }), /needs a ref that starts with kit: or library:/);
  const warned = (change: (t: any) => void) => { const t = structuredClone(base) as any; change(t); const c = checkToolbox(t, "graphic-designer", paths, new Set(["conversion-copywriter"])); assert.deepEqual(c.errors, []); return c; };
  const helpers = warned(() => {});
  assert.ok(helpers.warnings.some(w => /helper brand-designer is not a role in packs\/roles\/, so it is left out/.test(w)));
  assert.deepEqual(helpers.toolbox!.helpers.map(h => h.role), ["conversion-copywriter"]);
  assert.ok(warned(t => { t.tasks[0].items[0].when = "x".repeat(121); }).warnings.some(w => /"when" is 121 characters; the most is 120/.test(w)));
  assert.ok(warned(t => { t.tasks[0].items = t.tasks[0].items.filter((i: any) => i.use !== "explore"); }).warnings.some(w => /task social-carousel: a buyer sees this work, but it has no "explore" item/.test(w)));
  assert.ok(warned(t => { t.tasks.pop(); t.tasks[0].items = t.tasks[0].items.filter((i: any) => !/monthly-social/.test(i.ref)); }).warnings.some(w => /no task uses workflows\/monthly-social-graphics-batch\.md/.test(w)));
  // The builder refuses a broken toolbox too, so a pack is never half-built from one.
  const broken = { ...kit, files: { ...kit.files, "toolbox.json": JSON.stringify({ ...base, schema: "nope" }) } };
  assert.ok(validateRoleKit(broken).errors.some(e => /toolbox\.json: schema must be/.test(e)));
});

// ---------- Packs that carry the toolbox ----------

test("a curated pack: toolbox.md says what to use when, carries every listed item in full, and ends with who to bring in", async () => {
  const pack = await build("riley-carousels");
  const toolbox = file(pack, "toolbox.md")!;
  assert.deepEqual(pack.files.slice(0, 4).map(f => f.path), ["README.md", "AGENTS.md", "CLAUDE.md", "toolbox.md"]);
  assert.match(toolbox, /^# Riley's toolbox\n\nEverything a graphic designer is hired for, and what to use for each task\. Every file named here is already in this pack: choose what fits the task at your own discretion, open only what you chose, and never search for more\./);
  // Each line: the "when", the item's plain name, what it is for, and its path in the pack.
  assert.match(toolbox, /- When you need exact sizes, type and safe areas for each post: \*\*Social graphics spec\*\* \(build, skill\) `skills\/social-graphics-spec\/SKILL\.md`/);
  assert.match(toolbox, /- Before you settle a layout, to get three hand-made alternatives: \*\*Layout default breaker\*\* \(explore, skill\) `toolbox\/skill\/layout-default-breaker\.md`/);
  assert.match(toolbox, /\*\*David Carson\*\* \(think, thinking lens\) `toolbox\/mind\/david-carson\.md`/);
  assert.match(toolbox, /\*\*Canva\*\* \(build, AI tool guide\) `toolbox\/tool\/canva\.md`/);
  assert.match(toolbox, /\*\*Make a readable event poster\*\* \(build, workflow\) `toolbox\/workflow\/make-a-readable-event-poster\.md`/);
  assert.match(toolbox, /\(check, helper agent\) `toolbox\/agent\/agency-design-brand-guardian\.md`/);
  // Riley designs social posts: that task leads, under "Your usual work"; the rest of the role follows.
  const usual = toolbox.indexOf("## Your usual work"), other = toolbox.indexOf("## Other work in your role");
  assert.ok(usual > 0 && other > usual);
  assert.ok(toolbox.indexOf("### Make a carousel or a set of social posts") > usual && toolbox.indexOf("### Make a carousel or a set of social posts") < other);
  assert.ok(toolbox.indexOf("### Prepare artwork specs for merch and packaging") > other);
  for (const t of fixture("graphic-designer").tasks) assert.ok(toolbox.includes(`### ${t.task}`), `every task is there: ${t.task}`);
  // Where the job's gates are, and the items for every job.
  assert.match(toolbox, /## Your jobs\n\n[^\n]+\n\n- [^\n]+ `skills\/social-graphics-spec-job\/SKILL\.md`/);
  assert.match(toolbox, /## On every job\n\n- Before any work that must look or sound like the client: \*\*Brand DNA capture\*\* \(brief, skill\) `toolbox\/skill\/brand-dna-capture\.md`/);
  // It ends with the helpers: the role, how to load it, and its pack.
  const who = toolbox.slice(toolbox.indexOf("## Who to bring in"));
  assert.ok(toolbox.trimEnd().endsWith(who.trimEnd()) && who.length > 100, "Who to bring in is the last section");
  assert.match(who, /Load a helper with `load_agent` and its `role_id`/);
  const copy = HELPERS["conversion-copywriter"];
  assert.ok(who.includes(`- **${copy.name}** (\`role_id: "conversion-copywriter"\`, https://agents.useaiblocks.com/packs/${copy.lead!.id}.zip): When the piece needs more copy than a headline and a line.`), who);
  assert.equal((who.match(/^- \*\*/gm) ?? []).length, 4);
  assert.ok(wordCount(toolbox) <= TOOLBOX_WORD_BUDGET, `${wordCount(toolbox)} words`);

  // Every path toolbox.md names is a file of the pack, and every library item is there in full, once.
  const have = new Set(pack.files.map(f => f.path));
  for (const [, p] of toolbox.matchAll(/`((?:skills|prompts|workflows|toolbox)\/[^`]+)`/g)) assert.ok(have.has(p), p);
  const items = pack.files.filter(f => f.source === "toolbox");
  const named = toolboxLibraryRefs(fixture("graphic-designer"));
  assert.equal(items.length, named.length);
  assert.deepEqual(items.map(f => f.path), named.map(n => `toolbox/${n.type}/${n.slug}.md`).sort());
  for (const f of items) {
    assert.match(f.content, /^# .+\n\nWhat it gives: .+\n\nSource: https:\/\/useaiblocks\.com\/(skills|workflows|prompts|agents|minds|ai-tools)\/[a-z0-9-]+ \(AI Blocks library\)\n/, f.path);
    assert.equal(f.group, "toolbox");
    assert.equal(fileUrl(pack, f), `/packs/${f.path}`, "stored once for every pack, not once per agent");
  }
  assert.ok(file(pack, "toolbox/skill/layout-default-breaker.md")!.length > 4000, "the full text, not a link");
  // library.md is gone: the toolbox carries those items. The kit's library.json stays an input for curators.
  assert.ok(!have.has("library.md"));
  assert.doesNotMatch(file(pack, "README.md")!, /library\.md/);
  assert.match(file(pack, "README.md")!, /\| `toolbox\/` \| The 24 library items toolbox\.md names, each in full in its own file\. \|/);
  assert.deepEqual(lintPack(pack), []);
  assert.deepEqual(lintNotes(pack), []);
  assert.deepEqual(pack.notes.filter(n => /toolbox/.test(n)), []);

  // The zip holds them all; pack.json lists them with their checksums.
  const names = (await readZip(await packZip(pack), { maxEntries: 500, maxTotalBytes: 20_000_000 })).map(e => e.path);
  for (const f of items) assert.ok(names.includes(`riley-carousels/${f.path}`), f.path);
  assert.ok(names.includes("riley-carousels/toolbox.md"));
  const manifest = JSON.parse(file(pack, "pack.json")!);
  assert.ok(manifest.files.some((f: { path: string }) => f.path === "toolbox/mind/david-carson.md"));
});

test("files.json carries what a profile needs: tasks, item counts and names by type, and helpers", async () => {
  const pack = await build("riley-carousels");
  const index = filesIndex(pack);
  const t = index.toolbox!;
  assert.equal(t.schema, "ai-blocks-toolbox-summary/1");
  assert.equal(t.reviewed, "2026-11-10");
  assert.equal(t.tasks.length, 8);
  assert.deepEqual(t.tasks[0], { id: "social-carousel", task: "Make a carousel or a set of social posts", kind: "ad_creative", mine: true, items: 7 });
  assert.ok(t.tasks.some(x => !x.mine));
  assert.deepEqual(t.counts, { kit: 11, skill: 15, workflow: 1, prompt: 1, agent: 1, mind: 3, tool: 3, total: 35 });
  assert.deepEqual(t.items.mind.map(m => m.name), ["David Carson", "Massimo Vignelli", "Paula Scher"]);
  assert.deepEqual(t.items.tool[0], { slug: "adobe-firefly", name: "Adobe Firefly", path: "toolbox/tool/adobe-firefly.md", url: "https://useaiblocks.com/ai-tools/adobe-firefly" });
  assert.ok(t.items.kit.some(k => k.name === "Social graphics spec" && k.path === "skills/social-graphics-spec/SKILL.md" && k.kind === "skill"));
  assert.ok(t.items.kit.some(k => k.kind === "prompt") && t.items.kit.some(k => k.kind === "workflow"));
  assert.deepEqual(t.helpers.map(h => h.role), ["conversion-copywriter", "brand-designer", "product-photographer", "social-media-manager"]);
  assert.equal(t.helpers[0].agent!.id, HELPERS["conversion-copywriter"].lead!.id);
  assert.deepEqual(t.left_out, []);
  assert.ok(t.words > 300 && t.words <= TOOLBOX_WORD_BUDGET);
  const item = index.files.find(f => f.path === "toolbox/skill/layout-default-breaker.md")!;
  assert.deepEqual({ url: item.url, kind: item.kind }, { url: "/packs/toolbox/skill/layout-default-breaker.md", kind: "toolbox" });
  assert.match(item.purpose, /^Skill: /);
  assert.equal(index.files.find(f => f.path === "toolbox.md")!.url, "/packs/riley-carousels/toolbox.md");
  assert.equal(index.files.find(f => f.path === "toolbox.md")!.kind, "start");
});

test("each agent's own kind of work comes first; a generalist keeps the curator's order", async () => {
  const head = (md: string) => /## Your usual work\n\n### ([^\n]+)/.exec(md)?.[1];
  assert.equal(head(file(await build("riley-carousels"), "toolbox.md")!), "Make a carousel or a set of social posts");
  assert.equal(head(file(await build("lloyd-print-layout"), "toolbox.md")!), "Design a poster or flyer for an event or an offer");
  assert.equal(head(file(await build("pedro-payouts"), "toolbox.md")!), "Match Stripe, Shopify or PayPal payouts to sales");
  // Russell is the bookkeeper for every bookkeeping job: no split, most common task first.
  const russell = file(await build("russell-bookkeeping"), "toolbox.md")!;
  assert.doesNotMatch(russell, /## Your usual work|## Other work in your role/);
  assert.match(russell, /## Your work, by task\n\n### Close the month and explain what moved/);
  assert.ok(russell.indexOf("### Close the month") < russell.indexOf("### Hand a clean year-end pack to the accountant"));
});

test("a long toolbox keeps every task, trims each to its best few items and moves the rest to More", async () => {
  const base = fixture("graphic-designer");
  // 24 tasks of 7 items: far past the word budget.
  const tasks = Array.from({ length: 24 }, (_, i) => ({ ...base.tasks[i % 2], id: `task-${i + 1}`, task: `${base.tasks[i % 2].task} ${i + 1}` }));
  const pack = await build("lloyd-print-layout", { kit: kitOf("graphic-designer", { ...base, tasks }) });
  const md = file(pack, "toolbox.md")!;
  for (const t of tasks) assert.ok(md.includes(`### ${t.task}\n`), t.task);
  const main = md.slice(0, md.indexOf("\n## More"));
  assert.ok(md.includes("\n## More\n"), "the rest are listed under More");
  // Each task keeps its best 4, with something to build with, something to explore and something to check with.
  const section = (title: string) => main.slice(main.indexOf(`### ${title}\n`)).split("\n### ")[0].split("\n## ")[0];
  for (const t of tasks) {
    const part = section(t.task);
    assert.equal((part.match(/^- /gm) ?? []).length, 4, t.task);
    for (const use of ["build", "explore", "check"]) assert.match(part, new RegExp(`\\(${use}, `), `${t.task}: ${use}`);
  }
  // 24 tasks of 4 still run past the budget: the pack builds, and the linter says the list needs trimming.
  assert.ok(wordCount(main) > TOOLBOX_WORD_BUDGET);
  assert.ok(lintNotes(pack).some(n => n.rule === "toolbox_long"));
  assert.match(md, /## More\n\nMore items for the tasks above\. Open one when the first choices do not fit\.\n\n- /);
  // Everything is still in the pack, and "Who to bring in" still ends the file.
  assert.equal(pack.files.filter(f => f.source === "toolbox").length, toolboxLibraryRefs(base).filter(l => base.always.some(a => a.ref === `library:${l.slug}`) || tasks.some(t => t.items.some(i => i.ref === `library:${l.slug}`))).length);
  assert.ok(md.indexOf("## Who to bring in") > md.indexOf("## More"));
  assert.deepEqual(lintPack(pack), []);
  assert.equal(pack.toolbox!.summary.words, wordCount(main));
});

test("an item the build cannot ship is left out with a note; the pack still builds and lints clean", async () => {
  const toolbox = fixture("bookkeeper");
  const library = libraryFor(toolbox);
  delete library["tax-set-aside-planner"];
  const pack = await build("russell-bookkeeping", { library });
  const md = file(pack, "toolbox.md")!;
  assert.doesNotMatch(md, /tax-set-aside-planner/);
  assert.match(md, /### Work out what to set aside for tax\n\n- When the owner asks how much to keep back each month: \*\*[^*]+\*\* \(build, prompt\) `prompts\/tax-set-aside-plan\.md`/, "the task keeps its other items");
  assert.ok(pack.notes.some(n => /library:tax-set-aside-planner is not available to this build, so packs leave it out/.test(n)));
  assert.deepEqual(pack.toolbox!.summary.left_out, ["library:tax-set-aside-planner"]);
  assert.ok(lintNotes(pack).some(n => n.rule === "toolbox_left_out"));
  assert.deepEqual(lintPack(pack), []);
  // A helper role with no live agent is left out the same way.
  const noLead = await build("russell-bookkeeping", { helpers: { ...HELPERS, "ap-ar-specialist": { name: "AP and AR specialist", lead: null } } });
  assert.doesNotMatch(file(noLead, "toolbox.md")!, /ap-ar-specialist/);
  assert.ok(noLead.notes.some(n => /helper ap-ar-specialist has no live agent yet/.test(n)));
});

test("a role with no toolbox.json builds as before: a plain toolbox.md, library.md kept, and a note from the linter", async () => {
  const pack = await build("russell-bookkeeping", { kit: kitOf("bookkeeper", null) });
  assert.equal(pack.toolbox, null);
  assert.equal(filesIndex(pack).toolbox, null);
  const md = file(pack, "toolbox.md")!;
  assert.match(md, /^# Russell's toolbox\n\nThe skills, prompts and workflows in this pack for the bookkeeper role\./);
  for (const h of ["## Your jobs", "## Skills", "## Prompts", "## Workflows"]) assert.ok(md.includes(`\n${h}\n`), h);
  assert.match(md, /\*\*[^*]+\*\* `skills\/bank-reconciliation\/SKILL\.md`/);
  assert.match(md, /`workflows\/month-end-close\.md`/);
  assert.ok(pack.files.some(f => f.path === "library.md"), "library.md stays until the toolbox replaces it");
  assert.ok(!pack.files.some(f => f.source === "toolbox"));
  assert.deepEqual(lintPack(pack), []);
  assert.deepEqual(lintNotes(pack).map(n => n.rule), ["no_toolbox"]);
  assert.match(lintNotes(pack)[0].message, /^bookkeeper: no toolbox\.json yet/);
  // AGENTS.md is the same for both: it always sends the agent to toolbox.md.
  assert.match(file(pack, "AGENTS.md")!, /Find the task in `toolbox\.md`/);
});

test("the training pack names library items by address and keeps library.md", async () => {
  const train = await build("riley-carousels", {}, "train");
  const md = file(train, "toolbox.md")!;
  assert.ok(!train.files.some(f => f.path.startsWith("toolbox/")), "the studio import takes a small pack of text files");
  assert.match(md, /\*\*Layout default breaker\*\* \(explore, skill\) https:\/\/agents\.useaiblocks\.com\/packs\/toolbox\/skill\/layout-default-breaker\.md/);
  assert.match(md, /Role files are in this pack, and each library item is one named page at the address given/);
  assert.match(md, /`skills\/social-graphics-spec\/SKILL\.md`/);
  assert.ok(train.files.some(f => f.path === "library.md"), "the training AGENTS.md names library.md");
  assert.deepEqual(lintPack(train), []);
  assert.deepEqual(lintNotes(train), []);
});

test("the one-file text carries toolbox.md and the best 8 library items; the rest are named by address", async () => {
  const pack = await build("riley-carousels");
  const text = oneFileText(pack, "https://agents.test");
  const parts = [...text.matchAll(/^===== FILE: (.+) =====$/gm)].map(m => m[1]);
  assert.deepEqual(parts.slice(0, 2), ["AGENTS.md", "toolbox.md"]);
  const inline = parts.filter(p => p.startsWith("toolbox/"));
  assert.equal(inline.length, 8);
  assert.deepEqual(inline.slice().sort(), pack.toolbox!.top.slice(0, 8).sort());
  // The ones for every job and for Riley's own task come first; a lens (about 30 KB each) is never inlined.
  assert.ok(inline.includes("toolbox/skill/brand-dna-capture.md") && inline.includes("toolbox/skill/layout-default-breaker.md"));
  assert.ok(!inline.some(p => p.startsWith("toolbox/mind/")));
  // In the toolbox.md part, an item that is here keeps its path; one that is not gets its address.
  const toolbox = text.slice(text.indexOf("===== FILE: toolbox.md ====="), text.indexOf("===== FILE: WORK-METHOD.md ====="));
  assert.match(toolbox, /\*\*Layout default breaker\*\* \(explore, skill\) `toolbox\/skill\/layout-default-breaker\.md`/);
  assert.match(toolbox, /\*\*David Carson\*\* \(think, thinking lens\) `https:\/\/agents\.test\/packs\/toolbox\/mind\/david-carson\.md`/);
  assert.match(text, /The toolbox\.md part names 24 library items: 8 are parts of this file, and each of the other 16 is one page at the address beside its name\./);
  const all = pack.files.filter(f => f.source === "toolbox").reduce((n, f) => n + f.content.length, 0);
  const whole = oneFileText(pack, "https://agents.test", 99);
  assert.ok(text.length < whole.length - all / 3, "most of the item text stays out, so the file stays small enough to attach");
  assert.equal(oneFileText(pack, "https://agents.test"), text, "the same pack gives the same bytes");
});

// ---------- Template leaks ----------

test("intake fits the role: only brand-facing work is asked about brands, and only it carries the capture tools", async () => {
  assert.equal(brandFacing("design", []), true);
  assert.equal(brandFacing("finance", ["analysis", "ops_doc"]), false);
  assert.equal(brandFacing("people", ["copy"]), false, "a recruiter's job post is not brand work");
  assert.equal(brandFacing("sales", ["email"]), true, "sales copy is");
  assert.equal(brandFacing("operations", ["web_page"]), true, "a web page always is");
  assert.match(intakeAsks("marketing", []).asks, /brands they admire and avoid/);
  for (const dept of ["finance", "people", "customer-support", "engineering", "operations", "data"]) {
    const asks = intakeAsks(dept, ["ops_doc"]);
    assert.doesNotMatch(asks.asks, /brands they admire|price point/, dept);
    assert.doesNotMatch(asks.start, /website/, dept);
    assert.ok(asks.asks.split(", ").length >= 4, dept);
  }
  const riley = await build("riley-carousels"), russell = await build("russell-bookkeeping");
  assert.match(file(riley, "AGENTS.md")!, /ask for the business name, the website \(or what they can paste\) and what they need done/);
  assert.match(file(riley, "AGENTS.md")!, /position, price point, what must never change, brands they admire and avoid, and the access level for each tool/);
  const agents = file(russell, "AGENTS.md")!;
  assert.match(agents, /ask for the business name, what they need done, and the files, exports or account the job runs on/);
  assert.match(agents, /the period to cover, the accounting software and the bank or payout exports, cash or accrual basis, who the records are for, and the access level for each tool/);
  assert.doesNotMatch(agents, /brands they admire|the website/);
  // The brand-capture tools: in the designer's pack, not in the bookkeeper's.
  assert.equal(riley.files.filter(f => f.path.startsWith("tools/")).length, 4);
  assert.equal(russell.files.filter(f => f.path.startsWith("tools/")).length, 0);
  assert.doesNotMatch(file(russell, "context/README.md")!, /brand-dna\.json|## Tools/);
  assert.match(file(riley, "context/README.md")!, /## Tools/);
  assert.deepEqual(lintPack(russell), []);
});

test("packs are free: no wording left from priced jobs", async () => {
  assert.equal(freeWording("Base price covers one page. Up to two per job."), "One job covers one page. Up to two per job.");
  for (const id of ["dawei-landing-pages", "anjali-recruiter", "araceli-inbox", "russell-bookkeeping"]) {
    const pack = await build(id, { kit: kitOf(persona(id).role!, null) });
    for (const f of pack.files) assert.doesNotMatch(f.content, /base price/i, `${id}: ${f.path}`);
    assert.deepEqual(lintPack(pack), [], id);
  }
  const dawei = file(await build("dawei-landing-pages", { kit: kitOf("cro-specialist", null) }), "skills.md")!;
  assert.match(dawei, /One job covers one page\. Up to two per job\./);
  // The linter catches it if it ever comes back in the builder's own files.
  const pack = await build("russell-bookkeeping");
  const leak: BuiltPack = { ...pack, files: [...pack.files, { ...pack.files[1], path: "notes.md", source: "agent", content: "Base price covers ten.\n" }] };
  assert.ok(lintPack(leak).some(i => i.rule === "price_wording" && i.file === "notes.md"));
});

// ---------- Helpers and the library index ----------

test("a job role has one lead agent, and the index says which roles and agents carry each library item", () => {
  const lead = leadAgentOfRole(housePersonas(), "bookkeeper")!;
  assert.equal(lead.id, "russell-bookkeeping", "the lowest sort wins");
  assert.equal(leadAgentOfRole(housePersonas(), "no-such-role"), null);
  const mega = { id: "m", kind: "house" as const, status: "live" as const, role: "r", sort: 1, mega: { kit: "traction" as const, variant: "general" as const } };
  const plain = { id: "p", kind: "house" as const, status: "live" as const, role: "r", sort: 900 };
  assert.equal(leadAgentOfRole([mega, plain], "r")!.id, "p", "a mega agent leads only when no other agent has the role");
  assert.equal(leadAgentOfRole([mega, { ...plain, status: "hidden" as const }], "r")!.id, "m");

  const boxes = [fixture("graphic-designer"), fixture("bookkeeper")];
  const library = { ...libraryFor(boxes[0]), ...libraryFor(boxes[1]) };
  delete library["canva"];
  const agentsOf = (role: string) => housePersonas().filter(p => p.role === role && p.status === "live").map(p => ({ id: p.id, name: p.name, title: p.title }));
  const index = toolboxIndex(boxes, library, { "graphic-designer": { name: "Graphic designer", agents: agentsOf("graphic-designer") }, bookkeeper: { name: "Bookkeeper", agents: agentsOf("bookkeeper") } });
  assert.equal(index.schema, "ai-blocks-toolbox-index/1");
  assert.deepEqual(index.items["layout-default-breaker"], { type: "skill", name: "Layout default breaker", roles: ["graphic-designer"] });
  assert.deepEqual(index.items["excel-table-join-reconciler"].roles, ["bookkeeper"]);
  assert.equal(index.items["canva"], undefined, "only items the packs really carry");
  assert.deepEqual(Object.keys(index.items), Object.keys(index.items).slice().sort());
  assert.ok(index.roles.bookkeeper.agents.some(a => a.id === "russell-bookkeeping"));
  assert.deepEqual(Object.keys(index.roles), ["bookkeeper", "graphic-designer"]);
});

test("a toolbox with an error never builds a pack", async () => {
  const bad = { ...fixture("bookkeeper"), tasks: [{ id: "x", task: "Do it", kind: "analysis", items: [{ ref: "kit:skills/nope", use: "build", when: "Always" }] }] };
  await assert.rejects(() => build("russell-bookkeeping", { kit: kitOf("bookkeeper", bad) }), (e: unknown) => e instanceof PackBuildError && /names skills\/nope\/SKILL\.md, which the role kit does not have/.test(e.message));
});
