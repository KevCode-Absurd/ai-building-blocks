# Monthly returns, claims and policy review

**Cadence:** Monthly, in the first week of the month, about one to two hours.

**Trigger:** Month end, or a jump in returns, claims, chargebacks or complaints.

**Access:** Level 1 (read) on the store, help desk and payment provider is enough for the review. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the confirmed limits.

## Steps

1. **Pull the logs.** Read last month's return log, warranty claims log, refunds, disputes and ticket tags, or use the owner's exports with contact details removed.
2. **Build the report.** Run the `monthly-returns-and-claims-report` prompt: returns and claims by product, batch and reason, costs, rates per 100 units where sales are given, and comparison with last month.
3. **Find the fixes.** Pick up to three fixes tied to the numbers: a size guide, photos or listing text, packaging, a supplier conversation (with the `warranty-claims` skill's recovery pack for a bad batch), or a policy edit. *Approval: the owner chooses which fixes to make.*
4. **Check the policy.** Read the current returns, refund and warranty policy against last month's tickets. Where customers misread it or agents had to make exceptions, run the `plain-returns-policy` prompt. [L2] Draft the changes in the help centre or site editor. *Approval: every policy change needs the owner's sign-off, after they check this with local rules.*
5. **Update templates.** Run the `reply-template-library` skill, step 8, for every template that quotes a changed policy line or that agents keep editing. [L2] Save new versions as drafts. [L3] Publish them within the confirmed limits and log the changes.
6. **Check the rules that change fast.** Look at the "What changes fast" table in `knowledge.md` (subscriptions, EU and UK consumer rules, AI disclosure for bots, review rules) and flag anything that affects the policy or the templates.
7. **Report.** Send the owner the report, the chosen fixes, the policy and template changes made or proposed, and the month's action log.

## Outputs

- Monthly returns and claims report with up to three ranked fixes
- Supplier recovery pack if a batch is bad
- Policy edits proposed or drafted
- Updated templates, drafted or published, with the change log
- List of rule changes to watch

## Needs the client's approval

Which fixes to make, every policy change, supplier claims, and any template or help page change outside the confirmed level 3 limits. Changes to bots or automations need a fresh yes. For consumer-law questions, check this with local rules.
