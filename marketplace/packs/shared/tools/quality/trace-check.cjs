// Checks the working trace of knowledge lookups before hand-over. Plain Node 18, no dependencies.
// Usage: node trace-check.cjs context/trace.md --spec context/spec.md [--pack .] [--final <deliverable>]
//
// The trace (context/trace.md) is a working file, never shipped. For each ask-knowledge query it holds the
// question, the card ids used and the call each one supports, either as a table with a "Question" column:
//   | Question | Cards | Call it supports |
//   | free shipping threshold for bundles | OFF-0012, MEA-0003 | keep the threshold, add the pair under it |
// or as one block per query, starting "Q1:" (or "## Q1", "Query:", "Question:"), with "Cards:" and "Supports:" lines.
//
// It fails when:
// - the trace is missing or empty;
// - it has fewer queries than the spec's signals plus its decisions (the "Signal pass" items, and the items under a
//   "Decisions" label when the spec has one);
// - it cites a card id that is not in the pack's knowledge files (knowledge/<vertical>/*.md);
// - the deliverable (--final) names a card id: card ids stay in the trace.
// It warns when the trace names no card at all (fine only when every lookup came back weak: say so in the trace).
// Exit 0 = clean (warnings allowed), 1 = something to fix, 2 = usage error.
const fs = require('fs');
const path = require('path');

const usage = 'Usage: node trace-check.cjs context/trace.md --spec context/spec.md [--pack <folder>] [--final <deliverable>]';
const CARD_ID = /\b[A-Z]{3}-\d{4}\b/g;

function parseArgs(argv) {
  const out = { files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (['--spec', '--pack', '--final'].includes(a)) {
      const v = argv[++i];
      if (!v || v.startsWith('--')) return { error: `${a} needs a value` };
      out[a.slice(2)] = v;
    } else if (a === '-h' || a === '--help') out.help = true;
    else if (a.startsWith('--')) return { error: `unknown option ${a}` };
    else out.files.push(a);
  }
  return out;
}

