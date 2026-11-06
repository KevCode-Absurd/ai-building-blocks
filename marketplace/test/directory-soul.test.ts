// Directory: the agent's personality (soul) on the profile API and as soul.md, the home page's featured picks,
// and the area chips for every area, including the newer ones (code, data, design, teaching).
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { NOVA } from "./fixtures.ts";
import type { Area, Persona, PersonaSoul } from "../src/core/types.ts";
import { setPersonasForTests } from "../src/modules/directory/index.ts";
import { seedPersonas } from "../src/modules/directory/service.ts";
import { FEATURED_AREA_ORDER, pickFeatured, soulMarkdown, soulView } from "../src/modules/directory/views.ts";
import { splitVoice } from "../src/modules/directory/soul.ts";

const SOUL: PersonaSoul = {
  essence: "I am the strategist who asks what you sell before I ask what you rank for.",
  temperament: "I stay calm and curious. I look for the one search that matters, then I ignore the rest.",
  voice: "Plain and warm, with short sentences. I say things like: \"Let's win one search before we chase ten.\"",
  values: ["Pages that answer the question in full", "Using only facts you gave me"],
  quirks: ["I read the top five results before I write a word", "I name every page after the search it must win"],
  pushback: "If the brief is thin, I ask one sharp question instead of guessing. If you want a trick, I say no and offer the honest way.",
  off_hours: "I garden, so I think about pages the way I think about soil: slow, patient work.",
};

const NOVA_SOUL: Persona = { ...NOVA, profile: { ...NOVA.profile, soul: SOUL } };

/** A persona in any area, with its own id, name and sort. */
function agent(id: string, name: string, area: Area, sort: number, over: Partial<Persona["profile"]> = {}): Persona {
  return { ...NOVA, id, name, title: `${name} the ${area} agent`, area, sort, profile: { ...NOVA.profile, portrait: `/agents/${id}.webp`, ...over } };
}

beforeEach(() => setPersonasForTests([NOVA_SOUL]));

// ---------- Personality ----------

test("the profile shows the soul, and never method, source roles or look", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/api/agents/nova-seo");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.agent.soul, SOUL);
  assert.deepEqual(Object.keys(res.body.agent.soul).sort(), ["essence", "off_hours", "pushback", "quirks", "temperament", "values", "voice"]);
  const text = JSON.stringify(res.body);
  for (const key of ["method", "source_roles", "look"]) assert.ok(!text.includes(`"${key}"`), `must not include ${key}`);
  assert.ok(!text.includes(NOVA.profile.look.slice(0, 30)), "look must not leak");
  assert.ok(!text.includes(NOVA.profile.method.slice(0, 30)), "method must not leak");
  assert.doesNotMatch(text, /price|\$\d|_usd|cents/i);
});

test("an agent without a soul still has a full profile, with soul null", async () => {
  const t = await testEnv();
  setPersonasForTests([NOVA]);
  const res = await t.api("GET", "/api/agents/nova-seo");
  assert.equal(res.status, 200);
  assert.equal(res.body.agent.soul, null);
  assert.equal(res.body.agent.name, "Nova");
  assert.equal(soulView(NOVA), null);
  assert.equal(soulMarkdown(NOVA), null);
});

test("a soul without its essence is not shown, and extra fields are dropped", () => {
  const half = { ...NOVA, profile: { ...NOVA.profile, soul: { ...SOUL, essence: "  " } } } as Persona;
  assert.equal(soulView(half), null);
  const extra = { ...NOVA, profile: { ...NOVA.profile, soul: { ...SOUL, secret: "x", values: [" Pages  that\nanswer ", ""] } } } as unknown as Persona;
  const v = soulView(extra)!;
  assert.ok(!("secret" in v));
  assert.deepEqual(v.values, ["Pages that answer"]);
});

test("GET /agents/:id/soul.md returns the soul as markdown", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/agents/nova-seo/soul.md");
  assert.equal(res.status, 200);
  assert.equal(res.res.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.equal(res.res.headers.get("x-content-type-options"), "nosniff");
  assert.match(res.res.headers.get("cache-control") ?? "", /^public, max-age=60/);
  const md = res.body as string;
  // The same headings as the training template (packs/shared/train/soul.md); "How I talk" lives in personality.md.
  assert.ok(md.startsWith("# Nova, SEO strategist\n\n## Who I am\n\nI am the strategist who asks what you sell"), md.slice(0, 80));
  const headings = ["## Who I am", "## How I think", "## What I care about", "## My habits", "## When we disagree", "## Off the clock"];
  for (const h of headings) assert.ok(md.includes(`\n${h}\n`), `missing ${h}`);
  assert.deepEqual(headings.map(h => md.indexOf(h)), headings.map(h => md.indexOf(h)).sort((a, b) => a - b), "sections in reading order");
  assert.ok(!md.includes("How I talk") && !md.includes("Let's win one search"), "the voice is not in soul.md");
  assert.ok(md.includes("- I read the top five results before I write a word\n"));
  assert.ok(md.includes("https://agents.test/agents/nova-seo"));
  for (const leak of [NOVA.profile.look.slice(0, 30), NOVA.profile.method.slice(0, 30), "seo-strategist"]) assert.ok(!md.includes(leak));
  assert.ok(!md.includes("\r"), "LF line endings");
});

