---
name: internal-linking-plan
description: "An internal link plan that sends a store's link strength from the pages that have it (home, posts with outside links, popular pages) to the collections and products that sell: a page map with each page's links in and out, the money pages chosen by gross profit and near-win rankings, link blocks per template (menu, breadcrumbs, sub-collection rows, related products, blog-to-product links), the exact links to add with anchor text and placement, and orphan and dead-end pages fixed. Uses free Search Console link data and a crawl. Use after keyword mapping, when good pages sit just off page one, when blog posts send no visitors to products, or when new collections have no links pointing at them."
---

# Internal linking plan

**You get:** a link sheet listing every link to add or change (from page, to page, anchor text, placement, reason), link block rules for each page template, an orphan and dead-end fix list, and a one-screen summary, ready for the client to approve.

## When to use

- Money pages rank at positions 4 to 20 and need a push.
- Blog posts get visits but almost nobody clicks through to a product.
- New collections or products have few or no links pointing to them.
- Search Console lists pages as "Discovered, currently not indexed".
- After a menu or theme change.

## Not for

- Menu design and collection rules: use `set-up-navigation-and-collections`.
- Links from other websites: this plan covers links inside the store only.
- Writing the blog posts: use `write-seo-blog-posts-that-sell`.
- Broken links and redirects found in a crawl: use `technical-seo-audit-shopify`.

## What you need

Required (read access, level 1):

1. **Search Console Links report** export: top linked pages (external), top linking sites, top linked pages (internal).
2. **Search Console Performance** by page, 3 months: clicks, impressions, position.
3. **A crawl** with internal links in and out per URL and click depth from home (free crawler tier for up to about 500 URLs, or the top pages by clicks).
4. **Keyword map** from `keyword-research-for-collections-and-products`.
5. **Gross profit per order** by product and collection.

Optional: GA4 path data (landing page to next page), current menu structure.

Adding links means editing pages, posts, collection descriptions and theme sections: draft access (level 2) on drafts and a duplicate theme; the client publishes.

## Before you start: the gates

1. **Money pages defined.** Pass when there is a ranked list of collections and products by gross profit per order and position [MEA-0037]. Fail: build it in step 1 before any links.
2. **Pages indexable.** Linking to a noindexed, redirected or 404 page wastes the link. Run `technical-seo-audit-shopify` first if not done.
3. **Stock.** Do not push links to products with under 30 days of cover and no reorder (practitioner default); link to their collection instead.
4. **No paid or hidden links.** Links are for people. Hidden links or links made only to manipulate rankings are spam [SEO-6461].

## Steps

### 1. Pick the money pages

From the keyword map and Search Console: collections and products with gross profit per order at or above the store median and position 4 to 20 for their primary keyword. These receive links. On stores with over 50 products, collections carry most organic revenue [SEO-0003], so most targets are collections. Cap the list at 10 to 20 pages per cycle.

### 2. Find the pages with strength to give

- Home page (almost always the strongest).
- Pages with external links, from the Links report. In one practitioner's method, most early outside links go to the homepage and the rest to collections ranking 4 to 10 [SEO-0006]; inside the store, pass that strength on.
- Blog posts and guides that earn clicks or links; educational posts often attract links more easily than sales pages.
- Popular products.

### 3. Map the current link graph

For each money page record: internal links in, click depth from home, and which strong pages already link to it. Flag:

- **Orphans:** no internal links in (often new collections or products only reachable by search).
- **Deep pages:** money pages more than 3 clicks from home (practitioner default).
- **Dead ends:** blog posts with no link to a product or collection.
- **Wrong targets:** product grid links that go to /collections/x/products/y paths instead of /products/y [SEO-0004].

### 4. Set link blocks by template

| Template | Block | Rule |
|---|---|---|
| Header menu | Top collections | Money collections first; up to 7 items [LPG-0061] |
| Home | Featured collections and bestsellers | Money pages by profit, not newest |
| Collection | Sub-collection row under intro | Links to every child collection |
| Collection | Breadcrumb | Home > Parent > Collection |
| Collection | Guide below grid | 2 to 4 text links to related collections or guides |
| Product | Breadcrumb to parent collection | From a metafield, not the referring path |
| Product | Related or complete-the-set | 4 to 8 products, in stock, same or higher margin |
| Blog post | Money link early | First product or collection link in the first 150 words [SEO-0011] |
| Blog post | Shop block | Product card after the first answer and at the end |
| Footer | Policies, help, a few top collections | Keep short; footers do not replace body links |

