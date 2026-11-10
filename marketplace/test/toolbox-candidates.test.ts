// scripts/toolbox-candidates.mjs: word forms, the library index (types, quarantine, cache), ranking, the output
// lines a curator reads, and the role brief. The library here is a small made-up one in a temp folder.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const tool: any = await import(new URL("../scripts/toolbox-candidates.mjs", import.meta.url).href);

function write(root: string, file: string, text: string) {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), text);
}
function item(root: string, section: string, slug: string, o: { name: string; summary: string; type?: string; category?: string; job?: string; role?: string; uses?: string[]; when?: string[]; body?: string; needs?: boolean }) {
  write(root, `${section}/${slug}/item.yaml`, [`slug: ${slug}`, `name: "${o.name}"`, `summary: "${o.summary}"`, `category: ${o.category ?? "general"}`, `type: ${o.type ?? "skill"}`,
    `role: ${o.role ?? "make"}`, `job: ${o.job ?? "ops"}`, "inputs:", "  - {type: brief, required: true}", "  - {type: brand_brain, required: false}", "outputs:", "  - {type: design_direction}",
    `uses: [${(o.uses ?? []).join(", ")}]`, "credits:", "  - {title: \"Unclosed, by: nobody", ""].join("\n"));
  if (section !== "orchestrators") write(root, `${section}/${slug}/page.yaml`, [`name: "${o.name}"`, `headline: "${o.name}"`, "when:", ...(o.when ?? ["You need it."]).map(w => `  - ${w}`), "you_give:", "  - Your brief", "you_get:", "  - A plan", "example:", "  output: |", "    name: not a real key", ""].join("\n"));
  write(root, `${section}/${slug}/SKILL.md`, [`---`, `name: ${slug}`, `description: "Use when: ${o.summary}"`, `---`, "", `# ${o.name}`, "",
    ...(o.needs ? ["<!-- needs: generated -->", "## Before you start", "Boilerplate every item shares about zebras.", "<!-- /needs -->", ""] : []), o.body ?? "## Steps\n1. Do the work.\n2. Check it.\n3. Hand it back.", ""].join("\n"));
}
function library(): string {
  const root = mkdtempSync(path.join(tmpdir(), "toolbox-lib-"));
  item(root, "general", "colour-contrast-checker", { name: "Colour contrast checker", summary: "Give it your colours. Get each pair checked for readability.", role: "check", job: "design", needs: true, body: "## Steps\n" + Array.from({ length: 80 }, (_, i) => `${i + 1}. Step ${i + 1}.`).join("\n") });
  item(root, "general", "welcome-flow-builder", { name: "Welcome flow builder", summary: "Give it your offer. Get a welcome email sequence with timing.", job: "email" });
  item(root, "general", "month-end-close-planner", { name: "Month-end close planner", summary: "Say what must be done to close the books. Get a dated task list.", when: ["You want a month end close checklist."] });
  item(root, "ecommerce", "product-shot-list-writer", { name: "Product shot list writer", summary: "Paste your product. Get a shot list for the pictures.", type: "prompt", job: "image" });
  item(root, "imported", "event-poster-planner", { name: "Event poster planner", summary: "Paste your event. Get a poster plan that reads from far away.", job: "design" });
  item(root, "imported", "social-post-writer", { name: "Social post writer", summary: "Give a topic. Get posts for each platform.", body: "A long body that mentions a poster once, in passing, and contrast once too." });
  item(root, "imported", "risky-scraper", { name: "Risky scraper", summary: "Collects pages from websites." });
  item(root, "orchestrators", "launch-with-scraper", { name: "Launch with a scraper", summary: "Collect pages, then write posts.", category: "orchestrator", type: "workflow", role: "orchestrate", uses: ["risky-scraper", "social-post-writer"] });
  item(root, "orchestrators", "poster-to-print", { name: "Make a poster and send it to print", summary: "Share the files. Get a poster layout and an export checklist.", category: "orchestrator", type: "workflow", role: "orchestrate", uses: ["event-poster-planner"] });
  item(root, "agents", "weekly-post-keeper", { name: "Weekly post keeper", summary: "Give it last week's numbers. Get next week's posts.", category: "agent", type: "agent", role: "orchestrate" });
  write(root, "minds/paula-scher/mind.yaml", ["slug: paula-scher", "name: \"Paula Scher\"", "area: design", "also: [arts]", "summary: \"Review a brand or poster. Give type a clear voice.\"", "use_cases:", "  - \"Make a poster's type loud enough to read across a street\"", "seats:", "  - {seat: \"Type with a voice\", asks: \"Does the type say it?\"}", ""].join("\n"));
  write(root, "minds/paula-scher/playbook.md", "# Hire Paula Scher\n\nIntro.\n\n## What to hire her for\n\n- Posters and identities.\n\n## How she'd work\n\n1. She looks.\n");
  write(root, "minds/_roster.yaml", "minds: []\n");
  write(root, "ai-tools/canva.yaml", ["slug: canva", "name: Canva", "maker: Canva", "promise: \"Design posts, slides and documents with templates.\"", "use_cases: [design, make-images]", "categories: [design, image]", "what_it_does:", "  - \"Makes social posts from templates.\"", "best_for:", "  - Small teams with no designer.", ""].join("\n"));
  write(root, "ai-tools/_categories.yaml", "- id: design\n  name: Design\n");
  write(root, "quarantine.yaml", "risky-scraper:\n  reason: scrapes\n");
  return root;
}

