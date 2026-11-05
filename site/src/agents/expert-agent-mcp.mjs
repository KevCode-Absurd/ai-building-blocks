// Transport-neutral preparation tools. Integration must supply authenticated scope; no live route is registered here.
import { AGENT_SCHEMA, prepareExpertAgent, validateExpertAgent, nextAgentQuestions, assessAgentSubmission } from './expert-agent-contract.mjs';

const record = { type: 'object', description: 'An ai-blocks-expert-agent/1 record. See the returned agent.json and the documented contract.' };
const strings = { type: 'array', maxItems: 30, items: { type: 'string', minLength: 1, maxLength: 1500 } };
const tool = (name, description, properties, required) => ({ name, description, inputSchema: { type: 'object', properties, required, additionalProperties: false }, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } });
export const expertAgentPreparationTools = [
  tool('start_expert_agent', 'Prepare a private task-scoped expert-agent draft and a few useful interview questions. Uses only supplied information. Does not save, connect tools, run a model, train, test or publish. This integration supplies owner/workspace/profile identity.', { id: { type: 'string', minLength: 1, maxLength: 100 }, name: { type: 'string', minLength: 1, maxLength: 150 }, task: { type: 'string', minLength: 1, maxLength: 2000 }, deliverables: strings, not_for: strings, review_rules: strings }, ['id', 'name', 'task']),
  tool('prepare_expert_agent', 'Validate a private agent draft and return portable worker files, existing-format integrity manifest and next interview questions. Caller must fetch full pinned method sources separately. This does not save, test or publish.', { agent: record }, ['agent']),
  tool('suggest_agent_questions', 'Return up to five questions about missing task scope, procedural/judgment knowledge, boundaries and development coverage. Does not inspect other conversations or change the draft.', { agent: record, limit: { type: 'integer', minimum: 1, maximum: 5 } }, ['agent']),
  tool('assess_agent_submission', 'Check whether a draft has declared rights, exact host-reported owner approval and complete passing development evidence before requesting platform review. It cannot certify, publish or grant execution authority. Evaluation fields remain host-reported.', { agent: record, evaluation: { type: 'object' }, config: { type: 'object' }, owner_approved_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' } }, ['agent'])
];

export function createExpertAgentPreparationAdapter(scope) {
  // A trusted authentication adapter supplies this context. Never populate it from tool arguments.
  if (!scope || !['owner_id', 'workspace_id', 'profile_id'].every(k => typeof scope[k] === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(scope[k])) || !/^\d{4}-\d{2}-\d{2}$/.test(scope.as_of ?? '')) throw Error('A trusted scoped owner context and as-of date are required.');
  const bound = input => {
    const a = validateExpertAgent(input);
    for (const key of ['owner_id', 'workspace_id', 'profile_id']) if (a[key] !== scope[key]) throw Error('Agent access is outside the authenticated scope.');
    return a;
  };
  return {
    tools: structuredClone(expertAgentPreparationTools),
    async call(name, args) {
      const definition = expertAgentPreparationTools.find(t => t.name === name); if (!definition) throw Error('Unknown expert-agent preparation tool.');
      if (!args || typeof args !== 'object' || Array.isArray(args) || Object.keys(args).some(k => !Object.hasOwn(definition.inputSchema.properties, k)) || definition.inputSchema.required.some(k => !Object.hasOwn(args, k))) throw Error('Invalid expert-agent tool arguments.');
      if (name === 'start_expert_agent') {
        const a = { schema: AGENT_SCHEMA, id: args.id, name: args.name, owner_id: scope.owner_id, workspace_id: scope.workspace_id, profile_id: scope.profile_id, version: 1, parent_sha256: null, scope: { task: args.task, deliverables: args.deliverables ?? [], not_for: args.not_for ?? [], review_rules: args.review_rules ?? [] }, sources: [], knowledge: [], methods: [], tools: [], rubric: [], development_cases: [] };
        return prepareExpertAgent(a, { as_of: scope.as_of });
      }
      const agent = bound(args.agent);
      if (name === 'prepare_expert_agent') return prepareExpertAgent(agent, { as_of: scope.as_of });
      if (name === 'suggest_agent_questions') return { agent_id: agent.id, questions: nextAgentQuestions(agent, args.limit ?? 3), stored_by_service: false };
      return assessAgentSubmission(agent, { evaluation: args.evaluation, config: args.config, owner_approved_sha256: args.owner_approved_sha256, as_of: scope.as_of });
    }
  };
}
