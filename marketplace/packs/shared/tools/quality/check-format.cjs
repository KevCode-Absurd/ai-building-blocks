// Brief-derived checks on actual Markdown/HTML bytes. No model, execution or network access.
// Table rules are Markdown-only; inspect HTML tables/interactive fields in the rendered browser.
// Contract: required_headings[], required_links[], expected_tables, max_words,
// tables:[{headers:[],rows,min_rows,max_rows,max_chars:{column:limit},length_unit:'code_points'|'utf16'}].
const fs = require('fs'), crypto = require('crypto');
const args = process.argv.slice(2), at = args.indexOf('--contract');
const file = args[0], contractFile = at >= 0 ? args[at + 1] : null;
if (!file || !contractFile) { console.error('Usage: node check-format.cjs <file> --contract <contract.json>'); process.exit(2); }
try {
  const bytes = fs.readFileSync(file), contractBytes = fs.readFileSync(contractFile);
  const raw = bytes.toString('utf8'), contract = JSON.parse(contractBytes.toString('utf8'));
  const declared = (contract.required_headings?.length ?? 0) + (contract.required_links?.length ?? 0) + (contract.tables?.length ?? 0) + Number(contract.expected_tables !== undefined) + Number(contract.max_words !== undefined);
  if (!declared) throw Error('No brief-derived format rules supplied');
  if (/\.html?$/i.test(file) && (contract.tables?.length ?? 0)) throw Error('HTML table rules need rendered DOM review; this local checker supports Markdown tables');
  const failures = []; let checks = 0;
  const assert = (ok, message) => { checks++; if (!ok) failures.push(message); };
  let validUtf8 = true; try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { validUtf8 = false; }
  assert(validUtf8, 'Invalid UTF-8 bytes; fix encoding and render the final file again');
  const visible = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const clean = text => text.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(?<!\w)__([^_]+)__(?!\w)/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1').replace(/`([^`]+)`/g, '$1').trim();
  let codeFence = false;
  const native = visible.split(/\r?\n/).filter(line => { if (/^\s*(```|~~~)/.test(line)) { codeFence = !codeFence; return false; } return !codeFence; }).join('\n');
  assert(!/\u00c2[\u00a0\u00b7]|\u00c3[\u0097\u2014]|\u00e2\u20ac[\u2122\u201c\u201d\u2018\u2019]|\ufffd/.test(clean(native)), 'Possible corrupted display characters; inspect the rendered text and correct the source encoding');
  const headings = [...native.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => clean(m[1]));
  for (const m of native.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)) headings.push(clean(m[1]));
  for (const heading of contract.required_headings ?? []) assert(headings.includes(heading), `Missing required heading: ${heading}`);
  const links = [...native.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi), ...native.matchAll(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)].map(m => m[1].replace(/&amp;/g, '&'));
  for (const link of contract.required_links ?? []) assert(links.includes(link), `Missing required link: ${link}`);
  if (contract.max_words !== undefined) {
    if (!Number.isInteger(contract.max_words) || contract.max_words < 1) throw Error('max_words must be a positive integer');
    const prose = clean(visible).replace(/^[ |:\-]+$/gm, '').replace(/[|#>`~-]+/g, ' ');
    const count = (prose.match(/\S+/g) ?? []).length;
    assert(count <= contract.max_words, `Word limit: ${count} exceeds ${contract.max_words}`);
  }
  const tables = [], lines = visible.split(/\r?\n/);
  const cells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(x => clean(x.replace(/\\\|/g, '|')));
  let fenced = false;
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) { fenced = !fenced; continue; }
    const delimiter = cells(lines[i + 1]);
    if (fenced || !lines[i].includes('|') || delimiter.length < 2 || !delimiter.every(x => /^:?-+:?$/.test(x))) continue;
    const headers = cells(lines[i]), rows = []; let row = i + 2;
    assert(headers.length === delimiter.length, `Table header/delimiter width differs at line ${i + 1}`);
    while (row < lines.length && lines[row].trim() && lines[row].includes('|')) {
      const values = cells(lines[row]);
      assert(values.length === headers.length, `Table data width differs at line ${row + 1}`);
      rows.push(values); row++;
    }
    tables.push({headers,rows}); i = row - 1;
  }
  if (contract.expected_tables !== undefined) assert(tables.length === contract.expected_tables, `Expected ${contract.expected_tables} tables, found ${tables.length}`);
  for (const rule of contract.tables ?? []) {
    if (rule.length_unit && !['code_points','utf16'].includes(rule.length_unit)) throw Error('Unsupported length unit');
    if (!Array.isArray(rule.headers) || !rule.headers.length) throw Error('Each table rule needs headers');
    const table = tables.find(t => JSON.stringify(t.headers) === JSON.stringify(rule.headers));
    assert(Boolean(table), 'Missing table with requested headers: ' + rule.headers.join(', '));
    if (!table) continue;
    if (rule.rows !== undefined) assert(table.rows.length === rule.rows, `Expected ${rule.rows} rows, found ${table.rows.length}`);
    if (rule.min_rows !== undefined) assert(table.rows.length >= rule.min_rows, `Need at least ${rule.min_rows} rows`);
    if (rule.max_rows !== undefined) assert(table.rows.length <= rule.max_rows, `Need at most ${rule.max_rows} rows`);
    for (const [column, max] of Object.entries(rule.max_chars ?? {})) {
      if (!Number.isInteger(max) || max < 0) throw Error('Character limits must be nonnegative integers');
      const col = table.headers.indexOf(column); assert(col >= 0, 'Missing limited field: ' + column);
      if (col < 0) continue;
      for (const [i, row] of table.rows.entries()) {
        const value = row[col] ?? '', count = rule.length_unit === 'utf16' ? value.length : Array.from(value).length;
        assert(count <= max, `${column}, row ${i + 1}: ${count} exceeds ${max} characters`);
      }
    }
  }
  if (!checks) throw Error('No measurable checks: supply brief-derived format rules');
  const hash = b => crypto.createHash('sha256').update(b).digest('hex');
  console.log(JSON.stringify({schema:'ai-blocks-format-check/1',status:failures.length?'FAIL':'PASS',checks,failures,file_sha256:hash(bytes),contract_sha256:hash(contractBytes),assurance:'Current bytes only. Contract faithfulness, semantics, live links and future filled values require separate review.'},null,2));
  process.exitCode = failures.length ? 1 : 0;
} catch (error) { console.error('Format check not run: ' + error.message); process.exitCode = 2; }
