# Win-back programme for lapsed Blue Tokai buyers

## The decision

Work the groups in this order: buyers slipping now (46 to 90 days), Monsoon Dark buyers, 91 to 180 days, 181 to 365 days, then one goodbye email for 365+ days. Ex-subscribers come last, and only after subscription delivery is fixed.

**What it's worth (projection):** ₹3.1 to 6.4 lakh gross profit from first returning orders; ₹4.2 to 8.6 lakh over 12 months if returners repeat at your old 34% rate.

**The bad news:**
- Subscription on-time delivery fell from 95% to 79% after the June courier change. "Arrived late, I ran out" drove 39% of 2,400 cancels, about 940 people. Win them back into late service and you lose them twice.
- Retiring Monsoon Dark cost you customers. It was the last coffee for 29% of buyers lapsed 181 to 365 days (4,300 of 15,000), against 6% in the 91 to 180 band.

Nothing goes above 15%, so no founder sign-off is needed.

**First move this week:** pull a random 10% holdout from each group, then send step 1 to the slipping group on Tuesday 17 November.

**Assumptions:**
1. ₹1,150 is net revenue, so gross profit per order is ₹1,150 × 58% − ₹110 = ₹557.
2. The 2,400 ex-subscribers sit in the 46 to 180 day bands in proportion (about 940 and 1,460) and are pulled out of them.
3. Return rates are planning figures until the holdout reads. A WhatsApp marketing message costs about ₹1.

## 1. Who to target, and in what order

Your median gap to a second order is 34 days, so a buyer is lapsed at 68.

| Wave | Group | Customers | Why here | Step 1 |
|---|---|---|---|---|
| 1 | G1 Slipping, 46 to 90 days | 8,060 | Closest to buying, no offer needed | Tue 17 Nov |
| 2 | G2 Monsoon Dark, 91 to 365 days | 5,200 | One clear reason, one clear fix | Thu 19 Nov |
| 3 | G3 Lapsed, 91 to 180 days | 11,640 | Large and still warm | Tue 24 Nov |
| 4 | G4 Lapsed, 181 to 365 days | 10,700 | Colder; three slices, newest first | Tue 1, 8, 15 Dec |
| 5 | G5 Gone, 365+ days | 11,000 | One email, then sunset | Tue 5 Jan |
| 6 | G6 Ex-subscribers | 2,400 | Only after the delivery gate | Week after the gate |

- Content follows the last purchase: their own coffee by name. Equipment-only buyers (2,800) get "Tell us how you brew, and we'll suggest a coffee."
- Cold brew buyers (4,300) start on 23 February 2027, as the weather warms.
- Open complaints or returns on the last order get support, not marketing.

**G6 gate:** subscription on-time delivery at 93% or better for four weeks in a row, and pick-your-date delivery live. Nisha named the fix: "I'd come back if I could pick the delivery date."

## 2. Offer logic

10% off costs ₹115 of the ₹557. At the 15% cap we keep ₹385, still 69% of normal profit.

| Group | Steps 1 and 2 | Step 3 |
|---|---|---|
| G1 | Their coffee, one-tap reorder | No offer; brew tip |
| G2 | "Tell us how you brew", then their named match | 10% off the match |
| G3 | Their coffee or a match | 10% off |
| G4 | Their coffee; 10% off at step 2 | 15% off |
| G5 | One email: match plus 15% off | None |
| G6 | Pick your date, smaller bag, longer gap, easy pause | 15% off the first box, only for price cancels (13%) |

Codes are single-use with a real 7-day end date. G1 never gets a code: like Aarav, they ran out and drifted, and a reminder fixes that.

## 3. Sequence and timing

| Step | Day | Email | WhatsApp (opted-in only) |
|---|---|---|---|
| 1 | 0 | 8 am, the morning brew | None |
| 2 | 7 | 8 am | 11 am weekdays, one message |
| 3 | 14 | 8 am, offer where allowed | None |
| Sunset | 21 | "Stay or go" email if no click or site visit | None |

- **Exit:** any order, subscription restart, support ticket or unsubscribe. No click after the sunset email: suppress from marketing email.
- G5 gets step 1 and sunset only. After wave 1, G1 runs always-on from day 68.
- Emails carry sender, postal address and one-click unsubscribe.

## 4. First message drafts

