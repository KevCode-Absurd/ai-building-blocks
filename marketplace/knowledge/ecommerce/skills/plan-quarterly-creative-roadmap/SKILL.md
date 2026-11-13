---
name: plan-quarterly-creative-roadmap
description: "A twelve-week roadmap of ad concepts for one store, set week by week across angles, formats and buyer groups, and tied to the store's launches, seasons, stock arrivals and ad budget. Sizes how many new concepts the test budget and the production team can really carry, splits them between remaking winners, fixing near-misses and net-new ideas, places each on the calendar with brief, live and readout dates, and leaves a review point every four weeks. Use at the start of a quarter, before peak season, or when creative work is planned one week at a time and keeps running late."
---

# Quarterly creative roadmap

**You get:** a twelve-week roadmap sheet with every planned concept on a dated row (buyer, angle, format, product, offer, brief date, live date, test spend, readout date), a one-screen summary of the quarter's creative bets, and the three review dates where the plan gets rewritten from results.

## When to use

- A new quarter starts and creative is still planned week to week.
- Peak season, a launch or a big stock arrival is coming inside the next 12 weeks.
- The team keeps making ads for the same buyer and format.
- The owner wants to know what creative will cost in production time and test spend.

## Not for

- The standing grid of buyer, stage and theme that names every ad: use `creative-gap-grid` (this roadmap fills its cells).
- One month of ads produced in one run: use `monthly-ad-batch-sprint`.
- The weekly loop of reading results and planning successors: use `weekly-creative-sprint`.
- Which sales and discounts to run in the year: use `plan-yearly-sale-calendar`.

## What you need

Required:

1. **Meta Ads Manager export** at ad level for the last 90 days (ad name, spend, purchases, cost per purchase, frequency), plus the same from TikTok or Google video if they run.
2. **Gross profit per purchase and target cost per purchase** by main product, from `store-meta-math`.
3. **Planned monthly ad budget** for the quarter, signed off by the owner.
4. **Business calendar**: launches, sales, seasons, stock arrival dates and expected stock-outs (Shopify inventory export plus supplier dates).
5. **Production capacity**: who makes ads (owner, freelancers, creators, AI tools) and how many finished ads each can deliver a week.

Optional: the store's tag sheet, the angle table from `mine-ad-angles-from-reviews`, past roadmaps and what happened.

If the ad export is missing, plan as a new account: lean to net-new concepts and say so. If budget is not signed off, plan at last quarter's spend and mark it. This job needs read access only. Booking creators or spending money is the client's decision.

## Before you start: the gates

1. **Profit line.** Pass when target cost per purchase is built from gross profit per purchase [MEA-0037]. Fail: stop and run `store-meta-math`; the roadmap cannot size test spend without it.
2. **Cash.** Pass when the 12-week ad budget plus production cost fits the owner's cash plan. Fail: shrink the plan to what cash covers and say which weeks were cut.
3. **Capacity.** Pass when planned ads per week are at or under what the makers can deliver. Fail: cut concepts, never quality checks.
4. **Stock.** Each product featured in a week has stock for that week and four weeks after. Fail: move the concept or swap the product.

## Steps

### 1. Mark the fixed points

Lay out weeks 1 to 12 with real dates. Mark launches, sales, gifting dates, festival dates, stock arrivals, stock-outs and any week the owner or creators are away. Brief dates come 2 to 3 weeks before each live date; for a shoot, 4 weeks. India note: plan around the festival run (Raksha Bandhan, Navratri, Diwali, wedding season) and courier slowdowns before Diwali. US note: Black Friday, Christmas cutoffs and the quiet late December auction.

### 2. Size the volume from money, churn and hands

Work out three numbers and plan to the lowest:

- **Test budget limit.** Each new concept needs about 3 times target cost per purchase to be judged [ADC-0039]. Concepts a week = weekly test budget / (3 x target cost per purchase). Keep test spend near 20% of total, a practitioner default [ADC-0005].
- **Churn need.** New ads a month = winners lost a month / hit rate; 2 winners lost at a 5% hit rate needs about 40 new ads [MCR-0025]. A hit rate near 5% is normal [ADC-0017]. Small accounts lack a reliable rate; use the budget limit.
- **Production limit.** What the makers can finish each week.

As a cross-check, larger accounts tend to need about one new ad per 1,000 of monthly spend [MCR-0059]; under about 30,000 a month, founder-made phone content and about 3 concepts at a time is the usual level [MCR-0082].

### 3. Split the quarter's concepts into three buckets

Where the store has winners: 50 to 60% remakes of past winners in new formats or with new buyers, 20 to 30% fixes of near-misses, 20 to 30% net-new concepts, never zero new [MCR-0042]. A new store with no winners flips this toward net-new. With little production, apply new formats and buyers to ideas that already won before inventing new ones [MCR-0052].

