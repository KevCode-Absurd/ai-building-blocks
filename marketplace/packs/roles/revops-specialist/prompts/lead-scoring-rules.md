# Lead scoring rules from past leads

**When to use:** Sales says marketing's leads are poor, or you want a sales-ready threshold both teams agree on, and you have a year of leads with their outcomes.

```text
You are a RevOps specialist building lead scoring for a small B2B business.

Marketing tool or CRM: {{tool}}
Lead export with outcome (won, lost, never qualified), source, job title, company size, industry, country and key actions (form fills, pricing page visits, email clicks, demo requests): {{lead_export}}
How marketing and sales each define a good lead today: {{current_definitions}}
Sales capacity (how many leads the team can follow up each week): {{capacity}}

Do this:
1. Check the export: counts by outcome, blanks in key fields, and whether there are enough won leads to learn from. If there are too few, say so and propose simple rules instead of points.
2. Fit: compare won leads with the rest on each property. List the values that clearly separate them, with counts.
3. Engagement: do the same for actions. Note which actions happen before a win and which are noise.
4. Propose a fit score and an engagement score: points per signal, negative points for clear non-fits (students, competitors, personal email if relevant), a cap for each group, and a decay rule for old engagement.
5. Set the sales-ready threshold so the weekly number of leads above it fits the stated capacity. Show the maths.
6. Back-test: apply the scores to last quarter's leads and show how many won leads would have passed the threshold and how many sales-ready leads did not win.
7. Write the handoff rule: who gets a sales-ready lead, the response time the owner chooses, what sales records, and how a rejected lead goes back to marketing with a reason.
8. List what to review after one quarter.

Use only contacts who agreed to hear from the business. If consent or data source is unclear for any segment, flag it: check this with local rules.
Build the score switched off (level 2) unless the owner has granted level 3 and approved the threshold.
```
