// Customer-copy check: counts and limits done by a script, not by eye, and nothing internal inside a copy field.
// Plain Node, no dependencies.
//
//   node tools/quality/copy-check.cjs <deliverable.md> [--limit "Headline=27"] [--limit "SEO title=60"] ...
//
// 1. Claimed counts. Wherever the copy states its own length, the stated number must match the text:
//    - a table with a "Characters" (or "Chars", "Length") column: the count is checked against the cell to its left;
//    - "**SEO title (48 characters):** text": the count in brackets is checked against the text after the label;
//    - "**P1. Angle** · 121" followed by "> text": the trailing count is checked against the quoted line(s).
//    Counts are characters as a person counts them (emoji and accented letters count once), spaces included.
// 2. Limits. Each --limit "Label=N" fails any field whose label starts with Label (any case) and runs past N:
//    "Label: text", "**Label:** text", "**Label (N characters):** text", and table rows under a header that starts
//    with Label. Take the limits from the brief, or from the platform when the brief gives none.
//    A count in brackets at the end of a labelled line ("Headline: text (25)") is checked the same way.
// 3. Inside a copy field. A field fails on a placeholder ([X], [link], [Block A], TBD). It warns on a template tag
//    with no fallback ({{ first_name }} rather than {{ first_name|default:"there" }}, or {% ... %}), and on words that
//    belong in your notes, not in front of a customer: the brief, the owner, persona, segment, signal, ledger, ROAS.
// 4. Never say. Every word or phrase the owner banned fails anywhere in the copy: from context/never-say.txt (one per
//    line, read from the folder you run in) and from each --never "phrase".
// 5. Size-choice wording is checked against --product-source, else context/product.json or evidence/product.json.
//    Supported size fields: sizes[], options[{name:"Size",values:[]}], variants[].size/capacity_ml, size/capacity_ml.
//    Missing source is NOT_RUN; unsupported single-product choice fails. No full semantic/availability certification.
// Exit 0 = clean (warnings allowed), 1 = something to fix, 2 = usage error.
const fs = require("fs"), path = require("path");

const usage = 'Usage: node copy-check.cjs <file> [--limit "Label=N"]... [--never "phrase"]... [--product-source product.json] [--product-only]';
const args = process.argv.slice(2);
const limits = [], never = [];
let file = null, productSource = null, productOnly = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--limit") {
    const m = /^(.+?)=(\d+)$/.exec(args[++i] ?? "");
    if (!m) { console.error(`--limit needs "Label=N"\n${usage}`); process.exit(2); }
    limits.push({ label: m[1].trim().toLowerCase(), max: Number(m[2]) });
  } else if (args[i] === "--never") never.push(args[++i] ?? "");
  else if (args[i] === "--product-source") { productSource = args[++i]; if (!productSource || productSource.startsWith('--')) { console.error(usage); process.exit(2); } }
  else if (args[i] === "--product-only") productOnly = true;
  else if (!file) file = args[i];
  else { console.error(usage); process.exit(2); }
}
if (!file) { console.error(usage); process.exit(2); }
let text;
try { text = fs.readFileSync(file, "utf8"); } catch (e) { console.error(`Cannot read ${file}: ${e.message}`); process.exit(2); }

