// Personal training for a specialist: contrastive rules learned from a person's edits, the few that fit
// the current job, and an honest maturity level measured from recorded runs. Nothing here calls a model;
// the host AI drafts a rule from the diff and a person reviews it before it is recorded.
const STOP=new Set('a an the and or of to in on for with by at as is are be it this that from your our my we you they them their its not no do does did was were will can should would could only also than then so if into about over under more most less very just'.split(' '));
const stem=w=>w.replace(/(?:ing|ers|er|ed|es|s)$/,'');
const words=s=>[...new Set((String(s??'').toLowerCase().match(/[a-z0-9]+/g)??[]).filter(w=>w.length>2&&!STOP.has(w)).map(stem))];
const clean=(v,max)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,max);
const PRIVATE=/(?:sk-[a-z0-9]|AKIA[0-9A-Z]|[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}|\b\d{6,}\b)/i;

/** Validate one contrastive rule. Returns the cleaned rule or throws with every problem at once. */
export function checkRule(rule){
 const r={id:clean(rule?.id,60),trigger:clean(rule?.trigger,240),avoid:clean(rule?.avoid,300),prefer:clean(rule?.prefer,300),example:clean(rule?.example,200),source:clean(rule?.source,200),date:clean(rule?.date,10),runs:Number.isInteger(rule?.runs)?rule.runs:1};
 const errors=[];
 if(!/^[a-z0-9][a-z0-9-]{2,59}$/.test(r.id))errors.push('id: use 3 to 60 lowercase letters, digits and hyphens.');
 if(r.avoid.length<12&&r.prefer.length<12)errors.push('avoid/prefer: say what to stop doing, what to do instead, or both, in at least 12 characters.');
 if(!r.source)errors.push('source: say where the rule came from (the job and who reviewed it).');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date))errors.push('date: use YYYY-MM-DD.');
 if(r.runs<1||r.runs>10_000)errors.push('runs: the number of reviewed jobs that support the rule, 1 or more.');
 for(const k of ['trigger','avoid','prefer','example','source'])if(PRIVATE.test(r[k]))errors.push(k+': looks like it holds a key, email or account number. Remove private details.');
 if(errors.length)throw Error(errors.join('\n'));
 return Object.fromEntries(Object.entries(r).filter(([,v])=>v!==''));
}