test("soul.md is a plain 404 for an agent without a soul or an unknown agent, and only that exact path is served", async () => {
  const t = await testEnv();
  setPersonasForTests([NOVA]);
  const none = await t.api("GET", "/agents/nova-seo/soul.md");
  assert.equal(none.status, 404);
  assert.match(none.res.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(none.body, /Nova has no soul\.md yet/);
  const unknown = await t.api("GET", "/agents/no-such-agent/soul.md");
  assert.equal(unknown.status, 404);
  assert.match(unknown.body, /could not find that agent/);
  // Look-alike paths are not the soul route: they fall through like any other page address.
  setPersonasForTests([NOVA_SOUL]);
  assert.equal((await t.api("GET", "/agents/nova-seo/soul.md")).status, 200);
  assert.equal((await t.api("GET", "/agents/nova-seo/soulXmd")).status, 404);
  assert.equal((await t.api("GET", "/agents/nova-seo/soul.md/more")).status, 404);
  assert.equal((await t.api("POST", "/agents/nova-seo/soul.md")).status, 405);
});

test("splitVoice pulls the closing example line out of how I talk", () => {
  assert.deepEqual(splitVoice(SOUL.voice), { text: "Plain and warm, with short sentences. I say things like:", example: "Let's win one search before we chase ten." });
  assert.deepEqual(splitVoice("Dry and exact. “Show me the numbers first.”"), { text: "Dry and exact.", example: "Show me the numbers first." });
  // A quote in the middle stays in the text.
  const mid = "I call it \"the one search rule\" and I use it every day.";
  assert.deepEqual(splitVoice(mid), { text: mid, example: null });
  assert.deepEqual(splitVoice("Plain words, no quote."), { text: "Plain words, no quote.", example: null });
});

// ---------- Featured agents and areas ----------

const ROSTER: Persona[] = [
  agent("mia-ads", "Mia", "marketing", 1),
  agent("max-email", "Max", "marketing", 2),
  agent("mo-social", "Mo", "marketing", 3),
  agent("eve-code", "Eve", "engineering", 40),
  agent("eli-code", "Eli", "engineering", 10),
  agent("dan-data", "Dan", "data", 50),
  agent("dee-design", "Dee", "design", 60),
  agent("sal-sales", "Sal", "sales", 5),
  agent("lea-teach", "Lea", "learning", 70),
  agent("cal-content", "Cal", "content", 4),
];

test("pickFeatured takes the best agent from each area, in the showcase order, then fills with the next best", () => {
  const ids = (n: number) => pickFeatured(ROSTER, n).map(p => p.id);
  // Marketing first (Mia, the lowest sort), then code (Eli beats Eve on sort), data, design, sales, then content.
  assert.deepEqual(ids(6), ["mia-ads", "eli-code", "dan-data", "dee-design", "sal-sales", "cal-content"]);
  // Every area with an agent once (learning comes last in the order), then the best of the rest.
  assert.deepEqual(ids(9), ["mia-ads", "eli-code", "dan-data", "dee-design", "sal-sales", "cal-content", "lea-teach", "max-email", "mo-social"]);
  assert.deepEqual(ids(1), ["mia-ads"]);
  // Stable: the input order does not matter.
  assert.deepEqual(pickFeatured([...ROSTER].reverse(), 6).map(p => p.id), ids(6));
  // Every area is somewhere in the order.
  assert.equal(new Set(FEATURED_AREA_ORDER).size, 14);
});

test("GET /api/agents?featured=6 shows variety and counts every live agent", async () => {
  const t = await testEnv();
  setPersonasForTests([...ROSTER, agent("ray-data", "Ray", "data", 0), { ...agent("off-hidden", "Off", "design", 0), status: "hidden" }]);
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/api/agents?featured=6");
  assert.equal(res.status, 200);
  assert.match(res.res.headers.get("cache-control") ?? "", /^public, max-age=60/);
  assert.equal(res.body.total, 11); // the 10 above plus Ray; Off is hidden
  const areas = res.body.agents.map((a: any) => a.area);
  assert.deepEqual(areas, ["marketing", "engineering", "data", "design", "sales", "content"]);
  assert.equal(new Set(areas).size, 6, "one agent per area");
  assert.equal(res.body.agents[2].id, "ray-data"); // sort 0 wins data
  assert.ok(!res.body.agents.some((a: any) => a.id === "off-hidden"));
  assert.doesNotMatch(JSON.stringify(res.body), /price|\$\d|_usd|cents/i);

  for (const bad of ["0", "13", "two", "1.5"]) {
    const r = await t.api("GET", `/api/agents?featured=${bad}`);
    assert.equal(r.status, 400, bad);
    assert.equal(r.body.error.code, "invalid_featured");
  }
});

test("area chips list the newer areas (code, data, design, teaching) when they have agents", async () => {
  const t = await testEnv();
  setPersonasForTests(ROSTER);
  await seedPersonas(t.env, "user_ops");
  const res = await t.api("GET", "/api/agents");
  assert.deepEqual(res.body.areas.map((a: any) => [a.id, a.label, a.count]), [
    ["marketing", "Marketing", 3],
    ["content", "Content", 1],
    ["sales", "Sales", 1],
    ["engineering", "Code and engineering", 2],
    ["data", "Data and AI", 1],
    ["design", "Design and media", 1],
    ["learning", "Training and teaching", 1],
  ]);
  const code = await t.api("GET", "/api/agents?area=engineering");
  assert.deepEqual(code.body.agents.map((a: any) => a.id), ["eli-code", "eve-code"]);
  // Areas with no agent get no chip.
  assert.ok(!res.body.areas.some((a: any) => a.id === "finance"));
});
