// Reader-visible internal notes, unintended fields and homework left for the owner. Plain Node, no dependencies.
// Usage: node leakcheck.cjs <file> [--requested-template] [--options-requested] [--customer-copy]
// --requested-template accepts intentional fields only when the brief requests a fill-in template.
// --options-requested accepts alternates (a "Runner-up:" line, "(test: ...)" in a subject or headline) only when the
//   brief asks for options.
// --customer-copy treats every line as copy a customer or candidate reads (for the evidence warning).
// Finished work holds no homework: no "To confirm" box, no ask for the owner's yes or sign-off, no editor notes.
// Evidence stacks in customer copy ("142 of our 400 reviewers say", correlation figures) warn without failing.
// Exit 0 = clean (warnings allowed), 1 = something to fix, 2 = usage error. check-handover.mjs mirrors the homework rules.
const fs = require('fs');
const args = process.argv.slice(2);
const file = args.find(x => !x.startsWith('--'));
const requestedTemplate = args.includes('--requested-template');
const optionsRequested = args.includes('--options-requested');
const customerCopy = args.includes('--customer-copy');
if (!file) { console.error('Usage: node leakcheck.cjs <file> [--requested-template] [--options-requested] [--customer-copy]'); process.exit(2); }
let text;
try { text = fs.readFileSync(file, 'utf8'); }
catch { console.error('Cannot read ' + file); process.exit(2); }
const hits = [];
const warnings = [];
let fields = 0, options = 0;
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

