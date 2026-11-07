import test from 'node:test';
import assert from 'node:assert/strict';
import { validateJobDocument } from '../src/jobs/contracts.mjs';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';
function jointWork() {
  const f = engineFixture(), helper = { slug: 'html-implementation-helper', revision_sha256: 'b'.repeat(64) };
  f.context.items.push({ ...helper, name: 'HTML implementation helper' });
  f.team.seats.find(s => s.seat_id === 's3').toolbox.push(helper);
  const artifact = f.production.artifacts[0];
  artifact.items = [...artifact.items, helper]; artifact.contributor_seats = ['s3'];
  artifact.method_amendments = [{ slug: helper.slug, reason: 'The second maker implements and checks the first maker’s copy as finished HTML.' }];
  return { f, artifact, context: { ...f.context, catalogue: f.context.items, job: 'write-documents', card: f.card, team: f.team, spread: f.spread } };
}
test('collaborating makers can add a justified pinned implementation method without inventing a family', () => {
  const { f, context } = jointWork(), result = validateJobDocument('ai-blocks-production/1', f.production, context);
  assert(result.ok, JSON.stringify(result.errors));
});
test('a reviewer cannot be recorded as a production contributor', () => {
  const { f, artifact, context } = jointWork(); artifact.contributor_seats = ['s6'];
  const result = validateJobDocument('ai-blocks-production/1', f.production, context); assert(!result.ok); assert(result.errors.some(e => e.path.includes('contributor_seats')));
});
test('additional methods require their actual maker’s pinned toolbox and a reason', () => {
  const { f, artifact, context } = jointWork(); artifact.method_amendments = [];
  assert(validateJobDocument('ai-blocks-production/1', f.production, context).errors.some(e => e.path.includes('method_amendments')));
  artifact.method_amendments = [{ slug: 'html-implementation-helper', reason: 'Implement HTML.' }]; artifact.contributor_seats = [];
  assert(validateJobDocument('ai-blocks-production/1', f.production, context).errors.some(e => e.message.includes('toolbox')));
});
test('an extra helper cannot replace a planned family method', () => {
  const { f, artifact, context } = jointWork(); artifact.items = artifact.items.filter(i => i.slug === 'html-implementation-helper');
  assert(validateJobDocument('ai-blocks-production/1', f.production, context).errors.some(e => e.message.includes('retain every planned')));
});
