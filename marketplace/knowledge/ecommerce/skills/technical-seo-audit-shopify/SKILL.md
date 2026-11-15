---
name: technical-seo-audit-shopify
description: "A technical SEO audit of a Shopify store that finds what stops pages being crawled, indexed or shown, and fixes it in order: Search Console page indexing reasons read one by one, sitemap and robots.txt checks (including AI crawlers and CDN bot settings), canonicals and duplicate URL paths, domains and redirects, 404s and redirect chains, content hidden behind JavaScript, and the theme issues that cause them. Each issue is ranked by the gross profit of the pages it affects, with the exact fix, who does it and how to confirm it worked. Free tools first: Search Console, URL Inspection and a free crawler. Use when organic traffic drops, after a migration or theme change, before an SEO push, or when pages will not index."
---

# Technical SEO audit for Shopify

**You get:** a ranked issue list (issue, URLs affected, gross profit at stake, fix, owner, how to verify), a redirect sheet ready to import, a theme fix list for a duplicate theme, and a one-screen summary of what to fix this week.

## When to use

- Organic clicks fell and nothing changed in the ads or the offer.
- After a theme change, a migration or a domain change.
- Before investing in content or links, to make sure pages can be found.
- Search Console shows many pages "Discovered" or "Crawled" but not indexed.
- Products or collections do not show in Google or AI assistants at all.

## Not for

- Page speed and Core Web Vitals: use `shopify-speed-audit-and-fix-list`.
- Deciding what to do with duplicate or thin pages once found: use `fix-duplicate-and-thin-pages`.
- Structured data: use `add-product-schema-and-rich-results`.
- Moving platforms: use `migrate-store-to-shopify`.

## What you need

Required (read access, level 1):

