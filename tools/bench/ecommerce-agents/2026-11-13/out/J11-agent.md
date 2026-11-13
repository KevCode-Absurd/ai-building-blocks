# Memory foam mattress page: the first five tests

**Summary.** Phones bring 84% of sessions but convert 0.56%, against 1.44% on desktop: about ₹34 gross profit per session against ₹88. The biggest loss is before add to cart on phones, so the size picker goes first. Five tests run in two lanes over 12 weeks, each 4 full weeks at 50/50, each able to detect a 10 to 12% lift in orders per visitor.

## Where the page loses money

| Step (last 30 days) | Phone | Desktop |
|---|---|---|
| Session to add to cart | 4.0% | 6.5% |
| Add to cart to checkout | 42.3% | 50.0% |
| Checkout to order | 33.1% | 44.2% |
| Session to order | 0.56% | 1.44% |

Gross profit per order: ₹14,500 × 42% = ₹6,090.

If phones matched desktop at one step: add to cart would bring about 1,470 more orders a month (₹89 lakh gross profit); checkout to order about 790 (₹48 lakh); add to cart to checkout about 430 (₹26 lakh). These size the gap, not a forecast.

## The five tests, ranked

| Rank | Test | Who | Run | Detects |
|---|---|---|---|---|
| 1 | Two-step size picker | Phone | 4 weeks | 12% lift |
| 2 | 100-night trial under Add to cart | All | 4 weeks | 10% |
| 3 | Delivery date before Add to cart | All | 4 weeks | 10% |
| 4 | EMI and COD under the price | All | 4 weeks + 3 to settle | 10% |
| 5 | Mattress-first hero image | All | 4 weeks | 10% |

Ranked by visitors affected, gap size and evidence; build effort breaks ties.

**Calendar.** Two lanes, each splitting visitors on its own:

- 30 Nov to 27 Dec 2026: Tests 1 and 2.
- 28 Dec to 24 Jan: Tests 3 and 5.
- 25 Jan to 21 Feb: Test 4, read on 14 Mar once COD orders settle.

Paired tests change different parts of the page; Tests 3 and 4 share space under the price, so never run together. Runner-up plan: one test at a time, simpler but 20 weeks.

## Test 1. Two-step size picker on phones

- **Problem and evidence:** 30+ sizes in one long list; price shows only after choosing. Phone add to cart is 4.0% against 6.5% on desktop, the widest gap and largest pool of money.
- **Change:** large tap buttons, one choice per row: width group (for example Single, Double, Queen, King), then length, then thickness where offered. "How to measure your bed" link beside length.
- **Hypothesis:** one choice at a time gets more phone shoppers to a price, so orders per phone visitor rise at least 12%.
- **Metric and guardrails:** orders per phone visitor; add to cart is an early sign only. Guardrails: average order value (a new layout can nudge buyers to smaller sizes); wrong-size returns.
- **Split and run:** 50/50 of phone visitors, 4 weeks, about 196,000 per version. Detects 0.56% rising to 0.63%: about 280 orders, ₹17 lakh gross profit a month.

## Test 2. 100-night trial under Add to cart

- **Problem and evidence:** the trial answers the main risk of buying a mattress unseen, yet sits only in the bottom FAQ. 96% of phone sessions leave without adding to cart.
- **Change:** one line under the button: "100-night trial" and how a return works, in your policy's words, linked to the terms.
- **Hypothesis:** seeing the trial while deciding removes the risk of buying unseen, so orders per visitor rise at least 10%.
- **Metric and guardrails:** orders per visitor. Guardrails: trial return rate, average order value. Returns take 100 nights, so ship a win provisionally, compare each version's returns in mid-April 2027, and remove the line if they wipe out the profit gain.
- **Split and run:** 50/50 of all visitors, 4 weeks, about 233,000 per version. Detects 0.70% rising to 0.77%: about 350 orders and ₹21 lakh a month before returns.

## Test 3. Delivery date before Add to cart

