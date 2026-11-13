---
name: set-ad-budget-from-profit-target
description: "Gives the most a store can spend on ads next month, split by channel and campaign, worked back from the owner's profit target and capped by cash and stock. Reads each channel on store orders, funds what worked before first, ranks the customer segments that pay back, sizes the creative the budget needs, builds the allowed cost per new customer from first-order and 90-day profit, reads how fast cost rises with spend, takes the lowest of the profit, cash and stock ceilings, and plans the whole amount with a reserve of 15% or less. Each channel gets a Scale, Hold, Trim or Cut verdict against last month and one rule read on store numbers. Use before each month, when the owner asks 'how much can we spend', before a sale month, or when cash or stock changes."
---

# Monthly ad budget from a profit target

**You get:** one budget for next month: the total ceiling and which limit set it, the split by channel with past winners funded first, the segments and creative it pays for, weekly pacing, and a verdict and one rule per channel on store numbers, ready for the owner's yes.

## When to use

- The month is about to start and nobody has said how much the ads can spend.
- The owner names a profit goal and asks what ad spend that allows.
- Cash is tight, a big stock order is due, or payouts are slow.
- A sale month is coming and spend will jump.
- Spend was set as a percent of revenue and profit fell anyway.

## Not for

- Moving money between Meta and Google inside a fixed cap: use `cross-channel-budget-reallocation`.
- Daily budgets and bids inside Meta: use `store-meta-budget`.
- A full week-by-week cash plan: use `build-13-week-cash-forecast`; this skill reads its result.
- Finding what each new customer costs by channel today: run `new-customer-cost-by-channel` first.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 6 months or more: Name, Created at, Customer Email, Subtotal, Discount Amount, Shipping, Taxes, Total, Refunded Amount, Payment Method, Lineitem sku, landing site or UTM fields. On India stores, add courier delivery status so return-to-origin (RTO) orders can be removed.
2. **Delivered cost per order**: landed cost per SKU, pick and pack, shipping, payment fees, returns and RTO.
3. **Ad spend and platform results by channel and campaign by week**, same 6 months, paused campaigns included.
4. **Fixed costs per month** and the **profit target**, from the owner.
5. **Cash**: bank balance today, payouts expected, bills and stock payments due.
6. **Stock**: units on hand and inbound per SKU that ads will push.

Optional: new-customer cost by channel, 90-day value by first-order month from `cohort-repeat-and-ltv-analysis`, the sale calendar.

If fixed costs or the profit target are missing, the plan gives the cash and stock ceilings and states one assumption line for the profit side. Changing any live budget is a separate step done by the channel agent with the owner's yes.

## Before you start: the gates

1. **Gross profit per order is known.** Pass when built from delivered cost to the customer's door [MEA-0037]; product margin is not gross margin [MEA-0023]. Fail: compute it here first.
2. **New and returning customers can be split.** Fail: plan on blended numbers, mark the budget rough, and cap any rise at current spend.
3. **Cash covers the month.** Fail: the cash ceiling decides the budget, whatever profit says.

## Steps

Follow the house rules, chiefly **Brand brain first**, **Map every signal to an asset**, **Look it up before you decide**, **Only the brief's facts run the business** and **One basis per number**. Before step 1, write the brand brain (every segment the data ranks, each with its number) and the signal-to-asset map. Run `node tools/ask-knowledge.mjs` once per signal and once per decision, logged in `context/trace.md`; every figure goes in `context/numbers.json`. Weeks count from the start of the month.

### 1. Tracking

- For each channel, use the store-vs-platform gap the brief gives; where it gives none, store new customers tagged to the channel divided by the platform's purchases. Never a midpoint between two gaps.
- Read new customers from store orders, not platform purchases. If a channel cannot be read, give it one blended line and hand off to `set-up-utm-tracking-for-all-channels`; its budget holds at current spend.

### 2. What worked before

- List the channels, campaigns and months that brought new customers at or under the allowance (step 5), paused ones included, with the spend they ran at.
- Fund those first in the split, and relaunch paused winners with fresh creative before any new channel gets money.
- Find past spend steps: marginal cost = extra spend / extra new customers between weeks. Adding 25% spend in one account kept average cost under the limit while the extra buyers cost about 2.5 times it [ADC-0049].

### 3. Audiences

- Split last month and the same month last year into first-time and returning orders [MEA-0055]. Returning profit is the base the store earns with little ad spend; forecast it from cohort decay: each cohort's size x its repeat rate at that age x returning gross profit [MEA-0022]. Do not use Shopify's returning customer rate; it moves when acquisition slows [MEA-0014].
- Rank the new-customer segments the data shows (first product, channel, region, age band where given) on 90-day gross profit per customer. Name the winner; the channels and campaigns that reach it get money first.
- Existing-customer ads are set in money: customers x monthly frequency x CPM / 1,000 [ADC-0068].

### 4. Formats and messaging

- Name the format and message that bring new customers at the lowest store-basis cost on each channel. The budget pays for more of that style first.
- Creative volume is part of the budget: each new ad needs about 3 times the target cost to be judged, so ads needed a week = weekly new-ad spend / (3 x target cost) [ADC-0039]. If the team cannot make that many, lower the channel's line to what its creative can feed.

### 5. Budget

