import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { acronymsIn, buildReport, checkCopy, explainedInField, nameSaysWhat, pickKeys, summarySaysResult } from '../check-plain-names.mjs';

const reasons = (copy) => checkCopy(copy).map((r) => `${r.reason}:${r.field}`);
const clean = { kind: 'skill', name: 'Landing page auditor', headline: 'Landing page auditor', summary: 'Share your page and screenshots. Get a score out of 100 and five fixes to make first.', subhead: 'Share your page text and screenshots. It looks for what stops visitors from buying. You get a score and a ranked list of fixes.' };

test('a plain name and a give-then-get summary pass with no reasons', () => {
  assert.deepEqual(checkCopy(clean), []);
});

test('acronyms are found, and the known ones are left alone', () => {
  assert.deepEqual(acronymsIn('B2B KPIs, the P&L and a 3PL on WooCommerce').map((a) => a.base), ['B2B', 'KPI', 'P&L', '3PL']);
  assert.deepEqual(reasons({ ...clean, name: 'SEO page checker', headline: 'SEO page checker' }), []);
  assert.deepEqual(reasons({ ...clean, summary: 'Share your ad numbers. Get a ROAS target for each product.' }), ['acronym:summary']);
});

test('an acronym is fine when the same field spells it out or explains it', () => {
  assert.ok(explainedInField('ROAS', 'Get a ROAS (sales per pound of ad spend) target.'));
  assert.ok(explainedInField('KPI', 'Pick key performance indicators (KPIs) for your team.'));
  assert.ok(explainedInField('KPI', 'Pick the key performance indicators your team will track, one KPI per goal.'));
  assert.ok(!explainedInField('KPI', 'Pick a KPI for each goal.'));
  assert.deepEqual(reasons({ ...clean, summary: 'Share your ad numbers. Get a ROAS (sales per pound of ad spend) target for each product.' }), []);
});

test('an acronym in the name counts as explained when the summary explains it', () => {
  const name = 'Break-even ROAS calculator';
  assert.deepEqual(reasons({ ...clean, name, headline: name }), ['acronym:name']);
  assert.deepEqual(reasons({ ...clean, name, headline: name, summary: 'Share your price and costs. Get your break-even ROAS (the ad return where you stop losing money).' }), []);
});

test('insider terms and banned hype words are flagged', () => {
  assert.deepEqual(reasons({ ...clean, summary: 'Share your sales. Get your unit economics and three fixes.' }), ['insider-term:summary']);
  assert.deepEqual(reasons({ ...clean, summary: 'Share your sales. Get a plan to streamline your week.' }), ['hype-word:summary']);
});

test('names over six words or 45 characters are flagged, and workflows get nine words', () => {
  assert.ok(reasons({ ...clean, name: 'Customer acquisition cost limit and ad-lift test planner' }).includes('long-name:name'));
  assert.ok(!reasons({ ...clean, kind: 'workflow', name: 'Turn reviews into image ads that sell more' }).includes('long-name:name'));
  assert.ok(reasons({ ...clean, kind: 'workflow', name: 'Clear an email backlog and set triage rules that stick for good' }).includes('long-name:name'));
});

test('a name must say what the item is or makes', () => {
  for (const good of ['Landing page auditor', 'Write ads people believe', 'Supplier scorecard', 'Outage incident leader', 'Organizational psychologist']) assert.ok(nameSaysWhat(good), good);
  for (const vague of ['Proofreader', 'Three series arcs', 'AI default patterns', 'Manufacturing yield cost bridge']) assert.ok(!nameSaysWhat(vague), vague);
  assert.ok(reasons({ ...clean, name: 'Three series arcs' }).includes('unclear-name:name'));
});

test('a person or a product name is never flagged as a name', () => {
  assert.deepEqual(reasons({ kind: 'mind', name: 'Kat Holmes', headline: 'Kat Holmes', summary: 'Find who cannot take part, learn from how they cope and create more than one way in.' }), []);
  assert.deepEqual(reasons({ kind: 'tool', name: 'Shopify Magic', headline: 'Shopify Magic', summary: 'Draft product copy, edit photos and handle store tasks inside Shopify.' }), []);
});

test('a summary must open with what you get, or with what you give and then what you get', () => {
  assert.ok(summarySaysResult('Share your page and screenshots. Get a score and five fixes.'));
  assert.ok(summarySaysResult('Paste your reviews to find the reasons people buy, in their own words.'));
  assert.ok(summarySaysResult('Match supply to demand by date. See what can ship and what is left.'));
  assert.ok(summarySaysResult('A renewal brief with notice deadlines and options.'));
  assert.ok(!summarySaysResult('Share your numbers and your goals.'));
  assert.ok(!summarySaysResult('Expert guidance on pricing strategy for growing teams.'));
  assert.ok(!summarySaysResult('Use when you need to plan a product launch.'));
  assert.ok(!summarySaysResult('Before you release.'));
  assert.ok(!summarySaysResult(''));
  assert.ok(reasons({ ...clean, summary: 'This skill covers pricing.' }).includes('no-result:summary'));
});

