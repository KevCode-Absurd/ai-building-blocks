# When to use `/health-score`

**What it does:** Calculates a single 0-100 health score with letter grade (A-F), category breakdowns, and severity-weighted findings. Works for Meta, Google, or both.

**Runtime:** 60-90 seconds.

## Run this when

1. **You need one number for the client.** The audit gives you a diagnosis. The health score gives you a grade the CMO can repeat.
2. **Tracking account health over time.** Run monthly. If the score is not going up, something is not sticking.
3. **Multi-account agency reporting.** Run across a portfolio to spot which accounts need attention first.

## Before you run

- Ad account data (CSV export, pasted table, or screenshots)
- Target CPA and/or target ROAS (optional, improves accuracy)
- Which platform (Meta, Google, or both)

## What you get back

- Overall score (0-100) with letter grade A-F
- Data coverage percentage (if <70%, treat score as directional)
- Category scores with individual grades
- Top critical failures (fix first)
- High-priority warnings
- Quick wins ranked by impact
- Full check-by-check results

## Chains well with

- `/audit` to get the raw findings behind the score
- `/diagnose` after a grade drop to explain why
- `/monthly-report` (the health-score becomes the report's headline metric)
