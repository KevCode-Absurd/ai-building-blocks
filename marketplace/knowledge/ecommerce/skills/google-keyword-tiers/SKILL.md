---
name: google-keyword-tiers
description: "Turns hundreds of Google Search keywords into six tiers (stars, earners, fixers, unproven, drains and dead weight), each with one action for the week. Every keyword lands in exactly one tier, tiers come from profit per keyword after product costs, and nothing is cut until it passes a minimum data rule. Tracks week-on-week moves between tiers, with a likely cause for each slide, and checks marginal cost before any budget goes up. Read access only; the client approves bid, budget and pause changes. Use it weekly on Search accounts with more than about 50 active keywords, or before a budget change."
---

# Keyword tiers with weekly actions

**You get:** a keyword tier table placing every Search keyword in one of six tiers by profit, a tier summary with spend and profit, and a keyword actions CSV ready for Google Ads Editor.

A Search account with hundreds of keywords hides its few earners among many that do nothing. This skill sorts keywords into a handful of tiers by the profit they make, gives each tier one action, and tracks movement each week so nothing good gets cut early and nothing bad runs for months.

## When to use

- Weekly, on Search accounts with more than about 50 active keywords; the week-on-week moves are the early warning.
- Before raising or cutting a Search budget.
- After an account takeover, to see what the keyword list is really doing.
- When the owner asks which keywords make money.

## Not for

- What shoppers typed and which terms to block: use `google-search-term-mining`.
- Low Quality Score on keywords worth keeping: use `google-quality-score-triage`.
- Shopping and Performance Max products: use `google-shopping-product-tiers`.
- Bid strategy and target settings: use `google-smart-bidding-budget`.

## What you need

Required, read access (level 1):

1. **Keyword report**, last 30 days and the 30 before, plus the last 7 and the 7 before. Columns: Keyword, Match type, Status, Campaign, Ad group, Bid strategy, Impressions, Clicks, CTR, Cost, Conversions, Conv. value, Conversions (by conv. time), Search impr. share, Search top IS, Quality Score.
2. **Gross profit per purchase**, from `store-meta-math`, by product category where margins differ.
3. **Last week's tier table**, if this is not the first run. The first run sets the baseline; moves start in week two.

Optional: keyword-to-product mapping (which page or category each keyword sells), stock status for those products, the change history for the last 14 days.

Missing input: ask once. Without gross profit, tier on cost per conversion against the account target and mark every cut "reduced confidence; do not pause yet".

## Before you start: the gates

1. **Money gate.** Gross profit per purchase known. Fail: compute it with `store-meta-math`; no keyword is cut without it.
2. **Tracking gate.** One primary purchase action with real values [MEA-0017] [MEA-0016]. Fail: fix it; tiers on doubled or missing conversions are wrong.
3. **Recency gate.** The latest 3 to 4 days are under-counted because Google credits the click date [GAD-0035]. Use conversion-time columns for the last 7 days, or end the window 4 days ago.
4. **Change gate.** If bids, targets or budgets changed in the last 14 days, mark affected keywords "in learning"; none is cut this week.

## Steps

### 1. Compute money per keyword

Over the 30-day window:

- Gross profit = conversions x gross profit per purchase (category level where margins differ).
- Profit after ads = gross profit minus cost.
- Cost per purchase = cost / conversions = cost per click / conversion rate [MEA-0019] [GAD-0038].
- Break-even cost per purchase = gross profit per purchase.

### 2. Apply the minimum data rule

A keyword can be cut only when one of these holds (practitioner default, test it):

- clicks at least 3 / the campaign's conversion rate (100 clicks at 3%) with no conversions, or
- cost at least 2x break-even cost per purchase with no conversions, or
- 60 days or more with at least 3 conversions and profit after ads below zero.

Anything else is unproven. A keyword with a real 3% conversion rate can easily show no sales in its first 30 clicks by chance, and a fixed spend line ignores the store's price and margin.

### 3. Place each keyword in one tier

Check in order; every keyword lands in exactly one tier.

