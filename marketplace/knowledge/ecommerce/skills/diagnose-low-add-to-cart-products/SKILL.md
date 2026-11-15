---
name: diagnose-low-add-to-cart-products
description: "Finds the products that get plenty of views but few add to carts, separates real page problems from bad traffic and stock gaps, names the likely reason for each product from its own evidence (price, stock, images, reviews, answers, ad match, delivery), and gives the one fix to try first with the gross profit at stake. Works from GA4 item reports or Shopify product reports plus a look at each page on a phone. Use when product pages get traffic but do not sell, before paying for more traffic to a product, or when merchandising wants to know which pages to rework first."
---

# Products with low add-to-cart rates

**You get:** a ranked sheet of the products with enough views but a low view-to-cart rate (usually 5 to 15 products), each with its rate against the store median, the likely reason backed by evidence, the first fix to try, and the gross profit a month at stake, plus a short list of products to leave alone and why.

## When to use

- Some product pages get traffic but rarely get added to cart.
- Before raising ad spend on a product or making it the hero of a campaign.
- Merchandising wants to know which product pages to rework first.
- After a price change, restock or new photos, to check which pages fell behind.

## Not for

- Rebuilding a product's image gallery: use `pdp-image-gallery-rebuild` once this skill names images as the reason.
- Rewriting product page copy: use `write-product-page-copy`.
- Leaks after add to cart: use `fix-checkout-drop-off`.
- Deciding product placement on home and collections: use `merchandise-homepage-and-collections`.

## What you need

Required (read access, level 1):

1. **Product views and add to carts by product, last 60 to 90 days.** GA4: Reports > Monetization > E-commerce purchases (items viewed, items added to cart, items purchased). Or Shopify's product analytics report with product views and add to carts. Include a split by device and by session source if possible.
2. **Product list:** price, compare-at price, variants with stock, review count and rating, date published.
3. **Gross profit per unit** by product, from `build-sku-profit-sheet`.
4. **Live product URLs** for each flagged product.

Optional: ads and landing URLs pointing at each product, review text, support tickets and return reasons by product, competitor prices for the top products, session recordings of product pages.

If item-level events are missing in GA4, fix them first with `set-up-ga4-for-store-and-check-data`, or use Shopify's report alone. Page changes need draft access (level 2) on a theme copy; publishing, price and stock changes need the client's yes.

## Before you start: the gates

1. **Gross profit per unit known** [MEA-0037]. Fail: compute it; a low-margin product may not deserve the work.
2. **Item events fire correctly.** View and add-to-cart counts per product should look plausible (no product with more adds than views; quick-add from collection pages counted separately if the theme allows it). Fail: fix tracking, or note the products affected.
3. **Enough views to judge.** Only products with at least 300 views in the window are judged (practitioner default; below that the rate swings too much). Others go to a "too few views" list.
4. **Stock is real.** A product with key sizes or variants sold out is a stock problem first, not a page problem [LPG-0069].

## Steps

### 1. Compute each product's rate

View-to-cart rate = add to carts / product views. Find the store median across judged products and the median for each product type (a candle and a sofa do not share a rate). As a planning range for whole-store add to cart, 12 to 20% of sessions is typical [LPG-0040]; per product, compare with the store's own median.

### 2. Flag the low ones

Flag a product when its rate is below 60% of its product type median (practitioner default) and it has enough views. Then size it: lost carts a month = monthly views x (type median - product rate); gross profit at stake = lost carts x store cart-to-order rate x gross profit per unit x units per order. Sort by gross profit at stake.

### 3. Rule out traffic problems

For each flagged product, split the rate by source and device:

- **Low only from one ad or source:** the ad promises something the page does not show, or targets the wrong buyer. Each ad angle should land on a page that leads with that same benefit [LPG-0064]. The fix is in the ad or a matched landing page, not the product page; hand to the media buyer.
- **Low only on mobile:** a layout problem; check the first screen and gallery on a phone [LPG-0034].
- **Low everywhere:** a page or offer problem; continue.

### 4. Check the page against the reason list

Open each flagged product on a phone and check, in this order:

| Reason | How to check | Evidence it is the cause |
|---|---|---|
| Stock and variants | Sizes, colours or bundles out of stock or hidden | Rate drops when key variants sell out |
| Price versus peers | Price against the store's similar products and 2 to 3 rivals | Much higher than the closest alternative, with no reason shown |
| Reviews | Count and rating against store median | Few or none; stores report big jumps going from 0 to about 80 reviews, and photo reviews that match the claim matter more after that [LPG-0062] |
| Images | First image, gallery length, scale, in-use shots | Few images; gallery does not answer what buyers ask; shoppers swipe the gallery more than they scroll [LPG-0060] |
| Unanswered objections | Review text, tickets, return reasons for size, fit, use, compatibility | Questions repeat in tickets; answers missing near the button [LPG-0005] |
| Delivery and returns | Delivery date and return terms near add to cart | Missing or vague |
| First screen | Price, rating, add to cart and risk reducer visible without scrolling | Any missing [LPG-0034] |
| Behaviour | Recordings: dead taps on price, size or images, quick backs | Dead clicks and quick exits signal missing information [CRO-0023] |

