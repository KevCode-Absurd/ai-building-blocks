---
name: add-product-schema-and-rich-results
description: "Structured data for a Shopify store's product, collection and home pages, added and tested: one clean Product (or ProductGroup for variants) block per product page with price, currency, availability, identifiers, shipping and returns, review and rating markup only from real reviews shown on the page, BreadcrumbList that matches the visible breadcrumb, Organization on the home page, and a clear call on FAQ markup now that Google no longer shows FAQ rich results. Finds duplicate or broken blocks from the theme and apps first, fixes them on a duplicate theme, and proves each template in the Rich Results Test and Search Console reports. Use when product pages lack price or star results, after installing a review app, or when Search Console reports structured data errors."
---

# Product schema and rich results

**You get:** a schema audit of each page template (what exists, what is broken, what is duplicated), a JSON-LD spec per template mapped to Shopify fields, the theme changes on a duplicate theme, and a test log showing each template passing the Rich Results Test, ready for the client to publish.

## When to use

- Google shows product pages without price, stock or rating details.
- Search Console's Merchant listings or Product snippets report shows errors or warnings.
- A review app was installed or changed and stars are missing or doubled.
- The theme was changed and nobody checked its structured data.
- The store wants AI assistants and shopping agents to read product facts reliably.

## Not for

- Merchant Center feed fixes: use `fix-merchant-center-disapprovals`.
- Making product data complete for AI shopping channels: use `product-data-for-ai-shopping` (this skill handles the on-page markup).
- Writing the FAQ content itself: use `write-faq-from-tickets-and-reviews`.
- Collecting more reviews: use `build-review-collection-system`.

## What you need

Required (read access, level 1):

1. **Live URLs**: 3 products (one simple, one with variants, one out of stock), 1 collection, home page, 1 blog post.
2. **Theme code read access**: product, collection and layout templates, and any snippet that outputs `application/ld+json`.
3. **Installed apps list**, especially reviews, SEO and FAQ apps (they often add their own markup).
4. **Shopify product export** with Variant Barcode (GTIN), Variant SKU, Vendor, prices, inventory.
5. **Policies**: return window, return cost, shipping rates and delivery times by country.

Optional: Search Console access (enhancement reports), Merchant Center access.

Theme edits need draft access (level 2) on a duplicate theme; the client previews and publishes. Turning off an app's markup setting is a change the client approves.

## Before you start: the gates

1. **Reviews are real.** Pass when every rating comes from verified buyers through the review app, with incentivised reviews disclosed. Fake or undisclosed incentivised reviews must not appear on the page or in markup [SEO-6465], and the US bans fake and AI-generated reviews outright [MCR-6045]. Fail: no rating markup until fixed.
2. **Prices match.** Page price, markup price and feed price must be the same; mismatches disapprove products in Merchant Center [GAD-6122]. Fail: find the source of the mismatch first (currency, tax, sale price).
3. **Buyable pages only.** Merchant listing markup goes only on pages where the buyer can purchase (Google merchant listing documentation).
4. **Expectations set.** Google does not guarantee rich results from structured data [SEO-6465]. Tell the client this before work starts.

## Steps

### 1. Audit what is already there

For each sample URL, run the Rich Results Test and the Schema Markup Validator, and view source for every `ld+json` block. Record: block type, who outputs it (theme, which app), errors, warnings. Typical Shopify findings:

- two Product blocks (theme plus SEO or review app), sometimes with different prices;
- AggregateRating injected by a review app via JavaScript after load (often unseen by AI crawlers [AEO-0002]);
- price without currency, or availability not updating per variant;
- no shipping or return details.

Decide one owner per block type. Prefer the theme for Product and Breadcrumb, and the review app only if it writes ratings into the same Product block server side.

### 2. Product page: the core block

Google's merchant listing documentation requires name, image and offers with price above zero and a three-letter currency; it recommends availability, itemCondition, brand, gtin, description, aggregateRating, review, shippingDetails and hasMerchantReturnPolicy. Map each to Shopify:

| Property | Shopify source | Rule |
|---|---|---|
| name | product.title | Same as the H1 |
| image | product.featured_media, all images | Full URLs, product visible |
| description | product.description stripped of HTML | Same facts as the page |
| sku, gtin | variant.sku, variant.barcode | Only real barcodes; never invent a GTIN |
| brand.name | product.vendor | The brand, not the supplier, if they differ |
| offers.price, priceCurrency | variant.price, cart currency | Per variant; matches page and feed |
| offers.availability | variant.available | InStock, OutOfStock, PreOrder, BackOrder |
| offers.url | variant URL | |
| shippingDetails, hasMerchantReturnPolicy | policy facts | Match the policy pages exactly |

