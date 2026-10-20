# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Every sum checks out against the input numbers, gaps are marked MISSING rather than guessed, and the owner gets a clear answer: judge by revenue per visitor per ad group, fix the discount mismatch rather than test it, and a 20% test won't finish in four weeks. The best-case 570/day ceiling is clearly flagged as a ceiling, and the readiness score is honestly capped at 'at most 53'.

## Judge list

- Met: Revenue per visitor is shown, or it says exactly why it can't be worked out.
  "24,668/23,941 = $1.03" in the All row, plus per-ad and grouped revenue per visitor columns.
- Met: The sample-size sum is written out, with the lift it uses named.
  "Lift used: 20% relative (rule of thumb)... = 16 × 0.02602 × 0.97398 / (0.02602 × 0.20)² ... ≈ 14,973 visitors per version"
- Met: Every figure is marked "your data" or "rule of thumb". Nothing comes from an industry average.
  Table header "all figures your data"; sizing marked "rule of thumb"; p marked "your data". No external benchmark used.
- Met: The verdict says how many weeks a test would take, or what's missing to say.
  "Days needed: MISSING: daily visits... 29,946/570 = 53 days, which rounds up to 8 weeks" as a best-case ceiling.
- Met: Nothing is called "significant" before the planned sample is reached.
  "this is not proof" repeated; no use of "significant" anywhere.

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
**Window**
MISSING: exact dates. Each ad ran 14 to 42 days (your data). The full window is at least 42 days, because the longest ad alone ran 42 days.

**Numbers table** (visits = ad link clicks, not store sessions; all figures **your data**)

| Group | Visits | Orders | Conv. rate | Avg order value | Revenue / visitor |
|---|---|---|---|---|---|
| T1 Hot girl tummy | 4,950 | 198 | 198/4,950 = 4.00% | 8,336/198 = $42.10 | 8,336/4,950 = $1.68 |
| P1 Too expensive (61%) | 5,530 | 151 | 2.73% | $34.20 | $0.93 |
| P2 Dont pay full (61%) | 5,569 | 50 | 0.90% | $31.10 | $0.28 |
| S1 Trusted by 1M (61%) | 1,600 | 38 | 2.38% | $33.00 | $0.78 |
| H1 One step habit | 1,300 | 44 | 3.38% | $45.80 | $1.55 |
| K1 Fiber kids | 2,030 | 63 | 3.10% | $48.60 | $1.51 |
| F1 Fiber question | 1,524 | 46 | 3.02% | $40.39 | $1.22 |
| W1 Muscle weight loss | 900 | 23 | 2.56% | $44.52 | $1.14 |
| R1 Runner | 538 | 10 | 1.86% | $40.00 | $0.74 |
| **"61% off" ads (P1+P2+S1)** | 12,699 | 239 | 239/12,699 = 1.88% | 7,973/239 = $33.36 | 7,973/12,699 = $0.63 |
| **Other ads** | 11,242 | 384 | 384/11,242 = 3.42% | 16,695/384 = $43.48 | 16,695/11,242 = $1.49 |
| **All** | 23,941 | 623 | 623/23,941 = 2.60% | 24,668/623 = $39.60 | 24,668/23,941 = $1.03 |

Profit per visitor: MISSING: margin.

**Read**
- The "61% off" ads bring 53% of clicks (12,699/23,941) but only 38% of orders (239/623).
- Those ads earn $0.63 per visitor against $1.49 for the other ads. Their visitors buy less often (1.88% vs 3.42%) and spend less per order ($33.36 vs $43.48).
- One possible cause is the page showing 52% and 55% after the ad promised 61%. Different hooks and audiences could also explain the whole gap, so this is not proof.
- The site-wide $1.03 per visitor depends on this ad mix. Moving spend between ads shifts it without any page change.
- Still unknown:
  - store sessions (ad clicks overcount visits)
  - whether revenue includes tax
  - refunds
  - renewal rate at $49.99
  - dates

**Which number to judge the page by**
- **Revenue per visitor on the first order, shown per ad group.** A plan box change can push people between plan sizes. That moves order value as well as conversion rate, so conversion rate alone can mislead.
- **Then the renewal rate at $49.99.** A box that wins first orders at $29.99 but loses renewals hasn't won. Hold the call for at least one renewal cycle (add-on rule).

**Test sizing**
- Lift used: 20% relative (**rule of thumb**). No one named the smallest lift worth acting on.
- p = 2.60% (**your data**, all ads).
- Formula: 16 × p × (1 − p) / (p × lift)²
  - = 16 × 0.02602 × 0.97398 / (0.02602 × 0.20)²
  - = 0.4055 / 0.00002708
  - ≈ **14,973 visitors per version**
  - × 2 versions = **29,946 total** (**rule of thumb**)
- Days needed: MISSING: daily visits.
  - The best possible case is 23,941 clicks / 42 days = 570 a day, since the window is at least 42 days.
  - At that rate the test takes 29,946/570 = 53 days, which rounds up to **8 weeks**.
  - Real traffic is likely lower.
- This is the floor. Judging on revenue per visitor needs more visitors, because order sizes vary.
- Bolder options:
  - 30% lift: 0.4055/(0.02602×0.30)² ≈ 6,655 per version, 13,310 total. That is at least 23 days, about 4 weeks, but only at the best-case rate.
  - 40% lift: about 3,743 per version, 7,486 total.

**Verdict**
**Ship and watch.** A 20% test can't finish in four weeks even at the best-case traffic.
- A bolder change sized at 30% or more could fit, but only if the real daily visits turn out close to 570.
- The 61% vs 52%/55% mismatch is a fix, not an experiment. Make the ads and the plan box show the same discount, then watch.
- If you do test later:
  - Fix the sample first and don't stop early.
  - Keep a 50/50 split with close visitor counts.
  - Send no sitewide sale or text blast to only one version.

**Test readiness score**
MISSING: daily visits.
Ceiling at best-case traffic: 570 × 28 = 15,961 / 29,946 × 100 = 53.3, so **at most 53**.

**Next three actions**
1. **Match the discount.** Make the "61% off" claim and the plan box show the same number. Then track the 61% ads' $0.63 revenue per visitor against the other ads' $1.49 for 4 weeks, naming each period's click mix (currently 53% discount ads). This is not proof.
2. **Get real traffic numbers.** Export store sessions and exact ad dates for this page. That replaces the 570-a-day ceiling with real daily visits and turns the score from "at most 53" into an actual score.
3. **Get renewal and money facts.**
   - Pull the renewal rate at $49.99 and the margin. Then judge on profit per visitor, not the $1.03 first-order revenue per visitor.
   - Check whether the $24,668 includes tax or excludes refunds.

**Gaps to fill later**
- MISSING: dates
- MISSING: daily visits
- MISSING: store sessions
- MISSING: margin
- MISSING: renewal and cancel rates
- MISSING: tax, shipping and refund treatment in revenue
- MISSING: device split
- MISSING: new vs returning split

Want to plan the next ad test with the [Ad test brief writer](https://useaiblocks.com/skills/ad-test-brief-writer)? Bring this report. Or tell me what you'd rather do next.
```
