import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
// @ts-ignore Portable standalone Node tool ships without TypeScript declarations.
import { preflight, runCli, containedPath, OUTPUT_LIMITS } from '../packs/shared/tools/email-draft-preflight.mjs';
import { buildPack, TOOL_FILES } from '../src/modules/packs/build.ts';
import { housePersonas } from '../src/modules/directory/index.ts';
import { getRole } from '../src/modules/directory/roles.ts';
import { listJobTypes } from '../src/modules/catalogue/index.ts';

const toolsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../packs/shared/tools');
const fixture = () => JSON.parse(fs.readFileSync(path.join(toolsDir, 'email-draft-example.json'), 'utf8'));
const temp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'email-preflight-'));
const removeTemp = (root: string) => {
  const resolved = fs.realpathSync(root);
  assert.equal(path.dirname(resolved), fs.realpathSync(os.tmpdir()), 'Cleanup stays inside the intended temporary directory');
  assert.match(path.basename(resolved), /^email-preflight-[a-zA-Z0-9]+$/);
  fs.rmSync(resolved, { recursive: true, force: true });
};

test('local previews use explicit fallbacks and escape values; disconnected sender stays blocked', () => {
  const m = fixture();
  m.profiles[0].values.first_name = `<img src=x onerror="bad()"> & 'quoted'`;
  const result = preflight(m);
  assert.equal(result.report.local_draft_checks, 'PASS');
  assert.equal(result.report.provider_checks, 'BLOCKED');
  assert.equal(result.report.activation_readiness, 'BLOCKED');
  assert.match(result.previews[1].plain, /Welcome, there/);
  assert.match(result.previews[0].plain, /<img src=x/);
  assert.match(result.previews[0].html, /&lt;img src=x onerror=&quot;bad\(\)&quot;&gt; &amp; &#39;quoted&#39;/);
  assert.doesNotMatch(result.previews[0].html, /<img/);
  assert.equal(result.report.provider_evidence.independently_verified, false);
});

test('required fields, unknown fields, malformed tokens and vendor syntax cannot silently render', () => {
  for (const edit of [
    (m: ReturnType<typeof fixture>) => { delete m.profiles[0].values.product_name; },
    (m: ReturnType<typeof fixture>) => { m.messages[0].body = '{{unknown}}'; },
    (m: ReturnType<typeof fixture>) => { m.messages[0].body = '{{first_name | default: "friend"}}'; },
    (m: ReturnType<typeof fixture>) => { m.messages[0].body = '{{first_name}'; },
    (m: ReturnType<typeof fixture>) => { m.messages[0].body = '{{{first_name}}}'; },
    (m: ReturnType<typeof fixture>) => { m.messages[0].body = '{{constructor}}'; },
    (m: ReturnType<typeof fixture>) => { delete m.fields.first_name.fallback; },
  ]) {
    const m = fixture(); edit(m);
    const result = preflight(m);
    assert.equal(result.report.local_draft_checks, 'FAIL');
    assert.ok(result.report.checks.some((c: { errors: string[] }) => c.errors.length > 0));
    assert.equal(result.report.activation_readiness, 'BLOCKED');
  }
});

test('field types and fallback types are enforced; zero and false are not missing', () => {
  const m = fixture();
  m.fields.amount = { type: 'number', required: true };
  m.fields.allowed = { type: 'boolean', required: false, fallback: false };
  for (const p of m.profiles) p.values.amount = 0;
  m.messages[0].body = 'Amount: {{amount}}. Flag: {{allowed}}.';
  assert.match(preflight(m).previews[0].plain, /Amount: 0. Flag: false/);
  m.fields.amount.fallback = '0';
  assert.throws(() => preflight(m), /fallback type/);
  delete m.fields.amount.fallback;
  m.profiles[0].values.amount = '0';
  assert.throws(() => preflight(m), /Wrong profile type/);
});

test('unsafe CTA URLs and header injection fail without fetching anything', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,bad', '/products/x', 'http://example.test/x', 'https://name:secret@example.test', 'https://example.test/{{first_name}}', 'https://example.test\\@evil.test', 'https://example.test/\n']) {
    const m = fixture(); m.messages[0].cta.url = url;
    assert.equal(preflight(m).report.local_draft_checks, 'FAIL', url);
  }
  const m = fixture(); m.profiles[0].values.first_name = 'Name\r\nBcc: unexpected@example.test';
  assert.equal(preflight(m).report.local_draft_checks, 'FAIL');
});

