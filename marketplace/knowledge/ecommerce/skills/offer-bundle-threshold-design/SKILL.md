---
name: offer-bundle-threshold-design
description: "Designs a store's free-shipping threshold, bundles, gifts, upsells and discounts from its own order data, and models the change in gross profit per order and per session before recommending any of them. Leads with the offer that already sells, unchanged. Reads the shape of the order value distribution instead of the average, prices each bundle tier from real shipping and product costs, ranks upsells by added profit, and says where each offer goes on the page, in the cart, at checkout and after purchase. When the brief asks for a test, plans one that never tests two prices for one product. Notes for cash-on-delivery markets. Use before a promotion, when order value has stalled, or when the owner wants to add a discount and needs to know what it costs."
---

# Offer, bundle and free-shipping threshold design

**You get:** one call each on the threshold, bundles, gift, upsells and discounts, judged on gross profit per session and led by the offer that already sells, plus a set-up list and an offer model sheet with the working.

Worked numbers are illustrative; use the store's. Follow the toolkit house rules, above all "Write for a busy owner." and "One basis per number."

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

1. **Shopify order export**, last 90 days or more, with line items, discounts, shipping and payment method.
2. **Landed cost per SKU** (product, inbound freight, duty, retail box).
3. **Fulfilment and shipping cost by units per order**: one unit versus two, three and five, from the 3PL or courier invoice.
4. **Payment fees and return rate.**
5. **Current offers**: live codes, bundles, thresholds, upsell apps and their settings.
6. **Sessions** for the same window, from Shopify Analytics or GA4.

If cost inputs are missing, ask once. Without them, stop: offers cannot be ranked. Setting up an offer in Shopify needs draft access (level 2); turning it on needs a client yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when built from delivered costs (`store-meta-math`). Fail: stop. A discount that lifts order value can still lose money per order, and only gross profit shows it [OFF-0065].
2. **Stock and cash.** Bundles and gifts use more units per order. If a bundled SKU or gift would run out inside the offer window, drop it or cap it.
3. **Tracking.** Orders and sessions from the same window, test orders removed. If sessions are untrusted, rank by gross profit per order and say so.

## Steps

### 1. Start from what already sells, then build the baseline

Find the proven winner in the order data: the pair most often bought together, the pack size most buyers pick, the threshold that already pulls orders over the line. It leads the plan unchanged: same items, same price, same line. Adding a third item to a pair that sells, re-pricing it, or moving a threshold that works is a test against the winner, never the plan itself. Offer an add-on beside the winner, not inside it.

Write the one goal: more orders (conversion) or bigger orders (order value). An offer that wins the goal but loses gross profit is dropped.

Per order: net revenue, units, product cost, fulfilment, fees, return allowance, gross profit. Then gross profit per session = orders / sessions x gross profit per order. Every offer must beat this number [OFF-0015].

### 2. Plot the order value distribution

Bucket order subtotals in steps of 5 or 10 (or 100 to 200 rupees). Mark each peak and valley. Many stores have two peaks, for example one-item and three-item orders, and the mean sits in the valley. A threshold just above the mean moves only the small group just below it, perhaps 10% of buyers, while giving free shipping to everyone already above it [OFF-0079] [OFF-0013].

### 3. Find what one more unit really costs

Shipping and packing are partly fixed per order. If one unit ships for 12 and three ship for 17, the second and third units carry only 2.50 each of shipping [OFF-0006]. That saved cost funds a bundle discount [OFF-0016]. Write the cost of the nth unit for n = 1 to 5.

### 4. Set the free-shipping threshold

Model three candidates: just above the lower peak, just above the mean, and 30 to 40% above the mean. For each:

Change in gross profit a month = (orders that move up x gross profit gained per moved order) minus (orders already above the line x shipping you now give away) minus (orders below that now abandon, if shipping is shown earlier).

Make one call: keep the line, or move it. Keeping it while planning a move reads as a hedge; if only a test can settle it, the call is the test. Give the gain as a point estimate with its range.

- If shipping and fees at checkout stay under about 10% of order value, charging shipping showed no material conversion effect in one practitioner's tests [LPG-0063].
- On a low-price single item, free shipping can lift conversion and still lose money; a multi-pack fixed it in one case [OFF-0033].

A coveted, cheap-to-make item given free above a line about 30 to 40% over the average can pull order value up harder than shipping alone [OFF-0076].

### 5. Design the bundle tiers

- Three options, not five. Cutting from five to three lifted conversion 53% and order value 13.5% in one test [LPG-0020].
- Make the middle tier the default and the offer the ads name [OFF-0027].
- Space savings evenly: the middle saves as much over the single as the large saves over the middle [OFF-0049].
- Put the money saved in each option title ("3 pack, save 10") [LPG-0021], or whichever is larger of money or percent [OFF-0017].
- Tie tiers to a real use where quantity varies (one person, whole family) [OFF-0018].
- "Buy 2 get 1 free" reads better than "33% off 3" on repeat-use staples [OFF-0030].

Price each tier at its real unit and shipping costs. Reject a tier whose gross profit per order falls below the single unit's unless its expected take lifts gross profit per session.

Illustrative: "buy 2 get 1 free" at 120 on a 60 item with landed cost 24 earns 48 before shipping, not 72. For consumables, show cost per day or per use on every tier.

### 6. Add gifts only where they pay

