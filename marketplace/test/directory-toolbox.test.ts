// The profile's "What I can do" and "What I bring", the "See how I do this" link, and the data file behind them:
// scripts/role-toolbox.mjs writes src/modules/directory/data/role-toolbox.json from the role kits and the library.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";
import { listRoles } from "../src/modules/directory/roles.ts";
import { bringGroups, bringSummary, LIBRARY_ORIGIN, roleTasks, roleToolbox, roleToolboxFile, setRoleToolboxForTests, type RoleToolbox, type ToolboxFile } from "../src/modules/directory/toolbox.ts";
import { agentCard, agentProfile, agentTasks, outcomeSkill, TASKS_SHOWN } from "../src/modules/directory/views.ts";
import { fileNames, groupPackFiles, isBundleFile, plainFileName, tidyPurpose, wordsFromSlug, type PackFile } from "../src/ui/pages/directory/packs.ts";

const script: any = await import(new URL("../scripts/role-toolbox.mjs", import.meta.url).href);
const REAL = roleToolboxFile();
after(() => setRoleToolboxForTests(REAL));

test("the committed data file is what the script makes from the kits today", () => {
  const { data } = script.buildRoleToolbox();
  const committed = readFileSync(script.OUT, "utf8").replace(/\r\n/g, "\n");
  assert.equal(script.serialise(data), committed, "src/modules/directory/data/role-toolbox.json is out of date: run `node scripts/role-toolbox.mjs` in marketplace/ and commit the file");
});

test("the data covers every role kit, names every item in plain words and never holds a file path as a name", () => {
  const roles = Object.keys(REAL.roles);
  assert.ok(roles.length > 0);
  for (const role of listRoles()) if (REAL.roles[role.id]) assert.ok(Object.keys(REAL.roles[role.id].kit).length > 0, `${role.id} has its kit's files`);
  for (const [id, box] of Object.entries(REAL.roles)) {
    for (const [key, name] of Object.entries(box.kit)) {
      assert.match(key, /^(skills|prompts|workflows)\/[a-z0-9-]+$/, `${id}: ${key}`);
      assert.ok(name && !/[\\/]|\.md\b|SKILL/.test(name), `${id}: "${name}" is a plain name`);
    }
    for (const ref of box.items) assert.ok(ref.startsWith("kit:") ? box.kit[ref.slice(4)] : REAL.library[ref], `${id}: ${ref} resolves`);
    for (const helper of box.helpers) assert.ok(REAL.roles[helper], `${id}: helper ${helper} is a role kit`);
    for (const task of box.tasks) assert.ok(task.task.length <= 70 && /^[A-Z]/.test(task.task), `${id}: ${task.task}`);
  }
  // Library keys are the page's path on useaiblocks.com, by the library site's own rule for each kind.
  for (const [key, name] of Object.entries(REAL.library)) {
    assert.match(key, /^(skills|prompts|workflows|agents|minds|ai-tools)\/[a-z0-9][a-z0-9-]*$/, key);
    assert.ok(name.trim() && !/[\\/]\w+\.md/.test(name), `${key}: "${name}"`);
  }
  for (const key of REAL.unpaged) assert.ok(REAL.library[key], `${key} is a library item`);
});