### 5. Write the specific links

For each money page, list 3 to 8 new links from relevant strong pages. Rules:

- **Relevance first:** a link from a page about the same buyer need.
- **Anchor text:** describe the target as a buyer would ("linen shirts for summer"), vary it across links, and never stuff exact-match keywords into every anchor.
- **Placement:** in body text or a visible block, high enough to be seen. Image links need alt text, which works as the anchor [SEO-6463].
- **Count:** practitioner default of 2 to 5 body links per blog post and one link per 100 to 150 words in collection guides; more only if each helps the reader.
- **One target per term:** do not point the same anchor at two different pages; that recreates keyword clashes.

### 6. Fix orphans and dead ends

Every orphan money page gets at least two links from relevant pages and a place in a parent collection or menu. Every dead-end blog post gets a money link. Pages that should not exist go to `fix-duplicate-and-thin-pages`, not into the link plan.

### 7. Prioritise the work

Order by: gross profit per order of the target x impressions at positions 4 to 20 x effort (theme block changes help every page at once; manual body links help one). A few pages carry most organic traffic [SEO-0013], so finish the top targets fully before spreading.

### 8. Market notes

- **India:** if the store runs translated pages, link within the same language version; do not send Hindi readers to English pages mid-sentence. City or festival collections (Diwali gifts) need links from the home page only while in season, then from a gifts hub.
- **US:** seasonal collections (Black Friday, holiday gifts) stay live all year with a hub link, so they keep their links for next season.

### 9. Ship and measure

The client publishes. Request indexing for orphans that now have links. Re-read in 6 to 8 weeks: position and clicks for each target, internal links in (Links report), and GA4 clicks from posts to products. Compare against money pages left untouched.

## Checks before you hand it over

- Every target is a money page by gross profit and position, in stock or linked via its collection.
- No link points to a redirect, 404 or noindexed page.
- Anchor text is descriptive and varied; no anchor targets two pages.
- Every blog post has a money link in its first 150 words.
- All orphan money pages have at least two links in.
- Product grid links go to /products/ URLs.
- No hidden, paid or footer-stuffed links.
- Nothing published without the client's yes.

## Output

1. **One-screen summary:** the 10 to 20 target pages, links being added, template blocks changed, orphans fixed, when results will be read.
2. **Link sheet** (`internal-links.csv`):

| From URL | To URL | Anchor text | Placement | Block or body | Reason | Target position now | Gross profit per order | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|

3. **Template block rules:** the table in step 4 filled for this theme, with the setting or file for each.
4. **Orphan and dead-end list:** URL, problem, fix.

## Common mistakes

- **Linking to everything.** Step 1 caps targets and ranks them by profit.
- **Exact-match anchors everywhere.** Step 5 varies anchors.
- **Footer as the link plan.** Step 4 puts links in body and visible blocks.
- **Links to redirected paths.** Gate 2 and step 3 fix targets first.
- **Blog posts as dead ends.** Step 6 gives each a money link.
- **Two pages, one anchor.** Step 5 keeps one target per term.

## Sources

- LPG-0061: menu order and a cap of about 7 items.
- MEA-0037: gross margin is delivered cost.
- SEO-0003: collections carry most organic revenue on larger stores.
- SEO-0004: product grid links and breadcrumbs.
- SEO-0006: sending early link strength to the homepage and near-win collections.
- SEO-0011: money page link early in each blog post.
- SEO-0013: a few pages carry most traffic.
- SEO-6461: hidden and manipulative links are spam.
- SEO-6463: image alt text works as anchor text.

What makes this skill ours: link targets are chosen by gross profit and near-win position, not by gut; strength is traced from pages with real outside links using free Search Console data; template blocks fix every page at once before manual links; and stock decides whether a product or its collection gets the link.