- **Problem and evidence:** the date first appears at checkout. Monthly, 4,750 phone and 1,450 desktop checkouts end without an order; phones finish 33.1% against 44.2%.
- **Change:** a pincode box beside the price once a size is chosen, showing "Delivery by" a specific date from the data checkout already uses.
- **Hypothesis:** with the date known early, nothing surprises shoppers at checkout, so orders per visitor rise at least 10%. Add to cart may dip; fine if orders rise.
- **Metric and guardrails:** orders per visitor. Guardrails: deliveries on or before the promised date; cancellations before dispatch.
- **Split and run:** 50/50 of all visitors, 4 weeks, about 233,000 per version, 10% lift.

## Test 4. EMI and COD under the price

- **Problem and evidence:** both appear only at checkout. At ₹14,500, a monthly amount and pay-on-delivery reassure, but arrive after the decision. Same checkout loss as Test 3.
- **Change:** one line under the price: the lowest monthly EMI your partner offers for the chosen size, then "Cash on delivery available". Say "no-cost" only if true.
- **Hypothesis:** seeing easier ways to pay while deciding makes the price feel manageable, so delivered orders per visitor rise at least 10%.
- **Metric and guardrails:** delivered orders per visitor (uncancelled prepaid plus delivered COD), since COD is not money until it arrives. Guardrails: COD share; return-to-origin rate.
- **Split and run:** 50/50 of all visitors, 4 weeks plus 3 to settle. Detects about 10% if delivered orders run near 0.70% per visitor, 11% near 0.56%.

## Test 5. Mattress-first hero image

- **Problem and evidence:** the first image is a bedroom with the mattress small in frame, so a phone's first screen shows a room, not the product. Weakest evidence (one page observation), so fifth.
- **Change:** first image shows the mattress filling the frame, edge-on so its layers show; the bedroom scene moves to tile two.
- **Hypothesis:** seeing the product first helps shoppers judge it, so orders per visitor rise at least 10%.
- **Metric and guardrails:** orders per visitor. Guardrails: phone load time; average order value.
- **Split and run:** 50/50 of all visitors, 4 weeks, 10% lift.

## How every test runs

- **Sample size:** visitors per version = 16 × (1 − p) ÷ (p × r²), with p the baseline orders per visitor and r the lift. This shortcut gives 95% confidence and 80% power; confirm in a calculator.
  - Phones: 16 × 0.9944 ÷ (0.0056 × 0.12²) ≈ 197,000. Two versions ÷ 98,000 a week = 4.0 weeks.
  - All: 16 × 0.993 ÷ (0.007 × 0.10²) ≈ 227,000. Two versions ÷ 116,700 a week = 3.9, so 4 weeks.
- **Plain words:** 95% confidence means about a 1 in 20 chance of crowning a false winner. 80% power means a real lift of the stated size is caught 4 times in 5.
- **Split:** by visitor, 50/50, server-side or by theme template; browser tools flash the old page and can inflate lifts.
- **Stop rule:** read once, at the planned end. Stop early only if a version breaks or gross profit per order falls over 10%. Check the split is near 50/50 on day 2 and at the end; a mismatch voids the result.
- **Ship rule:** ship when orders per visitor win at 95% confidence and gross profit per visitor rises with no guardrail breached. Flat: keep the cheaper version.
- **Reading:** cut by phone and desktop only; extra cuts raise false winners. Check each paired test within each version of the other.

## Ship without testing

- **Rating beside the title:** 4.5 stars and 20,000+ reviews on the first screen, tapping to the reviews. True, already on the page, and with no cost risk, unlike the trial.
- **Hero loading:** first image compressed, not lazy-loaded.
- **Tracking:** before 30 Nov, check the testing tool's order count is within about 5% of store orders.

## Assumptions

- Weekly traffic is 30-day sessions × 7 ÷ 30 (98,000 phone, 18,700 desktop), treated as visitors; rerun on unique visitors before launch.
- ₹6,090 excludes delivery, payment fees and trial returns; true profit is lower, but the ranking holds.
- No sale falls in a test window; if one does, the readout says so.
- Pincode delivery dates and EMI terms come from the systems checkout already uses.
