import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicProjection, parseD1Readback, compareReadback, validateCapture, retryDelay, waitForRelease } from './wait-ecommerce-release.mjs';

const profile = { id: 'sample-agent', kind: 'house', name: 'Sample', title: 'Current title', outcomes: [], samples: [] };
const expected = [{ id: profile.id, hash: 'a'.repeat(64), public: publicProjection(profile) }];
const receipt = (hash = expected[0].hash) => [{ success: true, results: [{ id: profile.id, kind: 'house', status: 'live', content_hash: hash }] }];
const origin = 'https://agents.useaiblocks.com';
function fixture({ actual = profile, ids = [profile.id], d1 = receipt() } = {}) {
  let clock = 0;
  const calls = [];
  return { calls, options: { expected, origin, timeoutMs: 10_000, intervalMs: 1000, now: () => clock, sleep: async ms => { clock += ms; }, readD1: async () => d1,
    fetchImpl: async (url, opts) => { calls.push({ url, opts, at: clock }); return { status: 200, json: async () => url.pathname === '/api/agents' ? { total: ids.length, agents: ids.map(id => ({ id })) } : { agent: actual } }; },
  } };
}
test('exact IDs, projected public content and seeded full-profile hashes are all required', async () => {
  const f = fixture();
  assert.equal((await waitForRelease(f.options)).status, 'READY');
  assert.ok(f.calls.every(c => c.opts.method === 'GET' && c.opts.redirect === 'error'));
  for (const f of [fixture({ ids: ['wrong-agent'] }), fixture({ actual: { ...profile, title: 'Old title' } }), fixture({ d1: receipt('b'.repeat(64)) })]) {
    const result = await waitForRelease(f.options);
    assert.equal(result.status, 'TIMEOUT');
    assert.ok(result.issues.length);
  }
});
test('same-count stale hidden methods cannot pass, and missing readback is explicitly uncertified', async () => {
  const old = fixture({ d1: receipt('b'.repeat(64)) });
  assert.equal((await waitForRelease(old.options)).databaseReady, false);
  const f = fixture();
  delete f.options.readD1;
  assert.equal((await waitForRelease(f.options)).status, 'PUBLIC_CURRENT_PRIVATE_UNVERIFIED');
});
test('fresh captures can replace stale hashes during bounded polling', async () => {
  const f = fixture(); let attempts = 0;
  f.options.readD1 = async () => ++attempts === 1 ? receipt('b'.repeat(64)) : receipt();
  const result = await waitForRelease(f.options);
  assert.equal(result.status, 'READY'); assert.equal(result.attempts, 2);
});
test('D1 wrapper parsing rejects errors, duplicate IDs, expert rows and missing hashes', () => {
  assert.equal(parseD1Readback(receipt()).size, 1);
  for (const doc of [[{ success: false, results: [] }], [{ success: true, results: [...receipt()[0].results, ...receipt()[0].results] }], [{ results: [{ ...receipt()[0].results[0], kind: 'expert' }] }], [{ results: [{ id: profile.id }] }]]) assert.throws(() => parseD1Readback(doc));
  assert.equal(compareReadback(expected, [{ results: [] }])[0].reason, 'missing_seeded_row');
});
test('capture binding rejects wrong databases, predeployment captures, future or stale files', () => {
  const now = Date.parse('2026-11-18T08:20:00Z');
  const valid = { origin, database: 'ai-blocks-agents', deployedAt: '2026-11-18T08:14:00Z', modifiedAt: now - 60_000, now };
  validateCapture(valid);
  for (const over of [{ database: 'ai-blocks-agents-staging' }, { modifiedAt: now - 600_000 }, { modifiedAt: now + 60_000 }, { deployedAt: '2026-11-18T07:00:00Z', modifiedAt: now - 2_000_000 }]) assert.throws(() => validateCapture({ ...valid, ...over }));
});
test('all GET starts are globally paced and Retry-After pauses the same request before retrying', async () => {
  const f = fixture();
  const original = f.options.fetchImpl;
  let limited = false;
  f.options.fetchImpl = async (url, opts) => {
    const response = await original(url, opts);
    if (url.pathname !== '/api/agents' && !limited) { limited = true; return { status: 429, headers: new Headers({ 'retry-after': '3' }) }; }
    return response;
  };
  const result = await waitForRelease(f.options);
  assert.equal(result.status, 'READY');
  assert.equal(result.rateLimitRetries, 1);
  assert.deepEqual(f.calls.map(c => c.at), [0, 1100, 4100]);
  assert.equal(f.calls[1].url.pathname, f.calls[2].url.pathname);
});
test('a long rate-limit delay stops at the deadline without a retry storm', async () => {
  const f = fixture();
  const original = f.options.fetchImpl;
  f.options.fetchImpl = async (url, opts) => { await original(url, opts); return { status: 429, headers: new Headers({ 'retry-after': '600' }) }; };
  const result = await waitForRelease(f.options);
  assert.equal(result.status, 'TIMEOUT');
  assert.equal(f.calls.length, 1);
  assert.equal(result.elapsedMs, 10_000);
  assert.equal(retryDelay(undefined, 0), 60_000);
  assert.equal(retryDelay('Thu, 01 Jan 1970 00:00:05 GMT', 1000), 4000);
});
test('a successful profile response reaching the deadline cannot pass an incomplete roster', async () => {
  let clock = 0;
  const second = { ...profile, id: 'second-agent' };
  const two = [...expected, { id: second.id, hash: 'b'.repeat(64), public: publicProjection(second) }];
  const requested = [];
  const result = await waitForRelease({ expected: two, origin, timeoutMs: 2000, intervalMs: 1000, now: () => clock, sleep: async ms => { clock += ms; },
    readD1: async () => [{ success: true, results: two.map(p => ({ id: p.id, kind: 'house', status: 'live', content_hash: p.hash })) }],
    fetchImpl: async url => {
      requested.push(url.pathname);
      return { status: 200, json: async () => {
        if (url.pathname === '/api/agents') return { total: 2, agents: two.map(p => ({ id: p.id })) };
        clock = 2000;
        return { agent: profile };
      } };
    },
  });
  assert.equal(result.status, 'TIMEOUT');
  assert.equal(result.databaseReady, true);
  assert.equal(result.publicReady, false);
  assert.equal(result.profilesChecked, 1);
  assert.ok(result.issues.some(x => x.reason === 'profile_checks_incomplete'));
  assert.deepEqual(requested, ['/api/agents', '/api/agents/sample-agent']);
});
