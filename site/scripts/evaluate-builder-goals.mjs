// Mechanical check of the step-by-step builder: every ready workflow becomes a test. The workflow itself (and any
// item that is the same thing: a twin, or a workflow or agent with the same steps) is taken out of the library first,
// so its own step order cannot give the answer away. Goals come from the catalogue in two wordings: the workflow's
// plain title (its first old title, else its name) and its summary. A stable hash of the slug splits the workflows
// into dev and test halves: tune on dev only.
// No model calls and no network. Usage:
//   node scripts/evaluate-builder-goals.mjs [--split dev|test|all] [--out file.json] [--verbose]
// Measures, per half:
//   start   for the goal, is the workflow's main step (the last one that makes something, not a check) among the top
//           1/3/5 "Start with" picks (goal.ts startPicks); `anyStepTop5`: any of its steps in the top 5.
//           Compared with the builder palette's first-step list (workflow-chain.ts firstSkillSuggestions), which
//           searches the full library (so the hidden workflow's first step keeps a small bonus there).
//   before  for each step after the first, is the true previous step among the top 3/5 "Before this" suggestions
//           (suggest-before.ts suggestBefore; compared with workflow-chain.ts chainSuggestions "before").
//   after   the same for the true next step (suggest.ts suggestNext; compared with chainSuggestions "after").
//   candidates  share of the workflow's steps in the AI planner's candidate list (composer-core candidatesFor).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';

