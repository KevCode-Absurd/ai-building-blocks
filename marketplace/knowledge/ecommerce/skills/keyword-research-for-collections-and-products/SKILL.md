---
name: keyword-research-for-collections-and-products
description: "A keyword map for a store's collection and product pages: one primary keyword and its close variants per page, with monthly searches, buyer intent read from the live results page, a difficulty call, the cost per click as proof the term earns money, and the gross profit each page sells. Built from the store's own Search Console queries, its catalogue, customer words and free Keyword Planner data, with clashes between pages found and gaps turned into new collection ideas. Ranks the work by profit, not search volume, and picks one product cluster to focus on for 90 days. Use before writing collection or product page copy, before adding collections, or when organic traffic is flat and nobody knows which terms to chase."
---

# Keyword research for collections and products

**You get:** a keyword map sheet with one row per collection and product URL (primary keyword, variants, monthly searches, intent, difficulty, CPC, gross profit per order, priority), a list of page clashes to fix, up to 10 new collection ideas, and a one-screen 90-day focus plan.

## When to use

- Collection or product pages are about to be written or rewritten and need target terms.
- Organic traffic is flat and the team is guessing which searches to chase.
- The store is adding collections and wants each to match a real search.
- Two pages seem to compete for the same search and neither ranks well.
- A new product range is launching and its pages need names buyers type.

## Not for

- Writing the collection page itself: use `optimize-collection-pages-for-seo` after this map.
- Feed titles for Google Shopping: use `write-product-feed-titles-that-match-searches`.
- Paid search keyword lists and bids: use `google-keyword-tiers`.
- Questions for blog or answer pages: use `write-seo-blog-posts-that-sell` or `answer-pages-for-buyer-questions`; this skill passes them its informational terms.

## What you need

Required (read access, level 1):

1. **Shopify product export** (CSV): Handle, Title, Type, Tags, Vendor, Variant SKU, Variant Price, Status, Published.
2. **Collection list** with handle, title and product count.
3. **Search Console Performance export**, last 3 months at least (16 if possible): Queries and Pages tabs, with clicks, impressions, CTR and position. Country filter set to each country sold to.
4. **Gross profit per order by product**, from `build-sku-profit-sheet` or `store-knowledge-folder`.
5. **Keyword volumes** from Google Keyword Planner (free with a Google Ads account, no spend needed) or any keyword tool the client already pays for.

Optional: support tickets and reviews (buyer words), Shopify site search terms, stock cover per SKU, 3 rival stores.

If Search Console is not set up, ask the owner to verify the domain (they sign in; never ask for a password) and work from Keyword Planner alone, marking volumes as estimates. Changing page titles or URLs is a later job at draft access with the client's yes.

## Before you start: the gates

1. **Gross profit per order is known per product.** Pass when built from delivered costs, not price minus product cost [MEA-0037]. Fail: run `build-sku-profit-sheet` first; without it the map can list terms but cannot rank them.
2. **Runway.** Organic search usually pays back over months, not weeks. Practitioner default: if the store needs orders this quarter to survive, say so in the first line and point the owner to paid search; still deliver the map, ranked for later.
3. **Stock.** A term mapped to a product with under 30 days of cover and no reorder gets flagged, not prioritised.
4. **Indexable store.** The store is not password protected and Search Console shows pages indexed. Fail: run `technical-seo-audit-shopify` first.

## Steps

### 1. Build the seed list from the store, not a tool

Pull candidate terms from four places and keep the source on each:

- Product data: product type, material, use, audience, size and style words from titles and tags.
- Search Console queries that already earn impressions (these are proven, even at position 30).
- Buyer words from reviews, tickets and site search. Buyers often name things differently from the catalogue ("gym bag" versus "duffel").
- Assistant sub-searches: ask an AI assistant with search on a category question and read the searches it runs; reuse that wording [AEO-0016]. Chat prompts run longer and more specific than typed searches [AEO-0031], so note the long versions too.

### 2. Expand and get volumes

Put the seeds into Keyword Planner with the right country and language. Add Google autocomplete, "People also ask" and marketplace search suggestions (Amazon, Flipkart, Myntra, Nykaa as relevant). Record monthly searches. Keyword Planner shows ranges without ad spend; treat them as bands, and trust the store's own Search Console impressions over any tool where both exist.

### 3. Read intent from the live results page

Search each candidate in a private window set to the target country and look at the top 10:

| Top results are mostly | Intent | Page type to map |
|---|---|---|
| Category grids from stores and marketplaces | Buying, browse | Collection |
| Single product pages | Buying, specific | Product |
| "Best X", "X vs Y", buying guides | Comparing | Blog or comparison page (hand off) |
| How-to, what-is, definitions | Learning | Answer page or skip |

Never map a term to a page type that the results page does not show. If the top 10 are guides, a collection page will not rank for it however good it is.

### 4. Judge difficulty and money

