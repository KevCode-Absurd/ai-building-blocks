// Evaluation module: rubric judge, policy rules, baseline comparison, blind tests, reviewer API and win rates.
// afterJobDraft (which calls the runner) is tested in evaluation-sampling.test.ts with the runner mocked.
import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv, type TestEnv } from "./helpers.ts";
import { LANDING_PAGE } from "./fixtures.ts";
import { registerFake, type ModelRequest } from "../src/core/models.ts";
import type { RubricCriterion } from "../src/core/types.ts";
import {
  buildFeedback, checkDraft, compareWithBaseline, createBlindTest, evidenceInDraft, majorityPick, scoreRubric, winRates, judgeAgreement,
} from "../src/modules/evaluation/service.ts";
import { knownFrom, placeholdersExpected, runPolicyRules } from "../src/modules/evaluation/policy.ts";
import { extractTag } from "../src/modules/evaluation/prompts.ts";

const BRIEF = LANDING_PAGE.sample_briefs[0].text; // $29/month scheduling app for dog groomers, free trial
const GOOD_DRAFT = [
  "# Book every groom without the text-message back-and-forth",
  "",
  "A $29/month scheduling app for one-person dog grooming shops. Clients pick a time, you get the booking.",
  "",
  "## Stop chasing texts",
  "Clients book themselves from one link, day or night.",
  "",
  "## See your whole week",
  "Every groom, every dog and every note in one calendar.",
  "",
  "## Questions",
  "- Do my clients need an app? No. They book from a link.",
  "- Can I keep my prices? Yes. You set them.",
  "- What if I want to stop? Cancel from your account.",
  "",
  "**Start your free trial**",
].join("\n");
const QUOTE = "Clients book themselves from one link, day or night.";
const RUBRIC = LANDING_PAGE.rubric; // weights 5 (critical), 4, 5 (critical), 3, 3 = 20

let seq = 0;
async function seedJob(t: TestEnv, o: { content?: string; jobTypeId?: string; agentId?: string; brief?: string; spec?: Record<string, unknown>; rubric?: RubricCriterion[] } = {}) {
  seq++;
  await t.grantBeta("user_buyer");
  const [{ org_id }] = await t.sql("SELECT org_id FROM org_members WHERE user_id = 'user_buyer'");
  const jobTypeId = o.jobTypeId ?? LANDING_PAGE.id;
  const agentId = o.agentId ?? `agent_t${seq}`;
  const jobId = `job_t${seq}`, runId = `run_t${seq}`, draftId = `draft_t${seq}`, now = new Date().toISOString();
  await t.sql("INSERT OR IGNORE INTO agents (id, kind, job_type_id, name, status, live_version, created_at, updated_at) VALUES (?, 'house', ?, 'House agent', 'live', 1, ?, ?)", agentId, jobTypeId, now, now);
  await t.sql("INSERT INTO jobs (id, org_id, created_by, status, job_type_id, agent_id, agent_version, title, created_at, updated_at) VALUES (?, ?, 'user_buyer', 'checking', ?, ?, 1, 'Test job', ?, ?)", jobId, org_id, jobTypeId, agentId, now, now);
  await t.sql("INSERT INTO briefs (job_id, request_text, spec, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", jobId, o.brief ?? BRIEF, JSON.stringify(o.spec ?? { audience: "One-person dog grooming shops", goal: "Sign up" }), now, now);
  await t.sql("INSERT INTO rubrics (job_id, criteria, frozen_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", jobId, JSON.stringify(o.rubric ?? RUBRIC), now, now, now);
  await t.sql("INSERT INTO runs (id, job_id, kind, agent_id, agent_version, status, created_at) VALUES (?, ?, 'job', ?, 1, 'succeeded', ?)", runId, jobId, agentId, now);
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, ?, ?, 1, ?, 'markdown', 'fp', ?)", draftId, jobId, runId, o.content ?? GOOD_DRAFT, now);
  return { jobId, agentId, runId, draftId };
}

async function seedBaselineDraft(t: TestEnv, jobId: string, content = "Book grooms online. Try it free.") {
  seq++;
  const runId = `run_b${seq}`, draftId = `draft_b${seq}`, now = new Date().toISOString();
  await t.sql("INSERT INTO runs (id, job_id, kind, status, created_at) VALUES (?, ?, 'baseline', 'succeeded', ?)", runId, jobId, now);
  await t.sql("INSERT INTO drafts (id, job_id, run_id, version, content, format, fingerprint, created_at) VALUES (?, ?, ?, 1, ?, 'markdown', 'fp', ?)", draftId, jobId, runId, content, now);
  return { runId, draftId };
}