1. **Search Console** access for the domain property (the owner adds the agent's Google account as a user; never ask for a password). Exports: Page indexing report with each reason, Sitemaps, Performance (Pages, 3 months), Links.
2. **Live URL** and the store's primary domain setting (Settings, Domains).
3. **Gross profit per order** by product and collection, from `build-sku-profit-sheet`.
4. **A crawl** of the store: a desktop crawler (free tiers handle around 500 URLs) or, for larger stores, a sample of the top 500 pages by clicks.

Optional: Shopify URL redirects export (Online Store, Navigation, URL redirects), Bing Webmaster Tools, server or CDN bot logs, the last theme change date.

Fixes need draft access (level 2): theme edits go into a duplicate theme; redirects are prepared as a CSV. The client publishes the theme and imports redirects. Editing robots.txt.liquid needs a separate, explicit client yes: Shopify calls it an unsupported customisation that can lose all traffic if wrong (Shopify Help Center, robots.txt page).

## Before you start: the gates

1. **Profit at stake is computable.** Pass when gross profit per order is known by product [MEA-0037]. Fail: rank issues by organic clicks, and say so.
2. **Search Console is verified** on a Domain property covering all hostnames. Fail: get it verified first; without it the audit is guesswork.
3. **Store is public.** No password page; the primary domain is set and other domains redirect to it.
4. **Change freeze.** Ask whether a sale or theme release is planned this week. Do not ship theme fixes in the middle of one.

## Steps

### 1. Read the indexing report reason by reason

Export Page indexing and sort reasons by count. Read each with what it usually means on Shopify:

| Reason | Usual cause on Shopify | Action |
|---|---|---|
| Alternate page with proper canonical tag | Variant and collection-path URLs pointing to the product | Normal; no action unless key pages are listed |
| Duplicate without user-selected canonical | Tag pages, vendor and type pages, parameters | Hand to `fix-duplicate-and-thin-pages` |
| Duplicate, Google chose different canonical | Conflicting signals | Inspect the URL; align links, canonical and sitemap |
| Crawled, currently not indexed | Thin or near-duplicate content | Improve or merge (hand off) |
| Discovered, currently not indexed | Weak internal links, new pages | Add internal links (`internal-linking-plan`) |
| Not found (404) | Deleted products, old handles | Redirect if the URL had clicks or links |
| Page with redirect | Old URLs still linked or in sitemap | Update internal links |
| Blocked by robots.txt | Checkout, cart, filtered and sorted collections (default) or a bad edit | Normal for defaults; investigate anything else |

List the money pages (top products and collections by gross profit) and check each with URL Inspection: indexed, Google's chosen canonical equals the store's, last crawl date.

### 2. Check sitemaps

Shopify generates sitemap.xml automatically with child sitemaps for products, collections, blogs and pages, and one per international domain (Shopify Help Center, sitemap page). Check: submitted in Search Console and Bing; no errors; count of URLs roughly matches published products and collections; each market domain submitted. Sitemap inclusion is only a weak canonical signal [SEO-6464], so a page in the sitemap can still be passed over.

### 3. Check robots.txt and bot access

- Open /robots.txt. Shopify's defaults block checkout, cart, admin and filtered or sorted collection URLs; these are fine.
- Look for added Disallow lines from a robots.txt.liquid edit or an app. Any rule blocking /products/ or /collections/ is a severity 1 issue.
- AI crawlers: a store that wants to be recommended must not block OAI-SearchBot, which decides whether the site can appear in ChatGPT search answers [AEO-6466]. Check the CDN or firewall too: some CDNs block AI bots by default, and about 5.9% of sites block GPTBot, often by accident [SEC-0002]. Confirm crawlers are allowed and the sitemap is submitted to both Google and Bing before any AI-search work [AEO-0028].

### 4. Check canonicals and duplicate paths

- Product links in collection grids: if they use /collections/x/products/y, fix the grid snippet so links go to /products/y and rebuild breadcrumbs from a metafield [SEO-0004].
- Every product's canonical points to /products/handle; variant URLs (?variant=) canonical to the product.
- Never use robots.txt or noindex to choose a canonical; use redirects or rel canonical [SEO-6464].

### 5. Domains and redirects

- One primary domain; www or non-www, the other and the myshopify.com address redirect to it.
- From the crawl, list 404s and redirect chains (A to B to C). Point every internal link and redirect straight to the final URL.
- 404s with clicks, external links or AI referral visits get a 301 to the closest live page. Assistants send many visits to made-up URLs, so redirect the common ones [AEO-0008]. Build the redirect sheet (old path, new path) for Shopify's bulk import.

### 6. Content that crawlers cannot see

Turn off JavaScript and reload the top product and collection templates. Reviews, FAQs, size charts or descriptions that vanish are invisible to most AI crawlers [AEO-0002]. Fix by choosing app settings that render server side, or moving key text into the product description or metafields.

### 7. Theme basics

One H1 per template (logo often wrongly wrapped in an H1); title tags and meta descriptions present and unique on the top 50 pages; images with alt text on product templates (hand gaps to `write-image-alt-text-at-scale`); leftover scripts from removed apps (hand to `remove-app-bloat`).

### 8. Rank and fix

Severity: 1 = money pages not indexed or blocked; 2 = canonical or redirect errors on money pages; 3 = sitewide hygiene. Within a severity, order by gross profit per order x organic impressions of the affected pages. Each fix gets an owner (agent at draft, client to publish, developer for code) and a test.

### 9. Verify

After each fix ships: URL Inspection live test, then Request indexing for the money pages; Validate fix in the indexing report. Re-read in 2 to 4 weeks; Google gives no fixed crawl time.

### 10. Market notes

- **Country domains and markets:** check each country domain or subfolder (.co.uk, .de, .com.au and so on) redirects or carries hreflang (`international-seo-hreflang`); delivery date, postcode checker and payment badge apps sometimes inject text by JavaScript, so include them in step 6.
- **Location pages:** pages built only to rank for each state, region or city are doorway risks; flag them.

## Checks before you hand it over

- Every indexing reason with more than 10 URLs has a cause and action.
- All money pages were inspected one by one, with Google's chosen canonical noted.
- robots.txt and the CDN bot setting were both checked, including OAI-SearchBot.
- The redirect sheet has no chains and no redirects to 404s.
- JavaScript-off check done on product and collection templates.
- Issues are ranked by severity, then by profit at stake.
- No theme, robots.txt or redirect change went live without the client's yes.

## Output

1. **One-screen summary:** the 3 fixes for this week, money pages not indexed, profit at stake, what needs a developer.
2. **Issue list** (`tech-seo-issues.csv`):

| # | Issue | Severity | URLs affected | Example URL | Gross profit per order at stake | Organic impressions | Fix | Owner | Access needed | How to verify | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Money page check:** URL, indexed (yes or no), Google canonical, store canonical, last crawl, issue.
4. **Redirect sheet** (`redirects.csv`): Redirect from, Redirect to.
5. **Theme fix list:** file, change, test, done on duplicate theme (yes or no).

## Common mistakes

- **Treating every "not indexed" as a bug.** Alternate canonical pages and blocked checkout are normal; step 1 separates them.
- **Blocking duplicates in robots.txt.** It hides them without merging signals; step 4 uses redirects and canonicals.
- **Ignoring the CDN.** robots.txt can allow a bot the CDN still blocks; step 3 checks both.
- **Redirect chains.** Step 5 points everything to the final URL.
- **Fixing hygiene before money pages.** Step 8 ranks by severity and profit.
- **Editing robots.txt.liquid lightly.** It needs a separate yes and a test.

## Sources

- AEO-0002: JavaScript-loaded widgets are invisible to most AI crawlers.
- AEO-0008: check CDN bot settings and redirect AI-referred 404s.
- AEO-0028: confirm crawler access, rendering and sitemaps first.
- AEO-6466: OAI-SearchBot controls ChatGPT search visibility.
- MEA-0037: gross margin is delivered cost.
- SEC-0002: GPTBot often blocked by accident; CDN defaults.
- SEO-0004: within-collection product links and breadcrumb fix.
- SEO-6464: canonical signals and what not to use.

What makes this skill ours: each Search Console reason is translated into its usual Shopify cause; issues are ranked by the gross profit of the pages they hide; AI crawlers and CDN bot settings are part of the audit; and risky edits like robots.txt.liquid need their own client yes.

## Selling in India

- Check any .in domain redirects or carries hreflang. COD and pincode checker apps often inject text by JavaScript; include them in step 6.
