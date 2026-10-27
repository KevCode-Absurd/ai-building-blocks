// Scores the workflow bench (test/fixtures/workflow-bench.json): goals written the way people ask, with independent
// labels for the first step, the steps around it and the full order. Runs the same shared ranking the product uses, on
// two paths:
//   builder  the free builder: "Start with" picks (composer-core startPicks), then "Before this" and "After this"
//            (suggest-before.ts suggestBefore, suggest.ts suggestNext) on the full library;
//   mcp      the MCP/API plan_workflow: first steps and ready workflows (step-graph.ts firstSteps), then before and after
//            (step-graph.ts around) on the published library, as server/public-catalogue.ts serves it.
// Odd ids (wb001, wb003, ...) are dev, even ids are test: tune on dev only, score test rarely. No model calls, no network.
// Usage: node scripts/evaluate-workflow-bench.mjs [--split dev|test|all] [--verbose] [--out file.json]
//   --verbose lists misses for dev goals only (never for test, so test misses cannot steer a fix).
// Measures, per split and path:
//   anchor   an acceptable anchor among the top 1/3/5 step picks; `orWorkflow` also counts an acceptable ready workflow
//            offered next to the picks. Goals the catalogue cannot do (coverage none) are left out; `declined` is the
//            share of those that get no picks.
//   before5/after5  around the first labelled anchor that is a single step: `hit` any labelled before (after) step among
//            the top 5, `precision` the share of the top 5 that is labelled. Goals with an empty list are left out;
//            `emptyOk` is the share of those where the product also suggests nothing.
//   chain    the full chain a person gets by taking the top suggestion each time, as many steps before and after the
//            anchor as the labels have: from the true anchor (`fromAnchor`) and from the path's own first pick
//            (`endToEnd`). `exact`: every labelled position filled in order; `coverage`: share of labelled positions in
//            the chain; `order`: share of pairs of matched steps in the labelled order; `flowOk`: every required
//            specific input is made by an earlier step or supplied by the user (user_supplies, with type_compat).
//   ready    goals with a ready_workflow: share where the plan offers it; `offeredWhenNone`: share of goals without one
//            that still get a ready workflow.
//   ms       median milliseconds per call (start picks; before plus after together).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from 'esbuild';

const SITE = path.resolve(import.meta.dirname, '..');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1]; };
const split = arg('--split') ?? 'all', verbose = process.argv.includes('--verbose');
if (!['dev', 'test', 'all'].includes(split)) throw new Error('--split must be dev, test or all');
const bench = JSON.parse(fs.readFileSync(path.join(SITE, 'test/fixtures/workflow-bench.json'), 'utf8'));
const raw = JSON.parse(fs.readFileSync(path.join(SITE, 'public/data/blocks.json'), 'utf8'));
const manifestFile = path.join(SITE, 'public/data/public-api-manifest.json');
const published = fs.existsSync(manifestFile) ? new Set(Object.keys(JSON.parse(fs.readFileSync(manifestFile, 'utf8')).resources)) : null;
const round = (n, d = 3) => Number(n.toFixed(d));
const half = id => Number(id.replace(/\D/g, '')) % 2 ? 'dev' : 'test';