test('unsafe keys, unexpected execution instructions and nonsynthetic profiles are rejected', () => {
  for (const edit of [
    (m: ReturnType<typeof fixture>) => Object.defineProperty(m.fields, '__proto__', { value: {}, enumerable: true }),
    (m: ReturnType<typeof fixture>) => { m.messages[0].include = '../../secrets'; },
    (m: ReturnType<typeof fixture>) => { m.profiles[0].synthetic = false; },
    (m: ReturnType<typeof fixture>) => { m.messages.push(structuredClone(m.messages[0])); },
    (m: ReturnType<typeof fixture>) => { m.messages[0].id = '../../escape'; },
  ]) { const m = fixture(); edit(m); assert.throws(() => preflight(m)); }
});

test('provider-name counts and reported connectivity never establish provider or activation readiness', () => {
  for (const state of ['disconnected', 'unknown', 'reported_connected']) {
    const m = fixture(); m.sender = { provider: 'Klaviyo, Mailchimp, Brevo', state, source_ref: 'owner declaration only' };
    m.activation_dependencies = [];
    const report = preflight(m).report;
    assert.equal(report.provider_checks, state === 'disconnected' ? 'BLOCKED' : 'UNVERIFIED');
    assert.equal(report.activation_readiness, 'BLOCKED');
    assert.ok(report.mandatory_remaining_checks.length >= 4);
  }
});

test('expansion is rejected from its planned byte size before replacement or HTML escaping', () => {
  for (const [value, body, expected] of [
    ['x'.repeat(10000), '{{first_name}}'.repeat(1000), /Expanded text byte budget/],
    ['&'.repeat(10000), '{{first_name}}'.repeat(3), /Per-preview output byte budget/],
    ['small', '{{first_name}}'.repeat(2049), /Template token budget/],
    ['small', '🙂'.repeat(18000), /Text byte budget/],
  ] as const) {
    const m = fixture(); m.profiles = [m.profiles[0]];
    m.profiles[0].values.first_name = value; m.messages[0].body = body;
    const result = preflight(m);
    assert.equal(result.report.local_draft_checks, 'FAIL');
    assert.equal(result.previews.length, 0);
    assert.match(result.report.checks[0].errors[0], expected);
  }
  const m = fixture(); m.fields.first_name.fallback = 'x'.repeat(10001);
  assert.throws(() => preflight(m), /Fallback too long/);
});

test('many individually valid previews respect an aggregate output budget and report omitted combinations', () => {
  const m = fixture();
  m.profiles = Array.from({ length: 50 }, (_, i) => ({ ...m.profiles[0], id: `p_${i}` }));
  m.messages = Array.from({ length: 20 }, (_, i) => ({ ...m.messages[0], id: `m_${i}`, body: 'Neutral copy. '.repeat(1200) }));
  const result = preflight(m);
  assert.equal(result.report.checks.length, 1000);
  assert.equal(result.report.local_draft_checks, 'FAIL');
  assert.ok(result.report.checks.some((c: { errors: string[] }) => c.errors.some(e => e.includes('Aggregate preview byte budget'))));
  assert.ok(result.previews.length > 0 && result.previews.length < 1000);
  const actual = result.previews.reduce((n: number, p: { plain: string; html: string }) => n + Buffer.byteLength(p.plain) + Buffer.byteLength(p.html), 0);
  assert.ok(actual <= result.report.output_budget.reserved_preview_bytes);
  assert.ok(result.report.output_budget.reserved_preview_bytes <= OUTPUT_LIMITS.previewBudgetBytes);
  assert.equal(result.report.activation_readiness, 'BLOCKED');
});

