// Every Quality Engine benchmark request, routed the way start_job routes a real one. Before 12 Nov 2026 about four in
// five went to an unrelated lead: "I run marketing at Grüns. Write 5 Meta ad concepts" read "run" as the job and went
// to a store merchandiser, and push notifications went to a video ad planner.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { classifyJob } from '../src/jobs/router.mjs';
import { leadAgentFor, deliverableLead } from '../src/jobs/lead-agents.mjs';
import { askOf, qualityFamily, qualityEngineContext } from '../src/jobs/quality-engine.mjs';

const GOLDEN = JSON.parse(fs.readFileSync(new URL('./fixtures/routing-golden.json', import.meta.url), 'utf8'));
const bench = name => { const value = JSON.parse(fs.readFileSync(new URL(`../../tools/bench/quality-engine/${name}`, import.meta.url), 'utf8')); return Array.isArray(value) ? value : value.tasks ?? Object.values(value); };
const TASKS = [...bench('tasks-v3.json'), ...bench('results-codex-2026-11-12/v32-confirmation-tasks.json'), ...bench('results-codex-2026-11-12/v31-fresh-tasks.json')];
const INDEX_FILE = new URL('../public/data/approach-index.json', import.meta.url);
const index = fs.existsSync(INDEX_FILE) ? JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')) : null;

test('the ask, not the introduction, is what a request asks for', () => {
  assert.equal(askOf('I run marketing at Grüns (gruns.co). Write 5 Meta ad concepts for a cold US audience.'), 'Write 5 Meta ad concepts for a cold US audience.');
  assert.equal(askOf("I'm a PM at Ramp (https://ramp.com). We're shipping an update to Policy Agents. Write the release notes we'll post in the changelog."), "Write the release notes we'll post in the changelog.");
  // A bare ask keeps the sentence that says what it is about.
  assert.match(askOf("I'm a growth PM at Duolingo. We're launching streak reminders and the copy is due. Write them."), /streak reminders/);
  // A request that is all ask, or has no ask sentence, is left whole.
  assert.equal(askOf('Write a 3-email welcome series'), 'Write a 3-email welcome series');
  assert.equal(askOf('Our sales are down this month.'), 'Our sales are down this month.');
});

test('every quality card can be chosen from the words people use', () => {
  const cards = fs.readFileSync(new URL('../../marketplace/packs/shared/tools/quality/cards/INDEX.md', import.meta.url), 'utf8').split('\n').map(line => line.split(' | ')[0]).filter(id => id && id !== '_any');
  const asks = {
    'claims-review': 'Review these marketing claims for FDA risk', 'crisis-response': 'A TikTok saying our gummies are candy is going viral. Write our reply.',
    'review-replies': 'Write a reply to this G2 review', 'support-macros': 'Write reply macros for our 6 most common ticket types',
    'notification-copy': 'Write 3 push notification lines for our streak feature', 'product-announcement': 'Write the release notes for the update',
    'launch-plan': 'Write the go-to-market plan for the launch', 'experiment-design': 'Design a pricing test for our subscription',
    pricing: 'Should we raise the annual Super price?', 'competitor-analysis': 'Compare us with our three main competitors',
    'job-description': 'Write the job description for a designer', 'creator-brief': 'Write the brief we send to TikTok creators',
    'outbound-sales': 'Write a 3-email cold outbound sequence', 'partnership-pitch': 'Write a co-marketing partnership proposal',
    'sales-pitch': 'Write a one-page pitch to a Target buyer', 'onboarding-flow': 'Plan the onboarding flow for new users',
    'lifecycle-email': 'Write the win-back email series', 'landing-page': 'Make a landing page for our subscription',
    'webinar-script': 'Write the talk track for our webinar', 'help-docs': 'Write a help-center guide for teams moving from Jira',
    'research-design': 'Write the survey for lapsed buyers', 'investor-update': 'Draft our quarterly leadership update',
    'social-calendar': 'Plan a content calendar for November', 'seo-article': 'Write a blog post about protein',
    'paid-social-ads': 'Write 5 Meta ad concepts',
  };
  for (const card of cards) {
    assert.ok(asks[card], `add a sample ask for the new card ${card}`);
    assert.equal(qualityFamily(asks[card]), card, asks[card]);
    assert.equal(qualityEngineContext(asks[card]).card_url.endsWith(`cards/${card}.md`), true);
  }
});

test('a named deliverable is led by the specialist who does exactly that', () => {
  for (const [id, lead] of Object.entries(GOLDEN.leads)) {
    const task = TASKS.find(row => row.id === id);
    assert.equal(deliverableLead(task.brief ?? task.request)?.id, lead, id);
  }
  for (const row of GOLDEN.extra) {
    assert.equal(qualityFamily(row.request), row.card);
    assert.equal(leadAgentFor('make-video-ads', row.request).id, row.lead, 'the card specialist outranks a wrong job guess');
  }
  // Variants pick inside a card: investor letters and translation work have their own specialists.
  assert.equal(deliverableLead('Draft our quarterly investor update')?.id, 'paloma-investorupdate');
  assert.equal(deliverableLead('Prepare a Spanish UI handoff for these push notification strings')?.id, 'behrouz-translation');
  // A card with no specialist of its own leaves the job's lead in place.
  assert.equal(deliverableLead('Make a landing page for our subscription')?.id, null);
  assert.equal(leadAgentFor('write-landing-page', 'Make a landing page for our subscription').id, 'bao-website-copy');
});

test('benchmark requests route to a fitting job', { skip: index ? false : 'site/public/data/approach-index.json is built by npm run index' }, () => {
  const misses = [];
  const rows = [...TASKS.filter(task => GOLDEN.jobs[task.id]).map(task => ({ id: task.id, request: task.brief ?? task.request, jobs: GOLDEN.jobs[task.id] })), ...GOLDEN.extra.map((row, at) => ({ id: `extra-${at}`, ...row }))];
  for (const row of rows) {
    const { job } = classifyJob(row.request, index.jobs);
    if (!row.jobs.includes(job)) misses.push(`${row.id}: ${job} (want ${row.jobs.join(' or ')})`);
  }
  const share = 1 - misses.length / rows.length;
  assert.ok(share >= GOLDEN.floor, `${Math.round(share * 100)}% routed well, below ${GOLDEN.floor * 100}%:\n${misses.join('\n')}`);
});
