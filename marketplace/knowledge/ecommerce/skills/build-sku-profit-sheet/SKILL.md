---
name: build-sku-profit-sheet
description: "A sheet showing the real profit on each product after discounts, shipping, payment fees, returns and failed deliveries (parcels refused or undelivered, common with pay on delivery), built from the store's own order export and cost data. Each product gets net revenue, landed cost, delivery cost, fees, return and failed-delivery losses, profit per unit sold and per unit kept, and a flag for products that lose money once every cost is in. Use it before ranking products, setting ad targets per product, planning a sale, or when the owner asks which products actually make money."
---

# Profit per product sheet

**You get:** one sheet (Google Sheet or `sku-profit.csv` with live formulas) with a row per product: units, net revenue, every cost line, profit per unit kept and profit share, plus a one-screen summary naming the products that lose money and the three cost lines worth fixing first.

## When to use

- The owner knows store margin but not which products carry it.
- Ad targets, bundles or a sale need a profit figure per product, not a store average.
- Returns or failed deliveries feel high on some products and nobody has priced them.
- A product looks great on "product margin" (price minus factory cost) and the owner wants the real number.

## Not for

- Store-level break-even ROAS and target cost per purchase: use `store-meta-math` (this sheet feeds it).
- Building the landed cost itself (freight, duty, inspection): use `calculate-landed-cost-per-unit` first.
- Deciding which products to push or cut: hand this sheet to `rank-products-to-push-or-cut`.
- Deep work on why returns and failed deliveries happen by postcode or courier: use `returns-and-rto-cost-analysis`.

## What you need

Required, read access (level 1):

1. **Shopify order export**, 90 days or more, ending at least one return window ago: Name, Created at, Financial Status, Cancelled at, Currency, Subtotal, Shipping, Taxes, Discount Amount, Lineitem sku, Lineitem quantity, Lineitem price, Lineitem discount, Refunded Amount, Payment Method, Shipping Province.
2. **Landed cost per SKU**: product, inbound freight, duty, retail box. If missing, run `calculate-landed-cost-per-unit`; if the owner only has factory cost, use it and mark the row "estimate".
3. **Courier or 3PL invoices** for the same window: forward shipping per order (by weight or units), pick and pack fee, cash collection fee if the store offers pay on delivery, return and failed-delivery charges.
4. **Payment fee rates** from the gateway statement: percentage, fixed fee, cash collection or remittance fee.
5. **Returns and failed deliveries by SKU**: refunds from the export; failed deliveries from the courier or shipping app report (order number, status, reason).

Optional: restock or refurbish cost per return, write-off rate for damaged returns, ad spend by product (catalog ads report).

If a cost is missing, ask once. Use a stated estimate only for small lines (under about 5% of revenue) and mark it. Never estimate landed cost silently. This job writes nothing in the store; no client approval is needed until someone changes prices or offers from it.

## Before you start: the gates

1. **Landed cost coverage.** Pass when SKUs making at least 90% of net revenue have a landed cost. Fail: build only those rows and list the rest as "no cost, not ranked". Product margin is not gross margin [MEA-0023].
2. **Mature window.** Pass when the newest order is older than the return window plus delivery time. Fail: shift the window back, or accrue returns at the expected rate [MEA-0028]. Shopify books refunds on the refund date, so a recent window looks better than it is [MEA-0011].
3. **One tax basis.** Revenue and costs both exclude VAT, goods and services tax or US sales tax. If the store is registered and can reclaim the VAT or similar tax it pays on stock, landed cost is before that tax; if it cannot reclaim it, the tax paid on stock is a cost.
4. **Delivered-cost rule.** Gross margin must reach the customer's door: shipping, payment fees and pick and pack all count [MEA-0037]. If the courier invoice is missing, stop: shipping is usually the largest line after product cost.

## Steps

### 1. Clean the orders

Remove test orders, staff orders, cancelled orders and orders with Financial Status "voided". Keep refunded and partly refunded orders; they carry real costs. Split out marketplace and wholesale orders into their own tabs; their fees differ.

### 2. Get net revenue per line

Net revenue per line = Lineitem price x quantity minus Lineitem discount, minus its share of any order-level discount (split by line value). Coupons reduce revenue, not cost [FIN-0009]. Shipping charged to the buyer is revenue: split it across lines by units, then add it [MEA-0010]. Exclude tax.

### 3. Add product cost

Units x landed cost. Landed cost holds everything until the stock is in the warehouse: purchase price, inbound freight, duty and the branded retail box [FIN-0007]. The plain shipping carton is a shipping cost, even on the same supplier invoice [FIN-0008].

### 4. Add delivery cost

