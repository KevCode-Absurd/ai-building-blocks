// Experts module: public expert profiles, share links and first-touch attribution, and the onboarding checklist.
// A profile is public only for an approved expert with a live agent. Share visits, sign-ups and agent downloads are
// counted; the only thing stored about a visitor is the referring expert on their user row.
import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

const OPS = new URL("../src/modules/ops/service.ts", import.meta.url).href;
const EVAL = new URL("../src/modules/evaluation/service.ts", import.meta.url).href;
const realOps = await import(`${OPS}?real`);
const realEval = await import(`${EVAL}?real`);
mock.module(OPS, { exports: { ...realOps, notifyOps: async () => {} } });
mock.module(EVAL, { exports: { ...realEval, winRates: async () => [] } });

const { testEnv } = await import("./helpers.ts");
const { syncExpertPersona } = await import("../src/modules/experts/service.ts");
const { clearShellCache } = await import("../src/pages.ts");

type T = Awaited<ReturnType<typeof testEnv>>;

const SHELL = `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Old</title></head><body><div id="app"></div></body></html>`;
const ASSETS = { fetch: async (req: Request) => new URL(req.url).pathname === "/" ? new Response(SHELL, { headers: { "content-type": "text/html" } }) : new Response("missing", { status: 404 }) };
const BROWSER = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0 Safari/537.36" };

beforeEach(() => clearShellCache());

async function approvedExpert(t: T, user: string, name = "Maya Patel", areas = ["marketing"]) {
  const res = await t.api("POST", "/api/experts/apply", {
    user, email: `${user}@example.com`, body: {
      display_name: name, headline: "Conversion copywriter for SaaS founders", areas, job_types: ["landing-page-copy"],
      experience: "Eight years writing landing pages and launch emails for software companies.",
      claims: [{ text: "Wrote the launch page for a scheduling app", evidence_url: "https://example.com/case" }],
      sample_links: [], country: "India", agree: true,
    },
  });
  await t.makeOps("ops_1");
  await t.api("POST", `/api/experts/${res.body.expert.id}/review`, { user: "ops_1", body: { decision: "approve" } });
  const [persona] = await t.sql("SELECT id FROM personas WHERE expert_id = ?", res.body.expert.id);
  const [profile] = await t.sql("SELECT slug FROM expert_profiles WHERE expert_id = ?", res.body.expert.id);
  return { expertId: res.body.expert.id as string, personaId: persona.id as string, slug: profile.slug as string, user };
}

async function goLive(t: T, e: { expertId: string; personaId: string }, agentId = `agt_${e.expertId}`) {
  const now = new Date().toISOString();
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, 'expert', ?, ?, 'landing-page-copy', 'Landing pages', 'live', 1, ?, ?)", agentId, e.expertId, e.personaId, now, now);
  await syncExpertPersona(t.env, e.expertId);
}

test("approving an expert gives them a stable profile slug", async () => {
  const t = await testEnv();
  const a = await approvedExpert(t, "user_a");
  const b = await approvedExpert(t, "user_b");
  assert.equal(a.slug, "maya-patel");
  assert.equal(b.slug, "maya-patel-2", "a second expert with the same name gets the next free slug");
});

test("a profile is public only for an approved expert with a live agent", async () => {
  const t = await testEnv();
  const e = await approvedExpert(t, "user_a");
  assert.equal((await t.api("GET", `/api/expert-profiles/${e.slug}`)).status, 404, "no live agent yet");

  await goLive(t, e);
  const res = await t.api("GET", `/api/expert-profiles/${e.slug}`);
  assert.equal(res.status, 200);
  const p = res.body.profile;
  assert.equal(p.name, "Maya Patel");
  assert.equal(p.headline, "Conversion copywriter for SaaS founders");
  assert.match(p.bio, /^Eight years writing/);
  assert.equal(p.portrait, "/agents/expert-default.webp");
  assert.deepEqual(p.areas, [{ id: "marketing", label: "Marketing" }]);
  assert.equal(p.agents.length, 1);
  assert.equal(p.agents[0].href, `/agents/${e.personaId}`);
  assert.equal(p.agents[0].title, "Landing page copy");
  assert.ok(!JSON.stringify(p).includes("user_a@example.com"), "no email on the public profile");

  // Pausing the expert takes the page down.
  await t.api("POST", `/api/experts/${e.expertId}/review`, { user: "ops_1", body: { decision: "pause", note: "Checking a complaint." } });
  assert.equal((await t.api("GET", `/api/expert-profiles/${e.slug}`)).status, 404);

  // A retired agent also takes it down.
  const f = await approvedExpert(t, "user_c", "Ola Nord");
  await goLive(t, f, "agt_ola");
  assert.equal((await t.api("GET", `/api/expert-profiles/${f.slug}`)).status, 200);
  await t.sql("UPDATE agents SET status = 'retired' WHERE id = 'agt_ola'");
  await syncExpertPersona(t.env, f.expertId);
  assert.equal((await t.api("GET", `/api/expert-profiles/${f.slug}`)).status, 404);
  assert.equal((await t.api("GET", "/api/expert-profiles/no-such-expert")).status, 404);
});

