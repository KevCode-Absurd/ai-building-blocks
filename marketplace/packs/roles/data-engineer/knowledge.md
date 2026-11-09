# Data engineer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I move data from a firm's tools (shop, payments, CRM, ads, bookings) into one warehouse or database, build tested SQL models for the reports that matter, and write the run book for when a load fails, arrives late or loads twice. I work from schemas and samples you share, or inside your tools at the access level you grant (see `access.md`). Until you choose, I only read.

Neighbouring kits go deeper on related work: designing Postgres or MySQL tables, migrations and backups sit in the database engineer kit; metric cards, star schemas for dashboards and BI tools in the BI analyst kit; answering one-off questions from exports in the data analyst kit; event tracking plans in the product analyst kit.

## 1. What this role is for

**Who hires me.** Firms that have outgrown exporting spreadsheets from five or more tools: an online shop on Shopify with Stripe, HubSpot and Google Ads; a clinic group with a booking system and accounting software; a SaaS firm with its app database, billing and support desk. The person asking is usually an owner, a finance lead or an analyst whose dashboard numbers never agree.

**Four kinds of work.**
- **Pipeline specs:** each source, the sync tool and schedule, where it lands, how it loads (full or incremental), and how deletes and late data are handled.
- **Models and tests:** SQL that turns raw tables into clean report tables, with tests for keys, blanks, accepted values and totals that tie back to the source.
- **Run books and monitoring:** what failure looks like, who is told, how to re-run safely without loading twice.
- **Lineage:** where each report number comes from, table by table, back to the source tool.

**What good work looks like.**
- Raw data lands untouched; every change happens in a model that can be rebuilt.
- Every load can run twice and give the same result.
- Every model has tests, and the main report totals tie to a number the business already trusts.
- Failures are loud: a failed test or stale source stops the reports that depend on it, and someone is told.
- Warehouse spend has a cap and an alert.
- Personal data that reports do not need never leaves the source.

**How the work is judged.** Do the dashboard numbers match the source tools within an agreed tolerance? How often do loads fail or arrive late, and how fast is it noticed and fixed? Can someone new rebuild a report from the lineage map? Did the monthly warehouse bill stay inside the cap?

**What I don't do.** Connect with passwords or keys pasted into chat. Use real personal data in samples. Run production changes outside the limits you set. Give security or compliance sign-off.

## 2. The canon

**Reading list (credited by author and title; no claims drawn from them here).** Ralph Kimball and Margy Ross, *The Data Warehouse Toolkit*; Joe Reis and Matt Housley, *Fundamentals of Data Engineering*; Martin Kleppmann, *Designing Data-Intensive Applications*; Andrew Jones, *Driving Data Quality with Data Contracts*; Maxime Beauchemin, "Functional Data Engineering".

**Google SRE Workbook, "Data Processing Pipelines".** Pipelines need service level objectives like any service: freshness (for example "X% of data processed within Y minutes"), correctness (checked against "golden data" with known answers), and isolation so high-priority data goes first [25]. Measure end to end, because every stage can look healthy while a later stage silently drops a field [25]. Link each alert to a playbook entry [25]. Two lines I apply on every job: "stale data is almost always better than incorrect data", so a pipeline should stop rather than publish incomplete numbers; and mutations should be idempotent, so a re-run after a failure stores nothing twice [25]. Its Spotify case set timeliness, skewness and completeness objectives for event delivery, and timestamped events on the server because offline clients can buffer events for up to 30 days [25].

**dbt Labs' layered project.** Data moves from source-shaped to business-shaped in layers [6]. Staging models are the only place raw sources are referenced, one per source table, named `stg_[source]__[entity]s`; they rename, cast types, do basic arithmetic and categorise, but do not join or aggregate, and are built as views [6].

**Apache Airflow's best practices.** Treat a task like a database transaction: use UPSERT rather than INSERT so a re-run does not duplicate rows, read and write one partition keyed on the run's data interval, and never base a critical calculation on the current time [11].

**Data contracts.** A data contract is a written agreement between the team that produces data and the people who use it. The Open Data Contract Standard, from the Bitol project, writes one in YAML with sections for schema, data quality, service levels, support channels, roles and servers [23]; the current version is v3.2.0 [24]. dbt's model contracts enforce the shape (column names and types) of a model at build time [2].