// The builder helpers import browser modules (lib/data.ts), so everything is bundled once for Node, as in
// evaluate-builder-goals.mjs. One bundle: both paths share the same ranking code.
const out = path.join(os.tmpdir(), `abb-workflow-bench-${process.pid}.mjs`);
await build({ stdin: { contents: ["export { startPicks, decodeCatalogue } from './src/lib/composer-core.ts';", "export { suggestNext } from './src/lib/suggest.ts';", "export { suggestBefore } from './src/lib/suggest-before.ts';", "export { firstSteps, around } from './src/lib/step-graph.ts';", "export { handsOver, isLoosePort } from './src/lib/next-steps.mjs';"].join('\n'), resolveDir: SITE, loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', jsx: 'automatic' });
let m;
try { m = await import('file://' + out.replace(/\\/g, '/')); } finally { fs.rmSync(out, { force: true }); }
const { startPicks, decodeCatalogue, suggestNext, suggestBefore, firstSteps, around, handsOver, isLoosePort } = m;

// The browser's Block shape (lib/data.ts), as the builder sees it.
const port = p => p.endsWith('?') ? { type: p.slice(0, -1), required: false } : { type: p, required: true };
const blocks = raw.blocks.map(({ inputs, outputs, steps, tested, ...rest }) => ({
  name: '', summary: '', task: 'set-up-ai', category: 'general', type: 'skill', role: 'make', job: 'ops', usedIn: 0, uses: [], twin: null, ...rest,
  headline: rest.headline ?? rest.name, tested: tested ? { on: '', result: 'pass', business: '' } : null,
  inputs: (inputs ?? []).map(port), outputs: (outputs ?? []).map(port), steps: (steps ?? []).map(s => typeof s === 'string' ? { uses: s, note: '' } : { uses: s[0], note: s[1] }),
}));
const catalogue = { ...raw, blocks, bySlug: Object.fromEntries(blocks.map(b => [b.slug, b])) };
// What the API serves: published items without minds, decoded as the server decodes them (public-catalogue.ts stepLibrary).
const library = decodeCatalogue({ blocks: raw.blocks.filter(b => (!published || published.has(b.slug)) && b.type !== 'mind') });
const isFlow = b => !!b && (b.category === 'orchestrator' || b.type === 'workflow') && !!b.steps?.length;

// type_compat: a key type can be fed by any type in its list.
const compat = new Map(Object.entries(bench.type_compat ?? {}));
const feeds = (need, have) => have.has(need) || (compat.get(need) ?? []).some(t => have.has(t));

const paths = {
  builder: {
    starts: goal => { const p = startPicks(catalogue, goal, 5); return { steps: p.tasks.map(t => t.b.slug), workflows: p.workflows.map(w => w.b.slug) }; },
    before: (slug, inFlow) => suggestBefore(catalogue, slug, inFlow, 5).map(s => s.b.slug),
    after: (slug, inFlow) => suggestNext(catalogue, slug, inFlow, 5).map(s => s.b.slug),
    lib: catalogue,
  },
  mcp: {
    starts: goal => { const p = firstSteps(library, goal, 5); return { steps: p.steps.map(s => s.slug), workflows: p.workflows.map(w => w.slug) }; },
    before: (slug, inFlow) => around(library, slug, { max: 5, exclude: x => inFlow.has(x.slug) }).before.map(h => h.slug),
    after: (slug, inFlow) => around(library, slug, { max: 5, exclude: x => inFlow.has(x.slug) }).after.map(h => h.slug),
    lib: library,
  },
};

/** Whether every required input of each step is made by an earlier step or given by the user (chain() rules, with type_compat). */
function flowOk(lib, list, supplied) {
  const made = new Set(lib.blocks.filter(b => b.type !== 'mind').flatMap(b => [...handsOver(b)]));
  const have = new Set(supplied);
  return list.every((slug, i) => {
    const b = lib.bySlug[slug];
    if (!b) return false;
    const ok = b.inputs.filter(p => p.required).every(p => i === 0 || feeds(p.type, have) || isLoosePort(p.type, lib.blocks) || !made.has(p.type));
    for (const t of handsOver(b)) have.add(t);
    return ok;
  });
}

/** The chain from `anchor`: the top suggestion each time, `nb` steps before and `na` after. */
function grow(p, anchor, nb, na) {
  const list = [anchor];
  for (let i = 0; i < nb; i++) { const next = p.before(list[0], new Set(list))[0]; if (!next) break; list.unshift(next); }
  for (let i = 0; i < na; i++) { const next = p.after(list.at(-1), new Set(list))[0]; if (!next) break; list.push(next); }
  return list;
}
function scoreChain(list, groups) {
  const at = list.map(s => groups.findIndex(g => g.includes(s)));
  const matched = at.filter(i => i >= 0);
  let pairs = 0, right = 0;
  for (let i = 0; i < matched.length; i++) for (let j = i + 1; j < matched.length; j++) { pairs++; if (matched[i] < matched[j]) right++; }
  return {
    exact: list.length === groups.length && list.every((s, i) => groups[i].includes(s)),
    coverage: new Set(matched).size / groups.length,
    order: pairs ? right / pairs : matched.length ? 1 : 0,
  };
}

const rows = [];
const time = { builder: { start: [], side: [] }, mcp: { start: [], side: [] } };
for (const g of bench.goals) {
  const part = half(g.id);
  if (split !== 'all' && part !== split) continue;
  for (const [name, p] of Object.entries(paths)) {
    const t0 = performance.now(), picks = p.starts(g.request);
    time[name].start.push(performance.now() - t0);
    const anchors = g.anchor, rank = picks.steps.findIndex(s => anchors.includes(s)) + 1 || null;
    const wfHit = picks.workflows.some(s => anchors.includes(s));
    const row = { id: g.id, half: part, path: name, request: g.request, coverage: g.coverage, style: g.style, area: g.area, anchors, picks: picks.steps, workflows: picks.workflows, rank, wfHit };
    if (g.ready_workflow) row.ready = picks.workflows.includes(g.ready_workflow);
    else row.offeredWhenNone = picks.workflows.length > 0;
    const anchor = anchors.find(s => p.lib.bySlug[s] && !isFlow(p.lib.bySlug[s]));
    if (anchor) {
      const t1 = performance.now();
      const before = p.before(anchor, new Set([anchor])), after = p.after(anchor, new Set([anchor]));
      time[name].side.push(performance.now() - t1);
      row.anchor = anchor;
      row.before = { got: before, want: g.before, hit: g.before.length ? before.some(s => g.before.includes(s)) : null, precision: g.before.length ? before.filter(s => g.before.includes(s)).length / Math.max(1, before.length) : null, emptyOk: g.before.length ? null : !before.length };
      row.after = { got: after, want: g.after, hit: g.after.length ? after.some(s => g.after.includes(s)) : null, precision: g.after.length ? after.filter(s => g.after.includes(s)).length / Math.max(1, after.length) : null, emptyOk: g.after.length ? null : !after.length };
      const groups = g.steps.filter(x => x.length);
      if (groups.length) {
        const pos = Math.max(0, groups.findIndex(x => x.some(s => anchors.includes(s))));
        const nb = pos, na = groups.length - pos - 1;
        const from = grow(p, groups[pos].includes(anchor) ? anchor : groups[pos].find(s => p.lib.bySlug[s] && !isFlow(p.lib.bySlug[s])) ?? anchor, nb, na);
        row.chain = { fromAnchor: { list: from, ...scoreChain(from, groups), flowOk: flowOk(p.lib, from, g.user_supplies ?? []) }, want: groups };
        if (picks.steps[0]) { const e2e = grow(p, picks.steps[0], nb, na); row.chain.endToEnd = { list: e2e, ...scoreChain(e2e, groups), flowOk: flowOk(p.lib, e2e, g.user_supplies ?? []) }; }
        else row.chain.endToEnd = { list: [], exact: false, coverage: 0, order: 0, flowOk: false };
      }
    }
    rows.push(row);
  }
}

const mean = (list, f) => { const v = list.map(f).filter(x => x !== null && x !== undefined); return v.length ? round(v.reduce((s, x) => s + Number(x), 0) / v.length) : null; };
const results = {};
for (const part of ['dev', 'test']) {
  for (const name of Object.keys(paths)) {
    const r = rows.filter(x => x.half === part && x.path === name);
    if (!r.length) continue;
    const doable = r.filter(x => x.coverage !== 'none'), none = r.filter(x => x.coverage === 'none');
    const within = k => x => x.rank !== null && x.rank <= k;
    const chained = r.filter(x => x.chain);
    (results[part] ??= {})[name] = {
      goals: r.length,
      anchor: { goals: doable.length, top1: mean(doable, within(1)), top3: mean(doable, within(3)), top5: mean(doable, within(5)), orWorkflow5: mean(doable, x => within(5)(x) || x.wfHit), declined: none.length ? mean(none, x => !x.picks.length) : null },
      before5: { goals: r.filter(x => x.before?.hit !== null && x.before).length, hit: mean(r, x => x.before?.hit), precision: mean(r, x => x.before?.precision), emptyOk: mean(r, x => x.before?.emptyOk) },
      after5: { goals: r.filter(x => x.after?.hit !== null && x.after).length, hit: mean(r, x => x.after?.hit), precision: mean(r, x => x.after?.precision), emptyOk: mean(r, x => x.after?.emptyOk) },
      chain: Object.fromEntries(['fromAnchor', 'endToEnd'].map(k => [k, { goals: chained.length, exact: mean(chained, x => x.chain[k].exact), coverage: mean(chained, x => x.chain[k].coverage), order: mean(chained, x => x.chain[k].order), flowOk: mean(chained, x => x.chain[k].flowOk) }])),
      ready: { goals: r.filter(x => 'ready' in x).length, offered: mean(r, x => x.ready), offeredWhenNone: mean(r, x => x.offeredWhenNone) },
    };
  }
}
const median = list => { const v = [...list].sort((a, b) => a - b); return v.length ? round(v[Math.floor(v.length / 2)], 2) : null; };
const ms = Object.fromEntries(Object.entries(time).map(([k, t]) => [k, { start: median(t.start), beforeAfter: median(t.side) }]));
const report = { measuredOn: new Date().toISOString(), catalogue: { blocks: blocks.length, built: raw.built, published: published?.size ?? null }, split, results, ms };
if (verbose) {
  // Misses on dev goals only.
  const dev = rows.filter(x => x.half === 'dev');
  report.misses = {
    anchor: dev.filter(x => x.coverage !== 'none' && !(x.rank && x.rank <= 3)).map(x => ({ id: x.id, path: x.path, request: x.request, want: x.anchors, got: x.picks })),
    before: dev.filter(x => x.before?.hit === false).map(x => ({ id: x.id, path: x.path, anchor: x.anchor, want: x.before.want, got: x.before.got })),
    after: dev.filter(x => x.after?.hit === false).map(x => ({ id: x.id, path: x.path, anchor: x.anchor, want: x.after.want, got: x.after.got })),
    chain: dev.filter(x => x.chain && !x.chain.fromAnchor.exact).map(x => ({ id: x.id, path: x.path, want: x.chain.want, got: x.chain.fromAnchor.list, endToEnd: x.chain.endToEnd.list })),
    ready: dev.filter(x => x.ready === false).map(x => ({ id: x.id, path: x.path, request: x.request, want: bench.goals.find(g => g.id === x.id).ready_workflow, got: x.workflows })),
  };
}
const file = arg('--out');
if (file) { fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true }); fs.writeFileSync(path.resolve(file), JSON.stringify({ ...report, rows: rows.filter(x => x.half === 'dev') }, null, 2) + '\n'); }
console.log(JSON.stringify(verbose ? report : { ...report, misses: undefined }, null, 2));
