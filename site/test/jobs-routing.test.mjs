import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { routeJob, classifyJob, requestedWork, SINGLE_LEAD_MAX } from '../src/jobs/router.mjs';
import { startJob } from '../src/jobs/engine.mjs';
import { validateJobDocument } from '../src/jobs/contracts.mjs';
const context = { items: [{ slug: 'copy-checker', name: 'Copy checker' }, { slug: 'page-auditor', name: 'Page auditor' }], roles: [{ id: 'graphic-designer', name: 'Graphic designer' }], personas: [{ id: 'sample-agent', name: 'Sample Agent' }] };
// One lead is the default. A team is for mixed kinds of work, a large batch, or a request for one.
const golden = [
  ...['Use copy-checker', 'Run the copy-checker skill', 'Load page-auditor', 'Use the Page auditor skill', 'Hire graphic-designer', 'Use the Graphic designer specialist', 'Load sample-agent', 'Use the Sample Agent agent', 'Only UGC videos', 'Make only illustrated images', 'Just one email', 'Only text', 'Use the specific-catalogue skill', 'Load the selected agent', 'Just a report'].map(request => [request, 'direct']),
  ...['I need more customers', 'My sales are down', 'Help me grow revenue', 'My business is struggling', 'Reduce my costs', 'Increase retention', 'We want more sales', 'I want to learn', 'Our costs are rising', 'I need fewer errors'].map(request => [request, 'outcome']),
  ...['Create 10 ads for a new product', 'Build a website', 'Design a new onboarding flow', 'Review this proposal', 'Audit this report', 'Compare three options', 'Draft a policy', 'Make 6 social posts', 'Produce a weekly plan', 'Diagnose the checkout problem', 'Create a strategy', 'Write a product brief', 'Build a data pipeline', 'Prepare an analysis',
    'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to', 'Give me 5 Meta ad concepts for our running shoe', 'Write a 3-email welcome series', 'Audit our pricing page', 'Write an onboarding email for our sales team', 'Write a 10-page report on our churn', 'Plan a 90-day email calendar'].map(request => [request, 'single']),
  ...['Write 20 messages', 'Make 25 ads for Gehna', 'Make 30 product photos', 'Launch our new product: landing page, 6 ads and a 5-email sequence', 'Create two ads and build a landing page on the existing website', 'Put a team on our homepage redesign', 'Use a council to decide our pricing', 'Write our launch email with a team of specialists'].map(request => [request, 'team']),
];
for (const [request, mode] of golden) test(`mode routing: ${request}`, () => { const result = routeJob({ request }, context); assert.equal(result.mode, mode, result.mode_reason); });

test('the route says why in plain words, and counts only what is to be made', () => {
  const page = routeJob({ request: 'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to' }, context);
  assert.deepEqual(page.work, { kinds: [{ id: 'page', label: 'a page', phrase: 'build a landing page' }], count: 0 });
  assert.match(page.mode_reason, /one kind of work, so one lead does it/);
  const ads = routeJob({ request: 'Give me 5 Meta ad concepts for our running shoe' }, context);
  assert.equal(ads.work.count, 5); assert.match(ads.mode_reason, /^5 pieces of one kind of work, so one lead makes them all/);
  const mixed = routeJob({ request: 'Launch our new product: landing page, 6 ads and a 5-email sequence' }, context);
  assert.deepEqual(mixed.work.kinds.map(kind => kind.id), ['page', 'ads', 'email']);
  assert.match(mixed.mode_reason, /different kinds of work \(a page, ads and emails\), so one lead runs a small team/);
  assert.match(routeJob({ request: 'Make 25 ads for Gehna' }, context).mode_reason, /^25 pieces is a large batch/);
  assert.equal(routeJob({ request: `Make ${SINGLE_LEAD_MAX} ads` }, context).mode, 'single'); assert.equal(routeJob({ request: `Make ${SINGLE_LEAD_MAX + 1} ads` }, context).mode, 'team');
  // Words that describe the setting are not deliverables: the channel, the traffic source, who it is for.
  for (const [request, kinds] of [['Write a welcome email for people who clicked our Instagram ads', ['email']], ['Write an email announcing our new landing page', ['email']], ['Audit the landing page our Google ads point to', ['page']], ['Make 6 static ads that send people to our new pricing page', ['ads']], ['Write a blog post and 5 social posts about it', ['content']], ['Write ad copy for our email sign-up offer', ['ads']]]) assert.deepEqual(requestedWork(request).kinds.map(kind => kind.id), kinds, request);
  // Lengths and durations are not batch sizes.
  for (const request of ['Plan a 90-day email calendar', 'Write a 30-page ebook', 'Write a 1500 word article']) assert.equal(requestedWork(request).count, 0, request);
});

