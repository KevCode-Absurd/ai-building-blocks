# Search changes for collections, products and pages

A set of search changes (titles, meta descriptions, page copy and, only where needed, new addresses with redirects) chosen from your own Search Console data, written so shoppers want to click, approved by you as an exact change table, applied one at a time with the old values saved, checked live, and compared after 28 days.

**Starts from:** A monthly search review, a content refresh, a fix handed over from the AI search visibility process, or you asking why a collection or product does not show up in Google.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Stuart (stuart-store-seo) | intake.md | intake-complete | no | read |
| 2 | Search Console and analytics data | Stuart (stuart-store-seo) | search-data.md, keyword-map.md, numbers.json | data-numbers, data-review | no | read |
| 3 | Change table | Stuart (stuart-store-seo) | change-table.md | change-review | no | draft |
| 4 | Titles, descriptions and page copy | Georgia (georgia-product-copy) | copy.md, claims-log.md | copy-lint, readability, copy-review, claims-review | no | draft |
| 5 | Redirect list | Stuart (stuart-store-seo) | redirects.md | redirect-review | no | draft |
| 6 | Change pack for your yes | Stuart (stuart-store-seo) | change-pack.md, old-values.json | pack-complete | yes | draft |
| 7 | Apply one change at a time | Stuart (stuart-store-seo) | apply-record.md | none | yes, the plan | publish |
| 8 | Check the changes live | Stuart (stuart-store-seo) | verify.md | live-match | no | read |
| 9 | 28-day comparison | Stuart (stuart-store-seo) | results/compare-28.md | compare-numbers, readout-review | no | read |

## Stage by stage

### 1. Gather what we know

Collects the facts before any change is suggested: which collections, products and pages matter most for sales, the markets and languages, who the buyer is and the words they use, recent site changes, and what past search work taught us. It writes down what we can reach: Search Console (a restricted user is enough to read), GA4 through Google's read-only Analytics MCP, and the Shopify connector or CLI at the level you granted. Gaps become questions for you.

- **Needs:** context/org-context/ (customers, voice, claims, do's and don'ts); context/goals.json; context/learnings.md; Shopify connector or CLI (read): collections, products, pages and their current SEO fields; the task that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, the access table is filled, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the pages in scope with their sales share, the buyer and their words, the markets, recent changes with dates, the access we have, and the questions you answered.

### 2. Search Console and analytics data

Pulls clicks, impressions, click-through rate and position by page and by query for the last 16 months through the Search Console API, split into branded and non-branded searches, plus organic sessions and orders by landing page from GA4. Finds the chances: pages in positions 5 to 20 with many impressions, pages with a low click-through rate for their position, searches with no matching page, and two pages fighting for the same searches. Groups searches by intent into a keyword map. It notes AI Overview and AI Mode impressions from Search Console's generative AI report, which gives impressions only.

- **Needs:** intake.md; Search Console API (read-only scope) or your exports; GA4 through the Analytics MCP
- **Makes:** search-data.md, keyword-map.md, numbers.json
- **Checks:** data-numbers (every CTR, total and change in search-data.md recomputes from its saved Search Console and GA4 inputs); data-review (the numbers match Search Console and GA4 for the stated dates, branded and non-branded are split the same way throughout, and each chance names its date range)
- **Done when:** search-data.md lists each chance with its page, query group, clicks, impressions, CTR, position and date range, and keyword-map.md assigns every valuable query group to one address.

### 3. Change table

Writes one row per change: the address, the field, the old value exactly as it is now, the proposed value or the brief for new copy, the reason with its numbers, and the risk. Titles and meta descriptions for products and collections use their SEO fields; pages use their title tag and description tag fields. An address (handle) change is proposed only when the gain is clear, and always with a redirect from the old address. Copy rows go to the product copywriter.

- **Needs:** search-data.md; keyword-map.md
- **Makes:** change-table.md
- **Checks:** change-review (each change fits the search intent of its query group, no two addresses are aimed at the same group, and every handle change has a clear reason and a redirect)
- **Done when:** every row has address, field, old value, new value or copy brief, reason with numbers and risk, and every handle change has a redirect row.

### 4. Titles, descriptions and page copy

Writes the new titles and meta descriptions so a shopper sees what the page offers and wants to click, in the store's voice, using the words buyers search with and the same words as the store's filters. Where a row asks for copy, writes the collection intro, buying guide or FAQ from real shopper questions, or the product copy, from a checked fact sheet. Every claim gets a status in the claims log.

