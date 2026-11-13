---
name: fix-site-search-and-navigation
description: "Turns what buyers type into the store's search box, and where they get lost in menus and filters, into a ranked fix list: synonyms and product data for failed searches, redirects for policy questions, menu and filter changes for categories buyers look for but cannot find. Classifies the store's own search terms by type, runs the top ones on a phone, checks menu clicks and collection filters, and sizes each fix by searches and gross profit. Free paths throughout (Shopify reports, Shopify's free search app, GA4). Use when searchers convert poorly, the zero-result list is long, the menu has grown messy, or new categories were added."
---

# Fix site search and navigation

**You get:** a search term sheet (top terms classed by type and marked works, weak or fails), a ranked fix list of synonyms, product data, redirects, menu and filter changes with searches affected and gross profit at stake, and a before and after target for zero-result rate and searcher conversion.

## When to use

- Many visitors search, and searchers do not convert better than non-searchers.
- The "no results" search list is long or full of words buyers clearly mean.
- The menu has grown past what fits on a phone, or new categories were added.
- Collection filters exist but buyers still search for sizes, colours or uses.

## Not for

- Building the menu and collection structure from scratch: use `set-up-navigation-and-collections`.
- Collection page layout, intro copy and product card rules: use `build-collection-page-that-converts`.
- Search engine rankings for collections: use `optimize-collection-pages-for-seo`.
- Product order on home and collections: use `merchandise-homepage-and-collections`.

## What you need

Required (read access, level 1):

1. **Search terms, last 90 days:** Shopify reports for top online store searches and top searches with no results; or GA4 site search (view_search_results event with search_term). Include counts.
2. **Searcher behaviour:** sessions with a search, and their conversion rate, against sessions without (GA4 exploration with a segment on the search event).
3. **Menu and collection list:** main menu, footer menu, collections with their rules, filters shown on collection pages.
4. **Product data:** titles, product types, tags, variant options and any metafields (size, material, use).
5. **Gross profit per order.**

Optional: heatmap or click data on the menu and filters, session recordings of searchers, support tickets asking "do you have...".

If search terms are not tracked, turn on GA4 enhanced measurement site search (or the Shopify report) and collect 2 to 4 weeks; meanwhile audit menus and filters. Search settings, synonyms and menus need draft access (level 2) where the tool allows staging; live changes need the client's yes.

## Before you start: the gates

1. **Search tracking works.** A test search shows up in the report with the right term. Fail: fix tracking first.
2. **Enough searches to read.** At least about 200 searches in the window (practitioner default). Fewer: focus on navigation, and keep search fixes to the top 20 terms and zero-result terms.
3. **Gross profit per order known** [MEA-0037].
4. **Product data can be edited.** Many search fixes are data fixes (tags, types, metafields). If the catalog comes from a feed or ERP, the fix goes there, with its owner named.

## Steps

### 1. Measure what search is worth

Searcher share = sessions with a search / all sessions. Compare searcher and non-searcher conversion. If searchers convert no better than non-searchers, search is failing them: people who search usually know what they want. Gross profit at stake a month = searching sessions x (realistic conversion gain, working figure: half the gap to 1.5 times non-searcher conversion, marked) x gross profit per order.

### 2. Class the top terms by type

Take the top 200 terms and all zero-result terms. Class each:

| Type | Example shape | Typical fix |
|---|---|---|
| Exact (product name, SKU) | "[product name]" | Title, SKU, typo tolerance |
| Product type | "kurta", "serum" | Product type and tags |
| Problem or symptom | "dry skin", "back pain" | Tags or metafields linking products to problems |
| Feature | "waterproof", "cotton" | Metafields and filters |
| Use case | "for travel", "gift for dad" | Tags, curated collections |
| Compatibility | "fits iPhone 15" | Compatibility metafield |
| Abbreviation, misspelling, local word | "moisturiser", regional names | Synonyms |
| Non-product | "returns", "track order", "COD" | Redirect to the right page |

Large-site research found 56% of sites fail shoppers' search needs; non-product (66%), abbreviation and symbol (54%), compatibility (44%) and use-case (43%) queries fail most, exact names least (12%) [CRO-6182]. Use this to know where to look; the store's own terms decide what to fix.

### 3. Run the top terms on a phone

Search the top 50 terms and every zero-result term with 3 or more searches. Mark each: **works** (right products in the first 4 results), **weak** (results exist but the right ones are low or mixed with wrong ones), **fails** (none, or wrong). Also check: typing suggestions appear, a misspelled version works, the results page has filters and sort, and the no-results page offers bestsellers, popular categories and a contact route rather than a dead end.

### 4. Write the search fixes

