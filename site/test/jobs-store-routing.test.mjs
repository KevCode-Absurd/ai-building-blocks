// 14 Nov 2026: online-store requests reach the e-commerce agents. Before this, none of the 45 e-commerce personas was
// in lead-agents.json, so start_job sent store work to older house agents (brett-meta-store-ads, holly-store-emails,
// imran-conversion, faye-product-pages...) that carry neither the e-commerce toolbox nor the guide's journey maps.
// Each row: the owner's words, the job type start_job classifies it as today, and the lead and journey expected.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import TABLE from '../src/jobs/lead-agents.json' with { type: 'json' };
import { leadAgentFor, isStoreRequest, journeyFor } from '../src/jobs/lead-agents.mjs';
import { startJob } from '../src/jobs/engine.mjs';

const read = url => JSON.parse(fs.readFileSync(url, 'utf8'));
const ECOMMERCE = read(new URL('../../marketplace/src/modules/directory/data/personas-ecommerce.json', import.meta.url));
const ORG = read(new URL('../../marketplace/src/modules/directory/data/team-org-chart.json', import.meta.url));
const PERSONAS = ORG.personas.map(p => p.id);
const JOURNEYS = ['creatives', 'video-scripts', 'product-pages', 'meta-account-structure', 'media-buying-audit', 'cro-audit', 'email-retention', 'seo', 'aeo', 'big-bets'];

const STORE = [
  ['make-image-ads', 'Make me 10 new static ads for our Shopify skincare bestsellers', 'tendai-ad-creative', 'creatives'],
  ['make-image-ads', 'Our Meta ads are tired. We need fresh carousel ads for the new collection on our online store', 'tendai-ad-creative', 'creatives'],
  ['make-image-ads', 'Static ads for Diwali for our jewellery store', 'tendai-ad-creative', 'creatives'],
  ['make-image-ads', "Make 8 image ads for our D2C coffee brand's bestsellers", 'tendai-ad-creative', 'creatives'],
  ['make-video-ads', 'Write 5 UGC scripts for our D2C protein powder', 'devon-video-ugc', 'video-scripts'],
  ['make-video-ads', 'Write a Reels ad script for our new sneaker drop on Shopify', 'devon-video-ugc', 'video-scripts'],
  ['write-ad-copy', 'TikTok ad scripts for our candles store, with hooks for the first 3 seconds', 'devon-video-ugc', 'video-scripts'],
  ['make-video-ads', 'Our video ads lose people in the first few seconds. Write new hooks for our ecommerce brand', 'devon-video-ugc', 'video-scripts'],
  ['write-ad-copy', 'Write Meta ad copy, primary text and headlines, for our ecommerce summer sale', 'kofi-ad-copy', 'creatives'],
  ['write-ad-copy', 'Write Google Shopping ad headlines for our Shopify store', 'kofi-ad-copy', 'creatives'],
  ['launch-and-scale-ads', 'Set up my Meta ads properly for our Shopify store', 'dustin-ad-deployment', 'meta-account-structure'],
  ['write-ad-copy', 'How should I structure my ad account for our D2C brand? Advantage+ or manual campaigns?', 'dustin-ad-deployment', 'meta-account-structure'],
  ['grow-social', 'Plan our Facebook and Instagram campaigns for the next quarter for our online store', 'dustin-ad-deployment', 'meta-account-structure'],
  ['launch-and-scale-ads', 'Audit my Meta ads for our skincare store. Where am I wasting money?', 'dustin-ad-deployment', 'media-buying-audit'],
  ['read-ad-results', 'Our ROAS dropped last month. Review the ad account for our Shopify store', 'dustin-ad-deployment', 'media-buying-audit'],
  ['read-ad-results', 'Review our paid ads across Meta, Google and TikTok for our ecommerce brand and tell us where to move budget', 'jared-performance-marketing', 'media-buying-audit'],
  ['protect-your-store', 'Do a CRO audit of my Shopify store', 'gretchen-store-testing', 'cro-audit'],
  ['make-offer', "People add to cart but don't buy on our online store. Find out why", 'gretchen-store-testing', 'cro-audit'],
  ['audit-landing-page', 'Audit my product page, the conversion rate is low on our D2C store', 'gretchen-store-testing', 'cro-audit'],
  ['write-landing-page', 'Build a landing page for our shoes that we can send Meta ad traffic to', 'annabel-landing-pages', 'product-pages'],
  ['write-landing-page', 'Rewrite the product page for our best-selling gold chain on our jewellery store', 'georgia-product-copy', 'product-pages'],
  ['run-your-store', 'Write product descriptions for our new skincare range on Shopify', 'georgia-product-copy', 'product-pages'],
  ['set-up-store', 'Set up my Klaviyo flows for our Shopify store', 'morag-email-sms', 'email-retention'],
  ['write-emails', 'Write abandoned cart emails for our online store', 'lucia-email-copy', 'email-retention'],
  ['write-emails', 'Write a win-back email series for lapsed customers of our D2C brand', 'imogen-retention', 'email-retention'],
  ['get-found-in-search', 'Do an SEO audit of my Shopify store', 'stuart-store-seo', 'seo'],
  ['protect-your-store', 'Get our store recommended by ChatGPT and Perplexity when people ask for gold jewellery', 'rustam-ai-answers', 'aeo'],
  ['test-an-idea', "What's one big bet that could double our online store's revenue next year?", 'barnaby-wild-bets', 'big-bets'],
  ['plan-budgets-and-cash', 'Work out the unit economics and break-even ROAS for our Shopify store', 'radek-unit-economics', null],
  ['make-image-ads', 'Launch TikTok ads for our D2C supplements brand', 'zara-tiktok-ads', null],
];

