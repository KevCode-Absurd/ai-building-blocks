---
name: forecast-next-month-revenue
description: "A forecast of next month's orders and revenue, week by week, with a low, base and high range, built from the store's own history, planned ad spend and the calendar. Forecasts new customers from spend and a realistic cost per new customer that rises as spend grows, forecasts returning orders from how past customer groups have repurchased, adjusts for sale days, festivals and stock limits, and converts gross sales into revenue after discounts, returns and failed cash-on-delivery orders. Each input is listed so the owner can change one and see the result. Use at month end, before setting an ad budget or a stock order, or when someone quotes a growth target and wants to know if it is realistic."
---

# Next month's revenue forecast

**You get:** a one-page forecast of next month's orders and net revenue by week, with a low, base and high range, the input table behind it, and the gap to the owner's target with what would close it.

## When to use

- At month end, to set expectations for the coming month.
- Before setting next month's ad budget or a stock order.
- The owner has a revenue target and wants to know if it is realistic.
- A sale, festival or product launch falls in the coming month.

## Not for

- Units per product over the next quarter: use `forecast-demand-per-sku`.
- How much the store can spend on ads: use `set-ad-budget-from-profit-target` (it takes this forecast as an input).
- Week-by-week cash in and out: use `build-13-week-cash-forecast`.
- Explaining why last month missed: use `store-results-drop-diagnosis`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, at least 12 months if the store has them, else all history: Name, Created at, Customer email or ID, Subtotal, Discount Amount, Refunded Amount, Total, Payment Method, Cancelled at.
2. **Planned ad spend** for next month by channel, from the owner or `set-ad-budget-from-profit-target`.
3. **Ad spend history** by month for the same period (Meta, Google and any other ad account exports).
4. **Calendar** for next month: planned sales and their depth, emails to the full list, launches, festivals and public holidays in the store's market.
5. **Stock** on hand and arriving next month for the top products.

Optional: GA4 sessions by month, return and RTO rates from `returns-and-rto-cost-analysis`, last year's same-month sale details.

If ad spend history is missing, forecast new customers from last month's new-customer count and say so. If the store has under 6 months of orders, use the last 8 weeks only and widen the range (step 8). This skill only reads data.

## Before you start: the gates

1. **Clean orders.** Pass when test, staff, cancelled and duplicate orders are removed. Fail: clean first.
2. **New versus returning is known.** Pass when each order can be tagged first order or repeat by customer. Shopify's returning customer rate moves with acquisition volume and does not measure repeat behaviour, so do not use it here [MEA-0014]. Fail: tag orders from the export by customer ID.
3. **Profit gate.** A revenue forecast is not a plan. Before anyone spends on it, the gross profit per order must be known (`store-meta-math`); say this in the summary.
4. **Stock.** If a top product cannot cover the forecast, cap it (step 6).

## Steps

### 1. Split the history

For each past month: new customers, returning orders, average order value for new and for returning orders, ad spend, and sale days. New and returning revenue are driven by different things, so forecast them apart.

### 2. Forecast new customers from spend

**Paid new customers = planned spend / expected cost per new customer.**

Take the cost per new customer from the last 4 to 8 weeks: ad spend / new customers (all new customers, since platforms over-claim). When spend rises, cost per new customer usually rises too, because extra money reaches colder buyers and blended conversion falls [MEA-0015]. Practitioner default, test it: for each 25% increase in spend over last month, raise the cost per new customer by 10%. When spend falls, hold the cost at last month's level rather than assuming it falls.

Sanity floor: cost per new customer cannot be lower than cost per click / conversion rate [MEA-0019]. If the planned number breaks that floor, raise it.

Add **organic new customers**: the average daily count of new customers on days with low spend, or last month's non-paid new customers from UTM data.

### 3. Forecast returning orders from past customer groups

Group past customers by the month of their first order. For each group: size x the share who bought again at that group's age in past data x returning order value [MEA-0022]. Sum across groups. This is usually far more accurate than "returning revenue grew 5% a month". Groups won in November often repurchase less than groups won at full price [MEA-0035]; use each group's own curve where the data allows.

### 4. Apply the calendar

- **Days and weekdays.** Count trading days and weekend days; use the store's own weekday pattern.
- **Seasonal index.** With 12 months or more: same month last year / average month last year, applied to the base. Without it, use no index and widen the range.
- **Sale days.** Use the lift from the last comparable sale (orders per day in the sale / orders per day in the 14 days before), not a hoped-for number. Expect a dip in the days after a deep sale.
- **India:** Diwali, Navratri, Raksha Bandhan, end-of-season sales and salary days near the 1st move order timing; marketplace sale weeks can pull buyers away from the site.
- **US:** Black Friday to Cyber Monday, Memorial Day, back-to-school and Prime Day; holiday shipping cut-offs end the peak early.

