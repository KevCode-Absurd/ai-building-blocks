# Minimalist welcome series: 5 emails and 1 WhatsApp

Five emails over 12 days, then one WhatsApp on day 13. Each email does one job and shows the one product that fits the quiz answer, not all three.

The series acts on three numbers from your data:

- **The niacinamide serum converts best.** 8.0% of clicks became orders (232 of 2,900), about ₹48 of sales per click. It is the default pick, and 44% of sign-ups chose dark spots.
- **The sunscreen leaks.** It gets the most clicks (3,600) but only 2.2% order (79), about ₹9 per click. 77% of its chat questions are about white cast, stickiness and makeup. Email 3 answers them.
- **61% are new to actives.** Email 2 is a start-slow plan, and every email says how to start.

## Timing, branches and exit rule

| # | Send (IST) | Job | Product shown |
|---|---|---|---|
| 1 | At sign-up | Deliver the code and one first product | Matched to quiz |
| 2 | Day 1, 7:30 pm | How to start slowly | Matched to quiz |
| 3 | Day 3, 7:30 pm | Answer the sunscreen doubts | SPF 50 sunscreen |
| 4 | Day 6, 7:30 pm | Read the label: what's inside, and how much | All three |
| 5 | Day 12, 7:30 pm | Code ends in 2 days; the short answer | Two-step routines |
| WhatsApp | Day 13, 6:30 pm | Last reminder | Matched to quiz |

Evening sends match the routine we teach (actives at night) and land after work for a buyer like Sneha.

- **Trigger:** joined the list through the pop-up.
- **Entry filter:** has placed order zero times, ever. Past buyers do not get a first-order code.
- **Exit rule:** leaves the flow on Placed Order or on unsubscribe. Every email after Email 1 carries the filter "placed order zero times since starting this flow."
- **Cart pause:** skip any email if the person started checkout in the last 24 hours. The cart flow handles them.
- **Product match** (profile property `skin_concern`): dark spots, uneven tone and dullness get the Niacinamide 10% serum (55% of sign-ups). Acne and oiliness get the Salicylic acid 2% face wash (26%). Dryness and sensitivity get the SPF 50 sunscreen, so they start with no new active (19%). No answer gets the niacinamide serum.
- **Footer on every email:** sender name Minimalist, the registered address, and a one-click unsubscribe.

Assumptions: the pop-up issues a unique code, saved to the profile as `welcome_code`, that expires 14 days after sign-up (your buying window). If codes never expire, cut the deadline line from Email 5 and send the WhatsApp without "ends tomorrow." Marketplace orders do not reach Klaviyo, so the exit rule sees website orders only.

## Email 1: deliver the promise

**Job:** give the 10% code and replace a choice of three with one product.
**Subject:** Your 10% off, and where to start
**Preview:** One product, picked from your quiz answer. Not a 10-step routine.

Your code: **{{ person|lookup:'welcome_code' }}**
It takes 10% off your first order for the next 14 days.

You told us your main skin concern. So here is one product to start with, not ten.

*Show if dark spots, uneven tone, dullness or no answer:*
**Niacinamide 10% serum, ₹599.** Our best seller, and where we suggest you start for uneven tone. The 10% is printed on the bottle.

*Show if acne and oiliness:*
**Salicylic acid 2% face wash, ₹299.** Use it in place of your usual face wash. It rinses off, so it is an easy first step with an acid.

*Show if dryness or sensitivity:*
**SPF 50 sunscreen, ₹399.** When skin is dry or sensitive, we suggest you add no new active yet. Sunscreen every morning is your first step.

Use this one product for two weeks before you add anything else. Tomorrow, we'll show you exactly how to start.

**Call to action:** Shop my first product (to the matched product page, tagged utm_campaign=welcome_e1)

## Email 2: start slowly

**Job:** remove the fear of irritation for the 61% who are new to actives.
**Subject:** Your first 14 days with an active
**Preview:** Patch test first. Then every other night. Here's the plan.

6 in 10 people who join our list are new to actives. If that's you, here is the slow way in.

**Day 0: patch test.** Put a small amount on your jawline. Wait 24 hours. If the spot turns red or itchy, don't use the product.

**Weeks 1 and 2** (show the block that matches the quiz answer):

*Niacinamide 10% serum:* 2 to 3 drops on clean, dry skin, every other night. Follow with your moisturiser.

*Salicylic acid 2% face wash:* once a day, at night. Wash, then rinse well.

*SPF 50 sunscreen:* every morning, as the last step. Use two finger-lengths for face and neck.

**Week 3 on:** if your skin feels comfortable, use the serum every night, or the wash twice a day.

