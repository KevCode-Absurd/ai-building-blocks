---
name: read-store-ab-test-result
description: "A plain verdict on a finished store split test: win, lose, unclear or invalid, with the checks that prove the result can be trusted, the measured lift with its range set against the plan's expected lift and smallest detectable effect, the change in gross profit per visitor and per month (an earlier-step lift carried to orders only through the store's own pass-through rate, one baseline per traffic scope), guardrail results, what to ship, and the answer the objection still needs if the test did not win. Catches the usual traps: stopping early, uneven splits, segment fishing, novelty bumps and pay-on-delivery or returned orders that never turn into cash. Use when a test reaches its planned end week, when someone claims a big win, or before rolling a variant out."
---

# Store A/B test readout

**You get:** a one-page verdict (win, lose, unclear or invalid) on one finished store test, with the validity checks, lift and 95% range, gross profit impact per month, guardrail table, the ship decision and a 4-week watch plan, plus one row for the store's test log.

## When to use

- A store test has reached its planned sample or end week.
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

1. **The test plan** written before launch: the objection it answers, hypothesis, visitors in scope, primary metric, guardrails, pre-named segments, expected lift, MDE, planned sample, start week and run time. If none exists, say so in the first line; the best possible verdict becomes "unclear, not pre-registered".
2. **Tool export by variant and day**, for visitors in scope only: visitors (users, not page views), primary metric events, add to carts, orders and revenue.
3. **Shopify order export** for the test window with the variant ID if the tool writes it to order notes or attributes: Name, Created at, Subtotal, Discount Amount, Shipping, Total, Payment Method, Financial Status, Lineitem sku.
4. **Gross profit per order** by SKU or average, from `build-sku-profit-sheet`.
5. **Refunds, returns and failed deliveries** for orders in the test window (wait for the return window to close, and at least 2 to 3 weeks after test end where pay on delivery is offered).

Optional: device and source split per variant, change log for the test weeks (promotions, ad changes, theme edits).

Shipping a variant to all traffic is a live theme change: draft access to prepare it (level 2), and the client's yes to publish.

## Before you start: the gates

1. **Planned end reached.** Pass when the planned sample or end week was reached and nobody stopped it on a good day. Stopping at the first p under 0.05 lifts false winners from 5% to 26.1% [CRO-0017]. Fail: verdict is "invalid, stopped early"; plan a rerun.
2. **Traffic split is even.** Run the split check in Step 1. A mismatch means the result cannot be trusted until the cause is found [CRO-0007].
3. **Counts match.** Tool orders should be within about 5% of Shopify orders for the test pages and weeks. Fail: find the gap (duplicate events, missed thank-you page, bot traffic) before any verdict.
4. **No contamination.** Check the change log: a sale, stock-out or theme edit that hit one variant more than the other voids the test. A change that hit both arms (a sitewide offer, a tracking fix, a new ad) does not void it by itself, but the read must follow Step 1b before any verdict.
5. **Gross profit per order known.** Fail: compute it; a verdict on conversion alone is not given.

## Steps

Follow the house rules, chiefly **Look it up before you decide**, **Only the brief's facts run the business**, **One basis per number** and **Write for a busy owner**. Run `node tools/ask-knowledge.mjs` once per verdict question (split, lift, guardrails, what next), logged in `context/trace.md`; every figure goes in `context/numbers.json`. Weeks count from the test's start week; a calendar date only when the brief gives one.

### 1. Check the traffic split

For a 50/50 test, expected visitors per arm = total / 2. Chi-square = sum over both arms of (observed - expected)^2 / expected. A value above 10.83 (p under 0.001) is a sample ratio mismatch: stop, look for redirects, bot filtering, flicker scripts or a variant that crashes on some browsers. About 6% of large-company experiments show this problem, so it is not rare [CRO-0007].

### 1b. When something changed mid-run

