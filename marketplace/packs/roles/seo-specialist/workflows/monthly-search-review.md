# Monthly search review

**Cadence:** once a month, in the first week, after Search Console data for the previous month has settled (allow three days). Also run it after any core update finishes.

**Goal:** a short, honest picture of what search brought in last month, what changed and the next three to five actions, with live changes made only at the access level the client grants and within their limits.

## Steps

1. **Pull the data** (level 1; tool: Google Search Console, GA4, Bing Webmaster Tools; or exports the client sends).
   - Search Console Performance: clicks, impressions, CTR and average position for the month, the month before and the same month last year; by query (branded and non-branded filters), page, device and country.
   - Search Console Generative AI performance report: AI Overview and AI Mode impressions for the top pages (impressions only).
   - Page Indexing summary, Core Web Vitals report, Manual actions and Security issues.
   - GA4: organic sessions and key events (leads, sales) by landing page.
   - Bing Webmaster Tools: clicks and impressions, plus any crawl errors.

2. **Check the context** (tool: Google Search Status Dashboard; the client's change log). List updates that ran during the month and any site releases, tracking changes or campaigns.

3. **Spot what moved.** Top 10 gaining and losing pages and query groups by clicks, with the reason you think each moved. If non-branded clicks fell more than normal, run the **search-traffic-drop-diagnosis** skill before writing anything else.

4. **Find this month's opportunities.**
   - Pages in positions 5 to 20 with high impressions: candidates for the **seo-content-brief** skill (refresh) or the **internal-link-suggestions** prompt.
   - Pages with low CTR for their position: run the **title-and-meta-rewrite** prompt.
   - New "not indexed" reasons or template errors: run the relevant part of the **technical-seo-audit** skill.
   - New query groups appearing with impressions but no page: add them to the keyword map (**keyword-intent-map** skill).

5. **Write the report** (format below). Keep it to one page plus charts.

6. **Agree the action list** with the client. Mark each action as "within my limits" (I make it at level 3, or save it as a draft at level 2), "needs a new yes" or "information only". Then make the changes at the level granted, and log each one.

7. **Log it.** Add the month's numbers and actions to the running log so next month compares like with like.

## Outputs

- One-page report: headline numbers (non-branded clicks, conversions from organic, AI Overview impressions), what changed and why, wins, problems, next actions.
- Updated action list with owner, effort and due date.
- Updated keyword map rows, if any.

## What needs the client's approval

At level 3, after the client confirms the action list and limits once, I make these changes within them and log each one: titles and meta descriptions, page copy edits, internal links, structured data, and sitemap submissions on the pages listed.

Always a new yes:

- Redirects, robots.txt, canonical or noindex changes, and template changes that touch many pages.
- Publishing new pages or deleting pages.
- Outreach sent in the client's name.
- Changes to analytics or Search Console settings (users, links, filters).
- Anything outside the agreed sites, pages or kinds of change.

Reading data needs level 1. Drafting changes needs no approval; at level 2 I save them as drafts in the client's tools.
