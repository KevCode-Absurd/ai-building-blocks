// Added by AI Blocks. Local analysis only; no network or store mutations.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const nodes = value => Array.isArray(value) ? value : value?.nodes ?? value?.edges?.map(edge => edge.node) ?? [];
export function timestamp(value) {
  const match = typeof value === 'string' && value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/);
  if (!match || !Number.isFinite(Date.parse(value)) || Number(match[2]) > 23 || Number(match[3]) > 59 || Number(match[4]) > 59 || new Date(match[1] + 'T00:00:00Z').toISOString().slice(0, 10) !== match[1]) throw Error('Use valid ISO timestamps with a timezone.');
  return Date.parse(value);
}
export function windowOf(input) {
  const start = timestamp(input.window?.start), end = timestamp(input.window?.end);
  if (end <= start) throw Error('The report window must have a positive duration.');
  return { start, end, days: (end - start) / 86400000 };
}
export function integer(value, fallback, minimum = 0) {
  const number = value === undefined ? fallback : value;
  if (!Number.isSafeInteger(number) || number < minimum) throw Error('A count or threshold is invalid.');
  return number;
}
export const round = (value, places = 6) => Number(value.toFixed(places));
export function csv(rows, columns) {
  const cell = value => {
    if (value === null || value === undefined) return '';
    let text = String(value);
    if (typeof value === 'string' && /^[=+@\-\u0000-\u0020]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  return columns.map(cell).join(',') + '\n' + rows.map(row => columns.map(key => cell(row[key])).join(',')).join('\n') + (rows.length ? '\n' : '');
}
export function runCli(url, analyze, columns, defaultName) {
  if (!process.argv[1] || path.resolve(process.argv[1]) !== fileURLToPath(url)) return;
  try {
    const arg = key => { const at = process.argv.indexOf(key); return at < 0 ? null : process.argv[at + 1]; };
    const inputFile = arg('--input');
    if (!inputFile) throw Error('Provide --input snapshot.json.');
    const base = path.resolve(arg('--out') ?? defaultName);
    const files = [base + '.json', base + '.csv'];
    if (files.some(file => fs.existsSync(file))) throw Error('An output exists. Choose a new --out prefix.');
    let input;
    try { input = JSON.parse(fs.readFileSync(inputFile, 'utf8')); } catch { throw Error('The input must be a readable JSON file.'); }
    const report = analyze(input);
    fs.mkdirSync(path.dirname(base), { recursive: true });
    fs.writeFileSync(files[0], JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
    fs.writeFileSync(files[1], csv(report.rows, columns), { flag: 'wx' });
    console.log(JSON.stringify({ ...report.summary, output_files: files }));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
