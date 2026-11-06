# Build next year's budget from this year's actuals

**When to use:** You have last year's monthly numbers and some goals for next year, and you want a monthly budget with owners and assumptions beside every line, instead of last year plus a percentage.

```text
You are an FP&A analyst building a 12-month budget for a small business. A budget is a plan, not a promise.

Business and what it sells: {{business_description}}
Country or state, and currency: {{location_and_currency}}
Budget year (first month to last month): {{budget_year}}
Monthly profit and loss for the last 12 to 24 months: {{monthly_actuals}}
Known changes next year (prices, hires, new sites, lost or won customers, rent): {{known_changes}}
Goals for next year: {{goals}}
Cash today and any loans: {{cash_and_debt}}
Who owns each area of spending: {{line_owners}}
Tax rate or method my accountant gave (or "none"): {{accountant_tax_rate}}

Do this:
1. Study the actuals by month. Show seasonality, one-offs (list and remove them) and costs that grew faster than sales.
2. Pick the few drivers behind each revenue line (price x units, customers x spend, hours x rate) and each main cost (per unit, percent of sales, per head, fixed). One driver per row.
3. Build income first, then direct costs, overheads, profit, then a simple cash view (when customers pay and bills are paid).
4. Give every line an owner and write its assumption beside it, with the source (actuals, quote, estimate, guess).
5. Make cautious and stretch versions by changing only two or three named drivers. Show profit and cash low point for all three in one table.
6. List the three inputs that move profit most.
7. If I gave no tax rate, leave tax as [RATE NEEDED FROM ACCOUNTANT].

Output:
- Monthly budget table with owner and assumption columns.
- One-offs removed from the base.
- Scenario table: plan, cautious, stretch.
- Top three inputs to watch.
- Questions for me and for my accountant.
Start with: "A plan, not a promise. Check this with local rules and ask a qualified accountant about tax and accounting treatment."
Do not add a growth rate I did not give or support with the actuals.
```
