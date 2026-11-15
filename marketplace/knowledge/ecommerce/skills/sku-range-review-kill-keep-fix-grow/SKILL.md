---
name: sku-range-review-kill-keep-fix-grow
description: "One range review sheet with a row per SKU: net sales, contribution margin after returns and ad cost, demand trend on in-stock days, revenue class, demand steadiness, stock age grade, lifecycle stage, the role the SKU plays in the range, returns and reviews, and a kill, keep, fix or grow call with the reason and the first step. Every kill call shows the units, cash and open purchase orders it leaves behind and the route to turn them back into cash, and every kill is checked for what buyers would lose, so a size, format or entry product that loyal buyers rely on is not cut by accident. Ends with the cash freed, the margin gained and a one-in, one-out rule for future launches. Use each quarter, before a buying round, or when the catalogue has grown and nobody knows which products earn their place."
---

# Range review: kill, keep, fix or grow

**You get:** one sheet with a row per SKU and a kill, keep, fix or grow call for each, a kill ledger that shows the stock, cash and purchase orders behind every kill and how to recover them, and a one-screen summary of the cash freed, the margin gained per month and the rules for what the range adds next.

## When to use

- Each quarter, before the next buying round or open-to-buy plan.
- The catalogue has grown past what the team can watch (practitioner default: more than 30 active SKUs or more than 3 categories; test it).
- New launches keep adding stock while total sales stay flat.
- Cash is tight and the balance sheet holds more stock than the sales plan needs.
- Before a new season lands, so old lines retire as new ones arrive.

## Not for

- A quick push or pause call before this month's ad budget: use `rank-products-to-push-or-cut`.
- Building per-SKU profit from scratch: run `build-sku-profit-sheet` first; this skill reads its output.
- Running the clearance itself: hand the kill ledger to `clear-slow-moving-stock`.
- Choosing what to add next: use `plan-product-line-extension`.
- Deciding sizes and colours inside one product: use `size-grading-and-variant-plan`.
- Forecasting next quarter's units: use `forecast-demand-per-sku`.

## What you need

Required:

1. **Order export, last 12 months:** Shopify (Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Refunded Amount) and the same fields from each marketplace the store sells on.
2. **Per-SKU profit sheet** from `build-sku-profit-sheet`: landed cost, outbound delivery, pick and pack, payment and marketplace fees, return and failed delivery cost.
3. **Stock per SKU:** on hand, on order (purchase order date, units, and whether it can still be cancelled), and stockout dates or an inventory history.
4. **Returns by SKU with reasons** (Shopify records a reason per returned line item [COG-6323]) and **reviews** (count, average, and the last 90 days).
5. **Ad spend by product** where products are advertised on their own.

Optional: repeat purchase by first product from `cohort-repeat-and-ltv-analysis`; basket pairs; product views; launch dates; supplier minimum order and lead time per SKU; the brand's core job statement and personas from the org context.

Access: read only (level 1). The sheet is a draft (level 2). Pausing ads, cancelling purchase orders, marking down, unpublishing products or changing collections waits for the owner's yes.

## Before you start: the gates

1. **Costs are in the reports.** Pass: every variant had a cost per item when it sold. Shopify leaves variants with no cost out of its profit report and uses the cost that was on file at the time of sale [MEA-6402]. Fail: fill costs from landed cost per purchase order, or mark the row "profit unknown". A row with unknown profit can be fixed or held, never killed.
2. **Delivered profit.** Pass: contribution includes outbound shipping, fees, pick and pack and the return allowance [MEA-0037]. Product margin alone can read 70% when true margin is about a third of that [MEA-0023].
3. **In-stock days known.** Pass: demand is units per in-stock day [OPS-0014]. A SKU marked in stock with long runs of zero sales may be phantom stock, so count it before calling it dead [OPS-6633].
4. **One period, one money basis.** The whole sheet uses the same 12 months and the same currency, with tax kept out of sales.
5. **The goal is named.** The owner picks the unit every call is ranked in: cash freed, contribution margin per month, or both. Write it at the top of the sheet.

