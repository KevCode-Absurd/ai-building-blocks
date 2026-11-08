// The library, agent marketplace, API and downloaded packs share one contract.
// This module never calls a provider, starts hosted work or changes permissions.
import {buildExecutionPlan, executionQualityMethod, validateProductionQuality} from '../../../../site/src/jobs/execution-quality.mjs';
import {validateJobDocument} from '../../../../site/src/jobs/contracts.mjs';
import {preflightNativeExecution,NATIVE_CAPABILITIES} from '../../../../site/src/jobs/native-execution.mjs';

export const hostToolsSchema = {type:'array',maxItems:30,items:{type:'object',additionalProperties:false,required:['id','capabilities','available','checked_at','availability_receipt','billing'],properties:{id:{type:'string',minLength:1,maxLength:160},capabilities:{type:'array',minItems:1,maxItems:6,uniqueItems:true,items:{type:'string',enum:[...NATIVE_CAPABILITIES]}},available:{type:'boolean'},checked_at:{type:'string',maxLength:40},availability_receipt:{type:'string',minLength:1,maxLength:500},billing:{type:'string',enum:['LOCAL','INCLUDED','PAID']}}}};
/** Bound the host inventory at both REST and MCP boundaries. It is evidence,
 * never a command to invoke these tools or authority to spend. */
export function validHostTools(value:unknown):value is Record<string,unknown>[] {
  return Array.isArray(value)&&value.length<=30&&value.every(tool=>tool&&typeof tool==='object'&&!Array.isArray(tool)&&Object.keys(tool).every(key=>['id','capabilities','available','checked_at','availability_receipt','billing'].includes(key))&&typeof tool.id==='string'&&tool.id.trim().length>0&&tool.id.length<=160&&Array.isArray(tool.capabilities)&&tool.capabilities.length>0&&tool.capabilities.length<=6&&new Set(tool.capabilities).size===tool.capabilities.length&&tool.capabilities.every((capability:unknown)=>typeof capability==='string'&&NATIVE_CAPABILITIES.includes(capability))&&typeof tool.available==='boolean'&&typeof tool.checked_at==='string'&&tool.checked_at.length<=40&&typeof tool.availability_receipt==='string'&&tool.availability_receipt.trim().length>0&&tool.availability_receipt.length<=500&&['LOCAL','INCLUDED','PAID'].includes(tool.billing));
}

export const qualityMethodMarkdown = executionQualityMethod;
export function executionPlan(request: string, tier: 'quick'|'standard'|'deep' = 'standard', hostTools: Record<string,unknown>[] = []) {
  const plan=buildExecutionPlan({request,tier});
  return {
    ...plan,
    native_preflight:preflightNativeExecution({plan,tools:hostTools}),
    resources: {
      library: 'https://useaiblocks.com',
      library_mcp: 'https://useaiblocks.com/mcp',
      agent_mcp: 'https://agents.useaiblocks.com/mcp',
      next_steps: ['Use start_outcome with the original request for the outcome/specification front door.', 'Use get_approaches and propose_team to retrieve the job palette and a task-specific lead.', 'Read full selected skills, workflows and reference files from AI Blocks at pinned revisions.', 'Load the chosen agent seats here, then run and check real artifacts in the connected AI.'],
      production_validation: 'Use this service check_execution_delivery for artifact quality or the library advance_job for the complete phase/state protocol.',
      native_toolkit:'https://useaiblocks.com/packs/native-delivery-toolkit.zip',
    },
  };
}

/** Read-only validation of submitted evidence, never independent certification. */
export function checkExecutionDelivery(request: string, production: Record<string,unknown>, card: Record<string,unknown>, team: Record<string,unknown>) {
  const plan = executionPlan(request);
  const scoped = {...card,request_verbatim:request,...(plan.task_type==='image_ads'||plan.task_type==='mixed_visual'?{visual_spec:card.visual_spec??{references:[]}}:{})};
  const structure = validateJobDocument('ai-blocks-production/1',production,{card:scoped,team});
  if(!structure.ok)return {schema:'ai-blocks-execution-check/1',ok:false,errors:structure.errors,warnings:structure.warnings,assurance:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED',model_calls:0,hosted_execution:false,stored_by_service:false};
  const quality = validateProductionQuality({document:production,card:scoped,team,plan,require_trace:true});
  return {schema:'ai-blocks-execution-check/1',ok:structure.ok&&quality.ok,errors:[...structure.errors,...quality.errors],warnings:structure.warnings,assurance:quality.assurance,model_calls:0,hosted_execution:false,stored_by_service:false};
}
