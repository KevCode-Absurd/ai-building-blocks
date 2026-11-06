// Directory: mega agents. A mega agent leads a team of channel specialists (packs/mega/traction); cards say so and the
// profile lists the team. Everyone else has mega null and an empty team.
import { test, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";
import { setPersonasForTests } from "../src/modules/directory/index.ts";
import { seedPersonas } from "../src/modules/directory/service.ts";
import { megaCard, megaTeam, setMegaKitForTests, type MegaKitData } from "../src/modules/directory/mega.ts";
import traction from "../src/modules/directory/data/mega-traction.json" with { type: "json" };

const SHIPPED = traction as MegaKitData;
const MEGA: Persona = {
  ...NOVA, id: "tess-traction-saas", name: "Tess", title: "Traction lead for SaaS", area: "marketing", sort: 5, role: "growth-marketer",
  tagline: "Finds the channel that brings your first customers.", mega: { kit: "traction", variant: "saas" },
  profile: { ...NOVA.profile, portrait: "/agents/tess-traction-saas.webp" },
};

beforeEach(() => { setPersonasForTests([NOVA, MEGA]); setMegaKitForTests(SHIPPED); });
after(() => setMegaKitForTests(SHIPPED));

test("the shipped traction team has the 19 channels in the book's order", () => {
  assert.equal(SHIPPED.channels.length, 19);
  assert.equal(SHIPPED.channels[0].id, "creators-and-newsletters");
  assert.equal(SHIPPED.channels[18].id, "community-building");
  assert.equal(new Set(SHIPPED.channels.map(c => c.id)).size, 19);
});

test("cards carry mega { variant, team_size } for a mega agent and null for everyone else", async () => {
  const t = await testEnv();
  const list = await t.api("GET", "/api/agents");
  const byId = Object.fromEntries(list.body.agents.map((a: any) => [a.id, a]));
  assert.deepEqual(byId["tess-traction-saas"].mega, { variant: "saas", team_size: 19 });
  assert.equal(byId["nova-seo"].mega, null);
  // Mega agents are in the normal list and its counts, with no filter of their own.
  assert.equal(list.body.total, 2);
  const featured = await t.api("GET", "/api/agents?featured=2");
  assert.ok(featured.body.agents.every((a: any) => "mega" in a));
});

test("the profile lists the team: id, name and the job line, which falls back to the channel name", async () => {
  const t = await testEnv();
  const res = await t.api("GET", "/api/agents/tess-traction-saas");
  assert.equal(res.status, 200);
  const team = res.body.agent.team;
  assert.equal(team.length, 19);
  assert.deepEqual(Object.keys(team[0]).sort(), ["id", "job", "name"]);
  assert.deepEqual(team.map((m: any) => m.id), SHIPPED.channels.map(c => c.id));
  for (const m of team) assert.ok(m.job.length > 0, m.id);
  assert.deepEqual(res.body.agent.mega, { variant: "saas", team_size: 19 });
  const plain = await t.api("GET", "/api/agents/nova-seo");
  assert.deepEqual(plain.body.agent.team, []);
  assert.equal(plain.body.agent.mega, null);
});

test("a channel's job is its specialist file's description once the kit has one", async () => {
  setMegaKitForTests({ kit: "traction", channels: [
    { id: "sales", name: "Sales (outbound and founder-led)", job: "Hand me outbound work: target lists, first emails and call scripts." },
    { id: "trade-shows", name: "Trade shows", job: null },
    { id: "email-marketing", name: "Email marketing", job: "   " },
  ] });
  const t = await testEnv();
  const res = await t.api("GET", "/api/agents/tess-traction-saas");
  assert.deepEqual(res.body.agent.team, [
    { id: "sales", name: "Sales (outbound and founder-led)", job: "Hand me outbound work: target lists, first emails and call scripts." },
    { id: "trade-shows", name: "Trade shows", job: "Trade shows" },
    { id: "email-marketing", name: "Email marketing", job: "Email marketing" },
  ]);
  assert.deepEqual(res.body.agent.mega, { variant: "saas", team_size: 3 });
});

test("seeded rows keep mega from the data files; an unknown kit or variant is not a mega agent", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  assert.deepEqual((await t.api("GET", "/api/agents/tess-traction-saas")).body.agent.mega, { variant: "saas", team_size: 19 });
  const odd = { ...MEGA, mega: { kit: "traction", variant: "space" } } as unknown as Persona;
  assert.equal(megaCard(odd), null);
  assert.deepEqual(megaTeam(odd), []);
  assert.equal(megaCard({ ...MEGA, mega: { kit: "unknown", variant: "saas" } } as unknown as Persona), null);
});
