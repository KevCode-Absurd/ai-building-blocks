# Blue Tokai win-back programme for lapsed online buyers

## The short version

- Target four groups, newest lapsers first: 46 to 90 days, 91 to 180, 181 to 365, over 365. The 0 to 45 day group is not lapsed.
- Discounts grow with lapse depth, from none to 15%. Nothing above 15% unless the founder approves one optional 20% test.
- Success is extra gross profit per customer versus a random holdout.
- If the planning lifts hold, the first wave earns about ₹2.9 lakh net gross profit, or about ₹5.7 lakh with 12 months of follow-on orders.

## Assumptions

1. 70% of customers are reachable on at least one channel (62% email, 40% WhatsApp, most WhatsApp opt-ins also on email).
2. The ₹1,150 order is net of tax. Gross profit per full-price order: ₹1,150 × 58% minus ₹110 = ₹557. A 10% code costs ₹115; 15% costs ₹172.50.
3. Baseline and lift rates are planning guesses. The holdout replaces them with real numbers by day 60.
4. WhatsApp marketing messages cost about ₹0.80 each. Email is treated as free.
5. We see online orders only. Some "lapsed" buyers may use the cafes. The holdout corrects for this.
6. Each returning customer places 0.5 more full-price orders in the next 12 months.
7. Codes cover coffee only, since equipment margin may differ from the 58% blend.

## Why this matters

With a 34-day median gap to the second order, a customer is late by day 46. The repeat rate drop from 34% to 28% is about 3,600 fewer repeat buyers on 60,000, or about ₹20 lakh of gross profit at ₹557 each.

## Groups, order and offer logic

| Order | Group (days since last order) | Customers | Messaged | Offer logic |
|---|---|---|---|---|
| 1 | Cooling, 46 to 90 | 9,000 | 5,670 | No offer for two messages. 10% for non-buyers from day 14. |
| 2 | Lapsed, 91 to 180 | 14,000 | 8,820 | 10% from the start. 15% for non-buyers from day 17. |
| 3 | Long lapsed, 181 to 365 | 15,000 | 9,450 | 15% off one order, 21 days. |
| 4 | Dormant, over 365 | 11,000 | 6,160 | 15% off one order, email only. 20% test cell only with the founder's yes. |

"Messaged" is the reachable 70% minus the holdout: 10% for groups 1 to 3, 20% for group 4 because its lift is small and needs a bigger control.

**Why this order.** New lapsers return most often and need the smallest discount, so each rupee works hardest there. Older groups are worth less and risk more unsubscribes, so they wait for early results. Launch group 1 in week 1, group 2 in week 2, group 3 in week 4, group 4 in week 6. Email recent openers first to protect inbox placement.

**Rules for every group**
- One unique, single-use code per customer.
- Stop all messages on purchase. Stop WhatsApp on any block or STOP reply.
- At most one WhatsApp a week.
- Customers with two or more past orders also see a subscription option at the same discount on the first delivery.
- After the backlog, go always-on: flows start on day 46, 91, 181 or 366 after the last order.

## Message sequences and timing

| Group | Day 0 | Day 3 to 5 | Day 10 to 12 | Day 14 to 17 | Day 19 to 25 |
|---|---|---|---|---|---|
| 1 | Email: reorder last coffee, no offer | WhatsApp (3): one-tap reorder | Email (10): brew tips, subscription option | WhatsApp (14): 10% code, 7 days | Email (19): code ends tomorrow |
| 2 | Email: 10% welcome back | WhatsApp (4): 10% reminder | Email (10): one-click "why did you stop?" survey | WhatsApp (17): now 15%, 7 days | Email (23): last call |
| 3 | Email: 15%, coffees like your last | WhatsApp (5): 15% reminder | Email (12): pick by brew method | None | Email (19): last call |
| 4 | Email: 15% (or 20% cell) | None | Email (10): reminder | None | Email (25): "Still want to hear from us?" |

Group 4 non-clickers move to a low-frequency list at day 60. Survey answers route next steps: "I buy in your cafes" stops discounts, "too expensive" shows smaller packs, "didn't like the taste" gets a recommendation, "still have coffee" gets a reminder in 14 days. Send WhatsApp 11:00 to 13:00 or 18:00 to 20:00. WhatsApp drafts need approval as marketing templates.

## First message drafts

