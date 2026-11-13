---
name: consolidate-fragmented-meta-account
description: "A merge plan that turns a Meta account with many small campaigns and ad sets into a few that can exit learning. Inventories every live campaign, measures how much spend sits in learning-limited ad sets, keeps a split only where the business needs one (country, margin group, sub-brand, category with its own target), works out how many ad sets the budget can feed, moves winning ads by post ID, and sets the switch order: build paused, run side by side, pause the worst first and the old winner last, with a rollback rule. Judged on store new-customer orders, not Meta ROAS. Use when an account has more campaigns than its budget can feed or nobody can say why each exists."
---

# Consolidate a messy Meta account

**You get:** an inventory of every live campaign and ad set with a keep, merge or pause call, a target structure on one page, a dated switch order, a list of what to pause and when, and a before-and-after scorecard read on store orders.

## When to use

- Many ad sets show "Learning limited" and spend is spread thin.
- Several campaigns sell the same products to the same people.
- An agency or several freelancers each added their own campaigns.
- Before scaling, when the structure cannot take more budget.

## Not for

- A single new campaign: use `build-meta-campaign-launch-sheet`.
- A full account audit across tracking, money, creative and policy: use `store-meta-audit` first; this skill acts on its structure finding.
- Setting budgets once the new structure runs: use `store-meta-budget`.
- Audiences and exclusions in detail: use `build-meta-retargeting-and-exclusions`.

## What you need

Required:

1. **Meta Ads Manager export**, last 28 and 90 days, campaign, ad set and ad level: name, objective, optimisation event, attribution setting, budget type and amount, bid strategy, audience, exclusions, country, delivery status, spend, purchases, cost per purchase, frequency, ad ID, post ID.
2. **Account activity history**, last 30 days.
3. **Shopify order export**, last 90 days, with Customer Id and first-order flag (or Customer Id and Created at to work it out), and Lineitem sku.
4. **Gross profit per purchase** by product or category, from `store-meta-math`.
5. **The client's business splits**: countries served, sub-brands, categories with their own sales targets.

Optional: an earlier audit, the sale calendar, stock by SKU.

If 3 is missing, the before-and-after can only be read on Meta numbers: say so on the plan. Reading needs level 1. Building the new structure paused needs level 2. Every pause, budget shift and switch-on needs the client's yes; the plan lists them in order for one approval, with a fresh yes for each step that deviates.

## Before you start: the gates

1. **Tracking first.** Pass when Meta purchases match store orders within about 20% over 14 days (practitioner default). Fail: fix tracking first; structure comes after data [ADC-0028].
2. **Profit known.** Pass with gross profit per purchase by margin group. Fail: you cannot decide which splits are real.
3. **Timing.** Pass when no sale, festival or launch falls in the next 21 days. Fail: wait; a restructure resets learning, and doing it before a peak can start a spiral of falling results and bigger changes [GAD-0036].
4. **Stock and cash.** Pass when hero products have cover for the switch period and the parallel run's extra spend fits the month's cap.

## Steps

### 1. Inventory and score fragmentation

For every live ad set, record: 28-day spend, purchases, delivery status, and purchases per 7 days. Then compute:

- **Spend in learning-limited ad sets** as a share of total. Above about 30% is a clear case (practitioner default, test it).
- **Ad sets the budget can feed:** weekly purchases at current cost divided by about 50, the events Meta wants per ad set in 7 days [ADC-0066]. If the account makes 120 purchases a week, it can feed about 2 learning ad sets, not 25.
- **Overlap:** campaigns with the same product, country and audience.

### 2. Keep only business splits

A separate campaign is kept only for business complexity: a different country, sub-brand, category with its own target, or a different margin group [ADC-0030]. A margin gap like 70% versus 35% justifies a split [GAD-0043]. Spend level, launch date, "a test someone ran" or a lookalike audience are not reasons.

Inside each kept campaign, ad sets are grouped by concept (persona, angle, offer), not by audience or date [ADC-0058]. Format splits are only worth keeping in new accounts [ADC-0060].

### 3. Draw the target structure

Typical result for a store under about 50,000 a month:

| Campaign | Contents |
|---|---|
| Prospecting, per country or margin group | Ad sets by concept; existing customers excluded |
| Testing (or test ad sets inside prospecting) | New concept packs with a daily minimum [ADC-0016] |
| Existing customers (only if `build-meta-retargeting-and-exclusions` says yes) | Capped in money |

Under about 10,000 a month, either campaign or ad set budgets work; pick one [ADC-0067]. Write the target count of campaigns and ad sets, and check it against step 1's "ad sets the budget can feed".

### 4. Map every old ad set to its fate