From the courier invoice, get cost per order by weight band or units. For single-SKU orders, charge it straight to that SKU. For mixed orders, split by weight if you have it, else by units (practitioner default; state which). Add pick and pack per order the same way, and packaging per order. Say in the summary whether outbound shipping sits above or below gross profit, since books differ [FIN-0017]; this sheet always counts it.

### 5. Add payment fees

Prepaid lines: gateway percentage x line revenue plus a share of the fixed fee. Pay-on-delivery lines: the courier's cash collection fee or remittance percentage. Card fees by plan, plus any wallet, local payment method or buy-now-pay-later fee, which is often higher; cross-border and currency conversion fees where they apply. Use the rate on the statement, not the price page.

### 6. Price returns and failed deliveries per SKU

They are separate lines because they cost different things.

- **Returns** (delivered, then sent back): lost revenue (refunded amount on that line), return shipping, inspection and repack cost, and the share written off as unsellable. Repack labour and materials go into cost of goods; return shipping is an overhead [FIN-0009], but this sheet carries both against the SKU so the product owner sees them. Processing a return can cost 20 to 65% of the item's cost in one vendor's figures [CXP-0018]; use the store's own invoice numbers when you have them.
- **Failed deliveries** (parcel refused or undelivered and sent back, most common with pay on delivery): no revenue, but forward shipping, reverse shipping, the cash collection fee if charged, packaging, and damage on return. Count failed-delivery orders in the units shipped, not in units sold.

Per SKU: return rate = units returned / units delivered; failed-delivery rate = failed-delivery units / units shipped. When fewer than 30 orders exist for a SKU, use its category rate and mark it.

### 7. Work out profit

Per SKU, for the window:

- Gross profit = net revenue minus product cost minus delivery minus fees minus return cost minus failed-delivery cost.
- Profit per unit kept = gross profit / units delivered and kept. This is the number to quote.
- Margin % = gross profit / net revenue.
- Share of store gross profit, and share of units.

If ad spend by product is available, add contribution after ads in a separate column. Never mix fixed costs (rent, salaries, apps) into the per-product rows [MEA-0030].

### 8. Flag and explain

Mark each SKU:

- **Loses money:** gross profit at or below zero.
- **Thin:** margin under the store's target contribution, or under the amount the store needs per order to pay for acquisition. If no target exists, use the gap to the store average and say so.
- **Leak:** one cost line over twice the store average for that line (shipping, returns, failed deliveries or fees).

For each loser, name the line that sinks it and the fix to test: price, bundle, prepaid nudge, packaging, courier, or stop. A slow product can still earn its place by turning stock into cash, even at break-even [FIN-0026]; say when that applies. Price changes go through `set-prices-from-costs-and-competitors`; discounts get their break-even worked in `offer-bundle-threshold-design` [OFF-0065].

### 9. Market notes

- **Pay on delivery:** where the store offers it, show pay-on-delivery and prepaid as two sub-rows for the top 10 SKUs; failed deliveries often decide whether a product works on pay on delivery at all.
- **Marketplaces:** if Amazon, Walmart, Etsy, eBay, Zalando or another marketplace sells the same SKU, its commission and fixed fees go in the marketplace tab, never averaged in.
- **US:** state-level sales tax stays out of revenue. Free-returns policies make return shipping a real cost per SKU; apparel and footwear usually carry the biggest return lines.
- **UK and EU:** VAT stays out of revenue; the 14-day cancellation right raises return rates on fashion, so price returns from the store's real rate.

### 10. Cross-check with a per-order profit view

Build the same window order by order, then compare the two totals. Order profit = order total before refunds, minus tax, minus product cost, minus the carrier cost the store paid, minus payment fees, minus refunds. Four traps this catches:

- **Refunds taken twice:** start from the order total before refunds and take refunds off once. A "current total" field that already has refunds removed must not have them taken off again.
- **Shipping charged is not a cost:** what the buyer paid for shipping is already inside the order total; subtract what the carrier charged the store, from the courier invoice, never the shipping line on the order.
- **Discounts taken twice:** if the order total is already after discounts, do not subtract the discount again.
- **Missing cost is unknown, not zero:** a line with no cost per item makes that order's profit "unknown"; list those SKUs instead of counting their cost as zero, which overstates profit.

Then sort orders by profit and look at the bottom 10%: small single-unit orders to far zones, orders with stacked discounts, or orders with free shipping just under a threshold are common leaks. Where orders are rolled up to products, split each order's carrier cost, tax and fees across its lines by value share and say so. If the order view and the SKU sheet differ by more than 2%, find the cause before handing over.

## Checks before you hand it over

