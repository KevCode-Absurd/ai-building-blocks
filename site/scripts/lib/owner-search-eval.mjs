// Scores owner-phrased requests the way the library page ranks them: the search index, the reviewed
// everyday-task suggestion, then lib/library-rank.ts. What is measured is what ships.
import fs from 'node:fs';
import path from 'node:path';
import { searchLibraryIndex } from '../../src/lib/library-search-core.ts';
import { rankLibraryResults } from '../../src/lib/library-rank.ts';
import { reviewedTask } from '../../src/lib/task-discovery.ts';
import { OWNER_GOLD } from '../owner-search-gold.mjs';

/** The published search index with every chunk read back in. */
export function readPublishedIndex(root) {
  const index = JSON.parse(fs.readFileSync(path.join(root, 'data/library-search.json'), 'utf8'));
  for (const [id, chunk] of index.shards.files.entries()) index.postings.splice(id * index.shards.size, chunk.terms, ...JSON.parse(fs.readFileSync(path.join(root, chunk.file))));
  return index;
}

export function rankOwnerQuery(blocks, index, query) {
  const hits = searchLibraryIndex(index, query), suggestion = reviewedTask(query)?.slug;
  const pool = blocks.filter(b => hits.has(b.slug) || b.slug === suggestion);
  return rankLibraryResults(pool, hits, query, { isTested: b => b.tested?.result === 'pass', suggestion }).map(b => b.slug);
}

export function scoreOwnerGold(blocks, index, gold = OWNER_GOLD) {
  const known = new Set(blocks.map(b => b.slug));
  const missing = gold.flatMap(([query, expected]) => expected.filter(slug => !known.has(slug)).map(slug => `${query}: ${slug}`));
  const rows = gold.map(([query, expected]) => {
    const ranked = rankOwnerQuery(blocks, index, query);
    const ranks = expected.map(slug => ranked.indexOf(slug) + 1).filter(rank => rank > 0);
    return { query, best: ranks.length ? Math.min(...ranks) : 0, results: ranked.length, top: ranked.slice(0, 3) };
  });
  const within = n => rows.filter(row => row.best && row.best <= n).length;
  return { queries: gold.length, top1: within(1), top3: within(3), top8: within(8), missing, rows };
}