const plain = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, "$1")
  .replace(/`([^`]+)`/g, "$1").trim().replace(/^["“](.*)["”]$/s, "$1").trim();
const len = s => Array.from(plain(s)).length;
const fails = [], warns = [];
// Bounded product-scope diagnostic, not a general semantic claim verifier. A tone
// example is never evidence that the current product offers multiple sizes.
// Conventional files are optional; explicit --product-source takes precedence.
productSource ||= ['context/product.json', 'evidence/product.json'].find(p => fs.existsSync(p));
const sizeChoice = /\b(?:choose|pick|select|find)\s+(?:the|a|your)\s+(?:(?:right|best|perfect)\s+)?size\b|\b(?:comes?|offered|available)\s+in\s+(?:multiple|several|different)\s+sizes\b/i;
const assertedSizeChoice = text.split(/\r?\n/).some(line => {
  const matches = line.matchAll(new RegExp(sizeChoice.source, 'gi'));
  for (const match of matches) {
    const prefix = line.slice(0, match.index).trimEnd();
    if (!/\b(?:(?:do not|don't|never)(?:\s+(?:write|say|use))?|avoid|reject)\s*[:"'“]*\s*$/i.test(prefix)) return true;
  }
  return false;
});
if (assertedSizeChoice) {
  if (!productSource) warns.push('product-choice NOT_RUN: size-choice wording needs a scoped --product-source; voice approval is not product evidence');
  else {
    try {
      const stat = fs.lstatSync(productSource);
      if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 4 * 1024 * 1024) throw new Error('expected a regular product JSON file under 4 MB');
      const product = JSON.parse(fs.readFileSync(productSource, 'utf8'));
      if (!product || typeof product !== 'object' || Array.isArray(product)) throw new Error('expected one scoped product object');
      const namedSizes = new Set(), capacities = new Set();
      const add = (v, kind='size') => { if ((typeof v === 'string' && v.trim()) || (typeof v === 'number' && Number.isFinite(v) && v > 0)) (kind === 'capacity_ml' ? capacities : namedSizes).add(String(v).trim().toLowerCase().replace(/\s+/g, ''));  };
      // Never count colour, price, inventory quantity or two identical size labels as size choice.
      if (Array.isArray(product.sizes)) product.sizes.forEach(v => add(v));
      if (Array.isArray(product.options)) for (const o of product.options) if (o && /^size$/i.test(o.name) && Array.isArray(o.values)) o.values.forEach(v => add(v));
      if (Array.isArray(product.variants)) for (const v of product.variants) { if (v && typeof v === 'object') { add(v.size); add(v.capacity_ml, 'capacity_ml'); } }
      // A capacity alone describes one product, not a selectable range. Do not
      // combine a top-level size with variant sizes in incompatible units.
      if (!namedSizes.size && !capacities.size) { add(product.size); add(product.capacity_ml, 'capacity_ml'); }
      const sizes = namedSizes.size ? namedSizes : capacities;
      if (sizes.size < 2) fails.push(`product-choice: size selection is unsupported by ${path.basename(productSource)} (${sizes.size} explicit size values). Check dimensions instead, or supply the actual scoped size options; approved voice examples do not prove range claims.`);
      else warns.push(`product-choice: ${sizes.size} declared size values found; independently review units, current availability, scope and the full claim. This is not semantic certification.`);
    } catch (e) { console.error('Cannot verify product choice: ' + e.message); process.exit(2); }
  }
}
if (productOnly) {
  const status = fails.length ? 'FAIL' : assertedSizeChoice && !productSource ? 'NOT_RUN' : warns.length ? 'WARN' : 'PASS';
  console.log(JSON.stringify({status,detail:[...fails,...warns].join('\n') || 'No targeted size-choice wording detected. Other factual claims require review.'}));
  process.exit(fails.length ? 1 : 0);
}
const PLACEHOLDER = /\[(?:x|xx|link|url|name|first name|product|date|tbd|block [a-z0-9]+|insert[^\]]*)\]|\bTBD\b/i;
// WhatsApp template variables ({{1}}) are filled by the template itself, so they pass.
const BARE_TAG = /\{\{(?!\s*\d+\s*\}\})(?![^}]*(?:default|\|))[^}]*\}\}|\{%[^%]*%\}/;
const INTERNAL = /\b(the brief|the owner|persona|segments?|signals?|ledger|ROAS|working notes?)\b/i;
const field = (where, label, value) => {
  const v = plain(value);
  if (!v) return;
  const hit = INTERNAL.exec(v);
  if (hit) warns.push(`${where}: "${hit[1]}" in ${label || "copy"} reads like a working note: "${v.slice(0, 80)}"`);
  const lim = label && limits.find(l => label.toLowerCase().startsWith(l.label));
  if (lim && len(v) > lim.max) fails.push(`${where}: ${label} runs ${len(v)} characters, over the limit of ${lim.max}: "${v.slice(0, 80)}"`);
};
const claim = (where, label, stated, value) => {
  const actual = len(value);
  if (Math.abs(actual - stated) > 1) fails.push(`${where}: ${label || "copy"} says ${stated} characters but runs ${actual}: "${plain(value).slice(0, 80)}"`);
};

const lines = text.split(/\r?\n/);
let header = null, fence = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i], where = `line ${i + 1}`;
  if (/^\s*(```|~~~)/.test(line)) { fence = !fence; continue; }
  if (fence) continue;
  // Anywhere in the document: unfinished copy and tags the reader would see.
  if (PLACEHOLDER.test(line)) fails.push(`${where}: placeholder: "${line.trim().slice(0, 80)}"`);
  else if (BARE_TAG.test(line)) warns.push(`${where}: template tag with no fallback; check the sending tool fills it: "${line.trim().slice(0, 80)}"`);
  // Tables
  if (/^\s*\|.*\|\s*$/.test(line)) {
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    if (cells.every(c => /^:?-{2,}:?$/.test(c))) continue;
    if (!header) { header = cells; continue; }
    const countCol = header.findIndex(h => /^(characters?|chars?|length|count)\b/i.test(plain(h)));
    if (countCol > 0 && /^\d+$/.test(cells[countCol] ?? "")) claim(where, plain(header[countCol - 1]), Number(cells[countCol]), cells[countCol - 1]);
    header.forEach((h, c) => { if (c !== countCol && c > 0 && cells[c] !== undefined) field(where, plain(h), cells[c]); });
    continue;
  }
  header = null;
  // **Label (N characters):** text   or   Label: text
  const lab = /^\s*(?:[-*]\s+)?\*{0,2}([A-Za-z][\w &/'-]{0,40}?)(?:\s*\((\d+)\s*(?:characters?|chars?)\))?\s*:\*{0,2}\s+(.+)$/.exec(line);
  const END = /\s*\((\d+)(?:\s*(?:characters?|chars?))?\)\s*$/;
  if (lab && (lab[2] || END.test(lab[3]) || limits.some(l => lab[1].toLowerCase().startsWith(l.label)))) {
    let value = lab[3], stated = lab[2];
    const end = END.exec(value);
    if (end) { value = value.slice(0, end.index); stated = stated ?? end[1]; }
    if (stated) claim(where, lab[1], Number(stated), value);
    field(where, lab[1], value);
    continue;
  }
  // **P1. Angle** · 121  then  > quoted copy
  const tail = /^\s*\*\*(.+?)\*\*.*?[·•]\s*(\d+)\s*(?:characters?|chars?)?\s*$/.exec(line);
  if (tail) {
    const quoted = [];
    let j = i + 1;
    while (j < lines.length && /^\s*>/.test(lines[j])) quoted.push(lines[j++].replace(/^\s*>\s?/, ""));
    if (quoted.length) { claim(`line ${i + 2}`, plain(tail[1]), Number(tail[2]), quoted.join(" ")); field(`line ${i + 2}`, plain(tail[1]), quoted.join(" ")); }
  }
}

try { never.push(...fs.readFileSync("context/never-say.txt", "utf8").split(/\r?\n/)); } catch {}
const norm = s => " " + s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9₹%]+/g, " ").trim() + " ";
const banned = never.map(x => x.replace(/^[-*]\s*/, "").replace(/^["“]|["”]$/g, "").trim()).filter(x => x && !x.startsWith("#"));
let infence = false;
lines.forEach((line, i) => {
  if (/^\s*(```|~~~)/.test(line)) { infence = !infence; return; }
  if (infence) return;
  for (const p of banned) if (norm(p).trim() && norm(line).includes(norm(p))) fails.push(`line ${i + 1}: says "${p}", which the owner said never to say: "${line.trim().slice(0, 80)}"`);
});

for (const w of warns) console.log(`warn  ${w}`);
for (const f of fails) console.log(`FAIL  ${f}`);
console.log(fails.length ? `${fails.length} to fix` : `copy check clean${warns.length ? ` (${warns.length} warnings)` : ""}`);
process.exit(fails.length ? 1 : 0);
