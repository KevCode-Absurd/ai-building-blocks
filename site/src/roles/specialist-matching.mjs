// Deterministic candidate retrieval; the host AI checks the full remit against private context.
const STOP=new Set('a an the i my our your we you please need want help me with for to of in on and or as at by from it this that some task specialist role ai can do use using have would like'.split(' '));
const aliases={
 'coding-specialist':'code coding software engineering developer repository repo bug debugging implementation testing deploy deployment',
 'design-specialist':'design designer ui ux interface layout visual accessibility prototype figma',
 'executive-assistant':'executive assistant calendar schedule meetings inbox email admin administration day daily preparation',
 'customer-support-specialist':'customer support helpdesk tickets replies refunds escalation service',
 'seo-specialist':'seo search engine optimisation optimization organic metadata sitemap indexing crawl technical',
 'cro-specialist':'cro conversion landing page experiment testing analytics customer evidence',
 'media-buyer':'media buyer meta facebook instagram google ads advertising campaign paid social budget creative roas',
};
const stem=w=>w.replace(/(?:ing|ers|er|ed|s)$/,'');
const words=s=>[...new Set((s.toLowerCase().match(/[a-z0-9]+/g)??[]).filter(w=>w.length>1&&!STOP.has(w)).map(stem))];
// Broad jobs should start with a complete matching remit rather than an incidental word.
const intents=[
 [/\b(?:bug|debug|debugging)\b/i,'fix-a-bug-with-proof-and-a-clear-pull-request'],
 [/\b(?:build|create|implement|code)\b.*\blanding page\b/i,'build-a-landing-page-fix-it-and-prove-the-top-change'],
 [/\b(?:meta|facebook|instagram)\b.*\b(?:ads?|advertising|campaign)\b/i,'media-buyer'],
 [/\b(?:executive|daily brief|meeting preparation)\b/i,'executive-assistant'],
 [/\b(?:technical seo|seo audit|audit.*seo|indexing)\b/i,'seo-specialist'],
 [/\b(?:support tickets?|customer support|helpdesk)\b/i,'customer-support-specialist'],
 [/\b(?:conversion|cro)\b/i,'cro-specialist'],
];
export function rankSpecialists(index,task,limit=5,area='all') {
 const terms=words(task);if(!terms.length)return [];
 const preferred=intents.find(([pattern])=>pattern.test(task))?.[1];
 const docs=index.roles.filter(r=>area==='all'||r.area===area).map(r=>({r,fields:[words(r.name),words(r.summary),words(r.deliverables.join(' ')),words(aliases[r.id]??'')]}));
 const frequency=new Map(terms.map(t=>[t,docs.filter(d=>d.fields.some(f=>f.includes(t))).length]));
 return docs.map(({r,fields})=>{
  const matched=terms.filter(t=>fields.some(f=>f.includes(t)));
  let score=matched.reduce((n,t)=>n+Math.log(1+docs.length/(1+frequency.get(t)))*fields.reduce((n,f,i)=>n+(f.includes(t)?[8,2,2,3][i]:0),0),0);
  score*=matched.length/terms.length;
  if(task.toLowerCase().includes(r.name.toLowerCase()))score+=50;
  if(r.id===preferred&&matched.length)score+=1000;
  return {role:r,matched,score};
 }).filter(r=>r.matched.length).sort((a,b)=>b.score-a.score||a.role.id.localeCompare(b.role.id)).slice(0,limit).map(({role,matched})=>({id:role.id,name:role.name,summary:role.summary,area:role.area,deliverables:role.deliverables,matched_terms:matched,uri:`aiblocks://roles/${role.id}`,url:`https://useaiblocks.com/roles/${role.id}`}));
}
