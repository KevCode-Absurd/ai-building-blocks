// Deterministic candidate retrieval; the host AI checks the full remit against private context.
import {WORD_ALIASES} from '../lib/library-search-language.ts';
import {SPECIALIST_REQUEST} from '../lib/catalogue-audience.mjs';
const STOP=new Set('a an the i my our your we you please need want help me with for to of in on and or as at by from it this that some task specialist role ai can do use using have would like get more how what should much many is are not too'.split(' '));
const aliases={
 'react-frontend-specialist':'react nextjs next frontend typescript javascript component components hooks testing',
 'shopify-theme-specialist':'shopify theme liquid section sections snippet templates storefront',
 'crm-records-specialist':'crm salesforce hubspot opportunity opportunities pipeline hygiene records fields',
 'coding-specialist':'code coding software engineering developer develop build implement implementation repository repo bug debugging testing deploy deployment api integration database script',
 'design-specialist':'design designer ui ux interface layout visual accessibility prototype figma',
 'executive-assistant':'executive assistant calendar schedule meetings inbox email admin administration day daily preparation',
 'customer-support-specialist':'customer support helpdesk tickets replies refunds escalation service',
 'seo-specialist':'seo search engine optimisation optimization organic metadata sitemap indexing crawl technical',
 'cro-specialist':'cro conversion landing page experiment testing analytics customer evidence',
 'media-buyer':'media buyer meta facebook instagram google ads advertising campaign paid social budget creative roas',
};
const stem=w=>w.replace(/(?:ing|ers|er|ed|s)$/,'');
const words=s=>[...new Set((s.toLowerCase().match(/[a-z0-9]+/g)??[]).filter(w=>w.length>1&&!STOP.has(w)).map(stem))];
// Everyday words people use for the same job. Each query word also matches its synonyms at a
// lower weight, so "translate" finds translation roles and "GA4" finds tracking roles. Keys are stems.
const SYNONYMS={
 translate:'translation localization localisation language',translation:'translate localization localisation language',locali:'translation localization language',
 hire:'hiring recruit recruiter recruitment interview candidate',hir:'hire recruit recruiter recruitment interview candidate',recruit:'hire hiring recruiter recruitment interview candidate',
 contract:'clause legal agreement terms',agreement:'contract clause legal terms',nda:'contract confidentiality legal clause',employment:'employee staff job',
 ga4:'analytics tracking tag event google',analytic:'tracking event tag measurement',track:'analytics event tag measurement',pixel:'tracking conversion event tag',
 bookkeep:'accounting ledger reconciliation',reconcile:'reconciliation ledger bank bookkeeping',invoice:'billing accounts payable receivable',
 cold:'outreach prospect',outreach:'prospect cold sales',newsletter:'email',
 launch:'release go market',onboard:'onboarding',churn:'retention cancel',refund:'returns support',
 proofread:'proof editor edit grammar copyedit',edit:'editor proofread',logo:'brand identity design',copy:'copywriting copywriter',ux:'usability user experience',ui:'interface design',
};
// Words that place a job in an area; matching roles there rank higher and others lower.
const AREA_INTENTS=[
 ['people',/\b(?:hire|hiring|recruit\w*|interview(?:ing)? candidates?|interview questions? for|job (?:ad|post|description)|onboard(?:ing)? (?:a |new )?(?:hire|employee)|performance review)\b/i],
 ['security',/\b(?:contract|agreement|clause|nda|terms of service|privacy policy|gdpr|compliance|legal)\b/i],
 ['finance',/\b(?:bookkeeping|reconcil\w*|ledger|invoices?|tax|payroll|cash ?flow|xero|quickbooks)\b/i],
 ['data',/\b(?:ga4|google analytics|tracking plan|event tracking|dashboard|sql|statistic\w*)\b/i],
];
// In "hire a backend engineer" the job title names who is hired, not the specialist needed.
const hiredTitle=task=>{const m=task.match(/\b(?:hire|hiring|recruit\w*|interview questions? for)\s+(?:(?:an?|our|my|the|for|for an?)\s+)?([^.!?]+)/i);return new Set(m?words(m[1]):[]);};
const expand=terms=>new Map(terms.map(t=>[t,words(SYNONYMS[t]??'').filter(x=>x!==t)]));
// Broad jobs should start with a complete matching remit rather than an incidental word.
// Determine the requested artifact before its business domain: coding an SEO API
// needs implementation methods; auditing a site's SEO still needs an SEO remit.
function artifactIntent(task) {
 const build=/\b(?:build|develop|implement|code|program|create)\b/i.test(task)
   || /\b(?:write|convert|parse|transform)\b[^.!?]{0,100}\b(?:code|script|csv|json|records)\b/i.test(task);
 const software=/\b(?:api|sdk|integration|database|sql|typescript|javascript|python|react|code|codebase|repository|script|software|plugin)\b/i.test(task);
 const content=/\b(?:write|draft|create)\b[^.!?]{0,60}\b(?:ad copy|promotional copy|email sequence|blog post|article|newsletter)\b/i.test(task);
 if(content)return null;
 if(build&&/\bshopify\b/i.test(task)&&/\b(?:theme|liquid|sections?|snippets?)\b/i.test(task)&&!/\b(?:app|checkout|payments?)\b/i.test(task))return 'shopify-theme-specialist';
 if(build&&software&&/\b(?:react|next\.?js)\b/i.test(task))return 'react-frontend-specialist';
 if(build&&software)return 'coding-specialist';
 const design=/\b(?:design|redesign|prototype|wireframe)\b/i.test(task);
 const visual=/\b(?:interface|screen|layout|figma|prototype|wireframe|ui|ux|dashboard)\b/i.test(task);
 if(design&&visual&&!software)return 'design-specialist';
 if(/\b(?:audit|review|check|clean)\b/i.test(task)&&/\b(?:crm|salesforce|hubspot)\b/i.test(task))return 'crm-records-specialist';
 return null;
}
const intents=[
 [/\b(?:bug|debug|debugging)\b|\b(?:error|failure)\b.*\b(?:code|codebase|repo|json|test)\b|\b(?:code|codebase|repo|json|test)\b.*\b(?:error|failure)\b/i,'fix-a-bug-with-proof-and-a-clear-pull-request'],
 [/\b(?:build|create|implement|code)\b.*\blanding page\b/i,'build-a-landing-page-fix-it-and-prove-the-top-change'],
 [/\b(?:meta|facebook|instagram)\b.*\b(?:ads?|advertising|campaign)\b/i,'media-buyer'],
 [/\b(?:executive|daily brief|meeting preparation)\b/i,'executive-assistant'],
 [/\bseo\b|\b(?:google|bing|search|website|site)\b.*\bindexing\b|\bindexing\b.*\b(?:google|bing|search|website|site)\b/i,'seo-specialist'],
 [/\b(?:support tickets?|customer support|helpdesk)\b/i,'customer-support-specialist'],
 [/\bcro\b|\b(?:landing page|website|store|checkout|funnel)\b.*\bconversion\b|\bconversion\s+(?:rate|audit|optimi[sz])/i,'cro-specialist'],
];
// Owners' words for a job (lib/library-search-language.ts, shared with library search): "google maps" also
// means a local listing, "estimate" a quote. Each phrase's words also match the catalogue's words, at a discount.
let ownerRules;
function ownerSynonyms(task,synonyms){
 const lower=task.toLowerCase();
 ownerRules??=WORD_ALIASES.map(([pattern,alias])=>[new RegExp(pattern.source,'g'),words(alias)]);
 for(const [pattern,instead] of ownerRules)for(const match of lower.matchAll(pattern))for(const t of words(match[0]))if(synonyms.has(t))synonyms.set(t,[...new Set([...synonyms.get(t),...instead.filter(x=>x!==t)])]);
 return synonyms;
}
// Each role's words, worked out once per index (the /roles search box ranks on every keystroke).
const roleWords=new WeakMap();
function docsOf(index){
 let docs=roleWords.get(index);
 if(!docs)roleWords.set(index,docs=index.roles.map(r=>({r,fields:[words(r.name),words(r.summary),words((r.deliverables??[]).join(' ')),words((aliases[r.id]??'')+' '+(r.keywords??''))]})));
 return docs;
}
/** Every matching role with its score, best first. Owners come first: coding and engineering roles sit lower
 *  unless the task is a developer's (SPECIALIST_REQUEST) or an engineering area was chosen. */
