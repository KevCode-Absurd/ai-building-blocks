# When to use `/emq`

**What it does:** Audits Event Match Quality on Meta pixel + CAPI. Scores each event (Purchase, Lead, AddToCart, InitiateCheckout), identifies missing parameters, calculates revenue mis-attribution, and prescribes specific server-side fixes.

**Runtime:** 2-3 minutes.

## Run this when

1. **Reported ROAS doesn't match Shopify revenue.** The gap is usually EMQ, not "iOS 14."
2. **Before onboarding a new client.** EMQ is the single biggest tracking risk. Fix before scaling spend.
3. **After iOS/browser updates.** Safari and iOS changes periodically break matching. Re-audit quarterly.
4. **When the algorithm won't exit learning phase.** Low EMQ starves the algorithm of matched users to optimize against.

## Before you run

- Meta ad account access (Events Manager -> Data Sources -> Diagnostics shows EMQ scores)
- Knowledge of which CAPI implementation is in place (Native, Shopify, CAPI Gateway, custom)
- Access to the server-side code OR the tool that configures CAPI (Stape, Zapier, Segment)

## What you get back

- EMQ score per event with status
- Missing parameters per event ranked by impact
- Deduplication rate and health
- Estimated revenue mis-attribution per month
- Priority fix list with EMQ impact + time cost per fix
- Projected post-fix EMQ and ROAS impact

## Chains well with

- `/audit` before, to see the full Meta account context
- `/health-score` after, since P04 (Event Match Quality) is one of the 30 checks
- `/diagnose` after, if ROAS decline turns out to be tracking-related (Pattern 6)
- `/cross-platform` after, if EMQ fixes change reported Meta numbers enough to affect budget allocation decisions
