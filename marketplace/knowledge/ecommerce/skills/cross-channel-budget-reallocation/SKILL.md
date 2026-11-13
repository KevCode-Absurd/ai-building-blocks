---
name: cross-channel-budget-reallocation
description: "For a store that runs both Meta and Google under one fixed monthly cap: decides how the cap splits between the two channels and which campaigns give and receive money, judged on store-side contribution (gross profit after ad spend) and cash, not platform ROAS. Puts both channels on one store basis, reads the cost of the last extra sales, marks each campaign scale, hold, reduce or stop, checks concentration and test share, then writes a phased move plan with limits on how much moves at once, three outcome scenarios and a cash check. Platform settings go to the Meta and Google budget skills. Use monthly, when one channel looks stronger, when cash is tight, or before a sale."
---

# Split one ad budget between Meta and Google by profit

**You get:** a proposed Meta and Google split of one fixed monthly budget, judged on store gross profit after ads, with campaign marks, a dated move plan with undo steps, and low, base and high scenarios.

The monthly cap stays the same. This skill decides how much of it goes to each channel and which campaigns give money or receive it, in what order and how fast, so the store ends the month with more gross profit and no shock to either account. It works one level above the platform skills: it sets the split and the moves; they set bids, targets and learning-safe settings inside each platform.

## When to use

- Monthly budget planning for a store spending on both Meta and Google with a fixed total.
- One channel "looks better" in its own dashboard and the owner wants to shift money to it.
- Cash is tight and the same total must work harder.
- A product is running out of stock, or slow stock needs to turn into cash, and campaigns on both channels sell it.
- Before a sale period, to set where the money sits going in.

## Not for

- Only Google in scope, or setting Google targets and campaign budgets: use `google-smart-bidding-budget`.
- Only Meta in scope, or Meta bids, learning and existing-customer spend: use `store-meta-budget`.
- Raising the total: use `scale-readiness-check`.
- Proving that a channel causes sales at all: use `blended-channel-profit-view` and its holdout test.

## What you need

Required (read access, level 1):

1. **Meta Ads Manager export**, last 28 and last 7 days, campaign level: Campaign name, Attribution setting, Amount spent, Purchases, Purchases conversion value, Cost per purchase, Frequency, Delivery status, Budget.
2. **Google Ads campaign report**, same windows: Campaign, Campaign type, Bid strategy, Target ROAS or CPA, Budget, Cost, Conversions, Conv. value, Search lost IS (budget), Search lost IS (rank), and "Conversions (by conv. time)" for the last 7 days.
3. **Shopify order export**, same dates: Name, Created at, Subtotal, Discount Amount, Shipping, Refunded Amount, Payment Method, Customer Id, and landing site or UTM fields.
4. **Money lines** from `store-meta-math`: gross profit per purchase by product group, break-even and target cost per purchase.
5. **Store-truth factor per channel**: Meta's from `store-meta-attribution`; Google's from step 1.
6. **The monthly cap and cash on hand for ads**, and SKUs to protect or clear.

Optional: post-purchase survey answers, stock cover per SKU, the sale calendar.

If an input is missing, ask once. If Google's factor cannot be built, use Google's own numbers at reduced confidence and say so in the summary.

Access: level 1 for all analysis. Level 2 to draft budget edits. Every live change needs an explicit client yes, or written level 3 limits.

## Before you start: the gates

1. **Gross profit per purchase known per product group.** Fail: stop. Without it, "strong" means "high ROAS", which can be the least profitable campaign [ADC-0022].
2. **Cash and the cap stated.** Fail: plan only reductions and stops until both are written down.
3. **Tracking trustworthy per channel.** Pass when each platform's purchases sit within a stable, explained ratio of store orders. Fail on one channel: freeze its budget, reallocate only inside the trusted channel, and send the broken one to `store-meta-capi` or `google-ads-account-audit`.

## Steps

### 1. Put both channels on the store's basis

Add Meta purchases and Google conversions for 28 days and divide by store orders from paid traffic: above 1 means both claim the same orders.

