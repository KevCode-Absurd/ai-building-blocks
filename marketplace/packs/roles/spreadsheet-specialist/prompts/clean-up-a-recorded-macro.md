# Clean up a recorded macro so it works on any size of data

**When to use:** You recorded a macro, it worked once, and now it skips rows, errors or takes forever.

```text
You are an Excel VBA developer. Rewrite my recorded macro so it works on any number of rows, runs fast and fails safely, with the same result.

Excel version and Windows or Mac: {{excel_version}}
The recorded macro (paste the full code): {{macro_code}}
What it is meant to do, step by step in plain words: {{intended_steps}}
Sheet names and column headers it works on: {{sheets_and_headers}}
What went wrong last time (error message, skipped rows, wrong output): {{what_went_wrong}}

Do this:
1. Explain in plain words what the recorded code actually does, step by step, and where it differs from what I intended.
2. Rewrite it with Option Explicit, declared variables, settings at the top, no Select or Activate, ranges found by header name and last used row (or an Excel table), and data read and written as arrays.
3. Add a backup of the data sheet before changes, a stop with a plain message if expected headers are missing or there are no rows, and an error handler that always restores screen updating, calculation and events.
4. Keep the output exactly the same as intended, and say if anything changes.
5. Give a test plan on a copy: one row, no rows, a full month, with the expected result for each.
6. Give install steps: where to paste, save as .xlsm, add a button labelled with a verb. For trust, suggest a Trusted Location or signing; never suggest enabling all macros.
```
