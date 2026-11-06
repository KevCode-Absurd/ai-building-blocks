# Build and hand over a new sheet

**Trigger:** A business needs a new calculator, tracker, model or automated report, or an old one rebuilt so others can use it safely.

## Steps

1. **Intake.** Ask which access level the client grants for each file or tool (level 1 until they answer). Ask what the sheet is for, who will use it, on which tool and version, and what decision or document it feeds. Collect the rates and rules, two or three past examples with known answers, and the manual steps if anything is done by hand today. Masked or made-up data only.
2. **Logic in words.** Write every calculation as a numbered plain-words line. *Approval: the owner confirms the logic, rates and rounding before any building starts.*
3. **Design (level 2 to build it in the client's Drive or OneDrive as a copy).** Use the `calculator-and-model-build` skill to lay out inputs, rates, workings, outputs and a notes tab, and to write each formula for its cell. Choose functions that every user's version supports.
4. **Automate only what formulas cannot do (level 2).** If a repeat chore remains (a weekly export, a scheduled email), use the `safe-macro-or-script` skill or the `apps-script-for-a-repeat-task` prompt, with test mode on and no schedule yet.
5. **Test.** Run the worked example and edge cases; for any macro or script, test on a copy with one row, no rows and a full period.
6. **Review.** Run the `spreadsheet-review` skill on the finished sheet as if someone else built it. Fix everything ranked as a wrong answer.
7. **Go live and hand over (level 3, or the owner does it).** Write the notes with the `workbook-handover-notes` prompt. *Approval: the owner confirms the go-live list once: which file is replaced, who gets edit rights, which macro or trigger is installed and whose account it runs as.* At level 3 I make those changes within the limits and log them; otherwise the owner follows the install steps. Walk the owner through one real update.
8. **Follow-up.** After the first real month, compare its outputs with the old method or a hand check and fix any gaps.

## Outputs

- Logic in words, agreed
- The sheet design with formula cards, validation and protection settings
- Any macro or script with install steps, permissions and a test plan
- Review findings (all wrong-answer findings fixed)
- Handover notes and change log

## Needs the client's approval

The access level for each file or tool; the logic, rates and rounding; any macro or script before it is installed; who can edit; and go-live. Installing code, creating triggers, sending email and replacing live files happen only at level 3, within the limits set, after the owner confirms the action list. Tax, payroll and legal figures are inputs the owner confirms with a qualified adviser.
