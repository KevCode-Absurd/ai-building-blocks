---
name: scale-readiness-check
description: "Decides whether a store can raise its total ad spend now, and if so how fast. Checks every winning Meta and Google campaign against eight pass or fail tests: store-side profit, cost of the last extra sales, delivery volume, creative depth, stock cover, warehouse and support capacity, cash, and a working funnel. Then reads pacing against the monthly budget, builds a saturation watchlist, and writes a dated scaling plan with step sizes and stop rules for each campaign that qualifies. Use it before any planned spend increase, before a peak season, or when a campaign has beaten target for two weeks. The client approves every raise."
---

# Is the store ready to spend more, and how fast?

**You get:** a readiness table testing every winning Meta and Google campaign on eight limits, a saturation watchlist, a dated scaling timeline with stop rules, and a readiness file, ready for the owner to approve the first raise.

A winning campaign is not a reason to scale on its own. The store must also make money on the extra sales, ship them on time, answer the extra questions and wait for the cash. This skill checks all of that first, then paces the raise so performance does not break.

## When to use

- A campaign has beaten its target for 14 days or more and the owner asks "can we double it?"
- Before raising the monthly ad budget.
- Six to eight weeks before a peak season or a launch.
- Spend is running ahead of or behind the monthly plan and someone needs to say why.

## Not for

- Moving money between campaigns inside the same total: use `cross-channel-budget-reallocation`.
- Meta budget, bid and learning settings for each ad set: use `store-meta-budget`.
- Building gross profit per purchase and break-even: use `store-meta-math`.
- Making new ads when creative depth fails: use `store-meta-concepts` and `store-meta-creative-review`.

## What you need

Required (read access, level 1):

1. **Meta Ads Manager export**, daily, last 28 days, campaign and ad level: Campaign name, Ad name, Amount spent, Impressions, Reach, Frequency, CPM, Link clicks, Purchases, Purchases conversion value, Cost per purchase, Delivery status.
2. **Google Ads campaign report**, daily, last 28 days: Campaign, Budget, Cost, Conversions, Conv. value, Search impression share, Search lost IS (budget), Search lost IS (rank), Bid strategy and target.
3. **Shopify order export** for the same dates with Customer Id (for new-customer share) and Lineitem sku.
4. **Money lines** from `store-meta-math`: gross profit per purchase, break-even and target cost per purchase, and store-truth factors from `store-meta-attribution`.
5. **Stock**: units on hand, units sold per in-stock day and supplier lead time per advertised SKU.
6. **Capacity**: orders per day the warehouse or 3PL can pick and ship on time, support tickets per day the team can answer, and any contract limits.
7. **The monthly budget and cash available for ads.**

Optional: 3PL on-time rate for the last 60 days, support ticket export, last year's peak numbers.

If capacity numbers are unknown, ask once. If still missing, cap the raise at the current daily order record plus 20% and say so.

Access: level 1 for the check and plan. Level 2 to draft raises. Every raise needs a client yes, or must sit inside written level 3 limits (a daily cap per campaign and an end date).

## Before you start: the gates

1. **Gross profit per purchase known.** Fail: stop. No campaign can pass test 1 without it.
2. **Cash and capacity stated.** Fail: no raise, only the readiness table with the missing tests marked "unknown".
3. **Tracking trustworthy.** Pass when platform purchases sit within a stable ratio of store orders. Fail: no raise on the affected channel; fix it first. Data integrity comes before scaling [ADC-0028].

## Steps

### 1. Pick the candidates

A candidate beat its store-basis target cost per purchase for both the last 7 and last 28 days. Ignore single good days: below about 1,000 a day in spend, daily swings are noise [ADC-0064].

### 2. Run the eight readiness tests per candidate

