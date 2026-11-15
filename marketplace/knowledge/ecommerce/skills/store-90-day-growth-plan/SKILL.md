---
name: store-90-day-growth-plan
description: "A 90-day growth plan for a store: the one constraint holding growth back, found in a fixed order (tracking, unit economics, conversion, traffic, retention, stock and cash), the proven winner relaunched first, the three biggest bets against the constraint, each sized in the owner's goal metric and money per month as a point estimate with its range, ranked by money per hour of work, with an owner, a budget by month that fits the cash plan, and 13 weekly checkpoints with continue, change or stop lines. Gated on gross profit per order, cash runway and team capacity, so nothing is planned that the store cannot pay for or staff. Use at the start of a quarter, after an audit, when growth has stalled, or when the owner has too many ideas and needs three."
---

# Ninety-day growth plan

**You get:** a one-page plan (baseline, the constraint, three bets, owners, budget, what success looks like at day 90), each decision in two plain lines, plus a bets table, a monthly budget against the cash plan, a 13-week grid with each bet's continue, change or stop line, and a weekly scorecard. Follow the house rules in the toolkit, above all "Only the brief's facts run the business." and "One basis per number."

## When to use

- A new quarter starts and the team needs one plan, not twelve.
- An audit produced a long list and the owner must choose.
- Growth stalled and nobody agrees why.
- Ad spend is about to rise and the plan must fit cash and the team.

## Not for

- Scoring and ranking every idea: use `prioritize-growth-backlog` (this plan takes its top items).
- The month's ad and email calendar: use `full-funnel-30-day-plan`.
- Whether ad spend can rise now: use `scale-readiness-check`.
- Running the weekly meeting: use `weekly-store-operating-review`.

## What you need

Required (read access):

1. **Shopify orders export** or Analytics, last 90 to 180 days: net sales, orders, new and returning customers, discounts, refunds.
2. **Gross profit per order** from `build-sku-profit-sheet` or `store-meta-math`.
3. **Ad spend and new customers by channel**, same window.
4. **Cash plan** for 13 weeks (`build-13-week-cash-forecast`) or bank balance plus known bills.
5. **Team capacity:** who (people and agents) can work on what, hours per week, and what needs the founder.
6. **Backlog or audit findings**, if any.

Optional: cohort repeat data, stock and PO schedule, sessions and conversion by device, last quarter's plan and results.

If gross profit per order is missing, the plan's first bet is to build it; nothing else is ranked [MEA-0026]. This skill needs read access only; every spend, price change or customer message is approved by the client.

## Before you start: the gates

1. **Gross profit per order known.** Fail: bet one is the profit sheet; other bets wait.
2. **Cash runway.** The plan's spend plus normal bills must leave a cash floor the owner names, every week of the 13. Growth funded by stock and loans can run profit to near zero [FIN-0011]. Fail: shrink the bets.
3. **Capacity.** Each bet has an owner with hours available. Fail: drop a bet rather than spread people thin.
4. **Tracking good enough** to read the bets: orders match between Shopify and the ad platforms within a known gap. Fail: fixing tracking becomes a bet.

## Steps

### 1. Name the goal metric, then write the baseline

Name the owner's goal metric in their words (contribution margin as a share of revenue, cash at day 90, new customers under a cost cap); if none, use contribution after ads as a share of net sales [MEA-0030]. Compute it now and a year ago, writing out the sum and its assumptions. Then work out what each lever is worth in it: points per $10 of cost per new customer, per $1 of first-order value, per point of returns cost. Step 4 sizes bets with these rates.

Then, from the last 90 days: net sales, gross profit, ad spend, contribution after ads, new customers, cost per new customer, first-order gross profit divided by cost per new customer, repeat rate at 90 days, cash. Split the P&L into first-time and returning customers; returning profit can hide a loss on new customers [MEA-0055].

Read first-order gross profit over cost per new customer in bands: under 1 loses money, 1 to 2 needs proven repeat, 2 to 3 is the zone to grow, above 3 means the store is probably under-spending [MEA-0032] [MEA-0024].

### 2. Find the constraint, in this order

