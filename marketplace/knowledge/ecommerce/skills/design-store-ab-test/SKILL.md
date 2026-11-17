---
name: design-store-ab-test
description: "A one-page test plan for each change on a store page, and a test or a direct fix for every objection above about 10% of chats or returns. Each plan gives the evidence, the hypothesis, the visitors the change reaches, the main metric at the funnel step it moves with guardrails, the expected lift and the smallest detectable effect as two separate numbers, how an earlier-step lift carries to orders through the store's own pass-through rate, one baseline per traffic scope, the sample size from the store's own traffic, the run time in whole weeks counted from the start week, and the stop and ship rules written before launch. Says first whether the store has the traffic to test at all. Use before any split test on a product, collection, home, cart or landing page."
---

# Store A/B test design

**You get:** a plan that answers every big objection with a test or a direct fix, and one sheet per test with the visitors in scope, the main metric at the step the change moves, the expected lift and the smallest detectable effect as separate numbers, the sample, the run time in weeks from that test's own traffic, and the stop and ship rules.

## When to use

- The owner or an agency wants to split test a change on a product, collection, home, cart or landing page.
- Chats, reviews or returns show objections and the owner wants each one answered.
- A fix list has more ideas than the store can build, and the team needs to know which to test and which to ship.

## Not for

- Reading a finished test: use `read-store-ab-test-result`.
- Testing ads, audiences or budgets inside Meta: use `store-meta-test`.
- Testing a price: use `run-a-price-test` (never two prices for one product in a split test).
- Testing emails or texts: use `email-ab-test-plan`.

## What you need

Required (read access, level 1):

1. **Traffic and orders for each page under test**, last 8 full weeks, by week and by device and traffic source: visitors reaching the page, add to carts, checkout starts and orders from those visitors. From GA4 or Shopify Analytics. If only sitewide numbers exist, use them and say the estimate is rough.
2. **Gross profit per order**, from `build-sku-profit-sheet` or `store-meta-math`.
3. **The objections**: chat topics, return reasons and survey answers, each with its share.
4. **The change** for each test, in one sentence, with a mockup or link.
5. **The testing tool**, and whether it splits in the browser or on the server.

Optional: payment method share by page (including pay on delivery where offered), past test log, planned promotions in the coming weeks.

Building variants needs draft access (level 2) on an unpublished theme copy; starting a test is a live change and needs the client's yes, asked in your message.

## Before you start: the gates

1. **Gross profit per order known.** Pass when it includes product cost, shipping, payment fees, returns and failed deliveries [MEA-0037]. Fail: compute it first.
2. **Is it a repair?** If the current state is plainly broken (add to cart fails on one browser, a field rejects valid input, a wrong price, an event firing twice), fix it now. Do not test a bug.
3. **Tracking matches orders.** GA4 or the test tool counts purchases within about 5% of Shopify orders for the same days; GA4 conversion rate is filtered to the purchase event [MEA-0002]; Shopify sessions include bots, so check them against GA4 [MEA-0012]. Fail: fix tracking first with `set-up-ga4-for-store-and-check-data`.
4. **Order volume, a default with reasons.** Under 30 orders a month: research and ship only. 30 to 300: one big swing at a time, built to catch a 20% or bigger lift. 300 to 3,000: regular tests at 10 to 20%. Above 3,000: smaller lifts and more variants [CRO-0011]. Each test is then sized on the traffic that sees its change; say in one line when a test departs from its band.
5. **Not checkout or price.** Browser tools cannot test Shopify's checkout; only Plus stores can change checkout blocks [CRO-0016]. One-product price splits are out [CRO-0009].

## Steps

Follow the house rules, chiefly **Map every signal to an asset**, **Look it up before you decide**, **Only the brief's facts run the business**, **One basis per number** and **Write for a busy owner**. Run `node tools/ask-knowledge.mjs` once per objection and once per test decision, logged in `context/trace.md`; every figure goes in `context/numbers.json`. Schedules count in weeks from the start week; a calendar date only when the brief gives one.

### 1. Answer every big objection

List every chat topic, return reason and survey answer with its share. Each one above about 10% gets a test or a direct fix in the plan, by name. A direct fix is right when the answer is a plain fact the buyer lacks (size, fit, firmness, delivery time); put it in the bullets and the line by the button, and ship it. A test is right when the answer could cost sales, such as a new layout or offer. The top near-miss reason from a post-purchase survey belongs in page copy [CRO-0018]. An objection above 10% with neither is a gap to close.

### 2. Write the hypothesis from evidence

"Because we saw [evidence, at least two kinds], we expect [change] to raise [metric] for [visitors] by [expected lift]." Admit no idea with fewer than two pieces of evidence, and rank ideas by chance of winning x expected lift x gross profit per order x visitors exposed, minus build cost [CRO-0013]. One change per test, unless it is a labelled big swing: a win then tells you the package worked, not which part.

### 3. Scope the visitors and pick the main metric