### 4. Spread buyers, stages and formats

- Change the buyer, angle or offer from one concept to the next; a new colour or pose is not a new concept to Meta's delivery system [MCR-0022].
- For growth beyond warm demand, put most volume in ads for people not yet aware of the product or only aware of the problem, about 80% in practitioner accounts; small accounts still under their warm ceiling can stay lower in the funnel for now [MCR-0057].
- Run many distinct formats with spend spread across them rather than variants of one winner [MCR-0036].
- Compare formats by expected gross profit per ad after production cost; statics cost far less than video [MCR-0023].

### 5. Tie each concept to the business calendar

Fill the weeks: evergreen concepts first, then layer launch, season and stock concepts on their dates. Push products with the best gross profit per purchase and deep stock; never feature a product that runs out mid-test. Around a big sale, keep evergreen ads running and add offer-badged copies rather than replacing them [MCR-0069]. Plan a short offer for 16 to 31 December if the store has stock, since that auction is cheaper [ADC-0043].

### 6. Date every row

Each concept row gets: brief due, assets due, live date, test spend, readout date (live date plus the days needed to reach about 3 times target cost per purchase). If readout falls inside a heavy-discount week, read on ad-set click and cost-per-click signals instead, because ad-level return then mostly reflects the discount [MCR-0068].

### 7. Set three review points

Weeks 4, 8 and 12: compare results by tag, move unused budget to what won, rewrite the next four weeks. The roadmap is a plan, not a promise; any row can change at a review.

## Checks before you hand it over

- Weekly concept count is at or under the lowest of the budget, churn and production limits.
- Test spend and production cost add up per week and fit the signed-off budget.
- Every row names one product with stock for its test window and four weeks after.
- No two rows in the same week share the same buyer, angle and offer.
- The bucket split is shown, with at least some net-new every month.
- Brief, live and readout dates are real dates and in order.
- Launches, seasons and stock dates from the owner all appear on the sheet.
- Reviews in weeks 4, 8 and 12 are on the calendar.

## Output

**One-screen summary:** concepts this quarter by bucket and stage, weekly test spend, production load per maker, the three biggest bets, products held back for stock or margin, and review dates.

**Roadmap sheet (`creative-roadmap-Q.csv` or a Google Sheet):**

| Week | Dates | Business event | Concept ID | Bucket (remake, fix, new) | Buyer | Angle | Awareness stage | Format | Hook type | Product (SKU) | Stock cover (weeks) | Gross profit per purchase | Offer | Maker | Brief due | Live date | Test spend | Readout date | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Budget tab:** Week, Test spend, Scale spend, Production cost, Total, Running total against signed-off budget.

**Assumptions:** at most three lines, for the sale or launch dates, creator bookings or stock landing the roadmap depends on, each with what moves if it slips.

## Common mistakes

- **Volume picked from a rule of thumb alone.** Step 2 takes the lowest of money, churn and hands.
- **All remakes or all new.** Step 3 sets a split and keeps net-new above zero.
- **Twelve weeks of the same buyer.** Step 4 changes buyer, angle or offer row to row.
- **Ads for products that run out.** Gate 4 and step 5 check cover for every row.
- **Reading tests during a sale on ad return.** Step 6 moves those readouts to click signals.
- **A frozen plan.** Step 7 rewrites the next four weeks at each review.

## Sources

- ADC-0005: test batches at about 1x target cost per purchase, up to 20% of budget.
- ADC-0017: a hit rate near 5% is normal.
- ADC-0039: judge a concept at about 3x target cost per purchase.
- ADC-0043: 16 to 31 December is a cheaper auction.
- MCR-0022: a new concept means a new buyer, angle or offer.
- MCR-0023: compare formats by gross profit per ad after production cost.
- MCR-0025: monthly volume from winner churn and hit rate.
- MCR-0036: many distinct formats outlast variants of one winner.
- MCR-0042: split remakes, fixes and net-new.
- MCR-0052: put new formats on ideas that already won.
- MCR-0057: most volume for unaware and problem-aware buyers.
- MCR-0059: about one new ad per 1,000 of monthly spend.
- MCR-0068: read sale-week tests on clicks, not ad return.
- MCR-0069: keep evergreen ads through a sale and add offer copies.
- MCR-0082: creative resourcing by spend level.
- MEA-0037: gross margin is delivered cost.

What makes this skill ours: concept volume is the lowest of what the test budget, winner churn and the makers can carry, not a fixed quota; every row carries the product's gross profit and stock cover, so no ad is planned for a product that loses money or runs out; sale-week readouts switch to signals that are not bent by the discount; and the plan rewrites itself at weeks 4 and 8.
