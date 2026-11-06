---
name: safe-macro-or-script
description: Writes or fixes a macro or script for one repeat spreadsheet task - Excel VBA, Office Scripts or Google Apps Script - built to be safe for non-experts - a plain-words plan first, settings at the top, a backup or test mode, a log, plain error messages, settings restored after errors, narrow permissions, quota checks, numbered install steps and a test plan on a copy. Use it for weekly spreadsheet chores, recorded macros that broke when data grew, scheduled reports, form-to-sheet routines and scripts someone left half-working.
---

# Safe macro or script

## When to use

- A weekly or monthly spreadsheet chore takes someone an hour of clicks.
- A recorded macro worked once and now skips rows or errors.
- A Google Sheet needs a scheduled summary, reminder or form-reply routine.
- A script someone else wrote is failing or too slow.

First ask: can formulas, a table, a pivot or Power Query do it without code? If yes, say so and stop.

## What you need

1. The task as it is done by hand today, step by step, how often and by whom.
2. Sheet names, column headers and five to ten made-up rows.
3. The platform: Excel version on Windows or Mac, Excel on the web, or Google Sheets on a free or Workspace account.
4. What must never happen (deleting rows, emailing customers by mistake, overwriting last month).
5. Who will run it, and who will own it if the builder leaves.
6. Access: level 1 for steps 1 and 2 and for reading old code. Adding the code to a copy with test mode on needs level 2. Installing it in the live file, creating triggers or schedules, or letting it send email needs level 3 and your yes on the action list.

## Steps

### 1. Choose the tool

- **VBA:** desktop Excel on Windows or Mac; can work with Outlook and Word on Windows. Not in Excel on the web.
- **Office Scripts:** Excel on the web, Windows and Mac, and can be scheduled through Power Automate; only touches the workbook; needs a business or education plan that includes it.
- **Apps Script:** Google Sheets, Gmail, Drive, Calendar and Forms; time and form triggers.

### 2. Write the plan in plain words

Number each step the script will do. Confirm it with the user. This plan becomes the comments in the code.

### 3. Build the skeleton safely

- Settings at the top: sheet names, column headers, folders, email recipients.
- Find data by header names and the last used row, never fixed addresses like A2:A500.
- **VBA:** `Option Explicit`; declare every variable; no Select or Activate; read the range into an array, work in memory, write back once.
- **Apps Script:** `getValues()` once, process, `setValues()` once; avoid one call per cell.
- **Office Scripts:** read with `getValues()`, write once; no external calls if it will run from Power Automate.

### 4. Add the safety parts

- **Backup or test mode:** copy the data tab to a dated backup tab before changing anything, or a `TEST_MODE` setting that writes results to a test tab and sends no email.
- **Stop if data looks wrong:** expected headers missing, zero rows, or far more rows than usual. Stop with a message; change nothing.
- **Log:** a Log tab with date, user, rows read, rows changed, emails sent and any error.
- **Plain error messages:** what went wrong and what to do ("Column 'Invoice date' not found on tab Sales. Check the header and run again.").
- **Restore settings (VBA):** turn screen updating, calculation mode and events back to what they were, in an error handler that always runs before exit.

### 5. Respect platform limits

- **Apps Script:** each run stops at 6 minutes; trigger time and email recipients have daily limits that differ between free and Workspace accounts. For long jobs, process in batches and save progress. Count emails against the limit.
- **Apps Script triggers** run as the person who created them, so emails come from that account. Name that person.
- **Office Scripts from Power Automate** have daily call and time limits; keep each run short.

### 6. Ask for the narrowest permissions

- **Apps Script:** list the scopes the script will ask for and why; set them in `appsscript.json` to the narrowest set.
- **VBA:** no "Trust access to the VBA project object model" unless truly needed; no code that changes security settings.
- **Never** put passwords or API keys in code. If a script must call another service, the key goes in Script Properties or the organisation's secret store, set by the owner.

### 7. Install it (level 3), or explain installation

At level 3, I install it within the agreed limits and log it; for Apps Script, we agree first whose account creates the trigger, because the trigger runs and sends email as that account. Otherwise, I give numbered steps for the user's platform. VBA: open the VBA editor (Alt + F11), insert a module, paste, save as .xlsm, add a button labelled with a verb ("Build weekly report"). For trust, use a Trusted Location or a signed project; never ask users to enable all macros. Apps Script: Extensions > Apps Script, paste, save, run once to grant permissions, then add the trigger, and show how to delete the trigger to switch it off.

### 8. Test on a copy (level 2)

Three runs at least: one row, no rows, a full period. Plus the "must never happen" case. Give expected results for each.

## Checks

- Every sheet, header and range name comes from the brief or is a marked setting.
- Every object and method is real for the named platform and version.
- No recorded Select or Activate left; no fixed ranges.
- Backup or test mode exists and is on by default for the first run.
- Settings are restored even after an error.
- Permissions and quotas are listed; no secrets in code.
- There is a clear way to switch it off.

## Output format

1. **Plan in plain words**, numbered.
2. **The code**, complete, commented, settings at the top.
3. **Install steps**, numbered for the platform.
4. **Permissions** it will ask for and why.
5. **Limits** that apply and what happens near them.
6. **Test plan** with expected results.
7. **How to switch it off** and who owns it.

## Example of good output (short)

*Made-up business: Fernhill Tutoring, weekly attendance summary in Google Sheets (free account).*

> **Plan.** 1. Read the Register tab. 2. Count sessions attended per student for last week. 3. Write the counts to the Weekly tab. 4. Email the summary to the owner only. 5. Log the run.
>
> ```javascript
> const SETTINGS = { register: 'Register', weekly: 'Weekly', log: 'Log', ownerEmail: 'owner@example.com', TEST_MODE: true };
>
> function weeklySummary() {
>   const ss = SpreadsheetApp.getActive();
>   const rows = ss.getSheetByName(SETTINGS.register).getDataRange().getValues(); // one read
>   const header = rows.shift();
>   const col = name => { const i = header.indexOf(name); if (i < 0) throw new Error(`Column "${name}" not found on ${SETTINGS.register}.`); return i; };
>   // ... count last week's sessions per student in memory, then one setValues() write ...
> }
> ```
>
> **Permissions.** Read and edit this spreadsheet; send email as you. **Limits.** One email per run, well inside the free account's 100 recipients a day. **Switch off.** Extensions > Apps Script > Triggers, delete "weeklySummary".
