import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BOARDS, STAGES, TASK_STAGE, LIMITED_TASKS } from '../src/trust-pages/boards.mjs';
import { BOARD_NAMES, playbookFile } from '../src/trust-pages/board-names.mjs';
import { placeEntry, readFixes, boardsOf } from '../scripts/lib/board-map.mjs';
import { boardPages, STAGE_PAGE_MIN } from '../scripts/lib/board-pages.mjs';
import { DESC, TITLE } from '../src/lib/seo-meta.mjs';
import { TASKS } from '../src/lib/catalogue-taxonomy.mjs';
import { TOOLS } from '../../mini-tools/index.mjs';
import { BROWSER_TOOLS } from '../src/tools/browser-tools.mjs';
import { grade } from '../../tools/readability.mjs';

const item = (slug, name, task, summary = '', extra = {}) => ({ slug, name, task, summary, headline: name, type: 'skill', category: 'general', ...extra });

test('eleven boards, each with its 8 stages in plain words and real tools', () => {
  assert.equal(BOARDS.length, 11);
  assert.deepEqual(Object.keys(BOARD_NAMES), BOARDS.map(b => b.slug), 'the small name list matches the boards');
  for (const b of BOARDS) assert.equal(BOARD_NAMES[b.slug], b.name);
  const tools = new Set([...TOOLS, ...BROWSER_TOOLS].map(t => t.slug));
  const titles = new Set(), descs = new Set();
  for (const b of BOARDS) {
    assert.deepEqual(Object.keys(b.stages), STAGES.map(s => s.id), `${b.slug} has every stage in order`);
    for (const t of b.tools) assert.ok(tools.has(t), `${b.slug}: tool ${t} exists`);
    assert.ok(b.documentTitle.length >= TITLE.min && b.documentTitle.length <= TITLE.max, `${b.slug} title ${b.documentTitle.length}`);
    assert.ok(b.desc.length >= DESC.min && b.desc.length <= DESC.max, `${b.slug} description ${b.desc.length}`);
    assert.ok(!titles.has(b.documentTitle) && !descs.has(b.desc)); titles.add(b.documentTitle); descs.add(b.desc);
    const words = [b.intro, ...Object.values(b.stages).flat()].join(' ');
    assert.ok(grade(words) <= 8, `${b.slug} reads at grade ${grade(words)}`);
    assert.doesNotMatch(words + b.desc + b.title, /—|leverage|unlock|seamless|streamline|empower|robust|journey/i);
  }
});

test('every task the library uses has a stage or is left off on purpose', () => {
  const off = new Set(['think-with-minds', 'health-and-fitness', 'find-a-job', 'manage-personal-finances', 'study-and-practice', 'engineer-systems']);
  for (const t of TASKS) assert.ok(TASK_STAGE[t.id] || off.has(t.id), `task ${t.id} needs a stage`);
  for (const t of Object.keys(LIMITED_TASKS)) assert.ok(TASK_STAGE[t], `limited task ${t} has a stage`);
});

test('items go on the boards their words or task say, at the right stage', () => {
  const fixes = readFixes('/no/such/file').fixes;
  assert.deepEqual(boardsOf(item('shopify-speed', 'Shopify theme speed fixer', 'speed-up-store'), fixes), ['ecommerce']);
  assert.deepEqual(placeEntry(item('code-x', 'Python bug finder', 'test-and-fix-code'), fixes).made, ['saas'], 'code fits SaaS by default');
  assert.deepEqual(placeEntry(item('ios-x', 'iOS crash report reader', 'test-and-fix-code'), fixes).made, ['apps'], 'an iPhone item fits apps only');
  const lessons = placeEntry(item('ad-lessons', 'Ad lessons learned log', 'read-ad-results'), fixes);
  assert.ok(!lessons.made.includes('courses-and-coaching'), 'lessons learned is not teaching');
  assert.equal(lessons.stage, 'market');
  const email = placeEntry(item('email-x', 'Welcome email writer', 'write-emails'), fixes);
  assert.deepEqual(email.made, []);
  assert.equal(email.general.length, 11, 'a general item fits every board');
  assert.equal(placeEntry(item('amazon-x', 'Amazon listing keyword planner', 'sell-on-amazon'), fixes).stage, 'found');
  assert.equal(placeEntry(item('fba-x', 'FBA stock reorder planner', 'sell-on-amazon'), fixes).stage, 'deliver', 'a word in the name moves the stage');
  for (const off of [item('m', 'A mind', 'think-with-minds', '', { type: 'mind' }), item('stock-pick-x', 'Stock picker', 'money-and-investing'), item('run', 'Running plan', 'health-and-fitness')]) assert.equal(placeEntry(off, fixes).stage, null, off.slug);
});

