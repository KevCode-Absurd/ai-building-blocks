---
name: safe-database-migration
description: Designs tables, keys and constraints for a new feature and writes up-and-down migrations for PostgreSQL or MySQL through the client's ORM (Prisma, SQLAlchemy, Django, Laravel) or plain SQL, avoiding long table locks (concurrent index builds, expand-and-contract for renames and type changes, batched backfills), with a text diagram, check queries, a tested backup and a rollback plan. Runs on development or staging at access level 2; on production only through the client's pipeline at level 3 after the action list is confirmed, and any step that deletes or overwrites data needs a fresh yes every time. Use it for new feature tables and for risky schema changes on live data.
---

# Safe database migration

## When to use

- A new feature needs tables, keys and constraints.
- A column must be renamed, split, retyped or made required on a table with live data.
- An index is needed on a busy table.
- A past migration locked the site or lost data, and the team wants a safer routine.

## What you need

1. The feature or change in plain words, and the rules the data must always obey ("one booking per seat", "every order has a customer").
2. The current schema (DDL or ORM models, no customer rows), table sizes, and how busy each table is.
3. Database and version, ORM and migration tool, and how migrations run today (in the deploy pipeline, by hand).
4. When a restore from backup was last tested, and how long a restore takes.
5. Access: level 1 to read the schema. Running migrations on a development or staging database needs level 2. Running on production needs level 3, a yes on the action list, and a fresh yes for any destructive step.

## Steps

### 1. Model the data

List entities, fields and types, keys and relationships. Draw a text diagram. Put every "must never happen" rule into the database: primary keys, foreign keys, `NOT NULL`, `CHECK`, and unique constraints (for example, unique on `(seat_id, show_id)` so a seat cannot be sold twice). Name constraints so errors are readable.

### 2. Classify each change

- **Safe:** create a new table; add a nullable column; add an index concurrently.
- **Locking:** many `ALTER TABLE` forms take a lock that blocks reads and writes while they run; a normal `CREATE INDEX` blocks writes until done.
- **Destructive:** drop a table or column, truncate, delete rows, or a backfill that overwrites values.

### 3. Plan risky changes as expand and contract

For a rename or type change, across separate releases:
1. **Expand:** add the new column (nullable), deploy code that writes both old and new.
2. **Backfill:** copy data in small batches, each in its own transaction, pausing between batches; record progress so it can resume.
3. **Switch:** deploy code that reads the new column; add `NOT NULL` or constraints once all rows comply (on PostgreSQL, a `CHECK ... NOT VALID` then `VALIDATE CONSTRAINT` avoids a long lock).
4. **Contract:** in a later release, drop the old column. This is destructive: fresh yes, backup first.

### 4. Build indexes without blocking writes

On PostgreSQL, `CREATE INDEX CONCURRENTLY`, outside a transaction block (many migration tools need a setting to allow this). Afterwards, check the index is valid; if the build failed, drop it and build again. On MySQL, check whether the version supports building the index online for that change.

### 5. Write up and down

Every migration has an up and a down. Where a down would lose data (dropping a column that has been written to), say so and make the down restore from the kept column or a backup instead. Set a lock timeout for the migration session so a blocked migration fails fast instead of queueing traffic behind it.

### 6. Write check queries

Before and after: row counts, null counts on new columns, constraint violations that would block validation, and a sample comparison of old and new columns during a backfill.

### 7. Test on a copy

Run up, down and up again on a development or staging database with realistic size (anonymised data). Time each step. Run the app's tests against the migrated schema.

### 8. Confirm the backup

Before any production migration, confirm a backup exists and that a restore was tested recently. GitLab lost about six hours of production data in January 2017 partly because its backups had been failing silently; a backup nobody has restored is a hope, not a plan.

### 9. Run on production (level 3)

Show the client the action list: each migration, its class (safe, locking, destructive), expected time, check queries, rollback. After their yes, run it through their pipeline, not from a laptop. Destructive steps run separately, each with its own fresh yes. Run the check queries and watch error rates and slow queries.

## Checks before handing over

- Every business rule that must never break is a database constraint.
- No locking change runs on a busy table without a plan to avoid the lock or a quiet window the client agreed.
- Indexes on live tables are built concurrently and checked for validity.
- Every migration has an up and a down, tested on a copy.
- Destructive steps are separate, marked, and wait for a fresh yes with a confirmed backup.
- Check queries are given with expected results.

## Output format

1. Text diagram of tables and relationships.
2. Change table: change, class (safe, locking, destructive), release, rollback.
3. Migration files (ORM or SQL), up and down.
4. Backfill script with batch size as a setting and resume support.
5. Check queries with expected results.
6. Production action list for the client's yes.

## Example of good output (short)

*Illustrative structure, not a real business: a theatre renaming `customer_name` to `full_name` on a 2-million-row bookings table. Copy the shape, never the content: every fact comes from the client's own context.*

> | Change | Class | Release | Rollback |
> |---|---|---|---|
> | Add `full_name` (nullable) | Safe | R1 | Drop column (no data yet) |
> | Code writes both columns | Safe | R1 | Previous release |
> | Backfill in batches | Safe, overwrites only the new column | R1 to R2 | Re-run from `customer_name` |
> | Code reads `full_name` | Safe | R2 | Previous release |
> | Index on `full_name`, concurrently | Safe | R2 | Drop index |
> | Drop `customer_name` | **Destructive** | R3 | Restore from backup; fresh yes needed |
>
> **Check after backfill:** `SELECT count(*) FROM bookings WHERE full_name IS NULL;` expect 0. `SELECT count(*) FROM bookings WHERE full_name <> customer_name;` expect 0.
