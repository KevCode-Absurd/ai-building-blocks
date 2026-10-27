// Catalogue-wide check of every item's hand-offs: the "What to do next" links on its page (tools/lib/needs.mjs planOf),
// the builder's "add next step" suggestions (src/lib/suggest.ts suggestNext) and the "Before you start" chain.
// For each link it asks: does the next item take something this one hands back (as a required input?), is that thing
// specific or only a generic port (a brief, a plan, a document), is it the same job or family, and does the
// "Takes the …" label name a real match. For each chain step: does it make something this item (or a later step) reads?
// No model calls and no network; reads public/data/blocks.json and the reviewed next:/before: lists in catalogue-items.
// Usage: node scripts/check-next-handoffs.mjs [--out file.json] [--sample N] [--no-builder] [--examples N]
//   page = worked-out links (what the ranking decides); shown = with reviewed next:/before: lists applied;
//   builder = suggestNext; builderBefore = previousSteps (the shared before-side ranking), scored like the chain.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { isLoosePort, previousSteps, sameFamily } from '../src/lib/next-steps.mjs';
import { handoffLabel, planOf } from '../../tools/lib/needs.mjs';

const SITE = path.resolve(import.meta.dirname, '..'), ROOT = path.resolve(SITE, '..');
const YAML = createRequire(path.join(SITE, 'package.json'))('yaml');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? undefined : process.argv[i + 1] ?? true; };
const sample = Number(arg('--sample')) || 1, keep = Number(arg('--examples')) || 12, withBuilder = !process.argv.includes('--no-builder');
const raw = JSON.parse(fs.readFileSync(path.join(SITE, 'public/data/blocks.json'), 'utf8'));

// The browser's Block shape (lib/data.ts unwire), as in scripts/evaluate-recommendations.mjs.
const port = p => p.endsWith('?') ? { type: p.slice(0, -1), required: false } : { type: p, required: true };
const unwire = ({ inputs, outputs, steps, tested, ...rest }) => ({
  name: '', summary: '', task: 'set-up-ai', category: 'general', type: 'skill', role: 'make', usedIn: 0, uses: [], twin: null,
  tested: tested ? { result: 'pass' } : null, ...rest,
  inputs: (inputs ?? []).map(port), outputs: (outputs ?? []).map(port), steps: (steps ?? []).map(s => typeof s === 'string' ? { uses: s, note: '' } : { uses: s[0], note: s[1] }),
});
const blocks = raw.blocks.map(unwire), bySlug = Object.fromEntries(blocks.map(b => [b.slug, b]));
const describe = t => ({ label: t.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()), what: String(raw.portTypes?.[t] ?? t).replace(/\.$/, '') });
const isFlow = b => b.category === 'orchestrator' || b.type === 'workflow' || b.type === 'routine';
const kind = b => b.type === 'mind' ? 'mind' : isFlow(b) ? 'workflow' : b.type === 'agent' ? 'agent' : b.type === 'prompt' ? 'prompt' : 'skill';

// Reviewed lists, read the way build-index.mjs reads them (page.yaml first, then item.yaml).
const overrides = new Map();
const readLinks = (files, slug) => {
  const links = {};
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    try { const y = YAML.parse(fs.readFileSync(f, 'utf8')) ?? {}; for (const k of ['next', 'before']) if (!links[k] && Array.isArray(y[k])) links[k] = y[k]; } catch { /* unreadable: worked-out links */ }
  }
  if (Object.keys(links).length) overrides.set(slug, links);
};
const walk = dir => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) { const p = path.join(dir, e.name); if (bySlug[e.name] && (fs.existsSync(path.join(p, 'item.yaml')) || fs.existsSync(path.join(p, 'page.yaml')))) readLinks([path.join(p, 'page.yaml'), path.join(ROOT, 'tools/orchestrator-pages', `${e.name}.yaml`), path.join(p, 'item.yaml')], e.name); else walk(p); } };
walk(path.join(ROOT, 'catalogue-items'));

// Which block runs straight after which in reviewed workflows.
const follows = new Set();
for (const f of blocks.filter(isFlow)) f.steps.forEach((s, i) => { const n = f.steps[i + 1]; if (n) follows.add(`${s.uses}>${n.uses}`); });

