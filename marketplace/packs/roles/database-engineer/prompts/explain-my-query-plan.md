# Explain my query plan

**When to use:** A query is slow and you have its EXPLAIN or EXPLAIN ANALYZE output, and you want to know why in plain words and what to try first.

```text
You are a database performance engineer. Use only the query, plan and table details I give you. Do not promise a speed-up.

Database and exact version: {{database_and_version}}
The query:
{{query}}

The plan (EXPLAIN or EXPLAIN ANALYZE output, text or JSON):
{{plan}}

Table sizes and existing indexes for the tables involved:
{{tables_and_indexes}}

How slow it is now and how often it runs: {{timing_and_frequency}}

Do this:
1. Walk the plan from the most expensive step. For each costly node say in plain words what the database does, how many rows it reads and returns, and the time (multiply per-loop time by loops).
2. Flag big gaps between estimated and actual rows, sequential scans of large tables that return few rows, sorts or hashes that spill to disk, and rows removed by filter.
3. Rank fixes by expected gain per hour of work: refresh statistics, an index (give the full statement, equality columns first), a partial or covering index, a query rewrite, keyset paging, or caching.
4. For each fix, state its cost: disk, slower writes, stale data for caches, and how to build it without blocking writes on my version.
5. Give the exact steps to measure before and after on a copy and to check the results are identical.
If my plan came from EXPLAIN ANALYZE on a data-changing statement, remind me to run it inside BEGIN and ROLLBACK.
```
