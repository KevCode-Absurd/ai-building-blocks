---
name: build-weekly-kpi-dashboard
description: "A one-page weekly sheet of the ten or so numbers that run an online store: contribution after ads, new customers and what they cost, acquisition efficiency, sessions, purchase conversion rate, order value, returns or RTO, stock and cash. Each number has a written definition, its source export, its normal range, and the action to take when it moves out of range, with three decisions at the top and a data-confidence line. Use when setting up a weekly review, when the owner looks at too many numbers or the wrong ones, or when a team needs one shared page every Monday."
---

# Weekly KPI dashboard

**You get:** a one-page weekly sheet (Google Sheet or `weekly-kpis.csv` with a definitions tab) with 10 to 12 numbers, each with definition, source, owner, normal range and the action when it moves, plus a top block of three decisions for the week and a data-confidence line. Filled for the last 8 weeks so ranges are real.

## When to use

- The store has no weekly review, or the review is a tour of platform dashboards.
- The owner judges the week on platform ROAS or Shopify's total sales.
- Several people (owner, ads, operations) need one page to argue from.
- A monthly report exists but problems are found three weeks late.

## Not for

- The month-end report with wins, problems and graded actions: use `monthly-store-performance-report`.
- Daily ad account checks: use `daily-ad-account-review`.
- Finding the cause of a red number: use `store-results-drop-diagnosis`.
- Platform versus store reconciliation by channel: use `blended-channel-profit-view`.

## What you need

Required, read access (level 1), for the last 8 full weeks:

1. **Shopify order export** (Name, Created at, Financial Status, Cancelled at, Subtotal, Shipping, Taxes, Discount Amount, Refunded Amount, Payment Method, Email or Phone, Source) or Shopify's Sales over time report by week.
2. **Ad spend by channel by week**: Meta Ads Manager, Google Ads and any other platform export, in the store's currency and time zone.
3. **Gross profit per order** or per SKU from `build-sku-profit-sheet` or `store-meta-math`.
4. **Sessions** from GA4 (checked with `set-up-ga4-for-store-and-check-data`) or Shopify.
5. **Stock on hand and weekly sales** for the top SKUs; **cash in bank** from the owner.
6. **India:** courier or aggregator report with delivered, RTO and in-transit counts. **US and others:** returns by week.

If GA4 is not trusted, use Shopify sessions and say so on the confidence line. If gross profit per order is unknown, the sheet is built without the contribution rows and marked "not for spend decisions". Building the sheet changes nothing in any tool; a scheduled export or connector that writes the sheet automatically is level 2 and needs the client's yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when known. Fail: deliver the sheet with revenue and order rows only and say spend cannot be judged from it.
2. **One week definition.** Monday to Sunday in the store's time zone, across every source. Ad platforms in another time zone get converted or flagged.
3. **Store data is the truth for sales.** Platform-reported revenue never enters the top rows; it lives in the channel tab.
4. **Capacity.** The owner names who fills the sheet and when (for example Monday 10 am). A sheet nobody owns stops in a month.

## Steps

### 1. Choose the numbers

Start from this set and cut to what the store can act on. More than 12 rows is a report, not a dashboard.

| # | Number | Definition |
|---|---|---|
| 1 | Net sales | Shopify net sales plus shipping charged; total sales holds tax and gross sales ignores discounts and returns [MEA-0010] |
| 2 | Contribution after ads | Net sales minus product cost, delivery, fees, returns or RTO accrual, minus ad spend; fixed costs stay out [MEA-0030] |
| 3 | Orders, new customers | Store orders; new = first order ever |
| 4 | New-customer revenue per ad spend (acquisition MER) | First-order revenue / total ad spend [MEA-0025] |
| 5 | First-order gross profit / CAC | First-order gross profit per new customer / (ad spend / new customers) [MEA-0032] |
| 6 | Sessions | GA4 or Shopify, same source every week |
| 7 | Purchase conversion rate | Orders / sessions, purchases only [MEA-0002] |
| 8 | Order value | Net sales / orders, shipping included; Shopify's dashboard figure leaves shipping out [MEA-0013] |
| 9 | Revenue per 100 sessions | Conversion rate x order value x 100 |
| 10 | Returns or RTO | India: RTO % of shipped, delivered %; US: returns accrued at expected rate [MEA-0028] |
| 11 | Stock cover, top 5 SKUs | Units on hand / average weekly units sold |
| 12 | Cash in bank | Owner's figure, Monday morning |

Use acquisition MER, not blended MER: blended can rise while new-customer efficiency falls [MEA-0039]. If a platform number appears at all, use 7-day click; view-through credit made up 30 to 50% of reported ROAS in audits [MEA-0042].

### 2. Write each row's card

