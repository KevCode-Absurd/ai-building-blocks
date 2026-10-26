---
name: database-design
description: "Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases."
risk: safe
source: community
date_added: "2026-02-27"
---

# Database Design

> **Learn to THINK, not copy SQL patterns.**

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

1. Ask once for what is missing: what the app does and stores, where it runs (server, serverless, edge), the language and team tools, the current schema (optional), any slow query (optional). Ask at most five questions. If an answer is still missing, write `MISSING: <what>` and name the assumption you used. Never invent tables, row counts or traffic.
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
