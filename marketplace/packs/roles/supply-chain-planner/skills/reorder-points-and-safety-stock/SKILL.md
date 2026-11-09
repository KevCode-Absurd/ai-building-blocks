---
name: reorder-points-and-safety-stock
description: Works out safety stock, reorder points and order quantities for each product from forecast use, measured supplier lead times and their spread, and a service level the client chooses - using the textbook safety stock formula with demand and lead-time variance, z from NORM.S.INV, an EOQ check against supplier minimums and case packs, and the newsvendor critical ratio for one-time seasonal buys. Ends with a reorder table, a buy list with order-by dates and the cash each order needs by week against the owner's floor, plus slow stock with the cash tied up. Use it for a reorder plan, a weekly stock check, a seasonal buy or a review of reorder settings in Shopify, Odoo or Business Central.
---

# Reorder points and safety stock

## When to use

- "What should I reorder, how many and when?"
- Setting or checking reorder points, min/max levels or safety stock in a stock tool.
- A one-time seasonal buy that must be ordered months ahead.
- Cash is tight and the owner needs to see what each order costs and when.
- Slow stock is piling up and the owner wants to know how much cash it holds.

## What you need

1. **Demand per product:** average per day or week and its spread, ideally from the `demand-forecast-by-product` skill (error standard deviation), otherwise from sales history.
2. **Lead times from order history:** order date and receipt date for past purchase orders, by supplier. If there is no history, the supplier's quote, marked as unmeasured.
3. **Stock on hand and on order** today.
4. **Supplier terms:** minimum order quantity, case pack or order multiple, price breaks, payment terms (deposit, balance, days).
5. **Costs:** unit cost; the client's estimate of the cost to place one order and to hold one unit for a year, if they want an EOQ check.
6. **The service level per product group, chosen by the client,** and whether it means cycles without a stockout or units served from stock.
7. **Cash:** today's balance, expected inflows by week and the floor it must not drop below.
8. **Access:** level 1 to read. Changing reorder settings in a copy or drafting purchase orders is level 2. Updating live reorder points or placing purchase orders is level 3, within the limits you set (see the `purchase-orders-and-supplier-lead-times` skill).

## Steps

### 1. Measure lead times

For each supplier, list order-to-receipt days from past purchase orders. Report the average, the standard deviation and the latest receipts. Flag suppliers with fewer than a handful of orders as "unmeasured" and use their quote with a wider buffer, stated as a choice.

### 2. Choose the service level with the client

Offer two or three levels per product group and show the stock and cash each needs. Best sellers usually justify more cover than slow, costly or short-life items, but the client decides. Convert the chosen probability to z with `=NORM.S.INV(p)`.

### 3. Work out safety stock

Use the textbook formula (credited in `knowledge.md`), with demand and lead time in the same units (days or weeks):

`SS = z × √(average lead time × demand variance per period + average demand² × lead-time variance)`

If lead time is steady, it reduces to `z × demand standard deviation × √lead time`. Show both when lead times vary; the gap tells the owner how much a late supplier is costing them in stock.

For lumpy products, the formula assumes smooth, roughly normal demand. Check it against history: would this safety stock have covered the worst lead-time windows of the last year? If not, say so and set it from those windows instead.

### 4. Set the reorder point

`Reorder point = average demand × average lead time + safety stock`

If the stock is checked weekly rather than every day, add demand for the review gap, because an order can only be placed when someone looks.

### 5. Size the order

- Start from need: cover until the next order could arrive, plus safety stock, minus stock on hand and on order.
- EOQ check, if the client gave order and holding costs: `√(2 × yearly demand × cost per order ÷ yearly holding cost per unit)`.
- Then apply the supplier's rules: cap at any maximum, raise to the minimum, round up to the case pack or multiple.
- If the minimum is far above need, show the extra cash and the months of cover it buys, and the shelf-life risk.

### 6. One-time seasonal buys

For a product sold in one season and cleared after, do not use a reorder point. Use the critical ratio:
- Underage cost = price − unit cost (margin lost per missed sale).
- Overage cost = unit cost − what a leftover unit fetches at clearance.
- Critical ratio = underage ÷ (underage + overage).
- Order quantity = the forecast quantity at that probability; for a normal forecast, `likely + NORM.S.INV(ratio) × forecast standard deviation`.

### 7. Build the buy list and cash plan

For each product to order: supplier, quantity, order-by date (reorder date minus days to confirm), expected arrival, cost, deposit and balance dates. Add the cash leaving each week to the client's cash forecast. If the balance drops under the floor, show options: split delivery, stage the order, a smaller first order to a faster supplier, or move slow lines down the list. Never cut the best sellers first without saying so.

### 8. List slow stock

Products with more than the client's chosen months of cover: units, cost value, last sale date, and one option each (bundle, clear, stop buying, return to supplier if terms allow).

### 9. Update settings (level 2 or 3)

Write the reorder points, min/max or safety stock into a copy of the settings (level 2) or the live tool (level 3, within limits). In Business Central, an item on a reorder-point policy should not also be fed a forecast.

## Checks

- Lead times come from receipts where history exists; quoted ones are marked.
- The service level type (cycle or units) is written next to each target.
- Demand and lead time use the same time unit.
- Safety stock for lumpy products was checked against real history.
- Quantities obey minimums, case packs and multiples.
- Every order has a date, a cost and cash dates; cash stays over the floor or the breach is shown.
- One product is worked through in full.

## Output format

1. **Inputs and choices:** service levels (type and value), lead-time sources, review cycle.
2. **Reorder table:** product, on hand, on order, average daily use, lead time (average, spread), safety stock, reorder point, days of cover, status.
3. **Buy list:** supplier, product, quantity, order-by date, arrival, cost, deposit and balance dates.
4. **Cash by week** against the floor.
5. **Slow stock** with cash tied up and an option each.
6. **One product worked through.**
7. **Limits:** unmeasured suppliers, thin history.

## Example of good output (short)

*Illustrative structure, not a real business: a homeware importer. Inputs are the client's figures. Copy the shape, never the content: every fact comes from the client's own context.*

> **Linen throw.** Average demand 12 a day (standard deviation 5). Lead time from the last nine purchase orders: average 42 days, standard deviation 7. You chose a 95% cycle service level, so z = NORM.S.INV(0.95) = 1.645.
>
> Safety stock = 1.645 × √(42 × 5² + 12² × 7²) = 1.645 × √8,106 = 149 units. If the supplier were always on time it would be 1.645 × 5 × √42 = 54 units. The late deliveries cost you about 95 units of extra stock, roughly $1,710 at $18 each.
>
> Reorder point = 12 × 42 + 149 = 653. You have 700 on hand and none on order: about 4 days until you hit it.
>
> **Order size.** EOQ from your costs ($60 per order, $4.50 a year to hold one) is 342, but the supplier minimum is 500 in cases of 20, so order 500: $9,000, with your 30% deposit ($2,700) at order and the balance before shipping. Cash stays above your $15,000 floor in every week.
