---
name: clean-data-xls
description: Clean up messy spreadsheet data — trim whitespace, fix inconsistent casing, convert numbers-stored-as-text, standardize dates, remove duplicates, and flag mixed-type columns. Use when data is messy, inconsistent, or needs prep before analysis. Triggers on "clean this data", "clean up this sheet", "normalize this data", "fix formatting", "dedupe", "standardize this column", "this data is messy".
---

# Clean Data

## India (only when the data uses Indian conventions)

Skip this section unless the sheet has Indian fiscal years (April to March), rupee amounts or lakh and crore units. For everything else, clean the data as the workflow below says. If it does apply: this skill operates on **Indian markets**. Load **`india-market-conventions`**
before building anything, and **`india-market-data`** for sources. Two rules cause
most Indian errors:

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` =
  Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
  Never annualise a quarter without stating the fiscal offset.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format
  `#,##0,," Cr"` — each trailing comma divides by 1,000, so that format displays
  **lakh under a crore label: a 100× error**. Divide by `10000000` in a live
  formula and label the column `Total Revenue (₹ Cr)`.

What has no Indian equivalent is listed in `NOT-ADAPTABLE.md`. Name the gap —
never substitute a proxy and present it as the real thing.

Clean messy data in the active sheet or a specified range.

## What you need first

- The spreadsheet file (.xlsx). A CSV also works: save the cleaned result as .xlsx.
- Optional: a range to clean and the columns that matter most. If none is given, use the whole used range of the active sheet and say so.
- Never overwrite the original. Save the cleaned copy under a new name.

## If something is missing

- No file or pasted data: ask for it. Do not make up rows.
- The tools named under Environment are not available: use what you have (for example Python with openpyxl or pandas to write a new copy, or give the user the helper-column formulas to paste). Say which route you used and what you could not do.
- The companion skills named under Environment are optional. If they are not loaded, follow the steps below as written.
- You cannot tell how a column should look (for example, is 03/08/26 3 August or 8 March): ask once. Do not guess dates.

## Environment

- Operate on the .xlsx with the `officecli` CLI when it is installed. Read with `officecli get <file> <path>` or `officecli view <file> text`; write helper-column formulas with `--prop formula="TRIM(A2)"`. The in-place vs helper-column decision still applies.
- If they are available, load **`xlsx-author`** for the build loop and **`officecli-xlsx`** for the element vocabulary. They are not required.

## Workflow

### Step 1: Scope

- If a range is given (e.g. `A1:F200`), use it
- Otherwise use the full used range of the active sheet
- Profile each column: detect its dominant type (text / number / date) and identify outliers

### Step 2: Detect issues

| Issue | What to look for |
|---|---|
| Whitespace | leading/trailing spaces, double spaces |
| Casing | inconsistent casing in categorical columns (`usa` / `USA` / `Usa`) |
| Number-as-text | numeric values stored as text; stray `$`, `,`, `%` in number cells |
| Dates | mixed formats in the same column (`3/8/26`, `2026-03-08`, `March 8 2026`) |
| Duplicates | exact-duplicate rows and near-duplicates (case/whitespace differences) |
| Blanks | empty cells in otherwise-populated columns |
| Mixed types | a column that's 98% numbers but has 3 text entries |
| Encoding | mojibake (`Ã©`, `â€™`), non-printing characters |
| Errors | `#REF!`, `#N/A`, `#VALUE!`, `#DIV/0!` |

### Step 3: Propose fixes

Show a summary table before changing anything:

| Column | Issue | Count | Proposed Fix |
|---|---|---|---|

### Step 4: Apply

- **Prefer formulas over hardcoded cleaned values** — where the cleaned output can be expressed as a formula (e.g. `=TRIM(A2)`, `=VALUE(SUBSTITUTE(B2,"$",""))`, `=UPPER(C2)`, `=DATEVALUE(D2)`), write the formula in an adjacent helper column rather than computing the result in Python and overwriting the original. This keeps the transformation transparent and auditable.
- Only overwrite in place with computed values when the user explicitly asks for it, or when no sensible formula equivalent exists (e.g. encoding/mojibake repair)
- For destructive operations (removing duplicates, filling blanks, overwriting originals), confirm with the user first
- After each category of fix (whitespace → casing → number conversion → dates → dedup), show the user a sample of what changed and get confirmation before moving to the next category
- Report a before/after summary of what changed

## What you hand back

- The cleaned copy of the spreadsheet, with its file path. Fixes are in helper columns next to the originals unless the user asked to overwrite values.
- A change summary: for each column, the issue, how many cells changed and the fix used.
- A flag list of columns that mix types, and rows you were unsure about, for the user to decide.
- A list of what you did not check or change, and any duplicates you left in because the user did not confirm removal.
