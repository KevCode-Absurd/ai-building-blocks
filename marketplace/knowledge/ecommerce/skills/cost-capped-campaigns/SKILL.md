---
name: cost-capped-campaigns
description: "Sets up and tunes ad campaigns that keep cost per purchase under a ceiling: Meta cost per result goals and bid caps, and Google target CPA or target ROAS. Starts by asking whether a cap is the right tool for this store at all, then derives the ceiling from the store's gross profit per purchase and store-truth factor rather than from past cost per purchase, builds the capped campaign from proven ads, and tunes the cap with plain rules based on how much of the budget it spends and what each purchase costs. Use when a store wants to scale without letting cost per purchase drift past profit, or when an existing cap under-spends or overspends."
---

# Capped campaigns: spend more without passing a cost ceiling

**You get:** a clear call on whether to use a cost cap, a cap worked out from store gross profit, a paused campaign build table for Meta or Google, and a cap log for tuning it over time.

A cap tells the platform "do not pay more than this for a purchase". Set from profit, it protects the store while it scales. Set from last month's cost per purchase, it just freezes last month's efficiency, profitable or not.

## When to use

- The store wants more spend but cash rules out any month of losses.
- Cost per purchase drifts above break-even whenever budget rises.
- A capped campaign already runs and either spends almost nothing or spends everything at a bad cost.
- A Google smart-bidding campaign under-spends since its target was raised.

## Not for

- Deciding scale, hold or cut for every Meta campaign: use `store-meta-budget`.
- Checking whether the store is ready to spend more at all: use `scale-readiness-check`.
- Building gross profit per purchase and break-even: use `store-meta-math`.
- New ad creative when proven ads run out: use `store-meta-concepts`.

## What you need

Required (read access, level 1):

1. **Meta Ads Manager export**, last 7, 14 and 30 days, campaign, ad set and ad level: Campaign name, Ad set name, Ad name, Bid strategy, Budget, Amount spent, Purchases, Purchases conversion value, Cost per purchase, ROAS, Delivery status, Attribution setting. Post IDs of the ads to reuse.
2. **Google Ads campaign report** if Google is in scope: Campaign, Bid strategy, Target CPA or Target ROAS, Budget, Cost, Conversions, Conv. value, Search lost IS (budget), Search lost IS (rank), conversions per month.
3. **Money lines** from `store-meta-math`: gross profit per purchase, break-even and target cost per purchase, break-even ROAS.
4. **Store-truth factor** per channel from `store-meta-attribution`.
5. **The client's monthly limit** and the most they will lose in a test week.

Optional: activity history, last 60 days of daily spend for the capped campaign.

Access: level 1 to analyse and recommend. Level 2 to build the capped campaign paused. Publishing it and every cap change needs a client yes, or written level 3 limits (cap range, budget ceiling, end date).

## Before you start: the gates

1. **Gross profit per purchase known.** Fail: stop. A cap without it is a guess with a hard edge.
2. **Is a cap the right tool?** One practitioner sees little gain from cost caps or bid caps below about 200,000 a month of spend, because bidding is rarely the bottleneck there [ADC-0065]; another reports that mixing bid strategies helps only above about 250,000 a month [ADC-0038]. Pass when either: monthly Meta spend is in that range, or the store has a hard cash reason to refuse any sale above a set cost. Otherwise, fail: run highest volume, and use `store-meta-budget` step 6 to add a cost goal only when scaling tips into losses. Where the cards and the cash need disagree, cash wins: a store that cannot fund a losing week may cap at any size.
3. **Tracking trustworthy.** Pass when platform purchases track store orders at a stable ratio. A cap on a broken signal caps the wrong number. Fail: fix with `store-meta-capi` first.

## Steps

### 1. Derive the ceiling from profit

Store target cost per purchase comes from `store-meta-math`: at or below first-order gross profit by default, or from proven 90-day gross profit divided by 2 to 3 [MEA-0026] [MEA-0020]. Then put it on the platform's basis:

Meta-basis cap = store target cost per purchase x Meta store-truth factor.

Illustrative only: store target 20, factor 0.80 (Meta claims more orders than the store sees), so the Meta cap is 16 on Meta's numbers.