test('borderline requests ask about the output, and the caller can choose the mode', () => {
  const unclear = routeJob({ request: 'help please' }, context); assert.equal(unclear.ask, true); assert.equal(unclear.mode, 'single'); assert.ok(unclear.question);
  assert.equal(routeJob({ request: 'Only text', mode: 'team' }, context).mode, 'team');
  assert.equal(routeJob({ request: 'Launch our new product: landing page, 6 ads and a 5-email sequence', mode: 'single' }, context).mode, 'single');
  assert.equal(routeJob({ request: 'Build a website', dials: { depth: 'deep' } }, context).mode, 'team');
  assert.notEqual(routeJob({ request: 'More customers', parent_outcome_id: 'parent' }, context).mode, 'outcome');
  assert.equal(routeJob({ request: 'Build a website', mode: 'committee' }, context).ok, false);
});

test('direct and outcome routing results satisfy their published response schema', async () => {
  for (const request of ['Use copy-checker', 'I need more customers']) { const result = await startJob({ request }, context); assert.match(result.next_action.instruction, /call prepare_job_context and ground the work/); assert.equal(result.execution_plan.gates, undefined); const check = validateJobDocument('ai-blocks-job/1', result); assert(check.ok, JSON.stringify(check.errors)); }
  // Only brand-facing work (a page, ad, copy or email) is told to read the org context.
  assert.match((await startJob({ request: 'Use copy-checker' }, context)).next_action.instruction, /needs the org context/);
  for (const deliverable_kind of ['audit', 'plan', 'code']) assert.doesNotMatch((await startJob({ request: 'Use copy-checker', deliverable_kind }, context)).next_action.instruction, /org context|brand file/);
  assert.doesNotMatch((await startJob({ request: 'I need more customers' }, context)).next_action.instruction, /org context|brand file/);
});

// A small index, so the kind filter is tested without the built catalogue.
const family = what => [{ name: what, what_it_looks_like: what }];
const small = { jobs: {
  'write-landing-page': { name: 'Write and build a landing page', keywords: ['page', 'landing', 'offer', 'proof', 'traffic'], families: family('A built page') },
  'audit-landing-page': { name: 'Audit a landing page', keywords: ['page', 'score', 'fix', 'ranked'], families: family('A ranked fix list') },
  'make-image-ads': { name: 'Make image ads', keywords: ['image', 'ads', 'meta', 'traffic', 'product'], families: family('Still image ads') },
  'write-emails': { name: 'Write emails that get read', keywords: ['email', 'send', 'flow', 'welcome', 'series'], families: family('An email series') },
  'plan-strategy': { name: 'Plan your strategy', keywords: ['plan', 'launch', 'product'], families: family('A plan') },
} };
test('the noun that names the deliverable beats words about its setting', () => {
  const treeRunner = 'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to';
  assert.equal(classifyJob(treeRunner, small, { deliverable_kind: 'web_page' }).job, 'write-landing-page');
  assert.equal(classifyJob(treeRunner, small).job, 'write-landing-page');
  assert.equal(routeJob({ request: treeRunner, deliverable_kind: 'web_page' }, { approaches: small }).job_type.job, 'write-landing-page');
  assert.equal(classifyJob('Write a welcome email for people who clicked our Meta image ads', small).job, 'write-emails');
  assert.equal(classifyJob('Make 6 image ads that send traffic to our landing page', small).job, 'make-image-ads');
});
test('a declared deliverable kind filters the candidates', () => {
  const request = 'Promote the launch of our new product';
  assert.equal(classifyJob(request, small, { deliverable_kind: 'web_page' }).job, 'write-landing-page');
  assert.equal(classifyJob(request, small, { deliverable_kind: 'ad_creative' }).job, 'make-image-ads');
  assert.equal(classifyJob(request, small, { deliverable_kind: 'email' }).job, 'write-emails');
  // Planning and checking kinds never land on a job that makes pages, ads or emails.
  assert.equal(classifyJob('Plan our Meta image ads launch', small, { deliverable_kind: 'plan' }).job, 'plan-strategy');
  assert.equal(classifyJob('Audit the landing page our Meta image ads send traffic to', small, { deliverable_kind: 'audit' }).job, 'audit-landing-page');
  for (const kind of ['audit', 'analysis', 'strategy', 'plan']) for (const text of ['Review our Meta image ads', 'Look at our welcome email series', 'Check our landing page offer']) assert.ok(!['make-image-ads', 'write-emails', 'write-landing-page'].includes(classifyJob(text, small, { deliverable_kind: kind }).job), `${kind}: ${text}`);
  // Alternatives stay inside the declared kind too, and an unknown kind is ignored.
  assert.deepEqual(classifyJob('Build a landing page with image ads and an email', small, { deliverable_kind: 'web_page' }).alternatives, []);
  assert.equal(classifyJob(request, small, { deliverable_kind: 'landing' }).job, classifyJob(request, small).job);
});

