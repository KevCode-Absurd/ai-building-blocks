// Mechanical check of the step map the public MCP and API serve (src/lib/step-graph.ts: plan_workflow, get_skill's
// before/after, prepare_workflow's hand-off warnings). Every ready workflow becomes a test. The workflow itself (and
// any item that is the same thing: a twin, or a workflow or agent with the same steps) is taken out of the library
// first, so its own step order cannot give the answer away. Goals come from the catalogue in two wordings: the plain
// title (its first old title, else its name) and its summary. A stable hash of the slug splits the workflows into dev
// and test halves, the same split as scripts/evaluate-builder-goals.mjs: tune on dev only.
// No model calls and no network. Usage:
//   node scripts/evaluate-step-graph.mjs [--split dev|test|all] [--floor 0.5] [--out file.json] [--verbose]
// Measures, per half:
//   anchor  is the workflow's main step (the last one that makes something, not a check) among the top 1/3/5 first
//           steps (firstSteps); `anyStepTop5`: any of its steps in the top 5.
//   before  for each step after the first, is the true previous step among the top 3 "before" (around).
//   after   the same for the true next step among the top 3 "after".
//   chain   on the full library: share of ready workflows whose declared order passes chain() with the workflow's
//           own inputs as what the user supplies (no missing required input, no step out of order), and the ones that fail.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { decodeCatalogue } from '../src/lib/composer-core.ts';
import { withoutParts } from '../src/lib/goal.ts';
import { around, chain, firstSteps } from '../src/lib/step-graph.ts';

const SITE = path.resolve(import.meta.dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const split = arg('--split') ?? 'all', verbose = process.argv.includes('--verbose'), floor = arg('--floor') === undefined ? undefined : Number(arg('--floor'));
const raw = JSON.parse(fs.readFileSync(path.join(SITE, 'public/data/blocks.json'), 'utf8'));
const manifestFile = path.join(SITE, 'public/data/public-api-manifest.json');
const published = fs.existsSync(manifestFile) ? new Set(Object.keys(JSON.parse(fs.readFileSync(manifestFile, 'utf8')).resources)) : null;
const round = (n, d = 3) => Number(n.toFixed(d));
const half = slug => parseInt(crypto.createHash('sha256').update(slug).digest('hex').slice(0, 8), 16) % 2 ? 'test' : 'dev';

// What the API serves: published items, decoded as the server decodes them (public-catalogue.ts stepLibrary).
const library = decodeCatalogue({ ...raw, blocks: raw.blocks.filter(b => !published || published.has(b.slug)) });
const { blocks } = library;
const stepsOf = b => [...new Set((b.steps ?? []).map(s => s.uses))];
const sameSteps = (a, b) => { const x = stepsOf(a), y = new Set(stepsOf(b)); return x.length > 0 && x.length === y.size && x.every(s => y.has(s)); };
const workflows = blocks.filter(b => b.category === 'orchestrator' && stepsOf(b).filter(s => library.bySlug[s]).length >= 2);
const rankOf = (list, slug) => { const i = list.indexOf(slug); return i < 0 ? null : i + 1; };

const started = performance.now(), starts = [], links = [];
for (const w of workflows) {
  const part = half(w.slug);
  if (split !== 'all' && part !== split) continue;
  const same = blocks.filter(b => b.slug === w.slug || b.twin === w.slug || w.twin === b.slug || (b.steps?.length && sameSteps(b, w))).map(b => b.slug);
  const c = withoutParts(library, same);
  const expected = stepsOf(w).filter(s => c.bySlug[s]);
  const main = [...expected].reverse().find(s => c.bySlug[s].role !== 'check') ?? expected[expected.length - 1];
  for (const [variant, goal] of [['title', (w.aliases ?? [])[0] || w.name], ['summary', w.summary]]) {
    if (!goal) continue;
    const picks = firstSteps(c, goal, 5).steps.map(p => p.slug);
    starts.push({ slug: w.slug, half: part, variant, goal, main, picks, rank: rankOf(picks, main), any: picks.some(s => expected.includes(s)) });
  }
  expected.forEach((s, i) => {
    const { before, after } = around(c, s, { max: 3, floor });
    if (i > 0) links.push({ half: part, side: 'before', slug: w.slug, anchor: s, truth: expected[i - 1], rank: rankOf(before.map(x => x.slug), expected[i - 1]), got: before.map(x => x.slug) });
    if (i + 1 < expected.length) links.push({ half: part, side: 'after', slug: w.slug, anchor: s, truth: expected[i + 1], rank: rankOf(after.map(x => x.slug), expected[i + 1]), got: after.map(x => x.slug) });
  });
}

// Chains: every ready workflow with steps, on the full library. The workflow's declared inputs are what the user gives.
const chains = blocks.filter(b => b.category === 'orchestrator' && b.steps?.length).filter(w => split === 'all' || half(w.slug) === split).map(w => {
  const steps = w.steps.map(s => s.uses), unknown = steps.filter(s => !library.bySlug[s]);
  const result = chain(library, steps.filter(s => library.bySlug[s]), { supplied: w.inputs.map(p => p.type) });
  return { slug: w.slug, half: half(w.slug), steps: steps.length, ok: result.ok && !unknown.length, unknown, problems: result.problems.map(p => ({ step: p.step + 1, slug: p.slug, type: p.type, problem: p.problem, ...(p.makers?.length ? { makers: p.makers } : {}), ...(p.made_later_by !== undefined ? { madeLaterBy: p.made_later_by + 1 } : {}) })) };
});

const share = (list, test) => round(list.filter(test).length / Math.max(1, list.length));
const within = k => r => r.rank !== null && r.rank <= k;
const report = { measuredOn: new Date().toISOString(), catalogue: { blocks: blocks.length, built: raw.built, workflows: workflows.length }, floor: floor ?? 'default', seconds: 0, results: {} };
for (const part of ['dev', 'test']) {
  const s = starts.filter(r => r.half === part), l = links.filter(r => r.half === part), ch = chains.filter(r => r.half === part);
  if (!s.length && !ch.length) continue;
  const anchor = list => ({ goals: list.length, top1: share(list, within(1)), top3: share(list, within(3)), top5: share(list, within(5)), anyStepTop5: share(list, r => r.any), noPicks: share(list, r => !r.picks.length) });
  const side = list => ({ links: list.length, top3: share(list, within(3)), none: share(list, r => !r.got.length) });
  report.results[part] = {
    anchor: { all: anchor(s), title: anchor(s.filter(r => r.variant === 'title')), summary: anchor(s.filter(r => r.variant === 'summary')) },
    before: side(l.filter(r => r.side === 'before')), after: side(l.filter(r => r.side === 'after')),
    chain: { workflows: ch.length, pass: share(ch, r => r.ok), missing: ch.filter(r => r.problems.some(p => p.problem === 'missing')).length, outOfOrder: ch.filter(r => r.problems.some(p => p.problem === 'out_of_order')).length, unknownSteps: ch.filter(r => r.unknown.length).length },
  };
}
report.seconds = round((performance.now() - started) / 1000, 1);
report.failingChains = chains.filter(r => !r.ok).map(({ half: _, ...r }) => r);
if (verbose) report.rows = { starts, links };
const file = arg('--out');
if (file) { fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true }); fs.writeFileSync(path.resolve(file), JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify({ ...report, failingChains: report.failingChains.length, rows: undefined }, null, 2));