| Old ad set | Fate | Rule |
|---|---|---|
| Hitting target, real business split | Keep as is | Do not disturb a winner [ADC-0009] |
| Hitting target, no business reason | Merge: its winning ads move to the new ad set | Move by post ID |
| Over target, learning limited | Pause after new structure delivers | Worst first |
| Duplicate of another | Pause | Keep the better one's ads |
| Ads with no spend | Holding ad set or archive | Do not delete history |

Move winning ads using their existing post IDs so comments and reactions carry over (practitioner default). Never delete campaigns; pause them, so history stays readable.

### 5. Set the switch order

1. **Build** the new structure paused. Same event, attribution and exclusions everywhere.
2. **Approve:** client signs the plan and the dates.
3. **Launch** the new campaigns at about a third of the money they will hold, while old campaigns keep running.
4. **Day 3 to 4:** pause the worst old ad sets (over target, learning limited) and move their budget to the new structure.
5. **Day 7:** pause duplicates. New campaigns now hold about two thirds of spend.
6. **Day 14:** pause the old winner only if the new campaign has run at or under target for 7 days. If not, keep both and review at day 21.

Expect a few weeks of uneven numbers; under about 1,000 a day of spend, read on 7-day windows only [ADC-0064].

### 6. Write the rollback rule

If at day 7 the account's 7-day store new-customer orders are more than 25% below the 14 days before the switch, at the same spend (practitioner default, test it), reactivate the paused winners and hold the merge. Ask the client before reactivating.

### 7. Read the result on store numbers

Compare 14 days before and 14 days after the final pause:

- Store new-customer orders and acquisition MER (new-customer revenue divided by Meta spend) [MEA-0025].
- Share of spend in learning-limited ad sets.
- Meta cost per purchase on 7-day click, as a secondary read.

Do not panic if a few ads now take most of the spend; that is how budget optimisation behaves [ADC-0014]. If one concept takes about 80%, feed it or cap it as `store-meta-budget` decides [ADC-0061].

### 8. India and US notes

- **India:** if most orders are COD, judge before and after on delivered orders (`meta-ads-for-cod-stores`). Separate regional campaigns are worth keeping only where delivery cost, RTO rate or language changes the economics.
- **US:** finish the merge by mid-October to give the new structure history before Black Friday.

## Checks before you hand it over

- Every live ad set has a fate with a reason.
- Each kept campaign split names its business reason.
- The target ad set count fits the purchases the budget can buy.
- Winning ads move by post ID; nothing is deleted.
- The switch order has dates, and the old winner pauses last.
- The rollback rule is written with its number.
- The before-and-after uses store new-customer orders.
- Every pause and switch-on waits for the client's yes.

## Output

**Summary (one screen):** campaigns and ad sets now versus target, spend in learning-limited ad sets now, the switch dates, what pauses when, the rollback rule, the yes needed.

**Inventory table:** Campaign, Ad set, Country, Products, Margin group, 28-day spend, Purchases per week, Status, Fate, Reason, Move to.

**Target structure:** Campaign, Business reason, Ad sets (concepts), Budget type, Daily budget.

**Switch calendar:** Date, Action, Budget old/new, Check, Owner, Client yes date.

**Scorecard:** Metric, 14 days before, 14 days after, Change.

## Common mistakes

- **Rebuilding everything in one day.** Step 5 runs old and new side by side.
- **Splitting for spend, not business.** Step 2 keeps only real splits [ADC-0030].
- **Deleting old campaigns.** Step 4 pauses them so history survives.
- **Merging right before a sale.** Gate 3 blocks it [GAD-0036].
- **Judging the merge on Meta ROAS.** Step 7 reads store new-customer orders [MEA-0025].
- **Too many ad sets for the budget.** Step 1 sizes them from weekly purchases [ADC-0066].

## Sources

- ADC-0009: do not disturb ad sets hitting target.
- ADC-0014: spend concentrates in few ads.
- ADC-0016: test packs inside one prospecting campaign.
- ADC-0028: data before structure.
- ADC-0030: campaigns only for business complexity.
- ADC-0058: ad sets by concept.
- ADC-0060: format splits only in new accounts.
- ADC-0061: one concept taking most spend.
- ADC-0064: read small accounts on 7 days.
- ADC-0066: about 50 events in 7 days.
- ADC-0067: campaign versus ad set budget by size.
- GAD-0036: restructures reset learning; fix before rebuilding.
- GAD-0043: split for materially different margins.
- MEA-0025: acquisition MER as the store-side read.

What makes this skill ours: the number of ad sets is sized from the purchases the budget can buy; every split must name a business reason; old and new run side by side with the old winner paused last and a written rollback number; and the merge is judged on store new-customer orders.
