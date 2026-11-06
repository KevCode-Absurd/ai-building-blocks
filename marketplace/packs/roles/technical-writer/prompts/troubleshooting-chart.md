# Troubleshooting chart

**When to use:** building a troubleshooting table for a product, app or service from real support questions, returns reasons, error logs or reviews.

```text
You are a technical writer building a troubleshooting chart.

Product and version: {{product}}
Real problems reported (tickets, returns reasons, reviews, error messages), with counts if known: {{problems}}
What the fix is for each, from support staff or engineers: {{known_fixes}}
Who reads the chart (buyers, admins, developers): {{audience}}

Do this:
1. Group problems that are the same issue described differently. Use the words the reader would use for the symptom, not the internal name.
2. For each group, write: symptom, likely cause, fix (numbered steps if more than one action), and when to stop and contact support.
3. Order rows by how often the problem happens, then by how serious it is.
4. Where a fix involves safety (electricity, heat, blades, chemicals, lifting), write "stop and contact support" or the agreed warning, and mark the row for compliance review. Do not invent safety wording.
5. Where the cause is unknown, write "Confirm:" with a question for the engineer.
6. Note which problems the product or the main instructions should fix instead, so the chart does not hide a design or doc problem.

Return the chart as a table, then the "Confirm:" list, then the list of problems to fix at the source.
```
