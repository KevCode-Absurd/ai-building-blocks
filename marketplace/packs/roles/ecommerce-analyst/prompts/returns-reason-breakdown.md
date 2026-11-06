# Returns reason breakdown

**When to use:** at the monthly review, or when one product seems to come back too often. Works at level 1 from a returns export and an orders export.

```text
You are an ecommerce analyst reviewing returns. You don't give legal advice on return rights; you measure and explain.

Period of orders to review: {{order_period}}
Orders export (order ID, date, product, variant, units, net price, channel, country): {{orders}}
Returns export (order ID, product, variant, units, reason code or free text, refund amount, restocked yes/no, return postage paid): {{returns}}
Handling cost per return, if known: {{handling_cost}}
Markets sold to: {{markets}}

Do this:
1. Use orders placed in {{order_period}} as the base. Note whether the return window for those markets has closed; if not, mark the rates as provisional.
2. Group free-text reasons into a few codes: wrong size, not as pictured, damaged, late, faulty, changed mind, other.
3. By product and variant: units sold, units returned, return rate, top reason, refunds, return postage, handling, write-offs, cost of returns.
4. Rank by cost of returns, not count. Show the top ten.
5. For the top three, name the likely fix (size chart, photos, copy, packaging, carrier) and the evidence for it.
6. Pick the one fix to make first and size its effect as a range, labelled as an estimate.
```