On the definitions tab, per number: formula, source export and column, who fills it, normal range, and the action when it leaves range. Example, row 5: "Under 1 loses money on the first order; 1 to 2 hold; 2 to 3 scale; over 3 means the store is underspending" [MEA-0032]. Example, row 9: below 300 revenue per 100 sessions in dollar terms, paid traffic rarely scales at about a 3 dollar click [MEA-0047]; for India or other currencies, work the same line from the store's own cost per click.

### 3. Set normal ranges from history

For each number, take the last 8 weeks without a sale or stock-out. Normal range = the 8-week average plus or minus the largest week-to-week swing in that set, or 10%, whichever is larger (practitioner default, test it). Compare each week with the 4-week average and with the same week last year when it exists. Mark a sale week as such; never set ranges from it.

### 4. Read movement before acting

When net sales move, split them: sessions x conversion rate x order value. A 5% drop in order value plus a 4% drop in conversion rate compounds to about 10% and is often normal noise [MEA-0009]. Act only when a number sits outside its range for the second week, or once if it is a breakage (spend stopped, purchases not tracked, stock-out of a top SKU).

Two traps to print on the sheet:

- Shopify books refunds on the refund date, so a big week can be followed by a false dip [MEA-0011].
- Shopify sessions include bots GA4 filters; a sudden session spike with flat orders is checked before anyone celebrates [MEA-0012].

### 5. Write the three decisions

At the top, every Monday: three decisions in plain words, each with what changed, the money at stake, the action, owner, due date and which number will confirm it. "Monitor" is not a decision unless it names the threshold and the date. If nothing is out of range, the decision is "no change", and that is a good week.

### 6. Add the confidence line

One line under the decisions: last refresh time, share of revenue with a confirmed cost, GA4 capture rate, orders still in transit (India) or inside the return window, and any number filled from an estimate. A red confidence line means no spend change that week.

### 7. Market notes

- **India:** report placed, shipped, delivered and RTO orders. Net sales and contribution use delivered orders, with in-transit COD orders shown separately until they settle. Add prepaid share as a row if the store is pushing prepaid. Exclude GST from every money row.
- **US:** exclude sales tax. In November and December, compare with the same weeks last year, not the 4-week average.

### 8. Hand off when a row turns red

Contribution or row 5 red for two weeks: `store-results-drop-diagnosis`. Stock cover under lead time: the operations owner. Capture rate red: `set-up-ga4-for-store-and-check-data`. Channel argument: `blended-channel-profit-view`.

## Checks before you hand it over

- 12 rows or fewer, each with formula, source, owner, range and action.
- Net sales use net sales plus shipping, not total or gross sales.
- Conversion rate is purchases only; order value includes shipping.
- Contribution excludes fixed costs and includes return or RTO accrual.
- No platform-reported revenue sits in the top block.
- Ranges come from 8 normal weeks; sale weeks are marked.
- Three decisions are written, each with owner, date and confirming number.
- The confidence line is filled.

## Output

**1. Top block (one screen)**

- Week and date range.
- Three decisions: change, money at stake, action, owner, due, confirming number.
- Confidence line.

**2. The weekly table**

| Number | This week | Last week | 4-week average | Same week last year | Normal range | Status (in, out, breakage) | Action if out | Owner |
|---|---|---|---|---|---|---|---|---|

**3. Definitions tab:** Number, Formula, Source export and column, Filled by, Range rule, Action rule, Card.

**4. Channel tab** (context only): spend, platform-reported purchases on 7-day click, new customers by survey or UTM where known.

**5. History tab:** the 8 weeks used for ranges, with sale and stock-out weeks marked.

## Common mistakes

- **Total sales as the headline.** It includes tax; step 1 uses net sales plus shipping.
- **Blended MER as the efficiency number.** Returning buyers flatter it; step 1 uses acquisition MER.
- **Reacting to one week.** Step 4 waits for a second week unless something broke.
- **Ranges from a sale period.** Step 3 sets them from normal weeks.
- **Too many numbers.** Step 1 caps the page at 12.
- **Decisions without owners.** Step 5 names owner, date and the number that confirms it.

## Sources

- MEA-0002: GA4 conversion rate must be filtered to purchase.
- MEA-0009: split revenue into sessions, conversion rate and order value; small compound dips are noise.
- MEA-0010: Shopify net sales plus shipping is cash collected.
- MEA-0011: refunds land on the refund date and fake a dip.
- MEA-0012: Shopify sessions include bots.
- MEA-0013: Shopify's AOV leaves out shipping.
- MEA-0025: track acquisition MER.
- MEA-0028: accrue returns at the expected rate.
- MEA-0030: track contribution without fixed costs.
- MEA-0032: first-purchase gross profit over CAC bands.
- MEA-0039: blended MER hides falling new-customer efficiency.
- MEA-0042: report Meta on 7-day click.
- MEA-0047: revenue per 100 visitors under 300 rarely scales.

What makes this skill ours: every row carries its own action rule and owner, not just a target; ranges come from the store's own normal weeks; a confidence line can veto spend changes; and Indian stores read money on delivered orders with in-transit COD held apart.
