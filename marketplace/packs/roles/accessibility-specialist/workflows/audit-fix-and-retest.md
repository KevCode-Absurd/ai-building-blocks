# Audit, fix, retest and publish the statement

**Trigger:** a launch or redesign, a tender that names WCAG or EN 301 549, a customer complaint, or the yearly full check. Typical length: one to three weeks for a small site, depending on how fast fixes ship.

**Access:** At the start, ask which level the client grants for each tool (code host, website platform, design files, document library, ticket tool, browser tool) and write it down as "Access I have". Until they answer, work at level 1. Log every action: what, where, when, result.

## Steps

1. **Scope (day 1).** Agree pages, key tasks, standard and level, browsers and assistive technologies, and who can run screen reader checks. Use the questions in `access.md`. *Level 1.*
2. **Audit (days 1 to 3).** Run the `accessibility-audit` skill: sample, automated checks, manual checks, findings with severity. *Level 1, with a connected browser tool if granted.*
3. **Tickets (day 3).** Turn findings into tickets with the `audit-findings-to-dev-tickets` prompt. *Level 2: draft tickets in the ticket tool. Level 3 within limits: create them in the named project.*
4. **Fix components (days 3 onward).** Fix blockers first with the `component-keyboard-and-screen-reader-fixes` skill; page-level fixes follow the frontend-developer kit's `accessibility-fix-pass`. *Level 2: branch and pull request. Level 3 within limits: merge after review and checks pass. Approval: the client confirms the action list before the first merge.*
5. **Content fixes (in parallel).** Alt text and media with the `alt-text-and-media-descriptions` skill; documents and letters with the `accessible-documents-and-easy-read` skill. *Level 2: drafts in the platform or a copy of the file. Level 3 within limits: publish on the named pages, keeping old versions.*
6. **Retest (after fixes ship).** Re-run the automated checks and the manual checks for every fixed finding; mark each "fixed", "partly fixed" or "still failing". Ask the client's tester to run the screen reader steps. *Level 1.*
7. **Statement (end).** Draft or update the statement with the `accessibility-statement-draft` prompt. *Level 2: draft page. Approval: the client signs off the wording. Publishing the statement needs a fresh yes even at level 3, because it is a public claim.*
8. **Hand over.** Report: what was fixed, what remains with dates, third-party items, and the date of the next check (see `quarterly-accessibility-check.md`).

If a complaint or demand letter started this, keep the evidence log from the `accessibility-complaint-triage` prompt, and send any reply to a legal claim through the client's lawyer, with a fresh yes.

## Outputs

- Dated audit report with scope, method and findings
- Ticket set and fix order
- Pull requests or published content changes, with the action log
- Retest results per finding
- Draft or updated accessibility statement
- Hand-over note with remaining issues and the next check date

## Needs the client's approval

The scope and standard; the action list before the first live change at level 3; any merge or publish outside the named repos, pages or folders; brand colour changes; replacing files without a backup; the statement wording and its publication; any reply to a complaint or legal claim.
