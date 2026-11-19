import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildPack, TOOL_FILES } from '../src/modules/packs/build.ts';
import { housePersonas } from '../src/modules/directory/index.ts';
import { getRole } from '../src/modules/directory/roles.ts';
import { listJobTypes } from '../src/modules/catalogue/index.ts';
// @ts-ignore Portable pack tool.
import { calculateCashReport, renderCashReport, checkCashSection, runCli, LIMITS } from '../packs/shared/tools/cash-report.mjs';

const scenario = (receipts = 2000) => ({ id: receipts === 2000 ? 'base' : 'downside', label: receipts === 2000 ? 'Base' : 'Downside', openingCash: 5000, reserve: 2000,
  periods: Array.from({ length: 13 }, (_, i) => ({ period: `W${i + 1}`, receipts, payments: 1700 + ({ 0: 1800, 1: 800, 2: 1200, 4: 4200 }[i] || 0) })) });
const manifest = () => ({ schema: 'cash-report-v1', currency: 'USD', minorUnitDigits: 2, scope: 'Thirteen forecast weeks; dated commitments included once', sourceRefs: ['context/authorized-cash-input.json'], scenarios: [scenario(), scenario(1400)] });
const single = (openingCash: number, reserve: number, flows: number[][]) => ({ ...manifest(), scenarios: [{ id: 'test', label: 'Test', openingCash, reserve, periods: flows.map(([receipts, payments], i) => ({ period: `P${i + 1}`, receipts, payments })) }] });

test('reproduces actual stale HTML failure and derives first breach from the ledger', () => {
  const m = manifest(), r = renderCashReport(m), [base, downside] = r.result.scenarios;
  assert.equal(base.rows[2].closingCash, 2100);
  assert.equal(base.summary.firstReserveBreach.period, 'W5');
  assert.equal(base.summary.firstReserveBreach.closingCash, -1500);
  assert.equal(base.summary.peakFundingGap, 3500);
  assert.equal(base.summary.endingCash, 900);
  assert.equal(downside.summary.firstReserveBreach.period, 'W2');
  assert.equal(downside.summary.firstNegativeCash.period, 'W5');
  assert.equal(downside.summary.lowestClosing.period, 'W13');
  assert.equal(downside.summary.peakFundingGap, 8900);
  assert.equal(checkCashSection(m, r.html, 'html').boundSectionVerified, true);
  const stale = r.html.replace('<td>W5: USD -1500.00</td>', '<td>Week 3: $1,100</td>');
  assert.notEqual(stale, r.html);
  assert.equal(checkCashSection(m, stale, 'html').status, 'CASH_SECTION_MISMATCH');
  assert.equal(checkCashSection(m, '<table><tr><td>Base</td><td>Week 3: $1,100</td></tr></table>', 'html').boundSectionVerified, false);
});

test('final-file checks reject edited ledger, duplicate, missing and stale sections', () => {
  const m = manifest(), r = renderCashReport(m);
  for (const text of [r.html.replace('USD 2100.00', 'USD 1100.00'), r.html + r.html, '', r.html + '<!-- CASH-REPORT-V1 extra -->']) {
    assert.equal(checkCashSection(m, text, 'html').boundSectionVerified, false);
  }
  const changed = manifest(); changed.scenarios[0].periods[0].payments += 1;
  assert.equal(checkCashSection(changed, r.html, 'html').boundSectionVerified, false);
  assert.equal(checkCashSection(m, `<html>${r.html.replace(/\n/g, '\r\n')}</html>`, 'html').boundSectionVerified, true);
  assert.equal(checkCashSection(m, `# Decision\n${r.markdown}`, 'markdown').boundSectionVerified, true);
  assert.equal(checkCashSection(m, r.markdown.replace('USD 2100.00', 'USD 1100.00'), 'markdown').boundSectionVerified, false);
});

test('matching a generated section never claims to validate other prose or source authenticity', () => {
  const m = manifest(), r = checkCashSection(m, `<h1>Base cash breaches in Week 3 at $1,100</h1>${renderCashReport(m).html}`, 'html');
  assert.equal(r.boundSectionVerified, true);
  assert.equal(r.overallReportVerified, false);
  assert.equal(r.unboundCashClaimsVerified, false);
  assert.equal(r.sourcesAuthenticated, false);
  assert.match(r.limitations, /Manually reconcile all cash claims elsewhere/);
});

