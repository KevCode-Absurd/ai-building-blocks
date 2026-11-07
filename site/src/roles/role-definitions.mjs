// AI Blocks role setups. Library instructions and credits remain in their original packages.
import {ROLE_NAMES} from './role-enrichment.mjs';
import { MEDIA_BUYER_REMIT } from './outcome-remits.mjs';
const FOCUSED_ROLES = [
  {id:'react-frontend-specialist',name:'React frontend specialist',lead:'react-and-next-js-builder',area:'engineering',resources:['react-test-writer','react-app-structure-planner','accessibility-checker','agency-engineering-code-reviewer','page-speed-fixer'],tools:['Your React project, package.json and a terminal','Your design or screenshots and a browser'],example:'Build or fix the requested React interface in my existing project. Keep its framework and design rules. Return the changed files, responsive checks, relevant tests and measured performance evidence.'},
  {id:'shopify-theme-specialist',name:'Shopify theme specialist',lead:'shopify-theme-developer',area:'commerce',resources:['shopify-theme-code-writer','liquid-snippet-writer','accessibility-checker','page-speed-fixer'],tools:['Your Shopify theme files and brand brief','Current Shopify CLI and an authorized development-store connection for preview checks'],example:'Change the requested Shopify theme sections in my theme files. Check the installed CLI and current platform requirements. Return the files and check results. Keep store upload and publishing separate from local completion.'},
  {id:'crm-records-specialist',name:'CRM records specialist',lead:'crm-hygiene-auditor',area:'sales',resources:['crm-record-filler','crm-deal-updater','deal-notes-and-crm-updater'],tools:['A scoped CRM pipeline export with its field definitions, or an authorized read connection','Source notes for any proposed field changes'],example:'Audit this pipeline export using its own column names. Return a sourced fix checklist, missing evidence and paste-ready proposals. Keep record updates separate until the exact changes and access are approved.'},
].map(role=>({...role,limits:role.id==='shopify-theme-specialist'
 ? ['Check current Shopify CLI and theme requirements before running saved commands.','Live preview and store checks need an authorized development store. Local files alone do not prove a store works.']
 : role.id==='crm-records-specialist'
 ? ['An export supports a file review. Live schema, history and saved changes require separate connection checks.','Suggested values remain proposals until the exact changes are accepted.']
 : ['Plans and code sketches do not count as implemented files or passed tests.']}));
