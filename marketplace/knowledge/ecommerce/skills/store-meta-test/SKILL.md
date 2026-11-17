---
name: store-meta-test
description: "Design a Meta (Facebook and Instagram) test for an online store, sized from the store's own weekly purchases and gross profit per purchase. Says first whether the store is big enough to test on Meta at all, and what to do instead when it is not. Picks the right kind of test (a spend gate for new concepts, a Meta A/B test, a conversion lift holdout, or a geo test), ranks ideas by expected gross profit, and writes the hypothesis, cell sizes, budget, dates and the decision rule before launch. Use when someone asks 'is ad A better than B', 'should we test this offer', 'do our retargeting ads work', or wants a testing plan."
---

# Test design for a store's Meta ads

**You get:** a sized Meta test plan with the question, hypothesis, budget, dates, cell setup and decision rules, or a clear answer that the store is too small to test, plus a test log row.

Most store tests on Meta fail before launch: they are too small to ever give an answer. This skill does the sum first, from the store's own purchases, and says plainly when a test cannot work and what to do instead.

## When to use

- "Is ad A better than ad B?" or "Should we test this offer or bundle?"
- A new product, concept batch or landing page needs a fair read.
- The owner asks whether retargeting, catalog or existing-customer ads are worth it.
- Someone wants a monthly testing plan.
- A past test gave a "winner" and you need to know whether to trust it.

## Not for

- Choosing which creative concepts to make: use `store-meta-concepts`.
- Testing the website or checkout itself: use `store-meta-landing`.
- Judging a batch of live ads already running: use `store-meta-creative-review`.
- Setting the overall budget the test sits inside: use `store-meta-budget`.

## What you need

Required:
1. **Weekly purchases** for the last 8 weeks, from two places: Meta Ads Manager (purchases on 7-day click, by campaign and week) and the Shopify order export (Created at, Financial Status, Email to tag new customers, Lineitem sku).
2. **Cost per purchase** on 7-day click for the campaigns the test would use, and the attribution setting.
3. **Gross profit per purchase** and target cost per purchase from `store-meta-ads` or `store-meta-math`.
4. **The idea** in the owner's words, and the evidence behind it.
5. **Calendar:** sales, launches and stock gaps in the next 8 weeks.

Optional: post-purchase survey answers, past test results, stock for the products in the test.

If weekly purchases are missing, ask once. Without them, no test is sized; offer the "too small" route in Step 2 instead.

**Access:** level 1 (read) to design. Level 2 (draft) to build the test as paused campaigns or a draft in Experiments. Level 3 (publish) and the owner's yes to start it, because it spends money.

## Before you start: the gates

1. **Money.** Gross profit per purchase is known. Fail: no ranking of ideas and no test budget; design stops at the hypothesis.
2. **Cash and stock.** The test budget fits the month's cash limit, and both cells can sell for the whole test without a stock-out. Fail: shrink the test, move dates, or pick another product.
3. **Tracking.** Meta purchases track Shopify orders in a stable ratio. Fail: fix tracking first with `store-meta-capi`; a test read on a broken event is worthless.
4. **Clean window.** No sale, price change or launch inside the test window. Sale results corrupt creative reads [MCR-0068]. Fail: move the dates.

## Steps

### 1. Write the hypothesis

"If we [one change], cost per purchase on 7-day click will fall by at least [X]%, because [evidence]." One change only. Two pieces of evidence or the idea waits [CRO-0013]. The X is the smallest lift worth acting on, not the hoped-for lift.

### 2. Size it from the store's own purchases

For a two-cell test at 95% confidence and 80% power, each cell needs about 16 / (lift x lift) purchases, from Evan Miller's rule [CRO-0005].

| Smallest lift worth finding | Purchases per cell | Both cells | Weekly purchases needed for a 4-week test |
|---|---|---|---|
| 30% | about 180 | 360 | 90 |
| 20% | about 400 | 800 | 200 |
| 10% | about 1,600 | 3,200 | 800 |

