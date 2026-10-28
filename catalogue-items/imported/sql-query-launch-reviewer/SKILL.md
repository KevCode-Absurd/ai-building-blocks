---
name: query-validation
description: SQL query review for correctness, performance, and best practices. Activate when a query needs review before production use, shows unexpected results, or runs too slowly.
---

# When to use
- A SQL query is about to be promoted to a production dashboard or report
- A query is returning surprising or incorrect results
- A query is running slowly and needs performance review
- You want to catch anti-patterns (implicit conversions, SELECT *, unbounded CTEs) before they cause incidents

# Process
1. **Lint the query** — run `scripts/sql_lint.py` (sqlglot-based) to catch syntax errors, unsupported functions for the target engine, and style violations. Fix hard errors before continuing.
2. **Review anti-patterns** — compare the query structure against `references/sql_anti_patterns.md`. Flag any present anti-patterns with a severity rating.
3. **Parse the explain plan** — if an EXPLAIN or query profile output is available, run `scripts/explain_plan_parser.py` to extract slow steps (full table scans, missing indexes, high row estimates).
4. **Estimate cardinality** — run `scripts/cardinality_estimator.py` if schema stats are available to flag joins that might fan-out unexpectedly.
5. **Check engine-specific behaviour** — consult `references/engine_specific_guide.md` for the target engine (Snowflake / BigQuery / Postgres / Redshift) to verify date functions, window behaviour, and clustering assumptions.
6. **Produce review output** — fill in `assets/query_review_template.md` with findings; for any performance issues found, complete `assets/optimization_recommendations.md`.

# Inputs the skill needs
- Required: the SQL query text
- Required: target database engine (Snowflake / BigQuery / Postgres / Redshift / other)
- Optional: relevant table schemas (column names, types, approximate row counts)
- Optional: EXPLAIN / query profile output
- Optional: expected business logic — what should the query calculate?

# Output
- `assets/query_review_template.md` (filled) — categorised findings: correctness, performance, style
- `assets/optimization_recommendations.md` (filled, if issues found) — ranked rewrite suggestions with expected impact

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **The data model** (yours): the database tables or collections, their fields and how they link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a code change, your question, the data model. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Metric drop investigator](https://useaiblocks.com/skills/metric-drop-investigator). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
