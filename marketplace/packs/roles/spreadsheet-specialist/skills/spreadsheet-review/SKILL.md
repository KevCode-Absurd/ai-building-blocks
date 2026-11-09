---
name: spreadsheet-review
description: Reviews an Excel or Google Sheets workbook before it is shared or relied on - maps inputs, workings and outputs, then hunts for wrong ranges, hard-coded numbers, mixed units, double counting, broken links, circular references, version-specific functions, fragile macros and data that should not be there - and returns a findings table ranked by risk with the fixed formula for each. Use it before a budget, quote tool, forecast or report goes to a customer, bank, board or new owner.
---

# Spreadsheet review

## When to use

- A workbook is about to be sent to a customer, lender, board, funder or auditor.
- Totals "look wrong" or two reports disagree.
- Someone is taking over a workbook they did not build.
- A sheet has grown for years and nobody trusts it.
- A macro workbook is about to be shared with other people.

## What you need

1. A copy of the workbook with made-up or masked data, or pasted ranges, formulas (show formulas with Ctrl + `) and screenshots of each tab.
2. What the workbook is for, who uses it and what decision depends on it.
3. The Excel or Sheets version every user has.
4. Any totals you know are right from another source (bank, till, accounts) to reconcile against.
5. Known problems or worries.
6. Access: level 1 (read) covers the whole review. Applying the fixes needs level 2 (in a copy) or level 3 (in the live workbook, within your limits).

## Steps

### 1. Map the workbook

List every tab with its role: input, lookup or rates, workings, output, notes, or unknown. Draw the flow in one line per output: "Quote total (Output!F20) comes from Workings!D5:D40, which uses Rates!B2:B30 and Inputs!C4:C12." Unknown tabs and links to other files are findings in themselves.

### 2. Check the inputs

- Are input cells marked (colour, label, unit)?
- Do they have validation: drop-downs for choices, limits on numbers and dates?
- Are rates and assumptions in one place, labelled, with a source and date?

### 3. Check every distinct formula

Work through each column or block, not each cell; a block of copied formulas is one formula until one cell differs. Look for:
- **Ranges that stop short** or skip rows; totals that miss rows added later.
- **Hard-coded numbers** inside formulas (`*1.2`, `+150`) and pasted values where a formula should be.
- **Inconsistent formulas** in a block: one row different from its neighbours.
- **Wrong references:** absolute versus relative mistakes that shift when copied.
- **Mixed units:** thousands and units, percent as 20 and as 0.2, net and gross mixed.
- **Double counting:** subtotal rows inside a grand total.
- **Lookups:** approximate match where exact was meant; missing "not found" handling; lookups on unsorted data with binary search.
- **Error hiding:** IFERROR wrapped around everything, turning real errors into zero.
- **Circular references** and iteration turned on.
- **Volatile functions** (OFFSET, INDIRECT, NOW) slowing the workbook.
- **Version risk:** XLOOKUP, LET, LAMBDA or dynamic arrays used where some users have Excel 2019 or older.
- **Rounding:** money rounded only on display, so totals differ from the sum of shown values.

### 4. Check links, names and hidden things

External links to other files, named ranges that point to #REF!, hidden rows, columns and sheets, data far below the visible area, comments with personal details. In Excel, File > Info > Check for Issues > Inspect Document lists hidden content; run it on a copy.

### 5. Check macros and scripts (if any)

Fixed ranges from recording, Select and Activate, no Option Explicit, no backup step, settings such as screen updating or calculation left off after an error, On Error Resume Next hiding failures, file paths tied to one person's computer. For Apps Script: scopes wider than needed, triggers owned by someone who has left, loops calling the sheet once per cell.

### 6. Add reasonableness checks

Propose checks that would have caught each finding: totals that must equal a source total, percentages that must add to 100, no negative stock, row counts that match the data tab.

### 7. Rank and fix (fixes in your file need level 2 or 3)

Rank findings: wrong answers first, then answers that will go wrong when data grows, then clarity. For each, write the fixed formula for that exact cell.

## Checks

- Every finding names a cell, range or tab.
- Every fix is written out in full for the right tool and version.
- Nothing was "fixed" by changing a number to make totals match.
- Findings with money at stake are at the top.
- Reasonableness checks are proposed for the top risks.
- No real personal data is copied into the report.

## Output format

1. **Summary:** three lines on overall risk and the top fix.
2. **Workbook map:** tabs and the flow to each output.
3. **Findings table:** rank, location, problem, why it matters, fix (formula in full), effort.
4. **Checks to add:** cell, formula, what it catches.
5. **Housekeeping:** names, links, hidden content, notes tab.

## Example of good output (short)

*Illustrative structure, not a real business: a print company's quote workbook used by three sales staff. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary.** Two findings change quote prices today; one will break next month. Fix finding 1 first.
>
> | # | Location | Problem | Why it matters | Fix |
> |---|---|---|---|---|
> | 1 | Workings!E5:E40 | `=D5*1.2` adds VAT by a typed 1.2 | Quotes for zero-rated items are overcharged | `=D5*(1+XLOOKUP(C5,Rates[Item],Rates[VAT rate]))`, so an item with no rate shows #N/A instead of a wrong price |
> | 2 | Output!F20 | `=SUM(Workings!E5:E30)` stops at row 30; data runs to row 40 | Quotes with more than 26 lines miss items | `=SUM(Lines[Total])` after converting the block to a table |
> | 3 | Rates!B2:B30 | Paper prices last updated in March, no date shown | Quotes use old prices without anyone knowing | Add a "Prices checked on" cell and show it on the output |
>
> **Check to add.** Output!F22: `=IF(ROUND(F20,2)=ROUND(SUM(Lines[Total]),2),"OK","Total does not match lines")`.
