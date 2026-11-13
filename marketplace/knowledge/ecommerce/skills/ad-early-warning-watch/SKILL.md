---
name: ad-early-warning-watch
description: "A daily watch on an online store's ad metrics that flags trouble before it shows in revenue: frequency creep, falling click and hook rates, rising cost per thousand (separated from account-wide or seasonal rises), stalling reach, spend piling into one ad, tracking drift and advertised products running low on stock. Thresholds come from each ad set's own rolling 28-day baseline with evidence-card floors; alerts need persistence, enough volume, two agreeing signals for an Act alert, and a cooldown; and the rules are back-tested on the store's history before any lead time is promised. Each alert has a severity, a likely meaning and the skill to run next. Read access only; it never changes anything."
---

# Early-warning watch on ad metrics

**You get:** a one-screen daily digest of ad metric alerts with severity and money at stake, plus a baseline sheet, a back-test report and setup notes, ready to run each morning before trouble shows in revenue.

Cost per purchase is a late signal. Frequency, click rate, hook rate, CPM and reach usually move first. This watch reads them every day against each ad set's own normal, raises an alert only when a change is real, lasting and confirmed, and says what to look at next. It never pauses, scales or edits anything.

## When to use

- The store spends daily on Meta, Google or TikTok and learns about problems from the monthly revenue.
- Fatigue keeps catching the team by surprise.
- The owner wants one short daily digest instead of three ad managers.
- Before and during a sale, when things change fast.

## Not for

- Finding the cause once something has gone wrong: use `store-results-drop-diagnosis`.
- A monthly health score: use `paid-ads-health-score`.
- Deciding budgets: use `store-meta-budget`.
- Sorting ads into keep or cut: use `store-meta-creative-review`.

## What you need

**Required**

- Daily ad export by ad set and ad, 90 days to start, then daily: date, campaign, ad set, ad, spend, impressions, reach, frequency, CPM, CTR (all), CTR (link), 3-second video plays, purchases, cost per purchase. Google: cost, impressions, clicks, CTR, conversions by conversion time. TikTok: the same with 2-second views.
- Shopify daily orders and sessions; stock by advertised SKU with reorder lead time.
- Which ad sets target cold, engaged and existing customers.
- Gross profit per purchase and target cost per purchase per hero SKU.

**Optional**

- Planned sale, launch and edit dates, so the watch expects the change.

**Tools:** a spreadsheet fed by daily CSV exports, or a small script on a schedule; read-only connectors if the owner grants them. Paid monitoring tools are optional.

**Access.** Level 1, read, always. Setting up a scheduled job or connector needs the owner's yes.

## Before you start: the gates

1. **Money known.** Target cost per purchase exists, so alerts can be ranked and healthy ad sets recognised. Fail: run `store-meta-math`; alerts stay unranked.
2. **Baseline exists.** At least 28 days of daily data per ad set. Fail: card floors only for the first month, labelled "no baseline".
3. **Tracking trusted.** Meta purchases within about 20% of Shopify paid-social orders (practitioner default, test it). Fail: the first alert is the tracking alert, and purchase-based signals are off until fixed.
4. **Capacity.** Someone reads the digest and can act within 48 hours. Fail: weekly digest with Act and Critical alerts only.

## Steps

### 1. Build rolling baselines per ad set

For each ad set and metric, take the last 28 days, leaving out sale days, launch days and the first 7 days after a major edit. Store the median and the median absolute deviation (MAD). Recompute weekly. Hook rate is also compared with each ad's own first full week. Never use a fixed early window as the baseline; it ages and drifts.

### 2. Compute today's signals

Use a 3-day rolling value against the baseline, not one day. Below about $1,000 a day of spend, single-day swings are normal [ADC-0064]. For Google, use conversions by conversion time [GAD-0035].

| Signal | Fires when (practitioner trigger, tuned in step 6) | Evidence floor |
|---|---|---|
| Frequency creep, cold | Above baseline by 3 MAD and rising 3 days running | Ad-level frequency over 2 on cold campaigns signals fatigue [MCR-0040] |
| Frequency, existing customers | Above baseline by 3 MAD | 7-day frequency over about 8 is overspend [ADC-0021]; keep under about 7 in 30 days [ADC-0040] |
| Frequency, engaged | Above baseline by 3 MAD | 30-day frequency near 14 is overspend [ADC-0029] |
| Link CTR falling | Below baseline by 3 MAD on the same ads | Falling link CTR with steady all-CTR is attention without intent [MCR-0029] |
| Hook rate falling | 3-second plays / impressions down about 20% from the ad's first week | Read per opener [MCR-0071] |
| CPM rising | Above baseline by 3 MAD and above the account-wide CPM change | If every campaign rises together, label it season or auction, not this ad set |
| Reach stalling | Weekly new reach growth under about 5% at steady spend | Rising CPMs and falling hook rates across all variations mean saturation [MCR-0052] |
| Spend piling up | One ad's share of spend jumps | A few ads often hold most spend [ADC-0014]; cap a concept near 40% when it passes about 80% [ADC-0061] |
| Store funnel | Cart to checkout to purchase worse than baseline | A typical funnel runs about 4 to 2 to 1 [MEA-0008] |
| Stock cover | Advertised SKU cover below its reorder lead time | Raise its target or pause its ads [ADC-0023]; forecast from in-stock days only [OPS-0014] |
| Tracking drift | Platform purchases / Shopify orders moves over 20% from baseline | Practitioner default, test it |

### 3. Apply the noise rules

An alert fires only if:

- **Persistence:** the rule held 2 checks in a row (tracking and stock fire on the first).
- **Volume:** at least 1,000 impressions a day and 3 or more expected purchases in the window (practitioner default).
- **Not expected:** not a declared sale, launch or post-edit day.
- **Profitable ad sets:** if cost per purchase is at or under target, CPM and CPC rises alone are digest notes, not alerts; frequency and fatigue still alert.
- **Cooldown:** the same alert on the same ad set is not resent for 72 hours unless its severity rises. A cooldown is never shorter than the window the signals are read over.

### 4. Set severity

| Severity | When | Response |
|---|---|---|
| Critical | Tracking drift; advertised SKU below lead-time cover; spend with zero purchases above 2 times target cost per purchase in 3 days | Same day |
| Act | Two different signals on one ad set within 48 hours, on 20% or more of spend; or three or more signals even while results are still healthy | Within 48 hours |
| Watch | One signal | Note it; recheck midweek |
| Info | Trending but in range | Digest only |

Rank inside a severity by money at stake: daily spend times the likely drift of cost per purchase from target. Never recommend pausing a profitable ad set on early signals alone.

### 5. Say what it probably means and what to run

| Pattern | Likely meaning | Next |
|---|---|---|
| Frequency up, link CTR or hook rate down, CPM flat | Creative fatigue; new openers by a new person can revive a winner [MCR-0047] | `store-meta-creative-review`, `ai-presenter-video-openers` |
| Hook rate down, CTR steady | The opening has tired, the body still works | `ai-presenter-video-openers` or `wordless-video-openers` |
| CPM up, reach flat, hook rate down on all ads | Saturation; at peak, more often offer fatigue [ADC-0044] | `store-meta-concepts` for new buyer groups or offers |
| Store funnel worse on every channel | Site, stock or offer | `store-results-drop-diagnosis` |
| Tracking drift | Pixel, server events or settings | `store-meta-capi` |
| Spend piling into one ad | Concentration risk | `store-meta-budget` |

Escalate to `store-results-drop-diagnosis` when cost per purchase passes 125% of target, a signal stays red 5 days, or several campaigns show the same pattern.

### 6. Back-test and tune

Run the rules on the last 90 days. Count alerts that came 3 to 7 days before a real rise in cost per purchase (hits) and those that did not (false alarms). Aim for fewer than 1 in 10 Act alerts being false. Tuning: more than 20% false alarms in a week, loosen that trigger by about a quarter; a problem a person caught first, tighten by about 15%; an alert that fires and clears repeatedly, require one more consecutive check. Report the lead time achieved; do not promise 3 to 7 days until the back-test shows it. Retune quarterly.

### 7. Run the cadence and send the digest

Daily: one message at a fixed time, Critical first, then Act, then one line of Watch and Info counts, and "no alerts" on quiet days so the owner knows it ran. Monday: full run on every active campaign against last Monday. Wednesday: recheck anything on Watch. Friday: final read before the weekend. Each alert: entity, metric, 3-day value, baseline, change, severity, likely meaning, next skill, money at stake.

## Checks before you hand it over

1. Baselines are rolling 28-day per ad set, with sale, launch and post-edit days removed.
2. Every alert passed persistence, volume, expected-event, profitability and cooldown rules.
3. Act alerts need two signals or three or more; CPM alerts are separated from account-wide rises.
4. Every evidence floor is shown with its condition.
5. Back-test hits, false alarms and lead time are reported.
6. Alerts are ranked by money at stake using target cost per purchase.
7. The watch changes nothing; every next step needs a person.

## Output

1. **Daily digest (one screen):** date, counts by severity, Critical and Act alerts in full.
2. **Alert table:** entity, metric, 3-day value, baseline median, MAD, change, rule, severity, meaning, next skill, money at stake.
3. **Baseline sheet:** ad set, metric, median, MAD, last recomputed.
4. **Back-test report:** rule, trigger, hits, false alarms, median lead time, tuning changes.
5. **Setup notes:** export schedule, sheet or script location, who reads it, cadence.

## Common mistakes

- **One threshold for every store.** Step 1 uses each ad set's own rolling baseline.
- **Alerting on one bad day or one signal.** Steps 3 and 4 need persistence and agreement.
- **Blaming an ad set for a seasonal CPM rise.** Step 2 compares with the account.
- **The same alert every morning.** Step 3 sets a cooldown.
- **Pausing a profitable ad set on early signals.** Step 4 forbids it.
- **A watch that acts.** It only suggests; people decide.

## Sources

- [ADC-0064]: daily swings are normal at low spend.
- [GAD-0035]: Google credits the click date.
- [MCR-0040]: cold frequency above 2 signals fatigue.
- [ADC-0021]: existing-customer 7-day frequency above 8.
- [ADC-0040]: customer frequency under 7 in 30 days.
- [ADC-0029]: engaged frequency near 14 is overspend.
- [MCR-0029]: CTR without link clicks is a false signal.
- [MCR-0071]: read 3-second view rate per thumb-stop.
- [MCR-0052]: saturation shows as rising CPMs and falling hook rates.
- [ADC-0014]: a few ads hold most spend.
- [ADC-0061]: cap one concept's share.
- [MEA-0008]: typical cart to checkout to purchase ratio.
- [ADC-0023]: tie ad targets to stock cover.
- [OPS-0014]: forecast from in-stock days only.
- [MCR-0047]: new hooks by a new person revive a winner.
- [ADC-0044]: peak stalls usually mean offer fatigue.

What makes this skill ours: thresholds come from each ad set's rolling baseline with evidence-card floors; persistence, volume, a profitability rule, two-signal agreement and a cooldown keep noise out; stock cover and tracking drift sit beside ad metrics; and the rules are back-tested on the store's own history before any lead time is promised.
