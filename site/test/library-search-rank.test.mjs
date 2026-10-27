// Keyword ranking rules in src/lib/library-rank.ts and the query side of src/lib/library-search-core.ts.
// Each case gives the candidates equal search scores, so only the rule under test decides the order.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLibrarySearchIndex, queryTokens, searchLibraryIndex } from '../src/lib/library-search-core.ts';
import { rankLibraryResults } from '../src/lib/library-rank.ts';

const sourceHash = 'a'.repeat(64);
const order = (blocks, query) => {
  const hits = new Map(blocks.map(b => [b.slug, { score: 5000, field: 'title' }]));
  return rankLibraryResults(blocks, hits, query, { isTested: () => false }).map(b => b.slug);
};

test('a name that says the typed words and nothing else leads, whatever the item type', () => {
  assert.equal(order([
    { slug: 'calculator', name: 'Store profit margin calculator', type: 'skill' },
    { slug: 'workflow', name: 'Store profit and margin analyst', type: 'workflow' },
  ], 'store profit margin')[0], 'workflow');
  // Kind-of-tool words (manager, strategist, agent) are not subject words.
  assert.equal(order([
    { slug: 'concept', name: 'Ad concept testing planner' },
    { slug: 'agent', name: 'Ad testing manager', type: 'agent' },
  ], 'ad testing')[0], 'agent');
});

test('each name is judged on its own: words picked from different names are not a match', () => {
  assert.equal(order([
    { slug: 'mixed', name: 'Product evidence planner', aliases: ['Rivals guide'] },
    { slug: 'direct', name: 'Competitor product review writer' },
  ], 'rival product review')[0], 'direct');
  // An other name that says the request still counts.
  assert.equal(order([
    { slug: 'renamed', name: 'Repeat purchase planner', aliases: ['Win-back flow builder'] },
    { slug: 'other', name: 'Customer flow mapper' },
  ], 'win back flow')[0], 'renamed');
});

test('one name word stands in for one typed word', () => {
  // "cover letter" is rewritten to resume and application; one generic word alone is a weaker match.
  assert.equal(order([
    { slug: 'generic', name: 'Application builder' },
    { slug: 'job', name: 'Resume and job application builder' },
  ], 'cover letter')[0], 'job');
  // A word the query already says literally does not also stand in for another typed word.
  assert.equal(order([
    { slug: 'price', name: 'Price analyst' },
    { slug: 'rise', name: 'Price rise letter writer' },
  ], 'price increase')[0], 'rise');
});

test('another form of a word is the word; a longer word that only starts the same is not', () => {
  assert.equal(order([
    { slug: 'production', name: 'Production plan builder' },
    { slug: 'product', name: 'Product guide writer' },
  ], 'product')[0], 'product');
  assert.equal(order([
    { slug: 'project', name: 'Project cash checker' },
    { slug: 'forecast', name: 'Cash forecast builder' },
  ], 'cash projection')[0], 'forecast');
  assert.equal(order([
    { slug: 'other', name: 'SaaS launch planner' },
    { slug: 'pricing', name: 'SaaS pricing designer' },
  ], 'price my saas')[0], 'pricing');
});

test('a purpose match keeps the plain word match it replaced', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'writer', title: 'Image ad copy writer', summary: 'Persuasive ad copy for image ads.' },
    { slug: 'other', title: 'Another method' },
  ], sourceHash);
  const hit = searchLibraryIndex(index, 'image ad copy').get('writer');
  assert.match(hit.reason ?? '', /^Matches goal/);
  assert.ok(hit.literal > 0, 'the literal title score is kept on the hit');
});

test('query words: plural-form "how" words, phrases and copywriting', () => {
  assert.deepEqual(queryTokens('competitor analysis').hard, ['competitor']);
  assert.deepEqual(queryTokens('zapier automation for new leads').soft, ['new']);
  const raise = queryTokens('how do i ask for a raise');
  assert.equal(raise.phrase.ask, raise.phrase.raise, 'one rewritten phrase');
  assert.deepEqual(queryTokens('copywriting').sequence, ['copy', 'write']);
  assert.ok(queryTokens('customer research').alternatives.customer.includes('buyer'));
});
