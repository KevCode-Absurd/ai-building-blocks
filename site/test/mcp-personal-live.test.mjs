import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { buildPersonalFixtureData, readPersonalRow, casPersonalRow, restorePersonalRows } from '../../tools/check-mcp-personal-live.mjs';

const originalState = { kits: [{ id: 'existing-kit', name: 'Existing kit', slugs: ['existing-skill'] }], flows: [{ id: 'existing-flow', name: 'Existing flow', nodes: [], edges: [] }], recent: ['private-history'], currentFlow: 'existing-flow', draft: { id: 'existing-draft', name: 'Existing draft', nodes: [], edges: [] } };
const originalData = { 'abb:v1': JSON.stringify(originalState), 'abb:business': JSON.stringify({ name: 'Private original business' }), 'abb:composer': JSON.stringify({ format: 'ai-blocks-composition/1', goal: 'Preserve original plan' }) };
const mind = { slug: 'my-mind-existing', name: 'Existing profile', specialty: 'Existing purpose', voice: 'Plain', principles: 'Preserve this', avoid: '', examples: '' };
const originalLibrary = { user_id: 'user', revision: 7, contents: JSON.stringify(originalData), updated_at: 'original-library-stamp' };
const originalMinds = { user_id: 'user', revision: 3, profiles: JSON.stringify([mind]), updated_at: 'original-minds-stamp' };
function database() {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE account_library(user_id TEXT PRIMARY KEY,revision INTEGER,contents TEXT,updated_at TEXT); CREATE TABLE account_minds(user_id TEXT PRIMARY KEY,revision INTEGER,profiles TEXT,updated_at TEXT);');
  const query = async (sql, params = []) => { const statement = db.prepare(sql); if (/^SELECT/i.test(sql)) return [{ results: statement.all(...params) }]; const result = statement.run(...params); return [{ results: [], meta: { changes: Number(result.changes) } }]; };
  return { db, query };
}
test('synthetic personal fixture merges additively and preserves current saves/context/planner/draft exactly', () => {
  const beforeLibrary = structuredClone(originalLibrary), beforeMinds = structuredClone(originalMinds);
  const fixture = buildPersonalFixtureData(originalLibrary, originalMinds, 'abcdef123456');
  const state = JSON.parse(fixture.data['abb:v1']);
  assert.deepEqual(state.kits[0], originalState.kits[0]); assert.deepEqual(state.flows[0], originalState.flows[0]); assert.deepEqual(state.draft, originalState.draft);
  assert.deepEqual(state.recent, originalState.recent); assert.equal(state.currentFlow, originalState.currentFlow);
  assert.equal(fixture.data['abb:business'], originalData['abb:business']); assert.equal(fixture.data['abb:composer'], originalData['abb:composer']);
  assert.deepEqual(fixture.profiles[0], mind);
  const flow = state.flows.find(f => f.name === fixture.labels.workflow);
  assert.equal(flow.customMinds, undefined); assert.equal(flow.nodes[0].mind, fixture.profileSlug);
  assert.ok(flow.files[`skills/${fixture.skillSlug}/references/fixture.json`]);
  const override = state.flows.find(f => f.name === fixture.labels.override);
  assert.match(override.customMinds[0].principles, /^Embedded snapshot:/);
  assert.ok(state.browserSaves.some(receipt => receipt.data['abb:v1'].includes(fixture.labels.receiptDraft)));
  assert.deepEqual(originalLibrary, beforeLibrary); assert.deepEqual(originalMinds, beforeMinds);
});

test('fixture validation preserves existing profile fields and formatting values instead of normalizing them', () => {
  const raw = { ...mind, name: '  Existing profile  ', principles: '  Preserve original spacing  ', retainedExtension: { source: 'original user field' } };
  const result = buildPersonalFixtureData(originalLibrary, { ...originalMinds, profiles: JSON.stringify([raw]) }, 'abcdef123456');
  assert.deepEqual(result.profiles[0], raw);
});

test('CAS seed and restoration return both actual SQLite rows to their exact original values', async () => {
  const { db, query } = database();
  try {
    await casPersonalRow(query, 'account_library', 'user', null, originalLibrary); await casPersonalRow(query, 'account_minds', 'user', null, originalMinds);
    const library = { ...originalLibrary, revision: 8, contents: '{"fixture":"library"}', updated_at: 'fixture-stamp' };
    const minds = { ...originalMinds, revision: 4, profiles: '[{"fixture":"mind"}]', updated_at: 'fixture-stamp' };
    assert.equal(await casPersonalRow(query, 'account_library', 'user', originalLibrary, library), true);
    assert.equal(await casPersonalRow(query, 'account_minds', 'user', originalMinds, minds), true);
    const result = await restorePersonalRows(query, 'user', { account_library: { original: originalLibrary, expected: library }, account_minds: { original: originalMinds, expected: minds } });
    assert.equal(result.restored, true);
    assert.deepEqual({ ...await readPersonalRow(query, 'account_library', 'user') }, originalLibrary);
    assert.deepEqual({ ...await readPersonalRow(query, 'account_minds', 'user') }, originalMinds);
  } finally { db.close(); }
});

test('CAS restoration preserves concurrent account edits while restoring unaffected profile fixtures', async () => {
  const { db, query } = database();
  try {
    const library = { ...originalLibrary, revision: 8, contents: '{"fixture":true}', updated_at: 'fixture' };
    const minds = { ...originalMinds, revision: 4, profiles: '[]', updated_at: 'fixture' };
    await casPersonalRow(query, 'account_library', 'user', null, library); await casPersonalRow(query, 'account_minds', 'user', null, minds);
    const concurrent = { ...library, revision: 9, contents: '{"newUserEdit":"must survive"}', updated_at: 'concurrent-user-edit' };
    await casPersonalRow(query, 'account_library', 'user', library, concurrent);
    const result = await restorePersonalRows(query, 'user', { account_library: { original: originalLibrary, expected: library }, account_minds: { original: originalMinds, expected: minds } });
    assert.equal(result.restored, false);
    assert.deepEqual({ ...await readPersonalRow(query, 'account_library', 'user') }, concurrent);
    assert.deepEqual({ ...await readPersonalRow(query, 'account_minds', 'user') }, originalMinds);
  } finally { db.close(); }
});

test('previously absent rows are removed with exact CAS guards and known intermediate states are recoverable', async () => {
  const { db, query } = database();
  try {
    const a = { ...originalMinds, revision: 1 }, b = { ...a, revision: 2, profiles: '[]' };
    await casPersonalRow(query, 'account_minds', 'user', null, b);
    const result = await restorePersonalRows(query, 'user', { account_library: { original: null, expected: null }, account_minds: { original: null, expected: a, candidates: [a, b] } });
    assert.equal(result.restored, true); assert.equal(await readPersonalRow(query, 'account_minds', 'user'), null);
    await assert.rejects(casPersonalRow(query, 'spaces', 'user', null, a), /scoped-table/);
  } finally { db.close(); }
});