- Gross profit summed across SKUs matches store gross profit for the window within 2%; any gap is explained.
- Every SKU row says whether its landed cost is confirmed or an estimate.
- Revenue and cost are on the same tax basis, stated in the header.
- Return and failed-delivery costs are separate columns and use the store's invoices.
- Failed-delivery units are excluded from units sold and included in units shipped.
- The window is mature, or returns are accrued at a stated rate.
- No fixed costs sit in per-product rows.
- Each money-losing SKU has a named cause and one fix to test.
- The per-order view agrees with the SKU sheet within 2%, with refunds and discounts taken off once and carrier cost, not shipping charged, as the cost.
- SKUs with no cost per item are listed as unknown, not costed at zero.

## Output

**1. One-screen summary**

- Window, currency, tax basis, orders used, SKUs costed (share of revenue covered).
- Store gross profit and margin.
- Products that lose money: name, units, loss, the line that sinks them.
- Top 5 products by share of gross profit.
- Three cost lines to fix first, with the money at stake per month.
- "Estimated": each cost that is an estimate, marked in its cell, with its basis and the profit it moves, one line each.

**2. The sheet** (one row per SKU; pay-on-delivery and prepaid sub-rows where relevant)

| Column | How it is filled |
|---|---|
| SKU, Product, Variant | From the export |
| Units shipped, Units failed delivery, Units returned, Units kept | Export plus courier report |
| Net revenue | Step 2 |
| Landed cost per unit, Product cost | Step 3; "estimate" flag |
| Shipping, Pick and pack, Packaging | Step 4; split rule named |
| Payment fees | Step 5 |
| Return cost, Failed-delivery cost | Step 6 |
| Gross profit, Profit per unit kept, Margin % | Step 7 |
| Share of gross profit, Share of units | Step 7 |
| Ad spend, Contribution after ads | Optional |
| Flag, Sinking line, Fix to test | Step 8 |

**3. Assumptions tab:** every rate used, its source document and date.

**4. Order check tab:** Order, Order total before refunds, Tax, Product cost, Carrier cost, Fees, Refunds, Order profit, Unknown cost (yes or no); with the bottom 10% of orders and the pattern they share.

## Common mistakes

- **Product margin as profit.** Price minus factory cost hides shipping, fees and returns; steps 3 to 6 add them.
- **Average shipping for every SKU.** Heavy or bulky items carry far more; step 4 uses the invoice by weight or units.
- **Failed deliveries lumped into returns.** They cost different things; step 6 splits them.
- **A fresh window.** Returns land late and make recent months look strong; gate 2 waits or accrues.
- **Fixed costs spread per unit.** That makes small products look like losers; step 7 keeps them out.
- **Marketplace and site averaged together.** Different fees, different buyers; step 1 splits them.
- **Subtracting shipping charged instead of carrier cost.** Step 10 uses the courier invoice.
- **Counting a missing cost as zero.** Step 10 marks the order unknown and lists the SKU.

## Sources

- MEA-0023: product margin is not gross margin; a 70% tee margin was 24% fully loaded.
- MEA-0037: gross margin is the delivered cost to the customer's door.
- FIN-0007: cost of goods is everything until the stock is in.
- FIN-0008: retail box is cost of goods; shipping carton is shipping.
- FIN-0009: return shipping is overhead; repack cost is cost of goods; coupons reduce revenue.
- FIN-0017: state where outbound shipping sits in the P&L.
- MEA-0010: Shopify net sales plus shipping charges is cash collected.
- MEA-0011: Shopify books returns on the refund date.
- MEA-0028: accrue returns at the expected rate, reconcile monthly.
- MEA-0030: keep fixed costs out of contribution tracking.
- CXP-0018: processing a return can cost 20 to 65% of item cost.
- FIN-0026: slow stock can be pushed at break-even to free cash.
- OFF-0065: deep discounts move break-even sharply.
- Library item: Store profit margin calculator (adapted from shopify-admin-profit-margin-calculator by 40rty AI, MIT, https://github.com/40rty-ai/shopify-admin-skills/tree/main/skills/finance/shopify-admin-profit-margin-calculator), used for the per-order cross-check and its four traps in step 10.

What makes this skill ours: failed deliveries are costed as their own loss line with units shipped but never sold; pay-on-delivery and prepaid split per top SKU where the store offers both; refunds are matured or accrued before any product is judged; and every row carries a confirmed or estimate flag, so no product is ranked on a guessed cost.

## Selling in India

- Failed deliveries are called RTO (return to origin), mostly on COD orders. Show COD and prepaid as two sub-rows for the top 10 SKUs; hand pincode work to `cut-rto-on-cod-orders`.
- If the store claims input tax credit, landed cost is ex-GST; if not, GST paid on stock is a cost.
