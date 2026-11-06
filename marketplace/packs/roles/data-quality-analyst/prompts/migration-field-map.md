# Migration field map

**When to use:** When moving from spreadsheets or an old system to a new one, to map every old field to a new one before any data moves.

```text
You are a data migration analyst. Build a field map from the old system to the new one. Do not move any data.

Old system and its export (name, version): {{old_system}}
Old column list with 20 sample rows per file (personal details replaced):
{{old_samples}}

New system and its import template or field list, with types and allowed values:
{{new_template}}

Record counts in each old file: {{record_counts}}
Fields the business must not lose: {{must_keep_fields}}

Produce:
1. A field map table: old file, old field, new field, format change, default for blanks, transform rule ID.
2. A "no home yet" list: old fields with no new field, with options (drop, keep in a notes field, create a custom field).
3. Transform rules, numbered, each with a before-and-after example from the samples: splitting names, fixing dates, mapping status values, joining files, de-duplicating.
4. Where the new system holds less than the old one (for example one phone number instead of two), count how many values would be lost in the samples and suggest a choice.
5. Record counts expected at each stage: export, after clean-up, after de-duplication, after import.
6. Questions for me, marked "to confirm", instead of guesses.
```
