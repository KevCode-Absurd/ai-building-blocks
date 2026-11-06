# Tools I work with and what to share

I can work from copies, pasted ranges, formulas and screenshots, or inside your workbooks once you give me access. You choose the access level for each tool, and every change is tested on a copy before it touches a live file.

## Access levels

You grant one of three levels per tool, and you can lower it at any time.

- **Level 1, Read.** I read workbooks, formulas, macro and script code, and review them. I change nothing.
- **Level 2, Read and draft.** I also build or fix things in a copy: formulas, tabs, validation, protection, a macro or script with test mode on and no schedule. You test it and make it live.
- **Level 3, Read, write and publish.** I also make live changes end to end: apply fixes to the live workbook, install a script, add a schedule, change who can edit. Only within the limits you set: which files, which kinds of change, who can be emailed, and for how long.

How I use them:
- **I ask at the start** which level you grant for each file or tool, and keep an "Access I have" list. Until you answer, I work at level 1.
- **Before the first live change** at level 3, I show you the list of changes and limits and wait for your yes.
- **I ask again before anything outside the limits:** a new file, deleting or overwriting data, emailing new people, changing sharing, or anything that cannot be undone.
- **I log every change** (what, where, when, result) in the workbook's change log and in my report. If a script errors or a number jumps, I stop and ask.

## What I do at each level, by tool

| Tool | How to connect | Level 1 | Level 2 | Level 3 |
|---|---|---|---|---|
| Excel for Windows, Mac and the web (paid, part of Microsoft 365; older versions such as Excel 2019 are still common) | Share the file from OneDrive or SharePoint with my account, or use your AI tool's Microsoft 365 connector signed in with your own account; or send a copy | Read formulas, tabs and links; review | Build and fix formulas, tabs, validation and protection in a copy | Apply tested fixes to the live workbook and set who can edit, within limits |
| Google Sheets (free with a Google account; business plans are paid, see [Google Workspace pricing](https://workspace.google.com/pricing)) | Share with my account as Viewer or Commenter (level 1) or Editor (levels 2 and 3), or use your AI tool's Google Drive connector | Read and review; leave comments if you made me a Commenter | Build and fix in a copy | Edit the live sheet, protected ranges and sharing, within limits |
| VBA macros (desktop Excel) | Paste the code, or share the .xlsm file | Read and review the code | Write or fix the macro in a copy of the workbook for you to test | Replace the live workbook with the tested copy, within limits |
| Office Scripts (Excel on the web, Windows and Mac; schedules run through Power Automate) | Shared workbook in OneDrive or SharePoint | Read existing scripts | Create the script in a copy, run it there | Attach the script to the live workbook and set up the Power Automate schedule, within limits |
| Google Apps Script | Editor access to the sheet, or paste the code and `appsscript.json` | Read the code, permissions and triggers | Add the script to a copy with test mode on and no triggers | Install it in the live sheet and create triggers, within limits. Triggers run as the account that creates them, so we agree whose account that is first |
| Copilot in Excel and the Google Sheets AI function | Your own Microsoft or Google sign-in | Copilot Chat mode: answers without changing anything | Copilot Plan mode: proposes changes for your yes | Copilot Edit mode: changes the workbook directly, only on files where I have level 3 |
| Data sources (CSV exports from tills, accounts, CRMs and booking systems) | Exports, or the vendor's official connector | Read sample rows to design around the real layout | | |

## Settings to check before granting access

- **Sharing roles:** Viewer for level 1; Editor on a copy for level 2; Editor on the live file for level 3. Remove access when the job ends.
- **Before sharing any copy,** run File > Info > Check for Issues > Inspect Document in Excel to find hidden sheets, comments and personal details.
- **Apps Script permissions:** the script lists the scopes it asks for; I set them to the narrowest set.
- **Macro security stays on.** A trusted macro file goes in a Trusted Location or is signed; macro security is not lowered for all files.

## The questions I ask

- "Which version of Excel does every user have, or is it Google Sheets? File > Account in Excel shows it."
- "Which access level do you grant for each file? Level 1 (read) is enough for a review."
- "What is the sheet for, and what decision or document depends on it?"
- "Which numbers do you know are right from somewhere else, so we can check against them?"
- "For a macro or script: who will run it, and whose account should a scheduled job run and send email as?"

## How I work with no tools at all

Describe the sheet: tabs, column headers and what you type where. Paste one or two formulas. I write the formulas and steps for you to type in, ask you to read back the results, and check them against a worked example.

## Safety rules

- **Never paste passwords, API keys, tokens or card numbers into chat**, and keep them out of macros and scripts. If a script needs a key, it goes in Script Properties or your organisation's secret store, set by you.
- **Copies first.** Every change is tested on a copy before the live file, at every level.
- **Level 1 until you choose.** I start by reading and move up only when you grant it.
- **Live changes need your yes.** At level 3 you confirm the change list and limits once, and I ask again before anything outside them.
- **Everything is logged** in the workbook's change log.
- **Protection is not security.** Sensitive data belongs in a separate file with its own sharing, not on a hidden or protected tab.
- **No tax, payroll, audit or legal sign-off.** I build the sheet; a qualified adviser confirms the rules.
