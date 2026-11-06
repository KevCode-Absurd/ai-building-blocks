# Monthly performance review and reforecast

**Cadence:** Weekly cash refresh every Monday, plus a monthly review once the bookkeeper has closed the month (usually in the second week). For a small business, plan on a short weekly update and about half a day a month once the models exist.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the files to update or share yourself. Until you choose, I work at level 1.

## Steps

1. **Weekly cash refresh (every Monday).** Update the `thirteen-week-cash-forecast`: replace last week with actuals from the bank export, roll one week on, update unpaid invoices and bills, recheck the floor. Save last week's version for the backtest. At level 3, update the live forecast file or cash tool within your limits. If a tight week appears, list fix options. *Approval: the owner decides on any fix; moving money and contacting customers or suppliers are the owner's.*
2. **Wait for the close (monthly).** Start only when the bookkeeper confirms every account is reconciled for the month. If they have not, note which numbers are provisional.
3. **Tie the actuals (level 1).** Pull the month's profit and loss and balance sheet (export, or reports through the connector). Check they match the accounting software and that cash matches the bank.
4. **Explain the month.** Run the `variance-analysis` skill against budget and last year: material lines, price, volume and mix for revenue, rate and quantity for main costs, and a timing, permanent or one-off label on each gap.
5. **Subscription metrics (if relevant).** Run the `saas-metrics-pack` skill: MRR movement, churn, retention, cohort changes.
6. **Write the one-pager.** Use the `monthly-kpi-one-pager` prompt: headline, five numbers, comments and three actions (level 2: saved in the reporting tool, not shared). *Approval: the owner reviews it first; at level 3 I then share it with the people named in the limits.*
7. **Reforecast the year.** In the `driver-based-model`, change only the drivers that the permanent gaps affect, mark each change, and show the new full-year profit and cash low point against the budget and the last forecast. Keep the budget unchanged as the reference. At level 2, save it as a draft version. *Approval: the owner approves the new forecast version; at level 3 I then make it the working version.*
8. **Backtest the cash forecast.** Compare the forecast made four and thirteen weeks ago with what happened. Note the biggest misses and which assumption caused them; fix that assumption.
9. **Rules watch.** Check the "What changes fast" table in `knowledge.md` for the business's region: reporting framework changes, benchmark updates, tool changes. *Approval: accounting treatment questions go to a qualified accountant.*
10. **Decisions meeting.** Bring three to five actions with the money effect, risk, owner and date. Record what was decided for next month's check.

## Outputs

- Updated 13-week cash forecast (weekly) and backtest notes
- Variance report with a bridge that adds up
- SaaS metrics sheet (if relevant)
- One-page monthly review
- Reforecast with marked changes
- Decisions log
- Action log of everything done in the tools (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action, I show the list (update the weekly cash forecast, refresh dashboards, share the approved one-pager with the named people, make the approved forecast the working version) with its limits: which tools, versions and people, and until when. After your yes, I do these each week or month and log each one.

**Always needs a new yes.** Every new forecast version before it becomes the working one, any report to a new audience such as lenders, investors or the board, overwriting the budget, and every action, hire, price change or payment change. I give no investment, tax or valuation advice: check this with local rules and ask a qualified accountant about tax and accounting treatment.
