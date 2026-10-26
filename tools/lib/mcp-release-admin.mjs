// Isolated staging administration for synthetic acceptance fixtures. Never emits credentials/content.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
export const repo = path.resolve(import.meta.dirname, '../..');
export const stagingOrigin = 'https://ai-building-blocks-staging.kevinmark7498.workers.dev';
export const privateRoot = path.join(repo, 'site/.wrangler/mcp-release');
const account = '31c814d2c58a11163d3187f505f0b9c5', db = 'eeb9d0d4-cbed-4751-8df4-1aaf81fd6cb3';
await fs.mkdir(privateRoot, { recursive: true });
const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
export const digest = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(canonical(value))).digest('hex');
async function credential() { const s = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8'); const token = s.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(token, 'Cloudflare sign-in unavailable.'); return token; }
async function refresh() {
  const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, [path.join(repo, 'site/node_modules/wrangler/bin/wrangler.js'), 'whoami'], { cwd: path.join(repo, 'site'), windowsHide: true, stdio: 'ignore', env: { ...process.env, WRANGLER_LOG_PATH: path.join(privateRoot, 'auth-refresh.log'), WRANGLER_SEND_METRICS: 'false' } }); child.once('error', reject); child.once('exit', resolve); });
  assert.equal(code, 0, 'Existing Cloudflare session could not be refreshed.');
}
async function api(route, init = {}, safe = true) {
  assert(route === '/workers/scripts/ai-building-blocks-staging/settings' || route.startsWith(`/d1/database/${db}/`));
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${route}`, { ...init, headers: { authorization: `Bearer ${await credential()}`, ...init.headers }, signal: AbortSignal.timeout(30000) });
      if (r.status === 401 || r.status === 403) { if (attempt === 0) { await refresh(); continue; } }
      const body = await r.json(); assert(r.ok && body.success, `Staging administration failed (${r.status}).`); return body.result;
    } catch (e) { if (!safe || attempt === 2) throw e; await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1))); }
  }
}
export async function assertStaging() {
  const settings = await api('/workers/scripts/ai-building-blocks-staging/settings');
  assert.equal(settings.bindings.find(b => b.name === 'SPACES')?.id, db);
  assert.equal(settings.bindings.find(b => b.name === 'PREVIEW_PROTECTED')?.text, 'true');
  assert.equal(settings.bindings.find(b => b.name === 'WORKFLOW_COMPOSER_ENABLED')?.text, 'false');
  return settings;
}
export async function query(sql, params = []) {
  const results = await api(`/d1/database/${db}/query`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sql, params }) }, /^\s*(SELECT|PRAGMA)\b/i.test(sql));
  assert(results.every(r => r.success)); return results;
}
export async function selectedIdentity() {
  const require = createRequire(path.join(repo, 'site/package.json'));
  const { createClerkClient } = require('@clerk/backend');
  const keys = JSON.parse(await fs.readFile(path.join(repo, 'site/.wrangler/clerk-staging-secrets.json'), 'utf8'));
  const client = createClerkClient({ secretKey: keys.CLERK_SECRET_KEY });
  const result = await client.users.getUserList({ emailAddress: ['hello@useaiblocks.com'] });
  const matches = result.data.filter(u => u.emailAddresses.some(e => e.emailAddress.toLowerCase() === 'hello@useaiblocks.com' && e.verification?.status === 'verified'));
  assert.equal(matches.length, 1, 'The selected verified staging work account is not available.');
  return { userId: matches[0].id, verifiedEmail: 'hello@useaiblocks.com' };
}
export async function previewCredential() { return JSON.parse(await fs.readFile(path.join(repo, 'site/.wrangler/staging-secrets.json'), 'utf8')).PREVIEW_ACCESS_TOKEN; }
