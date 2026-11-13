---
name: set-up-meta-catalog-sales-ads
description: "A working Meta catalog connected to the store, product sets built by profit and stock rather than by collection, and catalog ads set up for approval, with the feed checks that stop wrong prices, fake sale prices and out-of-stock products from being advertised. Tests every required field, compares feed price with the live page and checkout on a sample, checks that pixel product IDs match the catalog, caps catalog ad spend because its reported return leans on people who were buying anyway, and sets a daily and weekly feed routine. Shopify app, scheduled feed and manual paths. Use when starting catalog ads, when they show wrong prices or sold-out items, or before a sale."
---

# Meta catalog ads setup

**You get:** a checked catalog, a product set list with the rule behind each set, a settings sheet for the catalog ads, a feed check report with every mismatch fixed or listed, and a daily and weekly feed routine.

## When to use

- The store has 20 or more products and wants catalog (dynamic product) ads.
- Catalog ads show a price, sale price or product that differs from the site.
- Sold-out products keep appearing in ads.
- Before a sale, when prices change across many products at once.

## Not for

- Designing the frame, price badge and rating overlay: use `design-catalog-ad-overlays`.
- Writing primary text and headlines that work for every product: use `write-catalog-ad-primary-text`.
- Fixing the pixel or Conversions API: use `store-meta-capi`.
- Google Merchant Center feeds: use `write-product-feed-titles-that-match-searches`.

## What you need

Required:

1. **Shopify product export** (Products, Export, all products, CSV): Handle, Title, Status, Variant SKU, Variant Price, Variant Compare At Price, Variant Inventory Qty, Variant Barcode, Vendor, Image Src. WooCommerce or other platforms: the same fields from their export.
2. **Gross profit per SKU** from `build-sku-profit-sheet` or `store-meta-math`.
3. **Stock cover** per SKU in days and the reorder lead time.
4. **Commerce Manager access** at read level to see the catalog's diagnostics; if no catalog exists, the client creates it or grants draft access.
5. **Events Manager** view of the store's dataset, to check product IDs on ViewContent, AddToCart and Purchase.

Optional: the sale calendar, a list of products never to advertise (gift cards, samples, wholesale packs).

If 2 is missing, build the catalog and the feed checks but no profit-based sets; ads wait. Connecting the catalog and building ad sets need draft access (level 2). Turning ads on needs the client's yes.

## Before you start: the gates

1. **Profit per SKU known.** Pass when each advertised SKU has delivered gross profit [MEA-0037]. Fail: no ads; sets cannot be ranked.
2. **Price truth.** Pass when every sale price and compare-at price is one the store really charges or charged. Fail: remove the false compare-at prices first; an invented "was" price is a consumer law risk in most markets.
3. **Stock sync possible.** Pass when the catalog can update at least as often as stock moves. Fail: advertise only deep-stock SKUs until a faster sync exists.
4. **Tracking.** Pass when the dataset fires product IDs on ViewContent, AddToCart and Purchase. Fail: `store-meta-capi` first.

## Steps

### 1. Pick the connection

| Path | Use when | Note |
|---|---|---|
| Store platform's Meta app (Shopify's Facebook and Instagram app) | Most Shopify stores | Free; syncs products, prices and stock automatically |
| Scheduled feed file (CSV or XML at a URL) | Custom stores, or fields the app cannot set | Set the fetch to hourly if stock moves daily |
| Manual upload | Under about 20 products that rarely change | Must be redone on every price change |

Use one source per catalog. Two sources writing the same items create duplicates.

### 2. Check every required field

Meta needs id, title, description, availability, condition, price, link and image_link, plus one of brand, GTIN or MPN [ADC-6087]. Then check:

- **Price format:** number, space, currency code, no symbol (499.00 INR, 24.99 USD) [ADC-6087].
- **Availability:** in stock or out of stock; out-of-stock items stop appearing in ads [ADC-6087]. Confirm that zero inventory in the store turns into out of stock in the catalog.
- **Link:** the product page on the store's own domain [ADC-6087], live, not a redirect to the home page.
- **Variants:** each variant its own id, grouped under one item group id, with its own image where colour differs.
- **Sale price:** filled only while a real sale runs, with start and end dates where the source supports them.

### 3. Run the price and stock truth test

Take a sample: every product if under 100, else 30 at random plus the top 20 by spend. For each, record catalog price, live page price, checkout price, catalog availability and store inventory.