| Test | Pass when | Card or source |
|---|---|---|
| 1. Profit | Store-basis cost per purchase at or below target over 28 days, and first-order gross profit to CAC at or above 1, or 2 to 3 on proven 90-day value [MEA-0026] [MEA-0024] | Store money lines |
| 2. Last extra sales | Marginal cost per purchase from the last raise below break-even [ADC-0049] | Two-period comparison |
| 3. Volume | About 50 optimisation events per ad set per week on Meta (Meta documentation); 30 to 50 a month per Google smart-bid campaign [GAD-0007] | Platform exports |
| 4. Creative depth | At least 3 distinct concepts live with spend, and cold-campaign ad frequency under about 2 [MCR-0040] | Ad export |
| 5. Stock | Days of cover after the raise longer than supplier lead time plus safety stock of 5 to 10 days [ADC-0023] [OPS-0014] | Stock sheet |
| 6. Capacity | Orders a day after the raise under 80% of on-time pick capacity, practitioner default; support load fits staff | 3PL and support numbers |
| 7. Cash | Cash tied up after the raise fits the cash stated [FIN-0011] | Cash calculation |
| 8. Funnel | Store conversion rate and add-to-cart rate steady over 14 days, purchase events reaching the platform, refund and complaint rate not rising | Shopify, GA4, support desk |

A candidate is **ready** only when all eight pass. One fail makes it **not yet**, with the fix named; the failed test becomes the ceiling on any gain, so a smaller raise is not a fix. Tests 5 and 6 cannot be overridden by profit: selling out mid-scale sends ads back to learning and wastes the ramp [OPS-0019].

**One override:** a dated, time-limited event (a launch, a peak week) may scale with one failed test from 1 to 4 or 8, only when the owner signs a written override naming the failed test, the end date and the stop rule. Never for stock, capacity or cash.

**Working out test 5:** orders a day after the raise = today's orders plus extra spend / marginal cost per purchase. Days of cover = sellable units / units sold a day at the new rate. Use demand from in-stock days only; days with stockouts understate it [OPS-0014].

**Working out test 6:** at peaks, a 3PL's 24 to 48 hour pick promise can slip to 7 days [OPS-0015]. Support load grows with order value; at a high average order value, far more orders bring a call [OPS-0006]. Extra tickets a day = extra orders x the store's tickets per order from the last 60 days.

**Working out test 7:** cash tied up = (daily ad spend + daily landed cost of units to reorder) x days until order cash lands. For cash-on-delivery stores, use the courier remittance days.

### 3. Read pacing against the monthly budget

Projected month-end spend = spend to date + average daily spend over the last 3 days x days left. Pacing = projected month-end spend / monthly budget.

- 90 to 110%: on plan.
- Over 110%: find the campaign running ahead. If it is profitable and passes all eight tests, the plan is too small, not the campaign too big.
- Under 90%: check Google "lost IS (budget)" versus "lost IS (rank)", and Meta cost per result goals that leave budget unspent. Under-spend at target means the target is too tight [GAD-0023].

Also check the store's floor: conversion rate x average order value should be about 300 or more per 100 visitors before paid traffic scales well at ordinary click costs [MEA-0047]. Below that, fix the page and offer before the budget.

### 4. Build the saturation watchlist

For every campaign being scaled, track weekly and flag when two or more move together:

- Cold-campaign ad frequency above about 2 [MCR-0040].
- CPM rising more than 15% while click-through rate falls, practitioner default.
- Marginal cost per purchase rising toward break-even [ADC-0049].
- New-customer share of store orders falling while spend rises.
- Google impression share already above 90% on non-brand terms, so more money buys little reach.

A stall at peak is more often the offer or the response curve than running out of people [ADC-0044]. When the watchlist trips, the fix is new concepts or a new buyer group, not more money on the same ads.

### 5. Choose the scaling method per campaign

- **Meta, raise in place:** increase the budget where the winner already runs; do not switch it off to relaunch elsewhere [ADC-0067]. Practitioner default, test it: 20 to 30% every 3 to 4 days near the 50-event line, bigger steps well above it. The 20% rule has no Meta documentation [ADC-0056].
- **Meta, widen:** add new concepts or a new buyer group to the winning campaign when frequency or creative depth limits it. Do not duplicate the winning campaign with the same ads; near-identical ads reach the same people [MCR-0078]. Size the creative pipeline from churn: winners lost a month divided by hit rate [MCR-0025].
- **Google smart bidding:** raise 10 to 15% when the campaign spends 100% of budget at target [GAD-0023]. Raise target ROAS 15 to 20% per step, 2 to 3 weeks apart, only above about 50 conversions a month [GAD-0007].
- **Stop rule for all:** stop raising when marginal cost per purchase reaches break-even, when any readiness test turns to fail, or when two watchlist signals trip.
- **After each step:** no other edit for 3 days; days 1 and 2 are noise. From day 3, read a 3-day rolling marginal cost. If it is above break-even after the full read window, return to the previous budget and do not repeat the same step without a new reason.

