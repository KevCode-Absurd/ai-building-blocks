---
name: meta-ads-for-cod-stores
description: "Meta media buying for cash-on-delivery stores, judged on orders that are delivered and paid, not orders placed. Measures return-to-origin (RTO) by campaign, ad and segment from store and courier data, sets the true break-even per placed order, designs a confirmed-order and prepaid signal through the Conversions API inside Meta's 7-day limit, relaunches the ads that brought delivered profit, ranks every segment on delivered profit, weights formats and messages to what delivers, plans the whole budget with a reserve of 15% or less, and gives each ad set a Scale, Hold, Trim or Cut verdict and one rule read on delivered numbers. Use when most orders are COD, RTO is high or uneven by ad, or Meta's results look far better than cash collected."
---

# Meta ads for cash-on-delivery stores

**You get:** a COD media plan: RTO by campaign, ad and segment, break-even per placed order, a signal design for the developer or app, past winners on delivered profit to relaunch, the segments and formats that deliver, a full budget, and a Scale, Hold, Trim or Cut verdict with one rule per ad set, all read on delivered orders.

## When to use

- More than about a third of orders are cash on delivery (practitioner default).
- RTO is high, or some ads bring far more refused orders than others.
- Meta reports a good return but cash collected after deliveries does not match.
- Before scaling a COD-heavy store.

## Not for

- Calling or messaging buyers to confirm orders: use `confirm-cod-orders-by-chat-or-call`.
- COD fees, prepaid discounts and checkout settings: use `cod-and-prepaid-checkout-for-india`.
- Rules to confirm, nudge or block risky COD orders by pincode: use `cut-rto-on-cod-orders`.
- Installing or fixing the pixel and Conversions API: use `store-meta-capi`; this skill gives it the event design.

## What you need

Required:

1. **Shopify order export**, last 60 to 90 days: Name, Created at, Total, Payment Method, Financial Status, Fulfillment Status, Tags, Shipping Zip, Lineitem sku.
2. **Courier or aggregator export** for the same orders: order number, AWB, final status (delivered, RTO, lost), status date, forward and return charges, COD remittance.
3. **Order source by campaign and ad**: Shopify's marketing attribution report by UTM campaign and content, joined to order numbers.
4. **Meta Ads Manager export**, same window, campaign, ad set and ad level, paused included, with age, gender, region and placement breakdowns.
5. **Costs**: landed cost per SKU, packaging, payment and COD fees.
6. **The budget** for the period.

Optional: order confirmation log, pincode-level RTO from the courier.

If 3 is missing, RTO can be read for the store but not by ad: say so, and set up UTM capture first (`set-up-utm-tracking-for-all-channels`). Reading needs level 1. Changing events, campaigns or budgets needs draft access (level 2) and the client's yes, asked in your message. The event code is built by the store's developer or app through official integrations.

## Before you start: the gates