**Group 1, email, day 0**
Subject: Time for a fresh bag, {first_name}?
> Hi {first_name}, it has been {days} days since your {last_product} arrived. Running low? Reorder in one tap, ground for {grind} like last time. Fancy a change? Here are three coffees close to the one you picked.
> [Reorder {last_product}] [See similar coffees]

**Group 1, WhatsApp, day 3**
> Hi {first_name}, running low on {last_product}? Reorder in one tap, same grind as last time: {link}. Reply STOP to opt out.

**Group 2, email, day 0**
Subject: 10% off to welcome you back
> Hi {first_name}, it has been a while. Here is 10% off your next coffee order with code {code}, valid until {date}. Reorder your {last_product}, or tell us how you brew and we will suggest something new.
> [Use my 10%] [Help me choose]

**Group 2, WhatsApp, day 4**
> Hi {first_name}, your 10% code {code} is still waiting. Use it on {last_product} or any coffee: {link}. Reply STOP to opt out.

**Group 3, email, day 0**
Subject: 15% off your next bag, {first_name}
> Hi {first_name}, we would love to roast for you again. Take 15% off one coffee order with code {code} until {date}. Not sure what to pick? Tell us how you brew and we will point you to three matches.
> [Use my 15%] [Pick by brew method]

**Group 4, email, day 0**
Subject: It has been a while, {first_name}. Here's 15% off.
> Hi {first_name}, your last order was over a year ago. If you would like to come back, here is 15% off one coffee order with code {code} until {date}.
> [Shop coffee]

## How to measure true lift

1. **Random holdout before any send**, balanced by channel opt-in. The holdout gets no win-back messages. Both sides keep normal newsletters.
2. **Main measure:** 60-day gross profit per customer, messaged minus holdout, counting every customer whether they bought or not. Gross profit is net of discounts and shipping.
3. **Also track:** reactivation, second order within 90 days, unsubscribes, WhatsApp blocks.
4. **Ignore redemptions and last-click credit.** Many redeemers would have bought anyway.
5. **Read at days 30, 60 (decision) and 120.**
6. **Offer test in group 2:** half get the discount ladder, half the same messages with no discount. This shows whether the discount pays.
7. **Group 4 20% cell, only if approved:** a 20% order earns ₹327 versus ₹384.50 at 15%. It wins only if its gross profit per customer beats the 15% cell. Treat as directional.
8. **Smallest detectable lift** (95% confidence, 80% power): about 3.7 points in group 1, 1.9 in group 2, 1.3 in group 3, 0.8 in group 4.
9. **Stop rules:** if a group's gross profit per customer is below zero at day 60, cut the discount or stop. If WhatsApp blocks pass 2% on a send (our working limit), drop that message.
10. **Always-on:** keep a permanent 5% holdout.

## What it is worth

Baseline is the 60-day reorder rate without messages. "Anyway cost" is the discount given to baseline buyers who would have bought without us. Group 1's average discount is 5%, as half its returners buy before the code. Net figures also subtract WhatsApp costs: ₹5,184, ₹8,064, ₹4,320 and ₹0.

| Group | Messaged | Baseline | Lift | Extra orders | Profit per extra order | Anyway cost | Net gross profit | Break-even lift |
|---|---|---|---|---|---|---|---|---|
| 1 | 5,670 | 10% | 6.0 pts | 340 | ₹499.50 | ₹32,603 | ₹1,32,143 | 1.3 pts |
| 2 | 8,820 | 4% | 4.0 pts | 353 | ₹419 | ₹48,686 | ₹91,073 | 1.5 pts |
| 3 | 9,450 | 2% | 2.5 pts | 236 | ₹384.50 | ₹32,603 | ₹53,915 | 1.0 pts |
| 4 | 6,160 | 1% | 1.0 pts | 62 | ₹384.50 | ₹10,626 | ₹13,059 | 0.4 pts |
| **Total** | **30,100** | | | **991** | | | **₹2,90,190** | |

- **First wave:** about ₹2.9 lakh net gross profit.
- **Next 12 months:** 991 customers × 0.5 orders × ₹557 adds about ₹2.76 lakh, for about ₹5.7 lakh in total.
- **Per customer messaged:** ₹23 in group 1, ₹10 in group 2, ₹6 in group 3, ₹2 in group 4. This is why we go newest first.
