import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLandingPageDelivery, LANDING_PAGE_CHECKS, LANDING_PAGE_DELIVERY_SCHEMA} from '../src/jobs/landing-page-delivery.mjs';
import {checkJobSchema} from '../src/jobs/contracts.mjs';

const sha = 'a'.repeat(64), oldSha = 'b'.repeat(64);
const expected = [{slot_id:'page-1',path:'pages/product-source.zip',sha256:sha,modality:'interactive'}];
const fixture = () => ({
  schema:'ai-blocks-landing-page-delivery/1',mode:'LAUNCHABLE_SITE',
  artifacts:[{
    slot_id:'page-1',
    source:{path:'pages/product-source.zip',sha256:sha,entrypoint:'src/pages/product.tsx',build_command:'npm run build',preview_command:'npm run preview'},
    existing_site:{status:'ADAPTED',url:'https://example.test',evidence:'receipts/existing-site.json',rationale:'Keep the current navigation, type and product controls; adapt the campaign content.',integration_target:'src/pages/product.tsx',reused_components:['SiteHeader','ProductPicker','brand.css']},
    brand:{brain_ref:'brand/00-start-here.md',font_refs:['brand/fonts.css'],asset_refs:['brand/logo.svg','assets/product.jpg'],evidence:'receipts/brand-comparison.json'},
    checks:[...LANDING_PAGE_CHECKS.map(id=>({id,status:'PASS',source_sha256:sha,receipt:`receipts/${id}.json`,observed:`Observed ${id} on the current build.`,...(id==='responsive'?{viewport:{width:390,height:844}}:{})})),{id:'responsive',status:'PASS',source_sha256:sha,receipt:'receipts/desktop.json',observed:'No horizontal overflow or overlapping controls at desktop width.',viewport:{width:1440,height:900}}],
    limitations:[],
  }],
});

test('launchable page needs current editable source and per-behaviour receipts',()=>{
  const report=fixture();
  assert.deepEqual(checkJobSchema(LANDING_PAGE_DELIVERY_SCHEMA,report),[]);
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,true);
  for(const id of LANDING_PAGE_CHECKS){
    const bad=fixture();bad.artifacts[0].checks=bad.artifacts[0].checks.filter(check=>check.id!==id);
    const result=validateLandingPageDelivery(bad,{artifacts:expected});
    assert.equal(result.ok,false,id);assert(result.missing_evidence.includes(id),id);
  }
});

test('a design image or a fake image entrypoint cannot satisfy a working page request',()=>{
  assert.equal(validateLandingPageDelivery({schema:'ai-blocks-landing-page-delivery/1',mode:'DESIGN_REFERENCE',artifacts:[]}).ok,false);
  assert.equal(validateLandingPageDelivery({schema:'ai-blocks-landing-page-delivery/1',mode:'DESIGN_REFERENCE',artifacts:[]},{requireLaunchable:false}).ok,true);
  const report=fixture();report.artifacts[0].source.entrypoint='final/landing-page.png';
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);
  report.artifacts[0].source.entrypoint='index.html';
  assert.equal(validateLandingPageDelivery(report,{artifacts:[{...expected[0],modality:'image'}]}).ok,false);
  report.artifacts[0].source.path='final/page.png';
  assert.equal(validateLandingPageDelivery(report,{artifacts:[{...expected[0],path:'final/page.png'}]}).ok,false);
});

test('stale builds, untested primary actions and bare PASS labels are rejected',()=>{
  for(const mutate of [
    r=>{r.artifacts[0].checks[0].source_sha256=oldSha;},
    r=>{r.artifacts[0].source.sha256=oldSha;},
    r=>{r.artifacts[0].checks.find(c=>c.id==='primary_action').status='NOT_RUN';},
    r=>{r.artifacts[0].checks[0].receipt='';},
    r=>{r.artifacts[0].checks[0].observed='';},
  ]){const report=fixture();mutate(report);assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);}
});

test('evidence covers every expected page and both phone and desktop widths',()=>{
  const report=fixture();
  assert.equal(validateLandingPageDelivery(report,{artifacts:[...expected,{...expected[0],slot_id:'page-2'}]}).ok,false);
  report.artifacts[0].checks=report.artifacts[0].checks.filter(check=>check.viewport?.width!==1440);
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);
  report.artifacts.push(structuredClone(report.artifacts[0]));
  assert(validateLandingPageDelivery(report,{artifacts:expected}).errors.some(e=>/exactly once/.test(e.message)));
});

test('existing site reuse and actual brand sources are required, with explicit greenfield exception',()=>{
  const report=fixture();report.artifacts[0].existing_site.reused_components=[];
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);
  report.artifacts[0].existing_site={status:'GREENFIELD',evidence:'The user explicitly requested a new standalone site.',rationale:'No existing website is being replaced.',integration_target:'Standalone static site',reused_components:[]};
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,true);
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected,existingSiteRequired:true}).ok,false);
  report.artifacts[0].brand.font_refs=[];
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);
});

test('unsafe source paths and unresolved launch blockers fail closed',()=>{
  for(const entrypoint of ['../index.html','C:/private/index.html','/index.html','pages\\index.html']){
    const report=fixture();report.artifacts[0].source.entrypoint=entrypoint;
    assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);
  }
  const report=fixture();report.artifacts[0].limitations=['The form endpoint has not been connected.'];
  assert.equal(validateLandingPageDelivery(report,{artifacts:expected}).ok,false);
  assert.equal(validateLandingPageDelivery(null).ok,false);
});
