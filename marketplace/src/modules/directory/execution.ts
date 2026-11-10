// The library, agent marketplace, API and downloaded packs share one contract.
// This module never calls a provider, starts hosted work or changes permissions.
import {buildExecutionPlan, validateProductionQuality} from '../../../../site/src/jobs/execution-quality.mjs';
import {validateJobDocument} from '../../../../site/src/jobs/contracts.mjs';

/**
 * QUALITY-METHOD.md in packs and seats. The plain method is WORK-METHOD.md; this file is only the optional receipt
 * layer for hosts that call the AI Blocks MCP job tools, so a chat user can skip it. Each receipt field maps to a GJP
 * step instead of restating it. The machine contract it describes is the library's (site/src/jobs/), unchanged.
 */
export function qualityMethodMarkdown(): string {
  return `# Quality method: optional receipts

The work method is \`WORK-METHOD.md\`. In a chat, follow it and skip this file.

## Optional: for hosts that use the AI Blocks MCP job tools

Read this section only when your host calls \`get_execution_plan\` or \`check_execution_delivery\` (agents.useaiblocks.com/mcp) or the library's \`advance_job\` (useaiblocks.com/mcp). The JSON files named here come from those tools; none of them is in this pack.

- **Frame:** \`get_execution_plan\` returns EXECUTION-PLAN.json. Settle its reading of the task against the person's own words, and record CREATE, IMPROVE or ASSESS (patch, extend or new).
- **Ground:** record what you captured as \`work_context\`: each source with its SHA-256, capture date, observations and CURRENT, STALE or UNKNOWN. A stale or unknown baseline blocks claims about the current work.
- **Diverge:** each route owner writes a complete proposal before seeing the others. Save its exact text in \`proposal_contents\`, keyed by path, and record \`routes[].draft_receipt\` with context_id, path, sha256, isolation (ISOLATED or SAME_CONTEXT) and \`saw_other_proposals: false\`. For visual batches, each concept names audience, promise, proof, composition and visual_world.
- **Check:** for every current artifact hash, record criterion, baseline_observation, result_observation, PASS, FAIL or NOT_RUN, the receipt and artifact_sha256. FAIL, NOT_RUN and BLOCKED never pass on a high overall score.
- **Launchable pages:** \`production.landing_page_delivery\` names the editable source, the existing-site reuse, the brand sources, and current-hash checks for build, primary_action, links_assets, mobile and desktop layout, keyboard_accessibility and brand_content. An image is not a page.
- **Images:** \`production.visual_delivery\` (ai-blocks-visual-delivery/1) carries the renderer and its receipt, the source references, a reviewer who did not make the image, and current image hashes with brand, product_fidelity, claims_copy and format checks.
- **Local byte check:** where the host provides \`tools/verify-delivery-evidence.mjs\` (it is not in this pack), run it on an ai-blocks-file-evidence/1 manifest. Otherwise report the byte check as NOT_RUN.

These records are host-reported. They are not independent proof, they are not the person's approval, and they grant no access.
`;
}

export function executionPlan(request: string, tier: 'quick'|'standard'|'deep' = 'standard') {
  return {
    ...buildExecutionPlan({request,tier}),
    resources: {
      library: 'https://useaiblocks.com',
      library_mcp: 'https://useaiblocks.com/mcp',
      agent_mcp: 'https://agents.useaiblocks.com/mcp',
      // A piece of work goes to one agent, who already carries its toolbox. Only a goal with no deliverable goes to start_outcome.
      next_steps: ['A piece of work (a page, ads, emails, an audit, a plan, code): load one agent here with load_agent and hand it the request. It carries its own toolbox, so nothing needs searching.', 'Work that mixes kinds (a page, ads and emails): call start_job on the library MCP. It names one lead and a maker for each kind.', 'A business goal with no deliverable named yet ("more sales"): call start_outcome on the library MCP with the original request.', 'Run the work and check the real artifacts in the connected AI.'],
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
