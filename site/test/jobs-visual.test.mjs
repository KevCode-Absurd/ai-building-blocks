import test from 'node:test';
import assert from 'node:assert/strict';
import {startJob,advanceJob} from '../src/jobs/engine.mjs';
import {jobMcpTools} from '../src/jobs/job-mcp.mjs';
import {engineFixture} from './fixtures/jobs/engine-fixture.mjs';
import {visualDelivery} from './fixtures/jobs/visual-delivery-fixture.mjs';
const send=(r,e,c)=>advanceJob({job_id:r.job_id,state:r.state,state_digest:r.state_digest,...e},c);
const spec={references:['brand/visual.md','reference-ads/01.png'],fonts:['Brand serif'],colors:['#123456'],logo:'brand/logo.png',formats:['editorial collage','illustrated explainer'],format_rationale:'Different composition and buyer jobs.',required_renderer:'imagegen'};
test('actual fresh image production accepts one complete inspection format and rejects ZIP or stale legacy inspection',async()=>{
 const f=engineFixture();f.input.host_capabilities.visual_renderers=['imagegen'];f.card.visual_spec=spec;
 for(const family of f.context.approaches.jobs['write-documents'].families)family.modality=['image'];
 f.card.dials.modalities.value=['image'];for(const slot of f.spread.slots)slot.modality='image';
 f.production.artifacts.forEach((artifact,index)=>{artifact.modality='image';artifact.path=`ads/image-${index}.png`;artifact.sha256=String(index+1).repeat(64);});
 for(const method of f.production.source_trace.methods)method.execution.artifacts=f.production.artifacts.map(artifact=>({path:artifact.path,sha256:artifact.sha256}));
 f.production.visual_delivery=visualDelivery(f.production.artifacts);
 let r=await startJob(f.input,f.context);for(const event of f.events.slice(0,4))r=await send(r,event,f.context);
 const missing=structuredClone(f.production);delete missing.visual_delivery;await assert.rejects(()=>send(r,{event:'produce',document:missing},f.context),/visual_review|visual_delivery/);
 const zip=structuredClone(f.production);zip.artifacts[0].path='ads/not-an-image.zip';await assert.rejects(()=>send(r,{event:'produce',document:zip},f.context),/raster image/);
 assert.equal((await send(r,{event:'produce',document:f.production},f.context)).phase,'REVIEW');
 const legacy=structuredClone(f.production),report=legacy.visual_delivery;delete legacy.visual_delivery;
 legacy.visual_review={renderer:report.renderer,receipt:report.receipt,by_seat:report.reviewer_id,items:report.items.map(({maker_id,...row})=>row)};
 assert.equal((await send(r,{event:'produce',document:legacy},f.context)).phase,'REVIEW');
 legacy.visual_review.items[0].sha256='b'.repeat(64);legacy.diversity_review={by_seat:report.reviewer_id,receipt:report.receipt,items:report.items};
 await assert.rejects(()=>send(r,{event:'produce',document:legacy},f.context),/current raster image/);
});
test('visual production requires the selected real renderer and a separate visual pass on every output',async()=>{
 const f=engineFixture();f.input.host_capabilities.visual_renderers=['imagegen'];f.card.visual_spec=spec;let r=await startJob(f.input,f.context);
 for(const e of f.events.slice(0,4))r=await send(r,e,f.context);
 const p=structuredClone(f.production);p.visual_review={renderer:'imagegen',receipt:'receipts/imagegen.json',by_seat:'s6',items:p.artifacts.map(a=>({slot_id:a.slot_id,status:'PASS',reference_comparison:'Compared the logo and type to the reference.',spec_comparison:'Composition and hierarchy match the scoped direction.'}))};
 const noReview=structuredClone(p);delete noReview.visual_review;await assert.rejects(()=>send(r,{event:'produce',document:noReview},f.context),/visual_review/);
 const failed=structuredClone(p);failed.visual_review.items[0].status='FAIL';await assert.rejects(()=>send(r,{event:'produce',document:failed},f.context),/Reject each output/);
 const maker=structuredClone(p);maker.visual_review.by_seat=p.artifacts[0].maker_seat;await assert.rejects(()=>send(r,{event:'produce',document:maker},f.context),/non-maker/);
 const wrong=structuredClone(p);wrong.visual_review.renderer='html';await assert.rejects(()=>send(r,{event:'produce',document:wrong},f.context),/visual_review/);
 assert.equal((await send(r,{event:'produce',document:p},f.context)).phase,'REVIEW');
 const noCapability=structuredClone(r.state);noCapability.base.host_capabilities.visual_renderers=[];const {jobStateDigest}=await import('../src/jobs/engine.mjs');await assert.rejects(async()=>advanceJob({job_id:r.job_id,state:noCapability,state_digest:await jobStateDigest(noCapability),event:'produce',document:p},f.context),/renderer is unavailable/);
});
test('visual specification rejects absent brand DNA and MCP accepts renderer capability declaration',async()=>{
 const f=engineFixture();f.card.visual_spec={...spec,logo:''};const r=await startJob(f.input,f.context);await assert.rejects(()=>send(r,f.events[0],f.context),/visual_spec/);
 assert(jobMcpTools.find(t=>t.name==='start_job').inputSchema.properties.host_capabilities.properties.visual_renderers);
});

test('visual landing page and image-ad jobs require a visual brief at scope',async()=>{
 const landing=engineFixture();landing.input.request='Design a landing page for the product';landing.card.request_verbatim=landing.input.request;let r=await startJob(landing.input,landing.context);await assert.rejects(()=>send(r,landing.events[0],landing.context),/visual_spec/);
 const ad=engineFixture();ad.context.approaches.jobs['make-image-ads']=structuredClone(ad.context.approaches.jobs['write-documents']);ad.input.job='make-image-ads';ad.input.job_reason='The output is image ads.';r=await startJob(ad.input,ad.context);await assert.rejects(()=>send(r,ad.events[0],ad.context),/visual_spec/);
});
