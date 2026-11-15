---
name: basket-and-attach-rate-analysis
description: "A basket map from the store's own orders: product pairs bought together with support count, attach rate and lift, what customers buy next and how many days later, contribution per basket with and without each pair, how many of each bundle the stock can really make, cannibalisation checks for recent launches measured as net demand, and a ranked list of bundles, cart add-ons, post-purchase offers and timed cross-sell emails worth testing. Use before planning bundles, add-ons or a line extension, when order value is flat, or when a new product may be taking sales from an old one."
---

# Basket and attach rate analysis

**You get:** a pair table with support, attach rate and lift; a next-purchase table with timing; contribution per basket; a bundle stock check; a cannibalisation check for each recent launch; and a ranked list of up to 10 bundles and add-ons to test, each with where it goes, the evidence and the margin it adds.

## When to use

- Before building bundles, cart add-ons, post-purchase offers or a gift set.
- Average order value is flat and the owner wants to raise it without discounting.
- A new product or variant launched in the last 6 months and older products may have slowed.
- Before planning a line extension, to see what buyers already pair.
- An email cross-sell flow needs to know what to offer and when.

## Not for

- Pricing the bundle and setting order value thresholds: use `offer-bundle-threshold-design`.
- Building the cart and checkout offers: use `set-up-cart-upsells-and-cross-sells`.
- Classing the whole range by margin and steadiness: use `abc-xyz-product-classes`.
- The final go on a new product: use `plan-product-line-extension`.
- Email timing for repeat buys of the same product: use `replenishment-reminder-timing`.

## What you need

Required (read access, level 1):

1. **Order lines for 12 months:** order ID, customer ID, order date, product, variant, units, net price, discount, refund status.
2. **Contribution per product** (from `build-sku-profit-sheet`), or landed cost plus fulfilment and fees.
3. **Stock on hand per variant** and the parts list of any current bundles.
4. **Launch dates** of products added in the last 12 months.
5. **Promotion calendar**, so sale baskets can be read apart.

Optional: site search terms, review and ticket mentions of "goes with" or "wish it came with", ad spend by product.

This is analysis at level 1 and 2. Creating bundles, changing the cart or sending emails needs the owner's yes.

## Before you start: the gates

1. **Enough orders.** Pass when the store has at least 1,000 orders with two or more products in the period. Fail: widen the window to 24 months or work at collection level; with fewer, most pairs are noise.
2. **Clean baskets.** Pass when refunded and cancelled lines, free gifts, samples, shipping protection and gift cards are removed. Fail: remove them first; a free gift in every order shows up as the "best" attach.
3. **The right level.** Pass when variants are grouped to product (size and colour merged) unless the question is about variants. Fail: group them; a pair split across 12 sizes will never reach the support floor.

## Steps

### 1. Count baskets

Total orders, orders with 2 or more products, average products per order, and the share of each product's orders that are single-item. Split sale periods from full-price periods; baskets in a sale often differ.

### 2. Build the pair table

For each pair of products A and B:

- **Support count:** orders that contain both.
- **Attach rate of B to A (confidence):** orders with both / orders with A.
- **Lift:** attach rate of B to A / share of all orders that contain B.

Rank by lift, not attach rate: a pair can show 75% attach and still have lift below 1 if nearly everyone buys B anyway [MEA-6407]. Set a minimum support count before ranking, because lift inflates rare pairs: a pair bought together in 20 of 1,000 orders can score lift 4 while a common pair scores near 1 [MEA-6406]. Default floor: at least 30 orders together, or 0.5% of multi-item orders, whichever is higher. Lift above 1.5 with the floor met is a real pairing; between 1 and 1.5 is weak; below 1 means the two rarely go together.

### 3. Build the next-purchase table

For customers whose first order contained A, find the share who bought B in a later order within 90 and 180 days, and the median days between. Pairs that are rare in one basket but common across orders are cross-sell email candidates, timed at the median day, not bundle candidates.

### 4. Price each basket

Contribution per basket for orders with the pair against orders with A alone. Show the gain per order and per year at current order volume. A pairing that lifts order value but lowers contribution (heavy discount, a low-margin add-on, a size jump into a higher shipping band) is marked "check margin".

### 5. Check bundle stock

