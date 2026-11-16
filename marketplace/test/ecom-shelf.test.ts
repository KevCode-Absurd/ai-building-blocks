// The e-commerce shelves (src/modules/knowledge/shelf.ts): what the build makes from the library files, how search
// ranks, and GET /api/knowledge/ecommerce/shelf[/:kind[/:slug]]. Also checks the real library files when they exist.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { testEnv } from "./helpers.ts";
import { buildShelf, ShelfSearch, type ShelfInput, type ShelfItem } from "../src/modules/knowledge/shelf.ts";
import { forgetVerticals, shelfText } from "../src/modules/knowledge/service.ts";
import type { Env } from "../src/env.ts";
import { ECOMMERCE_MODULE_STAGES, ECOMMERCE_STAGES } from "../src/modules/directory/team-stages.ts";

const prompt = (slug: string, title: string, extra: Record<string, unknown> = {}) => ({
  slug, title, summary: `Paste your reviews. Get ${title.toLowerCase()}.`, stage: "creative", module: "MCR", agents: ["tendai-ad-creative", "nobody-here"],
  fill: ["About my store", "20 reviews"], prompt: "You are a direct-response strategist. [ABOUT MY STORE]\nCheck before you answer.", output: "A ranked table.",
  from: [{ dir: "ecommerce", slug: "hook-writer" }], credit: null, ...extra,
});

function input(extra: Partial<ShelfInput> = {}): ShelfInput {
  return {
    vertical: "ecommerce", built: "2026-11-15", stages: ECOMMERCE_STAGES, moduleStage: ECOMMERCE_MODULE_STAGES,
    agents: new Set(["tendai-ad-creative", "kofi-ad-copy", "morag-email-sms", "wenhao-procurement"]),
    prompts: [prompt("hooks-from-reviews", "Ten ad hooks from your reviews"), prompt("hooks-from-reviews", "A duplicate"), prompt("supplier-rfq-message", "Supplier RFQ message in English and Mandarin", { stage: "source", module: "COG", agents: ["wenhao-procurement"] })],
    skills: [
      { name: "build-klaviyo-segments", title: "Klaviyo segments", outcome: "a segment list with rules", when: "When flows send to everyone.", module: "EML", agents: [], text: "---\nname: x\n---\n# Klaviyo" },
      { name: "no-text-yet", title: "Missing", outcome: "x", when: "When.", module: "EML", agents: [], text: "" },
    ],
    tools: [{ slug: "shopify", name: "Shopify", maker: "Shopify", url: "https://www.shopify.com", kind: "store-platform", ai_tools_slug: null, for_stores: "Runs the store.", jobs: ["Build the store", "Take payments", "Sell on social"], agents: ["kofi-ad-copy"], stage: "store", connect: "Official MCP server.", checked: "2026-11-15", sources: ["https://www.shopify.com"] }],
    minds: [{ slug: "eugene-schwartz", hire_for: "Match the ad to how much the buyer already knows.", store_questions: ["Which awareness stage is my buyer at?", "Rewrite my headline for a cold buyer.", "What should my ad leave out?", "Where is my mechanism?"], agents: ["kofi-ad-copy"], stage: "creative" },
      { slug: "not-in-library", hire_for: "x", store_questions: ["a", "b", "c", "d"], agents: [], stage: "creative" }],
    mindSources: { "eugene-schwartz": { name: "Eugene Schwartz", identity: "Breakthrough Advertising author", area: "marketing", skill: "# Eugene Schwartz\n" } },
    toolGuides: {}, libraryOrigin: "https://useaiblocks.com",
    ...extra,
  };
}

