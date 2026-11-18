// Synthetic policy fixtures test task routing, not production foundation completion.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// @ts-expect-error Portable pack script has no declaration.
const m = await import('../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs');
const now = new Date('2026-11-18T12:00:00Z');
const scope = { owner_id: 'test-owner', workspace_id: 'test-workspace' };
function fixture(t: any) {
  const ctx = fs.mkdtempSync(path.join(tmpdir(), 'task-foundation-'));
  t.after(() => fs.rmSync(ctx, { recursive: true, force: true }));
  const put = (file: string, lines: string[], date = '2026-11-18') => {
    const target = path.join(ctx, 'org-context', file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `# Synthetic policy fixture\nUpdated ${date}\n${lines.map(x => `- ${x}`).join('\n')}\n`);
  };
  return { ctx, put };
}
function supportFoundation(f: ReturnType<typeof fixture>) {
  f.put('foundation/customer-talk.md', ['Use the approved customer name.', 'Explain the next step plainly.', 'Acknowledge inconvenience.', 'Avoid blame.', 'Sign with the support team name.']);
  f.put('foundation/claims.md', ['Returns require an order check.', 'Do not promise delivery dates.', 'Do not promise compensation.', 'Do not invent warranty coverage.', 'An escalation is not a refund approval.']);
  f.put('foundation/dos-donts.md', ['Protect customer identifiers.', 'Never request passwords.', 'Never publish addresses.', 'Escalate exceptions to the owner.', 'Sending requires authorization.']);
  f.put('sources.md', ['Synthetic owner policy fixture.', 'Synthetic approved reply fixture.', 'Synthetic case record fixture.']);
}
test('support needs policy, communication and sources without ad material; unknown kinds stay conservative', t => {
  const f = fixture(t);
  const report = m.checkBrain(f.ctx, { now, kind: 'customer response' });
  assert.equal(report.kind, 'support');
  assert.deepEqual(report.gaps.map((p: any) => p.id).sort(), ['claims', 'customer-talk', 'dos-donts', 'sources']);
  const ask = m.askBrain(f.ctx, { now, kind: 'support' });
  assert.match(ask.text, /policy|policies/);
  assert.match(ask.text, /privacy|private/);
  assert.match(ask.text, /owner authorization/);
  assert.doesNotMatch(ask.text, /creative folder|ad account|Ad Library|you decide|anyone with the link/);
  assert.equal(m.statusOf(f.ctx, { now, kind: 'support reply' }).level, 'facts');
  assert.equal(m.kindOf('unrecognized_job').unknown, true);
  assert.equal(m.gateBrain(f.ctx, { now, kind: 'unrecognized_job' }).ok, false);
  assert.equal(m.statusOf(f.ctx, { now, kind: 'unrecognized_job' }).level, 'full');
  assert.equal(m.kindOf('scope-and-sow').kind, 'ops_doc');
});
test('support foundation may pass at a low global score, while sparse or stale policy never passes release', t => {
  const f = fixture(t); supportFoundation(f);
  const checked = m.checkBrain(f.ctx, { now, kind: 'support' });
  assert.equal(checked.ready, true);
  assert.ok(checked.score < 40, 'global completeness score is not inflated to task readiness');
  assert.equal(m.gateBrain(f.ctx, { now, kind: 'support' }).ok, true);
  assert.equal(m.gateBrain(f.ctx, { now, kind: 'copy' }).ok, false);
  const proposal = m.gateBrain(f.ctx, { now, kind: 'commercial-proposal' });
  assert.deepEqual(proposal.blocking.map((p: any) => p.id), ['brand-dna']);
  f.put('foundation/brand-dna.md', ['Synthetic business identity.', 'Synthetic reviewed mission.', 'Synthetic delivery principles.', 'Synthetic approved company story.']);
  assert.equal(m.gateBrain(f.ctx, { now, kind: 'commercial-proposal' }).ok, true);
  f.put('sources.md', ['Only one actual source record.']);
  assert.equal(m.gateBrain(f.ctx, { now, kind: 'proposal' }).blocking[0].id, 'sources');
  supportFoundation(f);
  f.put('foundation/claims.md', ['Only one reviewed policy claim.']);
  const thin = m.gateBrain(f.ctx, { now, kind: 'support' });
  assert.equal(thin.ok, false); assert.equal(thin.local_draft_allowed, true);
  assert.deepEqual(thin.blocking, [{ id: 'claims', file: 'foundation/claims.md', state: 'thin' }]);
  supportFoundation(f);
  f.put('foundation/customer-talk.md', ['Greeting.', 'Signoff.', 'Apology.', 'Limits.', 'Escalation.'], '2025-01-01');
  assert.equal(m.gateBrain(f.ctx, { now, kind: 'support' }).blocking[0].state, 'stale');
});
test('a private support draft uses sparse case evidence without claiming release, and keeps scope and revoked facts enforced', t => {
  const f = fixture(t); m.bindContextScope(f.ctx, scope);
  f.put('foundation/dos-donts.md', ['Never disclose the customer address.']);
  const record = (value: string, source = 'synthetic order record') => ({ fact_key: 'case:status', kind: 'fact', value, source, captured_at: '2026-11-18' });
  m.rememberFact(f.ctx, record('Order is awaiting warehouse review.'), { scope, now });
  const opts = { scope, now, kind: 'support', requiredKeys: ['case:status'] };
  assert.equal(m.readFactMemory(f.ctx, opts).ready, true);
  const draft = m.gateBrain(f.ctx, opts);
  assert.equal(draft.ok, false); assert.equal(draft.local_draft_allowed, true);
  assert.match(draft.draft_conditions, /policy and privacy|does not authorize/);
  const slice = m.sliceText(f.ctx, 'facts', { ...opts, verifiedOnly: true });
  assert.equal(slice.ok, false, 'a sparse packet is not presented as complete');
  assert.match(slice.text, /Order is awaiting warehouse review/);
  assert.match(slice.text, /Never disclose the customer address/);
  m.rememberFact(f.ctx, record('Order has shipped.', 'synthetic second record'), { scope, now });
  assert.equal(m.gateBrain(f.ctx, opts).blocking[0].state, 'contradiction');
  m.resolveFact(f.ctx, { scope, now, factKey: 'case:status', action: 'revoke', source: 'direct synthetic owner instruction' });
  const revoked = m.gateBrain(f.ctx, opts);
  assert.equal(revoked.ok, false); assert.equal(revoked.blocking[0].state, 'revoked');
  assert.match(revoked.draft_conditions, /Omit unresolved or revoked facts/);
  assert.equal(m.gateBrain(f.ctx, { ...opts, requiredKeys: ['case:missing'] }).blocking[0].state, 'missing_scoped_evidence');
  const wrong = m.gateBrain(f.ctx, { ...opts, scope: { ...scope, owner_id: 'other-owner' } });
  assert.equal(wrong.ok, false); assert.equal(wrong.local_draft_allowed, false);
  assert.doesNotMatch(JSON.stringify(wrong), /awaiting warehouse|has shipped/);
});