- **Synonyms:** group words that mean the same thing (local spellings, regional names, slang). Shopify's free Search and Discovery app handles synonyms, filters and boosts; other search apps work the same way.
- **Product data:** add the missing product type, tags or metafields so problem, feature, use and compatibility terms match.
- **Redirects:** send policy and service terms (returns, refund, track, shipping, COD, size chart) straight to the right page.
- **Boosts:** for broad terms, put bestsellers and in-stock items first.
- **Gaps:** terms for products the store does not sell go to the merchandising team as demand signals, not fixes.

### 5. Check the navigation against search demand

- **Menu size:** keep main navigation under 7 items; one brand's orders rose after it cut the menu and removed elements under 1% of clicks [LPG-0007]. More than 7 visible items shows diminishing returns, and category images in the menu lifted conversion in one test [LPG-0033]; image or icon category navigation beat a text menu in another [LPG-0039].
- **Order:** new visitors open the menu first; put bestsellers at the top and push contact, FAQ and review links down [LPG-0061].
- **Missing categories:** a product type or use case searched often but absent from the menu or collections is a navigation gap. Add it as a collection, or a menu item if it is big enough.
- **Click data:** an element that gets many clicks but sits where few visitors reach it is worth moving up [CRO-0022]; elements under about 1% of clicks are candidates to cut [LPG-0043].
- **Filters:** offer filters for the attributes buyers search (size, colour, price band, feature, use). Hide filters with one value.
- **Product pages:** do not add links that pull buyers away from the product; one brand lost revenue after adding category breadcrumbs to product pages [LPG-0071]. If breadcrumbs are needed for search engines, keep them small and use the Shopify product URL fix [SEO-0004].

### 6. Rank the fixes

Gross profit at stake per fix a month = monthly searches (or menu sessions) affected x expected conversion gain x gross profit per order. For search fixes, use the searcher conversion gap from Step 1 as the gain, capped at that gap. Repairs (broken search, dead-end results page) first, then by gross profit per hour of work.

### 7. Set the read-out

Targets after 4 weeks: zero-result rate on the top 200 terms down (working target: under 5% of searches, practitioner default), searcher conversion up, and no fall in menu click-through. Read before and after; most stores cannot split test search changes.

### 8. India and US notes

- **India:** add Hindi or regional words written in English letters as synonyms (for example local names for garments or ingredients), and common misspellings; redirect "COD", "cash on delivery" and "pincode" searches to the delivery and payment page.
- **US:** add US and UK spelling pairs (color and colour) and size terms (petite, plus, tall) as filters or synonyms.

## Checks before you hand it over

- Top 200 terms and all repeated zero-result terms are classed and marked works, weak or fails.
- Each fix names the term group, the change (synonym, data, redirect, boost, menu, filter) and the owner.
- Policy and service searches redirect to the right page.
- The menu plan stays at 7 items or fewer, with bestsellers first.
- Each fix shows searches affected a month and gross profit at stake, capped by the searcher gap.
- The no-results page offers a useful next step.
- No live change without the client's yes.

## Output

**One-screen summary:** searcher share and conversion against non-searchers, zero-result rate, gross profit at stake, and the top 5 fixes.

**Search term sheet:** Term, Searches (90 days), Type, Result on phone (works, weak, fails), Right result should be, Fix type, Fix detail.

**Fix list:**

| # | Fix | Type (synonym, data, redirect, boost, menu, filter, repair) | Terms or pages affected | Searches or sessions a month | GP at stake a month | Owner | Effort | Approval |
|---|---|---|---|---|---|---|---|---|

**Menu plan:** current menu beside the proposed menu, item by item, with the reason for each change.

## Common mistakes

- **Redesigning the search box instead of fixing data.** Step 4 fixes synonyms, tags and metafields first.
- **Ignoring non-product searches.** Step 2 classes them and Step 4 redirects them.
- **Adding menu items for every category.** Step 5 caps the menu and orders by demand.
- **Judging search by a desktop test.** Step 3 runs terms on a phone.
- **Leaving the no-results page blank.** Step 3 checks it offers a next step.
- **Breadcrumbs and links that lead away from products.** Step 5 keeps product pages focused.

## Sources

- CRO-0022: well-clicked elements reached by few visitors are worth moving up.
- CRO-6182: share of sites failing each search query type.
- LPG-0007: main navigation under 7 items; prune elements under 1% of clicks.
- LPG-0033: category images in the menu; diminishing returns past 7 items.
- LPG-0039: image or icon category navigation beat a text menu.
- LPG-0043: prune elements under about 1% of clicks.
- LPG-0061: bestsellers at the top of the menu.
- LPG-0071: breadcrumbs on product pages cost one brand revenue.
- MEA-0037: gross margin is delivered cost.
- SEO-0004: Shopify product URL and breadcrumb fix.

What makes this skill ours: the store's own search terms are classed into eight query types and run on a phone before anything changes; most fixes are data fixes (synonyms, tags, metafields, redirects) rather than a new search tool; menu gaps are found from search demand; and Hindi and regional words written in English letters are treated as synonyms for Indian stores.
