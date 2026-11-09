# Safe theme change

**Trigger:** the owner asks for a change to how the store looks or works: a new section, a snippet, a metafield on the product page, a layout fix.

**Time:** usually one to five working days, most of it waiting for files, previews and approval.

**Access:** steps are marked L1, L2 or L3 as set out in access.md. Until more is granted, everything runs at L1.

## Steps

1. **Intake (playbook intake questions), L1.** Confirm the change in the owner's words, the page, phone and desktop screenshots, the theme name and version, where the theme came from, and who previews and publishes. Ask which level the owner grants for the store and the limits (which store, which kinds of change, until when), and write it down as "Access I have".
2. **No-code check (tool: theme editor screenshots), L1.** Look for a theme setting, an existing section or block, a dynamic source or a built-in Shopify feature that does the job. If one does, send the click path and stop.
3. **Connect (tool: Shopify admin, collaborator account).** At L1, the owner duplicates the live theme and shares the copy's files. At L2 or L3, the owner approves a collaborator request with only the permissions the level needs. See access.md. Never a password.
4. **Write the change request (prompt: change-request-writer), L1.** What, why, files, risk, tests, undo, who publishes, and the level each step needs.
   **Approval point 1:** the owner approves the change request before any code is written.
5. **Build (skill: theme-section-builder, or skill: metafield-display), L2.** Code on an unpublished duplicate theme, with settings for anything the owner will edit. Keep a copy of every original file and log every action. At L1, hand over the code and install steps instead.
6. **Review (prompt: theme-code-review), L1.** Check the finished files for Liquid errors, speed costs, accessibility and edge cases. Run Theme Check if Shopify CLI is in use. Stop and report on any error or warning.
7. **Owner preview, L2.** Send the preview link of the duplicate theme with the test table. The owner tests on their own phone.
   **Approval point 2:** the owner approves the previewed result.
8. **Go live, L3 or the owner.** At L3: keep a backup copy of the live theme, show the action list and limits, get one yes, then publish the duplicate or schedule it with Rollouts, and check the live pages straight after. Publishing over the live theme without a backup, or anything outside the limits, needs a fresh yes. Otherwise the owner publishes. If the store edits content daily, agree a time to copy any content changes made on the live theme since the duplicate was taken.
9. **Check back (tool: Web performance dashboard), L1.** A week or two later, compare field LCP, INP and CLS for the affected page types with the baseline, allowing for the dashboard's delay.
10. **Hand over, L1.** Files changed, settings added, undo steps, the action log, and what may need re-applying after the next theme update.

## Outputs

- "Access I have" record.
- Change request with the owner's approval.
- Code files with install steps.
- Review notes and test table.
- Action log (what, where, when, result).
- Handover note with undo steps and theme update notes.

## Needs the client's approval

- The access level and limits for each tool, at the start, and any change to them.
- The change request (point 1) and the previewed result (point 2).
- At L3, one yes to the action list before the first live action, and a fresh yes for anything outside the limits.
- Any collaborator access: the owner approves it, chooses the role and can lower or remove it at any time.