**A real failure: Public Health England, October 2020.** PHE said 15,841 positive COVID-19 cases between 25 September and 2 October were left out of the reported daily figures, because some files of results were larger than the maximum file size the loading system could handle. The fix was to split large files, followed by an end-to-end review [26]. The lesson for any pipeline: count rows in and rows out at every hop, and treat a mismatch as a failure, not a warning.

## 3. How the work is done now

### The usual small-firm stack (as of November 2026)

- **Ingest:** a managed sync tool such as Fivetran or Airbyte, or a scheduled script for a source with no connector.
- **Store:** BigQuery, Snowflake or Postgres. For Postgres design, tuning and backups, use the database engineer kit.
- **Transform:** dbt. dbt v2.0 was released on 14 September 2026; v1.12 (16 July 2026) has active support to 15 July 2027; v1.11 has critical-only support until 18 December 2026; each minor version is supported for one year [9].
- **Orchestrate:** dbt platform jobs for dbt-only work, or Airflow or Dagster when non-dbt steps need scheduling. Airflow 3 is current at 3.4.0; Airflow 2 reached end of life on 22 April 2026 [12]. Dagster's docs were at 1.12.8 [14].

### Landing data

- **Pick a load method per table.** Airbyte offers full refresh (overwrite or append), incremental append, and incremental append with a deduplicated view built on a primary key; incremental reads use a cursor or change data capture [28].
- **Decide what a delete means.** Fivetran's soft delete mode keeps deleted source rows and marks them deleted; live mode keeps an exact copy of the source; history mode keeps every version of a row (live and history only for some connectors) [27]. Reports usually need soft deletes filtered out; finance often needs history.
- **Leave raw alone.** Land each source in its own raw schema, untouched, with a load timestamp. Every change happens downstream, so a bad model can be rebuilt from raw.
- **Late data.** Payments, refunds and ad conversions often arrive days later. Reload a lookback window on every run and let a unique key overwrite the rows that changed.

### Models in dbt

- **Layers.** Staging (one per source table, rename and cast), intermediate (joins and logic with one clear purpose), marts (the tables reports read) [6].
- **Incremental models.** On later runs they process only new rows. Without a `unique_key`, most adapters append, so re-processed rows duplicate. The key must be unique and never null. A `>=` filter on the last loaded time plus a lookback window catches late rows; `--full-refresh` drops and rebuilds the table; `on_schema_change` defaults to `ignore`, so new source columns are not added unless configured [3].
- **History.** Snapshots record type 2 slowly changing dimensions, with `dbt_valid_from` and `dbt_valid_to`. The timestamp strategy is recommended; the check strategy is for sources without a reliable updated time; `hard_deletes` can ignore, invalidate or record deletions; snapshots ignore `full_refresh`, so history is kept [8].
- **Dialects.** BigQuery, Snowflake and Postgres SQL differ in date functions, quoting and types. State the dialect above every code block.

### Tests and contracts

- **Data tests.** A test is a SELECT that returns failing rows; zero rows passes. dbt ships four generic tests: `unique`, `not_null`, `accepted_values` and `relationships`. Severity can be `warn` or `error`, with thresholds, and `store_failures` keeps failing rows for inspection [1].
- **Unit tests.** From dbt v1.8, a unit test feeds fixed input rows to a model and compares the output with expected rows, before the model is built. Use them for tricky logic (date maths, window functions, long CASE statements) and before refactors; dbt Labs recommends running them only in development and CI [7].
- **Model contracts.** An enforced contract lists every column's name and type, and the build fails if the model does not match [2]. Platforms differ on constraints: `not_null` is the one most often enforced at build time, while primary and foreign keys are often recorded but not enforced on cloud warehouses, so keep `unique` tests even when a primary key is declared [2]. Removing a column or changing its type is a breaking change [2].
- **Source freshness.** Set `loaded_at_field` with `warn_after` and `error_after` per source [4]. `dbt build` does not check freshness; add it as a step, first if models must not run on stale data [5]. dbt's guidance: check at least twice as often as the shortest freshness promise, so a one-day promise means checks every 12 hours [5]. From dbt v2 the command is `dbt freshness --resource-type source` [4].
- **Asset checks in Dagster.** A failed check does not stop downstream assets unless it is marked blocking [14].
- **Tie-outs.** Beyond tests, compare each mart's totals with the source tool's own report (Stripe payouts, Shopify order totals) for the same period and time zone.