If the offer, price display, tracking, page or traffic source changed while the test ran, do this before computing anything:

1. **Freeze the original question.** Write the test's question, its one variable, the split method, the visitors in scope, the event definitions and the stop rule as planned. Never rewrite the question after seeing the numbers.
2. **Map each change to a dated boundary.** For every change: what changed, the date and hour it went live (with the time zone), and which arm or arms it touched. If a change time is unknown, say so; do not guess one.
3. **Build the comparison map.** Split the run into periods at each boundary. For each period mark: clean (both arms saw identical conditions apart from the tested change), confounded (the arms differed in more than the tested change) or unusable (no reliable link between results and versions). Keep the visitors and orders of every excluded period visible; never pick the period that flatters the variant.
4. **Read only what the map supports.** Compute the primary result for each clean period that on its own reached a useful sample, and show the whole-run totals beside it. A clean period that is short is reported as "inconclusive, too small". A before and after comparison across a boundary is not a test result.
5. **Plan the restart if needed.** If no clean period reached the sample: verdict "invalid, changed mid-run". Hand back a restart plan: the same question and variable, the conditions to hold fixed (offer, price display, tracking, traffic sources), a change freeze on the test pages for the full run, a new start week and the sample from `design-store-ab-test`. Fix any copy or tracking defect found first, on both arms.

### 2. Compute the primary result

For each arm: p = primary events / visitors in scope. Use one baseline per traffic scope: the control rate from the same device, browser or source the test covered, never a sitewide or all-device rate.

- Relative lift = (p_variant - p_control) / p_control.
- Standard error of the difference = square root of [p1 x (1 - p1) / n1 + p2 x (1 - p2) / n2].
- 95% range of the difference = difference plus or minus 1.96 x standard error. Convert both ends to relative lift.
- Significant at 95% when the range does not cross zero.

If the tool uses Bayesian or sequential statistics, report its number too, but use the plan's rule. Never switch rules after seeing the data.

Set the measured lift beside two numbers from the plan, named as such: the **expected lift** (the forecast) and the **smallest detectable effect** (MDE, the smallest lift worth shipping, which sized the test). They are different numbers; a result can beat the forecast and still sit below the MDE.

### 3. Read the guardrails

For each guardrail named in the plan, show control, variant and change: order value, gross profit per order, refund rate, page speed, and, where offered, pay-on-delivery share and failed delivery rate. Count refunds by order date for the test cohort, not by refund date; Shopify books returns on the refund date, which can hide a variant's returns [MEA-0011]. A breach of a pre-set limit turns a win into "do not ship" regardless of conversion.

### 4. Turn it into money

- Gross profit per visitor = orders per visitor x gross profit per order, per arm [OFF-0015].
- When the primary sat before the order (add to cart, checkout start), the lift reaches orders only through that step's pass-through rate from this test's own data: extra orders = extra add to carts x the add-to-cart-to-order rate in scope. Never apply an add-to-cart lift straight to orders; read the order guardrail instead.
- Monthly impact = (variant GP per visitor - control GP per visitor) x monthly visitors in scope.
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

**The objection still needs an answer.** If the test answered an objection above about 10% of chats or returns and did not win, name the direct fix to ship now (the plain fact in the bullets and the line by the button) or the next test, in one line. The objection is not closed until one of them is live.

### 8. Ship and watch

