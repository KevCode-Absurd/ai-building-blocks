# Decision memo: 3-month prepaid plan test

**To:** Leadership team | **From:** Finance | **Date:** 12 November 2026
*All figures are hypothetical exercise numbers, not company data.*

## Recommendation

**Run the 60-day test, with two design changes. Keep the plan only if it brings in about 3% or more new subscribers in total, not just a different mix of the same subscribers.**

On these numbers, a prepaid customer is worth **$23.60 less** than a monthly customer over six months, even if prepaid customers renew as well as monthly customers stay. The plan only pays if it wins customers we would not otherwise get.

Two design changes:

1. **When the term ends, prepaid rolls onto monthly at $79, not into another $199 term.** A second discounted term gives away about $28 per renewing customer over months 4–6.
2. **Run it as a randomized split.** Half of new visitors see monthly only (control) and half see both plans (test), with the same marketing spend. Without a control group, we can't tell new customers apart from customers who just switched plans.

## The math: contribution per customer over six months

Contribution per box is $79 − $15 product − $9 fulfillment = **$55** on monthly. Prepaid is $199 − (3 × $24) = **$127** for the first three boxes. We assume prepaid boxes ship monthly.

**Renewal assumption:** at the end of the prepaid term, **75.4%** of prepaid buyers continue onto monthly at $79. That is the same share of monthly customers still active in month 4. After that, churn is 6% a month. This is a generous assumption. The churn that monthly customers spread over three months all lands on one renewal date for prepaid, and renewal dates usually show a drop-off.

| Month | Monthly: still active | Monthly contribution | Prepaid: still active | Prepaid contribution |
|---|---|---|---|---|
| 1 | 100.0% | $55.00 | 100% | $127.00 (paid up front) |
| 2 | 91.0% | $50.05 | 100% | included |
| 3 | 82.8% | $45.55 | 100% | included |
| 4 | 75.4% | $41.45 | 75.4% | $41.45 |
| 5 | 70.8% | $38.96 | 70.8% | $38.96 |
| 6 | 66.6% | $36.62 | 66.6% | $36.62 |
| **Total** | 4.87 boxes, $384.40 revenue | **$267.62** | 5.13 boxes, $367.09 revenue | **$244.03** |

*Rows are rounded. Totals use unrounded figures.*

**Why prepaid loses $23.60:** the $38 discount is bigger than the churn it prevents. Over months 1–3, a monthly customer brings in $216.31 of expected revenue, compared with $199 for prepaid. Prepaid also ships 0.26 more boxes, which costs $6.29. $17.31 + $6.29 = $23.60.

**Sensitivity: it all depends on renewal and on new-customer lift.** This assumes 30% of new subscribers choose prepaid.

| Share of prepaid buyers continuing into month 4 | Prepaid 6-month contribution | Compared with monthly | Lift in total new subscribers needed to break even |
|---|---|---|---|
| 90.6% (break-even) | $267.62 | $0 | 0% |
| **75.4% (base case)** | **$244.03** | **−$23.60** | **+2.7%** |
| 60% (renewal drop-off) | $220.18 | −$47.44 | +5.6% |
| 45% | $196.88 | −$70.74 | +8.6% |

These figures leave out payment fees, refunds and CAC. Because marketing spend is the same in both arms, the lift column already counts the benefit of spreading that spend over more subscribers.

## Risks

1. **Cannibalization (the main risk).** Our most committed customers, who would have stayed on monthly anyway, take the 16% discount. The control group is how we measure this.
2. **The renewal drop-off can't be seen in 60 days.** The first prepaid cohort renews around day 90.
3. **Skimming hides in the mix.** If prepaid pulls our best customers away from monthly, monthly retention in the test arm gets worse. Judge the whole arm, not each plan alone.
4. **Accounting and cash.** The $199 helps cash flow, but it is deferred revenue, recognized as each box ships. Unshipped boxes create a refund liability, so we need a written refund policy.
5. **Auto-renewal rules.** Rolling onto monthly needs clear disclosure and consent at checkout, plus a reminder before renewal (for example, under state auto-renewal laws such as California's). Legal should review this before launch.
6. **Discount anchoring.** "16% off" can become the price customers expect. Block stacking with other promo codes.

## What we'd need to see at day 60 to keep it

| Measure (test arm vs control) | Keep if |
|---|---|
| Projected 6-month contribution per visitor (using the model above) | Test ≥ control |
| Total new subscribers per visitor | At least +3% vs control, and the 95% confidence interval excludes zero |
| Month-2 retention of *monthly* subscribers in the test arm | Within 1 point of control (otherwise prepaid is skimming) |
| Prepaid buyers who have already switched off continuation by day 60 | 25% or less (in line with at least 75% renewal) |
| Refund requests on prepaid | 3% or less |

**Kill early** if contribution per visitor in the test arm is clearly below control at day 30, or if prepaid refund requests go above 5%.

**Sample-size warning:** a 2.7% lift is small. At a 5% checkout conversion rate, detecting it reliably needs about 400,000 visitors per arm (about 120,000 per arm for a 5% lift). If we can't reach that in 60 days, extend the test rather than decide on noise.

**Decision timing:** day 60 is a go/no-go to keep the test running. We make the final keep decision around day 100, once the first prepaid cohort has passed its renewal date and we can replace the 75.4% assumption with a real number.
