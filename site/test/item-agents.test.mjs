// "Agents who use this": item pages link to the named agents whose role toolbox lists the item. The toolboxes may not
// exist yet, so every reader returns nothing when the files are absent; fixtures stand in for them here.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AGENTS_TITLE, ITEM_AGENTS_SCHEMA, MAX_AGENTS, SHARDS, agentsSection, itemAgents, loadItemAgents, readPersonas, readToolboxes, writeItemAgents } from '../scripts/lib/item-agents.mjs';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');

/** A marketplace folder with role toolboxes and persona files, as the agents app keeps them. */
function fixture({ toolboxes = {}, personas = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'item-agents-'));
  const rolesDir = path.join(root, 'packs/roles'), personasDir = path.join(root, 'src/modules/directory/data');
  fs.mkdirSync(rolesDir, { recursive: true }); fs.mkdirSync(personasDir, { recursive: true });
  for (const [role, box] of Object.entries(toolboxes)) {
    fs.mkdirSync(path.join(rolesDir, role), { recursive: true });
    if (box !== null) fs.writeFileSync(path.join(rolesDir, role, 'toolbox.json'), typeof box === 'string' ? box : JSON.stringify(box));
  }
  fs.writeFileSync(path.join(personasDir, 'personas-test.json'), JSON.stringify(personas));
  fs.writeFileSync(path.join(personasDir, 'roles.json'), JSON.stringify([{ id: 'not-a-persona-file' }]));
  return { root, rolesDir, personasDir, done: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const toolbox = (role, tasks, always = []) => ({ schema: 'ai-blocks-toolbox/1', role, reviewed: '2026-11-10', tasks: tasks.map((refs, i) => ({ id: `task-${i}`, task: `Do task ${i}`, kind: 'copy', items: refs.map((ref) => ({ ref, use: 'build', when: 'When it fits' })) })), always: always.map((ref) => ({ ref, use: 'check', when: 'Always' })), helpers: [], gaps: [] });
const persona = (id, role, extra = {}) => ({ id, kind: 'house', name: id.split('-')[0].replace(/^./, (c) => c.toUpperCase()), title: `${role} person`, role, status: 'live', sort: 100, ...extra });

test('no toolbox files: nothing is read, nothing is linked and nothing fails', () => {
  const f = fixture({ toolboxes: { 'graphic-designer': null }, personas: [persona('renata-brand', 'graphic-designer')] });
  try {
    const { links, problems, roles } = itemAgents({ rolesDir: f.rolesDir, personasDir: f.personasDir });
    assert.equal(links.size, 0); assert.deepEqual(problems, []); assert.equal(roles, 0);
    assert.equal(readToolboxes(path.join(f.root, 'nowhere')).toolboxes.size, 0);
    assert.equal(readPersonas(path.join(f.root, 'nowhere')).size, 0);
    assert.equal(itemAgents({ rolesDir: path.join(f.root, 'nowhere'), personasDir: path.join(f.root, 'nowhere') }).links.size, 0);
    assert.equal(loadItemAgents(path.join(f.root, 'no-data')).size, 0);
    assert.equal(agentsSection(undefined), ''); assert.equal(agentsSection([]), '');
  } finally { f.done(); }
});

test('an item links to the agents whose role lists it, by library ref only', () => {
  const f = fixture({
    toolboxes: { 'graphic-designer': toolbox('graphic-designer', [['kit:skills/social-graphics-spec', 'library:layout-default-breaker'], ['library:david-carson']], ['library:brand-dna-capture']) },
    personas: [persona('renata-brand', 'graphic-designer', { title: 'Brand designer' }), persona('otto-print', 'graphic-designer', { sort: 50, title: 'Print designer' }), persona('zed-retired', 'graphic-designer', { status: 'draft' }), persona('ana-books', 'bookkeeper')],
  });
  try {
    const { links, roles } = itemAgents({ rolesDir: f.rolesDir, personasDir: f.personasDir });
    assert.equal(roles, 1);
    assert.deepEqual([...links.keys()].sort(), ['brand-dna-capture', 'david-carson', 'layout-default-breaker']);
    // The directory's own order (sort, then id); an agent that is not live is left out; kit files are not library items.
    assert.deepEqual(links.get('layout-default-breaker'), [['otto-print', 'Otto', 'Print designer'], ['renata-brand', 'Renata', 'Brand designer']]);
    // Only items with a page are kept when the catalogue is known.
    const known = itemAgents({ rolesDir: f.rolesDir, personasDir: f.personasDir, known: new Set(['david-carson']) });
    assert.deepEqual([...known.links.keys()], ['david-carson']);
  } finally { f.done(); }
});

test('at most four agents: the role that uses it most often first, one agent from each role before a second', () => {
  const roles = ['a-role', 'b-role', 'c-role'];
  const f = fixture({
    toolboxes: {
      // b-role reaches for the item in its first task and c-role on every job ("always"); a-role only in its third task.
      'a-role': toolbox('a-role', [['library:other'], ['library:other-two'], ['library:shared-item']]),
      'b-role': toolbox('b-role', [['library:shared-item']]),
      'c-role': toolbox('c-role', [['library:other']], ['library:shared-item']),
      'd-role': toolbox('d-role', [['library:shared-item']]), // no agent has this role
    },
    personas: roles.flatMap((role, r) => [1, 2, 3].map((n) => persona(`${role[0]}${n}-agent`, role, { sort: r * 10 + n }))),
  });
  try {
    const { links } = itemAgents({ rolesDir: f.rolesDir, personasDir: f.personasDir });
    assert.deepEqual(links.get('shared-item').map(([id]) => id), ['b1-agent', 'c1-agent', 'a1-agent', 'b2-agent']);
    assert.equal(links.get('shared-item').length, MAX_AGENTS);
    assert.deepEqual(itemAgents({ rolesDir: f.rolesDir, personasDir: f.personasDir, max: 2 }).links.get('shared-item').map(([id]) => id), ['b1-agent', 'c1-agent']);
  } finally { f.done(); }
});

test('a toolbox that cannot be read is reported and skipped; bad agent ids never become links', () => {
  const f = fixture({
    toolboxes: { 'good-role': toolbox('good-role', [['library:real-item', 'library:Bad Slug', 'https://example.com']]), 'broken-role': '{ not json', 'old-role': { schema: 'something-else/1', tasks: [] } },
    personas: [persona('gina-good', 'good-role'), persona('../evil', 'good-role'), persona('UPPER', 'good-role'), { id: 'no-name', role: 'good-role', status: 'live' }],
  });
  try {
    const { links, problems } = itemAgents({ rolesDir: f.rolesDir, personasDir: f.personasDir });
    assert.deepEqual(problems, ['broken-role/toolbox.json is not a readable ai-blocks-toolbox/1 file', 'old-role/toolbox.json is not a readable ai-blocks-toolbox/1 file']);
    assert.deepEqual([...links], [['real-item', [['gina-good', 'Gina', 'good-role person']]]]);
  } finally { f.done(); }
});

test('the files the app reads: every shard is written, and the plain page reads the same rows back', () => {
  const f = fixture();
  try {
    const out = path.join(f.root, 'public/data/item-agents');
    const links = new Map([['ad-angle-planner', [['bao-copy', 'Bao', 'Website copywriter'], ['pooja-funnels', 'Pooja', 'Funnel copywriter']]], ['3pl-bill-auditor', [['russell-bookkeeping', 'Russell', 'Bookkeeper']]]]);
    writeItemAgents(links, out);
    assert.deepEqual(fs.readdirSync(out).sort(), SHARDS.map((c) => `${c}.json`).sort());
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, 'z.json'), 'utf8')), { schema: ITEM_AGENTS_SCHEMA, items: {} });
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, '3.json'), 'utf8')).items, { '3pl-bill-auditor': [['russell-bookkeeping', 'Russell', 'Bookkeeper']] });
    const back = loadItemAgents(path.join(f.root, 'public/data'));
    assert.deepEqual([...back].sort(), [...links].sort());
    // A second build with nothing to link leaves no stale rows.
    writeItemAgents(new Map(), out);
    assert.equal(loadItemAgents(path.join(f.root, 'public/data')).size, 0);
  } finally { f.done(); }
});

