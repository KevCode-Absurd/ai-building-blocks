import {pageTitle,trimDescription,clean} from '../../src/lib/seo-meta.mjs';
import {roleHeading,roleOpening,sentenceName,startsWithOrder} from '../../src/roles/role-copy.mjs';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const list=rows=>`<ul>${rows.map(s=>`<li>${s}</li>`).join('')}</ul>`;
const cut=(s,max)=>s.length<=max?s:s.slice(0,max+1).replace(/\s+\S*$/,'').replace(/[\s.,;:&-]+$/,'');
const roleTitle=r=>{
 const heading=roleHeading(r.name),title=pageTitle(heading,['free, works in your own AI','free, runs in your AI','free and runs in your AI','free to use','free']);
 if(title.endsWith(' | AI Blocks')&&title.length>=50)return title;
 // A long name keeps its start and its last three words: "Hire an AI staff policy… and rollout writer | AI Blocks".
 const phrase=sentenceName(r.name),tail=phrase.split(' ').slice(-3).join(' ');
 for(const prefix of /^AI\b/.test(phrase)?['Hire an ','Hire ']:['Hire an AI ','Hire ']){
  const room=60-prefix.length-' | AI Blocks'.length,short=phrase.length<=room?phrase:tail.length<room-8?`${cut(phrase,room-tail.length-2)}… ${tail}`:cut(phrase,room);
  const t=`${prefix}${short} | AI Blocks`;if(t.length>=50&&t.length<=60)return t;
 }
 return title.endsWith(' | AI Blocks')?title:`Hire ${cut(phrase,43)} | AI Blocks`;
};
const fitDescription=text=>{
 const raw=clean(text);
 const sentence=trimDescription(raw);return sentence.length>=120?sentence:cut(raw,154)+'…';
};
const lower=s=>sentenceName(String(s??'').replace(/[.\s]+$/,''));
// Each description is the role's own words: the heading and summary, then what you get, then what you give.
const roleDescription=r=>{
 const o=roleOpening(r),parts=[`${o.heading}, free.`,o.summary];
 // Then, while it is still short, more of the role's own facts, never a shared closing sentence.
 const more=[!/\b(You get|Get)\b/.test(o.summary)&&o.get[0]?`You get ${lower(o.get[0])}.`:'',
  !/\b(Give it|Share|Paste|Tell it|Describe)\b/.test(o.summary)&&o.give[0]&&!startsWithOrder(o.give[0])?`It works from ${lower(o.give[0])}.`:'',
  ...o.get.slice(1).map(g=>`It also hands back ${lower(g)}.`),o.example?.situation?`Use it when: ${lower(o.example.situation)}`:''].filter(Boolean);
 for(const m of more){if(parts.join(' ').length>=125)break;parts.push(m);}
 return fitDescription(parts.join(' '));
};
const hub=r=>r.family?.id&&r.family.id!=='other';
// The top of the page in plain words; everything else sits under one Details, as on skill pages.
const openingHtml=(r,o)=>[
 `<section class="role-start"><h2>What you give</h2>${list(o.give.map(esc))}<h2>What you get</h2>${list(o.get.map(esc))}</section>`,
 o.example?`<section><h2>An example</h2>${o.example.situation?`<p>${esc(o.example.situation)}</p>`:''}<p>You ask: “${esc(o.example.task)}”</p>${o.example.outputs.length?`<p>You get back:</p>${list(o.example.outputs.map(x=>`<b>${esc(x.name)}</b>. ${esc(x.contains)}`))}`:''}<p class="small">An example, not your task.</p></section>`:'',
 o.terms.length?`<section><h2>Words used here</h2>${list(o.terms.map(t=>`<b>${esc(t.term)}</b>: ${esc(t.meaning)}`))}</section>`:'',
 `<section><h2>Hire this specialist</h2><p>It is free and needs no account. Download the pack, give it to your AI and tell it the job. Your AI asks for anything it is missing, then does the work and checks it.</p><p><a href="/specialists/${esc(r.id)}-base-specialist.zip" download>Download the specialist</a></p></section>`,
 r.related?.length||hub(r)?`<section><h2>Related specialists</h2>${r.related?.length?list(r.related.map(x=>`<a href="/roles/${esc(x.id)}">${esc(x.name)}</a>`)):''}${hub(r)?`<p><a href="/jobs/${esc(r.family.id)}">Skills and workflows for this job: ${esc(r.family.name)}</a></p>`:''}</section>`:'',
].join('');
const detailsHtml=r=>`<details id="details"><summary><h2>Details</h2></summary>`
 +`<section><h3>Everything it can hand back</h3><p>Your task sets the actual outputs. The specialist picks the methods that cover them.</p>${list(r.deliverables.map(esc))}</section>`
 +expertiseHtml(r)
 +`<section><h3>Capabilities</h3>${list(r.capabilities.map(c=>`<b>${esc(c.name)}</b>. ${esc(c.description)}`))}</section>`
 +`<section><h3>How the role works</h3><ol><li>Checks your task, context and available tools.</li><li>Picks the methods needed and prepares a work plan.</li><li>Carries out supported tasks, with each method's limits and review gates.</li><li>Checks the real deliverables and corrects supported faults.</li><li>Hands back files, evidence and unresolved gaps.</li></ol></section>`
 +workerOverview(r)
 +`<section><h3>Inputs and helpful context</h3><p>The specialist starts from the task brief. Only active methods require their inputs.</p><h4>For the primary method, when used</h4>${list(r.inputs.map(esc))}${r.helpfulInputs.length?`<h4>Helpful context (optional)</h4>${list(r.helpfulInputs.map(esc))}`:''}${r.tools.length?`<h4>Tools and access</h4>${list(r.tools.map(esc))}`:''}</section>`
 +`<section><h3>Functions and deliverables</h3>${list(r.resources.map(s=>`<a href="${s.path}">${esc(s.name)}</a>: ${esc(s.summary)}${list((r.functions.find(f=>f.method===s.slug)?.deliverables??[]).map(esc))}${s.by?` Source: ${esc(s.by)}${s.license?`, ${esc(s.license)}`:''}.`:''}`))}</section>`
 +`<section><h3>Tasks you can use it for</h3>${list(r.fit.map(esc))}<h3>Limits to check before starting</h3>${list(r.limits.map(esc))}</section>`
 +`<section><h3>Best way to use this role</h3><p>Give it one clear outcome, the actual files and a definition of done. Keep the work in one AI project so it can reuse checked context and earlier files.</p>${list(r.method.map(esc))}</section>`
 +`<section><h3>Read it as data</h3><p><a href="/api/v1/specialists/${r.id}">Read the complete role setup as JSON</a>. Connect your AI to the <a href="/api-and-mcp">AI Blocks MCP library</a> and read aiblocks://roles/${r.id} for its role instructions and pinned sources.</p><p>This is a prepared AI role. No task has run. Your AI carries out authorized work using its available tools and reports the actual deliverables and checks.</p></section>`
 +`</details>`;
