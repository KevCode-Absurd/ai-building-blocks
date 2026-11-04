import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { advanceEngagement, startEngagement } from '../src/outcomes/engagement.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';
import { MCP_URL, OUTCOME_PATHS, jobStatus, looksLikeSecret, outcomeMessage, readEngagement, sampleEngagement, sampleFolder, walkthrough } from '../src/outcomes-site/owner-view.ts';
import { EXAMPLE, SEO, START, STATUS } from '../src/outcomes-site/outcome-copy.ts';
import { OUTCOME_URLS, outcomePage } from '../scripts/lib/outcome-pages.mjs';
import { grade } from '../../tools/readability.mjs';

const read = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const copy = (v) => JSON.parse(JSON.stringify(v));

test('the goal box hands the job to the owner\'s own AI through start_outcome', async () => {
  const message = outcomeMessage('  Our ad costs keep going up  ');
  assert.match(message, /start_outcome/);
  assert.match(message, /"Our ad costs keep going up"/);
  assert.match(message, /show me the plan before any work starts/);
  assert.match(message, /nothing goes live without my yes/);
  assert.ok(message.includes(MCP_URL));
  assert.match(outcomeMessage('   '), /say the job in your own words/);
  assert.equal(await looksLikeSecret('Fix my ads, budget 6 lakh'), false);
  assert.equal(await looksLikeSecret('my key is sk-ant-api03-abcdefghijklmnopqrstuvwxyz'), true);
});

test('the walkthrough is built from the worked example, so it changes when the example does', () => {
  const w = walkthrough();
  assert.equal(w.request, example.request);
  assert.equal(w.stages.length, example.plan.stages.length);
  assert.deepEqual(w.stages.map(s => s.name), example.plan.stages.map(s => s.name));
  const gated = example.plan.stages.filter(s => s.gate !== 'none');
  assert.equal(w.stops.length, gated.length + 1, 'the plan approval, then each gated stage');
  assert.equal(w.stops[0].title, 'Approve the plan');
  assert.deepEqual(w.stops.slice(1).map(s => s.stage), gated.map(s => s.name));
  assert.ok(w.stops.length - 1 >= 3 && w.stops.length - 1 <= 5, 'the example stops for the owner 3 to 5 times');
  assert.equal(w.counts.hypotheses, example.plan.hypotheses.length);
  assert.equal(w.counts.sources, example.research.sources.length);
  assert.ok(w.counts.web >= 1, 'at least one source from outside our catalogue');
  assert.deepEqual(w.liveActions, example.plan.capabilities.filter(c => c.access === 'live').map(c => c.name));
  assert.ok(w.research.steps.every(s => s.sources.length > 0), 'every step names its sources');
  // A changed example gives a changed walkthrough.
  const changed = copy(example);
  changed.plan.stages.find(s => s.id === 'concepts').gate = 'none';
  changed.request = 'Our sales fell after the site change';
  const w2 = walkthrough(changed);
  assert.equal(w2.request, 'Our sales fell after the site change');
  assert.equal(w2.stops.length, w.stops.length - 1);
});

test('where a job stands: the sample waits on the owner\'s choice', () => {
  const s = jobStatus(sampleEngagement());
  assert.equal(s.phase, 'RUN');
  assert.equal(s.total, example.plan.stages.length);
  assert.equal(s.done, 7, 'intake, context, evidence, two checks, diagnosis and options');
  assert.equal(s.waiting.length, 1);
  assert.equal(s.waiting[0].title, 'Choose what to do');
  assert.match(s.waiting[0].detail, /Owner chooses/);
  assert.match(s.headline, /One thing waits on you/);
  assert.deepEqual(s.next, []);
  assert.deepEqual(s.data, [], 'the sample has all its data');
  assert.equal(s.stages.find(x => x.id === 'decision').stateLabel, 'Ready to run');
});

