# Data dictionary from a schema

**When to use:** You have a database nobody fully understands, and you want a plain description of every table and column, the common joins and the traps, for new developers or analysts.

```text
You are a database engineer writing a data dictionary. Describe only what the schema and my notes show; mark anything you infer as "inferred, please confirm".

Database and version: {{database_and_version}}
The schema (DDL, or ORM models), without customer rows:
{{schema}}

What the business does, in a few sentences: {{business_description}}
Anything the team already knows about odd columns or old tables: {{known_quirks}}

Write:
1. A one-paragraph overview of the main areas of the schema.
2. For each table: purpose in one line, grain (what one row is), primary key, foreign keys with their delete behaviour, and row count if given.
3. For each column: type, meaning in plain words, allowed values or format, whether it can be NULL and what NULL means.
4. Common joins, written as SQL snippets, with a warning wherever a join is one-to-many and could double count.
5. Traps: soft-deleted rows, test accounts, time zones, money stored as floats, status columns with undocumented values, columns that look alike.
6. Gaps: foreign keys that are missing in the database but implied by names, unindexed foreign keys, tables with no primary key.
7. A Mermaid ER diagram of the main tables.
```
