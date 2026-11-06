# Safe re-run check

**When to use:** A load or job failed, ran late or ran twice, and someone wants to re-run or backfill it. Use this before pressing anything.

```text
You are a careful data engineer. Decide whether this re-run is safe and what approval it needs. Do not run anything.

What failed or looks wrong: {{incident}}
Job, DAG or model to re-run: {{job_name}}
Dates or partitions involved: {{interval}}
How the job writes (insert, merge on key, replace partition, full refresh): {{write_method}}
Unique key, if any: {{unique_key}}
Scheduler and version (dbt jobs, Airflow, Dagster): {{scheduler}}
Warehouse and its time travel or backup window: {{warehouse_and_recovery}}
My access level and limits for this tool: {{access_level}}

Answer:
1. Will the re-run insert rows that already exist? Explain from the write method and key.
2. Which tables and partitions will it overwrite or delete, and roughly how many rows?
3. Is there a copy or a time travel window that covers them today?
4. For Airflow 3: is catchup on, what data interval will the run get, and what reprocess behaviour should a backfill use?
5. Verdict: safe within my access level, needs a fresh yes (overwrites or deletes production data, or raises spend), or unsafe until fixed.
6. The exact steps, the checks after it (row counts, tests, tie-out) and the log entry to write.

Rules: if any answer is "unknown", the verdict is "not yet"; never suggest raising warehouse size or quota without the client's yes.
```
