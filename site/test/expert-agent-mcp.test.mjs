import test from 'node:test';
import assert from 'node:assert/strict';
import { createExpertAgentPreparationAdapter, expertAgentPreparationTools } from '../src/agents/expert-agent-mcp.mjs';
const scope = () => ({ owner_id: 'synthetic-owner', workspace_id: 'synthetic-workspace', profile_id: 'synthetic-profile', as_of: '2026-10-30' });
const start = () => ({ id: 'synthetic-pm', name: 'Synthetic PM example', task: 'Assess a supplied product opportunity.' });

test('a host can start, answer questions, revise and reprepare without a server model or stored state', async () => {
  const adapter = createExpertAgentPreparationAdapter(scope());
  const draft = await adapter.call('start_expert_agent', start());
  assert.equal(draft.model_calls, 0); assert.equal(draft.stored_by_service, false); assert.equal(draft.published, false);
  assert.equal(draft.agent.owner_id, scope().owner_id); assert.equal(draft.next_questions[0].id, 'deliverables');
  const candidate = structuredClone(draft.agent); candidate.scope.deliverables = ['An evidence-linked memo'];
  const next = await adapter.call('prepare_expert_agent', { agent: candidate });
  assert.notEqual(next.agent_sha256, draft.agent_sha256); assert.notEqual(next.next_questions[0].id, 'deliverables');
  const questions = await adapter.call('suggest_agent_questions', { agent: next.agent, limit: 1 }); assert.equal(questions.questions.length, 1);
  assert.equal((await adapter.call('assess_agent_submission', { agent: next.agent })).state, 'BLOCKED');
});
test('the host cannot select another owner or project through tool arguments', async () => {
  const adapter = createExpertAgentPreparationAdapter(scope());
  await assert.rejects(() => adapter.call('start_expert_agent', { ...start(), owner_id: 'another-owner' }), /Invalid/);
  const draft = await adapter.call('start_expert_agent', start());
  for (const key of ['owner_id', 'workspace_id', 'profile_id']) {
    const foreign = structuredClone(draft.agent); foreign[key] = 'another';
    await assert.rejects(() => adapter.call('prepare_expert_agent', { agent: foreign }), /authenticated scope/);
  }
});
test('tool dispatch rejects unknown tools, extra arguments and missing input without broadening authority', async () => {
  const adapter = createExpertAgentPreparationAdapter(scope());
  await assert.rejects(() => adapter.call('publish_agent', {}), /Unknown/);
  await assert.rejects(() => adapter.call('start_expert_agent', { id: 'only-id' }), /Invalid/);
  await assert.rejects(() => adapter.call('start_expert_agent', { ...start(), background: true }), /Invalid/);
  assert(expertAgentPreparationTools.every(t => t.annotations.readOnlyHint && t.inputSchema.additionalProperties === false));
  assert.throws(() => createExpertAgentPreparationAdapter({}), /trusted scoped/);
});
test('drafts prepared by the same scoped tools remain separate agents', async () => {
  const adapter = createExpertAgentPreparationAdapter(scope());
  const a = await adapter.call('start_expert_agent', start());
  const b = await adapter.call('start_expert_agent', { id: 'synthetic-writer', name: 'Synthetic writing example', task: 'Review a supplied article.' });
  assert.notEqual(a.agent.id, b.agent.id); assert.notEqual(a.agent_sha256, b.agent_sha256);
  assert.deepEqual(a.agent.knowledge, []); assert.deepEqual(b.agent.knowledge, []);
});
