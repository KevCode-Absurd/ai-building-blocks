---
name: design-store-ab-test
description: "A one-page test plan for each change on a store page: the evidence behind it, the hypothesis, the visitors the change reaches, the main metric at the funnel step it moves and the guardrails, the sample size worked out from the store's own traffic and conversion rate, the run time in whole weeks, and the stop rule written before launch. Says first whether the store has the traffic to test at all and what to do instead when it does not. Use before any split test on a product page, collection page, homepage, cart or landing page, when someone wants to 'just A/B test it', or when an agency proposes a test."
---

# Store A/B test design

**You get:** one test plan sheet (one screen) per store change, with the hypothesis, the visitors in scope, the primary metric at the funnel step the change moves, guardrails, sample size per variant, run time in weeks from that test's own traffic, the stop rule and the ship rule, ready to build.

## When to use

- The owner or an agency wants to split test a change on a product, collection, home, cart or landing page.
- A fix list has more ideas than the store can build, and the team needs to know which can be tested and which should simply ship.

## Not for

- Reading a finished test: use `read-store-ab-test-result`.
- Testing ads, audiences or budgets inside Meta: use `store-meta-test`.
- Testing a price: use `run-a-price-test` (never two prices for one product in a split test).
- Testing emails or texts: use `email-ab-test-plan`.

## What you need

Required (read access, level 1):

1. **Traffic and orders for the page under test**, last 8 full weeks, by week: sessions or users reaching that page, add to carts and orders from those visitors, split by device and traffic source. From GA4 or Shopify Analytics. If only sitewide numbers exist, use them and say the estimate is rough.
2. **Gross profit per order**, from `build-sku-profit-sheet` or `store-meta-math`.
3. **The change** in one sentence, with a mockup or link to the draft.
4. **The evidence** behind it: survey answers, recordings, funnel numbers, support tickets.
5. **The testing tool**, and whether it splits in the browser or on the server.

Optional: return rate and COD share by page, past test log, planned promotions in the next 6 weeks.

If traffic by page is missing, plan on sitewide numbers and mark them. Building variants needs draft access (level 2) on an unpublished theme copy; starting the test is a live change and needs the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Pass when it includes product cost, shipping, payment fees, returns and RTO [MEA-0037]. Fail: compute it first. Without it no test idea can be ranked.
2. **Is it a repair?** If the current state is plainly broken (add to cart fails on one browser, a field rejects valid input, a price is wrong, an event fires twice), fix it now. Do not test a bug.
3. **Tracking matches orders.** GA4 or the test tool must count purchases within about 5% of Shopify orders for the same days. GA4 conversion rate must be filtered to the purchase event [MEA-0002]; Shopify sessions include bots, so check sessions against GA4 [MEA-0012]. Fail: fix tracking with `set-up-ga4-for-store-and-check-data` first.
4. **Order volume, a default with reasons.** Under 30 orders a month: research and ship only. 30 to 300: one big swing at a time, built to catch a 20% or bigger lift. 300 to 3,000: regular tests at 10 to 20% lifts. Above 3,000: smaller lifts and more variants [CRO-0011]. Conversions set the smallest lift a test can find, so the band is where you start, not a rule. Each test is then sized on the traffic that sees its change (steps 2 to 5); say in one line when a test departs from its band.
5. **Not checkout or price.** Browser-based tools cannot test Shopify's checkout since checkout extensibility; only Plus stores can change checkout blocks [CRO-0016]. Price splits on one product are out [CRO-0009].
6. **Cash and capacity.** The variant must be buildable and maintainable by the team, and any offer in it must be affordable at full rollout.

## Steps

### 1. Write the hypothesis from evidence

Use this shape: "Because we saw [evidence, at least two kinds], we expect [change] to raise [metric] for [visitors] by at least [smallest lift worth shipping]." Admit no idea with fewer than two pieces of evidence, and rank competing ideas by chance of winning x lift x gross profit per order x visitors exposed, minus build cost [CRO-0013]. One change per test unless it is a deliberate big swing (a new page layout), in which case say so: a win tells you the package worked, not which part.