1. **Delivered gross profit known.** Pass when gross profit per delivered order uses delivered costs [MEA-0037]: product cost "all in until it's in" [FIN-0007], shipping, fees. Fail: build it in step 1 first.
2. **Outcomes per order.** Pass when at least 80% of shipped orders in the window have a final courier status. Fail: use an older window.
3. **Signal path.** Pass when the store can send a custom server event (Conversions API through Shopify's app settings, a partner app or a developer). Fail: skip the signal design; flag the gap.
4. **Privacy.** Customer phone and email are sent only hashed through official tools, under the store's privacy notice and India's data protection rules. Fail: stop the signal work.

## Steps

Follow the house rules, chiefly **Brand brain first**, **Map every signal to an asset**, **Look it up before you decide**, **Only the brief's facts run the business** and **One basis per number**. Before step 1, write the brand brain (every segment the data ranks, each with its delivered number) and the signal-to-asset map. Run `node tools/ask-knowledge.mjs` once per signal and once per decision, logged in `context/trace.md`; every figure goes in `context/numbers.json`. Days count from the start; a calendar date only when the brief gives one.

### 1. Tracking

- **The leak by ad:** for each campaign and its top ads: placed orders, COD share, confirmed, shipped, delivered, RTO, and RTO rate (RTO divided by shipped). If the best and worst ads with 30 or more shipped orders each differ by more than about 10 points (practitioner default), Meta is learning from the wrong buyers on some ads.
- **The money per placed order:** gross profit per delivered order (product margin is not gross margin [MEA-0023]); RTO cost per refused order = forward and return shipping plus packaging lost; delivery rate by campaign. Gross profit per placed order = delivery rate x delivered gross profit, minus refused share x RTO cost. That is the break-even cost per placed order; Meta's cost per purchase must sit under it. Your bid is your unit economics [ADC-0057].
- **The signal:** send ConfirmedOrder (fired when a COD order is confirmed by call, chat or auto-reply) and PrepaidPurchase (fired when payment is captured) through the Conversions API with the same customer data and order ID as Purchase. Send within hours, in small batches: Meta rejects events older than 7 days, and one stale event fails the batch [MEA-6085]. Delivery arrives too late to steer Meta; keep it for your own reads. Keep Purchase firing for reporting. An ad set can optimise on a custom event [MEA-6086] once it reaches about 50 a week [ADC-0066].
- Judge every verdict on delivered store numbers, not Meta's purchases. Lost or wrong signal makes Meta misjudge who buys [MEA-0046].

### 2. What worked before

- Rank every ad and ad set, paused included, on delivered gross profit after ads, not Meta's return. The best are often not the ones with the cheapest purchase.
- Relaunch the delivered-profit winners first, with fresh cuts of the same concept: a new hook, first frame or length.
- A winner paused for stock or season comes back when that reason has passed.

### 3. Audiences

- Rank every segment the data splits (age band, gender, region or pincode tier, placement, device, each ad set's audience) on cost per delivered order and RTO rate. Name the winner and give it its own ad set or creative.
- No age or interest floor the data does not support. Exclude a region only where its delivered profit is negative on enough orders; check where Meta allows postal-code targeting for India before relying on it.
- Remove refused and RTO buyers from customer lists and seed audiences (`build-meta-retargeting-and-exclusions`); otherwise Meta finds more people like them.

### 4. Formats and messaging

- Rank formats and angles on cost per delivered order. At least half of new creative goes to the style with the best delivered profit, with enough ads to feed the budget: each needs about 3 times the break-even cost per placed order to be judged [ADC-0039].
- Ads state the real payment terms: if COD has a fee, no "free COD" line.
- Show the prepaid reason (a real prepaid discount or faster dispatch) in ads and on landing pages, as set in `cod-and-prepaid-checkout-for-india`.
- Messages that set honest expectations (delivery time, size, what is in the box) cut refusals; use the customers' own words from the brand brain.

### 5. Budget

The plan uses the whole budget (house rule **Spend plans add up**).
- Fund delivered-profit winners from day one where tracking works. No zero-spend days except those a tracking fix needs.
- A reserve is at most 15%, with a release rule on delivered numbers the account will hit within the period.
- Optimisation event: keep Purchase when RTO is under about 10% and even across ads; use ConfirmedOrder when RTO is high or uneven and confirmed orders pass about 50 a week per ad set; PrepaidPurchase when prepaid buyers are the goal. Below 50 a week, keep Purchase for delivery and use ConfirmedOrder for reading.
- Value rule (practitioner default, test it): send Purchase value at full price for prepaid and at price x the delivery rate for COD, so value bidding sees real expected value.

### 6. Verdicts

One label per ad set, matching its number in every table and note, on delivered gross profit after ads:
- **Scale** (budget up): cost per placed order under break-even, delivered profit positive for two weekly reads.
- **Hold** (same): near break-even, in learning, or deliveries for the window not yet landed.
- **Trim** (lower): delivered profit thin or RTO rising, with a reason to keep it alive.
- **Cut** (zero): delivered profit negative after spend of 3 times break-even cost [ADC-0039].

### 7. Rules

One rule per ad set, in one line, read on delivered orders placed two weeks earlier, never on Meta's Purchase return alone. For example: "Scale 20% while cost per delivered order stays under break-even for two weekly reads; Cut to zero if delivered profit after ads is negative after 3 times break-even spend." Read new-customer revenue against spend as acquisition MER on delivered orders [MEA-0025].

### 8. Hand over

- Run `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> --brief <brief>` and fix every FAIL.
- Order changes leverage first: refused buyers out of seeds and payment terms fixed in ads (no spend), Cut the highest-RTO losers, relaunch delivered-profit winners, then the signal work.
- Switching the optimisation event is the one place a side-by-side read earns its keep: one ad set on ConfirmedOrder against a matched one on Purchase, read on cost per delivered order once deliveries land. Other tests appear only when the brief asks.
- Hand off: confirmation to `confirm-cod-orders-by-chat-or-call`, pincode rules to `cut-rto-on-cod-orders`, RTO cost by product to `returns-and-rto-cost-analysis`. Every point of RTO cut raises break-even.

**US note:** COD is rare, but the same logic applies to high-return categories: set break-even on kept orders, not placed ones.

## Checks before you hand it over

- RTO is shown by campaign, ad and segment with order counts.
- Break-even per placed order sits beside Meta's cost per purchase.
- Events are sent within hours, never relying on delivery inside 7 days; Purchase keeps firing.
- Past winners are ranked on delivered profit and relaunched first.
- Segments are ranked on cost per delivered order; no unsupported age floor; refused buyers are out of seeds.
- The whole budget is planned; any reserve is 15% or less with a release rule.
- Every verdict label matches its number; each ad set has one rule on delivered numbers.

## Output

**Summary (one screen):** COD share, RTO overall and best and worst ads, break-even per placed order against Meta's cost, the event decision, the budget and the one limit that binds.

**Each decision in two lines:** what to do, and why with one number.

**Table "RTO by ad":** Ad, Placed, Delivered, RTO rate, Delivered profit.

**Table "Budget":** Ad set, Now a day, New a day, Verdict, Rule.

**Signal spec:** Event, Trigger, Timing, action_source, Dedup key.

**Weekly read** (`cod-weekly-read.csv`): week placed, campaign, spend, placed, confirmed, delivered, RTO rate, delivered profit, verdict. The money working goes in the appendix.

## Common mistakes

- **Break-even on delivered profit.** Step 1 uses profit per placed order.
- **Optimising on delivery.** It arrives too late [MEA-6085].
- **Relaunching the cheapest-purchase ad.** Step 2 ranks on delivered profit.
- **Feeding refused buyers back as seeds.** Step 3 removes them.
- **Reading this week's orders.** Step 7 waits two weeks for deliveries.

## Sources

- ADC-0039: spend-based read rule.
- ADC-0057: the bid is the store's unit economics.
- ADC-0066: about 50 events in 7 days.
- FIN-0007: what goes into product cost.
- MEA-0023: product margin is not gross margin.
- MEA-0025: acquisition MER.
- MEA-0037: gross margin from delivered cost.
- MEA-0046: lost signal misleads Meta's estimates.
- MEA-6085: Conversions API 7-day event limit and action_source.
- MEA-6086: custom events and conversions for optimisation.

What makes this skill ours: break-even on gross profit per placed COD order, a confirmed-order signal built around Meta's 7-day limit, winners and segments ranked on delivered profit, and every verdict read two weeks later on what the store actually collected.
