---
name: replenishment-reminder-timing
description: "A per-product table of reorder reminder days worked out from the store's real reorder gaps and each product's usage cycle, scaled for the quantity bought, plus the flow build spec (trigger, filters, delays, splits, exits, channels) ready to set up in Klaviyo, Shopify Email or a WhatsApp tool. Says which products are not replenishable, caps reminders at two per cycle, keeps the first reminder free of discounts, and measures reorders against a holdout rather than attributed revenue. Includes India notes for WhatsApp reorder links and COD, and US notes for SMS. Use when launching or fixing a reorder flow for consumables, or when one fixed 30-day reminder goes to every product."
---

# Replenishment reminder timing

**You get:** a table of reminder days for every used-up product (first and second reminder, scaled by quantity, with the evidence behind each day) and a flow build spec a builder can set up as written, with a 10% holdout to prove the reminders add reorders.

## When to use

- One reorder email goes out on day 30 for every product, whatever its size.
- The store sells consumables (skincare, supplements, coffee, pet food, refills) and repeat orders are below what the owner expects.
- A new pack size or product launched and needs its own reminder day.
- `post-purchase-repeat-sequence` is live but its replenishment step uses a guess.

## Not for

- The full first-to-second order journey (thank-you, how-to, review, referral): use `post-purchase-repeat-sequence`.
- Designing a subscription offer for reorderers: use `design-subscribe-and-save-program`.
- Writing the reminder emails and texts: use `email-copy-from-store-history` or `write-sms-and-whatsapp-messages`.
- Products that are not used up (furniture, apparel, gadgets): use `win-back-lapsed-customers`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, 12 to 24 months: Name, Email, Phone, Created at, Fulfilled at, Financial Status, Lineitem sku, Lineitem name, Lineitem quantity, Cancelled at, Refunded Amount.
2. **Product facts per SKU**: pack size (grams, ml, count) and the stated daily use from the label or product page.
3. **Delivery time**: median days from fulfilment to delivery, from the courier or 3PL report, split by region if it varies a lot.

Optional: Klaviyo profiles with predicted next order dates, subscription export, marketplace sales of the same SKUs.

If daily use is not stated, ask the client once; without it, use observed gaps only. If delivery time is missing, use fulfilment date plus the delivery promise on the site. Building the flow needs draft access (level 2); switching it on needs the client's yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when known for each SKU (`build-sku-profit-sheet`). Fail: plan timing anyway, but no offer step until it passes.
2. **Is it really used up?** A SKU passes when it has a usage cycle. Fail: drop it from this skill.
3. **Enough reorders to read.** A SKU passes with 30 or more same-product reorder pairs (practitioner default, test it). Fail: time it from the usage cycle alone and mark it "usage-based".
4. **Stock.** Reminders drive orders on a predictable day. Check days of cover for each SKU (`set-reorder-points-and-safety-stock`); pause the flow branch for any SKU that will be out of stock.
5. **Consent.** SMS and WhatsApp steps need recorded opt-in for that channel.

## Steps

### 1. List the replenishable SKUs

Group sizes of the same product (60 and 120 capsules) as one product family, but keep their timing separate. Note any SKU often bought as a gift; gift buyers do not run out.

### 2. Measure the real reorder gaps

For each customer who bought a product family twice, take days between the two orders. Clean the gaps:

- Drop gaps under 7 days (split or corrected orders).
- Drop gaps over 3 times the median (they lapsed and came back; that is win-back, not replenishment).
- Count from delivery, not order date, where delivery dates exist.

Record per SKU: reorder pairs, 25th percentile, median and 75th percentile gap.

### 3. Work out the usage cycle

Usage cycle in days = pack size divided by daily use. A 60-capsule bottle at 2 a day lasts 30 days. Then compare with the median gap:

| Median gap vs usage cycle | What it means | What to do |
|---|---|---|
| Within 20% | Buyers use it as labelled | Time from the usage cycle |
| Much shorter | Several users, or stock-up buyers | Time from the observed 25th percentile |
| Much longer | Buyers use less, skip doses, or buy elsewhere | Time from observed gaps; add a how-to-use message before the reminder |

Too much product is the most common reason people stop subscriptions [OFF-0040]; the same logic applies to one-off orders, so trust real gaps over the label when they disagree.

### 4. Set the reminder days

- **Reminder 1:** at about 75% of the usage cycle, counted from delivery [EML-0049]. If the observed 25th percentile gap is earlier, use that instead.
- **Reminder 2:** at about 100% of the cycle or the median gap, whichever is later.
- **Stop there.** At most two reminders per cycle [EML-0049]. A buyer who ignores both moves to `win-back-lapsed-customers` at about twice their median gap [EML-0019].
- **Quantity:** multiply the days by units bought. Two bottles bought means reminders at twice the days.

