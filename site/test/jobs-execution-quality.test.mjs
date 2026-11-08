import test from 'node:test';
import assert from 'node:assert/strict';
import { buildExecutionPlan, validateExploration, validateProductionQuality, conceptSimilarity } from '../src/jobs/execution-quality.mjs';
import { startJob, advanceJob, jobStateDigest } from '../src/jobs/engine.mjs';
import { jobMethod } from '../src/jobs/method.mjs';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';
import {visualDelivery} from './fixtures/jobs/visual-delivery-fixture.mjs';

const send = (result, event, context) => advanceJob({ job_id: result.job_id, state: result.state, state_digest: result.state_digest, ...event }, context);
const visual = fixture => ({ ...fixture.card, visual_spec: { references: ['brand/reference.png'], fonts: ['Brand font'], colors: ['#123456'], logo: 'brand/logo.svg', formats: ['Editorial','Illustrated'], format_rationale: 'Different buyer promises and compositions.', required_renderer: 'imagegen' } });

test('concept similarity preserves Unicode letters, numbers and meaningful combining marks',()=>{
  assert.equal(conceptSimilarity('Everyday GIFT: real proportions!','everyday gift real proportions'),1);
  assert.equal(conceptSimilarity('Wear a personal daily ritual','Celebrate a festive gift moment'),0);
  assert.equal(conceptSimilarity('Ｃａｆé １２','Cafe\u0301 12'),1,'canonical and compatibility forms match');
  for(const [first,second]of [['अपनी पहचान पहनें','यादगार उपहार चुनें'],['日常の自分らしさ','記念日の贈り物'],['أناقة يومية شخصية','هدية للاحتفال بالذكرى']]){
    assert.equal(conceptSimilarity(first,first),1);
    assert.equal(conceptSimilarity(first,second),0,'non-Latin text must not collapse to an empty string');
  }
  assert.equal(conceptSimilarity('क','कि'),0,'the dependent vowel mark is retained');
});

test('independent Hindi, Japanese and Arabic concepts pass exploration while style-only duplicates still fail',async()=>{
  const concepts=[
    [
      {audience:'रोज़मर्रा के ग्राहक',promise:'हर दिन अपनी पहचान पहनें',proof:'धातु और जड़ाई का निकट दृश्य',composition:'ऊपर से विस्तृत रचना',visual_world:'शांत कागज़ी चित्रण'},
      {audience:'त्योहार के उपहार खरीदार',promise:'खास अवसर पर यादगार उपहार',proof:'पहनने पर आकार का वास्तविक उदाहरण',composition:'चेहरे के साथ बाएँ तरफ आभूषण',visual_world:'गर्म मिट्टी की मूर्तिकला'},
    ],
    [
      {audience:'毎日身につける人',promise:'日常の自分らしさ',proof:'金属と石留めの接写',composition:'余白のある俯瞰構図',visual_world:'静かな水彩画'},
      {audience:'記念日の贈り物を探す人',promise:'大切な日の思い出',proof:'着用した寸法の実例',composition:'顔の横に飾りを置く肖像',visual_world:'温かい粘土彫刻'},
    ],
    [
      {audience:'مستخدمون يرتدون الحلي يوميا',promise:'أناقة يومية شخصية',proof:'لقطة قريبة للمعدن وترصيع الحجر',composition:'ترتيب علوي مع مساحة واسعة',visual_world:'رسم مائي هادئ'},
      {audience:'باحثون عن هدايا المناسبات',promise:'ذكرى تدوم لوقت خاص',proof:'مثال حقيقي للمقاس عند الارتداء',composition:'صورة جانبية مع الحلي بجوار الوجه',visual_world:'نحت طيني دافئ'},
    ],
  ];
  for(const pair of concepts){
    const f=engineFixture(),input={...f.events[2].document,team:f.team,host:f.input.host_capabilities,card:visual(f)};
    input.spread.slots=input.spread.slots.slice(0,2);input.spread.slots.forEach((slot,index)=>{slot.concept=pair[index];});
    const distinct=await validateExploration(input);assert.equal(distinct.ok,true,JSON.stringify(distinct.errors));
    input.spread.slots[1].concept={...pair[0],visual_world:pair[1].visual_world};
    assert((await validateExploration(input)).errors.some(error=>/near-duplicate/.test(error.message)),'a style-only change is still a duplicate in every script');
  }
});

