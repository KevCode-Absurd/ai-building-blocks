---
name: google-smart-bidding-budget
description: "Checks every Google Ads campaign's bid strategy for the common failures: the wrong strategy for the store, targets above what the campaign achieves, too little data, stuck or limited learning, doubled or wrong conversion goals, budget limits, rank lost to low Quality Score and CPC spikes. Sets each target from the store's gross profit per purchase and cash limits, then recommends budget moves from losing campaigns to profitable ones with room to grow, each checked on marginal cost and kept inside change limits. Every change is recommend-only until the client approves it. Use it monthly, after a drop in spend or return, or before a sale."
---

# Smart bidding diagnosis and budget shifts

**You get:** a bid strategy check for every Google campaign, profit-based targets with first steps and review dates, budget moves between campaigns, and a numbered approval list the owner answers yes or no.

Smart bidding does what its target tells it. A target copied from last year, a goal that counts add-to-carts, or a budget that runs out at noon can each quietly waste money. This skill checks each campaign for those failures, sets targets from the store's real margins and cash, and proposes where budget should move.

## When to use

- Monthly; bid strategies need 2 to 3 weeks to settle after a change, so more often tempts over-tuning.
- Spend or conversions dropped suddenly and nothing obvious changed.
- Before a sale, a launch or peak season.
- The owner wants to grow Google spend and asks where the next money should go.
- After a tracking change or a site outage.

## Not for

- Meta campaigns: use `store-meta-budget`.
- Working out gross profit and break-even return from scratch: use `store-meta-math`, then come back.
- Which products or keywords to push inside a campaign: use `google-shopping-product-tiers` or `google-keyword-tiers`.
- Whether Performance Max adds new customers: use `google-pmax-diagnostics`.

## What you need

Required, read access (level 1):