test("the build keeps good items, drops broken ones with a note, and keeps only team agents", () => {
  const { file, files, notes } = buildShelf(input());
  assert.deepEqual(file.prompts.map(p => p.slug).sort(), ["hooks-from-reviews", "supplier-rfq-message"]);
  assert.deepEqual(file.prompts.find(p => p.slug === "hooks-from-reviews")!.agents, ["tendai-ad-creative"]);
  assert.equal(file.skills.length, 1);
  assert.equal(file.skills[0].stage, "retention", "a skill no agent carries takes its module's stage");
  assert.equal(file.skills[0].summary, "A segment list with rules");
  assert.equal(file.minds.length, 1);
  assert.equal(file.minds[0].title, "Eugene Schwartz");
  assert.ok(notes.some(n => /duplicate/.test(n)) && notes.some(n => /no-text-yet/.test(n)) && notes.some(n => /not-in-library/.test(n)));
  // in the store's order of work: source before creative
  assert.equal(file.prompts[0].slug, "supplier-rfq-message");
  assert.match(files["/packs/knowledge/ecommerce/prompts/hooks-from-reviews.md"], /## The prompt[\s\S]*\[ABOUT MY STORE\][\s\S]*useaiblocks\.com\/skills\/hook-writer/);
  assert.equal(files["/packs/knowledge/ecommerce/prompts/hooks-from-reviews.txt"].trim(), "You are a direct-response strategist. [ABOUT MY STORE]\nCheck before you answer.");
  assert.ok(files["/packs/knowledge/ecommerce/shelf.json"]);
  assert.ok(!("text" in file.prompts[0]), "the index does not carry prompt text");
});

test("search needs most of the words, ranks title matches first, and filters by stage", () => {
  const { file } = buildShelf(input());
  const s = new ShelfSearch("prompts", file.prompts as ShelfItem[]);
  assert.deepEqual(s.search("ad hooks").map(i => i.slug), ["hooks-from-reviews"]);
  assert.deepEqual(s.search("mandarin supplier message").map(i => i.slug), ["supplier-rfq-message"]);
  assert.deepEqual(s.search("hooks", "source"), []);
  assert.equal(s.search("").length, 2);
  assert.deepEqual(s.search("quantum chemistry"), []);
});

after(() => forgetVerticals());

test("GET /api/knowledge/ecommerce/shelf, a shelf page and one item", async () => {
  forgetVerticals();
  const { files } = buildShelf(input());
  // The skill's own file, as the pack build ships it (capital SKILL.md).
  const skill = JSON.parse(files[Object.keys(files).find(p => p.endsWith("/shelf.json")) ?? ""] ?? "{}").skills?.[0]?.path
    ?? "/packs/knowledge/ecommerce/skills/build-klaviyo-segments/SKILL.md";
  files[skill] = "---\nname: build-klaviyo-segments\n---\n# Klaviyo segments\n";
  const assets = { async fetch(req: Request) {
    const p = new URL(req.url).pathname;
    if (!(p in files)) return new Response("Not found", { status: 404 });
    return new Response(files[p], { headers: { "content-type": p.endsWith(".json") ? "application/json" : "text/markdown" } });
  } };
  const t = await testEnv({ ASSETS: assets as unknown as Fetcher });
  const sum = await t.api("GET", "/api/knowledge/ecommerce/shelf?q=hooks");
  assert.equal(sum.status, 200);
  assert.deepEqual(sum.body.counts, { prompts: 2, skills: 1, tools: 1, minds: 1 });
  assert.equal(sum.body.found.prompts, 1);
  const page = await t.api("GET", "/api/knowledge/ecommerce/shelf/prompts?limit=1");
  assert.equal(page.body.total, 2);
  assert.equal(page.body.items.length, 1);
  assert.deepEqual(page.body.stages.map((s: { id: string }) => s.id), ["source", "creative"]);
  const one = await t.api("GET", "/api/knowledge/ecommerce/shelf/prompts/hooks-from-reviews");
  assert.equal(one.status, 200);
  assert.match(one.body.text, /# Ten ad hooks/);
  assert.match(one.body.prompt, /^You are a direct-response strategist/);
  const sk = await t.api("GET", "/api/knowledge/ecommerce/shelf/skills/build-klaviyo-segments");
  assert.equal(sk.status, 200, "a skill's SKILL.md (capital letters in the file name) loads");
  assert.match(sk.body.text, /# Klaviyo segments/);
  assert.equal(await shelfText({ ASSETS: assets as unknown as Fetcher, APP_ORIGIN: "https://x.test" } as unknown as Env, "/packs/knowledge/ecommerce/../../secret.md"), null, "no path outside the library");
  assert.equal((await t.api("GET", "/api/knowledge/ecommerce/shelf/widgets")).status, 404);
  assert.equal((await t.api("GET", "/api/knowledge/ecommerce/shelf/prompts/nope")).status, 404);
  assert.equal((await t.api("GET", "/api/knowledge/saas/shelf")).status, 404);
});

test("a shelf item page boots with its item and text, so it paints without waiting for the API", async () => {
  forgetVerticals();
  const { files } = buildShelf(input());
  files["/packs/knowledge/ecommerce/skills/build-klaviyo-segments/SKILL.md"] = "# Klaviyo segments\n\nBuild the segments.\n";
  const shell = `<!doctype html><html><head><meta name="viewport" content="width=device-width" /><title>x</title></head><body><div id="app"></div></body></html>`;
  const assets = { async fetch(req: Request) {
    const p = new URL(req.url).pathname;
    if (p === "/" || p === "/index.html") return new Response(shell, { headers: { "content-type": "text/html" } });
    return p in files ? new Response(files[p], { headers: { "content-type": p.endsWith(".json") ? "application/json" : "text/markdown" } }) : new Response("Not found", { status: 404 });
  } };
  const t = await testEnv({ ASSETS: assets as unknown as Fetcher });
  const res = await t.api("GET", "/e-commerce/skills/build-klaviyo-segments");
  assert.equal(res.status, 200);
  const boot = JSON.parse(String(res.body).match(/<script type="application\/json" id="boot">([\s\S]*?)<\/script>/)?.[1] ?? "{}");
  const item = boot["/api/knowledge/ecommerce/shelf/skills/build-klaviyo-segments"];
  assert.equal(item?.item?.slug, "build-klaviyo-segments", "the item's API answer is in the page");
  assert.match(item.text, /# Klaviyo segments/);
  assert.ok(boot["/api/agents?vertical=ecommerce"], "the team list is in the page too");
});

// The real library, once merged: every item names only team agents and real stages, and prompts follow the house rules.
const LIB = new URL("../knowledge/ecommerce/library/", import.meta.url);
test("the e-commerce library files follow the shelf rules", { skip: !existsSync(new URL("prompts.json", LIB)) }, () => {
  const personas = JSON.parse(readFileSync(new URL("../src/modules/directory/data/personas-ecommerce.json", import.meta.url), "utf8")) as { id: string }[];
  const team = new Set(personas.map(p => p.id));
  const stages = new Set(ECOMMERCE_STAGES.map(s => s.id));
  const read = (f: string) => existsSync(new URL(f, LIB)) ? JSON.parse(readFileSync(new URL(f, LIB), "utf8")) as { slug: string; stage: string; agents: string[]; prompt?: string }[] : [];
  for (const [f, list] of [["prompts.json", read("prompts.json")], ["tools.json", read("tools.json")], ["minds.json", read("minds.json")]] as const) {
    assert.equal(new Set(list.map(i => i.slug)).size, list.length, `${f}: slugs are unique`);
    for (const i of list) {
      assert.ok(stages.has(i.stage), `${f} ${i.slug}: stage ${i.stage}`);
      for (const a of i.agents) assert.ok(team.has(a), `${f} ${i.slug}: ${a} is on the team`);
      if (i.prompt) assert.doesNotMatch(i.prompt, /[–—]/, `${f} ${i.slug}: no em or en dashes`);
    }
  }
});
