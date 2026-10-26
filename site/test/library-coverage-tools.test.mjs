import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LIBRARY_COVERAGE_TOOLS, runLibraryCoverageTool as run } from '../src/tools/library-coverage-tools.mjs';
import { NEXT_TOOLS } from '../src/tools/next-100-tools.mjs';
import { TOOLS } from '../../mini-tools/index.mjs';
const result = (slug, input) => JSON.parse(run(slug, JSON.stringify(input)));

test('the original utilities have distinct routes, complete metadata and runnable examples', () => {
  assert.equal(LIBRARY_COVERAGE_TOOLS.length, 10);
  const existing = new Set([...NEXT_TOOLS, ...TOOLS].map(t => t.slug));
  for (const slug of ['word-counter', 'text-cleaner', 'contrast-checker', 'json-formatter', 'csv-to-json', 'task-priority-planner', 'weighted-decision-matrix']) existing.add(slug);
  const slugs = new Set();
  for (const t of LIBRARY_COVERAGE_TOOLS) {
    assert.ok(!existing.has(t.slug) && !slugs.has(t.slug));
    slugs.add(t.slug);
    assert.match(t.slug, /^[a-z0-9-]+$/);
    for (const field of ['short', 'category', 'summary', 'help', 'example']) assert.equal(typeof t[field], 'string');
    assert.equal(t.extension, 'json');
    assert.ok(JSON.parse(run(t.slug, t.example)));
    assert.throws(() => run(t.slug, ''), /JSON/);
    assert.throws(() => run(t.slug, '[]'), /object/);
    assert.throws(() => run(t.slug, '{}'));
    assert.throws(() => run(t.slug, ' '.repeat(1_000_001)), /1,000,000/);
    assert.throws(() => run(t.slug, null), /JSON text/);
  }
  assert.throws(() => run('../outside', '{}'), /Unknown utility/);
});

test('source checker reports unresolved references, uncited sources and usage without inventing support', () => {
  const data = { sources: [{ id: 'S1', title: '<script>untrusted</script>' }, { id: 'S2', title: 'Second' }], citations: [{ location: 'Claim 1', sourceIds: ['S1', 's1'] }, { location: 'Claim 2', sourceIds: ['S1'] }] };
  const out = result('source-id-cross-checker', data);
  assert.deepEqual(out.unresolvedCitations, [{ citation: 1, location: 'Claim 1', sourceId: 's1' }]);
  assert.deepEqual(out.uncitedSources, [{ id: 'S2', title: 'Second', uses: 0 }]);
  assert.deepEqual(out.sourceUsage[0], { id: 'S1', title: '<script>untrusted</script>', uses: 2 });
  assert.match(out.limitation, /Read each source/);
  assert.deepEqual(result('source-id-cross-checker', { ...data, citations: [] }).uncitedSources.map(s => s.id), ['S1', 'S2']);
});

test('source checker refuses missing IDs and ambiguous repeated IDs', () => {
  const source = { id: 'a', title: 'Notes' };
  for (const input of [
    { sources: [], citations: [] },
    { sources: [source, source], citations: [] },
    { sources: [source], citations: [{ location: '', sourceIds: ['a'] }] },
    { sources: [source], citations: [{ location: '1', sourceIds: ['a', 'a'] }] },
    { sources: [source], citations: [{ location: '1', sourceIds: [] }] },
    { sources: [null], citations: [] },
  ]) assert.throws(() => result('source-id-cross-checker', input));
});

test('dependency plan respects branching and earliest times rather than delaying by unrelated waves', () => {
  const input = { tasks: [
    { id: 'join', title: 'Join', minutes: 5, dependsOn: ['quick-next', 'slow'] },
    { id: 'slow', title: 'Slow', minutes: 100, dependsOn: [] },
    { id: 'quick', title: 'Quick', minutes: 10, dependsOn: [] },
    { id: 'quick-next', title: 'Quick next', minutes: 20, dependsOn: ['quick'] },
  ] };
  const out = result('task-dependency-planner', input);
  assert.deepEqual(out.dependencyWaves, [['slow', 'quick'], ['quick-next'], ['join']]);
  assert.equal(out.earliestCompletionMinutes, 105);
  assert.equal(out.schedule.find(t => t.id === 'quick-next').earliestStartMinute, 10);
  for (const t of out.schedule) for (const id of t.dependsOn) assert.ok(t.earliestStartMinute >= out.schedule.find(d => d.id === id).earliestFinishMinute);
  assert.equal(result('task-dependency-planner', { tasks: [{ id: '__proto__', title: 'Zero', minutes: 0, dependsOn: [] }] }).earliestCompletionMinutes, 0);
});

