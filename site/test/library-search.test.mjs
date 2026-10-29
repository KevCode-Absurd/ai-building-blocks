import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildLibrarySearchIndex, searchLibraryIndex, searchShardIds, validateLibrarySearchIndex } from '../src/lib/library-search-core.ts';
import { buildPublicLibrarySearch, serializeLibrarySearch, pruneLibrarySearchShards } from '../scripts/build-library-search.mjs';
const sourceHash = 'a'.repeat(64);
const ranked = (index, query) => [...searchLibraryIndex(index, query)].sort((a, b) => b[1].score - a[1].score);

test('literal matches rank title, description, introduction, then full instructions', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'body', title: 'Other task', body: 'copperfinch' },
    { slug: 'intro', title: 'Other task', intro: 'copperfinch' },
    { slug: 'summary', title: 'Other task', summary: 'copperfinch' },
    { slug: 'title', title: 'copperfinch' },
  ], sourceHash);
  assert.deepEqual(ranked(index, 'copperfinch').map(([slug]) => slug), ['title', 'summary', 'intro', 'body']);
  assert.equal(searchLibraryIndex(index, 'copperfinch').get('body').field, 'body');
});
test('explicit answer-search aliases agree without expanding unrelated generic words', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'answer', title: 'Answer Engine Optimization' },
    { slug: 'geo', title: 'Generative engine optimisation' },
    { slug: 'ai-search', title: 'AI search audit' },
    { slug: 'seo', title: 'Search engine optimization' },
    { slug: 'unrelated', title: 'AI image design' },
  ], sourceHash);
  for (const query of ['AEO', 'answerengineoptimization', 'answer-engine optimisation', 'GEO', 'AI search']) assert.deepEqual([...searchLibraryIndex(index, query).keys()].sort(), ['ai-search', 'answer', 'geo']);
  assert.deepEqual([...searchLibraryIndex(index, 'SEO').keys()], ['seo']);
  assert(searchLibraryIndex(index, 'search engine').has('seo'), 'partial literal phrases still work');
});
test('agent wording, prefixes and plurals match; all meaningful tokens must match', () => {
  const index = buildLibrarySearchIndex([{ slug: 'loop', title: 'Agentic workflows', body: 'Reviews advertising reports.' }, { slug: 'agency', title: 'Agency sales' }], sourceHash);
  for (const query of ['agent', 'agents', 'agentic', 'agen work', 'agent workflow', 'advertising report']) assert(searchLibraryIndex(index, query).has('loop'), query);
  assert(!searchLibraryIndex(index, 'agents').has('agency'));
  assert.equal(searchLibraryIndex(index, 'agent astronomy').size, 0);
});

test('plain requests to appear in AI answers retrieve visibility methods without tagging incidental documents', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'visibility', title: 'AI search audit' },
    { slug: 'incidental', title: 'Cooking guide', body: 'Can this recipe show up in AI answers?' },
    { slug: 'image', title: 'AI image designer' },
  ], sourceHash);
  for (const query of ['show up in AI answers', 'get found in ChatGPT', 'be recommended by Perplexity']) {
    assert.equal(ranked(index, query)[0]?.[0], 'visibility', query);
    assert(!searchLibraryIndex(index, query).has('image'), query);
  }
  assert(!searchLibraryIndex(index, 'AEO').has('incidental'), 'query-only language does not add document intent');
});

test('GEO query shorthand does not turn scientific or geographic documents into AI visibility methods', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'sequencing', title: 'Sequencing pipeline runner', summary: 'Run RNA-seq from FASTQ or a GEO or SRA accession.', body: 'Fetch a Gene Expression Omnibus GEO dataset. Ask ChatGPT to check the reads.' },
    { slug: 'geography', title: 'Geographic data', body: 'GEO coordinates and geographic mapping.' },
    { slug: 'generative', title: 'Generative engine optimization' },
    { slug: 'explicit-aeo', title: 'Another method', body: 'AEO appears only in the complete instructions.' },
    { slug: 'contextual-geo', title: 'GEO for AI search engines' },
  ], sourceHash);
  for (const query of ['AEO', 'GEO', 'generative engine optimization']) {
    const hits = searchLibraryIndex(index, query);
    assert(!hits.has('sequencing'), query); assert(!hits.has('geography'), query);
    assert(hits.has('generative'), query); assert(hits.has('explicit-aeo'), query);
  }
  const science = searchLibraryIndex(index, 'RNA-seq GEO');
  assert(science.has('sequencing')); assert.equal(science.get('sequencing').reason, undefined);
  assert(!science.has('generative'));
  assert.equal(searchLibraryIndex(index, 'AEO').get('explicit-aeo').field, 'body');
});

