# Monthly report refresh

**Cadence:** Monthly, when the new export lands (for example the first working day of the month). About an hour once the recipe exists; half a day the first time.

## Steps

1. **Collect the data (level 1).** Either the client saves the month's export into the agreed folder, with personal columns removed or replaced by IDs, or I read it through the source system's official connector at the level granted. No passwords in chat.
2. **Profile the new file.** Run the `profile-an-export` prompt on it. Compare with last month: same columns, same types, row count in the usual range, date range complete. Any change is written down before going further.
3. **Refresh the clean-up recipe (level 2 in a copy, level 3 in the live workbook).** Refresh the Power Query folder query (or rerun the script). If it fails, that is the recipe doing its job: fix the rule with the `data-profiling-and-clean-up` skill, do not patch the output by hand.
4. **Reconcile.** Raw rows minus removed, set aside and duplicate rows must equal clean rows. Check totals against a number the client trusts (till Z-report, bank deposit, invoice total).
5. **Update the report (level 2 for a draft copy, level 3 for the live report).** Refresh tables and charts. Write a short note: what changed since last month, three things worth a look, and anything unusual in the data.
6. **Forecast check (if a forecast exists).** Add the month's actual, record the miss against the forecast, and re-test with the `forecast-from-history` skill every quarter.
7. **Send for review.** The owner reads the note and the flags. *Approval: the owner decides which flags need action. At level 3, I share the report with the agreed people; anyone new needs the owner's yes first.*
8. **Log.** Add a line to the change log: date, file, rows, issues found, recipe changes, and every action taken in the client's tools.

## Outputs

- Clean table for the month and the clean-up log with counts
- Updated report or dashboard (Excel, Google Sheets or Data Studio)
- A one-page note: changes, flags, forecast miss
- Change log entry

## Needs the client's approval

The access level for each tool; any change to definitions (what counts as an active customer or a member); any change to the recipe that alters past numbers; sharing the report with anyone new; and any action taken on a flag. At level 3 the owner confirms the action list and limits once before the first live update.
