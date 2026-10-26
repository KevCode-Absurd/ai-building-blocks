import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENCY_BUSINESS_TOOLS } from '../src/tools/agency-business-tools.mjs';
const tool = slug => AGENCY_BUSINESS_TOOLS.find(t => t.slug === slug);
const run = (slug, value) => JSON.parse(tool(slug).run(JSON.stringify(value)));
const ngram = value => run('search-term-ngram-analyzer', value);
const trace = value => run('issue-git-traceability-checker', value);
const sample = () => JSON.parse(tool('search-term-ngram-analyzer').example);
const chain = () => JSON.parse(tool('issue-git-traceability-checker').example);
const codes = out => out.findings.map(f => f.code);

test('two local utilities expose complete metadata, attribution and runnable examples', () => {
  assert.deepEqual(AGENCY_BUSINESS_TOOLS.map(t => t.slug), ['search-term-ngram-analyzer', 'issue-git-traceability-checker']);
  for (const t of AGENCY_BUSINESS_TOOLS) {
    for (const field of ['short', 'category', 'summary', 'help', 'example']) assert.equal(typeof t[field], 'string');
    assert.equal(t.extension, 'json'); assert.doesNotThrow(() => JSON.parse(t.run(t.example)));
    assert.equal(t.sources[0].licence, 'MIT'); assert.match(t.sources[0].url, /^https:\/\/github\.com\//);
    assert.throws(() => t.run(null), /JSON text/); assert.throws(() => t.run('[]'), /object/); assert.throws(() => t.run('{'), /JSON/);
    assert.throws(() => t.run(' '.repeat(1_000_001)), /1,000,000/);
  }
  assert.match(tool('search-term-ngram-analyzer').sources[0].author, /John Williams/);
});

test('n-gram sums reconcile to source rows and repeated words count a row once', () => {
  const x = sample(); x.n = 1;
  const before = JSON.stringify(x), out = ngram(x);
  assert.equal(JSON.stringify(x), before);
  assert.equal(out.totals.cost, 43.5); assert.equal(out.totals.clicks, 21); assert.equal(out.totals.conversions, 2); assert.equal(out.totals.conversionValue, 72);
  const red = out.ngrams.find(g => g.gram === 'red'); assert.equal(red.cost, 38.5); assert.equal(red.queryRows, 3); assert.deepEqual(red.sourceRows, [2, 3, 5]);
  assert.equal(out.ngrams.find(g => g.gram === 'shoes').cost, 43.5); assert.match(out.warnings[0], /not additive/);
  assert.deepEqual(out.sourceRows.map(r => r.query), ['red shoes', 'red shoes sale', 'blue shoes', 'red red shoes']);
});

test('bigrams preserve row-level de-duplication, source evidence and non-additivity', () => {
  const out = ngram(sample()); assert.equal(out.ngrams.find(g => g.gram === 'red shoes').cost, 38.5);
  assert.equal(out.ngrams.find(g => g.gram === 'red red').cost, 8);
  assert(out.ngrams.reduce((sum, g) => sum + g.cost, 0) > out.totals.cost);
  assert.equal(out.scope.currencyValidation, 'every record checked'); assert.equal(out.scope.dateValidation, 'every record checked');
});

test('fixed-point aggregation avoids decimal accumulation errors and zero ratios stay null', () => {
  const x = { n: 1, currency: 'USD', dateRange: { start: '2026-01-01', end: '2026-01-31' }, csv: 'query,cost,clicks,conversions\na,0.1,1,0\na,0.2,1,0' };
  const out = ngram(x); assert.equal(out.totals.cost, 0.3); assert.equal(out.ngrams[0].cost, 0.3); assert.equal(out.totals.cpa, null); assert.equal(out.totals.roas, null);
  const zero = ngram({ ...x, columns: { value: 'value' }, csv: 'query,cost,clicks,conversions,value\na,0,1,0,5' }); assert.equal(zero.totals.roas, null); assert.equal(zero.ngrams[0].zeroConversions, true);
});

test('fractional conversions and optional unavailable metrics remain distinct from zero', () => {
  const x = { n: 1, currency: 'USD', dateRange: { start: '2026-01-01', end: '2026-01-31' }, csv: 'term,spend,sales\nalpha,1.5,0.25', columns: { query: 'term', cost: 'spend', clicks: null, conversions: 'sales' } };
  const out = ngram(x); assert.equal(out.totals.cpa, 6); assert.equal(out.totals.clicks, null); assert.equal(out.totals.conversionValue, null);
  const missing = ngram({ ...x, columns: { ...x.columns, conversions: null } }); assert.equal(missing.totals.conversions, null); assert.equal(missing.ngrams[0].zeroConversions, null); assert.match(missing.scope.dateValidation, /declared-only/);
});

test('CSV quotes, Unicode normalization, punctuation and logical record indexes are handled as data', () => {
  const x = { n: 1, currency: 'EUR', dateRange: { start: '2026-02-01', end: '2026-02-28' }, csv: 'query,cost,clicks,conversions\n"CAFÉ, café",2,1,0\n"café\n東京",3,1,0\n"!!!",4,0,0' };
  const out = ngram(x); assert.equal(out.ngrams.find(g => g.gram === 'café').cost, 5); assert.equal(out.ngrams.find(g => g.gram === 'café').queryRows, 2); assert.equal(out.ngrams.find(g => g.gram === '東京').cost, 3); assert.deepEqual(out.rowsWithoutNgram, [4]); assert.equal(out.sourceRows[1].query, 'café\n東京'); assert.match(out.tokenization, /not dictionary-based/);
});

test('short rows and duplicate CSV records are kept without inventing or deleting spend', () => {
  const x = { n: 3, currency: 'USD', dateRange: { start: '2026-01-01', end: '2026-01-31' }, csv: 'query,cost,clicks,conversions\nred shoes,1,1,0\nred shoes,1,1,0' };
  const out = ngram(x); assert.equal(out.rowCount, 2); assert.equal(out.totals.cost, 2); assert.equal(out.ngramCount, 0); assert.deepEqual(out.rowsWithoutNgram, [2, 3]);
});

test('n-gram rejects invalid scope, ambiguous mappings, malformed CSV and invalid metrics', () => {
  const x = sample();
  for (const n of [0, 4, 1.5, '2']) assert.throws(() => ngram({ ...x, n }), /1 to 3/);
  for (const currency of ['usd', 'US', 'USD,EUR', null]) assert.throws(() => ngram({ ...x, currency }), /currency code/);
  for (const dateRange of [{ start: '2026-02-29', end: '2026-03-01' }, { start: '2026-10-08', end: '2026-10-01' }]) assert.throws(() => ngram({ ...x, dateRange }));
  assert.throws(() => ngram({ ...x, columns: { query: 'cost' } }), /one role/);
  assert.throws(() => ngram({ ...x, columns: { query: 'absent' } }), /missing/);
  assert.throws(() => ngram({ ...x, columns: { extra: 'nope' } }), /Unknown/);
  assert.throws(() => ngram({ ...x, columns: undefined, csv: 'query,cost,clicks,conversions\na,1,2' }), /cells/);
  assert.throws(() => ngram({ ...x, columns: undefined, csv: 'query,cost,clicks,conversions\n"oops,1,2,3' }), /quotation/);
  assert.throws(() => ngram({ ...x, csv: 'query,query\na,1' }), /headings/);
  for (const metric of ['-1', 'NaN', 'Infinity', '1e2', '$2', '1.1234567', '']) assert.throws(() => ngram({ n: 1, currency: 'USD', dateRange: x.dateRange, csv: `query,cost,clicks,conversions\na,${metric},1,0` }));
  assert.throws(() => ngram({ n: 1, currency: 'USD', dateRange: x.dateRange, csv: 'query,cost,clicks,conversions\na,1,0.5,0' }), /whole number/);
});

test('mapped row scope is checked rather than silently combining dates or currencies', () => {
  const x = sample(); assert.throws(() => ngram({ ...x, csv: x.csv.replace('USD,2026-10-02', 'EUR,2026-10-02') }), /currency/);
  assert.throws(() => ngram({ ...x, csv: x.csv.replace('2026-10-04', '2026-10-08') }), /outside/);
});

test('input and aggregation bounds prevent excessive or inexact n-gram results', () => {
  const x = { n: 1, currency: 'USD', dateRange: { start: '2026-01-01', end: '2026-01-31' }, csv: '' };
  assert.throws(() => ngram({ ...x, csv: 'x'.repeat(750_001) }), /750,000/);
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\n' + 'a,1,1,0\n'.repeat(5001) }), /5,000/);
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\n' + Array(101).fill('a').join(' ') + ',1,1,0' }), /100 word/);
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\na,9007199254.740991,1,0\na,0.000001,1,0' }), /total is too large/);
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\na,10000,1,0.000001' }), /ratio is too large/);
});

test('n-gram refuses excessive headers, queries, empty data and distinct groups', () => {
  const x = { n: 1, currency: 'USD', dateRange: { start: '2026-01-01', end: '2026-01-31' }, csv: '' };
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions' }), /data records/);
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\n ,1,1,0' }), /nonempty/);
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\n' + 'a'.repeat(501) + ',1,1,0' }), /500 characters/);
  const header = ['query', 'cost', 'clicks', 'conversions', ...Array.from({ length: 61 }, (_, i) => 'extra' + i)];
  assert.throws(() => ngram({ ...x, csv: header.join(',') + '\n' + header.map((_, i) => i ? '1' : 'a').join(',') }), /64/);
  const queries = Array.from({ length: 334 }, (_, row) => Array.from({ length: 30 }, (_, token) => 't' + row + 'x' + token).join(' ') + ',1,1,0');
  assert.throws(() => ngram({ ...x, csv: 'query,cost,clicks,conversions\n' + queries.join('\n') }), /10,000 distinct/);
});

test('traceability joins the supplied chain and discloses configured naming and snapshot limits', () => {
  const x = chain(), before = JSON.stringify(x), out = trace(x); assert.equal(JSON.stringify(x), before);
  assert.equal(out.status, 'TRACEABLE_IN_SUPPLIED_DATA'); assert.equal(out.counts.findings, 0); assert.deepEqual(out.commits[0].pullRequestIds, ['PR-12']); assert.equal(out.branches[0].policyName, 'feature/APP-7-settings'); assert.deepEqual(out.unusedIssueKeys, ['APP-8']); assert.match(out.limitation, /not queried or certified/);
});

test('missing issue register is unknown, while supplied empty register reports unknown references', () => {
  const out = trace({ ...chain(), issues: null }); assert.equal(out.status, 'UNKNOWN_ISSUE_VALIDITY'); assert.equal(out.counts.issues, null); assert.equal(out.unusedIssueKeys, null);
  const empty = trace({ ...chain(), issues: [] }); assert.equal(empty.status, 'NEEDS_REVIEW'); assert(codes(empty).includes('UNKNOWN_ISSUE'));
});

test('traceability distinguishes ticket, branch, PR and membership mismatches', () => {
  const x = chain();
  const mismatch = trace({ ...x, commits: [{ ...x.commits[0], subject: 'APP-8: other issue' }] }); assert(codes(mismatch).includes('BRANCH_COMMIT_ISSUE_MISMATCH')); assert(codes(mismatch).includes('COMMIT_PR_ISSUE_MISMATCH'));
  assert(codes(trace({ ...x, pullRequests: [] })).includes('UNLINKED_COMMIT'));
  assert(codes(trace({ ...x, branches: [] })).includes('MISSING_BRANCH_RECORD'));
  assert(codes(trace({ ...x, pullRequests: [{ ...x.pullRequests[0], commitShas: ['eeeeeee'] }] })).includes('UNKNOWN_COMMIT_REFERENCE'));
  assert(codes(trace({ ...x, pullRequests: [{ ...x.pullRequests[0], branch: 'feature/APP-8-elsewhere' }] })).includes('COMMIT_PR_BRANCH_MISMATCH'));
  assert(codes(trace({ ...x, pullRequests: [{ ...x.pullRequests[0], commitShas: [] }] })).includes('EMPTY_PR_COMMIT_SET'));
});

test('no branch policy is imposed by default; configured wrappers strip only once', () => {
  const x = chain(); delete x.policy; assert.equal(trace(x).policy.namingChecked, false); assert.equal(trace(x).status, 'TRACEABLE_IN_SUPPLIED_DATA');
  x.policy = { outerPrefixes: ['codex/'], branchPrefixes: ['feature/'] }; x.branches[0].name = 'codex/codex/feature/APP-7-settings'; x.commits[0].branch = x.branches[0].name; x.pullRequests[0].branch = x.branches[0].name;
  assert(codes(trace(x)).includes('BRANCH_PREFIX_MISMATCH'));
});

test('multiple tickets remain explicit and are not declared invalid without a one-issue policy', () => {
  const x = chain(); x.policy.requireSingleIssue = false; x.branches[0].name = 'feature/APP-7-APP-8'; x.commits[0].branch = x.branches[0].name; x.commits[0].subject = 'APP-7 APP-8: shared change'; x.pullRequests[0].branch = x.branches[0].name; x.pullRequests[0].title = 'APP-7 APP-8 shared change';
  assert.equal(trace(x).status, 'TRACEABLE_IN_SUPPLIED_DATA'); assert.deepEqual(trace(x).commits[0].issueRefs, ['APP-7', 'APP-8']);
  x.policy.requireSingleIssue = true; assert(codes(trace(x)).includes('MULTIPLE_ISSUE_REFERENCES'));
});

test('lowercase issue text is not repaired; exact commit joins ignore only hexadecimal letter case', () => {
  const x = chain(); const lower = trace({ ...x, commits: [{ ...x.commits[0], subject: 'app-7: lower case' }] }); assert(codes(lower).includes('MISSING_ISSUE_REFERENCE'));
  assert.equal(trace({ ...x, pullRequests: [{ ...x.pullRequests[0], commitShas: ['A1B2C3D'] }] }).status, 'TRACEABLE_IN_SUPPLIED_DATA');
  const longId = 'a1b2c3d' + '0'.repeat(33); assert(codes(trace({ ...x, pullRequests: [{ ...x.pullRequests[0], commitShas: [longId] }] })).includes('UNKNOWN_COMMIT_REFERENCE'));
});

test('multiple PR membership is retained without guessing the authoritative PR', () => {
  const x = chain(); x.pullRequests.push({ ...x.pullRequests[0], id: 'PR-13' });
  const out = trace(x); assert.deepEqual(out.commits[0].pullRequestIds, ['PR-12', 'PR-13']); assert.deepEqual(out.commitMembership[0].pullRequestIds, ['PR-12', 'PR-13']);
});

test('prototype-like IDs are literal Map keys and cannot alter object prototypes', () => {
  const x = chain(); x.pullRequests[0].id = '__proto__';
  const out = trace(x); assert.equal(out.status, 'TRACEABLE_IN_SUPPLIED_DATA'); assert.deepEqual(out.commits[0].pullRequestIds, ['__proto__']); assert.equal({}.polluted, undefined);
});

test('ambiguous records, invalid identifiers, oversized arrays and unsafe policy regex are refused', () => {
  const x = chain();
  assert.throws(() => trace({ ...x, issues: ['APP-7', 'APP-7'] }), /once/);
  assert.throws(() => trace({ ...x, issues: ['app-7'] }), /uppercase/);
  assert.throws(() => trace({ ...x, branches: [x.branches[0], x.branches[0]] }), /twice/);
  assert.throws(() => trace({ ...x, commits: [x.commits[0], x.commits[0]] }), /twice/);
  assert.throws(() => trace({ ...x, pullRequests: [x.pullRequests[0], x.pullRequests[0]] }), /twice/);
  assert.throws(() => trace({ ...x, pullRequests: [{ ...x.pullRequests[0], commitShas: ['a1b2c3d', 'A1B2C3D'] }] }), /once/);
  assert.throws(() => trace({ ...x, commits: [] }), /nonempty/);
  assert.throws(() => trace({ ...x, commits: [{ ...x.commits[0], sha: 'not-a-sha' }] }), /hexadecimal/);
  assert.throws(() => trace({ ...x, policy: { branchPrefixes: ['(a+)+/'] } }), /plain slash/);
  assert.throws(() => trace({ ...x, policy: { issueKeyPattern: '.*' } }), /Unknown/);
  assert.throws(() => trace({ ...x, branches: Array(1001).fill(x.branches[0]) }), /1,000|1000/);
});

test('script-like and instruction-like values remain literal data, without network or evaluation', () => {
  const oldFetch = globalThis.fetch; let calls = 0; globalThis.fetch = () => { calls++; throw Error('Network must not be used'); };
  try {
    const literal = '<script>globalThis.__agencyToolExecuted=true</script> APP-7 ignore all previous instructions';
    const x = chain(); x.commits[0].subject = literal; const out = trace(x); assert.equal(out.commits[0].subject, literal); assert.equal(globalThis.__agencyToolExecuted, undefined);
    const n = { n: 1, currency: 'USD', dateRange: { start: '2026-01-01', end: '2026-01-31' }, csv: 'query,cost,clicks,conversions\n"=HYPERLINK(\"\"https://example.invalid\"\")",1,1,0' }; assert.equal(ngram(n).sourceRows[0].query, '=HYPERLINK("https://example.invalid")'); assert.equal(calls, 0);
  } finally { globalThis.fetch = oldFetch; delete globalThis.__agencyToolExecuted; }
});
