# Tracking launch and verify

**Trigger:** a new site, store, booking flow or app; a tracking audit that found problems; or a big campaign about to start. Takes one to three weeks, mostly waiting for builds and data.

**Access:** set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the work to build or publish yourself. Until you choose, I work at level 1.

## Steps

1. **Intake (day 1).** Agree what counts as a sale or lead, where the true count lives, the channels in use, who builds tracking, and the regions customers live in. Record "Access I have" per tool.
2. **Current state (days 1 to 2).** Read GA4 settings, the Tag Manager container and the store's tracking apps (level 1). Compare GA4 purchases or leads with the backend for the last four weeks. Size any gap by region with the `tracking-gap-sizer` prompt.
3. **Write the plan (days 2 to 4).** Use the `ga4-tracking-plan` skill: events, parameters, key events, unwanted referrals, consent notes and the test list. Write UTM rules with the `utm-cleanup` prompt if links already exist. *Approval: you sign off the plan and the list of key events.*
4. **Build (days 4 to 8).** Level 2: tags, triggers and variables in a new Tag Manager workspace, left unpublished; store app settings written as a checklist. Or your developer or agency builds from the plan.
5. **Test in preview (days 8 to 9).** Run every line of the test list in Tag Assistant preview and GA4 DebugView. Record pass or fail with a screenshot reference. Fix and retest.
6. **Publish (day 10).** Level 3: publish the tested workspace with a version note, mark the agreed key events, add unwanted referrals and set data retention to 14 months, after one confirmation of the action list. *Approval: the action list and the publish time.* Changes to consent banners or to which conversions ad platforms bid on need a separate fresh yes.
7. **Verify with real data (days 11 to 17).** Compare GA4 key events with the backend daily for seven days. Check channel grouping: Unassigned and "(not set)" shares. Check that each purchase appears once.
8. **Hand over (day 18).** Send the final plan, the test results, the change log and the first week's reconciliation. Note what to recheck monthly.

## Outputs

- Tracking plan and UTM rules
- Tag Manager workspace (built, tested, published or ready to publish)
- Test results with pass or fail per event
- Seven-day reconciliation: GA4 against backend by day and region
- Action log: what, where, when, result
- Monthly recheck list

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Publishing the tested workspace, marking the agreed key events, adding the agreed unwanted referrals and setting data retention.

**Always needs a new yes.** Any consent banner change, changing which conversions an ad platform bids on, deleting tags or data, adding a new property or account, and anything outside the agreed list.
