// The format pages: /skills, /prompts, /workflows and /agents each say what the format is, when to use it, how to use
// one in three steps, where to search and which items to start with; /which-one compares every format in one table.
// Counts come from the catalogue, the pages are in the sitemap and the menu, and the copy stays plain.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { grade, longSentences } from '../../tools/readability.mjs';
import { FORMATS, TOOL_FORMAT, WHICH_ONE, formatOfKind, formatOfPath } from '../src/lib/formats.mjs';
import { KIND_GLOSSARY } from '../src/lib/kinds-glossary.ts';
import { FORMAT_PAGE_URLS, formatBar, formatIntro, formatLinks, formatPage, formatPages, formatSearch, kindOf, topItems, whichOnePage } from '../scripts/lib/format-pages.mjs';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

// A small catalogue: 5 skills in 3 jobs, 2 prompts, 1 workflow, 1 agent, 1 mind, and a skill with no page.
const block = (slug, extra = {}) => ({ slug, name: slug.replace(/-/g, ' '), summary: `Give it ${slug}. You get a result.`, task: 'write-ad-copy', tested: 1, ...extra });
const BLOCKS = [
  block('alpha-skill', { usedIn: 3 }), block('beta-skill', { usedIn: 9 }), block('gamma-skill', { task: 'check-ads', usedIn: 1 }),
  block('delta-skill', { task: 'check-ads', origin: 'imported', usedIn: 1 }), block('plain-english-editor', { task: 'document-work' }),
  block('hidden-skill', { headline: '' }),
  block('ad-claim-sorter', { type: 'prompt' }), block('second-prompt', { type: 'prompt', task: 'document-work' }),
  block('ad-landing-page', { type: 'workflow', category: 'orchestrator' }),
  block('agency-sales-coach', { type: 'agent' }),
  block('warren-buffett', { type: 'mind', task: 'think-with-minds' }),
];
const TASKS = { 'write-ad-copy': 'Write ad copy', 'check-ads': 'Check ads', 'document-work': 'Document work' };
const TOOLS = [{ slug: 'ai-time-saved', name: 'AI time saved', summary: 'Enter your times. See the hours saved.' }, { slug: 'other-tool', name: 'Other tool', summary: 'Another one.' }];
const build = (blocks = BLOCKS, extra = {}) => formatPages({ blocks, taskNames: TASKS, tools: TOOLS, toolExample: 'ai-time-saved', ...extra });

test('every catalogue format has one definition, three steps and a real example slug', () => {
  assert.deepEqual(FORMATS.map((f) => f.id), ['skill', 'prompt', 'workflow', 'agent', 'mind']);
  for (const f of FORMATS) {
    // The one-line definition is the glossary's, so a kind is described the same way on every page.
    assert.equal(f.define, KIND_GLOSSARY.find((k) => k.id === f.id).define);
    assert.deepEqual(f.steps.map(([name]) => name), ['Download', 'Add it to your AI', 'Ask']);
    assert.match(f.steps[0][1], new RegExp(`Download ${f.noun}\\b`));
    assert.match(f.example, /^[a-z0-9-]+$/);
    assert.ok(f.what && f.choose && f.useWhen && f.next, f.id);
    assert.equal(formatOfKind(f.id), f);
    assert.equal(formatOfPath(f.path.slice(1)), f);
  }
  assert.equal(formatOfPath('jobs'), undefined);
  assert.equal(TOOL_FORMAT.path, '/tools');
});

test('the pages are /skills, /prompts, /workflows, /agents and /which-one; minds keep their own page', () => {
  assert.deepEqual(FORMAT_PAGE_URLS, ['/skills', '/prompts', '/workflows', '/agents', '/which-one']);
  const { pages, problems } = build();
  assert.deepEqual(problems, []);
  assert.deepEqual(pages.map((p) => p.url), FORMAT_PAGE_URLS);
  for (const p of pages) assert.ok(p.hub && p.plain && p.collection, `${p.url} is a plain hub page`);
});

