---
name: rank-products-to-push-or-cut
description: "A ranked list of every product in the store sorted into push, fix or cut, each with its delivered profit, demand, stock cover, cash tied up and a one-line reason. Uses profit per unit after all delivery costs, demand measured only on days the product was in stock, sell-through, return rate and whether the product brings buyers back, so a cheap entry product is not cut for a thin first order. Each push names how hard to push given stock and lead time, each fix names the one lever and the skill that pulls it, and each cut gets a stop-reorder decision and a cash-recovery route. Use before a reorder, a budget change, a homepage or ad refresh, or when cash is tied up in stock."
---

# Products to push, fix or cut

**You get:** one sheet listing every active product as push, fix or cut, with its numbers and a one-line reason, plus a one-screen summary of the 5 biggest moves and the cash they free or earn.

## When to use

- Before placing the next stock order or setting next month's ad budget.
- Cash is tight and too much of it sits in stock.
- Ads, the homepage and emails keep featuring the same products by habit.
- The catalogue grew and nobody knows which products earn their place.
- After a price or cost change, to see which products moved category.

## Not for

- Building per-product profit from scratch: run `build-sku-profit-sheet` first; this skill ranks its output.
- Clearing the stock of products marked cut: hand off to `clear-slow-moving-stock`.
- Forecasting next quarter's units per product: use `forecast-demand-per-sku`.
- Deciding page and collection order: `merchandise-homepage-and-collections` uses this ranking.

## What you need

Required (read access, level 1):

1. **Per-SKU profit sheet** from `build-sku-profit-sheet`: price, discounts, landed cost, shipping, payment fees, returns and RTO cost per unit.
2. **Shopify order export**, last 180 days: Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Refunded Amount, Payment Method.
3. **Stock levels** per SKU on hand and on order, with expected arrival dates, and a stock history or stockout dates (Shopify inventory history, warehouse report or a manual log).
4. **Supplier lead time** and minimum order per SKU.
5. **Product views** per SKU: Shopify product analytics or GA4 item views, same window.

Optional: ad spend and purchases by product (Meta or Google product-level reports), repeat purchase by first product from `cohort-repeat-and-ltv-analysis`, return reasons.

If stock history is missing, ask the client to mark stockout weeks by hand; without it, label demand "may be understated". This skill changes nothing in the store. Pausing ads, changing collections or cancelling a purchase order needs the client's yes.

## Before you start: the gates

1. **Delivered profit per unit.** Pass when it includes outbound shipping, fees, packing and the return and RTO allowance [MEA-0037]. A product showing 70% product margin can earn far less after those lines [MEA-0023]. Fail: stop and run `build-sku-profit-sheet`.
2. **Demand on in-stock days.** Pass when sales are divided by days in stock, not calendar days [OPS-0014]. Fail: mark the product "demand unknown" rather than ranking it low.
3. **Cash and lead time known.** The push list must fit the cash available for reorders and the supplier lead time. If the owner has no cash figure, run `build-13-week-cash-forecast` or cap pushes at stock on hand.

## Steps

### 1. Build one row per product

Group variants under the product unless one variant behaves differently (one size returns twice as often, one colour never sells); then give it its own row. Drop products launched in the last 30 days into a separate "too new" list.

### 2. Compute the numbers for each row

- **Delivered profit per unit** after ads: profit per unit minus ad cost per unit if the product is advertised on its own.
- **Profit per month** = units per in-stock day x 30 x delivered profit per unit.
- **Demand trend** = units per in-stock day in the last 30 days / the 60 days before.
- **Days of cover** = units on hand / units per in-stock day.
- **Cash tied up** = units on hand x landed cost.
- **Profit per unit of cash tied up** = profit per month / cash tied up. This shows which products earn the most for the money sitting in the warehouse.
- **30-day sell-through** = units sold in 30 days / (units on hand at start + units received). Raising sell-through frees cash without changing profit [FIN-0028].
- **View-to-order rate** = orders / product views.
- **Return rate** by units.
- **Repeat pull**: share of buyers whose first order included this product and who bought again within 180 days.

### 3. Set the store's own lines

Work out the store median for view-to-order rate, return rate and sell-through. Lines are relative to the store, not to an outside benchmark, because categories differ so much.

### 4. Sort each product

**Push** when all are true:

- delivered profit per unit after ad cost is positive;
- demand trend is flat or rising (0.9 or above);
- return rate is at or below the store median, or under 1.5 times it with a known, fixable cause;
- there is enough stock, or the store can afford to reorder in time.

**Fix** when the product has a real strength and one clear weakness:

| Strength | Weakness | Lever | Hand off to |
|---|---|---|---|
| Strong demand | Thin or negative profit | Price, cost or shipping | `set-prices-from-costs-and-competitors`, `negotiate-moq-and-price` |
| Good profit | Low view-to-order rate | Product page | `storefront-conversion-audit` |
| Good profit and demand | High returns | Fit, photos, description | `write-size-fit-and-how-to-use-guides` |
| Good profit and demand | Keeps stocking out | Reorder point | `set-reorder-points-and-safety-stock` |
| Low first-order profit | High repeat pull | Use as an entry product | `cohort-repeat-and-ltv-analysis` |

