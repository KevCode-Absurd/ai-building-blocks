// Directory search (src/modules/directory/search.ts): a plain request finds the agents who do that work, and agents
// who make the thing come before agents who only audit it. GET /api/agents and the MCP tool list_agents both search
// through service.ts listPersonas, which is tested here too.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";
import { housePersonas, setPersonasForTests } from "../src/modules/directory/index.ts";
import { forgetSearchDocs, rankPersonas, requestIntent, searchPersonas, searchTerms, settingTerms, stem } from "../src/modules/directory/search.ts";
import { listPersonas, seedPersonas } from "../src/modules/directory/service.ts";
import { roleToolboxFile, setRoleToolboxForTests, type ToolboxFile } from "../src/modules/directory/toolbox.ts";
import { workLine } from "../src/modules/directory/work.ts";

const REAL_ROSTER = housePersonas();
const REAL_TOOLBOX = roleToolboxFile();
after(() => { setPersonasForTests(REAL_ROSTER); setRoleToolboxForTests(REAL_TOOLBOX); });

type Outcome = Persona["profile"]["outcomes"][number];
const outcome = (title: string, hint = ""): Outcome => ({ id: title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40), title, deliverable: "The finished thing.", job_type_id: null, job_type_hint: hint });
function persona(id: string, name: string, title: string, tagline: string, sort: number, outcomes: Outcome[], over: Partial<Persona> = {}): Persona {
  return {
    ...NOVA, id, name, title, tagline, sort, role: undefined, ...over,
    profile: { ...NOVA.profile, bio: "", capabilities: [], good_at: [], not_for: [], samples: [], portrait: `/agents/${id}.webp`, outcomes, ...(over.profile ?? {}) },
  };
}

/** A copywriter who makes landing pages, and the more "useful" (lower sort) specialist who only audits them. */
const BAO = persona("bao-copy", "Bao", "Website copywriter", "Words for the pages that sell your offer.", 330, [
  outcome("Landing page copy for one offer", "landing page copy"), outcome("Homepage copy that says what you do", "homepage copy"),
]);
const DAWEI = persona("dawei-cro", "Dawei", "Landing page CRO specialist", "Finds why visitors leave your page.", 40, [
  outcome("A landing page teardown with ranked fixes", "landing page audit"), outcome("A message match check between your ad and page", "message match review"),
  outcome("An A/B test plan for your top change", "ab test plan"),
]);
const RUSSELL = persona("russell-books", "Russell", "Bookkeeper", "Keeps your books clean every month.", 10, [
  outcome("Your bank statement matched to your books", "bank reconciliation"), outcome("A clean profit and loss statement for the period", "profit and loss statement"),
], { role: "bookkeeper" });
const CANDICE = persona("candice-email", "Candice", "Email marketing specialist", "Emails your list opens and acts on.", 50, [
  outcome("A welcome email series, planned and written", "welcome email sequence"), outcome("A 90-day email plan", "email marketing plan"),
]);
const NATHAN = persona("nathan-jobpost", "Nathan", "Recruitment marketing specialist", "Job posts the right people answer.", 270, [
  outcome("A clear job post ready to publish", "job post"), outcome("A role outcomes sheet", "role scorecard"),
], { role: "recruiter" });
const DESTINY = persona("destiny-web", "Destiny", "Web developer", "Small sites built in clean HTML and CSS.", 500, [
  outcome("A one-page site in HTML and CSS", "one page website"), outcome("A contact form wired to a form service", "website form"),
]);
const ROSTER = [BAO, DAWEI, RUSSELL, CANDICE, NATHAN, DESTINY];
const ids = (q: string, list = ROSTER) => searchPersonas(list, q).map(p => p.id);

test("a plain sentence finds the agents who do the work: it used to find nobody", () => {
  // "I", "need", "a", "for", "my" carry nothing; "shop" only sets the scene; "landing page" is the request.
  assert.deepEqual(searchTerms("I need a landing page for my shop"), ["land", "page", "shop"]);
  assert.deepEqual([...settingTerms("I need a landing page for my shop")], ["shop"]);
  assert.deepEqual(ids("I need a landing page for my shop"), ["bao-copy", "dawei-cro"]);
  assert.deepEqual(ids("someone to do my bookkeeping"), ["russell-books"]);
  assert.deepEqual(ids("write my welcome emails"), ["candice-email"]);
  // A word no agent has anywhere (a town, a trade) is set aside instead of emptying the list.
  assert.deepEqual(ids("a landing page for my bakery in Leeds"), ["bao-copy", "dawei-cro"]);
  // Nothing but such words: nobody.
  assert.deepEqual(ids("zzzz qqqq"), []);
  // No words at all: everyone, most useful first.
  assert.deepEqual(ids("  "), ["russell-books", "dawei-cro", "candice-email", "nathan-jobpost", "bao-copy", "destiny-web"]);
});

