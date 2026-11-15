---
name: optimize-collection-pages-for-seo
description: "The search side of a store's collection pages, ready to paste into Shopify: an SEO title, meta description, H1 and URL handle for each collection, a short intro above the grid and a buying guide below it, decisions on which filter combinations deserve their own indexable collection and which stay as filters, and the internal links (sub-collections, breadcrumbs, product links without collection paths) that pass strength to the page. Works from a keyword map and the store's Search Console data, ranks collections by the gross profit they sell, and keeps copy useful to buyers, not stuffed. Use when collections get impressions but sit below the top results, after keyword research, or when new collections are added."
---

# Collection pages that rank

**You get:** a collection SEO sheet for the top 5 to 15 collections (title tag, meta description, H1, handle, intro copy, below-grid guide, sub-collection links, filter decisions), a redirect list for any changed handle, and a theme fix list, ready for the client to approve and publish.

## When to use

- Collection pages earn impressions in Search Console but average position is 5 to 20.
- A keyword map exists and the collections need their copy and settings.
- New sub-collections are being added for searched variants.
- Collections have no copy, or one generic paragraph copied across many.

## Not for

- Choosing keywords: run `keyword-research-for-collections-and-products` first.
- Layout, sort order, product cards and filter order for conversion: use `build-collection-page-that-converts`.
- Menu and collection rules: use `set-up-navigation-and-collections`.
- Site-wide links between blog, collections and products: use `internal-linking-plan`.

## What you need

Required (read access, level 1):

1. **Keyword map** from `keyword-research-for-collections-and-products`, with one primary keyword per collection.
2. **Search Console Pages export** filtered to /collections/, last 3 months: clicks, impressions, CTR, position.
3. **Collection list** with handle, product count, rule, current title tag and description (Shopify admin or a CSV from a bulk editor).
4. **Gross profit per order** for the products in each collection.
5. **Theme access to read** the collection template and product grid snippet.

Optional: GA4 landing page report for organic sessions (filtered to purchase), top reviews per collection, return reasons, size or fit questions from support.

Editing collections and the theme needs draft access (level 2): changes go into a duplicate theme or unsaved drafts, and the client publishes. Changing a URL handle always needs a client yes.

## Before you start: the gates

1. **Profit per collection.** Pass when each collection shows the gross profit per order of what it sells [MEA-0037]. Fail: work in order of organic clicks only, and say so.
2. **Indexable.** URL Inspection shows the collection indexed with the store's canonical. Fail: hand to `technical-seo-audit-shopify` first.
3. **Stock.** The first two rows of the grid are in stock. A collection that ranks but shows sold-out items wastes the visit.
4. **Claims.** Any benefit or health line in the copy has a source in `product-claims-profile` or is cut.

## Steps

### 1. Pick the collections to work on

Rank by: gross profit per order x organic impressions, then favour collections at positions 4 to 20, where a better page can move the most. On stores with over 50 products, collections tend to carry the bulk of organic revenue [SEO-0003], so start here before products or blog posts.

### 2. Write the tags and heading

One practitioner's Shopify pattern [SEO-0005], a practitioner default to test:

- **SEO title:** primary keyword first, under 60 characters, then a buyer reason and the brand ("Linen Shirts for Men | Free Returns | Store"). Add "Online", "Free Returns" or a payment option only if true for every product.
- **H1:** the keyword as buyers say it, nothing else. One H1 per page; check the theme does not also wrap the logo or a banner in an H1.
- **Meta description:** 140 to 155 characters, what the range covers, one proof point that is true (range size, delivery promise, return window), no claims you cannot back.
- **Handle:** short, the keyword, hyphens. Change an existing handle only if it is meaningless; Shopify offers a redirect checkbox when you edit it, and it must stay ticked. Record old and new in the redirect list.

### 3. Write the copy: short above, useful below

