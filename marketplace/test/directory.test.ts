// Directory: seeding house personas, listing and search, and the public agent API.
import { test, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";
import { setPersonasForTests } from "../src/modules/directory/index.ts";
import { forgetPersonas, getPersona, listPersonas, seedPersonas } from "../src/modules/directory/service.ts";

const ADA: Persona = {
  ...NOVA,
  id: "ada-content",
  name: "Ada",
  title: "Content writer",
  tagline: "Writes the articles and newsletters your customers read to the end.",
  area: "content",
  sort: 20,
  profile: {
    ...NOVA.profile,
    accent: "#1F8A5B",
    portrait: "/agents/ada-content.webp",
    outcomes: [
      { id: "article", title: "A blog article about your product", deliverable: "A 1,500 word article with headings and a meta description.", job_type_id: "seo-blog-post" },
      { id: "newsletter", title: "A monthly newsletter issue", deliverable: "One newsletter issue with a subject line and three short sections.", job_type_id: null, job_type_hint: "newsletter" },
    ],
    samples: [{ title: "Bakery article", brief: "An article for our bakery about how to store sourdough bread at home." }],
  },
};

const LEO: Persona = {
  ...NOVA,
  id: "leo-ads",
  name: "Leo",
  title: "Paid ads writer",
  tagline: "Writes ads and the landing pages they point to.",
  sort: 30,
  profile: { ...NOVA.profile, accent: "#C0392B", portrait: "/agents/leo-ads.webp", outcomes: [{ id: "landing", title: "A landing page for your ad", deliverable: "Landing page copy matched to one ad.", job_type_id: "landing-page-copy" }] },
};

const HOUSE = [NOVA, ADA, LEO];

beforeEach(() => setPersonasForTests(HOUSE));

async function addExpertPersona(t: Awaited<ReturnType<typeof testEnv>>, id: string, status: "live" | "hidden", over: Partial<Persona> = {}) {
  const now = new Date().toISOString();
  await t.grantBeta("user_expert");
  await t.sql("INSERT OR IGNORE INTO experts (id, user_id, status, display_name, created_at, updated_at) VALUES ('exp_1', 'user_expert', 'approved', 'Sam Expert', ?, ?)", now, now);
  const p = { ...NOVA, ...over, id };
  await t.sql(
    "INSERT INTO personas (id, kind, expert_id, name, title, tagline, area, profile, status, sort, created_at, updated_at) VALUES (?, 'expert', 'exp_1', ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    id, p.name, p.title, p.tagline, p.area, JSON.stringify({ ...p.profile, portrait: `/agents/${id}.webp` }), status, p.sort, now, now,
  );
  forgetPersonas(t.env); // raw SQL skips the app write paths that clear the roster held in memory
}

test("seeding creates every house persona once, then writes nothing when unchanged", async () => {
  const t = await testEnv();
  assert.deepEqual(await seedPersonas(t.env, "user_ops"), { created: 3, updated: 0, hidden: 0, unchanged: 0, skipped: [] });
  const rows = await t.sql("SELECT id, kind, status, content_hash, updated_at FROM personas ORDER BY id");
  assert.deepEqual(rows.map(r => r.id), ["ada-content", "leo-ads", "nova-seo"]);
  assert.ok(rows.every(r => r.kind === "house" && r.status === "live" && /^[0-9a-f]{64}$/.test(r.content_hash)));

  const again = await seedPersonas(t.env, "user_ops");
  assert.deepEqual(again, { created: 0, updated: 0, hidden: 0, unchanged: 3, skipped: [] });
  const after = await t.sql("SELECT id, content_hash, updated_at FROM personas ORDER BY id");
  assert.deepEqual(after, rows.map(r => ({ id: r.id, content_hash: r.content_hash, updated_at: r.updated_at })));

  const events = await t.sql("SELECT type, COUNT(*) AS n FROM events WHERE entity = 'persona' GROUP BY type");
  assert.deepEqual(events, [{ type: "persona.seeded", n: 3 }]);
});

test("seeding rewrites only the persona whose content changed", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const before = await t.sql("SELECT id, content_hash FROM personas ORDER BY id");
  setPersonasForTests([NOVA, { ...ADA, tagline: "Writes the articles your customers read to the very end." }, LEO]);
  assert.deepEqual(await seedPersonas(t.env, "user_ops"), { created: 0, updated: 1, hidden: 0, unchanged: 2, skipped: [] });
  const after = await t.sql("SELECT id, content_hash, tagline FROM personas ORDER BY id");
  assert.notEqual(after[0].content_hash, before[0].content_hash);
  assert.equal(after[0].tagline, "Writes the articles your customers read to the very end.");
  assert.equal(after[1].content_hash, before[1].content_hash);
  assert.equal(after[2].content_hash, before[2].content_hash);
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM events WHERE type = 'persona.updated' AND entity_id = 'ada-content'"))[0].n, 1);
});

