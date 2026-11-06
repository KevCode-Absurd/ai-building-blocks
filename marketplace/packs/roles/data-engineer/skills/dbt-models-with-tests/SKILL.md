---
name: dbt-models-with-tests
description: Writes layered dbt models (staging one-to-one with sources, intermediate, marts with a stated grain) in the named SQL dialect, with a test table for every model - unique and not_null keys, accepted values, relationships, freshness on sources, unit tests for tricky logic, enforced contracts on marts that feed money - plus incremental settings (unique key, lookback, on_schema_change), snapshots for history and one total per mart tied to a trusted source. Writing and running on a branch or in CI is level 2; merging and running production jobs is level 3, and a full refresh of a production model needs a fresh yes. Use it when building or fixing report models.
---

# dbt models with tests

## When to use

- Turning raw synced tables into report tables for the first time.
- "Our revenue report never matches Stripe": rebuilding models with tests that catch why.
- Adding a source or a report to an existing dbt project.
- Moving hand-written report SQL into dbt.

## What you need

1. The raw table schemas (column lists or DDL) and row counts.
2. The reports and the numbers they show, with each number's definition.
3. The warehouse and SQL dialect (BigQuery, Snowflake, Postgres) and the dbt version or release track.
4. A trusted source total for each main number, for one recent period.
5. Access: level 1 to read the project and results; level 2 to write on a branch and run in development and CI; level 3 to merge and run production jobs within your limits.

## Steps

### 1. Write the tests first

For each mart, decide its grain ("one row per order") and write the test table before the SQL: key unique and not null, required columns not null, status columns with accepted values, foreign keys with relationships tests, and the tie-out total.

### 2. Staging models

One per source table, named `stg_[source]__[entity]s`, built as views; rename, cast, convert units (cents to currency) and filter soft-deleted rows; no joins and no aggregation [6]. Declare sources with `loaded_at_field` and `warn_after` and `error_after` freshness [4].

### 3. Intermediate models

Joins and business logic, one purpose each (`int_orders__joined_to_payments`). Check row counts before and after every join; a join that adds rows is either intended (one row per order line) or a bug.

### 4. Marts

Business-shaped tables reports read, each with its grain in the description. For reporting, split them into fact tables (events such as orders or payments, prefixed `fct_`) and dimension tables (things such as customers or products, prefixed `dim_`); the BI analyst kit covers star schema design in depth. Store the parts of ratios (numerator and denominator), not row-level ratios.

### 5. Incremental where volume needs it

Use incremental only for large or slow models. Set a `unique_key` that is unique and never null; filter with `>=` on the last loaded time minus a lookback for late changes; choose `on_schema_change` deliberately (the default `ignore` does not add new columns) [3]. Note that `--full-refresh` drops and rebuilds the table [3].

### 6. History with snapshots

Where reports must show values as they were (a customer's plan last March), snapshot the source with the timestamp strategy if a reliable `updated_at` exists, or the check strategy if not; decide how hard deletes are recorded [8].

### 7. Tests

- Generic tests: `unique`, `not_null`, `accepted_values`, `relationships`; `warn` for things to watch, `error` for things that must block [1].
- Keep `unique` and `not_null` tests even when a primary key is declared, because cloud warehouses often record keys without enforcing them [2].
- Unit tests for date maths, window functions, long CASE logic and anything about to be refactored; run them in development and CI only [7].
- An enforced contract on marts that feed money or other teams; removing a column or changing a type is then a breaking change [2].
- A singular test for the tie-out: the mart total for a fixed period equals the trusted source total within the agreed tolerance.

### 8. Run and compare

Build on a branch against a development dataset. Compare row counts and totals with the old report, explain every difference in writing, and keep the explanations with the pull request.

### 9. Release (level 3)

Merge the reviewed pull request through the client's pipeline and let the production job run. A full refresh of a production incremental model overwrites it, so it needs a fresh yes, with time travel or a copy confirmed first [16][20].

## Checks

- Every model has a grain and a test table; every mart has a tie-out.
- Staging is one-to-one with sources and has no joins.
- Row counts checked across every join.
- Incremental models have a unique, non-null key and a lookback.
- Freshness set on every source that feeds a report.
- The dialect is stated above every code block.
- Differences from the old report are explained.
- Production full refreshes are flagged for a fresh yes.

## Output format

```
# Models: [area], dbt [version], [dialect]
## Lineage (source > staging > intermediate > mart)
## Model list (name, materialisation, grain, purpose)
## SQL ([dialect]) per model
## Test table
| Model | Column | Test | Severity | Why |
## Tie-out results vs trusted totals
## Differences from the old report, explained
## Release steps and approvals
```

## Example of good output (short)

*Made-up business: Fieldfare Coffee, a coffee subscription firm on BigQuery.*

> Grain of `fct_payments`: one row per Stripe charge, refunds as negative rows linked by `charge_id`.
>
> | Model | Column | Test | Severity | Why |
> |---|---|---|---|---|
> | stg_stripe__charges | charge_id | unique, not_null | error | Duplicates double revenue |
> | stg_stripe__charges | status | accepted_values: succeeded, pending, failed | warn | New statuses need a decision |
> | fct_payments | customer_id | relationships to dim_customers | error | Orphan payments drop out of reports |
> | fct_payments | (table) | October net revenue equals the Stripe balance report within 0.5% | error | Tie-out |
>
> Difference explained: the old report counted failed charges (412 in October). The new model excludes them, so October revenue is lower by exactly their total.
>
> SQL (BigQuery Standard SQL), `fct_payments` incremental with `unique_key='payment_row_id'` and a 14-day lookback, because refunds arrive late.