test('real catalogue distinguishes making an output from auditing the same output', () => {
 const approaches=JSON.parse(fs.readFileSync(new URL('../public/data/approach-index.json',import.meta.url)));
 for(const [request,expected] of [
 ['Create 20 finished varied static Meta ads for a jewellery brand, grounded in its verified brand brain and product photography.','make-image-ads'],
 ['Audit the Meta ads account and reconcile revenue with backend sales.','read-ad-results'],
 ['Build a responsive product landing page','write-landing-page'],
 ['Audit my landing page','audit-landing-page'],
 ['Write eight finished HTML marketing emails and a lifecycle calendar','write-emails'],
 ['Audit SEO AEO GEO and produce implementable fixes','get-found-in-search']
 ]) assert.equal(classifyJob(request,approaches).job,expected,request);
});

test('real catalogue: ads, pages, emails, audits and plans keep their job type despite distracting context words', () => {
 const approaches=JSON.parse(fs.readFileSync(new URL('../public/data/approach-index.json',import.meta.url)));
 const cases=[
  ['Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to','web_page',['write-landing-page']],
  ['Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to',undefined,['write-landing-page']],
  ['Give me 5 Meta ad concepts for our running shoe',undefined,['make-image-ads']],
  ['Write a 3-email welcome series',undefined,['write-emails']],
  ['Audit our pricing page',undefined,['audit-landing-page']],
  ['Write a welcome email for people who clicked our Instagram ads',undefined,['write-emails']],
  ['Write an email announcing our new landing page',undefined,['write-emails']],
  ['Design a landing page for our email newsletter sign-up',undefined,['write-landing-page']],
  ['Make 6 static ads that send people to our new pricing page',undefined,['make-image-ads']],
  ['Audit the landing page our Google ads point to',undefined,['audit-landing-page']],
  ['Write ad copy for our email sign-up offer',undefined,['write-ad-copy']],
  ['Write a landing page for our abandoned cart email campaign','web_page',['write-landing-page']],
  ['Write the email that goes with our Black Friday ads','email',['write-emails']],
  ['Audit our Meta ads account','audit',['check-ads','read-ad-results']],
  ['Plan our Meta ads launch for the new shoe','plan',['launch-and-scale-ads','plan-ad-tests']],
  ['Launch our new product: landing page, 6 ads and a 5-email sequence',undefined,['write-landing-page']],
 ];
 for(const [request,deliverable_kind,expected] of cases)assert.ok(expected.includes(classifyJob(request,approaches,{deliverable_kind}).job),`${request} (${deliverable_kind??'no kind'}) -> ${classifyJob(request,approaches,{deliverable_kind}).job}`);
});

// A catalogue small enough to read, with a lead for each kind of work.
const role = (id, name, seat, job, summary) => ({ id, name, summary, department: seat === 'maker' ? 'marketing' : 'operations', area: 'marketing', seat_suitability: seat === 'maker' ? ['maker', 'strategist'] : [seat], lenses: [id], job, deliverables: [summary], resources: [] });
const catalogue = { approaches: small, items: [], personas: [], roles: { roles: [
  role('general-coordinator', 'General coordinator', 'coordinator', 'think-with-minds', 'Scope a job and check the delivery'),
  role('ad-landing-page', 'Ad landing page designer', 'maker', 'write-landing-page', 'Build a landing page that matches the ad'),
  role('engineering-frontend-developer', 'Frontend developer', 'maker', 'build-websites', 'Build working pages'),
  role('email-writer', 'Email writer', 'maker', 'write-emails', 'Write an email welcome series'),
  role('design-specialist', 'Design specialist', 'maker', 'make-image-ads', 'Design image ads'),
  role('skeptic', 'Sceptic', 'red_team', null, 'Challenge the plan'), role('checker', 'Fact checker', 'fact_checker', null, 'Check claims'),
  role('reviewer', 'Reviewer', 'judge', null, 'Review the work'), role('brand', 'Brand critic', 'critic', null, 'Read as the client'),
] } };
const count = value => (JSON.stringify(value).match(/\S+/g) ?? []).length;

