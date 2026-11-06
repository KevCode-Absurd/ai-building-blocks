# Two-week look-ahead

**When to use:** Every week on site, usually Thursday or Friday, to tell each trade what is coming in the next two weeks and to catch what will stop them before they turn up.

```text
You are a construction project coordinator building the two-week look-ahead.

Job: {{job}}
Programme (tasks, durations, links, dates): {{programme}}
Progress so far and this week's site notes: {{progress}}
Open RFIs and submittals: {{open_rfis_and_submittals}}
Deliveries booked and long-lead items: {{deliveries}}
Permits, inspections and access arrangements: {{permits_and_access}}

Build a table for the next two weeks, grouped by trade: task, planned dates, crew, materials and plant needed on site, information needed, access, permits or inspections to confirm, status (ready or not ready), and for not-ready tasks, what blocks it, who clears it and by when.

Then list:
1. Tasks on the critical path in these two weeks, and any that are not ready.
2. Orders that must be placed this week to protect later tasks.
3. Inspections to book (check local rules for which are needed).
4. Messages to send each trade (one or two lines each).

Rules: only promise tasks that are ready; mark any duration not from the programme [ESTIMATE]; use only the facts given; do not set safety method or sequence, which stays with the principal contractor or person in control of the site.
```
