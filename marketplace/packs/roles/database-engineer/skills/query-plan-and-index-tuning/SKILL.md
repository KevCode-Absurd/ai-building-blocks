---
name: query-plan-and-index-tuning
description: Finds why a query, page or report is slow and fixes it, using pg_stat_statements or the MySQL slow log to pick targets, EXPLAIN and EXPLAIN ANALYZE plans to find the expensive step, then ranking fixes (fresh statistics, a composite, partial or covering index, a query rewrite, keyset paging, eager loading for ORM N+1 queries, caching) with each fix's cost on writes and disk and a before-and-after measurement on a copy. Reads plans at access level 1 (asking before EXPLAIN ANALYZE on production); builds indexes and runs timings on staging at level 2; builds production indexes concurrently only at level 3 with a fresh yes for that change. Use it for slow dashboards, reports, list pages and endpoints.
---

# Query plan and index tuning

## When to use

- A page, report or endpoint takes seconds and users complain.
- A dashboard query times out as the data grows.
- An ORM page fires hundreds of queries.
- The database's CPU or disk is busy and nobody knows which queries cause it.

Not for: front-end speed (images, scripts), load tests on live systems without a yes, or promises of a specific speed-up.

## What you need

1. The slow query or endpoint, and how slow it is now (timings, logs).
2. The plan: `EXPLAIN` output, or `EXPLAIN ANALYZE` run on a copy. Send it as text or JSON.
3. Table sizes and existing indexes for the tables involved.
4. Database and exact version; ORM and framework if the query comes from app code.
5. If available: the top statements from `pg_stat_statements` or the MySQL slow query log.
6. Access: level 1 to read plans and statistics. `EXPLAIN ANALYZE` executes the query, so on production I ask first. Level 2 to build indexes and run timings on staging or a copy. Level 3 to build indexes on production, with a fresh yes for each one.

## Steps

### 1. Pick the target by total cost

Rank statements by total time, not mean time: a 20 ms query run a million times can cost more than one slow report. On PostgreSQL, `pg_stat_statements` gives calls, total and mean time, rows and buffer hits per normalised statement (it needs `shared_preload_libraries`, a restart and `CREATE EXTENSION`). Note the version, since column names change between majors.

### 2. Get a real plan safely

- `EXPLAIN` shows the estimated plan without running the query.
- `EXPLAIN ANALYZE` runs it and adds actual rows, times and loops. On PostgreSQL 18 it includes buffer use by default. For `UPDATE`, `INSERT` or `DELETE`, wrap it: `BEGIN; EXPLAIN ANALYZE ...; ROLLBACK;`.
- MySQL's `EXPLAIN ANALYZE` also executes and prints a tree with actual time, rows and loops.
- Run on a copy with production-like volume. A plan on a small table does not predict the plan on a large one.

### 3. Read the plan from the most expensive step

Work through the nodes and note:
- Full scans of large tables where few rows come out.
- Big gaps between estimated and actual rows (stale statistics, skewed data, correlated columns).
- Nested loops that run an inner step thousands of times (multiply per-loop time by loops).
- Sorts or hashes spilling to disk.
- Rows removed by filter far above rows returned.

Write each finding in plain words: "The database reads all 4.1 million orders to return 30."

### 4. Check the app side

Count queries per request from logs or the ORM's debug output. Many near-identical queries per page means N+1: load related rows with a join or one batched query (in Django, `select_related` for foreign keys and `prefetch_related` for many-to-many and reverse links). Deep `OFFSET` paging means every page reads and throws away the earlier rows: switch to keyset paging on a unique, indexed sort order.

### 5. Rank the fixes by gain per hour

Typical order, checked against the plan each time:
1. Refresh statistics (`ANALYZE`) when estimates are far off.
2. A missing index matching the filter and sort: equality columns first, then range or sort column.
3. A partial index when the query always targets a small subset (open orders, active members).
4. A covering index (`INCLUDE` on PostgreSQL) when the query reads a few extra columns, and the table changes slowly enough for index-only scans.
5. A query rewrite: `NOT EXISTS` instead of `NOT IN`, half-open date ranges, removing functions on indexed columns, pushing filters before joins.
6. Eager loading or batching for N+1, keyset paging for deep pages.
7. Caching with a clear expiry and a way to clear it, then a background job, when the query cannot be made cheap.

### 6. Write each fix in full with its cost

Named index statements, the rewritten query, or ORM code. For each: what it costs (disk, slower writes on that table, stale data for caches) and how to build it safely. On PostgreSQL, `CREATE INDEX CONCURRENTLY` keeps the table writable, cannot run in a transaction block, and if it fails leaves an `INVALID` index to drop and rebuild. Many migration tools need a setting to run it outside a transaction. On MySQL 8.4, `ALGORITHM=INPLACE, LOCK=NONE` builds a secondary index while writes continue.

### 7. Measure before and after on the same data

Run the plan and a timing script before and after on the copy, several runs each, and compare. Check that results are identical (row counts and a checksum or key totals). Report the measured change; never promise a number in advance.

### 8. Apply

At level 2, build on staging and re-measure. At level 3, after a fresh yes for each production index or change, build it in the agreed window through the client's pipeline, check it is valid, compare the live plan, and watch write latency for the rest of the day. Dropping an unused index is destructive: separate yes, and the `CREATE` statement kept to restore it.

## Checks

- Every table, column and query comes from the brief; syntax fits the version.
- The plan finding is quoted with node, rows and time.
- Each fix has its cost on writes and disk stated.
- Before and after were measured on the same data, with identical results.
- Production index builds used a low-lock method and were checked for validity.
- No speed-up was promised before measuring.
- Nothing ran on production beyond the level and the fresh yes given.

## Output format

1. Target list: statement, calls, total time, mean time.
2. Plan reading: the expensive steps in plain words.
3. Fix list ranked by gain per hour, each with full statements and costs.
4. Measurement table: before, after, runs, results match.
5. Production action list for the client's yes.

## Example of good output (short)

*Made-up business for illustration: "Copperleaf Tea" order history page on PostgreSQL 18, 4.1 million orders.*

> **Finding:** `Seq Scan on orders (actual rows=30 loops=1) Rows Removed by Filter: 4,118,220`. The page reads every order to show one customer's latest 30.
>
> **Fix 1:** `CREATE INDEX CONCURRENTLY orders_customer_created_idx ON orders (customer_id, created_at DESC, id DESC);`
> Cost: one more index to maintain on every order insert; disk to be measured after the build on staging.
>
> **Fix 2:** replace `OFFSET 300` paging with keyset paging: `WHERE customer_id = $1 AND (created_at, id) < ($2, $3) ORDER BY created_at DESC, id DESC LIMIT 30`, where `$2` and `$3` come from the last row on the previous page; `id` breaks ties so no order is skipped or repeated.
>
> **Measured on the staging copy (5 runs each):** median 2,340 ms before, 4 ms after; row counts and order ID lists identical.
