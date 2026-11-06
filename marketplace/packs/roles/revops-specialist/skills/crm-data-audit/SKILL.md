---
name: crm-data-audit
description: Audits a CRM or contact export for duplicates, blank key fields, stale deals, broken stages and messy picklists, counts each problem, and writes a change list (record, field, old value, new value, source, status) that a person can review and undo. Use it before a migration, a new report or a marketing push, or when the team stops trusting CRM data. Never guesses missing values; merging and deleting always need a fresh yes.
---

# CRM data audit

## When to use

- Managers do not trust pipeline or contact reports.
- The business is about to migrate CRMs, import a list, launch lead scoring or build a forecast.
- Integrations (forms, billing, enrichment tools) have been creating records for years with nobody checking.
- A deletion or access request under privacy law has shown nobody knows where a person's data sits.

## What you need

1. An export of contacts, companies and deals with record IDs, created date, created source, owner, last activity date and the key fields.
2. The field list with types and picklist values.
3. Which fields matter most for routing, reporting and billing.
4. Any written stage definitions.
5. The client's rules on what may be changed without asking (the limits for level 3).

**Access:** level 1 to read the export or the CRM; level 2 to build the change list, a cleaned import file or a review view in the CRM; level 3 to apply the approved, low-risk changes in logged batches, within your limits. Merging records, deleting records and bulk overwrites always need a fresh yes, even at level 3, because they cannot be cleanly undone.

## Steps

### 1. Read before you count

List every column and what it seems to mean. Ask about any field whose meaning is unclear. Note which source created each record (form, import, API, integration, manual), because duplicate patterns usually follow a source.

### 2. Count each problem type

Count before fixing. A typical set:
- **Likely duplicate contacts:** same email; same name and company; same phone.
- **Likely duplicate companies:** same primary domain; same name with different spellings; records created by an integration. In HubSpot, API-created companies are not matched by domain automatically.
- **Blank key fields:** owner, lifecycle stage, industry, country, amount, close date.
- **Stale deals:** close date in the past but still open; no activity in a period the client chooses; no next step.
- **Stage problems:** deals in a stage without the fields its entry rule needs; stages with no exit rule.
- **Picklist mess:** free-text values in fields that should be picklists; near-duplicate values ("UK", "U.K.", "United Kingdom").
- **Privacy and consent gaps:** contacts with no recorded source or consent where the client's markets need it; records that should have been deleted after a request.

Report counts as a table with the share of records affected.

### 3. Write the change list

One row per proposed change:

| Record ID | Field | Old value | New value | Source of new value | Status |
|---|---|---|---|---|---|

Status is one of:
- **Safe:** formatting only, or the new value is in another field of the same record (for example, normalising "U.K." to "United Kingdom").
- **Needs a check:** a likely duplicate, an owner change, or a value inferred from another system.
- **Needs your decision:** anything involving a merge, a deletion, a stage change on a live deal or a value nobody can source.

Never guess a missing value. If there is no source, the row stays blank and goes on the "needs your decision" list.

### 4. Group duplicates, don't merge them

Group likely duplicates with the reason for the match and which record should survive (usually the one with the most activity or the billing link). A person checks each group. Export the affected records before any merge.

### 5. Prevent the mess from coming back

For each top problem write one prevention rule: a required field at a stage, a picklist instead of free text, a form field mapping fix, an integration setting, or an owner for a weekly check.

### 6. Apply, at the right level

- Level 2: build a review view or import file with the change list.
- Level 3: apply "safe" rows in batches of an agreed size, check a sample after each batch, and log every batch (what, where, when, result). Stop at the first unexpected result, such as a sync recreating a record or a workflow firing on the update.
- Merges and deletions: only after a fresh yes for that specific list.

## Checks

- Every count is reproducible from the export and the date it was pulled.
- No value in the change list lacks a source.
- No merge or deletion was done without a fresh yes for that list.
- Workflows that trigger on the fields being changed were checked and paused if needed, with the client's agreement.
- Personal data in the audit output is limited to record IDs where possible.
- Deletion or access requests found during the audit are flagged to the client with the one-month GDPR deadline where it applies; check this with local rules for other markets.

## Output format

1. Summary: the three problems that hurt reporting most, in plain words.
2. Problem counts table.
3. Change list (CSV or table) with status.
4. Duplicate groups for review.
5. Prevention rules, each with an owner.
6. Access I have, actions taken and the action log.
7. What the data cannot tell us.

## Example of good output (short)

*Made-up business: Fennick Labs, a 20-person software company on HubSpot.*

**Summary.** One in five companies looks duplicated, mostly created by the billing sync. Thirty-eight open deals have a close date in the past. Country is free text with 14 spellings.

| Problem | Count | Share |
|---|---|---|
| Company records sharing a domain | 412 | 21% |
| Open deals with past close date | 38 | 17% of open deals |
| Contacts with no owner | 1,104 | 9% |

| Record ID | Field | Old value | New value | Source | Status |
|---|---|---|---|---|---|
| 88213 | Country | U.K. | United Kingdom | Same field, normalised | Safe |
| 90477 | Owner | (blank) | (blank) | No source | Needs your decision |

**Prevention.** Turn off company creation in the billing sync and match on domain instead (owner: ops lead, by [NEEDED date]).
