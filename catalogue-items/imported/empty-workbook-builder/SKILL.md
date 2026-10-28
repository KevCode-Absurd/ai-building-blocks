---
name: spreadsheet-manual-build
description: 'Spreadsheet Manual Build: an empty Excel workbook or CSV from a confirmed field list, formatted and validated. Use for an xlsx template or a manual register.'
category: business
risk: safe
source: self
source_type: self
date_added: "2026-09-28"
author: WHOISABHISHEKADHIKARI
tags: [spreadsheet, excel, xlsx, workbook, manual, operations, template, helper]
tools: []
source_repo: WHOISABHISHEKADHIKARI/sme-ops-system-builder
---

# Spreadsheet Manual Build

**What it is:** a formatted, empty workbook from a field list someone has already
confirmed - no dashboards nobody asked for, no invented rows.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Prepares a spreadsheet or Excel workbook from confirmed business requirements. Use it
when the user wants an Excel workbook, a spreadsheet template, an `.xlsx` file, a manually
editable register, an importable table, or a workbook built from another skill's field
list.

The workbook is built only from confirmed fields. This is a helper: it defines no table of
its own and renders whatever field list the active module already confirmed, so the
workbook and the module's CSV cannot disagree.

Layer: n/a. Fits: every stage. Table code: n/a - it renders the active module's table.

## When to Use This Skill

- I need an Excel workbook
- give me a spreadsheet template
- I want an `.xlsx` file
- build me a register I can edit by hand
- make this importable as a table
- build a workbook from the fields we agreed

Also use it when a module has confirmed a field list and the user wants that list as a
workbook rather than as DDL or a schema.

Do not use it to decide which fields the business needs. That is the module skill's job,
and this one starts from what it confirmed.

## How It Works

Work from the confirmed field list the user gives you. The rules below say how to ask, what to build and what to check before handing it over.

### Step 1 - Identify intent

Read the request and pick the intent before asking anything.

- "a template", "an empty workbook" -> template only. Output: an empty workbook with
  headers and formatting.
- "with a couple of rows to see the shape" -> workbook with examples, and only when the
  user asked. The data is obviously fake.
- "the dates are showing as text", "the column is too narrow" -> fix existing workbook.
  Output: only the structure or formatting that was asked for.
- "how should these fields sit in the sheet" -> mapping only. Output: the column plan,
  no file.

Never produce more than the intent asked for. A fix does not become a rebuild, and a
mapping does not become a file.

### Step 2 - Ask only what is missing

Reuse everything already confirmed, including by the module that owns the field list: the
workbook purpose, the field names and types, the select options, the date and currency
fields, any formula the parent skill defines explicitly, the statuses, and the IDs. Never
ask again for information the user has already supplied.

Ask one short question per message, and only when the answer changes the output:

> **Q:** Do you want `.xlsx` or CSV?

> **Q:** Should this be an empty template or include example rows?

If the answer does not materially change the result, do not ask, and default to:

```yaml
format: xlsx
example_rows: false
```

### Step 3 - Hold the internal context

Hold the answers in this shape. It stays internal - it is not shown to the user unless
they ask, and it never carries a value the user did not give.

```yaml
module: spreadsheet-manual-build
intent: null            # set in Step 1, one of: template, examples, fix, mapping
source_module: null     # the module whose field list this renders
requested_outputs: []   # xlsx | csv | mapping
example_rows: false
confirmed_facts: []     # only what the user actually said
open_questions: []      # the unanswered ones, in the order worth asking
```

`source_module` is the one field this skill needs that a module skill does not have. If it
is unknown, ask which database to prepare, because a workbook built from a guess is a
rebuild of the guess later.

### Step 4 - Recommend the smallest workflow

Build an already requested artifact without asking again. For advice-only requests, give a short recommendation and offer the relevant artifact.

**Recommended approach:** One sheet, one header row, one column per confirmed field,
frozen and filtered. That is a working register on day one.

**Why this one:** workbooks fail from decoration, not from missing columns. A single
filtered sheet gets maintained; a dashboard nobody opens does not, and every extra tab is
a second thing to keep in step with the first.

**Workflow:** Field list confirmed -> Columns and formats set -> Header frozen and
filtered -> (rows entered by the user) -> Reviewed

Default to one sheet unless the confirmed workflow requires more. Do not create
dashboards, charts, lookup sheets or instruction tabs unless the user asks for them or the
confirmed workflow clearly requires them. The default sheet name is `Register`.

### Step 5 - Build only on request

Once the user asks, emit the workbook or the CSV as data only. No preamble, no summary, no
closing line. Every column comes from the canonical field list, with the exact field
names, in the same order, every time.

A `.xlsx` is a real file. A CSV is not a workbook: a CSV is UTF-8 with a byte order mark
so Excel opens the text correctly, plus a note of which columns need a number, date or
currency format applied. Create `.xlsx` only when the user asks for a workbook.

