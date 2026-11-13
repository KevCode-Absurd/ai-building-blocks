---
name: meta-ads-for-cod-stores
description: "A Meta setup for cash-on-delivery stores that stops rewarding orders that are later refused at the door. Measures return-to-origin (RTO) by campaign and ad from store and courier data, works out gross profit per placed COD order and the true break-even cost, then designs the signal: a confirmed-order and a prepaid-order event sent through the Conversions API within hours, with Meta's 7-day limit in mind, and a test of optimising on confirmed orders against plain Purchase, judged on cost per delivered order. Ends with a weekly campaign read on delivered gross profit. Use when most orders are COD, RTO is high or varies by ad, or Meta's results look far better than cash collected."
---

# Meta ads for cash-on-delivery stores

**You get:** an RTO table by campaign and ad, a money sheet with gross profit per placed COD order and the true break-even cost, a signal design (events, timing, values) for the developer or app, a test plan with its read date, and a weekly read sheet on delivered gross profit, all for the client's approval.

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

1. **Shopify order export**, last 60 to 90 days: Name, Created at, Total, Payment Method (or gateway), Financial Status, Fulfillment Status, Tags, Shipping Zip, Lineitem sku.
2. **Courier or shipping aggregator export** for the same orders: order number, AWB, final status (delivered, RTO, lost), status date, forward and return charges, COD remittance.
3. **Order source by campaign**: Shopify's marketing attribution report by UTM campaign and content, or the checkout app's UTM export, joined to order numbers.
4. **Meta Ads Manager export**, same window, campaign and ad level: spend, purchases, purchase value, on 7-day click.
5. **Costs**: landed cost per SKU, packaging, payment and COD handling fees.

Optional: order confirmation log (who confirmed, when), pincode-level RTO from the courier.

If 3 is missing, RTO can be read for the store but not by ad: say so, and set up UTM capture first (`set-up-utm-tracking-for-all-channels`). Reading needs level 1. Changing events, campaigns or optimisation needs draft access (level 2) and the client's yes; the event code is built by the store's developer or app through official integrations.

## Before you start: the gates