- **Visitors in scope:** only those the change touches. A mobile layout change is tested on mobile, a one-browser fix on that browser, a landing page change on the source that lands there.
- **One baseline per scope:** take every rate from the same visitors in scope. Never mix a mobile rate with an all-device rate in one sum.
- **Primary:** the conversion at the step the change moves [CRO-0014]. Product image, gallery or copy: add to cart rate. Cart or shipping message: checkout start rate. Offer, trust or payment near the purchase: orders per visitor in scope.
- **Guardrails:** orders per visitor whenever the primary sits earlier, order value, gross profit per order, return rate, page speed, and, where pay on delivery is offered, its share and the failed-delivery rate.
- **Money metric:** gross profit per visitor = conversion x gross profit per order; the ship decision uses this [OFF-0015].
- **Segments:** at most two named in advance. Each extra metric or segment raises the false winner rate: one 5%, two about 10%, three about 14% [CRO-0010].

### 4. Expected lift and smallest detectable effect: two numbers

- **Expected lift:** what you think the change will do, from the evidence and the knowledge cards. Real lifts on mature pages run 1 to 5%; claims above 50% need a retest [CRO-0012].
- **Smallest detectable effect (MDE):** the smallest lift worth shipping, the one the test is sized to catch. It pays for the build within about 3 months (practitioner default). It is not the forecast.
- **Carry to orders:** a lift at an earlier step reaches orders only through that step's pass-through rate from the store's own data. Extra orders = extra add to carts x this scope's add-to-cart-to-order rate. Never apply an add-to-cart lift straight to orders; if the data shows extra add to carts convert below the average, use the lower rate.
- The MDE's monthly worth = monthly visitors in scope x baseline order rate x the MDE carried to orders x gross profit per order.
- If the expected lift sits below the MDE, the test will most likely read flat: ship the fix, make the change bolder, or drop it.

### 5. Work out the sample size

For 95% confidence and 80% power (check with any free calculator):

**Visitors per variant = 16 x (1 - p) / (p x r x r)**, where p is the baseline of this test's primary among visitors in scope and r is the relative MDE.

At 2% conversion, a 20% MDE needs about 19,600 visitors per variant; a 10% MDE about 78,400. Conversions needed depend mostly on the lift, not the baseline [CRO-0005]. Double for two variants; add 50% per extra variant.

### 6. Turn it into weeks

Run time = (visitors per variant x variants) / weekly visitors in scope, from the median of the last 8 weeks.
- Round up to whole weeks, never under 2, to cover weekday and weekend cycles [CRO-0015].
- **Over 6 weeks** (practitioner default): do not run it. Raise the MDE with a bolder change, move to a busier page, use an earlier step as primary, or ship it with a before and after read labelled weak evidence.
- Avoid weeks with a sale, launch, festival or big ad change; if unavoidable, both variants see it equally.

### 7. Split, stop and ship rules

- Randomise by visitor within scope, 50/50; the same visitor always sees the same version. Browser tools flash the original and can inflate the lift [CRO-0008], so prefer a server or template split, or for ad-led pages two template URLs split by the ad platform's own test (`store-meta-test`).
- **No peeking:** stopping at the first p under 0.05 raises false winners from 5% to 26.1% [CRO-0017]. Stop early only for harm (a broken variant or a guardrail breach set in advance).
- **Split check** at the end with a chi-square test; a mismatch voids the result [CRO-0007].
- **Ship rule:** the primary wins at 95%, gross profit per visitor is up, no guardrail breach. An inconclusive result at the planned sample does not prove the effect is below the MDE. Compare the interval with zero and the prespecified practical threshold; keep the stopping rule. Choosing the cheaper version is an operational decision, not an equivalence finding.

### 7b. Pick the route the store's plan allows

Sort every idea into "before checkout" (home, collection, product, cart, add to cart, trust lines, price display) or "in checkout". Most tests worth running sit before checkout anyway.

- **Basic, Shopify and Advanced plans:** test everything before checkout; the checkout itself cannot be split by a browser tool since the checkout rebuild [CRO-0016]. An in-checkout idea gets a "not testable here" line plus the nearest idea before checkout that sets the same expectation (for example a delivery cost line in the cart instead of the shipping step).
- **Plus:** checkout blocks and UI extensions can change checkout, and some apps run limited checkout tests through them. Check what the chosen tool supports on the store's plan today; Shopify changes these rules, so re-check once a year.

Then pick the route for each test:

| Route | Suits | Costs |
|---|---|---|
| Browser tool (visual editor) | Front-end copy, layout and image tests on product, cart and home pages; quick for a marketer | Can flicker, adds page weight, breaks more easily after theme changes |
| Server or theme-level split (including Shopify's own theme rollouts) | Speed-sensitive pages, pricing display logic, anything near checkout | Needs a developer or theme change; slower to set up; theme rollouts show numbers but no significance verdict, so the read still goes through `read-store-ab-test-result` |

**Flicker:** a hide-the-page snippet stops the original flashing but can hold the page blank for up to a few seconds by default (ask the vendor for its current setting) [CRO-0008]. Accept that cost on purpose, or move the test server-side.

**Ask every tool five questions before trusting it,** and name tools only as examples, since free tiers and prices change: what is the free limit and what happens past it; does it split in the browser or on the server; how does it handle flicker; which statistics does it use (fixed sample, always-valid sequential or Bayesian), so you know whether watching the results is safe; and does it work on this Shopify plan and theme?

**Do not stack tests.** Never two tests on the same page and visitors at once. A home page test plus a cart test is fine; a test above the fold plus one far below it can work if the client accepts the risk. Check that no email, SMS or ad link sends traffic to only one version by accident.

### 8. A plan with several tests

Each test gets its own sheet: scope, baseline, primary, expected lift, MDE, sample, weeks. A shared block holds only settings true for every test. Tests on the same visitors and page run one after another, highest expected gross profit first [CRO-0013]; tests on different pages or devices run at once. Name the start week of each. Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` before hand-over.

Pay on delivery: if a change could shift the share of pay-on-delivery orders, the primary is delivered or prepaid-plus-confirmed orders, read 2 to 3 weeks after the test ends. Checkout limits: tax and shipping shown later in a non-Plus checkout cannot be tested; test the cart and product page messages that set expectations. In the UK, EU and Australia, page prices already include tax, so test delivery cost and timing messages instead.

## Checks before you hand it over

- Every objection above about 10% has a test or a direct fix, by name.
- Each test states the expected lift and the MDE as two different numbers.
- An earlier-step lift reaches orders only through this scope's own pass-through rate.
- Each test has one baseline from its own scope; no mixed device or source rates.
- Sample size shows its inputs; run time is 2 to 6 whole weeks from median traffic in scope, scheduled by start week.
- Ship uses gross profit per visitor; stop, harm and split rules are written before launch.
- Starting a test needs the client's yes, asked in your message, not in the plan.
- Every test names its route (browser or server or theme) for the store's plan, with the flicker cost stated; in-checkout ideas on non-Plus plans are marked not testable with the nearest alternative.
- The chosen tool's statistics method is named, and no two tests share a page and visitors at once.

## Output

**One-screen summary:** each big objection and its answer (test or fix); for each test, the expected lift and its monthly gross profit, the MDE, visitors in scope, run time and start week.

**Each decision in two lines:** what to do, and why with one number.

**Test plan sheet** (one per test):

| Field | Entry |
|---|---|
| Test name and objection it answers | |
| Page and visitors in scope | device, browser, sources, and why |
| Evidence (2+) | source for each |
| Hypothesis | Because we saw..., we expect... |
| Control and variant | one line each, links to mockups |
| Primary metric and guardrails | step the change moves; limits |
| Baseline of the primary | % in this scope, weeks used |
| Expected lift | % and why |
| MDE (relative) | % and the monthly gross profit it is worth |
| Carry to orders | pass-through rate from this scope's data |
| Visitors per variant | formula result |
| Weekly visitors in scope | median of 8 weeks |
| Run time | weeks, start week |
| Split method, stop rule, ship rule | |
| Owner | name |

Add the row to the store's test log for `read-store-ab-test-result`.

## Common mistakes

- **A big objection with no answer.** Step 1 maps each one to a test or a fix.
- **Treating the MDE as the forecast.** Step 4 keeps them apart.
- **An add-to-cart lift applied to orders.** Step 4 carries it through the pass-through rate.
- **Mixed baselines.** Step 3 keeps one per scope.
- **Peeking and stopping on the first green number.** Step 7 fixes the read before launch.
- **Buying a test tool before checking the plan.** Step 7b sorts ideas by checkout or not and picks the route the plan allows.
- **Trusting a theme rollout's numbers as a verdict.** Step 7b sends them through the readout skill.

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
- CRO-0015: whole-week stopping discipline. Interpret uncertainty from the interval; a non-significant result does not establish a below-MDE effect.
- CRO-0016: checkout limits.
- CRO-0017: peeking.
- CRO-0018: the near-miss reason belongs in page copy.
- MEA-0002: GA4 purchase filter.
- MEA-0012: bot sessions.
- MEA-0037: delivered cost.
- OFF-0015: profit per session.

What makes this skill ours: every big objection gets a test or a fix, each test is sized on the visitors its change reaches with its own baseline, the forecast and the MDE stay apart, and earlier-step lifts reach orders only through the store's own funnel.

## Selling in India

- Track COD share and RTO as guardrails on every test.
- If a change could shift COD share, the primary is delivered or prepaid-plus-confirmed orders, read 2 to 3 weeks after the test ends.

## Reproducible calculation

Save the planned sample, absolute MDE, stopping rule and outcome definitions before the test starts. At readout, follow `read-store-ab-test-result` and its `experimentReadout` calculation; do not reinterpret an inconclusive interval as a below-MDE result or extend the test until it becomes significant.
