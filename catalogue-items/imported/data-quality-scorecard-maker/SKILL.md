---
name: data-quality-audit
description: Comprehensive data quality assessment against business rules, schema constraints, and freshness expectations. Activate when validating data pipeline outputs before production use, auditing a dataset against defined business rules, or producing a quality scorecard for a data asset.
---

# When to use
- A data pipeline has just loaded new data and needs validation before downstream reports consume it
- A stakeholder has flagged data quality concerns (wrong totals, unexpected nulls, stale data)
- You need to produce a formal data quality scorecard for a data asset as part of a data governance process
- You are onboarding a new data source and need to understand its quality profile before building on it

# Process
1. **Null and completeness audit** — run `scripts/null_counter.py` for a column-by-column null profile. Flag columns above acceptable thresholds for the business context.
2. **Duplicate detection** — run `scripts/duplicate_finder.py` to identify full-row and key-level duplicates. Determine if duplicates are intentional (versioning) or errors (pipeline fan-out).
3. **Referential integrity check** — run `scripts/referential_integrity.py` to validate that foreign key values in child tables exist in parent tables. Report orphan rate per relationship.
4. **Value range validation** — run `scripts/value_range_validator.py` with business rules defined in `references/business_rule_patterns.md`. Flag values outside acceptable ranges.
5. **Freshness check** — run `scripts/freshness_check.py` to verify the dataset is up to date — compare the latest record timestamp against the expected lag for this pipeline.
6. **Score and classify findings** — map each finding to a quality dimension using `references/quality_dimensions.md`. Assign severity (CRITICAL / HIGH / MEDIUM / LOW).
7. **Produce deliverables** — fill `assets/audit_report_template.html` for a shareable report; fill `assets/quality_rubric.md` for a concise scorecard.

# Inputs the skill needs
- Required: dataset (CSV / Parquet / database table reference)
- Required: schema relationships — which columns are primary keys, which are foreign keys to which tables
- Required: business rules — acceptable value ranges, expected value sets, freshness SLA
- Optional: acceptable error rates — at what threshold does a failure become CRITICAL vs. HIGH
- Optional: pipeline schedule — to assess freshness relative to expected update frequency

# Output
- `assets/audit_report_template.html` (filled) — full quality report, shareable with stakeholders
- `assets/quality_rubric.md` (filled) — one-page quality scorecard with dimension scores
- Script console output — per-check pass/fail counts for each validation script

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Data analyst](https://useaiblocks.com/skills/data-analyst). It takes the audit report.
- The [Spreadsheet and CSV cleaner](https://useaiblocks.com/skills/data-file-clean-up-loop).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