| Tier | Rule | Weekly action |
|---|---|---|
| Dead weight | No impressions in 30 days, or impressions and no clicks | Pause to tidy; it costs nothing but hides the picture |
| Star | Profit after ads above zero, cost per purchase at or under 60% of break-even | Push: raise bid or budget 10 to 15% when impression share lost to budget or rank is over 10% [GAD-0023], after step 5 |
| Earner | Profit after ads above zero, cost per purchase 60 to 100% of break-even | Hold; check its search terms for waste |
| Fixer | Has conversions, profit after ads below zero but within 30% of break-even | One fix: ad relevance, landing page, or bid down 10 to 20%; send to `google-quality-score-triage` if Quality Score is under 7 |
| Drain | Passes the data rule and profit after ads clearly below zero | Lower bid 20 to 30% or move to exact match only; pause after one more cycle if no better |
| Unproven | Fails the data rule | Leave running; no bid changes, and no raises on CTR alone |

The 60% and 30% lines are practitioner defaults; set them to the client's target margin after ads.

Brand keywords are tiered in their own list: they convert far better and blend results upward [GAD-0028]. Keep brand spend small relative to the account [GAD-0024].

A star sharing an ad group with weaker keywords can get its own ad group with ads written to it, so its ads and page match exactly. Close variants make single-keyword ad groups less necessary than they once were, so do this only for stars with real volume.

### 4. Track week-on-week movement

Compare this week's tier with last week's for each keyword:

- **Moves down** matter most. Before acting, look for a cause: stock-out, price change, new rival, ad or landing page change, tracking break. A slide from star to earner after an ad rewrite points at the ad.
- **New drains** (anything that became a drain this week) top the action list.
- **Moves up** (unproven to earner, earner to star): candidates for more budget.
- **Stuck in fixer for 3 weeks:** the fix failed; treat as a drain.
- **Unproven for 8 weeks with few clicks:** low volume, not a loser.

When many keywords slide at once, make targeted fixes before any rebuild; restructuring resets learning and can start a spiral [GAD-0036].

### 5. Check the last money, not the average

Before raising budget on stars, check marginal cost: extra spend / extra purchases between the last two comparable weeks. Extra sales can cost far more than the average suggests [ADC-0049]. Stop raising where marginal cost per purchase reaches break-even.

### 6. Write the action list

One line per keyword that needs action: new max CPC or bid adjustment, match type change, pause, new ad group, or hand-off. On smart bidding, keyword bids do not apply; actions become structural (move a star to its own ad group, pause a drain) and target changes go to `google-smart-bidding-budget`.

## Checks before you hand it over

- Every keyword is in exactly one tier, built from profit after ads with the source stated.
- No keyword that fails the data rule or is in learning is cut.
- Brand and non-brand are tiered separately.
- Each move down has a likely cause, or "cause unknown" with what to check.
- Spend across tiers adds up to report spend.
- Every budget raise shows the marginal cost check.
- Nothing changes in the account without the client's yes; at level 2 changes are staged in Google Ads Editor.

## Output

**One-screen summary first:** keywords reviewed; count, spend share and profit after ads by tier; moves up, moves down, new drains and recoveries since last week; the top 10 stars and top 10 drains; this week's action count.

**Table "Keyword tiers":** Keyword, Match type, Campaign, Clicks, Cost, Conversions, Cost per purchase, Profit after ads, Data rule met, Tier this week, Tier last week, Move, Likely cause, Action.

**Table "Tier summary":** Tier, Keywords, Spend, Spend share, Gross profit, Profit after ads, Action.

**File:** `keyword-actions.csv` for Google Ads Editor (Campaign, Ad group, Keyword, Match type, Max CPC, Status).

## Common mistakes

- **Cutting on a few clicks or a fixed spend line.** Step 2 scales the bar with conversion rate and margin.
- **Losing keywords with some sales hiding in "hold".** Fixer and drain catch them.
- **Raising bids because CTR looks good.** Unproven keywords wait for sales.
- **Judging the latest days** [GAD-0035], or **mixing brand into the tiers** [GAD-0028].
- **Rebuilding after a bad week** [GAD-0036].
- **Scaling stars on average cost** [ADC-0049].

## Sources

- ADC-0049: scale on marginal, not average, cost.
- GAD-0023: raise budget 10 to 15% when spending fully on target.
- GAD-0024, GAD-0028: brand separate and small.
- GAD-0035: latest days under-report.
- GAD-0036: targeted fixes before any rebuild.
- GAD-0038, MEA-0019: cost per purchase equals cost per click over conversion rate.
- MEA-0016, MEA-0017: one primary purchase action with real values.

What makes this skill ours: tiers come from profit after ads, not ROAS, and cover every keyword; a minimum data rule that scales with conversion rate and margin protects keywords from early cuts; each slide gets a likely cause before any action; and every budget raise passes a marginal-cost check.
