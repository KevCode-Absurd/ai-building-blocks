---
name: email-sms-flow-plan
description: "Plans every automated email, SMS and WhatsApp flow a store needs, ranked by the gross profit each one adds, starting from the store's real flow revenue and trigger volumes rather than a generic list. For each flow it sets the trigger, the split between new and returning buyers, the number of messages, the delay before each, the purpose of each message, the exit rule, and one target metric. Adds subscription flows where the store sells subscriptions and WhatsApp journeys, cash-on-delivery confirmation and prepaid nudges for India. Platform-neutral, with Klaviyo names as the example. Use when building flows for a new store, rebuilding a messy account, or adding SMS or WhatsApp."
---

# Email, SMS and WhatsApp flow plan

**You get:** a ranked flow build plan for email, SMS and WhatsApp, with every message's trigger, delay, purpose, exit rule and target metric, ready for a builder to set up in Klaviyo or a similar tool.

A ranked build plan: which flows, in what order, with every message's timing and job written down. Builders can work straight from it. Klaviyo names are the example; Omnisend, Shopify Email and WhatsApp tools have close equivalents.

## When to use

- A new store needs its automated flows built from scratch.
- An existing account has a pile of half-built flows and nobody knows which matter.
- The store adds SMS, or WhatsApp in India, and needs to know where each channel fits.
- After `email-account-health-audit` shows missing or weak flows.

## Not for

- Checking account settings, deliverability and list hygiene: use `email-account-health-audit` first.
- Writing the full post-purchase sequence with product-level timing: use `post-purchase-repeat-sequence`.
- Writing subject lines and bodies: use `email-copy-from-store-history`.
- One-off campaigns and the sending calendar: outside this skill; plan them after flows are live.

## What you need

Required (read access, level 1):

1. **Store category and catalogue**: what is sold, price range, whether products are used up (consumables), and whether subscriptions exist.
2. **Current flows and their numbers**, last 90 days: flow name, trigger, status, messages, recipients, placed orders, revenue, revenue per recipient. From the email platform's flow report or API through an official connector.
3. **Trigger volumes**, last 30 days: sign-ups, Viewed Product, Added to Cart, Started Checkout, Placed Order, first-time versus repeat orders. From the platform's metrics or Shopify.
4. **Gross profit per order** and gross margin, from `store-meta-math`.
5. **Order export** with Customer Id and Created at, to work out days between first and second order.

Optional: SMS list size and cost per message, WhatsApp Business provider, subscription app, reviews app, markets sold to.

If flow numbers are missing (new store), plan from trigger volumes alone and mark targets "to set after 30 days of data". Building flows needs draft access (level 2); switching any flow live needs a client yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when known. Fail: rank by attributed revenue and say so on the plan.
2. **Deliverability.** If `email-account-health-audit` shows engaged opens under 30 to 35% [EML-0059], fix that first; new flows into a bad inbox add little.
3. **Consent and channel rules.** SMS and WhatsApp need separate, recorded opt-ins. WhatsApp marketing and utility messages need approved templates. Name the markets and follow each platform's consent guide; no legal ruling here.
4. **Capacity and cash.** Ask how many flows the team can build and check per month, and the monthly budget for SMS or WhatsApp messages. Plan only what can be built and paid for.

## Steps

### 1. Read the current flows

Table each flow: trigger, messages, recipients, revenue per recipient (RPR), placed order rate, unsubscribe rate. Mark it healthy, weak or broken. A flow on the wrong trigger is broken even if it earns; the common case is a single abandonment flow on Started Checkout with nothing on Added to Cart [EML-0018].

Remember that attributed flow revenue is not proven extra revenue [EML-0056]. Use it to rank, not to promise.

### 2. Work out the store's own timing facts

- **Days between orders**: median days from first to second order, by top product if possible.
- **Delivery time**: days from order to delivery.
- **Usage cycle** for consumables: units divided by daily use.

These set win-back, replenishment and post-purchase timing below. Never use a fixed day count where the store's own number exists.

### 3. Size each flow

