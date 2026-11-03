// Specialist pages in plain words: one "Hire" heading that keeps acronyms, an opening with what you give, what you
// get and an example, trade terms explained, rule-written summaries at grade 8 or lower, and pages people can reach.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {grade} from '../../tools/readability.mjs';
import {roleHeading,sentenceName,termsIn,roleOpening,startsWithOrder} from '../src/roles/role-copy.mjs';
import {plainSummary,plainList,plainSwap,PLAIN_GRADE} from '../src/roles/role-enrichment.mjs';
import {roleSeeds,sameJobAgentPages} from '../src/roles/role-definitions.mjs';
import {roleLinks} from '../scripts/build-roles.mjs';
import {rolePage} from '../scripts/lib/role-pages.mjs';
import {specialistsSection,hubSpecialists} from '../scripts/lib/role-links.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/data/'+p,import.meta.url)));
const index=read('roles-index.json'),roles=index.roles.map(r=>read('roles/'+r.id+'.json')),byId=new Map(roles.map(r=>[r.id,r]));
const blocks=read('blocks.json').blocks;

// Roles whose summary or "what you get" still reads above grade 8 after every rule. The rules pick from the role's
// own page text and never write copy by hand, so a few stay over; these numbers may only go down.
const MAX_SUMMARIES_OVER=26,MAX_GETS_OVER=20;

test('the heading keeps acronyms and product names and uses the one verb, Hire',()=>{
 assert.equal(roleHeading('SEO specialist'),'Hire an AI SEO specialist');
 assert.equal(roleHeading('CRO specialist'),'Hire an AI CRO specialist');
 assert.equal(roleHeading('Executive assistant'),'Hire an AI executive assistant');
 assert.equal(roleHeading('Shopify theme specialist'),'Hire an AI Shopify theme specialist');
 assert.equal(roleHeading('TikTok strategist'),'Hire an AI TikTok strategist');
 assert.equal(roleHeading('AI engineer'),'Hire an AI engineer');
 assert.equal(sentenceName('Follow-up planner'),'follow-up planner');
 assert.equal(sentenceName('API-to-MCP converter'),'API-to-MCP converter');
 assert.equal(sentenceName('90-day marketing strategy planner'),'90-day marketing strategy planner');
 assert.equal(sentenceName('me.md setup guide'),'me.md setup guide');
 // Products, platforms, places and languages that open a role name stay capitalised; ordinary words do not.
 const named=new Set();for(const b of blocks)for(const w of String(b.name).split(/\s+/).slice(1))if(/^[A-Z][a-z]+$/.test(w))named.add(w);
 const kept=['Shopify','Meta','Google','Amazon','Unity','Unreal','Excel','Godot','Roblox','Azure','Instagram','Reddit','Salesforce','Jira','Blender','Chinese','French','Korean','English','China','Drupal','Oracle','Qdrant','Vercel','React'];
 for(const w of kept)assert.equal(sentenceName(w+' planner'),w+' planner',w);
 for(const r of roles){const first=r.name.split(' ')[0];if(kept.includes(first))assert(roleHeading(r.name).includes(first),r.id);}
 assert.equal(sentenceName('Customer support specialist'),'customer support specialist');assert(named.size>0);
 for(const r of roles){const h=roleHeading(r.name);for(const w of r.name.split(/\s+/))if(/[A-Z].*[A-Z]/.test(w))assert(h.includes(w),`${r.id}: ${h}`);assert(!/Set up/.test(h));}
});

test('trade terms are found and explained the first time they appear',()=>{
 const t=termsIn(['My Meta ads CPA doubled','ROAS fell and the CPA rose','We track KPIs in a CRM']);
 assert.deepEqual(t.map(x=>x.term),['CPA','ROAS','KPI','CRM']);
 assert(t.every(x=>x.meaning&&!/[A-Z]{3}/.test(x.meaning.replace(/Google Analytics/,''))));
 assert.equal(termsIn(['SEOs, no','A/B test it']).map(x=>x.term).join(),'SEO,A/B test');
 const media=roleOpening(byId.get('media-buyer'));assert(['CPA','ROAS'].every(term=>media.terms.some(x=>x.term===term)),'The media buyer explains CPA and ROAS.');
 assert(roleOpening(byId.get('seo-specialist')).terms.some(x=>x.term==='SEO'));
});

