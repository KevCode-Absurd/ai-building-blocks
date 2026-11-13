---
name: offer-bundle-threshold-design
description: "Designs a store's free-shipping threshold, bundles, gifts, upsells and discounts from its own order data, and models the change in gross profit per order and per session before recommending any of them. Reads the shape of the order value distribution instead of the average, prices each bundle tier from real shipping and product costs, ranks upsells by added profit, and says where each offer goes on the page, in the cart, at checkout and after purchase. Includes a test plan that never tests two prices for one product, and notes for cash-on-delivery markets. Use before a promotion, when order value has stalled, or when the owner wants to add a discount and needs to know what it costs."
---

# Offer, bundle and free-shipping threshold design

**You get:** a recommended free-shipping threshold, bundle tiers, gift, upsells and discount rules modelled on gross profit per session, with an order value chart, offer and upsell tables, a set-up list and an offer model sheet.

Pick the offers that raise gross profit per session, not just order value, and place them where buyers will see them. Worked numbers are illustrative; replace them with the store's.

## When to use

- Order value has stalled and the owner wants bundles, a threshold or upsells.
- A sale or new discount is planned and someone needs to know what it costs.
- The current free-shipping threshold was set from the average order value.
- The store adds a second or third product that could be bundled.

## Not for

- Break-even ROAS and target cost per purchase for each offer: use `store-meta-math` (this skill hands it each offer's gross profit).
- Writing ad copy for the offer: use `store-meta-concepts`.
- Testing the offer inside Meta: use `store-meta-test`.
- Pricing a brand-new product from scratch: run `store-meta-math` with the planned costs first.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 90 days or more: Name, Created at, Subtotal, Discount Amount, Shipping, Total, Discount Code, Lineitem sku, Lineitem quantity, Lineitem price, Payment Method.
2. **Landed cost per SKU** (product, inbound freight, duty, retail box).
3. **Fulfilment and shipping cost by units per order**: what one unit costs to pick, pack and ship versus two, three and five, from the 3PL or courier invoice.
4. **Payment fees and return rate.**
5. **Current offers**: live codes, bundles, thresholds, upsell apps and their settings.
6. **Sessions** for the same window, from Shopify Analytics or GA4.

Optional: past sale periods with their dates, stock per SKU, and a list of cheap items that could be gifts.

If cost inputs are missing, ask once. Without them, stop: offers cannot be ranked. Setting up an offer in Shopify needs draft access (level 2); turning it on needs a client yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when built from delivered costs (`store-meta-math`). Fail: stop. A discount that lifts order value can still lose money per order, and only gross profit shows it [OFF-0065].
2. **Stock and cash.** Bundles and gifts use more units per order. Check days of cover for each bundled SKU and gift. If a gift item would run out inside the offer window, drop it or cap it.
3. **Tracking.** Orders and sessions must come from the same window with test and staff orders removed. If sessions are untrusted, rank by gross profit per order only and say so.

## Steps

### 1. Name the goal, then build the baseline

Write the one goal for this offer set: more orders (conversion) or bigger orders (order value). Every candidate is judged on that goal and on gross profit; an offer that wins the goal but loses profit is dropped.

Per order: net revenue, units, product cost, fulfilment, fees, return allowance, gross profit. Then gross profit per session = orders / sessions x gross profit per order. This is the number every offer must beat [OFF-0015].

### 2. Plot the order value distribution

Bucket order subtotals in steps of 5 or 10 (or 100 to 200 rupees). Mark each peak and the valleys. Many stores have two peaks, for example one-item and three-item orders, and the mean sits in the valley where few buyers are. A threshold just above the mean moves only the small group just below it, perhaps 10% of buyers, while giving free shipping to everyone already above it [OFF-0079] [OFF-0013].

### 3. Find what one more unit really costs

Shipping and packing are partly fixed per order. If one unit ships for 12 and three ship for 17, the second and third units carry only 2.50 each of shipping [OFF-0006]. That saved cost is what funds a bundle discount [OFF-0016]. Write the cost of the nth unit for n = 1 to 5.

### 4. Set the free-shipping threshold

Model three candidates: just above the lower peak, just above the mean, and 30 to 40% above the mean. For each:

Change in gross profit a month = (orders that move up x gross profit gained per moved order) minus (orders already above the line x shipping you now give away) minus (orders below that now abandon, if shipping is shown earlier).

Choose the candidate with the highest gain. Two rules:

- If shipping, tax and fees added at checkout stay under about 10% of order value, charging shipping showed no material conversion effect in one practitioner's tests [LPG-0063]. A threshold may not be needed at all.
- On a low-price single item, free shipping can raise conversion and still lose money; a multi-pack at a higher order value fixed it in one case [OFF-0033].

A coveted, cheap-to-make item given free above a line about 30 to 40% over the average can pull order value up harder than shipping alone [OFF-0076].

### 5. Design the bundle tiers

- Three options, not five. Cutting from five to three lifted conversion 53% and order value 13.5% in one test [LPG-0020].
- Make the middle tier the default and the offer the ads name [OFF-0027].
- Space savings evenly: the middle saves as much over the single as the large saves over the middle [OFF-0049].
- Put the money saved in each option title ("3 pack, save 10") [LPG-0021], or whichever is larger of money or percent [OFF-0017].
- Tie tiers to a real use where quantity varies (one person, whole family) [OFF-0018].
- "Buy 2 get 1 free" reads better than the same "33% off 3" on repeat-use staples [OFF-0030].

Price each tier: gross profit per order at the tier price minus its real unit and shipping costs. Reject a tier whose gross profit per order falls below the single unit's unless its expected take lifts gross profit per session.

Check the maths with all costs in. Illustrative: one item at 60 with landed cost 24 earns 36 before shipping; "buy 2 get 1 free" at 120 for three costs 72 in product, so it earns 48 before shipping, not 72. It still beats one item only if the extra shipping is small and enough buyers take it. For consumables, show cost per day or per use on every tier.

### 6. Add gifts only where they pay

A gift pays when it cuts cost per new customer, or lifts order value, by more than its landed cost [OFF-0073]. Illustrative: two units at 50 plus a gift costing 4 left break-even ROAS almost unchanged at 1.87 versus 1.89 while doubling order value [OFF-0078]. A cart ladder (free shipping, then a gift, then a bigger gift) suits stores with cheap complementary items [LPG-0072]. List each gift for sale on the site so its value is real [OFF-0007].

### 7. Rank upsells by added profit

Added profit per exposed order = take rate x order value added x that item's gross margin [OFF-0011]. Never rank by take rate or order value alone. Typical take rates for planning: in-cart 5 to 15%, one-click post-purchase 25 to 40% [OFF-0010]; checkout add-ons at 10 to 20 can reach about 50% [OFF-0050]. A post-purchase offer is judged by price x take rate, not take rate [OFF-0051]; more of the same product at a deep discount is the first one to try [OFF-0074].

Service add-ons count only at their true margin:

- **Shipping protection:** take rate near 30% at a small fee [OFF-0010], but the store must pay every valid claim. Margin = fee minus expected claims cost minus any provider fee.
- **Priority processing:** a paid "packed first" option is worth offering only if the warehouse can really pack those orders first; otherwise it is a broken promise.

### 8. Decide on discounts

- Model every discount depth before using it. A 30% discount on a 40% margin order moved break-even ROAS from 2.5 to about 7 [OFF-0065].
- Small 5 to 10% codes usually lose profit because units per order do not move [OFF-0014].
- Keep straight sitewide discounts to once or twice a year, on high-margin or slow stock [OFF-0008].
- Welcome offers: above about 100 order value a money-off amount tends to beat the same percentage [OFF-0026]; one email card puts the line nearer 200 [EML-0047]. Both agree fixed amounts win at high order value; use 100 as the line and test it.
- Check whether discount-led customers repeat less before scaling a code; at many brands they had worse lifetime value [CXP-0016].
- Urgency must be real: a stated end date that is kept. Never use countdown timers that reset.
- A "was" or compare-at price must be a price the store genuinely charged; consumer rules in most markets require it. Do not invent an anchor to make a discount look bigger.
- For a peak sale, pre-build a ladder (deeper discount, gift, free shipping, bundle) with pages ready, and model each rung's break-even [OFF-0068]. When unit cost is low, buy-one-get-one can earn far more per order than the same-looking 50% off [OFF-0066].

### 9. Place each offer

- Product page: bundle picker under add to cart [OFF-0053].
- Cart drawer: progress bar to threshold and gift tiers, one-click low-price add-ons [LPG-0001].
- Checkout: one add-on at most.
- After purchase: one one-click offer of more of the same or the item that solves the next problem [OFF-0052].

### 10. Cash on delivery markets

Practitioner default, test it: show a small COD fee or a prepaid discount at the product page, not as a checkout surprise, and model each against the store's return-to-origin rate in `store-meta-math`. A prepaid discount pays when it cuts return-to-origin losses by more than it costs.

### 11. Plan the test

Never test two prices for the same product; test tiers, framing and thresholds [CRO-0009]. Judge on gross profit per session [OFF-0015]. Use the order-volume rules in `storefront-conversion-audit` to decide whether the store can test or should ship and watch.

## Checks before you hand it over

- Every offer shows gross profit per order and per session, before and after.
- The threshold comes from the order value distribution, with the chart attached.
- Bundle tier costs use real shipping by units, not average shipping.
- Each upsell is ranked by take x added value x margin.
- Each discount has its break-even ROAS line handed to `store-meta-math`.
- Gift and bundle SKUs have stock for the offer window.
- No price test of one product at two prices; no fake urgency.
- Nothing was switched on without a client yes.

## Output

1. **One-screen summary:** the recommended threshold, bundle tiers, gift, upsells and discount rules, with the change in gross profit per session and per month. One runner-up in one line.
2. **Order value chart** with peaks and the chosen threshold marked.
3. **Offer table:** Offer, Placement, Price, Units, Gross profit per order, Expected take, Gross profit per session change, Stock check, Break-even ROAS.
4. **Upsell table:** Item, Slot, Take rate (planning), Value added, Margin, Added profit per exposed order.
5. **Set-up list for approval:** each Shopify setting or app change, numbered.
6. **File:** `offer-model.csv` or a Google Sheet with live formulas.

## Common mistakes

- **Threshold from the mean.** Step 2 uses the distribution's peaks.
- **Judging by order value.** A bigger default pack can raise order value and lose profit [OFF-0015]. Step 1 sets profit per session as the bar.
- **Average shipping in bundle maths.** Step 3 prices the nth unit.
- **Small codes everywhere.** Step 8 shows why they lose.
- **Gifts nobody values.** Step 6 lists gifts for sale and checks their cost.
- **Price tests on one product.** Step 11 tests structure instead.

## Sources

- OFF-0006, OFF-0016: shipping per unit funds bundle discounts.
- OFF-0007, OFF-0073, OFF-0078, LPG-0072: when gifts pay.
- OFF-0008, OFF-0014, OFF-0065: discount costs and limits.
- OFF-0066, OFF-0068: peak-sale ladder; buy-one-get-one versus half off.
- OFF-0010, OFF-0011, OFF-0050, OFF-0051, OFF-0052, OFF-0074: upsell take rates and ranking.
- OFF-0013, OFF-0079: thresholds from the distribution.
- OFF-0015: profit per session decides.
- OFF-0017, OFF-0018, OFF-0027, OFF-0030, OFF-0049, LPG-0020, LPG-0021: bundle design.
- OFF-0026, EML-0047: money-off versus percent welcome offers.
- OFF-0033, OFF-0076, LPG-0063: threshold and shipping cases.
- OFF-0053, LPG-0001: placement on page and cart.
- CXP-0016: discount cohorts repeat less.
- CRO-0009: never test two prices for one product.

What makes this skill ours: every offer is judged on gross profit per session, not order value; the threshold comes from the peaks of the store's own order distribution; bundle discounts are funded from the real cost of the nth unit; and each discount carries its own break-even line before anyone switches it on.
