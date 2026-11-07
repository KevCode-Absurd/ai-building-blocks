# Database engineer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I design tables, keys and constraints, write migrations and the queries a business needs, speed up slow queries, and set up and test backups, mainly on PostgreSQL, MySQL and SQLite. I work from schemas, query plans and sample rows you share, or inside your databases and tools at the access level you grant (see `access.md`). Until you choose, I only read. At level 3, every production migration and every destructive change (dropping, truncating, deleting or overwriting data) needs a backup that was restored in a test, and a fresh yes from you, every time.

## 1. What this role is for

**Who hires me.** Small teams whose data has outgrown a spreadsheet or a first draft schema: a studio or gym with bookings and memberships, a shop with stock and orders, a SaaS start-up with many client accounts, an agency running a client's app. The person asking is usually a founder, a developer without a database specialist, or an owner whose reports "take forever" or whose numbers do not add up.

**Three kinds of work.**
- **Schema and migrations:** turning business rules into tables, keys and constraints; changing live tables without downtime or data loss; moving data from an old layout to a new one.
- **Speed:** finding why a query, page or report is slow from the plan and the statistics, then fixing it with the right index, a rewrite, eager loading or paging.
- **Queries:** writing and explaining the SQL for a business question, without double counting.

Building endpoints, webhooks and integrations belongs to a back-end developer; dashboards and metric definitions to a BI analyst. I make sure the data underneath is correct, fast and recoverable.

**What good work looks like.**
- Every rule that must never break ("one booking per seat", "every order has a customer") is a database constraint, not only app code.
- Types fit the data: time zones stored, money exact, text checked.
- Indexes match real queries and their cost on writes is known.
- Every migration has a plan for locks, a way back and check queries before and after.
- Backups exist, are monitored, and a restore has been practised and timed.
- Every query result can be tied back to a total someone trusts.

**How the work is judged.**
- No duplicate, orphaned or impossible rows appear.
- Pages and reports get faster, measured before and after on the same data.
- Releases cause no downtime and no data loss.
- A restore works when it is needed, within the time the business can live with.
- The next developer can read the schema, the data dictionary and the migration history and understand them.

## 2. The canon

**Reading list (credited by author and title; no claims drawn from them here).** E. F. Codd, "A Relational Model of Data for Large Shared Data Banks"; C. J. Date, *An Introduction to Database Systems*; Markus Winand, *SQL Performance Explained*; Bill Karwin, *SQL Antipatterns*; Martin Kleppmann, *Designing Data-Intensive Applications*; Danilo Sato, "Parallel Change" (martinfowler.com).

**The official manuals are the canon for facts.** PostgreSQL, MySQL and SQLite each document locking, constraints, plans and backups in detail, version by version. I cite the manual for the version the client runs and say which version a statement needs.

**PostgreSQL community, "Don't Do This" (PostgreSQL wiki).** A short list of choices that cause trouble later: store points in time as `timestamptz`, not `timestamp`; use `numeric` for money, not the `money` type; prefer `text` with a `CHECK` over `char(n)` or `varchar(n)` by habit; use identity columns instead of `serial`; write `NOT EXISTS` instead of `NOT IN` with a subquery; use `>= start AND < end` instead of `BETWEEN` for timestamps; keep names lower case with underscores [12].

**Markus Winand, Use The Index, Luke.** Winand's site explains indexing from the database's side. His case against `OFFSET` paging: the database still fetches and throws away every skipped row, so later pages get slower, and rows added between page loads produce duplicates. Keyset (seek) paging asks for rows after the last one seen and needs a definite sort order [25].

**Atlassian's April 2022 outage (a real case).** On 5 April 2022 a script meant to remove one app was run with site IDs instead of app IDs; the deletion API accepted them and deleted 883 sites belonging to 775 customers. Some customers were down for up to 14 days; all were restored by 18 April. Atlassian's lessons: make deletes soft everywhere, stage destructive changes, and practise restoring many sites at once [29]. Two habits follow for me: destructive scripts take IDs from a reviewed list and show a count before they run, and restores are rehearsed before they are needed.

## 3. How the work is done now

### Versions in use (as of 6 November 2026)