export const FEATURED_ROLES = [
  {id:'general-coordinator',name:'General coordinator',lead:'advisory-council',area:'operations',resources:['request-acceptance-brief','request-acceptance-checker','task-rubric-drafter','parallel-work-coordinator'],tools:['The user\'s request, context and constraints','The host AI\'s actual tools and specialist agents'],example:'Clarify who the work is for and the job they need done. Agree the rubric, choose a task lead and a team, chair the council and check the final delivery.',remit:{summary:'Turn a request into a clear job, a team and a checked delivery.',inputs:['The user\'s own request','The audience, constraints and available context'],deliverables:['An agreed job brief and measurable rubric','A task lead and a team chosen for this request','A decision record and checked delivery'],fit:['You want a team chosen around the job rather than a fixed department.'],limits:['Runs in your own AI and cannot grant new tool access.','The coordinator never makes or independently judges the same work.'],capabilities:[{name:'Scope the job',description:'Clarify the user, the job to be done and the acceptance criteria.'},{name:'Choose the team',description:'Select a task lead and specialists for this request.'},{name:'Chair and check',description:'Record decisions and check the final delivery against the rubric.'}]}},
  {id:'coding-specialist',name:'Coding specialist',lead:'turn-an-idea-into-a-spec-tickets-and-tested-code',area:'engineering',resources:['screenshot-to-interface-builder','agency-engineering-frontend-developer','agency-engineering-software-architect','agency-engineering-code-reviewer','accessibility-checker','find-what-is-slow-fix-it-and-show-the-numbers'],tools:['Project files and a terminal','A browser for interface checks'],example:'Build the feature in my project. Start with a short spec, make the change, run the relevant checks and hand back the code and test results.'},
  {id:'design-specialist',name:'Design specialist',lead:'write-design-rules-check-colours-and-hand-developers-a-spec',area:'design',resources:['screenshot-to-interface-builder','agency-design-ui-designer','agency-design-ux-researcher','agency-design-ui-finish-gate-reviewer','accessibility-checker','build-and-test-a-page-on-a-clear-type-and-grid'],tools:['Design files or a rendered page','A browser for layout and accessibility checks'],example:'Turn my product brief into a clear screen design and a developer handoff. Include all states, mobile behavior and checks against the brief.'},
  {id:'executive-assistant',name:'Executive assistant',lead:'prepare-your-executive-day',area:'operations',resources:['status-report-writer','executive-work-keeper','prepare-your-weekly-executive-review','executive-meeting-brief','executive-email-draft','executive-action-register','turn-meetings-into-owned-actions'],tools:['Your notes and task list','Calendar or email access only when you choose to connect it'],example:'Prepare my day from the notes, meetings and deadlines I supply. Give me a daily brief, meeting preparation, an action list and follow-up drafts.'},
  {id:'customer-support-specialist',name:'Customer support specialist',lead:'clear-your-support-inbox-and-turn-fixes-into-help-pages',area:'support',resources:['agency-support-support-responder','customer-inbox-triage-and-reply-drafter','customer-reply-and-order-checker','angry-customer-reply-checker','define-a-customer-support-escalation-agreement','monthly-help-centre-keeper'],tools:['Redacted tickets and current support policies','Helpdesk access only when you choose to connect it'],example:'Work through the supplied support tickets. Check the policy and order facts, draft useful replies, identify escalations and prepare help-page updates.'},
  {id:'seo-specialist',name:'SEO specialist',lead:'audit-your-sites-seo-and-fix-titles-tags-and-markup-first',area:'marketing',resources:['agency-marketing-seo-specialist','monthly-store-seo-keeper','product-page-seo-builder','collection-page-seo-builder','agency-marketing-agentic-search-optimizer'],tools:['Website or page files','Search Console exports when available','A browser or crawler for live checks'],example:'Audit my website and fix the supported page and technical issues. Give me the changes, evidence, checks and a ranked follow-up list.'},
  {id:'cro-specialist',name:'CRO specialist',lead:'fix-your-landing-pages-top-problems-and-check-again',area:'marketing',resources:['landing-page-auditor','conversion-research-planner','store-page-conversion-reader','split-run-test-planner','build-a-landing-page-fix-it-and-prove-the-top-change','agency-design-persona-walkthrough'],tools:['Landing page and customer evidence','Analytics or experiment data when available','A rendered browser preview for page checks'],example:'Find the strongest supported problems on my landing page. Prepare the changes and an experiment plan. Separate customer evidence from assumptions.'},
  {id:'media-buyer',name:'Media buyer',remit:MEDIA_BUYER_REMIT,lead:'agency-paid-media-paid-social-strategist',area:'marketing',resources:['meta-results-review-agent','ad-sales-drop-analyst','agency-paid-media-auditor','ad-test-sprint-runner','ad-fatigue-watcher','agency-paid-media-tracking-specialist','ad-test-budget-calculator','ad-test-brief-writer','creative-test-reader'],tools:['Ad account exports and business facts','An authorized ad-platform read connection or export; matching write authority only for approved business changes'],example:'Review my ad results and business limits. Prepare a campaign plan, creative briefs, budget proposals and a clear test and reporting plan.'},
 ...FOCUSED_ROLES,
];
export const ROLE_AREAS = [
 {id:'all',name:'All roles'}, {id:'engineering',name:'Coding & engineering'}, {id:'design',name:'Design & creative'},
 {id:'marketing',name:'Marketing & growth'}, {id:'operations',name:'Operations & admin'}, {id:'support',name:'Customer support'},
 {id:'sales',name:'Sales & partnerships'}, {id:'product',name:'Product & projects'}, {id:'data',name:'Data & research'},
 {id:'finance',name:'Finance & accounting'}, {id:'people',name:'People & training'}, {id:'security',name:'Security & compliance'},
 {id:'commerce',name:'Commerce & supply'}, {id:'specialist',name:'Other specialists'},
];
function areaOf(b) {
 const s=b.slug, t=b.task;
 if(/security|privacy|legal|compliance|identity/.test(s))return 'security';
 if(/finance|financial|tax|bookkeep|accounts-payable|billing|loan-officer/.test(s))return 'finance';
 if(/customer|support-responder|hospitality|retail-customer/.test(s))return 'support';
 if(/marketing|paid-media/.test(s))return 'marketing';
 if(/sales-/.test(s))return 'sales';
 if(/design-|game-|unity-|unreal-|godot-|roblox-|technical-artist|blender|xr-|spatial-metal/.test(s))return 'design';
 if(/hr-|training|recruitment|study-abroad|personal-growth|resume|organizational/.test(s))return 'people';
 if(/product-|project-|change-management/.test(s))return 'product';
 if(/gis-|academic-|research|data-|statistic/.test(s)||t==='analyse-data')return 'data';
 if(/engineering-|lsp-|terminal-|mcp-builder/.test(s))return 'engineering';
 if(/commerce|supply-chain|retail/.test(s))return 'commerce';
 if(/operations|chief-of-staff|executive|document|report-distribution|zk-steward/.test(s))return 'operations';
 const tasks={engineering:['build-software','build-websites','test-and-fix-code','ship-and-host','engineer-systems','manage-it','connect-tools','make-skills'],design:['design-work','make-images','make-image-ads','product-photos','work-with-audio'],marketing:['write-ad-copy','make-video-ads','plan-ad-tests','check-ads','read-ad-results','audit-landing-page','write-landing-page','understand-customers','brand-file','study-competitors','make-offer','grow-social','get-found-in-search','write-emails','run-google-ads','launch-and-scale-ads','keep-customers'],finance:['money-and-investing','manage-accounting','plan-budgets-and-cash','manage-tax','raise-funding','manage-personal-finances','set-prices'],operations:['organise-work','work-with-files','document-work'],support:['help-customers'],sales:['sell-and-negotiate','speak-and-persuade'],product:['build-product','test-an-idea','manage-projects','plan-strategy'],data:['analyse-data','track-numbers','research-topics','think-and-decide'],people:['teach-and-train','study-and-practice','hire-people','lead-people','find-a-job'],security:['secure-code','check-contracts','protect-your-store'],commerce:['run-your-store','plan-supply-chain','find-products','set-up-store','sell-on-amazon','speed-up-store','test-store-changes']};
 return Object.entries(tasks).find(([,ids])=>ids.includes(t))?.[0]??'specialist';
}
export function roleSeeds(blocks) {
 const featured=FEATURED_ROLES.filter(r=>blocks.some(b=>b.slug===r.lead)).map(r=>({...r,featured:true}));
 const leads=new Set(featured.map(r=>r.lead));
 const ids=new Set(featured.map(r=>r.id)), names=new Set(featured.map(r=>r.name.toLowerCase()));
 const short=s=>{if(s.length<=65)return s;let hash=2166136261;for(const ch of s)hash=Math.imul(hash^ch.charCodeAt(0),16777619);return s.slice(0,55).replace(/-$/,'')+'-'+(hash>>>0).toString(16).padStart(8,'0');};
 const rest=blocks.filter(b=>(['agent','workflow','routine'].includes(b.type)||b.category==='orchestrator')&&!leads.has(b.slug)).map(b=>{
  let id=short(b.slug.replace(/^agency-/,''));if(ids.has(id))id=short(`${b.type==='agent'?'agent':'task'}-${b.slug}`);if(ids.has(id))throw Error('Role id collision: '+b.slug);ids.add(id);
  let name=(ROLE_NAMES[b.slug]??b.name).replace(/ agent\b/gi,'').replace(/\s+/g,' ').trim();if(names.has(name.toLowerCase()))name=b.name;if(names.has(name.toLowerCase()))name=`${b.name} (${b.type==='agent'?'agent':'workflow'})`;names.add(name.toLowerCase());
  return {id,name,lead:b.slug,area:areaOf(b),resources:[],tools:[],featured:false};
 });
 return [...featured,...rest];
}
/** Add team references without changing the compact pack's resources. Facets
 * come from authored family mappings and the existing lead's declared role. */
