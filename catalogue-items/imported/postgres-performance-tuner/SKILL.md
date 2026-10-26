---
name: supabase-postgres-best-practices
description: Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations.
risk: safe
source: https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices
source_repo: supabase/agent-skills
source_type: official
date_added: 2026-07-01
license: MIT
license_source: https://github.com/supabase/agent-skills/blob/main/LICENSE
---

# Supabase Postgres Best Practices

A performance review for Postgres, built on rules maintained by Supabase. It has rules in 8 categories, ordered by impact. Use it to review a set of queries and a schema, and to hand back a ranked list of fixes.

## What you need

- The SQL to review: slow queries, or the SQL files from the project.
- The table definitions (CREATE TABLE and CREATE INDEX statements).
- Optional but useful: EXPLAIN ANALYZE output for the slow queries, rough table sizes, how many connections the app opens, and whether it uses a pooler.

If the queries or the table definitions are missing, ask once. If you still do not have them, review what you were given and write `MISSING: <what>` under "Not checked". Never invent table names, columns, sizes or timings.

## Steps

1. Sort the input into queries, tables, settings and access rules. Note what is missing.
2. Go through the categories below in priority order. Do not skip the top three even if the user only mentioned one problem.
3. For each problem you find, open the matching rule file in `references/` (for example `references/query-missing-indexes.md`) and read it before you write the finding. If the rule files are not available in this chat, apply the category from general Postgres knowledge and say "rule file not available" on that finding.
4. Write the finding in the format under "Output". Use the user's own table and column names in the SQL, not the rule file's examples.
5. Rank the findings. Put CRITICAL first, then HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM and LOW. Inside one level, put the finding that touches the most queries first.
6. End with a test plan and a "Not checked" list.

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

Each rule file in `references/` has a short reason it matters, an incorrect SQL example, a correct SQL example, and sometimes EXPLAIN output and Supabase-specific notes. Start with:

```
references/query-missing-indexes.md
references/query-partial-indexes.md
references/_sections.md
```

`references/_sections.md` lists every category and rule.

## Output

Return, in this order:

1. **Checked**: one line on what you reviewed and what was missing.
2. **Findings table**: columns `#`, `Finding`, `Area`, `Rule file`, `Impact`. Impact is the rating of the category above. Do not turn it into a promised speed-up. The rule files quote figures from their own examples, and your database will differ.
3. **One block per finding**: the problem in one plain sentence, `Current SQL`, `Suggested SQL`, `Why` (one or two sentences), and `Test it` (what to compare).
4. **Test plan**: run each change on a copy of the database first. Run EXPLAIN ANALYZE before and after, and keep a change only if the plan or the time improves. For index changes on a live table, say to check the rule file's note on locking before running them in production.
5. **Not checked**: anything you could not judge and the input that would let you.

## Checks

- Every finding names a rule file, or says "rule file not available".
- Every SQL snippet uses the user's real table and column names.
- No finding promises a speed-up figure for the user's database.
- Security findings (row-level security, privileges) say what to verify as a different user before shipping.
- You did not run, or claim to have run, any query.

## When not to use

- The database is not Postgres. These rules do not carry over to MySQL, SQL Server or Snowflake.
- The user has one slow query to rewrite. The Postgres query tuner skill is built for that.
- The user wants a new schema designed. Use the Postgres schema designer.
- The database is down now. Tell the user to contact their database admin or host first.
- The question is about an ORM's own settings and not about SQL or Postgres settings.

## References

- https://www.postgresql.org/docs/current/
- https://supabase.com/docs
- https://wiki.postgresql.org/wiki/Performance_Optimization
- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security

## Credit and licence

The rules were written by Supabase (`supabase/agent-skills`, MIT licence, as stated in the front matter above). This copy comes from the `sickn33/agentic-awesome-skills` collection, which states that its written content is under CC BY 4.0 (see `LICENSE-CONTENT`). Keep this credit to Supabase and sickn33 when you reuse it.

## Limitations

- Use this skill only when the task clearly matches Postgres performance, schema or configuration review.
- Verify commands, settings and behaviour against the current Postgres and Supabase documentation before making changes.
- Do not treat suggested SQL as a substitute for tests on your own data, a security review, or approval before destructive or costly changes.