test('the block on a page: plain links to each agent profile, four at most', () => {
  const rows = [['bao-copy', 'Bao', 'Website copywriter'], ['pooja-funnels', 'Pooja', 'Funnel <copy> writer'], ['dawei-landing-pages', 'Dawei', ''], ['d-agent', 'D', 'x'], ['e-agent', 'E', 'y']];
  const html = agentsSection(rows);
  assert.match(html, new RegExp(`^<section id="agents" class="bp-next agents-block"><h2>${AGENTS_TITLE}</h2><p>[^<]+</p><ul>`));
  assert.equal(AGENTS_TITLE, 'Agents who use this');
  assert.equal((html.match(/<li>/g) ?? []).length, 4);
  assert.ok(html.includes('<li><a href="https://agents.useaiblocks.com/agents/bao-copy">Bao, Website copywriter</a></li>'));
  assert.ok(html.includes('>Pooja, Funnel &lt;copy&gt; writer</a>'));
  assert.ok(html.includes('<a href="https://agents.useaiblocks.com/agents/dawei-landing-pages">Dawei</a>'));
  assert.ok(!html.includes('e-agent'));
});

test('the build writes the files, and the app and the plain page both show the block', () => {
  assert.match(read('../package.json'), /node scripts\/build-roles\.mjs && node scripts\/build-item-agents\.mjs && /);
  const prerender = read('../scripts/prerender.mjs');
  assert.match(prerender, /const itemAgentLinks = loadItemAgents\(\);/);
  assert.match(prerender, /agentsSection\(itemAgentLinks\.get\(slug\)\),/);
  const app = read('../src/AgentsForItem.tsx');
  assert.match(app, /\/data\/item-agents\/\$\{key\}\.json/);
  assert.ok(app.includes(ITEM_AGENTS_SCHEMA) && app.includes(AGENTS_TITLE) && app.includes('.slice(0,4)'));
  assert.match(app, /if\(!rows\.length\)return null;/);
  assert.match(read('../src/BlockPage.tsx'), /<AgentsForItem slug=\{b\.slug\} \/>/);
  // The real role kits are read from the agents app; with none curated yet the build still succeeds.
  const real = itemAgents({ rolesDir: fileURLToPath(new URL('../../marketplace/packs/roles', import.meta.url)), personasDir: fileURLToPath(new URL('../../marketplace/src/modules/directory/data', import.meta.url)) });
  assert.ok(readPersonas(fileURLToPath(new URL('../../marketplace/src/modules/directory/data', import.meta.url))).size > 100, 'the agents app has its personas by role');
  for (const rows of real.links.values()) assert.ok(rows.length >= 1 && rows.length <= MAX_AGENTS);
});
