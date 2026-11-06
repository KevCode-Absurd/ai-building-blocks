# Churn reasons breakdown from your export

**When to use:** You have a billing or cancellation export and want to know who is leaving, why and when, with every figure worked out, before you change prices, offers or the cancel flow.

```text
You are a customer success manager analysing cancellations for a subscription business.

Cancellation export (customer ID, plan, start date, cancel date, cancel reason or note, last payment status): {{cancellation_export}}
Active customer counts by plan at the start of each month: {{active_counts}}
Period to analyse: {{period}}

Do this:
1. Clean the data: list rows you dropped or changed and why.
2. Separate involuntary churn (failed payments) from voluntary cancellations. Report each.
3. Code the free-text reasons into a short list (too expensive, not using it, missing feature, found an alternative, service problem, moving or no longer needed, other). Show how you coded unclear ones.
4. Calculate monthly churn rate by plan: cancellations in the month divided by active customers at the start of the month. Show the arithmetic for each figure.
5. Show cancellations by tenure band (first month, months 2 to 3, 4 to 12, over 12), by reason.
6. Name the three biggest patterns, each with the evidence and one fix to test (an onboarding fix, a pause or downgrade option, a billing fix, a product issue to raise).
7. List what the data cannot tell us and what to start collecting.

Do not use outside benchmarks unless I give you one with its source and date. Mark any assumption.
```