test('policy-only support and proposal packets need their reviewed foundation, not marketing store files', t => {
  for (const kind of ['support', 'proposal']) {
    const f = fixture(t); supportFoundation(f);
    if (kind === 'proposal') f.put('foundation/brand-dna.md', ['Reviewed company identity.', 'Approved company mission.', 'Reviewed service principles.', 'Approved company history.']);
    const opts = { now, kind };
    const status = m.statusOf(f.ctx, opts);
    assert.equal(status.exists, true); assert.equal(status.ok, true);
    assert.equal(status.foundation.ready, true);
    assert.deepEqual(status.needed, []); assert.deepEqual(status.missing, []);
    assert.doesNotMatch(status.next.join('\n'), /capture-brand-dna|voice\.md|refresh prices|write facts\.json/i);
    const slice = m.sliceText(f.ctx, 'facts', opts);
    assert.equal(slice.ok, true, slice.text);
    assert.doesNotMatch(slice.text, /MISSING: (offers|facts)|capture-brand-dna/);
    assert.match(slice.text, /Protect customer identifiers/);
    assert.equal(fs.existsSync(path.join(f.ctx, 'org-context', 'offers.json')), false);
    assert.equal(fs.existsSync(path.join(f.ctx, 'org-context', 'facts.json')), false);
    // Broader explicit requests retain the store-level requirements they asked for.
    const broad = m.statusOf(f.ctx, { ...opts, level: 'full' });
    assert.equal(broad.ok, false); assert.deepEqual(broad.needed, ['offers', 'facts', 'voice', 'look']);
    // A policy packet cannot turn missing dependencies into facts.
    const missing = m.statusOf(f.ctx, { ...opts, requiredKeys: ['case:missing'] });
    assert.equal(missing.ok, false); assert.equal(missing.memory.unresolved[0].state, 'missing_scoped_evidence');
    assert.match(missing.next.join('\n'), /case:missing/);
    f.put('foundation/claims.md', ['Only one reviewed policy line.']);
    assert.equal(m.statusOf(f.ctx, opts).ok, false);
    assert.equal(m.sliceText(f.ctx, 'facts', opts).ok, false);
  }
});

