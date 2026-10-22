// Explicit visible-browser run for two normal real Turnstile actions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const base = stagingTarget();
assert(process.env.CF_STAGING_VERSION && process.env.CF_RELEASE_DIST, 'Provide the confirmed deployed version and immutable assets.');
const token = JSON.parse(fs.readFileSync(path.join(root, 'site/.wrangler/staging-secrets.json'), 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(typeof token === 'string' && token.length >= 32, 'Private staging access is required.');
const response = await fetch(new URL('/data/blocks.json', base), { headers: { 'x-preview-access': token }, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
assert.equal(response.status, 200, 'The confirmed staging catalogue must be available.');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
assert.equal(sha(Buffer.from(await response.arrayBuffer())), sha(fs.readFileSync(path.join(process.env.CF_RELEASE_DIST, 'data/blocks.json'))), 'The live catalogue must match the immutable release.');
const code = await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.staging.config.ts', 'e2e/staging-real-writes.spec.ts', '--headed', '--workers', '1', '--output', '.wrangler/real-widget-evidence', '--reporter', 'list'], {
    cwd: path.join(root, 'site'), stdio: 'inherit', windowsHide: true,
    env: { ...process.env, CF_PREVIEW_ACCESS_TOKEN: token, CF_STAGING_REAL_WRITES: 'true' },
  });
  child.on('error', reject); child.on('exit', resolve);
});
if (code !== 0) process.exitCode = 1;
