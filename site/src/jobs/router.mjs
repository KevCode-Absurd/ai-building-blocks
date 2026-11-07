// Classification chooses from published data; task-specific knowledge belongs in that data.
const STOP = new Set('a an and are as at be by for from get give have i in into is it its me my of on or our please that the their them these this to us want we with you your'.split(' '));
const VERBS={create:'make',generate:'make',produce:'make',draft:'write',redesign:'design',audit:'check',review:'check',read:'check',analyze:'analyse',analyses:'analyse'};
const token = word => {const v=VERBS[word]??word;return v.length>3&&v.endsWith('s')&&!v.endsWith('ss')?v.slice(0,-1):v;};
const words = value => (String(value??'').toLowerCase().match(/[a-z0-9]+/g)??[]).filter(w=>!STOP.has(w)).map(token);
const CREATION=new Set(['make','write','build','design']);
const ACTIONS=new Set(['make','write','build','check','plan','design','work','run','set','manage','study','test','help']);
const normalized=value=>(String(value??'').toLowerCase().match(/[a-z0-9]+/g)??[]).join(' ');
export function classifyJob(request, approaches = {}) {
 const jobs=approaches.jobs??approaches,query=new Set(words(request));
 const documents=Object.entries(jobs).filter(([,v])=>v&&typeof v==='object').map(([job,entry])=>({job,title:new Set(words(job+' '+(entry.name??''))),body:new Set(words([...(entry.keywords??[]),...(entry.families??[]).flatMap(f=>[f.name,f.what_it_looks_like])].join(' ')))}));
 const df=new Map();for(const d of documents)for(const w of new Set([...d.title,...d.body]))df.set(w,(df.get(w)??0)+1);
 const rarity=w=>1+Math.log(1+documents.length/((df.get(w)??0)+1));
 // A creation request should favour production over an audit that mentions the same output.
 // This is a retrieval hint; the coordinator still validates the candidate in SCOPE.
 const intent=[...query].find(w=>ACTIONS.has(w));
 const affinity=d=>{
  if(!intent)return 1;
  const actions=[...d.title].filter(w=>ACTIONS.has(w));
  if(CREATION.has(intent))return actions.some(w=>CREATION.has(w))?1.5:actions.length?.45:1;
  return actions.includes(intent)?1.5:actions.length?.65:1;
 };
 const ranked=documents.map(d=>({job:d.job,score:affinity(d)*[...query].reduce((n,w)=>n+(d.title.has(w)?(ACTIONS.has(w)?.7:4):d.body.has(w)?1.7:0)*rarity(w),0)})).sort((a,b)=>b.score-a.score||a.job.localeCompare(b.job));
 const first=ranked[0],total=[...query].reduce((n,w)=>n+4*rarity(w),0),confidence=!first?.score?0:Math.min(.95,.25+first.score/Math.max(1,total));
 return {job:first?.score>0?first.job:null,confidence:Math.round(confidence*100)/100,alternatives:ranked.filter(r=>r.score>0).slice(1,4).map(r=>r.job)};
}

export function routeJob({ request, mode = 'auto', item_id, role_id, persona_id, parent_outcome_id } = {}, { approaches = {}, items = [], roles = [], personas = [] } = {}) {
  if (!['auto', 'team', 'direct'].includes(mode)) return { ok: false, errors: [{ path: 'mode', message: 'Choose auto, team or direct.' }] };
  const text = normalized(request), classification = classifyJob(request, approaches);
  if (mode !== 'auto') return { ok: true, mode, mode_reason: `The caller chose ${mode} mode.`, job_type: classification };
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
  if (!deliverable && !goal && words(request).length <= 5) return { ok: true, mode: 'team', ask: true, mode_reason: 'The request needs a clearer output before staffing.', job_type: classification, question: 'What would you like to have at the end of this job?' };
  return { ok: true, mode: 'team', mode_reason: 'This request needs a scoped deliverable and a flexible team.', job_type: classification };
}