test('support next steps retain relevant restrictions without requiring unrelated stale offers or website synchronization', t => {
  const f = fixture(t); supportFoundation(f); m.bindContextScope(f.ctx, scope);
  const opts = { now, kind: 'support', scope };
  fs.writeFileSync(path.join(f.ctx, 'org-context', 'offers.json'), JSON.stringify({ checked_at: '2025-01-01', offers: [{ id: 'old-promo', kind: 'offer', value: 'Old promotion.', source: 'synthetic old promotion', captured_at: '2025-01-01' }] }));
  fs.writeFileSync(path.join(f.ctx, 'brand-dna.json'), JSON.stringify({ captured_at: '2026-11-18' }));
  const status = m.statusOf(f.ctx, opts);
  assert.equal(status.unsynced, true); assert.equal(status.ok, true);
  assert.equal(status.stale.length, 1); assert.equal(status.parts.find((p: any) => p.id === 'offers').needed, false);
  assert.doesNotMatch(status.next.join('\n'), /capture-brand-dna|migrate|voice\.md/);
  const row = { fact_key: 'case:status', kind: 'fact', value: 'Awaiting review.', source: 'synthetic case record', captured_at: '2026-11-18' };
  m.rememberFact(f.ctx, row, { now, scope });
  m.rememberFact(f.ctx, { ...row, value: 'Dispatched.', source: 'synthetic competing case record' }, { now, scope });
  assert.equal(m.statusOf(f.ctx, { ...opts, requiredKeys: ['case:status'] }).ok, false);
  m.resolveFact(f.ctx, { now, scope, factKey: 'case:status', action: 'revoke', source: 'direct synthetic owner instruction' });
  const revoked = m.statusOf(f.ctx, { ...opts, requiredKeys: ['case:status'] });
  assert.equal(revoked.ok, false); assert.match(revoked.next.join('\n'), /case:status \(revoked\)/);
  assert.equal(m.sliceText(f.ctx, 'facts', { ...opts, requiredKeys: ['case:status'] }).ok, false);
  assert.equal(m.statusOf(f.ctx, { ...opts, scope: { ...scope, owner_id: 'other' } }).ok, false);
  for (const kind of ['email', 'audit']) {
    const other = m.statusOf(f.ctx, { ...opts, kind });
    assert.equal(other.ok, false); assert.ok(other.needed.includes('offers')); assert.ok(other.needed.includes('facts'));
  }
});

test('actual CLI normalizes foundation aliases before status validation and default slice selection', t => {
  const f = fixture(t); supportFoundation(f);
  f.put('foundation/brand-dna.md', ['Reviewed identity.', 'Approved mission.', 'Reviewed principles.', 'Approved company history.']);
  const tool = fileURLToPath(new URL('../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs', import.meta.url));
  const run = (...args: string[]) => spawnSync(process.execPath, [tool, ...args, '--dir', f.ctx, '--today', '2026-11-18'], { encoding: 'utf8' });
  for (const [alias, canonical] of [['Customer Response', 'support'], ['support-reply', 'support'], ['commercial-proposal', 'proposal'], ['tender answers', 'proposal']]) {
    const status = run('status', '--for', alias, '--json');
    assert.equal(status.status, 0, status.stdout + status.stderr);
    assert.equal(JSON.parse(status.stdout).kind, canonical);
    assert.equal(JSON.parse(status.stdout).level, 'facts');
    const slice = run('slice', '--for', alias);
    assert.equal(slice.status, 0, slice.stdout + slice.stderr);
    assert.match(slice.stdout, /ORG CONTEXT SLICE: facts/);
    assert.match(slice.stdout, /Protect customer identifiers/);
    assert.doesNotMatch(slice.stdout, /MISSING: offers|MISSING: facts/);
  }
  assert.equal(run('status', '--for', 'emails').status, 1, 'email retains marketing context requirements');
  assert.equal(run('status', '--for', 'scope-and-sow').status, 0, 'operational alias retains its prior no-brand route');
  for (const unknown of ['unrecognized-job', 'constructor', '__proto__']) {
    assert.equal(m.kindOf(unknown).unknown, true);
    assert.equal(m.statusOf(f.ctx, { now, kind: unknown }).ok, false);
    for (const cmd of ['status', 'slice']) {
      const result = run(cmd, '--for', unknown);
      assert.equal(result.status, 2); assert.match(result.stderr, /Unknown kind/);
    }
  }
});