### 5. Set order value

Use the last 60 days' average order value, separately for new and returning orders, excluding sale days. Use the sale's own order value for sale days. Adjust only for a planned change with evidence (a new bundle, a threshold change).

### 6. Cap by stock

For each top product, forecast units from its share of orders. If units on hand plus arrivals are short, cap its orders and move only part of the lost demand to other products (practitioner default: a third, test it). Mark capped weeks.

### 7. Turn gross sales into revenue

- Subtract planned discounts.
- Subtract expected returns at the matured return rate. Shopify books refunds on the refund date, so last month's numbers may still be missing returns [MEA-0011].
- For COD orders, count only orders expected to be delivered: COD orders x (1 minus RTO rate).
- Revenue here means net sales plus shipping charged, before tax; tax collected is not revenue [MEA-0010].

### 8. Set the range

- If the store has past forecasts, use the spread of their errors: low and high are the base minus and plus the typical error.
- Otherwise, practitioner default, test it: plus or minus 15% for a store with steady history, 25% for under 6 months of history or a month with a big sale or launch.
- The low case also uses a cost per new customer 20% higher than base; the high case uses last month's cost unchanged.

### 9. Cross-check

Rebuild the base from sessions x conversion rate x order value [MEA-0009]. If the two methods differ by more than 15%, find out which input is wrong before handing over. Compare with the same month last year and last month; explain any jump over 30% with a named driver (spend, sale, launch).

### 10. Show the gap to target

If the owner has a target, show the gap and what would close it in each driver: extra spend at the rising cost per new customer, extra returning orders from an email campaign, or a sale. Do not close the gap by raising the conversion rate on hope.

## Checks before you hand it over

- New and returning orders are forecast separately.
- Cost per new customer rises with planned spend and passes the cost-per-click floor.
- Returning orders come from past customer groups, not a flat growth rate.
- Sale days use a past sale's measured lift.
- Stock caps are applied and marked.
- Revenue is after discounts, returns and RTO, and excludes tax.
- The sessions-based cross-check is within 15% or the gap is explained.
- Every input appears in the input table with its source.

## Output

**One-screen summary:** base orders and net revenue for the month with the low and high range; split new and returning; the three inputs the forecast is most sensitive to; gap to target and the cheapest way to close it; a reminder that spending against it needs gross profit per order; and up to three assumption lines where an unknown input moves the forecast.

**Input table:** Input, Value, Source, Date pulled. Rows: planned spend by channel, cost per new customer (base, low, high), organic new customers per day, returning orders by group, new order value, returning order value, discount rate, return rate, COD share, RTO rate, seasonal index, sale days and lift, stock caps.

**Forecast by week:**

| Week | Trading days | Sale days | New customers | Returning orders | Total orders | Gross sales | Discounts | Returns | RTO | Net revenue base | Low | High | Stock capped |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Returning orders by group:** First-order month, Group size, Repeat share at next month's age, Returning order value, Expected orders, Expected revenue.

## Common mistakes

- **Flat cost per new customer at higher spend.** Extra spend reaches colder buyers [MEA-0015]. Step 2 raises it.
- **Using Shopify's returning customer rate.** It moves with acquisition, not loyalty [MEA-0014]. Step 3 uses customer groups.
- **Forgetting refunds land late.** Step 7 applies the matured return rate [MEA-0011].
- **Counting tax as revenue.** Step 7 excludes it [MEA-0010].
- **A single number.** Step 8 always gives a range.
- **Forecasting sales the stock cannot cover.** Step 6 caps them.

## Sources

- MEA-0014: Shopify's returning customer rate moves with acquisition.
- MEA-0015: blended conversion falls as cold spend scales.
- MEA-0019: cost per customer floor is cost per click divided by conversion rate.
- MEA-0022: forecast returning revenue from customer group decay.
- MEA-0035: November customer groups repeat less.
- MEA-0011: refunds are booked on the refund date.
- MEA-0010: net sales plus shipping is revenue collected; total sales includes tax.
- MEA-0009: revenue equals sessions times conversion rate times order value.

What makes this skill ours: new and returning revenue are forecast from different drivers; cost per new customer rises with planned spend and is floored by cost per click; COD revenue is counted only if delivered; and every forecast comes with a range and a stock cap, not one hopeful number.
