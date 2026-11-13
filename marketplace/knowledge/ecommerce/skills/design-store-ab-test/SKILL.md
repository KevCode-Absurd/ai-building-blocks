---
name: design-store-ab-test
description: "A one-page test plan for one change on a store page: the evidence behind it, the hypothesis, the main metric and guardrails, the sample size worked out from the store's own traffic and conversion rate, the run time in whole weeks, and the stop rule written before launch. Says first whether the store has the traffic to test at all and what to do instead when it does not. Use before any split test on a product page, collection page, homepage, cart or landing page, when someone wants to 'just A/B test it', or when an agency proposes a test."
---

# Store A/B test design

**You get:** one test plan sheet (one screen) for one store change, with the hypothesis, primary metric, guardrails, sample size per variant, run time in weeks from the store's real traffic, the stop rule and the ship rule, ready for the client to approve before anything goes live.

## When to use

- The owner or an agency wants to split test a change on a product, collection, home, cart or landing page.
- A fix list has more ideas than the store can build, and the team needs to know which can be tested and which should simply ship.
- A past test was stopped early or "won" on a hunch, and the next one must be planned properly.
- A new page or offer is ready and the client wants proof before rolling it out.

## Not for

- Reading a finished test: use `read-store-ab-test-result`.
- Testing ads, audiences or budgets inside Meta: use `store-meta-test`.
- Testing a price: use `run-a-price-test` (never two prices for one product in a split test).
- Testing emails or texts: use `email-ab-test-plan`.

## What you need

Required (read access, level 1):

1. **Traffic and orders for the page under test**, last 8 full weeks, by week: sessions or users landing on or reaching that page, orders from those visitors, mobile versus desktop. From GA4 (Explore, filtered to the page path) or Shopify Analytics (sessions by landing page). If only sitewide numbers exist, use them and say the estimate is rough.
2. **Gross profit per order**, from `build-sku-profit-sheet` or `store-meta-math`.
3. **The change** in one sentence, with a mockup or link to the draft.
4. **The evidence** behind it: survey answers, recordings, funnel numbers, support tickets.
5. **The testing tool** the store has, or will use, and whether it splits in the browser or on the server.

Optional: return rate and COD share by page, past test log, planned promotions in the next 6 weeks.

If traffic by page is missing, ask once; until then plan on sitewide numbers and mark them. Building variants needs draft access (level 2) on an unpublished theme copy; starting the test is a live change and needs the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Pass when it includes product cost, shipping, payment fees, returns and RTO [MEA-0037]. Fail: compute it first. Without it no test idea can be ranked.
2. **Is it a repair?** If the current state is plainly broken (add to cart fails on one browser, a field rejects valid input, a price is wrong, an event fires twice), fix it now. Do not test a bug.
3. **Tracking matches orders.** GA4 or the test tool must count purchases within about 5% of Shopify orders for the same days. GA4 conversion rate must be filtered to the purchase event [MEA-0002]; Shopify sessions include bots, so check sessions against GA4 [MEA-0012]. Fail: fix tracking with `set-up-ga4-for-store-and-check-data` first.
4. **Order volume.** Under 30 orders a month: no split tests, research and ship only. 30 to 300: one big swing at a time, built to catch a 20% or bigger lift. 300 to 3,000: regular tests aiming at 10 to 20% lifts. Above 3,000: smaller lifts and more variants become possible [CRO-0011].
5. **Not checkout or price.** Browser-based tools cannot test Shopify's checkout since checkout extensibility; only Plus stores can change checkout blocks [CRO-0016]. Price splits on one product are out [CRO-0009].
6. **Cash and capacity.** The variant must be buildable and maintainable by the team, and any offer in it must be affordable at full rollout.

## Steps

### 1. Write the hypothesis from evidence

Use this shape: "Because we saw [evidence, at least two kinds], we expect [change] to raise [metric] for [visitors] by at least [smallest lift worth shipping]." Admit no idea with fewer than two pieces of evidence, and rank competing ideas by chance of winning x lift x gross profit per order x visitors exposed, minus build cost [CRO-0013]. One change per test unless it is a deliberate big swing (a new page layout), in which case say so: a win tells you the package worked, not which part.

