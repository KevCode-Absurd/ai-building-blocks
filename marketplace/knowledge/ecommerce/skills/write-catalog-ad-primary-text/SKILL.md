---
name: write-catalog-ad-primary-text
description: "Writes the text templates for a store's Meta catalog ads (dynamic product ads): primary text, headline and description built with catalog fields such as product name, price, sale price, brand and custom labels, so every ad reads well and stays true for every product in the set, from the shortest title to the longest. Tests each template against real feed rows, fills custom labels with short product-type lines where the feed lacks them, writes separate templates for new buyers, product viewers and cart abandoners, and keeps sale prices and claims accurate. Use when setting up catalog ads, when catalog ads show broken or clumsy text, or when one generic template serves every audience."
---

# Catalog ad text

**You get:** three to four text templates per product set (primary text, headline, description) using catalog fields, each tested against the 10 hardest real products in the feed, a custom label plan with the short lines to add to the feed, and a one-screen summary of which template runs for which audience.

## When to use

- Catalog ads are being set up or moved to a new product set.
- Live catalog ads show odd text: "Shop Now Women's Cotton Pyjama Set With Eye Mask Pack Of 3 Blue Xl" as a headline, a missing brand, a wrong price.
- One template runs for cold buyers and cart abandoners alike.
- A sale is coming and catalog ads need to show sale prices correctly.

## Not for

- Building the catalog, pixel connection and product sets: use `set-up-meta-catalog-sales-ads`.
- Frame and price overlays on the images: use `design-catalog-ad-overlays`.
- Fixing product titles in the feed itself: use `write-product-feed-titles-that-match-searches` or `write-product-titles-for-store-and-marketplaces`.
- Budget split for catalog ads: use `store-meta-budget`.

## What you need

Required:

1. **Catalog feed export** (Commerce Manager or the Shopify Facebook channel): id, title, description, price, sale_price, sale_price_effective_date, brand, availability, product_type, custom_label_0 to 4, link.
2. **Product sets** used or planned, with their filters.
3. **Audiences** the catalog ads serve: broad new buyers, product viewers, add-to-cart abandoners.
4. **Product facts** for each product type: the one or two proven benefits.
5. **Gross profit per order** by product type.

Optional: current catalog ad results by product set, returns rate by product.

Writing templates is read-only. Adding custom labels to the feed and editing ads needs draft access (level 2); the client approves before publishing.

## Before you start: the gates

1. **Feed is clean.** Prices and availability in the feed match the site. A wrong price in a catalog ad is a false price claim. Fail: fix the feed first.
2. **Products in the set make money.** Remove products whose gross profit per order is below the cost to sell them, or that have fewer days of stock than their reorder lead time [ADC-0023]. Fail: fix the product set before writing.
3. **Measured on new buyers.** Catalog ad ROAS is often inflated by existing customers and can halve on incremental attribution [ADC-0010]. Pass when the client agrees to judge new-buyer templates on new-customer orders. Otherwise the text work will be judged on the wrong number.

## Steps

### 1. Learn the fields

Meta's catalog templates can insert, from each product's feed row: name (the title), price, current_price, brand, description, and custom_label_0 to custom_label_4. current_price shows the sale price only between the sale dates, then the regular price. Price options remove the currency symbol or zero cents; titleize capitalises words. The primary text, headline and description fields accept these inserts [ADC-6143]. Ads Manager shows them through its insert menu; the exact syntax there can differ, so always preview.

### 2. Find the hardest 10 rows

From the feed, pull: the 3 longest titles, the 3 shortest, 2 with no brand, 2 on sale with sale dates. Every template will be tested against these 10.

### 3. Fix what titles cannot do

Feed titles are written for search matching (product type, material, colour, size first) [GAD-0009] [GAD-0017], so they read badly as ad headlines. Do not insert the full title into the headline if long titles appear. Instead:

- put a short, human product-type line in a custom label, per product type: custom_label_1 = "Everyday cotton shirt" or "Leak-proof lunch box" (25 characters or fewer);
- put one proven benefit per product type in another label: custom_label_2 = "Breathes in 40 degree heat";
- keep labels used for bidding or reporting untouched; agree which labels are free with the media buyer.

Write the label plan as a table the feed owner can paste.

### 4. Write templates per audience

| Template | Audience | Job |
|---|---|---|
| A. New buyers | Broad, product set of best sellers | Introduce the store and the product type; proof first |
| B. Product viewers | Viewed in last 14 to 30 days | Remind and answer the main doubt |
| C. Cart abandoners | Added to cart, did not buy | Remove the last doubt: delivery, returns, payment |
| D. Cross-sell (optional) | Bought from one product set | Show a different, related product, not the one they viewed [ADC-0033] |