export function rankRoles(index,task,area='all') {
 const terms=words(task);if(!terms.length)return [];
 const preferred=artifactIntent(task)??intents.find(([pattern])=>pattern.test(task))?.[1];
 const synonyms=ownerSynonyms(task,expand(terms)),boost=new Set(AREA_INTENTS.filter(([,pattern])=>pattern.test(task)).map(([id])=>id));
 const hired=hiredTitle(task),core=terms.filter(t=>!hired.has(t)),forSpecialist=SPECIALIST_REQUEST.test(task);
 const docs=docsOf(index).filter(({r})=>area==='all'||r.area===area);
 const all=[...new Set([...terms,...[...synonyms.values()].flat()])];
 const frequency=new Map(all.map(t=>[t,docs.filter(d=>d.fields.some(f=>f.includes(t))).length]));
 const weigh=(t,fields,factor)=>Math.log(1+docs.length/(1+frequency.get(t)))*fields.reduce((n,f,i)=>n+(f.includes(t)?[8,2,2,1.5][i]:0),0)*factor;
 return docs.map(({r,fields})=>{
  const matched=terms.filter(t=>fields.some(f=>f.includes(t))||synonyms.get(t).some(x=>fields.some(f=>f.includes(x))));
  // A hired job title counts a little, and does not reduce coverage when absent.
  let score=matched.reduce((n,t)=>n+Math.max(weigh(t,fields,1),...synonyms.get(t).map(x=>weigh(x,fields,0.7)))*(hired.has(t)?0.25:1),0);
  score*=(core.length?matched.filter(t=>!hired.has(t)).length/core.length:matched.length/terms.length);
  if(boost.size)score*=boost.has(r.area)?2.2:0.7;
  if(!forSpecialist&&!boost.size&&area==='all'&&r.area==='engineering')score*=0.6;
  if(task.toLowerCase().includes(r.name.toLowerCase()))score+=50;
  if(r.id===preferred&&matched.length)score+=1000;
  return {role:r,matched,score};
 }).filter(r=>r.matched.length&&r.score>0).sort((a,b)=>b.score-a.score||a.role.id.localeCompare(b.role.id));
}
/** A role that covers every word of the task (or a synonym): a strong match, not a passing one. */
export const isStrongRoleMatch=(row,task)=>row.matched.length===words(task).length;
export function rankSpecialists(index,task,limit=5,area='all') {
 return rankRoles(index,task,area).slice(0,limit).map(({role,matched,score})=>({id:role.id,name:role.name,summary:role.summary,area:role.area,deliverables:role.deliverables,matched_terms:matched,score:Math.round(score*10)/10,uri:`aiblocks://roles/${role.id}`,url:`https://useaiblocks.com/roles/${role.id}`}));
}