/** A rubric judge reply: every criterion passes with a real quote, except the ids in fail (and the ids in skip are left out). */
function judgeReply(rubric: RubricCriterion[], opts: { fail?: string[]; skip?: string[] } = {}) {
  return {
    criteria: rubric.filter(c => !opts.skip?.includes(c.id)).map(c => (
      opts.fail?.includes(c.id) ? { id: c.id, pass: false, evidence: "", note: "Not met." } : { id: c.id, pass: true, evidence: QUOTE, note: "Met." }
    )),
  };
}

// ---------- Rubric judge ----------

test("a good draft passes with the default fakes and writes one rubric and one policy score", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t);
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(out.passed, true, out.feedback);
  assert.equal(out.rubric.score, 1);
  assert.equal(out.rubric.criteria.length, RUBRIC.length);
  for (const c of out.rubric.criteria) assert.ok(GOOD_DRAFT.includes(c.evidence), `evidence for ${c.id} is a quote from the draft`);
  assert.deepEqual(out.policy, { passed: true, flags: [] });
  assert.equal(out.feedback, "");
  const scores = await t.sql("SELECT judge, passed, score FROM scores WHERE draft_id = ? ORDER BY judge", draftId);
  assert.deepEqual(scores.map(s => [s.judge, s.passed]), [["policy", 1], ["rubric", 1]]);
  const events = await t.sql("SELECT type FROM events WHERE entity = 'draft' AND entity_id = ?", draftId);
  assert.deepEqual(events.map(e => e.type), ["draft.checked"]);
  const calls = await t.sql("SELECT purpose FROM model_calls ORDER BY purpose");
  assert.deepEqual(calls.map(c => c.purpose), ["evaluation.policy", "evaluation.rubric"]);
});

test("the fake judge fails a draft that contains FAILCHECK, and the feedback names every failed item", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t, { content: `${GOOD_DRAFT}\n\nFAILCHECK` });
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(out.passed, false);
  assert.equal(out.rubric.score, 0);
  for (const c of RUBRIC) assert.match(out.feedback, new RegExp(`- ${c.id}${c.critical ? " \\(must pass\\)" : ""}:`));
  assert.match(out.feedback, /It needs at least 75%/);
});

test("the judge prompt carries the brief, every criterion and the draft, and avoids the writer's provider", async () => {
  const t = await testEnv();
  const { draftId, runId } = await seedJob(t);
  const seen: ModelRequest[] = [];
  registerFake("evaluation.rubric", req => { seen.push(req); return { data: judgeReply(RUBRIC) }; });
  await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF, writerProvider: "anthropic" });
  assert.equal(seen[0].tier, "judge");
  assert.equal(seen[0].avoidProvider, "anthropic");
  assert.equal(seen[0].json, true);
  assert.equal(extractTag(seen[0].prompt, "draft"), GOOD_DRAFT);
  assert.equal(extractTag(seen[0].prompt, "brief"), BRIEF);
  assert.deepEqual(JSON.parse(extractTag(seen[0].prompt, "criteria")!).map((c: any) => c.id), RUBRIC.map(c => c.id));

  // Without writerProvider, the provider logged for the draft's run is avoided.
  await t.sql("INSERT INTO model_calls (id, day, purpose, run_id, provider, model, ok, created_at) VALUES ('mc_w', '2026-11-06', 'runner.step', ?, 'openai', 'gpt', 1, ?)", runId, new Date().toISOString());
  await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(seen[1].avoidProvider, "openai");
});

test("a criterion the judge leaves out fails with a note; a missing critical one fails the draft", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t);
  registerFake("evaluation.rubric", () => ({ data: judgeReply(RUBRIC, { skip: ["objections"] }) }));
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  const missing = out.rubric.criteria.find(c => c.id === "objections")!;
  assert.equal(missing.pass, false);
  assert.match(missing.note, /did not score this item/);
  assert.equal(out.rubric.score, 0.85); // 17 of 20
  assert.equal(out.passed, true);
  assert.match(out.feedback, /- objections:/);

  registerFake("evaluation.rubric", () => ({ data: judgeReply(RUBRIC, { skip: ["proof_used"] }) }));
  const critical = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(critical.passed, false);
  assert.match(critical.feedback, /- proof_used \(must pass\):/);
});

test("a critical fail fails the draft even when the weighted score reaches 0.75", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t);
  registerFake("evaluation.rubric", () => ({ data: judgeReply(RUBRIC, { fail: ["clear_offer"] }) }));
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(out.rubric.score, 0.75);
  assert.equal(out.rubric.passed, false);
  assert.equal(out.passed, false);
});

