#!/usr/bin/env node
// Scoped cash-section generation/readback. Never verifies the rest of a report.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { cashForecast } from './commerce-math.mjs';

export const LIMITS = Object.freeze({ inputBytes: 1048576, artifactBytes: 8388608, scenarios: 12, periods: 520, amount: 1e9 });
const hash = value => createHash('sha256').update(value).digest('hex');
const assert = (ok, message) => { if (!ok) throw Error(message); };
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const forbidden = new Set(['__proto__', 'constructor', 'prototype']);
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = (s, field, max = 120) => { assert(typeof s === 'string' && s.trim() && s.length <= max && !/[\u0000-\u001f\u007f]/.test(s), `${field} needs bounded single-line text`); return s; };
function keys(v, allowed, field) {
  assert(object(v), `${field} must be an object`);
  for (const k of Object.keys(v)) assert(!forbidden.has(k) && allowed.includes(k), `${field}: unsupported key ${k}`);
}
function cents(v, digits, field, negative = false) {
  assert(Number.isFinite(v) && Math.abs(v) <= LIMITS.amount && (negative || v >= 0), `${field} is outside the supported amount range`);
  assert(Number(v.toFixed(digits)) === v, `${field} has finer precision than the declared currency minor unit; reconcile explicitly`);
  const n = Math.round(v * 10 ** digits);
  assert(Number.isSafeInteger(n), `${field} exceeds safe integer minor units`);
  return n;
}

export function calculateCashReport(m) {
  keys(m, ['schema', 'currency', 'minorUnitDigits', 'scope', 'sourceRefs', 'scenarios'], 'manifest');
  assert(m.schema === 'cash-report-v1', 'schema must be cash-report-v1');
  assert(typeof m.currency === 'string' && /^[A-Z]{3}$/.test(m.currency), 'Declare one three-letter currency code; no conversion is performed');
  assert(Number.isInteger(m.minorUnitDigits) && m.minorUnitDigits >= 0 && m.minorUnitDigits <= 4, 'minorUnitDigits must be 0 to 4');
  label(m.scope, 'scope', 1000);
  assert(Array.isArray(m.sourceRefs) && m.sourceRefs.length > 0 && m.sourceRefs.length <= 40, 'Provide 1 to 40 declared source references');
  m.sourceRefs.forEach(v => label(v, 'source reference', 500));
  assert(Array.isArray(m.scenarios) && m.scenarios.length > 0 && m.scenarios.length <= LIMITS.scenarios, 'Provide 1 to 12 scenarios');
  const seen = new Set(), scale = 10 ** m.minorUnitDigits;
  const scenarios = m.scenarios.map(s => {
    keys(s, ['id', 'label', 'openingCash', 'reserve', 'periods'], 'scenario');
    assert(typeof s.id === 'string' && /^[a-z][a-z0-9-]{0,39}$/.test(s.id) && !forbidden.has(s.id) && !seen.has(s.id), 'Scenario IDs must be distinct safe names'); seen.add(s.id);
    label(s.label, 'scenario label');
    assert(Array.isArray(s.periods) && s.periods.length > 0 && s.periods.length <= LIMITS.periods, 'Provide 1 to 520 chronological periods');
    const inputs = { openingCash: cents(s.openingCash, m.minorUnitDigits, 'openingCash', true), reserve: cents(s.reserve, m.minorUnitDigits, 'reserve'), periods: s.periods.map(p => {
      keys(p, ['period', 'receipts', 'payments'], 'period');
      return { period: label(p.period, 'period label', 80), receipts: cents(p.receipts, m.minorUnitDigits, 'receipts'), payments: cents(p.payments, m.minorUnitDigits, 'payments') };
    }) };
    // Existing calculator, applied to exact integer minor units to preserve zero
    // and reserve equality. No guessed currency precision or silently rounded input.
    const raw = cashForecast(inputs);
    const amount = n => { assert(Number.isSafeInteger(n), 'Forecast exceeds safe integer minor units'); return n / scale; };
    const rows = raw.rows.map(r => ({ period: r.period, openingCash: amount(r.openingCash), receipts: amount(r.receipts), payments: amount(r.payments), closingCash: amount(r.closingCash), reserveGap: amount(r.reserveGap) }));
    const at = name => rows.find(r => r.period === name) ?? null;
    return { id: s.id, label: s.label, openingCash: s.openingCash, reserve: s.reserve, rows,
      summary: { openingReserveGap: amount(raw.openingReserveGap), firstReserveBreach: at(raw.firstReserveBreach), firstNegativeCash: at(raw.firstNegativeCash), lowestClosing: at(raw.lowestPeriod), peakFundingGap: amount(raw.peakFundingGap), endingCash: amount(raw.endingCash) } };
  });
  return { schema: 'cash-report-result-v1', currency: m.currency, minorUnitDigits: m.minorUnitDigits, scope: m.scope, sourceRefs: [...m.sourceRefs], scenarios,
    limitations: 'Arithmetic from declared inputs only, at period ends in supplied chronological order. Source references are not authenticated. Opening shortfall is separate from the first period-end reserve breach. Lowest closing cash excludes the opening balance; peak funding gap includes it. No source-completeness, intra-period timing, financing, purchasing or overall-report approval.' };
}

