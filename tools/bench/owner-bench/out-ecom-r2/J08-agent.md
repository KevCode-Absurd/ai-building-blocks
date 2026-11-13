# Blue Tokai win-back programme

**The decision.** Win people back with their own coffee, named, plus one brew tip. Start at day 68, not day 90: your median gap between first and second order is 34 days, and a customer past twice that gap has lapsed. Keep every discount at 15% or less, so no founder sign-off is needed. Measure against a 10% random holdout.

**What it is worth (projection).** The 49,000 lapsed customers could bring 816 to 1,535 extra orders and ₹3.85 to ₹7.15 lakh in gross profit within about two months. After that, the always-on day-68 flow adds about ₹1.1 to ₹1.9 lakh a month.

**The bad news.**
- 4,300 of the 15,000 customers lapsed 181 to 365 days ago (29%) last bought Monsoon Dark, which you stopped selling 8 months ago.
- Subscription on-time delivery fell from 95% to 79% after the June courier change. 936 cancels (39% of 2,400) came from late coffee. Do not ask them back until delivery is fixed.

**First move this week.** Draw the holdouts, then switch on the day-68 flow and the Monsoon Dark emails.

## 1. Who to target, in order

Ranked by expected gross profit per reachable customer (section 6).

| Order | Group | Customers | Why |
|---|---|---|---|
| 1 | Just lapsed: each customer the day they pass 68 days | 9,000 now (46 to 90 days), then about 6,000 a month (9,000 over 45 days) | Many simply ran out, like Aarav. |
| 2 | Monsoon Dark buyers, 91 to 365 days | 5,200 | A clear reason to leave, answered with a named swap. |
| 3 | Lapsed 91 to 180 days, coffee still on sale | 13,100 | Their exact coffee is one tap away. |
| 4 | Lapsed 181 to 365 days, coffee still on sale | 10,700 | Colder; needs a reason to act. |
| 5 | Over 365 days | 11,000 | Coldest; two emails, then sunset. |
| S | Subscribers who cancelled in the last 6 months | 2,400 | Run by cancel reason; taken out of groups 1 to 5. |

Open complaints or returns get support first, not marketing.

## 2. Offer logic

Gross profit on an average order is ₹557 (₹1,150 x 58%, minus ₹110 shipping and fees). A 15% code costs ₹172.50 and leaves ₹384.50, still 69% of normal profit. So 15% is a safe ceiling.

| Group | Message 1 | Message 2 | Message 3 |
|---|---|---|---|
| 1 | No offer | No offer | 10% off their coffee |
| 2 | No offer | 10% off the House Blend | Same code |
| 3 | No offer | No offer | 10% off |
| 4 | No offer | Random half 10%, half 15% | Same code |
| 5 | 15% off their coffee | Stay or go | None |

Group 4's split shows whether 15% earns its extra ₹57.50 per order. Every code ends a stated number of days after sending and never resets.

**Subscribers, by reason**, starting 30 days after the cancel:
- Late delivery (936): on hold until on-time delivery is back at 95% for 4 weeks in a row. Then one email, no offer. Nisha says it plainly: "I'd come back if I could pick the delivery date." Build that, then tell them.
- Too much coffee (528): a longer gap between deliveries or a skip. No discount.
- Price (312): 15% off the first delivery back.
- Moving (216) and other (408): one note at day 60 with a one-tap restart.

## 3. Sequence and timing per channel

| Step | Day | Channel | Groups |
|---|---|---|---|
| Message 1 | 0 | Email (62% opted in) | All |
| Message 2 | 6 | WhatsApp if opted in (40%), else email | 1 to 4 |
| Message 3 | 13 | Email | 1 to 4 |
| Stay or go | 20 (group 5: day 6) | Email | No click or visit yet |

- **Exit:** any order, preferences click or support ticket.
- **WhatsApp:** one message per person per sequence, 9 am to 8 pm, with "Reply STOP to opt out".
- **Email:** Blue Tokai Coffee Roasters as sender, postal address and one-click unsubscribe.
- **Sunset:** no response to stay-or-go means no more marketing email. Suppress, never delete; order emails continue.
- **Release:** groups 1 and 2 in week 1, group 3 in week 2, group 4 in week 3, group 5 in week 5, in five slices to protect delivery.

## 4. First message drafts

First name falls back to "there". If a customer's last coffee is no longer sold, `last_coffee` becomes House Blend, medium roast. The brew tip follows the last product bought:

| Last bought | Brew tip |
|---|---|
| House blend and anything else | Weigh it: 15 g of coffee for every 250 ml of water in a French press or pour-over. |
| Single-estate light roast | Light roasts like hot water. Let the kettle rest 30 seconds after it boils, then pour. |
| Cold brew packs | Pour it over a full glass of ice, with cold milk if you like. |
| Equipment only | Good gear needs fresh coffee. Buy a bag you will finish in two to three weeks. |

