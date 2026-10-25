# When to use `/budget`

**What it does:** Classifies every campaign into Scale/Maintain/Reduce/Kill and produces a phased reallocation plan with 3-scenario projections and safety rails.

**Runtime:** 10 minutes.

## Run this when

1. **End of month.** Before reallocating for next month's spend.
2. **New budget cap.** Client raises or lowers total monthly budget.
3. **A winner has appeared.** One campaign is obviously outperforming, need to fund it without blowing learning phase.
4. **Portfolio feels bloated.** 10+ campaigns running, unclear which ones are working.

## Before you run

- 30 days of campaign-level data (spend, revenue, conversions, ROAS, CPA)
- Target ROAS and Target CPA
- Total available daily/monthly budget
- Risk tolerance (conservative / moderate / aggressive)
- Lost Impression Share data if available (Google)

## What you get back

- Campaign classification table (Scale/Maintain/Reduce/Kill)
- Per-scale-campaign 3-scenario projections
- Phased scaling schedule (max 50% per move)
- Reduction and kill plan
- Net impact projection (daily + monthly)
- 15-day implementation timeline

## Chains well with

- `/audit` first if you've never run one; audit exposes hidden problems before reallocation
- `/scaling-plan` for deeper scale-readiness assessment
- `/diversification` to validate concentration risk across creatives
- `/monthly-report` to show the plan's results at end of next month
