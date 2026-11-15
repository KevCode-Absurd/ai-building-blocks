---
name: cut-subscription-churn
description: "A churn fix plan for a store that already sells subscriptions: cancels charted by day since the first order to find the store's own spikes, each spike given a cause and an owner, the billing reminder and rebill confirmation rebuilt in the email tool, a pre-delivery onboarding run that teaches one habit, a cancel flow with one save per reason and delay instead of pause, failed payment recovery by decline type, subscribers kept out of sitewide sales, gifts placed on the months people leave, and a win-back for cancelled subscribers, all measured as cancels per 100 subscribers and gross profit kept. Use when monthly churn is high, save rate is under 15%, cancels jump after a campaign or billing email, or failed payments eat revenue."
---

# Cut subscription churn

**You get:** a churn map (cancels per day in each window since the first order, with the store's spikes marked), a fix list ranked by subscribers kept a month, rewritten billing reminder and rebill confirmation emails, a pre-delivery onboarding plan, a cancel flow table, a failed payment recovery plan, a subscriber-only send calendar, and a tracker that reads each fix in cancels per 100 subscribers and gross profit.

## When to use

- The store has run subscriptions for at least three months and monthly churn is high or rising.
- Cancel flow save rate is under about 15%, or the cancel flow is the app's default.
- Cancels jump after a sitewide sale, a campaign or the billing reminder.
- Failed payments or expired cards quietly end subscriptions.
- The owner wants to know which day and which message makes people leave.

## Not for

- Designing a new subscribe-and-save offer, its discount, frequencies and margin model: use `design-subscribe-and-save-program`.
- Planning every lifecycle flow from scratch: use `email-sms-flow-plan`.
- Win-back for one-time buyers who stopped ordering: use `win-back-lapsed-customers` and `write-win-back-email-series`.
- Reorder reminders for buyers who do not subscribe: use `replenishment-reminder-timing`.
- Loyalty or VIP perks across all buyers: use `design-loyalty-program` or `vip-customer-program`.

## What you need

Required (read access, level 1):

1. **Subscription app export** for the last 6 to 12 months: subscriber id, start date, first order date, plan, frequency, each rebill date and amount, skips, delays, swaps, frequency changes, cancel date, cancel reason, failed payment events and their decline codes.
2. **Email and SMS send log** for subscribers: every campaign and flow message with send date.
3. **The current billing reminder, rebill confirmation and cancel flow** as screenshots or text.
4. **Gross profit per subscription order** after discount, product, packing, shipping and payment fees.

Optional: cancel reason free text, a short survey of when and how subscribers use the product, gift costs, and support tickets from subscribers.

Rewriting emails and building the cancel flow in draft is level 2. Turning on a new flow, changing a live subscriber's price or terms, and any send need the owner's yes.

## Before you start: the gates

1. **Enough history.** At least 300 cancels, or three months of starts, so day windows are not noise. Fail: read the windows but label every spike "early sign".
2. **Churn defined one way.** Monthly churn = cancels in the month / active subscribers at the start of the month. Count failed payment endings apart from chosen cancels, because the fixes differ. Fail: rebuild the numbers before any fix.
3. **Cancel stays easy.** Every fix keeps cancel findable and quick. US rules on online subscriptions want clear terms, consent before charging and a simple way to stop [OFF-6304]; UK and EU law treats hidden cancel and surprise renewals as unfair. No step in this plan hides cancel or adds hoops.
4. **Margin known.** Gross profit per order is in, so every save offer and gift can be checked against what it costs.

## Steps

### 1. Chart cancels by day since the first order

Group cancels into windows: day 0 to 1, days 2 to 6, days 7 to 14 (first delivery and try-out), around day 28 (the billing reminder), the first rebill day, days 31 to 45, then months 2 to 6. Windows differ in length, so compare cancels per day in each. Practitioners see spikes on day 1 (deal hunters), around day 28 and in days 31 to 45 [CXP-0021]; one brand's biggest spike was the first rebill, set off by the plain order confirmation, about double the reminder spike [EML-0002]. Treat these as places to look, not facts about this store. Call a window a spike when its cancels per day are at least 1.5 times the average of the others (our starting rule; adjust it).

### 2. Give each spike a cause and an owner

| Window | Likely cause | Fix in step |
|---|---|---|
| Day 0 to 1 | Took the first-order deal, never meant to stay | 3 (onboarding), offer review with `design-subscribe-and-save-program` |
| Days 2 to 14 | Product not yet tried, or tried and unsure | 3 |
| Around day 28 | Billing reminder reads like a warning | 4 |
| First rebill | Plain confirmation, surprise charge, too much product | 4, 5 |
| Days 31 to 45 and months 2 to 6 | Stockpile, boredom, campaign nudges | 5, 7, 8 |
| Any day, payment failed | Expired or declined card | 6 |

Also count cancels within three days of every send to subscribers. Flag any send where cancels beat new starts.

### 3. Onboard before the box arrives

Send short daily onboarding emails in the days before delivery, when almost nobody cancels, then go quiet while the product is first used [EML-0004]. Each email teaches one thing: how to use it, when results show, what most buyers do on day one. Survey subscribers once on when and how they use the product, find the routine with the best retention, and push that one habit [EML-0005]. For products with no quick effect, frame a 90-day prove-it trial with a day-zero photo or a use log [CXP-0003].

### 4. Rebuild the billing reminder and the rebill confirmation

Move both out of the subscription app into the email tool so they can use live order data and a real design. Reminder order: a warm line, the product coming and its date and amount stated plainly, the benefits and any gift in this box, a one-click delay link high up, one cross-sell, and the manage subscription link lower down. One brand cut cancels from that email from 8.6% to 5.8% with this layout [EML-0003]. Write a different reminder for rebills 1 to 6, so each fits where the subscriber is. Rebuild the confirmation for the first rebill with the benefits, what comes next and any gift as the headline. Keep amount, date and cancel clear; some US states require notice before a renewal charge, so never drop the reminder.

### 5. Build the cancel flow with one save per reason

Open with a short founder or brand message, about a minute, that restates why the product exists and offers a delay; one practitioner saw save rates move from about 5 to 6% to about 15% with a founder video [CXP-0002]. Ask one question with six or seven reasons and route each to one save [CXP-0004]:

| Reason | Save offer |
|---|---|
| Too much product | Skip, delay or a longer frequency; a smaller pack. Never a discount. |
| Need a break | Delay up to 30 days that restarts on its own date |
| Too expensive: not worth it | Show what they get and what they would lose (points, price lock) |
| Too expensive: no budget | A bigger discount on the next order, or a cheaper plan |
| Did not like it | Swap to another flavour, size or product |
| Not the result I wanted | Another variant, plus how long results really take, if true |
| Found another brand | One short line on what is different |

Replace open-ended pause with skip or delay; few paused subscribers ever come back, and those who change frequency often stay far longer [CXP-0005]. Bigger next-order discounts save more than gifts [CXP-0004], so cap the save discount by margin and judge it on orders after the save. Targets: about 15% saved is good, 20% strong, under 10% needs work [CXP-0001]. Each month, swap out the one or two least chosen reasons.

### 6. Recover failed payments

Failed payments and weak recovery can cost 5 to 10% of subscription revenue [EML-0007]. Build the recovery in four parts:

- **Before it fails:** card expiry emails 30, 15 and 7 days before the card expires, with a one-click update link; turn on the payment provider's card updater if it has one.
- **Retry by decline type:** soft declines (low funds, timeout) retry three to five times over 7 to 10 days, for example at 1, 3 and 5 days; hard declines (card closed, stolen) do not retry, ask for a new card.
- **Recovery messages:** email and text on day 0, 3 and 7, plain and friendly, one update link, no blame. Split flows by payment method.
- **Grace, then end:** keep the subscription open during retries, then end it with a "your plan is paused until you update your card" note, so it is not counted as a chosen cancel.

### 7. Protect subscribers from sales and fill the risky months

Keep active subscribers out of sitewide sale and promo emails, or give them a better subscriber-only offer, such as a discount on an add-on to the next box; one brand's campaigns caused more cancels than starts until it did this [EML-0001]. Limit subscribers to billing and order messages plus one to three thoughtful campaigns a month: founder notes, new flavours, community news. Place gifts on the months your cohorts usually leave, announce them in the reminder and confirmation, and make them something that helps use or tries a new product, never more of the same. An unannounced gift rarely pays for itself [CXP-0006]. Test a discount that grows the longer someone stays, timed to the months people cancel, and judge it on lifetime gross profit [EML-6387].

### 8. Win back cancelled subscribers

Wait 30 to 60 days after a cancel, then offer a deeper first reorder that returns to the standard discount after [EML-0006]. Test one strong offer for all cancelled subscribers each week rather than one flow per reason, so the read comes faster [EML-0008]. To test paid social as a win-back channel, split the cancelled list, upload half as a custom audience and compare restart rates with the held-out half [EML-6386]. Exclude anyone who cancelled for a product problem until that problem is fixed. Gift recipients are a second source: a printed card with a QR code and a credit from the giver can turn them into subscribers [EML-6388].

### 9. Measure each fix

For each fix: cancels per 100 subscribers in its window before and after, save rate, failed payment recovery rate, and gross profit per subscriber at months 3 and 6. Read on comparable cohorts. Hold out 10% from big changes, such as the reminder rebuild, for a clean read. A fix that cuts cancels but loses more gross profit in discounts than it keeps is not a win.

## Checks before you hand it over

- Churn uses one definition, with failed payment endings counted apart from chosen cancels.
- Every spike has cancels per day, a likely cause, a fix and an owner.
- Cancel is as easy as sign-up in every flow; no fix hides it.
- Every save offer and gift has its cost per subscriber checked against gross profit.
- Active subscribers are excluded from sitewide sales, or given their own better offer.
- Each fix has a before figure and a date to read the after figure.

## Output

**Churn map:** Window, Days, Cancels, Cancels per day, Spike (yes or no), Likely cause, Fix, Owner.

**Fix list:** Fix, Window, Subscribers kept a month (estimate), Cost a month, Gross profit kept, Effort, Date.

**Rewritten emails:** billing reminder for rebills 1 to 6, first rebill confirmation, onboarding emails, failed payment messages, subscriber-only campaign plan for the month.

**Cancel flow table:** Reason, Share of cancels, Save offer, Cost, Target save rate.

**Tracker:** Fix, Live date, Cancels per 100 before, After, Save rate, Gross profit per subscriber at months 3 and 6, Verdict.

## Common mistakes

- **One churn number for everything.** Step 1 charts cancels by day, and gate 2 splits failed payments from chosen cancels.
- **Leaving the reminder in the app.** Step 4 rebuilds it with the delay link high and the amount plain.
- **Discounts for too much product.** Step 5 offers skip, delay or a smaller pack instead.
- **Open-ended pause.** Step 5 uses a dated delay.
- **Sending sales to subscribers.** Step 7 keeps them out.
- **Hiding cancel to lift saves.** Gate 3 forbids it; it breaks trust and subscription law.
- **Judging on saves, not profit.** Step 9 reads gross profit kept.

## Sources

- CXP-0001: cancel flow save rate bands.
- CXP-0002: founder video on the cancel page.
- CXP-0003: 90-day prove-it framing at onboarding.
- CXP-0004: bigger next-order discount beats gifts; six or seven reasons.
- CXP-0005: delay instead of indefinite pause; frequency changes and value.
- CXP-0006: unannounced gifts rarely pay.
- CXP-0021: day 1, day 28 and days 31 to 45 spikes.
- EML-0001: keep subscribers out of sale campaigns.
- EML-0002: first rebill confirmation spike.
- EML-0003: rebuilt billing reminder layout.
- EML-0004: onboarding before delivery.
- EML-0005: push the routine with the best retention.
- EML-0006: subscriber win-back timing and offer.
- EML-0007: failed payments cost 5 to 10% of revenue.
- EML-0008: one aggressive win-back offer tested weekly.
- EML-6386: paid social win-back holdout test.
- EML-6387: discount that grows with tenure.
- EML-6388: turn gift recipients into subscribers.
- OFF-6304: US online subscription rules.

Built from the library items Subscription churn audit, Subscription cancel flow builder, Billing reminder and confirmation writer and Subscriber retention calendar. The failed payment steps are adapted from churn-prevention by Corey Haines, MIT, https://github.com/coreyhaines31/marketingskills/tree/main/skills/churn-prevention.

What makes this skill ours: churn is read by day since the first order, so each spike gets its own cause and fix; the reminder and confirmation are rebuilt instead of left in the app; saves are priced against gross profit; failed payments are counted apart and recovered by decline type; and cancel stays as easy as sign-up in every market.
