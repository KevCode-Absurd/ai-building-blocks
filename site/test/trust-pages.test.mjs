import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CASES, INDUSTRIES as EVAL_INDUSTRIES } from '../src/outcomes/evals/cases.mjs';
import { CONTROLS, CASE_TOLERANCE, PASS_SCORE } from '../src/outcomes/evals/rubric.mjs';
import { CHECK_WORDS, CONTROL_WORDS, INDUSTRY_LABELS, hostName, howWeTestPage, rubricChecks, stageGrading, testFacts } from '../src/trust-pages/how-we-test.mjs';
import { INDUSTRIES, START_JOB, FALLBACK_JOB_PATH } from '../src/trust-pages/industries.mjs';
import { brokenLinks, guidesSitemap, howWeTest, pickIndustryItems, startJobHref } from '../scripts/lib/trust-pages.mjs';
import { DESC, TITLE } from '../src/lib/seo-meta.mjs';
import { BROWSER_TOOLS } from '../src/tools/browser-tools.mjs';
import { TOOLS } from '../../mini-tools/index.mjs';
import { grade } from '../../tools/readability.mjs';

const card = JSON.parse(fs.readFileSync(new URL('../src/outcomes/evals/scorecard.json', import.meta.url), 'utf8'));
const rubricSource = fs.readFileSync(new URL('../src/outcomes/evals/rubric.mjs', import.meta.url), 'utf8');
const checks = rubricChecks(rubricSource);
const page = (over = {}) => howWeTestPage({ card, cases: CASES, checks, controls: CONTROLS, passScore: PASS_SCORE, tolerance: CASE_TOLERANCE, ...over });
const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/&ldquo;|&rdquo;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('How we test reads every number from the scorecard, cases and rubric', async () => {
  const p = await howWeTest();
  const f = p.facts;
  const scores = card.cases.map(c => c.score);
  assert.equal(f.requests, CASES.length);
  assert.equal(f.industries, EVAL_INDUSTRIES.length);
  assert.equal(f.average, card.average);
  assert.equal(f.min, Math.min(...scores));
  assert.equal(f.max, Math.max(...scores));
  assert.equal(f.controls.length, CONTROLS.length);
  assert.equal(f.controlsRun, card.cases.reduce((n, c) => n + c.controls_run, 0));
  assert.equal(f.controlsRefused, card.cases.reduce((n, c) => n + c.controls_refused, 0));
  assert.equal(f.totalPoints, 100, 'the rubric items add up to 100');
  const text = strip(p.body);
  for (const c of CASES) assert.ok(text.includes(`"${c.request}"`), `request shown: ${c.id}`);
  for (const s of [`${f.controlsRefused} of ${f.controlsRun}`, `${card.average} out of 100`, `pass mark is ${card.pass_score}`, `more than ${CASE_TOLERANCE} points below`]) assert.ok(text.includes(s), s);
  assert.match(text, /made up for testing/);
  assert.ok(p.desc.length >= DESC.min && p.desc.length <= DESC.max, `description ${p.desc.length}`);
  assert.ok(p.documentTitle.length >= TITLE.min && p.documentTitle.length <= TITLE.max, `title ${p.documentTitle.length}`);
  assert.doesNotMatch(p.body + p.desc, /—/, 'no em dashes');
});

test('How we test says plainly what the scores cannot show, and follows the scorecard when it changes', () => {
  const text = strip(page().body);
  assert.match(text, /Scores sit near the top/);
  assert.match(text, /cannot yet tell a good plan from a great one/);
  assert.match(text, /not the work\. Nobody has graded the work/);
  const spread = { ...card, cases: card.cases.map((c, i) => (i ? c : { ...c, score: 61 })) };
  assert.doesNotMatch(strip(page({ card: spread }).body), /near the top/);
  const graded = { ...card, cases: card.cases.map((c, i) => (i < 3 ? { ...c, stage_grade: 88 } : c)) };
  assert.deepEqual(stageGrading(graded), { graded: true, cases: 3, started: true });
  assert.match(strip(page({ card: graded }).body), /in 3 of the 30 requests, the work the steps produce/);
  assert.equal(stageGrading(card).graded, false);
  // Stream K's fields are optional: a grading field with no results yet says so, and shows no number.
  const pending = { ...card, stage_grades: { recorded: 0, cases: [] }, v2_average: 70.2 };
  assert.deepEqual(stageGrading(pending), { graded: false, cases: 0, started: true });
  const said = strip(page({ card: pending }).body);
  assert.match(said, /set up, but it has no results yet/);
  assert.ok(said.includes('harder rubric (version 2). Plans average 70.2 on it. It is reported only'), 'second rubric reported');
  assert.ok(said.includes(`${card.average} out of 100`), 'the first rubric stays the headline number');
  assert.match(strip(page({ card: { ...card, rubric_v2: { average: 71, rubric_version: 2 } } }).body), /Plans average 71 on it/);
  assert.doesNotMatch(strip(page().body), /harder rubric/);
});

