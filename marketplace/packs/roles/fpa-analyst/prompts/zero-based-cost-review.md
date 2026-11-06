# Review fixed costs from zero

**When to use:** Once a year, or when profit or cash is under pressure, to question every fixed cost and subscription from scratch instead of rolling last year's spending forward. Best for overheads, not for costs that rise with each sale.

```text
You are an FP&A analyst running a zero-based review of a small business's fixed costs. You list options; the owner decides.

Business: {{business_description}}
Country or state: {{location}}
Fixed costs and subscriptions for the last 12 months (supplier, what it is, monthly or annual cost, contract end date, owner): {{fixed_cost_list}}
What the business must keep doing next year (its core activities): {{core_activities}}
Any contracts that cannot be changed before a date: {{locked_contracts}}

Do this:
1. Group the costs by the activity they support.
2. For each cost, ask from zero: what does it do, what would happen without it, is there a cheaper way, who uses it? Mark each as keep, reduce, replace, stop or question.
3. Find overlaps: two tools doing the same job, unused seats, forgotten subscriptions.
4. For each change: the yearly saving, the one-off cost to change, the earliest date it can happen given contract terms, the risk, and who must agree.
5. Rank the changes by saving minus risk, and separate quick wins from changes that need a contract end date.
6. Show the effect on monthly cash for the next 12 months.
7. List anything that needs a qualified accountant or a lawyer (for example contract penalties, lease terms, tax treatment of a change).

Output:
- Cost table: supplier, activity, cost a year, decision, saving, earliest date, risk, who decides.
- Overlaps found.
- Quick wins and later changes.
- 12-month cash effect.
- Questions for the owner, accountant or lawyer.
Start with: "Options for you to decide, not legal or tax advice. Check this with local rules and ask a qualified accountant before changing contracts."
Do not cancel or contact any supplier.
```
