// The public catalogue API never shows a price: hiring is free. The price band stays in the data (the runner reads it
// to size drafts) but no "price" key and no "$" amount reaches /api/catalogue or /api/catalogue/:id.
// Buyer-written examples (public sample briefs, field help such as "under $1") may name money; they are the buyer's facts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { listJobTypes } from "../src/modules/catalogue/index.ts";

// The real menu, read before testEnv swaps in the fixtures.
const REAL = [...listJobTypes()];
const { testEnv } = await import("./helpers.ts");

/** Every key in a JSON value, at any depth. */
function keys(value: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach(v => keys(v, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) { out.add(k); keys(v, out); }
  return out;
}

const priceKeys = (value: unknown) => [...keys(value)].filter(k => /price|cents|usd|currency|breakdown/i.test(k));
/** A dollar amount such as "$79" or "$ 1,200". A bare "$" can be code, like a Vega-Lite "$schema" in a checklist rule. */
const AMOUNT = /\$\s?\d/;

for (const [name, catalogue] of [["fixtures", undefined], ["the real menu", REAL]] as const) {
  test(`/api/catalogue lists jobs with no price (${name})`, async () => {
    const t = await testEnv({}, catalogue ? { catalogue } : {});
    const res = await t.api("GET", "/api/catalogue");
    assert.equal(res.status, 200);
    assert.ok(res.body.job_types.length >= 2);
    assert.deepEqual(priceKeys(res.body), []);
    // Job names may say "pricing" (a pricing page is a job); what must never show is an amount.
    assert.doesNotMatch(JSON.stringify(res.body.job_types), AMOUNT);
    for (const j of res.body.job_types) assert.deepEqual(Object.keys(j).sort(), ["area", "deliverable", "id", "summary", "title", "turnaround_hours"]);
  });

  test(`/api/catalogue/:id shows one job with no price (${name})`, async () => {
    const t = await testEnv({}, catalogue ? { catalogue } : {});
    const ids = (catalogue ?? listJobTypes()).map(j => j.id);
    for (const id of ids) {
      const res = await t.api("GET", `/api/catalogue/${id}`);
      assert.equal(res.status, 200, id);
      const jt = res.body.job_type;
      assert.deepEqual(priceKeys(res.body), [], id);
      assert.equal(typeof jt.faster_available, "boolean", id);
      assert.equal("baseline_prompt" in jt, false, id);
      assert.ok(jt.sample_briefs.every((b: any) => b.visibility === "public"), id);
      // Outside the buyer's own examples, no money at all.
      const { sample_briefs: _s, spec_fields, ...rest } = jt;
      const fields = spec_fields.map(({ help: _h, ...f }: any) => f);
      assert.doesNotMatch(JSON.stringify({ ...rest, fields }), AMOUNT, id);
      // Our own pricing words in field help ("Base price covers 10") read as job sizes instead.
      assert.doesNotMatch(JSON.stringify(jt), /base price|per order\)|several orders/i, id);
    }
  });
}

test("buyerWords turns our pricing words into job sizes and leaves the buyer's own money alone", async () => {
  const { buyerWords } = await import("../src/modules/catalogue/index.ts");
  assert.equal(buyerWords("Base price covers up to 10."), "One job covers up to 10.");
  assert.equal(buyerWords("Count each one. Base price covers two."), "Count each one. One job covers two.");
  assert.equal(buyerWords("So split bigger builds into several orders."), "So split bigger builds into several jobs.");
  assert.equal(buyerWords("Whole apps (one feature per order)"), "Whole apps (one feature per job)");
  assert.equal(buyerWords("Cost per order, prices and fees you pay."), "Cost per order, prices and fees you pay.");
});

test("request questions show field help without our pricing words", async () => {
  const { LANDING_PAGE } = await import("./fixtures.ts");
  const jt = { ...LANDING_PAGE, spec_fields: LANDING_PAGE.spec_fields.map(f => f.id === "audience" ? { ...f, help: "Base price covers one audience." } : f) };
  const t = await testEnv({}, { catalogue: [jt] });
  await t.grantBeta("user_help");
  const res = await t.api("POST", "/api/requests", { user: "user_help", body: { text: "Landing page copy for a dog grooming app. We want sign-ups.", jobTypeId: jt.id } });
  assert.equal(res.status, 201);
  const audience = res.body.request.questions.find((q: any) => q.field_id === "audience");
  assert.equal(audience?.help, "One job covers one audience.");
  assert.doesNotMatch(JSON.stringify(res.body), /base price/i);
});
