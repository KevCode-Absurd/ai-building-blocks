---
name: schema-design-from-business-rules
description: Turns a business's things, actions and rules (bookings, memberships, stock, orders, client accounts) into tables, keys, constraints and indexes for PostgreSQL, MySQL or SQLite, with delete behaviour on every foreign key, engine-specific traps handled (unindexed PostgreSQL foreign keys, SQLite foreign keys off by default, InnoDB rules), a Mermaid ER diagram, a data dictionary, seed data that covers edge cases and a first migration with up and down. Works from a description or spreadsheet at access level 1; runs the migration on a development database or branch at level 2; applies it to production only at level 3 with a tested backup and a fresh yes for that migration. Use it for a new app or feature, or to turn a busy spreadsheet into proper tables.
---

# Schema design from business rules

## When to use

- A new app or feature needs its tables.
- A spreadsheet that runs part of the business has outgrown itself.
- An existing schema lets impossible data in (double bookings, orders with no customer).
- A team wants ORM models (Prisma, Django, SQLAlchemy, Eloquent) that match the rules.

## What you need

1. A plain description of what the business stores and does, or the spreadsheet's column headers and a few made-up rows.
2. The rules: what must be unique, what is required, what must never be deleted, what happens when something is cancelled.
3. The questions the data must answer ("how many classes does this member have left?").
4. Database and exact version, ORM and migration tool if any.
5. For an existing app: the current schema (DDL or models), table sizes, no customer rows.
6. Access: level 1 to read and design. Level 2 to run the migration on a development database or branch. Level 3 to apply it to production through the pipeline, with a tested backup and a fresh yes for that migration.

## Steps

### 1. List things, actions and rules

Write three lists. Things (member, class, booking, payment). Actions (book, cancel, refund, transfer credit). Rules, each as a sentence starting "must" or "never" ("a member must never hold two bookings for the same class", "a class must never be over capacity", "a payment must never be deleted"). Ask about every rule you are unsure of; do not guess.

### 2. Write the questions as queries

For each question the business asks, sketch the query. If a question cannot be answered from the draft tables, a table or column is missing. This step catches most design gaps before any DDL.

### 3. Draft tables

- One table per thing, with a one-line purpose and its grain (what one row is).
- Primary key on every table: an identity column or, on PostgreSQL 18, `uuidv7()` for UUID keys that sort by time. Keep natural keys (order number, email) as unique constraints.
- Types: `timestamptz` for moments, `date` for days, `numeric` for money with a currency column, `text` with a `CHECK` for codes, `boolean` for flags. On SQLite, use `STRICT` tables so types are enforced.
- Lower-case names with underscores; singular or plural, but one convention.
- For apps serving many client accounts, a tenant column on every tenant-owned table, included in unique keys and foreign keys.

### 4. Turn rules into constraints

- Required: `NOT NULL`.
- Unique: `UNIQUE`, remembering that NULLs count as distinct by default in PostgreSQL; use `NULLS NOT DISTINCT` or a partial unique index (`WHERE cancelled_at IS NULL`) when needed.
- Row rules: `CHECK` (capacity > 0, end after start), looking only at the row itself.
- Cross-row rules: unique or partial unique indexes; on PostgreSQL, exclusion constraints for overlapping time ranges, or `WITHOUT OVERLAPS` keys on version 18.
- Name every constraint so errors read clearly (`booking_member_class_unique`).

### 5. Decide delete behaviour on every foreign key

For each link, write what happens when the parent goes: `CASCADE` for parts that cannot exist alone, `RESTRICT` for things others depend on, `SET NULL` for optional links. Prefer status columns or soft deletes (`cancelled_at`, `archived_at`) for anything with money or history attached. Engine notes:
- PostgreSQL: index referencing columns yourself.
- MySQL: InnoDB tables; `NO ACTION` acts as `RESTRICT`; `SET DEFAULT` is rejected; MySQL adds the child index if missing.
- SQLite: `PRAGMA foreign_keys = ON` on every connection, outside transactions, or the keys do nothing.

### 6. Add history where it matters

Status changes that people ask about later (booking confirmed, cancelled, refunded) go in a status history table with who, when and why. Money tables are append-only: corrections are new rows, not edits.

### 7. Add indexes for the questions

One index per real query pattern: equality columns first, then the range or sort column. Foreign keys indexed. Partial indexes for "active" subsets. No speculative indexes.

### 8. Draw and document

A Mermaid ER diagram with every table and link. A data dictionary: per table, purpose, grain, columns with type, meaning and allowed values, keys, common joins and traps.

### 9. Seed data with edge cases

Made-up rows that exercise every rule: an expired pack, a full class, a cancelled booking, a refund, a member with no bookings, a tenant with no data. Each constraint should reject at least one bad seed row in a test.

### 10. Write the first migration

Up and down, in the client's ORM or plain SQL for the named version. Run it up, down and up again on a development database or branch (level 2) and run the seed tests. For an existing production database, the change goes through the `production-migration-with-backup-gate` workflow: tested backup, change list and a fresh yes before it runs.

## Checks

- Every "must" and "never" rule maps to a constraint, or is listed with a reason it lives in app code.
- Every foreign key has its delete behaviour written and an index where the engine needs one.
- Types, syntax and features fit the named database version.
- Every business question has a working query against the draft.
- Seed data breaks each constraint at least once in tests.
- For an existing app, every current table and column is accounted for in the new design.
- Nothing ran on production without a tested backup and a fresh yes.

## Output format

1. Things, actions and rules lists.
2. Mermaid ER diagram.
3. DDL or ORM models, with named constraints and indexes.
4. Data dictionary.
5. Seed data and the tests it drives.
6. Migration files, up and down, with the run log from development.
7. Open questions for the client.

## Example of good output (short)

*Illustrative structure, not a real business: a climbing wall with class bookings on PostgreSQL 18. Copy the shape, never the content: every fact comes from the client's own context.*

> **Rule to constraint**
>
> | Rule | Constraint |
> |---|---|
> | A member never holds two live bookings for one class | `CREATE UNIQUE INDEX booking_live_unique ON booking (member_id, class_id) WHERE cancelled_at IS NULL;` |
> | A class has a positive capacity | `CHECK (capacity > 0)` |
> | Payments are never deleted | `payment_id` referenced with `ON DELETE RESTRICT`; no delete grant for the app role |
> | Cancelling a member keeps their history | `member.archived_at timestamptz`, no cascade from member to booking |
>
> ```mermaid
> erDiagram
>   member ||--o{ booking : makes
>   climbing_class ||--o{ booking : has
>   booking ||--o| payment : "paid by"
> ```
>
> **Index:** `CREATE INDEX booking_class_id_idx ON booking (class_id);` because PostgreSQL does not index referencing columns, and the class list page filters by class.