#### Column rules

| Canonical type | Spreadsheet format |
|---|---|
| id | Text |
| title | Text |
| text | Text |
| long_text | Text, wrapped |
| number | Number |
| currency | Currency or Accounting, and only when the currency is known |
| percentage | Number on a 0–100 scale; convert to fraction before Percentage formatting |
| date | Date |
| datetime | Date + Time |
| checkbox | TRUE/FALSE |
| select | Data validation list |
| multi_select | Text, unless another structure is explicitly requested |
| url | Hyperlink or Text |
| email | Text |
| phone | Text |
| relation | Text reference key, unless the workbook design explicitly supports lookups |

#### Formatting

Practical business formatting only:

- a bold header row
- the top row frozen
- an autofilter over the header
- sensible column widths
- a date format on date fields
- a number format on numeric fields
- wrapped long-text fields

No decorative formatting that reduces usability. A currency format is applied only where
the user has named the currency; where they have not, the column stays numeric and the
currency is recorded separately, because a currency symbol in a cell is an assumption
nobody asked for.

#### Select fields

For a confirmed select field, use data validation where practical, listing only the
confirmed options:

```text
Status:
Draft
Filed
Paid
Overdue
Amended
```

Never invent a status. A starting set is a suggestion, and the user renames it to match
how the business talks.

#### Formulas

Never invent a formula. One may be added only when the parent skill defines it, or when
the user asks for it and gives the rule. A value computed elsewhere - `Net Tax Payable`,
`Days to Due`, `Balance`, `Variance` - stays an input or an output column. If the parent
skill says the calculation belongs in accounting or tax software, that rule stands and no
Excel formula is written for it.

#### IDs

Do not auto-generate production IDs unless the user requests it, and leave the ID column
blank in an empty template. If the user wants an automatic spreadsheet ID, confirm the
required pattern first rather than guessing one.

#### Before you hand it over

```
Workbook name confirmed?
Sheet names necessary, or is one enough?
Every column from the canonical schema, and nothing else?
No invented fields?
No invented formulas?
No fake rows unless requested?
Correct date formats?
Correct number formats?
Only the confirmed select options?
```

## Field Reference

This skill has no Field Reference of its own, and it must not grow one. The active
module's Field Reference is the single source: the same field list that produces its CSV,
SQL, JSON Schema and Notion mapping produces this workbook, so a column can never appear
here that is absent there.

If the field list is not in front of you, ask the user to paste the confirmed field list and
say whether they want Excel or CSV. If it is missing or ambiguous, ask and stop.

## Input Modules

A helper has no field list of its own. Its input is a confirmed field list that the user pastes into the chat: field names, types, order, whether each is required, any pick-list options and any formulas. Render exactly that list. If it is missing or unclear, ask for it and stop.

## Select Options

Option lists belong to the source module. Emit them as a data validation list the user
confirms, never as a settled taxonomy, and never as a value the user has to guess.

## Relations

A relation is a reference key in a cell, not a live link. Do not build lookup sheets or
`VLOOKUP` chains to make a link work unless the user asks for that design explicitly, and
if they do, ask which sheet holds the target list first - a lookup with no confirmed
source returns blanks that look like real answers.

## Examples

**Prompt**

```
Give me an Excel register for the leave requests we already agreed on.
```

**Answered in one message, no intake needed** - the field list was already confirmed:

```
Read skills/leave-management/SKILL.md for the field list, then emit the .xlsx with one
sheet, a frozen filtered header, and Leave Type and Status as validation lists.
```

**Prompt**

```
The dates in my register are sorting alphabetically.
```

**Fix only** - formatting change, no rebuild:

> Select the leave date column and apply a date format, `YYYY-MM-DD` or the format your
> business writes. A column still stored as text sorts as text, whatever it looks like.

**Documented shape** - a leave register as a header row, no data. The column below is a
documentation example: emit empty templates unless the user explicitly requests examples.

```csv
Employee ID,Employee Name,Leave Type,Start Date,End Date,Days,Reason,Status,Approver
```


See the [Best Practices](references/best-practices.md) reference for the full guidance.

## Limitations

- It formats a field list someone else confirmed. It never decides the schema.
- It produces a file, not a system. There is no automation, no sync, no validation across
  rows, and no connection to any source system.
- Data validation lists are a convenience, not a rule: a pasted value can still get in.
- Multi-select and relation fields are text in a single cell. Anything richer needs a
  design the user asks for.
- Nothing here is verified until the user has entered rows and checked them.
- Legal, tax and payroll review is still required before a register drives real decisions.


See the [Security & Safety Notes](references/security-safety-notes.md) reference for the full guidance.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Build it** with the [Database schema planner](https://useaiblocks.com/skills/database-schema-planner).
- The [Fixed asset accounting tracker](https://useaiblocks.com/skills/fixed-asset-register-keeper). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