test("the profile page has head tags, crawler copy, boot data and a sitemap entry; no page while it has no agent", async () => {
  const t = await testEnv({ ASSETS } as never);
  const e = await approvedExpert(t, "user_a");
  // Production for the pages (test sign-in only works in the test environment, so the setup runs first).
  t.env.APP_ENV = "production";
  const before = await t.api("GET", `/experts/${e.slug}`);
  assert.equal(before.status, 404);
  assert.equal(before.res.headers.get("x-robots-tag"), "noindex");
  assert.ok(!String((await t.api("GET", "/sitemap.xml")).body).includes(`/experts/${e.slug}`));

  await goLive(t, e);
  clearShellCache();
  const { status, body, res } = await t.api("GET", `/experts/${e.slug}`);
  assert.equal(status, 200);
  assert.equal(res.headers.get("x-robots-tag"), null);
  const html = String(body);
  assert.match(html, /<title>Maya Patel, expert \|/);
  assert.match(html, new RegExp(`<link rel="canonical" href="https://agents\\.test/experts/${e.slug}" />`));
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /"@type":"ProfilePage"/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /<h1>Maya Patel<\/h1>/);
  assert.ok(html.includes(`href="/agents/${e.personaId}"`), "crawler copy links the agent page");
  const boot = JSON.parse(html.match(/<script type="application\/json" id="boot">([\s\S]*?)<\/script>/)![1]);
  assert.deepEqual(boot[`/api/expert-profiles/${e.slug}`], (await t.api("GET", `/api/expert-profiles/${e.slug}`)).body);
  assert.ok(String((await t.api("GET", "/sitemap.xml")).body).includes(`<loc>https://agents.test/experts/${e.slug}</loc>`));
  const robots = String((await t.api("GET", "/robots.txt")).body);
  assert.match(robots, /Allow: \/api\/expert-profiles\//);
  assert.match(robots, /Disallow: \/experts\/apply/);
  assert.match(robots, /Disallow: \/experts\/invite\//);
  assert.doesNotMatch(robots, /Disallow: \/experts\/$/m);

  // The apply and invite pages are app pages, never indexed.
  const apply = await t.api("GET", "/experts/apply");
  assert.equal(apply.status, 200);
  assert.equal(apply.res.headers.get("x-robots-tag"), "noindex");
  const inv = await t.api("GET", `/experts/invite/${"a".repeat(32)}`);
  assert.equal(inv.status, 200);
  assert.equal(inv.res.headers.get("x-robots-tag"), "noindex");
});

test("experts edit their headline and bio within limits; others cannot", async () => {
  const t = await testEnv();
  const e = await approvedExpert(t, "user_a");
  const mine = await t.api("GET", "/api/experts/me/profile", { user: "user_a" });
  assert.equal(mine.status, 200);
  assert.equal(mine.body.profile.edited, false);
  assert.equal(mine.body.profile.public, false);
  assert.equal(mine.body.profile.share.url, `https://agents.test/e/${e.slug}`);

  for (const [body, message] of [
    [{ headline: "Hi", bio: "x".repeat(60) }, /headline/],
    [{ headline: "x".repeat(141), bio: "x".repeat(60) }, /under 140/],
    [{ headline: "Copywriter for software companies", bio: "Too short." }, /short bio/],
    [{ headline: "Copywriter for software companies", bio: "x".repeat(801) }, /under 800/],
    [{ headline: "Copywriter <b>bold</b>", bio: "x".repeat(60) }, /plain text/],
  ] as const) {
    const res = await t.api("POST", "/api/experts/me/profile", { user: "user_a", body });
    assert.equal(res.status, 400);
    assert.match(res.body.error.message, message);
  }
  const bio = "I write landing pages for software companies. I start from customer calls and cut every line that does not earn its place.";
  const saved = await t.api("POST", "/api/experts/me/profile", { user: "user_a", body: { headline: "  Landing pages   for software teams ", bio } });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.profile.headline, "Landing pages for software teams");
  assert.equal(saved.body.profile.bio, bio);
  assert.equal(saved.body.profile.edited, true);

  await goLive(t, e);
  const pub = await t.api("GET", `/api/expert-profiles/${e.slug}`);
  assert.equal(pub.body.profile.headline, "Landing pages for software teams");
  assert.equal(pub.body.profile.bio, bio);

  assert.equal((await t.api("POST", "/api/experts/me/profile", { user: "user_buyer", body: { headline: "x".repeat(10), bio } })).status, 403);
  assert.equal((await t.api("GET", "/api/experts/me/checklist", { user: "user_buyer" })).status, 403);
});

