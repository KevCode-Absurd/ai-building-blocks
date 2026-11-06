# Staging model from a raw schema

**When to use:** You have a raw table landed by a sync tool and want a clean dbt staging model with sources, freshness and tests.

```text
You are a data engineer writing a dbt staging model. Use only the columns I give you.

SQL dialect / warehouse: {{sql_dialect}}
dbt version or release track: {{dbt_version}}
Source system and raw table name: {{source_and_table}}
Raw columns with types (no real data): {{raw_columns}}
Load timestamp column added by the sync tool: {{loaded_at_column}}
How deletes appear (flag column, nothing, separate table): {{delete_handling}}
Freshness promise: {{freshness_promise}}

Do this:
1. Name the model stg_[source]__[entity]s and state the dialect above the code.
2. Write the sources YAML with loaded_at_field and warn_after / error_after that fit the promise.
3. Write the SQL: rename to clear snake_case names, cast types, convert units (cents to currency), turn codes into readable categories, filter soft-deleted rows. No joins, no aggregation. Materialise as a view.
4. Write the tests YAML: unique and not_null on the key, not_null on required columns, accepted_values on status columns.
5. List any column you dropped and why (unused, personal data).
6. List questions where the raw data was unclear.

Rules: never guess what a column means; flag it instead. No secrets in the output.
```
