---
name: forecast-demand-per-sku
description: "A week-by-week unit forecast for every product for the next 13 weeks, with a low, base and high line, built from in-stock sales, last year's seasons, planned promotions, launches and ad plans, and a tracker that scores the forecast against real sales each week. Feeds reorder points, purchase orders, cash plans and 3PL staffing. Use before a buying cycle, before a peak season or big sale, when stock keeps running out or piling up, or when the owner asks how many of each product will sell next quarter."
---

# Demand forecast per product

**You get:** a 13-week unit forecast per product or variant (low, base and high) in one sheet, with the seasonal index, promotion lift and launch assumptions written beside each line, a one-screen summary of the top movers and risks, and a weekly accuracy tracker.

## When to use

- A buying cycle is due and purchase orders need unit numbers per SKU.
- Peak season (Black Friday to Christmas, Mother's Day, wedding season, Lunar New Year, Ramadan and Eid, or the store's local festivals) is within four months.
- A sale, launch or ad push is planned and stock must match it.
- The store keeps running out of some products while others pile up.
- A 3PL or warehouse needs a volume forecast for staffing.

## Not for

- Store-wide revenue for next month: use `forecast-next-month-revenue`.
- Turning the forecast into reorder points and order quantities: use `set-reorder-points-and-safety-stock`.
- Testing demand for a product the store has never sold: use `validate-demand-before-buying-stock`.
- Choosing sale dates and depths for the year: use `plan-yearly-sale-calendar`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, at least 12 months (24 if the store has them): Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Code, Discount Amount, Cancelled at. Remove test, staff and cancelled orders. Use order date units; do not net off returns here, because Shopify books returns on the refund date [MEA-0011].
2. **Stockout dates per SKU** from the inventory history or the owner.
3. **The promotion and launch plan** for the next 13 weeks: dates, depth, products, channels.
4. **Planned ad spend by week**, with any big change from the last quarter.

Optional: past promotion dates with depth, marketplace sales per SKU, wholesale or stockist orders already booked, a cohort table from `cohort-repeat-and-ltv-analysis`.

If there are fewer than 12 months of history, say so in the first line and use the method for young stores in step 4.

## Before you start: the gates

1. **Gross profit per unit known.** Pass when `build-sku-profit-sheet` exists or costs are given. Fail: forecast anyway, but stop before ranking which products get stock or ad support; units without profit cannot set priorities.
2. **Clean history.** Pass when stockout days are known. Fail: retain zero-sales weeks in observed sales, flag suspected stockouts separately, and show a demand sensitivity range until dated inventory evidence distinguishes censoring from true zero demand. Never delete a zero-sales week solely because demand was expected. A month half out of stock halves the apparent demand [OPS-0014].
3. **Capacity.** Pass when the high line can be packed and shipped with the current team or 3PL. Fail: note the week where the high line breaks capacity and send it to `choose-3pl-or-self-fulfil`.
4. **Plan is fixed.** Pass when promotion dates are agreed. Fail: forecast without promotions and add them as a separate scenario.

## Steps

### 1. Set up weekly series

Bucket units per SKU per week (Monday to Sunday). Weekly beats monthly for stock: a peak can fall inside one week. Mark every week as normal, stockout, promotion, launch or one-off (a viral post, a press mention, a wholesale order shipped through the store).

### 2. Find the clean baseline

For each SKU, baseline = average weekly units over the last 8 to 12 normal, in-stock weeks. For a week with 3 of 7 days in stock, scale it up: units / 3 x 7. Exclude promotion and one-off weeks from the baseline; they come back in step 5. Do not lift a baseline from Shopify's days-of-inventory report: it averages all 28 days, stockout days included [COG-6285].

Check the trend: compare the last 6 normal weeks with the 6 before. If the change is steady, carry half of it forward per quarter as a practitioner default, test it. A hero product can decline even while the store grows [PRD-0003]; do not assume every winner keeps climbing.

### 3. Build the seasonal index

With 12+ months: for each week of the year, index = that week's clean units last year / last year's average clean week. Use category-level indexes when a single SKU is too thin (under about 5 units a week).

