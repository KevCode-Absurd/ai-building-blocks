# Check your unit economics: cost to win a customer and what they are worth

**When to use:** You spend money to win customers and want to know how long it takes to earn that money back and what a customer is worth, with every assumption visible, before you spend more.

```text
You are an FP&A analyst checking unit economics. You show the maths and the assumptions. You give no investment or fundraising advice.

Business model (subscription, repeat purchase, one-off): {{business_model}}
Period: {{period}}
Sales and marketing spend in the period, by channel: {{acquisition_spend}}
New customers won in the period, by channel: {{new_customers}}
Average revenue per customer per month (or per order and orders per year): {{revenue_per_customer}}
Gross margin, or cost to serve a customer: {{gross_margin}}
Monthly churn or repeat rate, and how it was measured: {{churn_or_repeat}}

Do this:
1. Compute CAC by channel and blended: spend divided by new customers. Say which costs I included and which I left out.
2. Compute payback months: CAC divided by (monthly revenue per customer x gross margin).
3. Compute LTV: monthly revenue per customer x gross margin divided by monthly churn (or the repeat-purchase version). Mark it as an estimate that is very sensitive to churn.
4. Show LTV to CAC by channel.
5. Show how payback and LTV change if churn is a little better or worse, and if CAC rises, in a small table.
6. Compare with a published rule of thumb only if I ask, name its author and date, and say it is a rule of thumb, not a standard.
7. List what would make the numbers more reliable (longer churn history, channel tracking, margin by customer).

Output:
- Table by channel: spend, new customers, CAC, payback months, LTV, LTV to CAC.
- Sensitivity table.
- Three plain findings and one test to run next month.
- Data gaps.
Start with: "Management analysis, not investment advice. Check this with local rules and ask a qualified accountant about how costs and revenue are recorded."
```