Three rules:
- One new product at a time.
- If your skin feels tight or uncomfortable, go back a step and wait.
- When you use an active at night, wear sunscreen in the morning.

That's the whole plan. No 10 steps.

**Call to action:** Start with my product (matched product page, utm_campaign=welcome_e2)

## Email 3: the sunscreen doubts

**Job:** turn the most-clicked, lowest-converting product into orders by answering the three questions people ask.
**Subject:** "Every sunscreen makes me look grey."
**Preview:** The three questions we get most about our SPF 50, answered.

We hear this a lot. So here are the three questions people ask most on our sunscreen page.

**Will it leave a white cast?**
The most liked review on the page says: "No white cast, even on my dusky skin." Want to see for yourself? Try a thin layer on your jawline, then check it in daylight.

**Is it sticky in humid weather?**
How you apply it matters. Use two finger-lengths and press it in, rather than rubbing hard. Give it a few minutes to set before you step out.

**Can I wear it under makeup?**
Yes. Let it set for 2 to 3 minutes, then apply makeup as usual.

What's inside: SPF 50, ₹399. It's the morning step that goes with any active you use at night.

**Call to action:** Try the SPF 50 sunscreen (sunscreen product page, utm_campaign=welcome_e3)

## Email 4: read the label

**Job:** build trust in the brand's promise and help people choose with facts.
**Subject:** Here's what's inside, and how much
**Preview:** The number on our pack is the amount of the active. Here's how to read it.

Every Minimalist pack names the active and its strength. Here's what the numbers mean.

**Niacinamide 10%.** 10 parts in every 100 parts of the serum are niacinamide.

**Salicylic acid 2%.** 2 parts in every 100 parts of the face wash are salicylic acid.

**SPF 50.** The sun protection level on the label. You get it when you use enough: two finger-lengths for face and neck.

Why we print it: so you can compare products, choose the one you need, and know what you pay for. Our three best sellers cost ₹299 to ₹599.

A higher number is not always the better start. If you're new to actives, start with one product, use it slowly, and let your skin get used to it.

**Call to action:** Compare all three (best sellers collection page, utm_campaign=welcome_e4)

## Email 5: code ends in 2 days

**Job:** help the undecided make one choice before the code ends. Plain text, signed by the team.
**Subject:** Your 10% code ends in 2 days
**Preview:** If you just want to be told what to use, here it is.

Your code {{ person|lookup:'welcome_code' }} ends in 2 days. After that, you pay the usual price.

If you'd like us to just tell you what to use, here it is. One active at night, sunscreen in the morning.

Oily skin or breakouts:
Salicylic acid 2% face wash at night, SPF 50 sunscreen in the morning. ₹698, or ₹628.20 with your code.

Dark spots or uneven tone:
Niacinamide 10% serum at night, SPF 50 sunscreen in the morning. ₹998, or ₹898.20 with your code.

Dry or sensitive skin:
SPF 50 sunscreen alone, every morning. ₹399, or ₹359.10 with your code.

Start slowly: every other night for the first two weeks.

The Minimalist team

**Call to action:** Use my 10% code (best sellers collection page, utm_campaign=welcome_e5)

## WhatsApp: day 13, the last reminder

**Where:** day 13 at 6:30 pm IST, 24 hours before the code ends. Only to people who opted in to WhatsApp, have not ordered, and did not click Email 5. Send it as a Marketing template.

**Body:**
Hi {{1}}, your 10% Minimalist code {{2}} ends tomorrow. From your quiz answer, we suggest you start with {{3}}. Use it every other night for 2 weeks.

**Button:** Shop with my code
**Footer:** Reply STOP to opt out

Sample values: {{1}} Sneha, {{2}} WELCOME-7KQ2, {{3}} Niacinamide 10% serum. Body: 172 characters with these values.

## Tests and what to watch

- **Holdout:** keep 10% of new sign-ups on today's single email for 60 days. At about 157 sign-ups a day, that is about 940 people. Compare orders within 14 days (today 18%) and sales per subscriber. Not opens.
- **What a lift is worth (projection):** about 4,700 people sign up a month. Each extra point of 14-day orders is about 47 first orders, or about ₹32,900 at your ₹699 average.
- **Sunscreen check:** watch the order rate from Email 3 clicks against today's 2.2%.
- **Bolder move:** add a photo to Email 3 of the SPF 50 on three team members' skin tones, in daylight, unedited, with their consent. If it lifts sunscreen click-to-order from 2.2% to 4%, that is about 65 more orders per 60 days, about ₹25,900 (projection). Risk: an edited or flattering photo breaks trust, so shoot it plain.