**Group 1, email 1 (day 68)**
Subject: Your {{last_coffee}} is one tap away
Preview: Same coffee, same taste. No need to choose again.

> Hi {{first_name}},
>
> If your last bag of {{last_coffee}} is running low, here is the easy way back. Same roast, same taste, reordered in one tap.
>
> {{brew_tip}}
>
> **[Reorder {{last_coffee}}]**
>
> The Blue Tokai roasting team

**Group 1, WhatsApp (day 6)**

> Hi {{first_name}}, it's Blue Tokai. Running low on {{last_coffee}}? Reorder the same bag in one tap: {{reorder_link}}
> Tip: same amount of coffee, same water, same steep time. Same cup every day.
> Reply STOP to opt out.

**Group 2, email 1**
Subject: About Monsoon Dark
Preview: We stopped roasting it. Here is the coffee we would pour you now.

> Hi {{first_name}},
>
> You used to order Monsoon Dark. We stopped roasting it, and we know that left a gap in your mornings.
>
> For a darker cup, try our House Blend, medium roast. It is lighter, so brew it a little stronger: add one extra spoon of coffee and keep the same steep time.
>
> **[Try the House Blend]**
>
> The Blue Tokai roasting team

**Groups 3 and 4, email 1**
Subject: Still brewing {{last_coffee}}?
Preview: It's still on our roast list, with one tip for your next cup.

> Hi {{first_name}},
>
> Your last order with us was {{last_coffee}}. It is still on our roast list, fresh from Indian farms, and you can reorder it without choosing again.
>
> {{brew_tip}}
>
> **[Reorder my coffee]**
>
> The Blue Tokai roasting team

**Group 5, email 1:** the group 3 email, with the subject "15% off {{last_coffee}}" and this line after the first sentence: "It has been over a year, so here is 15% off it for the next 10 days." Button: **[Get 15% off]**.

## 5. How to measure true lift

- **Holdout:** before any send, pick 10% of each group's reachable customers at random. They keep getting today's regular campaigns, but no win-back messages.
- **Main number:** orders per 100 customers, contacted versus holdout, counting everyone assigned.
- **Profit number:** gross profit per customer after discounts, contacted minus holdout. This catches codes used by people who would have ordered anyway.
- **When:** first read at day 34 (one usual gap), final read at day 68.
- **Guardrails:** unsubscribes, WhatsApp blocks and spam complaints. Pause a group if complaints pass 0.3% of a send.
- **Decision:** keep a group's offer if extra gross profit per contacted customer is above zero. If the range still crosses zero, add next month's entrants and read again.
- **Long run:** 12-month repeat rate, back from 28% toward 34%.

## 6. What it is worth if it works (projection)

One assumed input: the extra order rate over the holdout, set lower for older lapses. The holdout replaces it by day 68. Contacted is 90% of the 62% with email consent.

| Group | Contacted | Assumed extra order rate | Extra orders | Gross profit per order after offer | Extra gross profit |
|---|---|---|---|---|---|
| 1 | 5,022 | 6 to 10% | 301 to 502 | ₹557 | ₹1.68 to ₹2.80 lakh |
| 2 | 2,902 | 4 to 8% | 116 to 232 | ₹442 | ₹0.51 to ₹1.03 lakh |
| 3 | 7,310 | 3 to 6% | 219 to 439 | ₹442 | ₹0.97 to ₹1.94 lakh |
| 4 | 5,971 | 2 to 4% | 119 to 239 | ₹384.50 | ₹0.46 to ₹0.92 lakh |
| 5 | 6,138 | 1 to 2% | 61 to 123 | ₹384.50 | ₹0.23 to ₹0.47 lakh |
| **Total** | **27,343** | | **816 to 1,535** | | **₹3.85 to ₹7.15 lakh** |

- Groups 2 and 3 are valued at the 10% code, groups 4 and 5 at 15%: the worst case.
- **Ongoing:** 6,000 new lapses a month means 3,348 contacted, 201 to 335 orders and ₹1.1 to ₹1.9 lakh a month.
- **Follow-on:** if won-back customers repeat at your 28% rate, add ₹1.3 to ₹2.4 lakh within 12 months.
- Figures exclude WhatsApp fees and subscriber win-back. Group counts still include cancelled subscribers, so totals run slightly high.

**Assumptions**
- House Blend, medium roast, is the closest coffee on sale to Monsoon Dark. If you sell a darker blend, use its name instead.
- Email and WhatsApp consent rates are the same in every group.
- Subscribers can skip a delivery or change how often it comes.
