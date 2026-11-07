import test from 'node:test';
import assert from 'node:assert/strict';
import { routeJob } from '../src/jobs/router.mjs';
import { startJob } from '../src/jobs/engine.mjs';
import { validateJobDocument } from '../src/jobs/contracts.mjs';
const context = { items: [{ slug: 'copy-checker', name: 'Copy checker' }, { slug: 'page-auditor', name: 'Page auditor' }], roles: [{ id: 'graphic-designer', name: 'Graphic designer' }], personas: [{ id: 'sample-agent', name: 'Sample Agent' }] };
const golden = [
  ...['Use copy-checker', 'Run the copy-checker skill', 'Load page-auditor', 'Use the Page auditor skill', 'Hire graphic-designer', 'Use the Graphic designer specialist', 'Load sample-agent', 'Use the Sample Agent agent', 'Only UGC videos', 'Make only illustrated images', 'Just one email', 'Only text', 'Use the specific-catalogue skill', 'Load the selected agent', 'Just a report'].map(request => [request, 'direct']),
  ...['I need more customers', 'My sales are down', 'Help me grow revenue', 'My business is struggling', 'Reduce my costs', 'Increase retention', 'We want more sales', 'I want to learn', 'Our costs are rising', 'I need fewer errors'].map(request => [request, 'outcome']),
  ...['Write 20 messages', 'Create 10 ads for a new product', 'Build a website', 'Design a new onboarding flow', 'Review this proposal', 'Audit this report', 'Compare three options', 'Draft a policy', 'Make 6 social posts', 'Produce a weekly plan', 'Diagnose the checkout problem', 'Create a strategy', 'Write a product brief', 'Build a data pipeline', 'Prepare an analysis'].map(request => [request, 'team']),
];
for (const [request, mode] of golden) test(`mode routing: ${request}`, () => { const result = routeJob({ request }, context); assert.equal(result.mode, mode); });
test('borderline requests ask about the output and explicit team selection takes priority', () => {
  assert.equal(routeJob({ request: 'help please' }, context).ask, true);
  assert.equal(routeJob({ request: 'Only text', mode: 'team' }, context).mode, 'team');
  assert.equal(routeJob({ request: 'More customers', parent_outcome_id: 'parent' }, context).mode, 'team');
});
test('direct and outcome routing results satisfy their published response schema', async () => {
  for (const request of ['Use copy-checker', 'I need more customers']) { const result = await startJob({ request }, context); const check = validateJobDocument('ai-blocks-job/1', result); assert(check.ok, JSON.stringify(check.errors)); }
});

test('real catalogue distinguishes making an output from auditing the same output', async () => {
 const fs=await import('node:fs'); const {classifyJob}=await import('../src/jobs/router.mjs'); const approaches=JSON.parse(fs.readFileSync(new URL('../public/data/approach-index.json',import.meta.url)));
 for(const [request,expected] of [
 ['Create 20 finished varied static Meta ads for a jewellery brand, grounded in its verified brand brain and product photography.','make-image-ads'],
 ['Audit the Meta ads account and reconcile revenue with backend sales.','read-ad-results'],
 ['Build a responsive product landing page','write-landing-page'],
 ['Audit my landing page','audit-landing-page'],
 ['Write eight finished HTML marketing emails and a lifecycle calendar','write-emails'],
 ['Audit SEO AEO GEO and produce implementable fixes','get-found-in-search']
 ]) assert.equal(classifyJob(request,approaches).job,expected,request);
});