test("a share link counts visits, sets a 90-day first-party cookie, and first touch wins", async () => {
  const t = await testEnv();
  const e = await approvedExpert(t, "user_a");
  const other = await approvedExpert(t, "user_b", "Ola Nord");

  // No live agent yet: the link still works and lands on the home page.
  let res = await t.api("GET", `/e/${e.slug}`, { headers: BROWSER });
  assert.equal(res.status, 302);
  assert.equal(res.res.headers.get("location"), "/");
  const cookie = res.res.headers.get("set-cookie")!;
  assert.match(cookie, new RegExp(`^aib_via=${e.slug}; Max-Age=7776000; Path=/; SameSite=Lax; HttpOnly; Secure$`));

  await goLive(t, e);
  res = await t.api("GET", `/e/${e.slug}`, { headers: BROWSER });
  assert.equal(res.res.headers.get("location"), `/experts/${e.slug}`);

  // The same browser again: not counted, no new cookie.
  res = await t.api("GET", `/e/${e.slug}`, { headers: { ...BROWSER, cookie: `aib_via=${e.slug}` } });
  assert.equal(res.status, 302);
  assert.equal(res.res.headers.get("set-cookie"), null);
  // Another expert's link in a browser that already has a code: counted for them, but the first code stays.
  res = await t.api("GET", `/e/${other.slug}`, { headers: { ...BROWSER, cookie: `aib_via=${e.slug}` } });
  assert.equal(res.res.headers.get("set-cookie"), null);
  // Bots are not counted and get no cookie.
  res = await t.api("GET", `/e/${e.slug}`, { headers: { "user-agent": "Googlebot/2.1" } });
  assert.equal(res.res.headers.get("set-cookie"), null);

  const [a] = await t.sql("SELECT link_visits FROM expert_profiles WHERE expert_id = ?", e.expertId);
  const [b] = await t.sql("SELECT link_visits FROM expert_profiles WHERE expert_id = ?", other.expertId);
  assert.equal(a.link_visits, 2);
  assert.equal(b.link_visits, 1);

  assert.equal((await t.api("GET", "/e/nobody-here", { headers: BROWSER })).status, 404);
});

test("?via= on any page sets the same cookie", async () => {
  const t = await testEnv({ ASSETS } as never);
  const e = await approvedExpert(t, "user_a");
  const res = await t.api("GET", `/agents?via=${e.slug}`, { headers: BROWSER });
  assert.equal(res.status, 200);
  assert.match(res.res.headers.get("set-cookie") ?? "", new RegExp(`^aib_via=${e.slug};`));
  const unknown = await t.api("GET", "/agents?via=not-an-expert", { headers: BROWSER });
  assert.equal(unknown.res.headers.get("set-cookie"), null);
  const [p] = await t.sql("SELECT link_visits FROM expert_profiles WHERE expert_id = ?", e.expertId);
  assert.equal(p.link_visits, 1);
});

test("a sign-up through a share link stores only the referring expert on the new user", async () => {
  const t = await testEnv();
  const e = await approvedExpert(t, "user_a");
  await t.api("GET", "/api/me", { user: "user_old" });
  await t.api("GET", "/api/me", { user: "user_new", headers: { cookie: `aib_via=${e.slug}` } });
  // An existing account is never re-attributed.
  await t.api("GET", "/api/me", { user: "user_old", headers: { cookie: `aib_via=${e.slug}` } });
  // An unknown code attributes nothing.
  await t.api("GET", "/api/me", { user: "user_stray", headers: { cookie: "aib_via=nobody" } });
  const rows = await t.sql("SELECT id, referred_by_expert FROM users WHERE id IN ('user_new', 'user_old', 'user_stray') ORDER BY id");
  assert.deepEqual(rows.map(r => [r.id, r.referred_by_expert]), [["user_new", e.expertId], ["user_old", null], ["user_stray", null]]);
  const ev = await t.sql("SELECT data FROM events WHERE entity = 'user' AND entity_id = 'user_new'");
  assert.ok(!ev.some(r => r.data.includes(e.expertId)), "the referral is not copied into the event log");

  const mine = await t.api("GET", "/api/experts/me/profile", { user: "user_a" });
  assert.equal(mine.body.profile.share.signups, 1);
});

