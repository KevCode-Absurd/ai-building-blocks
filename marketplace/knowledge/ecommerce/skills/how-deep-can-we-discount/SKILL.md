---
name: how-deep-can-we-discount
description: "A discount ceiling sheet for every product: the deepest discount each one can take and still make money, the extra units needed to break even at 10, 15, 20, 25 and 30% off, and the new break-even ROAS at each depth. Built from delivered cost per unit (product, freight, packing, shipping, payment fees, returns and failed cash-on-delivery deliveries), not product margin. Separates products that must earn a profit on the sale from slow stock where the floor is the cost to sell one more unit. Use before any sale, coupon, influencer code or marketplace deal, when someone asks for 'just 20% off sitewide', or when the owner wants to know which products can carry a promotion."
---

# How deep can we discount?

**You get:** a discount ceiling sheet with one row per product (or per variant group): delivered cost, contribution per unit at full price, the deepest safe discount, the units lift needed to break even at five discount depths, and the break-even ROAS at each depth, plus a one-screen summary naming which products can carry a sale and which cannot.

## When to use

- A sale, festival offer or sitewide code is being planned and nobody has priced what it costs.
- A creator, affiliate or marketplace asks for a code or a deal price.
- Sales are slow and the owner wants to "run a discount" without knowing the floor.
- Slow stock needs clearing and the team needs to know how low it can go.

## Not for

- Designing the bundles, threshold, gifts and upsells that may beat a discount: use `offer-bundle-threshold-design`.
- Building the full profit-per-product sheet from scratch: use `build-sku-profit-sheet` first, then come back.
- Clearance routes and markdown steps for dead stock: use `clear-slow-moving-stock` (this skill gives it the floor).
- Day-by-day plan for one big sale: use `plan-peak-sale-week`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 90 days at least: Name, Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Shipping, Payment Method, Refunded Amount. Use it for real units per order, discount history and COD share.
2. **Landed cost per SKU**: purchase price, inbound freight, duty, retail box [FIN-0007]. If missing, run `calculate-landed-cost-per-unit`.
3. **Delivery cost per order** from the courier or 3PL invoice: pick, pack, packaging and outbound shipping.
4. **Payment fee rates** by method (cards, UPI, wallets, COD remittance fee).
5. **Return rate and RTO rate** by product, from the returns app or courier report.
6. **Current ad cost per purchase** (blended or new customer), from Meta Ads Manager and Google Ads exports or `store-meta-math`.

Optional: stock on hand and weeks of cover per SKU, past sale results, and the owner's minimum profit per order.

If landed cost or delivery cost is missing for a product, mark the row "no ceiling yet" and do not guess. Changing a price or creating a discount in Shopify needs draft access (level 2) and a client yes before it goes live.

## Before you start: the gates

1. **Delivered cost is known.** Pass when each row has landed cost, delivery cost, fees and a return and RTO allowance. Product margin alone fails: a 70% "margin" tee can be far thinner once freight, shipping and fees are in [MEA-0023] [MEA-0037]. Fail: build the cost rows first.
2. **Prices are compared like for like.** Use the price the store keeps: net of GST in India, before sales tax in the US. Fail: restate prices before any maths.
3. **Cash need is stated.** If the sale is meant to raise cash from stock, say so now. That changes the floor for those products (step 6).
4. **Legal anchors.** Any "was" or compare-at price must be one the store genuinely charged for a reasonable recent period [OFF-6145]. In India never sell above the printed MRP, which already includes all taxes [COG-6264].

## Steps

### 1. Build the cost row for each product

Delivered variable cost per unit = landed cost + (delivery cost per order / units per order) + payment fee + return allowance + RTO allowance.

- Payment fee is a percentage of the discounted price, so it shrinks a little as the price drops. Keep it as a percentage.
- Return allowance = return rate x (lost outbound and return shipping + handling + any unsellable unit). Card fees are usually not refunded on a refund, so add them [FIN-6243].
- RTO allowance (India, COD) = RTO rate x (forward plus return shipping + COD fee + packaging). Use each product's own COD share and RTO rate, not the store average.

Contribution per unit at full price = net price minus delivered variable cost. This is the money each sale adds before ads and fixed costs.

### 2. Work out the break-even lift at each depth

For each product, at 10, 15, 20, 25 and 30% off:

- New contribution per unit = net price x (1 minus discount) minus delivered variable cost (fee recalculated).
- Units lift needed to make the same total contribution = (full-price contribution / new contribution) minus 1.

Illustrative: net price 1,000, delivered cost 550, contribution 450. At 20% off the price is 800 and contribution 250 (ignoring the small fee change), so the store needs 450 / 250 = 1.8 times the units, an 80% lift, just to stand still. At 30% off contribution is 150 and the lift needed is 200%.

Small discounts look cheap but rarely move units enough; 5 to 10% codes usually lose contribution because units per order do not change [OFF-0014].

### 3. Work out the break-even ROAS at each depth

Break-even ROAS = discounted price / new contribution per order. Using the example: 1,000 / 450 = 2.2 at full price, 800 / 250 = 3.2 at 20% off, 700 / 150 = 4.7 at 30% off. Discounts eat contribution, not revenue, so the ROAS the ads must hit climbs steeply [OFF-0065] [OFF-0069]. A 25% discount on a 60% gross margin product needed about 50% higher ROAS in one worked case [OFF-0005]. Hand these lines to `store-meta-math` so the media buyer judges sale ads against them.

### 4. Set the deepest safe discount per product

Deepest safe discount = (net price minus delivered cost minus the minimum profit the store needs per order) / net price.

Pick the minimum profit per order with the owner:

- **Profit sale (default):** the expected ad cost per purchase during the sale, plus a small margin. If the ads will not change, use the current cost per purchase.
- **Acquisition push:** the owner may accept zero first-order profit if repeat data proves the customer comes back. Treat the discount and the ad cost as one acquisition budget per customer [FIN-0015]; it only pays if conversion really rises enough to cut cost per customer by the discount amount.
- **Check repeat quality first.** At many brands, discount-acquired customers had worse lifetime value [CXP-0016], and November sale cohorts can repeat less than normal months [MEA-0035]. If the store's cohorts show this, lower the ceiling for acquisition pushes.

Round the ceiling down to the nearest clean step the store would advertise (10, 15, 20, 25%). If the ceiling is under 10%, mark the product "no discount: use a gift, bundle or free shipping instead" and hand it to `offer-bundle-threshold-design`.

### 5. Compare the discount with other mechanics

For each product that can carry a discount, show the same buyer value as a different mechanic:

- Buy-one-get-one or a multi-pack: when unit cost is low, it can earn far more per order than the same-looking 50% off [OFF-0066].
- A gift worth the same to the buyer that costs the store less.
- Free shipping above a threshold.

Write one line per product: which mechanic gives the most contribution per order at the same perceived saving.

### 6. Slow stock: a different floor

For stock that will not sell at full price inside its season or shelf life, the purchase cost is already spent. The floor is the cost to sell one more unit: delivery, fees, returns and RTO, plus the ad cost to move it. Pushing such stock at break-even or a small loss in its own funnel can turn it into cash [FIN-0026]. Mark these rows "cash floor" and hand them to `clear-slow-moving-stock`. Never apply the cash floor to products that sell at full price.

### 7. Market notes

- **India:** discounts raise COD share on many stores, and COD brings RTO. Rerun the RTO allowance at the COD share seen in past sales. A prepaid-only extra discount (for example 5% more on UPI) can pay if it cuts RTO losses by more than it costs; test it. Show the discount against the MRP honestly, never against an inflated MRP. GST is charged on the discounted price when the discount is on the invoice; ask the store's accountant to confirm treatment for gifts and free items.
- **US:** sales tax sits outside the maths. A compare-at price must be a real recent price [OFF-6145]. Marketplace deal prices (Amazon, Walmart) add referral fees that rise and fall with price; include them per channel.

### 8. Write the summary and hand over

Sort products into three groups: can carry 20% or more, can carry 10 to 15%, no discount. Name the three products with the most room and the three that must stay out of any sitewide code. Nothing is switched on: the sheet goes to the client for approval.

## Checks before you hand it over

- Every row uses delivered cost, with return and RTO allowances by product.
- Prices are net of GST or before US sales tax, in one currency.
- The break-even lift and break-even ROAS are shown at all five depths.
- Each ceiling states which minimum profit rule it used.
- Products with a ceiling under 10% are marked "no discount" with an alternative mechanic.
- Cash-floor rows are only slow stock and are labelled as such.
- No compare-at price is proposed that the store has not genuinely charged.
- No discount was created or switched on.

## Output

**One-screen summary:** how many products can carry 20%+, 10 to 15%, none; the safest sitewide depth (the lowest ceiling among products that would be included); the three best and three worst products for a sale; one recommendation and the runner-up in a line.

**Discount ceiling sheet** (`discount-ceilings.csv` or a Google Sheet with live formulas):

| SKU | Product | Net price | Landed cost | Delivery per unit | Fee % | Return allowance | RTO allowance | Delivered cost | Contribution at full price | Lift needed at 10 / 15 / 20 / 25 / 30% | Break-even ROAS at full / 10 / 15 / 20 / 25 / 30% | Min profit rule | Deepest safe discount | Better mechanic | Cash floor? | Stock cover (weeks) |

**Notes block:** data sources and dates, products with missing costs, and up to three assumption lines (for example the minimum profit per order used, or whether the sale aims at new buyers). GST treatment carries one line: "accountant check before the sale runs".

## Common mistakes

- **Using product margin.** Step 1 builds delivered cost, so a 70% margin product is not treated as having 70% to give away.
- **Average RTO for every product.** Step 1 uses each product's own COD share and RTO rate.
- **Judging the sale on revenue.** Step 2 shows the extra units needed; if past sales did not deliver that lift, the discount loses money.
- **One sitewide number.** Step 8 finds the lowest ceiling among included products and excludes the thin ones.
- **Clearance logic on good stock.** Step 6 applies the cash floor only to stock that will not sell at full price.
- **Fake anchors.** The gates block "was" prices the store never charged.

## Sources

- FIN-0007: landed cost is all in until it reaches the warehouse.
- MEA-0023, MEA-0037: product margin is not delivered gross margin.
- FIN-6243: card fees are not refunded on a refund.
- OFF-0014: small 5 to 10% codes usually lose contribution.
- OFF-0005, OFF-0065, OFF-0069: break-even ROAS rises steeply with discount depth.
- FIN-0015: discount and ad cost are one acquisition budget.
- CXP-0016, MEA-0035: discount and November cohorts can repeat less.
- OFF-0066: buy-one-get-one versus half off when unit cost is low.
- FIN-0026: slow stock can be pushed at break-even in its own funnel.
- OFF-6145: a "was" price must be genuine.
- COG-6264: India MRP includes all taxes.

What makes this skill ours: each product gets its own ceiling from delivered cost including RTO, not one sitewide guess; the sheet shows the extra units a discount must buy before anyone approves it; slow stock gets a separate cash floor so clearance logic never leaks onto full-price products; and thin products are routed to a gift or bundle instead of being cut out of the promotion.