test('a summary above grade 10 is flagged', () => {
  const hard = 'Convert legacy stored procedures into equivalent procedural functions, preserving signatures and documenting behavioural incompatibilities for subsequent verification.';
  assert.ok(reasons({ ...clean, summary: hard }).includes('hard-summary:summary'));
});

test('the pack name and summary are checked when they differ from the site', () => {
  const got = reasons({ ...clean, pack: { name: 'Test Automation Engineer agent', summary: 'Expert in CI pipelines.' } });
  assert.ok(got.includes('pack-name-differs:pack name'));
  assert.ok(got.includes('name-format:pack name'));
  assert.ok(got.includes('no-result:pack summary'));
  assert.ok(got.includes('acronym:pack summary'));
  assert.deepEqual(reasons({ ...clean, pack: { name: clean.name, summary: clean.summary } }), []);
});

test('pickKeys reads folded text and one-line JSON files', () => {
  assert.deepEqual(pickKeys('slug: a\nname: "A: checker"\nsummary: Share a page.\n  Get a score.\nwhen:\n  - one\n', ['name', 'summary']), { name: 'A: checker', summary: 'Share a page. Get a score.' });
  assert.deepEqual(pickKeys('{"slug": "amy", "name": "Amy", "summary": "Help a team speak up."}', ['name', 'summary']), { name: 'Amy', summary: 'Help a team speak up.' });
});

// A small library on disk: one item whose display copy fixes the site but not the pack, one mind, one AI tool guide.
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plain-names-'));
  const put = (file, text) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text); };
  put('catalogue-items/general/roas-calc/item.yaml', 'slug: roas-calc\nname: ROAS and CPA thing\nsummary: Expert in ROAS.\ntype: skill\n');
  put('catalogue-items/general/roas-calc/page.yaml', 'name: ROAS and CPA thing\nheadline: ROAS and CPA thing\nsummary: Expert in ROAS.\nsubhead: Old words.\n');
  put('catalogue-items/general/unused/item.yaml', 'slug: unused\nname: Meeting notes writer\nsummary: Paste rough notes. Get clean minutes and a list of actions.\ntype: skill\n');
  put('catalogue-items/minds/kat/mind.yaml', '{"slug": "kat", "name": "Kat Holmes", "summary": "Find who cannot take part and create more than one way in."}');
  put('catalogue-items/ai-tools/zap.yaml', 'slug: zap\nname: Zap\npromise: "Connect your apps and run the same steps each time."\n');
  put('catalogue-items/ai-tools/_categories.yaml', '- id: x\n  name: X\n');
  put('catalogue-items/display-copy.yaml', 'roas-calc:\n  name: Ad break-even calculator\n  summary: Share your price and costs. Get the ad spend where you stop making money.\n');
  put('catalogue-items/quarantine.yaml', '{}\n');
  put('marketplace/packs/roles/r1/toolbox.json', JSON.stringify({ tasks: [{ items: [{ ref: 'library:roas-calc' }, { ref: 'kit:skills/x' }, { ref: 'library:kat' }] }, { items: [{ ref: 'library:roas-calc' }] }] }));
  put('marketplace/packs/roles/r2/toolbox.json', JSON.stringify({ tasks: [{ items: [{ ref: 'library:roas-calc' }, { ref: 'library:zap' }] }] }));
  return root;
}

test('the report reads display copy for the site and item.yaml for packs, and counts toolboxes', () => {
  const root = fixture();
  try {
    const all = buildReport({ root });
    assert.equal(all.checked, 4);
    const item = all.items.find((r) => r.slug === 'roas-calc');
    assert.equal(item.name, 'Ad break-even calculator');
    assert.equal(item.packName, 'ROAS and CPA thing');
    assert.equal(item.toolboxes, 2);
    const got = item.reasons.map((r) => `${r.reason}:${r.field}`);
    assert.ok(!got.some((r) => r.endsWith(':name') || r.endsWith(':summary')), got.join(' '));
    for (const want of ['pack-name-differs:pack name', 'acronym:pack name', 'no-result:pack summary']) assert.ok(got.includes(want), want);
    assert.equal(all.items.find((r) => r.slug === 'kat').kind, 'mind');
    assert.equal(all.items.find((r) => r.slug === 'zap').score, 0);
    const used = buildReport({ root, toolboxOnly: true });
    assert.deepEqual(used.items.map((r) => r.slug).sort(), ['kat', 'roas-calc', 'zap']);
    assert.equal(used.itemsByReason['pack-name-differs'], 1);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('the command prints JSON, takes --toolbox-only and always exits 0', () => {
  const root = fixture();
  try {
    const script = fileURLToPath(new URL('../check-plain-names.mjs', import.meta.url));
    const run = (...args) => spawnSync(process.execPath, [script, '--root', root, ...args], { encoding: 'utf8', windowsHide: true });
    const text = run('--toolbox-only');
    assert.equal(text.status, 0, text.stderr);
    assert.match(text.stdout, /roas-calc {2}\(skill, in 2 toolboxes\) {2}"Ad break-even calculator"/);
    assert.match(text.stdout, /3 items checked \(items named by a toolbox\.json\): 1 flagged, 2 clean\./);
    const json = run('--toolbox-only', '--json');
    assert.equal(json.status, 0, json.stderr);
    assert.equal(JSON.parse(json.stdout).checked, 3);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