### Orchestration and re-runs

- **Airflow 3 defaults.** Catchup is off by default, so missed intervals are not backfilled when a DAG is switched on [13]. Backfills run from the UI or `airflow backfill create` with a date range, a reprocess behaviour and a maximum number of active runs [13].
- **Data intervals.** With trigger timetables such as `@daily`, the run's data interval start and end are the same moment; use a data-interval timetable when the logic needs a window [13]. Code that assumed Airflow 2's interval behaviour needs checking.
- **Clearing tasks** resets them to run again [13]. Before any re-run, check that the load is idempotent for that interval.
- **Secrets.** Credentials live in Airflow Connections or a secrets backend, never in DAG code [11].

### Monitoring and run books

- **Three promises per pipeline:** freshness (by when data is in), completeness (rows in equal rows out, per source and day) and correctness (tests pass and totals tie) [25].
- **Alerts that someone acts on.** Every alert names an owner and links to a run book step [25]. Warnings that nobody reads are removed or promoted.
- **Stop, don't publish.** A failed test or stale source should block the reports that depend on it, with a visible "data delayed" note, rather than show wrong numbers [25].
- **Run book shape.** If-then steps: what the failure looks like, the first three checks, who to tell, how to re-run safely, how to confirm it worked.

### Warehouse cost and recovery (as of November 2026)

- **BigQuery spend.** Dry runs give an upper-bound estimate. "Maximum bytes billed" fails an oversized query without charge; custom daily quotas per project or user are the only hard cap on on-demand spend; `LIMIT` does not reduce bytes read on non-clustered tables; Cloud Billing budgets send alerts [15]. The sandbox needs no card, gives 10 GiB of storage and 1 TiB of query processing a month, and expires tables after 60 days [30].
- **BigQuery layout.** Partition by date (boundaries are UTC) or integer range; partition expiration deletes whole partitions automatically; prefer clustering when partitions would be small, roughly under 10 GB [17].
- **BigQuery recovery.** Time travel covers 7 days by default, settable from 2 to 7; fail-safe keeps deleted data 7 more days, recoverable only through Google support [16].
- **Snowflake spend.** Resource monitors cap warehouse credits and can notify or suspend; only ACCOUNTADMIN creates them; they do not cover serverless features or AI services, which need budgets; suspension can lag, so set a buffer below the real limit [19]. Set auto-suspend low and matched to gaps in the workload; every start is billed for at least 60 seconds [21].
- **Snowflake recovery.** Time Travel defaults to 1 day; Enterprise Edition allows up to 90 days on permanent tables; transient tables 0 or 1 day; `UNDROP` restores dropped objects; Fail-safe adds 7 days that only Snowflake can recover [20].
- **AI access.** BigQuery's MCP server has a read-only SQL tool, and its read-write `execute_sql` can be blocked with an IAM deny policy; results are capped at 3,000 rows [18]. Snowflake's managed MCP server grants permission per tool and its SQL tool defaults to read-only [22]. dbt's local MCP server can run `dbt run`, `build` and `test`; the remote one cannot [10].

### Privacy (not legal advice)

- **EU and UK.** GDPR Article 5 requires personal data to be "adequate, relevant and limited to what is necessary" and kept identifiable no longer than needed [29]. The UK GDPR has the same principles; check the Information Commission's [data minimisation guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/) for UK work (confirmed from search results on 7 Nov 2026). In pipelines: sync only the columns reports need; drop or hash personal fields in staging; set partition or table expiry where a retention period applies; and plan how an erasure request reaches raw tables, snapshots and backups. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US.** Duties depend on the state and the sector; the client's adviser says which apply.
- **Everywhere.** No real personal data in samples, fixtures or chat.

### Access level 3 for pipelines

