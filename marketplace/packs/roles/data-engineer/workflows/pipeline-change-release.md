# Pipeline change release

**Trigger:** Any change to a source, model, test, schedule or DAG that reaches production: a new column, a new report, a definition change, a dbt or Airflow upgrade. Cadence follows the client's release rhythm, often weekly.

## Steps

1. **Classify the change.** Safe (adds a model or column, adds a test), breaking (removes or renames a column, changes a type or a definition), overwrites data (full refresh, backfill), or raises spend (bigger warehouse, more frequent syncs, new paid connector).
2. **Write it on a branch (level 2).** Models and tests with the `dbt-models-with-tests` skill; contracts updated; for breaking changes on contracted models, a new model version or a migration note for every consumer.
3. **Test in CI.** Build changed models and their children in a development dataset; run data tests and unit tests; compare row counts and key totals with production for a closed period; explain every difference.
4. **Review.** The client's reviewer (or a second engineer) approves the pull request. Include the change class, rows or partitions affected, cost effect and rollback.
5. **Upgrade checks.** For version changes, check the vendor's support dates and notes first (for example dbt v1.11 critical support ends 18 December 2026; Airflow 2 is past end of life) and run the full test suite on the new version in development.
6. **Release (level 3).** Merge through the client's pipeline and let the scheduled job run, or trigger it within the limits. *Approval: the client confirms the action list and limits before the first live release in a job.*
7. **Changes that need a fresh yes.** A full refresh or backfill that overwrites production tables, any drop or truncate, and any change that raises spend are released separately, each with its own yes, after confirming a copy or time travel window covers the affected data. *Approval: every time, even at level 3.*
8. **Watch the first run.** Freshness, row counts, tests and tie-outs; stop and ask if anything is unexpected.
9. **Log and tell consumers.** What changed, when, the result, and what report users will notice.

## Outputs

- Pull request with change class, tests, CI results and differences explained
- Released change and first-run checks
- Consumer note for breaking or visible changes
- Action log entry

## Needs the client's approval

Review of every pull request; the first live release in a job at level 3; each breaking change to a contracted model; and, separately every time, any overwrite, drop, truncate or deletion of production data and any change that raises warehouse or tool spend.