test('CLI writes hashes, retains prior evidence and returns a local-failure status', () => {
  const root = temp();
  try {
    fs.mkdirSync(path.join(root, 'context'));
    const input = path.join(root, 'context/draft.json');
    fs.writeFileSync(input, JSON.stringify(fixture()));
    const result = runCli(['--input', 'context/draft.json', '--out', 'output/preview'], root);
    assert.equal(result.exitCode, 0);
    assert.match(result.message, /provider: BLOCKED; activation: BLOCKED/);
    const report = JSON.parse(fs.readFileSync(path.join(root, 'output/preview/report.json'), 'utf8'));
    for (const artifact of report.artifacts) assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, 'output/preview', artifact.path))).digest('hex'), artifact.sha256);
    assert.equal(report.input_sha256, createHash('sha256').update(fs.readFileSync(input)).digest('hex'));
    assert.throws(() => runCli(['--input', 'context/draft.json', '--out', 'output/preview'], root), /new directory/);
    const bad = fixture(); bad.messages[0].body = '{{unknown}}'; fs.writeFileSync(input, JSON.stringify(bad));
    assert.equal(runCli(['--input', 'context/draft.json', '--out', 'output/failure'], root).exitCode, 1);
    assert.ok(fs.existsSync(path.join(root, 'output/preview/report.json')));
  } finally { removeTemp(root); }
});

test('CLI rejects traversal, absolute, device, ADS and existing output paths', () => {
  const root = temp();
  try {
    for (const p of ['../escape', 'folder/../escape', '/absolute', 'C:\\absolute', 'name:stream', 'CON', 'aux.txt', 'folder./child', './child', 'two//parts']) {
      assert.throws(() => containedPath(root, p), Error, p);
    }
    fs.writeFileSync(path.join(root, 'input.json'), JSON.stringify(fixture()));
    assert.throws(() => runCli(['--input', 'input.json', '--out', '../escape'], root));
    assert.throws(() => runCli(['--input', 'input.json', '--out', 'input.json'], root));
  } finally { removeTemp(root); }
});

test('CLI rejects a directory link/junction in either input or output paths', t => {
  const root = temp(), elsewhere = temp();
  try {
    fs.writeFileSync(path.join(elsewhere, 'input.json'), JSON.stringify(fixture()));
    try { fs.symlinkSync(elsewhere, path.join(root, 'linked'), process.platform === 'win32' ? 'junction' : 'dir'); }
    catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code && ['EPERM', 'EACCES', 'ENOSYS'].includes(code)) { t.skip(`Host cannot create test links: ${code}; run this test separately with link permission`); return; }
      throw error;
    }
    assert.throws(() => containedPath(root, 'linked/input.json', true), /Symlinks and junctions/);
    assert.throws(() => containedPath(root, 'linked/output'), /Symlinks and junctions/);
  } finally { removeTemp(root); removeTemp(elsewhere); }
});

test('optional tool files and every generated reference apply only to Lucia', async () => {
  const scoped = TOOL_FILES.filter(t => t.personaIds?.includes('lucia-email-copy'));
  assert.deepEqual(scoped.map(t => t.name), ['email-draft-preflight.mjs', 'EMAIL-DRAFT-PREFLIGHT.md', 'email-draft-example.json']);
  const extra = Object.fromEntries(scoped.map(t => [t.name, fs.readFileSync(path.join(toolsDir, t.name), 'utf8')]));
  const personas = housePersonas().filter(p => p.vertical === 'ecommerce' && p.status === 'live');
  assert.equal(personas.length, 81);
  for (const persona of personas) {
    const input = { persona, role: getRole(persona.role), kit: null, jobTypes: listJobTypes(), options: { kind: 'agent' as const, version: '2026.11.18', updated: '2026-11-18' } };
    const before = await buildPack({ ...input, tools: {} });
    const after = await buildPack({ ...input, tools: extra });
    if (persona.id === 'lucia-email-copy') {
      for (const t of scoped) assert.ok(after.files.some(f => f.path === `tools/${t.name}`));
      assert.match(after.files.find(f => f.path === 'context/README.md')!.content, /email-draft-preflight/);
    } else {
      assert.deepEqual(after.files, before.files, `${persona.id} must not gain optional tools or references`);
      assert.deepEqual(after.manifest, before.manifest);
    }
  }
});