If the store has Klaviyo predictions (500 or more buyers, 180 days of orders, some 3-order customers), compare the predicted next order date with your day for each SKU [EML-6326]. Use it only where it lands within a few days of yours; your SKU-level number is the default.

### 5. Decide the offer rule

- Reminder 1 carries no discount: it is a service ("running low?"), with a one-click reorder link.
- Reminder 2 may offer the subscription, if the store has one and it passes its margin check, or a larger pack that lowers cost per day.
- Any money-off offer must leave gross profit per reorder above zero [OFF-0065].

### 6. Pick the channels

Email first for everyone. Add SMS or WhatsApp to reminder 1 only where the buyer opted in and the message cost is below the expected gross profit it adds (sends x cost per message versus reorders x gross profit).

- **India:** WhatsApp is usually the channel that gets read. Automated journeys clicked far better than broadcasts across Indian brands [EML-0048]. A reorder reminder is a marketing template on WhatsApp, not utility, and is charged at the marketing rate for the market [EML-6322]. Link to a pre-filled cart, and keep COD available if the buyer paid COD last time.
- **US:** one SMS alongside reminder 1 for SMS subscribers; keep it under 160 characters with no emoji [EML-0024].

### 7. Write the flow spec

| Field | Setting |
|---|---|
| Trigger | Fulfilled Order (or Placed Order plus delivery days) containing the SKU |
| Filters | Not an active subscriber; has not ordered this product family since the trigger; no open return or complaint |
| Delay 1 | Reminder 1 day for that SKU, from step 4 |
| Split | Units bought: 1, 2, 3 or more, each with its own delay |
| Message 1 | Running-low reminder, reorder link, how-to-use tip |
| Delay 2 | Days from reminder 1 to reminder 2 |
| Message 2 | Reminder with subscription or larger-pack option |
| Exit | Any order containing the family, unsubscribe, or new open ticket |
| Holdout | Random 10% of entrants get no reminders |

One flow per product family keeps timing clean. If the tool limits flows, use one flow with a split per family.

### 8. Measure on reorders, not attributed revenue

Attributed flow revenue counts orders that would have come anyway [EML-0056]. Compare the reorder rate within the usage cycle plus 14 days for reminded buyers against the holdout. Read it after each arm has about 1,000 entrants [EML-0061]. If reminded buyers reorder no more than the holdout, change the day before changing the words: delay changes often move orders more than copy [EML-0023].

## Checks before you hand it over

- Every SKU in the table is used up and has a usage cycle or is marked "usage-based".
- Gaps are cleaned (under 7 days and over 3 times the median removed) and counted from delivery.
- Reminder days scale with quantity bought.
- No more than two reminders per cycle; the first has no discount.
- SKUs about to run out of stock are paused.
- SMS and WhatsApp steps go only to opted-in buyers and pass the cost check.
- The flow has exits for reorder, subscription and open tickets, and a 10% holdout.
- Nothing was switched on without a client yes.

## Output

1. **One-screen summary:** the products covered, their reminder days, the biggest change from the current setup, and the reorder rate to beat.
2. **Timing table** (`replenishment-timing.csv`): SKU, Product family, Pack size, Daily use, Usage cycle, Reorder pairs, 25th pct gap, Median gap, Reminder 1 day, Reminder 2 day, Basis (observed or usage-based), Stock status, Channel.
3. **Flow build spec:** the table from step 7, one per product family, with message purpose per step.
4. **Results sheet:** Month, SKU, Entrants, Holdout, Reorders reminded, Reorders holdout, Lift, Gross profit added.

## Common mistakes

- **One day for every product.** Steps 2 to 4 set it per SKU.
- **Counting from the order date.** A 6-day delivery shifts every reminder; step 2 counts from delivery.
- **Ignoring quantity.** Step 4 scales by units.
- **A discount in the first reminder.** Step 5 keeps reminder 1 a service.
- **Reminding people who already subscribed or reordered.** Step 7 filters and exits them.
- **Proving it with attributed revenue.** Step 8 uses a holdout.

## Sources

- EML-0049: remind at about 75% of the usage cycle; at most two per cycle.
- OFF-0040: match cadence to real use; too much product causes cancels.
- EML-0019: lapse at about twice the purchase interval.
- EML-6326: Klaviyo predictions and their data floor.
- OFF-0065: discounts raise break-even sharply.
- EML-0048: India WhatsApp journeys beat broadcasts.
- EML-6322: WhatsApp per-message pricing by category.
- EML-0024: SMS length and segment billing.
- EML-0056: attributed revenue is not incremental.
- EML-0061: flow test size per variant.
- EML-0023: test delays first.

What makes this skill ours: each reminder day comes from cleaned reorder gaps counted from delivery and checked against the label's usage cycle; days scale with the quantity bought; stock-outs pause the branch before the flow sells what the store cannot ship; and success is a reorder lift over a holdout, not attributed revenue.
