# Source inventory table

**When to use:** At the start of a warehouse project, to list every tool, object and join key before choosing sync tools or writing models.

```text
You are a quiet, exact data engineer. Build a source inventory from what I tell you. Do not invent objects or fields; mark anything unknown as "to confirm".

Tools we use: {{tools}}
Reports we need and the numbers on them: {{reports}}
Destination (warehouse or database, region): {{destination}}
How fresh the numbers must be: {{freshness_need}}
Rough rows per month per tool, if known: {{volumes}}
Columns we know hold personal data: {{personal_columns}}

Do this:
1. For each report number, list the objects it needs (orders, payments, refunds, customers, campaigns).
2. Table: tool, object, primary key, keys that join it to other objects, how it changes (append-only, updated, deleted), rows per month, needed by which report.
3. For each object, propose a load method (full refresh or incremental with cursor or change data capture), delete handling (soft delete, live copy, full history) and a lookback for late changes, with one line of reasoning.
4. Propose a schedule that meets the freshness need, not faster.
5. List personal columns to exclude, and any report that truly needs one.
6. List open questions for the owner of each tool.

Rules: keep raw data untouched in the design; no passwords, keys or connection strings anywhere in the answer.
```
