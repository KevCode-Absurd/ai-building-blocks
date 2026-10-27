---
name: metric-reconciliation
description: Trace and resolve discrepancies when the same metric shows different values in two or more sources. Use before reporting, after pipeline changes, or when stakeholders question a number.
---

## Supporting material availability

This catalog copy does not include these files:

- `references/metric_discrepancy_guide.md`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

# Metric Reconciliation

# When to use
- Two dashboards or reports show different values for the same KPI
- A metric changed unexpectedly after a data pipeline update
- Stakeholders question a number and need an authoritative explanation
- Preparing to merge or deprecate a legacy reporting source
- Onboarding analysts to a new data model and validating it against the old one

# Process
1. **Define the metric and scope** — confirm the exact definition (numerator, denominator, filters, time zone) and the period under investigation. Mismatched definitions are the most common cause of discrepancy.
2. **Pull values from both sources** — extract the metric values for the same period from each source. Record absolute values, row counts, and the query or calculation path used.
3. **Compute the gap** — calculate the absolute difference and percentage gap. If the gap is within an agreed tolerance (e.g., ±0.1%), document it as accepted and close. See `references/reconciliation_patterns.md` for tolerance guidelines.
4. **Trace the computation path** — walk each source's query or pipeline step by step. Common divergence points: different join types, filter order, null handling, date truncation, or deduplication logic.
5. **Identify the root cause** — classify the cause as one of four types. The guide file for this step is not in this copy, so use these meanings: definition mismatch (the two sources count different things, filters or periods); data freshness (one source updated later than the other); aggregation grain (the sources roll up at different levels, such as by order or by customer); calculation bug (a wrong join, filter or formula). Document the divergence point with a code snippet or query excerpt.
6. **Resolve and document** — fix the calculation or accept a canonical source, then complete `assets/reconciliation_report_template.md` and share with stakeholders.

# Inputs the skill needs
- The metric name and business definition (numerator, denominator, any known variants)
- Access to both sources (queries, dashboard SQL, or raw data)
- The time period showing the discrepancy
- Row counts or record-level data to enable line-by-line comparison if needed
- Any known recent changes to pipelines, schema, or business rules

# Output
- `assets/reconciliation_report_template.md` — completed report showing source A vs. source B, the gap, root cause, and resolution status. Its sections, in order: Values compared, Root cause, Evidence, Resolution, Preventive measure.
- A corrected query or pipeline change (if a bug was found)
- A documented tolerance agreement (if the gap is acceptable)

# Next steps
After the report, name who signs it off (the owner of the metric), where it is stored (for example next to the dashboard or in the data catalog), and which data-quality check to run on the source that was wrong, so the gap does not come back. If the two sources should share one definition, use the Metric definition writer to record it.
