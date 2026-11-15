// Tests for the Meta pipeline transform and paging, with a fake Meta. Run: node --test build-specs/kit/warehouse/
import { test } from "node:test";
import assert from "node:assert/strict";
import { flatten, jobTag, sync } from "./meta-sync.mjs";

const ROW = { date_start: "2026-11-14", account_id: "1", campaign_id: "c", campaign_name: "Spring [job-0007]", adset_id: "s", adset_name: "Broad", ad_id: "a1", ad_name: "Hook A [job-0007]",
  spend: "50.25", impressions: "10000", reach: "8000", frequency: "1.25", clicks: "300", inline_link_clicks: "150",
  actions: [{ action_type: "video_view", value: "2500" }, { action_type: "omni_purchase", value: "3" }, { action_type: "purchase", value: "2" }],
  action_values: [{ action_type: "omni_purchase", value: "180" }], video_thruplay_watched_actions: [{ action_type: "video_view", value: "900" }] };

test("an insights row becomes a flat row with the job tag, purchases and video numbers", () => {
  const r = flatten(ROW, "now");
  assert.equal(r.job_id, "job-0007"); assert.equal(r.spend, 50.25); assert.equal(r.purchases, 3, "omni_purchase wins over purchase");
  assert.equal(r.purchase_value, 180); assert.equal(r.video_3s_views, 2500); assert.equal(r.thruplays, 900); assert.equal(r.add_to_cart, 0);
  assert.equal(jobTag("no tag"), null);
});

test("sync follows paging, groups by day and never puts the token in an error", async () => {
  const pages = { first: { data: [ROW], paging: { next: "page2" } }, page2: { data: [{ ...ROW, date_start: "2026-11-13", ad_id: "a2" }] } };
  const fake = async url => ({ ok: true, json: async () => (url === "page2" ? pages.page2 : pages.first) });
  const byDay = await sync({ token: "SECRET", version: "v99.0", accounts: ["act_1"], days: 2, today: new Date("2026-11-15T12:00:00Z"), fetchImpl: fake, write: false });
  assert.deepEqual(Object.keys(byDay).sort(), ["2026-11-13", "2026-11-14"]);
  const bad = async () => ({ ok: false, status: 400, json: async () => ({ error: { message: "Invalid OAuth access token" } }) });
  await assert.rejects(sync({ token: "SECRET", version: "v99.0", accounts: ["act_1"], fetchImpl: bad, write: false }), e => !String(e.message).includes("SECRET"));
});