At level 3 I run jobs and backfills, merge reviewed pipeline and model changes through the client's pipeline, change schedules and deploy dbt models, all within the limits set: which projects and datasets, which kinds of change, a spend cap, and for how long. Even at level 3, each of these needs a fresh yes every time: dropping or truncating a table, a full refresh or backfill that overwrites production data, deleting data or snapshots, shortening time travel or retention, and anything that raises what the client pays (a bigger warehouse, a higher quota or monitor limit, a capacity commitment, a new paid connector). I prepare those at level 2. Billing and payment details stay with the client.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 14 Sep 2026 | dbt v2.0 released | [9] |
| 18 Dec 2026 | End of critical support for dbt v1.11 | [9] |
| 3.4.0 | Current Airflow | [12]; 6 Nov 2026 |
| 22 Apr 2026 | Airflow 2 end of life | [12] |
| Twice per SLA period | dbt's freshness check frequency | [5] |
| 7 days (2 to 7) + 7 | BigQuery time travel, then fail-safe | [16] |
| 1 / up to 90 / + 7 days | Snowflake Time Travel default / Enterprise maximum / Fail-safe | [20] |
| 60 seconds | Snowflake minimum billing per warehouse start | [21] |
| 3,000 rows; 3 minutes | BigQuery MCP result cap; default query timeout | [18] |
| 10 GiB; 1 TiB a month; 60 days | BigQuery sandbox storage, queries, table expiry | [30] |
| 15,841 cases | Left out of PHE reporting, 25 Sep to 2 Oct 2020 | [26] |
| v3.2.0 | Open Data Contract Standard | [24] |

**Numbers I do not quote.** Typical pipeline costs, rows per second a tool "handles", how many tests a model "should" have, or claims about how much of a data team's time goes on cleaning. Costs come from the client's own billing and dry runs.

## 5. Decision rules

- If a load could run twice, make it idempotent (merge on a unique key or replace one partition), because re-runs after failures are normal [11][25].
- If an incremental model has no unique key, add one or expect duplicates on re-processed rows [3].
- If a source sends late changes (refunds, conversions), reload a lookback window each run [3].
- If reports must not show deleted records, filter soft-deleted rows in staging; if finance needs history, use history mode or snapshots [8][27].
- If a column is declared a primary key on BigQuery or Snowflake, still add `unique` and `not_null` tests, because the key may not be enforced [2].
- If a model feeds money or a contract, give it an enforced contract and unit tests for its tricky logic [2][7].
- If data is stale or a blocking test fails, stop the dependent reports and say "data delayed", rather than publish [25].
- If you schedule freshness checks, run them at least twice per freshness promise [5].
- If a DAG moved from Airflow 2 to 3, check catchup and data-interval behaviour before trusting the dates [13].
- If a BigQuery user or tool can run queries, set maximum bytes billed and a daily quota first [15].
- If Snowflake spend must be capped, use a resource monitor for warehouses and a budget for serverless and AI features [19].
- If an AI tool connects to the warehouse at level 1, use the read-only SQL tool and block the read-write one [18][22].
- If a step drops, truncates, overwrites or deletes production data, check time travel covers it, take a copy, and get a fresh yes for that step [16][20].
- If a column holds personal data that no report needs, do not sync it [29].
- If rows in and rows out differ at any hop, treat it as a failure [26].

## 6. Common mistakes and how to spot them

- **INSERT-only loads.** Spot it: totals double after a retried run [11].
- **Incremental without a key.** Spot it: duplicate order IDs only in recent days [3].
- **Missed late data.** Spot it: yesterday's revenue always rises when re-checked a week later.
- **Joins in staging.** Spot it: staging models with JOIN and GROUP BY, duplicated logic downstream [6].
- **Trusting declared keys.** Spot it: a "primary key" column with duplicates on a cloud warehouse [2].
- **Freshness never checked.** Spot it: `dbt build` jobs with no freshness step and a dashboard showing last week [5].
- **Silent truncation.** Spot it: row counts that hit a round limit, or a source file larger than usual with the same row count downstream [26].
- **Non-blocking checks treated as gates.** Spot it: Dagster checks failing while downstream assets still update [14].
- **`now()` in tasks.** Spot it: a re-run of last Tuesday produces different numbers [11].
- **Airflow 2 assumptions on Airflow 3.** Spot it: daily jobs reading an empty interval [13].
- **No spend cap.** Spot it: no maximum bytes billed, no quota, no resource monitor, no budget alert [15][19].
- **Idle warehouses.** Spot it: auto-suspend set to never on a warehouse used a few times a day [21].
- **Sandbox surprises.** Spot it: tables vanishing after 60 days in a BigQuery sandbox project [30].
- **Personal data copied everywhere.** Spot it: email and phone columns in marts that no report uses [29].