test("the weighted score must reach 0.75 when no critical item fails", () => {
  const r = (fail: string[]) => scoreRubric(RUBRIC, judgeReply(RUBRIC, { fail }).criteria.map(c => ({ ...c })), GOOD_DRAFT);
  assert.deepEqual([r(["one_action"]).score, r(["one_action"]).passed], [0.8, true]);
  assert.deepEqual([r(["objections"]).score, r(["objections"]).passed], [0.85, true]);
  assert.deepEqual([r(["one_action", "objections"]).score, r(["one_action", "objections"]).passed], [0.65, false]);
  const even: RubricCriterion[] = ["a", "b", "c", "d"].map(id => ({ id, text: id, weight: 2, pass_rule: id, critical: false, source: "template" }));
  const atLine = scoreRubric(even, judgeReply(even, { fail: ["d"] }).criteria, GOOD_DRAFT);
  assert.deepEqual([atLine.score, atLine.passed], [0.75, true]);
  const below = scoreRubric(even, judgeReply(even, { fail: ["c", "d"] }).criteria, GOOD_DRAFT);
  assert.deepEqual([below.score, below.passed], [0.5, false]);
});

test("a pass without a real quote from the draft counts as not met", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t);
  registerFake("evaluation.rubric", () => ({ data: { criteria: RUBRIC.map(c => ({ id: c.id, pass: true, evidence: c.id === "objections" ? "We answer every question you could have." : QUOTE, note: "Met." })) } }));
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  const item = out.rubric.criteria.find(c => c.id === "objections")!;
  assert.equal(item.pass, false);
  assert.match(item.note, /did not quote the draft/);
});

test("quotes match despite case, spacing, curly quotes, markdown marks and ellipses", () => {
  assert.ok(evidenceInDraft("book every groom WITHOUT the text-message", GOOD_DRAFT));
  assert.ok(evidenceInDraft("“Start your free trial”", GOOD_DRAFT));
  assert.ok(evidenceInDraft("Clients pick a time ... you get the booking.", GOOD_DRAFT));
  assert.ok(evidenceInDraft('"Stop chasing texts" and "See your whole week"', GOOD_DRAFT));
  assert.equal(evidenceInDraft("", GOOD_DRAFT), false);
  assert.equal(evidenceInDraft("ok", GOOD_DRAFT), false);
  assert.equal(evidenceInDraft("Clients pick a time ... and we call them back", GOOD_DRAFT), false);
});

test("judge replies are validated: loose pass values are read, broken replies get one retry, then the check throws", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t);
  registerFake("evaluation.rubric", () => ({ data: { criteria: RUBRIC.map(c => ({ id: c.id, pass: "pass", evidence: QUOTE, note: null })) } }));
  const loose = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(loose.passed, true);

  let n = 0;
  registerFake("evaluation.rubric", () => (++n === 1 ? { data: { criteria: "all good" } } : { data: judgeReply(RUBRIC) }));
  const retried = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(retried.passed, true);
  assert.equal(n, 2);

  n = 0;
  registerFake("evaluation.rubric", () => { n++; return { text: "Looks fine to me." }; });
  await assert.rejects(checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF }), /did not give a usable answer/);
  assert.equal(n, 2);

  registerFake("evaluation.rubric", () => ({ data: { criteria: [{ id: "", pass: true }] } }));
  await assert.rejects(checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF }), /usable answer/);
});

// ---------- Policy rules ----------

const known = knownFrom(BRIEF);
const codes = (text: string, k = known, opts = {}) => runPolicyRules(text, k, opts).map(f => f.code);

test("policy: placeholder text left in the draft", () => {
  assert.deepEqual(codes("Here is what people say: [insert customer quote]."), ["placeholder"]);
  assert.deepEqual(codes("Lorem ipsum dolor sit amet."), ["placeholder"]);
  assert.deepEqual(codes("As an AI, I cannot check your prices."), ["placeholder"]);
  assert.deepEqual(codes("As an AI language model I do not know your shop."), ["placeholder"]);
  assert.deepEqual(codes("TODO: add the price table"), ["placeholder"]);
  assert.deepEqual(codes("Our founder worked as an AI researcher for ten years."), []);
  assert.deepEqual(codes("[Insert your logo](https://example.com/logo) and start."), []); // a markdown link, not a placeholder
  // Job types that ask for placeholders may keep "[insert ...]", but never lorem ipsum.
  assert.deepEqual(codes("Invoice [insert invoice number] is due.", known, { allowPlaceholders: true }), []);
  assert.deepEqual(codes("Lorem ipsum", known, { allowPlaceholders: true }), ["placeholder"]);
  assert.ok(placeholdersExpected("Every email names a placeholder for invoice number"));
  assert.equal(placeholdersExpected("Use only facts in the brief"), false);
});