const SITE = path.resolve(import.meta.dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const split = arg('--split') ?? 'all', verbose = process.argv.includes('--verbose');
const raw = JSON.parse(fs.readFileSync(path.join(SITE, 'public/data/blocks.json'), 'utf8'));
const round = (n, d = 3) => Number(n.toFixed(d));
const half = slug => parseInt(crypto.createHash('sha256').update(slug).digest('hex').slice(0, 8), 16) % 2 ? 'test' : 'dev';

// The builder helpers import browser modules (lib/data.ts), so they are bundled once for Node, as in evaluate-recommendations.mjs.
const out = path.join(os.tmpdir(), `abb-builder-eval-${process.pid}.mjs`);
await build({ stdin: { contents: ["export * from './src/lib/goal.ts';", "export { suggestNext } from './src/lib/suggest.ts';", "export { suggestBefore } from './src/lib/suggest-before.ts';", "export { firstSkillSuggestions, chainSuggestions } from './src/lib/workflow-chain.ts';", "export { candidatesFor, startPicks } from './src/lib/composer-core.ts';"].join('\n'), resolveDir: SITE, loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', jsx: 'automatic' });
let m;
try { m = await import('file://' + out.replace(/\\/g, '/')); } finally { fs.rmSync(out, { force: true }); }
const { withoutParts, startPicks, suggestNext, suggestBefore, firstSkillSuggestions, chainSuggestions, candidatesFor } = m;

// The browser's Block shape (lib/data.ts), as the builder sees it.
const port = p => p.endsWith('?') ? { type: p.slice(0, -1), required: false } : { type: p, required: true };
const blocks = raw.blocks.map(({ inputs, outputs, steps, tested, ...rest }) => ({
  name: '', summary: '', task: 'set-up-ai', category: 'general', type: 'skill', role: 'make', job: 'ops', usedIn: 0, uses: [], twin: null, ...rest,
  headline: rest.headline ?? rest.name, tested: tested ? { on: '', result: 'pass', business: '' } : null,
  inputs: (inputs ?? []).map(port), outputs: (outputs ?? []).map(port), steps: (steps ?? []).map(s => typeof s === 'string' ? { uses: s, note: '' } : { uses: s[0], note: s[1] }),
}));
const catalogue = { ...raw, blocks, bySlug: Object.fromEntries(blocks.map(b => [b.slug, b])) };

const stepsOf = b => [...new Set((b.steps ?? []).map(s => s.uses))];
const sameSteps = (a, b) => { const x = stepsOf(a), y = new Set(stepsOf(b)); return x.length > 0 && x.length === y.size && x.every(s => y.has(s)); };
const workflows = blocks.filter(b => b.category === 'orchestrator' && stepsOf(b).filter(s => catalogue.bySlug[s]).length >= 2);
const rankOf = (list, slug) => { const i = list.indexOf(slug); return i < 0 ? null : i + 1; };

const starts = [], links = [];
for (const w of workflows) {
  const part = half(w.slug);
  if (split !== 'all' && part !== split) continue;
  const same = blocks.filter(b => b.slug === w.slug || b.twin === w.slug || w.twin === b.slug || (b.steps?.length && sameSteps(b, w))).map(b => b.slug);
  const c = withoutParts(catalogue, same);
  const expected = stepsOf(w).filter(s => c.bySlug[s]);
  const main = [...expected].reverse().find(s => c.bySlug[s].role !== 'check') ?? expected[expected.length - 1];
  for (const [variant, goal] of [['title', (w.aliases ?? [])[0] || w.name], ['summary', w.summary]]) {
    if (!goal) continue;
    const picks = startPicks(c, goal, 5).tasks.map(p => p.b.slug), old = firstSkillSuggestions(catalogue, goal, new Set(), 5).map(p => p.b.slug);
    const cands = new Set(candidatesFor(c, goal).flatMap(b => [b.slug, ...stepsOf(b)]));
    starts.push({ slug: w.slug, half: part, variant, goal, main, picks, rank: rankOf(picks, main), any: picks.some(s => expected.includes(s)), old, oldRank: rankOf(old, main), oldAny: old.some(s => expected.includes(s)), candidates: expected.filter(s => cands.has(s)).length / expected.length });
  }
  expected.forEach((s, i) => {
    const inFlow = new Set([s]);
    if (i > 0) {
      const now = suggestBefore(c, s, inFlow, 5).map(x => x.b.slug), was = chainSuggestions(c, s, inFlow, '', 'before', 5).map(x => x.b.slug);
      links.push({ half: part, side: 'before', slug: w.slug, anchor: s, truth: expected[i - 1], rank: rankOf(now, expected[i - 1]), oldRank: rankOf(was, expected[i - 1]), got: now, empty: !now.length, oldEmpty: !was.length });
    }
    if (i + 1 < expected.length) {
      const now = suggestNext(c, s, inFlow, 5).map(x => x.b.slug), was = chainSuggestions(c, s, inFlow, '', 'after', 5).map(x => x.b.slug);
      links.push({ half: part, side: 'after', slug: w.slug, anchor: s, truth: expected[i + 1], rank: rankOf(now, expected[i + 1]), oldRank: rankOf(was, expected[i + 1]), got: now, empty: !now.length, oldEmpty: !was.length });
    }
  });
}

const share = (list, test) => round(list.filter(test).length / Math.max(1, list.length));
const within = (key, k) => r => r[key] !== null && r[key] <= k;
const report = { measuredOn: new Date().toISOString(), catalogue: { blocks: blocks.length, built: raw.built, workflows: workflows.length }, results: {} };
for (const part of ['dev', 'test']) {
  const s = starts.filter(r => r.half === part), l = links.filter(r => r.half === part);
  if (!s.length) continue;
  const start = list => ({ goals: list.length, top1: share(list, within('rank', 1)), top3: share(list, within('rank', 3)), top5: share(list, within('rank', 5)), anyStepTop5: share(list, r => r.any), noPicks: share(list, r => !r.picks.length), palette: { top1: share(list, within('oldRank', 1)), top3: share(list, within('oldRank', 3)), top5: share(list, within('oldRank', 5)), anyStepTop5: share(list, r => r.oldAny) } });
  const side = list => ({ links: list.length, top3: share(list, within('rank', 3)), top5: share(list, within('rank', 5)), none: share(list, r => r.empty), palette: { top3: share(list, within('oldRank', 3)), top5: share(list, within('oldRank', 5)), none: share(list, r => r.oldEmpty) } });
  report.results[part] = {
    start: { title: start(s.filter(r => r.variant === 'title')), summary: start(s.filter(r => r.variant === 'summary')) },
    before: side(l.filter(r => r.side === 'before')), after: side(l.filter(r => r.side === 'after')),
    candidates: { title: round(s.filter(r => r.variant === 'title').reduce((n, r) => n + r.candidates, 0) / Math.max(1, s.filter(r => r.variant === 'title').length)), summary: round(s.filter(r => r.variant === 'summary').reduce((n, r) => n + r.candidates, 0) / Math.max(1, s.filter(r => r.variant === 'summary').length)) },
  };
}
if (verbose) report.rows = { starts, links };
const file = arg('--out');
if (file) { fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true }); fs.writeFileSync(path.resolve(file), JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify(report.results, null, 2));
