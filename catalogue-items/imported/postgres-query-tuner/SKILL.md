---
name: postgres-best-practices
description: "Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations."
risk: safe
source: community
date_added: "2026-02-27"
---

# Supabase Postgres Best Practices

Postgres performance rules maintained by Supabase, in 8 categories ordered by impact. Use them to tune one slow query, or the table and settings it depends on, one change at a time.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **The data model** (yours): the database tables or collections, their fields and how they link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, the data model. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** It reads pasted SQL and query plans well and explains each change in plain words.
- **Claude Code or Codex:** They can open your project files and the rules folder, so you paste less.
- **psql or your database's SQL editor:** You run EXPLAIN ANALYZE there before and after each change.
<!-- /needs -->

## What you need

- The slow query, as plain SQL.
- The definitions of the tables it reads, with their existing indexes.
- Optional but useful: EXPLAIN ANALYZE output for the query, table sizes, how often the query runs, and database settings.

If the query or the tables are missing, ask once. If they are still missing, say what you cannot judge and write `MISSING: <what>`. Never invent table names, columns, sizes or timings. You cannot run SQL in a chat, so ask the user to run EXPLAIN ANALYZE and paste the result.

## Steps

1. **Read the query and tables.** List what the query reads, joins, filters and sorts on. Note anything missing.
2. **Read the plan.** If the user gave EXPLAIN ANALYZE output, find the slowest step (for example a sequential scan on a large table). If not, ask for it before guessing.
3. **Match a rule.** Use the category prefixes below to find the rule file in `rules/` that covers the slow step. Read it before you write the fix. If the rule files are not available in this chat, say "rule file not available" and apply the category from general Postgres knowledge.
4. **Apply the top fix only.** Rewrite the query or write the index, type or settings change. Use the user's own table and column names, not the rule file's examples.
5. **Say what it costs.** For example a larger index, slower writes, or a table lock while an index builds. Check the rule file for a note on this.
6. **Re-measure.** Ask the user to run it on a copy of the database and paste a second EXPLAIN ANALYZE. Compare the two runs. If the query is still slow, go back to step 2 for the next fix.

## Rule categories by priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## Rule files

Read individual rule files for the explanation and SQL examples:

```
rules/query-missing-indexes.md
rules/query-partial-indexes.md
rules/_sections.md
```

Each rule file contains: why it matters, an incorrect SQL example, a correct SQL example, optional EXPLAIN output or metrics, more context and references, and Supabase-specific notes where they apply.

For the full compiled guide with every rule expanded, see `AGENTS.md`.

## Output

For each change, in order:

- **Slow step**: what the plan shows and where.
- **Change n**: the name of the fix and its rule file.
- **Before** and **After**: the SQL.
- **Why it helps**: one or two plain sentences.
- **Cost**: what it adds or slows down.
- **Test it**: what to run on a copy and what to compare.
- **Next**: the next change to try if the query is still slow.

End with **Not checked**. Do not promise a speed-up. The rule files quote figures from their own examples, and the user's database will differ.

## Checks

- Every change names a rule file, or says "rule file not available".
- Every SQL snippet uses the user's real table and column names.
- Index and settings changes come with a cost note and a test step on a copy.
- You did not run, or claim to have run, any query.

## When not to use

- The database is not Postgres.
- The user wants the whole app and schema reviewed. Use the Postgres performance tuner skill.
- The user wants new tables designed. Use the Postgres schema designer.
- A live database is failing now. Tell the user to get a database admin first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Postgres performance tuner](https://useaiblocks.com/skills/postgres-performance-tuner). It takes the code change.
- The [Database schema planner](https://useaiblocks.com/skills/database-schema-planner). It takes the code change.
- The [Database designer](https://useaiblocks.com/skills/database-design-guide). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Credit and licence

These rules were written by Supabase. This copy comes from the `sickn33/agentic-awesome-skills` collection, whose written content is under CC BY 4.0 (see `LICENSE-CONTENT`). Keep the credit to Supabase and sickn33 when you reuse it.

## Limitations

- Use this skill only when the task clearly matches Postgres query, schema or settings tuning.
- Do not treat the output as a substitute for tests on your own data, a security review, or approval before costly or destructive changes.
- Stop and ask if required inputs, permissions, safety boundaries or success criteria are missing.
