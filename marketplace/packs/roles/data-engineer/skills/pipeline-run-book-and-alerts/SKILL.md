---
name: pipeline-run-book-and-alerts
description: Writes the run book and alert rules for a data pipeline - freshness, completeness and correctness promises per source, alerts that each name an owner and link to a run book step, what failed, late, partial and doubled loads look like, the first checks for each, who to tell, a safe re-run that cannot load twice (idempotency, unique keys, partitions, Airflow 3 backfill and catchup settings), how to confirm the fix, and a "data delayed" rule that blocks reports instead of publishing wrong numbers. Writing it is level 1 or 2; re-running jobs is level 3, and overwriting production data needs a fresh yes. Use it after any pipeline goes live.
---

# Pipeline run book and alerts

## When to use

- A pipeline is live and nobody wrote down what to do when it breaks.
- Loads fail, arrive late or double up, and each incident is handled from scratch.
- Alerts fire so often that people ignore them.

## What you need

1. The pipeline spec or a list of sources, schedules, models and reports.
2. The freshness promise per report ("by 06:00 daily").
3. The scheduler (dbt platform jobs, Airflow, Dagster) and where alerts go (email, Slack, Teams).
4. Recent failures and how they were fixed, if any.
5. Who owns each source and who reads each report.
6. Access: level 1 to read logs and settings; level 2 to draft alert rules and the run book; level 3 to change alert settings, re-run jobs and start backfills within your limits.

## Steps

### 1. Write three promises per pipeline

- **Freshness:** by when each source and report is up to date.
- **Completeness:** rows in at the source equal rows landed, per object and day.
- **Correctness:** tests pass and the main totals tie to trusted reports.
The Google SRE Workbook frames pipeline objectives the same way, and measures them end to end [25].

### 2. Map failure types

For each source and stage, describe what each failure looks like:
- **Failed:** the job errored.
- **Late:** the job ran but the source was stale.
- **Partial:** fewer rows than the source, or a file cut short (the PHE 2020 case: files larger than the loader's limit lost rows [26]).
- **Doubled:** a re-run inserted rows again.
- **Wrong:** tests pass but a total stopped tying out.

### 3. Set alert rules

Each alert has a condition, a severity, an owner and a link to a run book step [25]. Use dbt freshness `warn_after` and `error_after` on sources [4], test severities `warn` and `error` [1], and blocking checks where a failure must stop downstream work (in Dagster, a check blocks only when `blocking=True` [14]). Remove or promote alerts nobody acts on.

### 4. Decide what stops

When a source is stale or a blocking test fails, the dependent reports stop updating and show "data delayed since [time]", rather than publish incomplete numbers [25]. Put the freshness step first in jobs whose models must not run on stale data [5].

### 5. Write the if-then steps

For each failure type: the first three checks (logs, source status page, row counts), the likely causes, who to tell and when, the fix, and how to confirm.

### 6. Make re-runs safe

- Loads must be idempotent: merge on a unique key or replace one partition, never plain INSERT [11][3].
- Tasks read and write the partition for their own data interval, never "now" [11].
- In Airflow 3, catchup is off by default and backfills take a date range, a reprocess behaviour and a cap on active runs [13]. `@daily` trigger timetables give a zero-length data interval; use a data-interval timetable if the job needs a window [13].
- Before any re-run, ask three questions: will this insert rows that already exist? Which partitions or tables will it overwrite? Is there a copy or time travel window covering them [16][20]?

### 7. Approvals inside the run book

Re-running a failed job for its own interval is level 3 work within the limits. A backfill or full refresh that overwrites production data, deleting rows, or raising warehouse size or quota to get a job through needs a fresh yes every time. Write these into the steps.

### 8. Test the run book

Break a development copy on purpose (stop a source, duplicate a file) and follow the steps. Fix any step that did not work. Record the date.

## Checks

- Three promises per pipeline, with numbers set by the client.
- Every alert has an owner and a run book link.
- Stale or failed data blocks reports and shows a delay note.
- Every re-run path is idempotent, with the three questions answered.
- Steps needing a fresh yes are marked.
- The run book was tested on a copy, with the date recorded.

## Output format

```
# Run book: [pipeline], version [n], [date]
## Promises (freshness, completeness, correctness)
## Alert rules
| Alert | Condition | Severity | Owner | Run book step |
## If-then steps by failure type
## Safe re-run checklist
## Steps that need a fresh yes
## Test log
```

## Example of good output (short)

*Made-up business: Larkspur Clinics, a physiotherapy group with a booking system and accounting software, on Snowflake with dbt and Airflow 3.*

> **Promise:** bookings and invoices loaded by 07:00 UK time; rows landed equal rows in the booking system's daily export; weekly revenue ties to the accounting report within the agreed tolerance.
>
> | Alert | Condition | Severity | Owner | Step |
> |---|---|---|---|---|
> | Bookings stale | `error_after` 12 hours on `raw_bookings.appointments` | error | Data lead | 2.1 |
> | Row gap | landed rows below source export count for yesterday | error | Data lead | 2.3 |
> | Revenue tie-out | weekly total off by more than tolerance | warn | Finance | 2.5 |
>
> **2.3 If landed rows are below the source count:** (1) check the sync log for a page or file limit; (2) compare yesterday's file size with the last 7 days; (3) count rows per clinic to find the gap. Tell the data lead and finance. Re-sync yesterday's partition only; the model merges on `appointment_id`, so it cannot double. Confirm counts match, then let reports refresh. A re-sync of more than yesterday overwrites history and needs your yes.
