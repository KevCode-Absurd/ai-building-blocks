---
name: app-data-model
description: Designs the data model for a no-code app (Bubble data types, Glide or Softr tables, an Airtable base) from the client's current spreadsheet or base - tables, fields, types, links, owner fields for privacy, what to tidy first, and a check against the platform's and data source's limits. Use before any pages are built, when moving a sheet into an app, or when an existing app's data has grown messy.
---

# App data model

The data model decides everything else: what pages can show, what privacy rules can enforce and how fast the app runs. A messy sheet turned straight into an app gives a messy app. This skill plans the tables first.

Access levels for this skill: the design needs level 1 (column names, a few rows of made-up sample data, or read-only access). Creating tables and fields in a copy of the base or in Bubble's Development version needs level 2. Changing the live base or database needs level 3, within the client's limits. Deleting, renaming or retyping fields that hold live data, and bulk imports over live data, need a fresh yes.

## When to use

- A client runs on a spreadsheet or Airtable base and wants an app on top.
- Before planning pages or privacy rules.
- When an app has duplicate fields, retyped names or slow searches.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- The current sheet's column names or the base's tables and fields, with a few rows of made-up sample data.
- The users and roles (skill: roles-and-privacy-rules), at least in draft.
- The platform and data source, or a shortlist.
- Expected numbers: records now and in a year, users, and how many use it at once.

## Steps

1. **Find the things.** Read the columns and name the real-world things they describe: Client, Job, Task, Upload, Invoice, Staff member. Each becomes a table (or a Bubble data type).
2. **Split mixed columns.** One column per fact. "Client / contact / phone" in one cell becomes three fields; repeated column groups (Task 1, Task 2, Task 3) become a separate table.
3. **Store each fact once.** If the client's name is typed on every job, make a Clients table and link jobs to it. Spellings drift; links don't.
4. **Choose field types.** Text, number, date, yes or no, option set or single select, file, link to another table. Use option sets for statuses so filters and rules work.
5. **Add owner fields.** Every private record needs a link to who owns it (a user or a company), so privacy rules and filters can match the logged-in user. Add Created by and Created date where the platform doesn't add them.
6. **Plan links.** One to many (a client has many jobs) and many to many (a job has several staff). On Airtable-backed apps, links and lookups also drive Softr and Glide filters.
7. **Mark sensitive fields** and ask whether each is needed. No card numbers ever; store the payment provider's reference instead.
8. **List what to tidy first.** Merged cells, mixed types in one column, blank header rows, duplicate clients, free-text statuses. Tidy in a copy (level 2) and agree the cut-over.
9. **Check limits.** Records and growth against the plan and source: Airtable bases allow 1,000 records on Free, 50,000 on Team and 125,000 on Business; its API allows 5 requests per second per base; Softr's own guidance suggests 200 to 300 concurrent users for Airtable and 50 to 100 for Google Sheets; Glide Classic needs Business or above for Airtable as a source. If the numbers don't fit, say so now and name the options (the platform's own database, a bigger plan, or not no-code).
10. **Build (level 2) and switch over (level 3).** Create the tables in a copy or Development, import made-up data, test, then plan the live import with a backup and a fresh yes if it overwrites anything. Log each action.

## Checks

- Every table is one kind of thing; every field one fact.
- No retyped data where a link would do.
- Every private table has an owner field.
- Statuses and categories are option sets, not free text.
- Sensitive fields are justified; no card numbers.
- Record, user and API numbers fit the plan and source, with a year's growth.
- Every table and field is marked "existing" or "new".

## Output format

1. **Things found**: table name and what it represents.
2. **Data model table**: table, field, type, link, required, existing or new, sensitive (yes or no).
3. **Links**: diagram in words ("Client 1 to many Job").
4. **Tidy list**: what to fix in the sheet or base first.
5. **Limits check** and **open questions**.

## Example of good output (short)

*Brightway Cleaning is a made-up business used only to show the format: 12 cleaners, jobs in one Google Sheet, planning a Glide app.*

**Things found:** Client, Site, Job, Checklist item, Cleaner.

| Table | Field | Type | Link | Required | Existing / new | Sensitive |
|---|---|---|---|---|---|---|
| Clients | Name | Text | | Yes | Existing (column A) | No |
| Clients | Contact email | Email | | Yes | Existing (column C) | Yes |
| Sites | Address | Text | Clients (many to one) | Yes | Existing (column B, split) | Yes |
| Sites | Access notes | Text | | No | Existing | Yes: key safe codes go to staff only |
| Jobs | Date | Date | Sites | Yes | Existing | No |
| Jobs | Cleaner | Link | Users (row owner) | Yes | New (was a typed name) | No |
| Jobs | Status | Option: To do, Done, Problem | | Yes | New (was free text) | No |
| Checklist items | Job | Link | Jobs | Yes | New (was columns H to P) | No |

**Tidy list:** split column B into Site and Address; replace typed cleaner names with links to the users table; turn free-text statuses into three options.

**Open question:** should key safe codes live in the app at all, or stay with the office?