### 2. Scope the visitors and pick this test's primary metric

- **Visitors in scope:** only the visitors the change touches. A mobile layout change is tested on mobile, a one-browser fix on that browser, a landing page change on the source that lands there; anyone else only dilutes the result.
- **Primary:** the conversion at the funnel step the change moves [CRO-0014]. Product image, gallery or copy change: add to cart rate. Cart or shipping message change: checkout start rate. Offer, trust or payment change near the purchase: orders divided by visitors in scope. Revenue per visitor needs roughly six times the traffic, so use it only at high volume.
- **Guardrails (must not get worse beyond noise):** orders per visitor in scope whenever the primary sits earlier (an add to cart win may not carry to orders), order value, gross profit per order, refund or return rate, page speed (LCP), and for India the COD share and RTO rate.
- **Decision money metric:** gross profit per visitor = conversion rate x gross profit per order. The ship decision uses this, not conversion alone [OFF-0015].
- **Segments:** name at most two in advance (usually mobile versus desktop, and paid versus other). Every extra metric or segment you read raises the false winner rate: one metric 5%, two about 10%, three about 14% [CRO-0010].

### 3. Set the smallest lift worth shipping

The minimum detectable effect (MDE) is the smallest relative lift that pays for the build and upkeep, not the smallest possible. Work it out: monthly gross profit gain = monthly visitors in scope x baseline order conversion x lift carried to orders x gross profit per order (for an add to cart primary, say how much of its lift you expect to reach orders, and why). If that gain does not repay build cost within about 3 months (practitioner default), raise the MDE or drop the idea. Expect real lifts on mature pages of 1 to 5%; claims above 50% should be retested [CRO-0012].

### 4. Work out the sample size

