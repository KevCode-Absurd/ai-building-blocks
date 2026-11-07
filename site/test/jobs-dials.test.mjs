import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDials, requestDials, validateDialValues, updatePreferences, wantsDefaultSave, MIX_PRESETS, localPreferences } from '../src/jobs/dials.mjs';
import { dialQuestions } from '../src/jobs/dial-questions.mjs';
import { validateJobDocument } from '../src/jobs/contracts.mjs';

test('dial precedence is request, job defaults, general defaults, then recommendations with sources', () => {
  const preferences = { general: { depth: 'deep', risk: 'conservative', volume: 8 }, by_job_type: { 'write-documents': { volume: 12, risk: 'normal' } } };
  const r = resolveDials({ request: 'Make 20 pages', job: 'write-documents', dials: { risk: 'bold' }, preferences });
  assert.equal(r.ok, true); assert.deepEqual(r.dials.volume, { value: 20, source: 'request' }); assert.deepEqual(r.dials.risk, { value: 'bold', source: 'request' });
  assert.deepEqual(r.dials.depth, { value: 'deep', source: 'saved_general' }); assert.equal(r.dials.families.source, 'recommended');
  assert.deepEqual(resolveDials({ job: 'write-documents', preferences }).dials.volume, { value: 12, source: 'saved_job_type' });
});

test('you decide restores the balanced mean and count detection ignores dates, revenue and budgets', () => {
  const r = resolveDials({ request: 'You decide', preferences: { general: { variety_mix: MIX_PRESETS.wide } } }); assert.equal(r.dials.variety_mix.preset, 'balanced'); assert.equal(r.dials.variety_mix.proven, 50);
  for (const text of ['Our sales fell 20% in 2026', 'Budget is 200 dollars', 'Make a plan for 2027', 'We have 12 employees']) assert.equal(requestDials(text).volume, undefined);
  assert.equal(requestDials('Write 12 emails').volume, 12);
});

test('questions target unset plan-changing choices, put recommendations first and cap the tree at three', () => {
  const dials = resolveDials().dials, approachJob = { families: Array.from({ length: 8 }, (_, n) => ({ id: `f${n}`, name: `Family ${n}`, what_it_looks_like: 'Distinct output' })) };
  const q = dialQuestions({ dials, approachJob, limit: 100 }); assert.equal(q.length, 3); assert.equal(q[0].id, 'variety_mix'); assert.match(q[0].options[0].label, /recommended/); assert.equal(q[0].max_depth, 3); assert.equal(q[0].branches.focused.preview_limit, 6);
  dials.variety_mix.source = 'saved_general'; assert.ok(!dialQuestions({ dials }).some(q => q.id === 'variety_mix'));
  dials.ask_before_start.value = 'use_defaults'; assert.deepEqual(dialQuestions({ dials }), []);
});

test('one-off overrides leave saved preferences unchanged while owner answers save valid normalized records', () => {
  const previous = { schema: 'ai-blocks-job-preferences/1', owner_scope: 'local', version: 1, general: { depth: 'standard' }, by_job_type: {}, history: [] }, snapshot = structuredClone(previous);
  resolveDials({ request: 'Keep it quick', preferences: previous }); assert.deepEqual(previous, snapshot);
  const noSave = updatePreferences(previous, { request: 'For this job use a quick team' }); assert.equal(noSave.changed, false); assert.deepEqual(noSave.preferences, previous);
  const saved = updatePreferences(previous, { answers: { variety_mix: 'wide', volume: 10 }, job: 'write-documents', at: '2026-11-07T10:00:00Z' });
  assert.equal(saved.changed, true); assert.equal(saved.preferences.by_job_type['write-documents'].variety_mix.preset, 'wide'); assert.equal(saved.preferences.history[0].by, 'owner_answer');
  assert.equal(validateJobDocument('ai-blocks-job-preferences/1', saved.preferences).ok, true); assert.deepEqual(previous, snapshot);
});

test('explicit default intent and feedback update only the chosen job’s proven pool and cap history', () => {
  assert.equal(wantsDefaultSave('Always give me a wide spread'), true); assert.equal(wantsDefaultSave('Make this my default'), true); assert.equal(wantsDefaultSave('Just for this run'), false);
  const previous = { schema: 'ai-blocks-job-preferences/1', owner_scope: 'local', version: 1, general: {}, by_job_type: { job: { proven_pool: [{ family: 'old', evidence: 'feedback:keep', updated: '2026-11-06' }] } }, history: Array.from({ length: 50 }, () => ({ at: '2026-11-06T00:00:00Z', change: 'Saved defaults', by: 'owner_answer' })) };
  const saved = updatePreferences(previous, { job: 'job', feedback: [{ family: 'old', action: 'kill' }, { family: 'new', action: 'more_like_this' }], at: '2026-11-07T10:00:00Z' });
  assert.deepEqual(saved.preferences.by_job_type.job.proven_pool.map(f => f.family), ['new']); assert.equal(saved.preferences.history.length, 50); assert.equal(saved.preferences.history.at(-1).by, 'feedback');
});

test('invalid dials fail together and anonymous preferences remain local-only', () => {
  const errors = validateDialValues({ depth: 'invalid', volume: 0, variety_mix: { preset: 'custom', proven: 99, new: 2, outlier: 0 }, unknown: true }); assert.equal(errors.length, 4);
  assert.equal(updatePreferences(null, { answers: { volume: -1 } }).ok, false);
  const local = localPreferences(); assert.equal(local.store, 'local'); assert.equal(local.model_calls, 0); assert.equal(local.stored_by_service, false); assert.equal(local.files[0].path, 'ai-blocks/preferences.json'); assert.match(local.me_md, /Job preferences/);
});

test('malformed saved records and unsafe job keys cannot mutate prototypes or throw', () => {
  for (const job of ['__proto__','constructor','prototype','not/a/job']) assert.equal(updatePreferences(null,{job,answers:{depth:'deep'}}).ok,false);
  assert.equal({}.depth,undefined);
  for (const previous of [{},[],{general:{},by_job_type:{},history:[],version:-1}]) assert.equal(updatePreferences(previous,{answers:{depth:'deep'}}).ok,false);
  assert.equal(updatePreferences(null,{answers:null}).ok,false);
});

test('saved family preferences resolve against the palette while preserving avoid lists for unknown jobs', () => {
  const preferences={general:{},by_job_type:{job:{families:{prefer:['plain-guide'],avoid:['long-report']}}}},approachJob={families:[{id:'plain-guide'},{id:'long-report'},{id:'checklist'}]};
  const preferred=resolveDials({job:'job',preferences,approachJob});assert.equal(preferred.ok,true);assert.deepEqual(preferred.dials.families,{value:['plain-guide'],source:'saved_job_type'});
  preferences.by_job_type.job.families.prefer=[];assert.deepEqual(resolveDials({job:'job',preferences,approachJob}).dials.families.value,['plain-guide','checklist']);
  assert.deepEqual(resolveDials({job:'job',preferences}).dials.families.value,{prefer:[],avoid:['long-report']});
  assert.deepEqual(dialQuestions({dials:{ask_before_start:{value:'use_defaults_silently'}}}),[]);
});
