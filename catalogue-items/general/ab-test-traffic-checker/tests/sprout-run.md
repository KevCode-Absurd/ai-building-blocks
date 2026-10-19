# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Every number checks out against the input (totals 23,941 / 623 / $24,668 and all per-ad rates), the sample-size sum is shown with the lift named, and dates, sessions, margin and renewal rate are all flagged MISSING rather than guessed. The owner gets a clear answer: judge by revenue per visitor through renewal, fix the discount mismatch first, and only test once sessions reach about 1,070 a day.

## Judge list

- Met: Revenue per visitor is shown, or it says exactly why it can't be worked out.
  "24,668/23,941 = $1.03" plus per-ad rows (T1 $1.68, P2 $0.28); profit/visitor marked MISSING: margin.
- Met: The sample-size sum is written out, with the lift it uses named.
  "Lift: 20% relative (rule of thumb) ... 16 × 0.02602 × 0.97398 / (0.02602 × 0.20)² ... ≈14,973 per version"
- Met: Every figure is marked "your data" or "rule of thumb". Nothing comes from an industry average.
  Table headed "all figures your data"; sizing marked "rule of thumb"; no external benchmark used.
- Met: The verdict says how many weeks a test would take, or what's missing to say.
  "Days: can't be given without dates... To finish in 4 weeks the page needs ≈1,070 visits/day (29,946/28)."
- Met: Nothing is called "significant" before the planned sample is reached.
  Word "significant" never used; before-and-after explicitly "is not proof".

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
MISSING: start and end dates. Each ad ran 14 to 42 days, but the exact dates and any overlap weren't exported. Because of this, test length below is given as a traffic threshold, not as a number of days.

**Numbers table** (all figures **your data**; visits = ad link clicks, not store sessions)

| Group | Visits | Orders | Conv. rate | AOV | Rev/visitor | Profit/visitor |
|---|---|---|---|---|---|---|
| **All ads** | 23,941 | 623 | 623/23,941 = **2.60%** | 24,668/623 = **$39.60** | 24,668/23,941 = **$1.03** | MISSING: margin |
| 61%-off ads (P1+P2+S1) | 12,699 | 239 | 1.88% | $33.36 | **$0.63** | n/a |
| Other ads | 11,242 | 384 | 3.42% | $43.48 | **$1.49** | n/a |
| T1 Hot girl tummy | 4,950 | 198 | 4.00% | $42.10 | $1.68 | n/a |
| P1 Too expensive | 5,530 | 151 | 2.73% | $34.20 | $0.93 | n/a |
| P2 Dont pay full price | 5,569 | 50 | 0.90% | $31.10 | $0.28 | n/a |
| S1 Trusted by 1M | 1,600 | 38 | 2.38% | $33.00 | $0.78 | n/a |
| H1 One step | 1,300 | 44 | 3.38% | $45.80 | $1.55 | n/a |
| K1 Fiber kids | 2,030 | 63 | 3.10% | $48.60 | $1.51 | n/a |
| F1 Fiber question | 1,524 | 46 | 3.02% | $40.39 | $1.22 | n/a |
| W1 Muscle weight loss | 900 | 23 | 2.56% | $44.52 | $1.14 | n/a |
| R1 Runner | 538 | 10 | 1.86% | $40.00 | $0.74 | n/a |

Data notes:
* MISSING: whether "revenue" is net sales plus shipping or includes tax.
* MISSING: store or analytics sessions. Ad clicks overcount visits because some people leave before the page loads, so the real conversion rate is higher and real visits are lower.
* MISSING: device split, new vs returning, refunds, renewal and cancel rates.

**Read**
- The 61%-off ads send 53% of clicks (12,699/23,941) but earn $0.63 per visitor, against $1.49 for the other ads. These are different ads reaching different people, so the ads-vs-page discount mismatch can't be blamed for the gap. It is a hint, not a finding.
- P1 and P2 carry the same offer but convert at 2.73% and 0.90%. The creative and audience swing results threefold before the page does anything.
- The page's overall rate of 2.60% is mostly a traffic-mix number. Shifting budget toward T1 would raise it with no page change, and shifting toward P2 would lower it.
- AOV is $33 on the 61%-off ads and $43 to $49 elsewhere. That suggests buyers from discount-led ads pick the $29.99 first box more often.
- 1 − 29.99/49.99 = **40.0%**. That is the only discount derivable from your data. 61%, 55% and 52% each imply a different reference price (61% implies about $76.90).
- Still unknown: dates, real sessions, and whether $29.99 buyers renew at $49.99.

**Which number to judge the page by**
Use **revenue per visitor, counted through the first renewal**. First-order revenue per visitor ($1.03 now, **your data**) is the floor, not the answer. A deeper-looking discount can win first orders and lose at renewal. Conversion rate alone is the wrong measure here, because traffic mix moves it.

**Test sizing**
- Lift: 20% relative (**rule of thumb**, small-store default). No one named the lift that would pay for the work.
- p = 2.602% (**your data**, all ad traffic to the page).
- Visitors per version = 16 × p × (1 − p) / (p × lift)²
  = 16 × 0.02602 × 0.97398 / (0.02602 × 0.20)²
  = 0.40549 / 0.000027082
  = **≈14,973 per version, ≈29,946 total** (**rule of thumb**).
- At a bolder 30% lift: about 6,655 per version (13,310 total). At 10%: about 59,890 per version.
- Days: can't be given without dates. To finish in 4 weeks the page needs **≈1,070 visits/day** (29,946/28). Your 23,941 clicks reach that only if they all landed within about 22 days.
- Real sessions are below ad clicks, so the true time is longer.
- This is a floor. Judging on revenue per visitor needs more visitors because order sizes vary.
- A subscription test can't be called until at least one renewal cycle has passed (MISSING: cycle length).

**Verdict**
**Ship and watch.** Ads and page showing different discounts (61% vs 52%/55%) is a consistency fix, not a hypothesis worth a test slot. Make every surface show one true discount against one stated reference price.

A plan-box A/B test becomes **can test** only if dates show at least 1,070 real sessions a day and you can wait out a renewal cycle. Otherwise, **test a bolder change** sized at 30% or more.

The before-and-after comparison is not proof. Compare revenue per visitor separately for the 61%-off ads and the other ads, and name each group's share of clicks in both periods (53% / 47% now).

**Next three actions**
1. **Export dates and analytics sessions for /products/sprout.** These numbers decide whether the page clears 1,070 visits/day (**rule of thumb** threshold) and replace the 23,941 ad clicks (**your data**).
2. **Make ads and page state one true discount.** $29.99 against the $49.99 renewal is 40.0% (**your data**). If you claim 61%, show the reference price behind it. Then track revenue per visitor for the 61%-off ads ($0.63) and the other ads ($1.49) before and after (**your data**), naming the click mix each time.
3. **Pull the renewal rate of $29.99 first boxes at $49.99.** Without it, every result here stops at first-order revenue per visitor ($1.03, **your data**). Once it's in hand, set a real minimum lift. If that lift is 20%, the test needs 14,973 per version; at 30%, 6,655 (**rule of thumb**).
```
