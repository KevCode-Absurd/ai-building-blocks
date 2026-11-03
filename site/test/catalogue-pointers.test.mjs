import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';
import { findItemNames, linkNotFor, makeNameIndex, unresolvedPointers } from '../../tools/lib/not-for-links.mjs';
import { addPrerequisite, codeNote, mapItems, quoteMapItems, runsCode, saysRunsCode } from '../../tools/lib/page-lists.mjs';
import { cluster, prepare, siblingsFile, startHere } from '../../tools/cluster-siblings.mjs';
import { notForParts } from '../src/lib/not-for-parts.mjs';
import { rowFacts } from '../scripts/lib/similar-items.mjs';
import { similarHtml, skipWhenItems } from '../scripts/lib/similar-html.mjs';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const items = [
  { slug: 'meta-ads-compliance-checker', name: 'Meta ad policy checker', aliases: ['Meta ads compliance checker'], href: '/skills/meta-ads-compliance-checker' },
  { slug: 'agency-data-analyst', name: 'Data analyst', href: '/agents/agency-data-analyst' },
  { slug: 'ad-angle-planner', name: 'Ad angle planner', href: '/skills/ad-angle-planner' },
  { slug: 'self-item', name: 'Self item checker', href: '/skills/self-item' },
];
const index = makeNameIndex(items, { 'ad-concept-grid-planner': 'ad-angle-planner' });

test('not_for names: the current name links, an earlier name is put right, everyday words are left alone', () => {
  const now = findItemNames('You want a policy check. Use the Meta ad policy checker instead.', index, 'x');
  assert.deepEqual(now.map((f) => [f.said, f.slug, f.how]), [['Meta ad policy checker', 'meta-ads-compliance-checker', 'name']]);
  const old = findItemNames('Use the Meta ads compliance checker first.', index, 'x');
  assert.deepEqual(old.map((f) => [f.said, f.name, f.how]), [['Meta ads compliance checker', 'Meta ad policy checker', 'old']]);
  // An old slug from renamed.json, written out in words, after "the".
  assert.equal(findItemNames('Plan it with the ad concept grid planner.', index, 'x')[0]?.slug, 'ad-angle-planner');
  // "ask a data analyst" is a person; "the Data analyst" is the item.
  assert.deepEqual(findItemNames('You need a full review: ask a data analyst.', index, 'x'), []);
  assert.equal(findItemNames('Hire the Data analyst agent.', index, 'x')[0]?.slug, 'agency-data-analyst');
  // A page never links to itself, and a sentence break is never part of a name.
  assert.deepEqual(findItemNames('Use the Self item checker.', index, 'self-item'), []);
  assert.deepEqual(findItemNames('Ask about meta. Ad angle planner.', index, 'x').map((f) => f.slug), ['ad-angle-planner']);
});

test('linkNotFor rewrites earlier names and records where each link sits; notForParts splits on them', () => {
  const lines = ['Use the Meta ads compliance checker, or the Ad angle planner.', { Odd: 'map' }, 'Ask a lawyer.'];
  const out = linkNotFor(lines, index, 'x');
  assert.equal(out.fixed, 1);
  assert.equal(out.lines[0], 'Use the Meta ad policy checker, or the Ad angle planner.');
  assert.deepEqual(out.lines[1], { Odd: 'map' });
  assert.deepEqual(out.links.map((l) => [l.line, out.lines[0].slice(l.start, l.end), l.href]), [
    [0, 'Meta ad policy checker', '/skills/meta-ads-compliance-checker'], [0, 'Ad angle planner', '/skills/ad-angle-planner'],
  ]);
  const parts = notForParts(out.lines[0], out.links, 0);
  assert.deepEqual(parts.map((p) => p.href ?? '-'), ['-', '/skills/meta-ads-compliance-checker', '-', '/skills/ad-angle-planner', '-']);
  assert.equal(parts.map((p) => p.text).join(''), out.lines[0]);
  // Links for another line, out of range or not on this site are ignored.
  assert.deepEqual(notForParts('Ask a lawyer.', [{ line: 2, start: 0, end: 99, href: '/x' }, { line: 2, start: 0, end: 3, href: 'https://evil.test' }], 2), [{ text: 'Ask a lawyer.' }]);
  assert.deepEqual(unresolvedPointers('Use the Ghost report maker instead.', []), ['Ghost report maker']);
  assert.deepEqual(unresolvedPointers('Use the Ad angle planner.', findItemNames('Use the Ad angle planner.', index, 'x')), []);
});