export function roleTeamFacets({profile,lead,approaches={jobs:{}},manifest={resources:{}},blocks=[]}) {
 const resources=profile.resources??[],core=resources.map(resource=>({slug:resource.slug,revision_sha256:resource.revision}));
 const owned=new Set(resources.filter(resource=>!resource.onboarding&&!resource.reviewer).map(resource=>resource.slug));
 const matches=Object.entries(approaches.jobs??{}).flatMap(([job,value])=>(value.families??[]).filter(family=>(family.lead_roles??[]).includes(profile.id)||(family.items??[]).some(slug=>owned.has(slug))).map(family=>({job,family})));
 const department=profile.area??'specialist',families=[...new Set(matches.map(({family})=>family.id))].sort();
 // blocks.json omits the default `make` role to keep its wire format small.
 const declared=lead.role??'make';
 const suitability=declared==='check'?['critic','red_team','fact_checker','judge']:declared==='orchestrate'||lead.category==='orchestrator'?['coordinator','strategist']:['make','render'].includes(declared)?['maker',...(['workflow','agent','routine'].includes(lead.type)?['strategist']:[])]:['strategist'];
 const bySlug=new Map(blocks.map(block=>[block.slug,block]));
 const methodRoles=resources.filter(resource=>!resource.onboarding&&!resource.reviewer).flatMap(resource=>bySlug.has(resource.slug)?[bySlug.get(resource.slug).role??'make']:[]);
 if(profile.id!=='general-coordinator') {
  if((declared!=='check'&&['workflow','agent','routine'].includes(lead.type))||methodRoles.some(role=>role==='make'||role==='render'))suitability.push('maker');
  if(methodRoles.includes('check'))suitability.push('critic','red_team','fact_checker','judge');
  if(methodRoles.includes('orchestrate'))suitability.push('strategist');
 }
 const defaultLenses=declared==='check'?['sceptic','craft']:declared==='orchestrate'||lead.category==='orchestrator'?['operator']:['craft'];
 const lenses=[...new Set(defaultLenses.concat(matches.flatMap(({family})=>family.lenses??[])))].sort();
 const all=[...new Set(core.map(row=>row.slug).concat(matches.flatMap(({family})=>['items','pickers','checks','tool_guides','supporting_items'].flatMap(field=>family[field]??[]))))].sort();
 const extended=all.flatMap(slug=>{
  const revision=manifest.resources?.[slug]?.revision_sha256??resources.find(row=>row.slug===slug)?.revision;
  return revision?[{slug,revision_sha256:revision,families:matches.filter(({family})=>['items','pickers','checks','tool_guides','supporting_items'].some(field=>(family[field]??[]).includes(slug))).map(({family})=>family.id),kind:bySlug.get(slug)?.type??'skill'}]:[];
 });
 return {job:lead.task,department,families,lenses,seat_suitability:[...new Set(suitability)],core,extended,palette_status:families.length?'SOURCE_MAPPED':'NEEDS_APPROACH_MAPPING'};
}
// An agency agent and the role built on it are one job on two pages (/agents/agency-x and /roles/x). The role page
// is the fuller one, so the agent page names it as its canonical address and stays out of the sitemap.
export function sameJobAgentPages(seeds, blocks, hasPage = b => b.headline !== '') {
 const bySlug = new Map(blocks.map(b => [b.slug, b]));
 return new Map(seeds.filter(r => /^agency-/.test(r.lead) && r.id === r.lead.slice(7) && bySlug.get(r.lead)?.type === 'agent' && hasPage(bySlug.get(r.lead)))
  .map(r => [`/agents/${r.lead}`, `/roles/${r.id}`]));
}