For an existing flow: gap a month = monthly entrants x (target RPR minus current RPR) x gross margin, where the target is the store's own best 30-day period for that flow.

For a missing flow: monthly entrants from step 1's trigger volumes x a planning conversion rate x gross profit per order. Use half the conversion rate of the store's closest existing flow as the planning rate (practitioner default, test it).

Rank flows by gap. Ties go to the flow closer to purchase.

### 4. Set the core flows

Split every flow first by new, returning and loyal or subscriber buyers; under about 10 to 20 million a year the usual limit on growth is first-to-second order conversion [EML-0053].

| Flow | Trigger | Messages and timing | Purpose | Exit rule | Target metric |
|---|---|---|---|---|---|
| Welcome | List sign-up | Email 1 at once with the promised code; plain-text follow-up about 8 hours later; then daily to email 6, ending with a 24-hour expiry note [EML-0060] [EML-0045] | Deliver the offer, tell the story, answer objections, show bestsellers | Placed Order | Placed order rate of sign-ups within 14 days |
| Browse abandon | Viewed Product | 1 to 3 emails, first 30 minutes to 2 hours after [EML-0064] | Bring back the product viewed | Added to Cart or order | RPR |
| Added to cart | Added to Cart, no checkout | First email 30 to 45 minutes after [EML-0018]; 3 to 5 in all | Remove the doubt that stopped them | Checkout or order | Placed order rate |
| Checkout abandon | Started Checkout | First email 15 to 60 minutes after [EML-0064]; SMS sent at the same time as email 1, not hours later [EML-0012]; 6 to 8 messages in all [EML-0019] | Recover the order; any discount held to about message 5 with a real 48-hour expiry [EML-0044] | Placed Order | Recovery rate |
| Post-purchase | Placed Order | Thank-you with one cross-sell about 10 minutes after; reassurance 2 days later [EML-0062]; how-to after delivery | Build trust and use; lead to second order | Second order | First-to-second order rate at 60 days |
| Replenishment (consumables) | Placed Order of a used-up product | One reminder at about 75% of the usage cycle; at most two per cycle [EML-0049] | Reorder before they run out | Reorder | Reorder rate |
| Win-back | No order since twice the median days between orders [EML-0019] | 3 emails; test an earlier start at 30 to 45 days for repeat products [EML-0050] | Bring a lapsed buyer back | Order | Reactivation rate |
| Sunset | No engagement in the engaged window | 1 to 2 emails asking to stay | Protect the inbox | Click | Share suppressed |

Second-wave flows, built after the core set earns:

| Flow | Trigger | Rule |
|---|---|---|
| Review request | Delivered, plus time to feel a result | Days after delivery set per product: quick-use items about a week, skincare and supplements once results show (practitioner default, test it) |
| VIP | Top 10 to 20% of customers by 12-month gross profit | Early access and service, not deeper discounts |
| Birthday or anniversary | Date field | Last; only once core flows earn |

Category tilts (practitioner defaults, test them): fashion leans on browse abandon, a size guide in cart emails and new-arrival alerts; home and furniture on longer cart flows and care or assembly how-tos; consumables, food and pet on replenishment timed from real usage; baby on age-stage flows.

Smart sending stays off on flows [EML-0043]. When the plan and a card disagree on length, the shorter version ships first and messages are added only when the extra message earns more than it costs in unsubscribes.

### 5. Add SMS where it pays

- Welcome texts on days 1, 3 and 5; one abandonment text within 48 hours (the US limit on Klaviyo); SMS win-back at twice the average days between orders [EML-0029].
- Keep each text under 160 characters with no emoji; an emoji drops the limit to 70 and one extra character bills two segments [EML-0024]. Save MMS for welcome, abandonment and launches [EML-0028].
- End one welcome text with a simple question; people who reply showed about 1.5 times the lifetime value [EML-0035]. Only do this if someone can answer fast.

Cost check per SMS step: recipients x segments x cost per segment must be below the step's expected gross profit.

### 6. Add subscription flows (only if the store sells subscriptions)

