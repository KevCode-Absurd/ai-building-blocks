---
name: design-loyalty-program
description: "A loyalty program designed from the store's own repeat data and margins: whether a program is worth building at all, the earn rules (points per purchase and for which actions), the burn rules (reward value, minimum redemption, expiry and reminders), optional tiers based on gross profit, and a cost model that shows reward cost, expected breakage and the extra repeat gross profit the program must create to pay for itself. Includes a holdout test so the program is judged on real lift, launch messages, and India coins and COD notes. Tool-neutral. Use before buying a loyalty app, when an existing program costs more than it returns, or when repeat rate has stalled."
---

# Loyalty program design

**You get:** a one-page program design (earn rules, burn rules, expiry, tiers if any), a cost model sheet showing reward cost per order and the break-even lift in repeat gross profit, a holdout test plan, and the launch message set outline, ready for the client to approve and set up.

## When to use

- The owner wants a points or rewards program and needs to know if it will pay.
- An existing program gives away more than it brings back.
- Repeat rate has stalled and the store sells products people buy again.
- A loyalty app is up for renewal.

## Not for

- Asking happy buyers to bring friends: use `design-referral-program`.
- A subscription offer for repeat-use products: use `design-subscribe-and-save-program`.
- Bringing back lapsed buyers: use `win-back-lapsed-customers`.
- Measuring repeat rate and lifetime value by cohort: use `cohort-repeat-and-ltv-analysis` first; this skill uses its numbers.

## What you need

Required (read access, level 1):

1. **Shopify order export, 12 months or more**: Name, Created at, Customer Id, Subtotal, Discount Amount, Total, Lineitem sku, Lineitem quantity, Refunded Amount, Payment Method.
2. **Gross profit per order** and gross margin by product from `build-sku-profit-sheet` or `store-meta-math`.
3. **Repeat facts** from `cohort-repeat-and-ltv-analysis`: share of buyers who order again within 90, 180 and 365 days, median days to second order, gross profit per returning order.
4. **Current discounts and codes** in use.
5. **Return and RTO rate.**

Optional: an existing program's data (members, points issued, redeemed, expired), email and SMS consent counts.

Setting up the program in an app or in Shopify needs draft access (level 2); launching it to buyers, and any change to earned points later, needs the client's yes.

## Before you start: the gates

1. **Repeat is possible.** If under about 10% of buyers ever order again within 12 months and the catalogue has no natural repeat or add-on, a points program mostly gives discounts to people who would buy anyway (practitioner default, test it). Fail: fix product range, post-purchase experience or delivery first.
2. **Basics work.** Delivery, returns and support must be reliable before loyalty; rewards on top of a broken experience make failures more memorable. Check order-status contacts and return complaints first [CXP-0009].
3. **Margin room.** Reward cost per order must fit inside gross profit per returning order with room left. Computed in step 4.
4. **Cash.** App fee plus reward cost a month must fit the cash plan. A free path exists (store credit or discount codes issued by hand from a sheet) for small stores.
5. **Rules on points.** Expiry, changes and how points show in accounts must be disclosed clearly in the program terms. Ask the store's accountant how unredeemed points are booked; no tax or accounting ruling here.

## Steps

### 1. Find who the program is for

Split customers by 12-month gross profit, not revenue: top 10 to 20%, middle, one-time. A loyalty program earns its keep by moving one-time buyers to a second order and keeping the top group. Under about 10 to 20 million a year, first to second order is usually the main limit [EML-0053]. Check whether discount-led buyers repeat worse than full-price ones before adding more discounts; at many brands they did [CXP-0016].

### 2. Pick the program shape

| Shape | Fits | Watch out |
|---|---|---|
| Points on spend, redeemed as money off | Repeat categories, 2 to 6 orders a year | Becomes a hidden discount |
| Points that expire, with reminders | Consumables, short repeat cycle | Annoys buyers on long cycles |
| Tiers with benefits (early access, free shipping, service) | Strong top group, wide range | Benefits must be cheap to give and valued |
| No points, just a VIP list | Small stores, high order value | Needs a person to run it |

Recommend one shape; name the runner-up in a line. Non-money benefits (early access, priority support, free returns, a birthday gift) often cost less per member than points; one practitioner ranks gifts and access above blanket discounts [OFF-0035].

### 3. Set earn and burn

- **Earn:** points per unit of spend on product subtotal after discounts, excluding shipping and tax. Award points only after the return window closes, or claw them back on refund; in India, COD orders earn only once delivered and paid.
- **Bonus actions:** account creation, birthday, review with photo (honest reviews only, never for a positive rating), referral. Cap these; each is a cost.
- **Reward value:** start at about 3 to 5% of spend returned as reward value (practitioner default, test it), then check it in step 4.
- **Burn:** a minimum redemption about the size of half a typical order's reward (so the first reward is reachable by order two or three), redeemed at checkout, not stackable with sale codes.
- **Expiry:** set it shorter than the gap you want to close but long enough to use. One Indian brand used coins that expire 60 days after purchase with email and SMS reminders, which pulled buyers back; this suits repeat cycles of about 2 to 4 months and annoys long-cycle buyers [CXP-0019]. For long cycles, expire after 12 months of no activity instead.

