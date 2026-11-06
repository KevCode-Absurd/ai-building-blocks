---
name: geo-holdout-lift-test
description: Plans and reads a test of what a channel really adds - a regional holdout, a synthetic-control test for few regions, or a Google or Meta lift study - with the regions, length, noise check, decision rule and approvals written before launch, then works out the lift from before-and-during sales with the sums shown, a range from placebo checks, and a keep, cut or retest call. Use when a channel's value is in doubt (brand search, retargeting, a social channel), before a big budget cut or increase, or to calibrate a media mix model.
---

# Geo holdout lift test

Attribution shares credit; a lift test measures cause. The simplest honest test for a small or mid-sized business is to change a channel in some regions and not others, then compare. This skill plans that test so it can actually answer the question, and reads it without overclaiming.

## When to use

- "Is brand search / retargeting / Meta really adding sales, or would those people buy anyway?"
- Before cutting or doubling a channel that is a large share of spend.
- A platform's lift study is offered and you want it set up and read properly.
- A media mix model needs a test result to calibrate it.

Not for: channels too small to move sales measurably, or businesses with one region and no way to split users. Then use a platform lift study or an on-off time test, labelled as weaker evidence.

## What you need

1. The question and the decision it feeds ("If brand search adds less than X, move its budget to Y").
2. At least six months of weekly sales by region (more is better), from the backend, plus spend by region for the channel.
3. A list of regions the channel can target separately (countries, states, metro areas or postcode groups).
4. Known events in the period: promotions, stock-outs, price changes, store openings.
5. The client's margin, to turn lift into money.

**Access:** level 1 to read sales and spend by region and to plan; level 2 to set up the location changes or the lift study in the ad platform without applying or starting them; level 3 to apply the agreed regional pauses or start the agreed lift study, within the spend cap and dates, and to restore them at the end. Starting the test always follows one confirmation of the action list. Any change outside the agreed regions or dates needs a fresh yes.

## Steps

### 1. Write the question and decision rule first
State the channel, what changes (pause, halve, double), the outcome (backend orders or revenue, not platform conversions), the smallest lift worth knowing, and what you will do at each result: keep, cut, or retest. Write it before launch and do not change it after.

### 2. Pick the method
- **Many comparable regions:** split them into test and control. Randomise the split, then check the groups' past sales track each other; re-draw if they don't.
- **Few regions or one big one:** synthetic control (for example Meta's open-source GeoLift), which weights several untouched regions to track the test region before the change.
- **Platform lift study:** Google Ads Conversion Lift (user-based or geography-based, not open to every account) or a Meta conversion lift study. Useful when the platform can hold out people inside regions. Keep your backend check alongside.
- **No split possible:** a before-and-after with a counterfactual from control series (the CausalImpact method). Label it weaker.

### 3. Check the noise before you commit
Take the past weekly ratio of test-region sales to control-region sales. If that ratio swings by more than the lift you hope to detect, the test cannot see it. Then test a bigger change, use more regions, run longer, or accept that the answer will be a wide range. Say this in writing before launch. Ad effects are small next to normal sales swings, which is why many tests come back unclear.

### 4. Set the length
Cover at least one full buying cycle, plus time for carryover after ads stop. Avoid big promotions and holidays, or put them in both groups. Fix the start and end dates now.

### 5. Prepare and get approval
List the exact actions: which campaigns, which regions excluded or paused, the spend that stays and goes, the dates, and how it is restored. At level 2, build it without applying. At level 3, show the list and wait for one yes. Tell whoever runs the channel not to "fix" the drop mid-test.

### 6. Run and log
Check daily for the first week: are the exclusions working, is spend in holdout regions near zero, has anything else changed? Log every action and anything odd (stock-outs, outages, a competitor's sale). Stop and ask if spend spikes or results look broken.

### 7. Read the result
Using backend sales by region and week:
1. **Before ratio** = holdout regions' sales ÷ ad regions' sales, over the pre-period.
2. **Expected holdout sales** during the test = ad regions' sales during × before ratio.
3. **Lost sales** = expected − actual holdout sales. **Lift** = lost ÷ expected.
4. **Range:** repeat steps 1 to 3 as if the test had started at several earlier dates when nothing changed (placebo runs). The spread of those fake "lifts" shows the noise; report the real lift against it.
5. **Money:** incremental revenue ÷ the spend that would have run in the holdout regions gives incremental return; multiply by margin before judging.

### 8. Make the call
Keep, cut or retest, by the rule written in step 1. If the result sits inside the placebo spread, the answer is "unclear", with the volume or length that would settle it. Feed the result to the budget plan and, if the client has one, the media mix model as a calibration point.

## Checks

- Question, outcome, decision rule, regions and dates were written before launch.
- Outcome is backend sales, not platform-reported conversions.
- Test and control tracked each other before the test.
- The noise check was done and its limit stated.
- Lift is reported with a range and the working.
- Contribution margin, not revenue, decides whether the channel pays.
- Every live action was approved and logged, and the channel was restored on time.

## Output format

**Plan:** question and decision rule; method and why; regions in each group with the pre-period fit; noise check; dates; exact actions and access level; who approves.

**Readout:** table of sales by group before and during; expected, actual, lost; lift and placebo range; incremental revenue, margin and return; the call; what to do next.

## Example of good output (short)

*Made-up business: Halden Outdoor, selling camping gear in six regions. Figures are invented for illustration.*

> **Test:** Google brand search paused in regions B, D and F for 4 weeks (randomly drawn); A, C and E kept running.
>
> **Before (8 weeks):** holdout 9,840 orders, ad regions 10,250. Ratio 0.96.
> **During (4 weeks):** ad regions 5,300 orders, so expected holdout = 5,300 × 0.96 = 5,088. Actual holdout: 4,990.
> **Lost orders:** 98, a lift of 1.9%. Placebo runs on earlier dates gave fake lifts between −2.4% and +2.6%.
>
> **Call: unclear, leaning small.** The real result sits inside the noise. Brand search spend in the holdout regions would have been £3,600. Even if the true lift were as high as 2.6% (about 132 orders at £21 margin each, roughly £2,770), the margin would not cover that spend. Recommendation: keep brand search paused in B, D and F for four more weeks to narrow the range before deciding for all regions (needs your yes to extend the dates).
