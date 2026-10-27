import { useMemo } from "react";
import { type Block, type Catalogue, classificationText } from "./data";
import { useLibrarySearch } from "./library-search";
import { rankLibraryResults } from "./library-rank";
import { reviewedTask } from "./task-discovery";
import { isTested } from "./verification";

/** Every box that searches the catalogue (library, builder step pickers, minds) finds and orders matches the same
 *  way: the shared index (typos, synonyms, job words) ranked by lib/library-rank.ts. Plain text matches the index
 *  has not reached yet (while it loads, or a word only the box shows) follow the ranked ones, so nothing that used
 *  to match disappears. `pool` is what the box may offer; `plainText` is the text its old filter searched. */
export function useRankedLibrarySearch<B extends Block>(catalogue: Catalogue, query: string, pool: B[], plainText: (block: B) => string) {
  // Same extra text as the library page, so both share one prepared index.
  const search = useLibrarySearch(catalogue, query, { extraText: classificationText });
  const hays = useMemo(() => new Map(pool.map(b => [b.slug, plainText(b).toLowerCase()])), [pool]); // eslint-disable-line react-hooks/exhaustive-deps
  const results = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return pool;
    const suggestion = reviewedTask(query)?.slug;
    const ranked = rankLibraryResults(pool.filter(b => search.hits.has(b.slug) || b.slug === suggestion), search.hits, query, { isTested, suggestion });
    const seen = new Set(ranked.map(b => b.slug));
    return [...ranked, ...pool.filter(b => !seen.has(b.slug) && words.every(w => hays.get(b.slug)?.includes(w)))];
  }, [pool, hays, search.hits, query]);
  return { results, loading: search.loading };
}