### 2. Pick one primary metric and the guardrails

- **Primary:** orders divided by visitors who saw the page (conversion rate). Revenue per visitor needs roughly six times the traffic for the same lift, so use it as primary only at high volume [CRO-0014].
- **Low volume fallback:** add to cart rate as primary, with purchase conversion as a guardrail. Say plainly that an add-to-cart win may not carry to orders.
- **Guardrails (must not get worse beyond noise):** order value, gross profit per order, refund or return rate, page speed (LCP), and for India the COD share and RTO rate.
- **Decision money metric:** gross profit per visitor = conversion rate x gross profit per order. The ship decision uses this, not conversion alone [OFF-0015].
- **Segments:** name at most two in advance (usually mobile versus desktop, and paid versus other). Every extra metric or segment you read raises the false winner rate: one metric 5%, two about 10%, three about 14% [CRO-0010].

### 3. Set the smallest lift worth shipping

The minimum detectable effect (MDE) is the smallest relative lift that pays for the build and upkeep, not the smallest possible. Work it out: monthly gross profit gain at that lift = monthly visitors x baseline conversion x lift x gross profit per order. If that gain does not repay build cost within about 3 months (practitioner default), raise the MDE or drop the idea. Expect real lifts on mature pages of 1 to 5%; claims above 50% should be retested [CRO-0012].

### 4. Work out the sample size

