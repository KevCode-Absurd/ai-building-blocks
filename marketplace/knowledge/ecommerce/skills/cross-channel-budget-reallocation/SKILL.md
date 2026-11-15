---
name: cross-channel-budget-reallocation
description: "For a store running Meta and Google under one fixed monthly cap: decides how the cap splits and which campaigns give and receive money, judged on store-side contribution (gross profit after ad spend), not platform ROAS. Puts both channels on one store basis, relaunches past winners first, ranks audience segments and the formats and messages that earn, reads the cost of the last extra sales, gives every campaign a Scale, Hold, Trim or Cut verdict that matches its number, plans the whole cap with a reserve of 15% or less, sets one rule per campaign and a move plan by day with limits on how fast money moves, a range on the gain, and a cash check. Use monthly, when one channel looks stronger, when cash is tight, or before a sale."
---

# Split one ad budget between Meta and Google by profit

**You get:** a Meta and Google split of one fixed monthly budget, judged on store gross profit after ads, with past winners relaunched, the winning segments and formats funded, a verdict and one rule per campaign, a move plan by day, and the expected gain with its range.

The cap stays the same. This skill decides how much goes to each channel, which campaigns give or receive money, and how fast. The platform skills then set bids and learning-safe settings inside each platform.

## When to use

- Monthly planning for a store spending on both Meta and Google with a fixed total.
- One channel "looks better" in its own dashboard and the owner wants to shift money.
- Cash is tight and the same total must work harder.
- A product is running out, or slow stock must turn into cash, and both channels sell it.
- Before a sale period.

## Not for

- Only Google in scope: use `google-smart-bidding-budget`.
- Only Meta in scope: use `store-meta-budget`.
- Raising the total: use `scale-readiness-check`.
- Proving a channel causes sales at all: use `blended-channel-profit-view`.

## What you need

Required (read access, level 1):

1. **Meta Ads Manager export**, last 28 and 7 days, campaign and ad set level, paused included, with age, gender, region and placement breakdowns: Attribution setting, Amount spent, Purchases, Purchase value, Cost per purchase, Frequency, Delivery, Budget.
2. **Google Ads campaign report**, same windows: Campaign type, Bid strategy, Target, Budget, Cost, Conversions, Conv. value, Search lost IS (budget and rank), and "Conversions (by conv. time)".
3. **Shopify order export**, same dates, with landing site or UTM fields and Customer Id.
4. **Money lines** from `store-meta-math`: gross profit per purchase by product group, break-even and target cost per purchase.
5. **The monthly cap, cash on hand for ads**, and SKUs to protect or clear.

Optional: post-purchase survey answers, stock cover per SKU, the creative log by format and angle.

Access: level 1 for analysis, level 2 to draft edits. Every live change needs the client's explicit yes, asked in your message, or written level 3 limits.

## Before you start: the gates

1. **Gross profit per purchase known per product group.** Fail: stop. Without it, "strong" means "high ROAS", which can be the least profitable campaign [ADC-0022].
2. **Cash and the cap stated.** Fail: plan only Trims and Cuts until both are written down.
3. **Each channel can be read on store orders.** Fail on one channel: hold its budget, move money only inside the trusted channel, and send the broken one to `store-meta-capi` or `google-ads-account-audit`.

## Steps

Follow the house rules, chiefly **Org context first**, **Map every signal to an asset**, **Look it up before you decide**, **Only the brief's facts run the business** and **One basis per number**. Before step 1, write the org context (every segment the data ranks, each with its number) and the signal-to-asset map. Run `node tools/ask-knowledge.mjs` once per signal and once per decision, logged in `context/trace.md`; every figure goes in `context/numbers.json`. Days count from the start of the plan.

### 1. Tracking

- Use the store-vs-platform gap the brief gives, per campaign where given. Never average two gaps into a midpoint.
- Where none is given: Meta on 7-day click, not view credit [MEA-0042]; Google as store orders with Google UTMs or gclid divided by Google's purchases, per campaign type, counting one primary purchase action [MEA-0017]. Add both channels' 28-day purchases and divide by paid store orders; above 1 means both claim the same orders.
- Branded search gets its own line; it collects demand other channels made [GAD-0003]. Read Google's last 3 to 4 days on conversion-time columns [GAD-0035].
- Store-basis purchases = platform purchases x gap. Contribution = store-basis purchases x the product group's own gross profit, minus spend. A low-margin bestseller can top the ROAS table and earn the least [ADC-0022]. Leave sale weeks out of the read, or read them apart.

### 2. What worked before

- List every campaign and ad set on both channels, paused included, that earned positive contribution at meaningful spend. Note why each stopped.
- Relaunch these first with fresh creative in the same concept; they are the first receivers of freed money. Relaunching old winners cut acquisition cost in one large account [ADC-0013].

### 3. Audiences

- Rank the segments the data splits (Meta age band, region, placement; Google campaign type and query theme; new versus returning) on store-basis contribution. Name the winner on each channel; it gets its own campaign, ad set or creative.
- No age or interest floor the data does not support.
- Mark new-customer share where Shopify allows; acquisition is what the budget buys [MEA-0039]. Retargeting and catalog move last and only down; their ROAS is the most inflated [ADC-0010].

### 4. Formats and messaging

- Name the formats and messages that earn the most contribution per unit of spend on each channel (Meta: video, static, creator; Google: search themes, shopping, video).
- Receivers need creative to absorb money: each new Meta ad needs about 3 times target cost to be judged [ADC-0039], so name how many proven-style ads the new budget needs. When a few ads hold most spend, the account is exposed when they tire [ADC-0014].

### 5. Budget