## Steps

### 1. Build one row per SKU

Group variants under their product unless one behaves differently (one size returns twice as often, one colour never sells); then give it its own row. Put SKUs launched in the last 90 days, or that have not seen a full selling season, on a separate "too new" list with a launch read only: what share of units went to the email list and past buyers, and what share to new buyers. Many launches sell their first 30 to 40% of stock to fans and then stall [COG-6286].

### 2. Work out the numbers

For each row:

- **Net sales** = gross sales minus discounts and refunds.
- **Contribution margin after returns** = net sales minus landed cost of units kept, outbound delivery, pick and pack, payment and marketplace fees, return cost (return postage, handling, units written off) and ad spend on that SKU. Show it per unit and per month.
- **Return rate** by units. High returns also raise the real cost of winning a buyer, because returned buyers who never come back still cost the ad money [MEA-6383].
- **Demand trend** = units per in-stock day in the last 90 days divided by the 90 days before; for seasonal goods, compare with the same 90 days last year.
- **Revenue class (A, B, C):** A is the top 80% of revenue, B the next 15%, C the last 5%. Shopify's own grading uses only the last 28 days and ignores cost [COG-6285], so rank on 12 months, then add a second rank on contribution.
- **Steadiness (X, Y, Z):** coefficient of variation of monthly units over 12 months; X under 10%, Y 10 to 25%, Z over 25%. Move the bands to natural breaks if nearly nothing lands in X [MEA-6398].
- **Stock age grade:** units on hand divided by units per in-stock day. A sells in under 90 days, B in 90 to 180, C in 180 to 365, D in over a year [COG-6290].
- **Cash tied up** = units on hand x landed cost, plus open purchase orders at cost.
- **Repeat pull:** share of buyers whose first order held this SKU and who ordered again within 180 days.
- **Basket role:** share of this SKU's orders that hold another product.
- **Voice of the buyer:** the top return reason and the top review theme, in the buyer's own words.

### 3. Mark the lifecycle stage

| Stage | Sign |
|---|---|
| Launch | Under 90 days or no full season yet |
| Growth | Demand trend above 1.1 for two quarters |
| Mature | Trend between 0.9 and 1.1 |
| Decline | Trend below 0.9 for two quarters running |
| End of life | No sale for 8 weeks or more while in stock, or decline with grade C or D stock |

Bands are practitioner defaults; tune them to the store. A forecast that only updates when a sale happens keeps ordering a dying SKU; silent weeks should pull its demand down [OPS-6650].

### 4. Name the role each SKU plays

Write the store's core job in one sentence from the org context: "When [situation], I want to [job], so I can [outcome]." Then give each SKU one role:

- **Hero:** carries a large share of revenue and new buyers.
- **Entry:** thin first-order profit, but high repeat pull.
- **Companion:** mostly sold with another product; lifts the basket.
- **Range filler:** a size, colour, format or price point that completes the choice for a group of buyers.
- **Second job:** does a different job for a different buyer; it may deserve its own page and name [AVT-0005].
- **Duplicate:** does the same job as another SKU at a similar price.
- **Seasonal:** sells in a known window and sleeps the rest of the year.

Also mark each SKU core job, second job or no clear job. Copying a rival's product with no job behind it is how ranges blur; if the store name on a shopping list could mean several products, the brand is spreading thin [PRD-0007].

### 5. Make the call

| Call | When | First step |
|---|---|---|
| **Grow** | Contribution above the range median, growth or mature stage, returns at or below median, stock grade A or B | Deepen stock in the best sizes, add ad weight, add the next variant or channel |
| **Keep** | Positive contribution, mature, steady (X or Y), no single weakness | Leave the reorder rule as it is |
| **Fix** | One real strength and one clear weakness a single lever can clear | Name the lever and the skill (table below) |
| **Kill** | Contribution negative after a fix was tried, or the fix needed is bigger than the market allows; or decline or end of life with grade C or D stock and sell-through under a third of the median; or a duplicate with lower contribution; or returns over twice the median for a reason the product cannot fix | Stop reorders, then run step 6 and step 7 |