test("agents who make the thing come before agents who only audit it, whatever their titles say", () => {
  // Dawei has "Landing page" in his title and is the more useful agent (sort 40), but he reviews pages. Bao writes them.
  assert.deepEqual(ids("landing page"), ["bao-copy", "dawei-cro"]);
  const [first, second] = rankPersonas(ROSTER, "I need a landing page for my shop");
  assert.equal(first.persona.id, "bao-copy");
  assert.equal(first.because, "Landing page copy for one offer");
  assert.ok(first.score > second.score * 1.1, "the maker is clearly ahead, not ahead on a tie-break");
  assert.equal(workLine(second.persona.profile.outcomes)!.nature, "review");
  // Asking for the review turns it round: the auditor is the answer, and the copywriter, who audits nothing, is left out.
  assert.equal(requestIntent("audit my landing page"), "review");
  assert.deepEqual(ids("audit my landing page"), ["dawei-cro"]);
  assert.equal(requestIntent("plan my product launch"), "plan");
  assert.equal(requestIntent("I need a landing page"), "make");
});

test("nobody is pushed down for auditing a thing that nobody makes", () => {
  // "Technical SEO" is a field, not a deliverable: the specialist whose title says it comes first although he audits.
  const chaminda = persona("chaminda-tech", "Chaminda", "Technical SEO specialist", "Finds what stops search engines reading your site.", 9001, [
    outcome("A crawl and indexing fix list from your crawl export", "technical crawl fixes"), outcome("A Core Web Vitals read-out for your search pages", "core web vitals review"),
  ]);
  const ingrid = persona("ingrid-store", "Ingrid", "Ecommerce SEO specialist", "Gets your product pages found.", 450, [
    outcome("Collection page copy that ranks", "collection page seo"), outcome("A comparison page", "comparison page"),
  ], { role: "seo-specialist" });
  assert.equal(workLine(chaminda.profile.outcomes)!.nature, "review");
  assert.deepEqual(ids("technical seo", [ingrid, chaminda]), ["chaminda-tech", "ingrid-store"]);
  // A search by name or by title is never bent by what the agent does.
  assert.deepEqual(ids("dawei"), ["dawei-cro"]);
  assert.deepEqual(ids("cro specialist"), ["dawei-cro"]);
});

test("words match in any form and through everyday stand-ins; a hiring request goes to the recruiters", () => {
  assert.equal(stem("bookkeeping"), stem("bookkeeper"));
  assert.equal(stem("emails"), stem("email"));
  assert.equal(stem("writer"), stem("writing"));
  assert.equal(stem("designer"), stem("designs"));
  assert.notEqual(stem("poster"), stem("post"));
  // "store" for "shop", "site" for "website" (but a website request does not find a building site).
  const shop = persona("imran-store", "Imran", "Store page writer", "Product pages for your store.", 360, [outcome("Product page copy for your store", "product page copy")]);
  assert.deepEqual(ids("product pages for my shop", [shop, BAO]), ["imran-store"]);
  const site = persona("vince-build", "Vince", "Construction coordinator", "Keeps the build on time.", 100, [outcome("A daily site report from your notes", "site diary")]);
  assert.deepEqual(ids("build me a website", [site, DESTINY]), ["destiny-web"]);
  // "Hire a developer" is a hiring job. The recruiter (role alias "hiring") is found; the developer is not the answer.
  assert.deepEqual([...settingTerms("help me hire a developer")], ["develop"]);
  assert.deepEqual(ids("help me hire a developer"), ["nathan-jobpost"]);
  // Accents and capitals do not matter.
  assert.deepEqual(ids("LANDING Pâge"), ["bao-copy", "dawei-cro"]);
});

