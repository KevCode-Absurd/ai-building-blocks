---
name: design-subscribe-and-save-program
description: "A subscribe-and-save offer for the store's repeat-use products: which products qualify, the discount (front-loaded or flat), delivery frequencies set from real usage, the first-order gift, skip, delay, swap and cancel rules, the cancel flow with save offers by reason, and a margin model that shows gross profit per subscriber over 6 and 12 months after churn and failed payments. Covers US online subscription law (clear terms, consent, easy cancel), India recurring payment rules and COD limits, and how to place the offer on the product page. Tool-neutral, with Shopify's own Subscriptions app as the example. Use before launching subscriptions or when subscribers cancel fast."
---

# Subscribe and save program

**You get:** a one-page subscription offer (eligible products, discount, frequencies, gift, skip and cancel rules), a cancel-flow table with a save action per reason, a margin model sheet by month, the product page placement, and a launch checklist, ready for the client to approve and set up.

## When to use

- The store sells products people use up (coffee, supplements, skincare, pet food, cleaning refills).
- The owner wants recurring revenue and steadier cash.
- An existing subscription loses most subscribers in the first two or three orders.
- One-time buyers already reorder on a regular cycle.

## Not for

- Points and tiers for all buyers: use `design-loyalty-program`.
- Bundles, thresholds and one-time discounts: use `offer-bundle-threshold-design`.
- Subscription emails (reminders, dunning, win-back): plan them with `email-sms-flow-plan`.
- Measuring repeat cycles by cohort: run `cohort-repeat-and-ltv-analysis` first.

## What you need

Required (read access, level 1):

1. **Shopify order export, 12 months**: Name, Created at, Customer Id, Lineitem sku, Lineitem quantity, Subtotal, Discount Amount, Shipping, Payment Method, Refunded Amount.
2. **Landed cost per SKU**, shipping cost by units per order and payment fees, from `build-sku-profit-sheet`.
3. **Usage facts per product**: units per pack and typical daily use.
4. **Median days between orders** per product from `cohort-repeat-and-ltv-analysis`.
5. **Payment set-up**: gateway, whether it supports recurring card or UPI mandates, share of COD orders.

Optional: an existing subscription app's data (active, new, cancelled, reasons, skips, failed payments).

Setting up plans and the cancel flow needs draft access (level 2); turning subscriptions on and any price change for existing subscribers need the client's yes.

## Before you start: the gates

1. **Repeat use is real.** At least one product is used up on a cycle and is bought again by a meaningful share of buyers. Fail: no subscription; use bundles instead.
2. **Margin after discount.** Gross profit per subscription order, after the recurring discount, shipping and fees, must stay positive and above the one-time order's gross profit per month of customer life. Computed in step 5.
3. **Payments can recur.** US: card on file through the subscription app. India: recurring card charges need an e-mandate with extra authentication, a bank notice at least 24 hours before each charge, and the buyer can opt out any time [OFF-6307]; COD cannot be a subscription. Fail: offer a prepaid multi-month pack instead.
4. **Legal terms.** US online subscriptions need clear terms before billing details, express consent, and a simple way to stop charges [OFF-6304]. In India, making cancellation hard, or taking card details for auto-debit during a free period, is a subscription trap under the dark-pattern guidelines [CXP-6608]; keep cancel as easy as sign-up. General practice, not a legal ruling.
5. **Capacity.** Recurring orders need stock planned ahead and a monthly shipping peak the warehouse can handle.

## Steps

### 1. Pick the products

Eligible: used up on a cycle, reordered by buyers already, gross margin high enough to carry a discount. Rank by current repeat buyers times gross profit per order. Start with one to three hero products.

### 2. Set frequencies from real usage

Days per pack = units per pack / daily use. Offer the frequency closest to that, plus one shorter and one longer. Too much product is the most common cancel reason; a 30-day cadence on a product that lasts 45 days guarantees churn [OFF-0040]. Default the selector to the usage-based frequency, not the shortest.

### 3. Set the discount

Two options to model:

- **Front-loaded:** about 25 to 30% off the first order, then 5 to 10% on later ones, to win the first subscribe [OFF-0029].
- **Flat:** the same discount every order, simpler to explain.

Instead of a deeper discount, consider a catalogue gift whose landed cost is below the extra discount [OFF-0044]. On low-price items, quantity tiers can work better than flat subscribe-and-save and deter discount hunters [OFF-0045]. Make sure any site pop-up offer does not undercut the subscription; a one-time 10% pop-up beside a 20% subscription confuses buyers [OFF-0037].

### 4. Add a first-order gift that helps use

A gift should help the buyer use the product (a scoop, a frother, a shaker), not more of the same product, which drives skips and cancels [OFF-0039]. Show its value and make it subscription-only.

### 5. Build the margin model

Per month for 12 months, per 100 new subscribers:

- Active subscribers = previous month x (1 minus monthly churn). Churn = cancellations / subscribers at the start of the period; average life = 1 / churn [MEA-0027]. Use the store's own churn if it has subscriptions; if not, model 10%, 15% and 20% monthly as planning cases (practitioner default, test it).
- Orders = active subscribers x orders per month at the chosen frequency, minus skips.
- Gross profit = orders x gross profit per subscription order, minus failed payments; weak dunning loses 5 to 10% of subscription revenue at some brands [EML-0007].
- Compare with the same buyers' one-time path (their real repeat rate and gross profit).

