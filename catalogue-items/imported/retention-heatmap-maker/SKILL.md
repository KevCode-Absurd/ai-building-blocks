---
name: cohort-analysis
description: Time-based cohort analysis with retention and behaviour tracking. Activate when you need to measure how groups of users/customers behave over time — retention rates, revenue by cohort, or feature adoption curves.
---

# When to use
- A stakeholder asks "are we retaining users better than last quarter?"
- You need to measure N-day, weekly, or monthly retention for a product or feature
- You want to compare how different acquisition cohorts (by channel, plan, or signup date) perform over their lifetime
- You're investigating churn and need to identify at which period users typically leave

# Process
1. **Define the cohort and activity** — clarify: cohort grouping (signup month, first purchase date, etc.) and retention event (login, purchase, feature use). Document in the report header.
2. **Pull or build the data** — if starting from a database, use `scripts/cohort_query.sql` as the starting point. Adapt the `cohort_date` and `activity_date` columns to your schema.
3. **Build the cohort table** — run `scripts/cohort_builder.py` to produce a cohort × period membership table from event data. Output is a CSV with `user_id`, `cohort_period`, `activity_period`.
4. **Compute the retention matrix** — run `scripts/retention_matrix.py` on the cohort table to generate the period-over-period retention rates. Output is an N×M matrix (cohort × period).
5. **Visualise** — run `scripts/cohort_visualizer.py` to render a heatmap of the retention matrix and a time-series of retention curves per cohort.
6. **Interpret findings** — consult `references/retention_metrics_glossary.md` for metric definitions and `references/cohort_definition_patterns.md` for pattern recognition.
7. **Write the report** — fill `assets/cohort_report_template.md`. For a visual deliverable, fill in the `assets/retention_matrix.html` heatmap template.

# Inputs the skill needs
- Required: event data with `user_id`, `cohort_date` (e.g. `signup_date`), `activity_date`
- Required: cohort grouping granularity (daily / weekly / monthly)
- Required: retention event definition — what counts as "active" or "retained"?
- Optional: minimum cohort size (recommend ≥ 100 users; smaller cohorts have noisy rates)
- Optional: number of periods to track (e.g. 12 months)
- Optional: cohort attributes to segment by (acquisition channel, plan tier, geography)

# Output
- `assets/cohort_report_template.md` (filled) — narrative interpretation and retention figures
- `assets/retention_matrix.html` (filled) — colour-coded retention heatmap
- `scripts/retention_matrix.py` output CSV — raw retention rates for downstream use

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Sign-up group retention analyst](https://useaiblocks.com/skills/retention-cohort-analyst). It takes the spreadsheet.
- The [Offline dashboard builder](https://useaiblocks.com/skills/dashboard-builder). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
