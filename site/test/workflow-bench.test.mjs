// Workflow-building gate: runs scripts/evaluate-workflow-bench.mjs on the dev half of test/fixtures/workflow-bench.json
// (odd ids) and fails when the first step, the steps around it, the full chain or the ready-workflow offer get worse
// than the level measured on 2026-10-27 (after the step-ranking pass), minus about 0.02 (one or two goals).
// The test half (even ids) is never read here: it is scored by hand, rarely, so nobody tunes on it.
// Both product paths are checked: the free builder and the MCP/API plan_workflow.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Measured 2026-10-27, dev half: anchor top-1 0.316, top-3 0.532, top-5 0.646; before@5 0.636; after@5 0.507;
// chain from the true anchor exact 0.321, coverage 0.668, order 0.944; end to end exact 0.115; ready workflow 0.29.
const FLOOR = { top1: 0.29, top3: 0.51, top5: 0.62, before: 0.6, after: 0.48, exact: 0.3, coverage: 0.64, order: 0.92, endToEnd: 0.1, ready: 0.27 };
const site = path.resolve(import.meta.dirname, '..');

test('workflow bench (dev half) keeps its first-step, hand-off and chain levels', { timeout: 10 * 60 * 1000 }, t => {
  const out = path.join(os.tmpdir(), `abb-workflow-bench-${process.pid}.json`);
  t.after(() => fs.rmSync(out, { force: true }));
  execFileSync(process.execPath, ['scripts/evaluate-workflow-bench.mjs', '--split', 'dev', '--out', out], { cwd: site, stdio: 'ignore', maxBuffer: 64 * 1024 * 1024 });
  const { results } = JSON.parse(fs.readFileSync(out, 'utf8'));
  for (const name of ['builder', 'mcp']) {
    const r = results.dev[name], at = (label, got, floor) => assert.ok(got >= floor, `${name} ${label} ${got} fell below ${floor}`);
    at('anchor top-1', r.anchor.top1, FLOOR.top1);
    at('anchor top-3', r.anchor.top3, FLOOR.top3);
    at('anchor top-5', r.anchor.top5, FLOOR.top5);
    at('before@5', r.before5.hit, FLOOR.before);
    at('after@5', r.after5.hit, FLOOR.after);
    at('chain exact', r.chain.fromAnchor.exact, FLOOR.exact);
    at('chain coverage', r.chain.fromAnchor.coverage, FLOOR.coverage);
    at('chain order', r.chain.fromAnchor.order, FLOOR.order);
    at('end-to-end chain exact', r.chain.endToEnd.exact, FLOOR.endToEnd);
    at('ready workflow offered', r.ready.offered, FLOOR.ready);
  }
});
