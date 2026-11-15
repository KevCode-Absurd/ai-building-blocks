// knowledge/ecommerce/formats.json and moments.json: the creative format library and the buying-moments calendar.
// Ids are unique, every format points at a real skill folder, and every entry carries the fields the guide reads.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../knowledge/ecommerce/", import.meta.url);
const load = (name: string) => JSON.parse(readFileSync(new URL(name, ROOT), "utf8"));
const FORMATS = load("formats.json");
const MOMENTS = load("moments.json");

const FORMAT_FIELDS = ["id", "name", "medium", "what", "works_when", "needs", "insight_fit", "risk", "skill", "effort", "example_hook_shape"];
const MOMENT_FIELDS = ["id", "name", "market", "regions", "when", "lead_time_days", "buyers", "categories", "angle", "watch_out", "source"];
const skillExists = (slug: string) => existsSync(new URL(`skills/${slug}/SKILL.md`, ROOT));
const unique = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

test("formats: unique ids, required fields, allowed values", () => {
  const formats: any[] = FORMATS.formats;
  assert.ok(formats.length >= 35, `about 40 formats, got ${formats.length}`);
  assert.deepEqual(unique(formats.map(f => f.id)), []);
  const insights = new Set<string>(FORMATS.insight_fit_values);
  for (const f of formats) {
    for (const k of FORMAT_FIELDS) assert.ok(f[k] !== undefined && f[k] !== "", `${f.id}: missing ${k}`);
    assert.ok(["static", "carousel", "video"].includes(f.medium), `${f.id}: medium ${f.medium}`);
    assert.ok(["low", "medium", "high"].includes(f.effort), `${f.id}: effort ${f.effort}`);
    assert.ok(Array.isArray(f.insight_fit) && f.insight_fit.length > 0, `${f.id}: insight_fit`);
    for (const i of f.insight_fit) assert.ok(insights.has(i), `${f.id}: unknown insight_fit "${i}"`);
  }
  for (const m of ["static", "carousel", "video"]) assert.ok(formats.some(f => f.medium === m), `no ${m} formats`);
});

test("formats: every skill and pair_with slug is a real skill folder", () => {
  for (const f of FORMATS.formats) {
    assert.ok(skillExists(f.skill), `${f.id}: no skill folder ${f.skill}`);
    for (const s of f.pair_with ?? []) assert.ok(skillExists(s), `${f.id}: no pair_with skill folder ${s}`);
  }
});

test("formats: how_to_pick has 4 to 6 rules", () => {
  const rules: string[] = FORMATS.how_to_pick;
  assert.ok(rules.length >= 4 && rules.length <= 6, `got ${rules.length}`);
  for (const r of rules) assert.ok(typeof r === "string" && r.length > 20);
});

test("moments: unique ids, required fields, both markets", () => {
  const moments: any[] = MOMENTS.moments;
  assert.ok(moments.length >= 35, `about 40 moments, got ${moments.length}`);
  assert.deepEqual(unique(moments.map(m => m.id)), []);
  for (const m of moments) {
    for (const k of MOMENT_FIELDS) assert.ok(m[k] !== undefined && m[k] !== "", `${m.id}: missing ${k}`);
    assert.ok(["IN", "US"].includes(m.market), `${m.id}: market ${m.market}`);
    assert.ok(Array.isArray(m.regions) && m.regions.length > 0, `${m.id}: regions`);
    assert.ok(Array.isArray(m.categories) && m.categories.length > 0, `${m.id}: categories`);
    assert.ok(Number.isInteger(m.lead_time_days) && m.lead_time_days > 0, `${m.id}: lead_time_days`);
    for (const k of ["source", "custom_source"]) if (m[k] !== undefined) assert.match(m[k], /^https:\/\//, `${m.id}: ${k} is a URL`);
  }
  for (const market of ["IN", "US"]) assert.ok(moments.some(m => m.market === market), `no ${market} moments`);
});
