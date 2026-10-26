import test from 'node:test';
import assert from 'node:assert/strict';
import {AGENCY_RESEARCH_TOOLS, calculatePopulationShift, checkCitationLineage} from '../src/tools/agency-research-tools.mjs';
const psi = x => JSON.parse(calculatePopulationShift(JSON.stringify(x)));
const lineage = x => JSON.parse(checkCitationLineage(JSON.stringify(x)));
const near = (a, b, tolerance = 1e-12) => assert(Math.abs(a - b) <= tolerance, `${a} differs from ${b}`);
const population = (baseline, current, pseudocount = 0) => ({ pseudocount, buckets: baseline.map((value, i) => ({ label: `bucket-${i}`, baseline: value, current: current[i] })) });

test('PSI refuses fractional counts rounded to whole numbers and nonzero numeric underflow', () => {
  for(const token of ['1000000000000.00001','1e-999'])assert.throws(()=>calculatePopulationShift(`{"buckets":[{"label":"A","baseline":${token},"current":1},{"label":"B","baseline":1,"current":1}]}`),/digits survive|precision/);
  assert.throws(()=>calculatePopulationShift('{"pseudocount":1e-999,"buckets":[{"label":"A","baseline":1,"current":1},{"label":"B","baseline":1,"current":1}]}'),/digits survive|precision/);
});