The plan uses the whole cap (house rule **Spend plans add up**).
- For each campaign with a budget change in the last 60 days: marginal cost per purchase = extra spend / extra store-basis purchases [ADC-0049]. With no change to compare, mark "marginal unknown" and treat it as average plus 25% (practitioner default).
- Channel split: money goes first to the cheaper marginal sale, past winners first. No fixed channel floor unless a holdout from `blended-channel-profit-view` shows one channel feeds the other.
- Freed money goes the same day to proven receivers where tracking works. What cannot move inside the step limits sits in a reserve of at most 15%, with a release rule the account will hit this month. If no campaign qualifies, freed money goes to relaunched winners and new ads in the proven style, not to Hold campaigns.
- New ads about 30% of Meta money when profitable, 10% or none when not [ADC-0053].
- Move limits (practitioner defaults, test them): no more than 20% of the cap moves in a week. Meta receivers rise 20 to 30% every 3 to 4 days; no Meta source fixes a raise size [ADC-0056]. Google rises 10 to 15% when spending its full budget at target; under 80% and missing target, loosen the target instead [GAD-0023]. Cuts happen in one step; prefer targeted fixes to rebuilds [GAD-0036].
- Cash: cash needed = (daily ad spend + daily landed cost of reorders) x days until order cash lands [FIN-0011]. If the peak week needs more than stated, slow the moves until it fits. Stores with pay-on-delivery orders or high returns use gross profit per placed order after failed-delivery and return losses.

### 6. Verdicts

Use at least 14 days, 28 when daily spend is under about 1,000 [ADC-0064]. One label per campaign, matching its number in every table:

| Verdict | Means | When |
|---|---|---|
| Scale | Budget up | Contribution positive, marginal cost at least 15% under break-even, cover longer than lead time |
| Hold | Same budget | Marginal cost within 15% of break-even, under 14 days of data, or in learning |
| Trim | Lower, above zero | Contribution negative over 14 days but improving, or feeding others (brand, cheap email capture) [MEA-0043] |
| Cut | Zero | Contribution negative over 28 days, not improving, no feeder role, after 3 times target spend [ADC-0039] |

Exceptions win over the table: clearance stock is judged at break-even [FIN-0026], and cutting it when stock squeezes cash can make cash worse [FIN-0027]; a stock-short SKU is Trimmed or Cut even when profitable [ADC-0023].

### 7. Rules

One rule per campaign, in one line, on store-basis numbers, never on platform cost alone. Cut lines are multiples of the store's target cost, never fixed amounts. For example: "Scale 20% every 3 to 4 days while store-basis marginal cost stays 15% under break-even; return to the old budget if it passes break-even."

### 8. Add up and hand over

- Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` and fix every FAIL. Rows add to the cap.
- Expected gain: extra gross profit = extra spend / marginal cost x gross profit per purchase, minus extra spend, plus losses saved by Cuts. Give one base figure with its range (break-even marginal cost at the low end) in one line. Never project at today's ROAS.
- Move plan by day, leverage first: Day 1 Cuts, Trims and relaunched winners; then Scale steps in order of marginal contribution; re-read every receiver after 7 days.
- Tests appear only when the brief asks or tracking cannot answer.

## Checks before you hand it over

- Each campaign's gap comes from the brief or store orders, never a midpoint.
- Past winners on both channels are relaunched first or have a one-line reason.
- Segments are ranked; the winner on each channel is funded; no unsupported age floor.
- Receivers have enough proven-style creative named.
- The whole cap is planned; any reserve is 15% or less with a release rule.
- Every verdict label matches its number; each campaign has one rule.
- Weekly moves stay under the limit; peak cash fits.

## Output

**Summary, one screen:** split now and proposed, money moving, expected monthly gain with its range, and the limit that binds.

**Each decision in two lines:** what to do, and why with one number.

**Table "Campaigns":** Campaign, Now a day, New a day, Verdict, Rule. A total row equals the cap.

**Table "Move plan":** Day, Campaign, Change, Undo step, Review day.

**Appendix** `budget-reallocation.csv`: gaps, contribution, marginal cost and cover per campaign.

## Common mistakes

- **Moving money to the best-looking ROAS.** Step 1 puts both channels on the store basis.
- **Leaving paused winners out.** Step 2 relaunches them first.
- **Average cost hiding a bad last raise.** Step 5 reads marginal cost [ADC-0049].
- **Freed money left idle.** Step 5 sends it to proven receivers, with at most 15% held.
- **A Cut label on a campaign that still spends.** Step 6 ties labels to numbers.

## Sources

- ADC-0010: catalog retargeting ROAS is inflated.
- ADC-0013: relaunching old winners.
- ADC-0014: spend concentrates on few ads.
- ADC-0022: maximise conversions favours the cheapest sale.
- ADC-0023: tie spend to stock cover.
- ADC-0039: judge after 3 times target cost.
- ADC-0049: marginal, not average, cost.
- ADC-0053: proven versus new split.
- ADC-0056: no Meta source for a fixed raise.
- ADC-0064: daily swings are noise at low spend.
- FIN-0011, FIN-0026, FIN-0027: cash limits growth; clearance at break-even; cutting media can hurt cash.
- GAD-0003: brand inflates blended Google ROAS.
- GAD-0023: Google raise steps.
- GAD-0035: Google credits the click date.
- GAD-0036: targeted fixes before rebuilds.
- MEA-0017: one primary purchase conversion.
- MEA-0039, MEA-0042, MEA-0043: new-customer efficiency, click-based reporting, feeder channels.

What makes this skill ours: one store basis for Meta and Google so neither grades its own homework, past winners relaunched before new bets, the whole cap planned with labels that match their numbers, and stock and cash checks before any money moves.