test('hand fixes remove, move and are checked', () => {
  const dir = fs.mkdtempSync(`${process.env.TEMP ?? '/tmp'}/boards-`);
  fs.writeFileSync(`${dir}/b.yaml`, 'remove:\n  ecommerce: [shopify-speed]\nstage:\n  shopify-speed: keep\nadd:\n  apps: [email-x]\n  nope: [x]\n');
  const { fixes, problems } = readFixes(`${dir}/b.yaml`);
  assert.deepEqual(problems, ['boards.yaml add: unknown board "nope"']);
  const p = placeEntry(item('shopify-speed', 'Shopify theme speed fixer', 'speed-up-store'), fixes);
  assert.deepEqual(p.made, []); assert.equal(p.stage, 'keep');
  assert.deepEqual(placeEntry(item('email-x', 'Welcome email writer', 'write-emails'), fixes).made, ['apps']);
  assert.deepEqual(readFixes().problems, [], 'the real fix file is valid');
});

test('the real fix file names only items and specialists that exist', { skip: !fs.existsSync('public/data/blocks-index.json') }, () => {
  const slugs = new Set(JSON.parse(fs.readFileSync('public/data/blocks-index.json', 'utf8')).blocks.map(b => b.slug));
  const roles = new Set(JSON.parse(fs.readFileSync('public/data/roles-index.json', 'utf8')).roles.map(r => `role:${r.id}`));
  const { fixes } = readFixes();
  const named = [...Object.values(fixes.remove).flat(), ...Object.values(fixes.add).flat(), ...Object.keys(fixes.stage), ...fixes.off];
  const missing = named.filter(s => !slugs.has(s) && !roles.has(s));
  assert.ok(missing.length < named.length * 0.02, `fixes for items no longer in the library: ${missing.slice(0, 10).join(', ')}`);
});

test('board pages: a list, one page per board, and a stage page only when the stage has enough made for it', () => {
  const blocks = [
    ...Array.from({ length: STAGE_PAGE_MIN }, (_, i) => item(`shopify-x${i}`, `Shopify checkout fixer ${i}`, 'write-landing-page')),
    item('email-x', 'Welcome email writer', 'write-emails', 'Give it your offer. Get a welcome email.'),
  ];
  const { pages, problems } = boardPages({ blocks, roles: [], tools: TOOLS, fixes: readFixes('/no/such/file').fixes });
  const urls = pages.map(p => p.url);
  assert.ok(urls.includes('/industries') && BOARDS.every(b => urls.includes(`/industries/${b.slug}`)));
  assert.ok(urls.includes('/industries/ecommerce/sell'), 'eight made-for items earn a stage page');
  assert.ok(!urls.includes('/industries/ecommerce/market'), 'a stage with only general items stays on the board page');
  const shop = pages.find(p => p.url === '/industries/ecommerce').body;
  assert.match(shop, /href="\/playbooks\/FOR-ECOMMERCE\.md" download/);
  assert.match(shop, /Welcome email writer.*Any business/, 'general items fill a stage, marked as such');
  assert.ok(problems.length, 'thin boards are reported');
  for (const p of pages) {
    assert.ok(p.desc.length >= DESC.min && p.desc.length <= DESC.max, `${p.url} description ${p.desc.length}`);
    assert.ok(p.documentTitle.length <= TITLE.max, `${p.url} title ${p.documentTitle.length}`);
  }
});

test('every board has a playbook your AI can follow, stage by stage', () => {
  for (const b of BOARDS) {
    const file = `public/playbooks/${playbookFile(b.slug)}`;
    assert.ok(fs.existsSync(file), `${file} exists`);
    const text = fs.readFileSync(file, 'utf8');
    assert.ok(text.startsWith(`# Playbook: ${b.name}`), `${file} title`);
    assert.doesNotMatch(text, /\r|—/, `${file}: LF endings and no em dashes`);
    let at = 0;
    for (const [i, s] of STAGES.entries()) {
      const h = `### ${i + 1}. ${b.stages[s.id][0]}`;
      const n = text.indexOf(h, at);
      assert.ok(n > at, `${file} has "${h}" in order`); at = n;
    }
    for (const h of ['## This business', '## Numbers that matter', '## Words this business uses', '## Ask the owner first', '## Rules']) assert.ok(text.includes(h), `${file}: ${h}`);
    assert.ok(grade(text.replace(/[#*`-]/g, ' ')) <= 10, `${file} reads at grade ${grade(text)}`);
  }
});
