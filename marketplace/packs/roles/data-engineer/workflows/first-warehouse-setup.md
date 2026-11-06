# First warehouse setup

**Trigger:** A firm wants its tools' data in one place for regular reports, usually because dashboard numbers disagree or exports take too long. Typically two to four weeks for three to five sources and the first reports.

## Steps

1. **Agree access (level 1 first).** Ask which level the client grants in each tool (sync tool, warehouse, dbt, scheduler, code repository) and the limits, including a spend cap. Write the "Access I have" list.
2. **Inventory.** Run the `source-inventory-table` prompt with the client's tools and reports. Confirm the trusted total for each main number.
3. **Spec.** Write the pipeline spec with the `pipeline-spec-from-tools` skill: load methods, deletes, lookbacks, schedule, layers, checks, personal-data exclusions and spend caps. *Approval: the client signs off the spec, the destination and region, and the spend cap.*
4. **Guardrails first.** Run the `warehouse-spend-guardrails` prompt and set caps before anyone queries: maximum bytes billed and quotas in BigQuery, or resource monitors, budgets and auto-suspend in Snowflake. *Approval: at level 3 I set caps within the agreed spend; any increase needs a fresh yes.*
5. **Connect sources (level 2, then 3).** Create connectors paused into raw schemas; at level 3, after the client's yes on the action list, switch them on one at a time and compare landed rows with source counts. *Approval: each new paid connector or plan needs the client's yes.*
6. **Models (level 2).** Build staging, intermediate and marts with the `dbt-models-with-tests` skill on a branch, with tests, freshness, contracts on money tables and tie-outs.
7. **Tie out.** Run the `source-to-report-tie-out` skill for one closed period per main report. Every difference is explained before go-live.
8. **Run book.** Write alerts and if-then steps with the `pipeline-run-book-and-alerts` skill; test it on a development copy.
9. **Go live (level 3).** Merge the reviewed pull request, schedule production jobs, and watch the first three runs. *Approval: the client confirms the action list and limits before the first production run.*
10. **Hand over.** Lineage map, test table, run book, spend settings, and the action log.

## Outputs

- Source inventory and pipeline spec
- Spend caps and alerts in place
- Raw schemas, staging, intermediate and mart models with tests
- Tie-out results per main report
- Run book with alert rules, tested on a copy
- Lineage map and action log

## Needs the client's approval

The access level and limits for each tool; the spec and destination; the spend cap and any later increase; each new paid connector; the first production run at level 3; and any drop, truncate, overwrite or deletion of data, which needs a fresh yes every time.