- Rebuild the renewal reminder: benefits first, delay button high, manage link low; one brand cut cancels from it from 8.6% to 5.8% [EML-0003].
- Onboarding emails daily before delivery, then quiet in days 7 to 14 after receipt, when cancels spike [EML-0004].
- Failed-payment flows split by payment method; weak dunning loses 5 to 10% of subscription revenue at some brands [EML-0007].
- Cancelled-subscriber win-back 30 to 60 days after cancelling [EML-0006].

### 7. India: WhatsApp and cash on delivery

Automated WhatsApp journeys averaged 11.12% click rate versus 2.6% for broadcasts across Indian brands [EML-0048]. Plan them as their own channel:

- **Order confirmation and COD confirmation** (utility template): within minutes of a COD order, ask the buyer to confirm or cancel. Practitioner default, test it: unconfirmed COD orders are held, not shipped, which cuts return to origin.
- **Prepaid nudge**: offer a small prepaid saving to convert a COD order before dispatch, if `store-meta-math` shows the saving costs less than the expected return-to-origin loss.
- **Abandoned checkout** (marketing template): one WhatsApp message alongside email 1.
- **Shipping and delivery updates** (utility template), with the tracking link.
- **Loyalty points expiry reminders** by message suit repeat categories; one Indian brand used 60-day expiring coins this way [CXP-0019].

WhatsApp charges per message by category; check the provider's current rates and add them to the cost check in step 5.

### 8. Order the build

Build in the rank order from step 3, but always in this sequence where ranks tie: fix broken triggers, then checkout and cart, then welcome, then post-purchase, then the rest. Test flow delays before message content; delay changes often move placed orders more [EML-0023]. Flow tests need about 1,000 recipients per variant [EML-0061].

## Checks before you hand it over

- Every flow has a trigger, split, message count, delay per message, purpose per message, exit rule and one target metric.
- Win-back, replenishment and post-purchase timing come from the store's own day counts.
- Each flow carries a gross profit gap or planning figure, labelled attributed.
- SMS and WhatsApp steps pass the cost check.
- Consent and template needs are listed per channel.
- The plan fits the stated build capacity and message budget.
- No flow was switched on without a client yes.

## Output

1. **One-screen summary:** the five flows to build or fix first, the gross profit gap each closes, and the build order for the next 30 days.
2. **Flow plan table:** Rank, Flow, Trigger, Split, Channel, Message number, Delay, Purpose, Exit rule, Target metric, Current, Gap a month.
3. **Channel costs table:** Step, Channel, Monthly sends, Cost, Expected gross profit.
4. **Build checklist** per flow for the builder.
5. **File:** `flow-plan.csv` or a Google Sheet.

## Common mistakes

- **Copying a generic flow list.** Step 3 ranks by the store's own gaps.
- **Fixed win-back days.** Step 2 uses the store's own days between orders.
- **Discount in the first abandonment email.** Hold it late with a real expiry [EML-0044].
- **SMS that costs more than it earns.** Step 5 checks every step.
- **WhatsApp broadcast blasts.** Journeys tied to triggers beat broadcasts [EML-0048].
- **One message for new and repeat buyers.** Step 4 splits first.

## Sources

- EML-0003, EML-0004, EML-0006, EML-0007: subscription flows.
- EML-0012, EML-0018, EML-0044, EML-0064: abandonment triggers and timing.
- EML-0019, EML-0050: flow lengths and win-back timing.
- EML-0023, EML-0061: test delays first; flow test sizes.
- EML-0024, EML-0028, EML-0029, EML-0035: SMS length, cost and flows.
- EML-0043, EML-0056, EML-0059: smart sending, attribution, inbox floor.
- EML-0045, EML-0060: welcome timing.
- EML-0048, CXP-0019: WhatsApp journeys and loyalty expiry in India.
- EML-0049, EML-0062: replenishment and post-purchase timing.
- EML-0053: split by new, returning and loyal.

What makes this skill ours: flows are ranked by the gross profit gap from the store's own numbers, not a standard list; timing comes from the store's real days between orders and usage cycles; every SMS and WhatsApp step must pay for itself; and India gets COD confirmation and prepaid nudges tied to return-to-origin losses.