test('prerendered Skip it when lines link the item and escape the text', () => {
  const page = { not_for: ['Use the <b>Ad angle planner</b>.'], not_for_links: [{ line: 0, start: 11, end: 27, href: '/skills/ad-angle-planner' }] };
  assert.deepEqual(skipWhenItems(page, esc), ['Use the &lt;b&gt;<a href="/skills/ad-angle-planner">Ad angle planner</a>&lt;/b&gt;.']);
  const rows = [{ slug: 'a', name: 'A & co', href: '/skills/a', summary: 'Does A.', give: ['x'], get: ['y'], start: true }, { slug: 'b', name: 'B', href: '/skills/b', summary: 'Does B.', give: [], get: [] }];
  const html = similarHtml(rows, 'b', esc);
  assert.match(html, /<h3>Similar items and how they differ<\/h3>/);
  assert.match(html, /<a href="\/skills\/a">A &amp; co<\/a> <b>Start here<\/b>/);
  assert.match(html, /<span aria-current="page">B<\/span> \(this page\)/);
  assert.equal(similarHtml(rows.slice(0, 1), 'a', esc), '');
});

test('list lines that YAML read as maps are found and quoted, keeping CRLF and everything else', () => {
  const raw = ['name: X', 'how_to_use:', '  - Open it.', '  - Check: the totals match', '  - Note:', 'output_sample:', '  input:', '    - Orders', '  prerequisites:', '    - Time: 30 minutes', '  output:', '    - name: a', '      contains: b', 'how_it_works:', '  - title: Kept', '    text: As a map', ''].join('\r\n');
  const page = YAML.parse(raw);
  assert.deepEqual(mapItems(page), [{ field: 'how_to_use', index: 1 }, { field: 'how_to_use', index: 2 }, { field: 'output_sample.prerequisites', index: 0 }]);
  const { text, fixed } = quoteMapItems(raw);
  assert.equal(fixed, 3);
  assert.ok(!/[^\r]\n/.test(text), 'line endings stay CRLF');
  const after = YAML.parse(text);
  assert.deepEqual(after.how_to_use, ['Open it.', 'Check: the totals match', 'Note:']);
  assert.deepEqual(after.output_sample.prerequisites, ['Time: 30 minutes']);
  assert.deepEqual(after.how_it_works, page.how_it_works);
  assert.equal(quoteMapItems(text).fixed, 0);
});

test('a skill that runs code must say so, and the fix adds one plain line to Before you start', () => {
  assert.equal(runsCode('Read the notes.', true), 'scripts folder');
  assert.equal(runsCode('Run `python scripts/check.py data.csv`.'), 'scripts');
  assert.equal(runsCode('```bash\npython3 -m pip install pandas\n```'), 'commands');
  assert.equal(runsCode('```\nnpx skills add org/repo --skill x\n```\nThen make them stay.'), '');
  assert.equal(saysRunsCode({ output_sample: { prerequisites: ['An AI that can run code'] } }), true);
  assert.equal(saysRunsCode({ how_to_use: ['The bundled check script needs Node.js 20 or later.'] }), true);
  assert.equal(saysRunsCode({ summary: 'Plan a Python app.' }), false);
  const withList = 'output_sample:\n  input:\n    - Orders\n  prerequisites:\n    - An AI that can read files\n  output:\n    - name: a\n      contains: b\n';
  assert.deepEqual(YAML.parse(addPrerequisite(withList, codeNote('scripts folder'))).output_sample.prerequisites, ['An AI that can read files', 'An AI that can run code, to use the scripts that come with this skill']);
  const noList = 'name: X\r\noutput_sample:\r\n  input:\r\n    - Orders\r\n    - Dates\r\n  output:\r\n    - name: a\r\n      contains: b\r\n';
  const added = addPrerequisite(noList, codeNote('commands'));
  assert.deepEqual(YAML.parse(added).output_sample, { input: ['Orders', 'Dates'], prerequisites: ['An AI that can run code, to run the commands in this skill'], output: [{ name: 'a', contains: 'b' }] });
  assert.ok(!/[^\r]\n/.test(added));
  assert.equal(saysRunsCode(YAML.parse(added)), true);
  const full = `output_sample:\n  input: [a]\n  prerequisites:\n${'    - p\n'.repeat(6)}  output: []\n`;
  assert.equal(addPrerequisite(full, 'x'), null);
});