For each template:

- **Primary text:** one or two short lines that are true for every product in the set. Insert a field only where it reads naturally: "Our {custom_label_1} is made for hot summers. Free returns for 15 days."
- **Headline:** the short label or the brand plus the label, not the long title: "{custom_label_1}".
- **Description:** current_price when sale dates are in the feed, otherwise price: "{current_price}, free returns." (add "incl. VAT" for UK and EU sets)

Keep every non-inserted word true across the whole set: no "100% cotton" if one product is a blend; no "ships today" if some products ship in 5 days.

### 5. Test against the hardest 10

Render each template for each of the 10 rows (preview in Ads Manager, or fill a sheet by hand). Fail the template if any row shows: a broken or empty field, a headline cut mid-word, a claim that is false for that product, a price without its currency, or a sale price after the sale ended. Fix and re-test.

### 6. Sale periods

If a sale is coming, add sale_price and sale dates to the feed and use current_price so the ad shows the sale price only during the sale [ADC-6143]. Do not write "Sale" or a percentage in the static text unless every product in the set is on sale for the same dates. A "was" price shown in the ad must be one genuinely charged [OFF-6145].

### 7. Market notes

- **UK, EU and Australia:** prices in ads should be the full price buyers pay, including VAT or the local sales tax and fixed charges most buyers pay; check that the feed price is tax-inclusive. Mention pay on delivery, pay later or any regional offer only if it is live for all products in the set.
- **Other languages:** for audiences in other languages, Meta supports localized catalogs; have a native speaker write or check each language version, since machine translation alone can change product facts.
- **US:** shipping and tax wording must match checkout; "free shipping" only if free on every product in the set.

### 8. Keep catalog ads in their place

Catalog ads reach mostly bottom-funnel buyers and are rarely incremental; auditors often find them taking far too much of spend [ADC-0026]. Keep viewer and cart templates small, judge them on 7-day click [ADC-0040], and let new-buyer templates prove themselves on new-customer orders.

## Checks before you hand it over

- Each template was rendered against the 10 hardest feed rows with no broken field, cut word or false claim.
- No headline inserts a long feed title; short labels are used instead.
- Every non-inserted word is true for every product in the product set.
- Price fields show the right currency; current_price is used only when sale dates are in the feed.
- Separate templates exist for new buyers, viewers and cart abandoners.
- The custom label plan does not overwrite labels used for bidding or reporting.
- Prices are tax-inclusive where the market expects it (UK, EU, Australia); payment and free-shipping lines hold for the whole set.
- Nothing published or changed in the feed without the client's yes.

## Output

**1. One-screen summary:** product sets, audiences, template per audience, label plan, feed fixes needed.

**2. Template sheet:**

| Product set | Audience | Template | Primary text | Headline | Description | Fields used | Passed 10-row test (Y/N) |
|---|---|---|---|---|---|---|---|

**3. Custom label plan:**

| product_type | Label | Text | Characters | Source of benefit |
|---|---|---|---|---|

**4. 10-row test grid:** each template rendered for each hard row, with pass or fail and the reason.

## Common mistakes

- **Long feed titles as headlines.** Step 3 uses short labels.
- **Static text that is false for some products.** Step 4 and the 10-row test.
- **"Sale" text left after the sale.** Step 6 uses current_price with dates.
- **One template for every audience.** Step 4 writes per audience.
- **Showing the same product the viewer ignored.** Template D cross-sells.
- **Judging catalog ads on inflated ROAS.** Gate 3 and step 8.

## Sources

- ADC-6143: Meta catalog fields, current_price behaviour, price options.
- ADC-0010: catalog ad ROAS inflated by existing customers.
- ADC-0026: cap catalog ads; rarely incremental.
- ADC-0040: judge catalog ads on 7-day click.
- ADC-0033: retarget with a different product.
- ADC-0023: tie ads to stock cover.
- GAD-0009, GAD-0017: feed titles are written for matching, not people.
- OFF-6145: genuine former prices only.

What makes this skill ours: every template is rendered against the feed's ten hardest rows before it ships; short custom labels replace long search-style titles in headlines; sale prices come from feed dates instead of static "Sale" text; and catalog ads are kept small and judged on new-buyer orders, not their inflated ROAS.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Points to keep:
- Prices in ads should include GST and fixed charges most buyers pay [ADC-6147]; check that the feed price is GST-inclusive.
- Mention COD only if it is live for all products in the set.
- For Hindi or regional language audiences, send the text to `write-ad-copy-in-indian-languages`.
- Local fields read well when they are true for the set, for example "Our {custom_label_1} is made for Indian summers."
- ADC-6147: Indian prices include charges most buyers pay.