test("the script reads a kit and the library the way the library site builds its addresses", () => {
  const root = mkdtempSync(path.join(tmpdir(), "role-toolbox-"));
  try {
    const put = (file: string, text: string) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), text); };
    put("packs/roles/sign-maker/role.json", "{}");
    put("packs/roles/sign-maker/skills/print-layout-spec/SKILL.md", "---\nname: print-layout-spec\ndescription: Writes a build-ready layout spec for a printed piece. Use when someone needs a print file.\n---\n\n# Print layout spec\n\nBody.\n");
    put("packs/roles/sign-maker/prompts/sign-schedule.md", "# Event sign schedule\n\n**When to use:** planning signs.\n");
    put("packs/roles/sign-maker/workflows/brief-to-print-ready.md", "# Brief to print-ready file\n");
    put("packs/roles/helper-role/role.json", "{}");
    put("packs/roles/sign-maker/toolbox.json", JSON.stringify({
      schema: "ai-blocks-toolbox/1", role: "sign-maker", reviewed: "2026-11-10",
      tasks: [
        { id: "flyer", task: "Lay out a flyer", kind: "ad_creative", items: [
          { ref: "kit:skills/print-layout-spec", use: "build", when: "x" }, { ref: "library:layout-breaker", type: "skill", use: "explore", when: "x" },
          { ref: "library:poster-run", type: "workflow", use: "build", when: "x" }, { ref: "library:no-page-flow", type: "workflow", use: "build", when: "x" },
          { ref: "library:typo-check", type: "prompt", use: "check", when: "x" }, { ref: "library:david-carson", type: "mind", use: "think", when: "x" },
          { ref: "library:canva", type: "tool", use: "build", when: "x" }, { ref: "library:brand-guardian", type: "agent", use: "check", when: "x" },
          { ref: "library:missing-item", type: "skill", use: "build", when: "x" }, { ref: "kit:skills/not-there", use: "build", when: "x" },
          { ref: "library:blocked-item", type: "skill", use: "build", when: "x" },
        ] },
        { id: "signs", task: "Plan event signs", kind: "other", items: [{ ref: "kit:prompts/sign-schedule", use: "build", when: "x" }, { ref: "library:layout-breaker", type: "skill", use: "explore", when: "x" }] },
      ],
      always: [{ ref: "library:typo-check", type: "prompt", use: "check", when: "x" }],
      helpers: [{ role: "helper-role", when: "x" }, { role: "nobody", when: "x" }], gaps: [],
    }));
    put("catalogue-items/general/layout-breaker/item.yaml", "slug: layout-breaker\nname: \"Layout default breaker\"\ntype: skill\n");
    put("catalogue-items/general/layout-breaker/page.yaml", "name: \"Layout breaker\"\nheadline: \"Break the template\"\n");
    put("catalogue-items/orchestrators/poster-run/item.yaml", "slug: poster-run\nname: Make a readable event poster\ncategory: orchestrator\ntype: skill\n");
    put("catalogue-items/orchestrators/poster-run/page.yaml", "headline: Make a poster\n");
    put("catalogue-items/orchestrators/no-page-flow/item.yaml", "slug: no-page-flow\nname: Annual letter\ntype: workflow\n");
    put("catalogue-items/general/typo-check/item.yaml", "slug: typo-check\nname: Doc typo checker\ntype: prompt\n");
    put("catalogue-items/general/typo-check/page.yaml", "headline: Check typos\n");
    put("catalogue-items/agents/brand-guardian/item.yaml", "slug: brand-guardian\nname: Brand Guardian agent\ncategory: agent\ntype: agent\n");
    put("catalogue-items/agents/brand-guardian/page.yaml", "headline: Guard the brand\n");
    put("catalogue-items/general/blocked-item/item.yaml", "slug: blocked-item\nname: Blocked\ntype: skill\n");
    put("catalogue-items/minds/david-carson/mind.yaml", "slug: david-carson\nname: \"David Carson\"\n");
    put("catalogue-items/ai-tools/canva.yaml", "slug: canva\nname: Canva\n");
    put("catalogue-items/quarantine.yaml", "blocked-item:\n  reason: unsafe\n");

    const { data, problems } = script.buildRoleToolbox({ packs: path.join(root, "packs"), catalogue: path.join(root, "catalogue-items") });
    const role = data.roles["sign-maker"];
    assert.deepEqual(role.kit, { "skills/print-layout-spec": "Print layout spec", "prompts/sign-schedule": "Event sign schedule", "workflows/brief-to-print-ready": "Brief to print-ready file" });
    assert.deepEqual(role.tasks, [{ id: "flyer", task: "Lay out a flyer", kind: "ad_creative" }, { id: "signs", task: "Plan event signs", kind: "other" }]);
    // Each item once, in first-use order. The page name wins over the item name; a workflow is one by its folder or its type.
    assert.deepEqual(role.items, ["kit:skills/print-layout-spec", "skills/layout-breaker", "workflows/poster-run", "workflows/no-page-flow", "prompts/typo-check", "minds/david-carson", "ai-tools/canva", "agents/brand-guardian", "kit:prompts/sign-schedule"]);
    assert.deepEqual(data.library, {
      "agents/brand-guardian": "Brand Guardian agent", "ai-tools/canva": "Canva", "minds/david-carson": "David Carson", "prompts/typo-check": "Doc typo checker",
      "skills/layout-breaker": "Layout breaker", "workflows/no-page-flow": "Annual letter", "workflows/poster-run": "Make a readable event poster",
    });
    assert.deepEqual(data.unpaged, ["workflows/no-page-flow"]);
    assert.deepEqual(role.helpers, ["helper-role"]);
    assert.equal(role.reviewed, "2026-11-10");
    assert.match(role.skills["print-layout-spec"], /^Writes a build-ready layout spec .* \| Lay out a flyer$/);
    // What was left out is said, never guessed: a missing library item, a file the kit lacks, a quarantined item, an unknown helper.
    assert.equal(problems.length, 4);
    for (const word of ["missing-item", "not-there", "blocked-item", "nobody"]) assert.ok(problems.some((p: string) => p.includes(word)), word);
    // A role with no toolbox.json still gets its (empty) kit, so the build never breaks mid-curation.
    assert.deepEqual(data.roles["helper-role"], { kit: {}, skills: {}, tasks: [], items: [], helpers: [], reviewed: null });
    // Same input, same bytes.
    assert.equal(script.serialise(data), script.serialise(script.buildRoleToolbox({ packs: path.join(root, "packs"), catalogue: path.join(root, "catalogue-items") }).data));
    assert.doesNotThrow(() => JSON.parse(script.serialise(data)));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

