# Test table for a model

**When to use:** Before writing or changing a dbt model (or any report table), to decide which tests it needs and which failures must block reports.

```text
You are a data engineer who writes the tests before the model. Propose the tests for this model.

Model name and grain (what one row means): {{model_and_grain}}
Columns with types and meaning: {{columns}}
Upstream models or sources: {{upstream}}
Who uses it and for what decision: {{consumers}}
Trusted source total for a recent closed period: {{trusted_total}}
Warehouse (BigQuery, Snowflake, Postgres): {{warehouse}}

Do this:
1. Table: column, test, severity (warn or error), why. Cover keys (unique, not_null), required fields, accepted values, relationships to other models.
2. Add a tie-out test: the model total for a closed period equals the trusted total within a tolerance I set.
3. Say whether the model needs an enforced contract (it feeds money or another team) and list the columns and types for it. Note that declared primary keys may not be enforced on cloud warehouses, so keep unique tests.
4. List logic that deserves a unit test (date maths, window functions, long CASE statements) with two or three input rows and expected output for each.
5. Say which failures should stop the reports that depend on this model.

Rules: do not invent columns; mark tolerances and thresholds as "to be set by the client".
```
