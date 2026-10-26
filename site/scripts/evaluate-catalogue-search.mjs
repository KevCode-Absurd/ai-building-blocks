import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import YAML from 'yaml';
import { compileClassifications } from './lib/catalogue-classification.mjs';
import { makeSearchDocument } from '../src/lib/search-document.mjs';
import { buildLibrarySearchIndex, searchLibraryIndex } from '../src/lib/library-search-core.ts';

const root = process.env.CATALOGUE_EVAL_ROOT || (process.argv.includes('--dist') ? 'dist' : 'public');
const project = process.argv.includes('--project');
const c = JSON.parse(fs.readFileSync(`${root}/data/blocks.json`, 'utf8'));
const classifications = compileClassifications(YAML.parse(fs.readFileSync('../catalogue-items/classification.yaml', 'utf8')));
const blocks = c.blocks.map(b => project ? { ...b, task: classifications.primary.get(b.slug) ?? b.task, ...classifications.fields(b.slug) } : b);
const bySlug = new Map(blocks.map(b => [b.slug, b]));
const documents = blocks.map(b => {
  const page = JSON.parse(fs.readFileSync(`${root}/data/pages/${b.slug}.json`, 'utf8'));
  return makeSearchDocument(b, page, { body: fs.readFileSync(`${root}/skills/${b.slug}/SKILL.md`, 'utf8') });
});
const metadataDocs = blocks.map(b => makeSearchDocument(b, b.type === 'mind' ? { when: c.minds.roster.find(m => m.slug === b.slug)?.useCases ?? [] } : {}));
const indexes = { metadata: buildLibrarySearchIndex(metadataDocs, 'a'.repeat(64)), full: buildLibrarySearchIndex(documents, 'a'.repeat(64)) };
if (!project) {
  const artifact = JSON.parse(fs.readFileSync(`${root}/data/library-search.json`, 'utf8'));
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(artifact.sourceHash, hash(fs.readFileSync(`${root}/data/blocks.json`)), 'Published search must match the catalogue');
  const engineHashes = {};
  for (const file of ['library-search-core.ts', 'library-search-intents.ts', 'catalogue-taxonomy.mjs', 'search-document.mjs']) engineHashes[file] = hash(fs.readFileSync(new URL('../src/lib/' + file, import.meta.url)));
  assert.equal(artifact.engineHash, hash(JSON.stringify(engineHashes)), 'Published search must match the current ranking rules');
  for (const [id, chunk] of artifact.shards.files.entries()) {
    const bytes = fs.readFileSync(path.join(root, chunk.file));
    assert.equal(hash(bytes), chunk.sha256, 'Search chunk must match its published hash');
    artifact.postings.splice(id * artifact.shards.size, chunk.terms, ...JSON.parse(bytes));
  }
  indexes.published = artifact;
}
const cases = [
  { query: 'value investing', expected: ['warren-buffett', 'charlie-munger'], within: 5 },
  { query: 'margin of safety', expected: ['benjamin-graham'], within: 10 },
  { query: 'mental models for decision making', expected: ['charlie-munger'], within: 10 },
  { query: 'personal budgeting', expected: ['ramit-sethi'], within: 10 },
  { query: 'product discovery', expected: ['marty-cagan'], within: 10 },
  { query: 'negotiation minds', expected: ['chris-voss', 'roger-fisher'], within: 10 },
  { query: 'copywriting minds', expected: ['david-ogilvy'], within: 10 },
  { query: 'user experience minds', expected: ['don-norman', 'jakob-nielsen'], within: 10 },
  { query: 'data visualization minds', expected: ['edward-tufte'], within: 10 },
  { query: 'cybersecurity minds', expected: ['troy-hunt'], within: 10 },
  { query: 'study techniques minds', expected: ['barbara-oakley'], within: 10 },
  { query: 'leadership minds', expected: ['peter-drucker'], within: 15 },
  { query: 'customer service minds', expected: ['tony-hsieh'], within: 10 },
  { query: 'cash flow forecast', tasks: ['plan-budgets-and-cash'], within: 5 },
  { query: 'bank reconciliation', tasks: ['manage-accounting'], within: 5 },
  { query: 'deferred tax calculations', tasks: ['manage-tax'], within: 5 },
  { query: 'review contract risky clauses', tasks: ['check-contracts'], within: 5 },
  { query: 'product discovery workflow', kind: 'workflow', within: 1 },
  { query: 'customer support agent', kind: 'agent', within: 1 },
  { query: 'meeting notes prompt', kind: 'prompt', within: 1 },
  { query: 'fix my crashing app', tasks: ['test-and-fix-code'], within: 5 },
  { query: 'meeting notes and action items', tasks: ['organise-work', 'manage-projects'], within: 5 },
  { query: 'sales data trends', tasks: ['analyse-data', 'track-numbers', 'read-ad-results'], within: 5 },
  { query: 'employee onboarding', tasks: ['hire-people'], within: 5 },
  { query: 'customer onboarding', excludeTasks: ['hire-people'], within: 5 },
  { query: 'SEO audit', tasks: ['get-found-in-search'], within: 5 },
  { query: 'ad spend analysis', tasks: ['read-ad-results', 'plan-ad-tests'], within: 5 },
  { query: 'scientific literature review', tasks: ['research-topics', 'teach-and-train'], within: 5 },
  { query: 'video ad script', tasks: ['make-video-ads'], within: 5 },
  { query: 'write an email reply', tasks: ['write-emails', 'organise-work', 'help-customers'], within: 5 },
  { query: 'customer lifetime value', exclude: ['warren-buffett', 'charlie-munger'], within: 5 },
  { query: 'value stream mapping', exclude: ['warren-buffett', 'charlie-munger'], within: 5 },
  { query: 'investing in employee training', exclude: ['warren-buffett', 'charlie-munger'], within: 5 },
  { query: 'Charlie Munger', expected: ['charlie-munger'], within: 1 },
  { query: 'quasar sandwich zyxnonexistent', empty: true },
  // Held-out phrasing exercises the same purpose model beyond short topic names.
  { query: 'find an expert on value investing', expected: ['warren-buffett', 'charlie-munger'], within: 5 },
  { query: 'help me plan spending before I run out of cash', tasks: ['plan-budgets-and-cash'], within: 5 },
  { query: 'get my bookkeeping ready for month end', tasks: ['manage-accounting'], within: 5 },
  { query: 'prepare a negotiation with a difficult client', expected: ['chris-voss'], within: 15 },
  { query: 'teach me how to remember what I study', tasks: ['study-and-practice', 'teach-and-train', 'think-with-minds'], within: 5 },
  { query: 'turn feedback from buyers into clear themes', tasks: ['understand-customers'], within: 5 },
  { query: 'protect my account from phishing', tasks: ['secure-code', 'think-with-minds'], within: 5 },
  { query: 'need a workflow for testing a new product idea', kind: 'workflow', within: 1 },
  { query: 'need a prompt for difficult customer complaints', kind: 'prompt', tasks: ['help-customers'], within: 1 },
  { query: 'need an agent to watch customer support tickets', kind: 'agent', within: 1 },
  { query: 'prepare a financial close checklist', tasks: ['manage-accounting'], within: 5 },
  { query: 'turn a CSV into charts I can explain', tasks: ['analyse-data', 'track-numbers'], within: 5 },
  { query: 'review recurring supplier invoices for mistakes', tasks: ['manage-accounting'], within: 5 },
  { query: 'help me prepare for a job interview', tasks: ['find-a-job', 'hire-people'], within: 5 },
  { query: 'get my website cited in AI answers', tasks: ['get-found-in-search'], within: 5 },
];
const results = [];
for (const [mode, index] of Object.entries(indexes)) for (const example of cases) {
  const ranked = [...searchLibraryIndex(index, example.query)].sort((a, b) => b[1].score - a[1].score || (bySlug.get(a[0]).name ?? a[0]).localeCompare(bySlug.get(b[0]).name ?? b[0]));
  const first = ranked.slice(0, example.within ?? 5).map(([slug]) => slug);
  const reasons = [];
  if (example.expected?.some(slug => !first.includes(slug))) reasons.push('expected result missing');
  if (example.tasks && !first.some(slug => example.tasks.includes(bySlug.get(slug).task))) reasons.push('intended task missing');
  if (example.excludeTasks && first.some(slug => example.excludeTasks.includes(bySlug.get(slug).task))) reasons.push('wrong task at top');
  if (example.exclude?.some(slug => first.includes(slug))) reasons.push('unrelated subject at top');
  if (example.kind && !first.some(slug => (bySlug.get(slug).type ?? 'skill') === example.kind)) reasons.push('requested format missing');
  if (example.empty && ranked.length) reasons.push('unsupported query has results');
  results.push({ mode, query: example.query, pass: !reasons.length, reasons, top: ranked.slice(0, 10).map(([slug, hit]) => ({ slug, name: bySlug.get(slug).name, score: Math.round(hit.score), field: hit.field, reason: hit.reason })) });
}
const reportRoot = process.env.CATALOGUE_EVAL_REPORTS || '../reports/2026-10-26-library-taxonomy';
fs.mkdirSync(reportRoot, { recursive: true });
const report = { projected: project, entries: blocks.length, queries: cases.length, checks: results.length, passed: results.filter(r => r.pass).length, results };
fs.writeFileSync(`${reportRoot}/search-${project ? 'projected' : 'evaluation'}.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, results: results.map(r => ({ mode: r.mode, query: r.query, pass: r.pass, reasons: r.reasons, top: r.top.slice(0, 5).map(t => t.slug) })) }, null, 2));
if (process.argv.includes('--check')) assert.equal(report.passed, report.checks, 'Search relevance evaluation failed');