test('summaries and the opening lists are chosen by rule to read at grade 8 or lower',()=>{
 const g=s=>grade(s);
 // The role's own words win when they are plain; otherwise its "give it, you get" sentences do.
 assert.equal(plainSummary({summary:'Check a story for myths. Get a short report.',subhead:'',inputs:[],deliverables:[]},g),'Check a story for myths. Get a short report.');
 const hard='Investigate paid-media performance from checked platform and business evidence, with comparable trends.';
 const easy=plainSummary({summary:hard,subhead:'Give it your ad results. It looks for what changed. You get a short list of fixes.',inputs:[],deliverables:[]},g);
 assert.equal(easy,'Give it your ad results. You get a short list of fixes.');
 assert(startsWithOrder('State the facts')&&!startsWithOrder('Your site address'));
 assert.deepEqual(plainList(['DISRUPTION: the facts you have','A list of fixes'],3,g),['The facts you have','A list of fixes']);
 const summariesOver=roles.filter(r=>grade(r.summary)>PLAIN_GRADE),getsOver=roles.filter(r=>grade(r.opening.get.join('\n'))>PLAIN_GRADE);
 assert(summariesOver.length<=MAX_SUMMARIES_OVER,`${summariesOver.length} summaries above grade ${PLAIN_GRADE}: ${summariesOver.map(r=>r.id).join(', ')}`);
 assert(getsOver.length<=MAX_GETS_OVER,`${getsOver.length} "what you get" lists above grade ${PLAIN_GRADE}: ${getsOver.map(r=>r.id).join(', ')}`);
 for(const r of roles){assert(r.opening.get.length>=1&&r.opening.get.length<=4&&r.opening.give.length<=3,r.id);for(const x of r.opening.get)assert(r.deliverables.some(d=>plainSwap(d).toLowerCase().includes(x.slice(0,20).toLowerCase())),`${r.id}: ${x}`);}
 const index2=new Map(index.roles.map(r=>[r.id,r]));for(const r of roles)assert.equal(index2.get(r.id).summary,r.summary,r.id);
});

test('each role page opens in plain words, keeps the rest under Details and has its own description',()=>{
 const descs=new Set();
 for(const r of roles){
  const p=rolePage('/roles/'+r.id,index,id=>byId.get(id));
  assert.equal(p.h1,roleHeading(r.name),r.id);assert(p.content.includes(`<h1 id="role-heading">${p.h1.replace(/&/g,'&amp;')}</h1>`),r.id);
  const open=p.content.slice(0,p.content.indexOf('<details id="details">'));
  assert(open.includes('<h2>What you give</h2>')&&open.includes('<h2>What you get</h2>'),r.id);
  for(const hidden of ['<h3>Capabilities</h3>','<h3>Functions and deliverables</h3>','SOUL.md','HANDOFF.md'])assert(!open.includes(hidden)&&p.content.includes(hidden),`${r.id}: ${hidden}`);
  assert(!/^Download a base/.test(p.desc)&&p.desc.startsWith(roleHeading(r.name)),r.id);assert(!descs.has(p.desc),r.id);descs.add(p.desc);
  for(const x of r.related??[])assert(byId.has(x.id)&&x.id!==r.id,r.id);
 }
 assert(roles.filter(r=>r.related?.length).length/roles.length>0.98,'Almost every role names related specialists.');
 const list=rolePage('/roles',index,()=>null);assert(!/Set up/.test(list.content+list.desc));
});

test('every role is reachable from the item it is built on, and same-job agent pages point at the role',()=>{
 const links=roleLinks(roles);
 for(const r of roles)assert.equal(links[r.lead]?.[0]?.[0],r.id,`${r.id} is the first specialist on ${r.lead}`);
 assert(Object.values(links).every(rows=>rows.length>=1&&rows.length<=3));
 assert(specialistsSection(links['seo-audit']??links[roles[0].lead]).includes('Specialists who do this'));
 assert.equal(specialistsSection([]),'');
 assert(hubSpecialists(index,byId.get('seo-specialist').family.id).includes('href="/roles/'));
 const pairs=sameJobAgentPages(roleSeeds(blocks),blocks);
 assert.equal(pairs.size,282);
 for(const [agent,role] of pairs){assert.match(agent,/^\/agents\/agency-/);assert(byId.has(role.slice(7)),role);assert.equal(byId.get(role.slice(7)).lead,agent.slice(8));}
});

test('the llms files list every specialist and count them',()=>{
 const txt=fs.readFileSync(new URL('../public/llms/specialists.txt',import.meta.url),'utf8'),llms=fs.readFileSync(new URL('../public/llms.txt',import.meta.url),'utf8');
 for(const r of roles)assert(txt.includes(`(https://useaiblocks.com/roles/${r.id}):`),r.id);
 assert(llms.includes(`${roles.length} specialists`)&&llms.includes('/llms/specialists.txt'));
 const agents=fs.readFileSync(new URL('../public/sitemap-agents.xml',import.meta.url),'utf8');
 assert(!agents.includes('/agents/agency-academic-historian<'),'Same-job agent pages stay out of the agents sitemap.');
});