The plan uses the whole budget it sets (house rule **Spend plans add up**).
- **Required contribution from new customers** = profit target + fixed costs - returning gross profit. If zero or less, ads only need to pay back inside the month.
- **Allowed cost per new customer** = first-order gross profit after refunds [MEA-0020], unless cohorts at least 90 days old show 90-day gross profit [MEA-0048]; then up to half of that, if higher. Ratio bands: under 1 loses money, 1 to 2 needs proven repeat, 2 to 3 is the zone to scale [MEA-0024]. Never fund cost with repeat profit the store has not seen [MEA-0026]. Sale-month buyers can repeat less, so set them a lower allowance [MEA-0035].
- **Profit ceiling** = spend where marginal cost reaches the allowance, or the spend that delivers the required contribution, whichever is lower. With no spend history, plan steps of 20 to 30% a fortnight (practitioner default).
- **Cash ceiling**: list weeks with opening cash, payouts (card payouts lag by days; COD remittances in India often by a week or more), stock payments, bills and ad spend. The most spend that keeps every week above the owner's floor. Judge rises on 60 to 180-day cash [FIN-0029]; stock-funded growth can push profit near zero [FIN-0011]. India: GST on ad spend billed in India counts as cash out.
- **Stock ceiling**: no push on a SKU with fewer days of stock than lead time [ADC-0023]. Hold winners at a steady spend when stock is short; push harder when stock must clear [ADC-0012].
- **Monthly ceiling** = lowest of the three; name the one that binds.
- **Split**: existing-customer ads in money; past winners next; then each proven channel in order of marginal cost until it reaches the allowance; new ads about 30% when profitable, 10% or none when not [ADC-0053]. A reserve is at most 15%, with a release rule the account will hit in the month, such as "release in Week 3 to the channel whose store-basis cost stayed under the allowance for two weekly reads".
- **Pacing**: split the month by last year's weekly order share, not evenly.

### 6. Verdicts

One label per channel against last month's spend, matching its number:
- **Scale** (up): marginal cost under the allowance, stock and cash allow it.
- **Hold** (same): marginal cost near the allowance, or not readable.
- **Trim** (lower, above zero): marginal cost above the allowance on the last step, or a ceiling binds.
- **Cut** (zero): store-basis cost above the allowance for the whole period with no feeder role.

### 7. Rules

One rule per channel, in one line, on store new customers, never on platform cost alone. For example: "Hold at current spend if the 7-day store-basis cost per new customer is above the allowance for two weekly reads; Scale one step when it is under for two." Judge small accounts on 7 days or more [ADC-0064].

### 8. Hand over

- Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` and fix every FAIL. Channel lines add to the ceiling.
- Rank changes leverage first: relaunched past winners and the cheapest marginal channel first.
- Tests appear only when the brief asks or tracking cannot answer; a new channel goes through `test-a-new-ad-channel` with its own capped loss.

## Checks before you hand it over

- Each channel is read on store new customers with a gap from the brief or store orders.
- Past winners, paused ones too, are funded first.
- Returning profit and new-customer profit are separate lines; the winning segment is named.
- The creative count matches what the budget needs.
- All three ceilings show, the binding one is named, and the ceiling uses marginal cost.
- The whole budget is planned; any reserve is 15% or less with a release rule.
- Each verdict label matches its number; each channel has one rule.
- Weekly cash never drops below the owner's floor.

## Output

**One-screen summary:** total ceiling and the limit that set it, allowed cost per new customer, expected new customers, profit against target, and the one risk.

**Each decision in two lines:** what to do, and why with one number.

**Table "Ceilings":** Ceiling, Amount, What sets it.

**Table "Channel plan":** Channel, Last month, Next month, Verdict, Rule. A total row equals the ceiling.

**Table "Cash by week":** Week, Cash in, Cash out, Closing cash, Floor.

**Budget sheet** (`ad-budget-<month>.csv`) with the inputs, cohort working, stock check and weekly pacing.

## Common mistakes

- **Budget as a percent of revenue.** Step 5 works back from profit.
- **Average cost per customer.** Step 2 reads marginal cost.
- **Counting repeat profit that has not happened.** Step 5 uses only old enough cohorts.
- **Ignoring cash timing.** Step 5 checks each week.
- **Money with no creative to spend it on.** Step 4 sizes creative to the budget.
- **A big unspent reserve.** Step 5 caps it at 15% with a release rule.

## Sources

- MEA-0014: Shopify's returning customer rate moves with acquisition.
- MEA-0020: time-bound gross profit sets cost targets.
- MEA-0022: returning revenue from cohort decay.
- MEA-0023: product margin is not gross margin.
- MEA-0024: gross profit to cost bands.
- MEA-0026: first-order contribution at or above cost.
- MEA-0035: sale-month cohorts can repeat less.
- MEA-0037: delivered cost.
- MEA-0048: rank only on cohorts old enough.
- MEA-0055: split first-time and returning P&Ls.
- ADC-0012: push or hold winners by stock and cash.
- ADC-0023: tie spend to days of stock.
- ADC-0039: judge an ad after 3 times target cost.
- ADC-0049: marginal, not average, cost.
- ADC-0053: proven versus new share.
- ADC-0064: read 7 days at low spend.
- ADC-0068: existing-customer spend in money.
- FIN-0011: stock-funded growth squeezes profit.
- FIN-0029: judge changes on 60 to 180-day cash.

What makes this skill ours: the budget is the lowest of three ceilings with the binding one named, past winners are funded first, returning profit is kept apart so ads are not credited with it, and the creative the money needs is part of the plan.
