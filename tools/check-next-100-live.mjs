// Read-only public release verification. Never invokes a model or external write.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { NEXT_TOOLS } from '../site/src/tools/next-100-tools.mjs';

assert(process.argv[2], 'Pass the deployed frozen asset directory.');
const assets = path.resolve(process.argv[2]);
const origin = 'https://useaiblocks.com';
const manifest = JSON.parse(await fs.readFile('reports/2026-10-22-next-100-recipes.json', 'utf8'));
assert.equal(NEXT_TOOLS.length, 25);
assert.equal(manifest.items.filter(item => item.type === 'workflow').length, 55);
assert.equal(manifest.items.filter(item => item.type === 'agent').length, 20);
const targets = [
  ...NEXT_TOOLS.map(tool => ({ route: `/tools/${tool.slug}`, file: `tools/${tool.slug}.html`, kind: 'tool' })),
  ...manifest.items.flatMap(item => [
    { route: `/${item.type === 'agent' ? 'agents' : 'workflows'}/${item.slug}`, file: `${item.type === 'agent' ? 'agents' : 'workflows'}/${item.slug}.html`, kind: item.type },
    { route: `/skills/${item.slug}/SKILL.md`, file: `skills/${item.slug}/SKILL.md`, kind: 'governing-instructions' },
  ]),
  { route: '/data/blocks.json', file: 'data/blocks.json', kind: 'catalogue' },
];
assert.equal(targets.length, 176);
assert.equal(new Set(targets.map(target => target.route)).size, 176);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
// Read every expected file before making any requests; a missing candidate fails locally.
for (const target of targets) target.expectedSha256 = sha(await fs.readFile(path.join(assets, target.file)));
const checks = new Array(targets.length);
let next = 0;
const cacheKey = Date.now().toString();
async function worker() {
  while (next < targets.length) {
    const index = next++, target = targets[index];
    try {
      const response = await fetch(`${origin}${target.route}?release-check=${cacheKey}`, {
        redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { 'cache-control': 'no-cache' },
      });
      const actualSha256 = sha(Buffer.from(await response.arrayBuffer()));
      checks[index] = { ...target, status: response.status, actualSha256, passed: response.status === 200 && actualSha256 === target.expectedSha256 };
    } catch (error) {
      checks[index] = { ...target, passed: false, error: error.message };
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
const failed = checks.filter(check => !check.passed);
const report = {
  checkedOn: new Date().toISOString(), origin, assets,
  checkerSha256: sha(await fs.readFile(import.meta.filename)),
  manifestSha256: sha(await fs.readFile('reports/2026-10-22-next-100-recipes.json')),
  status: failed.length ? 'fail' : 'pass', passed: checks.length - failed.length, failed: failed.length,
  scope: 'Exact public response bytes match the supplied frozen build for all 100 new pages, all 75 governing instruction files and the catalogue. Browser behavior, business outcomes and external actions are separate checks.',
  readOnly: true, providerCalls: 0, checks,
};
await fs.writeFile('reports/2026-10-22-next-100-live-qa.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, passed: report.passed, failed: failed.map(check => ({ route: check.route, status: check.status, error: check.error })), report: 'reports/2026-10-22-next-100-live-qa.json' }, null, 2));
if (failed.length) process.exitCode = 1;
