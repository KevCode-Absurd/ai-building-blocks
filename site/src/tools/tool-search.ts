/** The /tools search box: the library's ranked search (lib/library-search-core.ts and lib/library-rank.ts) over the
 *  mini tools only, so "price my hours" finds the hourly rate calculator the way the library would. The index is
 *  built once, in the browser, from the tools already on the page: no catalogue download. */
import { buildLibrarySearchIndex, searchLibraryIndex, type LibrarySearchIndex } from "../lib/library-search-core.ts";
import { rankLibraryResults } from "../lib/library-rank.ts";

export type SearchableTool = { slug: string; name: string; short?: string; summary: string; question?: string; headline?: string };
let built: { key: string; index: LibrarySearchIndex } | undefined;

/** Tools that match the search, best first. An empty search returns every tool in its usual order. */
export function searchTools<T extends SearchableTool>(tools: T[], query: string, topicName: (tool: T) => string = () => ""): T[] {
  if (!query.trim()) return tools;
  const key = tools.map(t => t.slug).join(" ");
  if (built?.key !== key) built = { key, index: buildLibrarySearchIndex(tools.map(t => ({
    slug: t.slug, kind: "mini_tool", title: [t.name, t.short, t.headline, t.slug].filter(Boolean).join(" "),
    summary: [t.summary, t.question].filter(Boolean).join(" "), metadata: `${topicName(t)} mini tool free calculator`,
  })), "0".repeat(64)) };
  const hits = searchLibraryIndex(built.index, query);
  return rankLibraryResults(tools.filter(t => hits.has(t.slug)), hits, query, { isTested: () => false });
}

/** Shown when nothing matches: the tools most owners start with. */
export const STARTER_TOOLS = ["hourly-rate", "growth-channel-planner", "ad-budget-planner", "repeat-customer-profit"];
