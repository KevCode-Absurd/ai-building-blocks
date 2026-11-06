# Quarterly compliance review

**Cadence:** Every three months, plus a light monthly check of deadlines. About half a day of the owner's time per quarter for a business under 50 people.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the work to enter or send yourself. Until you choose, I work at level 1.

## Steps

1. **Rules watch (week 1).** Check the "What changes fast" table in `knowledge.md` against the official pages for the business's locations: AI Act dates, UK data law commencement, CCPA regulations, SOC 2 criteria, PCI DSS FAQs, Companies House and FinCEN changes. For anything new, run the `regulation-to-checklist` skill on the official text. *Approval: the owner decides on actions; legal questions go to a lawyer.*
2. **Calendar (week 1).** Refresh the governance and compliance calendar with the `governance-calendar` prompt. At level 3, add the confirmed dates and reminders to the shared calendar.
3. **Privacy records (week 2).** Using the `privacy-register-builder` skill: add new tools and vendors from the finance ledger, check retention periods, review the rights request and breach logs for overdue items. At level 3, update the registers within your limits.
4. **Vendors and contracts (week 2).** Run the `vendor-data-terms-check` prompt on any new vendor; update the contract tracker with renewal and notice dates using the `contract-plain-summary` skill. At level 3, set the reminders.
5. **AI uses (week 2).** Update the register with the `ai-use-register` prompt; check that customer-facing AI carries the agreed notice and that AI literacy guidance reached new staff.
6. **Policies and evidence (week 3).** Run the `policy-gap-check` prompt against any changed rule or framework. Refresh evidence for controls due this quarter with the `audit-evidence-pack` skill. At level 3, send evidence requests and reminders to the named owners and upload what comes back. *Approval: policy owners approve redrafts before they are published.*
7. **Board report (week 4).** One page for the board or owner: rules changed, deadlines met and missed, open gaps with owners, questions for a qualified lawyer or auditor. Minutes of the meeting come from the `board-minutes-from-notes` prompt. At level 3, circulate approved papers to the board list.

## Outputs

- Rules-watch note with official links and checklists for new rules
- Updated governance and compliance calendar
- Updated privacy records, request and breach logs
- Contract tracker with notice dates and reminders
- AI use register
- Policy redrafts for approval and the evidence index
- One-page board report and draft minutes
- Action log (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action of the quarter, I show the list (update registers and trackers, add calendar entries, send evidence requests and reminders to named owners, upload evidence, publish approved policy versions, circulate approved board papers) with its limits. After your yes, I do these and log each one.

**Always needs a new yes.** Filings with Companies House or any regulator, breach notifications, replies to rights requests, deleting data under a retention schedule, contracts sent as binding, final minutes (the chair approves), and anything signed or stated for the company to an auditor, acquirer or customer. Ask a qualified lawyer or auditor before relying on any conclusion.
