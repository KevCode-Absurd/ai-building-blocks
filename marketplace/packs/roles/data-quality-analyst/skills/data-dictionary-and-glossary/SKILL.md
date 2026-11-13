---
name: data-dictionary-and-glossary
description: Writes a data dictionary for exports, spreadsheets, CRM fields or database tables (what one row is, then each column's plain meaning, type, allowed values, example, blanks allowed, owner and notes), gathers code lists into lookup tables, flags columns that hold two things or mean the same thing in two files, notes how files link, adds a business glossary of reporting terms, and can turn the result into a data contract (ODCS or a dbt model contract). States every unclear meaning as a marked assumption with its evidence, never as fact. Reads at access level 1; drafts dictionary pages or field descriptions at level 2; publishes them or updates field descriptions and pick lists at level 3 within limits. Use when handing data to a new analyst, after a system move, or when teams disagree on what a column or term means.
---

# Data dictionary and glossary

## When to use

- A new analyst, bookkeeper or developer needs to use data without asking around.
- Several tools export overlapping columns and nobody is sure which one is right.
- Sites or teams use the same reporting term in different ways.
- A system move needs the new system's fields described before go-live.
- Other teams depend on a dataset and want a written agreement about it.

## What you need

1. The list of files, tables or CRM objects, with their column names and row counts.
2. Five or more sample rows per file, with personal details replaced. Without samples, meanings can only be described loosely.
3. Any existing notes, import templates, field settings or schema (DDL or dbt YAML).
4. The reporting terms in use and how each team uses them.
5. Who owns each dataset.
6. Access: level 1 to read. Level 2 to draft a dictionary page, a CSV or dbt YAML descriptions in a pull request. Level 3 to publish the dictionary, update field descriptions and pick lists in the tool, or merge the pull request, within limits. Deleting or retiring fields needs a fresh yes.

## Steps

### 1. Start each file with what one row is

"One row is one order line", "one row is one membership period". Most confusion starts here: an order export and an order-line export look alike but count differently.

### 2. Go column by column

For each column, one line in a fixed pattern:
- **Meaning:** one plain sentence starting with a noun ("The date the deal was marked won").
- **Type:** text, whole number, decimal, date, date and time (with time zone), yes/no.
- **Allowed values or range:** the pick list, the format or the range.
- **Example:** taken from the samples, masked if personal.
- **Blanks allowed:** yes or no, and what a blank means.
- **Owner:** the role that keeps it right.
- **Notes:** traps, history, related columns.

Where the meaning is not clear from the brief or samples, write the best reading, mark it "assumed" and give the evidence in a few words ("assumed from the sample values"). A guess is never shown as fact.

### 3. Gather code lists

Status codes, stages, categories and flags go into small lookup tables: code, meaning, in use or retired.

### 4. Flag problems as they appear

- Columns that hold two things at once ("status" holding stage, reason and owner).
- The same thing under different names in two files, or the same name meaning different things.
- Free text where a pick list would do.
- Columns nobody uses (blank in every sample, or unchanged for a year).

### 5. Note the links

Which column joins to which, the join type that makes sense, and where the join breaks (IDs in different formats, missing rows). This is the start of lineage notes: for each report, which files, columns and steps sit behind each number.

### 6. Write the glossary

Each business term in plain words, with what it includes and leaves out, and which column or calculation carries it. Where teams disagree, show each version and ask the owner to choose. Metric formulas belong to the BI analyst's metric definition sheet; link to it rather than redefining.

### 7. Optional: make it a contract

For data other teams rely on, turn the dictionary into a contract: ODCS v3.2.0 sections (schema, quality rules, service levels, team) for the shared agreement, or a dbt model contract (`contract: enforced: true` with every column's `data_type`) for the build side. dbt advises waiting until the model's structure has settled. With web search connected, check the current ODCS and dbt docs for field names; without it, mark the YAML "check against your version".

### 8. Deliver

Markdown tables, plus CSV for a sheet or Notion, plus dbt YAML descriptions if the data lives in dbt. At level 3, publish where agreed and update field descriptions in the tool.

## Checks

- Every column in the brief appears exactly once.
- Every file starts with what one row is.
- Examples come from the samples and are masked where personal.
- Descriptions follow one pattern.
- Every unclear meaning is marked "assumed" with its evidence; the ones that change how the data is used are listed at the end.
- Code lists are complete for the samples seen.
- No personal data is copied from samples.

## Output format

1. Summary: files, rows, columns, how many meanings are assumed.
2. One table per file: column, meaning, type, allowed values, example, blanks, owner, notes.
3. Lookup tables for codes.
4. Problems found (two-in-one columns, clashes, unused fields).
5. Links between files.
6. Glossary.
7. Assumptions: only the readings that change how the data is used or counted, one line each with the evidence and what it affects.
8. CSV or YAML files, as asked.

## Example of good output (short)

*Illustrative structure, not a real organisation: a food bank with an Airtable export of visits. Copy the shape, never the content: every fact comes from the client's own context.*

> **visits:** One row is one household's visit to one site on one day. 18,204 rows.
>
> | Column | Meaning | Type | Allowed values | Example | Blanks | Owner | Notes |
> |---|---|---|---|---|---|---|---|
> | visit_id | Unique ID of the visit | Text | `V-` then 6 digits | V-004812 | No | Site lead | Key |
> | site | The site visited | Text | 5 site codes (see lookup) | NTH | No | Ops manager | |
> | hh_size | People in the household on that day | Whole number | 1 to 15 | 4 | Yes | Volunteer at desk | Blank on 9% of sample rows |
> | status | **Holds two things**: visit outcome and referral source | Text | Mixed | "Collected / GP" | No | Assumed: ops manager | Split into `outcome` and `referral_source` |
>
> Assumption: "active household" is read as a visit in the last 12 months, the wider of the two site rules. Sites NTH and EST count it differently (3 and 12 months), so site totals are not comparable until one rule is used everywhere.