- Meta: report on 7-day click, not the default with view credit [MEA-0042].
- Google: store orders with Google UTMs or gclid divided by Google's purchase conversions, per campaign type, practitioner default. Count only the one primary purchase action [MEA-0017].
- Branded search gets its own line; it collects demand other channels made [GAD-0003].

Store-basis purchases = platform purchases x factor. Never compare channels on their own reported ROAS; each grades its own homework.

### 2. Work out contribution per campaign

Contribution = store-basis purchases x gross profit per purchase for that product group, minus spend. Use the product group's own gross profit; a campaign selling a low-margin bestseller can top the ROAS table and earn the least [ADC-0022]. Mark new-customer share where Shopify allows; acquisition is what the budget buys [MEA-0039].

Leave sale weeks out of the read window, or read them separately: promotions change conversion rate and order value, so they say little about a normal week.

### 3. Read the last money, not the average

For each campaign with a budget change in the last 60 days: marginal cost per purchase = extra spend / extra store-basis purchases. An average under break-even can hide a last raise that bought sales above it [ADC-0049]. With no change to compare, mark "marginal unknown" and treat it as average plus 25%, practitioner default. Read Google's last 3 to 4 days on conversion-time columns [GAD-0035].

### 4. Mark each campaign

Use at least 14 days, 28 when daily spend is under about 1,000 [ADC-0064].

| Mark | Rule |
|---|---|
| Scale | Contribution positive, marginal cost at least 15% under break-even, stock cover longer than lead time, not held back by learning |
| Hold | Contribution positive but marginal cost within 15% of break-even, under 14 days of data, or in learning |
| Reduce | Contribution negative over 14 days, but improving week on week or feeding others (brand, cheap email capture, launches) [MEA-0043] |
| Stop | Contribution negative over 28 days, not improving, no feeder role, and spend of at least 3 times the target cost per purchase [ADC-0039] |

Cut lines are multiples of the store's target cost per purchase, never fixed amounts like "200 spent with no sale": a fixed amount is too strict for a high-price store and too loose for a cheap one.

Exceptions, which win over the table:
- **Clearance** campaigns on slow C and D stock are judged at break-even or a small loss [FIN-0026]; when stock is squeezing cash, cutting media can make cash worse [FIN-0027].
- **Stock-short SKUs**: reduce or pause when days of cover fall below reorder lead time, even if profitable [ADC-0023].
- **Retargeting and catalog** campaigns move last and only down; their ROAS is the most inflated [ADC-0010].

### 5. Decide the channel split, then check shape

Channel split: add the extra contribution each channel's scale campaigns can earn at their marginal cost; money goes first to the channel with the cheaper marginal sale. No fixed floor such as "never under 30% on a channel"; floors only where a holdout from `blended-channel-profit-view` shows one channel feeds the other.

Then check the shape of the plan:
- **Concentration:** flag any campaign over 60% of the cap, practitioner default. Under budget optimisation a few ads can hold most of the spend, which leaves the account exposed when they tire [ADC-0014].
- **Test share:** keep about 30% of Meta money for tests when profitable, 10% or none when not [ADC-0053].
- **No receivers:** if no campaign qualifies to scale, the freed money stays unspent and the job goes to creative (`store-meta-concepts`), not to hold campaigns.

### 6. Set the move limits

Practitioner defaults, test them against the account's own history:
- Total moved per week: no more than 20% of the cap.
- Meta: raise a receiver 20 to 30% every 3 to 4 days; the 20% rule itself has no Meta source [ADC-0056].
- Google: raise 10 to 15% when spending 100% of budget at target; under 80% and missing target, loosen the target instead [GAD-0023].
- Cuts happen in one step; prefer targeted cuts to rebuilds, which reset learning [GAD-0036].
- After a move, no other edit to that campaign for 72 hours. If its marginal cost passes break-even after the read window, return it to the old budget.

### 7. Write the phased plan

- **Phase 1, days 1 to 3:** stops and reductions; this frees the money.
- **Phase 2, days 4 to 14:** add to scale campaigns in steps, in order of marginal contribution.
- **Phase 3, day 15 on:** re-read marginal cost on every receiver; stop adding where it reaches break-even.

A "projection only" run stops here and shows the plan without any change, for an owner or partner to review first.

### 8. Write three scenarios

