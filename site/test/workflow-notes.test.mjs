import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { WORKFLOW_NOTES_LIMIT } from '../src/lib/workflow-limits.ts';
import { LIMITS } from '../src/lib/composer-core.ts';

const built = await build({ stdin: { contents: 'export { compositionFlow } from "./src/lib/composer-flow.ts"; export { packFlow, unpackFlow } from "./src/lib/plan.ts"; export { spaceWorkflowFlow } from "./src/lib/space-workflow-export.ts";', resolveDir: process.cwd() }, bundle: true, write: false, platform: 'browser', format: 'esm' });
const { compositionFlow, packFlow, unpackFlow, spaceWorkflowFlow } = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString('base64')}`);
const skill = { slug: 'synthetic-writer', name: 'Synthetic report writer', summary: 'Write from supplied notes.', type: 'skill', inputs: [{ type: 'question', required: true }], outputs: [{ type: 'document' }], steps: [] };
const c = { blocks: [skill], bySlug: { [skill.slug]: skill }, portTypes: {}, renamed: {} };
const plan = { title: 'Synthetic report', summary: 's'.repeat(500), source: 'ai', steps: [{ slug: skill.slug, reason: 'Use the supplied notes.', notes: 'Save report.md and verify every claim against its source.' }], questionIds: [], assumptions: Array.from({ length: 8 }, (_, i) => `${i}:`.padEnd(500, 'a')) };

test('the maximum composer context and bounded assumptions reopen as an exact graph and Space workflow', () => {
  const context = 'BEGIN-NOTES\n'.padEnd(LIMITS.context - 10, 'x') + '\nEND-NOTES';
  assert.equal(context.length, LIMITS.context);
  const flow = compositionFlow(c, plan, 'Write my report', context);
  assert(flow.notes.length > 10000 && flow.notes.length <= WORKFLOW_NOTES_LIMIT);
  const restored = unpackFlow(c, packFlow(flow));
  assert(restored); assert.equal(restored.notes, flow.notes); assert.equal(restored.goal, flow.goal);
  const fromSpace = spaceWorkflowFlow(c, { id: flow.id, title: flow.name, data: flow });
  assert.equal(fromSpace.notes, flow.notes);
});

test('the shared workflow-notes bound accepts its exact limit and rejects overflow without truncation', () => {
  const flow = compositionFlow(c, plan, 'Write my report');
  flow.notes = 'x'.repeat(WORKFLOW_NOTES_LIMIT);
  assert.equal(unpackFlow(c, packFlow(flow)).notes, flow.notes);
  assert.equal(spaceWorkflowFlow(c, { id: flow.id, title: flow.name, data: flow }).notes.length, WORKFLOW_NOTES_LIMIT);
  flow.notes += 'x';
  assert.equal(unpackFlow(c, packFlow(flow)), null);
  assert.throws(() => spaceWorkflowFlow(c, { id: flow.id, title: flow.name, data: flow }), /incomplete or invalid/);
});
