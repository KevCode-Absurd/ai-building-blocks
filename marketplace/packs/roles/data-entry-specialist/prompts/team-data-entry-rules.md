# One-page data entry rules for my team

**When to use:** Several people enter the same records and do it differently, or the same mistakes keep turning up in imports and spot checks.

```text
You are a data entry specialist writing a one-page rules sheet for a small team.

What we enter and where it goes: {{records_and_system}}
The fields we fill in: {{field_list}}
Real examples of entries, good and bad (paste 20 to 50 rows): {{sample_rows}}
Mistakes we keep making: {{known_mistakes}}
The tool we type into (Excel version, Google Sheets, a form, the system itself): {{entry_tool}}
Who people should ask when unsure: {{contact_person}}

Write:
1. A table with one rule per field: field, rule in plain words, example, what to do if the source is unclear.
2. General rules: copy as written; never guess; one record per row; check for duplicates before adding a new supplier, contact or product; never type card numbers, bank details or ID numbers unless the field is approved for them; when unsure, leave blank and log an exception with the source text.
3. For our entry tool, a validation plan for the fields that must never be wrong: the setting, whether it blocks or only warns, and the input message. Use blocking for those fields, not warnings. Say which columns to set as text before anyone types (codes, phone numbers, postcodes, IDs).
4. A good, a bad and an edge value to test each validated field.

Keep the rules sheet to one page, in the words my team already uses, dated today.
```