test("house personas missing from the data are hidden, and come back when re-added", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  setPersonasForTests([NOVA, ADA]);
  assert.deepEqual(await seedPersonas(t.env, "system"), { created: 0, updated: 0, hidden: 1, unchanged: 2, skipped: [] });
  assert.equal((await t.sql("SELECT status FROM personas WHERE id = 'leo-ads'"))[0].status, "hidden");
  assert.equal(await getPersona(t.env, "leo-ads"), null);
  assert.equal((await getPersona(t.env, "leo-ads", { includeHidden: true }))?.name, "Leo");
  assert.deepEqual((await listPersonas(t.env)).map(p => p.id), ["nova-seo", "ada-content"]);
  assert.equal((await t.api("GET", "/api/agents/leo-ads")).status, 404);
  // Hiding is not repeated on the next seed.
  assert.equal((await seedPersonas(t.env, "system")).hidden, 0);

  setPersonasForTests(HOUSE);
  assert.deepEqual(await seedPersonas(t.env, "user_ops"), { created: 0, updated: 1, hidden: 0, unchanged: 2, skipped: [] });
  assert.equal((await t.sql("SELECT status FROM personas WHERE id = 'leo-ads'"))[0].status, "live");
});

test("seeding never overwrites an expert persona with the same id and skips malformed entries", async () => {
  const t = await testEnv();
  await addExpertPersona(t, "leo-ads", "live", { name: "Leon" });
  setPersonasForTests([NOVA, LEO, { ...ADA, id: "Bad Id" }, NOVA]);
  const r = await seedPersonas(t.env, "user_ops");
  assert.deepEqual(r, { created: 1, updated: 0, hidden: 0, unchanged: 0, skipped: ["leo-ads", "Bad Id", "nova-seo"] });
  const leo = await t.sql("SELECT kind, name FROM personas WHERE id = 'leo-ads'");
  assert.deepEqual(leo, [{ kind: "expert", name: "Leon" }]);
});

test("list filters by area and searches name, title, tagline and outcome titles", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const ids = async (filter?: { area?: string; q?: string }) => (await listPersonas(t.env, filter)).map(p => p.id);
  assert.deepEqual(await ids(), ["nova-seo", "ada-content", "leo-ads"]);
  assert.deepEqual(await ids({ area: "content" }), ["ada-content"]);
  assert.deepEqual(await ids({ area: "marketing" }), ["nova-seo", "leo-ads"]);
  assert.deepEqual(await ids({ q: "ada" }), ["ada-content"]);                 // name
  assert.deepEqual(await ids({ q: "Paid ADS" }), ["leo-ads"]);               // title, any case
  assert.deepEqual(await ids({ q: "people already searching" }), ["nova-seo"]); // tagline, every word
  assert.deepEqual(await ids({ q: "newsletter" }), ["ada-content"]);         // outcome title
  // Both have a landing page outcome, so they match about as well, and the more useful agent (lower sort) comes first.
  assert.deepEqual(await ids({ q: "landing page" }), ["nova-seo", "leo-ads"]);
  // A plain request finds the same agents as the two words that carry it (search.ts; more in directory-search.test.ts).
  assert.deepEqual(await ids({ q: "I need a landing page for my shop" }), ["nova-seo", "leo-ads"]);
  assert.deepEqual(await ids({ q: "landing", area: "content" }), []);
  assert.deepEqual(await ids({ q: "nothing like this" }), []);
});

test("sort orders every list (browsing everyone takes turns by area), ties go by name, and search puts name and title matches first", async () => {
  const t = await testEnv();
  const BEA = { ...ADA, id: "bea-content", name: "Bea", sort: 20, profile: { ...ADA.profile, portrait: "/agents/bea-content.webp" } };
  setPersonasForTests([NOVA, ADA, { ...LEO, sort: 5 }, BEA]);
  await seedPersonas(t.env, "user_ops");
  const ids = async (path: string) => (await t.api("GET", path)).body.agents.map((a: any) => a.id);
  // Browsing everyone mixes areas (views.ts browseOrder): the best of each area takes turns, in sort order.
  assert.deepEqual(await ids("/api/agents"), ["leo-ads", "ada-content", "nova-seo", "bea-content"]);
  assert.deepEqual(await ids("/api/agents?area=content"), ["ada-content", "bea-content"]);
  assert.deepEqual(await ids("/api/agents?area=marketing"), ["leo-ads", "nova-seo"]);
  // Nova is the SEO strategist; Ada and Bea match through the job type behind an outcome ("SEO blog post"), so they follow.
  assert.deepEqual(await ids("/api/agents?q=seo"), ["nova-seo", "ada-content", "bea-content"]);
  // "article" is in Ada's and Bea's taglines but only in one of Nova's outcomes, so Nova comes last despite a lower sort.
  assert.deepEqual(await ids("/api/agents?q=article"), ["ada-content", "bea-content", "nova-seo"]);
  // "writer" is in Leo's and Ada's titles (strong), so both beat anyone matching it elsewhere; sort orders the group.
  assert.deepEqual(await ids("/api/agents?q=writer"), ["leo-ads", "ada-content", "bea-content"]);
});

