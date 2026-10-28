---
name: database-design
description: "Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases."
risk: safe
source: community
date_added: "2026-02-27"
---

# Database Design

> **Learn to THINK, not copy SQL patterns.**

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a code change. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your project and check a schema file with the bundled helper script.
- **Any good chat AI:** It can make the picks and outline from your written description.
<!-- /needs -->

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File | Description | When to Read |
|------|-------------|--------------|
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | Choosing database |
| `orm-selection.md` | Drizzle vs Prisma vs Kysely | Choosing ORM |
| `schema-design.md` | Normalization, PKs, relationships | Designing schema |
| `indexing.md` | Index types, composite indexes | Performance tuning |
| `optimization.md` | N+1, EXPLAIN ANALYZE | Query optimization |
| `migrations.md` | Safe migrations, serverless DBs | Schema changes |

---

## ⚠️ Core Principle

- ASK user for database preferences when unclear
- Choose database/ORM based on CONTEXT
- Don't default to PostgreSQL for everything

---

## How to run this skill (added by AI Blocks)

1. Ask once for what is missing: what the app does and stores, where it runs (server, serverless, edge), the language and team tools, the current schema (optional, and if an earlier step gave you SQL for it, use that), any slow query (optional). Ask at most five questions. If an answer is still missing, write `MISSING: <what>` and name the assumption you used. Never invent tables, row counts or traffic.
2. Read only the notes in the table above that the request needs.
3. Hand back, in this order: Database pick, ORM pick, Schema outline, Index plan, Slow query notes (only if a query was given), Safe change steps, Open questions. Give each pick one reason and one trade-off.
4. This skill gives principles and an outline, not full SQL. For ready-to-run CREATE TABLE statements, point to the Database schema designer. For a migration file with a rollback, point to the Database migration writer.
5. For any change to a large live production table, say a database specialist should review it before it runs.

---

## Decision Checklist

Before designing schema:

- [ ] Asked user about database preference?
- [ ] Chosen database for THIS context?
- [ ] Considered deployment environment?
- [ ] Planned index strategy?
- [ ] Defined relationship types?

---

## Anti-Patterns

❌ Default to PostgreSQL for simple apps (SQLite may suffice)
❌ Skip indexing
❌ Use SELECT * in production
❌ Store JSON when structured data is better
❌ Ignore N+1 queries

## When to Use
Use when selecting a database model, reviewing schema relationships and indexes, or assessing a proposed schema with the bundled advisory tools.

## Schema helper

`scripts/schema_validator.py` is a read-only heuristic inventory, not a Prisma or Drizzle parser. Missing schemas, unsupported formats and heuristic-only results return nonzero with `passed: false` and `analysis_complete: false`. Use the project-local ORM validator for syntax and type checks; review migration and constraint semantics separately.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Agent database migration planner](https://useaiblocks.com/skills/agent-database-migration-planner). It takes the data model.
- The [Postgres query tuner](https://useaiblocks.com/skills/postgres-query-tuner). It takes the data model.
- The [Database performance analyst](https://useaiblocks.com/skills/agency-engineering-database-optimizer). It takes the data model.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