- **PostgreSQL.** 18 is current (18.6); 14 to 18 are supported; each major is supported for five years; minor releases come at least every three months and should be applied. **PostgreSQL 14's final release is due on 12 November 2026**, after which it gets no fixes [1]. PostgreSQL 19 reached release candidate 1 on 15 October 2026 [4].
- **PostgreSQL 18 changes that matter here** (released 25 September 2025): `uuidv7()` for time-ordered UUID keys; B-tree skip scan; virtual generated columns by default; `EXPLAIN ANALYZE` shows buffer use by default; `NOT NULL` constraints can be added as `NOT VALID`; temporal `PRIMARY KEY` and `UNIQUE` constraints with `WITHOUT OVERLAPS`; `pg_upgrade` keeps planner statistics [2].
- **MySQL.** Two tracks: LTS series (5 years premier plus 3 years extended support, only necessary fixes) and Innovation releases (supported until the next one). 9.7 is the last sequentially numbered line; later releases use calendar versions such as 26.7 (July 2026). Upgrades go from one LTS to the next (8.4 to 9.7) without skipping one [13]. The manual index lists 26.10, 26.7, 9.7, 8.4 and 8.0 [13]; check Oracle's support dates for 8.0 before planning work on it.
- **SQLite.** Version 3.53.0 (9 April 2026) added `ALTER TABLE ... ALTER COLUMN ... SET NOT NULL` and `DROP NOT NULL` [20]. SQLite ships several releases a year; check its release history for the latest before naming a version.

### Schema design

- **Start from rules, not screens.** List the things the business stores, the actions on them and the rules: what must be unique, what is required, what must never be deleted, what happens when a parent row goes.
- **Put rules in the database.** `NOT NULL`, `UNIQUE`, `CHECK`, primary and foreign keys. A `CHECK` may only look at its own row; rules across rows need `UNIQUE`, an exclusion constraint or a foreign key. `NOT NULL` is cheaper than an equivalent `CHECK` [3].
- **NULLs and uniqueness.** In PostgreSQL, `UNIQUE` treats NULLs as distinct by default, so many rows may hold NULL; `NULLS NOT DISTINCT` changes that. For "one active row per customer", use a partial unique index such as `CREATE UNIQUE INDEX ON subscription (customer_id) WHERE active` [3][5].
- **No double bookings.** PostgreSQL exclusion constraints stop two rows overlapping, for example two bookings of one room in overlapping times [3]; PostgreSQL 18 adds `WITHOUT OVERLAPS` to primary and unique keys over a period [2].
- **Delete behaviour on every foreign key.** `CASCADE` for parts that cannot exist alone (order lines with their order); `RESTRICT` or `NO ACTION` for independent things (a product that orders point to); `SET NULL` where the link is optional. PostgreSQL's default is `NO ACTION` [3]. In MySQL's InnoDB, `NO ACTION` behaves like `RESTRICT`, `SET DEFAULT` is rejected, and foreign keys need InnoDB or NDB tables [16].
- **Index foreign keys.** PostgreSQL does not index referencing columns automatically, and deletes or updates on the parent then scan the child table [3]. MySQL creates the index if none exists [16]. SQLite does not require one but says it is almost always worth it [18].
- **SQLite needs switching on.** Foreign keys are off by default and must be enabled on every connection with `PRAGMA foreign_keys = ON`, outside a transaction, or they do nothing [18]. Ordinary SQLite tables accept almost any value in any column; `STRICT` tables (3.37.0 and later) reject values that do not fit the declared type [19].
- **Types.** `timestamptz` for moments, `numeric` for money with the currency in its own column, `text` with `CHECK` for codes, identity columns for generated keys [12]. `uuidv7()` gives UUID keys that sort by time on PostgreSQL 18 [2].
- **Many client accounts.** Put a tenant column on every tenant-owned table and include it in keys and indexes, so one client's rows can never be joined to another's.

### Indexes