const BOX: RoleToolbox = {
  kit: {
    "skills/logo-design-brief": "Logo design brief", "skills/palette-and-type-system": "Palette and type system", "skills/brand-guidelines-book": "Brand guidelines book",
    "skills/visual-identity-and-design-tokens": "Visual identity brief, palette or design tokens", "prompts/naming-shortlist": "Shortlist brand names", "workflows/brand-refresh": "Brand refresh",
  },
  skills: {
    "logo-design-brief": "Writes a logo design brief a designer can build from: the idea, must-haves, formats and checks. | Write a logo design brief",
    "palette-and-type-system": "Sets a colour palette with contrast ratios and a font pairing with a type scale. | Set colours and fonts",
    "brand-guidelines-book": "Assembles a brand guidelines book from existing assets. | Build a brand book",
    "visual-identity-and-design-tokens": "Writes a full visual identity brief or exports design tokens. | Write a visual identity brief",
  },
  tasks: [
    { id: "logo-brief", task: "Write a logo design brief a designer can build from", kind: "plan" },
    { id: "palette", task: "Set a colour palette with contrast checks", kind: "strategy" },
    { id: "brand-book", task: "Build a brand guidelines book", kind: "ops_doc" },
    { id: "audit", task: "Review a brand for consistency", kind: "audit" },
    { id: "social", task: "Make a set of social templates", kind: "ad_creative" },
    { id: "naming", task: "Shortlist brand names", kind: "strategy" },
    { id: "packaging", task: "Brief a packaging designer", kind: "plan" },
    { id: "refresh", task: "Plan a brand refresh", kind: "plan" },
    { id: "icons", task: "Spec an icon set", kind: "other" },
    { id: "fonts", task: "Pick a font pairing and type scale", kind: "strategy" },
  ],
  items: ["kit:skills/logo-design-brief", "skills/logo-strength-tester", "minds/paula-scher", "kit:workflows/brand-refresh", "ai-tools/canva", "workflows/annual-letter", "agents/brand-guardian", "prompts/font-pair-shortlist"],
  helpers: ["graphic-designer", "not-a-listed-role"],
  reviewed: "2026-11-10",
};
const FILE: ToolboxFile = {
  schema: "ai-blocks-role-toolbox/1",
  library: { "skills/logo-strength-tester": "Logo strength tester", "minds/paula-scher": "Paula Scher", "ai-tools/canva": "Canva", "workflows/annual-letter": "Annual letter", "agents/brand-guardian": "Brand Guardian agent", "prompts/font-pair-shortlist": "Font pair shortlist maker" },
  unpaged: ["workflows/annual-letter"],
  roles: { "brand-designer": BOX },
};

