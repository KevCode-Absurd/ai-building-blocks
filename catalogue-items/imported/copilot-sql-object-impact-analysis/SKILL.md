---
name: sql-object-impact-analysis
description: "Before modifying a table, column, stored procedure, view, or trigger in a legacy codebase, trace every place that references it — across other SQL objects (procs, views, triggers) AND application code (C#, Angular/TypeScript, JS, or any language in the repo) — and produce a structured blast-radius report so you know what breaks before you change it. Use when the user asks 'what uses this column/table/procedure', 'is it safe to change X', 'what depends on this', 'impact of renaming/dropping X', or before any schema/proc modification in an unfamiliar or legacy codebase. Not for privacy/PII exposure analysis (see data-breach-blast-radius) or query performance tuning (see sql-optimization)."
---

# SQL Object Impact Analysis

You are performing a **pre-change dependency trace** for a database object (table, column, stored procedure, view, function, or trigger) inside a legacy or unfamiliar codebase. The goal is a single, trustworthy answer to: *"If I change this, what else is affected?"*

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

## When to use this

Trigger when the user:
- Names a specific table, column, stored procedure, view, or trigger and asks what uses it, what depends on it, or whether it's safe to change/rename/drop
- Is about to modify a schema element in a codebase with no ORM, or a mixed legacy stack (raw SQL + stored procs + hand-written data access code)
- Asks for a "blast radius," "impact analysis," or "dependency trace" of a specific DB object

Do not use this for:
- General SQL performance tuning (use `sql-optimization`)
- SQL code quality/security review (use `sql-code-review`)
- Privacy/PII exposure analysis (use `data-breach-blast-radius`)
- Architecture-level documentation of an entire codebase (use `doc-and-modernize`)

## Process

1. **Confirm the target object and its exact name(s).** Ask if ambiguous (e.g., multiple tables with similar names, or the user says "the customer table" without specifying schema). Get the precise identifier before searching.

2. **Search the SQL layer first:**
   - Search all `.sql` files, stored procedure definitions, views, functions, and triggers in the repo/database scripts folder for direct references to the object name
   - For a column: check every proc/view/trigger that selects, inserts, updates, or filters on it
   - For a table: check every proc/view/trigger that references it, plus foreign key relationships to/from other tables
   - For a stored procedure: check every other proc that calls it, and every scheduled job/agent step that invokes it
   - Note indirect references too — dynamic SQL (`EXEC(@sql)`), synonyms, and views built on views

3. **Search the application layer:**
   - Search all application code (C#, Java, JS/TS, Angular, whatever the repo contains) for:
     - Direct SQL strings referencing the object name
     - ORM/data-access-layer method or class names that map to it (e.g., a repository method calling the stored procedure)
     - API endpoint handlers that ultimately call into the affected data path
   - Trace one layer further where reasonable: does a frontend component consume an endpoint that touches this object? Note it, but don't chase every UI consumer exhaustively — flag "further downstream consumers likely exist" if the trail runs cold rather than guessing.

4. **Classify each finding by confidence:**
   - **Direct** — object name found verbatim in code/SQL
   - **Indirect** — reached via a proc call chain, ORM mapping, or dynamic SQL that couldn't be fully resolved statically
   - **Uncertain** — plausible but unverified (e.g., dynamic SQL construction that couldn't be traced to a literal object name)
   - Never present an Uncertain finding as if it were Direct — flag it clearly so the reader knows to verify manually

5. **Produce the report** (see Output Format below).

## Output Format

Always structure the report as:

1. **Target Object** — exact name, type (table/column/proc/view/trigger), and schema
2. **Direct SQL Dependents** — list of procs/views/triggers/functions that reference it directly, grouped by object type
3. **Application Code Dependents** — list of files/classes/methods that reference it, grouped by layer (data access, API/service, frontend), with file paths
4. **Indirect / Dynamic References** — anything found via dynamic SQL, synonyms, or call chains that couldn't be fully resolved — labeled clearly as needing manual verification
5. **Risk Summary** — one paragraph: is this object narrowly used (low risk) or widely fanned-out (high risk)? Call out anything that touches a scheduled job, external integration, or reporting layer specifically, since those often get missed
6. **Suggested Verification Steps** — concrete next actions before making the change (e.g., "run these two procs against staging data first," "check if the ReportingService endpoint at X depends on this column")

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Database schema planner](https://useaiblocks.com/skills/database-schema-planner). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Guidelines

- Never claim a dependency is complete or exhaustive — static text search cannot catch every dynamic SQL construction or reflection-based ORM mapping. State the search method used and its limits explicitly in the report.
- Never fabricate a file path, proc name, or line reference. If you searched and found nothing, say "no references found via text search" — not silence, and not an invented result.
- If the codebase is large enough that a full trace isn't feasible in one pass, say so and propose scoping (e.g., "search only the `Orders` module first") rather than silently producing a partial report as if it were complete.
- Keep the report scannable — this is a pre-change safety check someone will read in a few minutes before making a decision, not a full architecture document.