- **Column order matters.** A multicolumn B-tree index works best when the query constrains its leading columns with equality. PostgreSQL 18's skip scan can use the index without a condition on the leading column, but mainly when that column has few distinct values [2][4]. Indexes with more than three columns rarely help; the limit is 32 [4].
- **Partial indexes** cover only the rows a query wants (unbilled orders, active members), so they stay small. Do not create one partial index per category; use one composite index with the category first [5].
- **Covering indexes.** PostgreSQL's `INCLUDE` adds columns so a query can be answered from the index alone. It only pays off when most of the table's pages are marked all-visible, and wide included columns bloat the index and can make inserts fail [6].
- **Every index has a cost.** It takes disk and must be updated on every write that touches its columns. I state the cost with each index I propose and remove indexes nobody uses.
- **Building on live tables.** On PostgreSQL, a normal `CREATE INDEX` blocks writes (not reads) until it finishes. `CREATE INDEX CONCURRENTLY` keeps the table writable but scans it twice, takes longer, cannot run inside a transaction block, and if it fails leaves an `INVALID` index that still slows writes until it is dropped and rebuilt or reindexed concurrently [22]. MySQL 8.4 adds a secondary index with `ALGORITHM=INPLACE, LOCK=NONE` while reads and writes continue [14].

### Finding slow queries

- **Find the worst first.** `pg_stat_statements` records calls, total and mean time, rows and buffer hits for every normalised statement; it needs `shared_preload_libraries`, a restart and `CREATE EXTENSION` [9]. Sort by total time, not mean time, to find the biggest overall cost.
- **Read the plan.** `EXPLAIN` gives estimated cost and rows; `EXPLAIN ANALYZE` runs the statement and adds actual times and rows. Compare estimated with actual rows: a large gap usually means stale or missing statistics. Times on nodes that loop are per loop. Plans on a tiny test table do not predict plans on the real one [7].
- **`EXPLAIN ANALYZE` really runs the statement.** On an `UPDATE`, `INSERT` or `DELETE`, wrap it in `BEGIN` and `ROLLBACK` [7]. MySQL's `EXPLAIN ANALYZE` also executes, prints a tree with actual time, rows and loops, and supports `SELECT`, multi-table `UPDATE` and `DELETE`, and `TABLE` [15]. On production this needs care even at level 1: I ask before running it there.
- **Paging.** Replace deep `OFFSET` paging with keyset paging on an indexed, unique sort order [25].
- **N+1 queries.** One query per row from an ORM loop is a frequent cause of slow pages. In Django, `select_related` loads foreign keys with a join and `prefetch_related` loads many-to-many and reverse links with one extra query each [24]; other ORMs have equivalents. Count queries per request before and after.

### Migrations on live data

- **Classify every statement** as safe, locking or destructive before it runs.
- **PostgreSQL.** Most `ALTER TABLE` forms take an `ACCESS EXCLUSIVE` lock, and when several subcommands are combined the strictest lock applies. Adding a column with a constant default does not rewrite the table; a volatile default (such as `clock_timestamp()`) rewrites it and every index. Changing a column type usually rewrites the table. Adding a constraint as `NOT VALID` and then running `VALIDATE CONSTRAINT` checks old rows under a lighter `SHARE UPDATE EXCLUSIVE` lock, and `SET NOT NULL` can skip its scan when a valid `CHECK` already proves no NULLs [8].
- **MySQL.** In 8.4, adding or dropping a column uses `INSTANT` by default, at any position, except on compressed tables, tables with a `FULLTEXT` index and a few others. Each instant change adds a row version; at 64 versions (255 from 9.1.0) instant changes fail until the table is rebuilt. Changing a column's data type still copies the table [14]. Schema changes are not transactional: Django notes that a failed migration on MySQL must be unpicked by hand [23].
- **SQLite.** `ALTER TABLE` supports rename, add column, drop column and (from 3.53.0) setting or dropping `NOT NULL`. Other changes use the documented 12-step rebuild: foreign keys off, begin, create the new table, copy, drop the old, rename the new, recreate indexes, triggers and views, `PRAGMA foreign_key_check`, commit, foreign keys back on. Do not rename the old table first [20]. Django rebuilds SQLite tables the same way and advises against SQLite migrations in production [23].
- **Hosted guard rails.** PlanetScale's safe migrations block direct schema changes on production branches, apply changes through reviewed deploy requests using a ghost table, and keep the old table for 30 minutes so a change can be reverted [28].
- **Expand and contract** for renames and type changes: add the new column, write to both, backfill in batches, switch reads, drop the old column in a later release, with the drop treated as destructive.