export function renderCashReport(manifest) {
  const result = calculateCashReport(manifest), resultSha256 = hash(JSON.stringify(result));
  const money = n => `${result.currency} ${n.toFixed(result.minorUnitDigits)}`;
  const periodValue = row => row ? `${row.period}: ${money(row.closingCash)}` : 'None within supplied periods';
  const summary = [['Opening cash', s => money(s.openingCash)], ['Reserve', s => money(s.reserve)], ['Opening reserve shortfall', s => money(s.summary.openingReserveGap)], ['First period-end reserve breach', s => periodValue(s.summary.firstReserveBreach)], ['First negative period-end cash', s => periodValue(s.summary.firstNegativeCash)], ['Lowest period-end closing cash', s => periodValue(s.summary.lowestClosing)], ['Peak funding gap including opening', s => money(s.summary.peakFundingGap)], ['Ending cash', s => money(s.summary.endingCash)]];
  const head = ['Period', 'Opening cash', 'Receipts', 'Payments', 'Closing cash', 'Reserve gap'];
  const values = r => [r.period, money(r.openingCash), money(r.receipts), money(r.payments), money(r.closingCash), money(r.reserveGap)];
  const htmlTable = (headers, rows) => `<table><thead><tr>${headers.map(x => `<th scope="col">${escape(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((v, i) => i ? `<td>${escape(v)}</td>` : `<th scope="row">${escape(v)}</th>`).join('')}</tr>`).join('\n')}</tbody></table>`;
  // Encode Markdown punctuation in labels as character references. Those labels
  // cannot introduce a link, table cell, HTML tag, or a forged report marker.
  const md = x => escape(x).replace(/[|`*\[\]\\_]/g, c => `&#${c.charCodeAt(0)};`);
  const mdTable = (headers, rows) => [`| ${headers.map(md).join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map(r => `| ${r.map(md).join(' | ')} |`)].join('\n');
  const start = `<!-- CASH-REPORT-V1 ${resultSha256} BEGIN -->`, end = `<!-- CASH-REPORT-V1 ${resultSha256} END -->`;
  const html = [start, '<section class="cash-report">', '<h2>Source-derived cash forecast</h2>', `<p>${escape(result.scope)}</p>`, ...result.scenarios.map(s => `<section><h3>${escape(s.label)}</h3>${htmlTable(['Measure', 'Computed result'], summary.map(([name, fn]) => [name, fn(s)]))}${htmlTable(head, s.rows.map(values))}</section>`), `<p>${escape(result.limitations)}</p>`, `<p>Declared source references: ${result.sourceRefs.map(escape).join('; ')}</p>`, '</section>', end].join('\n');
  const markdown = [start, '## Source-derived cash forecast', '', md(result.scope), ...result.scenarios.flatMap(s => ['', `### ${md(s.label)}`, '', mdTable(['Measure', 'Computed result'], summary.map(([name, fn]) => [name, fn(s)])), '', mdTable(head, s.rows.map(values))]), '', md(result.limitations), '', `Declared source references: ${result.sourceRefs.map(md).join('; ')}`, end].join('\n');
  const cell = v => { if (typeof v === 'number') return v.toFixed(result.minorUnitDigits); const t = String(v); assert(!/^[=+\-@\t\r]/.test(t), 'CSV formula-like label rejected'); return `"${t.replace(/"/g, '""')}"`; };
  // Currency and numeric values use separate columns; negative numbers remain numbers.
  const csv = [['scenario_id','scenario_label','currency','period','opening_cash','receipts','payments','closing_cash','reserve_gap'].map(cell).join(','), ...result.scenarios.flatMap(s => s.rows.map(r => [s.id,s.label,result.currency,r.period,r.openingCash,r.receipts,r.payments,r.closingCash,r.reserveGap].map(cell).join(',')))].join('\n') + '\n';
  assert([html, markdown, csv].every(t => Buffer.byteLength(t) <= LIMITS.artifactBytes), 'Rendered artifact budget exceeded');
  return { result, resultSha256, html, markdown, csv };
}

export function checkCashSection(manifest, artifact, format) {
  assert(['html', 'markdown'].includes(format), 'format must be html or markdown');
  assert(typeof artifact === 'string' && Buffer.byteLength(artifact) <= LIMITS.artifactBytes, 'Artifact exceeds readback budget');
  const rendered = renderCashReport(manifest), expected = rendered[format], actual = artifact.replace(/\r\n/g, '\n');
  const markerCount = (actual.match(/<!-- CASH-REPORT-V1 /g) ?? []).length;
  const count = actual.split(expected).length - 1;
  const matches = markerCount === 2 && count === 1;
  return { schema: 'cash-section-check-v1', status: matches ? 'BOUND_CASH_SECTION_MATCH' : 'CASH_SECTION_MISMATCH', boundSectionVerified: matches,
    resultSha256: rendered.resultSha256, artifactSha256: hash(artifact), format, markerCount,
    errors: matches ? [] : ['The complete generated cash section must appear exactly once, unchanged, with no extra cash-report markers. Regenerate from the current manifest; do not patch dates or amounts by hand.'],
    overallReportVerified: false, sourcesAuthenticated: false, unboundCashClaimsVerified: false,
    limitations: 'Checks only the byte-exact generated section after CRLF normalization. Does not validate other prose/tables, presentation, source mapping/completeness, or factual claims outside the section. Manually reconcile all cash claims elsewhere against facts.json. Never describe this as whole-report verification.' };
}

function localPath(root, relative, write = false) {
  assert(typeof relative === 'string' && relative.length <= 500 && !path.isAbsolute(relative) && !/[\u0000-\u001f<>:"|?*]/.test(relative), 'Use a safe relative path inside the current project');
  const parts = relative.replace(/\\/g, '/').split('/');
  assert(parts.every(p => p && p !== '.' && p !== '..' && !/[. ]$/.test(p) && !/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)), 'Unsafe path component');
  if (write) assert(['context','output'].includes(parts[0]) && parts.length > 1, 'Write only under context/ or output/');
  const base = fs.realpathSync(root); let cursor = base;
  for (const part of parts) {
    cursor = path.join(cursor, part);
    let entry;
    try { entry = fs.lstatSync(cursor); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (entry) {
      assert(!entry.isSymbolicLink(), 'Symlink or junction paths are not supported');
      const rel = path.relative(base, fs.realpathSync(cursor));
      assert(rel && rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel), 'Path escapes the project');
    }
  }
  return cursor;
}
function readLocal(root, name, maximum) {
  const target = localPath(root, name), stat = fs.statSync(target);
  assert(stat.isFile() && stat.size <= maximum, 'Input must be a bounded regular file');
  const bytes = fs.readFileSync(target); assert(bytes.length <= maximum, 'Input changed beyond the readback budget');
  return bytes.toString('utf8').replace(/^\uFEFF/, '');
}
export function runCli(args, root = process.cwd()) {
  const [command, manifestPath, flag, destination, formatFlag, format] = args;
  assert((command === 'build' && args.length === 4 && flag === '--out') || (command === 'check' && args.length === 6 && flag === '--artifact' && formatFlag === '--format'), 'Use build manifest.json --out output/new-directory OR check manifest.json --artifact output/report.html --format html|markdown');
  const raw = readLocal(root, manifestPath, LIMITS.inputBytes), manifest = JSON.parse(raw);
  if (command === 'check') return checkCashSection(manifest, readLocal(root, destination, LIMITS.artifactBytes), format);
  const rendered = renderCashReport(manifest), target = localPath(root, destination, true);
  assert(!fs.existsSync(target), 'Output directory already exists; use a new directory to preserve evidence');
  const files = { 'facts.json': JSON.stringify(rendered.result, null, 2) + '\n', 'cash-section.html': rendered.html + '\n', 'cash-section.md': rendered.markdown + '\n', 'cash-ledger.csv': rendered.csv };
  const receipt = { schema: 'cash-report-build-v1', status: 'GENERATED_NOT_VERIFIED', inputSha256: hash(raw), resultSha256: rendered.resultSha256, fileSha256: Object.fromEntries(Object.entries(files).map(([name, bytes]) => [name, hash(bytes)])), limitations: rendered.result.limitations };
  files['receipt.json'] = JSON.stringify(receipt, null, 2) + '\n';
  assert(Object.values(files).reduce((n, s) => n + Buffer.byteLength(s), 0) <= 4 * LIMITS.artifactBytes, 'Total output budget exceeded');
  // All validation and rendering occur before writes. A new leaf directory and wx
  // files preserve prior evidence. This is not a hostile concurrent-filesystem sandbox.
  fs.mkdirSync(path.dirname(target), { recursive: true });
  localPath(root, destination, true);
  fs.mkdirSync(target);
  for (const [name, bytes] of Object.entries(files)) fs.writeFileSync(path.join(target, name), bytes, { flag: 'wx' });
  return receipt;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const result = runCli(process.argv.slice(2)); console.log(JSON.stringify(result, null, 2)); if (result.status === 'CASH_SECTION_MISMATCH') process.exitCode = 1; }
  catch (error) { console.error(JSON.stringify({ status: 'ERROR', error: error.message })); process.exitCode = 1; }
}