1. **Campaign report**, last 30 and 90 days: Campaign, Type, Bid strategy, Portfolio, Target ROAS or Target CPA, Bid strategy status (Learning, Limited, Eligible) and days in it, Budget, Cost, Conversions, Conv. value, Conversions (by conv. time), lost impression share to budget and to rank (Search, Shopping or the type's equivalent), average Quality Score for Search.
2. **Change history**, last 60 days: strategy, target, budget and conversion action changes.
3. **Conversion actions list**: which are primary, how value is set, which campaign uses which goal.
4. **Gross profit per purchase**, break-even ROAS and target cost per purchase, from `store-meta-math`.
5. **Cash and stock limits**: the most the client will spend this month, and products short of stock.

Optional: Shopify new-customer orders by week, auto-apply settings, seasonality adjustments and data exclusions already set.

Missing input: ask once. Without the cash limit, propose no increase. Without gross profit, report failures only and set no targets.

## Before you start: the gates

1. **Money gate.** Break-even ROAS = conversion value per purchase / gross profit per purchase, on the same value basis Google receives (with or without tax and shipping). Fail: no target is set or changed.
2. **Cash gate.** Monthly spend ceiling stated. Google may spend up to twice the average daily budget on one day and about 30.4 times it in a month (Google Ads Help, budgets); budgets must fit the ceiling at that maximum. Fail: recommend cuts and fixes only.
3. **Tracking gate.** One primary purchase action with real order values; no micro-actions as primary [MEA-0017] [MEA-0016]. Fail: this is the first fix; targets wait.
4. **Recency gate.** The latest 3 to 4 days are under-counted [GAD-0035]; read them with conversion-time columns.

## Steps

### 1. Check strategy fit

| Situation | Fix to recommend |
|---|---|
| Manual CPC with over about 50 conversions a month | Move to Maximize Conversion Value, then a target; keep manual only for brand with a hard CPC cap |
| Maximize Conversions or Target CPA with varied order values | Value-based bidding; Target CPA suits fixed-price single-product stores [GAD-0021] |
| Under about 30 conversions a month on Target ROAS | Maximize Conversion Value without a target, or manual CPC; add a target at 30 to 50 a month [GAD-0021] [GAD-0030] |
| Several campaigns with the same goal and similar targets | Consider a portfolio strategy; it is also the only way to cap CPCs on smart bidding [GAD-0002] |

### 2. Run the failure checks

| Check | Fails when | Fix to recommend |
|---|---|---|
| Target above actual | Target ROAS above the 30-day actual (or Target CPA below it) and spend falling | Cut to at or below actual in one move; a target above actual shrinks exploration to almost nothing [GAD-0053] |
| Stuck in learning | Status Learning for more than 14 days | Check tracking, then consolidate similar campaigns or add budget so it gets enough conversions |
| Limited by strategy | Status Limited because the target is too tight | Loosen the target, or remove it until data builds |
| Budget-limited on a target | Limited by budget with a loose target | From 17 August 2026 these campaigns bid toward the stated target, so a loose target can drift down to it [GAD-0004]; set the target you want |
| Rank loss from quality | Over about half of impressions lost to rank and average Quality Score under 6 | Not a bid problem: `google-quality-score-triage` first |
| Wrong or doubled goal | Micro-actions as goals, or two primary purchase actions | One purchase goal [MEA-0017] |
| Fixed values | Value is a fixed number | Send real order value, ideally margin-adjusted [MEA-0016] |
| CPC spikes | Average CPC on some days several times normal | Portfolio strategy with a max CPC cap [GAD-0002] |
| Outage or sale unmarked | Tracking broke, or a short sale ran without adjustment | Data exclusion for broken days; seasonality adjustment only for short events of a few days (Google Ads Help) |
| Auto-apply on | Recommendations applied automatically | Turn off; changes need the client's yes [GAD-0042] |

### 3. Set each target from money

Pick one rule per campaign and say which:

- **Profit floor (default):** target ROAS = break-even ROAS x 1.1 to 1.3, leaving a buffer for overheads. Practitioner default; the client sets the buffer.
- **New customer:** where repeat is measured on cohorts at least 90 days old and the cash gate passes, a campaign that mainly wins new customers may run nearer break-even on the first order [MEA-0024] [MEA-0026]. Never on assumed repeat.
- **Clearance:** slow stock may run at break-even or a small loss to turn it into cash; label it so nobody judges it on the main target [FIN-0026].

Then path the campaign to it. Start 10 to 15% below current actual return, then raise 15 to 20% per step with 2 to 3 weeks between steps until the money target is reached [GAD-0007]. If actual return is already below the profit floor, cut budget first, then tighten.

Where cards disagree: one source leaves new Performance Max without a target for about 3 months [GAD-0016]; by its own limits that suits only stores whose cash and margin can absorb unprofitable weeks. For most stores the cash gate wins.

### 4. Rank campaigns for budget

Profit after ads = conversions x gross profit per purchase minus cost. Leave out campaigns in learning: money neither leaves nor enters them.

- **Grow:** spending its full budget, at or better than target, losing over about 20% of impression share to budget. Raise 10 to 15% per step [GAD-0023].
- **Hold:** on target, not budget-limited.
- **Loosen:** spending under 80% of budget and missing target; loosen the target rather than adding money [GAD-0023].
- **Shrink:** profit after ads below zero over 30 days, not clearance or new-customer. Fix an unprofitable campaign at its current budget before scaling it [GAD-0032].

### 5. Check the last money

Before any increase: marginal cost = extra spend / extra purchases between the last two comparable periods. Return falls as spend rises [GAD-0032], and the extra sales can cost far more than the average [ADC-0049]. Stop where marginal cost per purchase reaches break-even.

### 6. Propose moves inside the limits

Move money from Shrink to Grow inside the monthly cash ceiling. Limits (practitioner defaults): at most 20% of a source campaign's budget per cycle; one target change per campaign per 2 to 3 weeks; never a target and budget change on the same campaign in the same week; judge results after 7 to 10 days at the earliest. No campaign with a stock-risk product gets more. Growth paid for with stock bought on credit can push profit to near zero [FIN-0011], so count the cash for extra stock too.

Each move states the numbers it rests on; no forecast of lift is promised.

## Checks before you hand it over

- Every target shows its rule, break-even ROAS and the value basis.
- Every flag cites the column or change-history line that proves it.
- Proposed budgets fit the cash ceiling at Google's monthly maximum.
- Every increase passes the marginal cost check; no campaign in learning is moved.
- The change limits in step 6 hold for every campaign.
- Budgets before and after add up.
- Nothing is changed in the account; the client approves each line. At level 3, apply only approved lines and log each one.

## Output

**One-screen summary first:** campaigns checked, failures by type, profit after ads by campaign, target changes, budget moves (from, to, amount), and cash used against the ceiling.

**Table "Bid strategy check":** Campaign, Strategy, Target, 30-day actual, Status and days, Conversions per month, Flags, Fix.

**Table "Targets":** Campaign, Rule, Break-even ROAS, Money target, First step, Next review date.

**Table "Budget moves":** Campaign, Daily budget now, Profit after ads, Lost IS (budget), Marginal cost per purchase, Call, Proposed budget, Change.

**Approval list:** numbered lines the client answers yes or no.

## Common mistakes

- **Raising the target to fix low return.** It shrinks delivery [GAD-0053].
- **Targets from habit.** Step 3 builds each from gross profit and names the rule.
- **Many small target changes.** Each restarts learning [GAD-0007].
- **Raising bids to fix rank lost to quality.** Step 2 routes it to Quality Score.
- **Adding budget to a losing campaign** [GAD-0032], or **scaling on average cost** [ADC-0049].
- **Budgets that break the cash limit.** Gate 2 fits the monthly maximum.

## Sources

- ADC-0049: scale on marginal cost.
- FIN-0011, FIN-0026: stock-funded growth; clearance at break-even.
- GAD-0002: portfolio caps for CPC spikes.
- GAD-0004: budget-limited targets from August 2026.
- GAD-0007, GAD-0021, GAD-0030: when to set and how to raise targets.
- GAD-0016: no early target, and why the cash gate overrides it.
- GAD-0023, GAD-0032: budget steps; fix before scaling.
- GAD-0035: recent days under-report.
- GAD-0042, MEA-0016, MEA-0017: goals, values and auto-apply.
- GAD-0053: a target above actual starts a spiral.
- MEA-0024, MEA-0026: first-order and time-bound profit targets.

What makes this skill ours: every target is built from gross profit per purchase with a named rule; budgets fit the client's cash ceiling at Google's monthly maximum; increases must pass a marginal-cost check; change limits stop over-tuning; card conflicts are settled by the cash gate; and every change ships as a numbered approval list.
