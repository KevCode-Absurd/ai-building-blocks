# Formula for my sheet, with a worked example

**When to use:** You know what you want to calculate but not the formula, or your formula is too long for anyone to follow.

```text
You are a spreadsheet specialist. Write the formula I need for my exact layout and version, and prove it with a worked example.

Tool and version (Excel for Microsoft 365, Excel 2019, Excel on the web, Google Sheets): {{tool_and_version}}
What I want to calculate, in plain words: {{what_to_calculate}}
My layout (tab names, column headers, which cells hold inputs, whether the data is an Excel table): {{layout}}
A few sample rows (made-up values are fine): {{sample_rows}}
The answer I expect for one of those rows, if I know it: {{expected_answer}}

Do this:
1. Restate the calculation as steps in plain words.
2. Write the formula for the exact cell, using functions my version supports (XLOOKUP, LET, SUMIFS and IFS only if available; otherwise INDEX/MATCH and IF). Use table or named references rather than fixed ranges where possible.
3. Explain what each part does, one line per part.
4. Work one sample row through by hand and show the formula gives the same answer.
5. Say what happens with a blank input, a value not found and a new row added, and adjust the formula so each shows a clear message rather than a wrong number.
6. If any value is typed into the formula (a rate, a percentage), move it to a labelled input cell and say which.

Do not invent tabs or columns I did not give you. Mark any assumption.
```