/** What a block hands over: its outputs, and the brand brain's products and buyers parts. */
const handsOver = b => { const t = new Set(b.outputs.map(p => p.type)); if (t.has('brand_brain')) { t.add('product_data'); t.add('persona'); } return t; };
/** What a block reads from outside: its inputs, and for a workflow its steps' inputs. */
const reads = b => [...b.inputs, ...(isFlow(b) ? b.steps.flatMap(s => bySlug[s.uses]?.inputs ?? []) : [])];

function classify(b, x) {
  const outs = handsOver(b), match = x.inputs.filter(p => outs.has(p.type));
  const specific = match.filter(p => !isLoosePort(p.type, blocks));
  const family = sameFamily(b.task, x.task);
  return {
    match, specific,
    handoff: match.length > 0, required: match.some(p => p.required), specificRequired: specific.some(p => p.required), specificAny: specific.length > 0,
    genericOnly: match.length > 0 && !specific.length, sameTask: b.task === x.task, family, workflow: follows.has(`${b.slug}>${x.slug}`),
  };
}

const ratio = (n, d) => Number((n / Math.max(1, d)).toFixed(3));
function linkStats() { return { items: 0, empty: 0, links: 0, handoff: 0, required: 0, specificRequired: 0, specificAny: 0, genericOnly: 0, genericOnlyOtherFamily: 0, noHandoff: 0, noHandoffOtherFamily: 0, sameTask: 0, family: 0, workflow: 0, labelled: 0, labelAccurate: 0, labelMissing: 0, fails: {} }; }
const fail = (s, key, row) => { (s.fails[key] ??= []).push(row); };
function addLink(s, b, x, label) {
  const c = classify(b, x), row = `${b.slug} (${b.task}) -> ${x.slug} (${x.task})${c.match.length ? ` via ${c.match.map(p => p.type + (p.required ? '' : '?')).join(',')}` : ''}`;
  s.links++; s.handoff += c.handoff; s.required += c.required; s.specificRequired += c.specificRequired; s.specificAny += c.specificAny;
  s.sameTask += c.sameTask; s.family += c.family; s.workflow += c.workflow; s.genericOnly += c.genericOnly; s.noHandoff += !c.handoff;
  if (c.genericOnly && !c.family && !c.workflow) { s.genericOnlyOtherFamily++; fail(s, 'genericOnlyOtherFamily', row); }
  if (!c.handoff && !c.family && !c.workflow) { s.noHandoffOtherFamily++; fail(s, 'noHandoffOtherFamily', row); }
  if (!c.handoff && !c.workflow && !c.sameTask) fail(s, 'noHandoffOtherJob', row);
  if (label === undefined) return;
  // The label must name a real match; a real specific match should be named.
  const real = new Set(c.match.map(p => handoffLabel(p.type)));
  if (label.length) { s.labelled++; if (label.every(l => real.has(l))) s.labelAccurate++; else fail(s, 'labelWrong', `${row} label "${label.join(' and ')}"`); }
  else if (c.specificAny) { s.labelMissing++; fail(s, 'labelMissing', row); }
}
const finish = s => ({
  items: s.items, itemsWithNoLinks: ratio(s.empty, s.items), links: s.links, linksPerItem: ratio(s.links, s.items),
  takesSomethingItMakes: ratio(s.handoff, s.links), asRequiredInput: ratio(s.required, s.links), specificRequired: ratio(s.specificRequired, s.links), specificAny: ratio(s.specificAny, s.links),
  genericPortOnly: ratio(s.genericOnly, s.links), genericPortOnlyOtherFamily: ratio(s.genericOnlyOtherFamily, s.links), noHandoff: ratio(s.noHandoff, s.links), noHandoffOtherFamily: ratio(s.noHandoffOtherFamily, s.links),
  sameJob: ratio(s.sameTask, s.links), sameFamily: ratio(s.family, s.links), inAWorkflow: ratio(s.workflow, s.links),
  ...(s.labelled + s.labelMissing ? { labelAccurate: ratio(s.labelAccurate, s.labelled), labelMissingWhenSpecific: ratio(s.labelMissing, s.links) } : {}),
});
function chainStats() { return { items: 0, withChain: 0, steps: 0, feedsThis: 0, feedsThisRequired: 0, feedsAStep: 0, feedsNothing: 0, family: 0, fails: {} }; }
function addChain(s, b, chain) {
  s.items++; if (chain.length) s.withChain++;
  const own = reads(b), steps = chain.map(c => bySlug[c.slug]).filter(Boolean);
  for (const x of steps) {
    s.steps++;
    const outs = handsOver(x), direct = own.filter(p => outs.has(p.type));
    const feedsStep = steps.some(y => y !== x && y.inputs.some(p => outs.has(p.type)));
    const family = sameFamily(b.task, x.task) || x.slug === 'website-brand-brain-builder';
    s.feedsThis += direct.length > 0; s.feedsThisRequired += direct.some(p => p.required); s.family += family;
    if (!direct.length && feedsStep) s.feedsAStep++;
    if (!direct.length && !feedsStep) { s.feedsNothing++; fail(s, 'feedsNothing', `${x.slug} (${x.task}) before ${b.slug} (${b.task})`); }
    if (!family) fail(s, 'otherFamily', `${x.slug} (${x.task}) before ${b.slug} (${b.task}) via ${direct.map(p => p.type).join(',') || '-'}`);
  }
}
const finishChain = s => ({ items: s.items, itemsWithChain: ratio(s.withChain, s.items), steps: s.steps, makesAnInputOfThis: ratio(s.feedsThis, s.steps), makesARequiredInput: ratio(s.feedsThisRequired, s.steps), onlyFeedsAnotherStep: ratio(s.feedsAStep, s.steps), feedsNothing: ratio(s.feedsNothing, s.steps), sameFamily: ratio(s.family, s.steps) });