Then align moving holidays to their dates this year, not last year's week number:

- **Moving holidays and seasons in other markets:** Lunar New Year, Ramadan and Eid, Easter, Passover and many local festivals move each year. Wedding seasons (varying by region) drive jewellery, formal wear and gifting. Marketplace sale weeks (Prime Day, Singles' Day, marketplace Black Friday events) pull traffic from DTC for some categories; check last year's pattern for this store.
- **UK, EU and Australia:** Boxing Day and January sales, Mothering Sunday in the UK (which moves with Easter), end-of-season sales; in Australia and other southern markets the summer season falls over Christmas.
- **US:** Black Friday to Cyber Monday, the shipping cut-off before Christmas, Mother's Day, back to school, Prime Day weeks. The last weeks of December can carry a cheap ad auction worth a planned offer [ADC-0043].

Peak weeks can run many times the base month; one practitioner saw a product go from about 200 a month to 2,000 and then 4,000 [OPS-0014]. Never forecast a seasonal product with a flat growth rate.

### 4. Young stores and new products

Under 12 months of history: use the store's own months so far for trend, and borrow a seasonal shape from the closest category signal the owner trusts (Google Trends for the product term, marketplace best seller movement, or a sister product). Mark the line "borrowed season" and widen the range in step 7.

New product: forecast from an analog, the store's most similar past launch, scaled by price and ad support. If a pre-order or waitlist ran, use its conversion: units = waitlist x the share who bought at the last comparable launch. A sell-out launch is fine only if restock is quick; one brand's rule was two weeks or less [ORG-0038].

### 5. Add promotions

For each past promotion, lift = units in the promotion week / baseline for that week. Keep lift per product and per depth (10% off, 20% off, bundle, gift). Then:

- Apply the matching lift to each planned promotion week.
- Subtract the dip after it: compare the 2 weeks after past promotions with baseline. Many products show a pull-forward dip.
- For bundles, add units to every product inside the bundle, and take some from the single item.
- Sitewide sales are worth limiting to once or twice a year on high-margin or slow stock [OFF-0008]; if the plan has more, flag the profit risk to `how-deep-can-we-discount`.

If there is no past promotion for a product, use the category's lift and mark it "assumed".

### 6. Add ad plans and returning buyers

If planned ad spend changes by more than 20% from the last 8 weeks, adjust new-customer units in proportion to the change in new orders the last time spend moved, not in proportion to spend. Extra spend usually buys customers at a higher cost each.

For repeat-purchase products, optionally decompose demand into disjoint new-customer and returning-customer populations. Rebuild the historical baseline from new-customer units only, then add returning-buyer demand from cohorts: each eligible past cohort's size x its repeat rate at its current age x units per repeat order [MEA-0022]. Otherwise keep the all-customer baseline and do not add a second returning-customer total. State which branch is used and reconcile its components to historical total units.

### 7. Set low, base and high

Without cohort decomposition: base units = all-customer baseline units x seasonal index x trend multiplier x promotion multiplier. With cohort decomposition: base units = (new-customer baseline units x seasonal index x trend multiplier + separately forecast returning-customer units) x the applicable promotion multiplier. Promotion lift from step 5 is a ratio, not units; apply it only to the populations and weeks it was measured for. Any pull-forward deduction is stated separately in units. With all multipliers at one and unchanged demand, the forecast must equal the baseline.

Range: use the store's own past error. If the store has no tracker yet, start with plus or minus 20% for A products with long history, 35% for others and 50% for new or borrowed-season lines; this is a practitioner default, test it. Fast-growing stores miss far more than mature retailers [OPS-0014].

The high line is the one to check against capacity and cash. The low line is the one to check against what is already on order: if even the low line will not sell what is on order, send the product to `clear-slow-moving-stock` early.

### 8. Sense-check with the owner

Show the top 10 products by forecast units next to last year's same weeks and the last 8 weeks. Ask one question per big gap: "Week 47 base is 3x last year. Is the Black Friday push bigger, or is this wrong?" Change only lines with a reason; write the reason in the sheet.

### 9. Hand the forecast on

- To `set-reorder-points-and-safety-stock`: base daily speed over each SKU's lead time window.
- To `build-13-week-cash-forecast`: units x landed cost by expected pay date.
- To the 3PL or packing team: orders per week at the high line.
- To the media buyer: weeks where the high line exceeds stock.

### 10. Track accuracy every week

For each SKU: error = (actual minus base) / base. Track bias (the average signed error) and the average absolute error over 4 weeks. Bias above plus or minus 10% for 4 weeks means the method is off for that product; fix the baseline or the index, not just the number. Recheck shares of stockout weeks, since a stockout makes the forecast look too high when demand was real.

## Checks before you hand it over

- Every SKU line excludes stockout and one-off weeks from its baseline.
- Moving holidays sit on this year's dates.
- Each promotion week has a lift with its source (past promotion or assumed) and a dip after it.
- Low, base and high exist for every line, with wider ranges on new and borrowed-season lines.
- The high line is checked against packing capacity and the result is noted.
- The units total by week matches the sum of SKUs.
- The owner's changes each carry a written reason.

## Output

1. **One-screen summary:** total units by week (low, base, high), the 5 products with the biggest change from last year, weeks where the high line breaks stock or capacity, and the assumptions that matter most.
2. **Forecast sheet**, one row per SKU per week:

| Column | What goes in it |
|---|---|
| SKU, Product, Grade | From the profit sheet |
| Week starting | Monday date |
| Baseline | Clean weekly units |
| Seasonal index | Value and whether own or borrowed |
| Trend factor | Value |
| Promotion | Name, depth, lift, source |
| Returning units | From cohorts, if used |
| Low, Base, High | Units |
| Note | Owner's reason for any change |

3. **Assumptions tab:** holiday dates used, promotion lifts table, ad spend plan, range rule.
4. **Accuracy tracker:** SKU, week, base, actual, error, 4-week bias, 4-week absolute error, action.

## Common mistakes

- **Stockout weeks in the baseline.** Step 2 excludes or scales them.
- **Last year's week number for a moving holiday.** Step 3 moves Easter, Lunar New Year, Eid and other moving holidays to this year's dates.
- **Promotion lift with no dip after.** Step 5 subtracts the pull-forward.
- **Ad spend treated as linear.** Step 6 uses the last real change in new orders.
- **One number, no range.** Step 7 gives low, base and high, and says which line each team uses.
- **Never checking the forecast.** Step 10 scores it every week.

## Sources

- OPS-0014: in-stock days only; seasonal peaks; forecast error ranges.
- MEA-0011: Shopify books returns on refund date.
- MEA-0022: returning revenue from cohort decay.
- PRD-0003: a hero product can decline while the store grows.
- ORG-0038: selling out is fine only with a fast restock.
- ADC-0043: late December cheap auction for a planned offer.
- OFF-0008: limit sitewide sales to once or twice a year.
- COG-6285: Shopify's days-of-inventory method and its limits.

What makes this skill ours: weekly series cleaned of stockout and one-off weeks; moving holidays shifted to this year's dates in every market; promotion lift paired with its pull-forward dip; returning-buyer demand built from cohorts; and a weekly bias tracker that fixes the method, not just the number.

## Selling in India

- Diwali, Navratri, Durga Puja, Raksha Bandhan, Eid, Onam and Pongal move with the lunar calendar; align them to this year's dates, not last year's week number.
- Wedding seasons (roughly November to February and April to June, varying by region) drive jewellery, ethnic wear and gifting.
- Marketplace sale weeks pull traffic from DTC for some categories; check last year's pattern for this store.

## Reproducible calculation

Use the shared `tools/commerce-math.mjs` operation `forecastUnits` for the supported calculation. Run `node tools/commerce-math.mjs <input.json>` with `{ "operation": "<one operation>", "inputs": { ... } }`; inspect the exported function for exact field names and units. Save inputs and result with the deliverable. Unsupported assumptions or missing inputs remain explicit gaps; never substitute a guessed figure. This tool is arithmetic support, not authority to act.