const RENATA: Persona = {
  ...NOVA, id: "renata-brand-identity", name: "Renata", title: "Brand designer", area: "design", role: "brand-designer", sort: 500,
  tagline: "Logo briefs, colour palettes and font pairings your designer can build from.",
  profile: {
    ...NOVA.profile, portrait: "/agents/renata-brand-identity.webp",
    not_for: ["Drawing the logo or making files", "Trademark checks or legal advice"],
    outcomes: [
      { id: "logo_brief", title: "A logo design brief for your designer", deliverable: "The idea, must-haves and formats.", job_type_id: null, job_type_hint: "logo design brief" },
      { id: "palette", title: "A colour palette with hex codes and contrast", deliverable: "Five to eight colours with roles.", job_type_id: null, job_type_hint: "colour palette" },
      { id: "type_pairing", title: "A font pairing and type scale", deliverable: "A heading and body font pair.", job_type_id: null, job_type_hint: "font pairing" },
      { id: "voice", title: "A week of podcast show notes", deliverable: "Show notes.", job_type_id: null, job_type_hint: "show notes" },
    ],
  },
};

test("'What I bring' counts what it lists, by kind, with the agent's own files first and library items linked to their pages", () => {
  setRoleToolboxForTests(FILE);
  const groups = bringGroups(roleToolbox("brand-designer"), id => (id === "graphic-designer" ? "Graphic designer" : null));
  assert.deepEqual(groups.map(g => [g.type, g.label, g.items.length]), [["skill", "Skills", 5], ["prompt", "Prompts", 2], ["workflow", "Workflows", 2], ["tool", "Tools", 1], ["lens", "Thinking lenses", 1], ["helper", "Helper agents", 2]]);
  const by = Object.fromEntries(groups.map(g => [g.type, g.items]));
  // Own skills first (the one a task names leads), then the library's. Four kit skills are four skills: nothing is counted twice.
  assert.deepEqual(by.skill.map(i => i.name), ["Logo design brief", "Palette and type system", "Brand guidelines book", "Visual identity brief, palette or design tokens", "Logo strength tester"]);
  assert.deepEqual(by.skill[0], { name: "Logo design brief", href: null, file: "skills/logo-design-brief/SKILL.md" });
  assert.deepEqual(by.skill[4], { name: "Logo strength tester", href: `${LIBRARY_ORIGIN}/skills/logo-strength-tester`, file: null });
  assert.deepEqual(by.prompt, [{ name: "Shortlist brand names", href: null, file: "prompts/naming-shortlist.md" }, { name: "Font pair shortlist maker", href: "https://useaiblocks.com/prompts/font-pair-shortlist", file: null }]);
  // A library item with no page is named, not linked.
  assert.deepEqual(by.workflow, [{ name: "Brand refresh", href: null, file: "workflows/brand-refresh.md" }, { name: "Annual letter", href: null, file: null }]);
  assert.deepEqual(by.tool, [{ name: "Canva", href: "https://useaiblocks.com/ai-tools/canva", file: null }]);
  assert.deepEqual(by.lens, [{ name: "Paula Scher", href: "https://useaiblocks.com/minds/paula-scher", file: null }]);
  // Helper roles are agents on this site; a role the site does not list is left out. Library agents follow.
  assert.deepEqual(by.helper, [{ name: "Graphic designer", href: "/agents?role=graphic-designer", file: null }, { name: "Brand Guardian agent", href: "https://useaiblocks.com/agents/brand-guardian", file: null }]);
  assert.equal(bringSummary(groups), "5 skills, 2 prompts, 2 workflows, 1 tool, 1 thinking lens and 2 helper agents");
  assert.deepEqual(bringGroups(null, () => null), []);
  // No name a visitor reads is a file path.
  for (const g of groups) for (const item of g.items) assert.doesNotMatch(item.name, /[\\/]|\.md$|SKILL/);
});

