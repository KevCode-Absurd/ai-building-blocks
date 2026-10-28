import { checkHandoff, checkInputContract, ports } from './contract-evidence.mjs';
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const linkDefinitions = (file, item) => [
  ...['next', 'before'].map(field => ({ file, field, targets: item[field] ?? [] })),
  ...(item.reviewLinkDefinitions ?? []),
];
export function reviewCatalogue({ items, methods, registry, changes = [] }) {
  const failures = [], bySlug = new Map(), editedInputs = new Set(), editedPorts = new Set(), editedMethods = new Set(), newLinks = new Set();
  const inputRecords = registry.inputs ?? {}, handoffRecords = registry.handoffs ?? {};
  if (registry.schema !== 'abb-source-review/1') return { failures: [{ file: 'catalogue-review.json', message: 'Unsupported review registry' }] };
  for (const [file, item] of items) for (const slug of [item.slug, file.split('/').at(-2), ...(item.reviewAliases ?? [])].filter(Boolean)) {
    if (bySlug.has(slug) && bySlug.get(slug) !== file) failures.push({ file, message: 'Ambiguous catalogue slug' });
    bySlug.set(slug, file);
  }
  for (const change of changes) {
    const { file, before, after } = change;
    if (file.endsWith('/item.yaml') && after) {
      if (!same(ports(before?.inputs), ports(after.inputs))) editedInputs.add(file);
      if (!same({ inputs: ports(before?.inputs), outputs: ports(before?.outputs) }, { inputs: ports(after.inputs), outputs: ports(after.outputs) })) editedPorts.add(file);
    }
    if (/\.ya?ml$/.test(file) && after) for (const field of ['next', 'before']) for (const target of after[field] ?? []) if (!(before?.[field] ?? []).includes(target)) newLinks.add(`${file}#${field}#${target}`);
    if (/\/skill\.md$/i.test(file) && change.methodChanged) editedMethods.add(file.replace(/skill\.md$/i, 'item.yaml'));
  }
  let reviewedInputs = 0, inputItems = 0;
  for (const [file, item] of items) {
    if (ports(item.inputs).length) inputItems++;
    const record = inputRecords[file];
    if (!record && !editedInputs.has(file) && !editedMethods.has(file)) continue;
    const markdown = methods.get(file);
    if (markdown === undefined) { failures.push({ file, message: 'Full method is missing' }); continue; }
    try { for (const message of checkInputContract(item, markdown, record)) failures.push({ file, message }); }
    catch { failures.push({ file, message: 'Method or input contract could not be read safely' }); }
    if (record && ports(item.inputs).length) reviewedInputs++;
  }
  for (const file of Object.keys(inputRecords)) if (!items.has(file)) failures.push({ file, message: 'Reviewed input item no longer exists' });
  let links = 0, reviewedLinks = 0, conditionalLinks = 0, noDirectType = 0;
  const actualLinks = new Set();
  for (const [owner, item] of items) for (const definition of linkDefinitions(owner, item)) for (const target of definition.targets) {
    const { field } = definition;
    links++; const key = `${definition.file}#${field}#${target}`; actualLinks.add(key);
    const other = bySlug.get(target);
    if (!other) { failures.push({ file: owner, message: `${field}: target ${target} does not exist` }); continue; }
    const fromFile = field === 'next' ? owner : other, toFile = field === 'next' ? other : owner;
    const from = items.get(fromFile), to = items.get(toFile), accepted = new Set(ports(to.inputs).map(port => port.type));
    const shared = ports(from.outputs).filter(port => accepted.has(port.type));
    if (!shared.length) noDirectType++; else if (!shared.some(port => port.required)) conditionalLinks++;
    const record = handoffRecords[key];
    if (!record && !newLinks.has(key) && ![fromFile, toFile].some(file => editedPorts.has(file) || editedMethods.has(file))) continue;
    if (!methods.has(fromFile) || !methods.has(toFile)) { failures.push({ file: owner, message: `${field}: full handoff methods missing` }); continue; }
    try { for (const message of checkHandoff(from, to, methods.get(fromFile), methods.get(toFile), record)) failures.push({ file: owner, message: `${field} ${target}: ${message}` }); }
    catch { failures.push({ file: owner, message: `${field}: handoff could not be read safely` }); }
    if (record) reviewedLinks++;
  }
  for (const key of Object.keys(handoffRecords)) if (!actualLinks.has(key)) failures.push({ file: key.split('#')[0], message: 'Reviewed handoff no longer exists' });
  return { failures, inputItems, reviewedInputs, legacyInputsWithoutEvidence: inputItems - reviewedInputs, links, reviewedLinks, legacyLinksWithoutEvidence: links - reviewedLinks, conditionalLinks, noDirectType,
    note: 'Quotes and hashes make review traceable; a type or word match is not proof of semantic compatibility. Legacy coverage is reported, not silently labelled reviewed.' };
}