For each current or proposed bundle: bundles you can make = the lowest of (stock of each part / units of that part per bundle). Flag bundles where one part limits the total to under 2 weeks of expected sales, and bundles that would strip stock from an A product's own sales.

### 6. Check cannibalisation for recent launches

For each product launched in the last 12 months:

1. Forecast what the older, similar products would have sold without it: use the same weeks last year adjusted for overall store growth.
2. Compare with what they really sold since launch.
3. Net demand = the launch's sales minus the shortfall in the older products [MEA-6405].
4. Contribution kept = net demand x contribution, plus any margin difference between new and old.

Mark each launch "adds demand", "mostly switching" (net demand under 50% of its sales) or "takes margin" (contribution kept is negative). Read promotions with care: a promotion pulls some sales from substitutes and lifts complements, so judge it on the net [MEA-6403].

### 7. Find gaps buyers point to

From site search, reviews and tickets, list products buyers ask for "with" or "for" what they bought, which the store does not sell. Hand them to `plan-product-line-extension` with the count of mentions.

### 8. Rank what to test

Score each idea on lift (with the support floor met), support count, contribution added per order, stock depth, and fit with the brand. Assign each a place: a fixed bundle, a cart add-on, a post-purchase offer, or a timed cross-sell email. Up to 10 ideas, ranked, each with its evidence and the expected contribution added per 1,000 orders.

## Checks before you hand it over

- Refunds, cancellations, free gifts, samples and add-on fees were removed.
- Every ranked pair meets the support floor and is ranked by lift.
- Cross-order pairs are timed by median days, not forced into bundles.
- Contribution, not order value, decides the ranking.
- Every bundle has a stock check and a limiting part named.
- Each recent launch shows net demand, not total sales.
- No bundle, cart change or email was made live without the owner's yes.

## Output

1. **Basket summary:** orders, multi-item share, products per order, sale versus full price.
2. **Pair table:** product A, product B, support count, attach rate both ways, lift, contribution with and without.
3. **Next-purchase table:** first product, next product, share within 90 and 180 days, median days.
4. **Bundle stock check:** bundle, parts, bundles you can make, limiting part, weeks of cover.
5. **Cannibalisation check:** launch, its sales, shortfall in older products, net demand, contribution kept, verdict.
6. **Test list:** rank, idea, place (bundle, cart, post-purchase, email), evidence, contribution added per 1,000 orders, next skill.
7. **Gap list** for the product team.

## Common mistakes

- **Ranking by attach rate.** Step 2 uses lift with a support floor.
- **Free gifts as top pairs.** Gate 2 removes them.
- **Variant-level pairs.** Gate 3 groups to product.
- **Bundling things bought weeks apart.** Step 3 sends those to email.
- **Judging a launch on its own sales.** Step 6 counts what it took from the range.
- **Bundles that cannot ship.** Step 5 checks stock first.

## Sources

- MEA-6407: rank pairs by lift, not confidence.
- MEA-6406: set a minimum support count before ranking by lift.
- MEA-6405: judge a line extension on net demand.
- MEA-6403: promotion halo and substitution effects.
- Library items: Bundle stock checker (adapted from shopify-admin-bundle-availability-check by 40rty AI, MIT, https://github.com/40rty-ai/shopify-admin-skills/tree/main/skills/fulfillment-ops/shopify-admin-bundle-availability-check), used for step 5; Raise order value with bundles and add-ons you can check (AI Blocks workflow).
- Web sources: Tan, Steinbach, Karpatne and Kumar, "Introduction to Data Mining", Chapter 5 Association Analysis (https://www-users.cse.umn.edu/~kumar001/dmbook/ch5_association_analysis.pdf); "Estimating cannibalization rates for pioneering innovations", Marketing Science 29(6) (https://researchcommons.waikato.ac.nz/entities/publication/678d5648-0acd-4dd4-ad61-0ac7dc0c8e3f); "Decomposing the sales promotion bump accounting for cross-category effects", IJRM 25(3) (https://ideas.repec.org/a/eee/ijrema/v25y2008i3p201-214.html).

What makes this skill ours: pairs are ranked by lift only above a support floor, single-basket pairs and next-order pairs go to different places, contribution not order value decides the list, every bundle is checked against stock, and every recent launch is judged on net demand after what it took from the range.
