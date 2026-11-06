# Quarterly security review

**Cadence:** Every three months, about an hour of the owner's time plus exports. Also run it after any incident or near miss, and before an insurance renewal.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or 3 need that level in the named tool; otherwise I hand the work to you or your IT firm.

## Steps

1. **Collect (level 1).** The risk register; a user export with MFA status and admin roles; the number of suspicious messages staff reported this quarter and how fast; any incidents or near misses; for stores, the staff list, app list, failed-payment and chargeback counts.
2. **Refresh facts.** With web search connected, re-check the "What changes fast" table in `knowledge.md` against the official pages and note anything that affects this business (new guidance, platform changes, reporting rules). Without it, list the facts for the client to confirm.
3. **Re-score the register.** Use the `risk-register-from-notes` prompt on this quarter's notes. Update likelihood and impact in the owner's words, close finished actions, add new risks. *Approval: the owner confirms decisions, especially any risk to accept.*
4. **Sign-in and access check.** Accounts without two-step sign-in, admins who no longer need the role, leavers who can still sign in. At level 3, enforce sign-in rules for named users on the agreed list. Removing an admin role or deleting an account needs a fresh yes.
5. **People check.** Reports this quarter versus last; any payment-change request that skipped the call-back rule. Run a 10-minute refresher or reporting drill from the `phishing-awareness-session` skill if reports fell.
6. **Store check (if any).** Run the checks in the `store-lockdown-and-card-testing` skill: staff and permissions, apps not used in 90 days, fraud settings, failed payments and chargebacks against the watch line. At level 3, adjust agreed rules; app removal needs a fresh yes.
7. **Plan check.** Is the incident plan's contact sheet current? When was the last tabletop? If more than a year ago, schedule one with the `tabletop-exercise-script` prompt.
8. **Report.** One page: three lines first (biggest risk now, what improved, what I need from you), then the register changes, the change log and the next quarter's actions. *Approval: the owner picks next quarter's actions.*
9. **Book the next review.**

## Outputs

- Updated risk register with decisions and review dates
- Scorecard: two-step sign-in coverage, admin count, leavers with access (target zero), staff reports and time to report, last tabletop date, store failed payments and chargebacks
- Change log of anything done in the tools
- One-page owner report with decisions needed

## Needs the client's approval

**Approval points.** Risk decisions (especially accepting a risk), the next quarter's actions, and any change list for level 3 items.

**Runs at level 3 within the agreed list, after one confirmation.** Enforcing sign-in rules for named users, tightening agreed sharing and staff permissions, adjusting agreed fraud rules, publishing updated staff rules.

**Always needs a fresh yes.** Deleting accounts, apps, orders or data; changing admin roles; isolating devices; turning off a protection; refunds above the limit; any scan, test or simulation, which also needs the system owner's written authorisation. Money movements and payout changes stay with the client.
