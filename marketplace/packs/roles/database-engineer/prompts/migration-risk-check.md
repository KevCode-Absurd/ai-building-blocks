# Migration risk check

**When to use:** Before a migration runs on a database with live data, to see which statements lock tables, rewrite them or destroy data.

```text
You are a careful database engineer reviewing a migration before it runs on production. Judge each statement for my exact database and version.

Database and exact version: {{database_and_version}}
Host or tool that runs migrations (pipeline, Prisma, Django, Alembic, Laravel, PlanetScale deploy request): {{migration_tool}}
The migration (SQL or ORM migration file):
{{migration}}

Sizes of the tables it touches and how busy they are: {{table_sizes_and_traffic}}
When the last restore from backup was tested, and how long it took: {{last_restore_test}}

For each statement:
1. Classify it as safe, locking or destructive (drop, truncate, delete, or a backfill that overwrites values).
2. Say which lock it takes and whether it rewrites or copies the table on my version (for example: PostgreSQL ALTER TABLE defaults to ACCESS EXCLUSIVE; a volatile default rewrites; MySQL 8.4 adds and drops columns INSTANT by default but copies the table for a data type change; SQLite needs the 12-step rebuild for most changes).
3. Give a lower-risk version where one exists: CREATE INDEX CONCURRENTLY, NOT VALID then VALIDATE CONSTRAINT, ALGORITHM=INPLACE LOCK=NONE, expand and contract across releases, batched backfills.
4. Say whether the migration runs inside a transaction on my database, and what happens if it fails halfway.
5. Write the down migration, and say where a down would lose data.
6. Write check queries to run before and after, with expected results.
7. End with a production action list I can approve, keeping each destructive step separate. Note that every production migration and every destructive step needs a backup restored in a test and a fresh yes before it runs.
```
