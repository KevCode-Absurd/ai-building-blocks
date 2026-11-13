---
name: fix-duplicate-and-thin-pages
description: "A decision sheet for every duplicate and thin page on a Shopify store: the same item listed as two products, collection-path and variant URLs, tag, vendor and type pages, blog tag pages, near-empty collections, discontinued products and descriptions copied from the supplier. Each page gets one decision (merge with a 301, point with rel canonical, hide with noindex, rewrite, or keep) based on its clicks, links, sales and gross profit, with the exact Shopify setting or theme change and a redirect sheet. Never deletes a page that earns clicks or links without a redirect. Use after a technical audit flags duplicates, when Search Console shows many pages crawled but not indexed, or when the catalogue has grown messy."
---

# Fix duplicate and thin pages

**You get:** a page decision sheet (URL, type, clicks, links, orders, decision, target, how to apply), a redirect CSV for Shopify's bulk import, a rewrite list for the pages worth saving, and a one-screen summary, ready for the client to approve.

## When to use

- Search Console shows many "Duplicate without user-selected canonical" or "Crawled, currently not indexed" pages.
- The same product was listed twice (for colours, sizes or old and new versions).
- Tag, vendor or type pages show up in Google results.
- Many products use the supplier's description word for word.
- Collections exist with one or two products, or none in stock.

## Not for

- Finding crawl and index issues in the first place: run `technical-seo-audit-shopify`.
- Writing new product descriptions at scale: use `write-product-descriptions-in-bulk` for the rewrite list.
- Choosing which products to keep selling: use `rank-products-to-push-or-cut`.
- Collection copy: use `optimize-collection-pages-for-seo`.

## What you need

Required (read access, level 1):

1. **Search Console exports:** Page indexing (all reasons, with example URLs), Performance by page for the last 12 to 16 months (clicks, impressions), and Links (top linked pages, external).
2. **Shopify product export:** Handle, Title, Body (HTML), Vendor, Type, Tags, Status, Variant SKU, Variant Inventory Qty.
3. **Orders by product**, last 12 months, and **gross profit per order** by product.
4. **Collection list** with product counts and in-stock counts.
5. **A crawl** of the store (free crawler tier, or the top 500 URLs by clicks).

Optional: supplier or marketplace listings of the same products (to find copied text), existing redirects export.

Changes need draft access (level 2): product merges, metafields and theme edits on a duplicate theme, redirects as a CSV. Every delete, merge and redirect import needs the client's yes.

## Before you start: the gates

1. **Protect what earns.** Pass when every candidate URL has its 12-month clicks, external links and orders attached. Fail: decide nothing until it has them; deleting a page with links or sales loses them.
2. **Profit known** per product [MEA-0037]. Without it, rewrites are ordered by clicks only.
3. **Stock and range plan.** Ask which products are discontinued for good and which are only out of stock; the decision differs.
4. **Reviews and orders.** Merging two products can strand reviews and order history. Check the review app can move reviews before merging.

## Steps

### 1. Build the inventory

Put every URL into one sheet with: page type, 12-month clicks and impressions, external links, orders, gross profit per order, word count of unique text, and the indexing status. Mark these Shopify page types:

- product duplicates (same item, two products);
- /collections/x/products/y paths and ?variant= URLs;
- tag-filtered collections (/collections/x/tag) and blog tag pages (/blogs/news/tagged/x);
- vendor and type pages (/collections/vendors?q=, /collections/types?q=);
- collections with under one mobile row of in-stock products;
- products with copied or under 50 words of unique description (practitioner default);
- discontinued products.

### 2. Apply the decision rules

| Situation | Decision | How on Shopify |
|---|---|---|
| Same item as two products | Merge: keep the one with more clicks, links and reviews; move variants into it; 301 the other | Add variants, move reviews, unpublish the old, add URL redirect |
| Collection-path and variant URLs | Keep; they already canonical to /products/. Fix grid links at the source [SEO-0004] | Edit product grid snippet on a duplicate theme |
| Tag, vendor, type and blog tag pages | Noindex, follow | Theme.liquid robots meta tag on those templates |
| Collection with searched term but few products | Rewrite and add products, or merge into the parent with a 301 | Add products or redirect |
| Collection nobody searches, few products | Merge into parent with a 301 | Delete after redirect |
| Thin product with sales or clicks | Rewrite | Rewrite list |
| Thin product with no clicks, no sales in 12 months | Unlist or noindex; revisit range | Set product to Unlisted |
| Discontinued for good, has clicks or links | 301 to the closest product or the parent collection | URL redirect, then archive |
| Discontinued, no clicks or links | Archive; let it return 404 | Archive |
| Out of stock, coming back | Keep live with restock date or notify-me | No change |