test('near-duplicates in one job group together, one is marked start here, and other jobs stay apart', () => {
  const b = (slug, name, task, summary, extra = {}) => ({ slug, name, task, summary, headline: name, outputs: ['audit_report'], cues: '', ...extra });
  const blocks = [
    b('seo-auditor', 'SEO auditor', 'search', 'Share a site. Get a scored SEO audit and ranked fixes.', { tested: 1, level: 'beginner' }),
    b('seo-site-auditor', 'SEO site auditor', 'search', 'Share the site. Get an SEO audit with ranked fixes.'),
    b('technical-seo-auditor', 'Technical SEO auditor', 'search', 'Share crawl data. Get technical SEO audit fixes.'),
    b('recipe-writer', 'Recipe writer', 'search', 'Write a recipe card for a dish.', { outputs: ['document'] }),
    b('seo-auditor-elsewhere', 'SEO auditor', 'other-job', 'Share a site. Get a scored SEO audit and ranked fixes.'),
    { slug: 'mind', name: 'SEO auditor', type: 'mind', task: 'search', headline: 'x', summary: 'SEO audit' },
  ];
  const groups = cluster(prepare(blocks));
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].members.map((m) => m.slug).sort(), ['seo-auditor', 'seo-site-auditor', 'technical-seo-auditor']);
  assert.equal(startHere(groups[0]), 'seo-auditor');
  const file = siblingsFile(blocks);
  assert.deepEqual(file.groups, [{ job: 'search', start: 'seo-auditor', items: ['seo-auditor', 'seo-site-auditor', 'technical-seo-auditor'] }]);
  assert.deepEqual(rowFacts({ output_sample: { input: ['A', 'B', 'C'], output: [{ name: 'Report', contains: 'x' }] }, you_get: ['ignored'] }), { give: ['A', 'B'], get: ['Report'] });
});

test('build-index links not_for names under their current name and ships the similar items table', async () => {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'abb-pointers-test-'));
  const cat = path.join(base, 'catalogue');
  const skill = async (slug, name, page) => {
    const folder = path.join(cat, 'general', slug);
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(path.join(folder, 'item.yaml'), `slug: ${slug}\nname: ${name}\ntype: skill\njob: research\ninputs: [source_text]\noutputs: [document]\n`);
    await fs.writeFile(path.join(folder, 'SKILL.md'), `---\nname: ${slug}\ndescription: x\n---\n# ${name}\nRead the note.\n`);
    await fs.writeFile(path.join(folder, 'page.yaml'), [`name: ${name}`, `headline: ${name}`, 'summary: Check a note.', 'subhead: Paste a note and get a check.', ...page, ''].join('\n'));
  };
  try {
    await fs.mkdir(path.join(base, 'src/lib'), { recursive: true });
    await fs.copyFile(new URL('../src/lib/data.ts', import.meta.url), path.join(base, 'src/lib/data.ts'));
    await fs.mkdir(path.join(cat, 'minds'), { recursive: true });
    await fs.writeFile(path.join(cat, 'minds/_roster.yaml'), 'areas: {}\nminds: []\n');
    await fs.writeFile(path.join(cat, '_types.yaml'), 'files:\n  source_text: {desc: Supplied notes}\n  document: {desc: A report}\n');
    await skill('note-checker', 'Note checker', ['you_give: [A note, Your rules]', 'you_get: [A verdict]', 'not_for:', '  - "You need a full audit: use the Old audit maker."', '  - Ask a lawyer.']);
    await skill('audit-maker', 'Audit maker', ['you_give: [Your files]', 'you_get: [An audit]', 'not_for:', '  - You only need one note checked. Use the note checker.']);
    await fs.writeFile(path.join(cat, 'display-copy.yaml'), 'audit-maker:\n  name: Full audit writer\n  aliases:\n    - Old audit maker\n');
    await fs.writeFile(path.join(cat, 'siblings.json'), JSON.stringify({ groups: [{ job: 'x', start: 'note-checker', items: ['note-checker', 'audit-maker', 'gone-item'] }] }));
    const script = path.resolve(new URL('../scripts/build-index.mjs', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    const result = spawnSync(process.execPath, [script], { cwd: base, env: { ...process.env, CATALOGUE_ROOT: cat }, encoding: 'utf8', windowsHide: true });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const read = async (slug) => JSON.parse(await fs.readFile(path.join(base, 'public/data/pages', `${slug}.json`), 'utf8'));
    const page = await read('note-checker');
    assert.deepEqual(page.not_for, ['You need a full audit: use the Full audit writer.', 'Ask a lawyer.']);
    assert.deepEqual(page.not_for_links, [{ line: 0, start: page.not_for[0].indexOf('Full'), end: page.not_for[0].indexOf('Full') + 'Full audit writer'.length, href: '/skills/audit-maker' }]);
    assert.deepEqual(page.siblings.map((r) => [r.slug, r.name, !!r.start, r.give, r.get]), [
      ['note-checker', 'Note checker', true, ['A note', 'Your rules'], ['A verdict']],
      ['audit-maker', 'Full audit writer', false, ['Your files'], ['An audit']],
    ]);
    const other = await read('audit-maker');
    assert.deepEqual(other.not_for_links, [{ line: 0, start: other.not_for[0].indexOf('note checker'), end: other.not_for[0].indexOf('note checker') + 12, href: '/skills/note-checker' }]);
    assert.equal(other.siblings.length, 2);
  } finally {
    assert.equal(path.dirname(base), path.resolve(os.tmpdir()));
    await fs.rm(base, { recursive: true, force: true });
  }
});
