# Campaign launch

**Trigger:** a first TikTok campaign, a new product or market, or a rebuild after costs climbed. About one to two weeks from intake to launch, mostly tracking and filming.

**Goal:** launch a test phase with clean tracking, three to five named hooks, kill rules and agreed limits, and a clear trigger for the scale phase.

## Steps

Steps 1 and 2 need level 1. Steps 3 to 6 use level 2. Step 8 needs level 3, or the client launches.

1. **Intake** (prompt: `account-intake`). Collect price, costs, budget, tracking state, filming options, creators, restricted-product and teen risks, and access levels with limits. Write "Access I have".
2. **Plan** (skill: `tiktok-campaign-plan`). Break-even, tracking check, Smart+ or manual, test matrix, budget proposals, rules check.
3. **Tracking fixes.** If the Pixel or Events API fails the check, send the developer spec (event names, event_id, hashing, consent) and retest with the test event code. Code stays with the client's developer.
4. **Hooks** (prompt: `hook-test-matrix`). Five named hooks; choose three to five for launch.
5. **Creators** (skill: `spark-ads-creator-brief`; prompt: `creator-ad-script`). Briefs, scripts, disclosure, AI-label notes, agreements and fee proposals for the client to approve and pay.
6. **Build drafts** (tool: Ads Manager; Smart+ draft mode or paused manual ads). Link the TikTok account in Business Center (the client does this).
7. **Pre-launch check** (prompt: `ad-rules-and-label-check`), then the action list and limits for approval (prompt: `change-request-for-approval`). Wait for the yes.
8. **Launch** (level 3; tool: Ads Manager). Launch only what was approved. Log each action. Check ad review status and spend pacing within 24 hours.
9. **First-week check** (skill: `tiktok-hook-test-and-weekly-review`). Tracking against shop orders, delivery, early watch-time and click signals. No kill-rule calls before the agreed spend or time.

## Outputs

- Plan with break-even, test matrix and budget proposals.
- Tracking spec and test results.
- Creator briefs, scripts, agreements and fee proposals.
- Approved launch list and the change log.

## Approval

**Needs the client's yes before launch:** the plan, budget and cap, every ad, every creator post and fee, AI disclosures, and the launch action list.

**Always needs a fresh yes, even at level 3:** spend above the cap, a new ad account, a new audience built from a customer list, running a creator's post as a Spark Ad, creator payments (the client pays), deleting anything, and any rejected ad or account warning.