test("area chips stay put while searching, with zero counts for areas the search misses", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/api/agents?q=newsletter");
  assert.deepEqual(res.body.areas, [{ id: "marketing", label: "Marketing", count: 0 }, { id: "content", label: "Content", count: 1 }]);
  assert.equal(res.body.total, 1);
});

test("GET /api/agents returns public cards with three outcomes, a turnaround and area counts, never a price", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/api/agents");
  assert.equal(res.status, 200);
  assert.match(res.res.headers.get("cache-control") ?? "", /^public, max-age=60/);
  assert.equal(res.body.total, 3);
  assert.deepEqual(res.body.areas, [{ id: "marketing", label: "Marketing", count: 2 }, { id: "content", label: "Content", count: 1 }]);
  const nova = res.body.agents.find((a: any) => a.id === "nova-seo");
  assert.deepEqual(Object.keys(nova).sort(), ["accent", "area", "area_label", "does", "id", "kind", "mega", "name", "outcomes", "portrait", "ready_in_hours", "role", "tagline", "title", "vertical"]);
  assert.deepEqual(nova.outcomes, ["An article that ranks for one search", "A landing page that converts search visitors"]);
  assert.equal(nova.ready_in_hours, 24); // the quickest job type behind an outcome
  // Hiring is free: no price, in any form, in the list.
  assert.doesNotMatch(JSON.stringify(res.body), /price|\$\d|_usd|cents/i);

  const filtered = await t.api("GET", "/api/agents?area=content&q=article");
  assert.deepEqual(filtered.body.agents.map((a: any) => a.id), ["ada-content"]);
  assert.equal(filtered.body.total, 2); // the search across all areas: Nova and Ada
  assert.deepEqual(filtered.body.areas.map((a: any) => [a.id, a.count]), [["marketing", 1], ["content", 1]]);

  const bad = await t.api("GET", "/api/agents?area=astrology");
  assert.equal(bad.status, 400);
  assert.equal(bad.body.error.code, "unknown_area");
});

test("an outcome with no job type has no job, and an agent with none has no turnaround", async () => {
  const t = await testEnv();
  setPersonasForTests([{ ...ADA, profile: { ...ADA.profile, outcomes: [ADA.profile.outcomes[1]] } }]);
  const card = (await t.api("GET", "/api/agents")).body.agents[0];
  assert.equal(card.ready_in_hours, null);
  const prof = (await t.api("GET", "/api/agents/ada-content")).body.agent;
  assert.deepEqual(prof.outcomes, [{ id: "newsletter", title: "A monthly newsletter issue", deliverable: "One newsletter issue with a subject line and three short sections.", job_type_id: null, job: null, how: null }]);
});

test("GET /api/agents/:id hides method and source_roles, joins job types, and never shows a price", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/api/agents/ada-content");
  assert.equal(res.status, 200);
  assert.match(res.res.headers.get("cache-control") ?? "", /^public/);
  const a = res.body.agent;
  const text = JSON.stringify(res.body);
  for (const key of ["method", "source_roles", "look"]) assert.ok(!(key in a), `profile must not include ${key}`);
  assert.ok(!text.includes(NOVA.profile.method.slice(0, 30)), "method text must not leak");
  assert.ok(!text.includes("seo-strategist"), "source roles must not leak");
  assert.equal(a.name, "Ada");
  assert.equal(a.bio, NOVA.profile.bio);
  assert.deepEqual(a.capabilities, NOVA.profile.capabilities);
  assert.deepEqual(a.good_at, NOVA.profile.good_at);
  assert.deepEqual(a.not_for, NOVA.profile.not_for);
  assert.doesNotMatch(text, /price|\$\d|_usd|cents/i);
  assert.equal(a.soul, null); // Nova's fixture has no soul yet
  const [article, newsletter] = a.outcomes;
  assert.equal(article.job_type_id, "seo-blog-post");
  assert.equal(article.deliverable, "A 1,500 word article with headings and a meta description.");
  assert.deepEqual(
    { hours: article.job.turnaround_hours, deliverable: article.job.deliverable, keys: Object.keys(article.job).sort() },
    { hours: 24, deliverable: "A 1,200 to 2,000 word article with title, meta description, headings and internal link suggestions.", keys: ["area", "deliverable", "id", "summary", "title", "turnaround_hours"] },
  );
  assert.equal(newsletter.job, null);
  // The bakery request fits the article outcome, so it opens with that job type.
  assert.deepEqual(a.samples, [{ title: "Bakery article", brief: ADA.profile.samples[0].brief, job_type_id: "seo-blog-post" }]);
});

