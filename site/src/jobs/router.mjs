// Two decisions are made here, both without a model: which published job a request is (classifyJob), and whether one
// lead or a team should do it (routeJob). Job knowledge stays in the published approach data.
import {isStaticAdRequest} from './studio-discovery.mjs';
import {DELIVERABLE_KINDS,suggestDeliverableKind} from './grounding.mjs';
const STOP = new Set('a an and are as at be by for from get give have i in into is it its me my of on or our please that the their them these this to us want we with you your'.split(' '));
const VERBS={create:'make',generate:'make',produce:'make',draft:'write',redesign:'design',audit:'check',review:'check',read:'check',analyze:'analyse',analyses:'analyse'};
const token = word => {const v=VERBS[word]??word;return v.length>3&&v.endsWith('s')&&!v.endsWith('ss')?v.slice(0,-1):v;};
const raw = value => String(value??'').toLowerCase().match(/[a-z0-9]+/g)??[];
const words = value => raw(value).filter(w=>!STOP.has(w)).map(token);
const CREATION=new Set(['make','write','build','design']);
const ACTIONS=new Set(['make','write','build','check','plan','design','work','run','set','manage','study','test','help','analyse']);
const normalized=value=>raw(value).join(' ');

// Kinds of work a request can name. A team is needed only when a request names more than one of these.
// Copy, plans and audits go with whatever they describe ("ad copy", "email plan", "page audit"), so they are not a kind here.
const WORK=[
 ['page','a page',/\b(?:landing[ -]?pages?|web ?pages?|websites?|web ?sites?|home ?pages?|product pages?|sales pages?|pricing pages?|microsites?|sites?|pages?)\b/g],
 ['ads','ads',/\b(?:ads?|adverts?|advertisements?|creatives?|banners?|billboards?)\b/g],
 ['email','emails',/\b(?:e-?mails?|newsletters?)\b/g],
 ['video','video',/\b(?:videos?|reels?|tiktoks?|shorts|films?|animations?)\b/g],
 ['content','posts and articles',/\b(?:blog posts?|social posts?|posts?|captions?|carousels?|tweets?|threads?|articles?|blogs?|case stud(?:y|ies)|white ?papers?|press releases?|ebooks?)\b/g],
 ['image','images',/\b(?:images?|photos?|illustrations?|logos?|icons?|infographics?|packaging)\b/g],
 ['code','code',/\b(?:apps?|scripts?|apis?|integrations?|plugins?|pipelines?|automations?|bots?|dashboards?|databases?|spreadsheets?)\b/g],
 ['deck','a deck',/\b(?:decks?|presentations?|slides?|pitch(?:es)?)\b/g],
];
// Words after these describe the setting (who it is for, where traffic comes from, which channel), not the deliverable.
const CONTEXT_WORD=/\b(?:for|that|to|from|with|using|so|which|where|about|via|because|while|when|since|after|before|targeting|into|across|on|in|at|by|announcing|promoting|explaining|introducing|showing|selling|driving|pointing|linking|matching|supporting|describing|covering|comparing|featuring|highlighting|inviting|asking|telling|reminding|thanking|pushing|sending)\b/;
const OWNER_WORD=/\b(?:our|my|their|your|we|they)\b/g;
/** Where the setting starts in a phrase, or -1. "the landing page our Google ads point to" stops before "our". */
function contextStart(phrase) {
 let at=phrase.search(CONTEXT_WORD);
 // An owner word after the deliverable noun opens a clause about something else.
 for(const owner of phrase.matchAll(OWNER_WORD))if((at<0||owner.index<at)&&WORK.some(([,,pattern])=>phrase.slice(0,owner.index).search(pattern)>=0)){at=owner.index;break;}
 return at;
}
const HEAD_WEIGHT=2.5,CONTEXT_WEIGHT=.35;
/** The words that name the deliverable, and the rest: from the first action verb to where the setting starts.
 *  "Build a landing page for our shoes that we can send Meta ad traffic to" → "landing page". */
function deliverableWords(request) {
 const text=String(request??'').toLowerCase();
 let start=0;
 for(const match of text.matchAll(/[a-z0-9]+/g))if(ACTIONS.has(token(match[0]))){start=match.index;break;}
 const at=contextStart(text.slice(start)),end=at<0?text.length:start+at;
 const head=new Set(words(text.slice(start,end))),rest=new Set(words(text.slice(0,start)+' '+text.slice(end)));
 // No deliverable words before the setting, or no setting at all: every word counts the same.
 if(![...head].some(w=>!ACTIONS.has(w))||!rest.size)return null;
 return {head,rest};
}