test('a single landing page goes to one lead: no seats, no state, no team method', async () => {
  const r = await startJob({ request: 'Build a landing page for our Tree Runner shoes that we can send Meta ad traffic to', deliverable_kind: 'web_page' }, catalogue);
  assert.equal(r.mode, 'single'); assert.equal(r.phase, 'ROUTE'); assert.equal(r.job_type.job, 'write-landing-page'); assert.equal(r.estimate.seats, 1);
  assert.equal(r.lead.role_id, 'ad-landing-page'); assert.equal(r.lead.name, 'Ad landing page designer'); assert.deepEqual(r.lead.load, { tool: 'prepare_specialist', args: { role_id: 'ad-landing-page' } });
  assert.equal(r.next_action.tool, 'prepare_specialist'); assert.equal(r.next_action.context.tool, 'prepare_job_context');
  assert.deepEqual(r.files, []); assert.equal(r.state, undefined); assert.equal(r.team, undefined); assert.equal(Object.keys(r)[1], 'brief');
  // The request already names the traffic source, so that question is not asked again.
  assert.deepEqual(r.questions.map(q => q.id), ['one_action', 'proof', 'offer']); assert.equal(r.next_action.questions_allowed, 3);
  // The brief asks the same questions, so the note only says how to ask them.
  assert.match(r.questions_note, /you decide/); assert.doesNotMatch(r.questions_note, /TASTE/); assert.ok(r.brief.includes(r.questions[0].question));
  assert.ok(r.rubric.criteria.length && r.rubric.gates.length); assert.equal(r.rubric.criteria.reduce((sum, c) => sum + c.weight, 0), 100);
  assert.match(r.next_action.instruction, /One lead does this job/); assert.doesNotMatch(JSON.stringify(r), /JOB-METHOD|state_digest|draft_receipt/);
  assert.ok(count(r) < 1200, `a single job start is ${count(r)} words`);
  const check = validateJobDocument('ai-blocks-job/1', r); assert(check.ok, JSON.stringify(check.errors));
  // Emails and ads get their own lead.
  assert.equal((await startJob({ request: 'Write a 3-email welcome series' }, catalogue)).lead.role_id, 'email-writer');
  assert.equal((await startJob({ request: 'Give me 5 Meta ad concepts for our running shoe' }, catalogue)).lead.role_id, 'design-specialist');
  // No catalogue role fits: the caller is sent to find_specialist instead of a made-up lead.
  const none = await startJob({ request: 'Build a website' }, { approaches: small }); assert.equal(none.lead, null); assert.equal(none.next_action.tool, 'find_specialist');
});

test('a mixed request goes to a team with one named lead and the helpers it may call', async () => {
  const r = await startJob({ request: 'Launch our new product: landing page, 6 ads and a 5-email sequence' }, catalogue);
  assert.equal(r.mode, 'team'); assert.equal(r.phase, 'SCOPE'); assert.match(r.mode_reason, /different kinds of work/);
  assert.equal(r.team.lead.role_id, 'ad-landing-page'); assert.equal(r.team.lead.name, 'Ad landing page designer'); assert.match(r.team.lead.owns, /deliverable/);
  assert.ok(r.team.helpers.length >= 3); assert.ok(r.team.helpers.every(helper => helper.job && helper.role_id && helper.seat_type !== 'coordinator'));
  assert.ok(r.team.helpers.some(helper => helper.seat_type === 'judge')); assert.equal(r.estimate.seats, r.team.helpers.length + 2);
  // What the lead must read: the short method, the plan and the spec template. The state is sent once.
  assert.deepEqual(r.files.map(file => file.path), ['EXECUTION-PLAN.json', 'JOB-METHOD.md', 'templates/JOB-CARD.json']); assert.ok(r.state && r.state_digest);
  const method = r.files.find(file => file.path === 'JOB-METHOD.md').content;
  assert.ok((method.match(/\S+/g) ?? []).length < 900); assert.match(method, /One lead owns the deliverable/); assert.match(method, /JOB-RECORDS\.md/);
  const plan = JSON.parse(r.files.find(file => file.path === 'EXECUTION-PLAN.json').content); assert.ok(plan.gates.length); assert.equal(plan.retrieval, undefined);
  assert.ok(r.questions.length <= 4 && r.questions.every(q => q.question && q.default)); assert.equal(r.taste_questions, undefined);
  const check = validateJobDocument('ai-blocks-job/1', r); assert(check.ok, JSON.stringify(check.errors));
  assert.equal((await startJob({ request: 'Write a 3-email welcome series', mode: 'team' }, catalogue)).mode, 'team');
});

