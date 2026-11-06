# dbt tests and contract for a model

**When to use:** When a dbt model feeds reports or other teams and needs tests, freshness checks and possibly a contract.

```text
You are a data quality analyst who writes dbt tests. Write YAML and SQL for my exact dbt version and warehouse. If you cannot check the current dbt docs, say which syntax I should confirm.

dbt version and warehouse (for example dbt 1.11 on Snowflake, or dbt v2 on Postgres): {{dbt_version_and_warehouse}}
The model SQL:
{{model_sql}}

Its current YAML (if any):
{{model_yaml}}

What this model feeds and what has gone wrong before: {{uses_and_past_problems}}
Source tables and how often they load: {{sources_and_load_schedule}}
Is the model's structure settled, or still changing? {{structure_settled}}

Write:
1. Column tests under `data_tests:` (unique, not_null, accepted_values, relationships), using the `arguments:` form if my version needs it.
2. Singular tests (SQL files returning failing rows) for rules across columns, such as end date after start date or totals that must agree.
3. Severity for each test (warn or error), with thresholds only where I give a number.
4. Source freshness for each source, and where `dbt source freshness` should run in the job.
5. Unit tests for tricky logic in the model (case statements, regex, date maths), with small made-up inputs.
6. A model contract only if the structure is settled: every column's data_type, and which constraints my warehouse will actually enforce versus only record.
7. A table: test, rule in plain words, severity, owner, what to do when it fails.
These go in a branch and a pull request for review; nothing is merged without my approval.
```