Name the one reason with the strongest evidence. If two are tied, choose the cheaper fix.

### 5. Pick the first fix for each product

Match the fix to the reason:

- Stock: restock the missing variants, hide the product from ads until restocked, or show a back-in-stock signup.
- Price: do not test two prices for one product in a split test [CRO-0009]; frame value (bundle, cost per use) or hand to `run-a-price-test`.
- Reviews: start asking buyers of this product for reviews and photos with `build-review-collection-system`; show the reviews that answer the top objection near the button.
- Images: hand to `pdp-image-gallery-rebuild` with the objection list.
- Objections: add a short answer block or size guide (see `write-size-fit-and-how-to-use-guides`).
- Delivery and returns: add the delivery date and return line under the button.

Each fix gets one line: what changes, where, and how success will be read (rate back to at least the type median over 4 weeks).

### 6. Decide which products to leave alone

Leave a product alone when its gross profit at stake is small, it is being discontinued, or its low rate comes from browsing traffic that buys something else (for example a premium product that sells the cheaper one beside it). Say why in one line.

### 7. Measure after the fix

Most single-product changes cannot be split tested at these volumes [CRO-0011]. Read before and after: 4 weeks either side, same traffic sources, no promotion in either window, and the product type median as a control line. Label the result as weaker evidence than a test.

### 8. Notes by market

- **All markets:** check the delivery estimate for the buyer's postcode and the payment options buyers expect (cards, wallets, buy now pay later, pay on delivery where common) on the product page; sizing for local body measurements and size systems (US, UK and EU sizes differ) where products are imported; prices shown the way the market expects (tax included in the UK, EU and Australia); reviews in other languages counted too.
- **US:** check that shipping cost or free-shipping threshold is visible on the product page, and that compare-at prices are real past prices.

## Checks before you hand it over

- Every flagged product has at least 300 views in the window, or is on the "too few views" list.
- Rates are compared with the product type median, not the whole store only.
- Traffic, device and stock causes were ruled out before page causes.
- Each product has one named reason with its evidence and one first fix.
- Gross profit at stake a month is shown for every flagged product.
- No two-price split test is proposed.
- No page, price or stock change without the client's yes.

## Output

**One-screen summary:** how many products were judged and flagged, the gross profit a month at stake in total, and the top 3 products with their first fix.

**Product sheet:**

| Product | Type | Views (period) | Add to carts | Rate | Type median | Mobile rate | Worst source | GP at stake a month | Likely reason | Evidence | First fix | Hand-off | Read-out date |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Leave-alone list:** Product, Reason.
**Too few views list:** Product, Views.

## Common mistakes

- **Judging on tiny numbers.** Gate 3 sets a view floor.
- **Comparing every product with one store average.** Step 1 uses product type medians.
- **Fixing the page when the ad is wrong.** Step 3 splits by source first.
- **Calling a sold-out size a design problem.** Gate 4 checks stock first.
- **Testing two prices on one product.** Step 5 sends price to framing or a proper price test.
- **Five fixes at once.** Step 5 picks one first fix, so the read-out means something.

## Sources

- CRO-0009: never test two prices for one product.
- CRO-0011: test type gated by monthly orders.
- CRO-0023: dead clicks and quick backs signal missing information.
- LPG-0005: reviews that answer the exact objections near the button.
- LPG-0034: mobile product page first screen.
- LPG-0040: add-to-cart planning range.
- LPG-0060: shoppers swipe the gallery more than they scroll.
- LPG-0062: review count up to about 80 matters most.
- LPG-0064: each ad angle needs a page that leads with it.
- LPG-0069: top products and size stock decide grid conversion.
- MEA-0037: gross margin is delivered cost.

What makes this skill ours: products are compared with their own product type median and a view floor, not one store average; traffic, device and stock causes are ruled out before anyone touches the page; each product gets one evidenced reason and one first fix, sized in gross profit a month; and products not worth the work are named and left alone.

## Selling in India

- Check the pincode delivery estimate and COD availability on the product page.
- Check sizing against Indian body measurements where products are imported.
- Show prices with GST included, and count regional-language reviews too.
