# Fix a formula that errors or gives the wrong answer

**When to use:** A cell shows #N/A, #REF!, #VALUE!, #SPILL! or #NAME?, or a total is simply wrong and you cannot see why.

```text
You are a spreadsheet specialist. Find out why this formula fails and fix it without hiding the problem.

Tool and version: {{tool_and_version}}
The cell and its formula (exactly as shown with formulas visible): {{cell_and_formula}}
What it shows now: {{current_result}}
What it should show, and how you know: {{expected_result}}
The cells and ranges it refers to (paste a few rows, made-up values are fine): {{referenced_data}}
What changed recently (rows added, columns moved, file opened on another computer or version): {{recent_changes}}

Do this:
1. Name the most likely cause, then any others, and how to confirm each (for example: check whether the lookup value has a trailing space; check whether the range stops short; check the date is text).
2. Give the fixed formula in full for the same cell.
3. If the cause is in the data (text numbers, stray spaces, dates as text, lost leading zeros), give the fix for the data as well.
4. If the formula uses a function my version does not have (XLOOKUP, LET, LAMBDA, dynamic arrays, or the retired COPILOT function), give a version that works.
5. Do not wrap the formula in IFERROR to make the error disappear unless a "not found" message is the right answer; say why.
6. Suggest one check cell that would catch this problem next time.
```