- Any price mismatch fails the test. Price mismatch between feed and page is a top cause of disapprovals on Google Shopping, which updates feeds at least every 6 hours where prices move [GAD-0005]; hold Meta to the same standard (practitioner default).
- Any in-stock item with zero store inventory fails the test.
- Fix the source (the app's sync settings, the feed rules or the product data), re-sync, re-test. No ads until the sample passes.

### 4. Check product IDs match

In Events Manager, the content IDs sent with ViewContent, AddToCart and Purchase must equal catalog ids (the Shopify app sends variant ids by default). Read the catalog match rate on the dataset. A low match rate means retargeting shows the wrong product or nothing.

### 5. Build product sets by profit and stock

| Set | Rule | Use |
|---|---|---|
| Ad-safe | Gross profit per order above break-even, stock cover above lead time, not excluded | Default set for all catalog ads |
| Hero | Top gross profit SKUs with deep stock | Prospecting catalog ads |
| Low cover | Stock cover under reorder lead time | Excluded from ads, or a higher return target [ADC-0023] |
| Never | Gift cards, samples, bundles priced at a loss | Excluded everywhere |

Write the margin band into a custom label field in the feed (for example margin_high, margin_mid, margin_low) so sets filter on it. Optimisation sends spend to the cheapest purchase, not the most profitable, so keep low-margin items out rather than hoping delivery avoids them [ADC-0022].

### 6. Decide where catalog ads run, and cap them

- **Retargeting viewers and add-to-carts:** the usual home. Catalog ad returns lean heavily on existing customers; one incremental view halved a 5x return to 2.5x [ADC-0010]. Keep catalog spend well below the roughly 70% of spend auditors often find [ADC-0026], and judge it on 7-day click; one showed 7x that was really 1.9 [ADC-0040].
- **Show a different product:** retargeting people who did not buy with a related product can beat showing the same one again [ADC-0033]; build a "related" set for this.
- **Broad prospecting:** only for wide catalogs, roughly 30 or more SKUs, where a single hero ad cannot cover demand (the same surface-area logic as Google Shopping [GAD-0001]).
- In new accounts give catalog ads their own ad set; once spend passes about 10,000 a month the split adds little [ADC-0060].

### 7. Fill the ad settings

Ad set: Sales objective, Purchase event, 7-day click, product set from step 5, audience (viewed or added to cart in last 14 to 30 days and not purchased, or broad for prospecting), existing customers excluded from prospecting. Ad: catalog format, frame and text from the two hand-off skills, landing on the product page, URL parameters per `set-up-utm-tracking-for-all-channels`. Any overlay must be true for every product in the set: no "50% off" badge on a set where some items are full price.

### 8. Set the feed routine

- **Daily:** Commerce Manager diagnostics; fix any item errors; check that sold-out items show out of stock.
- **Weekly:** repeat the step 3 test on 20 items.
- **Every sale start and end:** run the test on the sale items within an hour of the change.
- **Monthly:** refresh the margin labels from the profit sheet.

### 9. India and US notes

- **India:** catalog prices must include GST and match the page; if the store charges a COD fee, the ad price should not promise less than the buyer pays. Use INR in the price field. Exclude products the courier cannot deliver to most pincodes.
- **US:** catalog price excludes sales tax, which is normal; free shipping claims in overlays must match the live threshold.

## Checks before you hand it over

- Every item has all required fields and passes Commerce Manager diagnostics.
- The price and stock sample shows zero mismatches.
- Compare-at and sale prices are real prices the store charged.
- Pixel content IDs match catalog ids.
- Product sets are built from gross profit and stock cover, with the rule written.
- Catalog spend has a cap and is read on 7-day click.
- The feed routine has an owner and dates.
- No catalog ad is live without the client's yes.

## Output

**Summary (one screen):** catalog source, items total, items ad-safe, mismatches found and fixed, product sets, where catalog ads will run, spend cap, the yes needed.

**Feed check report:** Item id, Title, Catalog price, Page price, Checkout price, Catalog availability, Store inventory, Pass/fail, Fix.

**Product set sheet:** Set name, Filter rule, Items, Average gross profit per order, Use.

**Ad settings sheet:** Level, Field, Value, Reason, Approved.

**Feed routine:** Task, Frequency, Owner, Last done.

## Common mistakes

- **Sets copied from store collections.** Step 5 builds them from profit and stock.
- **Trusting the catalog ad's return.** Step 6 caps spend and reads 7-day click [ADC-0040].
- **A "sale" overlay on full-price items.** Step 7 tests the overlay against the whole set.
- **Sold-out items still advertised.** Step 2 checks the zero-stock mapping [ADC-6087].
- **Wrong product shown in retargeting.** Step 4 checks the id match.
- **One check at launch, none after.** Step 8 makes it a routine.

## Sources

- ADC-0010: catalog ad returns inflated by existing customers.
- ADC-0022: optimisation favours the cheapest purchase.
- ADC-0023: ad targets tied to stock cover.
- ADC-0026: cap catalog ads well below common levels.
- ADC-0033: retarget with a different product.
- ADC-0040: judge catalog ads on 7-day click.
- ADC-0060: format split only in new accounts.
- ADC-6087: Meta catalog required fields, price, availability, link (proposed card).
- GAD-0001: catalogue surface area for feed-led ads.
- GAD-0005: feed and page price mismatch causes disapprovals.
- MEA-0037: gross margin from delivered cost.

What makes this skill ours: product sets are cut by gross profit and stock cover, not by collection; a price and stock truth test on a real sample must pass before any ad runs and repeats at every sale change; and catalog spend is capped and read on 7-day click because its reported return leans on buyers who were coming anyway.
