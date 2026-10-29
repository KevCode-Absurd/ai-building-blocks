// First-open data for a single item. Records are copied unchanged from the full catalogue.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export function itemIndex(catalogue, slug, page, sourceHash) {
  const bySlug = new Map(catalogue.blocks.map(b => [b.slug, b]));
  const root = bySlug.get(slug);
  if (!root) throw Error('Unknown item: ' + slug);
  const selected = new Set([slug, 'advisory-council']);
  const add = value => { if (typeof value === 'string' && bySlug.has(value)) selected.add(value); };
  const scan = value => { if (typeof value === 'string') add(value); else if (Array.isArray(value)) value.forEach(scan); else if (value && typeof value === 'object') Object.values(value).forEach(scan); };
  // Keep the existing Before/After rows, paired skills, mind packs and containing workflows.
  scan(page?.plan); scan(page?.pairs);
  for (const key of ['twin', 'minds', 'skills', 'flows']) scan(root[key]);
  if (root.type !== 'mind' && root.type !== 'workflow' && root.type !== 'agent' && root.category !== 'orchestrator') {
    for (const b of catalogue.blocks) if (b.steps?.some(s => (Array.isArray(s) ? s[0] : s) === slug)) add(b.slug);
  }
  const visited = new Set();
  for (const id of selected) {
    if (visited.has(id)) continue;
    visited.add(id);
    const b = bySlug.get(id); if (!b) continue;
    scan(b.steps); scan(b.uses); scan(b.minds);
  }
  const blocks = catalogue.blocks.filter(b => selected.has(b.slug));
  return {built: catalogue.built, sourceHash, itemSlug: slug, portTypes: catalogue.portTypes, renamed: catalogue.renamed,
    minds: catalogue.minds ? {...catalogue.minds, roster: catalogue.minds.roster.filter(m => selected.has(m.slug))} : undefined,
    blocks, page};
}

export function writeItemIndexes(root = process.cwd()) {
  const data = path.join(root, 'public/data'), source = fs.readFileSync(path.join(data, 'blocks.json'));
  const catalogue = JSON.parse(source), sourceHash = createHash('sha256').update(source).digest('hex');
  const output = path.join(data, 'items'); fs.mkdirSync(output, {recursive: true});
  let max = 0, total = 0;
  for (const b of catalogue.blocks) {
    const pagePath = path.join(data, 'pages', b.slug + '.json');
    const page = fs.existsSync(pagePath) ? JSON.parse(fs.readFileSync(pagePath)) : null;
    const bytes = JSON.stringify(itemIndex(catalogue, b.slug, page, sourceHash));
    fs.writeFileSync(path.join(output, b.slug + '.json'), bytes); total += Buffer.byteLength(bytes); max = Math.max(max, Buffer.byteLength(bytes));
  }
  console.log(`Item indexes: ${catalogue.blocks.length}, mean ${Math.round(total / catalogue.blocks.length)} bytes, largest ${max} bytes.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) writeItemIndexes();