These match [CRO-0005] at a 2% baseline (about 190, 420 and 1,600 conversions per variant for 30, 20 and 10% lifts). A rule of 1,000 conversions per cell only powers lifts of about 13% or more [CRO-0024].

- Weeks needed = both cells / weekly purchases you can route into the test.
- Test budget = both cells x expected cost per purchase [ADC-0066].
- Longest test: 4 weeks (practitioner default, test it); longer reads drift with season and creative fatigue. Shortest: one full week, in practice two [CRO-0015].

**The store is too small to run a split test on Meta when** the weeks needed exceed 4 at a 30% lift, which means fewer than about 90 purchases a week available to the test, or when the budget would take more than about 30% of monthly spend (when profitable; 10% or less when not [ADC-0053]).

### 3. When the store is too small, do this instead

- **Spend gates for new concepts.** Each concept gets its own ad set. Judge after spending 3x target cost per purchase: 3 or more purchases keep, 2 wait, 0 or 1 cut; 5x gives a firmer call [ADC-0039]. This is a filter, not proof. Launch batches of 4 to 8 ads in their own ad set at a daily minimum of about 1x target cost per purchase for 7 days, using no more than 20% of budget [ADC-0005].
- **Very small budgets ($30 to $100 a day):** cap impressions per ad near 1,000 so each new ad gets an equal look [ADC-0004]. That reads attention only; follow up on survivors with more spend.
- **Big swings, not small tweaks:** a new offer, bundle or landing page that could move results 30% or more [CRO-0019].
- **Ask buyers:** a two-question post-purchase survey (what made you buy today, what almost stopped you) [CRO-0018].
- **Before and after, with care:** track the store's numbers before and after a change, and note any spend, offer or season change in the same window [CRO-0001].
- **Under about 30 orders a month:** no test of any kind is valid; fix what is broken and research [CRO-0011].

### 4. Pick the kind of test

| Question | Test | Notes |
|---|---|---|
| Is this new concept worth more spend? | Spend gate (Step 3) | Not an experiment; fine at any size |
| Is A better than B (offer, concept, destination page, Advantage+ versus manual)? | Meta A/B test in Experiments | Meta splits the audience so cells do not overlap |
| Do these ads cause sales at all (retargeting, catalog, existing customers)? | Conversion lift holdout | Check eligibility in Experiments; existing customers often see 20 to 100 ads a month [ADC-0042], and catalog ad ROAS can halve on incremental reads [ADC-0010] |
| Does Meta drive the revenue it claims, across the business? | Geo-lift on store data, about 25 days | Only for brands with enough regional volume [MEA-0033] [MEA-0050]; usually above about $20M a year [MEA-0041] |

Never test different prices for the same product. Test framing, bundles and tiers instead [CRO-0009].

### 5. Rank the ideas by expected gross profit

Expected value = chance of winning x lift x gross profit per purchase x purchases exposed, minus build cost [CRO-0013]. Assume a 10 to 20% chance of a clear winner unless past tests say otherwise [CRO-0012]. Run the top idea that passes Step 2; park the rest.

### 6. Fix the rules before launch

- One variable; equal budgets; the same attribution setting in each cell.
- One primary metric: cost per purchase on 7-day click. Where possible, give each cell its own UTM so Shopify can count new-customer orders per cell as a check. Each extra decision metric adds false winners [CRO-0010].
- A fixed end date. No early stop when a cell looks ahead; peeking lifts false winners from 5% to 26% [CRO-0017].
- No edits mid-test. Meta's guide is about 50 optimisation events per ad set in 7 days to leave learning; most store tests will not reach it, and buying it can cost five times more [ADC-0066]. Both cells learn under the same rules, so do not extend a test just to leave learning (practitioner default, test it).
- After the end date, wait 7 days for late click purchases before the final read.
- Check that reach and spend split as planned between cells. A lopsided split means the result should not be trusted [CRO-0007].

### 7. Read it and log it

