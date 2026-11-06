# Quarterly ABM cycle

**Cadence:** every quarter, starting two weeks before the quarter begins. Monthly check-ins in between (see `monthly-pipeline-review`).

**Access:** set at the start, per tool (see `access.md`). Level 1 is enough to build the plan. Level 2 saves tiers, audiences and campaigns as drafts. Level 3 writes tiers to the CRM and launches approved campaigns within the cap. Until you choose, I work at level 1.

## Steps

1. **Collect (week -2).** Won and lost deals since the last cycle, the current target list, CRM engagement by account, ad results by company, webinar and event attendance. Ask the sales lead for accounts they want added or removed.
2. **Refresh the profile (week -2).** Run the `icp-from-won-deals` prompt on the new deals. Note any trait that changed.
3. **Score and tier (week -2).** Use the `abm-account-tiers-and-plays` skill: fit, dated signals, tiers sized to the team's hours, a reason for each tier 1 account. Move accounts that went cold down a tier; move warmed accounts up.
4. **Agree with sales (week -1).** One meeting to settle disputed accounts. Record the agreed list with date and both names.
5. **Messages (week -1).** Update or write messages per buying-group role with the `buying-group-messages` skill for any new account type.
6. **Plan plays (week -1).** A 90-day grid per tier with owners. Check outreach rules per country with the `b2b-outreach-consent-check` prompt for every email or message step.
7. **Build (week -1, level 2).** Draft CRM lists and tier properties, LinkedIn campaigns and audiences (`linkedin-abm-campaign-brief` prompt), emails and the quarter's webinar (`webinar-programme` skill).
8. **Launch (week 1, level 3).** After your yes to the launch list, write tiers to the CRM, launch campaigns within the cap and send approved emails to approved lists. Log every action.
9. **Run (weeks 1 to 13).** Monthly review on the first Monday. Stop and ask on spend spikes, policy warnings or sync errors.
10. **Close (week 13).** Results by tier against the measures, what to keep, what to drop, and inputs for the next cycle.

## Outputs

- Refreshed ideal customer profile with evidence
- Agreed target account list with tiers and reasons, signed and dated
- Buying-group message grid
- 90-day play grid per tier with owners
- Draft or live campaigns, depending on access
- Quarter-end results by tier and an action log

## Needs the client's approval

**Approved once, then run at level 3 within your limits.** The launch list: campaigns, audiences, budgets, dates, email sends to approved lists, CRM fields to update.

**Always needs a new yes.** A new ad account or audience, spend above the cap, importing or buying any contact list, sending to a new list or segment, deleting or merging records, paying for any tool, sponsorship or data, and any change to the target list after sales signed it.
