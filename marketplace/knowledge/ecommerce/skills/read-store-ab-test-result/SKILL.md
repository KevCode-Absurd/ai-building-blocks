---
name: read-store-ab-test-result
description: "A plain verdict on a finished store split test: win, lose, unclear or invalid, with the checks that prove the result can be trusted, the lift with its range, the change in gross profit per visitor and per month, guardrail results, and exactly what to ship and how to watch it after. Works from the testing tool's export and the store's own orders, and catches the usual traps: stopping early, uneven traffic splits, segment fishing, novelty bumps and COD orders that never turn into cash. Use when a test has reached its planned end date, when someone claims a big win, or before rolling a variant out to all traffic."
---

# Store A/B test readout

**You get:** a one-page verdict (win, lose, unclear or invalid) on one finished store test, with the validity checks, lift and 95% range, gross profit impact per month, guardrail table, the ship decision and a 4-week watch plan, plus one row for the store's test log.

## When to use

- A store test has reached its planned sample or end date.
- A tool, agency or team member reports a winner and the owner wants to know if it is real.
- A variant is about to be rolled out to all traffic.
- Old test results are being reviewed before planning new ones.

## Not for

- Planning a test: use `design-store-ab-test`.
- Reading a Meta ad test: use `store-meta-test`.
- Calling winners among ad creatives: use `call-creative-test-winners`.
- Reading an email or text test: use `email-ab-test-plan`.

## What you need

Required (read access, level 1):

1. **The test plan** written before launch: hypothesis, primary metric, guardrails, pre-named segments, planned sample, dates. If none exists, say so in the first line; the best possible verdict becomes "unclear, not pre-registered".
2. **Tool export by variant and day:** visitors (users, not page views), primary metric events, orders and revenue.
3. **Shopify order export** for the test dates with the variant ID if the tool writes it to order notes or attributes: Name, Created at, Subtotal, Discount Amount, Shipping, Total, Payment Method, Financial Status, Lineitem sku.
4. **Gross profit per order** by SKU or average, from `build-sku-profit-sheet`.
5. **Refunds and RTO** for orders in the test window (India: wait at least 2 to 3 weeks after test end for COD outcomes).

Optional: device and source split per variant, change log for the test dates (promotions, ad changes, theme edits).

Shipping a variant to all traffic is a live theme change: draft access to prepare it (level 2), and the client's yes to publish.

## Before you start: the gates

1. **Planned end reached.** Pass when the planned sample or date was reached and nobody stopped it on a good day. Stopping at the first p under 0.05 lifts false winners from 5% to 26.1% [CRO-0017]. Fail: verdict is "invalid, stopped early"; plan a rerun.
2. **Traffic split is even.** Run the split check in Step 1. A mismatch means the result cannot be trusted until the cause is found [CRO-0007].
3. **Counts match.** Tool orders should be within about 5% of Shopify orders for the test pages and dates. Fail: find the gap (duplicate events, missed thank-you page, bot traffic) before any verdict.
4. **No contamination.** Check the change log: a sale, stock-out or theme edit that hit one variant more than the other voids the test.
5. **Gross profit per order known.** Fail: compute it; a verdict on conversion alone is not given.

## Steps

### 1. Check the traffic split

For a 50/50 test, expected visitors per arm = total / 2. Chi-square = sum over both arms of (observed - expected)^2 / expected. A value above 10.83 (p under 0.001) is a sample ratio mismatch: stop, look for redirects, bot filtering, flicker scripts or a variant that crashes on some browsers. About 6% of large-company experiments show this problem, so it is not rare [CRO-0007].

### 2. Compute the primary result

For each arm: conversion p = orders / visitors.

- Relative lift = (p_variant - p_control) / p_control.
- Standard error of the difference = square root of [p1 x (1 - p1) / n1 + p2 x (1 - p2) / n2].
- 95% range of the difference = difference plus or minus 1.96 x standard error. Convert both ends to relative lift.
- Significant at 95% when the range does not cross zero.

If the tool uses Bayesian or sequential statistics, report its number too, but use the plan's rule. Never switch rules after seeing the data.

### 3. Read the guardrails

For each guardrail named in the plan, show control, variant and change: order value, gross profit per order, refund rate, page speed, and for India COD share and RTO rate. Count refunds by order date for the test cohort, not by refund date; Shopify books returns on the refund date, which can hide a variant's returns [MEA-0011]. A breach of a pre-set limit turns a win into "do not ship" regardless of conversion.

### 4. Turn it into money

- Gross profit per visitor = conversion x gross profit per order, per arm [OFF-0015].
- Monthly impact = (variant GP per visitor - control GP per visitor) x monthly visitors to the page.
- Report three numbers: at the low end of the 95% range, the middle, and the high end. Plan with the low end: tests that just cross the line tend to overstate the true lift.
- If order values differ a lot between arms, do not rely on a revenue-per-visitor read unless the test was sized for it; it needs about six times the traffic [CRO-0014].

### 5. Check pre-named segments only

