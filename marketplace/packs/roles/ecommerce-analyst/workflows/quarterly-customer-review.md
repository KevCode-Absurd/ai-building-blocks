# Quarterly customer review

**Cadence:** every quarter, in the first two weeks after the quarter ends.

**Trigger:** the quarter closes, or the retention or email team is planning the next quarter's campaigns.

## Steps

1. **Pull the order export (level 1; tool: store admin or order database).** At least 24 months, with customer IDs, dates, net values, refunds and a consent flag. Products and first-order channel if available.
2. **Score and segment (skill: rfm-and-cohorts).** Clean, score recency, frequency and spend against this store's customers, name the groups, size them, and compare with last quarter's groups.
3. **Read the cohorts (skill: rfm-and-cohorts).** Repeat rate by first-order month at 30, 60, 90, 180 and 365 days, and median days to second order, against the same months a year earlier. Leave incomplete windows blank.
4. **List slipping regulars (prompt: slipping-customers-list).** Ranked by past spend, with who may be contacted.
5. **Add margin by group (skill: margin-and-returns-check).** Contribution and return rate by segment and by first-order channel, so the plan doesn't chase customers who cost more than they bring.
6. **Write the plan.** One action per group, the one group to start with, and the money at stake as an estimate. Hand the plan to the email or retention lead; I don't write or send the messages.
7. **Set up segments (level 2 to draft; level 3 to create live segments or customer tags within limits).**
   **Approval point:** the owner approves the segment rules and the list of groups before any segment is created live. Syncing any segment to a new email list, ad audience or app needs a fresh yes each time.
8. **Log and report.** Segments created, counts, rules, and where they live.

## Outputs

- Segment table with this quarter against last.
- Cohort table and a two-line reading.
- Slipping regulars list (IDs).
- Margin and return rate by segment.
- Quarter plan: one action per group and where to start.
- Change log for segments and tags created.

## Needs the client's approval

- Segment rules and group names, before they go live.
- Any upload or sync of customer data to a new place.
- Use of customer data in any market where consent is unclear; check with a qualified adviser.