| Strength | Weakness | Lever | Hand off to |
|---|---|---|---|
| Strong demand | Thin or negative contribution | Price, cost, pack size or shipping | `set-prices-from-costs-and-competitors`, `negotiate-moq-and-price` |
| Good contribution | Low view-to-order rate | Product page | `storefront-conversion-audit` |
| Good contribution and demand | High size or fit returns | Fit, guide, grading | `size-grading-and-variant-plan`, `write-size-fit-and-how-to-use-guides` |
| Good contribution and demand | Keeps stocking out | Reorder point | `set-reorder-points-and-safety-stock` |
| Thin first order | High repeat pull | Treat as an entry product | `cohort-repeat-and-ltv-analysis` |

The job test never overrides cash. A SKU with no clear job but contribution above the median and repeat at or above the range average is keep, with its own page and name, not kill. Entry products are judged on 12-month profit per customer, on customers acquired at least 12 months ago [MEA-0048].

### 6. Check what buyers lose before any kill

For each kill, answer four questions:

1. **Is there a substitute?** Name the SKU a buyer would switch to at a similar price. Many shoppers do switch (about 45% recapture across eight retail categories [OPS-6632]), so part of a killed SKU's sales moves to its neighbour.
2. **Is it the only option in a size, format or price point that repeat buyers use?** Cutting redundant low sellers can hold or lift sales, but cutting a whole size or brand shoppers rely on backfires [MEA-6401]. If yes, change the call to fix or keep as a range filler.
3. **Is the cut too wide?** Cutting deep in every category at once cut one online grocer's visits and baskets [MEA-6400]. Kill in waves, one category at a time, and watch repeat rate for 60 days after each wave.
4. **What links to it?** Bundles, sets, ads, collections, email flows, marketplace listings with reviews, and pages with search traffic. A marketplace listing with a long review history can be kept as marketplace-only instead of killed.

### 7. Count what each kill leaves behind

For every kill, fill one ledger row: units on hand, cash at landed cost, open purchase orders (cancel, reduce or take), units inbound, the floor price (the cost to sell one more unit, not what was paid), the route, the expected cash back as a range, the stop-reorder date, the unpublish date and the redirect for its page.

Routes, cheapest first: bundle with a grow SKU, offer to past buyers of that SKU, a marketplace or outlet, its own paid funnel at break-even or a small loss [FIN-0026] [ADC-6283], wholesale or a liquidator, then donation. When slow stock squeezes cash, cutting ad spend can deepen the drop; a short push to clear grade C and D stock can bring cash back [FIN-0027]. Keep straight sitewide discounts for one or two moments a year [OFF-0008]. Hand the ledger to `clear-slow-moving-stock`.

### 8. Add it up and set the rules forward

- Sum the moves in the owner's unit: cash freed, contribution margin per month gained, SKU count before and after, and the share of stock value in grades C and D before and after. Raising sell-through frees cash without changing profit [FIN-0028]. Stock growing much faster than sales ends in write-downs [COG-6289].
- **One in, one out:** every new SKU names the SKU it retires or the gap it fills, and gets a 90-day launch read on sales beyond the list [COG-6286].
- **Launch gate:** a new SKU needs a named job, a named buyer, quoted buyer evidence, and a line on what it makes the old range stop doing.
- **Hero focus:** in categories that win on one hero, keep cash behind the hero before adding flavours [PRD-0011]; a single hero also decays, so watch its trend each quarter [PRD-0003]. Fashion and other assortment-led ranges need breadth instead.

### 9. Market notes

- **Every market:** compute contribution per channel when a SKU sells on Amazon, Walmart, eBay, Etsy, Zalando or bol as well as the store; a SKU can lose money in one channel and earn in another.
- **US and UK fashion:** return rates can run up to double other markets [MEA-6266]; read return cost per market before killing on returns.
- **UK and EU:** keep product records, supplier documents and batch details for a killed SKU after it stops selling, for after-sales questions and recalls; check how long your market's product safety rules require.
- **Marketplaces:** storage fees grow with stock age on many marketplaces; check each fee page before choosing to hold grade D stock there.