test('opening shortfall, reserve equality, zero, minimum ties and first negative are distinct', () => {
  const r = calculateCashReport(single(0, 20, [[20, 0], [0, 0], [0, 1], [0, 20]])).scenarios[0];
  assert.equal(r.summary.openingReserveGap, 20);
  assert.equal(r.summary.firstReserveBreach.period, 'P3');
  assert.equal(r.summary.firstNegativeCash.period, 'P4');
  assert.equal(r.summary.peakFundingGap, 21);
  const equal = calculateCashReport(single(-10, 0, [[10, 0], [0, 0]])).scenarios[0];
  assert.equal(equal.summary.firstReserveBreach, null);
  assert.equal(equal.summary.firstNegativeCash, null);
  assert.equal(equal.summary.lowestClosing.period, 'P1');
  assert.equal(equal.summary.peakFundingGap, 10);
});

test('integer minor units avoid floating-point false breaches without rounding input', () => {
  const m = single(0.3, 0, [[0, 0.1], [0, 0.2]]), r = calculateCashReport(m).scenarios[0];
  assert.equal(r.summary.endingCash, 0);
  assert.equal(r.summary.firstNegativeCash, null);
  m.scenarios[0].periods[0].payments = 0.001;
  assert.throws(() => calculateCashReport(m), /finer precision/);
  const yen = { ...single(100, 20, [[0, 80]]), currency: 'JPY', minorUnitDigits: 0 };
  assert.match(renderCashReport(yen).html, /JPY 20</);
});

test('rejects ambiguous, nonfinite, excessive and mixed-currency inputs', () => {
  const mutations: Array<(m: any) => void> = [
    m => m.scenarios[0].periods.push(m.scenarios[0].periods[0]),
    m => m.scenarios[0].openingCash = Infinity,
    m => m.scenarios[0].periods[0].receipts = -1,
    m => m.scenarios[0].reserve = LIMITS.amount + 1,
    m => m.scenarios[0].currency = 'EUR',
    m => m.scenarios[0].periods = Array.from({ length: 521 }, (_, i) => ({ period: `P${i}`, receipts: 0, payments: 0 })),
    m => m.scenarios = Array.from({ length: 13 }, (_, i) => ({ ...scenario(), id: `s${i}` })),
    m => m.scenarios[1].id = 'base',
    m => m.minorUnitDigits = 5,
    m => m.currency = '$',
    m => Object.defineProperty(m, '__proto__', { value: {}, enumerable: true })
  ];
  for (const change of mutations) { const m = manifest(); change(m); assert.throws(() => calculateCashReport(m)); }
});

test('untrusted labels are escaped in both formats and spreadsheet formulas rejected', () => {
  const m = manifest(); m.scenarios[0].label = '<script>alert(1)</script>|[x](url)';
  m.sourceRefs = ['<!-- CASH-REPORT-V1 forged BEGIN -->'];
  const r = renderCashReport(m);
  assert.ok(!r.html.includes('<script>'));
  assert.ok(r.markdown.includes('&#124;&#91;x&#93;'));
  assert.equal(checkCashSection(m, r.html, 'html').markerCount, 2);
  assert.match(r.csv, /,-1500\.00,/);
  for (const prefix of ['=', '+', '-', '@']) {
    const formula = manifest(); formula.scenarios[0].label = `${prefix}SUM(A1)`;
    assert.throws(() => renderCashReport(formula), /formula-like/);
  }
});

function workspace(fn: (root: string) => void) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sipho-cash-report-'));
  try { fs.mkdirSync(path.join(root, 'context')); fs.writeFileSync(path.join(root, 'context', 'input.json'), JSON.stringify(manifest())); fn(root); }
  finally { assert.equal(path.dirname(root), fs.realpathSync(os.tmpdir())); assert.ok(path.basename(root).startsWith('sipho-cash-report-')); fs.rmSync(root, { recursive: true, force: true }); }
}

