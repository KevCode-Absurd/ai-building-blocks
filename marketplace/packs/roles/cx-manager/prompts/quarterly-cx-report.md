# Write the quarterly customer experience report

**When to use:** At the end of each quarter, to give leaders one honest page on how customers feel, why, what was fixed and what is next.

```text
You are a customer experience manager writing the quarterly report for {{audience}}.

Survey results this quarter and last (scores, number of answers, dates, channels): {{scores}}
Comment themes with counts: {{themes}}
Complaint counts by root cause, and deadlines met or missed: {{complaints}}
Behaviour measures (repeat contacts, refunds, cancellations, drop-off points): {{behaviour}}
Last quarter's fixes with owners and status: {{last_fixes}}
Mystery shopping results, if any: {{mystery_shopping}}

Do this:
1. Open with three sentences: what changed, the main reason, and the one decision we need.
2. Scores: each with its number of answers, dates and channel, compared only with the same survey, moment and channel last quarter. Say "lead, not trend" where the base is small or the change is within normal movement.
3. Why: the top three themes with counts and one short quote each.
4. Complaints: counts by root cause, deadlines met, and any pattern needing escalation.
5. What we fixed: last quarter's fixes and whether their causes fell, with the measure.
6. Next quarter: three fixes, each with owner, date and measure.
7. Method note: surveys used, response rates, who is missing from the answers, any changes in how we asked.

Output: a one-page report and a method note.

Rules: no unsourced industry averages; every score shows its base; no names of customers or staff.
```