test('a format page says what it is, when to use it, how to use one, where to search and what to start with', () => {
  const skills = build().pages.find((p) => p.url === '/skills');
  const body = skills.body, words = text(body);
  assert.equal(skills.h1, 'Skills');
  // The count is the catalogue's: 5 skills have a page here, the sixth has none.
  assert.equal(skills.count, 5);
  assert.match(words, /^5 free skills to download and use in Claude, ChatGPT or Gemini\./);
  const f = formatOfKind('skill');
  assert.ok(words.includes(f.what) && words.includes(f.choose), 'what it is and when to use it');
  assert.match(body, /<h2 class="hub-h2">How to use a skill<\/h2><ol class="bz-how fmt-steps">(?:<li>.*?<\/li>){3}<\/ol>/);
  // Search opens the library with this format chosen.
  assert.match(body, /<form class="search big hub-search" action="\/#library" method="get" role="search"><input type="hidden" name="kind" value="skill" \/><input type="search" name="q" placeholder="Search 5 skills"/);
  assert.match(body, /<a href="\/\?kind=skill#library">Browse all 5 skills<\/a>/);
  assert.match(body, /<h2 class="hub-h2">Start with these<\/h2><div class="grid hub-grid"><a class="card hub-card" href="\/skills\//);
  assert.match(body, /<h2 class="hub-h2">Skills by job<\/h2>.*<a href="\/jobs\/write-ad-copy">Write ad copy \(2\)<\/a>/);
  assert.match(body, /<a href="\/which-one">Which one do I need\?<\/a>/);
  assert.ok(!body.includes('hidden-skill'), 'an item with no page is never linked');
  assert.equal(skills.main['@type'], 'ItemList');
  assert.deepEqual(skills.crumbs, [[WHICH_ONE.label, WHICH_ONE.path]]);
  // Every heading sits one level under the page heading.
  assert.ok(!/<h[13456]\b/.test(body));
});

test('counts follow the catalogue: add an item and the page says so', () => {
  const more = [...BLOCKS, block('new-prompt', { type: 'prompt' })];
  assert.match(text(build().pages.find((p) => p.url === '/prompts').body), /^2 free prompts /);
  const prompts = build(more).pages.find((p) => p.url === '/prompts');
  assert.match(text(prompts.body), /^3 free prompts /);
  assert.match(prompts.desc, /^3 free AI prompts\./);
  assert.match(build(more).pages.at(-1).body, /<a href="\/prompts">Prompt<\/a><span class="fmt-count">3 in the library<\/span>/);
  // No count is typed into the source.
  for (const file of ['../scripts/lib/format-pages.mjs', '../src/lib/formats.mjs']) assert.doesNotMatch(read(file), /\b\d{3,}\b|\b\d,\d{3}\b/, `${file} holds no item counts`);
});

test('the items a page opens with: picks first, then the most used, one per job, ours before imported', () => {
  const slugs = (kind, options) => topItems(BLOCKS, kind, options).map((b) => b.slug);
  // beta is used most; alpha shares its job, so the next jobs come first; delta is imported and shares gamma's job.
  assert.deepEqual(slugs('skill'), ['beta-skill', 'gamma-skill', 'plain-english-editor']);
  assert.deepEqual(slugs('skill', { perJob: 2 }), ['beta-skill', 'alpha-skill', 'gamma-skill', 'delta-skill', 'plain-english-editor']);
  // A pick comes first whatever its rank, and takes its job's place: a pick that is missing or of another format is skipped.
  assert.deepEqual(slugs('skill', { picks: ['alpha-skill', 'not-there', 'ad-claim-sorter'] }), ['alpha-skill', 'gamma-skill', 'plain-english-editor']);
  assert.deepEqual(slugs('skill', { count: 1 }), ['beta-skill']);
  assert.deepEqual(slugs('mind'), ['warren-buffett']);
  assert.equal(kindOf({ type: 'routine' }), 'workflow');
  assert.equal(kindOf({ category: 'orchestrator' }), 'workflow');
  assert.equal(kindOf({}), 'skill');
});

test('the agents page tells an agent from a specialist and from the agents site', () => {
  const agents = build().pages.find((p) => p.url === '/agents');
  assert.match(agents.body, /A <a href="\/roles">specialist<\/a> is a ready-made AI role/);
  assert.match(agents.body, /The <a href="https:\/\/agents\.useaiblocks\.com">agents site<\/a> has named agents/);
  assert.match(text(agents.body), /How to use an agent/);
  assert.ok(!build().pages.find((p) => p.url === '/skills').body.includes('agents.useaiblocks.com'));
});

test('which-one compares every format in one table, each with a real example from the catalogue', () => {
  const { page, problems } = whichOnePage({ blocks: BLOCKS, tools: TOOLS, toolExample: 'ai-time-saved' });
  assert.deepEqual(problems, []);
  assert.equal(page.url, '/which-one');
  assert.equal(page.h1, 'Skills, prompts and workflows: which one do I need?');
  const rows = [...page.body.matchAll(/<tr><th scope="row"><a href="([^"]+)">([^<]+)<\/a><span class="fmt-count">([^<]+)<\/span><\/th><td data-label="What it is">([^<]+)<\/td><td data-label="Use it when">([^<]+)<\/td><td data-label="A real example"><a href="([^"]+)">([^<]+)<\/a><span>([^<]+)<\/span><\/td><\/tr>/g)];
  assert.deepEqual(rows.map((r) => [r[1], r[2], r[3], r[6]]), [
    ['/skills', 'Skill', '5 in the library', '/skills/plain-english-editor'],
    ['/prompts', 'Prompt', '2 in the library', '/prompts/ad-claim-sorter'],
    ['/workflows', 'Workflow', '1 in the library', '/workflows/ad-landing-page'],
    ['/agents', 'Agent', '1 in the library', '/agents/agency-sales-coach'],
    ['/minds', 'Mind', '1 in the library', '/minds/warren-buffett'],
    ['/tools', 'Tool', '2 on the Tools page', '/tools/ai-time-saved'],
  ]);
  // The example line is the item's own summary.
  assert.equal(rows[1][8], 'Give it ad-claim-sorter. You get a result.');
  assert.match(text(page.body), /^The library has six formats\./);
  assert.match(page.body, /<h2 class="hub-h2">Names that sound alike<\/h2>/);
  for (const href of ['/roles', 'https://agents.useaiblocks.com', '/ai-tools']) assert.ok(page.body.includes(`<a href="${href}">`), href);
});

test('a renamed example falls back to the top item; a format with nothing to show stops the build', () => {
  const renamed = BLOCKS.filter((b) => b.slug !== 'ad-claim-sorter');
  const { page, problems } = whichOnePage({ blocks: renamed, tools: TOOLS, toolExample: 'gone' });
  assert.deepEqual(problems, []);
  assert.match(page.body, /<a href="\/prompts\/second-prompt">/);
  assert.match(page.body, /<a href="\/tools\/ai-time-saved">/);
  const empty = build(BLOCKS.filter((b) => b.type !== 'agent'));
  assert.deepEqual(empty.problems, ['/agents: no items of this format in the catalogue', '/which-one: no agent in the catalogue to show as an example']);
});

test('the format bar marks the page you are on, and minds and tools get the same intro', () => {
  const bar = formatBar('/prompts');
  assert.match(bar, /<nav class="hub-pages fmt-bar" aria-label="Formats"><a href="\/skills">Skills<\/a><b aria-current="page">Prompts<\/b><a href="\/workflows">Workflows<\/a><a href="\/agents">Agents<\/a><a href="\/minds">Minds<\/a><a href="\/tools">Tools<\/a><a href="\/which-one">Which one do I need\?<\/a><\/nav>/);
  assert.match(formatBar('/which-one'), /<b aria-current="page">Which one do I need\?<\/b>/);
  assert.match(formatIntro(formatOfKind('mind')), /<h2 class="hub-h2">What a mind is, and when to use one<\/h2><p class="hub-gets">A mind is how a well-known expert thinks/);
  assert.match(formatIntro(TOOL_FORMAT), /What a tool is, and when to use one/);
  assert.match(formatSearch(formatOfKind('agent'), 1234), /placeholder="Search 1,234 agents"/);
  assert.deepEqual(formatLinks(), [['/skills', 'Skills'], ['/prompts', 'Prompts'], ['/workflows', 'Workflows'], ['/agents', 'Agents'], ['/which-one', 'Which one do I need?']]);
});

test('the copy is plain: grade 10 at most, no sentence over 25 words, no em dashes or hype', () => {
  for (const f of [...FORMATS, TOOL_FORMAT]) {
    const copy = [f.what, f.choose, f.useWhen, f.define, ...(f.steps ?? []).map(([, line]) => line), f.next ?? ''].join(' ');
    assert.ok(grade(copy) <= 10, `${f.id} copy reads at grade ${grade(copy)}`);
    assert.deepEqual(longSentences(copy), [], `${f.id} has a long sentence`);
    for (const sentence of copy.split(/(?<=[.?])\s+/)) assert.ok(sentence.split(/\s+/).length <= 25, sentence);
    assert.doesNotMatch(copy, /—|!|\b(leverage|utili[sz]e|seamless|unlock|powerful|robust|beta|human[- ]reviewed)\b/i);
  }
  const which = text(whichOnePage({ blocks: BLOCKS, tools: TOOLS }).page.body);
  assert.doesNotMatch(which, /—|\bbeta\b|\$\d/);
});

test('with the real catalogue: titles and descriptions fit the search result, and every page has enough to read', () => {
  const file = new URL('../public/data/blocks.json', import.meta.url);
  if (!fs.existsSync(file)) return; // a bare checkout has no built catalogue
  const cat = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { pages, problems } = formatPages({ blocks: cat.blocks, taskNames: TASKS, tools: TOOLS, toolExample: 'ai-time-saved' });
  assert.deepEqual(problems, []);
  const titles = new Set(), descs = new Set();
  for (const p of pages) {
    assert.ok(p.documentTitle.length >= 50 && p.documentTitle.length <= 60, `${p.url} title is ${p.documentTitle.length} characters`);
    assert.match(p.documentTitle, / \| AI Blocks$/);
    assert.ok(p.desc.length >= 120 && p.desc.length <= 155, `${p.url} description is ${p.desc.length} characters`);
    titles.add(p.documentTitle); descs.add(p.desc);
    assert.ok(text(p.body).split(' ').length >= 150, `${p.url} has enough words`);
    if (p.top) assert.equal(p.top.length, 12, `${p.url} opens with 12 items`);
  }
  assert.equal(titles.size, pages.length); assert.equal(descs.size, pages.length);
  // The examples named in formats.mjs are real items of that format.
  const bySlug = new Map(cat.blocks.map((b) => [b.slug, b]));
  for (const f of FORMATS) assert.equal(bySlug.get(f.example) && kindOf(bySlug.get(f.example)), f.id, `${f.example} is a real ${f.noun}`);
});

test('the pages are built, listed in the sitemap and opened as plain pages by the app', async () => {
  const prerender = read('../scripts/prerender.mjs');
  assert.match(prerender, /if \(formatByUrl\.has\(url\)\) return formatByUrl\.get\(url\);/);
  assert.match(prerender, /for \(const u of FORMAT_PAGE_URLS\) if \(!urls\.includes\(u\)\) urls\.push\(u\);/);
  assert.match(prerender, /format page link goes nowhere/);
  assert.match(read('../scripts/build-index.mjs'), /"\/minds", \.\.\.FORMAT_PAGE_URLS,/);
  const sitemap = read('../public/sitemap-pages.xml');
  for (const url of FORMAT_PAGE_URLS) assert.ok(sitemap.includes(`<loc>https://useaiblocks.com${url}</loc>`), `${url} is in the sitemap`);
  const { STATIC_EXACT, isStaticPage, MENU_GROUPS } = await import('../src/lib/site-nav.mjs');
  assert.deepEqual(STATIC_EXACT, FORMAT_PAGE_URLS);
  for (const url of FORMAT_PAGE_URLS) assert.equal(isStaticPage(url), true);
  // An item under a format page still opens in the app.
  for (const url of ['/skills/ad-angle-planner', '/prompts/x', '/agents/y', '/which-one-more']) assert.equal(isStaticPage(url), false, url);
  assert.equal(isStaticPage('/which-one#table'), true);
  // One menu link holds the format pages, under the name its page carries.
  const link = MENU_GROUPS.find((g) => g.id === 'find').links.find(([to]) => to === WHICH_ONE.path);
  assert.deepEqual(link, [WHICH_ONE.path, WHICH_ONE.label, 'formats']);
  assert.ok(whichOnePage({ blocks: BLOCKS, tools: TOOLS }).page.h1.startsWith(WHICH_ONE.label));
});
