# Content refresh cycle

**Cadence:** every quarter. Older content loses ground as competitors improve, facts go out of date and search results change. This cycle finds the pages worth saving, decides refresh, merge or remove for each, and tracks the result.

**Goal:** more value from pages the client already has, before writing new ones.

## Steps

1. **List candidate pages** (level 1; tools: Google Search Console page export for the last 16 months; GA4 organic landing pages with key events). Flag pages that meet any of these:
   - Clicks down more than 30% year on year with impressions also down.
   - Average position between 5 and 20 for a valuable query group.
   - Facts, prices, dates, screenshots or laws that may be out of date.
   - Two or more pages competing for the same queries.

2. **Make a call on each page.** For every candidate decide one of:
   - **Refresh:** the page owns a valuable query group and can become the best answer again.
   - **Merge:** it overlaps with a stronger page. Move the useful parts across and 301 the old URL.
   - **Remove:** no traffic, no links, no business value, nothing worth merging. Return 410 or 404 (or keep it noindexed if it serves logged-in users).
   - **Leave:** it is fine; the drop is demand or a results-page change.
   Check the live results page for each with the **serp-intent-check** prompt so the call matches what Google now ranks.

3. **Brief the refreshes** with the **seo-content-brief** skill. A refresh must add something: current facts, the client's own data or examples, a clearer answer near the top, better structure, an expert reviewer. Changing the date without real changes is a warning sign Google lists.

4. **Fix the snippets** with the **title-and-meta-rewrite** prompt where CTR is weak. At level 2, save the new titles and descriptions as drafts in the CMS.

5. **Relink** (level 2 drafts, level 3 live). Run the **internal-link-suggestions** prompt for each refreshed or merged page and update links that pointed to merged URLs.

6. **Publish in a batch and annotate** the date in the reporting log so the effect can be measured. At level 3, publish within the pages and kinds of change the client listed, and log each change. At level 1 or 2, the client publishes.

7. **Measure after 6 to 8 weeks**, then at the next core update. Compare clicks, impressions and conversions for each page against its own baseline.

## Outputs

- A decision sheet: page, data, call (refresh, merge, remove, leave), reason, owner, due date.
- Briefs for each refresh.
- A redirect list for merges.
- A results table after 6 to 8 weeks.

## What needs the client's approval

At level 3, after the client confirms the action list and limits once, I publish within them and log each change: refreshed copy that passed its fact check, new titles and meta descriptions, and internal link updates on the pages listed.

Always a new yes:

- Every merge and removal, and the redirect list.
- New facts, prices or expert claims the client hasn't confirmed.
- Any change to page URLs.
- Anything outside the agreed pages or kinds of change.
