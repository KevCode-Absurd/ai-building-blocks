---
name: clear-slow-moving-stock
description: "A clearance plan for every slow product: the floor price below which a sale loses cash, the route to sell it (fix the page, bundle, gift, past-buyer offer, a separate ad funnel, marketplaces, stockists, liquidators or donation), the markdown steps by date and the cash each route brings back. Treats the purchase cost as already spent, so the floor comes from the cost to sell one more unit, and protects full-price products and the brand. Use when cash is tied up in stock, storage fees are rising, a season or expiry date is close, or the warehouse needs room for new stock."
---

# Clear slow-moving stock

**You get:** a clearance sheet with a row per slow product (stock, days of cover, floor price, chosen route, markdown steps with dates, expected units and cash back), a one-screen summary of the cash this plan frees in 30, 60 and 90 days, and the draft set-up list for the client to approve.

## When to use

- Cash is short and a large share of it sits in stock that has not moved in months.
- 3PL storage fees or warehouse space are a growing problem.
- A season, style, model year or expiry date is close.
- A new collection is landing and the old one must make room.
- The reorder sheet shows products with far more days of cover than their target.

## Not for

- Planning stock so this does not happen again: use `set-reorder-points-and-safety-stock` and `forecast-demand-per-sku`.
- Deciding whether a product stays in the range at all: use `rank-products-to-push-or-cut`.
- The store's yearly sale calendar: use `plan-yearly-sale-calendar`.
- A discount depth for full-price products: use `how-deep-can-we-discount`.

## What you need

Required (read access, level 1):

1. **Stock per SKU** with on hand, received date (or age bucket) and unit landed cost. Shopify's month-end inventory value needs cost per item filled in [COG-6285].
2. **Shopify order export**, last 180 days: Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount.
3. **Variable cost to sell one unit**: payment fee, outbound shipping, pick and pack, packaging, return or failed-delivery allowance, marketplace commission where used.
4. **Storage cost per unit per month** from the 3PL invoice, or the owner's estimate of space cost.
5. **The cash need**: how much, by when.

Optional: expiry or best-before dates, any liquidator or jobber quotes, marketplace seller accounts, stockist contacts, and the margin per product from `build-sku-profit-sheet`.

Price changes, discount codes, new listings and ad funnels are built as drafts (level 2). Nothing goes live and no liquidator deal is agreed without the client's yes.

## Before you start: the gates

1. **Delivered cost per unit.** Pass when each product has a variable cost to sell one more unit. Fail: build it from the 3PL and courier invoices first; the floor price depends on it.
2. **Cash need named.** Pass when the owner says how much cash, by when. Fail: plan for the 90-day default and say so.
3. **Capacity.** Pass when someone can list on new channels, pack bundles and answer more orders. Fail: drop routes that need work nobody has.
4. **Legal checks.** Pass when expiry-dated items are well inside date and any "was" price is one the store really charged. Fail: never sell past expiry; show a plain sale price instead of a made-up comparison.

## Steps

### 1. Find the slow stock

For each SKU: days of cover = on hand / in-stock daily sales over the last 90 days. Shopify's sell-through and days-remaining reports help as a first pass [COG-6285].

Flag a product as slow when any of these is true (practitioner defaults, test them):

- days of cover above 180, or above three times its target cover;
- under 20% sold in the last 90 days;
- age over 120 days for seasonal or fashion items, or under 90 days of shelf life left;
- zero sales in 30 days with stock above one case.

Grade the flagged products C or D by how stuck they are: C sells slowly, D barely sells. Sort by cash tied up (units x landed cost), biggest first.

### 2. Check the cause before you discount

For each of the top 10 by cash: is the product page live, in navigation and in the feed? Are the photos, size chart and reviews there? Is the price out of line with near rivals? Did ads ever run on it? A product nobody can find is a merchandising fix, not a clearance case. Hand page fixes to `diagnose-low-add-to-cart-products` and give it 2 to 3 weeks before marking it down.

### 3. Set the floor price

The landed cost is already spent; it does not change whether one more sale helps. The floor is the price at which one more sale adds zero cash:

Floor = payment fee + outbound shipping + pick and pack + packaging + expected return or failed-delivery cost + marketplace commission + ad cost per unit sold on that route.

Then compare with two more lines:

- **Liquidation value:** the best quote per unit from a jobber or liquidator, minus freight to them.
- **Holding cost:** storage per month x months to sell at a higher price, plus any decay (season ends, expiry nears, style dates).

Rule: never sell below the floor on any route. If liquidation pays more than a route's net, liquidate. If the holding cost over the selling time exceeds the price gap between a fast route and a slow one, take the fast route. Put the accounting effect (a stock write-down or loss on sale) to the client's accountant; landed cost sits in cost of goods, while outbound shipping and fees sit below gross profit [FIN-0007].

### 4. Pick the route for each product

Work down this ladder and stop at the first route that clears the units in time above the floor:

1. **Bundle with a winner.** Add the slow item to a best seller as a value pack, or as a gift with purchase above a threshold. A gift pays when it lifts order value or cuts cost per new customer by more than its cost, and listing it for sale gives it a real value [OFF-0007].
2. **Past-buyer offer.** Email or WhatsApp to buyers of related products. Keep it to segments, not the whole list; customers trained on deep discounts can be worth less later [CXP-0016].
3. **A separate ad funnel.** An unlisted page with the clearance offer, existing customers excluded, run at break-even or a small loss to turn stock into cash [FIN-0013] [FIN-0026]. When stock squeezes cash, briefly raising marketing to clear it can restore cash faster than cutting spend [FIN-0027]. Give it its own budget cap and a stop date.
4. **Other channels.** Marketplaces (Amazon, eBay, Walmart, Etsy or the store's local marketplaces such as Zalando or bol, plus off-price and outlet sites), an outlet collection on the store, stockists, corporate gifting, pop-ups. Count commission, listing work and return rates in the floor.
5. **Sitewide sale.** Only inside the store's one or two sitewide events a year [OFF-0008]; aged stock is a fair reason to include a product [ADC-0023].
6. **Liquidator or jobber.** Fastest cash, lowest price; ask for a written quote, pickup date and a promise not to resell under the brand name where that matters.
7. **Donate or recycle.** Last. Tax treatment of donated or destroyed stock (deductions in the US, VAT on goods given away in the UK and EU) needs the accountant's view, and some markets, such as France, limit destroying unsold goods.

Model each discount before use. A 30% cut can triple the return on ad spend needed to break even [OFF-0065], and where unit cost is low, buy-one-get-one can earn far more per order than the same-looking half off [OFF-0066].

### 5. Set markdown steps

For direct-to-buyer routes, plan steps instead of one deep cut:

- Step 1 (weeks 1 to 2): first price, about halfway between full price and the floor.
- Step 2 (weeks 3 to 4): lower, if sell-through is below the week's target.
- Step 3 (weeks 5 to 6): at or near the floor, or move the rest to a liquidator.

Write each step's target units. If a step hits its target early, hold the price.

Tax and pricing notes: sales tax or VAT is charged on the price actually charged; a sale to a jobber or liquidator needs a proper tax invoice. Where the store offers pay on delivery, keep it off deep-clearance items where a failed delivery would wipe the margin. A "was" price must be one the store genuinely charged (US, UK and EU rules all expect this, and the EU expects the lowest price of the last 30 days); otherwise show "Clearance" and the price alone.

### 6. Protect the brand and full-price sales

- Keep clearance off the homepage hero and out of full-price ad sets.
- Do not discount current best sellers to move slow ones.
- Exclude recent full-price buyers from clearance messages for 30 days, as a practitioner default.
- Use "final sale" only where local law allows; list it plainly on the product page.

### 7. Count the cash

For each product and route: expected units x (price minus variable cost) by week. Sum by 30, 60 and 90 days. Faster stock turns can lift cash a lot with no change in profit [FIN-0028]. Compare the total with the owner's cash need; if short, move more D items to liquidation.

## Checks before you hand it over

- Every slow product has a floor price built from variable costs, not landed cost.
- No route or markdown step goes below its floor.
- Each top-10 product had its page and listing checked before any discount.
- Every discount has its break-even line.
- The ad funnel has a budget cap, a stop date and existing customers excluded.
- Expiry-dated items are inside date; every "was" price is genuine.
- Cash back by 30, 60 and 90 days is totalled against the owner's need.
- Nothing is live and no liquidator is agreed without the client's yes.

## Output

1. **One-screen summary:** cash tied up in slow stock now, cash back by 30, 60 and 90 days, the 5 biggest products and their routes, and what goes to liquidation.
2. **Clearance sheet**, one row per SKU:

| Column | What goes in it |
|---|---|
| SKU, Product, Grade (C or D) | |
| On hand, Days of cover, Age | |
| Cash tied up | Units x landed cost |
| Cause check | Page, nav, feed, price, ads: pass or fix |
| Variable cost per unit | Itemised |
| Floor price | |
| Liquidation value per unit | Quote and date |
| Route | From the ladder |
| Step 1, 2, 3 price and dates | |
| Target units per step | |
| Expected cash 30, 60, 90 days | |

3. **Set-up list for approval:** price changes, codes, bundles, unlisted page, ad funnel with cap and stop date, channel listings, liquidator quote requests.
4. **Weekly tracker:** SKU, week, units sold, price, cash back, step, next action.

## Common mistakes

- **Floor price from landed cost.** Step 3 uses the cost to sell one more unit; the purchase is sunk.
- **Discounting a product nobody can find.** Step 2 checks the page and listing first.
- **One deep cut on day one.** Step 5 steps down only when sell-through misses.
- **Clearance leaking into full-price ads and the homepage.** Step 6 keeps it apart.
- **Holding stock to avoid booking a loss.** Step 3 weighs holding cost and liquidation value.
- **Clearing a product that is only out of season for six weeks.** Step 1 uses age and the season, not just sales.

## Sources

- FIN-0013, FIN-0026: separate paid funnel at break-even for C and D stock.
- FIN-0027: raise marketing briefly to clear stock and restore cash.
- FIN-0028: faster sell-through lifts cash with no change in profit.
- FIN-0007: what sits in cost of goods.
- OFF-0007: gift with purchase listed for sale.
- OFF-0008: one or two sitewide sales a year, on slow stock.
- OFF-0065, OFF-0066: discount break-even; buy-one-get-one versus half off.
- ADC-0023: discount aged stock.
- CXP-0016: deep-discount customers can be worth less.
- COG-6285: Shopify sell-through, days-remaining and inventory value definitions.

What makes this skill ours: the floor price treats purchase cost as sunk and comes from the cost to sell one more unit by route; the cause check stops discounting products that were only hidden; routes run in a ladder from brand-safe to liquidation with cash counted at 30, 60 and 90 days; and tax invoice, failed-delivery and "was" price rules are built into the markdown steps.

## Selling in India

- Indian clearance channels include Amazon.in, Flipkart and Meesho.
- GST is charged on the price actually charged; a jobber sale needs a proper GST tax invoice.
- Keep COD off deep-clearance items where RTO would wipe the margin.
- Indian CSR or GST treatment of donated stock needs the accountant's view.