- **What to ship:** the exact variant, on which devices and pages, built natively in the theme rather than left running in the test tool (the tool adds script weight).
- **Watch for 4 weeks:** weekly conversion and GP per visitor for the page against the test's low-end estimate. Revenue swings of about 10% from order value and conversion together are usually noise [MEA-0009]; act only if the page falls below the control's test level two weeks running.
- **Holdout:** only for a lift above 50% or when the brief asks, keep 10% of traffic on control for 4 more weeks (practitioner default, test it).
- Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` and fix every FAIL before hand-over.

### 9. Market notes

- **Pay on delivery and high-return categories:** read the primary on delivered, kept orders when the pay-on-delivery share or return rate is meaningful. A variant that lifts orders but also lifts failed deliveries or returns can lose money; recompute GP per visitor after them.
- **Every market:** check that tax, duties and shipping shown later in checkout did not differ between arms (for example, a variant promising free shipping that checkout then charged).

## Checks before you hand it over

- The verdict is one of win, lose, unclear or invalid, stated in the first line.
- The split check result is shown with its numbers.
- Lift is given with its 95% range, beside the expected lift and the MDE as two separate numbers.
- Every rate uses the control baseline from the test's own scope.
- An earlier-step lift reaches orders only through this test's pass-through rate.
- A test that answered a big objection and did not win names the direct fix or next test.
- Money impact uses gross profit per visitor, with the low-end figure used for planning.
- Every guardrail in the plan has a row with control, variant and limit.
- Only pre-named segments are reported as findings.
- The ship decision names exact pages and devices, and needs the client's yes.
- The test log row is filled.
- Any mid-run change has a dated boundary, each period is marked clean, confounded or unusable, and excluded totals are shown.
- No verdict rests on a before and after comparison, or on a period chosen after seeing the numbers.

## Output

**One-screen verdict:** "Verdict: [win, lose, unclear, invalid]. [Variant] changed orders per visitor by [x]% (95% range [a]% to [b]%), against an expected [e]% and an MDE of [m]%. Gross profit per visitor moved [from, to]: about [low] to [high] a month. Ship: [what, where]. Watch: [metric, threshold, 4 weeks]." Then each decision in two lines: what to do, and why with one number.

**Readout table:**

| Item | Control | Variant | Range or limit | Pass |
|---|---|---|---|---|
| Visitors in scope | | | split check chi-square | |
| Orders | | | | |
| Primary metric | | | 95% range; expected lift and MDE | |
| Order value | | | guardrail limit | |
| GP per order | | | guardrail limit | |
| GP per visitor | | | | |
| Refund or return rate | | | guardrail limit | |
| Pay-on-delivery share and failed deliveries (if offered) | | | guardrail limit | |
| Mobile result (if pre-named) | | | | |

**Daily lift chart** with test start and end marked.

**Test log row:** Test ID, Page, Objection answered, Hypothesis, Start week and run time, Visitors per arm, Primary result and range, Expected lift, MDE, Guardrails, Verdict, Shipped (yes or no, week), 4-week watch result, Lesson.

## Common mistakes

- **Calling a winner from a dashboard screenshot.** Gate 1 and Step 1 check how and when the test stopped and whether the split held.
- **One-number lifts.** Step 2 always gives the range; Step 4 plans on its low end.
- **Revenue winners that lose profit.** Step 4 converts to gross profit per visitor; Step 3 blocks guardrail breaches.
- **Finding a winning segment after a flat test.** Step 5 reads only planned segments.
- **Extending an unclear test to "get significance".** Step 7 treats a fully powered flat result as an answer.
- **Leaving the winner running inside the test tool.** Step 8 builds it natively.
- **Picking the good week after an offer changed mid-test.** Step 1b maps every change and reads only clean periods, with excluded totals shown.
- **Reading the MDE as the forecast, or an add-to-cart lift as an order lift.** Steps 2 and 4 keep each number in its place.

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

What makes this skill ours: the verdict has four outcomes, including "invalid", with the split check done by hand from the export; the money is gross profit per visitor planned on the low end of the range; refunds, returns and failed deliveries are counted by order cohort, after the return window; and the winner is rebuilt in the theme and watched for 4 weeks instead of being left running in a tool.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Wait at least 2 to 3 weeks after test end for COD outcomes. When COD share is meaningful, read the primary on delivered or prepaid-plus-confirmed orders; a variant that lifts COD orders but also lifts RTO can lose money, so recompute GP per visitor after RTO.