// A declared deliverable_kind filters the candidates. Brand production kinds keep only their own jobs; assessment and
// planning kinds drop the jobs that make pages, ads and emails. Other kinds are not filtered.
const KIND_JOBS=Object.freeze({
 web_page:['write-landing-page','build-websites','design-work','set-up-store'],
 ad_creative:['make-image-ads','make-video-ads','write-ad-copy','product-photos','make-images','run-google-ads'],
 email:['write-emails','keep-customers'],
});
const MAKER_JOBS=new Set(['make-image-ads','make-video-ads','make-images','product-photos','write-landing-page','build-websites','write-ad-copy','write-emails']);
const NOT_MAKING=new Set(['audit','analysis','strategy','plan']);
const kindAllows=(kind,job)=>KIND_JOBS[kind]?KIND_JOBS[kind].includes(job):NOT_MAKING.has(kind)?!MAKER_JOBS.has(job):true;
// Jobs a kind leans towards. A lean lifts a candidate; it never removes one.
const PREFERRED=Object.freeze({...KIND_JOBS,analysis:['analyse-data','track-numbers','read-ad-results','understand-customers','study-competitors','research-topics','test-store-changes']});
const WORK_KIND=Object.freeze({page:'web_page',ads:'ad_creative',email:'email'});
/** The kind a request most likely is when the caller has not declared one. The first verb and the noun that names the
 *  deliverable decide: "Analyse why emails fell after the redesign" is an analysis, not a page or an email. */
function guessKind(request) {
 const first=raw(request).map(token).find(w=>ACTIONS.has(w)),suggested=suggestDeliverableKind(request).kind;
 if(first==='analyse')return 'analysis';
 if(first==='plan')return suggested==='strategy'?'strategy':'plan';
 if(first==='check'||first==='study'||first==='test')return NOT_MAKING.has(suggested)?suggested:'audit';
 if(NOT_MAKING.has(suggested))return suggested;
 const work=requestedWork(request).kinds;
 return work.length===1&&WORK_KIND[work[0].id]?WORK_KIND[work[0].id]:suggested;
}

/**
 * Match a request to a published job.
 * @param {string} request
 * @param {any} [approaches] the approach index, or its jobs map
 * @param {{deliverable_kind?: string}} [options] a declared kind filters candidates; without one the word guess only nudges
 */
export function classifyJob(request, approaches = {}, { deliverable_kind } = {}) {
 const jobs=approaches.jobs??approaches,query=new Set(words(request));
 const declared=DELIVERABLE_KINDS.includes(deliverable_kind)?deliverable_kind:null,guessed=declared?null:guessKind(request),kind=declared??guessed;
 const documents=Object.entries(jobs).filter(([,v])=>v&&typeof v==='object').map(([job,entry])=>({job,title:new Set(words(job+' '+(entry.name??''))),body:new Set(words([...(entry.keywords??[]),...(entry.families??[]).flatMap(f=>[f.name,f.what_it_looks_like])].join(' ')))}));
 const df=new Map();for(const d of documents)for(const w of new Set([...d.title,...d.body]))df.set(w,(df.get(w)??0)+1);
 const rarity=w=>1+Math.log(1+documents.length/((df.get(w)??0)+1));
 // The noun that names the deliverable outweighs words that describe its setting.
 const parts=deliverableWords(request),place=w=>!parts?1:parts.head.has(w)?HEAD_WEIGHT:CONTEXT_WEIGHT;
 // A creation request should favour production over an audit that mentions the same output.
 // This is a retrieval hint; the lead still checks the candidate against the real output.
 const intent=[...query].find(w=>ACTIONS.has(w));
 const affinity=d=>{
  if(!intent)return 1;
  const actions=[...d.title].filter(w=>ACTIONS.has(w));
  if(CREATION.has(intent))return actions.some(w=>CREATION.has(w))?1.5:actions.length?.45:1;
  return actions.includes(intent)?1.5:actions.length?.65:1;
 };
 // An undeclared kind is only a guess from the words, so it leans the ranking instead of filtering it.
 const nudge=job=>!kind||kind==='other'?1:PREFERRED[kind]?.includes(job)?1.4:KIND_JOBS[kind]?.7:NOT_MAKING.has(kind)&&MAKER_JOBS.has(job)?.5:1;
 const ranked=documents.filter(d=>!declared||kindAllows(declared,d.job)).map(d=>({job:d.job,score:affinity(d)*nudge(d.job)*[...query].reduce((n,w)=>n+(d.title.has(w)?(ACTIONS.has(w)?.7:4*place(w)):d.body.has(w)?1.7*place(w):0)*rarity(w),0)})).sort((a,b)=>b.score-a.score||a.job.localeCompare(b.job));
 const first=ranked[0],total=[...query].reduce((n,w)=>n+4*rarity(w),0);
 let confidence=!first?.score?0:Math.min(.95,.25+first.score/Math.max(1,total));
 let job=first?.score>0?first.job:null,alternatives=ranked.filter(r=>r.score>0).slice(1,4).map(r=>r.job);
 // Nothing matched inside a declared production kind: fall back to that kind's main job rather than to no job.
 if(!job&&declared&&KIND_JOBS[declared]){const fallback=KIND_JOBS[declared].find(id=>Object.hasOwn(jobs,id));if(fallback){job=fallback;confidence=.3;}}
 // Plain "make ads" requests mean still images unless video is named. This never overrides another declared or guessed kind.
 if(kind==='ad_creative'&&isStaticAdRequest(request)&&Object.hasOwn(jobs,'make-image-ads')&&job!=='make-image-ads'){alternatives=[job,...alternatives.filter(x=>x!==job&&x!=='make-image-ads')].filter(Boolean).slice(0,3);job='make-image-ads';}
 return {job,confidence:Math.round(confidence*100)/100,alternatives};
}

