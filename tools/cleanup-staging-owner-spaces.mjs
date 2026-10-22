// Delete only the two verified empty synthetic staging spaces after API checks.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
assert.equal(process.argv[2], '--delete-empty-fixtures');
const base = stagingTarget();
assert.equal(base, 'https://ai-building-blocks-staging.kevinmark7498.workers.dev');
const account = '31c814d2c58a11163d3187f505f0b9c5';
const database = 'eeb9d0d4-cbed-4751-8df4-1aaf81fd6cb3';
const tag = 'Staging launch verification owner-20261022';
const expectedIds = new Set(['ba6b1cdf-16fc-4073-a9ef-df7d6954c98a', '55669f7a-6a03-4a1d-b355-6a323e629c33']);
const release = JSON.parse(await fs.readFile('reports/cloudflare-live-release.json', 'utf8'));
for (const file of ['cloudflare-staging-real-writes.json', 'cloudflare-staging-api-check.json']) {
  const report = JSON.parse(await fs.readFile('reports/' + file, 'utf8'));
  assert.equal(report.status, 'pass', 'Finish positive checks before removing their fixtures.');
  assert.equal(report.deployedVersion, release.staging.versionId);
  assert.equal(report.productionTouched, false);
}
const credential = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
const token = credential.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1];
assert(token);
async function query(sql, params) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`, { method: 'POST', redirect: 'error', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify({ sql, params }), signal: AbortSignal.timeout(30000) });
  const body = await response.json();
  assert(response.ok && body.success && body.result?.length === 1 && body.result[0].success, 'Staging cleanup query failed.');
  return body.result[0];
}
const rows = (await query('SELECT id,name,created FROM spaces WHERE name=? ORDER BY created LIMIT 3', [tag])).results;
assert(rows.length <= 2, 'Unexpected extra synthetic spaces; inspect before deleting.');
for (const row of rows) {
  assert(expectedIds.has(row.id) && row.name === tag && row.created.startsWith('2026-10-22'), 'Only the verified synthetic staging records may be removed.');
  const items = (await query('SELECT COUNT(*) AS count FROM space_items WHERE space_id=?', [row.id])).results;
  assert.equal(items[0].count, 0, 'Preserve nonempty spaces; finish fixture cleanup first.');
}
const comments = (await query('SELECT id,hidden FROM comments WHERE slug=? AND body=? ORDER BY at LIMIT 3', ['website-brand-brain-builder', tag])).results;
assert(comments.length <= 2);
for (const comment of comments) {
  assert(['0ea164e7-64ff-452c-8d65-c294dcb87832', 'd08854bb-210a-4b0c-97a4-1f527357fff0'].includes(comment.id));
  assert.equal(comment.hidden, 1, 'The hosting check must hide both synthetic comments first.');
}
let deleted = 0;
for (const row of rows) {
  const result = await query('DELETE FROM spaces WHERE id=? AND name=? AND NOT EXISTS (SELECT 1 FROM space_items WHERE space_id=spaces.id)', [row.id, tag]);
  assert.equal(result.meta.changes, 1, 'Concurrent state changed; stop without deleting nonempty records.');
  deleted++;
}
assert.equal((await query('SELECT COUNT(*) AS count FROM spaces WHERE name=?', [tag])).results[0].count, 0);
// These credentials belonged only to the removed test spaces. Production and
// environment credentials remain untouched. No recursive filesystem deletion.
let privateFixtureFilesRemoved = 0;
for (const name of ['staging-live-fixtures.json', 'staging-owner-link.txt']) {
  try { await fs.unlink(path.resolve('site/.wrangler', name)); privateFixtureFilesRemoved++; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const report = { checkedOn: new Date().toISOString(), deployedVersion: release.staging.versionId, environment: base, status: 'pass', productionTouched: false, providerCalls: 0, exactSyntheticTag: tag, emptySpacesDeleted: deleted, syntheticCommentsAlreadyHidden: comments.length, remainingExactTagSpaces: 0, privateFixtureFilesRemoved };
await fs.writeFile('reports/cloudflare-staging-fixture-cleanup.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
