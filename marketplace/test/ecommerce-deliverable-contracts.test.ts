import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { housePersonas } from "../src/modules/directory/index.ts";
import { getRole } from "../src/modules/directory/roles.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";
import { buildPack, oneFileText, packZip, validateRoleKit, type RoleKit } from "../src/modules/packs/build.ts";
import { readZip } from "../src/modules/packs/zip.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const cases = [
  ["meta-media-buyer", "meta-account-audit"],
  ["google-ads-media-buyer", "google-ads-account-audit"],
  ["ad-creative-strategist", "ad-concepts-and-hooks"],
  ["conversion-copywriter", "landing-page-copy"],
  ["cro-specialist", "conversion-research-audit"],
] as const;
const read = (...parts: string[]) => readFileSync(path.join(ROOT, ...parts), "utf8");
const skillText = (role: string, slug: string) => read("packs", "roles", role, "skills", slug, "SKILL.md");
function kitFor(role: string): RoleKit {
  const folder = path.join(ROOT, "packs", "roles", role);
  const files: Record<string, string> = {};
  function walk(dir: string, prefix = "") {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const rel = `${prefix}${item.name}`;
      if (item.isDirectory()) walk(path.join(dir, item.name), `${rel}/`);
      else if (/\.(md|json)$/.test(rel)) files[rel] = readFileSync(path.join(dir, item.name), "utf8");
    }
  }
  walk(folder);
  const roleMeta = JSON.parse(files["role.json"]);
  delete files["role.json"];
  return { role: roleMeta, files };
}

for (const [role, slug] of cases) test(`${role}: actual skill and MIT attribution survive pack, zip and one-file export`, async () => {
  const persona = housePersonas().find(p => p.role === role && p.vertical === "ecommerce");
  assert.ok(persona, `Missing ecommerce persona for ${role}`);
  const kit = kitFor(role);
  assert.deepEqual(validateRoleKit(kit).errors, []);
  const templates = Object.fromEntries(["AGENTS.md", "WORK-METHOD.md", "README.md", "LICENSE.md"].map(p => [p, read("packs", "shared", p)]));
  // Real role kit; curated-library integrity is covered by ecommerce-media-buyers.test.ts.
  const pack = await buildPack({ persona, role: getRole(role), kit, jobTypes: listJobTypes(), templates, options: { kind: "agent", version: "2026.11.17", updated: "2026-11-17" } });
  const skillPath = `skills/${slug}/SKILL.md`;
  const skill = pack.files.find(f => f.path === skillPath);
  assert.ok(skill);
  for (const text of [skill.content, pack.files.find(f => f.path === "skills.md")!.content]) {
    assert.match(text, /Copyright \(c\) 2026 Toprank Contributors/);
    assert.match(text, /THE SOFTWARE IS PROVIDED "AS IS"/);
    assert.match(text, /deed0436d0c68cbc20a78523fffc67edd12aa25c/);
  }
  const zip = await readZip(await packZip(pack));
  const zipped = zip.find(f => f.path === `${persona.id}/${skillPath}`);
  assert.ok(zipped);
  assert.equal(new TextDecoder().decode(zipped.data), skill.content);
  const portable = oneFileText(pack);
  assert.match(portable, /===== FILE: skills\.md =====/);
  assert.match(portable, /Copyright \(c\) 2026 Toprank Contributors/);
  assert.match(portable, /THE SOFTWARE IS PROVIDED "AS IS"/);
  assert.match(portable, /deed0436d0c68cbc20a78523fffc67edd12aa25c/);
});

for (const [role, slug] of cases.slice(0, 2)) test(`${role}: ecommerce economics recalculate and attribution gaps stay unresolved`, () => {
  const text = skillText(role, slug);
  const worked = text.split("## Ecommerce arithmetic check")[1].split("## Method attribution")[0];
  const values = Object.fromEntries([...worked.matchAll(/^\| ([^|]+?) \| ([\d.]+) \|$/gm)].map(m => [m[1], Number(m[2])]));
  assert.equal(values["Attributed purchase value"] / values["Attributed purchases"], values["Value per order"]);
  assert.equal(values["Eligible spend"] / values["Attributed purchases"], values.CPA);
  assert.equal(values["Attributed purchase value"] / values["Eligible spend"], values.ROAS);
  const contribution = values["Value per order"] - values["Landed COGS per order"] - values["Fulfillment per order"] - values["Payment fees per order"] - values["Expected returns/refunds per order"];
  assert.equal(contribution, values["Contribution before ads per order"]);
  assert.equal(Number((values["Value per order"] / contribution).toFixed(2)), values["Break-even ROAS (rounded)"]);
  assert.match(text, /count mismatch is an unresolved difference|Count gaps alone do not prove duplication/);
  assert.match(text, /not a measured duplicate count|does not establish 111 duplicates/);
  assert.match(text, /rows\/pages fetched/);
  assert.match(text, /A top-N extract is a partial audit/);
  assert.match(text, /before\/after improvement alone is not a causal lift estimate/);
  assert.doesNotMatch(text, /ROAS of 3\.1 is closer to 2\.2|true ROAS of 1\.4|1\.8 purchases per order|Credit claimed for free demand/);
});

test("creative, landing and CRO distinguish finished artifacts from proposals and causal claims", () => {
  const creative = skillText("ad-creative-strategist", "ad-concepts-and-hooks");
  assert.match(creative, /blocked by missing proof/);
  assert.match(creative, /Do not call a brief a finished creative/);
  assert.match(creative, /not to one hook or format in isolation/);
  const landing = skillText("conversion-copywriter", "landing-page-copy");
  assert.match(landing, /paired change cannot isolate which component caused an outcome/);
  assert.match(landing, /deliver the implemented page and editable source/);
  assert.match(landing, /not a deployed page or a verified store transaction/);
  const cro = skillText("cro-specialist", "conversion-research-audit");
  assert.match(cro, /pass\/fail\/blocked status/);
  assert.match(cro, /smoke test proves behavior, not sales uplift/);
});
