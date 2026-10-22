// Read-only public release checks. Authenticated storage is checked through the UI.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const [environment, directory] = process.argv.slice(2);
assert(['staging', 'production'].includes(environment));
const origin = environment === 'production' ? 'https://useaiblocks.com' : 'https://ai-building-blocks-staging.kevinmark7498.workers.dev';
const preview = environment === 'staging' ? JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN : null;
const headers = preview ? { 'x-preview-access': preview } : {};
const checks = [];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
for (const [route, file] of [['/minds', 'minds.html'], ['/compose', 'compose.html'], ['/privacy', 'privacy.html']]) {
  const response = await fetch(origin + route, { headers, signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, route);
  assert.equal(sha(Buffer.from(await response.arrayBuffer())), sha(await fs.readFile(path.join(directory, file))), route + ' must match the tested release');
  checks.push(route + ' matches frozen release');
}
for (const [method, authorization] of [['GET', null], ['PUT', null], ['GET', 'Bearer invalid-account-minds-check']]) {
  const response = await fetch(origin + '/api/minds?user_id=another-user', { method, headers: { ...headers, ...(authorization ? { authorization } : {}), ...(method === 'PUT' ? { 'content-type': 'application/json' } : {}) }, ...(method === 'PUT' ? { body: JSON.stringify({ revision: 0, minds: [] }) } : {}), signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 401, method + ' must require a verified account');
  assert.match(response.headers.get('cache-control') || '', /no-store/);
  const data = await response.json();
  assert.equal(typeof data.error, 'string');
  assert(!('minds' in data));
  checks.push(method + (authorization ? ' forged credential' : ' anonymous') + ' denied without private profiles');
}
const report = { checkedOn: new Date().toISOString(), environment, origin, status: 'pass', checks, providerCalls: 0, authenticatedUI: 'Reported separately; these checks do not access user records.' };
await fs.writeFile(`reports/2026-10-22-account-minds-${environment}-public.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ environment, passed: checks.length }));
