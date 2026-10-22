// Read only the two explicitly named synthetic records; never select secrets.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const base = stagingTarget();
assert(process.env.CF_STAGING_VERSION && process.env.CF_STAGING_CONFIG);
const tag = 'Staging launch verification owner-20261022';
const sql = `SELECT 'space' AS kind,id,name AS label,created AS at FROM spaces WHERE name='${tag}' UNION ALL SELECT 'comment' AS kind,id,body AS label,at FROM comments WHERE slug='website-brand-brain-builder' AND body='${tag}' AND hidden=0 LIMIT 6`;
const report = { checkedOn: new Date().toISOString(), readbackVersion: process.env.CF_STAGING_VERSION, environment: base, readOnly: true, productionTouched: false, providerCalls: 0, status: 'pending', records: [] };
try {
  const output = execFileSync(process.execPath, [path.resolve('site/node_modules/wrangler/bin/wrangler.js'), 'd1', 'execute', 'SPACES', '--remote', '--env', 'staging', '--config', path.resolve(process.env.CF_STAGING_CONFIG), '--command', sql, '--json'], { env: { ...process.env, WRANGLER_WRITE_LOGS: 'false', WRANGLER_SEND_METRICS: 'false' }, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], timeout: 90_000 });
  const results = JSON.parse(output);
  assert(Array.isArray(results) && results.every(result => result.success === true));
  report.records = results.flatMap(result => result.results || []).map(row => ({ kind: row.kind, id: row.id, label: row.label, at: row.at }));
  const spaces = report.records.filter(row => row.kind === 'space').length;
  const comments = report.records.filter(row => row.kind === 'comment').length;
  report.counts = { spaces, comments };
  report.status = spaces === 1 && comments === 1 ? 'records-confirmed-owner-flow-still-required' : 'pending';
  report.note = 'Readback confirms record existence only. Owner-key sharing, link rotation and cleanup require the verified private fixture capture.';
} catch {
  report.status = 'readback-failed';
  report.note = 'Read-only staging database lookup did not complete. No raw CLI output or credentials were recorded.';
  process.exitCode = 1;
}
fs.writeFileSync('reports/cloudflare-staging-human-readback.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, counts: report.counts, readOnly: true, productionTouched: false }));