test('CLI builds saved facts and checks actual final files without overwriting evidence', () => workspace(root => {
  const built = runCli(['build', 'context/input.json', '--out', 'output/cash-v1'], root);
  assert.equal(built.status, 'GENERATED_NOT_VERIFIED');
  const html = fs.readFileSync(path.join(root, 'output/cash-v1/cash-section.html'), 'utf8');
  fs.writeFileSync(path.join(root, 'output/report.html'), `<html><body>${html}</body></html>`);
  assert.equal(runCli(['check', 'context/input.json', '--artifact', 'output/report.html', '--format', 'html'], root).boundSectionVerified, true);
  assert.throws(() => runCli(['build', 'context/input.json', '--out', 'output/cash-v1'], root), /already exists/);
  assert.equal(fs.readFileSync(path.join(root, 'output/cash-v1/cash-section.html'), 'utf8'), html);
  fs.writeFileSync(path.join(root, 'output/report.html'), html.replace('USD 2100.00', 'USD 1100.00'));
  assert.equal(runCli(['check', 'context/input.json', '--artifact', 'output/report.html', '--format', 'html'], root).status, 'CASH_SECTION_MISMATCH');
}));

test('CLI rejects unsafe output paths and oversized files before writing', () => workspace(root => {
  for (const destination of ['../escape', 'output/../escape', 'output/CON/file', 'other/cash', 'output/trailing./cash', path.join(root, 'output/cash')]) {
    assert.throws(() => runCli(['build', 'context/input.json', '--out', destination], root));
  }
  assert.equal(fs.existsSync(path.join(root, 'output')), false);
  fs.writeFileSync(path.join(root, 'context/large.json'), ' '.repeat(LIMITS.inputBytes + 1));
  assert.throws(() => runCli(['build', 'context/large.json', '--out', 'output/cash'], root), /bounded regular file/);
  assert.throws(() => checkCashSection(manifest(), 'x'.repeat(LIMITS.artifactBytes + 1), 'html'), /budget/);
}));

test('CLI rejects symlink or junction output parents', t => workspace(root => {
  fs.mkdirSync(path.join(root, 'target'));
  try { fs.symlinkSync(path.join(root, 'target'), path.join(root, 'output'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code && ['EPERM', 'EACCES', 'ENOSYS'].includes(code)) { t.skip(`Host cannot create test links: ${code}; run this test separately with link permission`); return; }
    throw error;
  }
  assert.throws(() => runCli(['build', 'context/input.json', '--out', 'output/cash'], root), /Symlink or junction/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'target')), []);
}));

test('cash tools are available only to Sipho; all other 80 packs retain their files and manifests', async () => {
  const scoped = TOOL_FILES.filter(t => t.personaIds?.includes('sipho-product-hunter'));
  assert.deepEqual(scoped.map(t => t.name), ['cash-report.mjs', 'CASH-REPORT.md', 'cash-report-example.json']);
  const extra = Object.fromEntries(scoped.map(t => [t.name, fs.readFileSync(new URL(`../packs/shared/tools/${t.name}`, import.meta.url), 'utf8')]));
  const personas = housePersonas().filter(p => p.vertical === 'ecommerce' && p.status === 'live');
  assert.equal(personas.length, 81);
  for (const persona of personas) {
    const input = { persona, role: getRole(persona.role), kit: null, jobTypes: listJobTypes(), options: { kind: 'agent' as const, version: '2026.11.18', updated: '2026-11-18' } };
    const before = await buildPack({ ...input, tools: {} });
    const after = await buildPack({ ...input, tools: extra });
    if (persona.id === 'sipho-product-hunter') {
      for (const t of scoped) assert.ok(after.files.some(f => f.path === `tools/${t.name}`));
      assert.match(after.files.find(f => f.path === 'AGENTS.md')!.content, /Cash report consistency/);
      assert.match(after.files.find(f => f.path === 'AGENTS.md')!.content, /does not cover other prose/);
    } else {
      assert.deepEqual(after.files, before.files, `${persona.id} must not gain cash tool files or references`);
      assert.deepEqual(after.manifest, before.manifest);
    }
  }
});