test("word forms: doer nouns, plurals and spellings meet, but a poster is not a post", () => {
  const same = (a: string, b: string) => assert.equal(tool.stem(a), tool.stem(b), `${a} / ${b}`);
  same("checker", "check"); same("checking", "checks"); same("planner", "planning"); same("writer", "writing"); same("colours", "color");
  same("organize", "organise"); same("categories", "category"); same("pricing", "price"); same("ads", "ad"); same("emails", "email");
  assert.notEqual(tool.stem("poster"), tool.stem("post"));
  assert.notEqual(tool.stem("banner"), tool.stem("ban"));
  assert.notEqual(tool.stem("offer"), tool.stem("off"));
  assert.equal(tool.stem("news"), "news");
  assert.deepEqual(tool.tokens("How do I make a late e-mail for my A/B tests?"), ["late", "email", "ab", "test"]);
});

test("pickKeys reads only the named top-level keys and survives a broken block", () => {
  const text = "slug: a\nname: \"The name\"\ncredits:\n  - {title: \"Unclosed\nexample:\n  output: |\n    name: inside a block\ninputs:\n- {type: brief, required: true}\n";
  assert.deepEqual(tool.pickKeys(text, new Set(["slug", "name", "inputs", "credits"])), { slug: "a", name: "The name", inputs: [{ type: "brief", required: true }] });
});