test("related agents are others in the same area, at most four", async () => {
  const t = await testEnv();
  const many = Array.from({ length: 6 }, (_, i) => ({ ...LEO, id: `mark-${i}`, name: `Mark${"abcdef"[i]}`, sort: 100 + i, profile: { ...LEO.profile, portrait: `/agents/mark-${i}.webp` } }));
  setPersonasForTests([...HOUSE, ...many]);
  await seedPersonas(t.env, "user_ops");
  const nova = (await t.api("GET", "/api/agents/nova-seo")).body;
  assert.equal(nova.related.length, 4);
  assert.ok(nova.related.every((r: any) => r.area === "marketing" && r.id !== "nova-seo"));
  const ada = (await t.api("GET", "/api/agents/ada-content")).body;
  assert.deepEqual(ada.related, []);
});

test("before the first seed, pages read house personas straight from the data", async () => {
  const t = await testEnv();
  assert.equal((await t.sql("SELECT COUNT(*) AS n FROM personas"))[0].n, 0);
  assert.deepEqual((await listPersonas(t.env)).map(p => p.id), ["nova-seo", "ada-content", "leo-ads"]);
  assert.equal((await getPersona(t.env, "nova-seo"))?.name, "Nova");
  const list = await t.api("GET", "/api/agents?q=landing");
  assert.equal(list.status, 200);
  assert.deepEqual(list.body.agents.map((a: any) => a.id), ["leo-ads", "nova-seo"]);
  const one = await t.api("GET", "/api/agents/nova-seo");
  assert.equal(one.status, 200);
  assert.equal(one.body.agent.outcomes[0].job.turnaround_hours, 24);
  assert.ok(!("method" in one.body.agent));

  // A live expert persona shows alongside the data before seeding; a hidden one does not.
  await addExpertPersona(t, "sam-expert", "live", { name: "Sam", sort: 5 });
  await addExpertPersona(t, "kit-expert", "hidden", { name: "Kit", sort: 6 });
  assert.deepEqual((await listPersonas(t.env)).map(p => p.id), ["sam-expert", "nova-seo", "ada-content", "leo-ads"]);
  assert.equal((await getPersona(t.env, "kit-expert")), null);
  assert.equal((await getPersona(t.env, "sam-expert"))?.kind, "expert");
});

test("unknown agents are a 404 with a plain message", async () => {
  const t = await testEnv();
  const before = await t.api("GET", "/api/agents/no-such-agent");
  assert.equal(before.status, 404);
  assert.equal(before.body.error.code, "agent_not_found");
  await seedPersonas(t.env, "user_ops");
  const after = await t.api("GET", "/api/agents/no-such-agent");
  assert.equal(after.status, 404);
  assert.match(after.body.error.message, /could not find that agent/);
});

test("the agent API is public: no sign-in needed", async () => {
  const t = await testEnv();
  assert.equal((await t.api("GET", "/api/agents")).status, 200);
  assert.equal((await t.api("GET", "/api/agents/nova-seo")).status, 200);
  assert.equal((await t.api("POST", "/api/agents")).status, 405);
});

test("the roster is read from D1 once for many requests at once, and a failed read keeps the last good roster", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const db = t.env.DB as unknown as { prepare(sql: string): unknown };
  const prepare = db.prepare.bind(db);
  let reads = 0, broken = false;
  db.prepare = (sql: string) => {
    if (/FROM personas WHERE status = 'live'/.test(sql)) { reads++; if (broken) throw new Error("D1_ERROR: D1 DB is overloaded"); }
    return prepare(sql);
  };
  mock.timers.enable({ apis: ["Date"], now: Date.now() });
  try {
    forgetPersonas(t.env);
    const lists = await Promise.all(Array.from({ length: 20 }, () => listPersonas(t.env)));
    assert.equal(reads, 1, "twenty requests share one read");
    assert.ok(lists.every(l => l.length === lists[0].length && l.length > 0));
    assert.equal((await getPersona(t.env, "nova-seo"))?.name, "Nova");
    assert.equal(reads, 1, "a live agent comes from the roster in memory");

    mock.timers.tick(61_000);
    broken = true;
    assert.equal((await listPersonas(t.env)).length, lists[0].length, "D1 overloaded: the last good roster is served");
    broken = false;
    mock.timers.tick(6_000);
    await listPersonas(t.env);
    assert.equal(reads, 3, "it tries D1 again a few seconds later");
  } finally {
    mock.timers.reset();
    db.prepare = prepare;
  }
});
