// AI Blocks role setups. Library instructions and credits remain in their original packages.
export const FEATURED_ROLES = [
  {id:'coding-specialist',name:'Coding specialist',lead:'turn-an-idea-into-a-spec-tickets-and-tested-code',area:'engineering',resources:['agency-engineering-frontend-developer','agency-engineering-software-architect','agency-engineering-code-reviewer','accessibility-checker','find-what-is-slow-fix-it-and-show-the-numbers'],tools:['Project files and a terminal','A browser for interface checks'],example:'Build the feature in my project. Start with a short spec, make the change, run the relevant checks and hand back the code and test results.'},
  {id:'design-specialist',name:'Design specialist',lead:'write-design-rules-check-colours-and-hand-developers-a-spec',area:'design',resources:['agency-design-ui-designer','agency-design-ux-researcher','agency-design-ui-finish-gate-reviewer','accessibility-checker','build-and-test-a-page-on-a-clear-type-and-grid'],tools:['Design files or a rendered page','A browser for layout and accessibility checks'],example:'Turn my product brief into a clear screen design and a developer handoff. Include all states, mobile behavior and checks against the brief.'},
  {id:'executive-assistant',name:'Executive assistant',lead:'prepare-your-executive-day',area:'operations',resources:['executive-work-keeper','prepare-your-weekly-executive-review','executive-meeting-brief','executive-email-draft','executive-action-register','turn-meetings-into-owned-actions'],tools:['Your notes and task list','Calendar or email access only when you choose to connect it'],example:'Prepare my day from the notes, meetings and deadlines I supply. Give me a daily brief, meeting preparation, an action list and follow-up drafts.'},
  {id:'customer-support-specialist',name:'Customer support specialist',lead:'clear-your-support-inbox-and-turn-fixes-into-help-pages',area:'support',resources:['agency-support-support-responder','customer-inbox-triage-and-reply-drafter','customer-reply-and-order-checker','angry-customer-reply-checker','define-a-customer-support-escalation-agreement','monthly-help-centre-keeper'],tools:['Redacted tickets and current support policies','Helpdesk access only when you choose to connect it'],example:'Work through the supplied support tickets. Check the policy and order facts, draft useful replies, identify escalations and prepare help-page updates.'},
  {id:'seo-specialist',name:'SEO specialist',lead:'audit-your-sites-seo-and-fix-titles-tags-and-markup-first',area:'marketing',resources:['agency-marketing-seo-specialist','monthly-store-seo-keeper','product-page-seo-builder','collection-page-seo-builder','agency-marketing-agentic-search-optimizer'],tools:['Website or page files','Search Console exports when available','A browser or crawler for live checks'],example:'Audit my website and fix the supported page and technical issues. Give me the changes, evidence, checks and a ranked follow-up list.'},
  {id:'cro-specialist',name:'CRO specialist',lead:'fix-your-landing-pages-top-problems-and-check-again',area:'marketing',resources:['landing-page-auditor','conversion-research-planner','store-page-conversion-reader','split-run-test-planner','build-a-landing-page-fix-it-and-prove-the-top-change','agency-design-persona-walkthrough'],tools:['Landing page and customer evidence','Analytics or experiment data when available','A rendered browser preview for page checks'],example:'Find the strongest supported problems on my landing page. Prepare the changes and an experiment plan. Separate customer evidence from assumptions.'},
  {id:'media-buyer',name:'Media buyer',lead:'agency-paid-media-paid-social-strategist',area:'marketing',resources:['agency-paid-media-auditor','ad-test-sprint-runner','ad-fatigue-watcher','agency-paid-media-tracking-specialist','ad-test-budget-calculator','ad-test-brief-writer','creative-test-reader'],tools:['Ad account exports and business facts','An ad-platform connection only for authorized live work'],example:'Review my ad results and business limits. Prepare a campaign plan, creative briefs, budget proposals and a clear test and reporting plan.'},
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
  let name=b.name.replace(/ agent\b/gi,'').replace(/\s+/g,' ').trim();if(names.has(name.toLowerCase()))name=b.name;if(names.has(name.toLowerCase()))name=`${b.name} (${b.type==='agent'?'agent':'workflow'})`;names.add(name.toLowerCase());
  return {id,name,lead:b.slug,area:areaOf(b),resources:[],tools:[],featured:false};
 });
 return [...featured,...rest];
}