// Homework: work handed back to an owner who cannot be asked. Keep these rules in step with check-handover.mjs.
// The label of a line: a heading, a leading bold label, or a short leading "Label:".
const labelOf = line => {
  const s = line.replace(/^\s*>?\s*/, '');
  const m = s.match(/^#{1,6}\s+(.+?)\s*#*\s*$/) || s.match(/^(?:[-*+]\s+)?(?:\*\*|__)(.+?)(?:\*\*|__)/) || s.match(/^(?:[-*+]\s+)?([A-Za-z][\w ,&'-]{0,60}?)\s*:/)
    || s.match(/^([A-Za-z][\w ,&'()-]{0,60}?)\s*$/); // a short bare line, such as an HTML heading
  return m ? m[1].replace(/^\s*(?:\d+[.)]|[A-Z][.)])\s+/, '').replace(/[:.\s]+$/, '') : null;
};
// A box of points to confirm or questions to answer ("To confirm", "Assumptions to confirm", "Open questions").
const HOMEWORK_LABEL = /^(?:(?:assumptions?|items?|points?|things|details|facts|figures|numbers|questions|left|still|and)\s+){0,3}to (?:confirm|be confirmed|approve|check with you)\b(?!\s+(?:your|you|the order|an order|order|it|that you)\b)|^(?:[\w'-]+\s+)?(?:open|outstanding|unanswered|remaining) questions?\b|^questions? (?:for|to) (?:you|the owner|the client)\b|^(?:needs?|awaiting|pending) (?:your )?(?:confirmation|approval|sign-?off|yes)\b/i;
const HOMEWORK = [
  [/\byour (?:yes|go-ahead|sign-?off)\b/i, "an ask for the owner's yes"],
  [/(?<!\b(?:no|without)\s)\b(?:board|owner|founder|product|management|client|final|exec(?:utive)?|leadership)\s+sign[- ]?off\b|\b(?:awaiting|pending)\s+(?:a\s+|the\s+|your\s+)?sign[- ]?off\b/i, 'a sign-off ask'],
  [/\bplease confirm\b(?!\s+(?:your|you|so|by|here|below|the order|order|that you)\b)/i, 'an ask to confirm'],
  [/\bbefore anything (?:goes|is|gets) (?:live|sent|published|launched)\b/i, 'an approval gate inside the plan'],
];
// Alternates the owner must choose between; they pass only with --options-requested.
const ALTERNATES = [
  [/^\s*(?:[-*+>|]\s*)*(?:\*\*|__)?(?:email\s+\d+\s+)?(?:subject(?:\s+line)?|headline|preview(?:\s+text)?|preheader)\b[^:|]{0,20}(?::|\|).*\(\s*(?:test|alt|alternate|alternative|variant|option|or)\s*:/i, 'a test alternate inside a field'],
  [/^\s*(?:[-*+>|]\s*)*(?:\*\*|__)?runner[- ]up\s*(?:\*\*|__)?\s*:/i, 'a runner-up option'],
];
// Editor notes: a line that talks about the copy itself, to the writer rather than to the reader.
const EDITOR = [
  [/^\s*(?:[-*+>]\s*)*(?:\*\*|__|_|\*)?(?:the|this) (?:copy|draft|email)\s+(?:never|doesn'?t|does not|avoids?|leaves out|omits?|steers clear|stays away|deliberately|intentionally|on purpose)\b(?!.*\b(?:because|so that|since)\b)/i, 'an editor note'],
  [/\b(?:editor|writer|designer|copywriter)'?s'? notes?\b|\bnotes? (?:to|for) (?:the )?(?:writer|designer|copywriter)\b/i, 'an editor note'],
];

// Evidence stacks in customer copy: counts of reviewers or customers who say something, and correlation figures.
// A single plain claim ("4.5 stars from 20,000+ reviews") passes. Customer copy means a quoted line, a blockquote,
// a copy field ("Primary text:", "Headline:", "Body:"), brand voice ("of our 400 reviewers"), or any line with --customer-copy.
const PEOPLE = '(?:verified\\s+)?(?:reviewers|reviews|customers|buyers|shoppers|users|owners|members|subscribers|clients|parents|readers)';
const SAY = '(?:say|said|says|mention|mentioned|tell us|told us|call|called|ask|asked|report|reported|agree|write|wrote|note|noted|rave|praise|love|loved|rate|rated|describe|find|found)\\b';
const COUNT = '(?:\\d+\\s+in\\s+\\d+|\\d[\\d,.]*\\+?%?)';
const STACK = new RegExp(`\\b${COUNT}\\s+(?:of\\s+(?:(?:our|the|all)\\s+)?(?:\\d[\\d,]*\\s+)?)?${PEOPLE}\\s+(?:\\w+\\s+){0,2}?${SAY}|\\bof\\s+(?:our|the|all)\\s+\\d[\\d,]*\\s+${PEOPLE},?\\s+${COUNT}\\s+(?:\\w+\\s+){0,2}?${SAY}`, 'i');
const CORRELATION = /\bcorrelat\w*\b|\br\s*=\s*[-−]?0?\.\d+|\b(?:predicted|predicts|tracks?|tracked)\b[^.]{0,80}\(\s*[-−]?0?\.\d+\s*\)/i;
const COPY_FIELD = /^\s*(?:[-*+|]\s*)*(?:\*\*|__)?(?:primary text|headline|body(?: copy)?|description|caption|subject(?: line)?|preview(?: text)?|preheader|hook|script|voice-?over|vo|on-screen(?: text)?|overlay|cta|message|copy|post|answer|a)(?:\s*\d+)?\s*(?:\([^)]*\))?\s*(?:\*\*|__)?\s*:/i;
const quotedSpans = line => [...line.matchAll(/"([^"]{12,})"|“([^”]{12,})”/g)].map(m => m[1] || m[2]);
// Copy a customer reads ("Please confirm so we can pack it.") is not an ask to the owner.
const inCopy = (line, m) => /^\s*>/.test(line) || COPY_FIELD.test(line) || quotedSpans(line).some(q => q.includes(m[0]));
const isCustomerLine = (line, m) => customerCopy || /^\s*>/.test(line) || COPY_FIELD.test(line) || /\bour\b/i.test(m[0]) || quotedSpans(line).some(q => q.includes(m[0]));

text.split(/\r?\n/).forEach((line, i) => {
  const where = `line ${i + 1}`;
  const show = line.trim().slice(0, 120);
  for (const rule of rules) {
    const m = line.match(rule.re);
    if (!m) continue;
    if (requestedTemplate && rule.field) fields++;
    else hits.push(`${where}: "${m[0]}" in: ${show}`);
  }
  const label = labelOf(line);
  if (label && HOMEWORK_LABEL.test(label)) hits.push(`${where}: homework box "${label}": decide each point, or write one assumption line where it changes what to do. In: ${show}`);
  else for (const [re, what] of HOMEWORK) { const m = line.match(re); if (m && !inCopy(line, m)) { hits.push(`${where}: ${what} "${m[0]}": approvals belong outside the deliverable. In: ${show}`); break; } }
  for (const [re, what] of ALTERNATES) {
    if (!re.test(line)) continue;
    if (optionsRequested) options++; else hits.push(`${where}: ${what}: give one final answer unless the brief asks for options. In: ${show}`);
  }
  for (const [re, what] of EDITOR) { const m = line.match(re); if (m) { hits.push(`${where}: ${what} "${m[0].trim()}" in: ${show}`); break; } }
  const stack = line.match(STACK);
  if (stack && isCustomerLine(line, stack)) warnings.push(`${where}: evidence stack "${stack[0]}": in customer copy use a customer's own words or one plain claim. In: ${show}`);
  const corr = line.match(CORRELATION);
  if (corr && isCustomerLine(line, corr)) warnings.push(`${where}: internal figure "${corr[0]}": keep analysis out of customer or candidate copy. In: ${show}`);
});
if (requestedTemplate) console.log(`Requested-template mode: ${fields} intentional field matches accepted; field completion is not claimed.`);
if (optionsRequested) console.log(`Options-requested mode: ${options} alternate matches accepted.`);
if (warnings.length) console.log(`WARN (${warnings.length}, does not fail):\n` + warnings.join('\n'));
console.log(hits.length ? `LEAKS (${hits.length}):\n` + hits.join('\n') : 'clean');
process.exitCode = hits.length ? 1 : 0;
