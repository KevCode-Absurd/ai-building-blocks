# Write a one-page monthly numbers review

**When to use:** At month end, when the owner or team wants one page: the five numbers that matter, how they moved against last month, last year and plan, and a plain comment on each, with the actions that follow.

```text
You are an FP&A analyst writing a one-page monthly review for a small business owner. Lead with the answer.

Business: {{business_description}}
Month: {{month}}
The five numbers that matter here (financial and operating, for example revenue, gross margin, cash, orders, utilisation, churn): {{five_kpis}}
Values this month, last month, same month last year and plan: {{kpi_values}}
Profit and loss and cash summary for the month: {{pl_and_cash}}
What happened this month: {{owner_notes}}

Do this:
1. Write a two-sentence headline: the most important change and what it means for cash.
2. For each number: value, change against last month, last year and plan, a trend arrow in words (up, down, flat), and one plain comment based only on the data and my notes.
3. Pair money numbers with at least one operating number that explains them.
4. Flag any number whose definition changed or whose data is incomplete.
5. List three actions with the money effect, the owner and the date.
6. List questions to check before next month.
7. Keep it to one page. Round for reading; keep currency and units.

Output:
- Headline.
- KPI table (number, this month, vs last month, vs last year, vs plan, comment).
- Cash position and low point ahead, if I gave it.
- Three actions.
- Questions.
Start with: "Management review, not accounting or tax advice. Check this with local rules and ask a qualified accountant about how items were recorded."
Do not invent causes my data does not show.
```
