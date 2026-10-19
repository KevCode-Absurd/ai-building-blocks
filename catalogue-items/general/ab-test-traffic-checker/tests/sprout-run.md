# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

All per-ad and group sums check out against the input, the sizing uses the skill's stated 20% default, and the dates, margin and daily-visit gaps are flagged as MISSING rather than guessed. The owner gets a clear answer: judge by revenue per visitor and renewals, the 61%-off traffic is the weak half at $0.63 per click, and a four-week test can't finish so fix the discount mismatch and compare before/after.

## Judge list

- Met: Revenue per visitor is shown, or it says exactly why it can't be worked out.
  "revenue per visitor (RPV) = revenue / clicks" ... "$24,668 / 23,941 = $1.03"; RPV shown for every ad group.
- Met: The sample-size sum is written out, with the lift it uses named.
  "Lift used: 20% relative, the default for a small store... 16 × 0.0260 × 0.974 / (0.0260 × 0.20)² ... ≈ 14,973 visitors per version"
- Met: Every figure is marked "your data" or "rule of thumb". Nothing comes from an industry average.
  Table prefaced "*(your data)*"; sizing marked "*(rule of thumb, applied to your data)*"; bound marked "Best-case bound from your data". No industry average used.
- Met: The verdict says how many weeks a test would take, or what's missing to say.
  "`MISSING: daily visits`" plus "needs at least 29,946 / 570 ≈ 53 days, which rounds up to 8 weeks or more"
- Met: Nothing is called "significant" before the planned sample is reached.
  The word "significant" never appears; "Before and after is a comparison, not proof."

## What went in

```text
Page: sprout.example/products/sprout. Visits are ad link clicks
(store visit counts not exported). Practice numbers, USD.
ad / clicks / purchases / revenue
T1 Hot girl tummy (pain)          4950  198  8336
P1 Too expensive (61% off)        5530  151  5164
P2 Dont pay full price (61% off)  5569   50  1555
S1 Trusted by 1M (61% off)        1600   38  1254
H1 One step never skip (habit)    1300   44  2015
K1 Fiber kids                     2030   63  3062
F1 Fiber question                 1524   46  1858
W1 Muscle weight loss              900   23  1024
R1 Runner                          538   10   400
Each ad ran 14 to 42 days; exact dates not exported.
First order $29.99 (with text sign-up), renews at $49.99.

Question: the team wants to A/B test the plan box, because the
ads say 61% off and the page says 52% and 55%. Can we, and which
number should we judge the page by?
```

## What came out

```text
**Window**: `MISSING: start and end dates`. Each ad ran 14 to 42 days, so the full window was at least 42 days. *(your data)*

**Numbers table**: visits are ad clicks, not store sessions. `MISSING: margin`, so there is no profit per visitor.

Sums used: conversion rate = purchases / clicks; average order value (AOV) = revenue / purchases; revenue per visitor (RPV) = revenue / clicks. *(your data)*

| Group | Clicks | Orders | Conv. rate | AOV | RPV |
|---|---|---|---|---|---|
| T1 Tummy (pain) | 4,950 | 198 | 4.00% | $42.10 | $1.68 |
| H1 Habit | 1,300 | 44 | 3.38% | $45.80 | $1.55 |
| K1 Fiber kids | 2,030 | 63 | 3.10% | $48.60 | $1.51 |
| F1 Fiber question | 1,524 | 46 | 3.02% | $40.39 | $1.22 |
| W1 Muscle weight loss | 900 | 23 | 2.56% | $44.52 | $1.14 |
| P1 Too expensive (61%) | 5,530 | 151 | 2.73% | $34.20 | $0.93 |
| S1 Trusted by 1M (61%) | 1,600 | 38 | 2.38% | $33.00 | $0.78 |
| R1 Runner | 538 | 10 | 1.86% | $40.00 | $0.74 |
| P2 Don't pay full (61%) | 5,569 | 50 | 0.90% | $31.10 | $0.28 |
| **61%-off ads (P1+P2+S1)** | 12,699 | 239 | 1.88% | $33.36 | **$0.63** |
| **All other ads** | 11,242 | 384 | 3.42% | $43.48 | **$1.49** |
| **Total** | 23,941 | 623 | 2.60% | $39.60 | **$1.03** |

Total sums: 623 / 23,941 = 2.60%; $24,668 / 623 = $39.60; $24,668 / 23,941 = $1.03.

**Read**
- **Which number to use**: judge the page by revenue per visitor, then by how many first orders renew at $49.99. Do not judge it by conversion rate. A cheaper first box can win first orders and lose on renewals.
- **The 61%-off ads are 53% of clicks and the weakest group.** They earn $0.63 per visitor against $1.49 for the rest. Both their conversion rate and their order value are lower. P2 is the worst at $0.28.
- **The ad-to-page discount mismatch is a likely cause, but not proven.** These ads also reach a different, price-led audience. The weak numbers fit the mismatch, but they don't isolate it.
- **The traffic mix sets the overall rate.** Moving spend toward or away from the 61% ads would change the total 2.60% without any change to the page.
- **Order value is unexplained.** AOV of $39.60 is above the $29.99 first box. `MISSING:` whether revenue counts tax, full-price orders or multiple units. Use net sales plus shipping paid.
- **Clicks overstate visits.** Some people leave before the page loads, so true per-visit rates are higher. `MISSING: analytics sessions for the page`.

**Test sizing**
- **Lift used**: 20% relative, the default for a small store. *(rule of thumb)* No one named a lift worth acting on.
- **Sum**: 16 × 0.0260 × 0.974 / (0.0260 × 0.20)² = 0.4055 / 0.00002708 ≈ **14,973 visitors per version**. *(rule of thumb, applied to your data)*
- **Total for two versions**: **29,946 visitors**.
- **This is the floor.** Judging on RPV needs more visitors, because order sizes vary. Judging on renewals also needs at least one renewal cycle to pass.
- **Days at current traffic**: `MISSING: daily visits`.
- **Best-case bound from your data**: the window was at least 42 days, so traffic was at most 23,941 / 42 ≈ 570 clicks a day. At that rate the test needs at least 29,946 / 570 ≈ 53 days, which rounds up to **8 weeks or more**.
- **What four weeks could detect**: at that best-case rate, four weeks only gives enough visitors to spot a lift of about 27% or more.

**Verdict**: **Ship and watch.** The test can't finish in about four weeks even at best-case traffic.

Making the page's discount match the ads is an obvious fix, and arguably a required one. It isn't something to test. Testing a page that contradicts the ad's claim isn't a fair test. If you still want a test later, test a bolder change aimed at a lift of 27% or more.

**Test readiness score**: `MISSING: daily visits`.

For reference only: 28 × 570 = 15,960, and 15,960 / 29,946 × 100 ≈ 53. That is an upper bound, not a score.

**Next three actions**
1. **Export page sessions and exact dates from your analytics tool.** This replaces the 570-a-day ceiling with a real daily figure for the 29,946-visitor test. It also puts actual visits in place of clicks.
2. **Make the plan box and the ads show the same discount, then compare before and after.** Compare RPV for the 61%-off group (now $0.63) and the other ads (now $1.49) separately. Name the click mix in both periods (now 53% / 47%). Before and after is a comparison, not proof.
3. **Track renewals at $49.99 by ad group for at least one cycle, and add margin.** Do this before calling any change a win. A first-order gain on $29.99 boxes counts only if renewals hold. With margin you can also report profit per visitor alongside RPV.
```