test('where a job stands: each phase, a review, live actions, blocked data and a finished round', () => {
  let e = startEngagement({ request: example.request, started: '2026-11-02', id: 'phase-test' });
  assert.match(jobStatus(e).waiting[0].title, /Answer your AI's questions/);
  e = advanceEngagement(e, { type: 'brief', brief: example.brief });
  assert.equal(jobStatus(e).phaseLabel, 'Researching and planning');
  assert.equal(jobStatus(e).waiting.length, 0);
  e = advanceEngagement(e, { type: 'plan', research: example.research, plan: example.plan });
  const review = jobStatus(e);
  assert.match(review.waiting[0].title, /Approve the plan/);
  assert.match(review.waiting[0].detail, /15 stages, stopping for you 3 times/);
  const asked = advanceEngagement(e, { type: 'approve_plan', by: 'owner', decision: 'CHANGES_REQUESTED', note: 'Leave the landing page alone' });
  assert.match(jobStatus(asked).next[0].detail, /Leave the landing page alone/);
  e = advanceEngagement(e, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
  const running = jobStatus(e);
  assert.deepEqual(running.next.map(i => i.title), ['Build or reuse the brand brain (ready to run)', 'Gather the data in one place (ready to run)']);
  // Tracking setup has no fallback, so a missing one blocks the tracking check once it is due.
  e = advanceEngagement(e, { type: 'data', data_id: 'tracking-setup', status: 'MISSING' });
  const evidence = e.plan.stages.find(s => s.id === 'evidence');
  e = advanceEngagement(e, { type: 'complete', stage_id: 'evidence', outputs: evidence.outputs.map(o => ({ id: o.id })), checks: evidence.checks.map(c => ({ id: c.id, result: 'PASS' })) });
  const blocked = jobStatus(e);
  assert.equal(blocked.blocked[0].title, 'Check the numbers can be trusted');
  assert.match(blocked.blocked[0].detail, /Missing Tracking setup/);
  assert.ok(blocked.data.some(d => d.name === 'Tracking setup' && d.status === 'MISSING'));
  // Work to look over and live actions, as an engagement can hold them.
  const later = copy(e);
  later.stages.find(s => s.id === 'concepts').state = 'AWAITING_APPROVAL';
  later.stages.find(s => s.id === 'launch').state = 'AWAITING_APPROVAL';
  assert.deepEqual(jobStatus(later).waiting.map(i => i.title), ['Look over the work', 'Approve each live action']);
  for (const s of later.stages) s.state = 'DONE';
  assert.match(jobStatus(later).headline, /Round 1 is finished/);
});

test('a dropped file that is not a good engagement says why, in plain words', () => {
  assert.match(readEngagement('{"schema"').error, /not valid JSON/);
  assert.match(readEngagement('{"schema":"something-else"}').error, /does not pass the orchestrator's checks: Unknown engagement schema/);
  const tampered = sampleEngagement();
  // Someone edits the file to take away the owner's choice: the orchestrator's own rules refuse it.
  tampered.plan.stages.find(s => s.kind === 'decision').gate = 'none';
  assert.match(readEngagement(JSON.stringify(tampered)).error, /decision stage needs owner approval/);
  const secret = sampleEngagement();
  secret.request = 'token ghp_abcdefghijklmnopqrstuvwxyz0123456789';
  assert.match(readEngagement(JSON.stringify(secret)).error, /API key/);
});

test('the sample folder is the files the orchestrator asks the host to save, and reads back', async () => {
  const { id, files } = await sampleFolder();
  assert.equal(id, '20261102-ad-costs-sample');
  for (const name of ['engagement.json', 'ENGAGEMENT.md', 'BRIEF.md', 'PLAN.md', 'RESEARCH.md']) assert.ok(files[name], name);
  const back = readEngagement(files['engagement.json']);
  assert.ok(back.ok);
  assert.equal(back.status.waiting[0].title, 'Choose what to do');
});

test('owner copy is plain: grade 8 at the top, no em dashes, honest about who does the work', () => {
  for (const [label, top] of [['start', [START.h1, START.sub]], ['example', [EXAMPLE.h1, EXAMPLE.sub]], ['status', [STATUS.h1, STATUS.sub]]]) assert.ok(grade(top.join(' ')) <= 8, `${label} top reads at grade ${grade(top.join(' '))}`);
  const all = JSON.stringify({ START, EXAMPLE, STATUS, SEO });
  assert.ok(grade([START.sub, ...START.steps.flat(), START.stopsLead, ...START.stops.flat(), ...START.facts.flat()].join(' ')) <= 10);
  assert.ok(!all.includes('—'), 'no em dashes');
  for (const word of ['leverage', 'seamless', 'unlock', 'supercharge', 'effortless', 'journey', 'powerful', 'magic', 'guarantee']) assert.ok(!all.toLowerCase().includes(word), word);
  assert.match(all, /never calls a model/);
  assert.match(all, /can't promise a result/);
  assert.match(EXAMPLE.note, /illustrative/);
  for (const [url, [title, desc]] of Object.entries(SEO)) {
    assert.ok(title.length >= 50 && title.length <= 60 && title.endsWith('| AI Blocks'), `${url} title ${title.length}`);
    assert.ok(desc.length >= 120 && desc.length <= 155, `${url} description ${desc.length}`);
  }
});

test('crawlers get the same pages: prerendered HTML, sitemap entries, a route and one menu link', () => {
  assert.deepEqual(OUTCOME_URLS, Object.values(OUTCOME_PATHS));
  const roles = new Set(['media-buyer']);
  const pages = Object.fromEntries(OUTCOME_URLS.map(url => [url, outcomePage(url, { roleHref: id => (roles.has(id) ? `/roles/${id}` : null), itemHref: () => null })]));
  assert.equal(outcomePage('/get-it-done/other'), null);
  for (const [url, p] of Object.entries(pages)) {
    assert.equal(p.documentTitle, SEO[url][0]);
    assert.ok(p.body.length > 600, url);
    assert.ok(!/<h1/.test(p.body), `${url} leaves the h1 to the shell`);
  }
  const ex = pages[OUTCOME_PATHS.example].body;
  for (const s of example.plan.stages) assert.ok(ex.includes(s.name.replace(/&/g, '&amp;').replace(/'/g, "'")), s.name);
  assert.match(ex, /<a href="\/roles\/media-buyer">Media buyer<\/a>/);
  assert.doesNotMatch(ex, /href="\/roles\/cro-specialist"/, 'roles without a page are not linked');
  assert.match(ex, /Illustrative figures/);
  assert.match(pages[OUTCOME_PATHS.start].body, /start_outcome|MCP server/);
  assert.match(pages[OUTCOME_PATHS.status].body, /Nothing is uploaded or saved/);
  const index = read('../scripts/build-index.mjs');
  for (const url of OUTCOME_URLS) assert.ok(index.includes(`"${url}"`), `${url} is in the sitemap`);
  assert.match(read('../scripts/prerender.mjs'), /outcomePage\(url/);
  const app = read('../src/App.tsx');
  assert.match(app, /isOutcomePath\(path\) \? \(\s*<OutcomesRoute/);
  assert.match(app, /!isOutcomePath\(path\)/, 'the pages load no library data');
  assert.match(read('../src/SiteHeader.tsx'), /\["\/get-it-done", "Get a whole job done", "get-it-done"\]/);
});

test('the start page stays light: the checks and the worked example load only on the pages that use them', () => {
  for (const file of ['../src/outcomes-site/StartJob.tsx', '../src/outcomes-site/owner-message.ts', '../src/outcomes-site/OutcomeTabs.tsx', '../src/outcomes-site/OutcomesPage.tsx']) {
    const source = read(file);
    assert.doesNotMatch(source, /^import [^;]*from "\.\/owner-view|^import [^;]*engagement\.mjs|^import [^;]*rising-cpa/m, file);
  }
  assert.match(read('../src/outcomes-site/OutcomesPage.tsx'), /lazy\(\(\) => import\("\.\/ExampleJob"\)\)/);
  assert.match(read('../src/outcomes-site/OutcomesPage.tsx'), /lazy\(\(\) => import\("\.\/JobStatusPage"\)\)/);
});
