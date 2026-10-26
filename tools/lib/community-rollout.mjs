import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
export const repo = path.resolve(import.meta.dirname, '../..');
export const privateRoot = path.join(repo, 'site/.wrangler/community-rollout-2026-10-24');
export const release = path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/23/01a169d9-8730-7973-9ad8-0a148cb166c5/community-release-r2');
export const account = '31c814d2c58a11163d3187f505f0b9c5';
export const environments = {
  production: { script: 'ai-building-blocks', origin: 'https://useaiblocks.com', database: 'a886eeae-4014-4da2-842f-a5bebc4d7f71' },
  staging: { script: 'ai-building-blocks-staging', origin: 'https://ai-building-blocks-staging.kevinmark7498.workers.dev', database: 'eeb9d0d4-cbed-4751-8df4-1aaf81fd6cb3' },
};
export const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
export const sha = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(canonical(value))).digest('hex');
export const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
export async function write(file, value) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n'); }
export async function token() {
  const text = await fs.readFile(path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml'), 'utf8');
  const value = text.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(value, 'Existing Cloudflare authentication is required.'); return value;
}
export async function cf(route, init = {}) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${route}`, { ...init, headers: { authorization: `Bearer ${await token()}`, ...init.headers }, signal: AbortSignal.timeout(60000) });
  const data = await r.json(); assert(r.ok && data.success, `Cloudflare operation failed (${r.status}): ${JSON.stringify(data.errors?.map(e => ({ code: e.code, message: e.message })))}`); return data.result;
}
export async function state(environment) {
  const e = environments[environment]; assert(e);
  const settings = await cf(`/workers/scripts/${e.script}/settings`), deployments = await cf(`/workers/scripts/${e.script}/deployments`);
  const versions = (deployments.deployments ?? deployments)[0].versions; assert.equal(versions.length, 1); assert.equal(versions[0].percentage, 100);
  for (const name of ['COMMENTS', 'SPACES', 'COMPOSER']) assert.equal(settings.bindings.find(b => b.name === name)?.id, e.database);
  return { environment, versionId: versions[0].version_id, settings };
}
export async function query(environment, sql, params = []) {
  const result = await cf(`/d1/database/${environments[environment].database}/query`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sql, params }) });
  assert(result.every(r => r.success), 'Database operation failed.'); return result;
}
export function run(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: repo, windowsHide: true, stdio: 'inherit', ...options });
    child.once('error', reject); child.once('exit', code => resolve(code));
  });
}
export function fingerprints(settings, excluded = []) { return settings.bindings.filter(b => !excluded.includes(b.name)).map(b => ({ name: b.name, sha256: sha(b) })).sort((a,b) => a.name.localeCompare(b.name)); }
