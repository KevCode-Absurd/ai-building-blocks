import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import {proposeTeam} from '../src/jobs/propose-team.mjs';

const sha='d'.repeat(64);
function context(){
 const roster=[['general-coordinator','coordinator'],['ad-landing-page','maker'],['engineering-frontend-developer','maker'],['react-frontend-specialist','maker'],['shopify-theme-specialist','maker'],['skeptic','red_team'],['facts','fact_checker'],['reviewer','judge'],['brand','critic']];
 const roles=roster.map(([id,type])=>({id,name:id,summary:id,department:type==='maker'?'design':'operations',seat_suitability:[type,...(type==='maker'?['strategist']:[])],lenses:[id],deliverables:['Landing pages'],resources:[]}));
 const built={id:'built-experiences',name:'Built pages',what_it_looks_like:'Editable website source',items:['static-html-landing-page-builder','react-landing-page-builder','shopify-landing-page-builder'],pickers:[],checks:[],supporting_items:['landing-page-design-planner'],modality:['interactive'],tools_needed:['code','browser']};
 const copy={id:'copy',name:'Copy',what_it_looks_like:'Page argument',items:['ad-matched-landing-page-writer'],modality:['text'],tools_needed:[]};
 const slugs=[...built.items,...built.supporting_items,...copy.items];
 return{roles:{roles},items:slugs.map(slug=>({slug,type:'skill',revision_sha256:sha})),approaches:{jobs:{'write-landing-page':{families:[copy,built]},'make-image-ads':{families:[]}},revisions:Object.fromEntries(slugs.map(slug=>[slug,sha]))}};
}
test('working pages staff a design lead and compatible implementer with real builders',()=>{
 const c=context();
 for(const [task,builder] of [['Build a landing page for our current website','engineering-frontend-developer'],['Build a Shopify landing page','shopify-theme-specialist'],['Build a React landing page','react-frontend-specialist']]){
  const p=proposeTeam({task,job:'write-landing-page',host_capabilities:{tools:['code','browser']}},c);
  assert.equal(p.ok,true);const makers=p.seats.filter(s=>s.seat_type==='maker');
  assert(makers.some(s=>s.role_id===builder),task);
  assert.equal(p.seats.find(s=>s.seat_id===p.lead_seat_id).role_id,'ad-landing-page');
  assert(makers.every(s=>s.toolbox.some(m=>m.slug==='static-html-landing-page-builder')));
  assert.equal(p.landing_page_execution.delivery_mode,'LAUNCHABLE_SITE');
 }
});
test('a mixed creative job keeps the working-page implementation pipeline',()=>{
 const p=proposeTeam({task:'Create 25 image ads and five landing pages',job:'make-image-ads'},context());
 assert(p.seats.some(s=>s.role_id==='engineering-frontend-developer'&&s.families.includes('built-experiences')));
 assert(p.seats.filter(s=>s.seat_type==='maker').some(s=>s.unavailable_tools.includes('browser')));
 const mockup=proposeTeam({task:'Create image-only landing page mockups',job:'write-landing-page'},context());
 assert.equal(mockup.landing_page_execution,undefined);
});
test('published family distinguishes source builders from design planners',()=>{
 const source=YAML.parse(fs.readFileSync(new URL('../../catalogue-items/_approaches.yaml',import.meta.url),'utf8'));
 const family=source.jobs['write-landing-page'].families.find(f=>f.id==='built-experiences');
 assert.deepEqual(family.modality,['interactive']);assert(family.tools_needed.includes('code'));assert(family.tools_needed.includes('browser'));
 assert(!family.items.includes('landing-page-design-planner'));assert(family.supporting_items.includes('landing-page-design-planner'));
 assert(family.checks.includes('accessibility-checker'));
});