// A counted noun gives the batch size: "6 ads", "a 5-email sequence". Lengths and durations ("90-day", "10-page") do not.
const COUNTED=/\b(\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|a dozen|dozen)(\s+|-)(?!(?:days?|weeks?|months?|years?|hours?|minutes?|seconds?|words?|characters?|percent|px|steps?|parts?|points?|k|x)\b)(?:[a-z]+[ -]){0,5}?(ads?|adverts?|creatives?|e-?mails?|pages?|posts?|messages?|options?|variants?|variations?|versions?|concepts?|ideas?|images?|photos?|videos?|scripts?|headlines?|articles?|documents?|designs?|assets?|outputs?|pieces?|reports?|plans?|carousels?|captions?|hooks?|banners?|slides?|mockups?|subject lines?|descriptions?|templates?)\b/g;
const NUMBER_WORDS={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,fifteen:15,twenty:20,thirty:30,forty:40,fifty:50,'a dozen':12,dozen:12};
const MAKE_VERB=/^(?:make|create|write|draft|produce|design|build|generate|redesign|rewrite|audit|review|plan|launch|prepare|record|shoot|code|develop)$/;
const LIST_ITEM=/^(?:\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty)$/;
const JOINER=/([,;:.]|\band\b|\bplus\b|&|\+|\bas well as\b|\balong with\b)/;
/** One lead can make up to this many pieces of one kind. More is a batch worth sharing. */
export const SINGLE_LEAD_MAX=12;
// "Put a team on it", "use a council", "team of specialists". A team that is only mentioned ("for our sales team") does not count.
const TEAM_ASKED=/\b(?:team mode|(?:use|with|want|need|put|get|assemble|staff|bring in) (?:a|an|the|your|your whole|a full|a small) (?:team|council|panel|committee)|(?:several|multiple|group of|team of|panel of) (?:experts|specialists|agents)|deep review|deep team)\b/;