const workerOverview=r=>`<section><h3>Your specialist's working setup</h3><p>Download the base specialist without a task form or account. README.md and SETUP.md explain how to use the folder. SOUL.md defines its scope. INTAKE.md asks missing questions inside your AI. PLAYBOOK.md, SKILLS.md, BEST_PRACTICES.md, CHECKS.md and HANDOFF.md guide the work and its checked deliverables.</p><p>Complete associated skills, supporting files and licences are included. Choose only the methods needed for the actual task. Keep context, working files and accepted feedback in your AI project.</p><h3>Use this specialist through MCP or the API</h3><p>Call prepare_specialist with role_id ${esc(r.id)} only. No task is required to load it. Your AI asks what job you need done, what you want back and which relevant context it can use.</p><p>For task-led hiring, call find_specialist, explain the suggested specialists and let the user accept or change the team.</p><p>Complete ZIP: <a href="/specialists/${esc(r.id)}-base-specialist.zip" download>Download base specialist</a>. API: GET /api/v1/specialists/${esc(r.id)}/pack. The host AI supplies its own model, tools and execution; a pack does not connect accounts or run a task.</p></section>`;
const expertiseHtml=r=>{
 const e=r.expertise,x=r.workedExample,ev=r.evaluation,minds=(r.resources??[]).filter(m=>m.reviewer);
 return (e?`<section><h3>How it does the job well</h3>${list(e.principles.map(esc))}${e.pitfalls.length?`<h4>Mistakes it avoids</h4>${list(e.pitfalls.map(esc))}`:''}</section>`:'')
  +(x?.outputs?.length?`<section><h3>What a good result looks like</h3><p>An example, not your task: ${esc(x.situation)}</p>${list(x.outputs.map(o=>`<b>${esc(o.name)}</b>. ${esc(o.contains)}`))}</section>`:'')
  +(ev?`<section><h3>How the work is checked</h3>${list(ev.rubric.map(c=>c.criterion).filter(c=>!c.startsWith('Delivers: ')).map(esc))}<p>${ev.status==='NOT_RUN'?'These checks have not been run against a model yet. Your AI uses them to check its own work.':esc(ev.note)}</p></section>`:'')
  +(minds.length?`<section><h3>A second opinion</h3><p>Before it hands back, your AI reviews the draft the way ${minds.map(m=>`<a href="${m.path}">${esc(m.name)}</a>`).join(' and ')} would. This is a way of reviewing the work. It does not mean they wrote or endorse it.</p></section>`:'');
};
export function rolePage(url,index,load){
 if(!/^\/roles(?:\/|$)/.test(url))return null;
 const page=url==='/roles'?1:Number(url.match(/^\/roles\/page\/([1-9]\d*)$/)?.[1]??0);
 if(page){
  const pages=Math.ceil(index.roles.length/24);if(page>pages)return null;
  const rows=index.roles.slice((page-1)*24,page*24),h1='Hire an AI specialist';
  const nav=`<nav class="hub-pages" aria-label="Role pages">${Array.from({length:pages},(_,i)=>i===page-1?`<b aria-current="page">Page ${i+1}</b>`:`<a href="${i?`/roles/page/${i+1}`:'/roles'}">Page ${i+1}</a>`).join('')}</nav>`;
  const body=rows.map(r=>`<li class="role-card"><p>${esc(index.areas.find(a=>a.id===r.area)?.name)}</p><h2><a href="/roles/${r.id}">${esc(r.name)}</a></h2><p>${esc(r.summary)}</p>${list(r.deliverables.slice(0,2).map(esc))}<p>Uses ${r.resourceCount} tested ${r.resourceCount===1?'method':'methods'}</p><a href="/roles/${r.id}">${esc(roleHeading(r.name))}</a></li>`).join('');
  return {title:`AI specialist roles${page>1?`, page ${page}`:''}`,documentTitle:pageTitle(page===1?'Hire an AI specialist':`AI specialist roles, page ${page}`,['roles and work packs','skills, methods and work packs','role setups']),h1,
   desc:fitDescription(`${page>1?`Page ${page} of ${pages}. `:''}Hire an AI ${rows.slice(0,2).map(r=>sentenceName(r.name)).join(' or ')}, free. Download the specialist and give it your job inside your own AI.`),
   crumbs:page>1?[['AI specialists','/roles']]:[],collection:true,
   content:`<header class="role-opening"><h1 id="role-heading">${h1}</h1><p>Pick a specialist for coding, design, support and more. Download it, then give it the job inside your AI.</p><p><a href="/teams">Not sure? Describe your task</a></p><p>${index.roles.length.toLocaleString('en-US')} specialists across ${index.areas.length-1} areas.</p></header>${nav}<ul class="role-grid">${body}</ul>${nav}<h2>How hiring a specialist works</h2><ol><li>Choose a specialist and read what you give it and what you get.</li><li>Download the pack and give your AI access to its files.</li><li>Tell your AI the job and desired output; it asks only missing essentials and checks the work.</li></ol><p>Your AI checks context and tool access, makes the work plan, carries out supported tasks and reports the real files and checks. A setup does not mean work has already run.</p>`,
   main:{'@type':'ItemList',numberOfItems:rows.length,itemListElement:rows.map((r,i)=>({'@type':'ListItem',position:(page-1)*24+i+1,name:r.name,url:`https://useaiblocks.com/roles/${r.id}`}))}};
 }
 const id=url.match(/^\/roles\/([a-z0-9][a-z0-9-]{0,69})$/)?.[1];if(!id||!index.roles.some(r=>r.id===id))return null;
 const r=load(id),o=roleOpening(r),h1=o.heading;
 return {title:`${r.name}, AI specialist`,documentTitle:roleTitle(r),h1,
  desc:roleDescription(r),crumbs:[['AI specialists','/roles']],json:`/data/roles/${id}.json`,
  content:`<header class="role-opening"><p><a href="/roles">All AI specialists</a></p><h1 id="role-heading">${esc(h1)}</h1><p>${esc(o.summary)}</p></header>${openingHtml(r,o)}${detailsHtml(r)}`,
  main:{'@type':'CreativeWork',name:`${r.name}, AI specialist`,genre:'AI specialist',description:r.summary,author:{'@type':'Organization',name:'AI Blocks',url:'https://useaiblocks.com'},isAccessibleForFree:true,isBasedOn:r.resources.map(s=>({'@type':'CreativeWork',name:s.name,url:`https://useaiblocks.com${s.path}`}))}};
}
