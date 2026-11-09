// Every real job type in src/modules/catalogue/data must pass validation, with unique ids across files.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateJobType } from "../src/modules/catalogue/schema.ts";

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "modules", "catalogue", "data");

test("catalogue data files are valid", () => {
  const seen = new Map<string, string>();
  for (const file of readdirSync(DATA).filter(f => f.endsWith(".json"))) {
    const list = JSON.parse(readFileSync(path.join(DATA, file), "utf8"));
    assert.ok(Array.isArray(list), `${file} must be an array`);
    for (const jt of list) {
      const r = validateJobType(jt);
      assert.ok(r.ok, `${file} ${jt?.id}: ${!r.ok ? r.errors.join("; ") : ""}`);
      assert.ok(!seen.has(jt.id), `${jt.id} appears in both ${seen.get(jt.id)} and ${file}`);
      seen.set(jt.id, file);
    }
  }
});

// The Grounded Job Protocol fields (DESIGN.md): every job type carries them, and they make sense for its family.
const allJobTypes = () => readdirSync(DATA).filter(f => f.endsWith(".json")).flatMap(f => JSON.parse(readFileSync(path.join(DATA, f), "utf8")));
const CREATIVE = new Set(["web_page", "ad_creative", "copy", "email"]);

test("every job type declares its family, context, gates, craft rubric and default mode", () => {
  for (const jt of allJobTypes()) {
    for (const key of ["family", "context_requirements", "gates", "craft_rubric", "mode_default"]) assert.ok(jt[key] !== undefined, `${jt.id}: missing ${key}`);
    assert.equal(jt.craft_rubric.reduce((n: number, c: { weight: number }) => n + c.weight, 0), 100, `${jt.id}: craft weights`);
    for (const gate of ["Facts trace to a source", "No invented numbers", "Access respected", "No fillable placeholders"]) {
      assert.ok(jt.gates.some((g: string) => g.startsWith(gate)), `${jt.id}: missing the "${gate}" gate`);
    }
  }
});

test("context requirements fit the family", () => {
  for (const jt of allJobTypes()) {
    const req = new Map(jt.context_requirements.map((c: { id: string; required: boolean }) => [c.id, c.required]));
    if (CREATIVE.has(jt.family)) {
      // The live site, or (for pieces made from the client's own drafts and records) the existing material.
      assert.ok(req.get("site_url") === true || req.get("existing_assets") === true, `${jt.id}: creative jobs need the site or existing assets`);
      assert.ok(req.has("site_url") && req.has("existing_assets"), `${jt.id}: creative jobs name both the site and existing assets`);
      assert.equal(req.get("voice_samples"), true, `${jt.id}: creative jobs need voice samples`);
      if (req.has("competitors")) assert.equal(req.get("competitors"), false, `${jt.id}: competitors are recommended, not required`);
    }
    if (jt.family === "audit") assert.equal(req.get("account_access"), true, `${jt.id}: audits need read access to the real data`);
    if (jt.family === "analysis") assert.equal(req.get("data_export"), true, `${jt.id}: analysis needs the data`);
    if (jt.family === "strategy" || jt.family === "plan") {
      assert.equal(req.get("business_facts"), true, `${jt.id}: strategy needs the business facts`);
      assert.equal(req.get("goals"), true, `${jt.id}: strategy needs the goals`);
    }
  }
});

test("web pages carry the build gates, and the landing page build starts from the live site", () => {
  const web = allJobTypes().filter(jt => jt.family === "web_page");
  assert.ok(web.some(jt => jt.id === "landing-page-build"));
  for (const jt of web) for (const gate of ["nav and footer", "fonts are loaded", "390 px and 1440 px", "primary action works"]) {
    assert.ok(jt.gates.some((g: string) => g.includes(gate)), `${jt.id}: missing the "${gate}" gate`);
  }
  const lpb = web.find(jt => jt.id === "landing-page-build");
  assert.ok(lpb.spec_fields.some((f: { id: string; type: string }) => f.id === "site_url" && f.type === "url"));
  assert.equal(lpb.mode_default, "extend");
});
