# CRM set-up or rebuild

**Trigger:** A team moves from spreadsheets into a CRM, switches CRM, or rebuilds a CRM nobody trusts. Typically three to six weeks for a team of 2 to 30.

**Access:** Set at the start, per tool (see `access.md`). Until you choose, I work at level 1.

## Steps

1. **Discovery (week 1).** Interview the owner, a seller, marketing and whoever does billing. Walk one won and one lost deal from first contact to invoice. Collect the current spreadsheet or CRM export and the billing export.
2. **Design the pipeline and lifecycle (week 1 to 2).** Use the `pipeline-stage-design` skill: stages with entry and exit rules, lifecycle and lead status, handoff agreements, and the closed-won fields billing needs. *Approval: the owner signs off the stage guide before anything is built.*
3. **Fields and views (week 2).** List only the fields the team will fill in, with type, picklist values and the stage at which each becomes required. Design three views: a seller's "today" list, a manager's stuck-deals list, and the owner's forecast. Build them at level 2, hidden from the team.
4. **Clean and map the old data (week 2 to 3).** Run the `crm-data-audit` skill on the old data. Map each old column to a new field and each old stage to a new one. Produce the import file and the list of rows that will fail or need an owner's decision. *Approval: the owner approves the change list and duplicate groups.*
5. **Billing link (week 3).** Decide which IDs connect the CRM and billing, what syncs back (subscription status, MRR, cancellation reason) and how often. Use the `billing-crm-reconciliation` skill to test on last month's data.
6. **Automations (week 3 to 4).** Spec each automation with the `automation-workflow-spec` prompt. Keep the first set small: lead routing, stale-deal reminders, closed-won handoff. Build at level 2, switched off, and run the test plan.
7. **Go-live (week 4).** At level 3, after one confirmation: import the approved file, publish stages and views, switch on tested automations, and watch the first week's runs. Log every step.
8. **Team guide and review (week 4 to 6).** One-page guide on what to update, when and why it helps the seller. Book a review after one quarter to check stage probabilities, time in stage and field fill rates.

## Outputs

- Signed-off stage guide, lifecycle definitions and handoff agreements
- Field list and view build sheets
- Cleaned import file, mapping table and exceptions list
- CRM-to-billing data flow and test reconciliation
- Automation specs with test results
- Team guide and quarter-one review checklist
- Action log of everything built, imported and switched on

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation:** importing the approved file, publishing the approved stages, fields and views, and switching on automations that passed their tests.

**Always needs a new yes:** merging or deleting records, overwriting existing data in bulk, connecting a new tool or account, sending any message to contacts, and any change to billing records beyond the agreed link fields. Contact lists without a known source and consent are not imported.
