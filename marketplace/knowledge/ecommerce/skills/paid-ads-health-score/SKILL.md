---
name: paid-ads-health-score
description: "Score an online store's paid ads accounts (Meta, Google, TikTok) from 0 to 100 with a letter grade, from plain CSV exports and screenshots, no API needed. Five areas (tracking, money, structure, creative, audiences) are scored with pass, partial or fail checks tied to evidence; critical failures are shown as blockers, unknowns lower coverage instead of the score, and several platforms roll up by spend share. The score is withheld until gross profit per purchase can be computed and capped when tracking is broken. Returns blockers, quick wins ranked by points per minute with the projected score after them, and a tiered plan the owner approves. Use monthly or when taking over accounts."
---

# Paid ads health score for a store

**You get:** a 0 to 100 health score with a letter grade for Meta, Google and TikTok, area and check tables tied to evidence, and an action plan with owners and access levels.

A score is useful when it moves for the right reasons and cannot be gamed by tidy settings. This one is gated on the store's own profit, capped by tracking truth, and every point traces to a row in an export. For the full Meta investigation behind a low score, hand over to `store-meta-audit`.

## When to use

- Monthly check across all paid channels, to see whether things are improving.
- Taking over a store's ad accounts and needing one clear view in a day.
- After a round of fixes, to show what moved.
- The owner asks "how healthy are our ads?" and wants one number with reasons.

## Not for

- A deep Meta audit with money at stake per finding: use `store-meta-audit`.
- Why results changed this week: use `store-results-drop-diagnosis`.
- Daily alerts: use `ad-early-warning-watch`.
- Pixel and Conversions API repair: use `store-meta-capi`.

## What you need

**Required (plain exports work)**

- Shopify order export, last 60 days: Created at, Name, Total, Discount amount, Shipping, Lineitem sku, Lineitem quantity, Customer ID or email, Financial status, Cancelled at.
- Costs per SKU (product, shipping, payment fees, pick-pack, return rate) or gross profit per purchase.
- Meta export, last 30 days, ad level, plus the prior 4 weeks for baselines: campaign, ad set, ad, delivery, spend, impressions, reach, frequency, CPM, CTR (link), 3-second video plays, purchases, purchase value, cost per purchase, attribution setting.
- Screenshots: Events Manager overview and purchase event (match quality, deduplication, server events); exclusions on prospecting ad sets.

**Optional**

- Google Ads campaign, conversion action (primary or secondary, source) and search terms reports; TikTok campaign export; stock by SKU; customer list size and match rate.

**Missing input:** score what you can; unknown checks drop out and coverage falls. Under 70% coverage the score is provisional, with the missing inputs listed at the top.

**Access.** Level 1, read (exports, or read-only connector access the owner grants). Fixes need level 2 or 3 and a yes per change.

## Before you start: the gates

1. **Money gate.** Gross profit per purchase can be computed: price after discount minus product cost, shipping, fees, pick-pack and returns [MEA-0037]. Fail: withhold the score; score tracking only and make "get costs" the first action.
2. **Tracking cap.** If tracking scores under half its points, the overall grade is capped at D; data comes before structure and creative [ADC-0028].
3. **Confidence.** Lower confidence and say so if the account is under 14 days old or a major change landed in the window (new site, new pixel, big launch).
4. **Cash and capacity.** The plan only includes fixes the owner can pay for and staff this month; the rest moves to a later tier.

## Steps

### 1. Compute the money frame

