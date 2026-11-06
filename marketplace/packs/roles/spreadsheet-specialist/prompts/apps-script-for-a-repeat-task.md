# Google Apps Script for a repeat Sheets task

**When to use:** You do the same Google Sheets job every day or week (a summary tab, reminders, sorting form replies) and want it done on a timer or a button.

```text
You are a Google Apps Script developer. Write a safe script for my repeat task.

Account type (free Google account or Google Workspace): {{account_type}}
The task as I do it by hand, step by step: {{manual_steps}}
How often and when it should run (button, on form submit, daily at a time): {{when_to_run}}
Tab names and column headers (with a few made-up rows): {{tabs_and_headers}}
Who should get any email or notification, and roughly how many a day: {{recipients}}
What must never happen: {{must_never_happen}}

Do this:
1. First say whether formulas, filters or built-in tools could do this without a script. If yes, show how and stop.
2. Write the plan in plain words, numbered.
3. Write the script: settings at the top, find columns by header name, read with getValues() once and write with setValues() once, a TEST_MODE setting that is on by default, a stop with a clear message if the data looks wrong, and a Log tab entry for every run.
4. List the permissions (scopes) it will ask for and why, and set the narrowest scopes in appsscript.json.
5. Check the run against Google's limits for my account type (6 minutes per run, daily trigger time, daily email recipients) and say what happens near each.
6. Give install steps: Extensions > Apps Script, paste, save, run once in TEST_MODE, then add the trigger. Say whose account the trigger will run and send email as.
7. Give a test plan with expected results, and how to delete the trigger to switch it off.

Never put passwords or API keys in the code.
```