// Not for an online store, or a named deliverable the store table does not own: the lead stays as it was.
const OTHER = [
  ['write-emails', 'Write a 3-email welcome series for our SaaS trial users', 'candice-email-marketing'],
  ['write-landing-page', 'Build a landing page for our accounting software', 'bao-website-copy'],
  ['make-image-ads', 'Make 5 image ads for our dental clinic', 'brittany-image-ads'],
  ['organise-work', "Plan a fundraising email for our charity's donors", 'haruka-admin'],
  ['write-and-tell-stories', 'Write the press release for our Series B', 'bayo-press-releases'],
  ['document-work', 'Write the SOP for closing the store each night', 'faisal-sops'],
  ['hire-people', 'Write a structured guide for the final 45-minute interview for a store manager', 'obinna-interviewkit'],
  ['write-landing-page', 'Do an SEO audit of our B2B software website', 'bao-website-copy'],
  ['write-and-tell-stories', 'Write release notes for our iOS app update', 'kamran-release-notes'],
  ['launch-and-scale-ads', 'Audit our Meta ads for our yoga studio', 'efrain-meta-lead-ads'],
];

test('an online-store request goes to the e-commerce agent for what is being made, with its journey map', () => {
  const misses = [];
  for (const [job, request, lead, journey] of STORE) {
    const got = leadAgentFor(job, request, { personas: PERSONAS });
    if (got?.id !== lead || (got?.journey ?? null) !== journey) misses.push(`${request}: ${got?.id} ${got?.journey ?? '-'} (${got?.basis}); want ${lead} ${journey ?? '-'}`);
  }
  assert.deepEqual(misses, []);
  assert.equal(STORE.length, 30);
});

test('a request that is not for an online store keeps its current lead and gets no journey', () => {
  for (const [job, request, lead] of OTHER) {
    const got = leadAgentFor(job, request, { personas: PERSONAS });
    assert.equal(got?.id, lead, request); assert.equal(got?.journey, undefined, request);
  }
  // A physical shop, a store manager or the App Store is not an online store; a clear online word is.
  assert.equal(isStoreRequest('More foot traffic for our retail store on the high street'), false);
  assert.equal(isStoreRequest('Write the App Store description for our app'), false);
  assert.equal(isStoreRequest('We have a retail store and a Shopify store'), true);
  assert.equal(isStoreRequest('Write a welcome email for our SaaS'), false);
});

test('the store table names only e-commerce agents and the ten journey maps the guide ships', () => {
  const ecommerce = new Set(ECOMMERCE.map(p => p.id)), rows = [...TABLE.store.rules, ...Object.values(TABLE.store.cards), ...Object.values(TABLE.store.jobs)];
  for (const row of rows) if (row.agent) assert.ok(ecommerce.has(row.agent), row.agent);
  const journeys = new Set(rows.flatMap(row => [row.journey, ...(row.journeys ?? []).map(j => j.journey)]).filter(Boolean));
  assert.deepEqual([...journeys].sort(), [...JOURNEYS].sort());
  for (const id of journeys) assert.ok(fs.existsSync(new URL(`../../marketplace/knowledge/ecommerce/journeys/${id}.json`, import.meta.url)), `journey map ${id}`);
  // The e-commerce agents are loaded like any house agent: every one is in the org chart the job API reads.
  for (const id of ecommerce) assert.ok(PERSONAS.includes(id), id);
  for (const rule of TABLE.store.rules) assert.doesNotThrow(() => new RegExp(rule.pattern, 'i'), rule.id);
  assert.deepEqual(journeyFor('creatives'), { id: 'creatives', instruction: 'Lead the owner the way tools/quality/GUIDE.md says, with knowledge/ecommerce/journeys/creatives.md.' });
  assert.equal(journeyFor('../x'), null);
});

// A catalogue small enough to read: one maker role for image ads, held by a house agent and an e-commerce agent.
const role = { id: 'ad-maker', name: 'Ad maker', summary: 'Design image ads', seat_suitability: ['maker'], job: 'make-image-ads', lenses: ['craft'], deliverables: ['Image ads'], resources: [] };
const catalogue = {
  approaches: { jobs: { 'make-image-ads': { name: 'Make image ads', keywords: ['image', 'ads', 'static', 'meta'], families: [{ id: 'f', name: 'Still image ads', what_it_looks_like: 'Still image ads', items: [] }] } } },
  items: [], roles: { roles: [role] },
  personas: [{ id: 'tendai-ad-creative', name: 'Tendai', roles: ['ad-maker'] }, { id: 'brittany-image-ads', name: 'Brittany', roles: ['ad-maker'] }],
};
const words = value => (JSON.stringify(value).match(/\S+/g) ?? []).length;

test('a single-lead store job names the e-commerce agent and the journey map it leads the owner through', async () => {
  const store = await startJob({ request: 'Make me 10 new static ads for our Shopify skincare bestsellers', deliverable_kind: 'ad_creative' }, catalogue);
  assert.equal(store.mode, 'single'); assert.equal(store.lead.persona_id, 'tendai-ad-creative'); assert.equal(store.lead.journey, undefined);
  assert.equal(store.lead.agent.pack.one_file, 'https://agents.useaiblocks.com/packs/tendai-ad-creative.txt');
  assert.deepEqual(store.journey, { id: 'creatives', instruction: 'Lead the owner the way tools/quality/GUIDE.md says, with knowledge/ecommerce/journeys/creatives.md.' });
  assert.ok(words(store) < 1200, `a single store job start is ${words(store)} words`);
  const other = await startJob({ request: 'Make 5 image ads for our dental clinic', deliverable_kind: 'ad_creative' }, catalogue);
  assert.equal(other.lead.persona_id, 'brittany-image-ads'); assert.equal(other.journey, undefined);
});
