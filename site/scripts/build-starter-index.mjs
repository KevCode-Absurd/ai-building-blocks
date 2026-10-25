// A small first response for the four reviewed tasks. Full search keeps using blocks.json.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export function buildStarterIndex(catalogue, discoverySource, sourceBytes) {
  const slugs = [...discoverySource.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map(match => match[1]);
  if (slugs.length !== 4 || new Set(slugs).size !== 4) throw Error('Expected four distinct reviewed starter tasks.');
  const bySlug = new Map(catalogue.blocks.map(block => [block.slug, block]));
  const blocks = slugs.map(slug => {
    const block = bySlug.get(slug);
    if (!block || block.headline === '') throw Error(`Reviewed task missing from the public catalogue: ${slug}`);
    return block;
  });
  const result = {
    built: catalogue.built, portTypes: catalogue.portTypes, renamed: catalogue.renamed,
    blocks, starter: true, totalBlocks: catalogue.blocks.length,
    sourceHash: createHash('sha256').update(sourceBytes).digest('hex'),
  };
  if (Buffer.byteLength(JSON.stringify(result)) > 128000) throw Error('Starter index exceeds 128 KB.');
  return result;
}
export function writeStarterIndex(root = process.cwd()) {
  const source = fs.readFileSync(path.join(root, 'public/data/blocks.json'));
  const starter = buildStarterIndex(JSON.parse(source), fs.readFileSync(path.join(root, 'src/lib/task-discovery.ts'), 'utf8'), source);
  const file = path.join(root, 'public/data/starter-blocks.json');
  fs.writeFileSync(file, JSON.stringify(starter));
  console.log(`Starter index: ${starter.blocks.length} reviewed tasks, ${fs.statSync(file).size} bytes`);
  return starter;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) writeStarterIndex();