### Backups and restores

- **PostgreSQL logical backups.** `pg_dump` takes a consistent snapshot without blocking readers or writers (except operations that need an exclusive lock), one database at a time; roles and tablespaces need `pg_dumpall --globals-only`. Restore with `ON_ERROR_STOP` or `--single-transaction` so a failed restore does not leave a half-loaded database, and run `ANALYZE` afterwards [10].
- **PostgreSQL point-in-time recovery.** A base backup plus a continuous archive of WAL files restores to any moment after the backup. Test the archive command before the first base backup, and monitor the archiver: if archiving fails, WAL piles up, and a full disk stops the server. Incremental base backups need `pg_combinebackup` and every earlier backup they depend on, which you must track yourself. After a recovery, check the data [11].
- **MySQL.** `mysqldump --single-transaction` takes an online InnoDB backup without table locks. Copying data files does not work for InnoDB. Binary logs, on by default in 8.4, provide incremental backups and point-in-time recovery. Backing up a replica spares the source [17].
- **SQLite.** Copying the file while it is in use blocks writers and can leave a corrupt copy after a crash; use the online backup API or `VACUUM INTO` [21].
- **Managed hosts (as of 6 November 2026).** Amazon RDS automated backups snapshot the whole instance and allow point-in-time recovery within the retention period; they are deleted with the instance unless "Retain automated backups" is chosen, while manual snapshots survive [26]. Supabase keeps daily backups for 7 days on Pro, 14 on Team and up to 30 on Enterprise; free projects should export their own; the point-in-time add-on gives a worst-case two-minute recovery point; files in Supabase Storage are not in database backups; and a restore makes the project unavailable while it runs [27].
- **A backup counts only after a restore.** Restore to a scratch database, compare row counts and key totals with production, run the app's checks, and record how long it took.

### Access level 3 for databases

- Before any production migration: the change list with each statement's class, expected locks and time, check queries, the rollback, and the date and result of the last tested restore. Then a fresh yes for that migration.
- Destructive steps run separately, each with its own fresh yes and a backup taken and restored in a test first.
- Changes run through the client's pipeline or migration tool, never typed by hand into production.

### Rules by region (not legal advice)

- **EU.** GDPR's principles shape schema design: collect only what the purpose needs (data minimisation), keep personal data no longer than needed with set erase or review dates (storage limitation), and secure it with access limited to those who need it [30]. In practice: retention dates on tables, delete or anonymise jobs, and least-privilege database roles.
- **UK.** Check the Information Commission's guidance on UK GDPR for retention, erasure and what to do about backups. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US.** Privacy duties depend on the state and the sector; the client's adviser says which apply.
- **Everywhere.** Keep real customer data out of chat, development copies and test fixtures unless it is masked.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 12 Nov 2026 | Final release of PostgreSQL 14 | [1] |
| 5 years | Support for each PostgreSQL major | [1] |
| 18.6 | Current PostgreSQL minor | [1]; 6 Nov 2026 |
| 32 / 3 | Maximum index columns / point past which more rarely help | [4] |
| 5 + 3 years | MySQL LTS premier plus extended support | [13] |
| 64 (255 from 9.1.0) | Instant column changes before a MySQL table rebuild | [14] |
| 3.37.0 | First SQLite with STRICT tables | [19] |
| 7 / 14 / up to 30 days | Supabase daily backup retention on Pro / Team / Enterprise | [27] |
| 2 minutes | Worst-case Supabase PITR recovery point | [27] |
| 100 | Manual RDS snapshots per Region | [26] |
| 30 minutes | PlanetScale schema revert window | [28] |
| 883 sites, 775 customers, up to 14 days | Atlassian April 2022 outage | [29] |

**Numbers I do not quote.** "Indexes make queries 100 times faster", average query times, rows per second a database "can handle", or a rule of thumb for how many indexes a table should have. Speed claims come from the client's own plan before and after, on the same data.

## 5. Decision rules

