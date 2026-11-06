# Failed or late load response

**Trigger:** An alert fires (job failed, source stale, row gap, test failure, tie-out off), or someone reports a number that looks wrong. Start within the response time agreed in the run book.

## Steps

1. **Acknowledge and hold.** Confirm the alert, and make sure the dependent reports show "data delayed since [time]" instead of updating with partial data. Tell the report owners in one line.
2. **Find the failure type.** Using the run book: failed, late, partial, doubled or wrong. Read the scheduler log, the sync tool log and the source's status page (level 1).
3. **First three checks.** Follow the run book's if-then steps for that type: for example row counts at source vs landed, file sizes against recent days, test failures stored with `store_failures`.
4. **Decide the fix.** If it is a source outage, wait and say so. If it is our job, fix the cause on a branch (level 2) before re-running.
5. **Check the re-run.** Run the `safe-rerun-check` prompt: duplicates, overwrites, recovery window, Airflow interval and backfill settings.
6. **Re-run (level 3).** Re-run the failed interval within the limits. *Approval: a backfill or full refresh that overwrites production data, deleting rows, or raising warehouse size or quota needs the client's fresh yes, every time.*
7. **Confirm.** Row counts match, tests pass, the tie-out is back within tolerance, freshness is green. Then release the reports.
8. **Tell people.** What happened, which reports were affected and for how long, what was fixed, and whether any numbers people saw were wrong.
9. **Log and learn.** Add the incident to the log (what, where, when, result). If the run book step was missing or wrong, update it, and add a test or alert so this failure is caught earlier next time.

## Outputs

- Reports held, then released with a delay note
- Fix and re-run within limits, with checks passed
- Incident note to report owners
- Updated run book and, if needed, a new test or alert
- Action log entry

## Needs the client's approval

Any backfill or full refresh that overwrites production data; any deletion; any increase in warehouse size, quota or monitor limit; any change to who receives alerts or reports; and correcting numbers already sent to people outside the business.