- **Difficulty:** use a tool score if the client has one, or judge by hand: count how many top 10 results are large marketplaces or national brands with an exact-match page. Seven or more is hard for a small store.
- **Money:** cost per click from Keyword Planner shows advertisers pay for the click, which is evidence the term sells.
- One practitioner's screen for a small store's first targets: buying intent, over 1,000 monthly searches, difficulty under 40 and CPC over 1 dollar [SEO-0008]. It holds for US stores with a tool score; for India, scale the CPC bar to the market (rupee CPCs run lower) and accept smaller volumes for narrow, high-margin products. Practitioner default, test it.
- Narrow variant terms ("oversized hoodies", "hoodies under 50") with difficulty under 35 and buying intent are often easier first wins than the head term [SEO-0012].

### 5. Map one primary keyword per page

For each existing collection and product URL, pick one primary keyword and 2 to 5 variants with the same intent. Rules:

- Collections take the category and variant terms; products take model, brand plus type, and specific attribute terms. On stores with over 50 products, collections tend to carry most organic revenue [SEO-0003], so map collections first.
- One primary keyword per URL. A term never sits as primary on two pages.
- Find clashes: in the Search Console Pages and Queries export, list every query where two or more store URLs earn impressions. Each clash gets a decision: pick the stronger page, retarget the weaker one, or merge (hand to `fix-duplicate-and-thin-pages`).

### 6. Turn gaps into collection ideas

Group remaining buying terms into clusters. A cluster with no page becomes a new collection idea only if all of these hold:

- the results page shows category grids;
- the store has enough in-stock products to fill at least two rows on a phone (practitioner default);
- gross profit per order on those products is at or above the store median.

Building collections for buying terms before blog posts drove most of the gain in one practitioner case [SEO-0001]. List the ideas with the rule each collection would use, and pass them to `set-up-navigation-and-collections`.

### 7. Score and rank by profit

Priority score per page = monthly searches x the store's own CTR at positions 1 to 3 (from Search Console; if none, mark "estimate") x site conversion rate for organic visits (GA4, filtered to purchase [MEA-0002]) x gross profit per order. This is a ranking aid, not a forecast; never show it to the client as expected revenue. A small number of pages usually carry most organic traffic [SEO-0013], so the top 10 rows get the effort.

### 8. Pick one cluster for 90 days

Choose the product cluster with the highest summed score that the store can stock and staff. Put all SEO effort there for a quarter, starting with the most purchase-ready terms [SEO-0009]. Runner-up cluster in one line.

### 9. Market notes

- **India:** check Hinglish and transliterated terms ("kurti for women", "saree online"), "price", "online" and city modifiers; run Keyword Planner per language where the store has translated pages. "COD" in a query signals a buyer; note it for the page copy.
- **US:** watch for "near me" and local-pack results; an online-only store skips terms where the results page is mostly maps.

## Checks before you hand it over

- Every mapped URL has exactly one primary keyword, and no primary appears twice.
- Each intent call was made from the live results page in the target country, with the date.
- Volumes show their source (Search Console or Keyword Planner) and estimates are marked.
- Every priority row shows gross profit per order; none is ranked on volume alone.
- All clashes found in Search Console have a decision.
- New collection ideas pass the stock and profit rule.
- No page titles, URLs or menus were changed.

## Output

1. **One-screen summary:** the 90-day focus cluster and why, the top 10 pages to work on, clashes found, new collections proposed, runner-up cluster in one line.
2. **Keyword map sheet** (`keyword-map.csv`), one row per URL:

| URL | Page type | Primary keyword | Variants | Monthly searches | Source | Intent (from results page) | Difficulty | CPC | Products | Gross profit per order | Stock flag | Current position | Priority score | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Clash list:** Query, URL A, URL B, impressions each, decision.
4. **New collection ideas:** Cluster, primary keyword, searches, rule (tags, type, price), products in stock, gross profit per order.
5. **Hand-off list:** informational terms for blog and answer pages.

## Common mistakes

- **Chasing volume.** A big term on a low-margin product loses to a small term on a high-margin one; step 7 ranks by profit.
- **Mapping against intent.** Step 3 makes the results page decide the page type.
- **Two pages, one term.** Step 5 finds clashes from real Search Console data.
- **Tool numbers as truth.** Step 2 prefers the store's own impressions.
- **Empty new collections.** Step 6 needs stock and margin before a collection is proposed.
- **Spreading thin.** Step 8 picks one cluster.

## Sources

- AEO-0016: reuse the sub-searches assistants run in page titles and headings.
- AEO-0031: chat prompts are longer and more specific than searches.
- MEA-0002: GA4 conversion rate must be filtered to purchase.
- MEA-0037: gross margin is delivered cost, not product cost.
- SEO-0001: collections for buying terms before blog posts.
- SEO-0003: collections carry most organic revenue on larger Shopify stores.
- SEO-0008: first-target screen of intent, volume, difficulty and CPC.
- SEO-0009: one product cluster for a 90-day quarter.
- SEO-0012: sub-collections for searched variants at low difficulty.
- SEO-0013: a few pages drive most organic traffic.

What makes this skill ours: pages are ranked by gross profit per order and stock, not search volume; intent is read from the live results page in each selling country; clashes come from the store's own Search Console data; and India's Hinglish and COD buyer terms are part of the seed list.