test('PSI matches a hand-calculated two-bucket result and its components', () => {
  const r = psi(population([80, 20], [60, 40]));
  near(r.buckets[0].contribution, 0.05753641449035616);
  near(r.buckets[1].contribution, 0.13862943611198906);
  near(r.totalPSI, 0.1961658506023452);
  near(r.totalPSI, r.buckets.reduce((sum, b) => sum + b.contribution, 0));
  assert.deepEqual(r.totals, { baseline: 100, current: 100, smoothedBaseline: 100, smoothedCurrent: 100 });
});
test('PSI identity, symmetry and bucket ordering are preserved', () => {
  assert.equal(psi(population([0, 10, 30], [0, 10, 30], 0.5)).totalPSI, 0);
  const a = psi(population([80, 20], [60, 40], 0.5));
  near(a.totalPSI, psi(population([60, 40], [80, 20], 0.5)).totalPSI);
  near(a.totalPSI, psi(population([20, 80], [40, 60], 0.5)).totalPSI);
});
test('PSI scaling behavior is explicit for count-based smoothing', () => {
  near(psi(population([80, 20], [60, 40], 0)).totalPSI, psi(population([800, 200], [600, 400], 0)).totalPSI);
  near(psi(population([80, 20], [60, 40], 0.5)).totalPSI, psi(population([800, 200], [600, 400], 5)).totalPSI);
  assert.notEqual(psi(population([8, 2], [6, 4], 0.5)).totalPSI, psi(population([80, 20], [60, 40], 0.5)).totalPSI);
  const equalRaw = psi(population([8, 2], [80, 20], 0.5));
  assert.equal(equalRaw.rawSharesEqual, true); assert(equalRaw.totalPSI > 0); assert.match(equalRaw.smoothingNote, /unequal sample totals/);
});
test('PSI handles zero cells honestly and exposes its default pseudocount', () => {
  const r = psi({ buckets: [{ label: 'A', baseline: 10, current: 0 }, { label: 'B', baseline: 0, current: 10 }] });
  assert.equal(r.settings.pseudocountPerBucket, 0.5); assert.equal(r.settings.defaultUsed, true); assert(Number.isFinite(r.totalPSI));
  near(r.buckets.reduce((sum, b) => sum + b.baselineShare, 0), 1);
  assert.throws(() => psi(population([10, 0], [0, 10], 0)), /one-sided zero/);
  const bothAbsent = psi(population([10, 0], [10, 0], 0)); assert.equal(bothAbsent.totalPSI, 0); assert.equal(bothAbsent.buckets[1].contribution, 0);
});
test('PSI rejects malformed, empty, duplicated, nonfinite and unsafe counts', () => {
  assert.throws(() => calculatePopulationShift('[]'), /JSON object/);
  assert.throws(() => calculatePopulationShift('{'), /valid JSON/);
  assert.throws(() => psi({ buckets: [] }), /nonempty/);
  assert.throws(() => psi(population([1], [1])), /at least two/);
  assert.throws(() => psi(population([0, 0], [1, 1])), /positive total/);
  assert.throws(() => psi({ buckets: [{ label: 'A', baseline: 1, current: 1 }, { label: 'A', baseline: 2, current: 2 }] }), /distinct/);
  for (const value of [-1, 1.5, Infinity, 1e13]) assert.throws(() => psi(population([value, 2], [1, 2])), /whole/);
  for (const value of [-1, Infinity, 1e7, '0.5']) assert.throws(() => psi(population([1, 2], [2, 1], value)), /pseudocount/);
});
test('two derivative citations converging on one supplied origin remain one origin', () => {
  const r = lineage({ sources: [{ id: 'P', title: 'Primary', confirmedOrigin: true }, { id: 'A', title: 'Article A', derivedFrom: ['P'] }, { id: 'B', title: 'Article B', derivedFrom: ['P'] }], claims: [{ id: 'C', sourceIds: ['A', 'B'] }] });
  assert.equal(r.claims[0].citedSourceCount, 2); assert.equal(r.claims[0].knownSuppliedOriginCount, 1);
  assert.deepEqual(r.claims[0].originGroups, [{ originId: 'P', citedSourceIds: ['A', 'B'] }]); assert.equal(r.claims[0].allSuppliedBranchesResolved, true);
  assert.match(r.limitation, /does not prove/);
});
test('a parentless source does not become independent evidence implicitly', () => {
  const r = lineage({ sources: [{ id: 'blog', title: 'A parentless blog' }], claims: [{ sourceIds: ['blog'] }] });
  assert.equal(r.claims[0].knownSuppliedOriginCount, 0); assert.deepEqual(r.claims[0].unknownOriginSourceIds, ['blog']); assert.equal(r.claims[0].allSuppliedBranchesResolved, false);
});
test('multiple parents retain known supplied study IDs and unresolved branches', () => {
  const r = lineage({ sources: [{ id: 'A', title: 'A', primaryStudyIds: ['study-1'] }, { id: 'B', title: 'B', primaryStudyIds: ['study-2'] }, { id: 'U', title: 'Unknown origin' }, { id: 'D', title: 'Derivative', derivedFrom: ['A', 'B', 'U', 'absent'] }], claims: [{ sourceIds: ['D', 'missing-citation'] }] });
  assert.equal(r.claims[0].knownSuppliedOriginCount, 2); assert.deepEqual(r.claims[0].unknownOriginSourceIds, ['U']); assert.deepEqual(r.claims[0].unresolvedSourceIds, ['absent', 'missing-citation']); assert.equal(r.claims[0].allSuppliedBranchesResolved, false);
  assert.deepEqual(r.diagnostics.unknownDerivedFrom, [{ sourceId: 'D', targetId: 'absent' }]);
});
test('cycles, self-links and nodes leading into a cycle are distinguished', () => {
  const r = lineage({ sources: [{ id: 'A', title: 'A', derivedFrom: ['B'] }, { id: 'B', title: 'B', derivedFrom: ['A'] }, { id: 'C', title: 'C', derivedFrom: ['A'] }, { id: 'S', title: 'Self', confirmedOrigin: true, derivedFrom: ['S'] }], claims: [{ id: 'cycle', sourceIds: ['C'] }, { id: 'self', sourceIds: ['S'] }] });
  assert.deepEqual(r.diagnostics.cyclicSourceGroups, [['A', 'B'], ['S']]); assert.deepEqual(r.diagnostics.selfLinks, ['S']);
  assert.equal(r.claims[0].knownSuppliedOriginCount, 0); assert.equal(r.claims[0].allSuppliedBranchesResolved, false);
  assert.equal(r.claims[1].knownSuppliedOriginCount, 1); assert.equal(r.claims[1].allSuppliedBranchesResolved, false); assert.deepEqual(r.diagnostics.anchorsWithParents, ['S']);
});
test('same supplied study ID across distinct records is grouped without proving independence', () => {
  const r = lineage({ sources: [{ id: 'version-1', title: 'Version 1', primaryStudyIds: ['same-study'] }, { id: 'version-2', title: 'Version 2', primaryStudyIds: ['same-study'] }], claims: [{ sourceIds: ['version-1', 'version-2'] }] });
  assert.equal(r.claims[0].knownSuppliedOriginCount, 1); assert.match(r.interpretation, /not proven scientific independence/);
});
test('a confirmed primary record with an explicit study ID is not counted twice', () => {
  const r = lineage({ sources: [{ id: 'record-A', title: 'Study A', confirmedOrigin: true, primaryStudyIds: ['study-A'] }], claims: [{ sourceIds: ['record-A'] }] });
  assert.equal(r.claims[0].knownSuppliedOriginCount, 1);
  assert.deepEqual(r.claims[0].originGroups, [{ originId: 'study-A', citedSourceIds: ['record-A'] }]);
});
test('lineage rejects duplicate IDs, malformed edges and invalid anchor assertions', () => {
  assert.throws(() => lineage({ sources: [{ id: 'A', title: 'A' }, { id: 'A', title: 'B' }], claims: [] }), /appears twice/);
  assert.throws(() => lineage({ sources: [{ id: 'A', title: 'A', derivedFrom: ['X', 'X'] }], claims: [] }), /only once/);
  assert.throws(() => lineage({ sources: [{ id: 'A', title: 'A', confirmedOrigin: 'true' }], claims: [] }), /true or false/);
  assert.throws(() => lineage({ sources: [{ id: 'A', title: 'A' }], claims: [{ sourceIds: [] }] }), /nonempty/);
  assert.throws(() => lineage({ sources: [{ id: 'A', title: 'A' }], claims: [{ id: 'C', sourceIds: ['A'] }, { id: 'C', sourceIds: ['A'] }] }), /appears twice/);
});
test('both exported tools expose runnable local examples and source attribution', () => {
  assert.deepEqual(AGENCY_RESEARCH_TOOLS.map(t => t.slug), ['population-shift-calculator', 'citation-lineage-checker']);
  for (const tool of AGENCY_RESEARCH_TOOLS) { assert.equal(tool.extension, 'json'); assert.equal(tool.source.licence, 'MIT'); assert.doesNotThrow(() => JSON.parse(tool.run(tool.example))); }
});