test('every rubric check, broken plan and industry has plain words, with a fallback for new ones', () => {
  for (const c of checks) assert.ok(CHECK_WORDS[`${c.group}/${c.id}`], `words for ${c.group}/${c.id}`);
  for (const c of CONTROLS) assert.ok(CONTROL_WORDS[c.id], `words for ${c.id}`);
  for (const i of EVAL_INDUSTRIES) assert.ok(INDUSTRY_LABELS[i], `label for ${i}`);
  const added = testFacts({ card, cases: CASES, checks: [...checks, { group: 'plan', id: 'new-check', points: 0 }], controls: CONTROLS, passScore: PASS_SCORE, tolerance: CASE_TOLERANCE });
  assert.deepEqual(added.undescribed, ['plan/new-check']);
  assert.match(page({ checks: [...checks, { group: 'plan', id: 'new-check', points: 0 }] }).body, /New check\./);
  assert.equal(hostName('claude-sonnet-5-5 (Claude Code subagent), plan revised under method v2'), 'Claude Sonnet 5.5 in Claude Code');
});

test('industry pages: six industries with search-ready titles, plain words and real mini tools', () => {
  assert.deepEqual(INDUSTRIES.map(i => i.slug), ['ecommerce', 'saas', 'local-services', 'content-creators', 'finance', 'engineering']);
  const toolSlugs = new Set([...TOOLS, ...BROWSER_TOOLS].map(t => t.slug));
  const titles = new Set(), descs = new Set();
  for (const ind of INDUSTRIES) {
    assert.ok(EVAL_INDUSTRIES.includes(ind.eval), `${ind.slug} maps to a test industry`);
    assert.equal(INDUSTRY_LABELS[ind.eval][1], `/industries/${ind.slug}`);
    assert.ok(ind.documentTitle.length >= TITLE.min && ind.documentTitle.length <= TITLE.max, `${ind.slug} title ${ind.documentTitle.length}`);
    assert.ok(ind.desc.length >= DESC.min && ind.desc.length <= DESC.max, `${ind.slug} description ${ind.desc.length}`);
    assert.ok(!titles.has(ind.documentTitle) && !descs.has(ind.desc)); titles.add(ind.documentTitle); descs.add(ind.desc);
    assert.ok(ind.jobs.length >= 4 && ind.jobs.length <= 6);
    for (const slug of ind.tools) assert.ok(toolSlugs.has(slug), `${ind.slug}: mini tool ${slug} exists`);
    const words = [...ind.intro, ind.example ?? '', ...ind.jobs.flatMap(j => [j.job, j.why])].join(' ');
    assert.ok(grade(words) <= 8, `${ind.slug} reads at grade ${grade(words)}`);
    assert.doesNotMatch(words + ind.desc + ind.title, /—|leverage|unlock|seamless|streamline|empower|robust/i);
    if (ind.slug !== 'ecommerce') assert.doesNotMatch(words, /Sprout/, 'Sprout is the only example business, used where it fits');
  }
});

test('industry pages never borrow the made-up test businesses', () => {
  // Distinctive facts from the test owners' answers (outcomes/evals/cases.mjs) must not appear on an industry page.
  const tell = /\b(?:Rs\.? ?\d|hot sauce|Judge\.me|Klaviyo|8,000 subscribers|2,000 subscribers|200-question|photography|40 minutes|three weeks)\b/i;
  for (const ind of INDUSTRIES) assert.doesNotMatch(JSON.stringify(ind), tell, ind.slug);
});