### 4. Build the cost model

For a year:

- Points issued value = member spend x reward rate.
- Expected redeemed value = issued value x redemption rate. Breakage (points never used) lowers cost, but plan on the store's own redemption once known; until then use 60% redemption as a planning figure (practitioner default, test it). Do not design the program to profit from breakage; expiry must be clear and reminded.
- Program cost = redeemed value + app fee + bonus actions + benefit costs.
- Break-even lift = program cost / gross profit per returning order. This is the number of extra returning orders the program must cause.

Judge lift on 60 to 180-day cash, not 30 days; repeat changes compound [FIN-0029]. Read it with lifetime gross profit by cohort, refunds deducted, not revenue [MEA-0020]. Show it beside the returning-customer P&L, since returning profit can hide a loss elsewhere [MEA-0055].

If the break-even lift needs a repeat rate the store has never reached, cut the reward rate or switch shape.

### 5. Tiers (only if the top group is large enough)

Base tiers on 12-month net spend after returns, with two or three tiers at most. Give each tier one benefit people notice: free shipping, early access to launches, priority support. Never remove earned benefits without notice; grandfathering long-standing members is a cheap form of loyalty [OFF-0063]. A small, logged weekly budget for surprises to top customers can work alongside tiers [CXP-0022].

### 6. Plan the holdout test

Members self-select, so comparing members with non-members overstates the effect. Instead: hold out a random 10 to 20% of new customers from the program for 90 to 180 days (practitioner default, test it), and compare second-order rate and gross profit per customer, refunds deducted. Keep the program only if the lift beats the break-even lift.

### 7. Launch messages

Outline, for the email team: launch email to existing buyers with their starting balance, a short program page, a line in the order confirmation showing points earned, the expiry reminder (14 and 3 days before), and the first-reward-reached note. Send copy writing to `write-post-purchase-emails`.

### 8. India and US notes

- **India:** "coins" or a store wallet is familiar to buyers. Credit points only after COD delivery and payment. Remind by WhatsApp only with opt-in. Ask the accountant how reward redemption is treated for GST invoices.
- **US:** write clear terms (earn, value, expiry, changes, no cash value). Some states have rules on store credit and gift card expiry; check before calling points "credit".

## Checks before you hand it over

- The gate on repeat potential and basic service was checked with numbers.
- Earn excludes shipping, tax and refunded or undelivered COD orders.
- Reward rate, redemption rate and app fee are in the cost model.
- Break-even lift is stated as extra returning orders a year.
- The program does not depend on breakage to pay.
- A random holdout test is planned with a pass line.
- Expiry and terms are clear and reminded.
- Nothing launches without the client's yes.

## Output

**One-screen summary:** recommended shape, earn and burn rules, yearly program cost, break-even lift and the test plan.

**Program design:** Rule, Setting, Why.

**Cost model sheet:** Members, Member spend, Reward rate, Points issued value, Redemption rate, Redeemed value, App fee, Bonus and benefit cost, Program cost, Gross profit per returning order, Break-even extra orders, Current repeat rate, Repeat rate needed.

**Holdout plan:** Group, Size, Start, Read date, Metric, Pass line.

**Launch message list:** Message, Trigger, Channel, Owner.

## Common mistakes

- **Building loyalty on a broken experience.** Gate 2 checks basics first.
- **A hidden permanent discount.** Step 4 prices the reward against gross profit.
- **Points on refunded or unpaid COD orders.** Step 3 awards after delivery and returns.
- **Counting members' spend as lift.** Step 6 uses a random holdout.
- **Expiry that angers long-cycle buyers.** Step 3 ties expiry to the repeat cycle.

## Sources

- CXP-0009: fix effort before delight.
- CXP-0016: discount-led buyers often repeat worse.
- CXP-0019: expiring coins with reminders in an Indian brand.
- CXP-0022: a logged weekly budget for surprises.
- EML-0053: first to second order is the usual limit.
- FIN-0029: judge repeat gains on 60 to 180-day cash.
- MEA-0020: time-bound lifetime gross profit, refunds deducted.
- MEA-0055: split first-time and returning P&L.
- OFF-0035: gifts and access beat blanket discounts.
- OFF-0063: grandfathering rewards loyalty without discounting.

What makes this skill ours: the program must earn back its cost in extra returning orders, computed from the store's own gross profit; a random holdout, not member spend, decides if it stays; points are never earned on refunded or undelivered COD orders; and expiry follows the store's real repeat cycle.
