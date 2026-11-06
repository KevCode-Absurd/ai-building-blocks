# Quarterly dashboard health check

**Cadence:** Every quarter, and after any change of till, CRM, booking or accounts system. About half a day for a small estate of five to ten reports.

## Steps

1. **List the estate (level 1).** Every dashboard and scheduled report: owner, readers, tool, data sources, refresh schedule, last refresh, last change. Flag any report with no named owner.
2. **Check refresh and freshness.** Look for failed or paused refreshes (Power BI pauses a schedule after two months with no visits), Data Studio sources with freshness slower than the decisions need, and alerts going to people who have left.
3. **Tie out the headline numbers.** For each live dashboard, compare at least three numbers with trusted source totals for the last closed month. Any gap goes through the `dashboard-review-and-tie-out` skill.
4. **Look for definition drift.** Compare each metric's current formula with its signed-off card. Changes without a release note are findings. The `why-dont-these-numbers-match` prompt helps when two reports have drifted apart.
5. **Review access.** Who can see each report; who is in each row-level security role; leavers still listed; Data Studio sources on owner's credentials shared wider than intended; content owned by a single person who may leave (Data Studio Pro moves ownership to the organisation).
6. **Check use.** Usage figures where the tool provides them. Reports nobody opened in the quarter are candidates to retire; ask their owner before anything is removed.
7. **Check readability.** Every tile has a comparison and unit; status has a label as well as colour; nothing past one screen that should be on one.
8. **Write the health report.** Findings ranked: wrong numbers, then stale data, then access risks, then unused or hard-to-read reports. Each with a fix and effort.
9. **Fix (level 2 or 3).** Apply agreed fixes in copies at level 2. At level 3, confirm the action list and limits with the owner first, then fix live and log each change with a release note.

## Outputs

- Estate list with owners, refresh status and last change
- Tie-out table for the quarter
- Definition drift list
- Access review (who sees what, leavers, credentials)
- Ranked health report with fixes
- Action log and release notes for any changes made

## Needs the client's approval

Any change to a metric definition in use; removing access for anyone or adding new viewers; retiring a report; changing refresh schedules or capacity; any live change at level 3, which also needs the action list and limits confirmed once before the first change.
