import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { inflateSync, strFromU8 } from 'fflate';
import { decodeCatalogue } from '../src/lib/composer-core.ts';
import { chain } from '../src/lib/step-graph.ts';
import { mermaidText, workflowDiagram } from '../src/lib/workflow-diagram.ts';
import { checkWorkflow } from '../src/lib/workflow-suggest.ts';
import { builderLink } from '../src/lib/workflow-link.ts';
import { PublicApiError, PublicCatalogueService } from '../src/server/public-catalogue.ts';

const sha = value => createHash('sha256').update(value).digest('hex');
const revision = 'a'.repeat(64);
// One hand-off line: site -> brand profile -> ad copy -> landing page -> page check, with a second page writer to swap in.
const items = [
  { slug: 'brand-builder', name: 'Brand profile builder', summary: 'Share your website. Get a brand profile with products and buyers.', task: 'brand-file', role: 'source', inputs: ['web_page'], outputs: ['brand_brain'], tested: 1 },
  { slug: 'ad-writer', name: 'Ad copy writer', summary: 'Write ad copy for one product from your brand profile.', task: 'write-ad-copy', inputs: ['brand_brain', 'offer?'], outputs: ['ad_copy'], tested: 1 },
  { slug: 'page-writer', name: 'Landing page writer', summary: 'Write a landing page that matches your ad.', task: 'write-ad-copy', inputs: ['ad_copy', 'brand_brain'], outputs: ['landing_page'], tested: 1 },
  { slug: 'quick-page-writer', name: 'Quick landing page writer', summary: 'Write a landing page for your ad from the brand profile.', task: 'write-ad-copy', inputs: ['brand_brain'], outputs: ['landing_page'] },
  { slug: 'page-checker', name: 'Landing page checker', summary: 'Check a landing page and rank its problems.', task: 'write-ad-copy', role: 'check', inputs: ['landing_page', 'design_direction?'], outputs: ['audit_report'] },
  { slug: 'ad-page-flow', name: 'Ad and landing page flow', summary: 'Write an ad and a matching landing page, then check the page.', task: 'write-ad-copy', type: 'workflow', category: 'orchestrator', inputs: ['web_page'], outputs: ['audit_report'], steps: ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'] },
];
const library = decodeCatalogue({ blocks: items });
const titles = slugs => slugs.map((s, i) => ({ id: `s${i + 1}`, title: library.bySlug[s].name }));

function service() {
  const blocks = JSON.stringify({ blocks: items });
  const assets = new Map([['/data/blocks.json', blocks]]); const resources = {};
  for (const item of items) {
    const md = `# ${item.name}\nFollow the user and verify inputs.\n`;
    assets.set(`/skills/${item.slug}/SKILL.md`, md);
    resources[item.slug] = { revision_sha256: revision, instruction: { path: `/skills/${item.slug}/SKILL.md`, sha256: sha(md), bytes: Buffer.byteLength(md) }, files: [], reference_validation: { status: 'PASS' } };
  }
  assets.set('/data/public-api-manifest.json', JSON.stringify({ schema: 'abb-public-catalogue/1', catalogue_sha256: sha(blocks), resources }));
  return new PublicCatalogueService(async path => assets.has(path) ? new Response(assets.get(path)) : new Response('Missing', { status: 404 }), 'https://example.test');
}
const rejects = (run, code) => assert.rejects(run, e => e instanceof PublicApiError && e.code === code);

/** A structural check of the Mermaid we write: every line is a known statement, node ids are short and defined once,
 *  links join defined nodes, labels are quoted and escaped, and linkStyle indexes exist. */
function assertMermaid(text) {
  const lines = text.split('\n');
  assert.match(lines[0], /^flowchart (LR|TD)$/);
  const nodes = new Set(), links = [];
  for (const line of lines.slice(1)) {
    let m;
    if (/^ {2}%% /.test(line) || /^ {2}classDef \w+ [\w#:,.\- ]+$/.test(line)) continue;
    if ((m = line.match(/^ {2}([a-z]+\d*|legend)(\(\["|\["|\{\{")([^"]*)("\]\)|"\]|"\}\})(:::\w+)?$/))) {
      assert.ok(!nodes.has(m[1]), `node ${m[1]} defined twice`); assert.ok(m[1].length <= 6, `short id ${m[1]}`);
      assert.ok(!/[[\]{}|;`<>]/.test(m[3]), `escaped label: ${m[3]}`);
      nodes.add(m[1]); continue;
    }
    if ((m = line.match(/^ {2}(\w+) (-->|-\.->|~~~)(?:\|"([^"]*)"\|)? (\w+)$/))) {
      assert.ok(nodes.has(m[1]) && nodes.has(m[4]), `link joins defined nodes: ${line}`);
      if (m[3] !== undefined) assert.ok(!/[[\]{}|;`<>]/.test(m[3]), `escaped edge label: ${m[3]}`);
      links.push(line); continue;
    }
    if ((m = line.match(/^ {2}linkStyle ([\d,]+) [\w#:,\- ]+$/))) { for (const i of m[1].split(',').map(Number)) assert.ok(i < links.length, `linkStyle ${i} exists`); continue; }
    assert.fail(`unexpected Mermaid line: ${line}`);
  }
  return { nodes, links };
}

test('mermaidText escapes quotes, brackets, pipes and semicolons and keeps labels on one short line', () => {
  assert.equal(mermaidText('Say "hi" [now] {x} | a;b <c> #1 `d`'), 'Say #34;hi#34; #91;now#93; #123;x#125; #124; a#59;b #60;c#62; #35;1 \'d\'');
  assert.equal(mermaidText('two\nlines\there'), 'two lines here');
  const long = mermaidText('x'.repeat(200));
  assert.equal(long.length, 48); assert.ok(long.endsWith('…'));
});

test('a ready workflow draws as valid Mermaid: steps in order, user inputs as start nodes, labelled hand-offs', () => {
  const slugs = ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'];
  const check = chain(library, slugs, { supplied: ['web_page'] });
  const d = workflowDiagram('Ad "and" [page] flow', titles(slugs), check);
  assert.equal(d.format, 'mermaid'); assert.equal(d.outline, undefined, 'concise is Mermaid only');
  const { nodes, links } = assertMermaid(d.mermaid);
  for (const id of ['u1', 's1', 's2', 's3', 's4']) assert.ok(nodes.has(id), id);
  assert.ok(d.mermaid.includes('u1(["You give: Web page"]):::user'));
  assert.ok(d.mermaid.includes('s1["1. Brand profile builder"]'));
  assert.ok(links.includes('  s2 -->|"Ad copy"| s3'), 'friendly type names on hand-offs');
  assert.ok(links.includes('  s1 -->|"Brand file"| s2'));
  assert.ok(!d.mermaid.includes('legend['), 'no legend node without problems');
  assert.ok(d.mermaid.includes('%% Ad #34;and#34; #91;page#93; flow'));
  const detailed = workflowDiagram('Ad flow', titles(slugs), check, { detailed: true });
  assert.match(detailed.outline, /^Ad flow: 4 steps\n1\. Brand profile builder\n {3}takes: Web page from you\n {3}hands on: Brand file to step 2, 3/);
  assert.match(detailed.outline, /Problems: none$/); assert.ok(detailed.legend);
});

test('broken hand-offs are red and dashed, suggested steps green and dashed, with a legend', () => {
  const slugs = ['ad-writer', 'page-checker', 'page-writer'];
  const check = chain(library, slugs);
  const d = workflowDiagram('Broken', titles(slugs), check, { additions: [{ before: 2, title: 'Brand profile builder', makes: ['brand_brain'] }], detailed: true });
  const { links } = assertMermaid(d.mermaid);
  assert.ok(d.mermaid.includes('m1{{"Missing: Brand file"}}:::bad'));
  assert.ok(links.includes('  s3 -.->|"Landing page, too late"| s2'));
  assert.ok(d.mermaid.includes('a1["+ Add: Brand profile builder"]:::add'));
  assert.ok(d.mermaid.includes('legend["'));
  const red = d.mermaid.match(/linkStyle ([\d,]+) stroke:#d33/)[1].split(',').map(Number);
  assert.deepEqual(red.map(i => links[i]).sort(), ['  m1 -.->|"Brand file"| s3', '  s3 -.->|"Landing page, too late"| s2']);
  assert.match(d.outline, /Landing page: OUT OF ORDER, only step 3 makes it/);
  assert.match(d.outline, /\+ Suggested: add Brand profile builder before step 3/);
});

test('long workflows switch to top-down and leave optional hand-offs out', () => {
  const slugs = Array.from({ length: 16 }, (_, i) => ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'][i % 4]);
  const d = workflowDiagram('Long', slugs.map((s, i) => ({ id: `s${i + 1}`, title: library.bySlug[s].name })), chain(library, slugs));
  assertMermaid(d.mermaid);
  assert.match(d.mermaid, /^flowchart TD/); assert.ok(!d.mermaid.includes('-.->|"Offer"'));
  assert.ok(d.mermaid.length < 4000);
});

test('checkWorkflow suggests removing repeats, data-flow order, the missing maker and a swap, from the shared ranking', () => {
  const r = checkWorkflow(library, ['page-checker', 'page-writer', 'page-writer']);
  assert.deepEqual(r.suggestions.map(s => s.kind), ['remove', 'reorder', 'insert', 'insert']);
  assert.deepEqual(r.suggestions[0], { kind: 'remove', step: 2, duplicate_of: 1 });
  assert.deepEqual(r.suggestions[1].order, [1, 0]);
  assert.deepEqual(r.suggestions[1].moves, [{ step: 1, before: 0, type: 'landing_page' }]);
  assert.equal(r.suggestions[2].slug, 'ad-writer'); assert.deepEqual(r.suggestions[2].makes, ['ad_copy']);
  assert.deepEqual(r.suggestions[3], { kind: 'insert', before: 1, slug: 'brand-builder', makes: ['brand_brain'], for_steps: [1], alternatives: [] });
  assert.deepEqual(r.proposed.steps, ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'], 'added makers in data-flow order');
  assert.deepEqual(r.proposed.from, [null, null, 1, 0]);
  assert.equal(r.proposed.check.ok, true); assert.equal(r.proposed.changed, true);
  const fine = checkWorkflow(library, ['brand-builder', 'ad-writer', 'page-writer']);
  assert.deepEqual(fine.suggestions, []); assert.equal(fine.proposed.changed, false);
  assert.ok(fine.alternatives[2].length <= 2 && fine.alternatives[2].every(a => typeof a.fits === 'boolean'));
});

test('builder links use the builder\'s own shared-link format with forward edges only', () => {
  const url = builderLink({ name: 'Ad flow', goal: 'An ad and a page', slugs: ['brand-builder', 'ad-writer', 'page-writer'], edges: [[0, 2], [1, 2], [2, 1]] });
  assert.match(url, /^https:\/\/useaiblocks\.com\/\?flow=[A-Za-z0-9_-]+#build$/);
  const code = url.match(/flow=([^#]+)/)[1];
  const data = JSON.parse(strFromU8(inflateSync(Uint8Array.from(atob(code.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)))));
  assert.equal(data.v, 1); assert.deepEqual(data.s, ['brand-builder', 'ad-writer', 'page-writer']); assert.equal(data.g, 'An ad and a page');
  assert.deepEqual(data.e, [[0, 1], [0, 2], [1, 2]], 'backward edge dropped; a step with no edge in joins the one before');
  assert.equal(data.p.length, 3);
  assert.equal(builderLink({ name: 'x', slugs: [] }), null);
  assert.equal(builderLink({ name: 'x', slugs: ['Bad Slug'] }), null);
});

test('get_workflow and plan_workflow return a diagram and a builder link', async () => {
  const svc = service();
  const flow = await svc.callTool('get_workflow', { slug: 'ad-page-flow' });
  assertMermaid(flow.diagram.mermaid); assert.equal(flow.diagram.outline, undefined);
  assert.equal(flow.open_in_builder, 'https://useaiblocks.com/?workflow=ad-page-flow#build');
  const detailed = await svc.callTool('get_workflow', { slug: 'ad-page-flow', response_format: 'detailed' });
  assert.match(detailed.diagram.outline, /^Ad and landing page flow: 4 steps/);
  const plan = await svc.callTool('plan_workflow', { request: 'write a landing page for my ad' });
  assert.deepEqual(plan.diagram.shows, { kind: 'ready_workflow', id: 'ad-page-flow', steps: ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'] });
  const map = await svc.callTool('plan_workflow', { slug: 'page-writer' });
  assert.equal(map.diagram.shows.kind, 'suggested_path'); assert.ok(map.diagram.shows.steps.includes('page-writer'));
  assertMermaid(map.diagram.mermaid); assert.match(map.open_in_builder, /\?flow=/);
});

test('prepare_workflow checks a list of step ids and returns suggestions, a diagram and the proposal in the builder', async () => {
  const svc = service();
  const broken = await svc.callTool('prepare_workflow', { goal: 'A checked landing page', slugs: ['page-checker', 'page-writer', 'page-writer'] });
  assert.equal(broken.workflow.name, 'A checked landing page', 'name defaults to the goal');
  assert.deepEqual(broken.workflow.steps.map(s => [s.id, s.depends_on]), [['s1', []], ['s2', ['s1']], ['s3', ['s2']]]);
  assert.equal(broken.handoff_check.status, 'WARN');
  assert.deepEqual(broken.suggestions.map(s => s.kind), ['remove', 'reorder', 'insert', 'insert']);
  assert.match(broken.suggestions[2].message, /^Add Ad copy writer before step s2: it makes the ad copy that step s2 \(Landing page writer\) needs/);
  assert.equal(broken.suggestions[3].slug, 'brand-builder');
  assert.deepEqual(broken.proposed.slugs, ['brand-builder', 'ad-writer', 'page-writer', 'page-checker']);
  assert.deepEqual(broken.proposed.steps.map(s => s.step), ['new1', 'new2', 's2', 's1']);
  assert.equal(broken.proposed.handoff_status, 'PASS');
  assert.deepEqual(broken.step_checks.map(s => s.status), ['WARN', 'WARN', 'WARN']);
  assert.equal(broken.step_checks[0].inputs[0].made_by_later_step, 's2');
  assertMermaid(broken.diagram.mermaid); assert.ok(broken.diagram.mermaid.includes('+ Add: Ad copy writer'));
  assert.match(broken.open_in_builder, /^https:\/\/useaiblocks\.com\/\?flow=/);
  assert.match(broken.next_action, /suggestion/); assert.match(broken.next_action, /proposed.slugs/);
  // The proposal checks clean, and a ready workflow's exact steps keep it as the governing skill.
  const fixed = await svc.callTool('prepare_workflow', { slugs: broken.proposed.slugs, response_format: 'detailed' });
  assert.equal(fixed.handoff_check.status, 'PASS'); assert.deepEqual(fixed.suggestions, []); assert.ok(fixed.diagram.outline);
  const ready = await svc.callTool('prepare_workflow', { slugs: ['brand-builder', 'ad-writer', 'page-writer', 'page-checker'] });
  assert.deepEqual(ready.governing_added, ['ad-page-flow']); assert.deepEqual(ready.workflow.governing_skills.map(g => g.slug), ['ad-page-flow']);
  assert.equal(ready.handoff_check.status, 'PASS');
  await rejects(() => svc.callTool('prepare_workflow', { slugs: ['ad-writer'], steps: [{ id: 'a', slug: 'ad-writer', revision_sha256: revision }] }), 'invalid_arguments');
  await rejects(() => svc.callTool('prepare_workflow', { name: 'x' }), 'invalid_arguments');
  await rejects(() => svc.callTool('prepare_workflow', { slugs: ['no-such-step'] }), 'not_found');
  await rejects(() => svc.callTool('prepare_workflow', { slugs: ['ad-writer'], response_format: 'full' }), 'invalid_arguments');
});
