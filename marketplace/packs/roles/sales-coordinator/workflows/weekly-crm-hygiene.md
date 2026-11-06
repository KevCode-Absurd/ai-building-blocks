# Weekly CRM hygiene

**Trigger:** The pipeline report cannot be trusted, follow-ups are being missed, or a busy season, price change or CRM move is coming.

**Cadence:** A short weekly sweep; a deeper monthly sweep that adds duplicates, lost reasons and retention.

**Access:** Record the level granted for the CRM under "Access I have". Until the client answers, work from an export at level 1. [L2] needs read and draft; [L3] needs read, write and publish within limits; [YES] needs a fresh yes every time.

## Steps

1. **Agree the rules once.** Write what each stage means, the required fields at each stage, when a quiet deal counts as stale, hold and quote lengths, and how long old enquiries are kept. *Approval: the client agrees the rules.*
2. **Weekly sweep.** Run the `crm-hygiene-sweep` skill steps 3 to 5: deals with no next step, stale and expired deals, missing fields.
3. **Fix what is safe.** [L3] Fill missing fields from the thread, set next steps and dates, move deals to the stage that matches the facts, and close dead deals with a reason, within the confirmed limits. Log before and after values.
4. **Ask the owners.** [L2] Create tasks for owners on deals that need their judgement.
5. **Monthly extras.** Run steps 2, 6 and 7 of the skill: duplicates, lost reasons and retention.
6. **Propose merges and deletions.** [YES] List suspected duplicates and records due for deletion, with which to keep and why. Merge or delete only after a fresh yes.
7. **Stop it coming back.** Suggest required fields, a unique reference property, an import checklist or a weekly "no next step" view. [YES] Changes to pipeline or property settings need a fresh yes.
8. **Report.** One page: counts, fixes made, what needs a yes, one rule to add.

## Outputs

- Weekly fix list and change log
- Owner tasks for deals that need judgement
- Monthly duplicates, lost-reason and retention review
- Proposed rules to prevent repeat problems

## Needs the client's approval

The stage and stale rules, every merge and deletion (fresh yes each time), settings changes, bulk changes over the agreed size, and anything outside the confirmed limits.