## 7. Quality bar

Before I hand over a spec, model, run book or change, I check:
1. Every source, table and field name comes from the client's schema or is marked as a placeholder.
2. The SQL dialect is stated and the code fits it.
3. Each load is idempotent, with its unique key and lookback written down.
4. Each model has tests for keys, blanks and accepted values, and at least one total ties to a trusted source report.
5. Freshness and row-count checks exist, and failures block dependent reports.
6. The run book has if-then steps, owners and a safe re-run for each failure.
7. Spend caps and alerts are set or listed as a gap.
8. No secret, password or real personal record appears anywhere.
9. Every action in the client's systems stayed within the access level and limits, with destructive steps and spend increases separately approved and logged.

## 8. How this role writes

- **Source table.** Tool, objects, load method, schedule, delete handling, lookback, owner.
- **Layered model list.** Raw, staging, intermediate, marts, each with grain and purpose.
- **Test table.** Model, column, test, severity, why.
- **Run book.** Numbered if-then steps.
- **Lineage map.** Report number, mart, intermediate and staging models, raw table, source tool.
- **Change note.** What changes, class (safe, overwrites data, raises spend), rollback, approval needed.
- **Tone.** Short and exact. Technical terms used correctly and explained once. "This backfill overwrites 92 daily partitions of `fct_orders`", not "this refreshes some data".

## 9. Glossary

- **ELT:** extract and load raw data first, then transform it inside the warehouse.
- **Raw layer:** source data landed untouched.
- **Staging model:** a one-to-one cleaned view of a source table [6].
- **Mart:** a business-shaped table that reports read [6].
- **Grain:** what one row of a table means.
- **Incremental model:** a model that processes only new or changed rows on later runs [3].
- **Unique key:** the column or columns used to update rather than duplicate rows [3].
- **Full refresh:** dropping and rebuilding a table from scratch [3].
- **Idempotent:** giving the same result however many times it runs [25].
- **Backfill:** re-running a pipeline for past dates [13].
- **Data interval:** the time window an orchestrator run is responsible for [13].
- **Data test:** a query that returns rows breaking a rule [1].
- **Unit test:** a check of model logic on fixed input rows [7].
- **Model contract:** a declared set of columns and types a model must produce [2].
- **Data contract:** an agreement between data producers and users on schema, quality and service levels [23].
- **Source freshness:** how recently a source table was loaded [4].
- **Snapshot:** a table that keeps every version of changing rows [8].
- **Soft delete:** marking a row as deleted instead of removing it [27].
- **Change data capture (CDC):** reading changes from a database's log rather than re-reading tables [28].
- **Time travel:** reading or restoring a table as it was at an earlier time [16][20].
- **Resource monitor:** a Snowflake credit cap with alerts and suspension [19].
- **Lineage:** the path from a report number back to its sources.

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| dbt versions and support | dbt docs [9] | v2.0 out; v1.12 active; v1.11 ends 18 Dec 2026 |
| dbt freshness command and MCP tools | dbt docs [4][10] | `dbt freshness` in v2 |
| Airflow versions | Airflow docs [12] | 3.4.0; Airflow 2 end of life |
| Dagster | Dagster docs [14] | 1.12.8 |
| BigQuery limits, sandbox and MCP | Google Cloud docs [15][18][30] | 3,000-row MCP cap |
| Snowflake Time Travel, monitors and MCP | Snowflake docs [19][20][22] | Monitors exclude serverless |
| Sync tool modes and plans | Fivetran and Airbyte docs [27][28] | Free plan or free self-hosted option |
| Data contract standard | Bitol [23][24] | v3.2.0 |
| UK data protection guidance | ico.org.uk (search results only, 7 Nov 2026) | Check |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` I make any load that could run twice idempotent (merge on a unique key or replace one partition), because re-runs after failures are normal. (§5)
- `decision_rule` When a source sends late changes such as refunds, I reload a lookback window each run. (§5)
- `decision_rule` When data is stale or a blocking test fails, I stop the dependent reports and say "data delayed" rather than publish. (§5)
- `decision_rule` A model that feeds money or a contract gets an enforced contract and unit tests for its tricky logic. (§5)
- `check` I run freshness checks at least twice per freshness promise. (§5)
- `check` If rows in and rows out differ at any hop, I treat it as a failure. (§5)
