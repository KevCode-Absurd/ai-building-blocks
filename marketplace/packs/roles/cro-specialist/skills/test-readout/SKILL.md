---
name: test-readout
description: Reads a finished or running A/B test from the client's counts and gives a clear call (ship, keep running, stop or rerun) with every sum shown - sample ratio check by chi-square, rates with counts, absolute and relative lift, two-proportion z-test and p-value, 95% interval, Bonferroni or Holm correction for several variants, money per 1,000 visitors, novelty and segment notes - and an honest read of before-and-after changes with no control group. Use when a test ends, when someone asks "did it win?", or before shipping a variant at level 3.
---

# Test readout

The readout is where good tests are wasted: a broken split goes unchecked, a segment is promoted to a "win", or a lift that is noise gets shipped. This skill checks the set-up before any maths, shows every sum with the client's own counts, and puts the decision first in plain words.

## When to use

- A test has reached its planned sample or end date.
- Someone wants to stop a running test early.
- A test had three to five variants.
- A change went live with no control group, and the client asks if it worked.
- Before shipping a variant at level 3.

## What you need

**Access:** level 1 to read results. Level 3 to ship the winner or stop the test, only if the decision rule agreed before launch says so.

- The test plan: hypothesis, primary metric, guardrails, planned split, planned sample or end date, decision rule.
- Counts per variant: visitors (or the unit randomised) and conversions for the primary metric; guardrail figures.
- Daily counts, if available, to check novelty.
- Value per conversion, if the client wants money figures.
- Anything that changed during the test (promotions, prices, outages, traffic sources).

## Steps

1. **Restate the test.** What changed, the primary metric, the planned split, the dates, and the decision waiting on it. If the primary metric is unclear, pick the one closest to money and say so.
2. **Check the set-up before any maths.**
   - *Split check:* compare actual group sizes with the planned split using a chi-square goodness-of-fit test: χ² = Σ (observed − expected)² ÷ expected, one degree of freedom for two groups. A very small p-value means a sample ratio mismatch; stop and find the cause before reading results.
   - Did the test run whole weeks? Did anything change mid-test? Was it stopped early after a peek?
3. **Rates with counts.** For each variant: conversions ÷ visitors, written out.
4. **Lift.** Absolute difference (percentage points) and relative difference (%).
5. **Significance for two variants.** Two-proportion z-test with a pooled rate:
   - pooled p = (c₁ + c₂) ÷ (n₁ + n₂)
   - SE = √[ pooled p × (1 − pooled p) × (1/n₁ + 1/n₂) ]
   - z = (p₂ − p₁) ÷ SE, then the two-sided p-value.
   - For small counts, use Fisher's exact test instead.
6. **Interval.** 95% interval for the difference: (p₂ − p₁) ± 1.96 × √[ p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ ].
7. **Several variants.** Compare each with the control. Bonferroni: use α ÷ number of comparisons for each. Holm's step-down method (Holm, 1979): sort p-values from smallest, compare the smallest with α ÷ m, the next with α ÷ (m − 1), and so on, stopping at the first that fails. Say which you used and why.
8. **Money.** If a value per conversion is given: lift per 1,000 visitors × value, with the interval's low and high ends.
9. **Novelty.** Plot or list the daily difference. A lift that shrinks day by day may be novelty; say so and suggest waiting or rerunning.
10. **Too good to be true.** If the lift is far larger than the plan expected, check tracking and rerun before shipping (Twyman's law).
11. **Segments.** Treat any segment result as a hypothesis for the next test, never as the result. Flag small groups.
12. **Running test or before-and-after.** For a running test: what is missing, and how many more visitors or days the planned sample needs. For a before-and-after change: say it cannot separate the change from season, traffic mix or promotions; give the numbers anyway, and propose a proper test.
13. **Make the call.** Ship, keep running, stop, or rerun, with the two numbers that drive it, against the decision rule agreed before launch. At level 3, ship only if that rule says so; any other result goes back to the client.
14. **Log it.** Date, hypothesis, counts, result, call, lesson, next idea.

## Checks

- The split check comes before any lift is reported.
- Every rate shows its counts; every formula shows the client's numbers.
- Each term is explained once in plain words.
- No figure appears that is not from the client's counts.
- Multiple comparisons are corrected; segments are labelled as ideas.
- The call is first and matches the agreed decision rule.
- No promise that a winner will keep winning.

## Output format

1. **The call** (one line) and the two numbers behind it.
2. **Set-up checks:** split check, run length, mid-test changes.
3. **Results table:** variant, visitors, conversions, rate.
4. **Working:** lift, pooled rate, SE, z, p-value, interval (in a box the client can skip).
5. **Money per 1,000 visitors**, if a value was given.
6. **Notes:** novelty, guardrails, segments as ideas.
7. **What to test next.**

## Example of good output (short)

*Hollow Oak Candles is a made-up shop, used only to show the format. Counts are invented.*

**Call: ship the delivery-threshold message.** Orders per visitor rose by 0.44 points (95% interval +0.08 to +0.80 points), p = 0.016, and guardrails held.

**Set-up checks:** planned 50/50. Actual 15,620 and 15,580 of 31,200. Expected 15,600 each. χ² = (20² + 20²) ÷ 15,600 = 0.051, p ≈ 0.82: no mismatch. Ran 6 full weeks; no promotions during the test.

| Variant | Visitors | Orders | Rate |
|---|---|---|---|
| Control | 15,620 | 391 | 2.50% |
| Delivery message | 15,580 | 459 | 2.95% |

**Working:** absolute lift 2.946% − 2.503% = 0.443 points; relative lift 17.7%. Pooled rate 850 ÷ 31,200 = 2.724%. SE = √(0.02724 × 0.97276 × (1/15,620 + 1/15,580)) = 0.00184. z = 0.00443 ÷ 0.00184 = 2.40, two-sided p = 0.016. 95% interval: 0.00443 ± 1.96 × 0.00184 = +0.08 to +0.80 points.

**Money:** at £32 value per order, about £142 more per 1,000 visitors (interval £26 to £257).

**Notes:** daily lift steady across weeks 2 to 6, so novelty looks unlikely. Mobile looked stronger than desktop; that is an idea for a follow-up test, not a result.

**Next test:** show the threshold in the cart with progress ("£8 to free delivery").
