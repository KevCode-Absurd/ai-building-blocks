---
name: win-back-lapsed-customers
description: "A win-back plan that names who has lapsed using the store's own reorder gap, splits them into groups by past value and the reason they may have left, sets the most each group can be offered while the returning order still makes gross profit, and fixes the cutoff where the store stops marketing to them and moves them to sunset. Includes a 10% holdout so the store sees real returns, not attributed revenue, plus India notes for COD and RTO buyers and WhatsApp, and US notes for SMS. Use when repeat orders slip, when a big list of past buyers has gone quiet, or before sending a 'we miss you' discount to everyone."
---

# Win back lapsed customers

**You get:** a lapsed-customer sheet split into five groups, an offer ladder per group with the maximum discount each can carry and still earn gross profit, the contact sequence and channel per group, the sunset cutoff, and a holdout design to measure what came back.

## When to use

- Repeat orders are falling and many past buyers have not ordered in months.
- The owner wants to send one big "we miss you, 30% off" email to everyone who stopped buying.
- `rfm-customer-segments` shows large At risk or Lapsed one-time groups.
- The list carries thousands of past buyers who no longer open, and deliverability is slipping.

## Not for

- Writing the win-back emails in full: use `write-win-back-email-series`.
- Cancelled subscribers: their timing and offers differ; use `design-subscribe-and-save-program`.
- Reminding active buyers before they run out: use `replenishment-reminder-timing`.
- Cleaning sender reputation first: use `email-account-health-audit`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, 24 months: Name, Email, Phone, Created at, Financial Status, Fulfillment Status, Subtotal, Discount Code, Discount Amount, Refunded Amount, Lineitem sku, Payment Method, Tags, Cancelled at.
2. **Gross profit per order** from `build-sku-profit-sheet`.
3. **Email and SMS engagement** per profile: last open (non-privacy), last click, last site visit, consent status, from the email tool's profile export.
4. **Returns, complaints and RTO list**: who returned, complained, charged back or refused a COD parcel, with dates.

Optional: `rfm-customer-segments` sheet, product reviews by customer, WhatsApp opt-in list.

Missing engagement data: use order data only and treat everyone as reachable by email, but send to the most recent groups first. Building flows and segments needs draft access (level 2); any send needs the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Fail: no discount offers at all; send only non-discount win-back until it passes. A deep code on a thin margin order can lose money on every return [OFF-0065].
2. **Inbox health.** If campaigns to engaged contacts open under 30 to 35%, fix deliverability first [EML-0059]; mailing thousands of quiet contacts will make it worse.
3. **Why they left.** If over 20% of lapsed buyers returned an item or complained, audit the product or service before sending offers [EML-0050]. Win-back cannot fix a product people did not like.
4. **Stock.** Do not invite people back to products that are out of stock.

## Steps

### 1. Set the lapse line from the store's own gap

Compute the median days between first and second order (G). A customer is lapsed when days since last delivered order passes 2 x G [EML-0019]. For repeat-use products, test an earlier start: win-back sent 30 to 45 days after last purchase converted about 2.3 times better than at 90 days or more in one data set [EML-0050]. Where the store sells both quick-repeat and slow-repeat products, compute G per product family and use the family of the last order.

### 2. Split the lapsed into five groups

| Group | Rule | Why it matters |
|---|---|---|
| A. Valuable lapsed | 2 or more orders, top third by gross profit | Most to win back; least need for discounts |
| B. Repeat lapsed | 2 or more orders, the rest | Proven repeaters |
| C. One-time full price | 1 order, no discount code | Liked the product enough to pay full price |
| D. One-time discount | 1 order, with a discount code | Discount-led buyers often have worse lifetime value [CXP-0016] |
| E. Fix first | Returned, complained, charged back, or 2 or more refused COD parcels | Service or fraud issue, not a marketing problem |

Group E gets no marketing. Unresolved complaints get a support follow-up; repeat COD refusers in India are excluded from win-back and offered prepaid-only if they return on their own.

### 3. Price the offer ladder per group

For each group, the maximum discount = gross profit per returning order minus a floor you keep (practitioner default: keep at least half of normal gross profit per order, test it). Write the expected value per contacted customer:

Expected value = return rate x (gross profit per returning order minus discount cost) minus message cost.

Use the store's past win-back return rate if it has one; otherwise plan with the closest flow's placed order rate and mark it "planning". Rules per group:

- **A:** no discount first. A personal note from the founder, what is new since their last order, and a direct reply option. A modest offer only on the last step.
- **B:** what is new and a bestseller they have not tried; a small offer on step 2 or 3.
- **C:** the product they bought, any improvement, reviews from buyers like them; an offer only on the last step.
- **D:** lowest offer, or a gift or free shipping instead of a deeper code; they came for a discount and repeat less.
- **E:** none.

Keep any expiry real: state an end date and keep it. Never reset a countdown.

### 4. Set the sequence and channels

Three messages per lapse, spaced about a week apart, is the usual baseline [EML-0019]:

| Step | Day | Content | Offer |
|---|---|---|---|
| 1 | Lapse day | What is new, their product, reply option | None |
| 2 | +5 to 7 | Proof and the product that fits their past order | Group rule |
| 3 | +5 to 7 | Last note with a real end date, or a preference choice (less email) | Group rule, final step |

Exit on any order, click to preferences, or new support ticket.

- **SMS (US):** one text alongside step 2 for SMS subscribers, at about twice their average days between orders [EML-0029].
- **WhatsApp (India):** one marketing template alongside step 2 for opted-in buyers; costs per message, so run the cost check first.
- **List that has been silent for months:** expect an unsubscribe spike on the first send, then it settles [EML-0032]. Send to the most recent lapsed first, in slices of about 10% added to normal sends [EML-0052].

### 5. Fix the cutoff where the store stops

A customer leaves win-back and goes to sunset when either is true:

- Three win-back messages sent with no click and no site visit; or
- No email open or click and no site activity for 120 to 180 days after at least six emails received [EML-0042] [EML-0011].

Sunset means one or two "stay or go" emails, then suppress from marketing email. They stay customers: transactional messages, support and their account continue. Suppressing them protects inbox placement for everyone else.

### 6. Hold out 10% and measure

Pick 10% of each group at random and send them nothing. After 60 days compare the return rate and gross profit per customer of contacted versus held out. Attributed flow revenue overstates what win-back adds [EML-0056]; the holdout shows the real return. Keep groups whose lift pays for their offers; cut or soften the offer for groups that would have come back anyway.

## Checks before you hand it over

- The lapse line uses the store's own reorder gap, with the count of customers behind it.
- Every lapsed customer sits in one of the five groups.
- Each group's maximum discount leaves gross profit per returning order above the kept floor.
- Group E gets no marketing.
- Sequence has three steps at most per lapse, with exits.
- The sunset rule is written with day counts.
- A 10% holdout is set per group.
- Expiry dates are real; no resetting timers.
- Nothing was sent without a client yes.

## Output

1. **One-screen summary:** lapsed count, the five groups with size and past gross profit, the offer per group, expected gross profit from the plan, and the sunset rule.
2. **Lapsed sheet** (`lapsed-customers.csv`): Customer key, Last order, Days since, Orders, Gross profit to date, Discount buyer (yes or no), Returns or complaints, Group, Email ok, SMS ok, WhatsApp ok, Holdout (yes or no).
3. **Offer ladder table:** Group, Customers, Gross profit per returning order, Max discount, Step 1 offer, Step 2 offer, Step 3 offer, Planning return rate, Expected value per customer.
4. **Sequence spec:** Step, Day, Channel, Purpose, Offer, Exit.
5. **Results sheet:** Group, Contacted, Held out, Return rate each, Gross profit per customer each, Lift, Keep or change.

## Common mistakes

- **One "30% off" to everyone.** Step 3 sets the offer per group and checks gross profit.
- **Fixed 90-day lapse.** Step 1 uses the store's gap.
- **Discounting the best customers first.** Group A starts with no discount.
- **Marketing to people who complained.** Group E is excluded.
- **Mailing forever.** Step 5 sets the cutoff.
- **Judging by attributed revenue.** Step 6 uses the holdout.

## Sources

- EML-0019: win-back starts at twice the purchase interval; three emails.
- EML-0050: earlier win-back converts better; audit if over 20% complained or returned.
- EML-0029: SMS win-back at twice the average days between orders.
- EML-0042, EML-0011: unengaged and sunset definitions.
- EML-0032, EML-0052: silent list restart; add dormant slices.
- EML-0059: inbox floor before sending.
- EML-0056: attributed revenue is not incremental.
- CXP-0016: discount-acquired buyers repeat less.
- OFF-0065: discounts raise break-even sharply.

What makes this skill ours: the lapse line comes from the store's own reorder gap; every offer is capped so the returning order still earns gross profit; complainers, returners and repeat COD refusers are fixed or excluded instead of discounted; and success is read from a holdout, not attributed revenue.