Check each and stop at the first that fails:

1. **Tracking and data:** wrong data makes every other decision wrong; fix data first, structure next, creative third [ADC-0028].
2. **Unit economics:** first-order contribution below cost per new customer with weak repeat means stop scaling and fix margin, price or offer [MEA-0026].
3. **Conversion and order value:** conversion rate (as a percent) times order value is revenue per 100 visitors. Compare it with what 100 clicks cost at the store's own cost per click; under about 300 rarely scales at about $3 a click [MEA-0047]. Fix the page, offer or price.
4. **Traffic and creative:** profitable but not enough new buyers.
5. **Retention:** good first orders, weak repeat.
6. **Stock and cash:** demand exists but stock or cash caps it.

Write the constraint in one sentence with the number that proves it. Any screen or rule of thumb that decides something goes into the plan with its sum and its source: a brief line, platform documentation, or a card logged in your working trace. An outside yardstick with neither is dropped.

### 3. Relaunch the proven winner, then pick three bets

First, look for what already worked in the store's own data: a paused ad that bought cheaply, an offer or bundle that sold, a flow that earned, a product the best segment buys. Relaunching it unchanged is usually the most money for the least work, so it goes first, as bet one or ahead of the bets. Any change to it is a test, not the plan.

Then, from the backlog, pick the bets with the highest expected profit that work on the constraint (at least two of the three should). Rules:

- One bet may be a cheap test that reduces a big unknown instead of growing sales.
- Fix the problem the data shows is largest before smaller polish, even when the polish is easier to describe.
- Bets that touch the same result (an ad, a page and an offer for one product) are one initiative with one baseline; do not add separate guessed lifts.
- Prefer bets that can be judged inside 90 days; some gains only show in cash after 60 to 180 days [FIN-0029], so say what the day-90 read can and cannot prove.

### 4. Size each bet in one unit

Size every bet in the goal metric's unit and in money per month, using step 1's rates, sum written out in the numbers ledger, not the body. Never mix units (per 1,000 customers, per quarter, "high"). If volumes are missing, a share of revenue still works; state the volume behind the money figure. Rank by goal-metric impact divided by hours of work, so the order is a sort, not a judgement; a move that can start in week 1 goes ahead of one that needs a build. Overlapping bets are marked "do not add".

Each bet gets one call in one line: what changes and its profit per month as a point estimate with its range (for example "about 40,000 a month, range 25,000 to 55,000"), built from the store's own gross profit per order and volumes. Each projection rests on at most one assumed input, named in that line; stacked assumptions fail. Also give: cost, cash needed by month, hours, who does it (agent or person) and who says yes, and whether it is tested or shipped. Under about 300 orders a month most changes are shipped and watched rather than split tested [CRO-0011].

Measurement must match the store's size: smaller stores use 7-day click and a new-customer dashboard; lift tests come later [MEA-0041].

### 5. Build the budget by month

Add each bet's spend and cash by month to the cash plan. Ad budgets come from the profit target (`set-ad-budget-from-profit-target`). If any week drops below the cash floor, move or cut the latest bet. Show the total budget and the likely-case contribution side by side.

### 6. Set the checkpoints

For each bet, write:

- **Leading signal** (weekly): for example cost per new customer on the new offer.
- **Week 2 line:** is it live and working as built?
- **Week 4 and week 8 lines:** continue if the signal is at or above the line; change if below but moving; stop if below and flat.
- **Day 90 read:** the result against the point estimate and its range.

Put all bets on one 13-week grid, in relative weeks (Week 1 to Week 13) unless the brief gives dates. Then write the weekly scorecard, goal metric first: each line has its baseline (or "set in week 1"), day-90 target, owner, and the threshold that triggers action.

### 7. Market notes

