// The files that help search engines and AI assistants find, read and keep up with the library (docs/AI-HUB-PRD.md §9,
// docs/ME-FILE-PRD.md §12): sitemap lastmod, the feeds of new and changed items, the facts each page's Markdown and JSON
// twins are made from, and the "how to connect" opening of llms.txt. Pure functions; scripts/build-index.mjs writes them.
export const SITE = "https://useaiblocks.com";
export const FEED_SIZE = 100;
export const FEEDS = { json: "/feed.json", rss: "/feed.xml" };

/** The page folder for a block: /skills/, /workflows/, /prompts/, /agents/ or /minds/. */
export const kindPath = (b) => (b.type === "mind" ? "minds" : b.type === "agent" ? "agents" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
const KIND = { minds: "mind", agents: "agent", workflows: "workflow", prompts: "prompt", skills: "skill" };
export const kindOf = (b) => KIND[kindPath(b)];
export const pagePath = (b) => `/${kindPath(b)}/${b.slug}`;
/** The stable twin addresses of an item page: /skills/<slug>.md and /skills/<slug>.json. */
export const twinPaths = (b) => ({ markdown: `${pagePath(b)}.md`, json: `${pagePath(b)}.json` });

const DAY = /^\d{4}-\d{2}-\d{2}$/;
export const isDay = (d) => typeof d === "string" && DAY.test(d) && !Number.isNaN(Date.parse(d));
/** The newest of some YYYY-MM-DD days, or "" when there is none. */
export const newest = (days) => days.filter(isDay).reduce((a, b) => (b > a ? b : a), "");

/** The facts a page's twins and structured data need that the page JSON does not already carry. */
export function pageFacts(b, { bySlug, describe, taskName }) {
  const port = (p) => ({ type: p.type, required: p.required !== false, ...describe(p.type) });
  return {
    name: b.name, summary: b.summary, kind: kindOf(b), path: pagePath(b),
    job: b.task ? { id: b.task, name: taskName(b.task) ?? b.task } : null,
    level: b.level ?? null, thinking: b.thinking ?? null,
    inputs: (b.inputs ?? []).map(port), outputs: (b.outputs ?? []).map(port),
    steps: (b.steps ?? []).map((s) => bySlug[s.uses]).filter(Boolean).map((s) => ({ slug: s.slug, name: s.name, path: pagePath(s), summary: s.summary })),
    hasFiles: (b.files ?? []).length > 0,
  };
}

// --- Sitemaps ---------------------------------------------------------------------------------------------------------
const xml = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
/** One child sitemap. `lastmod` maps a path to its day; a page with no date we can vouch for gets none. */
export const urlset = (paths, lastmod = {}) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((u) => `  <url><loc>${xml(SITE + u)}</loc>${isDay(lastmod[u]) ? `<lastmod>${lastmod[u]}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`;
/** The sitemap index: each child with the newest lastmod of its pages, so a crawler only re-reads the children that changed. */
export const sitemapIndex = (children) => `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children.map(({ name, lastmod }) => `  <sitemap><loc>${SITE}/sitemap-${name}.xml</loc>${isDay(lastmod) ? `<lastmod>${lastmod}</lastmod>` : ""}</sitemap>`).join("\n")}\n</sitemapindex>\n`;
/** A job hub changes when any item on it changes: its lastmod is the newest of theirs. /jobs is the newest of all. */
export function jobHubDates(blocks) {
  const byTask = {};
  for (const b of blocks) if (b.headline && b.type !== "mind" && b.task && isDay(b.added)) byTask[b.task] = newest([byTask[b.task] ?? "", b.added]);
  return { all: newest(Object.values(byTask)), byTask };
}

// --- Feeds --------------------------------------------------------------------------------------------------------------
/** The newest items by their real dates: last change first, then first appearance, then name. */
export function feedItems(blocks, size = FEED_SIZE) {
  return blocks.filter((b) => b.headline && isDay(b.added))
    .sort((a, b) => b.added.localeCompare(a.added) || (b.published ?? "").localeCompare(a.published ?? "") || a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug))
    .slice(0, size);
}
const at = (d) => `${d}T00:00:00Z`;
const status = (b) => (isDay(b.published) && b.published === b.added ? "new" : "updated");
const feedTags = (b, taskName) => [status(b), kindOf(b), ...(b.task && b.type !== "mind" ? [taskName(b.task) ?? b.task] : [])];
const FEED_TITLE = "AI Blocks: new and changed skills, workflows and minds";
const FEED_DESC = "The newest free AI skills, workflows, prompts, agents and minds on AI Blocks, and the ones that changed most recently.";

/** JSON Feed 1.1 (jsonfeed.org). Dates are the days the item's own files changed, so a rebuild never changes the feed. */
export function jsonFeed(items, { taskName = () => null } = {}) {
  return {
    version: "https://jsonfeed.org/version/1.1", title: FEED_TITLE, home_page_url: `${SITE}/`, feed_url: `${SITE}${FEEDS.json}`,
    description: FEED_DESC, icon: `${SITE}/icon-512.png`, favicon: `${SITE}/favicon-96.png`, language: "en",
    authors: [{ name: "AI Blocks", url: `${SITE}/` }],
    items: items.map((b) => {
      const url = SITE + pagePath(b), twins = twinPaths(b);
      return {
        id: url, url, title: b.name, summary: b.summary, content_text: `${b.summary}${status(b) === "new" ? "" : ` Updated ${b.added}.`}`,
        ...(isDay(b.published) ? { date_published: at(b.published) } : {}), date_modified: at(b.added), tags: feedTags(b, taskName),
        attachments: [{ url: SITE + twins.markdown, mime_type: "text/markdown", title: "Markdown version" }, { url: `${SITE}/skills/${b.slug}/SKILL.md`, mime_type: "text/markdown", title: "SKILL.md" }],
        _aiblocks: { type: kindOf(b), markdown: SITE + twins.markdown, json: SITE + twins.json, skill: `${SITE}/skills/${b.slug}/SKILL.md` },
      };
    }),
  };
}
const rfc822 = (d) => new Date(at(d)).toUTCString().replace("GMT", "+0000");
/** RSS 2.0 with the same items. lastBuildDate is the newest item's day, not the build time. */
export function rssFeed(items, { taskName = () => null } = {}) {
  const built = newest(items.map((b) => b.added));
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(FEED_TITLE)}</title>
    <link>${SITE}/</link>
    <description>${xml(FEED_DESC)}</description>
    <language>en</language>
    <atom:link href="${SITE}${FEEDS.rss}" rel="self" type="application/rss+xml" />
${built ? `    <lastBuildDate>${rfc822(built)}</lastBuildDate>\n` : ""}${items.map((b) => {
    const url = SITE + pagePath(b);
    return `    <item>
      <title>${xml(b.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(b.summary)}</description>
      <pubDate>${rfc822(b.added)}</pubDate>
${feedTags(b, taskName).map((t) => `      <category>${xml(t)}</category>`).join("\n")}
    </item>`;
  }).join("\n")}
  </channel>
</rss>
`;
}

// --- llms.txt ---------------------------------------------------------------------------------------------------------
/** How an AI connects, first in llms.txt and llms-full.txt. */
export function connectLines(example) {
  const path = example ? pagePath(example) : "/skills/ad-angle-planner", page = SITE + path;
  const slug = example?.slug ?? "ad-angle-planner";
  return [
    "## Connect your AI", "",
    `- MCP server (public, no sign-in): ${SITE}/mcp`,
    `- Server card: [${SITE}/mcp/server-card](${SITE}/mcp/server-card), listed in [/.well-known/ai-catalog.json](${SITE}/.well-known/ai-catalog.json)`,
    `- REST API: [OpenAPI description](${SITE}/api/v1/openapi.json). Search with ${SITE}/api/v1/search?q=ad+angles, read one item with ${SITE}/api/v1/items/${slug}`,
    `- Setup guide for ChatGPT, Claude, Claude Code and Codex: [Connect your AI](${SITE}/api-and-mcp)`,
    `- Every item page has a Markdown version and a JSON version: [${path}.md](${page}.md) and [.json](${page}.json), linked from each page's head.`,
    `- New and changed items: [JSON Feed](${SITE}${FEEDS.json}) and [RSS](${SITE}${FEEDS.rss}), plus lastmod dates in the [sitemap](${SITE}/sitemap.xml)`, "",
    "Once connected, ask in plain words:", "",
    `- "Use AI Blocks to get ${slug}."`,
    `- "Use AI Blocks to find a skill that writes ad angles."`,
    `- "Use AI Blocks to plan a workflow for my weekly report."`,
    `- "Use AI Blocks to show what's new this week."`, "",
  ];
}
