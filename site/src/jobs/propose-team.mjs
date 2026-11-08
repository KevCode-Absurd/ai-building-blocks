// Deterministic staffing only. The host runs the seats; no hosted model work.
import {classifyJob} from './router.mjs';
import {rankRoles,rerankDiverse} from '../roles/specialist-matching.mjs';
import {discoverStudioFormats,isStaticAdRequest} from './studio-discovery.mjs';
const array=value=>Array.isArray(value)?value:[];
const unique=values=>[...new Set(values)];
const text=value=>typeof value==='string'?value.trim():'';
const canonical=value=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}':JSON.stringify(value);
// Stable display identity, not an integrity signature. The job engine checks
// document digests and replays structural rules; all work remains host-reported.
const identity=value=>{let first=2166136261,second=5381;for(const char of canonical(value)){first=Math.imul(first^char.charCodeAt(0),16777619);second=Math.imul(second,33)^char.charCodeAt(0);}return (first>>>0).toString(16).padStart(8,'0')+(second>>>0).toString(16).padStart(8,'0');};
export const TEAM_TIERS={quick:{seats:[3,4],council_rounds:0,token_multiple:[1.5,2],revision_loops:0},standard:{seats:[5,7],council_rounds:1,token_multiple:[2.5,4],revision_loops:1},deep:{seats:[8,12],council_rounds:2,token_multiple:[5,8],revision_loops:2}};

/** Retrieve explicit families. Free-text classification uses catalogue words,
 * not job-specific engine rules; an unknown job remains an honest empty result. */
export function getApproaches(index={},query={},context={}) {
 if(!index||typeof index!=='object')index={};
 if(!query||typeof query!=='object'&&typeof query!=='string')query={};
 if(typeof query==='string')query={job:query};
 const jobs=index.jobs??{},named=text(query.job);
 if(named)return {schema:'ai-blocks-approach-result/1',job:named,...(jobs[named]??{families:[],lenses:[],coverage:{status:'UNKNOWN_JOB'}}),...(named==='make-image-ads'?{studio:discoverStudioFormats(context)}:{}),model_calls:0};
 const request=query.task??query.request,classification=classifyJob(request,index);
 if(isStaticAdRequest(request)&&jobs['make-image-ads']){if(classification.job&&classification.job!=='make-image-ads')classification.alternatives=[classification.job,...classification.alternatives.filter(x=>x!==classification.job&&x!=='make-image-ads')].slice(0,3);classification.job='make-image-ads';}
 const entry=classification.job?jobs[classification.job]:null;
 return {schema:'ai-blocks-approach-result/1',job:classification.job,...(entry??{families:[],lenses:[],coverage:{status:'NO_MATCH'}}),...(classification.job==='make-image-ads'?{studio:discoverStudioFormats(context)}:{}),alternatives:classification.alternatives,model_calls:0};
}

function normalRoles(input) {
 const rows=Array.isArray(input)?input:array(input?.roles);
 const profiles=Array.isArray(input?.profiles)?new Map(input.profiles.map(profile=>[profile.id,profile])):new Map(Object.entries(input?.profiles??{}).filter(([,value])=>value&&typeof value==='object'&&value.id));
 // Search cards intentionally carry only three deliverables. Keep that ranking
 // text when full profiles arrive so hydration cannot silently change a roster.
 return rows.filter(row=>row&&typeof row.id==='string').map(row=>({...row,...(profiles.get(row.id)??{}),deliverables:row.deliverables??profiles.get(row.id)?.deliverables??[]}));
}
function personaRows(input) {
 return Array.isArray(input)?input:Array.isArray(input?.personas)?input.personas:Array.isArray(input?.agents)?input.agents:[];
}
function selectPersona(personas,role,type,lens,used) {
 return personas.filter(persona=>persona&&typeof persona.id==='string'&&!used.has(persona.id)).map(persona=>{
  const facets=persona.team??persona.facets??persona;
  const exact=array(facets.roles??facets.role_ids).includes(role.id),familyMatch=array(facets.families).some(family=>array(role.families).includes(family)),department=facets.department&&facets.department===role.department;
  const suitable=array(facets.seat_suitability).includes(type),relevant=exact||familyMatch||department;
  return {persona,eligible:suitable&&relevant&&(role.id!=='general-coordinator'||exact),score:(exact?10:0)+(suitable?5:0)+(familyMatch?4:0)+(array(facets.lenses).includes(lens)?2:0)+(department?1:0)};
 }).filter(row=>row.eligible).sort((a,b)=>b.score-a.score||a.persona.id.localeCompare(b.persona.id))[0]?.persona;
}