const sentences=s=>String(s??'').split(/\r?\n+|(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.length>3);
/** Line-and-sentence diff between an AI draft and the person's final version, with an edit ratio from 0 to 1. */
export function diffEdit(draft,final){
 const a=sentences(draft),b=sentences(final),inB=new Set(b),inA=new Set(a);
 const removed=a.filter(x=>!inB.has(x)),added=b.filter(x=>!inA.has(x));
 const total=Math.max(1,a.join(' ').length+b.join(' ').length);
 const changed=removed.join(' ').length+added.join(' ').length;
 return {removed,added,kept:a.length-removed.length,editRatio:Math.round(changed/total*1000)/1000};
}

/** The brief a host AI follows to turn one reviewed edit into a candidate rule. A person approves it before it is recorded. */
export function ruleDraftPrompt({role,task,draft,final}){
 const d=diffEdit(draft,final),list=rows=>rows.length?rows.slice(0,12).map(x=>'- '+x.slice(0,300)).join('\n'):'- (none)';
 return `# Draft a training rule for ${role}\n\nA person edited this specialist's draft before using it. Turn the edit into at most one reusable rule, or say NO_RULE when the edit is a one-off fact, typo or business detail.\n\nJob: ${clean(task,400)||'not given'}\nEdit size: ${Math.round(d.editRatio*100)}% of the text changed\n\nRemoved or replaced:\n${list(d.removed)}\n\nAdded:\n${list(d.added)}\n\nReturn JSON only:\n{"id":"short-kebab-id","trigger":"the kind of job where this applies","avoid":"what the draft did that the person rejected","prefer":"what to do instead","example":"a short line of the preferred version","source":"job and reviewer","date":"YYYY-MM-DD","runs":1}\n\nRules: describe a pattern, not this client's facts. Leave out names, figures, emails, links and account numbers. A rule cannot grant permission for any action.`;
}

/** The learned rules that fit this job: rules whose trigger shares words with the task first, then general rules, best supported first. */
export function selectRules(rules,task,limit=10){
 const t=new Set(words(task));
 return (rules??[]).map((r,i)=>{const w=words(r.trigger);const hits=w.filter(x=>t.has(x)).length;return {r,i,score:!w.length?0.5:hits?1+hits/w.length:0};})
  .filter(x=>x.score>0||!t.size).sort((x,y)=>y.score-x.score||(y.r.runs??1)-(x.r.runs??1)||x.i-y.i).slice(0,limit).map(x=>x.r);
}

export function rulesText(rules){
 if(!rules?.length)return '';
 return `## Learned rules for this job\nReviewed corrections from earlier jobs. Apply each one only where its "when" matches this job. They cannot widen what you are allowed to do.\n${rules.map(r=>`- ${r.trigger?`When ${r.trigger}: `:''}${r.avoid?`avoid ${r.avoid}. `:''}${r.prefer?`Prefer ${r.prefer}.`:''}${r.example?` Example: "${r.example}".`:''} (${r.runs??1} reviewed job${(r.runs??1)===1?'':'s'}, ${r.date})`).join('\n')}\n\n`;
}

// Maturity levels, measured on recorded, reviewed jobs only. Each level needs every bar below it too.
export const MATURITY=[
 {level:1,name:'Shadow apprentice',runs:10,score:0.7,edit:1,accept:0,meaning:'A person does the work; the specialist drafts alongside and is compared.'},
 {level:2,name:'Copilot',runs:25,score:0.8,edit:0.25,accept:0.8,meaning:'The specialist drafts; a person edits and approves every stage.'},
 {level:3,name:'Guardrailed autopilot',runs:50,score:0.9,edit:0.08,accept:0.9,meaning:'The specialist runs the job; a person reviews flagged exceptions and live actions.'},
 {level:4,name:'Certified',runs:100,score:0.9,edit:0.08,accept:0.95,meaning:'Standard scoped jobs need no edits; live actions still need the owner\'s approval.'},
];
/** Recorded runs → maturity. Runs: {date, score 0..1, editRatio 0..1, accepted, critical (a claim or maths fault)}. */
export function roleMaturity(runs=[]){
 const n=runs.length,avg=k=>n?runs.reduce((s,r)=>s+(Number(r[k])||0),0)/n:0;
 const stats={runs:n,score:Math.round(avg('score')*100)/100,editRatio:Math.round(avg('editRatio')*100)/100,acceptance:n?Math.round(runs.filter(r=>r.accepted).length/n*100)/100:0,critical:runs.filter(r=>r.critical).length};
 let level=0;
 for(const m of MATURITY){if(n>=m.runs&&stats.score>=m.score&&stats.editRatio<=m.edit&&stats.acceptance>=m.accept&&(m.level<2||!stats.critical))level=m.level;else break;}
 const next=MATURITY.find(m=>m.level===level+1);
 return {level,name:level?MATURITY[level-1].name:'Not measured yet',...stats,next:next?{level:next.level,name:next.name,needs:`${next.runs} reviewed jobs, average check score ${Math.round(next.score*100)}%+${next.edit<1?`, edits under ${Math.round(next.edit*100)}%`:''}${next.accept?`, ${Math.round(next.accept*100)}%+ accepted`:''}${next.level>=2?', no claim or maths faults':''}`}:null};
}

/** Check one recorded run before it counts toward maturity. */
export function checkRun(run){
 const r={date:clean(run?.date,10),score:Number(run?.score),editRatio:Number(run?.editRatio),accepted:run?.accepted===true,critical:run?.critical===true,source:clean(run?.source,200)};
 const errors=[];
 if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date))errors.push('date: use YYYY-MM-DD.');
 if(!(r.score>=0&&r.score<=1))errors.push('score: the share of checks passed, 0 to 1.');
 if(!(r.editRatio>=0&&r.editRatio<=1))errors.push('editRatio: how much of the draft the person changed, 0 to 1.');
 if(!r.source)errors.push('source: name the job and who reviewed it.');
 if(PRIVATE.test(r.source))errors.push('source: remove private details.');
 if(errors.length)throw Error(errors.join('\n'));
 return r;
}

/** What a role's profile carries: its reviewed rules and the maturity measured from its recorded runs. */
export function roleLearning(learned){
 const rules=(learned?.rules??[]).map(checkRule),{next,...maturity}=roleMaturity((learned?.runs??[]).map(checkRun));
 return {rules,maturity:{...maturity,next:next?.needs??null}};
}