test('real catalogue: plain requests land on a sensible job with the right kind of work', async () => {
 const approaches=JSON.parse(fs.readFileSync(new URL('../public/data/approach-index.json',import.meta.url)));
 const { suggestDeliverableKind } = await import('../src/jobs/grounding.mjs');
 const { LOW_CONFIDENCE } = await import('../src/jobs/router.mjs');
 // [request, sensible jobs, kind of work]. "Write a press release" used to land on write-landing-page.
 const cases=[
  ['Write a press release',['write-and-tell-stories'],'copy'],
  ['Write a press release about our new store opening',['write-and-tell-stories'],'copy'],
  ['Write a blog post about how to care for leather shoes',['write-and-tell-stories','get-found-in-search'],'copy'],
  ['Write a product description for our new candle',['run-your-store','set-up-store'],'copy'],
  ['Write a cold email to a head of marketing',['write-emails','sell-and-negotiate'],'email'],
  ['Make a pitch deck for our seed round',['work-with-files','speak-and-persuade'],'other'],
  ['Do a pricing audit for our SaaS plans',['set-prices'],'audit'],
  ['Make an SEO plan for our store',['get-found-in-search'],'plan'],
  ['Plan a social media calendar for next month',['grow-social'],'plan'],
  ['Design a logo for my bakery',['design-work','brand-file'],'other'],
  ['Write an explainer video script for our app',['make-video-ads','write-and-tell-stories'],'copy'],
  ['Write a sales page for our online course',['write-landing-page'],'web_page'],
  ['Write ad copy only for our summer sale',['write-ad-copy'],'copy'],
  ['Write onboarding emails for new users',['write-emails','keep-customers'],'email'],
  ['Do a competitor analysis of three rival shoe brands',['study-competitors','understand-customers'],'analysis'],
  ['Fix a bug in our checkout code',['test-and-fix-code'],'code'],
  ['Write a case study',['write-and-tell-stories'],'copy'],
  ['Write a job description for a store manager',['hire-people'],'ops_doc'],
  ['Write a LinkedIn post about our funding',['grow-social'],'copy'],
  ['Write a business plan',['plan-strategy'],'plan'],
  ['Write a refund policy',['check-contracts','help-customers','document-work'],'ops_doc'],
  ['Write FAQ answers for our support page',['help-customers'],'other'],
  ['Write a proposal for a client',['sell-and-negotiate'],'copy'],
  ['Write a speech for our launch event',['speak-and-persuade'],'copy'],
  ['Make a YouTube thumbnail',['make-images','design-work'],'other'],
 ];
 for(const [request,expected,kind] of cases){
  const picked=classifyJob(request,approaches),route=routeJob({request},{approaches});
  assert.ok(expected.includes(picked.job),`${request} -> ${picked.job}`);
  assert.ok(picked.confidence>LOW_CONFIDENCE,`${request}: confidence ${picked.confidence}`);
  assert.equal(route.mode,'single',request);assert.equal(route.ask,undefined,`${request} should not need a question`);
  assert.equal(suggestDeliverableKind(request).kind,kind,request);
 }
 // The first thing named decides; a later one does not take over.
 assert.equal(classifyJob('Write a landing page and a press release about it',approaches).job,'write-landing-page');
 // A declared kind still filters a named deliverable.
 assert.notEqual(classifyJob('Write a press release',approaches,{deliverable_kind:'email'}).job,'write-and-tell-stories');
});