test("the index holds every type and leaves out quarantined items and the workflows that ship them", () => {
  const root = library();
  try {
    const index = tool.buildIndex(root);
    const types = Object.fromEntries(index.docs.map((d: any) => [d.slug, d.type]));
    assert.deepEqual(types, {
      "colour-contrast-checker": "skill", "welcome-flow-builder": "skill", "month-end-close-planner": "skill", "product-shot-list-writer": "prompt",
      "event-poster-planner": "skill", "social-post-writer": "skill", "poster-to-print": "workflow", "weekly-post-keeper": "agent", "paula-scher": "mind", canva: "tool",
    });
    assert.deepEqual(index.quarantined, ["launch-with-scraper", "risky-scraper"]);
    assert.equal(tool.findItems(index, "risky-scraper").length, 0);
    assert.equal(tool.findItems(index, "canva", "tool").length, 1);
    assert.equal(tool.findItems(index, "canva", "skill").length, 0);
    // The quick map the checker uses agrees with the full index.
    const quick = tool.libraryTypes(root);
    assert.deepEqual(Object.fromEntries([...quick.types].map(([slug, t]: [string, string[]]) => [slug, t[0]])), types);
    assert.deepEqual([...quick.quarantined].sort(), ["launch-with-scraper", "risky-scraper"]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("plain-words queries put the right item first", () => {
  const root = library();
  try {
    const index = tool.buildIndex(root);
    const top = (q: string, options = {}) => tool.search(index, q, options).map((d: any) => d.slug);
    assert.equal(top("contrast check")[0], "colour-contrast-checker");
    assert.equal(top("welcome email series")[0], "welcome-flow-builder");          // "series" meets "sequence"
    assert.equal(top("month end close checklist")[0], "month-end-close-planner");
    assert.equal(top("product photo shot list")[0], "product-shot-list-writer");   // "photo" meets "pictures"
    assert.deepEqual(top("posters", { types: ["skill"] }), ["event-poster-planner", "social-post-writer"]); // the name beats a passing mention
    assert.deepEqual(top("poster", { types: ["mind"] }), ["paula-scher"]);
    assert.deepEqual(top("poster", { types: ["workflow"] }), ["poster-to-print"]);
    assert.equal(top("posts templates", { types: ["tool"] })[0], "canva");
    assert.equal(top("poster", { limit: 2 }).length, 2);
    assert.deepEqual(top("zebras"), [], "the generated Before you start block is not indexed");
    assert.deepEqual(top("the of and"), []);
    assert.equal(tool.search(index, "poster wombat")[0].words, "1/1", "a word the library never uses does not count against a match");
    assert.equal(tool.search(index, "contrast series")[0].words, "1/2");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("result lines, batches and repeats", () => {
  const root = library();
  try {
    const index = tool.buildIndex(root);
    const long = { type: "skill", slug: "x", name: "X", summary: "word ".repeat(60), job: "design", role: "check", words: "2/3" };
    const line = tool.resultLine(long);
    const parts = line.split(" | ");
    assert.deepEqual([parts[0], parts[1], parts[2], parts[4]], ["skill", "x", "X", "job=design role=check words=2/3"]);
    assert.ok(parts[3].length <= 160 && parts[3].endsWith("…"));
    assert.equal(tool.resultLine({ type: "tool", slug: "canva", name: "Canva", summary: "Design things.", job: "", role: "", words: "1/1" }), "tool | canva | Canva | Design things.");

    const answers = tool.runQueries(index, [{ id: "a", q: "poster" }, { id: "b", q: "poster layout", types: ["skill"], limit: 1 }, { q: "contrast" }], { types: ["skill", "workflow"], limit: 5 });
    assert.deepEqual(answers.map((a: any) => a.id), ["a", "b", "q3"]);
    assert.ok(answers[0].results.every((d: any) => d.type === "skill" || d.type === "workflow"));
    assert.equal(answers[1].results.length, 1);
    const text = tool.queriesText(answers);
    assert.match(text, /^## a: poster \[skill,workflow\]\nworkflow \| poster-to-print \| Make a poster and send it to print \| .+\nskill \| event-poster-planner \| Event poster planner \| /);
    assert.match(text, /## b: poster layout \[skill\]\n= event-poster-planner \(see a\)/);
    assert.throws(() => tool.runQueries(index, [{ id: "a", q: "x", types: ["skil"] }]), /unknown type "skil"/);
    assert.throws(() => tool.runQueries(index, [{ id: "a" }]), /needs a "q"/);
    assert.throws(() => tool.runQueries(index, { q: "x" }), /must hold a list/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("--item prints inputs, outputs and the start of the method, without the generated block", () => {
  const root = library();
  try {
    const index = tool.buildIndex(root);
    const text = tool.itemText(index, "colour-contrast-checker", { root, lines: 10 });
    assert.match(text, /^skill \| colour-contrast-checker \| Colour contrast checker\nSummary: Give it your colours/);
    assert.match(text, /Inputs: brief \(required\), brand_brain\n/);
    assert.match(text, /You give: Your brief\nOutputs: design_direction\nYou get: A plan\n/);
    assert.match(text, /Method \(first 10 of \d+ lines, .*colour-contrast-checker\/SKILL\.md\):\n# Colour contrast checker/);
    assert.doesNotMatch(text, /zebras|Step 20\./);
    assert.match(tool.itemText(index, "poster-to-print", { root }), /Uses: event-poster-planner/);
    assert.match(tool.itemText(index, "paula-scher", { root }), /^mind \| paula-scher \| Paula Scher[\s\S]*Use cases:\n- Make a poster's type loud/);
    assert.match(tool.itemText(index, "canva", { root }), /^tool \| canva \| Canva[\s\S]*What it does:\n- Makes social posts/);
    assert.equal(tool.itemText(index, "risky-scraper", { root }), "risky-scraper: quarantined, do not use.\n");
    assert.match(tool.itemText(index, "made-up", { root }), /no library item has this slug/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("the index is cached and rebuilt when an item folder is added", () => {
  const root = library(), cache = tool.cacheFile(root);
  try {
    const first = tool.loadIndex({ root });
    assert.ok(existsSync(cache));
    assert.equal(tool.fingerprint(root), first.fingerprint);
    assert.equal(tool.loadIndex({ root }).docs.length, first.docs.length);
    item(root, "general", "menu-layout-planner", { name: "Menu layout planner", summary: "Paste your dishes. Get a menu plan." });
    const second = tool.loadIndex({ root });
    assert.notEqual(second.fingerprint, first.fingerprint);
    assert.equal(tool.search(second, "menu")[0].slug, "menu-layout-planner");
    assert.equal(tool.loadIndex({ root, rebuild: true }).docs.length, first.docs.length + 1);
  } finally { rmSync(root, { recursive: true, force: true }); rmSync(cache, { force: true }); }
});

test("the role brief names the kit refs, personas and job types, and stays short for every role", () => {
  const brief = tool.roleBrief("graphic-designer");
  assert.match(brief, /^ROLE graphic-designer: Graphic designer \(design\)\nSummary: /);
  for (const ref of ["kit:skills/print-layout-spec", "kit:prompts/sign-schedule", "kit:workflows/brief-to-print-ready"]) assert.ok(brief.includes(`- ${ref}: `), ref);
  assert.match(brief, /KNOWLEDGE\.MD HEADINGS\n- 1\. /);
  assert.match(brief, /- riley-carousels \| Social media designer \| .+\n  outcomes: .+\n  good at: /);
  assert.match(brief, /JOB TYPES THESE PERSONAS LINK TO: .*print-layout-spec \(/);
  assert.match(brief, /CURRENT LIBRARY\.JSON \(\d+ rows/);
  const ids = tool.roleIds();
  assert.ok(ids.length >= 150 && ids.includes("graphic-designer"));
  for (const id of ids) {
    const words = tool.roleBrief(id).split(/\s+/).filter(Boolean).length;
    assert.ok(words <= 2500, `${id}: ${words} words`);
  }
  assert.throws(() => tool.roleBrief("no-such-role"), /No role kit/);
});

test("with an index, the brief marks library.json rows that are gone or quarantined", () => {
  const root = library(), packs = mkdtempSync(path.join(tmpdir(), "toolbox-packs-"));
  try {
    write(packs, "roles/sign-maker/role.json", JSON.stringify({ id: "sign-maker", name: "Sign maker", department: "design", summary: "Makes signs.", aliases: ["signage"] }));
    write(packs, "roles/sign-maker/skills/sign-spec/SKILL.md", "---\nname: sign-spec\ndescription: Specs a sign. Use when a sign is needed.\n---\n# Sign spec\n");
    write(packs, "roles/sign-maker/prompts/sign-list.md", "# Sign list\n\n**When to use:** before ordering signs. Not for safety signs.\n");
    write(packs, "roles/sign-maker/workflows/monthly-signs.md", "# Monthly signs\n\n**Cadence:** once a month.\n");
    write(packs, "roles/sign-maker/library.json", JSON.stringify([{ slug: "event-poster-planner", name: "Event poster planner", why: "x" }, { slug: "risky-scraper", name: "Risky", why: "x" }, { slug: "gone", name: "Gone", why: "x" }]));
    const brief = tool.roleBrief("sign-maker", { index: tool.buildIndex(root), packs, data: path.join(packs, "none") });
    assert.match(brief, /- kit:skills\/sign-spec: Specs a sign\.\n/);
    assert.match(brief, /- kit:prompts\/sign-list: Sign list\. before ordering signs\.\n/);
    assert.match(brief, /- kit:workflows\/monthly-signs: Monthly signs\. once a month\.\n/);
    assert.match(brief, /- skill \| event-poster-planner \| Event poster planner\n- QUARANTINED \| risky-scraper \| Risky\n- NOT IN LIBRARY \| gone \| Gone\n/);
    assert.deepEqual(tool.kitItems(path.join(packs, "roles", "sign-maker")).map((k: any) => k.ref), ["kit:skills/sign-spec", "kit:prompts/sign-list", "kit:workflows/monthly-signs"]);
  } finally { rmSync(root, { recursive: true, force: true }); rmSync(packs, { recursive: true, force: true }); }
});