test("a word found only in the small print does not make a match, and 'Not for' lines are never searched", () => {
  const quiet = persona("quinn-ops", "Quinn", "Operations manager", "Keeps the week running.", 5, [outcome("A weekly operations review", "operations review")], {
    profile: { ...NOVA.profile, bio: "I once wrote a landing page for a friend.", not_for: ["Bookkeeping or tax returns"], capabilities: [], good_at: [], samples: [] } as Persona["profile"],
  });
  quiet.profile.outcomes = [outcome("A weekly operations review", "operations review")];
  assert.deepEqual(ids("landing page", [quiet, BAO]), ["bao-copy"]);
  assert.deepEqual(ids("bookkeeping", [quiet, RUSSELL]), ["russell-books"]);
});

test("a role's toolbox task names are searched, and say whether the role makes the thing", () => {
  const box: ToolboxFile = {
    schema: "ai-blocks-role-toolbox/1", library: {}, unpaged: [],
    roles: { "graphic-designer": { kit: {}, skills: {}, items: [], helpers: [], reviewed: "2026-11-10", tasks: [
      { id: "event-poster", task: "Design an event poster", kind: "ad_creative" },
      { id: "preflight", task: "Check a print file before it goes to the printer", kind: "audit" },
    ] } },
  };
  const lloyd = persona("lloyd-print", "Lloyd", "Print designer", "Flyers and banners that read at a glance.", 500, [outcome("A flyer layout", "flyer layout")], { role: "graphic-designer" });
  setRoleToolboxForTests(box);
  forgetSearchDocs([lloyd, BAO]);
  try {
    // Nothing in Lloyd's own text says "poster": the role's task finds him, and names why.
    const hits = rankPersonas([lloyd, BAO], "I need an event poster");
    assert.deepEqual(hits.map(h => h.persona.id), ["lloyd-print"]);
    assert.equal(hits[0].because, "Design an event poster");
  } finally {
    setRoleToolboxForTests(REAL_TOOLBOX);
    forgetSearchDocs([lloyd, BAO]);
  }
});

test("listPersonas, which GET /api/agents and the MCP tool list_agents use, ranks the same way", async () => {
  setPersonasForTests(ROSTER);
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const found = async (filter: { area?: string; q?: string }) => (await listPersonas(t.env, filter)).map(p => p.id);
  assert.deepEqual(await found({ q: "I need a landing page for my shop" }), ["bao-copy", "dawei-cro"]);
  assert.deepEqual(await found({ q: "audit my landing page" }), ["dawei-cro"]);
  assert.deepEqual(await found({ q: "someone to do my bookkeeping", area: "marketing" }), ["russell-books"]);
  const api = await t.api("GET", `/api/agents?q=${encodeURIComponent("I need a landing page for my shop")}`);
  assert.equal(api.status, 200);
  assert.deepEqual(api.body.agents.map((a: any) => [a.id, a.does.label]), [["bao-copy", "Makes"], ["dawei-cro", "Reviews and advises"]]);
  assert.equal(api.body.total, 2);
  setPersonasForTests(REAL_ROSTER);
});

test("on the real roster, the ten plain requests each find agents, and makers lead", () => {
  setPersonasForTests(REAL_ROSTER);
  setRoleToolboxForTests(REAL_TOOLBOX);
  const live = REAL_ROSTER.filter(p => p.status === "live");
  const requests = [
    "I need a landing page for my shop", "make ads for my product", "someone to do my bookkeeping", "write my welcome emails", "fix my Shopify store speed",
    "design a logo", "plan my product launch", "edit my videos", "set up tracking", "help me hire a developer",
  ];
  for (const q of requests) assert.ok(rankPersonas(live, q).length >= 3, `"${q}" finds at least three agents`);
  const nature = (p: Persona) => workLine(p.profile.outcomes)?.nature;
  // Nobody who only reviews is in the first three for a thing that agents make.
  for (const q of ["I need a landing page for my shop", "make ads for my product", "write my welcome emails", "edit my videos"]) {
    for (const hit of rankPersonas(live, q).slice(0, 3)) assert.notEqual(nature(hit.persona), "review", `"${q}": ${hit.persona.id} only reviews`);
  }
  assert.equal(rankPersonas(live, "someone to do my bookkeeping")[0].persona.role, "bookkeeper");
  // A hiring request goes to the people who hire (recruiters, HR), not to developers.
  for (const hit of rankPersonas(live, "help me hire a developer").slice(0, 3)) assert.equal(hit.persona.area, "people", `hire a developer: ${hit.persona.id}`);
  assert.equal(nature(rankPersonas(live, "audit my landing page")[0].persona), "review");
});
