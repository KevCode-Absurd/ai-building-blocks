// scripts/map-outcomes.mjs: deterministic scoring, the threshold, and writes that keep the files' formatting.
import { test } from "node:test";
import assert from "node:assert/strict";
import { FIXTURE_JOB_TYPES, NOVA } from "./fixtures.ts";

// A non-literal specifier: the script is plain JavaScript with no type declarations.
const SCRIPT = new URL("../scripts/map-outcomes.mjs", import.meta.url).href;
const load = async (): Promise<any> => import(SCRIPT);

const persona = (outcomes: unknown[]) => ({ ...NOVA, profile: { ...NOVA.profile, outcomes } });

test("importing the script does not run it", async () => {
  const m = await load();
  assert.equal(typeof m.planMappings, "function");
  assert.equal(typeof m.applyMappings, "function");
});

test("an outcome maps to the job type its hint names, and nonsense stays null", async () => {
  const m = await load();
  const p = persona([
    { id: "post", title: "An article that ranks for one search", deliverable: "A 1,500 word article with headings.", job_type_id: null, job_type_hint: "seo blog post" },
    { id: "page", title: "A landing page for your offer", deliverable: "Headline, sections and calls to action for one page.", job_type_id: null, job_type_hint: "landing page copy" },
    { id: "odd", title: "A horoscope for your quarter", deliverable: "Star signs and lucky colours for each month.", job_type_id: null, job_type_hint: "astrology reading" },
    { id: "done", title: "Already mapped", deliverable: "Something already priced by a job type.", job_type_id: "landing-page-copy" },
  ]);
  const { rows, warnings } = m.planMappings([{ file: "personas-x.json", personas: [p] }], FIXTURE_JOB_TYPES);
  assert.deepEqual(warnings, []);
  assert.deepEqual(rows.map((r: any) => [r.outcome, r.job]), [["post", "seo-blog-post"], ["page", "landing-page-copy"], ["odd", null]]);
  assert.ok(rows[0].best.score > rows[0].second.score);
  // Same input, same answer.
  assert.deepEqual(m.planMappings([{ file: "personas-x.json", personas: [p] }], FIXTURE_JOB_TYPES).rows, rows);
});

test("unknown job type ids are reported, not changed", async () => {
  const m = await load();
  const p = persona([{ id: "gone", title: "A job type that was removed", deliverable: "Whatever it used to make for you.", job_type_id: "retired-job" }]);
  const { rows, warnings } = m.planMappings([{ file: "personas-x.json", personas: [p] }], FIXTURE_JOB_TYPES);
  assert.deepEqual(rows, []);
  assert.match(warnings[0], /retired-job/);
});

test("writing sets only job_type_id and keeps the file's formatting", async () => {
  const m = await load();
  const list = [persona([
    { id: "post", title: "An article that ranks for one search", deliverable: "A 1,500 word article.", job_type_id: null, job_type_hint: "seo blog post" },
    { id: "odd", title: "A horoscope for your quarter", deliverable: "Star signs for each month.", job_type_id: null, job_type_hint: "astrology reading" },
  ])];
  const text = JSON.stringify(list, null, 2) + "\n";
  const { rows } = m.planMappings([{ file: "personas-x.json", personas: list }], FIXTURE_JOB_TYPES);
  const out = m.applyMappings(text, rows);
  assert.equal(out.changed, 1);
  const expected = structuredClone(list);
  (expected[0].profile.outcomes[0] as any).job_type_id = "seo-blog-post";
  assert.equal(out.text, JSON.stringify(expected, null, 2) + "\n");
  // Running it again changes nothing.
  assert.equal(m.applyMappings(out.text, rows).changed, 0);
  // CRLF files stay CRLF.
  const crlf = m.applyMappings(text.replace(/\n/g, "\r\n"), rows).text;
  assert.ok(crlf.endsWith("\r\n") && !/[^\r]\n/.test(crlf));
});
