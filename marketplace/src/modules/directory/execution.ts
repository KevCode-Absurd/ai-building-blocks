// The library, agent marketplace, API and downloaded packs share one contract.
// This module never calls a provider, starts hosted work or changes permissions.
import {buildExecutionPlan, executionQualityMethod, validateProductionQuality} from '../../../../site/src/jobs/execution-quality.mjs';
import {validateJobDocument} from '../../../../site/src/jobs/contracts.mjs';

export const qualityMethodMarkdown = executionQualityMethod;
export function executionPlan(request: string, tier: 'quick'|'standard'|'deep' = 'standard') {
  return {
    ...buildExecutionPlan({request,tier}),
    resources: {
      library: 'https://useaiblocks.com',
      library_mcp: 'https://useaiblocks.com/mcp',
      agent_mcp: 'https://agents.useaiblocks.com/mcp',
      next_steps: ['Use start_outcome with the original request for the outcome/specification front door.', 'Use get_approaches and propose_team to retrieve the job palette and a task-specific lead.', 'Read full selected skills, workflows and reference files from AI Blocks at pinned revisions.', 'Load the chosen agent seats here, then run and check real artifacts in the connected AI.'],
      production_validation: 'Use this service check_execution_delivery for artifact quality or the library advance_job for the complete phase/state protocol.',
    },
  };
}

/** Read-only validation of submitted evidence, never independent certification. */
export function checkExecutionDelivery(request: string, production: Record<string,unknown>, card: Record<string,unknown>, team: Record<string,unknown>) {
  const plan = executionPlan(request);
  const scoped = {...card,request_verbatim:request,...(plan.task_type==='image_ads'||plan.task_type==='mixed_visual'?{visual_spec:card.visual_spec??{references:[]}}:{})};
  const structure = validateJobDocument('ai-blocks-production/1',production,{card:scoped,team});
  if(!structure.ok)return {schema:'ai-blocks-execution-check/1',ok:false,errors:structure.errors,warnings:structure.warnings,assurance:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED',model_calls:0,hosted_execution:false,stored_by_service:false};
  const quality = validateProductionQuality({document:production,card:scoped,team,plan});
  return {schema:'ai-blocks-execution-check/1',ok:structure.ok&&quality.ok,errors:[...structure.errors,...quality.errors],warnings:structure.warnings,assurance:quality.assurance,model_calls:0,hosted_execution:false,stored_by_service:false};
}
