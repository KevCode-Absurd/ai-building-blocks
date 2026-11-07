import test from 'node:test';
import assert from 'node:assert/strict';
import {roleTeamFacets} from '../src/roles/role-definitions.mjs';
const revision='a'.repeat(64);
const profile={id:'test-maker',area:'design',resources:[{slug:'maker-a',revision},{slug:'context',revision,onboarding:true}]};
const approaches={jobs:{'make-images':{families:[{id:'clay',items:['maker-a','maker-b'],pickers:['picker'],checks:['checker'],tool_guides:['guide'],lenses:['craft','customer']}]}}};
const manifest={resources:Object.fromEntries(['maker-a','maker-b','context','picker','checker','guide'].map(slug=>[slug,{revision_sha256:revision}]))};
test('full palettes refer to every family layer without changing compact resources',()=>{
 const before=structuredClone(profile),facets=roleTeamFacets({profile,lead:{task:'make-images',role:'make',type:'workflow'},approaches,manifest});
 assert.deepEqual(profile,before);assert.equal(facets.core.length,2);assert.equal(facets.extended.length,6);assert.deepEqual(facets.families,['clay']);assert(facets.lenses.includes('customer'));assert.deepEqual(facets.seat_suitability,['maker','strategist']);assert(facets.extended.every(row=>row.revision_sha256===revision));
});
test('check leads become independent critic seats and missing family maps remain visible',()=>{
 const facets=roleTeamFacets({profile,lead:{task:'make-images',role:'check',type:'agent'}});assert.deepEqual(facets.seat_suitability,['critic','red_team','fact_checker','judge']);assert.equal(facets.palette_status,'NEEDS_APPROACH_MAPPING');assert.equal(facets.department,'design');
});
test('unavailable guides are not assigned invented revision hashes',()=>{
 const facets=roleTeamFacets({profile,lead:{role:'make'},approaches,manifest:{resources:{}}});assert(facets.extended.every(row=>['maker-a','context'].includes(row.slug)));
});
test('wire-format default make roles and source-backed checks stay available',()=>{
 const facets=roleTeamFacets({profile,lead:{task:'make-images',type:'agent'},blocks:[{slug:'maker-a',type:'skill'},{slug:'context',role:'check'}]});
 assert(facets.seat_suitability.includes('maker'));assert(!facets.seat_suitability.includes('judge'),'onboarding is not review expertise');
 const reviewed=roleTeamFacets({profile:{...profile,resources:[...profile.resources,{slug:'actual-check',revision}]},lead:{role:'orchestrate',type:'workflow'},blocks:[{slug:'maker-a'},{slug:'actual-check',role:'check'}]});
 for(const type of ['maker','strategist','critic','red_team','fact_checker','judge'])assert(reviewed.seat_suitability.includes(type),type);
 const general=roleTeamFacets({profile:{...profile,id:'general-coordinator'},lead:{role:'orchestrate'},blocks:[{slug:'maker-a',role:'check'}]});
 assert.deepEqual(general.seat_suitability,['coordinator','strategist']);
});
