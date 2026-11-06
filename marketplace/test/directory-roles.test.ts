// Directory: job roles on agent cards and profiles, the ?role= filter, and search by role name and alias.
// Roles come from the real directory/data/roles.json; personas are fixtures with real role ids.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { NOVA } from "./fixtures.ts";
import type { Persona } from "../src/core/types.ts";
import { setPersonasForTests } from "../src/modules/directory/index.ts";
import { getRole } from "../src/modules/directory/roles.ts";
import { houseRoleId, searchPersonas, seedPersonas } from "../src/modules/directory/service.ts";

const SEO: Persona = { ...NOVA, role: "seo-specialist" };
const ADA: Persona = {
  ...NOVA, id: "ada-content", name: "Ada", title: "Content writer", area: "content", sort: 20, role: "content-marketer",
  tagline: "Writes the articles and newsletters your customers read to the end.",
  profile: { ...NOVA.profile, portrait: "/agents/ada-content.webp", outcomes: [{ id: "article", title: "A blog article about your product", deliverable: "One article.", job_type_id: "seo-blog-post" }] },
};
/** A second SEO agent in another area, so the role filter crosses areas. */
const IVO: Persona = {
  ...NOVA, id: "ivo-store-search", name: "Ivo", title: "Store search fixer", area: "ecommerce", sort: 30, role: "seo-specialist",
  tagline: "Gets your product pages found.",
  profile: { ...NOVA.profile, portrait: "/agents/ivo-store-search.webp", outcomes: [{ id: "pages", title: "Product pages that get found", deliverable: "Rewritten product pages.", job_type_id: "landing-page-copy" }] },
};
/** No role: cards and profiles say null. */
const LEO: Persona = { ...NOVA, id: "leo-ads", name: "Leo", title: "Paid ads writer", tagline: "Writes ads and the landing pages they point to.", sort: 40, role: undefined };

beforeEach(() => setPersonasForTests([SEO, ADA, IVO, LEO]));

test("the roles the fixtures use are in the real role list", () => {
  assert.equal(getRole("seo-specialist")?.name, "SEO specialist");
  assert.equal(getRole("content-marketer")?.name, "Content marketer");
  assert.ok(getRole("seo-specialist")!.aliases.includes("keyword research"));
});

test("agent cards and the profile carry the role as { id, name }, or null", async () => {
  const t = await testEnv();
  const list = await t.api("GET", "/api/agents");
  assert.equal(list.status, 200);
  const byId = Object.fromEntries(list.body.agents.map((a: any) => [a.id, a]));
  assert.deepEqual(byId["nova-seo"].role, { id: "seo-specialist", name: "SEO specialist" });
  assert.deepEqual(byId["ada-content"].role, { id: "content-marketer", name: "Content marketer" });
  assert.equal(byId["leo-ads"].role, null);
  assert.equal(list.body.role, null, "no role filter, no role heading");

  const profile = await t.api("GET", "/api/agents/nova-seo");
  assert.deepEqual(profile.body.agent.role, { id: "seo-specialist", name: "SEO specialist" });
  for (const r of profile.body.related) assert.ok("role" in r);
  assert.equal((await t.api("GET", "/api/agents/leo-ads")).body.agent.role, null);
});

test("seeded rows keep their role from the data files, and an unknown role id shows as null", async () => {
  const t = await testEnv();
  await seedPersonas(t.env, "user_ops");
  assert.equal(houseRoleId("nova-seo"), "seo-specialist");
  assert.equal(houseRoleId("leo-ads"), undefined);
  const profile = await t.api("GET", "/api/agents/ada-content");
  assert.deepEqual(profile.body.agent.role, { id: "content-marketer", name: "Content marketer" });
  const list = await t.api("GET", "/api/agents?role=seo-specialist");
  assert.deepEqual(list.body.agents.map((a: any) => a.id), ["nova-seo", "ivo-store-search"]);

  // The data files change after a seed: the role follows them without a reseed.
  setPersonasForTests([{ ...SEO, role: "not-a-real-role" }, ADA, IVO, LEO]);
  assert.equal((await t.api("GET", "/api/agents/nova-seo")).body.agent.role, null);
});

test("?role= lists the agents in that role across areas, with the role's name and summary", async () => {
  const t = await testEnv();
  const res = await t.api("GET", "/api/agents?role=seo-specialist");
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.agents.map((a: any) => a.id), ["nova-seo", "ivo-store-search"]);
  assert.equal(res.body.total, 2);
  const role = getRole("seo-specialist")!;
  assert.deepEqual(res.body.role, { id: role.id, name: role.name, department: role.department, summary: role.summary });
  // The area chips stay, counting the agents in this role.
  const chips = Object.fromEntries(res.body.areas.map((a: any) => [a.id, a.count]));
  assert.deepEqual(chips, { marketing: 1, content: 0, ecommerce: 1 });

  const inArea = await t.api("GET", "/api/agents?role=seo-specialist&area=ecommerce");
  assert.deepEqual(inArea.body.agents.map((a: any) => a.id), ["ivo-store-search"]);
  assert.equal(inArea.body.total, 2, "total counts the role across areas, like the All chip");

  const searched = await t.api("GET", "/api/agents?role=seo-specialist&q=store");
  assert.deepEqual(searched.body.agents.map((a: any) => a.id), ["ivo-store-search"]);

  const unknown = await t.api("GET", "/api/agents?role=astronaut");
  assert.equal(unknown.status, 400);
  assert.equal(unknown.body.error.code, "unknown_role");
  assert.match(unknown.body.error.message, /job role/);
});

test("search finds agents by their role's name and its aliases", async () => {
  const t = await testEnv();
  // "keyword research" is an alias of SEO specialist; no agent's name, title, tagline or outcome says it.
  const alias = await t.api("GET", `/api/agents?q=${encodeURIComponent("keyword research")}`);
  assert.deepEqual(alias.body.agents.map((a: any) => a.id), ["nova-seo", "ivo-store-search"]);
  // "Content marketer" is ADA's role name, not her title.
  const name = await t.api("GET", `/api/agents?q=${encodeURIComponent("content marketer")}`);
  assert.deepEqual(name.body.agents.map((a: any) => a.id), ["ada-content"]);
  assert.deepEqual((await t.api("GET", "/api/agents?q=editorial%20calendar")).body.agents.map((a: any) => a.id), ["ada-content"]);
  // Every word must still match somewhere: a role alias does not widen a search to everyone.
  assert.deepEqual((await t.api("GET", `/api/agents?q=${encodeURIComponent("keyword newsletter")}`)).body.agents, []);
});

test("a role name match ranks with the title; an alias match ranks with the tagline", () => {
  const title = { ...LEO, id: "zed-specialist", name: "Zed", title: "SEO specialist", sort: 99, role: undefined };
  // Both match "seo specialist" at the top rank (IVO by role name, Zed by title), so sort decides.
  assert.deepEqual(searchPersonas([title, IVO], "seo specialist").map(p => p.id), ["ivo-store-search", "zed-specialist"]);
  // A tagline match and an alias match share a rank; a name or title match still comes first.
  const named = { ...LEO, id: "organic-sam", name: "Sam", title: "Organic search lead", sort: 98, role: undefined };
  assert.deepEqual(searchPersonas([IVO, named], "organic search").map(p => p.id), ["organic-sam", "ivo-store-search"]);
});
