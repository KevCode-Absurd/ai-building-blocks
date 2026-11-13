---
name: build-collection-page-that-converts
description: "Plans one collection page so shoppers find the right product fast: a short intro above the grid and a longer guide below it, the filters buyers actually use in the order they use them, a default sort rule and the pinned first row, and product card rules (image, name, price, rating, badge, one key difference). Built from the store's search terms, filter clicks, support questions and product data, with stock and profit checks on what sits at the top. Use when paid or search traffic lands on a collection grid and few people click a product, when a collection grows past one screen of products, or when a new collection is launched."
---

# Collection page that converts

**You get:** a plan for one collection page: intro copy (top and bottom), a ranked filter list with values, a default sort rule with the first six products pinned, product card rules and a card copy line for each product in the first two rows, ready for the client to approve and the theme or merchandising app to apply.

## When to use

- A collection gets sessions from ads, search or the menu but a low share of them open a product.
- A collection now holds more than about 12 products and shoppers scroll without choosing.
- Shoppers ask support for things the filters should answer ("do you have it in cotton", "what fits under 1,000 rupees").
- A seasonal or new collection is going live.

## Not for

- Ranking products across the homepage and every collection by profit and stock: `merchandise-homepage-and-collections`.
- Collection titles, meta tags, keyword targets and internal links for search: `optimize-collection-pages-for-seo` and `keyword-research-for-collections-and-products`.
- Building menus and automated collection rules: `set-up-navigation-and-collections`.
- Product page copy: `write-product-page-copy`.

## What you need

Required (read access, level 1):

1. **Collection URL** and phone and desktop screenshots.
2. **Shopify products export** for the collection: Handle, Title, Type, Tags, Variant options, Variant price, Compare-at price, Inventory quantity, Status.
3. **Sales by product, last 90 days**, with units and gross profit per unit (from `build-sku-profit-sheet`).
4. **Shopify search terms report** (Analytics, "Searches") and, if available, filter usage from the filter app or GA4 events.
5. **Support tickets or chats** that mention this product type.

Optional: Google Search Console queries for the collection URL, heatmap of the grid, collection view-to-product-view rate from GA4.

If filter usage data is missing, rank filters by how often each attribute appears in searches and tickets, and say so. Changing filters, sort or theme sections needs draft access (level 2) on a duplicate theme or the filter app's draft mode; going live needs the client's yes.

## Before you start: the gates

1. **Top products can carry traffic.** Each product pinned in the first row has positive gross profit per order and enough stock for 4 weeks at current sales, in its main sizes or variants. A fashion grid fed by paid traffic lives or dies on its top six products and their size stock [LPG-0069]. Fail: swap the product.
2. **Product data is clean enough to filter.** Each filter attribute is filled for at least 90% of products in the collection (practitioner default, test it). Fail: list the gaps and fix the data first, or leave that filter out.
3. **Truthful labels.** "Bestseller", "New" and "Low stock" badges must follow a written rule from real sales, dates or inventory. Fail: remove the badge.

## Steps