### 6. Write the timeline

For each ready campaign: start date, step size, step dates, the stock arrival dates the steps depend on, and a review after each step's read window. Put the plan's weekly cash need beside it. A peak plan starts 6 to 8 weeks out so stock and staff arrive before the spend, practitioner default.

### 7. India and cash-on-delivery stores

Use gross profit per placed order after return-to-origin losses from `store-meta-math`. Count returned-to-origin parcels in warehouse load: they come back through the same team. Add courier remittance days to test 7. WhatsApp order-confirmation calls or messages add support load per COD order; include them in test 6.

## Checks before you hand it over

- Every candidate shows all eight tests with a value and pass, fail or unknown.
- No campaign marked ready has a failed or unknown test, unless a signed, dated override names it.
- Stock and capacity use demand after the raise, not today's demand.
- Pacing is calculated for the current month with the date.
- The watchlist names its thresholds and who reads it each week.
- Each step has a date, a size, a stop rule and a review date.
- The weekly cash need never exceeds the cash stated.
- No raise is shown as done; each waits for a client yes.

## Output

**Summary, one screen:** ready campaigns and how much more a day they can take, campaigns not yet ready with the one fix each, the binding limit (profit, stock, capacity, cash or creative), pacing this month, and the first raise to approve.

**Table "Readiness":** Channel, Campaign, Store-basis cost per purchase, Target, Marginal cost, Events per week, Live concepts, Frequency, Days of cover after raise, Lead time, Orders a day after raise, Pick capacity, Cash needed, Verdict, Fix.

**Table "Saturation watchlist":** Campaign, Signal, Threshold, This week, Last week, Tripped (yes or no), Action.

**Table "Scaling timeline":** Campaign, Step, Date, Daily budget from, Daily budget to, Depends on (stock arrival, staff), Stop rule, Review date.

**File:** `scale-readiness.csv` or a Google Sheet.

## Common mistakes

- **Scaling into a stock-out.** The ramp is wasted and learning restarts. Test 5 uses demand after the raise.
- **Forgetting the warehouse.** Late parcels raise refunds and tickets. Test 6 uses 80% of on-time pick capacity, not the maximum.
- **Scaling on average cost.** Test 2 reads the cost of the last extra sales [ADC-0049].
- **Raising a budget the account cannot spend.** Step 3 checks pacing and impression share first.
- **Answering saturation with money.** Step 4 sends it to new concepts.
- **Relaunching a winner as a "scaling campaign".** Step 5 raises it where it runs [ADC-0067].

## Sources

- ADC-0023: tie ad spend to stock cover.
- ADC-0028: data integrity before structure and scale.
- ADC-0044: peak stalls are usually offer or response-curve fatigue.
- ADC-0049: marginal versus average cost.
- ADC-0056: the 20% rule has no Meta documentation.
- ADC-0064: daily swings are noise at low spend.
- ADC-0067: raise a winner where it runs.
- FIN-0011: growth can outrun the cash cycle.
- GAD-0007, GAD-0023: Google target and budget step rules.
- MCR-0025, MCR-0040, MCR-0078: creative volume from churn, frequency ceiling, near-duplicate ads.
- MEA-0024, MEA-0026: gross profit to CAC bands.
- MEA-0047: conversion rate times order value floor before scaling.
- OPS-0006, OPS-0014, OPS-0015, OPS-0019: support load, stock forecasting, 3PL pick slippage, do not sell out at peak.

What makes this skill ours: warehouse, support and stock tests that profit cannot override; demand after the raise, not today's, drives the stock and capacity checks; marginal cost of the last sales as the stop rule; and a weekly cash line beside every scaling step.
