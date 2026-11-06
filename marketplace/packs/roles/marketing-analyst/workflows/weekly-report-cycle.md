# Weekly report cycle

**Cadence:** every week, same day (Monday works for most). About one hour of analyst time and two minutes of the owner's. Monthly, the same cycle adds a deeper channel read.

**Access:** set at the start, per tool (see `access.md`). Level 1 is enough to read and write the report; level 2 to keep it as a draft in Data Studio or a shared document; level 3 to send it to the agreed people. Until you choose, I work at level 1.

## Steps

1. **Pull (Monday morning).** Exports or connector reads for the last full week and the week before: backend orders and revenue after refunds, GA4 key events by channel, spend and results from each ad platform, email results. Same time zone and date range everywhere.
2. **Check.** Run the data checks in the `weekly-marketing-report` skill: matching dates, no summed platform conversions, Unassigned share, tracking or consent changes. Note anything that changes the reading.
3. **Write.** Use the `weekly-marketing-report` skill: scoreboard against last week and target, what moved and the likely reason, three ranked actions, one thing to watch, data gaps. Definitions come from the metric dictionary (`metric-dictionary` prompt, written once and reused).
4. **Draft (level 2).** Save the report as a draft only the owner can see.
5. **Send (level 3).** After the owner's yes to the recipient list once, send each week's report to that list on the agreed day. A new recipient needs a fresh yes.
6. **Follow up.** Next week's report opens with what happened to last week's three actions.
7. **Monthly add-on (first Monday of the month).** Run the `which-number-to-trust` skill on the month: claims table, MER, gaps, channels to test. Add any new test to the quarterly plan.
8. **Quarterly add-on.** Recheck the tracking against the plan (`ga4-tracking-plan`, existing set-up mode) and refresh UTM rules.

## Outputs

- One-page weekly report with scoreboard, actions and watch item
- Monthly reconciliation and channel read
- Running log of actions and their results
- Updated metric dictionary when a definition changes

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Sending the weekly report to the agreed list on the agreed day.

**Always needs a new yes.** A new recipient or audience, a change to a metric definition, and any change to tracking or ad settings suggested in the report (those go through the tracking or media buyer workflow).