- **Above the grid:** 1 to 2 sentences, under 40 words on mobile, saying what is in the range and who it suits. Products must stay in the first screen.
- **Below the grid:** a buying guide of 300 to 800 words: how to choose (size, material, use), a small comparison table of the types in the range, care, and 3 to 5 real buyer questions with short answers. The practitioner pattern suggests 500 to 1,000 words mostly below the grid [SEO-0005]; length follows what buyers need, not a count.
- Visitors from search are already looking to buy; social proof near the top serves them better than education [LPG-0050]. A line with the real review count and rating, from the review app, fits under the intro.
- Write each collection's copy fresh. The same paragraph across 20 collections reads as filler and helps none of them.
- Answers must be in the page HTML, not loaded later by an app; content injected after load is often invisible to AI crawlers [AEO-0002]. Test by turning off JavaScript and reloading.
- **Splitting Shopify's one description field.** Shopify gives a collection one description, so the short intro and the long guide need a theme change: either a marker in the HTML view that the collection template splits on (text before it shows above the grid, text after it below), or a short intro with a read-more block. The client edits a duplicate theme first and checks on a phone before publishing.
- **Links inside the guide.** 3 to 5 internal links to sibling collections, the parent and buying guides, each with 2 to 4 word link text that names the page it goes to ("linen care guide", not "click here").
- **Featured reviews without a widget.** Pick three real reviews that mention the collection's keyword or use case, and place them as plain text in the guide or a metafield. A review widget only to show three quotes slows the page. Never change a review's meaning.
- **FAQ questions from real searches.** Take the 3 to 5 questions from People Also Ask for the keyword and from support tickets, answered from the product facts.

### 4. Decide filters versus sub-collections

Shopify's default robots.txt blocks tag-filtered (with a plus sign) and sorted collection URLs from crawling (Shopify Help Center, robots.txt page), and filter parameters point their canonical to the base collection. So filters do not rank. For each common filter value:

| Condition | Decision |
|---|---|
| Searched term (in the keyword map), buying intent, enough in-stock products for two mobile rows | Build a sub-collection with its own title, H1 and copy [SEO-0012] |
| Searched but under two rows of products | Keep as filter; mention the term in the parent guide |
| Not searched | Filter only |

Do not mass-produce near-identical collections for every colour and size; pages built only to catch similar searches are doorway pages under Google's spam policies [SEO-6461].

