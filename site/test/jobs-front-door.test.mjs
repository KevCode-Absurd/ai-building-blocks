// One front door: prepare_job_context returns the brief, the questions and who should do the job.
// The team method is short; record detail is a reference.
import test from 'node:test';
import assert from 'node:assert/strict';
import { callJobTool } from '../src/jobs/job-mcp.mjs';
import { jobMethod, jobRecords, SINGLE_LEAD_METHOD } from '../src/jobs/method.mjs';

const words = text => (text.match(/\S+/g) ?? []).length;

test('the front door returns the questions and who should do the job', async () => {
  const page = await callJobTool('prepare_job_context', { request: 'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to', deliverable_kind: 'web_page' });
  assert.deepEqual(Object.keys(page).slice(0, 5), ['schema', 'brief', 'questions', 'questions_note', 'route']);
  assert.deepEqual(page.questions.map(q => q.id), ['one_action', 'proof', 'offer', 'keep']); assert.match(page.questions_note, /you decide/);
  assert.equal(page.route.mode, 'single'); assert.match(page.route.reason, /one lead/);
  assert.deepEqual(page.route.next.arguments, { request: 'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to', deliverable_kind: 'web_page' }); assert.equal(page.route.next.tool, 'start_job');
  const mixed = await callJobTool('prepare_job_context', { request: 'Launch our new product: landing page, 6 ads and a 5-email sequence' });
  assert.equal(mixed.route.mode, 'team'); assert.match(mixed.route.next.why, /lead and helpers/);
  assert.equal((await callJobTool('prepare_job_context', { request: 'I need more customers' })).route.next.tool, 'start_outcome');
  // Ads and pages get different questions from the same door.
  const ads = await callJobTool('prepare_job_context', { request: 'Give me 5 Meta ad concepts for our running shoe' });
  assert.deepEqual(ads.questions.map(q => q.id), ['offer', 'audience', 'placements', 'tried']);
});

test('the team method is short, and the record detail is a reference opened only when a check fails', async () => {
  for (const profile of ['parallel', 'sequential', 'pack']) for (const tier of ['quick', 'standard', 'deep']) {
    const method = jobMethod(profile, tier);
    assert.ok(words(method) < 900, `${profile}/${tier} is ${words(method)} words`);
    for (const phrase of ['One lead owns the deliverable', 'team.lead', 'team.helpers', 'Fresh reviewer', 'Do not search the library', 'draft_receipt', 'JOB-RECORDS.md', 'Do not read it unless a check fails']) assert.ok(method.includes(phrase), phrase);
    for (const event of ['scope', 'staff', 'diverge', 'council', 'produce', 'review', 'deliver', 'feedback']) assert.ok(method.includes(`\`${event}\``), event);
    // Receipt and hash detail lives in the reference, not in what every lead reads.
    assert.doesNotMatch(method, /sha256|SHA-256|usage_status|saw_other_proposals|Borda|verify-delivery-evidence/);
    assert.doesNotMatch(method, /brand brain/i);
  }
  const records = jobRecords();
  for (const phrase of ['Open this only when advance_job refuses a record', 'saw_other_proposals', 'usage_status', 'brand_brain', 'required for page, ad, copy and email jobs only', 'coordinator_review', 'Execution quality contract']) assert.ok(records.includes(phrase), phrase);
  const templates = await callJobTool('get_job_templates', { tier: 'standard' });
  assert.deepEqual(templates.files.slice(0, 2).map(file => file.path), ['JOB-METHOD.md', 'JOB-RECORDS.md']);
  assert.ok(words(SINGLE_LEAD_METHOD) < 200); assert.match(SINGLE_LEAD_METHOD, /does not search the library/); assert.match(SINGLE_LEAD_METHOD, /fresh reviewer/i);
});