test('a job type that is only a guess asks one question, and no lead starts on it', async () => {
 const approaches=JSON.parse(fs.readFileSync(new URL('../public/data/approach-index.json',import.meta.url)));
 const { LOW_CONFIDENCE } = await import('../src/jobs/router.mjs');
 for(const request of ['Write a haiku about autumn','Make a crossword puzzle','Compare three options','Write a eulogy for my grandfather','Translate our homepage into French']){
  const route=routeJob({request},{approaches});
  assert.equal(route.mode,'single',request);assert.equal(route.ask,true,request);assert.equal(route.unsure,true,request);
  assert.ok(route.job_type.confidence<=LOW_CONFIDENCE,request);assert.match(route.question,/^What kind of work is this\? The closest I have are "/,request);
  assert.equal(route.question.split('?').length-1,1,'one question');assert.match(route.mode_reason,/not clear yet what kind of work/);
 }
 // The same rule on a small index: "press release" matches no job's own words, so the route asks instead of guessing a page.
 const guess=routeJob({request:'Write a press release'},{approaches:small});
 assert.equal(guess.unsure,true);assert.ok(guess.job_type.confidence<=LOW_CONFIDENCE);assert.match(guess.question,/"Write (?:and build a landing page|emails that get read)"/);
 // start_job names no lead and sends no method: the one question, then start_job again.
 const started=await startJob({request:'Write a haiku about autumn'},{...catalogue,approaches});
 assert.equal(started.lead,null);assert.equal(started.next_action.tool,'start_job');assert.equal(started.next_action.question,started.question);
 assert.match(started.next_action.instruction,/^Ask this one question before anything else: What kind of work is this\?/);assert.match(started.next_action.instruction,/Do not pick a lead or start work on a guess\./);
 assert.doesNotMatch(started.next_action.instruction,/One lead does this job/);
 const check=validateJobDocument('ai-blocks-job/1',started);assert(check.ok,JSON.stringify(check.errors));
 // A declared kind, a clear request, or an index with no jobs never triggers the question.
 assert.equal(routeJob({request:'Write a haiku about autumn',deliverable_kind:'copy'},{approaches}).ask,undefined);
 assert.equal(routeJob({request:'Build a website'},{approaches:small}).ask,undefined);
 assert.equal(routeJob({request:'Write a haiku about autumn'},context).ask,undefined);
 // A fix is a job, not an unclear request.
 assert.equal(routeJob({request:'Fix a bug in our checkout code'},{approaches}).ask,undefined);
});

test('mixed work is counted by what is made: an audit plus a rewrite, a brand plus a site', () => {
 const kinds=request=>requestedWork(request).kinds.map(kind=>kind.id);
 assert.deepEqual(kinds('audit our store and rewrite the top 5 product pages'),['audit','page']);
 assert.deepEqual(requestedWork('audit our store and rewrite the top 5 product pages').kinds.map(kind=>[kind.phrase,kind.count]),[['audit our store',undefined],['rewrite the top 5 product pages',5]]);
 assert.deepEqual(kinds('new brand identity and a one-page website'),['brand','page']);
 assert.deepEqual(kinds('landing page, 6 ads and a 5-email sequence for our launch'),['page','ads','email']);
 assert.deepEqual(requestedWork('landing page, 6 ads and a 5-email sequence for our launch').kinds.map(kind=>kind.count),[undefined,6,5]);
 assert.deepEqual(kinds('Review our ads and write a new landing page'),['audit','page']);
 // An audit on its own stays one job about the thing it checks, and so does an audit with its fixes.
 assert.deepEqual(kinds('Audit our pricing page'),['page']);assert.deepEqual(kinds('Audit our landing page and fix the top issues'),['page']);
 // A video script is video work, not code. A logo is brand work.
 assert.deepEqual(kinds('Write an explainer video script for our app'),['video']);assert.deepEqual(kinds('Design a logo for my bakery'),['brand']);
 for(const [request,mode] of [['audit our store and rewrite the top 5 product pages','team'],['new brand identity and a one-page website','team'],['Audit our landing page and fix the top issues','single'],['Write an explainer video script for our app','single']])assert.equal(routeJob({request},context).mode,mode,request);
 assert.match(routeJob({request:'audit our store and rewrite the top 5 product pages'},context).mode_reason,/different kinds of work \(an audit and a page\)/);
});