test("policy: promises of guaranteed results", () => {
  assert.deepEqual(codes("Guaranteed results in your first week."), ["guarantee"]);
  assert.deepEqual(codes("It is 100% guaranteed."), ["guarantee"]);
  assert.deepEqual(codes("We guarantee you will be fully booked."), ["guarantee"]);
  assert.deepEqual(codes("Try it risk-free."), ["guarantee"]);
  assert.deepEqual(codes("Try it risk-free.", knownFrom("Every plan is risk-free for 30 days.")), []);
  assert.deepEqual(codes("A money-back guarantee if you are not happy."), []);
});

test("policy: reviews, ratings and testimonials the brief does not give", () => {
  assert.deepEqual(codes('"This app gave me my evenings back." - Sarah K., groomer'), ["fake_review"]);
  assert.deepEqual(codes('"This app gave me my evenings back."\n— Sarah K.'), ["fake_review"]);
  assert.deepEqual(codes("> Best booking tool I have used.\n> — Jess Moreno"), ["fake_review"]);
  assert.deepEqual(codes("Rated 4.9 by groomers."), ["fake_review"]);
  assert.deepEqual(codes("Loved by groomers: 4.8 stars."), ["fake_review"]);
  assert.deepEqual(codes("Over 1,200 reviews."), ["fake_review"]);
  assert.deepEqual(codes("★★★★★"), ["fake_review"]);
  // Proof the buyer gave is fine.
  const proof = knownFrom("4.7 stars from 2,100 reviews. Quote from Sarah, a groomer in Leeds: This app gave me my evenings back.");
  assert.deepEqual(codes("4.7 stars from 2,100 reviews.", proof), []);
  assert.deepEqual(codes('"This app gave me my evenings back." - Sarah, groomer in Leeds', proof), []);
  // A quoted headline followed by a bullet is not a testimonial.
  assert.deepEqual(codes('Headline: "Stop booking dogs by text message"\n- Subhead: one link for every booking'), []);
});

test("policy: contact details that are not in the brief", () => {
  assert.deepEqual(codes("Email hello@pawsandclaws.com to start."), ["contact_details"]);
  assert.deepEqual(codes("Call (555) 123-4567 today."), ["contact_details"]);
  assert.deepEqual(codes("Call +44 20 7946 0958 today."), ["contact_details"]);
  const theirs = knownFrom("Contact: hello@pawsandclaws.com, phone 555-123-4567");
  assert.deepEqual(codes("Email hello@pawsandclaws.com or call (555) 123-4567.", theirs), []);
  assert.deepEqual(codes("Our logo is logo@2x.png and we open 9 to 5."), []);
  assert.deepEqual(codes("Plans from $29/month, 1,200 to 2,000 words."), []);
});

test("policy: medical, legal, tax and investment advice", () => {
  assert.deepEqual(codes("Our calming chews cure anxiety in dogs."), ["regulated_advice"]);
  assert.deepEqual(codes("You can stop taking your medication once you feel better."), ["regulated_advice"]);
  assert.deepEqual(codes("For a simple contract you don't need a lawyer."), ["regulated_advice"]);
  assert.deepEqual(codes("You can write off the whole van on your taxes."), ["regulated_advice"]);
  assert.deepEqual(codes("You should buy shares in the company now."), ["regulated_advice"]);
  assert.deepEqual(codes("This plan will double your money in a year."), ["regulated_advice"]);
  assert.deepEqual(codes("Talk to your doctor before you change your routine."), []);
  assert.deepEqual(codes("Tax-free shopping for visitors.", knownFrom("We offer tax-free shopping for visitors.")), []);
});

test("policy flags fail the check and show up in the feedback", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t, { content: `${GOOD_DRAFT}\n\nGuaranteed results or your money back. Email hello@groomly.io.` });
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(out.rubric.passed, true);
  assert.equal(out.policy.passed, false);
  assert.equal(out.passed, false);
  assert.deepEqual(out.policy.flags.map(f => f.code).sort(), ["contact_details", "guarantee"]);
  assert.match(out.feedback, /- guarantee: .*Found: "Guaranteed results"/);
  assert.match(out.feedback, /- contact_details: .*hello@groomly\.io/);
  const [policy] = await t.sql("SELECT passed, result FROM scores WHERE draft_id = ? AND judge = 'policy'", draftId);
  assert.equal(policy.passed, 0);
  assert.equal(JSON.parse(policy.result).flags.length, 2);
});

