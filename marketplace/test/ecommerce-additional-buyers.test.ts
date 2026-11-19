import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { housePersonas } from "../src/modules/directory/index.ts";
import { getRole, listRoles } from "../src/modules/directory/roles.ts";
import { ECOMMERCE_STAGES } from "../src/modules/directory/team-stages.ts";
import { resolveEcommerceRole } from "../src/modules/directory/ecommerce-context.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";
import { buildPack, packZip, validateRoleKit, type RoleKit } from "../src/modules/packs/build.ts";
import { readZip } from "../src/modules/packs/zip.ts";
import { bestRoute } from "../src/modules/packs/route.ts";
import { checkToolbox, leadAgentOfRole } from "../src/modules/packs/toolbox.ts";
import { verticalBundle } from "../src/modules/knowledge/bundle.ts";
import type { Card, Source, Vertical } from "../src/modules/knowledge/cards.ts";
import { testEnv } from "./helpers.ts";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p: string) => JSON.parse(read(p));
const team = housePersonas().filter(p => p.vertical === "ecommerce");
const cases = [
  { id: "nadiya-reddit-ads", name: "Nadiya", role: "reddit-ads-media-buyer", query: "Reddit commerce media buying", flow: "workflows/reddit-media-buying.md", modules: ["ADC", "AVT", "MCR", "MEA"], process: "reddit-commerce-acquisition", channel: "reddit" },
  { id: "esmee-b2b-commerce-ads", name: "Esmee", role: "linkedin-ads-specialist", query: "LinkedIn wholesale corporate gifting acquisition", flow: "workflows/commerce-wholesale-acquisition.md", modules: ["ADC", "OFF", "MEA", "FIN"], process: "linkedin-commerce-acquisition", channel: "linkedin" },
];
function roleKit(role: string): RoleKit {
  const files: Record<string,string> = {};
  function walk(folder: URL, prefix = "") {
    for (const e of readdirSync(folder, { withFileTypes: true })) {
      if (e.isDirectory()) walk(new URL(`${e.name}/`, folder), `${prefix}${e.name}/`);
      else if (/\.(md|json)$/.test(e.name)) files[prefix+e.name] = readFileSync(new URL(e.name,folder),"utf8");
    }
  }
  walk(new URL(`../packs/roles/${role}/`,import.meta.url));
  const meta = JSON.parse(files["role.json"]); delete files["role.json"];
  return { role: meta, files };
}
const cards = readdirSync(new URL("../knowledge/ecommerce/cards/",import.meta.url)).filter(n=>n.endsWith(".json")).flatMap(n=>json(`knowledge/ecommerce/cards/${n}`)) as Card[];
const bundle = verticalBundle(json("knowledge/ecommerce/vertical.json") as Vertical,cards,json("knowledge/ecommerce/sources.json") as Source[]);

test("new commerce buyers are registered with preserved conditional ownership and selective source scope", () => {
  assert.equal(team.length,81);
  const speedOwners = new Map([
    ["nico-ecommerce-speed", "ecommerce-performance-specialist"],
    ["vera-woocommerce-speed", "wordpress-commerce-performance-specialist"],
    ["hattie-competitor-teardown", "dtc-competitor-teardown"],
  ]);
  assert.equal(team.filter(p => !speedOwners.has(p.id)).length,78);
  for (const [id, role] of speedOwners) assert.equal(team.find(p => p.id === id)?.role,role);
  const org = json("src/modules/directory/data/team-org-chart.json");
  const build = json("build-specs/agents.json");
  for (const c of cases) {
    const p = team.find(p=>p.id===c.id)!;
    assert.equal(p.name,c.name); assert.equal(p.role,c.role);
    assert.equal(leadAgentOfRole(team,c.role)?.id,c.id);
    assert.deepEqual(resolveEcommerceRole(c.id)?.modules,c.modules);
    assert.equal(ECOMMERCE_STAGES.flatMap(s=>s.agents).filter(id=>id===c.id).length,1);
    assert.deepEqual(org.personas.find((r:any)=>r.id===c.id).families,p.team!.families);
    assert.equal(build.find((r:any)=>r.id===c.id).role,c.role);
    for (const code of c.modules) assert.ok(bundle.files[`knowledge/ecommerce/${code}.md`]);
    assert.ok(p.profile.outcomes.every(o=>listJobTypes().some(j=>j.id===o.job_type_id)));
  }
  const jared=team.find(p=>p.id==="jared-performance-marketing")!;
  for (const id of ["lindsey-meta-media-buyer","raymond-google-ads","kelsey-snapchat-ads","zara-tiktok-ads",...cases.map(c=>c.id)]) assert.ok(jared.profile.method.includes(id));
  assert.match(jared.profile.method,/only when the brief explicitly includes Reddit/);
  assert.match(jared.profile.method,/Do not add either channel by default/);
});