A gift pays when it cuts cost per new customer, or lifts order value, by more than its landed cost [OFF-0073]. Illustrative: two units at 50 plus a gift costing 4 left break-even ROAS almost unchanged at 1.87 versus 1.89 while doubling order value [OFF-0078]. A cart ladder (free shipping, then a gift, then a bigger gift) suits stores with cheap complementary items [LPG-0072]. List each gift for sale on the site so its value is real [OFF-0007].

### 7. Rank upsells by added profit

Added profit per exposed order = take rate x order value added x that item's gross margin [OFF-0011]. Never rank by take rate or order value alone. Planning take rates: in-cart 5 to 15%, one-click post-purchase 25 to 40% [OFF-0010]; checkout add-ons at 10 to 20 can reach about 50% [OFF-0050]. A post-purchase offer is judged by price x take rate [OFF-0051]; more of the same product at a deep discount is the first one to try [OFF-0074].

Shipping protection takes near 30% at a small fee [OFF-0010], but counts only at fee minus expected claims.

### 8. Decide on discounts

- Model every depth first. A 30% discount on a 40% margin order moved break-even ROAS from 2.5 to about 7 [OFF-0065].
- Small 5 to 10% codes usually lose profit because units per order do not move [OFF-0014].
- Keep sitewide discounts to once or twice a year, on high-margin or slow stock [OFF-0008].
- Welcome offers: at high order value a money-off amount beats the same percentage; cards put the line between 100 [OFF-0026] and 200 [EML-0047]. Use 100 and test it.
- Discount-led customers often repeat less; check before scaling a code [CXP-0016].
- Urgency and "was" prices must be real: a deadline that is kept, a price the store genuinely charged.
- For a peak sale, pre-build a ladder (deeper discount, gift, free shipping, bundle) with pages ready, and model each rung's break-even [OFF-0068]. When unit cost is low, buy-one-get-one can earn far more per order than the same-looking 50% off [OFF-0066].

### 9. Place each offer

- Product page: bundle picker under add to cart [OFF-0053].
- Cart drawer: progress bar to threshold and gift tiers, one-click low-price add-ons [LPG-0001].
- Checkout: one add-on at most.
- After purchase: one one-click offer of more of the same or the item that solves the next problem [OFF-0052].

### 10. Cash on delivery markets

Show any COD fee or prepaid discount at the product page, not as a checkout surprise, and model each against the store's own return-to-origin rate in `store-meta-math`. A prepaid discount pays when it cuts return-to-origin losses by more than it costs.

### 11. Plan the test, only when one is needed

Write a test plan only when the brief asks for one, or when a call is itself a test (a change to the proven winner); otherwise one line on what to watch. Never test two prices for one product; test tiers, framing and thresholds [CRO-0009]. Judge on gross profit per session [OFF-0015], with conversion (and in COD stores the delivered rate) as the guardrail.

Run both versions on the same days, split at random by visitor, or by region with matched past sales, for 2 to 4 full weeks [CRO-0021]. Use before and after only when no split is possible (too little traffic [CRO-0001]), in matching weeks, with the caveat. Size it with `storefront-conversion-audit`, in relative weeks unless the brief gives dates.

### 12. Rank the moves and reconcile the numbers

- Rank the calls by gross profit a month for each hour of set-up; a change that can go live in week 1 comes before one that needs a build.
- Each move names who does it and who says yes.
- Each projection rests on the store's numbers plus at most one assumed input, named in the line ("if 10% of carts add the gift"). Use no outside benchmark unless it is a card logged in your working trace.
- Log every figure in `context/numbers.json` with its inputs, period and money basis, then run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>`. Fix every FAIL.

## Checks before you hand it over

- The offer that already sells leads unchanged; changes to it are tests.
- One call per decision, point estimate and range in one line, ranked by money per hour of work, each with who does it.
- Every offer shows gross profit per order and per session, before and after; `numbers.cjs` shows no FAIL.
- The threshold comes from the distribution; bundle costs use real shipping by units; upsells rank by take x value x margin.
- Each discount's break-even ROAS goes to `store-meta-math`; gift and bundle SKUs have stock.
- No two prices for one product, no fake urgency, and no test plan, budget or section the brief did not ask for.
- Nothing was switched on without a client yes, asked in your own message.

## Output

Follow the house rule "Write for a busy owner."

1. **The calls, ranked:** two lines each, with the gross profit change a month as a point estimate and range.
2. **Offer table:** Offer, Where it shows, Price, Gross profit per order, Change in gross profit per session.
3. **Order value chart** with peaks and the chosen threshold marked.
4. **Set-up list:** each Shopify setting or app change, numbered, with who makes it.
5. **Test plan**, only if the brief asks or a call is a test: Offer, Arms, Main metric and guardrail, Weeks.
6. **File:** `offer-model.csv` or a Google Sheet holding the working.

## Common mistakes

- **Rebuilding the winner.** Turning a pair that sells into a three-item set. Step 1 keeps it and tests changes against it.
- **Keep and test at once.** Step 4 makes one call.
- **Threshold from the mean.** Step 2 uses the distribution's peaks.
- **Average shipping in bundle maths.** Step 3 prices the nth unit.
- **Small codes everywhere.** Step 8 shows why they lose.

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
- CRO-0001, CRO-0021: when a split test is possible; full weekly cycles.

What makes this skill ours: the offer that already sells leads unchanged; every offer is judged on gross profit per session; the threshold comes from the store's own order peaks; and bundle discounts are funded from the real cost of the nth unit.