Hard ceiling = Meta-basis break-even cost per purchase. The cap never goes above it except on a labelled clearance campaign.

Your bid is your unit economics: a rival with higher order value or margin can pay more per sale [ADC-0057]. If the profit-based cap sits well under what the market charges, the fix is the offer or order value, not a looser cap.

### 2. Compare with recent cost

Recent cost = Meta-basis cost per purchase over the last 7 and 30 days on the proven ads.

- Recent cost below the profit cap: start the cap at recent 30-day cost x 1.1, practitioner default, so it can spend while staying profitable.
- Recent cost between the profit cap and break-even: start at the profit cap. Expect lower spend; that is the point.
- Recent cost above break-even: do not build a capped campaign yet. The ads, page or offer need work first.

### 3. Pick the bid control

| Control | What it does | Use when |
|---|---|---|
| Cost per result goal (Meta) | Aims to keep average cost per purchase near the goal (Meta documentation) | Default for a store |
| Bid cap (Meta) | Limits the bid in each single auction, not the cost per purchase; spend can swing hard day to day | Experienced buyers, enough budget for a ladder (step 4) |
| ROAS goal (Meta) | Aims for a minimum return per purchase value | Order values vary widely across products |
| Target CPA or ROAS (Google) | Smart bidding toward the target | 30 to 50 conversions a month or more [GAD-0021] |

When products have very different margins, one cap sends money to the cheapest sale [ADC-0022]. Split them into separate capped campaigns, each with its own profit-based cap.

### 4. Build the capped campaign

- Use 3 to 5 proven ads only: ads with real purchase volume over weeks, not one cheap sale. Reuse them by post ID so comments and likes carry over, practitioner default. Never test new ads here; a capped campaign starves unproven ads and the result says nothing about them.
- One campaign, broad targeting, existing customers excluded. Cost per result goal: one ad set.
- **Bid cap ladder (optional):** 3 to 5 copies of the ad set at stepped caps, for example 80, 85, 90, 95 and 100% of the hard ceiling, never above it, practitioner default. Spend usually settles on one step; that is normal and shows the price that wins auctions. Use a ladder only if each step can still fund its own read; on a small budget the copies split learning, so start with one ad set.
- Budget well above what the cap will spend, so the cap, not the budget, controls delivery: practitioner default, a daily budget of 5 to 10 times the cap.
- Optimise for Purchase, attribution setting the same as the store-truth factor was built on.
- Name it with the cap in the name, for example "CAP16 | prospecting | pack 12", so the log can be read later.
- Build it paused. Send the client the cap, the budget, the worst-case weekly spend and the review date for a yes.

### 5. Read it on the right window

Give it 3 to 4 days before any change; one practitioner reads new concepts after 3 times the target cost per purchase is spent [ADC-0039]. Below about 1,000 a day, single days are noise [ADC-0064]. Read the store side as well: if Meta's cost stays under the cap but store orders do not rise, check the factor.

### 6. Tune with the spend-and-cost grid

Delivery rate = amount spent / budget over the last 3 days.

| Delivery rate | Cost versus cap | Action |
|---|---|---|
| Under 10% | Few or no impressions | Cap far too low: raise in one larger step, about 20%, never past the hard ceiling |
| 10 to 50% | Under cap | Raise cap 5 to 10%; the aim is to spend at least half the budget at a profitable cost |
| Under 50% | No purchases after spend of 3 times target | Ads cannot win at this price: replace with other proven ads before touching the cap |
| 50 to 90% | Under cap | Hold; working as designed |
| Over 90% | Under cap | Raise budget 20 to 30%; the cap is not binding |
| Over 90% | Over cap | Lower cap 10%, or cut budget if two reads in a row miss |

Change one thing at a time, rename the ad set to its new cap, then wait another 3 to 4 days. All are practitioner defaults, test them. Each cap or budget change is a significant edit in Meta's learning phase (Meta documentation). The goal is the most spend at a profitable cost, not the best ROAS on a tiny budget: a capped campaign at 7 times return that spends a tenth of its budget is under-used.

### 7. Google targets: the same idea, different rules

For a full check of every Google smart-bidding campaign, use `google-smart-bidding-budget`; the rules below cover a capped campaign.