test("'What I can do' lists the role's tasks, the agent's own first, each marked made, planned or reviewed", () => {
  setRoleToolboxForTests(FILE);
  assert.deepEqual(roleTasks(BOX).map(t => t.nature), ["plan", "plan", "make", "review", "make", "plan", "plan", "plan", "plan", "plan"]);
  const tasks = agentTasks(RENATA);
  assert.equal(tasks.length, BOX.tasks.length);
  // Tasks that share two words with one of Renata's outcomes lead, in the toolbox's order; the rest keep their order.
  assert.deepEqual(tasks.slice(0, 3).map(t => t.id), ["logo-brief", "palette", "fonts"]);
  assert.deepEqual(tasks.slice(3).map(t => t.id), ["brand-book", "audit", "social", "naming", "packaging", "refresh", "icons"]);
  assert.ok(TASKS_SHOWN >= 6 && TASKS_SHOWN <= 10, "about eight tasks show before 'Show all'");
  // An agent in a role with no toolbox yet has no task list, and an expert's agent has no pack to describe.
  assert.deepEqual(agentTasks({ ...RENATA, role: "seo-specialist" }), []);
  assert.deepEqual(agentProfile({ ...RENATA, kind: "expert" }).brings, []);
});

test("'See how I do this' opens the skill that does the outcome, not whatever its job type points at", () => {
  setRoleToolboxForTests(FILE);
  const [logo, palette, fonts, notes] = RENATA.profile.outcomes;
  // The audit's case: the logo brief pointed at the visual identity skill although the pack has a logo design brief skill.
  const job = { id: "visual-identity-and-design-tokens", title: "Visual identity brief, palette or design tokens", summary: "A visual identity brief.", area: "design", deliverable: "A brief.", turnaround_hours: 24 } as any;
  assert.deepEqual(outcomeSkill(logo, BOX, job), { path: "skills/logo-design-brief/SKILL.md", name: "Logo design brief" });
  assert.deepEqual(outcomeSkill(palette, BOX, job), { path: "skills/palette-and-type-system/SKILL.md", name: "Palette and type system" });
  assert.deepEqual(outcomeSkill(fonts, BOX, job), { path: "skills/palette-and-type-system/SKILL.md", name: "Palette and type system" });
  // Nothing fits: no link is better than a wrong one.
  assert.equal(outcomeSkill(notes, BOX, null), null);
  assert.equal(outcomeSkill(notes, BOX, job), null);
  // A job type's own skill is used when it is the one that fits.
  const emailJob = { id: "email-sequence", title: "Email sequence", summary: "A series of emails.", area: "marketing", deliverable: "Emails.", turnaround_hours: 24 } as any;
  const welcome = { id: "welcome", title: "A welcome email series, planned and written", deliverable: "Five emails.", job_type_id: "email-sequence", job_type_hint: "welcome email sequence" };
  assert.deepEqual(outcomeSkill(welcome, null, emailJob), { path: "skills/email-sequence/SKILL.md", name: "Email sequence" });
  assert.equal(outcomeSkill(welcome, null, null), null);
});