test('the shared plan distinguishes real pages, references and supporting copy or audits', () => {
  for(const request of ['Create an image ad','Create 25 static image ads with headlines and copy','Create image ads and a landing-page audit','Create ad copy and image ads'])assert.equal(buildExecutionPlan({request}).images.required,true,request);
  for(const request of ['Write image-ad copy','Create image-ad concepts','Prepare an ad creative brief','Create a website with existing images','Create an SVG illustration'])assert.equal(buildExecutionPlan({request}).images.required,false,request);
  for (const request of ['Build five landing pages for the existing Shopify store','Make five landing pages','Build landing pages, no image-only mockups','Build a real landing page, not a mockup']) assert.equal(buildExecutionPlan({ request }).landing_pages.delivery_mode, 'LAUNCHABLE_SITE', request);
  for (const request of ['Create image-only landing-page mockups for design review','Create a landing-page design reference only']) assert.equal(buildExecutionPlan({ request }).landing_pages.delivery_mode, 'DESIGN_REFERENCE', request);
  for (const request of ['Write landing page copy','Audit our landing pages','Create copy for landing pages','Review the current landing page mockup']) assert.equal(buildExecutionPlan({ request }).landing_pages.delivery_mode, 'NONE', request);
  for(const request of ['Create a working website','Design a website','Make a website for our service'])assert.equal(buildExecutionPlan({request}).landing_pages.delivery_mode,'LAUNCHABLE_SITE',request);
  for(const request of ['Create a website audit','Create image ads and a landing page audit','Create website copy'])assert.equal(buildExecutionPlan({request}).landing_pages.delivery_mode,'NONE',request);
  const plan = buildExecutionPlan({ request: 'Create 25 image ads and build five landing pages', tier: 'deep', host: { parallel_agents: true, max_parallel: 4 } });
  assert.equal(plan.task_type, 'mixed_visual'); assert.equal(plan.refinement.max_loops, 2); assert.equal(plan.execution.hosted, false); assert.equal(plan.retrieval.dump_entire_library_into_context, false);
  assert.equal(buildExecutionPlan({request:'Adapt landing pages to the existing Shopify store'}).landing_pages.existing_site_required,true);
});

test('frozen independent proposal receipts bind actual full text before council', async () => {
  const f = engineFixture(), document = f.events[2].document;
  const input = { ...document, team: f.team, host: f.input.host_capabilities, card: f.card };
  assert((await validateExploration(input)).ok);
  const changed = structuredClone(input); changed.proposal_contents[changed.routes.routes[0].draft_receipt.path] += ' Changed after seeing the favourite.';
  assert((await validateExploration(changed)).errors.some(error => /hash the exact/.test(error.message)));
  const leaked = structuredClone(input); leaked.routes.routes[0].draft_receipt.saw_other_proposals = true;
  assert(!(await validateExploration(leaked)).ok);
  const reused = structuredClone(input); reused.routes.routes[1].draft_receipt.context_id = reused.routes.routes[0].draft_receipt.context_id;
  assert((await validateExploration(reused)).errors.some(error => /distinct isolated/.test(error.message)));
  const sequential = structuredClone(input); sequential.host = {}; sequential.routes.routes.forEach(route => { route.draft_receipt.isolation = 'SAME_CONTEXT'; route.draft_receipt.context_id = 'one-sequential-chat'; });
  assert((await validateExploration(sequential)).ok);
});

test('varied visual batches reject style-only relabeling but allow scoped controlled tests and product groups', async () => {
  const f = engineFixture(), input = { ...f.events[2].document, team: f.team, host: f.input.host_capabilities, card: visual(f) };
  assert((await validateExploration(input)).ok);
  const duplicate = structuredClone(input); duplicate.spread.slots[1].concept = { ...duplicate.spread.slots[0].concept, visual_world: 'Claymation' };
  assert((await validateExploration(duplicate)).errors.some(error => /near-duplicate/.test(error.message)));
  const skin = structuredClone(input); skin.spread.slots[1].concept = { ...skin.spread.slots[0].concept, audience: 'New graduates', visual_world: 'Claymation' };
  assert((await validateExploration(skin)).errors.some(error => /near-duplicate/.test(error.message)));
  duplicate.card.dials.variety_mix.preset = 'focused'; assert((await validateExploration(duplicate)).ok);
  duplicate.card.dials.variety_mix.preset = 'balanced'; duplicate.card.request_verbatim = 'Create controlled variants and change headlines only'; assert((await validateExploration(duplicate)).ok);
  duplicate.card.request_verbatim = f.card.request_verbatim; duplicate.spread.slots.forEach((slot,index) => slot.product_ref = `product-${index}`); assert((await validateExploration(duplicate)).ok);
});