**Cut** when one of these holds and no single fix clears it:

- delivered profit per unit is negative and the price or cost fix needed is larger than the market allows;
- sell-through is below a third of the store median for 90 days, demand trend is falling, and cash tied up is above the store median;
- return rate is above twice the store median for a reason the store cannot fix (the product itself disappoints).

Cut means stop reordering and recover the cash. It does not mean throw the stock away.

### 5. Do not cut entry products on first-order profit

Rank by profit over a year per customer, measured on customers acquired at least 12 months ago, not on first-order profit alone [MEA-0048]. A product that breaks even on the first order but brings buyers back for higher-margin products belongs in fix (entry role), not cut. If repeat data is missing, mark "repeat unknown" and hold the cut decision for those products.

### 6. Set how hard to push

Push intensity follows stock and lead time:

- **Days of cover above lead time plus safety stock:** push fully.
- **Days of cover below supplier lead time:** raise that product's ROAS target or pause its ads until stock is ordered, so ads do not sell out the last units and stall the account [ADC-0023].
- **Lead time:** use the full door-to-door time, which for sea freight from China can be 50 to 70 days [COG-0008].

### 7. Plan the cash from cuts

For each cut product, give a floor price no lower than what the stock is worth through the next best route (bundle, marketplace, wholesale, liquidation). Slow stock can be pushed through its own paid funnel at break-even or a small loss to turn it into cash, rather than being starved by profit-ranked campaigns [FIN-0026]. When stock is squeezing cash, cutting ad spend can make the drop worse; spending a little more to clear the slow stock can bring cash back [FIN-0027]. Hand the plan to `clear-slow-moving-stock`. Keep straight sitewide discounts for rare moments; clear cuts with targeted offers [OFF-0008].

### 8. Write the reason

Each row gets one plain sentence a merchandiser can act on: "Push: earns 4.10 a unit after ads, demand up 20%, 85 days of cover against a 60-day lead time." No row leaves the sheet without a reason.

### India and US notes

- **India:** include RTO cost in delivered profit; a product that sells well on COD can still lose money per order shipped (`returns-and-rto-cost-analysis`). Check marketplace fees per channel if the product also sells on Amazon or Flipkart.
- **US:** check if the product sells on Amazon too; push decisions on site ads can show up there.

## Checks before you hand it over

- Every active product is in exactly one of push, fix, cut or too new.
- Delivered profit includes shipping, fees, packing and return and RTO allowance.
- Demand uses in-stock days; products with unknown stock history are marked.
- No entry product with high repeat pull is in cut.
- Every push product has days of cover compared with lead time.
- Every cut product has a floor price and a cash-recovery route.
- Every row has a one-sentence reason with at least one number.
- No ad, collection or purchase order was changed without the client's yes.

## Output

**One-screen summary:** counts in each group; the 5 biggest moves (which products, what to do, profit or cash at stake per month); total cash tied up in cut products and the expected recovery; one runner-up decision in one line; and a short "To confirm" list.

**Ranking sheet:**

| Product | Group | Delivered profit per unit | Units per in-stock day | Trend | Profit per month | Days of cover | Lead time | Cash tied up | Profit per cash tied up | Sell-through 30d | View-to-order | Return rate | Repeat pull | Lever or route | Hand off to | Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Push intensity list:** Product, Days of cover, Lead time, Ad stance (full, hold, raise target, pause), Reorder needed by (date).

**Cut list:** Product, Units on hand, Cash tied up, Floor price, Route (bundle, own funnel, marketplace, wholesale, liquidation), Stop reorder (yes), Owner.

## Common mistakes

- **Ranking by revenue or ROAS.** A best-seller can lose money per unit once shipping and returns are in. Gate 1 requires delivered profit.
- **Calling a stocked-out product weak.** Calendar-day demand understates it [OPS-0014]. Step 2 uses in-stock days.
- **Cutting the entry product.** It may be what brings buyers back [MEA-0048]. Step 5 checks repeat pull.
- **Pushing what is about to run out.** Step 6 compares cover with lead time [ADC-0023].
- **Treating cut as write-off.** Step 7 turns cut stock into cash [FIN-0026].
- **Using outside benchmarks.** Step 3 uses the store's own medians.

## Sources

- MEA-0037: gross margin uses delivered cost.
- MEA-0023: product margin overstates true margin.
- OPS-0014: forecast demand from in-stock days only.
- FIN-0028: sell-through frees cash without changing profit.
- MEA-0048: rank by 12-month gross profit per customer.
- ADC-0023: raise target or pause ads when cover falls below lead time.
- COG-0008: production plus sea freight lead times.
- FIN-0026: push slow stock through its own funnel at break-even.
- FIN-0027: cutting media can deepen a cash squeeze from unsold stock.
- OFF-0008: keep sitewide discounts rare.

What makes this skill ours: every product is ranked on profit per unit of cash tied up, not revenue; demand is measured only on in-stock days; entry products that bring buyers back are protected from cuts; and every push is paced against the supplier's real lead time.