Standard approximation for 95% confidence and 80% power (Lehr's rule; check with any free sample size calculator):

**Visitors per variant = 16 x (1 - p) / (p x r x r)**, where p is the baseline rate of this test's primary among visitors in scope (0.02 for 2%, or 0.08 for an 8% add to cart rate) and r is the relative MDE (0.20 for 20%).

Worked: at 2% conversion, a 20% lift needs about 19,600 visitors per variant (about 390 orders); a 10% lift needs about 78,400 (about 1,570 orders). The needed number of conversions depends mostly on the lift you want to catch, not the baseline [CRO-0005]. Double it for two variants; add 50% per extra variant.

### 5. Turn it into run time from real traffic

Run time in weeks = (visitors per variant x number of variants) / weekly visitors in scope who reach the page. Use the median of the last 8 weeks, not the best week. Then:

- Round up to whole weeks, and never less than 2 weeks, to cover weekday and weekend cycles [CRO-0015].
- **Over 6 weeks** (practitioner default: cookie loss and season drift creep in): do not run it. Raise the MDE with a bolder change, move the test to a busier page, use an earlier step as primary, or ship the change with a before and after read labelled weak evidence.
- Avoid windows with a sale, launch, festival (Diwali, Black Friday) or big ad change. If unavoidable, both variants must see it equally and the plan says so.

### 6. Choose how to split traffic

- **Randomise by visitor within the scope**, 50/50 by default; the same visitor always sees the same version. Visitors outside the scope see the control and are left out of the read.
- Browser-side tools flash the original before the variant and can inflate the lift [CRO-0008]. Prefer a server-side or template split, or, for pages reached mostly from ads, two template URLs split by the ad platform's own A/B test (`store-meta-test`). Exclude staff, bots and internal IPs.
- Check the variant at phone size and on a slow connection; a slower variant is a test of speed, not of the idea.

### 7. Write the stop rule and the ship rule before launch

- **No peeking.** Read the result only at the planned sample. Stopping the first time p is under 0.05 raises false winners from 5% to 26.1% [CRO-0017]. If the tool uses sequential statistics built for early looks, its own stopping rule applies; write which.
- **Stop early only for harm:** a broken variant, a guardrail breach set in advance (for example gross profit per order down more than 10%), or a traffic split mismatch.
- **Split check:** at the end, test the visitor split with a chi-square test; a mismatch voids the result until the cause is found [CRO-0007].
- **Ship rule:** ship when the primary wins at 95% and gross profit per visitor is up with no guardrail breach. If the fully powered test is flat, the effect is smaller than the MDE: ship the cheaper version and move on [CRO-0015].

### 8. A plan with several tests

Give each test its own sheet: visitors in scope, primary, baseline, MDE, sample, run time and split. Sizes differ with traffic and baseline: a mobile add to cart test can finish in 2 weeks while a checkout test on the same store needs 6. A shared block holds only settings true for every test, such as the stop rule and split check. Tests that touch the same visitors on the same page run one after another, highest expected gross profit first [CRO-0013]; tests on different pages or devices can run at once.

### 9. India and US notes

- **India:** COD orders are not cash until delivered. If the change could shift COD share (trust badges, payment icons, offers), count delivered or prepaid-plus-confirmed orders as the primary and add 2 to 3 weeks after the test for RTO to settle. Read Hindi or regional-language variants as separate tests, not segments.
- **US:** sales tax and shipping shown later in checkout cannot be tested on non-Plus Shopify; test the cart and product page messages that set expectations instead.

## Checks before you hand it over

- The hypothesis names two kinds of evidence and one change (or a labelled big swing).
- Each test has its own visitors in scope, primary at the step its change moves (orders as guardrail when earlier), MDE, sample and run time; only common settings are shared.
- Sample size shows the formula and inputs; run time is 2 to 6 whole weeks from median weekly traffic in scope.
- The ship decision uses gross profit per visitor; stop rule, harm limits and split check are written before launch.
- No non-Plus checkout tests, one-product price splits or major sale dates.
- Starting a test is a live change: the client's yes is asked in your message, not in the plan.

## Output

**One-screen summary:** for each change, the expected lift and its monthly gross profit value, visitors in scope, primary, run time, start and end dates, and the go or no-go on testing (with the alternative if no-go).

**Test plan sheet** (one per test, one row per field):

| Field | Entry |
|---|---|
| Test name and ID | |
| Page and visitors in scope | URL, device, browser, traffic sources included, and why |
| Evidence (2+) | source and date for each |
| Hypothesis | Because we saw..., we expect..., by at least ...% |
| Control and variant | one line each, links to mockups |
| Primary metric | funnel step the change moves, definition and event |
| Guardrails | metric, limit |
| Pre-named segments | max 2 |
| Baseline of the primary | % among visitors in scope, with weeks used |
| MDE (relative) | % and the monthly gross profit it is worth |
| Visitors per variant | formula result |
| Weekly visitors in scope | median of 8 weeks |
| Run time | weeks, start date, end date |
| Split method and tool | server, template, URL or browser |
| Stop rule | planned sample; harm limits |
| Ship rule | |
| India: order count used | delivered, prepaid plus confirmed, or all |
| Owner | name |

Add the row to the store's test log so `read-store-ab-test-result` can read it later.

## Common mistakes

- **One design for every test.** The same metric, split and lift for every change ignores where each change acts. Steps 2 and 8 size each test on its own.
- **Peeking and stopping on the first green number.** Step 7 fixes the read date before launch.
- **Judging on conversion rate alone.** A variant can lift conversion and lose profit through smaller orders or more COD returns.
- **Testing a bug or too little traffic.** Gate 2 and step 5 send these to the fix list or a bolder change.

## Sources

- CRO-0005: conversions needed depend on the lift.
- CRO-0007: split check.
- CRO-0008: flicker.
- CRO-0009: no one-product price splits.
- CRO-0010: extra metrics add false winners.
- CRO-0011: order bands as a default.
- CRO-0012: realistic lifts.
- CRO-0013: rank by expected gross profit.
- CRO-0014: primary at the step the change moves.
- CRO-0015: whole weeks.
- CRO-0016: checkout limits.
- CRO-0017: peeking.
- MEA-0002: GA4 purchase filter.
- MEA-0012: bot sessions.
- MEA-0037: delivered cost.
- OFF-0015: profit per session.

What makes this skill ours: each test is sized on the visitors its change reaches, judged at the step it moves, and shipped on gross profit per visitor.