test('explaining spreadsheet changes retrieves actual analysis purpose without recommended links', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'checker', title: 'Spreadsheet checker', summary: 'Give it a spreadsheet. Get it cleaned, reconciled and analysed.' },
    { slug: 'unrelated', title: 'Another method', body: 'Use a spreadsheet as an input.' },
  ], sourceHash);
  assert.equal(ranked(index, 'Explain the main changes in this spreadsheet in plain words')[0]?.[0], 'checker');
});
test('wire index is deterministic and exact catalogue identity is required', () => {
  const documents = [{ slug: 'zebra', title: 'Last' }, { slug: 'apple', title: 'First', body: 'deepword' }];
  const index = buildLibrarySearchIndex(documents, sourceHash);
  assert.deepEqual(index, buildLibrarySearchIndex([...documents].reverse(), sourceHash));
  assert.equal(validateLibrarySearchIndex(JSON.parse(JSON.stringify(index)), sourceHash).docs.length, 2);
  assert.throws(() => validateLibrarySearchIndex(index, 'b'.repeat(64)), /does not match/);
  assert.throws(() => validateLibrarySearchIndex({ ...index, postings: ['bad*'] }, sourceHash));
});
test('content-addressed query chunks round-trip complete matches without loading unrelated chunks', () => {
  const index = buildLibrarySearchIndex([{ slug: 'target', title: 'Other task', body: 'deepneedle' }, { slug: 'aeo', title: 'AI search audit' }], sourceHash);
  const files = serializeLibrarySearch(index), manifest = validateLibrarySearchIndex(JSON.parse(files['data/library-search.json']), sourceHash);
  assert.equal(searchShardIds(manifest, 'AEO').length, 0, 'common aliases and purpose evidence are in the small manifest');
  const needed = searchShardIds(manifest, 'deepneedle'); assert.equal(needed.length, 1);
  for (const id of needed) {
    const chunk = manifest.shards.files[id], bytes = files[chunk.file.slice(1)];
    assert.equal(createHash('sha256').update(bytes).digest('hex'), chunk.sha256);
    assert.equal(chunk.file, `/data/library-search/${chunk.sha256}.json`);
    manifest.postings.splice(id * manifest.shards.size, chunk.terms, ...JSON.parse(bytes));
  }
  assert.deepEqual(searchLibraryIndex(manifest, 'deepneedle'), searchLibraryIndex(index, 'deepneedle'));
  assert.equal(searchShardIds(manifest, 'deepneedle').length, 0);
});

test('search cleanup removes only obsolete generated shards and preserves the complete active index', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'search-cleanup-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const folder = path.join(root, 'data/library-search'); await fs.mkdir(folder, { recursive: true });
  const index = buildLibrarySearchIndex([{ slug: 'sample', title: 'Sample', body: 'deepneedle' }], sourceHash);
  const files = serializeLibrarySearch(index);
  for (const [file, bytes] of Object.entries(files)) await fs.writeFile(path.join(root, file), bytes);
  const stale = '0'.repeat(64) + '.json'; await fs.writeFile(path.join(folder, stale), 'obsolete');
  await fs.writeFile(path.join(folder, 'README.md'), 'Keep unrelated files.');
  const outside = path.join(root, 'keep.json'); await fs.writeFile(outside, 'Keep files outside this directory.');
  assert.deepEqual(await pruneLibrarySearchShards(root), { removed: 1, bytes: 8 });
  for (const [file, bytes] of Object.entries(files)) assert.deepEqual(await fs.readFile(path.join(root, file)), bytes);
  assert.equal(await fs.readFile(path.join(folder, 'README.md'), 'utf8'), 'Keep unrelated files.');
  assert.equal(await fs.readFile(outside, 'utf8'), 'Keep files outside this directory.');
  assert.deepEqual(await pruneLibrarySearchShards(root), { removed: 0, bytes: 0 });
});

