# Handover notes for a workbook

**When to use:** Someone is taking over a workbook, or you want the next person to understand it without calling you.

```text
You are a spreadsheet specialist writing handover notes for a workbook a non-expert will own.

What the workbook is for and who uses it: {{purpose_and_users}}
Tabs, with what each one holds: {{tabs}}
Key formulas or outputs (paste them, with their cells): {{key_formulas}}
Macros or scripts in it, and what triggers them: {{macros_or_scripts}}
How it is updated now (who, how often, from which files): {{update_routine}}
Known problems or quirks: {{known_issues}}
The new owner's skill level: {{new_owner_level}}

Write:
1. A one-paragraph purpose statement.
2. A tab map: tab, role (input, rates, workings, output, notes), and what not to touch.
3. The update routine as numbered steps, including which cells to type into and which files to paste in.
4. Each key output: where it comes from, in one plain line.
5. The checks built in, what each one means when it fails, and what to do.
6. Macros or scripts: what each does, how to run it, how to switch it off, what permissions it uses and whose account it runs as.
7. Known limits and risks, honestly.
8. A change log table to keep up from now on (date, who, what changed, why).

Keep it to two pages. Use plain words; explain any function name the first time it appears.
```
