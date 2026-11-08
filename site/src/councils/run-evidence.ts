// Display a bounded local record. This is not engine replay, attestation or approval.
const object=(value:unknown):Record<string,any>=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
const rows=(value:unknown):Record<string,any>[]=>Array.isArray(value)?value.slice(0,100).map(object):[];
const text=(value:unknown,fallback='Not reported')=>typeof value==='string'?value.slice(0,4000):fallback;
export function readRunEvidence(raw:string){
 if(new TextEncoder().encode(raw).length>240000)throw Error('Keep the job-state record under 240 KB. Keep source files in your project.');
 let parsed;try{parsed=JSON.parse(raw);}catch{throw Error('Choose a valid job-state JSON file.');}
 const state=object(object(parsed).state??parsed);
 if(!['ai-blocks-job-state/1','ai-blocks-job-state/2'].includes(state.schema)||!Array.isArray(state.history)||state.history.length>60||typeof object(state.base).request!=='string'||!state.base.request.trim())throw Error('Choose the complete job state returned by AI Blocks, or a response containing state.');
 const latest=(event:string)=>object([...state.history].reverse().find(entry=>object(entry).event===event)?.document);
 const production=latest('produce'),trace=object(production.source_trace),decision=object(latest('council').alternative_decision);
 return {
  request:text(state.base.request),policy:Number(object(state.base.quality_policy).version)||0,
  context:rows(trace.context).map(source=>({id:text(source.id),ref:text(source.ref),status:text(source.status),observation:text(source.observation),limitation:text(source.limitation,'')})),
  methods:rows(trace.methods).map(method=>({slug:text(method.slug),revision:text(method.revision_sha256),reason:text(method.reason),status:text(object(method.execution).status),observation:text(object(method.execution).observation, text(object(method.execution).reason)),resources:rows(method.resources).map(file=>({path:text(file.path),sha256:text(file.sha256),status:text(file.status)}))})),
  alternatives:rows(decision.comparisons).map(route=>({id:text(route.route_id),strength:text(route.strength),tradeoff:text(route.tradeoff),wins_if:text(route.wins_if),test:text(route.test),criteria:rows(route.criteria).map(criterion=>({id:text(criterion.id),status:text(criterion.status),basis:text(criterion.basis)}))})),
  choice:Array.isArray(decision.chosen)?decision.chosen.filter((value:unknown)=>typeof value==='string').slice(0,100).join(', '):'Not reported',reason:text(decision.reason),dissent:text(decision.dissent),
  artifacts:rows(production.artifacts).map(artifact=>({path:text(artifact.path),sha256:text(artifact.sha256),checks:rows(artifact.checks).map(check=>({id:text(check.id),status:text(check.status)}))})),
  tools:rows(object(state.base.host_capabilities).native_tools).map(tool=>({id:text(tool.id),available:tool.available===true,checked_at:text(tool.checked_at),billing:text(tool.billing)})),
 };
}