test('dependency plan rejects cycles, dangling IDs, duplicate tasks and invalid durations', () => {
  const a = { id: 'a', title: 'A', minutes: 5, dependsOn: [] };
  assert.throws(() => result('task-dependency-planner', { tasks: [{ ...a, dependsOn: ['a'] }] }), /cycle/);
  assert.throws(() => result('task-dependency-planner', { tasks: [{ ...a, dependsOn: ['b'] }, { ...a, id: 'b', dependsOn: ['a'] }] }), /cycle/);
  assert.throws(() => result('task-dependency-planner', { tasks: [{ ...a, dependsOn: ['missing'] }] }), /unknown dependency/);
  assert.throws(() => result('task-dependency-planner', { tasks: [a, a] }), /twice/);
  for (const minutes of [-1, 0.2, '5', 1e8, null]) assert.throws(() => result('task-dependency-planner', { tasks: [{ ...a, minutes }] }));
  assert.throws(() => result('task-dependency-planner', { tasks: [{ ...a, dependsOn: ['a', 'a'] }] }), /once/);
});

test('review dates handle leap days, year boundaries and zero-day intervals in stable order', () => {
  const out = result('study-review-date-planner', { intervalsDays: [0, 1, 3], items: [{ title: 'A', studiedOn: '2028-02-28' }, { title: 'B', studiedOn: '2028-02-28' }] });
  assert.equal(out.reviewCount, 6);
  assert.deepEqual(out.reviews.map(r => [r.date, r.title]), [['2028-02-28', 'A'], ['2028-02-28', 'B'], ['2028-02-29', 'A'], ['2028-02-29', 'B'], ['2028-03-02', 'A'], ['2028-03-02', 'B']]);
  assert.equal(result('study-review-date-planner', { intervalsDays: [1], items: [{ title: 'A', studiedOn: '2026-12-31' }] }).reviews[0].date, '2027-01-01');
});

test('review date planner refuses invalid dates, overflowing years and ambiguous intervals', () => {
  const base = { intervalsDays: [1, 3], items: [{ title: 'A', studiedOn: '2026-10-24' }] };
  for (const intervalsDays of [[], [3, 1], [1, 1], [-1], ['1'], [0.5], [3651]]) assert.throws(() => result('study-review-date-planner', { ...base, intervalsDays }));
  for (const studiedOn of ['2026-02-29', '2028-02-30', '2026-1-01', '0001-01-01', '2026-10-24T00:00:00Z', '9999-12-31']) assert.throws(() => result('study-review-date-planner', { ...base, items: [{ title: 'A', studiedOn }] }));
});

test('file preview preserves final extensions, flags listed collisions and leaves input untouched', () => {
  const input = { names: ['archive.tar.gz', '.env', 'README'], existingNames: ['DOC-01.gz'], prefix: 'doc-', start: 1, pad: 2, keepExtension: true };
  const original = JSON.stringify(input);
  const out = result('file-rename-preview', input);
  assert.deepEqual(out.renames.map(r => [r.from, r.to]), [['archive.tar.gz', 'doc-01.gz'], ['.env', 'doc-02'], ['README', 'doc-03']]);
  assert.equal(out.hasListedCollisions, true);
  assert.equal(out.renames[0].conflicts.length, 1);
  assert.equal(JSON.stringify(input), original);
  assert.equal(result('file-rename-preview', { ...input, existingNames: [] }).hasListedCollisions, false);
  assert.equal(result('file-rename-preview', { ...input, existingNames: [], keepExtension: false }).renames[0].to, 'doc-01');
});

test('file preview catches targets occupied by selected files and case or Unicode ambiguities', () => {
  const base = { names: ['doc-02.txt', 'other.txt'], existingNames: [], prefix: 'doc-', start: 1, pad: 2, keepExtension: true };
  const out = result('file-rename-preview', base);
  assert.equal(out.hasListedCollisions, true);
  assert.match(out.renames[1].conflicts[0], /already occupies/);
  assert.equal(result('file-rename-preview', { ...base, names: ['doc-01.txt'] }).hasListedCollisions, false);
  for (const names of [['A.txt', 'a.txt'], ['é.txt', 'e\u0301.txt']]) assert.throws(() => result('file-rename-preview', { ...base, names }), /distinct/);
});

test('file preview rejects paths, reserved names, malformed config and unsafe output names', () => {
  const base = { names: ['input.txt'], existingNames: [], prefix: 'file-', start: 0, pad: 3, keepExtension: true };
  for (const name of ['../x', 'C:\\x.txt', 'CON.txt', 'LPT¹.log', 'last.', 'last ', '\u0000', '', 'a'.repeat(256)]) assert.throws(() => result('file-rename-preview', { ...base, names: [name] }));
  for (const prefix of ['folder/', 'a'.repeat(255), '?', 'x\u0001']) assert.throws(() => result('file-rename-preview', { ...base, prefix }));
  for (const change of [{ pad: 0 }, { pad: 13 }, { start: -1 }, { start: 0.1 }, { keepExtension: 'true' }, { existingNames: null }]) assert.throws(() => result('file-rename-preview', { ...base, ...change }));
});
