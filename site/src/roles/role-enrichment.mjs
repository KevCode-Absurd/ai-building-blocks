// Library-derived additions for each specialist: support methods, reviewer minds, a worked
// example, role-specific checks and a family. Deterministic, so every build gives the same roles.
const STOP=new Set('a an the and or of to in on for with from by your you it its this that is are be as at get give share make into each who what when how one two any all can will use using their them they than then more most out up our we us not no new some'.split(' '));
export const wordsOf=s=>new Set((String(s??'').toLowerCase().match(/[a-z][a-z0-9]{2,}/g)??[]).filter(w=>!STOP.has(w)).map(w=>w.replace(/(?:ies)$/,'y').replace(/(?:ing|ers|er|ed|es|s)$/,'')).filter(w=>w.length>2));
const overlap=(a,b)=>{let n=0;for(const w of a)if(b.has(w))n++;return n;};
// A named product, platform or language the role never mentions (MATLAB, App Store, Russian)
// makes a method too specific to add on keyword overlap alone. Words the library capitalises
// mid-name (Google, Gorgias) are names even when they open a title.
let names=null;
function namedWords(blocks){
 if(names?.blocks===blocks)return names.set;
 const set=new Set();for(const b of blocks)for(const w of String(b.name).split(/\s+/).slice(1))if(/^[A-Z][A-Za-z0-9+.#-]*$/.test(w))set.add(w.toLowerCase());
 names={blocks,set};return set;
}
const foreignNames=(name,target,named)=>String(name).split(/\s+/).filter((w,i)=>/^[A-Z]/.test(w)&&(i>0||/^[A-Z0-9]{2,}$|^[A-Z][a-z]+[A-Z]/.test(w)||named.has(w.toLowerCase()))).some(w=>![...wordsOf(w)].every(x=>target.has(x)));
const isMethod=b=>b.type===undefined||b.type==='skill'||b.type==='prompt';
const usable=(manifest,slug)=>manifest.resources[slug]?.reference_validation?.status==='PASS';
// Real methods are those a role uses for its work, not context setup or review lenses.
export const TARGET_METHODS=4,MAX_ADDED=3,MAX_REVIEWERS=2;
// Shared words count by how rare they are in the library, so "plan" or "review" alone
// cannot make two unrelated methods look alike.
let rarity=null;
function idf(blocks){
 if(rarity?.blocks===blocks)return rarity.map;
 const df=new Map();for(const b of blocks)for(const w of wordsOf(b.name+' '+b.summary))df.set(w,(df.get(w)??0)+1);
 const n=blocks.length,map=new Map([...df].map(([w,c])=>[w,Math.log(n/c)]));rarity={blocks,map};return map;
}
export function supportMethods({lead,leadPage,blocks,manifest,exclude,count}) {
 if(count<=0)return [];
 const weight=idf(blocks),target=wordsOf([lead.name,lead.summary,...(leadPage.you_get??[]),...(leadPage.you_give??[])].join(' '));
 const core=wordsOf(lead.name+' '+lead.summary),named=namedWords(blocks);
 return blocks.filter(b=>isMethod(b)&&!exclude.has(b.slug)&&usable(manifest,b.slug)&&!foreignNames(b.name,target,named)).map(b=>{
  const name=wordsOf(b.name);let shared=0,nameHits=0;for(const w of wordsOf(b.name+' '+b.summary))if(target.has(w))shared+=weight.get(w)??0;
  for(const w of name)if(core.has(w))nameHits+=weight.get(w)??0;
  const sameTask=!!b.task&&b.task===lead.task;
  return {b,sameTask,score:shared+nameHits+(sameTask?4:0),nameHits,shared};
 }).filter(x=>x.nameHits>=3&&(x.sameTask?x.score>=16:x.score>=22)).sort((a,b)=>b.score-a.score||a.b.slug.localeCompare(b.b.slug)).slice(0,count).map(x=>x.b.slug);
}
const MIND_AREAS={engineering:['coding','science'],design:['design','arts'],marketing:['marketing','writing'],operations:['leadership','business'],support:['business'],sales:['sales','business'],product:['business','leadership'],data:['science','thinking'],finance:['business'],people:['leadership'],security:['thinking','science'],commerce:['business','marketing'],specialist:['writing','arts','thinking']};
// Minds are matched on the kind of work their own skills cover, then on their seats;
// shared summary boilerplate ("review a decision through ...") is ignored.
let mindProfiles=null;
function profiles(blocks){
 if(mindProfiles?.blocks===blocks)return mindProfiles.map;
 const task=new Map(blocks.map(b=>[b.slug,b.task])),minds=blocks.filter(b=>b.type==='mind'),df=new Map();
 const seats=minds.map(m=>wordsOf((m.seats??[]).join(' ')));for(const w of seats.flatMap(x=>[...x]))df.set(w,(df.get(w)??0)+1);
 const map=new Map(minds.map((m,i)=>{const tasks=new Map();for(const s of m.skills??[]){const t=task.get(s);if(t)tasks.set(t,(tasks.get(t)??0)+1);}return [m.slug,{tasks,seats:new Set([...seats[i]].filter(w=>df.get(w)<=8))}];}));
 mindProfiles={blocks,map};return map;
}
export function reviewerMinds({role,blocks,manifest,exclude}) {
 const target=wordsOf([role.name,role.summary,...role.deliverables].join(' ')),areas=MIND_AREAS[role.area]??[],methods=new Set(role.methods),info=profiles(blocks);
 return blocks.filter(b=>b.type==='mind'&&!exclude.has(b.slug)&&usable(manifest,b.slug)).map(b=>{
  const p=info.get(b.slug),skills=(b.skills??[]).filter(s=>methods.has(s)).length,sameWork=p.tasks.get(role.task)??0,seats=overlap(p.seats,target);
  const area=[b.area,...(b.also??[])].some(a=>areas.includes(a));
  return {b,score:skills*4+Math.min(sameWork,3)*2+seats*1.5+(area?1:0),skills,sameWork,seats};
 }).filter(x=>x.skills||(x.sameWork>=2&&x.seats>=1)||(x.sameWork>=1&&x.seats>=2)).sort((a,b)=>b.score-a.score||a.b.slug.localeCompare(b.b.slug)).slice(0,MAX_REVIEWERS).map(x=>x.b.slug);
}
const firstSentence=s=>(String(s).match(/^.*?[.!?](?=\s|$)/)?.[0]??String(s)).trim();
export function workedExample({seed,summary,fit,inputs,leadPage}) {
 const sample=leadPage.output_sample??{};
 const outputs=Array.isArray(sample.output)?sample.output.filter(o=>typeof o?.name==='string'&&typeof o?.contains==='string').slice(0,6).map(o=>({name:o.name,contains:o.contains})):[];
 const given=(Array.isArray(sample.input)&&sample.input.length?sample.input:inputs).filter(s=>typeof s==='string').slice(0,6);
 return {situation:fit[0]??summary,task:seed.example||`${firstSentence(summary)} Use the material I attach and ask for anything essential that is missing.`,given,outputs};
}
export function roleEvaluation({id,deliverables,inputs,fit,expertise,results}) {
 const rubric=[...deliverables.slice(0,4).map(d=>`Delivers: ${d}`),...expertise.quality.slice(0,4),'States which checks passed, failed or could not run, and names missing inputs.'].map((criterion,i)=>({id:`c${i+1}`,criterion}));
 const goldenTasks=[...fit.slice(0,2).map((situation,i)=>({id:`g${i+1}`,kind:'core',situation,expect:deliverables.slice(0,3)})),
  ...(inputs[0]?[{id:'g-missing',kind:'missing-input',situation:`The request leaves out: ${inputs[0]}`,expect:['Names the missing input and asks for it, or finishes only the parts that do not depend on it.']}]:[])];
 const run=results?.[id];
 const status=run&&run.rubricSha===rubricSha(rubric)?(run.passed?'PASS':'FAIL'):'NOT_RUN';
 return {status,rubric,goldenTasks,...(status!=='NOT_RUN'?{ran:run.date,model:run.model,score:run.score}:{}),note:status==='NOT_RUN'?'These checks are defined but have not been run against a model yet.':`Model-graded run on ${run.date}. A pass is evidence for these tasks, not a guarantee for yours.`};
}
// A short stable fingerprint so a stored result only counts for the rubric it was graded on.
export function rubricSha(rubric){let h=2166136261;for(const ch of JSON.stringify(rubric))h=Math.imul(h^ch.charCodeAt(0),16777619);return (h>>>0).toString(16).padStart(8,'0');}
// Workflow titles read as tasks; a specialist reads as a person who does the job.
export const ROLE_NAMES={
 'make-your-me-md-and-set-it-up-in-every-ai':'me.md setup guide',
 'make-an-educational-narration-with-a-text-companion':'Lesson narration writer',
 'monthly-belief-evidence-keeper':'Assumptions and evidence tracker',
 'plan-a-local-nature-project-with-stewardship':'Nature project planner',
 'plan-workforce-disruption-coverage-before-announcing':'Staff coverage planner',
 'prepare-a-source-checked-research-talk':'Research talk builder',
 'prepare-bulk-rna-results-with-explicit-contrasts':'Bulk RNA results analyst',
 'prepare-new-data-use-review-for-signoff':'Data use review preparer',
 'teach-history-with-traceable-source-adaptations':'History teacher with sources',
 'validate-lab-data-before-system-import':'Lab data import checker',
};
export function familyOf(lead,tasks){const t=tasks.get(lead.task);return t?{id:t.id,name:t.name}:{id:'other',name:'Other work'};}
