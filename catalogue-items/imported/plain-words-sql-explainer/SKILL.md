---
name: sql-to-business-logic
description: Translate SQL queries into plain language business logic. Use when documenting queries, explaining analysis to non-technical stakeholders, code reviewing for correctness, or building a query catalog.
---

# SQL to Business Logic Translator

# When to use
- A stakeholder asks "what exactly does this query calculate?"
- Documenting a query library or a dbt model for non-technical readers
- Reviewing a query for correctness by comparing its logic to the business requirement
- Onboarding new analysts to existing SQL patterns
- Translating legacy undocumented queries before refactoring

**Not for:** speeding up a slow query (ask a database admin), writing a new query from a business question (use the Plain-words SQL writer), or fixing wrong data in the source tables.

**Chat route:** the script and the template are optional extras in the source folder. In a chat, work from the steps below alone and use the section headings listed under Output as the document shape.

# Process
1. **Receive the query and context** — obtain the SQL and the business question it answers. Also collect any schema notes (what the key tables and columns represent in business terms).
2. **Translate the FROM/JOIN structure** — describe in plain language which data sources are combined and what type of join is used (inner keeps only matches; left keeps all rows from the left side). Note if the join type seems inconsistent with the stated purpose.
3. **Translate WHERE filters** — list each filter condition as a business rule in plain language (e.g., `status = 'completed'` → "only includes orders that have been paid and fulfilled").
4. **Explain GROUP BY and aggregations** — describe what each aggregation computes and at what grain. Optional: if you can run code, use `scripts/sql_explainer.py` to automate a first-pass structural parse. In a chat, skip it and read the query yourself.
5. **Summarise output columns** — for each output column, state its business meaning and any edge cases (nulls, rounding, currency units).
6. **Flag issues and write validation questions** — identify potential problems (implicit null propagation, unexpected fan-out, hardcoded dates). Generate 3–5 questions the query author should confirm. Use `assets/query_documentation_template.md` to record the full translation.

# Inputs the skill needs
- The complete SQL query (SELECT through ORDER BY)
- The business question the query is intended to answer
- Table and column descriptions (or a data catalog entry)
- Any business rules for key status values, date handling, or currency
- The intended output: who reads the result and for what decision

# Output
Document sections, in this order: Business purpose, Plain-language explanation (what is calculated, data source and joins, filters, grouping), Output columns, Business rules, Validation questions.

- `scripts/sql_explainer.py` — parses a SQL query and generates a structured plain-language explanation
- `assets/query_documentation_template.md` — completed translation covering purpose, step-by-step logic, output columns, business rules, and validation questions
- Optionally: a flowchart representation of the query logic

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [SQL query launch reviewer](https://useaiblocks.com/skills/sql-query-launch-reviewer).
- The [Plain-words SQL writer](https://useaiblocks.com/skills/plain-words-sql-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