1. **Delivered gross profit known.** Pass when gross profit per delivered order uses delivered costs [MEA-0037]: product cost "all in until it's in" [FIN-0007], shipping, fees. Fail: build it in step 2 before anything else.
2. **Outcomes per order.** Pass when at least 80% of shipped orders in the window have a final courier status. Fail: wait for statuses or use an older window.
3. **Signal path.** Pass when the store can send a custom server event (Conversions API through Shopify's app settings, a partner app or a developer). Fail: do steps 1 to 3 and 7 to 9 only; flag the gap.
4. **Privacy.** Pass when customer phone and email are sent only hashed through official tools, under the store's privacy notice and India's data protection rules. Fail: stop the signal work.

## Steps

### 1. Measure the leak by ad

For each campaign and its top ads: placed orders, COD share, confirmed, shipped, delivered, RTO, and RTO rate (RTO divided by shipped). Rank ads by RTO rate. If the spread between the best and worst ads with 30 or more shipped orders each is more than about 10 points (practitioner default, test it), Meta is learning from the wrong buyers on some ads.

### 2. Do the money on placed orders

- Gross profit per delivered order (GPd) from gate 1. Product margin is not gross margin [MEA-0023].
- RTO cost per refused order (R) = forward shipping + return shipping + packaging lost + any damage write-off.
- Delivery rate d = delivered / shipped, by campaign.
- **Gross profit per placed order** = d x GPd minus (1 - d) x R.
- **Break-even cost per placed order** = that figure. Meta's cost per purchase must sit under it, not under GPd.

Illustrative: GPd 400 rupees, R 120, d 0.75: 0.75 x 400 minus 0.25 x 120 = 270. An ad at 300 per purchase that looks fine against 400 is losing 30 on every order. Your bid is your unit economics; a store with leakier orders can afford less in the auction [ADC-0057].

### 3. Choose the optimisation event

| Situation | Event to optimise on |
|---|---|
| RTO under about 10% and similar across ads | Keep Purchase; use step 2's break-even as the target |
| RTO high or uneven, confirmed orders above about 50 a week per ad set | ConfirmedOrder (custom event) |
| Strong prepaid share and prepaid buyers are the goal | PrepaidPurchase, or Purchase with values in step 5 |
| Confirmed orders below about 50 a week | Keep Purchase for delivery; use ConfirmedOrder for reading and as a test campaign only |

Meta's learning needs about 50 optimisation events in 7 days [ADC-0066]; an event that fires too rarely cannot steer delivery.

### 4. Design the signal

- **ConfirmedOrder:** fired when a COD order is confirmed by call, WhatsApp or auto-confirm reply, and **PrepaidPurchase** fired when payment is captured. Send both through the Conversions API with the same customer information and order ID as the original Purchase.
- **Timing:** send within hours. Meta rejects any event with an event_time older than 7 days, and one stale event fails the whole batch [MEA-6085]; send in small, frequent batches.
- **Not delivery:** work out the store's median days from order to delivery from the courier export. Click to delivery is longer still, so where it nears 7 days a "Delivered" event mostly falls outside a 7-day click window. Use delivery for your own reporting, not for Meta optimisation.
- **action_source:** pick the value that matches where the confirmation happened (phone_call, chat, business_messaging, or website for a prepaid payment) [MEA-6085]. Before switching any ad set, check in Events Manager that the event shows as an optimisation choice for a website sales ad set.
- Keep Purchase firing as now, so reporting stays comparable. Build a custom conversion on the new event if needed; an ad account can hold up to 100 [MEA-6086].

### 5. Set values that tell the truth

Practitioner default, test it: send Purchase value at full price for prepaid orders and at price x the store's delivery rate for COD orders, so value-based bidding sees the real expected value. Write the rule down so reported ROAS is read on this basis.

### 6. Test before switching

Through `store-meta-test`: one campaign or ad set optimised on ConfirmedOrder against a matched one on Purchase, same creative, budget and audience. Read on **cost per delivered order** and delivered gross profit after ads, 14 days after the test ends so deliveries have landed. Call it only after each cell spends 3 times the break-even cost [ADC-0039].

### 7. Fix the ads and audiences

- Ads must state the real payment terms: if COD has a fee, no "free COD" line.
- Show the prepaid reason (a real prepaid discount or faster dispatch) on ads and landing pages, as set in `cod-and-prepaid-checkout-for-india`.
- Remove refused and RTO buyers from customer lists and seed audiences (`build-meta-retargeting-and-exclusions`); otherwise Meta finds more people like them.
- If certain regions carry very high RTO, test excluding them in location settings; check where Meta allows postal-code targeting for India before relying on it.

### 8. Push upstream fixes

Hand off: confirmation routine to `confirm-cod-orders-by-chat-or-call`, pincode and order-pattern rules to `cut-rto-on-cod-orders`, full RTO cost by product to `returns-and-rto-cost-analysis`. Every point of RTO cut raises step 2's break-even.

### 9. Read weekly on delivered profit

Lost or wrong signal makes Meta misjudge who buys [MEA-0046]; your read must not repeat the error. Each week, for orders placed two weeks earlier: campaign, spend, placed, confirmed, delivered, RTO rate, delivered gross profit, profit after ads. Scale or cut with `store-meta-budget` on this sheet, not on Meta's Purchase return. Read new-customer revenue against spend as acquisition MER on delivered orders [MEA-0025].

**US note:** COD is rare, but the same logic applies to high-return categories (apparel): set the break-even on kept orders, not placed ones.

## Checks before you hand it over

- RTO is shown by campaign and ad with order counts.
- Break-even cost per placed order is computed and shown beside Meta's cost per purchase.
- The chosen optimisation event has a weekly volume above about 50, or is test-only.
- Events are sent within hours, in small batches, never relying on delivery inside 7 days.
- Purchase keeps firing for reporting.
- Refused buyers are out of customer lists and seed audiences.
- The test is read on cost per delivered order after deliveries land.
- No event, campaign or audience change goes live without the client's yes.

## Output

**Summary (one screen):** COD share, RTO overall and best and worst ads, break-even per placed order versus Meta's cost, the event decision, the test and read date, the yes needed.

**RTO table:** Campaign, Ad, Placed, COD %, Confirmed, Shipped, Delivered, RTO, RTO rate.

**Money sheet:** GPd, R, d, Gross profit per placed order, Break-even cost, Meta cost per purchase, Gap.

**Signal spec:** Event name, Trigger, Sent from, Timing, action_source, Value rule, Customer fields, Dedup key.

**Weekly read:** Week placed, Campaign, Spend, Placed, Confirmed, Delivered, RTO rate, Delivered GP, Profit after ads, Call.

## Common mistakes

- **Break-even on delivered profit.** Step 2 uses profit per placed order.
- **Optimising on delivery.** Step 4 explains why it arrives too late [MEA-6085].
- **A new event too rare to learn from.** Step 3 checks weekly volume [ADC-0066].
- **Switching without a test.** Step 6 tests on delivered orders.
- **Feeding refused buyers back as seeds.** Step 7 removes them.
- **Reading this week's orders.** Step 9 waits two weeks for deliveries.

## Sources

- ADC-0039: spend-based read rule.
- ADC-0057: the bid is the store's unit economics.
- ADC-0066: about 50 events in 7 days.
- FIN-0007: what goes into product cost.
- MEA-0023: product margin is not gross margin.
- MEA-0025: acquisition MER.
- MEA-0037: gross margin from delivered cost.
- MEA-0046: lost signal misleads Meta's estimates.
- MEA-6085: Conversions API 7-day event limit and action_source (proposed card).
- MEA-6086: custom events and conversions for optimisation (proposed card).

What makes this skill ours: break-even is set on gross profit per placed COD order, not per delivered one; the confirmed-order signal is designed around Meta's 7-day event limit instead of a delivery event that arrives too late; refused buyers are kept out of seed audiences; and every campaign is read two weeks later on delivered profit.