- **Win:** the primary metric wins at the planned confidence, and the Shopify check points the same way. Roll it out at level 3 with the owner's yes.
- **Inconclusive at full size:** the interval crosses zero; it may still include the target lift. Report the estimate, interval and practical threshold. Stop as planned. Keeping the cheaper or simpler option is an operational choice, not proof that the effect is small.
- **Lose:** log it. Most tests lose; a 30 to 35% win rate is very good [CRO-0020].
- Log every test: date, hypothesis, cells, purchases per cell, result, decision, what we learned.

## Checks before you hand it over

1. The hypothesis has one change, a minimum lift and two pieces of evidence.
2. Cell size comes from the store's own weekly purchases, with the sum shown.
3. The plan says clearly whether the store is big enough, and gives the Step 3 route if not.
4. The budget fits the cash limit and the 30% (or 10%) share rule.
5. The window has no sale, price change or stock gap, and both cells have stock.
6. Primary metric, end date and the read date after the click window are fixed.
7. Starting the test is an approval line, not a done step.

## Output

1. **One screen:** the question; can we test it (yes, or too small and why); the test type; hypothesis; dates; budget; the decision rule.
2. **Sizing table:** weekly purchases available, lift sought, purchases per cell, weeks needed, cost per purchase, total budget, share of monthly spend.
3. **Setup table:** cell, what changes, budget per day, audience, destination URL with UTM, attribution setting.
4. **Decision rules:** win, lose, inconclusive, stop early only for a broken event or a stock-out.
5. **Test log row**, ready to append.

File: `meta-test-plan-<name>.md`.

## Common mistakes

- **Launching a test that can never finish.** Step 2 sizes it first and Step 3 gives the small-store route.
- **Using the hoped-for lift to size the test.** The hypothesis uses the smallest lift worth acting on.
- **Reading a winner from a high CTR.** The primary metric is cost per purchase, checked against Shopify.
- **Testing through Black Friday or Diwali.** Gate 4 moves the dates.
- **Stopping when one cell pulls ahead.** Step 6 fixes the end date.
- **Calling a spend gate a proven winner.** Step 3 labels it a filter.
- **Testing a retargeting budget by comparing ROAS.** Step 4 uses a holdout for "do these ads cause sales".

## Sources

- [CRO-0001]: small traffic cannot run weekly split tests.
- [CRO-0005]: sample size per variant by minimum lift.
- [CRO-0024]: 1,000 conversions per cell only powers lifts of about 13% or more.
- [CRO-0007]: lopsided splits make results untrustworthy.
- [CRO-0009]: never test prices on the same product.
- [CRO-0010]: extra metrics add false positives.
- [CRO-0011]: gate testing by monthly orders.
- [CRO-0012]: 10 to 20% of tests win.
- [CRO-0013]: rank tests by expected gross profit.
- [CRO-0015]: run full weeks; stop at full power.
- [CRO-0017]: peeking inflates false positives.
- [CRO-0018]: two-question post-purchase survey.
- [CRO-0019]: small stores take big swings.
- [CRO-0020]: 30 to 35% win rate is very good.
- [ADC-0004]: impression caps for small accounts.
- [ADC-0005]: batch ad sets at 1x target CPA.
- [ADC-0010]: catalog ad ROAS halves on incremental reads.
- [ADC-0039]: judge concepts after 3x target CPA.
- [ADC-0042]: existing customers see too many ads.
- [ADC-0053]: 70/30 proven to tests when profitable.
- [ADC-0066]: daily test budget formula.
- [MCR-0068]: sale results corrupt creative reads.
- [MEA-0033]: geo-lift tests for large brands.
- [MEA-0041]: measurement ladder by size.
- [MEA-0050]: geo-lift design on store data.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: sizes every test from the store's own weekly purchases and cost per purchase, and says plainly when a store is too small to test on Meta, with a route to follow instead; separates spend gates for new concepts from true experiments and holdouts; ranks ideas by expected gross profit and blocks tests that cross a sale, a stock gap or the cash limit; drops the unsourced "UGC lifts CTR 25 to 40%" example and the flat "$100 a day per cell" floor.