/** A proposal chooses a general intake coordinator, then a task-specific lead.
 * No fixed department heads are installed. Makers may also own independent
 * strategies; the judge and fact checker never make the work they review. */
export function proposeTeam(input={},context={}) {
 if(!input||typeof input!=='object'||Array.isArray(input))input={};
 if(!context||typeof context!=='object'||Array.isArray(context))context={};
 const task=text(input.task??input.request??input.job_card?.job_to_be_done),roles=normalRoles(context.roles),warnings=[],errors=[];
 const tier=input.tier??input.job_card?.dials?.depth?.value??'standard',config=TEAM_TIERS[tier];
 if(!task||task.length>8000)errors.push({path:'task',message:'Describe the job in 1 to 8,000 characters.'});
 if(!config)errors.push({path:'tier',message:'Choose quick, standard or deep.'});
 if(!roles.length)errors.push({path:'roles',message:'No role inventory is available.'});
 if(errors.length)return {schema:'ai-blocks-team-proposal/1',ok:false,errors,warnings,seats:[],model_calls:0};
 const approachResult=getApproaches(context.approaches??{},{job:text(input.job??input.job_card?.job_type?.job),task},context);
 const familyPool=array(approachResult.families),chosenFamilies=input.job_card?.dials?.families?.value;
 const families=Array.isArray(chosenFamilies)?familyPool.filter(family=>chosenFamilies.includes(family.id)):familyPool;
 if(!families.length)warnings.push({path:'families',message:'This job has no reviewed approach mapping yet. Do not claim a variety pass until real families have been mapped.'});
 if(context.approaches?.review_status&&context.approaches.review_status!=='REVIEWED')warnings.push({path:'approaches',message:'Approach mappings are source-seeded and still need review.'});
 const index={roles},ranked=rankRoles(index,task),rankedIds=new Set(ranked.map(row=>row.role.id));
 const workDepartment=ranked[0]?.role.department??ranked[0]?.role.area;
 const all=[...ranked,...roles.filter(role=>!rankedIds.has(role.id)).sort((a,b)=>a.id.localeCompare(b.id)).map(role=>({role,score:0,matched:[]}))];
 const diverse=rerankDiverse(ranked.slice(0,60));
 const usedRoles=new Set(),usedPersonas=new Set(),personas=personaRows(context.personas),seats=[];
 const inventory=Array.isArray(context.items)?context.items:array(context.items?.blocks);
 const bySlug=new Map(inventory.map(item=>[item.slug,item]));
 const revisions=context.manifest?.resources??context.items?.resources??context.items?.manifest?.resources??{};
 const knownRevision=slug=>revisions[slug]?.revision_sha256??context.approaches?.revisions?.[slug]??bySlug.get(slug)?.revision_sha256;
 const choose=(types,{general=false,prefer=[]}={})=>{
  const candidates=all.filter(row=>!usedRoles.has(row.role.id));
  const suitable=candidates.filter(row=>array(row.role.seat_suitability).includes(types[0]));
  const pool=suitable.length?suitable:candidates;
  if(general)pool.sort((a,b)=>Number(b.role.id==='general-coordinator')-Number(a.role.id==='general-coordinator')||Number(/coordinator|chief-of-staff|executive-assistant|project-manager/.test(b.role.id))-Number(/coordinator|chief-of-staff|executive-assistant|project-manager/.test(a.role.id))||a.role.id.localeCompare(b.role.id));
  else if(prefer.length)pool.sort((a,b)=>{const ai=prefer.indexOf(a.role.id),bi=prefer.indexOf(b.role.id);return (ai<0?1e6:ai)-(bi<0?1e6:bi)||b.score-a.score||a.role.id.localeCompare(b.role.id);});
  else pool.sort((a,b)=>Number(b.role.job===approachResult.job)-Number(a.role.job===approachResult.job)||Number((b.role.department??b.role.area)===workDepartment)-Number((a.role.department??a.role.area)===workDepartment)||b.score-a.score||a.role.id.localeCompare(b.role.id));
  const row=pool[0];
  if(row&&!suitable.length)warnings.push({path:'seats',message:`The ${types[0]} seat uses ${row.role.id}; its suitability needs a host check.`});
  return row?.role;
 };
 const add=(type,types,{general=false,lens,familyIds=[],prefer=[]}={})=>{
  const role=choose(types,{general,prefer});
  if(!role){errors.push({path:'seats',message:'No independent role remains for '+type+'.'});return null;}
  usedRoles.add(role.id);
  const id='s'+(seats.length+1),ownedFamilies=families.filter(family=>familyIds.includes(family.id));
  const required=unique(ownedFamilies.flatMap(family=>['items','pickers','checks','tool_guides','supporting_items'].flatMap(field=>array(family[field]))));
  const palette=array(role.extended).length?role.extended:array(role.resources).map(item=>({slug:item.slug,revision_sha256:item.revision??item.revision_sha256}));
  const pins=new Map(palette.filter(item=>item?.slug&&/^[a-f0-9]{64}$/.test(item.revision_sha256??'')).map(item=>[item.slug,item.revision_sha256]));
  for(const slug of required){const revision=knownRevision(slug);if(/^[a-f0-9]{64}$/.test(revision??''))pins.set(slug,revision);else warnings.push({path:`seats.${id}.toolbox`,message:'Missing catalogue revision for '+slug+'. Load its current revision before staffing.'});}
  const persona=selectPersona(personas,role,type,lens,usedPersonas);
  if(persona)usedPersonas.add(persona.id);
  const tools=unique(ownedFamilies.flatMap(family=>array(family.tools_needed))),available=array(input.host_capabilities?.tools);
  const unavailable=tools.filter(tool=>!available.includes(tool));
  const seat={seat_id:id,seat_type:type,seat_types:unique([type,...types]),role_id:role.id,persona_id:persona?.id??null,mind_ids:[],lens:lens??array(role.lenses)[0]??'operator',families:ownedFamilies.map(family=>family.id),toolbox:[...pins].sort(([a],[b])=>a.localeCompare(b)).map(([slug,revision_sha256])=>({slug,revision_sha256,why:required.includes(slug)?'Assigned family palette':'Role core or extended palette'})),tools_needed:tools,budget:{max_tool_calls:tier==='deep'?60:tier==='quick'?12:40,max_generations:tier==='deep'?12:tier==='quick'?3:6},responsibilities:[],...(unavailable.length?{unavailable_tools:unavailable,fallback:'brief_only'}:{})};
  if(!persona)warnings.push({path:`seats.${id}.persona_id`,message:'No mapped house persona is available for this seat. Use the role brief and label the missing persona.'});
  seats.push(seat);return seat;
 };
 const coordinator=add('coordinator',['coordinator'],{general:true,lens:'operator'});
 if(coordinator)coordinator.responsibilities=['Clarify the user and the job to be done','Agree measurable acceptance criteria and dials','Choose the task lead and resolve council decisions','Check the delivery against the agreed job'];
 const makerCount=tier==='deep'?4:2;
 const makerIds=diverse.map(row=>row.role.id);
 const makers=[];
 for(let n=0;n<makerCount;n++) {
  const assigned=families.filter((_,index)=>index%makerCount===n).map(family=>family.id);
  const familyRoles=roles.filter(role=>array(role.families).some(family=>assigned.includes(family))).sort((a,b)=>(ranked.find(row=>row.role.id===b.id)?.score??0)-(ranked.find(row=>row.role.id===a.id)?.score??0)||a.id.localeCompare(b.id));
  const creativeRoles=approachResult.job==='make-image-ads'?[n===0?'design-specialist':'scroll-stopping-image-ads']:[];
  const preferred=[...creativeRoles.filter(id=>roles.some(role=>role.id===id)),...familyRoles.map(role=>role.id),...makerIds];
  const maker=add('maker',['maker','strategist'],{lens:['craft','customer','growth','outsider'][n],familyIds:assigned,prefer:preferred});
  if(maker){maker.responsibilities=['Write a rival route before reading other proposals','Produce the assigned families in their own pipelines','Run each method in full and record evidence'];makers.push(maker);}
 }
 if(approachResult.studio)for(const maker of makers){
  const refs=[...approachResult.studio.visual_worlds,...approachResult.studio.image_variants].map(row=>row.method).concat(approachResult.studio.formats.filter(row=>row.medium==='image').flatMap(row=>row.related_methods)).filter(ref=>ref.status==='AVAILABLE');
  for(const ref of refs)if(!maker.toolbox.some(pin=>pin.slug===ref.slug))maker.toolbox.push({slug:ref.slug,revision_sha256:ref.revision_sha256,why:'Studio creative format palette; load selected methods in full'});
  maker.toolbox.sort((a,b)=>a.slug.localeCompare(b.slug));
  maker.responsibilities.push('Inspect the complete Studio format and visual-world palette; select and load relevant pinned methods and actual renderer capability.');
  const requested=array(input.job_card?.deliverables).reduce((n,row)=>n+(Number.isSafeInteger(row?.count)&&row.count>0?row.count:0),0);
  if(requested)maker.budget.max_generations=Math.max(maker.budget.max_generations,Math.ceil(requested/Math.max(1,makers.length)));
 }
 const lead=[...makers].sort((a,b)=>(ranked.find(row=>row.role.id===b.role_id)?.score??0)-(ranked.find(row=>row.role.id===a.role_id)?.score??0)||a.role_id.localeCompare(b.role_id))[0]??null;
 if(lead)lead.responsibilities.unshift('Lead production for this request and coordinate makers');
 if(tier!=='quick') {
  const red=add('red_team',['red_team','strategist'],{lens:'sceptic',prefer:approachResult.job==='make-image-ads'&&roles.some(role=>role.id==='media-buyer')?['media-buyer']:[]});if(red)red.responsibilities=['Offer an independent rival route','Attack the leading choice and defend the weakest viable option'];
  if(red?.role_id==='media-buyer'&&approachResult.studio){const refs=[...approachResult.studio.visual_worlds,...approachResult.studio.image_variants].map(row=>row.method).concat(approachResult.studio.formats.filter(row=>row.medium==='image').flatMap(row=>row.related_methods)).filter(ref=>ref.status==='AVAILABLE');for(const ref of refs)if(!red.toolbox.some(pin=>pin.slug===ref.slug))red.toolbox.push({slug:ref.slug,revision_sha256:ref.revision_sha256,why:'Studio creative format palette for media review'});red.toolbox.sort((a,b)=>a.slug.localeCompare(b.slug));red.responsibilities.push('Review the relevant Studio format palette against the buyer and test plan.');}
  const fact=add('fact_checker',['fact_checker'],{lens:'numbers'});if(fact)fact.responsibilities=['Trace factual claims to sources','Downgrade claims that cannot be checked'];
 }
 const judges=[];
 for(let n=0;n<(tier==='deep'?2:1);n++) {
  const judge=add('judge',tier==='quick'?['judge','fact_checker']:['judge'],{lens:n?'customer':'legal-and-safety'});
  if(judge){judge.responsibilities=['Review deliverables in a fresh context without council minutes','Quote the work and score the agreed rubric'];judges.push(judge);}
 }
 if(tier!=='quick') {
  const critic=add('critic',['critic'],{lens:'brand-guardian'});if(critic)critic.responsibilities=['Challenge proposals through an independent discipline','Record the strongest dissent in plain language'];
 }
 const proposal={schema:'ai-blocks-team-proposal/1',ok:errors.length===0,job:approachResult.job,tier,goal:task,coordinator_seat_id:coordinator?.seat_id??null,lead_seat_id:lead?.seat_id??null,seats,...(approachResult.studio?{studio_discovery:approachResult.studio}:{}),working_groups:[{id:'production',lead_seat_id:lead?.seat_id??null,members:makers.map(seat=>seat.seat_id),reports_to:coordinator?.seat_id??null},{id:'independent-review',lead_seat_id:judges[0]?.seat_id??null,members:seats.filter(seat=>['judge','fact_checker','critic'].includes(seat.seat_type)).map(seat=>seat.seat_id),reports_to:coordinator?.seat_id??null}],estimate:{seats:seats.length,council_rounds:config.council_rounds,token_multiple:config.token_multiple,source:'estimated'},errors,warnings,model_calls:0,verification:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED'};
 return {...proposal,proposal_id:'tp_'+identity(proposal)};
}

export function buildOrgChart({roles=[],personas=[]}={}) {
 const groups=new Map();
 for(const role of normalRoles(roles)){const department=role.department??role.area??'specialist';if(!groups.has(department))groups.set(department,[]);groups.get(department).push({id:role.id,name:role.name,summary:role.summary,seat_suitability:array(role.seat_suitability),families:array(role.families),lenses:array(role.lenses),personas:personaRows(personas).filter(persona=>array((persona.team??persona.facets??persona).roles??(persona.team??persona.facets??persona).role_ids).includes(role.id)).map(persona=>({id:persona.id,name:persona.name}))});}
 return {schema:'ai-blocks-org-chart/1',staffing:'General coordinator; task-specific lead selected for each request',departments:[...groups].sort(([a],[b])=>a.localeCompare(b)).map(([id,rows])=>({id,roles:rows.sort((a,b)=>a.id.localeCompare(b.id))})),model_calls:0};
}