test('search cleanup preserves old files if current shards are missing, corrupt or outside the owned folder', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'search-cleanup-invalid-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const folder = path.join(root, 'data/library-search'); await fs.mkdir(folder, { recursive: true });
  const stale = path.join(folder, '0'.repeat(64) + '.json'); await fs.writeFile(stale, 'obsolete');
  const file = 'data/library-search/' + 'a'.repeat(64) + '.json';
  const manifest = { shards: { files: [{ file: '/' + file, sha256: 'a'.repeat(64) }] } };
  await fs.writeFile(path.join(root, 'data/library-search.json'), JSON.stringify(manifest));
  await assert.rejects(pruneLibrarySearchShards(root), /Current search shard is missing/);
  await fs.writeFile(path.join(root, file), 'corrupt');
  await assert.rejects(pruneLibrarySearchShards(root), /checksum mismatch/);
  manifest.shards.files[0].file = '/data/library-search/../../keep.json';
  await fs.writeFile(path.join(root, 'data/library-search.json'), JSON.stringify(manifest));
  await assert.rejects(pruneLibrarySearchShards(root), /Invalid public search shard path/);
  assert.equal(await fs.readFile(stale, 'utf8'), 'obsolete');
});
test('natural job goldens retrieve purpose matches without requiring title words', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'visibility', title: 'AI answer visibility audit' },
    { slug: 'debug', title: 'Failure triage', summary: 'Debug failing tests with reproducible evidence.' },
    { slug: 'minutes', title: 'Meeting minutes' },
    { slug: 'response', title: 'Customer response helper', summary: 'Reply to customer complaints clearly.' },
    { slug: 'repurpose', title: 'Content repurposing', summary: 'Repurpose blog content into social posts.' },
    { slug: 'feedback', title: 'Voice of customer synthesis' },
    { slug: 'onboarding', title: 'New employee induction' },
    { slug: 'irrelevant-ai', title: 'AI illustration', summary: 'AI can answer questions about a painting.' },
  ], sourceHash);
  const goldens = [
    ['get my brand mentioned in ChatGPT answers', 'visibility'],
    ['help me fix why my app is crashing', 'debug'],
    ['turn a recording into action items', 'minutes'],
    ['respond to an angry customer', 'response'],
    ['turn this podcast into several social posts', 'repurpose'],
    ['find patterns in customer reviews', 'feedback'],
    ['help a new team member get started', 'onboarding'],
  ];
  for (const [query, expected] of goldens) {
    const matches = ranked(index, query); assert.equal(matches[0]?.[0], expected, query);
    assert.match(matches[0][1].reason ?? '', /Matches goal:/, query);
    assert(!matches.some(([slug]) => slug === 'irrelevant-ai'), query);
  }
  for (const query of ['what should I wear for a holiday', 'draw a cat', 'plan my vacation']) assert.equal(searchLibraryIndex(index, query).size, 0, query);
});
test('semantic evidence deep in public instructions remains labelled as a body match', () => {
  const index = buildLibrarySearchIndex([{ slug: 'method', title: 'A technical method', body: 'Answer engine optimization checks brand citations.' }], sourceHash);
  const hit = searchLibraryIndex(index, 'I want my business mentioned in ChatGPT answers').get('method');
  assert.equal(hit.field, 'body'); assert.match(hit.reason, /AI answer visibility/);
});
test('long technical keyword searches retain complete body coverage', () => {
  const query = 'copperfinch phosphoproteomics nanofluidic interferometry deconvolution';
  const index = buildLibrarySearchIndex([{ slug: 'technical', title: 'A method', body: query }], sourceHash);
  assert.equal(searchLibraryIndex(index, query).get('technical').field, 'body');
});
test('different jobs sharing generic words stay separate and unsupported requests have no invented matches', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'debug', title: 'Browser page debugger' },
    { slug: 'crawl', title: 'Find and fix SEO crawl errors' },
    { slug: 'candidate', title: 'Prepare work examples for a job interview' },
    { slug: 'budget', title: 'Budget variance explainer' },
    { slug: 'employee', title: 'New hire first week planner' },
    { slug: 'customer', title: 'New customer onboarding' },
    { slug: 'ads', title: 'Ad spend analyst' },
    { slug: 'ad-plan', title: 'Ad budget planner' },
    { slug: 'retention', title: 'Customer cohort reader' },
    { slug: 'incidental', title: 'Other method', body: 'What should I wear for a holiday? Book me a restaurant table for tonight.' },
  ], sourceHash);
  const cases = [
    ['Find why my website shows a blank screen after I changed the code', 'debug'],
    ['Help me prepare answers for a job interview using my CV', 'candidate'],
    ['I keep going over budget and need to see where the money went', 'budget'],
    ['Help a new employee know what to do in their first week', 'employee'],
    ['Which ads are wasting my budget and should I review first', 'ads'],
    ['Our customers stop buying after their first order. What should I check?', 'retention'],
  ];
  for (const [query, slug] of cases) assert.equal(ranked(index, query)[0]?.[0], slug, query);
  assert(!searchLibraryIndex(index, 'My Python script crashes with a type error').has('crawl'));
  for (const query of ['What should I wear for a holiday', 'Book me a restaurant table for tonight']) assert.equal(searchLibraryIndex(index, query).size, 0, query);
  assert(searchLibraryIndex(index, 'restaurant').has('incidental'), 'direct body keyword discovery remains supported');
});
test('purpose inference does not cross display fields or mistake unrelated senses of job and payback', () => {
  const index = buildLibrarySearchIndex([
    { slug: 'review-image-ads', title: 'Turn reviews into image ads buyers believe review-image-ads', purpose: { title: ['Turn reviews into image ads buyers believe'] } },
    { slug: 'customer-interview', title: 'Customer job interview planner' },
    { slug: 'speed', title: 'Fix store speed in the order that pays back' },
    { slug: 'employer', title: 'Applicant shortlist', body: 'Prepare for a job interview.', excludeIntents: ['interview-prep'] },
    { slug: 'academic', title: 'AI research paper writer', summary: 'Write AI conference papers with citations.' },
    { slug: 'fact-check', title: 'AI claim fact-check lesson', summary: 'Check AI citations and sources.' },
  ], sourceHash);
  assert.equal(searchLibraryIndex(index, 'Which ads are wasting my budget and should I review first').size, 0);
  assert.equal(searchLibraryIndex(index, 'Help me prepare answers for a job interview using my CV').size, 0);
  assert.equal(searchLibraryIndex(index, 'Our customers stop buying after their first order. What should I check?').size, 0);
  assert.equal(searchLibraryIndex(index, 'AEO').size, 0);
});
test('public builder includes deep method source and page bodies, not unrelated files', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'public-search-')); t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'data/pages'), { recursive: true }); await fs.mkdir(path.join(root, 'skills/sample'), { recursive: true });
  const catalogue = Buffer.from(JSON.stringify({ blocks: [{ slug: 'sample', name: 'Sample', summary: 'descriptionword' }] }));
  await fs.writeFile(path.join(root, 'data/blocks.json'), catalogue);
  await fs.writeFile(path.join(root, 'data/pages/sample.json'), JSON.stringify({ explain: 'introductoryword', how_to_use: ['pagebodyword'], stepNotes: { review: 'uniquestepnoteword' }, plan: { next: [{ name: 'AI search recommendation review navigationcanaryword' }] }, works_best_with: { name: 'AEO linked method' }, credits: [{ title: 'AEO source attribution' }], html: { skill: '<p>renderedbodyword</p>' } }));
  await fs.writeFile(path.join(root, 'skills/sample/SKILL.md'), '# Method\n\nsourceonlyword');
  await fs.writeFile(path.join(root, 'private.json'), 'privatecanaryword');
  const result = await buildPublicLibrarySearch(root);
  assert.equal(result.index.sourceHash, createHash('sha256').update(catalogue).digest('hex'));
  for (const query of ['descriptionword', 'introductoryword', 'pagebodyword', 'renderedbodyword', 'sourceonlyword', 'uniquestepnoteword']) assert(searchLibraryIndex(result.index, query).has('sample'), query);
  assert.equal(searchLibraryIndex(result.index, 'privatecanaryword').size, 0);
  assert.equal(searchLibraryIndex(result.index, 'navigationcanaryword').size, 0);
  assert.equal(searchLibraryIndex(result.index, 'AEO').size, 0, 'recommendations and credits do not establish instruction matches');
  assert.deepEqual(result.bytes, (await buildPublicLibrarySearch(root)).bytes);
});
