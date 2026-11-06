---
name: smart-bidding-strategy
description: Choose and set up the right Google Ads bid strategy for each campaign - Maximize conversions, Maximize conversion value, Target CPA or Target ROAS - based on conversion volume, value data, budget and business goal. Sets targets from recent performance and margin, accounts for the 17 August 2026 change to budget-limited target campaigns, plans changes as experiments, and writes a change request with review dates. Use when launching campaigns, when a target strategy under-spends or over-spends, when moving from clicks to conversions, or when reviewing targets.
---

# Smart Bidding strategy

## When to use

- New campaign: which strategy to start with.
- A Target CPA or Target ROAS campaign is "Limited" by budget or by bid strategy target.
- Moving from manual CPC or Maximize clicks to conversion bidding.
- Results shifted after 17 August 2026 on budget-limited target campaigns.
- Quarterly target review.

## How the options differ (as of November 2026)

- **Maximize conversions / Maximize conversion value:** spend the whole budget to get the most conversions or value. No cost control. Good when budget is the constraint and the business accepts the average cost that results.
- **Target CPA:** aims for an average cost per conversion. Some conversions cost more, some less. Too low a target skips clicks that would convert.
- **Target ROAS:** aims for an average return (conversion value divided by cost). Needs values on conversions; Google lists a minimum of 15 conversions in 30 days for Search and Shopping. A higher target narrows traffic; a lower one widens it.
- Since June 2026 Google labels these simply "Target CPA" and "Target ROAS"; behaviour did not change.
- **Since 17 August 2026,** target campaigns that are limited by budget deliver closer to their stated target. A campaign with a 10 USD target that was achieving 5 USD will now spend toward 10 USD. Google will not adjust targets for you.

## What you need

- Last 90 days by campaign: cost, conversions, conversion value, cost per conversion, ROAS, search impression share, lost impression share (budget) and (rank), bid strategy status.
- Conversion lag: how long after a click conversions usually arrive.
- Which conversion actions are primary, and whether they carry values.
- Unit economics: break-even cost per acquisition and break-even ROAS; for leads, value per qualified lead.
- Budget limits and how firm they are.
- Seasonality and planned promotions.

**Access:** level 1 for the analysis; level 2 to set up experiments without starting them; level 3 to change strategies, targets or budgets within your cap and step size. A bid strategy change is outside the limits unless your action list names it.

## Steps

### 1. Check the inputs first
If conversion goals are wrong (page views as primary, double counting) or values are missing, fix that first. Bidding optimises toward whatever is counted.

### 2. Sort campaigns by data and goal
For each campaign, note conversions in the last 30 days and whether values exist.
- **Few or no conversions:** Maximize clicks (new account) or Maximize conversions. Do not use a target yet.
- **Steady conversions, no meaningful values, cost per lead matters:** Target CPA, or Maximize conversions if budget is the real limit.
- **Values vary (different products or lead values) and at least 15 conversions in 30 days for Search or Shopping:** Maximize conversion value, then Target ROAS once stable.
- **Performance Max and Demand Gen:** same logic, with the campaign's own volume. For Demand Gen with Target CPA, Google recommends a daily budget of at least ten times the target.

### 3. Set the target from history, not hope
Start from the last 30 days' actual cost per conversion or ROAS, adjusted for conversion lag (leave out the most recent days if conversions arrive late). Compare with break-even. If actual performance is better than break-even, the target can sit between the two. If it is worse, the problem is not the bid strategy: look at traffic, ads, pages and offer.

### 4. Handle budget-limited target campaigns
For each Target CPA or ROAS campaign with "Limited by budget":
- Was it beating its target? Since 17 August 2026 it will now aim closer to the stated target.
- Options (Google's own list): keep the target if it reflects your goal; set the target to recent performance to keep results; set a custom target; switch to Maximize conversions or value to keep volume (cost will vary with budget); or raise the budget carefully, keeping it comfortably above average daily spend.
- Recommend one, with the trade-off in plain words.

### 5. Plan the change as an experiment where possible
Use a custom experiment (50/50 split) for strategy switches on Search, Display, Demand Gen or Video campaigns with enough volume (Google points Shopping and App to other experiment types). Allow 7 to 14 days for the trial arm to settle, then judge over at least one to two conversion cycles. For low-volume campaigns, make the change directly but set a review date and a rollback rule.

### 6. Change targets gently
Move targets in steps and wait one to two conversion cycles between changes. Frequent target edits keep bidding unsettled. Changing which actions are primary can also trigger up to seven days of learning, so do not combine a goal change with a target change.

### 7. Consider Smart Bidding Exploration
For Target ROAS campaigns that are not budget-constrained and where the client accepts slightly lower ROAS for more volume, Smart Bidding Exploration can find new searches within existing targeting. Google suggests turning it on at least six weeks before a peak season.

### 8. Budget guidance
Daily budgets are averages: Google may spend up to twice the daily budget on a day, with the month capped at 30.4 times. Tell the client this before they see a "double spend" day.

## Checks

- Inputs are clean (goals and values) before any strategy change.
- Each campaign's choice matches its conversion volume.
- Targets are tied to last-30-day actuals and break-even, with the maths shown.
- Every budget-limited target campaign has an explicit decision after the August 2026 change.
- Changes are spaced out and each has a review date and rollback.

## Output format

1. **Summary:** one line per campaign: current strategy, recommended strategy, target, why.
2. **Table:** campaign, conversions (30 days), value tracked (yes or no), current actual CPA or ROAS, break-even, recommended strategy and target, budget-limited (yes or no), method (experiment or direct), review date.
3. **Change request:** numbered items for approval.
4. **Risks:** learning periods, volume changes, spend swings.

## Example of good output (short)

> | Campaign | Conv. (30d) | Actual | Break-even | Now | Recommend | Method | Review |
> |---|---|---|---|---|---|---|---|
> | Search Non-brand | 84 | CPA 47 USD | 60 USD | Target CPA 70 USD, limited by budget | Target CPA 52 USD | Direct (budget-limited after 17 Aug) | 2 Dec |
> | Shopping | 41 | ROAS 4.1 | 2.5 | Max conv. value | Target ROAS 350% | Direct, roll back if ROAS under 2.8 after 2 cycles | 9 Dec |
>
> 1) Lower Non-brand Target CPA from 70 to 52 USD (since 17 Aug, budget-limited campaigns spend toward the stated target, so at 70 the cost per conversion would drift up on the same budget). 2) Move Shopping to Target ROAS 350% with the rollback rule. Reply yes or no to each.