test('fresh production cannot hide failed or missing required checks behind a score', () => {
  const f = engineFixture(), document = structuredClone(f.production); document.artifacts[0].checks[0].status = 'FAIL';
  assert(validateProductionQuality({ document }).errors.some(error => /Required check/.test(error.message)));
  document.artifacts[0].checks[0].status = 'NOT_RUN'; assert(!validateProductionQuality({ document }).ok);
  document.artifacts[0].checks[0].required = false; assert(validateProductionQuality({ document }).ok);
});

function imageProduction() {
  const f = engineFixture(), document = structuredClone(f.production);
  document.artifacts = document.artifacts.slice(0,2).map((artifact,index) => ({ ...artifact, modality: 'image',path:`ads/image-${index}.png`, sha256: String(index+1).repeat(64) }));
  document.visual_delivery=visualDelivery(document.artifacts);
  for(const method of document.source_trace.methods)method.execution.artifacts=document.artifacts.map(artifact=>({path:artifact.path,sha256:artifact.sha256}));
  document.diversity_review = { by_seat: 's6', receipt: 'reviews/batch.md', items: document.artifacts.map((artifact,index) => ({ slot_id: artifact.slot_id, sha256: artifact.sha256, compared_with: [document.artifacts[1-index].slot_id], observed_differences: [{ axis: 'composition', observation: index ? 'The piece is worn in a portrait, with the product next to the face.' : 'The actual product is shown in a clean annotated overhead construction view.' },{ axis: 'proof', observation: index ? 'Fit is demonstrated by the model wearing the item.' : 'The material and setting are visible in the close cutaway.' }] })) };
  return { f, document, card: visual(f), team: f.team };
}

test('image variety review requires actual current-hash non-maker comparisons and rejects duplicate bytes', () => {
  const input = imageProduction(); assert(validateProductionQuality(input).ok);
  const stale = structuredClone(input); stale.document.diversity_review.items[0].sha256 = 'a'.repeat(64); assert(!validateProductionQuality(stale).ok);
  const maker = structuredClone(input); maker.document.diversity_review.by_seat = input.document.artifacts[0].maker_seat; assert(!validateProductionQuality(maker).ok);
  const duplicate = structuredClone(input); duplicate.document.artifacts[1].sha256 = duplicate.document.artifacts[0].sha256; duplicate.document.diversity_review.items[1].sha256 = duplicate.document.artifacts[1].sha256;
  assert(validateProductionQuality(duplicate).errors.some(error => /identical artifact hashes/.test(error.message)));
  const superficial = structuredClone(input); superficial.document.diversity_review.items[0].observed_differences = [{axis:'audience',observation:'Different person.'},{axis:'visual_world',observation:'Clay rather than paper.'}]; assert(!validateProductionQuality(superficial).ok);
});

test('a mixed page request cannot be satisfied by the ad image batch or a page mockup', () => {
  const input = imageProduction(); input.plan = buildExecutionPlan({request:'Create two ads and build a landing page on the existing website'});
  assert(validateProductionQuality(input).errors.some(error => /Identify the requested landing-page artifacts/.test(error.message)));
  input.document.artifacts[1].kind = 'landing-page'; input.document.landing_page_delivery = {schema:'ai-blocks-landing-page-delivery/1',mode:'DESIGN_REFERENCE',artifacts:[]};
  assert(validateProductionQuality(input).errors.some(error => /working landing page/.test(error.message)));
});

test('job-state/2 requires its policy, exposes the method plan, and freezes council originals', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  assert.equal(result.state.schema, 'ai-blocks-job-state/2'); assert(result.execution_plan); assert(result.files.some(file => file.path === 'EXECUTION-PLAN.json')); assert(jobMethod().includes('draft_receipt'));
  const forged = structuredClone(result.state); delete forged.base.quality_policy;
  await assert.rejects(async () => advanceJob({ job_id: result.job_id, state: forged, state_digest: await jobStateDigest(forged), event: 'scope', document: f.card }, f.context), /quality_policy/);
  for (const event of f.events.slice(0,3)) result = await send(result,event,f.context);
  const council = structuredClone(f.council); council.proposals[0].file = 'different/original.md';
  await assert.rejects(() => send(result,{event:'council',document:council},f.context), /exact frozen/);
});

test('legacy jobs remain replayable with an explicit reduced-assurance warning', async () => {
  const f = engineFixture(), current = await startJob(f.input, f.context), legacy = structuredClone(current.state);
  legacy.schema = 'ai-blocks-job-state/1'; delete legacy.base.quality_policy;
  const result = await advanceJob({ job_id: current.job_id, state: legacy, state_digest: await jobStateDigest(legacy), event: 'scope', document: f.card },f.context);
  assert.equal(result.phase,'STAFF'); assert(result.warnings.some(warning => /legacy job/.test(warning)));
});
