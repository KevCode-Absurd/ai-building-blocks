// Reader-visible internal notes and unintended fields. Plain Node, no dependencies.
// --requested-template accepts intentional fields only when the brief requests a fill-in template.
const fs = require('fs');
const args = process.argv.slice(2);
const file = args.find(x => !x.startsWith('--'));
const requestedTemplate = args.includes('--requested-template');
if (!file) { console.error('Usage: node leakcheck.cjs <file> [--requested-template]'); process.exit(2); }
let text;
try { text = fs.readFileSync(file, 'utf8'); }
catch { console.error('Cannot read ' + file); process.exit(2); }
const hits = [];
let fields = 0;
if (/\.html?$/i.test(file)) {
  const tags = /<([a-z0-9]+)\b[^>]*\b(class|id)\s*=\s*["'][^"']*\b(note|notes|internal|debug|todo|dev|annotation|reviewer|editor|sources-panel|fact-?check)\b[^"']*["'][^>]*>/gi;
  for (const m of text.matchAll(tags)) hits.push('element looks like an internal note: ' + m[0].slice(0, 120));
  text = text.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
}
const rules = [
  { re: /\b(facts|market|research|lessons|preferences|contract|check)\.md\b/i },
  { re: /\[INTERNAL[^\]]*\]/i },
  { re: /\b(?:UNKNOWN|UNCONFIRMED|TBD|TODO)\b/ },
  { re: /\bXX+\b/, field: true },
  { re: /\[(insert|fill|placeholder|your|name|date|confirm)[^\]]*\]/i, field: true },
  { re: /\{\{[^}]+\}\}/, field: true },
  { re: /\bcand-[a-d]\b/i },
  { re: /\b(company memory|research file|facts file|the checker|the contract|this workflow|quality engine|draft [A-D]\b)/i },
  { re: /\b(internal notes?|notes? for (the )?(team|reviewer|editor)|not for publication|do not publish|for internal use)\b/i },
  { re: /scratchpad|qbench|[A-Z]:[\\\/]Users[\\\/]/i },
];
text.split(/\r?\n/).forEach((line, i) => {
  for (const rule of rules) {
    const m = line.match(rule.re);
    if (!m) continue;
    if (requestedTemplate && rule.field) fields++;
    else hits.push(`line ${i + 1}: "${m[0]}" in: ${line.trim().slice(0, 120)}`);
  }
});
if (requestedTemplate) console.log(`Requested-template mode: ${fields} intentional field matches accepted; field completion is not claimed.`);
console.log(hits.length ? `LEAKS (${hits.length}):\n` + hits.join('\n') : 'clean');
process.exitCode = hits.length ? 1 : 0;