1. **Find what shoppers sort by.** From searches, tickets and reviews, list the attributes buyers use to choose in this collection (use, size, material, price band, skin type, recipient). Count mentions. The top 3 to 5 become filters; anything with under 3 mentions waits.
2. **Write the filter list.** Order filters by mention count, not alphabetically. Use buyer words for names and values ("For dry skin", not "SKU type B"). Put price as bands that match the store's real price spread. Show the result count and clear-all; never let a filter combination return zero products without a way back.
3. **Set the default sort.** Default to a rule, written down: for example "units sold in the last 30 days among products with 4+ weeks of stock, then gross profit per order". Pin the first six by hand only when there is a reason (launch, stock clearance, seasonal hero) and give each pin an end date. Move slow stock through its own promotion instead of hiding it forever [FIN-0026], but not into the first row of a paid-traffic grid.
4. **Lay out the first screen on a phone.** Two columns, so four products show on the first mobile screen, with prices visible and a few marked bestseller or new by the badge rule [LPG-0059]. Visitors drop off with each row [LPG-0041], so rows one and two carry the page. Remove quick view if it preloads product data for every card and slows the grid [SPD-0012].
5. **Write the card rules.** Every card: one consistent image ratio, product name as buyers say it, final price (and a true compare-at only if the store really charged it), star rating with count only when the product has reviews, one key-difference line of 4 to 7 words, and stock or variant cue ("3 colours", "Sizes S to XL"). Write that key-difference line now for every product in rows one and two.
6. **Write the top intro.** One or two sentences above the grid: what is in the collection and how to choose ("Start with the bestsellers, or filter by your skin type"). Keep it short so products stay in the first screen.
7. **Write the bottom guide.** Below the grid: a short buying guide (how to choose, who each option suits, care or sizing notes) and 3 to 5 FAQs from tickets. On stores with many products, collection pages drive most organic revenue in one practitioner's audits [SEO-0003], and copy below the grid serves search without pushing products down [SEO-0005]. Hand titles and keyword targets to `optimize-collection-pages-for-seo`.
8. **Plan sub-collections.** If one attribute dominates searches (for example "oversized" or "under 999"), recommend a separate sub-collection for it rather than a filter alone [SEO-0012].
9. **India and US notes.** India: add a price band filter in rupees that matches common gifting and impulse bands, show "COD available" on cards only where it is true for the product, and keep prices GST-inclusive. Write filter values in English plus the Hindi or regional term buyers use if searches show it. US: show sale prices against a genuine former price only.
10. **Set the measure.** Record the current collection-view to product-view rate and filter use. Re-read after 4 weeks; test only if order volume allows, using `design-store-ab-test`.

## Checks before you hand it over

- Filters match the top buyer attributes by count, in that order, with buyer-word labels.
- Each pinned product passes the stock and profit gate and has an end date.
- Four products, with prices, show on the first phone screen.
- Every badge follows a written rule tied to sales, date or inventory.
- Each card in rows one and two has a key-difference line under 8 words.
- Top intro is two sentences or fewer; the guide and FAQs sit below the grid.
- No filter combination ends in an empty page without a recovery link.

## Output

**Summary (one screen):** the collection's current view-to-product rate, the top attributes buyers use, the filters chosen, the sort rule, pinned products with reasons, and the one change expected to matter most.

**Filter sheet:**

| Order | Filter name (buyer words) | Values | Evidence (mentions) | Data fill rate |
|---|---|---|---|---|

**Sort and pins:**

| Position | Product | Reason | Gross profit per order | Weeks of stock | Pin ends |
|---|---|---|---|---|---|

**Card rules and lines:**

| Product | Badge (rule) | Key-difference line | Variant cue | Rating shown (yes or no) |
|---|---|---|---|---|

**Copy:** top intro (1 to 2 sentences); bottom guide (150 to 400 words); FAQs (3 to 5, with ticket source).

**To confirm:** data gaps, pins needing sign-off, any badge rule the client must approve.

## Common mistakes

- **Filters copied from the product database.** Step 1 builds them from what buyers search and ask.
- **"Featured" sort nobody owns.** Step 3 writes the rule down and dates every pin.
- **Out-of-stock sizes in the first row.** Gate 1 checks stock by variant.
- **Long intro pushing products off the screen.** Step 6 keeps the top short and moves the guide down.
- **Badges that never change.** Gate 3 ties each badge to a rule.

## Sources

- LPG-0069: paid traffic on fashion grids depends on the top six and size stock.
- FIN-0026: move slow stock through its own funnel.
- LPG-0059: four products on the first mobile screen with prices and labels.
- LPG-0041: drop-off after the hero and with each grid row.
- SPD-0012: quick view can preload data for every card.
- SEO-0003: collections drive most organic revenue on larger catalogues.
- SEO-0005: collection page structure with copy below the grid.
- SEO-0012: sub-collections for searched variants.

What makes this skill ours: filters are ranked by counted buyer mentions and data fill rate; the first row is gated on variant stock and gross profit; every badge and pin follows a written, dated rule; and the grid is planned for a two-column phone screen first.
