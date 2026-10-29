// The library list on the home page: only what cards, filters and quick search read.
// Block pages, the builder and everything else keep using the full blocks.json.
// node scripts/build-list-index.mjs  (run after build-index.mjs; writes public/data/blocks-index.json)
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

/** Wire fields kept per block. Anything else (ports, uses, seats, roster use cases...) loads with the full catalogue.
 * Earlier names (aliases) are left out: the full-text search index, fetched on the first query, still matches them. */
export const LIST_FIELDS = [
  'slug', 'name', 'summary', 'headline', 'category', 'type', 'task', 'tasks', 'jobFunctions', 'topics',
  'boards', 'job', 'level', 'origin', 'tested', 'warnings', 'hasFiles', 'source', 'steps', 'execution',
  'identity', 'area', 'also', 'face',
];

export function buildListIndex(catalogue, sourceBytes) {
  const faces = new Map((catalogue.minds?.roster ?? []).map(mind => [mind.slug, mind.face]));
  const blocks = catalogue.blocks.map(block => {
    const out = {};
    for (const field of LIST_FIELDS) if (block[field] !== undefined) out[field] = block[field];
    // Cards only count a workflow's steps; the builder reads the full catalogue.
    if (out.steps) out.steps = out.steps.map(step => (Array.isArray(step) ? step[0] : step));
    if (out.source) out.source = { by: out.source.by };
    if (block.type === 'mind' && !out.face && faces.get(block.slug)) out.face = faces.get(block.slug);
    // What a mind is known for, so a library search can name the minds who know its topic (src/MindsForSearch.tsx).
    if (block.type === 'mind') for (const field of ['seats', 'labels', 'cues']) if (block[field] !== undefined) out[field] = block[field];
    return out;
  });
  return {
    built: catalogue.built, index: true, renamed: catalogue.renamed ?? {}, blocks,
    // Same identity as blocks.json, so full-text search shards still match this list.
    sourceHash: createHash('sha256').update(sourceBytes).digest('hex'),
  };
}

/** Complete mind records and roster, plus names used by the unchanged topic matcher. */
export function buildMindsIndex(catalogue, sourceBytes) {
  const minds = catalogue.blocks.filter(block => block.type === 'mind');
  const names = new Set(minds.flatMap(mind => mind.skills ?? []));
  const blocks = catalogue.blocks.filter(block => block.type === 'mind' || block.slug === 'advisory-council' || names.has(block.slug))
    .map(block => block.type === 'mind' || block.slug === 'advisory-council' ? block : {slug: block.slug, name: block.name});
  return {built: catalogue.built, mindsIndex: true, sourceHash: createHash('sha256').update(sourceBytes).digest('hex'),
    portTypes: catalogue.portTypes, renamed: catalogue.renamed ?? {}, minds: catalogue.minds, blocks};
}

export function writeListIndex(root = process.cwd()) {
  const source = fs.readFileSync(path.join(root, 'public/data/blocks.json'));
  const index = buildListIndex(JSON.parse(source), source);
  const file = path.join(root, 'public/data/blocks-index.json');
  fs.writeFileSync(file, JSON.stringify(index));
  console.log(`List index: ${index.blocks.length} blocks, ${fs.statSync(file).size} bytes (full catalogue ${source.length} bytes)`);
  const minds = buildMindsIndex(JSON.parse(source), source);
  const mindsFile = path.join(root, 'public/data/minds-index.json');
  fs.writeFileSync(mindsFile, JSON.stringify(minds));
  console.log(`Minds index: ${minds.minds.roster.length} complete profiles, ${fs.statSync(mindsFile).size} bytes`);
  return index;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) writeListIndex();