test('picks come from the catalogue, skip what is not for owners, and report what is missing', () => {
  const blocks = [
    { slug: 'abandoned-cart-email-writer', name: 'Abandoned cart email writer', headline: 'x', summary: 'Write emails that win back an abandoned cart.', type: 'skill', task: 'write-emails' },
    { slug: 'win-back-abandoned-checkout', name: 'Win back abandoned checkout', headline: 'x', summary: 'A workflow for abandoned cart checkout recovery.', type: 'workflow', category: 'orchestrator', task: 'write-emails' },
    { slug: 'copilot-abandoned-cart', name: 'Copilot abandoned cart', headline: 'x', summary: 'Abandoned cart checkout copilot.', type: 'skill', task: 'write-code' },
  ];
  const roles = { roles: [{ id: 'cro-specialist', name: 'CRO specialist', summary: 'Checkout and conversion work.', area: 'marketing', deliverables: ['checkout audit'], keywords: 'checkout conversion abandoned cart email' }] };
  const { industries, problems } = pickIndustryItems({ cat: { blocks }, readPage: () => ({}), roles, tools: [...TOOLS, ...BROWSER_TOOLS] });
  const shop = industries.find(i => i.slug === 'ecommerce');
  assert.deepEqual(shop.jobs[0].items.map(b => b.slug), ['abandoned-cart-email-writer']);
  assert.equal(shop.jobs[0].workflow.slug, 'win-back-abandoned-checkout');
  assert.ok(shop.specialists.some(r => r.id === 'cro-specialist'));
  assert.ok(problems.some(p => /no catalogue match/.test(p)), 'a job with nothing to show is reported');
  assert.ok(!problems.some(p => /mini tool/.test(p)), 'every named mini tool exists');
});

test('Start this job goes to the outcome page when it is built, and to the planner otherwise', () => {
  assert.equal(startJobHref('Cut my returns', () => false), FALLBACK_JOB_PATH);
  assert.equal(START_JOB.path, '/get-it-done');
  assert.equal(startJobHref('Cut my returns', p => p === START_JOB.path), START_JOB.param ? `${START_JOB.path}?${START_JOB.param}=Cut%20my%20returns` : START_JOB.path);
});

test('link check and sitemap cover every guide page', () => {
  const pages = [{ url: '/how-we-test', body: '<a href="/industries">x</a><a href="/skills/real">y</a><a href="/roles/gone">z</a>' }, { url: '/industries', body: '<a href="/tools/cash-runway?x=1#y">t</a>' }];
  const broken = brokenLinks(pages, { cat: { blocks: [{ slug: 'real', headline: 'x', type: 'skill' }] }, roles: { roles: [] }, tools: TOOLS });
  assert.deepEqual(broken, ['/how-we-test -> /roles/gone']);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'guides-'));
  guidesSitemap([{ url: '/how-we-test', modified: '2026-11-02' }, { url: '/industries' }], dir);
  const xml = fs.readFileSync(path.join(dir, 'sitemap-guides.xml'), 'utf8');
  assert.match(xml, /<loc>https:\/\/useaiblocks\.com\/how-we-test<\/loc><lastmod>2026-11-02<\/lastmod>/);
  assert.match(xml, /<loc>https:\/\/useaiblocks\.com\/industries<\/loc><\/url>/);
});

test('connect guide: one set of steps per AI tool, each ending with a check that has a real expected answer', () => {
  const html = fs.readFileSync(new URL('../src/content/api-mcp.html', import.meta.url), 'utf8');
  const section = html.slice(html.indexOf('<section id="clients"'), html.indexOf('<section id="reuse"'));
  const tool = TOOLS.find(t => t.slug === 'discount-calculator');
  for (const id of ['claude', 'claude-code', 'chatgpt', 'codex', 'cursor']) {
    const body = section.slice(section.indexOf(`data-testid="connect-${id}"`), section.indexOf('</details>', section.indexOf(`data-testid="connect-${id}"`)));
    assert.ok(body.length > 100, `${id} has steps`);
    assert.match(body, new RegExp(`id="check-${id}">[^<]*get_item with id "discount-calculator"`), `${id} check prompt`);
    assert.match(body, new RegExp(`data-copy="check-${id}"`));
    assert.ok(body.includes(`<strong>${tool.name}</strong>`) && body.includes(`https://useaiblocks.com/tools/${tool.slug}`), `${id} expected answer matches the mini tool's real name`);
    assert.match(body, /class="source"><a href="https:\/\//, `${id} links its official docs`);
  }
  assert.match(section, /list_saved_items/);
  assert.match(section, /list_company_items/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'element ids stay unique for the copy buttons');
  for (const m of section.matchAll(/data-copy="([^"]+)"/g)) assert.ok(ids.includes(m[1]), `copy target ${m[1]} exists`);
});

test('the consent page tells people how to confirm the connection, with no inline script', () => {
  const html = fs.readFileSync(new URL('../connect-mcp.html', import.meta.url), 'utf8');
  assert.match(html, /id="check-prompt">[^<]*list_saved_items/);
  assert.doesNotMatch(html.replace('<script type="module" src="/src/mcp-connect.ts"></script>', ''), /<script/i, 'CSP: the page keeps its single module script');
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  const ts = fs.readFileSync(new URL('../src/mcp-connect.ts', import.meta.url), 'utf8');
  assert.match(ts, /if \(check && !personal\) check\.textContent = '[^']*list_company_items/);
});