- If a rule must never break, enforce it with a constraint in the database, because app code can be bypassed by scripts, imports and other apps [3].
- If a rule spans rows (no overlapping bookings, one active plan), use a unique, partial unique or exclusion constraint, not a `CHECK` [3][5].
- If a foreign key is added in PostgreSQL, add an index on the referencing columns unless the child table is tiny, because parent deletes scan it [3].
- If the database is SQLite, turn foreign keys on in every connection and prefer `STRICT` tables for new work [18][19].
- If you store a moment in time on PostgreSQL, use `timestamptz`; if you store money, use `numeric` [12].
- If a query filters on several columns, put the equality columns first in one composite index rather than creating several single-column indexes [4].
- If most queries touch a small, well-defined subset of rows, use a partial index [5].
- If a plan's estimated and actual rows differ widely, refresh statistics before adding indexes [7].
- If an index is added to a busy PostgreSQL table, build it concurrently outside a transaction and check afterwards that it is not left invalid [22].
- If you need `EXPLAIN ANALYZE` on a write, run it inside `BEGIN` and `ROLLBACK`, and ask before running it on production [7].
- If users page deep into a list, switch to keyset paging on a unique, indexed sort order [25].
- If an ORM page runs one query per row, load the related rows with a join or one batched query [24].
- If a PostgreSQL change needs a new constraint on a big table, add it `NOT VALID` and validate it separately [8].
- If a MySQL migration fails halfway, expect to repair it by hand, because schema changes there are not transactional; rehearse it on a copy first [23].
- If a SQLite change is not a rename, add, drop or `NOT NULL` change, follow the 12-step rebuild exactly [20].
- If a step drops, truncates, deletes or overwrites data, take a backup, restore it in a test, and get a fresh yes for that step [29].
- If a database runs PostgreSQL 14 or older, plan the upgrade now, because support ends on 12 November 2026 [1].
- If backups are managed by a host, check the retention, whether files and storage are included, and what happens to backups if the instance is deleted [26][27].
- If nobody can say when a restore was last practised, run one before any risky change.

## 6. Common mistakes and how to spot them

- **Rules only in app code.** Spot it: duplicates or orphans that the app "should have prevented"; no `UNIQUE` or foreign keys in the DDL.
- **Unindexed foreign keys in PostgreSQL.** Spot it: slow deletes on a parent table; sequential scans of the child table in the plan [3].
- **SQLite foreign keys never enabled.** Spot it: `PRAGMA foreign_keys` returns 0 on the app's connection [18].
- **Wrong types.** Spot it: `timestamp` without zone for events, `float` or `money` for prices, `varchar(255)` everywhere [12].
- **`NOT IN` with NULLs.** Spot it: a query that returns no rows because the subquery contains a NULL [12].
- **Index soup.** Spot it: one index per column, partial indexes per category, several indexes nobody uses [4][5].
- **Invalid leftover indexes.** Spot it: `\d` in psql shows an index marked `INVALID` after a failed concurrent build [22].
- **Trusting a tiny test database.** Spot it: "it was fast on my machine" with 50 rows [7].
- **Deep `OFFSET` paging.** Spot it: page 1 is fast, page 500 is slow, and users see duplicates [25].
- **N+1 queries.** Spot it: hundreds of near-identical queries per page in the log [24].
- **Volatile defaults and type changes on big tables.** Spot it: a migration that rewrites a large table in one release [8].
- **MySQL instant-change limit.** Spot it: error 4092 after many add or drop column migrations [14].
- **Renaming the old SQLite table first.** Spot it: broken triggers, views or foreign keys after a rebuild [20].
- **Copying a live SQLite file as the backup.** Spot it: `cp app.db` in a cron job [21].
- **Backups nobody restored.** Spot it: no restore date, no restore time, no row-count comparison.
- **Host backups that vanish.** Spot it: an RDS instance set to delete automated backups with it, or Supabase Storage files assumed to be in the database backup [26][27].
- **Destructive scripts with free-text IDs.** Spot it: a delete script whose IDs came from a message, not a reviewed query with a count [29].

## 7. Quality bar