let suggestNext = null;
if (withBuilder) {
  const out = path.join(os.tmpdir(), `abb-check-suggest-${process.pid}.mjs`);
  await build({ entryPoints: [path.join(SITE, 'src/lib/suggest.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent', jsx: 'automatic' });
  try { ({ suggestNext } = await import('file://' + out.replace(/\\/g, '/'))); } finally { fs.rmSync(out, { force: true }); }
}
const catalogue = { ...raw, blocks, bySlug };

const groups = {}, group = (name, key, make) => ((groups[name] ??= {})[key] ??= make());
const started = performance.now();
blocks.filter(b => b.type !== 'mind').forEach((b, i) => {
  if (i % sample) return;
  const k = kind(b), plan = planOf(b, bySlug, blocks, describe, {});
  for (const g of ['all', k]) {
    const s = group(g, 'page', linkStats); s.items++; s.empty += !plan.next.length;
    for (const x of plan.next) addLink(s, b, bySlug[x.slug], x.takes);
    addChain(group(g, 'chain', chainStats), b, plan.chain);
  }
  // As shown: the reviewed lists replace the worked-out ones.
  const links = overrides.get(b.slug);
  const shown = links ? planOf(b, bySlug, blocks, describe, links) : plan;
  for (const g of ['all', k]) {
    const s = group(g, 'shown', linkStats); s.items++; s.empty += !shown.next.length;
    for (const x of shown.next) addLink(s, b, bySlug[x.slug], x.takes);
    if (links?.next) { const r = group(g, 'reviewed', linkStats); r.items++; r.empty += !shown.next.length; for (const x of shown.next) addLink(r, b, bySlug[x.slug], x.takes); }
    addChain(group(g, 'shownChain', chainStats), b, shown.chain);
  }
  // The builder's canvas holds skills and prompts.
  if (suggestNext && (k === 'skill' || k === 'prompt')) {
    const sugg = suggestNext(catalogue, b.slug, new Set([b.slug]), 5);
    for (const g of ['all', k]) {
      const s = group(g, 'builder', linkStats); s.items++; s.empty += !sugg.length;
      for (const x of sugg) addLink(s, b, x.b);
      addChain(group(g, 'builderBefore', chainStats), b, previousSteps(b, blocks, { max: 5, exclude: x => x.type === 'agent', makers: ['website-brand-brain-builder'] }).map(r => r.x));
    }
  }
});

const report = { measuredOn: new Date().toISOString(), sample, seconds: Math.round((performance.now() - started) / 1000), groups: {} };
for (const [g, parts] of Object.entries(groups)) report.groups[g] = Object.fromEntries(Object.entries(parts).map(([k, s]) => [k, 'steps' in s ? finishChain(s) : finish(s)]));
report.failures = Object.fromEntries(Object.entries(groups.all).map(([k, s]) => [k, Object.fromEntries(Object.entries(s.fails).map(([f, rows]) => [f, { count: rows.length, examples: rows.slice(0, keep) }]))]));
const out = arg('--out');
if (typeof out === 'string') { fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(path.resolve(out), JSON.stringify({ ...report, failures: Object.fromEntries(Object.entries(groups.all).map(([k, s]) => [k, s.fails])) }, null, 2) + '\n'); }
console.log(JSON.stringify(report, null, 2));
