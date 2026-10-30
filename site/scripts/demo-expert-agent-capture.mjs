// Synthetic local walkthrough, not an expert evaluation. No model or network calls.
import { memoryExpertStore } from '../src/server/expert-agent-store.ts';
import { ExpertAgentService } from '../src/server/expert-agent-service.ts';
const service = new ExpertAgentService(memoryExpertStore(), {
  now: () => new Date('2026-10-30T12:00:00Z'),
  authorize: async () => ({ scope: 'personal:synthetic-demo', userId: 'synthetic-demo', write: true })
});
let request = 0;
const save = (name, input, expected = 0) => service.callTool(name, { ...input, expected_version: expected, idempotency_key: 'synthetic-demo-' + (++request), confirmed: true });
const read = (kind, id) => service.callTool('get_expert_record', { kind, id });
await save('save_expert_profile', { profile: { schema: 'ai-blocks-expert-profile/1', id: 'pm-profile', version: 1, identity_mode: 'pseudonymous', display_name: 'Synthetic product reviewer', headline: 'A synthetic capture demonstration', claims: [], private_notes: '' } });
await save('create_expert_agent', { id: 'pm', profile_id: 'pm-profile', name: 'Synthetic product reviewer', scope: { task: 'Assess product opportunities using supplied evidence.', deliverables: ['An evidence-linked opportunity memo'], not_for: ['Production changes'], review_rules: ['A person reviews consequential recommendations.'] } });
const agent = await read('agent', 'pm');
await save('begin_expert_capture', { id: 'case-review', agent_id: 'pm', agent_sha256: agent.sha256, mode: 'work-review', source: { id: 'synthetic-review', title: 'Synthetic work-review demonstration', rights_status: 'owner-declared', allowed_uses: ['personal'], expires_on: null } });
const answers = [
  'Synthetic task: assess product demand. The draft counted repeated tickets as separate organizations.',
  'Count independently affected organizations and explain the source of uncertainty.',
  'Apply this when estimating breadth of demand, not as the only prioritization factor.',
  'A confirmed contractual dependency may justify prioritization despite narrow demand.',
  'Test both repeated-ticket and contract-exception cases; compare decisions and evidence.'
];
for (const answer of answers) {
  const capture = await read('capture', 'case-review');
  await save('record_expert_capture_answer', { id: 'case-review', answer: { question_id: capture.question.id, answer, artifact_sha256: null } }, capture.storage_version);
}
let capture = await read('capture', 'case-review');
await save('propose_expert_learning', { id: 'case-review', proposal: {
  knowledge_changes: [{ replaces_id: null, record: { id: 'breadth-of-demand', kind: 'heuristic', text: 'Distinguish repeated tickets from independent customer demand.', conditions: ['Estimating breadth of demand'], exceptions: ['A confirmed contractual dependency changes the prioritization stakes.'] } }],
  rubric: [{ id: 'independent-evidence', criterion: 'Distinguish independent evidence and explain material exceptions.', required: true }],
  development_cases: [{ id: 'contract-probe', family_id: 'demand-family', kind: 'counterfactual', prompt: 'Synthetic case: add a confirmed contractual dependency to a narrow demand signal. What should change?', check_ids: ['independent-evidence'] }]
} }, capture.storage_version);
const preview = await service.callTool('preview_expert_learning', { id: 'case-review', decision: 'accept' });
// This simulated confirmation is a fixture, not proof of actual human review.
await save('review_expert_learning', { id: 'case-review', decision: 'accept', approved_preview_sha256: preview.preview_sha256, expected_agent_version: preview.agent_storage_version }, preview.capture_storage_version);
const updated = await read('agent', 'pm');capture = await read('capture', 'case-review');
console.log(JSON.stringify({ synthetic: true, agent_version: updated.data.version, parent_sha256: updated.data.parent_sha256, approved_rules: updated.data.knowledge.length, captured_answers: capture.data.answers.length, visible_practice_cases: updated.data.development_cases.length, source_digest: updated.data.sources[0].sha256, evaluation_status: 'NOT_RUN', model_calls: 0, published: false }, null, 2));
