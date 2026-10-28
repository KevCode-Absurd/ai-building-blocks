import { createHash } from 'node:crypto';
export const digest = text => createHash('sha256').update(text).digest('hex');
export function methodBody(markdown) {
  const body = markdown.replace(/^\uFEFF/, '').replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '')
    .replace(/<!--\s*(needs|next)(?::[\s\S]*?)?\s*-->[\s\S]*?<!--\s*\/\1\s*-->/g, '')
    .replace(/^Changed by AI Blocks \([^\r\n]*\):[^\r\n]*$/gm, '').replace(/\r\n?/g, '\n').trim();
  if (/<!--\s*(?:needs|next)(?::|\s*-->)/.test(body)) throw Error('An unclosed generated section cannot supply evidence');
  return body;
}
export function ports(values = []) {
  if (!Array.isArray(values)) throw Error('Ports must be an array');
  return values.map(port => typeof port === 'string' ? { type: port.replace(/\?$/, ''), required: !port.endsWith('?') } : { type: port.type, required: port.required !== false })
    .sort((a, b) => a.type.localeCompare(b.type));
}
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
function evidence(body, quote, rationale, label, failures) {
  if (typeof quote !== 'string' || quote.length < 12 || !body.includes(quote.replace(/\r\n?/g, '\n'))) failures.push(`${label}: exact method quote missing`);
  if (typeof rationale !== 'string' || rationale.trim().length < 20) failures.push(`${label}: explain the reviewed mapping`);
}
/** Explicit review evidence, not a claim that matching words prove semantic correctness. */
export function checkInputContract(item, markdown, record) {
  const failures = [], body = methodBody(markdown), inputs = ports(item.inputs);
  if (!record) return ['Input contract needs review against the actual method'];
  if (record.method_sha256 !== digest(body)) failures.push('Method changed since the input review');
  if (!same(ports(record.inputs), inputs)) failures.push('Input types or requiredness changed since the review');
  const seen = new Set();
  for (const input of inputs) {
    const row = record.evidence?.find(entry => entry.type === input.type);
    if (!row) { failures.push(`${input.type}: reviewed evidence missing`); continue; }
    evidence(body, row.quote, row.rationale, input.type, failures); seen.add(input.type);
  }
  if ((record.evidence ?? []).length !== seen.size) failures.push('Review contains duplicate or undeclared input evidence');
  return failures;
}
export function checkHandoff(from, to, fromMethod, toMethod, record) {
  if (!record) return ['Reviewed handoff evidence is missing'];
  const failures = [], producer = methodBody(fromMethod), consumer = methodBody(toMethod);
  if (record.from_sha256 !== digest(producer) || record.to_sha256 !== digest(consumer)) failures.push('A method changed since the handoff review');
  const outputs = ports(from.outputs), inputs = ports(to.inputs);
  if (record.ports_sha256 !== digest(JSON.stringify({ outputs, inputs }))) failures.push('Handoff input/output contract changed');
  evidence(producer, record.output_quote, record.rationale, 'Producer', failures);
  evidence(consumer, record.input_quote, record.rationale, 'Consumer', failures);
  const output = outputs.find(port => port.type === (record.type ?? record.from_type)), input = inputs.find(port => port.type === (record.type ?? record.to_type));
  if (!output || !input) failures.push('The review must name an actual output and input type');
  if (output?.required === false && (typeof record.condition !== 'string' || record.condition.length < 20)) failures.push('An optional result needs an explicit condition');
  if (!record.type && (typeof record.adaptation !== 'string' || record.adaptation.length < 30)) failures.push('A nonmatching type needs a reviewed, concrete adaptation');
  return failures;
}