Read payback by cohort with churn included; a naive 3-month payback became about 8 months once order-two churn was counted [FIN-0014]. One supplement brand saw subscription-first buyers reach about 50% higher 6-month value [OFF-0038]; treat that as a direction, not a forecast. Remember the ceiling: growth stops where monthly churn equals new subscribers [OFF-0042].

### 6. Write skip, delay, swap and cancel rules

- Subscribers can skip, delay, change frequency, swap product and cancel from their account without contacting support. Shopify's own Subscriptions app lets customers resume, skip and cancel from their account [OFF-6306]; check any app offers the same.
- Remove open-ended pauses; offer skip or delay up to 30 days instead, since few indefinite pauses ever restart [CXP-0005].
- Send a reminder before each charge with the date, amount and a one-click skip or delay link.

### 7. Design the cancel flow

Keep cancel a few clicks. Ask one question with six or seven reasons and route each to one save action [CXP-0004]:

| Reason | Save action offered once |
|---|---|
| Too much product | Change frequency |
| Too expensive | A bigger discount on the next order |
| Not seeing results | Usage tips and a delay |
| Moving or away | Skip or delay |
| Trying another product | Swap within the range |
| Bad experience | Hand to support |
| Other | Cancel with a thank-you |

Then cancel if they still want to. A save rate around 15% is good, 20% strong, under 10% needs work [CXP-0001]. Expect churn spikes in the first days, around the first billing reminder, and days 31 to 45 [CXP-0021]; time onboarding messages before those. Keep active subscribers out of sitewide sale emails or give them a better subscriber-only offer [EML-0001].

### 8. Place it on the product page

Show subscribe and one-time as two clear options with the price per delivery, frequency, savings and "skip or cancel any time" beside them. Auto-selecting subscription and giving one-time no discount raises take rate [OFF-0041], but the terms must stay plain; never show a quarterly charge as a monthly price that changes in the cart [OFF-0072].

### 9. India and US notes

- **India:** recurring cards and mandates work for prepaid buyers only; offer a prepaid 3-month pack at a discount to COD-heavy buyers. Tell buyers the bank will send a notice before each charge [OFF-6307]. Remind and confirm by WhatsApp with opt-in. Price includes GST.
- **US:** show the renewal price, frequency and how to cancel before checkout; get an active tick or button for consent; send a reminder before charges; cancel online in a few clicks [OFF-6304]. Some states add renewal-notice rules.

## Checks before you hand it over

- Eligible products are used up on a cycle and already reordered.
- Default frequency matches real usage per pack.
- Margin model shows 12 months by cohort with churn and failed payments.
- Gross profit per subscription order stays positive after discount.
- Skip, delay, swap and cancel work from the account without support.
- Cancel flow has one save action per reason and stays short.
- US terms, consent and easy cancel are in place; India uses mandates or prepaid packs, never COD.
- Nothing goes live without the client's yes.

## Output

**One-screen summary:** products, discount, default frequencies, 12-month gross profit per 100 subscribers at three churn rates, and the launch date.

**Offer sheet:** Product, Pack days, Frequencies, Default, First-order discount, Recurring discount, Gift, Gift landed cost.

**Margin model:** Month, Active subscribers, Orders, Revenue, Gross profit, Failed payment loss, Cumulative gross profit, One-time path comparison.

**Cancel flow table** as in step 7, plus **rules text** for skip, delay and cancel.

**Launch checklist:** app set-up, plans, reminders, cancel flow, product page, terms page, test order, test cancel.

## Common mistakes

- **Frequencies that oversupply.** Step 2 sets them from usage [OFF-0040].
- **Deep flat discounts.** Step 3 models front-loading and gifts first.
- **Payback without churn.** Step 5 reads cohorts with churn [FIN-0014].
- **Hard-to-cancel flows.** Gate 4 and step 7 keep cancel easy.
- **COD subscriptions in India.** Gate 3 uses mandates or prepaid packs.
- **Subscribers hit by public sales.** Step 7 gives them a better offer [EML-0001].

## Sources

- CXP-0001: cancel save rate bands.
- CXP-0004: bigger next-order discount saves more than gifts; 6 to 7 reasons.
- CXP-0005: drop indefinite pauses; skip up to 30 days.
- CXP-0021: churn spike timing.
- EML-0001: keep subscribers out of public sales.
- EML-0007: failed payments cost 5 to 10% of revenue.
- FIN-0014: cohort payback with churn.
- MEA-0027: churn and average life maths.
- OFF-0029: front-loaded discount.
- OFF-0037: pop-up offer must not undercut subscription.
- OFF-0038: subscription-first buyers' higher 6-month value.
- OFF-0039: gifts that help use the product.
- OFF-0040: cadence matched to consumption.
- OFF-0041: default selection raises take rate.
- OFF-0042: churn sets the subscriber ceiling.
- OFF-0044: gift instead of a deeper discount.
- OFF-0045: quantity tiers on low-priced items.
- OFF-0072: monthly-price display can confuse and breach state rules.
- OFF-6304: US online subscription law.
- OFF-6306: Shopify Subscriptions self-serve features.
- OFF-6307: India recurring card mandate rules.
- [CXP-6608]: India subscription traps: hard cancellation, hidden auto-debit, unannounced renewals.

What makes this skill ours: frequencies come from units per pack and daily use, not round numbers; the margin model runs 12 months by cohort with churn and failed payments; cancel stays as easy as sign-up under US and Indian rules; and COD-heavy Indian buyers get prepaid packs instead of subscriptions that cannot be charged.
