# Win-back programme: lapsed coffee buyers

## The short version

Most lapsed buyers did not leave over price. Something broke: they ran out, their coffee was stopped, or a subscription box came late. So we fix the reason first and use discounts second. If it works at the rates I assume below, it adds about **₹8.5 lakh in gross profit over 12 months**, with every rupee checked against a holdout group.

## Assumptions I made

- About 70% of each group can be reached on email, WhatsApp or both (62% email, 40% WhatsApp, with overlap).
- The 2,400 subscription cancellers mostly sit in the 0 to 180 day bands. They are pulled out of every other group so no one gets two sequences.
- The "Monsoon Dark" stop (8 months ago) explains why 4,300 buyers sit in the 181 to 365 day band. They lapsed because their coffee vanished.
- We know each customer's last coffee, its farm or roast, and their grind, so messages can name them.
- WhatsApp costs about ₹1 per marketing message. Email cost is close to zero.

## Who we target, and in what order

| Order | Group | Customers | Why this order |
|---|---|---|---|
| 1 | **A. Lapsed 91 to 180 days**, coffee still on sale | 13,100 | Biggest group that still remembers us. Their coffee is in stock. |
| 2 | **B. Monsoon Dark buyers**, any band | 5,200 | One clear reason for leaving, and one clear fix: a close match. |
| 3 | **C. Lapsed 181 to 365 days**, coffee still on sale | 10,700 | Colder, so they need a stronger offer. |
| 4 | **D. Subscription cancellers** | 2,400 | Highest value each, but only after delivery is fixed (see gate). |
| Test | **E. Over 365 days** | 11,000 | One low-cost email to see if anyone is left to win. |

Two sub-groups inside A and C get their own first message:
- **Equipment only (2,800):** they own a brewer but buy coffee elsewhere. Lead with "Tell us how you brew, and we'll suggest a coffee."
- **Cold brew (4,300):** it is November, so suggest a hot brew from the same farm now. Send a cold brew message in February.

**The gate for group D.** 39% of cancellers said "Coffee arrived late, I ran out." On-time delivery fell from 95% to 79% after the June courier change. That is about 936 subscribers lost to a delivery problem. Do not invite them back until on-time delivery is at 93% or higher for four weeks in a row. Win them back into the same late boxes and we lose them twice.

**Stop the leak while we do this.** The median gap between first and second order is 34 days. The 9,000 customers at 46 to 90 days are drifting now. Add a "Running low?" email and WhatsApp at day 28 after each order, with one-tap reorder. Aarav ran out and never came back.

## Offer logic

| Group | First touch | If no order after 7 days | Ceiling |
|---|---|---|---|
| A | No discount. One-tap reorder of their last coffee, freshly roasted. | Split test: 10% off **or** free shipping (costs us ₹110, close to 10%). | 10% |
| B | No discount. Our roasters' closest match to Monsoon Dark. | 10% off the first bag of the match. | 10% |
| C | 10% off their last coffee from the start. | Customers with 2+ past orders get 15%. Others stay at 10%. | 15% |
| D | Pick your own delivery date, smaller bag, skip or pause any time. | 10% off the first box back. | 10% |
| E | One email, no discount, with the brew quiz. | None. | 0% |

No offer goes above 15%, so none needs the founder's approval. A and B start without a discount because 10% off cuts gross profit per order from ₹557 to ₹442. For people who would return anyway, that is pure loss.

For group D, each top cancel reason gets its own fix. Late delivery (39%): pick a date, plus proof that on-time delivery is back. Too much coffee (22%): smaller bag or every other month. Price (13%): the 10%. Moving or travelling (9%): pause, not cancel.

**Assumption:** ops can add delivery-date choice. If they cannot by launch, offer "skip or move any delivery" and hold group D one more month.

## Sequence and timing

Every sequence stops when the customer orders. Max one WhatsApp a week. Send Tuesday to Thursday mornings at first.

| Day | Channel | Message |
|---|---|---|
| 0 | Email | Main message: your coffee or your match, brew tip, one button. |
| 3 | WhatsApp (opt-ins who have not ordered) | Short version with a one-tap link. |
| 7 | Email | Offer from the table above, ends in 7 days. |
| 12 | WhatsApp | "Offer ends Sunday" reminder. |
| 21 | Email | Brew quiz: "Tell us how you brew." No offer. Then stop. |

