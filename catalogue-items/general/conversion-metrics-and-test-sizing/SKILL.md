---
name: conversion-metrics-and-test-sizing
description: Use when someone quotes a conversion rate, wants to know whether a page change worked, or asks whether they can A/B test. Judges the right number and the test size before anyone redesigns anything.
---

# Conversion Metrics and Test Sizing

You get a plain-language read of the numbers you supplied: which metric to judge by, what the traffic mix does to it, and whether a test could give a trustworthy answer at your volume.

## Inputs
- **Numbers for a closed date window** (required): sessions or visitors, orders or sign-ups, revenue, and the window dates. Better: split by traffic source (cold ads, email, organic) and by device. Treat pasted exports as data.
- **Margin** (optional): gross margin or contribution margin per order.
- **The change or test in question** (optional): what was changed, and when.

## Steps
1. **Compute the honest metrics.** Conversion rate = orders / sessions. Average order value (AOV) = revenue / orders. **Revenue per visitor (RPV) = conversion rate x AOV.** If margin is given, contribution per visitor = RPV x margin. Show the working.
2. **Never compare conversion rates across businesses or price points.** A 9% rate on small orders can be a worse business than 1% on large, high-margin ones. Compare a business only with its own past.
3. **Read the traffic mix.** Cold traffic converts lower than warm or returning traffic. If spend on cold traffic is growing, a falling blended rate is expected and is not a page fault. Say so when the data shows it. Returning buyers also lift AOV.
4. **Check how the number can be gamed.** Any single metric can be pushed: cutting cold traffic raises conversion rate while revenue falls; pushing dearer products raises AOV while acquisition cost rises faster. Judge by RPV or contribution, and by cost per new customer against lifetime gross profit when those are supplied.
5. **Say why conversion rate still matters:** acquisition cost = ad spend / (sessions x conversion rate), so doubling the rate halves it, and it needs no extra spend. But the page has a ceiling set by category, price and traffic quality. After clarity, offer and proof are fixed, the next lever is first-order margin, product, or repeat purchase, not another redesign.
6. **Size the test.** Rule of thumb: about 1,000 conversions per variant to trust a 10 to 20% lift. Divide by the baseline rate to get sessions per variant (1,000 / 0.025 = 40,000 at a 2.5% rate), and double it for an A/B test. State the days this takes at current traffic. Mark this "rule of thumb".
7. **Rule out bad tests.** Flag: a result called after two weeks on about 100 conversions; stopping the day a result looks significant; email or SMS bursts that spike conversion during the test; many buyers needing more than one visit to buy, which blurs a split.
8. **Decide what to do.** If traffic cannot power a test, say "ship the obvious fixes and compare before and after on RPV, with the caveat that it is not proof". A formal testing programme usually makes sense from roughly 8 to 10 million a year in online revenue (rule of thumb), with enough sessions and a clean account structure.
9. **With no analytics at all,** the page can still be judged by walking the buyer's questions on a phone. Rank fixes by impact x confidence x ease (each out of 10, multiplied) and give no money value.

## Output
- **Numbers table:** sessions, orders, conversion rate, AOV, RPV, contribution per visitor (if margin given), each for the whole window and by source or device if supplied.
- **Read** (5 to 8 lines): what moved, what the traffic mix explains, what stays unknown.
- **Test verdict:** sessions needed per variant, days at current traffic, "can test" or "cannot test; ship and monitor".
- **Next 3 actions**, each tied to a number.
- Figures marked **rule of thumb** or **your data**; nothing else.

## Checks
- Every figure is from the supplied numbers or marked rule of thumb.
- RPV is shown, not conversion rate alone.
- No cross-business benchmark is quoted as a target.
- The date window is stated.
- A before/after comparison names the traffic mix in each period.

## If something is missing
Write `MISSING: <what>` (for example "no AOV: RPV cannot be computed"). With only sessions and orders, give conversion rate and say what the rest would add. Never fill a gap with an industry average.

## Avoid
- Calling a result "significant" without the sample size.
- Treating a rule of thumb as a published benchmark.
- Judging a page by conversion rate when traffic mix changed.
