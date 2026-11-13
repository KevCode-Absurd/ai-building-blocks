---
name: set-ad-budget-from-profit-target
description: "Gives the most a store can spend on ads next month, split by channel, worked back from the owner's profit target and then capped by cash in the bank and stock on hand. Builds gross profit per order from delivered costs, splits returning-customer profit from new-customer profit, sets an allowed cost per new customer from first-order and 90-day profit, reads how fast that cost rises as spend grows, and takes the lowest of the profit, cash and stock ceilings. Ends with a channel split, weekly pacing and stop lines the owner approves. Use before each month starts, when the owner asks 'how much can we spend', before a sale month, or when cash or stock changes."
---

# Monthly ad budget from a profit target

**You get:** one budget sheet for next month: the total ad ceiling, the ceiling by channel (Meta, Google, TikTok and any test), weekly pacing, and the stop line for each, with the profit, cash and stock maths that set it, ready for the owner to approve.

## When to use

- The month is about to start and nobody has said how much the ads can spend.
- The owner names a profit goal ("I need 3 lakh profit" or "$20k profit") and asks what ad spend that allows.
- Cash is tight, a big stock order is due, or payouts are slow.
- A sale month is coming and spend will jump.
- Spend was set as a percent of revenue and profit fell anyway.

## Not for

- Moving money between Meta and Google campaigns inside a fixed cap: use `cross-channel-budget-reallocation`.
- Setting daily budgets and bids inside Meta: use `store-meta-budget`.
- A full week-by-week cash plan: use `build-13-week-cash-forecast`; this skill reads its result.
- Finding what each new customer costs by channel today: run `new-customer-cost-by-channel` first and feed its table in here.

## What you need

Required (read access, level 1):

1. **Shopify order export**, last 6 months or more: Name, Created at, Customer Email, Subtotal, Discount Amount, Shipping, Taxes, Total, Refunded Amount, Payment Method, Lineitem sku, Lineitem quantity. On India stores, add the delivery status from the courier panel so return-to-origin (RTO) orders can be removed.
2. **Delivered cost per order**: landed cost per SKU, pick and pack, shipping, payment fees, returns and RTO. If `build-sku-profit-sheet` or `store-meta-math` has run, use its gross profit per order.
3. **Ad spend by channel by week**, same 6 months, from each ads manager export.
4. **Fixed costs per month** (salaries, rent, software, agency fees) and the **profit target** for the month, from the owner.
5. **Cash**: bank balance today, payouts expected, bills and stock payments due next month.
6. **Stock**: units on hand and inbound with dates, per SKU that ads will push.

Optional: the new-customer cost table from `new-customer-cost-by-channel`, 90-day value by first order month from `cohort-repeat-and-ltv-analysis`, and the sale calendar.

If fixed costs or the profit target are missing, ask once; without them, give the cash and stock ceilings only and say the profit ceiling is open. No access above level 1 is needed. Changing any live budget is a separate step done by the channel agent with the owner's yes.

## Before you start: the gates

1. **Gross profit per order is known.** Pass when it is built from delivered cost to the customer's door, not product cost against price [MEA-0037]. A tee with a 70% product margin had 24% true gross margin after freight, shipping, fees and allowances [MEA-0023]. Fail: compute it here from the order export and costs, or stop.
2. **New and returning customers can be split.** Shopify's customer type or first order date per email must work. Fail: plan on blended numbers, mark the budget "rough", and cap any increase at the current spend.
3. **Cash covers the month.** Pass when the cash forecast stays above the owner's floor in every week with the planned spend. Fail: the cash ceiling decides the budget, whatever profit says.
4. **Tracking is good enough to read new customers by channel.** Fail: set one blended budget and hand off to `set-up-utm-tracking-for-all-channels` before a channel split next month.

## Steps

### 1. Build the base month without new paid customers

From the order export, split last month and the same month last year into first-time and returning orders [MEA-0055]. Returning customer gross profit is the base the store earns with little ad spend. Do not use Shopify's returning customer rate for this; it moves when acquisition slows [MEA-0014]. Forecast next month's returning profit from cohort decay: each past cohort's size x its repeat rate at that age x returning order gross profit [MEA-0022].

### 2. Work back the contribution the ads must deliver

Required contribution from new customers = profit target + fixed costs - returning customer gross profit.

If that number is zero or negative, the target is met by the base and ads only need to pay back inside the month. If it is large, it sets how many new customers are needed:

New customers needed = required contribution / (first-order gross profit - allowed cost per new customer).

### 3. Set the allowed cost per new customer

- First-order gross profit per new customer from the export, after refunds [MEA-0020].
- 90-day gross profit per new customer, only from cohorts at least 90 days old [MEA-0048].
- Read the ratio of time-bound gross profit to new-customer cost: under 1 loses money, 1 to 2 needs proven repeat, 2 to 3 is the zone to scale [MEA-0024].

Rule: allowed cost per new customer = first-order gross profit, unless cohort data shows 90-day profit; then up to 90-day gross profit / 2 if that is higher. Never fund a cost above first-order profit with repeat profit the store has not yet seen [MEA-0026]. Set a separate, lower allowance for a November or Diwali month, because sale-month buyers can repeat less [MEA-0035].

### 4. Read how cost rises with spend

Plot weekly ad spend against weekly new customers for the last 12 to 26 weeks. The cost of the last extra customers, not the average, decides the ceiling: adding 25% spend in one account kept average cost under the limit while the extra buyers cost about 2.5 times the limit [ADC-0049].

- Find the weeks where spend stepped up. Marginal cost = extra spend / extra new customers.
- Stop the budget where marginal cost reaches the allowed cost from step 3.
- If spend never varied, plan in steps of about 20 to 30% a fortnight and read each step (practitioner default, test it).

