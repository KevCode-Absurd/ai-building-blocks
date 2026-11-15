---
name: set-up-navigation-and-collections
description: "Builds a store's menu and collection structure the way its buyers shop: a collection list with automated rules on tags, product type, price or stock, a tagging scheme that feeds those rules, a main menu of no more than 7 items with a mobile version, and footer links. Works from what buyers search for, what sells and the store's margins, not from how the warehouse groups stock. Each collection gets its rule, sort order and an owner, so new products drop into the right place without manual work. Use for a new store, after adding a new product line, when the menu has grown messy, or before a migration."
---

# Store navigation and collections

**You get:** a collection map (usually 8 to 25 collections) with the exact automated rule for each, a product tagging scheme, a main menu of up to 7 items plus a mobile menu and footer, all in a sheet ready to enter in Shopify after the client's yes.

## When to use

- A new store needs its first menus and collections.
- A new product line or a second category is being added.
- The menu has grown past 7 items, or products sit in the wrong collections.
- Products are added often and someone files them into collections by hand.
- Before a migration, to design the target structure.

## Not for

- Fixing menu, filter and search problems on a live store from search data: use `fix-site-search-and-navigation`.
- The design and copy of one collection page: use `build-collection-page-that-converts`.
- Which products go first in each collection: use `merchandise-homepage-and-collections`.
- Collection titles and copy for search ranking: use `optimize-collection-pages-for-seo`.

## What you need

Required:

1. **Product export**: Handle, Title, Product type, Vendor, Tags, Variant price, Variant inventory quantity, Status.
2. **Sales by product**, last 90 days (Shopify sales by product report), and gross profit per product if known.
3. **What buyers call things**: site search terms (Shopify's search report or GA4 site search), plus top search queries from Search Console, plus 20 customer messages or reviews.
4. **The live menu**, screenshot or Online Store, Navigation.

Optional: competitor menus (2 or 3), keyword volumes from `keyword-research-for-collections-and-products`.

Reading is level 1. Creating collections and menus is level 2: build them unpublished or hidden, then the client approves the switch.

## Before you start: the gates

1. **Products have clean data.** Pass when every product has a product type and at least one tag in the scheme. Fail: fix the data in step 3 before building rules; automated collections are only as good as the tags.
2. **Gross profit per product known, or at least sales.** Needed to decide what earns a menu slot [MEA-0037]. Fail: use sales and say so.
3. **One owner for tags.** Someone on the team is named to tag each new product. Fail: rules will drift within a month.

## Steps

### 0. Count the clicks today

Before changing anything, count the clicks from the home page to each of the top 10 collections by sales, on a phone and on desktop, and write the numbers in the sheet. Do the same again after the new menu is built. Fewer clicks helps buyers and helps search engines find the pages that earn; the before and after table shows the client what changed.

### 1. Find the shopping paths

From search terms, messages and reviews, list how buyers start: by problem ("for dry skin"), by product kind ("serums"), by person ("for him"), by occasion ("gifts under 1,000"), by collection or drop. Count how often each appears. The top 3 or 4 paths become the menu's spine.

### 2. Draft the collection list

Four layers, in this order:

1. **Product kind** collections (the main categories), one per thing a buyer would name.
2. **Need or use** collections (by problem, skin type, room, size).
3. **Merchandising** collections: bestsellers, new, gifts, under a price, back in stock.
4. **Search sub-collections** for each searched variant with commercial intent and low competition, one keyword per page [SEO-0012]. Collection pages drive most organic revenue once a store passes about 50 products [SEO-0003], and building them before blog posts paid off in one case [SEO-0001].

Merge any collection with fewer than about 4 products into its parent (practitioner default, test it). Empty or thin collections look broken.

### 3. Design the tag scheme

Rules run on fields, so design tags before rules. Use prefixes so tags sort and never clash:

- `type:` is the product type field itself (Serum, Cleanser).
- `need:dry-skin`, `need:acne`.
- `for:men`, `for:kids`.
- `occasion:christmas`, `occasion:gift`.
- `range:` for a product line.

Write each tag in lowercase with hyphens. No free-text tags. List every allowed tag in the sheet.

### 4. Write each automated rule

For each collection: the condition set (all conditions or any condition) on product type, tag, vendor, price, compare-at price, inventory or title. Examples:

- "Serums": product type is equal to Serum.
- "For dry skin": product tag is equal to need:dry-skin.
- "Gifts under 1,000": tag is occasion:gift AND price is less than 1,000.
- "Sale": compare-at price is greater than 0 (only if compare-at prices are real past prices).

Manual collections only for hand-picked edits like a founder's picks. Set the sort for each: bestselling for category pages, newest for "new", manual for edits.

### 5. Build the main menu

- Keep the main menu under 7 items [LPG-0007]; past 7 visible items, returns diminish [LPG-0033].
- Order by the shopping paths from step 1, highest first.
- Add images or icons to category items in the mobile menu; replacing a text menu with image category navigation lifted conversion in one agency test [LPG-0039].
- New visitors often open the mobile menu first, so put bestsellers at its top and move contact, FAQ and reviews lower [LPG-0061].
- Use mega menus only above about 6 categories with sub-collections.
- Pick the menu style by range size: a small range gets one "Shop" item that opens the core collections; a large range puts sub-collections straight in the menu so buyers skip a click (Protein, then whey, plant and clear); buyers who shop by attribute get a "Shop by" item (type, colour, room, concern). Many themes limit menu depth, so check before designing three levels.

### 5b. Home page, sub-collections, filters and grids

- **Home page order:** feature the collections with the most sales and gross profit near the top, in that order. The home page holds the most links on the site, so it also passes the most search weight to the collections you most want to rank. Hand the layout to `merchandise-homepage-and-collections`.
- **Sub-collection links on the parent:** show each parent's sub-collections as image tiles or chips at the top of the parent collection page, so buyers narrow down without going back to the menu and search engines see the hierarchy.
- **Filters only when the range needs them:** filters pay off with a few hundred products (around 200 is a practitioner mark, not a Shopify rule); below that they add clutter. Shopify filter URLs are usually not indexed, so a filter value buyers search for (for example "linen duvet covers") needs its own collection page. Check in Search Console whether filter URLs appear, and list which filter values become collections.
- **Grid rules:** the product grid should show without waiting for scripts (Shopify's Search and Discovery filters do), with 36 to 48 products per page (practitioner default) and numbered pages rather than endless scroll, so buyers can come back to the same place.
- **Product page links back:** breadcrumbs to the collection, links to related collections, and a related products block, so no product page is a dead end.

### 6. Footer and utility links

Footer: shipping, returns, contact, track order, FAQ, about, policy pages, and any contact or complaint details local law requires (for example the EU's trader contact and dispute details, or a grievance contact where the law names one). Never put core categories only in the footer.

### 7. Point product links at product URLs

Shopify themes often link products inside a collection with a collection-scoped URL. Remove that so links point to `/products/` URLs, and rebuild breadcrumbs from a metafield, because the change breaks the default ones [SEO-0004]. Hand this to the developer with the client's yes.

### 8. Check on mobile

On a phone, each top path should reach a product in 2 taps. The first screen of each main collection should show four products in a two by two grid with prices [LPG-0059]. About 60% of visitors drop after the hero and around 10% more per row on grids [LPG-0041], so the sort order matters as much as the menu.

### 9. Market notes

- Languages: menu labels in the languages your buyers use only if the store's pages are translated; a half-translated menu looks broken.
- Payment and offer collections: a collection built around a payment method (for example "pay on delivery available") is a poor idea, since it trains buyers to shop by payment terms rather than product.
- Seasonal collections: peak season collections (Black Friday and Cyber Monday, Christmas and the winter holidays, Valentine's Day, local festivals such as Lunar New Year or Eid) built 4 to 6 weeks before and hidden after.
- Gift price bands: holiday and gifting collections by price band in the store's own currency ("under 25", "under 50") match how gift buyers search.
- Several markets: where Shopify Markets sells to many countries, hide collections for products a market cannot receive, and check sizes and units (US and EU sizes, inches and centimetres) match each market.

## Checks before you hand it over

- Main menu has 7 items or fewer, ordered by the shopping paths.
- Every collection has a rule (or is marked manual with a reason), a sort order and at least 4 products.
- Every product sits in at least one main category collection; none is orphaned.
- The tag list is complete; no product carries a tag outside the scheme.
- Each top path reaches a product in 2 taps on a phone.
- Product links point to `/products/` URLs, or the change is listed for the developer.
- Nothing is published without the client's yes.
- The click count from the home page to the top 10 collections is recorded before and after.
- Every filter value with search demand either has its own collection or is listed as a gap.
- Each parent collection shows links to its sub-collections.

## Output

**One-screen summary:** menu (7 items or fewer) in order, number of collections by layer, the tag scheme in one line, products fixed, and changes for approval.

**Collection map:**

| Collection | Layer (kind, need, merchandising, search) | Rule (all or any, conditions) | Sort | Products now | Menu position | Target search term | Owner |
|---|---|---|---|---|---|---|---|

**Tag scheme:** Prefix, Allowed values, Meaning, Example product.

**Menu sheet:** Menu (main, mobile, footer), Position, Label, Links to, Image or icon.

**Product fix list:** Handle, Field, Old value, New value.

**Click depth table:** Collection, Sales rank, Clicks from home before (phone, desktop), Clicks after (phone, desktop).

## Common mistakes

- **Menus built from the warehouse view.** Step 1 starts from buyer words and search terms.
- **Free-text tags.** Rules miss products. Step 3 fixes the scheme.
- **Too many menu items.** Step 5 caps at 7 [LPG-0007].
- **Thin collections.** Step 2 merges those under about 4 products.
- **"Sale" built on invented compare-at prices.** Step 4 uses only real past prices.
- **Collection-scoped product URLs.** Step 7 [SEO-0004].
- **Filters on a 40-product store.** Step 5b adds filters only when the range needs them.
- **Expecting filter pages to rank.** Step 5b turns searched filter values into real collections.

## Sources

- LPG-0007: keep main navigation under 7 items.
- LPG-0033: more than 7 visible menu items shows diminishing returns.
- LPG-0039: image or icon category navigation lifted conversion in one test.
- LPG-0041: visitor drop after hero and per grid row.
- LPG-0059: four products two by two on mobile collection pages.
- LPG-0061: bestsellers at the top of the mobile menu.
- SEO-0001: collection pages before blog posts.
- SEO-0003: collections drive most organic revenue past about 50 products.
- SEO-0004: product links to /products/ URLs and breadcrumbs from a metafield.
- SEO-0012: sub-collections for searched variants.
- MEA-0037: gross margin uses delivered cost.

What makes this skill ours: the menu spine comes from counted buyer words and search terms; the tag scheme is designed before any rule so new products file themselves; every collection has an owner and a minimum size; and the structure doubles as the store's search landing pages.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Put the grievance contact in the footer. Use Hindi or regional language labels only if the store's pages are translated. A "COD available" collection is a poor idea, since it trains buyers to look for COD. Festive collections (Diwali, Rakhi) are built 4 to 6 weeks before and hidden after, with tags such as `occasion:diwali`.