/** What the request asks to be made: the kinds of work and the largest counted batch. The setting ("for Meta ad traffic") is ignored. */
export function requestedWork(request) {
 const text=String(request??'').toLowerCase().replace(/[’']/g,''),kinds=[];
 let count=0,context=false;
 // Walk the request phrase by phrase. Once the setting starts ("for", "that", "to"), deliverable reading is off until a
 // phrase clearly starts another deliverable: a making verb, or a list item that opens with a number, "a" or "an".
 for(const phrase of text.split(JOINER)){
  const trimmed=phrase.trim(),first=(phrase.match(/[a-z0-9]+/)??[])[0];
  if(/^[;:.]$/.test(trimmed))context=false;
  if(!first||/^(?:[,;:.&+]|and|plus|as well as|along with)$/.test(trimmed))continue;
  if(context&&(MAKE_VERB.test(first)||LIST_ITEM.test(first)))context=false;
  let made='';
  if(!context){const at=contextStart(phrase);made=at<0?phrase:phrase.slice(0,at);context=at>=0;}
  // The last deliverable noun in a phrase names it: "ad landing page" is a page, "landing page ads" are ads.
  let last=null;
  for(const [id,label,pattern] of WORK)for(const match of made.matchAll(pattern)){const end=match.index+match[0].length;if(!last||end>last.end||(end===last.end&&match[0].length>last.length))last={id,label,end,length:match[0].length};}
  if(last&&!kinds.some(kind=>kind.id===last.id))kinds.push({id:last.id,label:last.label});
  // "a 10-page report" is one report, not ten pages.
  for(const match of made.matchAll(COUNTED)){if(match[2]==='-'&&/^pages?$/.test(match[3]))continue;const n=NUMBER_WORDS[match[1]]??Number(match[1]);if(n>count)count=n;}
 }
 return {kinds,count};
}

const list=labels=>labels.length<2?labels.join(''):labels.slice(0,-1).join(', ')+' and '+labels.at(-1);

/**
 * Decide who does the job. One lead by default; a team only for mixed work, a large batch, or when asked.
 * mode: auto (default), single, team or direct.
 */
export function routeJob({ request, mode = 'auto', item_id, role_id, persona_id, parent_outcome_id, deliverable_kind, dials } = {}, { approaches = {}, items = [], roles = [], personas = [] } = {}) {
  if (!['auto', 'single', 'team', 'direct'].includes(mode)) return { ok: false, errors: [{ path: 'mode', message: 'Choose auto, single, team or direct.' }] };
  const text = normalized(request), classification = classifyJob(request, approaches, { deliverable_kind });
  if (mode !== 'auto') return { ok: true, mode, mode_reason: mode === 'team' ? 'You asked for a team.' : mode === 'single' ? 'You asked for one lead.' : 'You asked for a named item or worker.', job_type: classification };
  const collections = [items, Array.isArray(roles) ? roles : roles.roles ?? [], personas];
  const named = collections.flat().find(entry => {
    const id = entry.slug ?? entry.id;
    return id && new RegExp(`(?:^|[^a-z0-9-])${String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|[^a-z0-9-])`, 'i').test(request) || (entry.name && text.includes(normalized(entry.name)) && /\b(?:use|load|hire|run|skill|agent|specialist)\b/.test(text));
  });
  if (item_id || role_id || persona_id || named || /\b(?:only|just)\s+(?:(?:the|a|an)\s+)?(?:[a-z0-9]+\s+){0,5}(?:skill|specialist|agent|format|videos?|images?|emails?|text|report)\b/.test(text) || /\b(?:use|load|run)\s+(?:the\s+)?[a-z0-9 -]+\s+(?:skill|agent)\b/.test(text)) {
    return { ok: true, mode: 'direct', mode_reason: 'The request names a specific item, worker or output kind.', job_type: classification, ...(named ? { selected_id: named.slug ?? named.id } : {}) };
  }
  const deliverable = /\b(?:make|create|write|draft|produce|design|build|audit|diagnose|review|compare|plan|report|analysis|strategy|scripts?|creatives?|assets?|emails?|pages?|workflow|app|system|options|proposal|decision)\b/.test(text);
  const goal = /\b(?:more|fewer|less|increase|decrease|improve|grow|reduce|boost|falling|down|struggling|stuck|not working|not doing well|sales|revenue|customers|costs|retention|launch|learn)\b/.test(text);
  if (!parent_outcome_id && goal && !deliverable) return { ok: true, mode: 'outcome', mode_reason: 'This is a goal or problem without a named deliverable.', job_type: classification };
  const work = requestedWork(request), asked = TEAM_ASKED.test(text) || dials?.depth === 'deep';
  const result = (chosen, mode_reason, extra = {}) => ({ ok: true, mode: chosen, mode_reason, job_type: classification, work, ...extra });
  if (asked) return result('team', 'You asked for a team.');
  if (work.kinds.length > 1) return result('team', `This needs different kinds of work (${list(work.kinds.map(kind => kind.label))}), so one lead runs a small team of helpers.`);
  if (work.count > SINGLE_LEAD_MAX) return result('team', `${work.count} pieces is a large batch, so one lead shares the making with helpers.`);
  if (!deliverable && !goal && words(request).length <= 5) return result('single', 'The request does not yet say what to make. Ask, then one lead does it.', { ask: true, question: 'What would you like to have at the end of this job?' });
  return result('single', work.count > 1 ? `${work.count} pieces of one kind of work, so one lead makes them all. No team is needed.` : 'This is one kind of work, so one lead does it. No team is needed.');
}