Products with variants: use ProductGroup with hasVariant and variesBy (size, colour), or one Product with an offer per variant if the theme cannot. Check that switching a variant updates price and availability on the page; markup must match what a buyer sees.

### 3. Reviews and ratings

- Mark up only ratings shown on the same page, with the same count and average [SEO-6465].
- Ratings must come from users; never from the store's own testers, staff or a sample of picked reviews.
- If the review app loads by JavaScript only, switch on its server-side or "SEO" option, or render the summary in Liquid from the app's metafields.

### 4. Breadcrumbs, collections and home

- **BreadcrumbList** on product and collection pages, matching the visible breadcrumb links exactly.
- **Collection pages:** BreadcrumbList is enough; do not add Product markup for every grid item.
- **Home page:** Organization with name, logo, url, sameAs links to official social profiles, and contact details that appear on the site. Return policy can also be set at organisation level in Search Console or Merchant Center.

### 5. FAQ markup: the honest call

Google stopped showing FAQ rich results in Search in 2026 [SEO-6160]. Keep FAQPage markup only where the questions and answers are visible on that page and the theme already outputs it cleanly; never add it to chase a snippet. Other assistants may still read clean, visible question and answer text, which matters more than the markup.

### 6. What AI search needs

Google says AI Overviews and AI Mode need no special schema or AI files; pages must be indexed and snippet-eligible, and structured data should match the visible text [AEO-6460]. Shopify's catalog for AI shopping reads back-end product data, not the theme [AEO-0003], so accurate product fields matter as much as markup. Hand catalog and feed work to `product-data-for-ai-shopping`.

### 7. Build and test on a duplicate theme

Edit the snippets on a duplicate theme. Test each template with the preview URL in the Rich Results Test: zero errors on required fields; warnings listed with a decision (fix or accept with a reason). Test a variant switch, a sale price and an out-of-stock product.

### 8. Ship and monitor

After the client publishes: URL Inspection and Request indexing on the sample pages; watch Search Console's Merchant listings, Product snippets and Breadcrumbs reports. Practitioner default: re-check after 2 and 6 weeks, and after every theme or review app change.

### 9. Market notes

- **All markets:** price in the store's own currency exactly as shown to the buyer; where prices include VAT (UK, EU) or goods and services tax (Australia), mark up the tax-inclusive price. A fee for paying on delivery is not part of the product price. Return policy markup must match the store's real window per country, including any no-return categories; in the EU and UK the legal cancellation window for distance sales is at least 14 days.
- **US:** state shipping details per region only if the store's rates really differ by state.

## Checks before you hand it over

- Exactly one Product (or ProductGroup) block per product page.
- Required fields pass the Rich Results Test on every template, including a variant and an out-of-stock product.
- Markup price and availability equal the page and the feed.
- Ratings in markup equal the ratings visible on the page, from real buyers.
- No invented GTINs; missing barcodes left blank.
- Breadcrumb markup matches visible links.
- No FAQ markup for questions not shown on the page.
- Nothing published without the client's yes.

## Output

1. **One-screen summary:** templates fixed, duplicate blocks removed, rich result types now eligible, what Google does not guarantee, re-check dates.
2. **Schema audit table:** Template, URL tested, Block type, Output by (theme or app), Errors, Warnings, Decision.
3. **JSON-LD spec per template:** property, Shopify source, rule (the table in step 2 filled for this store).
4. **Theme change list:** file, change, reason, tested on duplicate theme (yes or no).
5. **Test log:** URL, test date, tool, result, screenshot reference.

## Common mistakes

- **Two Product blocks.** Step 1 picks one owner per block.
- **Stars from JavaScript only.** Step 3 renders them server side or not at all.
- **Markup that disagrees with the page.** Steps 2 and 7 test variants, sales and stock.
- **Invented GTINs.** Step 2 leaves them blank.
- **FAQ markup for snippets.** Step 5 explains why it no longer earns one in Google.
- **Promising rich results.** Gate 4 sets the expectation.

## Sources

- AEO-0002: JavaScript-loaded widgets are often invisible to AI crawlers.
- AEO-0003: Shopify's AI catalog reads back-end product data.
- AEO-6460: no special schema for AI Overviews; markup must match visible text.
- GAD-6122: feed and page prices must match exactly.
- MCR-6045: US ban on fake and AI-generated reviews.
- SEO-6160: FAQ rich results removed from Google.
- SEO-6465: review markup rules and no guaranteed rich results.

What makes this skill ours: it audits and removes the theme and app blocks that clash before adding anything; ratings are marked up only from verified reviews shown on the page; variant, sale and out-of-stock pages are tested, not just one product; and it tells the client plainly what rich results Google no longer shows.

## Selling in India

- Mark up prices in INR including GST, as shown to the buyer. A COD fee is not part of the product price.