Profit ceiling = the spend at which marginal cost per new customer hits the allowance, or the spend that delivers step 2's contribution, whichever is lower.

### 5. Set the cash ceiling

Ad spend leaves the bank before order money arrives. List next month by week: opening cash, payouts (card payouts lag sales by days; COD remittances in India often lag by a week or more, check the courier's cycle), stock payments, bills, ad spend. Cash ceiling = the most spend that keeps every week above the owner's floor. Inventory-funded growth can push net profit near zero even while revenue triples [FIN-0011], so judge any increase on 60 to 180-day cash, not 30 days [FIN-0029].

India note: Meta and Google charge GST on ad spend billed in India; include it in cash out and ask the accountant whether the store can claim input credit.

### 6. Set the stock ceiling

For each SKU the ads push: days of stock = units available / daily units sold. If days of stock are fewer than the reorder lead time, do not plan spend to push it; raise its target or pause it [ADC-0023]. Stock ceiling = spend that sells no more than the units on hand and arriving before the month ends. When stock is short, hold winners at a modest steady spend to last; when excess stock must clear, push harder at worse efficiency [ADC-0012].

### 7. Take the lowest ceiling and split by channel

Monthly ceiling = lowest of profit, cash and stock. Write which one bound it.

Split:

1. **Existing-customer ads** in money, not percent: customers x desired monthly frequency x CPM / 1,000 [ADC-0068].
2. **Each proven channel** gets spend in order of its marginal new-customer cost from `new-customer-cost-by-channel`, until its cost reaches the allowance.
3. **Tests**: about 70% proven and 30% tests when the store is profitable; 90/10 or none when it is not [ADC-0053]. A new channel test goes through `test-a-new-ad-channel` with its own capped loss.

### 8. Pace it and write stop lines

Weekly pacing: split the month by last year's weekly order share, not evenly. Per channel, write the weekly read: new customers from store orders, cost per new customer, contribution after ads. Stop line: if the 7-day cost per new customer is above the allowance for two weekly reads, hold at current spend and re-run step 4. Judge small accounts on 7 days or more; daily swings below about $1,000 a day are noise [ADC-0064].

## Checks before you hand it over

- Gross profit per order is from delivered costs, with RTO and refunds out.
- Returning profit and new-customer profit are separate lines.
- The allowed cost per new customer is shown with the cohort data behind it.
- The ceiling uses marginal, not average, cost.
- All three ceilings are shown and the binding one is named.
- Weekly cash never drops below the owner's floor in the plan.
- Channel amounts add up to the total ceiling.
- No budget was changed in any ad account.

## Output

**One-screen summary:** total ceiling, which limit bound it (profit, cash or stock), allowed cost per new customer, expected new customers, expected contribution and profit against target, and the one risk to watch. Runner-up plan in one line (for example, a lower ceiling if a stock order slips).

**Budget sheet** (`ad-budget-<month>.csv` or a Google Sheet with live formulas):

| Section | Fields |
|---|---|
| Inputs | Profit target, fixed costs, returning gross profit forecast, first-order gross profit, 90-day gross profit, allowed cost per new customer |
| Ceilings | Profit ceiling, cash ceiling, stock ceiling, chosen ceiling, binding limit |
| Channel plan | Channel, Role (proven, existing customers, test), Monthly spend, Week 1 to Week 5 spend, Marginal cost per new customer, Expected new customers, Stop line |
| Cash by week | Week, Opening cash, Payouts in, Stock and bills out, Ad spend out, Closing cash, Floor |
| Stock check | SKU, Units available, Inbound date, Days of stock, Lead time, Ad status (push, hold, pause) |

**To confirm** (short list): the profit target, the cash floor and any inbound stock date the plan depends on.

## Common mistakes

- **Budget as a percent of revenue.** It ignores margin and the cost of the last customers; steps 3 and 4 replace it.
- **Average cost per customer.** The average can look fine while the last customers lose money; step 4 uses marginal cost.
- **Counting repeat profit that has not happened.** Step 3 only uses cohorts old enough to show it.
- **Ignoring cash timing.** COD and payout lags can empty the bank in a profitable month; step 5 checks each week.
- **Pushing a product that will sell out.** Step 6 pauses or holds SKUs with less stock than lead time.
- **Reading daily swings.** Step 8 reads weekly.

## Sources

- MEA-0014: Shopify's returning customer rate moves with acquisition.
- MEA-0020: time-bound lifetime gross profit sets cost targets.
- MEA-0022: forecast returning revenue from cohort decay.
- MEA-0023: product margin is not gross margin.
- MEA-0024: gross profit to cost bands.
- MEA-0026: first-order contribution at or above cost per customer.
- MEA-0035: November cohorts can repeat less.
- MEA-0037: gross margin uses delivered cost.
- MEA-0048: rank on profit only from cohorts old enough.
- MEA-0055: split first-time and returning P&Ls.
- ADC-0012: push or hold winners by stock and cash.
- ADC-0023: tie targets to days of stock.
- ADC-0049: scale on marginal, not average, cost.
- ADC-0053: proven versus test share by profitability.
- ADC-0064: small accounts swing daily; read 7 days.
- ADC-0068: existing-customer spend in money.
- FIN-0011: inventory-funded growth squeezes profit.
- FIN-0029: judge changes on 60 to 180-day cash.

What makes this skill ours: the budget is the lowest of three ceilings (profit, cash, stock) with the binding one named; returning profit is separated so ads are not credited with it; the ceiling stops at the marginal cost of new customers; and India's COD remittance lag and GST on ad spend are in the cash test.