Rules behind the table:

- Merge true duplicates with a 301; redirects and rel canonical are strong signals, sitemaps weak [SEO-6464].
- Never use robots.txt or noindex to pick between duplicates; noindex removes the page from Search entirely [SEO-6464]. Noindex is for pages that should not be in Search at all.
- Shopify offers three ways to hide a page: a robots noindex tag in theme.liquid, the seo.hidden metafield set to 1 (also removes it from sitemaps and store search), or the product's Unlisted status (also removes it from Shopify Catalog and collections) (Shopify Help Center, hide a page from search engines). Pick Unlisted only when the product should not sell in AI channels either.

### 3. Do not create new duplicates while fixing

- One sub-collection per searched variant, not one per colour and size; near-identical pages made only to catch similar searches are doorway pages [SEO-6461] and cannibalise each other.
- Sub-collections earn their place only with buying intent and enough products [SEO-0012].

### 4. Decide what to rewrite

Rank the rewrite list by clicks plus impressions x gross profit per order. A small share of pages carries most organic traffic [SEO-0013], so rewrite the top 20 to 50 properly before touching the tail. For products, use a full template: short summary, benefits, a specification table, detail, buyer questions, reviews [SEO-0007]. Replace supplier copy with the store's own facts, photos and buyer words.

Do not fix thin pages by generating hundreds of AI descriptions in a week; pages made at scale without added value are spam [SEO-6461], and sites that did this saw rankings crash within months [AEO-0018]. Rewrite in batches with human review.

### 5. Build the redirect sheet

- Old path, new path; no chains (point to the final URL); no redirect to a 404 or to the home page unless no closer match exists.
- Update internal links (menus, blog posts, collection descriptions) to the new URL so crawlers do not hop through redirects.

### 6. Market notes

- **India:** marketplace sellers often reuse the same description on Flipkart, Amazon and the store; the store's page should carry the fuller, original version. Pincode or COD widgets that add the same paragraph to every product do not count as unique text.
- **US:** keep product identifiers (GTIN, MPN) on the surviving product after a merge so feeds stay approved.

### 7. Ship and confirm

After the client approves and publishes: import redirects, submit the sitemap, Request indexing for merged targets, and use Validate fix in the indexing report. Re-read in 4 to 8 weeks: duplicate counts down, merged pages holding or gaining clicks.

## Checks before you hand it over

- Every URL with clicks or external links in 12 months has a 301 or stays live; none is simply deleted.
- No noindex or robots.txt rule is used to choose between duplicates.
- Merges keep reviews, variants and identifiers on the surviving product.
- No new near-duplicate collections were proposed.
- The redirect sheet has no chains and no targets that 404.
- Rewrites are ordered by traffic and gross profit, in reviewed batches.
- Nothing was deleted, merged or redirected without the client's yes.

## Output

1. **One-screen summary:** counts by page type and decision, the pages with the most clicks affected, what needs a developer, and what to watch after launch.
2. **Decision sheet** (`page-decisions.csv`):

| URL | Page type | 12-month clicks | External links | Orders | Gross profit per order | Unique words | Index status | Decision | Target URL | How (setting or file) | Owner | Approved |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

3. **Redirect sheet** (`redirects.csv`): Redirect from, Redirect to.
4. **Rewrite list:** URL, priority, what is missing, facts available, hand-off skill.
5. **Theme changes:** template, noindex rule or grid fix, test steps.

## Common mistakes

- **Deleting pages with links.** Gate 1 and step 2 redirect them.
- **Noindex as a canonical.** Step 2 uses 301 or rel canonical for duplicates.
- **Hiding tag pages with robots.txt.** Blocked pages can still be indexed from links; noindex, follow works instead.
- **Merging without moving reviews.** Gate 4 checks the review app first.
- **Mass AI rewrites.** Step 4 batches and reviews them.
- **Unlisting products that should sell in AI channels.** Step 2 notes Unlisted also removes them from Shopify Catalog.

## Sources

- AEO-0018: mass AI publishing tends to crash.
- MEA-0037: gross margin is delivered cost.
- SEO-0004: within-collection product links.
- SEO-0007: product page template for rewrites.
- SEO-0012: sub-collections only for searched variants.
- SEO-0013: few pages carry most traffic.
- SEO-6461: doorway pages and scaled content abuse.
- SEO-6464: canonical signals; noindex and robots.txt are not canonical tools.

What makes this skill ours: no page with clicks, links or sales is removed without a redirect; each decision uses the store's own 12-month data and gross profit; Shopify's three hiding methods are chosen by what else they switch off, including AI channel listing; and rewrites are batched and human-reviewed instead of mass-generated.
