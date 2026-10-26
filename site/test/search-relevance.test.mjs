import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLibrarySearchIndex, searchLibraryIndex } from '../src/lib/library-search-core.ts';
import { makeSearchDocument } from '../src/lib/search-document.mjs';

const hash = 'a'.repeat(64);
const ranked = (docs, query) => [...searchLibraryIndex(buildLibrarySearchIndex(docs, hash), query)].sort((a, b) => b[1].score - a[1].score).map(([slug]) => slug);

test('subject expertise works for any name, independent of curated homepage picks', () => {
  const docs = [
    makeSearchDocument({ slug: 'expert-a', name: 'Expert A', type: 'mind', topics: ['value investing'] }),
    makeSearchDocument({ slug: 'expert-b', name: 'Expert B', type: 'mind', topics: ['ceramic glaze analysis'] }),
    { slug: 'passing-mention', title: 'Value stream map', body: 'A separate example mentions investing.' },
    { slug: 'unrelated', title: 'Ceramic vase photography', body: 'Glaze analysis might be relevant to another job.' },
  ];
  assert.equal(ranked(docs, 'value investing')[0], 'expert-a');
  assert.equal(ranked(docs, 'ceramic glaze analysis')[0], 'expert-b');
});

test('all query words need strong evidence; one title word cannot lift incidental body matches', () => {
  const docs = [
    { slug: 'incidental', title: 'Supplier forecast', body: 'An unrelated lesson mentions Python.' },
    { slug: 'purpose', title: 'Useful method', summary: 'Python forecast using the supplied time series.' },
    { slug: 'incomplete', title: 'Python code', body: 'No estimates here.' },
  ];
  assert.deepEqual(ranked(docs, 'Python forecast').slice(0, 2), ['purpose', 'incidental']);
  assert(!ranked(docs, 'Python forecast').includes('incomplete'));
});

test('actual deliverables and supported uses establish purpose for every format', () => {
  for (const kind of ['prompt', 'skill', 'workflow', 'agent', 'mind']) {
    const doc = makeSearchDocument({ slug: `method-${kind}`, name: 'Plain name', type: kind }, { when: ['Review a contract for risky clauses'], you_get: ['A contract review and open legal questions'] });
    assert.equal(ranked([doc], 'review my contract')[0], doc.slug, kind);
  }
  const unrelated = makeSearchDocument({ slug: 'other', name: 'Cooking guide' }, { credits: [{ title: 'Contract review' }], plan: { next: [{ name: 'Contract review' }] } });
  assert.equal(ranked([unrelated], 'review my contract').length, 0);
});

test('explicit format requests prefer relevant formats and never pull in unrelated items', () => {
  const docs = [
    makeSearchDocument({ slug: 'mind', name: 'Negotiation adviser', type: 'mind', topics: ['negotiation'] }),
    makeSearchDocument({ slug: 'workflow', name: 'Negotiation planner', type: 'workflow', topics: ['negotiation'] }),
    makeSearchDocument({ slug: 'unrelated-mind', name: 'Baking teacher', type: 'mind', topics: ['baking'] }),
  ];
  assert.equal(ranked(docs, 'negotiation mind')[0], 'mind');
  assert.equal(ranked(docs, 'negotiation workflow')[0], 'workflow');
  assert(!ranked(docs, 'negotiation mind').includes('unrelated-mind'));
});

test('common word forms and polite recommendation wording retain the actual subject', () => {
  const docs = [makeSearchDocument({ slug: 'method', name: 'Personal budget planner', topics: ['personal budgeting'] })];
  for (const query of ['personal budget', 'personal budgeting', 'recommend the best personal budgeting']) assert.equal(ranked(docs, query)[0], 'method', query);
});

test('similar words from different domains do not trigger investing expertise', () => {
  const doc = makeSearchDocument({ slug: 'investor', name: 'An investor', type: 'mind', topics: ['value investing'] });
  for (const query of ['customer lifetime value', 'value stream mapping', 'investing in employee training']) assert.equal(ranked([doc], query).length, 0, query);
});

test('a marketing use of complaints cannot establish customer-support purpose', () => {
  const docs = [
    makeSearchDocument({ slug: 'ad', name: 'Customer complaint ad story', task: 'write-ad-copy', type: 'prompt' }),
    makeSearchDocument({ slug: 'reply', name: 'Calm reply writer', task: 'help-customers', type: 'prompt' }, { when: ['Handle difficult customer complaints'] }),
  ];
  assert.equal(ranked(docs, 'need a prompt for difficult customer complaints')[0], 'reply');
});