test("the profile carries the work line, the tasks, what the agent brings and each outcome's skill; cards carry the work line", () => {
  setRoleToolboxForTests(FILE);
  const card = agentCard(RENATA);
  // This fixture has three made things and one brief (the real Renata, with her five outcomes, is in directory-work.test.ts).
  assert.deepEqual(card.does, { nature: "make", label: "Makes", things: ["colour palette", "font pairing and type scale", "show notes"] });
  const profile = agentProfile(RENATA);
  assert.equal(profile.does_not, "Drawing the logo or making files");
  assert.equal(profile.tasks.length, 10);
  assert.deepEqual(profile.brings.map(g => g.type), ["skill", "prompt", "workflow", "tool", "lens", "helper"]);
  assert.deepEqual(profile.outcomes.map(o => o.how?.name ?? null), ["Logo design brief", "Palette and type system", "Palette and type system", null]);
  // What a visitor reads holds no price and no file path outside the `file` and `path` fields the app turns into links.
  const read = JSON.stringify(profile, (key, value) => (key === "file" || key === "path" || key === "portrait" || key === "href" ? undefined : value));
  assert.doesNotMatch(read, /SKILL\.md|skills\/|prompts\/|workflows\/|\$\d|price|beta/i);
  // The file names the profile hands the file list: the agent's own files by their plain names.
  const names = fileNames(profile);
  assert.equal(names["skills/logo-design-brief/SKILL.md"], "Logo design brief");
  assert.equal(names["prompts/naming-shortlist.md"], "Shortlist brand names");
  assert.equal(names["workflows/brand-refresh.md"], "Brand refresh");
});

test("the file list counts skills, not files: 'Skills 7' meant six skills and skills.md", () => {
  const file = (p: string, kind: string, purpose = ""): PackFile => ({ path: p, kind, bytes: 10, purpose });
  const files = [
    file("AGENTS.md", "start"), file("skills.md", "skill"), ...["a", "b", "c", "d", "e", "f"].map(s => file(`skills/skill-${s}/SKILL.md`, "skill")),
    file("prompts/x.md", "prompt"), file("tools/capture-brand-dna.mjs", "tool"),
  ];
  const skills = groupPackFiles(files).find(g => g.kind === "skill")!;
  assert.equal(skills.count, 6);
  assert.equal(skills.files.length, 7);
  assert.equal(skills.files[6].path, "skills.md", "the all-in-one file is listed last");
  assert.ok(isBundleFile("skills.md") && !isBundleFile("skills/a/SKILL.md"));
  assert.equal(groupPackFiles(files).find(g => g.kind === "prompt")!.count, 1);
  // Plain names for what a visitor reads: known names first, then the pack's standard files, then words from the file name.
  assert.equal(plainFileName("skills/logo-design-brief/SKILL.md", { "skills/logo-design-brief/SKILL.md": "Logo design brief" }), "Logo design brief");
  assert.equal(plainFileName("skills/seo-content-brief/SKILL.md"), "SEO content brief");
  assert.equal(plainFileName("skills/test-design-and-sample-size/SKILL.md"), "Test design and sample size");
  assert.equal(plainFileName("prompts/serp-intent-check.md"), "Serp intent check");
  assert.equal(plainFileName("AGENTS.md"), "Instructions for your AI");
  assert.equal(plainFileName("skills.md"), "Every skill in one file");
  assert.equal(plainFileName("tools/capture-brand-dna.mjs"), "Brand capture tool");
  assert.equal(plainFileName("toolbox/skill/layout-default-breaker.md"), "Layout default breaker");
  assert.equal(wordsFromSlug("ga4-event-plan"), "GA4 event plan");
  for (const f of files) assert.doesNotMatch(plainFileName(f.path), /[\\/]|\.(md|mjs|js|json)$/);
  // A purpose cut mid-sentence ends at its last whole sentence.
  assert.equal(tidyPurpose("Reviews one page for conversion. Reads the funnel by device and source, behaviour from…"), "Reviews one page for conversion.");
  assert.equal(tidyPurpose("A short, whole line."), "A short, whole line.");
  assert.equal(tidyPurpose("Cut with no sentence end before it…"), "Cut with no sentence end before it…");
});