/** The items of a labelled block in the spec ("- **Signal pass:** ..." then its sub-items), or 0 when absent. */
function blockItems(spec, ...labels) {
  const lines = spec.replace(/\r\n?/g, '\n').split('\n');
  let start = -1;
  for (const label of labels) { start = lines.findIndex(l => label.test(l.replace(/[*_`]/g, ''))); if (start >= 0) break; }
  if (start < 0) return { found: false, items: 0 };
  const head = lines[start];
  // Under a heading the block runs to the next heading; under a list label, to the next line at its depth.
  const heading = /^\s*#{1,6}\s/.test(head);
  const indent = (/^\s*/.exec(head) || [''])[0].length;
  const LIST = /^\s*([-*+]|\d+[.)])\s/, ROW = /^\s*\|/, RULE = /^\s*\|[\s|:-]+\|\s*$/;
  let items = 0, table = false;
  for (let i = start + 1; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim()) continue;
    const ind = (/^\s*/.exec(l) || [''])[0].length;
    if (/^\s*#{1,6}\s/.test(l)) break;
    if (!heading && ind <= indent && !ROW.test(l)) break;
    if (RULE.test(l)) { table = true; continue; }
    if (LIST.test(l) || ROW.test(l)) items++;
  }
  // A table's header row is not a signal.
  if (table) items = Math.max(0, items - 1);
  if (!items) {
    // Signals written inline on the label's own line: "1) ... 2) ... 3) ..." or "; " separated.
    const rest = head.replace(/^[^:]*:/, '');
    const numbered = rest.match(/(?:^|\s)\(?\d[.)]\s/g);
    items = numbered ? numbered.length : rest.trim() ? rest.split(/;\s+/).filter(s => s.trim()).length : 0;
  }
  return { found: true, items };
}

/** The queries of a trace: table rows under a Question or Query column, else Q1: / Query: / Question: lines. */
function traceQueries(trace) {
  const lines = trace.replace(/\r\n?/g, '\n').split('\n');
  let rows = 0, inTable = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*\|/.test(l)) {
      if (!inTable && /\b(question|query)\b/i.test(l) && /^\s*\|[\s|:-]+\|\s*$/.test(lines[i + 1] || '')) { inTable = true; i++; continue; }
      if (inTable && l.replace(/[|\s-]/g, '')) rows++;
    } else inTable = false;
  }
  const blocks = lines.filter(l => /^\s*(?:#{1,4}\s+|[-*]\s+|\d+[.)]\s+)?(?:\*\*)?(?:Q\d+\b|(?:query|question)\b\s*\d*\s*(?:\*\*)?\s*[:.])/i.test(l)).length;
  return rows + blocks;
}

/** Every card id the pack's knowledge files hold: "Card XXX-0000." lines in module files and "- **XXX-0000**" index lines. */
function packCardIds(pack) {
  const ids = new Set();
  const root = path.join(pack, 'knowledge');
  if (!fs.existsSync(root)) return ids;
  const walk = dir => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) { if (!/^(skills|vendor|toolbox)$/.test(name)) walk(p); continue; }
      if (!name.endsWith('.md')) continue;
      const text = fs.readFileSync(p, 'utf8');
      for (const m of text.matchAll(/\bCard ([A-Z]{3}-\d{4})\b/g)) ids.add(m[1]);
      for (const m of text.matchAll(/^\s*[-*]\s+\*\*([A-Z]{3}-\d{4})\*\*/gm)) ids.add(m[1]);
    }
  };
  walk(root);
  return ids;
}

function check({ trace, spec, pack, final }) {
  const fails = [], warns = [];
  const queries = traceQueries(trace);
  if (!trace.trim() || !queries) fails.push('the trace has no queries: log each ask-knowledge query with the question, the card ids used and the call each supports');
  const signals = blockItems(spec, /signal pass/i, /^\s*(?:[-*]\s+|#{1,6}\s+)?signals\b/i);
  const decisions = blockItems(spec, /^\s*(?:[-*]\s+|#{1,6}\s+)?(?:major )?decisions\b/i);
  if (!signals.found) warns.push('the spec has no "Signal pass": write the signals that change the decision in context/spec.md');
  const need = signals.items + decisions.items;
  if (queries && queries < need) fails.push(`the trace has ${queries} quer${queries === 1 ? 'y' : 'ies'} for ${signals.items} signal${signals.items === 1 ? '' : 's'} and ${decisions.items} decision${decisions.items === 1 ? '' : 's'}: run one query per signal and per major decision`);
  const cited = [...new Set(trace.match(CARD_ID) || [])];
  const known = packCardIds(pack);
  const unknown = cited.filter(id => !known.has(id));
  if (unknown.length) fails.push(`card id${unknown.length === 1 ? '' : 's'} not in this pack's knowledge files: ${unknown.slice(0, 12).join(', ')}${unknown.length > 12 ? ` and ${unknown.length - 12} more` : ''}${known.size ? '' : ' (this pack carries no knowledge cards)'}`);
  if (!cited.length && queries) warns.push('the trace names no card: fine only when every lookup came back weak, so say that in the trace');
  if (final !== null) {
    final.replace(/\r\n?/g, '\n').split('\n').forEach((line, i) => {
      const ids = line.match(CARD_ID);
      if (ids) fails.push(`deliverable line ${i + 1} names card id ${[...new Set(ids)].join(', ')}: card ids stay in the trace. In: ${line.trim().slice(0, 120)}`);
    });
  }
  return { fails, warns, queries, signals: signals.items, decisions: decisions.items, cited: cited.length, known: known.size };
}

function main(argv) {
  const a = parseArgs(argv);
  if (a.help) { console.log(usage); return 0; }
  if (a.error || !a.files[0]) { console.error(`${a.error ? a.error + '\n' : ''}${usage}`); return 2; }
  const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
  const tracePath = a.files[0];
  const here = path.resolve(__dirname, '..', '..');
  const pack = path.resolve(a.pack || (fs.existsSync(path.join(here, 'AGENTS.md')) ? here : process.cwd()));
  const specPath = a.spec || path.join(path.dirname(tracePath), 'spec.md');
  const spec = read(specPath);
  if (spec === null) { console.error(`Cannot read the spec ${specPath}\n${usage}`); return 2; }
  const final = a.final ? read(a.final) : null;
  if (a.final && final === null) { console.error(`Cannot read the deliverable ${a.final}`); return 2; }
  const trace = read(tracePath);
  const r = trace === null
    ? { fails: [`no trace at ${tracePath}: before drafting, run ask-knowledge once per signal and per major decision and log each query there`], warns: [], queries: 0, signals: 0, decisions: 0, cited: 0, known: 0 }
    : check({ trace, spec, pack, final });
  if (r.warns.length) console.log(`WARN (${r.warns.length}, does not fail):\n` + r.warns.join('\n'));
  console.log(r.fails.length
    ? `TRACE FAILS (${r.fails.length}):\n` + r.fails.join('\n')
    : `clean: ${r.queries} quer${r.queries === 1 ? 'y' : 'ies'} for ${r.signals} signal${r.signals === 1 ? '' : 's'} and ${r.decisions} decision${r.decisions === 1 ? '' : 's'}, ${r.cited} card id${r.cited === 1 ? '' : 's'}, all in the pack${a.final ? ', none in the deliverable' : ''}`);
  return r.fails.length ? 1 : 0;
}

module.exports = { check, traceQueries, blockItems, packCardIds };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
