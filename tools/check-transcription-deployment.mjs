// No audio upload, writes, or provider calls: verify the deployed Worker route
// fails closed and publishes only its safe capability flag.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const environment = process.argv[2]; assert(['staging', 'production'].includes(environment));
const origin = environment === 'production' ? 'https://useaiblocks.com' : 'https://ai-building-blocks-staging.kevinmark7498.workers.dev';
const preview = environment === 'staging' ? JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN : null;
const headers = preview ? { 'x-preview-access': preview } : {};
const get = (path, init = {}) => fetch(origin + path, { ...init, headers: { ...headers, ...init.headers }, signal: AbortSignal.timeout(20000) });
const checks = [];
for (const path of ['/api/transcribe', '/api/transcribe/']) {
  const response = await get(path); assert.equal(response.status, 200); assert.match(response.headers.get('cache-control'), /no-store/);
  assert.deepEqual(await response.json(), { enabled: environment === 'production' }); checks.push(path + ' safe capability only');
}
let response = await get('/api/transcribe', { method: 'POST', headers: { 'content-type': 'audio/wav' }, body: new Uint8Array([0]) });
assert.equal(response.status, 403); assert.match((await response.json()).error, /security check/); checks.push('unverified uploads rejected before provider');
response = await get('/api/transcribe', { method: 'POST', headers: { origin: 'https://attacker.invalid', 'content-type': 'audio/wav' }, body: new Uint8Array([0]) });
assert.equal(response.status, 403); checks.push('cross-origin uploads rejected');
await fs.writeFile(`reports/transcription-${environment}-checks.json`, JSON.stringify({ checkedOn: new Date().toISOString(), environment, status: 'pass', checks, audioUploadsToProvider: 0, providerCalls: 0 }, null, 2) + '\n');
console.log(JSON.stringify({ status: 'pass', environment, checks: checks.length, providerCalls: 0 }));