Read only the segments named in the plan (usually mobile versus desktop). A blended win can hide a mobile loss; if the plan named that split and the mobile range sits below zero, ship to desktop only or rework mobile. Do not search other segments for a winner: each extra cut raises the false winner rate [CRO-0010]. Unplanned patterns go into the log as ideas for the next test.

### 6. Check for novelty

Plot the daily lift. If week one carries the whole effect and later weeks are flat, the change may be a novelty bump. Verdict stays as computed, but the watch plan in Step 8 gets a stricter check.

### 7. Give the verdict

| Verdict | When | What to do |
|---|---|---|
| **Win** | Primary range above zero, GP per visitor up, no guardrail breach | Ship the variant |
| **Lose** | Primary range below zero, or a guardrail breach | Keep control; log why |
| **Unclear** | Planned sample reached, range crosses zero | The effect is smaller than the MDE [CRO-0015]: keep whichever is cheaper to run, do not extend |
| **Invalid** | Stopped early, split mismatch, counts off, contaminated | No decision; fix and rerun only if still worth it |

Expect most tests to lose or be unclear; a 30 to 35% win rate is very good [CRO-0020]. A lift above 50% should be retested or held back with a small holdout before it is banked [CRO-0012].

### 8. Ship and watch

- **What to ship:** the exact variant, on which devices and pages, built natively in the theme rather than left running in the test tool (the tool adds script weight).
- **Watch for 4 weeks:** weekly conversion and GP per visitor for the page against the test's low-end estimate. Revenue swings of about 10% from order value and conversion together are usually noise [MEA-0009]; act only if the page falls below the control's test level two weeks running.
- **Holdout:** for big or surprising wins, keep 10% of traffic on control for 4 more weeks (practitioner default, test it).

### 9. India and US notes

- **India:** read the primary on delivered or prepaid-plus-confirmed orders when COD share is meaningful. A variant that lifts COD orders but also lifts RTO can lose money; recompute GP per visitor after RTO.
- **US:** check that tax and shipping shown later in checkout did not differ between arms (for example, a variant promising free shipping that checkout then charged).

## Checks before you hand it over

- The verdict is one of win, lose, unclear or invalid, stated in the first line.
- The split check result is shown with its numbers.
- Lift is given with its 95% range, not as a single number.
- Money impact uses gross profit per visitor, with the low-end figure used for planning.
- Every guardrail in the plan has a row with control, variant and limit.
- Only pre-named segments are reported as findings.
- The ship decision names exact pages and devices, and needs the client's yes.
- The test log row is filled.

## Output

**One-screen verdict:** "Verdict: [win, lose, unclear, invalid]. [Variant] changed orders per visitor by [x]% (95% range [a]% to [b]%). Gross profit per visitor moved [from, to]: about [low] to [high] a month. Ship: [what, where]. Watch: [metric, threshold, 4 weeks]."

**Readout table:**

| Item | Control | Variant | Change | Range or limit | Pass |
|---|---|---|---|---|---|
| Visitors | | | | split check chi-square | |
| Orders | | | | | |
| Conversion | | | | 95% range | |
| Order value | | | | guardrail limit | |
| GP per order | | | | guardrail limit | |
| GP per visitor | | | | | |
| Refund or return rate | | | | guardrail limit | |
| COD share and RTO (India) | | | | guardrail limit | |
| Mobile conversion (if pre-named) | | | | | |

**Daily lift chart** with test start and end marked.

**Test log row:** Test ID, Page, Hypothesis, Dates, Visitors per arm, Primary result and range, Guardrails, Verdict, Shipped (yes or no, date), 4-week watch result, Lesson.

## Common mistakes

- **Calling a winner from a dashboard screenshot.** Gate 1 and Step 1 check how and when the test stopped and whether the split held.
- **One-number lifts.** Step 2 always gives the range; Step 4 plans on its low end.
- **Revenue winners that lose profit.** Step 4 converts to gross profit per visitor; Step 3 blocks guardrail breaches.
- **Finding a winning segment after a flat test.** Step 5 reads only planned segments.
- **Extending an unclear test to "get significance".** Step 7 treats a fully powered flat result as an answer.
- **Leaving the winner running inside the test tool.** Step 8 builds it natively.

## Sources

- CRO-0007: check the split; about 6% of experiments show a mismatch.
- CRO-0010: extra metrics and segments raise false winners.
- CRO-0012: realistic lifts; retest claims above 50%.
- CRO-0014: revenue per visitor needs about six times the traffic.
- CRO-0015: a fully powered flat test means the effect is below the MDE.
- CRO-0017: stopping at first significance inflates false winners.
- CRO-0020: a 30 to 35% win rate is very good.
- MEA-0009: about 10% swings from order value and conversion are usually noise.
- MEA-0011: Shopify books returns on the refund date.
- OFF-0015: judge on profit per session.

What makes this skill ours: the verdict has four outcomes, including "invalid", with the split check done by hand from the export; the money is gross profit per visitor planned on the low end of the range; refunds and COD returns are counted by order cohort, after the RTO window; and the winner is rebuilt in the theme and watched for 4 weeks instead of being left running in a tool.