- Set a new target ROAS 10 to 15% below current actual ROAS, then raise it 15 to 20% at a time, 2 to 3 weeks apart, above about 50 conversions a month [GAD-0007].
- A target set above what the campaign achieves shrinks its reach to almost nothing; when spend falls, cut the target firmly, not in small steps [GAD-0053].
- Since 17 August 2026, budget-limited target ROAS and CPA campaigns bid toward the stated target, so a loose old target can pull results down toward it [GAD-0004]. Re-set old targets to current profit lines.
- A hard cost-per-click cap on smart bidding exists only through portfolio bid strategies [GAD-0002].

### 8. Log every change

Each change gets one line: date, campaign, old cap, new cap, delivery rate, cost per purchase, reason, review date. Feed it to `recommendation-scorekeeping` so the store learns which cap moves paid off.

### 9. Stores with refunds, returns or pay on delivery

Build the cap from gross profit per placed order after losses from returns, refunds and failed deliveries, because Meta counts orders that are later refunded or, for pay-on-delivery orders, never paid. Without that, the cap allows sales that lose money. If a prepaid-only event exists from `store-meta-capi`, cap on it only once it reaches about 50 events a week per ad set.

## Checks before you hand it over

- The gate decision is written: why a cap, or why not.
- The cap is derived from gross profit per purchase and the factor, with the sum shown.
- The cap sits at or under the Meta-basis break-even cost per purchase.
- The budget is high enough that the cap controls delivery.
- Worst-case weekly spend is stated and within the client's limit.
- The tuning grid, read window and one-change rule are in the plan.
- Nothing goes live without a client yes; the campaign is built paused.

## Output

**Summary, one screen:** cap or no cap and why, the cap value and how it was derived, the budget, worst-case weekly spend, expected delivery range, and the first review date.

**Table "Cap derivation":** Line, Value, Source. Lines: gross profit per purchase, store target cost per purchase, factor, Meta-basis cap, Meta-basis break-even, recent 30-day cost, starting cap.

**Table "Capped campaign build":** Field, Setting (name, objective, optimisation event, attribution setting, bid control, cap, daily budget, audience, exclusions, ads by post ID, status paused).

**Table "Cap log":** Date, Campaign, Old cap, New cap, Delivery rate, Cost per purchase (Meta basis), Store-basis cost, Reason, Review date.

## Common mistakes

- **Cap from last month's cost.** It freezes whatever the account did, profitable or not. Step 1 starts from gross profit.
- **Budget too low for the cap.** The budget binds first and the cap does nothing. Step 4 sets the budget at 5 to 10 times the cap.
- **Panic after one quiet day.** Step 5 waits 3 to 4 days.
- **Reading a bid cap as a cost per purchase.** It limits each auction bid; step 3 picks the control that matches the goal.
- **Loosening the cap past break-even to get spend.** Step 1 sets a hard ceiling; low spend at a fair cap means the ads or offer must improve.
- **One cap across products with different margins.** Step 3 splits them [ADC-0022].
- **Tight Google targets.** Step 7 cuts them firmly when spend collapses [GAD-0053].

## Sources

- ADC-0022: one bid goal favours the cheapest sale.
- ADC-0038, ADC-0065: bid controls pay off mainly at high spend.
- ADC-0039: read new ads after 3 times target cost.
- ADC-0057: the bid is the store's unit economics.
- ADC-0064: daily swings are noise at low spend.
- GAD-0002: hard CPC caps only through portfolio strategies.
- GAD-0004: budget-limited targets now bid to the stated target.
- GAD-0007, GAD-0021, GAD-0053: Google target setting and its death spiral.
- MEA-0020, MEA-0026: target cost from first-order or time-bound gross profit.

What makes this skill ours: a gate that asks whether a cap fits this store before building one; a cap derived from gross profit and the store-truth factor with break-even as a hard ceiling; a spend-and-cost grid instead of guesswork; and a cap log that feeds the store's own scorekeeping.

## Selling in India

- Meta counts COD orders that are later refused. Build the cap from gross profit per placed order after the store's RTO loss, or cap on a prepaid-only event once it has enough volume.
