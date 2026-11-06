# Daily and weekly site records

**Cadence:** Every site day (daily report and delay log, the same evening) and every week (look-ahead on Thursday, client report on Friday, or the days the client prefers).

**Trigger:** Work has started on site.

**Access:** Level 1 (read) on site notes, photos, the programme and the project tool is enough to write the records. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "complete the daily log in Procore by 7 pm; file photos; send the look-ahead to the six named trades; send the weekly report to the two client contacts; no contract notices").

## Steps

### Every site day
1. **Collect the notes.** Site manager's notes, voice-memo transcripts, photo list, deliveries, visitors.
2. **Write the daily report.** Run `site-reports-and-delay-log` with the fixed headings. [L2] Draft the daily log. [L3] Complete the daily log and file the photos.
3. **Log delays.** Add a delay-log row for every hold-up the same day, with cause, critical yes or no, days lost, who was told and evidence. Pull official weather records where weather is the cause.
4. **Flag incidents and notices.** Pass any incident or near miss to the person in control of the site at once and record that you did. Flag possible contract notices for the client. *Approval: any notice under the contract needs the client's fresh yes; I never send one on my own.*
5. **Update RFIs and submittals.** Chase items whose date needed is close. [L3] Send chasers to the named designers and suppliers.

### Every week
6. **Record the week.** Mark planned tasks done or not done with reasons; work out the week's percent plan complete.
7. **Update the programme.** Feed in actual progress; check whether the critical path or finish date has moved. [L3] Update progress in the live programme. *Approval: moving a contract completion date needs the client's fresh yes.*
8. **Roll the look-ahead.** Run the `two-week-look-ahead` prompt. [L3] Send it to the named trades.
9. **Write the client report.** Run the `weekly-client-progress-report` prompt. Bad news first. [L2] Draft it. [L3] Send it to the named client contacts with the photos, and list every live action taken this week at the foot.
10. **Check the record.** Make sure the daily reports, delay log, programme and weekly report all show the same dates and causes.

## Outputs

- Daily reports and filed photos
- Delay log
- RFI and submittal chasers
- Updated programme and weekly completion record
- Two-week look-ahead
- Weekly client report
- Action log (level 3)

## Needs the client's approval

Any notice, claim or letter under the contract; moving a contract date; messages to anyone outside the named contacts; any change to the contract's price, time, scope or terms; and deleting or overwriting records. Safety decisions stay with the person in control of the site and the client's advisers.
