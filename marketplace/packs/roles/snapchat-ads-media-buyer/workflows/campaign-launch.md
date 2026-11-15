# Campaign launch

**Trigger:** a first Snapchat campaign, a new product or market (US or India), or a rebuild after costs climbed. About one to two weeks from intake to launch, mostly tracking, catalog and filming.

**Goal:** launch a test phase with clean tracking, three to five named concepts, kill rules and agreed limits, and a clear trigger for the scale phase.

## Steps

Steps 1 and 2 need level 1. Steps 3 to 6 use level 2. Step 8 needs level 3, or the client launches.

1. **Intake** (prompt: `account-intake`). Collect price, costs, budget, markets, tracking and catalog state, Public Profile, filming options, creators, age and teen risks, and access levels with limits. Write "Access I have".
2. **Signal check** (skill: `snap-pixel-capi-and-catalog-check`). Pixel, Conversions API, deduplication, matching, Shopify data sharing, and catalog readiness for Dynamic Ads.
3. **Tracking fixes.** If a check fails, send the developer spec (event names, event_id and order ID, hashing, click ID, consent) and retest with Test Events and the validate endpoint. Code and the Conversions API token stay with the client's developer and Organization Admin.
4. **Plan** (skill: `snapchat-campaign-plan`). Break-even, objective and bid strategy, Dynamic Ads decision, test matrix, budget proposals, rules check.
5. **Concepts and creators** (prompts: `creative-test-matrix`, `creator-paid-partnership-script`). Five named concepts; choose three to five for launch. Creator scripts with disclosure, Paid Partnership steps and fee proposals for the client to approve and pay.
6. **Build drafts** (tool: Ads Manager; campaigns and ads left paused). The client links the Public Profile to the ad account.
7. **Pre-launch check** (prompt: `ad-rules-and-age-check`), then the action list and limits for approval (prompt: `change-request-for-approval`). Wait for the yes.
8. **Launch** (level 3; tool: Ads Manager). Launch only what was approved, at least a day before the start date so review can finish. Log each action. Check review status and spend pacing within 24 hours.
9. **First-week check** (skill: `snapchat-creative-test-and-weekly-review`). Tracking against shop orders, delivery, early swipe and engaged-view signals. No kill-rule calls in the first 1 to 4 days, and none on days still waiting for late conversions.

## Outputs

- Signal check and developer spec, with test results.
- Plan with break-even, test matrix and budget proposals.
- Creator scripts, agreements and fee proposals.
- Approved launch list and the change log.

## Approval

**Needs the client's yes before launch:** the plan, budget and cap, every ad, every creator post and fee, age floors by country and state, and the launch action list.

**Always needs a fresh yes, even at level 3:** spend above the cap, a new ad account, a new audience built from a customer list, running a creator's post as an ad, creator payments (the client pays), a new country or state for a restricted product, deleting anything, and any rejected ad or account warning.
