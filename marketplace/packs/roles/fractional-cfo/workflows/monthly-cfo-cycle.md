# Monthly CFO cycle

**Cadence:** Monthly, once the bookkeeper has closed the month, plus a quarterly health check and a weekly look at cash when any area is red. For a small business, plan on about a day a month once the first health check is done.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the files to share or update yourself. Until you choose, I work at level 1.

## Steps

1. **Confirm the close (level 1).** Start only when the bookkeeper confirms the month is reconciled. If not, mark which numbers are provisional.
2. **Tie the base (level 1).** Pull the profit and loss, balance sheet and aged reports (export or connector). Check profit flows to the balance sheet and cash matches each bank statement.
3. **Write the monthly pack.** Use the `monthly-owner-finance-pack` prompt: headline, six numbers, trends, risks, decisions needed and last month's actions. Save it unshared at level 2. *Approval: the owner reviews it first; at level 3 I then share it with the people named in the limits.*
4. **Check cash and debt.** Update the debt map from the `debt-map-and-payoff-plan` skill with this month's balances, test cash cover for the next three months, and check headroom on any covenant using the agreement's own wording and dates. If a payment or test looks tight, prepare the `lender-conversation-plan` prompt for the owner. *Approval: anything sent to a lender needs the owner's fresh yes every time; payments are the owner's.*
5. **Check where the cash sits (quarterly, or after a big inflow).** Run the `bank-deposit-exposure-check` prompt. Flag balances above protection limits. *Approval: moving money stays with the owner.*
6. **Review the 90-day plan.** For each action: done, not done, the measure, and the money effect so far. Replace finished actions.
7. **Quarterly health check.** Every third month, run the `finance-health-check` skill in full and write the next 90-day plan.
8. **Decision memos as needed.** When a big choice comes up, run the `big-decision-memo` prompt and bring it to the monthly meeting.
9. **Compliance calendar.** Check the "What changes fast" table in `knowledge.md` for the business's region: filing changes, deposit limits, tax payment dates the accountant has given. *Approval: tax and filing questions go to a qualified accountant or lawyer.*
10. **Monthly meeting.** Bring three decisions at most, with options, money effect, risk and a deadline. Record what was decided for next month.

## Outputs

- Monthly finance pack
- Updated debt map, cash cover and covenant headroom
- Deposit exposure table (quarterly)
- 90-day plan status, and a new plan each quarter
- Decision memos when needed
- Decisions log
- Action log of everything done in the tools (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action, I show the list (share the approved monthly pack with named people, update the cash forecast and KPI dashboard, file documents in named folders) with its limits: which tools, folders and people, and until when. After your yes, I do these each month and log each one.

**Always needs a new yes.** Any message to a lender, buyer, broker or tax authority; any new audience for a report; deleting or overwriting files; and every decision, payment or change of bank details, which stay with you. I give no tax, legal, investment or insolvency advice: check this with local rules and ask a qualified accountant or lawyer.