The brew tip changes with the grind on the last order.

**G1 email, step 1**
Subject: Running low on {{ last_coffee | default: "your coffee" }}?
Preview: Same coffee, same grind, one tap.

Hi {{ first_name | default: "there" }},

It's been a while since your last bag of {{ last_coffee | default: "House Blend" }}. If you brew every day, it's probably close to empty.

Same coffee, same grind, so your next cup tastes like your last one.

**Brew tip:** for a French press, use a coarse grind and steep for 4 minutes. Then press slowly.

[Reorder my coffee]

**G2 email, step 1**
Subject: Monsoon Dark is retired. Let's find your next one
Preview: Tell us how you brew, and we'll suggest a coffee.

Hi {{ first_name | default: "there" }},

You chose Monsoon Dark. We stopped selling it in March, and we know that left a gap in your mornings.

Tell us three things: how you brew, milk or black, and how bold you like it. We'll suggest the one coffee we roast today that comes closest. One coffee, not a list of 40.

**Brew tip:** dark roasts turn bitter if the water is too hot. Let the kettle rest 30 seconds off the boil.

[Tell us how you brew]

**G6 email, step 1 (only after the gate)**
Subject: Now you pick the delivery date
Preview: Your subscription, on the day you choose.

Hi {{ first_name | default: "there" }},

Some subscription boxes reached you late this year. You told us, and we listened.

You can now pick your delivery date and change it any time. Choose a smaller bag or a longer gap, or pause from your account.

**Brew tip:** weigh your coffee. 15 grams for 250 ml of water is a good start.

[Choose my date]

**WhatsApp, step 2 (G1 and G3)**
Hi {{1}}, it's Blue Tokai. Time for more {{2}}? Tip: grind just before you brew if you buy whole beans. Tap below for the same coffee, same grind.
Button: Reorder {{2}}
Reply STOP to opt out.

## 5. Measuring true lift

- **Holdout:** before any send, hold back a random 10% of each group's reachable customers from all win-back messages.
- **Read:** 60 days after step 3, from order data, not the email tool: share who ordered, and gross profit per customer after discounts and shipping, contacted versus held out.
- **True gain** = (profit per contacted customer − profit per held-out customer) × contacted − message costs.
- **WhatsApp's own lift:** split opt-ins 50/50 at step 2, message or email only.
- **Keep or change:** keep a group if its true gain is above zero. If G4 or G5 lifts under 1 point, drop the step 3 offer. G6's small holdout shows only lifts of 6 points or more.
- **Guardrail:** pause a slice if spam complaints pass 0.3% of a send.

## 6. What it's worth if it works

Planned on the 62% you can email, after the holdout. "Extra" means above the holdout.

| Group | Contacted | Extra return rate | Extra returners | Profit each | Extra profit |
|---|---|---|---|---|---|
| G1 | 4,497 | 4 to 8% | 180 to 360 | ₹557 | ₹0.97 to 1.97 lakh |
| G2 | 2,902 | 4 to 8% | 116 to 232 | ₹442 | ₹0.49 to 1.01 lakh |
| G3 | 6,495 | 3 to 6% | 195 to 390 | ₹442 | ₹0.82 to 1.68 lakh |
| G4 | 5,971 | 1.5 to 3% | 90 to 179 | ₹385 | ₹0.31 to 0.65 lakh |
| G5 | 6,138 | 0.5 to 1% | 31 to 61 | ₹385 | ₹0.12 to 0.24 lakh |
| G6 | 1,339 | 6 to 12% | 80 to 161 | ₹535 | ₹0.42 to 0.85 lakh |
| **Total** | **27,342** | | **692 to 1,383** | | **₹3.1 to 6.4 lakh** |

Totals are net of about ₹14,000 in WhatsApp costs. Each ex-subscriber who stays adds ₹557 per box.

## Bolder move: one more lot of Monsoon Dark, on pre-order

Offer G2 one Monsoon Dark lot, roasted only if 500 orders come in: about ₹2.8 lakh gross profit at full price (500 × ₹557).

- **First step:** by 20 November, sourcing confirms whether the beans can be bought for one lot. If yes, the pre-order replaces G2's step 3 offer.
- **Risk:** it was retired for a reason. If pre-orders miss 500, refund everyone within a week and send the match email.