test("agent downloads count for the referring expert, once per agent per browser", async () => {
  const t = await testEnv();
  const e = await approvedExpert(t, "user_a");
  const other = await approvedExpert(t, "user_b", "Ola Nord");
  await goLive(t, e);
  await goLive(t, other, "agt_ola");
  const use = (persona: string, cookie: string, user?: string) => t.api("POST", "/api/share/agent-use", { user, body: { agent: persona }, headers: { ...BROWSER, cookie } });

  let res = await use(e.personaId, `aib_via=${e.slug}`);
  assert.equal(res.status, 200);
  assert.match(res.res.headers.get("set-cookie") ?? "", new RegExp(`^aib_via_used=${e.personaId};`));
  res = await use(e.personaId, `aib_via=${e.slug}; aib_via_used=${e.personaId}`);
  assert.equal(res.res.headers.get("set-cookie"), null, "the same agent in the same browser counts once");
  // Another expert's agent is not theirs to count, and a visitor with no code counts for nobody.
  await use(other.personaId, `aib_via=${e.slug}`);
  await use(e.personaId, "");
  // A signed-in user who came through the link counts without the cookie (another browser).
  await t.api("GET", "/api/me", { user: "user_new", headers: { cookie: `aib_via=${e.slug}` } });
  await use(e.personaId, "", "user_new");

  const [a] = await t.sql("SELECT link_downloads FROM expert_profiles WHERE expert_id = ?", e.expertId);
  const [b] = await t.sql("SELECT link_downloads FROM expert_profiles WHERE expert_id = ?", other.expertId);
  assert.equal(a.link_downloads, 2);
  assert.equal(b.link_downloads, 0);
  const mine = await t.api("GET", "/api/experts/me/profile", { user: "user_a" });
  assert.deepEqual({ ...mine.body.profile.share, url: undefined }, { url: undefined, visits: 0, signups: 1, downloads: 2 });
});

test("the onboarding checklist is worked out from existing data", async () => {
  const t = await testEnv();
  const e = await approvedExpert(t, "user_a");
  const steps = async () => Object.fromEntries((await t.api("GET", "/api/experts/me/checklist", { user: "user_a" })).body.checklist.steps.map((s: { id: string; done: boolean }) => [s.id, s.done]));
  let s = await steps();
  assert.deepEqual(s, { agreement: true, profile: false, interview: false, examples: false, markup: false, test: false, live: false, share: false });

  await t.api("POST", "/api/experts/me/profile", { user: "user_a", body: { headline: "Landing pages for software teams", bio: "I write landing pages for software companies, starting from customer calls." } });
  const now = new Date().toISOString();
  await t.sql("INSERT INTO agents (id, kind, expert_id, persona_id, job_type_id, name, status, created_at, updated_at) VALUES ('agt_1', 'expert', ?, ?, 'landing-page-copy', 'LP', 'draft', ?, ?)", e.expertId, e.personaId, now, now);
  await t.sql("INSERT INTO studio_agents (agent_id, expert_id, playbook, playbook_source, created_at, updated_at) VALUES ('agt_1', ?, '', 'none', ?, ?)", e.expertId, now, now);
  await t.sql(`INSERT INTO studio_examples (id, agent_id, expert_id, title, brief, audience, result, notes, rights, rights_statement, rights_confirmed_at, chars, created_at)
    VALUES ('ex_1', 'agt_1', ?, 'A page', 'Brief', 'Founders', 'Result', '', 'own_work', 'Mine', ?, 10, ?)`, e.expertId, now, now);
  await t.sql("INSERT INTO studio_marks (id, agent_id, passage, reason, created_at) VALUES ('mk_1', 'agt_1', 'Unlock your potential', 'Empty words', ?)", now);
  s = await steps();
  assert.equal(s.profile, true);
  assert.equal(s.examples, true);
  assert.equal(s.markup, true);
  assert.equal(s.interview, false);
  assert.equal(s.live, false);

  await t.sql("UPDATE agents SET status = 'live' WHERE id = 'agt_1'");
  await t.api("GET", `/e/${e.slug}`, { headers: BROWSER });
  s = await steps();
  assert.equal(s.live, true);
  assert.equal(s.share, true);

  // A new agreement version un-ticks the agreement until the expert accepts it.
  await t.sql("UPDATE experts SET agreement_version = 'old' WHERE id = ?", e.expertId);
  assert.equal((await steps()).agreement, false);
  const { AGREEMENT_VERSION } = await import("../src/modules/experts/service.ts");
  assert.equal((await t.api("POST", "/api/experts/me/agreement", { user: "user_a", body: { version: "stale" } })).status, 409);
  assert.equal((await t.api("POST", "/api/experts/me/agreement", { user: "user_a", body: { version: AGREEMENT_VERSION } })).status, 200);
  assert.equal((await steps()).agreement, true);
});