Standard approximation for 95% confidence and 80% power (Lehr's rule; check with any free sample size calculator):

**Visitors per variant = 16 x (1 - p) / (p x r x r)**, where p is baseline conversion (0.02 for 2%) and r is the relative MDE (0.20 for 20%).

Worked: at 2% conversion, a 20% lift needs about 19,600 visitors per variant (about 390 orders); a 10% lift needs about 78,400 (about 1,570 orders). The needed number of conversions depends mostly on the lift you want to catch, not the baseline [CRO-0005]. Double it for two variants; add 50% per extra variant.

### 5. Turn it into run time from real traffic

Run time in weeks = (visitors per variant x number of variants) / weekly visitors who reach the page. Use the median of the last 8 weeks, not the best week. Then:

- Round up to whole weeks, and never less than 2 weeks, to cover weekday and weekend cycles [CRO-0015].
- **Over 6 weeks** (practitioner default: cookie loss and season drift creep in): do not run it. Choose one: raise the MDE with a bolder change, move the test to a higher-traffic page, use add to cart as primary, or ship the change and watch it with a before and after read labelled weak evidence.
- Avoid windows with a sale, launch, festival (Diwali, Black Friday) or big ad change. If unavoidable, both variants must see it equally and the plan says so.

### 6. Choose how to split traffic

- **Randomise by visitor, 50/50**, the same visitor always sees the same version.
- Browser-side tools flash the original before the variant and can inflate the lift; anti-flicker scripts hide the page for up to 3 to 4 seconds instead [CRO-0008]. Prefer a server-side split, a theme or template split, or two landing URLs split by the ad platform where the page is mostly reached from ads.
- Free path: duplicate the template in Shopify, build the variant there, and split paid traffic between the two URLs with the ad platform's own A/B test (hand the ad side to `store-meta-test`). Exclude staff, bots and internal IPs.
- Check the variant at phone size and on a slow connection; a slower variant is a test of speed, not of the idea.

### 7. Write the stop rule and the ship rule before launch

- **No peeking.** Read the result only at the planned sample. Stopping the first time p is under 0.05 raises false winners from 5% to 26.1%, and Bayesian tools checked the same way do worse [CRO-0017]. If the tool uses sequential statistics built for early looks, its own stopping rule applies; write which.
- **Stop early only for harm:** a broken variant, a guardrail breach set in advance (for example gross profit per order down more than 10%), or a traffic split mismatch.
- **Split check:** at the end, test the visitor split with a chi-square test; a mismatch voids the result until the cause is found [CRO-0007].
- **Ship rule:** ship when the primary metric wins at 95% and gross profit per visitor is up with no guardrail breach. If the fully powered test is flat, the effect is smaller than the MDE: ship the cheaper version and move on [CRO-0015].

### 8. India and US notes

- **India:** COD orders are not cash until delivered. If the change could shift COD share (trust badges, payment icons, offers), count delivered or prepaid-plus-confirmed orders as the primary and add 2 to 3 weeks after the test for RTO to settle. Read Hindi or regional-language variants as separate tests, not segments.
- **US:** sales tax and shipping shown later in checkout cannot be tested on non-Plus Shopify; test the cart and product page messages that set expectations instead.

## Checks before you hand it over

- The hypothesis names two kinds of evidence and one change (or a labelled big swing).
- Sample size is worked from this page's baseline, with the formula and inputs shown.
- Run time is in whole weeks, at least 2, from median weekly traffic, and no more than 6.
- One primary metric, named guardrails, at most two pre-named segments.
- The ship decision uses gross profit per visitor, not conversion rate alone.
- Stop rule, harm limits and split check are written before launch.
- The test avoids checkout (non-Plus), one-product price splits and major sale dates.
- Nothing goes live without the client's yes.

## Output

**One-screen summary:** the change, the expected lift and its monthly gross profit value, run time, start and end dates, and the go or no-go on testing (with the alternative if no-go).

**Test plan sheet** (one row per field):

| Field | Entry |
|---|---|
| Test name and ID | |
| Page and audience | URL, device, traffic sources included |
| Evidence (2+) | source and date for each |
| Hypothesis | Because we saw..., we expect..., by at least ...% |
| Control and variant | one line each, links to mockups |
| Primary metric | definition and event |
| Guardrails | metric, limit |
| Pre-named segments | max 2 |
| Baseline conversion | % with weeks used |
| MDE (relative) | % and the monthly gross profit it is worth |
| Visitors per variant | formula result |
| Weekly eligible visitors | median of 8 weeks |
| Run time | weeks, start date, end date |
| Split method and tool | server, template, URL or browser |
| Stop rule | planned sample; harm limits |
| Ship rule | |
| India: order count used | delivered, prepaid plus confirmed, or all |
| Owner and approval | name, date of client yes |

Add the row to the store's test log so `read-store-ab-test-result` can read it later.

## Common mistakes

- **Testing with too little traffic.** Steps 4 and 5 compute the run time and stop anything over 6 weeks.
- **Peeking and stopping on the first green number.** Step 7 fixes the read date before launch.
- **Judging on conversion rate alone.** A variant can lift conversion and lose profit through smaller orders or more COD returns; Step 2 adds guardrails and gross profit per visitor.
- **Fishing in segments afterwards.** Step 2 names segments in advance.
- **Testing a bug.** Gate 2 sends repairs straight to the fix list.
- **Flicker passed off as a win.** Step 6 prefers server or URL splits.

## Sources

- CRO-0005: needed conversions depend mainly on the lift to detect.
- CRO-0007: check the traffic split; a mismatch voids the result.
- CRO-0008: browser-side tests flicker and can inflate lifts.
- CRO-0009: never test two prices for one product.
- CRO-0010: each extra metric raises false winners.
- CRO-0011: test type gated by monthly orders.
- CRO-0012: realistic lift sizes and win rates.
- CRO-0013: rank ideas by expected gross profit; two pieces of evidence.
- CRO-0014: revenue per visitor needs about six times the traffic.
- CRO-0015: whole weeks, at least two; flat means below the MDE.
- CRO-0016: Shopify checkout cannot be tested by browser tools.
- CRO-0017: peeking raises false winners to 26.1%.
- MEA-0002: GA4 conversion rate must be filtered to purchase.
- MEA-0012: Shopify sessions include bots.
- MEA-0037: gross margin is delivered cost.
- OFF-0015: decide on profit per session, not order value or conversion alone.

What makes this skill ours: the go or no-go on testing is computed from the page's own weekly traffic before anyone builds a variant; the ship decision is gross profit per visitor with COD share and RTO as guardrails; repairs are separated from tests; and a test that cannot finish in 6 weeks is turned into a bolder change or a labelled before and after instead of a months-long guess.