- **Needs:** change-table.md; keyword-map.md; context/org-context/ voice and claims; product labels and spec sheets
- **Makes:** copy.md, claims-log.md
- **Checks:** copy-lint (the copy checker exits 0); readability (the readability check exits 0 for a consumer audience); copy-review (each title and description tells a shopper what they get and why to click, in the brand voice, without keyword stuffing, and page copy answers real shopper questions); claims-review (every origin, material, green, health, review and price claim is proven or cut, and the claims log matches the copy)
- **Done when:** every copy row in the change table has its final text in copy.md with character counts, and claims-log.md gives each claim a status.

### 5. Redirect list

For every address change, lists the old path, the new path, and checks there is no chain (a redirect to a redirect), no loop, and no redirect away from an address that still has a live page. Also lists internal links and menus that point at the old address. If no address changes, it says so in one line.

- **Needs:** change-table.md; Shopify connector or CLI (read): existing URL redirects and menus
- **Makes:** redirects.md
- **Checks:** redirect-review (no chains, loops or redirects away from live pages, and every internal link and menu that points at an old address is listed)
- **Done when:** redirects.md lists each old and new path with no chains or loops and the links to update, or states that no address changes.

### 6. Change pack for your yes

Puts the final change table on one page with every new value written out in full, the redirect list, the order the changes will be made in, and the old values saved to a file so each change can be undone exactly. Handle changes and redirects are shown apart, because they are harder to undo.

- **Needs:** change-table.md; copy.md; redirects.md
- **Makes:** change-pack.md, old-values.json
- **Checks:** pack-complete (every approved row has its exact new value, its old value is in old-values.json, the order is set, and redirects are shown apart)
- **Done when:** change-pack.md has every change with its exact new value and order, redirects are listed apart, and old-values.json holds the current value of every field that will change.
- **You sign off:** You read every row: address, old value, new value and reason, and the redirect list. Reply yes with the code to approve exactly these changes, or name the rows to drop.

### 7. Apply one change at a time

Shows you the apply plan, one step per change, in the approved order. On your yes it makes each change and reads it back before the next. These Shopify updates have no built-in protection against running twice, so if a step fails it stops, checks what actually changed, and tells you; it never retries on its own. Undo for any step: write back the value saved in old-values.json, and remove a redirect only after its address is restored.

- **Needs:** change-pack.md (signed off); old-values.json; Shopify connector at level 3, or the Shopify CLI (shopify store execute with --allow-mutations) in Claude Code
- **Makes:** apply-record.md
- **Goes live:** Through the Shopify connector or the Shopify CLI: productUpdate and collectionUpdate with the seo title and description input, page title tag and description tag metafields, approved copy fields, handle changes with redirectNewHandle true, and urlRedirectCreate for each listed redirect. Shoppers and Google see the changes from this step.
- **Done when:** Every step of the apply plan ran once and was read back, and apply-record.md lists each change with its time, old value and value read back.

### 8. Check the changes live

Opens each changed address and checks the page source shows the new title, meta description and canonical, and the copy as approved. Checks every old address returns a single 301 to its new address. Checks the status of key addresses with Search Console's URL Inspection API, which reports status only; it cannot ask Google to index a page, so it lists the addresses for you to submit by hand with Request indexing in Search Console if you want to.

- **Needs:** apply-record.md; change-pack.md; Search Console URL Inspection API (read-only scope)
- **Makes:** verify.md
- **Checks:** live-match (every live value matches the approved change pack exactly, and every redirect returns one 301 to the right address)
- **Done when:** verify.md records for each address the live title, description, canonical, copy match, redirect result and inspection status, with any problem and its fix.

### 9. 28-day comparison

After 28 days, plus 3 days for Search Console data to settle, compares each changed address with its own 28 days before (same weekdays): clicks, impressions, click-through rate and position, and organic orders from GA4 and Shopify. It reads this as a trend, not a controlled test, and names any Google update, sale or seasonal shift in the window. Adds a dated lesson to context/learnings.md.

- **Needs:** apply-record.md; search-data.md; Search Console API; GA4 through the Analytics MCP
- **Makes:** results/compare-28.md
- **Checks:** compare-numbers (every before, after and change recomputes from its inputs, and no column mixes two date ranges); readout-review (both windows are 28 days with matching weekdays, the numbers match Search Console and GA4, and outside events in the window are named)
- **Done when:** compare-28.md gives before and after for each address with both date ranges, the outside events in the window, a keep or revert suggestion per change, and the lesson appended to context/learnings.md.

## Where you step in

- **Change pack for your yes:** You read every row: address, old value, new value and reason, and the redirect list. Reply yes with the code to approve exactly these changes, or name the rows to drop.
- **Apply one change at a time:** approve the exact plan of live changes

## How we judge it

- Main number from context/goals.json first. For search work this is usually non-branded clicks from Google to collections and products, and the orders they bring.
- Per changed address: clicks, impressions, click-through rate and average position against its own 28 days before, from Search Console.
- Orders and revenue from organic sessions landing on the changed addresses, from GA4 and Shopify.