Gross profit per purchase per hero SKU; break-even cost per purchase (equal to it); new-customer orders, spend and acquisition cost from Shopify. For cash-on-delivery stores in India and similar markets, count delivered orders and subtract return-to-origin losses (practitioner default: the store's own RTO rate).

### 2. Score each check

Pass earns full points, partial half, fail zero. Unknowns are left out of both earned and possible points. A fail marked **critical** is listed as a blocker even if the total looks fine. Record evidence: file, row, number.

**Tracking (30)**

| Check | Pts | Pass when |
|---|---|---|
| Meta purchases vs Shopify paid-social orders (critical) | 8 | Within about 20% over 30 days (practitioner default, test it) |
| Reporting window | 4 | Read on 7-day click or 7-day click plus 1-day engaged view; view-through can be 30 to 50% of reported return [MEA-0042] [ADC-0027] |
| Purchase event with value and currency | 4 | Both present |
| Server events, deduplication, test codes (critical) | 5 | Browser and server events share an event ID; no test code in a live tag [MEA-0005] |
| Google primary conversion (critical) | 5 | One primary purchase action from the store tag, not GA4 import [MEA-0017] |
| Google leaks | 4 | No Display in Search, no auto-apply, no broad match on Maximize Clicks [GAD-0042] |

**Money (20)**

| Check | Pts | Pass when |
|---|---|---|
| First-order gross profit / acquisition cost (critical) | 8 | 2 or more; partial 1 to 2; fail under 1 [MEA-0032] |
| New-customer revenue tracked | 4 | Owner reads new-customer revenue per ad spend [MEA-0039] |
| Spend matches stock | 4 | No SKU below reorder lead-time cover gets prospecting [ADC-0023] |
| Spend matches profit | 4 | Campaigns split where products' profit and cost per purchase differ widely [ADC-0022] |

**Structure (15)**

| Check | Pts | Pass when |
|---|---|---|
| Learning | 5 | Most spend sits near Meta's about 50 optimisation events in 7 days; partial if over a third is Learning limited |
| Campaign count | 5 | Campaigns exist for business reasons (country, category), not spend levels; one is fine [ADC-0030] |
| Google build | 5 | Search and Shopping first; Performance Max after about 100 purchases [GAD-0033]; brand 3 to 8% of spend, never over 10% [GAD-0024]; search terms reviewed and negatives added this month |

**Creative (20)**

| Check | Pts | Pass when |
|---|---|---|
| Distinct concepts | 4 | Enough winning concepts for the spend band [MCR-0058] |
| Spend concentration | 4 | No single concept above about 80% of spend [ADC-0061] |
| Fatigue | 4 | Cold ad frequency at or under 2 [MCR-0040], and link CTR on top ads no more than about 25% below each ad's own 4-week level (practitioner default) |
| New concepts and hit rate | 4 | A new concept in the last 30 days; hit rate tracked [ADC-0017] |
| Placement fit | 4 | Vertical 9:16 and 4:5 versions for top ads; video hook rate tracked |

**Audiences (15)**

| Check | Pts | Pass when |
|---|---|---|
| Customer exclusion | 5 | Existing customers excluded from prospecting [ADC-0055] |
| Customer frequency | 5 | Under about 7 per 30 days [ADC-0040] |
| Catalog ad share | 5 | Catalog and retargeting well below the about 70% of spend often found [ADC-0026] |

### 3. Total, grade, coverage, roll-up

Score = earned / possible x 100. Grades (practitioner default): A 85 and over, B 70 to 84, C 55 to 69, D 40 to 54, F under 40. Apply the tracking cap. Coverage = possible points / 100. With several platforms, score each and combine by spend share (60% Meta at 70 and 40% Google at 80 gives 74).

### 4. Rank the work

- **Blockers:** every critical fail, first.
- **Quick wins:** fixes under about 30 minutes that do not restart learning (exclusions, attribution column, test code removal, Display off). Rank by points regained per minute and show the projected score after them. Quick wins rarely lift a weak account far; say what the bigger work is.
- **Tiers:** this week (tracking and money), next two to four weeks (structure and audiences), this quarter (creative supply).

Each item: what changes, evidence, expected effect in money where possible, risk, owner, access level. Prefer targeted fixes over rebuilding; restructures reset learning [GAD-0036].

### 5. Track over time

Save the check table with the date. Next month show the score change and which checks moved; a rise that came only from coverage is labelled so.

## Checks before you hand it over

1. The money gate passed, or the score is withheld with the reason.
2. Every point has file, row and number; unknowns excluded, coverage shown.
3. Critical fails appear as blockers; the tracking cap was applied where due.
4. Weights add to 100 and the arithmetic was rechecked by script.
5. Quick wins show minutes, points and the projected score.
6. Every action states its access level; nothing changes without a yes.
7. A plain settings checklist would not beat it: it reflects profit and tracking truth.

## Output

1. **One-screen summary:** score, grade, coverage, confidence, blockers, three quick wins, projected score.
2. **Area table:** area, earned, possible, percent; platform roll-up if several.
3. **Check table:** area, check, points, result, evidence.
4. **Action plan:** tier, action, evidence, expected effect, risk, minutes, owner, access level.
5. **Trend line** from month two; **hand-offs** to `store-meta-audit`, `store-meta-capi` or `store-meta-budget`.

## Common mistakes

- **Scoring an account whose profit is unknown.** Gate 1 withholds the score.
- **A good grade on broken tracking.** Gate 2 caps it; blockers show first.
- **Counting unknowns as fails.** Step 2 leaves them out and shows coverage.
- **Format quotas as health.** Checks reward results and fit, not a share of carousels.
- **Rebuilding everything on a low score.** Step 4 makes targeted fixes first.
- **Counting placed cash-on-delivery orders as sales.** Step 1 uses delivered orders.

## Sources

- [MEA-0037]: gross margin is delivered cost.
- [ADC-0028]: data, then structure, then creative.
- [MEA-0042]: report Meta on 7-day click.
- [ADC-0027]: 7-day click plus 1-day engaged view.
- [MEA-0005]: a left-in test code hides conversions.
- [MEA-0017]: one primary purchase action in Google.
- [GAD-0042]: common Google Ads leaks.
- [MEA-0032]: first-purchase gross profit bands.
- [MEA-0039]: new-customer revenue per ad spend.
- [ADC-0023]: tie spend to stock cover.
- [ADC-0022]: split campaigns by product economics.
- [ADC-0030]: campaigns for business complexity only.
- [GAD-0033]: Performance Max after about 100 purchases.
- [GAD-0024]: brand spend 3 to 8%, never over 10%.
- [MCR-0058]: concepts needed by spend band.
- [ADC-0061]: cap one concept's share.
- [MCR-0040]: cold frequency above 2 signals fatigue.
- [ADC-0017]: track creative hit rate.
- [ADC-0055]: exclusions are hard controls.
- [ADC-0040]: customer frequency under 7 per 30 days.
- [ADC-0026]: catalog ads are often overweighted.
- [GAD-0036]: targeted fixes before rebuilds.

What makes this skill ours: the score is withheld until gross profit per purchase can be computed and capped when tracking fails; unknowns lower coverage instead of the score; every point carries file, row and number from plain exports across Meta, Google and TikTok; and cash-on-delivery stores are scored on delivered orders.