for (const c of cases) test(`${c.name} ships the actual commerce workflow, scope limits and valid process`,async()=>{
  const p=team.find(p=>p.id===c.id)!;const kit=roleKit(c.role);const roles=new Set(listRoles().map(r=>r.id));
  assert.deepEqual(validateRoleKit(kit,roles).errors,[]);
  assert.deepEqual(checkToolbox(JSON.parse(kit.files["toolbox.json"]),c.role,Object.keys(kit.files),roles).errors,[]);
  const pack=await buildPack({persona:p,role:getRole(c.role),kit,jobTypes:listJobTypes(),vertical:bundle,options:{kind:"agent",version:"2026.11.17",updated:"2026-11-17"}});
  const flow=pack.files.find(f=>f.path===c.flow)!;assert.ok(flow);
  assert.ok(pack.files.find(f=>f.path==="toolbox.md")!.content.includes(c.flow));
  assert.ok(pack.files.find(f=>f.path==="playbook.md")!.content.includes(c.flow));
  assert.equal(bestRoute(c.query,pack.routes)?.candidate.path,c.flow);
  if(c.channel==="linkedin") {
    const knowledge=pack.files.find(f=>f.path==="knowledge.md")!.content;
    assert.ok(knowledge.indexOf("Merchant applicability") < knowledge.indexOf("## 1. What this role is for"));
    assert.match(knowledge,/workflows\/commerce-wholesale-acquisition\.md/);
    assert.match(knowledge,/retail catalogue does not establish bulk terms/);
    assert.match(knowledge,/Do not use SaaS demo or ARR targets/);
    assert.match(knowledge,/non-commerce clients/);
  }

  assert.match(flow.content,/actual.*capabilit|capabilit.*actual/i);
  assert.match(flow.content,/local.*(?:build|plan)|(?:build|plan).*local/i);
  assert.match(flow.content,/valid.*(?:grant|authorit)|(?:grant|authorit).*valid/i);
  assert.match(flow.content,/fresh readback/);
  assert.match(flow.content,/jobs\/<run-id>\//);
  assert.doesNotMatch(flow.content,/Gehna|B500|guaranteed lift/);
  const zip=await readZip(await packZip(pack));
  assert.equal(new TextDecoder().decode(zip.find(f=>f.path===`${c.id}/${c.flow}`)!.data),flow.content);
  const { validate }=await import(new URL("../build-specs/kit/process.mjs",import.meta.url).href);
  assert.deepEqual(validate(json(`build-specs/processes/${c.process}.json`),team.map(p=>p.id),[c.process]),[]);
});

test("commerce search finds the new channels without replacing the original buyers",async()=>{
  const t=await testEnv();
  for (const [query,id] of [["Reddit ads","nadiya-reddit-ads"],["LinkedIn wholesale gifting","esmee-b2b-commerce-ads"],["TikTok ads","zara-tiktok-ads"],["Google ads","raymond-google-ads"]]) {
    const answer=(await t.api("GET",`/api/agents?vertical=ecommerce&q=${encodeURIComponent(query)}`)).body;
    assert.equal(answer.agents[0]?.id,id,query);
  }
});

test("LinkedIn commerce measures commercial stages and hands quotes to Mei; Reddit avoids invented field constants",()=>{
  const linkedin=roleKit("linkedin-ads-specialist").files[cases[1].flow];
  for(const phrase of ["mei-wholesale-sales","qualified company","quotes","delivered/kept orders","contribution","stock","payment timing"])assert.ok(linkedin.includes(phrase),phrase);
  assert.match(linkedin,/Low cost per lead is not the success criterion/);
  const reddit=roleKit("reddit-ads-media-buyer").files[cases[0].flow];
  assert.match(reddit,/Do not hardcode a microcurrency multiplier or a reporting-lag threshold/);
  assert.match(reddit,/Community membership, subreddit placement and buying intent are different claims/);
});
