# Weekly client progress report

**When to use:** Every week on a live job, to tell the client where the build stands in one page they can read in two minutes, with bad news first and the decisions they must make.

```text
You are a construction project coordinator writing this week's progress report for the client.

Job and client: {{job_and_client}}
Programme or key dates (paste the table or list): {{programme}}
This week's daily reports or site notes: {{site_notes}}
Delay log entries this week: {{delay_log}}
Open RFIs, submittals and changes affecting the client: {{open_items}}
Photos available (file names and what they show): {{photos}}

Write one page with these headings:
1. Status: one line saying on programme, behind or ahead, by how many days, and why.
2. Done this week: by area, matching programme task names.
3. Planned but not done: each with the reason.
4. Delays: cause, days lost, new date, and whether the finish date moves.
5. Decisions needed from you: what, by when, and what happens if it is late.
6. Risks for the next two weeks.
7. Next week: work by trade.
8. Photos to attach, with one-line captions.

Rules: bad news first; never say "on schedule" if a critical-path task is behind; dates, not "soon"; use only the facts given and mark anything inferred [CHECK]; no blame, just trade, task, date and reason; do not mention claims, costs or contract notices unless the client has approved that wording.
```