**Finding new collections in the best-selling range.** The same products can be framed for different searches: by buyer (men's, kids'), style (oversized), material, use (running, travel) or price band (under $50). For each framing, build a collection only when the term shows buying intent, collection pages already rank for it, big brands do not hold the whole top five, and keyword difficulty sits under about 35 (lower for a new site; one founder's rule of thumb to test). Reuse existing products; only the framing changes. Ship new collections in batches of 5 to 10 and check indexing and impressions in Search Console before the next batch.

### 5. Link the page into the store

- **Sub-collection links:** a row of text or image links under the intro to the child collections (for example "Linen shirts: short sleeve, oversized, white").
- **Breadcrumbs:** Home > Parent > Collection, as real links.
- **Product grid links:** if product links include /collections/handle/products/, remove the "within collection" filter in the grid snippet so links point to the /products/ URL, and rebuild breadcrumbs from a metafield, because the fix breaks default breadcrumbs [SEO-0004]. Rel canonical already points those paths to /products/, but direct links are a stronger, cleaner signal [SEO-6464].
- **From elsewhere:** list which blog posts and product pages should link to this collection, and pass the list to `internal-linking-plan`.

### 6. Check the grid itself

- 24 to 48 products per page load (practitioner range [SEO-0005]); with more, use pagination with plain links, not only infinite scroll, so crawlers reach page 2.
- On mobile, four products visible on the first screen with prices helps buyers [LPG-0059]; check the intro is not pushing them down.
- Pin in-stock, higher-profit products first (hand the sort rule to `build-collection-page-that-converts`).

### 7. Market notes

- **Every market:** if the store sells in the languages your buyers use beyond English, each translated collection needs its own translated title, H1 and copy, not English copy under a translated menu, plus hreflang tags so each country sees its own version. Price bands in guides use the store's own currency, with tax shown the way local buyers expect.
- **US:** state shipping and return terms only as written in the store's policy pages.
- **UK, EU and Australia:** price bands in guides include VAT or goods and services tax; do not claim "free returns" beyond what the policy gives.

### 8. Ship and measure

Hand the sheet for approval; the client publishes. After publishing, request indexing for each changed collection in URL Inspection. Re-read Search Console after 4 and 8 weeks for position, CTR and clicks per collection, against the untouched collections as a rough control. Practitioner default: give a change 8 weeks before judging it.

## Checks before you hand it over

- Every title starts with its mapped keyword and is under 60 characters.
- One H1 per page, matching the keyword.
- Intro is under 40 words and products are visible on the first mobile screen.
- No two collections share copy; every claim has a source.
- Each filter value has a decision from the table, with the reason.
- Every changed handle is in the redirect list.
- Each guide has 3 to 5 internal links with descriptive link text; featured reviews are real, unedited and placed without a widget.
- Every new collection framing passed the intent, ranking and difficulty test, and new pages ship in batches of 5 to 10.
- Product grid links point to /products/ URLs, and breadcrumbs still work.
- Nothing was published without the client's yes.

## Output

1. **One-screen summary:** collections chosen and why, the biggest change on each, sub-collections proposed, handles changed, when results will be read.
2. **Collection SEO sheet** (`collection-seo.csv`):

| Collection | Handle (old > new) | Primary keyword | SEO title | Characters | Meta description | H1 | Intro (above grid) | Guide outline (below grid) | Sub-collection links | Gross profit per order | Position now | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Filter decisions:** Filter value, searched (yes or no), products in stock, decision, reason.
4. **Redirect list:** Old URL, new URL.
5. **Theme fix list:** each change (H1 on logo, within-collection links, breadcrumbs, pagination), file, and how to test it.
6. **Full copy** for each collection's intro and guide, ready to paste.

## Common mistakes

- **Copy above the grid.** Long intros push products off the first screen; step 3 caps it.
- **Indexing filters.** Shopify blocks them anyway; step 4 builds real sub-collections only where search and stock justify it.
- **One template paragraph for all.** Step 3 writes each collection fresh.
- **Changing handles casually.** Step 2 changes them only with a redirect and a yes.
- **Duplicate product paths.** Step 5 fixes grid links at the source.
- **Judging after a week.** Step 8 waits 8 weeks.
- **One broad collection for a whole range.** Step 4 frames the same products for buyer, style, use and price searches, in tested batches.
- **A widget for three quotes.** Step 3 places featured reviews as plain text.

## Sources

- AEO-0002: app-loaded content is often invisible to AI crawlers.
- LPG-0050: search traffic needs proof near the top.
- LPG-0059: four products with prices on the first mobile screen.
- MEA-0037: gross margin is delivered cost.
- SEO-0003: collections carry most organic revenue on larger stores.
- SEO-0004: remove within-collection product links and rebuild breadcrumbs.
- SEO-0005: Shopify collection title, H1, products per page and copy pattern.
- SEO-0012: sub-collections for searched variants.
- SEO-6461: doorway pages and other spam patterns.
- SEO-6464: redirects and rel canonical as canonical signals.

What makes this skill ours: collections are worked in order of gross profit and near-win position; filters become indexable collections only when search, stock and margin all agree; copy is checked to be in the page HTML for AI crawlers; and handle changes always carry a redirect and a client yes.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. If the store sells in Hindi or regional languages, each translated collection needs its own title, H1 and copy. Add "COD Available" to SEO titles only if true for every product. Price bands use rupees with GST included.