test("the small-model policy check flags claims the brief does not support, and is skipped when it fails", async () => {
  const t = await testEnv();
  const { draftId } = await seedJob(t);
  registerFake("evaluation.policy", req => {
    assert.equal(req.tier, "small");
    return { data: { flags: [
      { excerpt: "Every groom, every dog and every note in one calendar.", reason: "The brief does not say the app has notes." },
      { excerpt: "Used by 4,000 salons", reason: "Not in the draft, so it is dropped." },
      { excerpt: "$29/month scheduling app", reason: "This is in the brief, so it is dropped." },
    ] } };
  });
  const out = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.deepEqual(out.policy.flags.map(f => [f.code, f.excerpt]), [["unsupported_claim", "Every groom, every dog and every note in one calendar."]]);
  assert.equal(out.passed, false);

  registerFake("evaluation.policy", () => { throw new Error("provider down"); });
  const skipped = await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF });
  assert.equal(skipped.passed, true);
  const rows = await t.sql("SELECT result FROM scores WHERE draft_id = ? AND judge = 'policy' ORDER BY created_at DESC, rowid DESC", draftId);
  assert.equal(JSON.parse(rows[0].result).model_check, "skipped");

  let called = false;
  registerFake("evaluation.policy", () => { called = true; return { data: { flags: [] } }; });
  await checkDraft(t.env, { draftId, rubric: RUBRIC, jobTypeId: LANDING_PAGE.id, brief: BRIEF, modelPolicy: false });
  assert.equal(called, false);
});

test("feedback is empty when everything passes and lists each problem otherwise", () => {
  const result = scoreRubric(RUBRIC, judgeReply(RUBRIC).criteria, GOOD_DRAFT);
  assert.equal(buildFeedback(RUBRIC, result, { passed: true, flags: [] }), "");
  const fb = buildFeedback(RUBRIC, result, { passed: false, flags: [{ code: "placeholder", message: "Placeholder text is still in the draft.", excerpt: "[insert quote]" }] });
  assert.match(fb, /Problems in the text:\n- placeholder: Placeholder text is still in the draft\. Found: "\[insert quote\]"\. Replace the placeholder/);
});

// ---------- Baseline comparison ----------