- **Returns and failed deliveries:** count returns, refused parcels and failed deliveries in gross profit per order. Where cash arrives late (pay on delivery, marketplace payouts, buy now, pay later), the cash plan must use payout or remittance dates, not order dates.
- **Peak seasons:** if Black Friday to Cyber Monday, the winter holidays, Singles' Day, a summer sale or a big local festival falls inside the 90 days, plan stock and the sale calendar first; it can outweigh any bet. Peak-season customers may repeat less; set their cost allowance separately (`plan-yearly-sale-calendar`).
- **Several markets:** if the store sells in more than one country, find the constraint per main market before ranking bets; a new market is a bet of its own, sized with `set-up-markets-and-currencies`.
- **Currency:** size every bet in the store's own reporting currency, and say which one.

### 8. Reconcile the numbers, then start

Log every figure in `context/numbers.json` with its inputs, period and money basis, then run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>`. Fix every FAIL: a total that does not add up, a saving valued at revenue, a lift at one funnel step applied straight to orders, or two periods in one column.

Nothing spends or goes live until the client says yes to the plan, budget caps and owners. Ask for that yes in your own message, not in the plan.

## Checks before you hand it over

- The goal metric is named in the owner's words, baseline now and a year ago, working shown; the baseline also shows first-order gross profit over cost per new customer.
- The constraint is named with the number that proves it, found in the fixed order.
- Every screen or rule of thumb that decides something shows its sum and source (brief or traced card), or is cut.
- The proven winner, if the data shows one, is relaunched first and unchanged.
- Three bets (or the number the owner asked for), at least two working on the constraint.
- Every bet is sized in the goal metric's unit and money per month, sum in the ledger; the rank is a sort on money per hour of work. Mixed units fail.
- Each bet has who does it, who says yes, hours, cost, and a point estimate with its range in one line, on at most one named assumption.
- `numbers.cjs` shows no FAIL.
- Every scorecard line has a baseline, day-90 target, owner and action threshold.
- The monthly budget fits the cash plan with the named floor every week.
- Every bet has week 2, 4 and 8 lines and a day-90 read.
- No guessed lifts from overlapping bets are added together.

## Output

Follow the house rule "Write for a busy owner."

**One-page plan:** the goal metric (baseline, day-90 target), the constraint in one sentence, the first-week move, then each bet in two lines with who does it, and the total budget.

**Bets table:** Rank | Bet | Profit a month (point and range) | Who does it | Week 4 line.

**Budget by month:** Month | Bet spend | Cash in | Lowest weekly cash | Above the floor?

**13-week grid:** Week | Bet | Signal | Line | Status (on track, change, stop).

**Weekly scorecard:** Line | Baseline | Day-90 target | Owner | Action threshold.

**Appendix (short):** the goal-metric sums, the baseline numbers, approvers, hours and costs per bet.

## Common mistakes

- **Ten bets.** Step 3 allows three.
- **A new idea ahead of the winner.** Step 3 relaunches what already worked first.
- **Stacked assumptions.** Step 4 allows one named assumption per projection.
- **Mixed units, no link to the owner's goal.** Steps 1 and 4 size every bet in the goal metric.
- **An unexplained screen.** Step 2 shows the sum and source, or drops it.
- **Planning growth on broken unit economics.** Step 2 checks profit before traffic.
- **A plan cash cannot carry.** Step 5 checks every week against the floor.
- **No stop rule.** Step 6 writes the line before the bet starts.

## Sources

- MEA-0026: fix unit economics before scaling.
- MEA-0030: contribution margin without fixed costs.
- MEA-0055: split first-time and returning P&L.
- MEA-0032, MEA-0024: gross profit over cost per customer bands.
- ADC-0028: data first, structure second, creative third.
- MEA-0047: conversion times order value before scaling.
- FIN-0011, FIN-0029: cash limits; effects show over 60 to 180 days.
- CRO-0011: order-volume gates for testing.
- MEA-0041: measurement matched to size.

What makes this skill ours: the constraint is found in a fixed order, data and unit economics before traffic; only three bets survive, each sized in the owner's goal metric with an owner; the budget is checked weekly against a cash floor; and every bet carries its stop line before it starts.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Count RTO in gross profit per order. Cash from COD orders arrives after courier remittance, so the cash plan must use remittance dates, not order dates. If Diwali or a wedding season falls inside the 90 days, plan stock and the sale calendar first; it can outweigh any bet.