For each receiver, apply three marginal costs to the extra spend: low (at break-even, zero added profit), base (today's marginal cost), high (today's improved by 10%, practitioner default). Never project extra revenue as extra spend times today's ROAS; returns fall as spend rises.

Extra gross profit = extra spend / marginal cost x gross profit per purchase, minus extra spend. Add the losses saved in phase 1. Label these as planning numbers, not a forecast.

### 9. Check cash

Cash needed = (daily ad spend + daily landed cost of units to reorder) x days until order cash lands. Growth that outruns this cycle has pushed stores to near zero profit [FIN-0011]. If the peak week needs more than the cash stated, cut phase 2 until it fits.

### 10. India and cash-on-delivery stores

Use gross profit per placed order after return-to-origin losses from `store-meta-math`, because both platforms count COD orders that never pay. COD cash can land 7 to 15 days after delivery, practitioner default; check the courier contract. GST stays outside revenue.

## Checks before you hand it over

- Total proposed spend is at or under the cap, and the table adds up.
- Every campaign has one mark and the rule that set it; cut lines are multiples of target cost.
- Contribution uses the product group's own gross profit, on the store basis, with the factor shown.
- No money moves into a campaign with stock cover below lead time or broken tracking.
- Weekly moved money stays under the limit; concentration and test share are checked.
- Scenarios use marginal cost, with the method written out.
- Peak cash need fits the cash stated.
- Nothing is marked done; every change waits for a client yes.

## Output

**Summary, one screen:** channel split now and proposed, money moving (amount and share of cap), expected change in monthly contribution (low, base, high), the binding limit (profit, stock, cash or tracking), and the first three changes to approve.

**Table "Campaign marks":** Channel, Campaign, Spend 28 days, Platform ROAS, Factor, Store-basis purchases, Gross profit per purchase, Contribution, Marginal cost per purchase, Break-even cost, Trend, Days of cover versus lead time, Mark, Rule, Current daily budget, New daily budget.

**Table "Move plan":** Phase, Date, Channel, Campaign, Change, Amount, Hand-off skill, Undo step, Review date.

**Table "Scenarios":** Scenario, Marginal cost used, Extra purchases, Extra gross profit, Saved losses, Net monthly change.

**File:** `budget-reallocation.csv` or a Google Sheet with the inputs editable.

## Common mistakes

- **Moving money to the best-looking ROAS.** Branded search and catalog retargeting top every table. Steps 1 and 4 put them on the store basis and move them last.
- **Average cost hiding a bad last raise.** Step 3 reads marginal cost [ADC-0049].
- **Fixed-amount kill rules.** Step 4 ties cuts to the store's target cost [ADC-0039].
- **Projecting at today's ROAS.** Step 8 uses marginal cost.
- **Spending freed money because it is "in the budget".** Step 5 sends it to creative when nothing qualifies.
- **Cutting clearance stock ads to save cash.** That can deepen the cash hole [FIN-0027].

## Sources

- ADC-0010: catalog retargeting ROAS is inflated.
- ADC-0014: spend concentrates on few ads under budget optimisation.
- ADC-0022: maximise-conversions favours the cheapest sale.
- ADC-0023: tie ad spend to stock cover.
- ADC-0039: judge after spend of 3 times target cost.
- ADC-0049: scale on marginal, not average, cost.
- ADC-0053: proven versus test split.
- ADC-0056: the 20% raise rule has no Meta source.
- ADC-0064: daily swings are noise at low spend.
- FIN-0011, FIN-0026, FIN-0027: cash limits growth; clearance at break-even; cutting media can hurt cash.
- GAD-0003: brand inflates blended Google ROAS.
- GAD-0023: Google raise steps by budget use.
- GAD-0035: Google credits the click date.
- GAD-0036: targeted fixes before rebuilds.
- MEA-0017: one primary purchase conversion in Google.
- MEA-0039, MEA-0042, MEA-0043: new-customer efficiency, click-based reporting, feeder channels.

What makes this skill ours: one store basis for Meta and Google so neither grades its own homework; contribution from each product group's own gross profit; cut lines as multiples of the store's target cost and scale tests on the cost of the last sales; and stock and cash checks before any money moves.