## Checks before you hand it over

- Every row has contribution after returns, trend on in-stock days, class, grade, stage, role, a call, a reason in one sentence and a first step.
- No SKU with unknown profit or unknown in-stock days is killed.
- Every kill names its substitute, or is changed to fix or keep because it is the only option buyers use.
- Every kill has a ledger row with units, cash, open purchase orders, floor price, route and dates.
- Kills are planned in waves, with the repeat rate to watch after each.
- Totals are in the owner's chosen unit, on one period and one money basis.
- Nothing is paused, cancelled, marked down or unpublished without the owner's yes.

## Output

**One-screen summary:** SKU count before and after, the five biggest moves, cash freed (range), contribution margin per month gained, share of stock in grades C and D before and after, and the wave plan with dates.

**Range sheet:** SKU, Net sales, Contribution per month, Return rate, Trend, Class (A, B, C and X, Y, Z), Stock grade, Stage, Role, Call, Reason, First step.

**Kill ledger:** SKU, Substitute, Units on hand, Cash at cost, Open purchase orders, Floor price, Route, Cash back (range), Stop-reorder date, Unpublish date, Redirect.

**Rules forward:** the one-in, one-out rule, the launch gate and the date of the next review.

## Common mistakes

- **Killing on revenue rank.** Step 2 ranks on contribution after returns as well as revenue.
- **Calling a stocked-out SKU weak.** Gate 3 reads demand on in-stock days.
- **Cutting the only size loyal buyers use.** Step 6 checks substitutes and range fillers.
- **Cutting everything at once.** Step 6 kills in waves and watches repeat.
- **Killing an entry product on first-order profit.** Step 5 uses 12-month profit per customer.
- **Forgetting the stock behind a kill.** Step 7 fills a ledger row for every kill.
- **Adding launches with nothing retired.** Step 8 sets one in, one out.

## Sources

- COG-6323: return reasons per line item in Shopify.
- MEA-6402: Shopify profit reports need a cost per item at the time of sale.
- MEA-0037, MEA-0023: delivered margin, not product margin.
- OPS-0014: demand on in-stock days.
- OPS-6633: phantom stock behind zero sales.
- COG-6286: launches sell to fans first, then stall; retire as you add.
- MEA-6383: returns raise the real cost of winning a buyer.
- COG-6285: Shopify's ABC grading uses 28 days and ignores cost.
- MEA-6398: XYZ steadiness bands.
- COG-6290: stock age grades A to D.
- OPS-6650: dying SKUs keep old forecasts.
- AVT-0005: second jobs can become their own SKUs.
- PRD-0007: the shopping-list test for a diluting range.
- MEA-0048: rank entry products on 12-month profit per customer.
- OPS-6632: shoppers switch to substitutes when an item is gone.
- MEA-6401: cut redundant low sellers, not a size or brand buyers rely on.
- MEA-6400: blanket cuts lose visits and baskets.
- FIN-0026, FIN-0027, ADC-6283: clear grade C and D stock through its own funnel.
- OFF-0008: keep sitewide discounts rare.
- FIN-0028: sell-through frees cash.
- COG-6289: stock growing faster than sales ends in write-downs.
- PRD-0011, PRD-0003: hero focus, and heroes decay.
- MEA-6266: higher fashion returns in the US and UK.

What makes this skill ours: contribution is counted after returns and ad cost on in-stock days, so a stocked-out winner is never killed; every kill is checked for the buyers it would strand and planned in waves; every kill carries a ledger of the stock, cash and purchase orders behind it; and the review ends in a one-in, one-out rule so the range does not grow back.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Count RTO cost per SKU in contribution, since a SKU that sells well on COD can lose money once refused parcels are in. Read contribution separately for Amazon.in, Flipkart, Myntra or Nykaa, because fees and return rates differ by marketplace.