Launch order: A in week 1, B in week 2, C in week 3, E in week 6. D starts when the gate is met. Customers with no WhatsApp opt-in get only the three emails.

## First message drafts

Merge fields are in {{braces}}.

**Group A, day 0 email**
Subject: Your {{last_coffee}} is fresh off this week's roast

Hi {{first_name}},

Your last bag was {{last_coffee}} from {{estate}}. We just roasted a new batch. No need to look through the whole shop: your coffee is one tap away.

Brew tip: in a French press, use 1 gram of coffee for every 15 grams of water. Steep for 4 minutes, then press slowly.

**[Reorder my {{last_coffee}}]**

**Group A, day 3 WhatsApp**
Hi {{first_name}}, a fresh batch of {{last_coffee}} from {{estate}} is ready. Tip: let your kettle rest 30 seconds after it boils before you pour. Reorder in one tap: {{link}}

**Group B, day 0 email**
Subject: Missing Monsoon Dark? Try this one.

Hi {{first_name}},

You bought Monsoon Dark, and we stopped roasting it earlier this year. We asked our roasters which coffee comes closest. Their pick is {{match_roast}} from {{match_estate}}: {{tasting_notes}}.

Brew tip: dark roasts can turn bitter in very hot water. Let the kettle rest for a minute after it boils.

**[Try {{match_roast}}]**

**Group D, day 0 email (only after the gate is met)**
Subject: Now you pick the day your coffee arrives

Hi {{first_name}},

You told us your coffee came late. You were right, and we have fixed it. In the last four weeks, {{on_time_rate}}% of subscription boxes arrived on time.

Now you can choose your delivery day. You can also get a smaller bag, skip a month or pause any time. Your {{last_coffee}} from {{estate}} is ready to go.

Brew tip: grind just before you brew, if you can. Fresh grounds keep more flavour.

**[Restart my subscription]**

**Equipment only, day 0 WhatsApp**
Hi {{first_name}}, how's your {{equipment}}? Tell us how you brew, and we'll suggest a coffee from an Indian farm to match. It takes 30 seconds: {{quiz_link}}

## How to measure true lift

1. **Random holdout.** Before sending, randomly hold back 10% of each group (15% of B and D, which are smaller). Do this among contactable customers, sorted by last coffee. The holdout gets no win-back messages at all.
2. **One main number.** Gross profit per customer over 60 days, sent group minus holdout. Count all orders, not just coupon redemptions. Many coupon users would have ordered anyway.
3. **Lift = sent order rate minus holdout order rate.** With 1,310 held out in group A, a lift of about 1.5 points or more is real.
4. **Offer tests inside the sent group.** 10% off vs free shipping in A. 10% vs 15% for repeat buyers in C. Pick the winner on gross profit, not on order count.
5. **Check after 180 days.** Did returned customers order again, or lapse a second time? Also track unsubscribes and WhatsApp blocks weekly.

## What it is worth

Gross profit per full-price order: ₹1,150 x 58% minus ₹110 = **₹557**. At 10% off: **₹442**.

I assume each won-back buyer places 2 orders in 12 months (one at 10% off, one at full price), worth ₹999. A won-back subscriber places 4 orders (one at 10% off), worth ₹2,113. The lift rates are my assumptions, above the holdout.

| Group | Reachable | Assumed lift | Won back | Gross profit |
|---|---|---|---|---|
| A | 9,170 | 4.0% | 367 | ₹3,66,633 |
| B | 3,640 | 3.0% | 109 | ₹1,08,891 |
| C | 7,490 | 2.5% | 187 | ₹1,86,813 |
| D | 1,680 | 8.0% | 134 | ₹2,83,142 |
| **Total** | | | **797** | **₹9,45,479** |

Costs to subtract:
- **Discounts to people who would have bought anyway:** about 3% of the 20,300 reached in A, B and C, so 609 orders x ₹115 = ₹70,035.
- **WhatsApp:** about 12,560 opted-in customers x 2 messages x ₹1 = ₹25,120.

**Net: about ₹8.5 lakh in gross profit over 12 months.** If lift is half what I assume, it is about ₹3.8 lakh. If it is double, about ₹18 lakh. Group E is excluded until its test shows a result.

Two things matter more than any message. The delivery fix: without it, group D is worth nothing. And the repeat rate drop from 34% to 28%, which on 60,000 customers is 3,600 fewer repeat buyers. The day-28 nudge is the cheapest way to stop it.