test("pairwise judge: a winner only when both orders agree, written as a baseline score", async () => {
  const t = await testEnv();
  const { jobId, draftId } = await seedJob(t);
  const base = await seedBaselineDraft(t, jobId);
  const seen: ModelRequest[] = [];
  registerFake("evaluation.pairwise", req => {
    seen.push(req);
    const a = extractTag(req.prompt, "draft_a")!;
    return { data: { winner: a === GOOD_DRAFT ? "A" : "B", reason: "The longer draft answers more of the brief." } };
  });
  const won = await compareWithBaseline(t.env, { agentDraftId: draftId, baselineDraftId: base.draftId, rubric: RUBRIC, brief: BRIEF, writerProvider: "gemini" });
  assert.deepEqual([won.winner, won.orders], ["agent", ["agent", "agent"]]);
  assert.equal(seen.length, 2);
  assert.equal(extractTag(seen[0].prompt, "draft_a"), GOOD_DRAFT, "first order shows the agent draft first");
  assert.equal(extractTag(seen[1].prompt, "draft_b"), GOOD_DRAFT, "second order shows it second");
  assert.ok(seen.every(r => r.tier === "judge" && r.avoidProvider === "gemini"));
  const [row] = await t.sql("SELECT draft_id, passed, score, result FROM scores WHERE judge = 'baseline'");
  assert.deepEqual([row.draft_id, row.passed, row.score], [draftId, 1, 1]);
  const result = JSON.parse(row.result);
  assert.equal(result.verdicts.length, 2);
  assert.equal(result.baseline_draft_id, base.draftId);
  assert.match(result.reasons, /agent's draft shown first: The longer draft/);
});

test("pairwise judge: orders that disagree (position bias) make a tie; plain AI can win", async () => {
  const t = await testEnv();
  const { jobId, draftId } = await seedJob(t);
  const base = await seedBaselineDraft(t, jobId, "A plain version that the judge prefers.");
  registerFake("evaluation.pairwise", () => ({ data: { winner: "A", reason: "The first one reads better." } }));
  const biased = await compareWithBaseline(t.env, { agentDraftId: draftId, baselineDraftId: base.draftId, rubric: RUBRIC, brief: BRIEF });
  assert.deepEqual([biased.winner, biased.orders], ["tie", ["agent", "baseline"]]);
  assert.match(biased.reasons, /disagreed/);

  registerFake("evaluation.pairwise", req => ({ data: { winner: extractTag(req.prompt, "draft_a")!.startsWith("A plain version") ? "Draft A" : "b", reason: "The plain one is clearer." } }));
  const lost = await compareWithBaseline(t.env, { agentDraftId: draftId, baselineDraftId: base.draftId, rubric: RUBRIC, brief: BRIEF });
  assert.deepEqual([lost.winner, lost.orders], ["baseline", ["baseline", "baseline"]]);
  registerFake("evaluation.pairwise", () => ({ data: { winner: "tie", reason: "Same." } }));
  assert.equal((await compareWithBaseline(t.env, { agentDraftId: draftId, baselineDraftId: base.draftId, rubric: RUBRIC, brief: BRIEF })).winner, "tie");

  const rows = await t.sql("SELECT passed, score FROM scores WHERE judge = 'baseline' ORDER BY rowid");
  assert.deepEqual(rows.map(r => [r.passed, r.score]), [[1, 0.5], [0, 0], [1, 0.5]]);

  registerFake("evaluation.pairwise", () => ({ data: { winner: "C", reason: "?" } }));
  await assert.rejects(compareWithBaseline(t.env, { agentDraftId: draftId, baselineDraftId: base.draftId, rubric: RUBRIC, brief: BRIEF }), /usable answer/);
});

test("the default pairwise fake prefers the fuller draft in both orders", async () => {
  const t = await testEnv();
  const { jobId, draftId } = await seedJob(t);
  const base = await seedBaselineDraft(t, jobId);
  const out = await compareWithBaseline(t.env, { agentDraftId: draftId, baselineDraftId: base.draftId, rubric: RUBRIC, brief: BRIEF });
  assert.equal(out.winner, "agent");
});

// ---------- Blind tests and the reviewer API ----------

async function openTest(t: TestEnv, o: { jobTypeId?: string; agentId?: string } = {}) {
  const job = await seedJob(t, o);
  const base = await seedBaselineDraft(t, job.jobId);
  const { testId } = await createBlindTest(t.env, { jobTypeId: o.jobTypeId ?? LANDING_PAGE.id, jobId: job.jobId, agentId: job.agentId, agentVersion: 1, brief: BRIEF, agentDraftId: job.draftId, baselineDraftId: base.draftId });
  return { ...job, baselineDraftId: base.draftId, testId };
}

test("blind tests put the agent draft on a random side", async tc => {
  const t = await testEnv();
  tc.mock.method(Math, "random", () => 0.1);
  const first = await openTest(t);
  tc.mock.method(Math, "random", () => 0.9);
  const second = await openTest(t);
  const rows = await t.sql("SELECT id, a_draft_id, b_draft_id, a_source, b_source, status, judgments_needed FROM blind_tests ORDER BY created_at, rowid");
  assert.deepEqual([rows[0].a_source, rows[0].b_source, rows[0].a_draft_id], ["agent", "baseline", first.draftId]);
  assert.deepEqual([rows[1].a_source, rows[1].b_source, rows[1].b_draft_id], ["baseline", "agent", second.draftId]);
  assert.ok(rows.every(r => r.status === "open" && r.judgments_needed === 3));
  const events = await t.sql("SELECT type FROM events WHERE entity = 'blind_test'");
  assert.equal(events.filter(e => e.type === "blind_test.created").length, 2);
});

test("only reviewers and ops can open the review queue; stats are ops only", async () => {
  const t = await testEnv();
  await openTest(t);
  assert.equal((await t.api("GET", "/api/review/blind/next")).status, 401);
  assert.equal((await t.api("GET", "/api/review/blind/next", { user: "user_buyer" })).status, 403);
  assert.equal((await t.api("POST", "/api/review/blind/bt_x", { user: "user_buyer", body: { pick: "a" } })).status, 403);
  await t.makeReviewer("user_rev");
  await t.makeOps("user_ops");
  assert.equal((await t.api("GET", "/api/review/blind/next", { user: "user_rev" })).status, 200);
  assert.equal((await t.api("GET", "/api/review/blind/next", { user: "user_ops" })).status, 200);
  assert.equal((await t.api("GET", "/api/review/stats", { user: "user_rev" })).status, 403);
  assert.equal((await t.api("GET", "/api/review/stats", { user: "user_ops" })).status, 200);
});

test("reviewers see only the brief and the two drafts as A and B, never which is which", async () => {
  const t = await testEnv();
  const opened = await openTest(t);
  await t.makeReviewer("user_rev");
  const res = await t.api("GET", "/api/review/blind/next", { user: "user_rev" });
  assert.equal(res.status, 200);
  const shown = res.body.test;
  assert.deepEqual(Object.keys(shown).sort(), ["a", "b", "brief", "id", "jobType"]);
  assert.deepEqual(Object.keys(shown.a).sort(), ["content", "format"]);
  assert.equal(shown.id, opened.testId);
  assert.equal(shown.brief, BRIEF);
  assert.equal(shown.jobType, "Landing page copy");
  assert.deepEqual([shown.a.content, shown.b.content].sort(), [GOOD_DRAFT, "Book grooms online. Try it free."].sort());
  const raw = JSON.stringify(res.body);
  for (const secret of ["a_source", "b_source", "source", "agent", "baseline", opened.draftId, opened.baselineDraftId, opened.agentId, opened.jobId, opened.runId]) {
    assert.ok(!raw.includes(secret), `the reviewer response does not contain ${secret}`);
  }
  assert.deepEqual([res.body.waiting, res.body.done], [1, 0]);
});

test("reviewer flow: oldest first, one pick each, the test closes at three picks", async () => {
  const t = await testEnv();
  const older = await openTest(t);
  const newer = await openTest(t);
  for (const r of ["user_r1", "user_r2", "user_r3", "user_r4"]) await t.makeReviewer(r);

  const first = await t.api("GET", "/api/review/blind/next", { user: "user_r1" });
  assert.equal(first.body.test.id, older.testId);
  assert.equal((await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r1", body: { pick: "c" } })).status, 400);
  assert.equal((await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r1", body: { pick: "a", reason: 7 } })).status, 400);
  assert.equal((await t.api("POST", "/api/review/blind/bt_missing", { user: "user_r1", body: { pick: "a" } })).status, 404);

  const saved = await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r1", body: { pick: "a", reason: "A answers the price question." } });
  assert.equal(saved.status, 200);
  assert.deepEqual(saved.body, { ok: true, closed: false, waiting: 1, done: 1 });
  const twice = await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r1", body: { pick: "b" } });
  assert.equal(twice.status, 409);
  assert.equal(twice.body.error.code, "already_judged");
  assert.equal((await t.api("GET", "/api/review/blind/next", { user: "user_r1" })).body.test.id, newer.testId, "a judged pair is skipped");

  assert.equal((await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r2", body: { pick: "a" } })).body.closed, false);
  const third = await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r3", body: { pick: "tie" } });
  assert.equal(third.body.closed, true);
  const [row] = await t.sql("SELECT status, closed_at FROM blind_tests WHERE id = ?", older.testId);
  assert.equal(row.status, "closed");
  assert.ok(row.closed_at);

  const late = await t.api("POST", `/api/review/blind/${older.testId}`, { user: "user_r4", body: { pick: "b" } });
  assert.equal(late.status, 409);
  assert.equal(late.body.error.code, "test_closed");
  assert.equal((await t.api("GET", "/api/review/blind/next", { user: "user_r4" })).body.test.id, newer.testId, "closed pairs leave the queue");

  const judgments = await t.sql("SELECT reviewer_id, pick, reason FROM blind_judgments WHERE test_id = ? ORDER BY created_at, rowid", older.testId);
  assert.deepEqual(judgments.map(j => j.pick), ["a", "a", "tie"]);
  assert.equal(judgments[0].reason, "A answers the price question.");
  const events = await t.sql("SELECT type, actor_kind FROM events WHERE entity = 'blind_test' AND entity_id = ? ORDER BY seq", older.testId);
  assert.deepEqual(events.map(e => e.type), ["blind_test.created", "blind_test.judged", "blind_test.judged", "blind_test.judged", "blind_test.closed"]);
  assert.equal(events[1].actor_kind, "reviewer");

  // The reviewers' majority is recorded on the agent draft.
  const [{ a_source }] = await t.sql("SELECT a_source FROM blind_tests WHERE id = ?", older.testId);
  const [human] = await t.sql("SELECT passed, score, result FROM scores WHERE draft_id = ? AND judge = 'human'", older.draftId);
  assert.equal(JSON.parse(human.result).winner, a_source);
  assert.equal(human.score, a_source === "agent" ? 1 : 0);
});

test("an empty queue says so, with the reviewer's count", async () => {
  const t = await testEnv();
  await t.makeReviewer("user_rev");
  const res = await t.api("GET", "/api/review/blind/next", { user: "user_rev" });
  assert.deepEqual(res.body, { test: null, waiting: 0, done: 0 });
});

// ---------- Win rates ----------

test("majority pick: the single most common pick, otherwise a tie", () => {
  assert.equal(majorityPick(["a", "a", "b"]), "a");
  assert.equal(majorityPick(["b", "b", "b"]), "b");
  assert.equal(majorityPick(["a", "b", "tie"]), "tie");
  assert.equal(majorityPick(["tie", "tie", "a"]), "tie");
  assert.equal(majorityPick(["a", "tie"]), "tie");
  assert.equal(majorityPick(["a"]), "a");
  assert.equal(majorityPick([]), "tie");
});

test("win rates: majority picks mapped to agent or plain AI, grouped overall, by job type and by agent", async () => {
  const t = await testEnv();
  const reviewers = ["user_r1", "user_r2", "user_r3"];
  for (const r of reviewers) await t.makeReviewer(r);
  const cases: { jobTypeId: string; agentId: string; aSource: "agent" | "baseline"; picks: ("a" | "b" | "tie")[]; status?: "open" | "closed"; modelWinner?: string }[] = [
    { jobTypeId: "landing-page-copy", agentId: "agent_one", aSource: "agent", picks: ["a", "a", "b"], modelWinner: "agent" },       // agent wins (model agrees)
    { jobTypeId: "landing-page-copy", agentId: "agent_one", aSource: "baseline", picks: ["a", "a", "tie"], modelWinner: "agent" }, // plain AI wins (model disagrees)
    { jobTypeId: "landing-page-copy", agentId: "agent_one", aSource: "baseline", picks: ["b", "b", "b"] },                          // agent wins
    { jobTypeId: "seo-blog-post", agentId: "agent_two", aSource: "agent", picks: ["a", "b", "tie"] },                               // tie
    { jobTypeId: "seo-blog-post", agentId: "agent_two", aSource: "agent", picks: ["tie", "tie", "a"] },                             // tie
    { jobTypeId: "seo-blog-post", agentId: "agent_two", aSource: "agent", picks: ["a"], status: "open" },                           // not counted
  ];
  let i = 0;
  for (const c of cases) {
    i++;
    const job = await seedJob(t, { jobTypeId: c.jobTypeId, agentId: c.agentId });
    const base = await seedBaselineDraft(t, job.jobId);
    const [a, b] = c.aSource === "agent" ? [job.draftId, base.draftId] : [base.draftId, job.draftId];
    const now = new Date(Date.UTC(2026, 10, 1, 0, i)).toISOString();
    await t.sql("INSERT INTO blind_tests (id, job_type_id, job_id, agent_id, agent_version, brief, a_draft_id, b_draft_id, a_source, b_source, judgments_needed, status, created_at, closed_at) VALUES (?, ?, ?, ?, 1, 'brief', ?, ?, ?, ?, 3, ?, ?, ?)",
      `bt_${i}`, c.jobTypeId, job.jobId, c.agentId, a, b, c.aSource, c.aSource === "agent" ? "baseline" : "agent", c.status ?? "closed", now, c.status === "open" ? null : now);
    for (const [k, pick] of c.picks.entries()) {
      await t.sql("INSERT INTO blind_judgments (test_id, reviewer_id, pick, reason, created_at) VALUES (?, ?, ?, '', ?)", `bt_${i}`, reviewers[k], pick, now);
    }
    if (c.modelWinner) {
      await t.sql("INSERT INTO scores (id, draft_id, judge, passed, score, result, created_at) VALUES (?, ?, 'baseline', 1, 1, ?, ?)", `score_m${i}`, job.draftId, JSON.stringify({ winner: c.modelWinner }), now);
    }
  }

  const [overall] = await winRates(t.env, "all");
  assert.deepEqual(overall, { key: "all", tests: 5, judgments: 15, agentWins: 2, baselineWins: 1, ties: 2, winRate: 0.6667 });
  const byType = await winRates(t.env, "job_type");
  assert.deepEqual(byType.map(r => [r.key, r.tests, r.agentWins, r.baselineWins, r.ties, r.winRate]), [
    ["landing-page-copy", 3, 2, 1, 0, 0.6667],
    ["seo-blog-post", 2, 0, 0, 2, null],
  ]);
  const byAgent = await winRates(t.env, "agent");
  assert.deepEqual(byAgent.map(r => [r.key, r.tests, r.winRate]), [["agent_one:1", 3, 0.6667], ["agent_two:1", 2, null]]);
  assert.deepEqual(await judgeAgreement(t.env), { tests: 2, agree: 1, rate: 0.5 });

  await t.makeOps("user_ops");
  const stats = await t.api("GET", "/api/review/stats", { user: "user_ops" });
  assert.equal(stats.status, 200);
  assert.equal(stats.body.all.winRate, 0.6667);
  assert.deepEqual(stats.body.byJobType.map((r: any) => r.label), ["Landing page copy", "SEO blog post"]);
  assert.deepEqual(stats.body.byAgent.map((r: any) => r.label), ["House agent v1", "House agent v1"]);
  assert.deepEqual(stats.body.agreement, { tests: 2, agree: 1, rate: 0.5 });
  assert.deepEqual([stats.body.open, stats.body.closed], [1, 5]);
});

test("win rates with no closed tests are empty, not zero", async () => {
  const t = await testEnv();
  assert.deepEqual(await winRates(t.env, "all"), [{ key: "all", tests: 0, judgments: 0, agentWins: 0, baselineWins: 0, ties: 0, winRate: null }]);
  assert.deepEqual(await winRates(t.env, "agent"), []);
  assert.deepEqual(await judgeAgreement(t.env), { tests: 0, agree: 0, rate: null });
});