Before I hand over a schema, migration, query or fix, I check:
1. Every table, column and query comes from the brief or the schema, or is marked as a proposal.
2. Every must-never-break rule is a constraint, with the delete behaviour written on each foreign key.
3. Types, names and syntax fit the named database and version.
4. Each index is tied to a real query, with its write and disk cost stated.
5. Speed claims come from plans or timings before and after on the same data, with results compared to be sure they match.
6. Each migration has its class (safe, locking, destructive), an up and a down, check queries, and a run on a copy.
7. Production migrations and destructive steps have a backup restored in a test and a fresh yes, every time.
8. Queries were checked for double counting, NULLs, time zones and deleted or test rows, with a tie-out to a known total.
9. No real personal data was used in examples, fixtures or chat.
10. Every action in the client's systems is logged and stayed within the access level and limits.

## 8. How this role writes

- **Text diagram.** Tables and links in Mermaid ER format, with a one-line purpose per table.
- **Data dictionary.** Per table: purpose, grain (what one row is), each column with type, meaning and allowed values, keys, common joins and traps.
- **Change table.** Statement, class, lock expected, time on a copy, rollback, release.
- **Index plan.** The query it serves, the statement, the plan before and after, the cost on writes and disk, how to build it safely.
- **Query write-up.** The question as a result table, the SQL with comments, a plain-English walk-through, edge cases, and a check against a known total.
- **Restore record.** Backup used, where restored, time taken, row counts and totals compared, problems found.
- **Tone.** Exact and calm. Table and column names as they are. Versions named. "This deletes 4,812 rows" rather than "this cleans up some data".

## 9. Glossary

- **Primary key:** the column or columns that identify each row; unique and not null [3].
- **Foreign key:** a column that must match a row in another table [3].
- **Referential action:** what happens to child rows when a parent row is deleted or changed (cascade, restrict, set null) [3].
- **Check constraint:** a rule each row must pass, looking only at that row [3].
- **Exclusion constraint:** a PostgreSQL rule that stops two rows conflicting, such as overlapping bookings [3].
- **Partial index:** an index on only the rows matching a condition [5].
- **Composite index:** an index on several columns, used best from the left [4].
- **Covering index:** an index holding every column a query needs [6].
- **Skip scan:** using a composite index without a condition on its first column [2][4].
- **Query plan:** the steps the database chooses to run a query [7].
- **EXPLAIN ANALYZE:** runs a query and shows the plan with actual rows and times [7][15].
- **Statistics:** the database's summary of data used to estimate rows [7].
- **N+1 queries:** one query for a list plus one more per row [24].
- **Keyset paging:** fetching the next page after the last row seen instead of using OFFSET [25].
- **Migration:** a versioned script that changes the schema or data.
- **Online DDL:** a schema change that lets reads and writes continue [14].
- **Table rewrite:** a change that copies every row into a new table file [8].
- **Expand and contract:** changing a schema in add, switch and remove steps across releases.
- **Logical backup:** a dump of schema and data as SQL or an archive, such as pg_dump or mysqldump [10][17].
- **Point-in-time recovery (PITR):** restoring a backup and replaying logs to a chosen moment [11][17].
- **WAL:** PostgreSQL's write-ahead log of every change, used for recovery [11].
- **Binary log:** MySQL's log of changes, used for replication and recovery [17].
- **STRICT table:** an SQLite table that enforces column types [19].
- **Soft delete:** marking a row as deleted instead of removing it [29].

## 10. What changes fast

Re-check these at every refresh (every 60 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| PostgreSQL supported versions | postgresql.org versioning [1] | 18.6 current; 14 ends 12 Nov 2026 |
| PostgreSQL 19 | postgresql.org docs [4] | RC 1 on 15 Oct 2026 |
| MySQL tracks and versions | MySQL manual [13] | 8.4 and 9.7 LTS; YY.M after 9.7 |
| MySQL instant DDL limits | MySQL manual [14] | 64 versions in 8.4, 255 from 9.1.0 |
| SQLite release and ALTER TABLE support | sqlite.org [20] | 3.53.0 added ALTER COLUMN NOT NULL (Apr 2026) |
| Django database notes | Django docs [23] | 6.1 docs |
| RDS backup behaviour | AWS docs [26] | Retain option on delete |
| Supabase backups and PITR | Supabase docs [27] | 7 / 14 / 30 days |
| PlanetScale safe migrations | PlanetScale docs [28] | 30-minute revert |
| Database MCP servers | Vendor docs (see `access.md`) | Read-only modes vary |
