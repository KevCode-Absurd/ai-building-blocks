// Shared preflight only: tool availability is reported by the connected host.
// This module calls no model, tool, command, network or storage operation.
export const NATIVE_PREFLIGHT_SCHEMA='ai-blocks-native-preflight/1';
export const NATIVE_CAPABILITIES=Object.freeze(['source_edit','project_build','browser_preview','raster_generation','raster_inspection','semantic_review']);
const list=value=>Array.isArray(value)?value:[];
const text=value=>typeof value==='string'&&value.trim().length>0;

export function nativeExecutionRequirements(plan={}) {
 const required=[];
 if(plan.landing_pages?.requested&&plan.landing_pages.delivery_mode==='LAUNCHABLE_SITE')required.push('source_edit','project_build','browser_preview','semantic_review');
 if(plan.images?.required)required.push('raster_generation','raster_inspection','semantic_review');
 return [...new Set(required)];
}

/** A tool name/persona/method is not an available executor. The host must report
 * its actual callable tool, capability, availability check and charging mode.
 * This is an early blocker, never an attestation that later work occurred. */
export function preflightNativeExecution({plan={},tools=[],allow_paid=false,now=Date.now()}={}) {
 const required=nativeExecutionRequirements(plan),errors=[],selected=[];
 for(const capability of required) {
  const candidates=list(tools).filter(tool=>list(tool?.capabilities).includes(capability));
  const tool=candidates.find(tool=>text(tool?.id)&&tool.available===true&&text(tool.checked_at)&&Number.isFinite(Date.parse(tool.checked_at))&&Date.parse(tool.checked_at)<=now+5*60*1000&&now-Date.parse(tool.checked_at)<=60*60*1000&&text(tool.availability_receipt)&&['INCLUDED','LOCAL','PAID'].includes(tool.billing)&&(tool.billing!=='PAID'||allow_paid===true));
  if(tool)selected.push({capability,tool_id:tool.id,billing:tool.billing,checked_at:tool.checked_at,availability_receipt:tool.availability_receipt});
  else errors.push({code:candidates.some(tool=>tool?.available===true&&tool.billing==='PAID')&&!allow_paid?'PAID_TOOL_NOT_AUTHORIZED':'MISSING_NATIVE_CAPABILITY',path:capability,message:`Provide an available ${capability} tool with its availability-check receipt before production begins. Do not silently replace the requested native deliverable.`});
 }
 return {schema:NATIVE_PREFLIGHT_SCHEMA,status:errors.length?'BLOCKED':required.length?'READY_FOR_HOST_EXECUTION':'NOT_REQUIRED',required,selected,errors,model_calls:0,assurance:'HOST_REPORTED_AVAILABILITY_NOT_EXECUTION',verification_limit:'The connected host reports tool availability. This preflight does not call tools, generate artifacts, grant action authority, verify account balances, or establish quality. Recheck when the host or tool availability changes.'};
}
