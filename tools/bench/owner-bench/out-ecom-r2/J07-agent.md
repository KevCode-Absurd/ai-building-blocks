# Minimalist welcome series: 5 emails and 1 WhatsApp message

- **Lead with one product per quiz answer.** Dark spots and dullness are 55% of sign-ups, so most people get the Niacinamide 10% serum first. It already turns 8.0% of welcome clicks into orders, the best of the three.
- **Give the sunscreen its own email.** It gets the most clicks (3,600) but only 2.2% become orders. Chat shows why: white cast (38%) and stickiness in humid weather (27%).
- **Teach "start slowly" in every email,** because 61% of sign-ups say they are new to actives.

## Timing and exit rule

**Trigger:** joins the list through the site pop-up. **Entry filter:** Placed Order zero times, all time. Past buyers skip this series.

**Exit rule:** a person leaves the flow as soon as they place an order (flow filter: Placed Order zero times since starting this flow). Unsubscribes leave too. Turn Smart Sending off so no email is skipped.

Three emails land in the first three days, while interest is highest. All five land inside the 14 days in which 18% of sign-ups buy today.

| # | Send (from sign-up) | Job | Who gets it |
|---|---|---|---|
| 1 | At once | Deliver the 10% code and name one product for their concern | All, in 3 versions by quiz answer |
| 2 | Day 1 | Ease the fear of irritation: how to start any active | All |
| WhatsApp | Day 2, 11 am | Put the code and their one product on their phone | WhatsApp opt-ins who have not clicked Email 1 or 2 |
| 3 | Day 3 | Answer the sunscreen questions: white cast, humid weather, makeup | All |
| 4 | Day 6 | Give the shortest routine that works | All, with one line for dry or sensitive skin |
| 5 | Day 10 | Plain-text nudge: the one product to start with | All, in 3 versions by quiz answer |

**Versions by quiz answer (Emails 1 and 5):**
- Block A: Dark spots and uneven tone, Dullness, or no answer.
- Block B: Acne and oiliness.
- Block C: Dryness, Sensitivity.

Buttons in Emails 1, 2 and 5 link to the product in the person's block. Every email carries the store's postal address and Klaviyo's unsubscribe link. First name merge field: `{{ first_name|default:'there' }}`.

---

## Email 1: Your code and your one product

**Send:** at sign-up
**Subject:** Your 10% code, and the one product to start with
**Preview:** Here's what's inside, and how much.

Hi {{ first_name|default:'there' }},

Thanks for joining. Here is your 10% off code for your first order:

**{% coupon_code 'WELCOME10' %}**

You told us your main skin concern. So here is one product, not ten.

**Block A:**
**Niacinamide 10% serum, ₹599.** Niacinamide is the active. 10% is how much is in the bottle. We made it for the look of dark spots and uneven tone.
Start slowly: a few drops at night, every other night for the first week.

**Block B:**
**Salicylic Acid 2% face wash, ₹299.** Salicylic acid is the active, at 2%. It is made for oily skin that breaks out. It rinses off, so it is an easy first step into acids.
Start slowly: once a day, at night, for the first week.

**Block C:**
**SPF 50 sunscreen, ₹399.** For dry or sensitive skin, we would not start with an acid. Start with the one step every routine needs: sunscreen every morning. Add an active later, one at a time.
Start slowly: try it on a small patch of skin for a day first.

Every pack names its active and its strength, so you always know what goes on your skin.

**Button:** Shop with 10% off

Team Minimalist

**Job:** deliver the promised code and answer "I don't know which serum is for me" in the first email.

---

## Email 2: How to start an active

**Send:** Day 1
**Subject:** New to actives? Here's how to start slowly
**Preview:** Four simple rules for your first two weeks.

Hi {{ first_name|default:'there' }},

6 in 10 people who joined us lately said they are new to actives. If that's you, here is how to start calmly.

1. **One new product at a time.** Wait about two weeks before you add the next one. If your skin reacts, you will know which product it was.
2. **Patch test first.** Put a little on a small spot, like the side of your jaw, for a day or two. No redness or itching? Go ahead.
3. **Go slow on how often.** Use a new active every other night in week one. Move to every night only if your skin feels fine.
4. **Wear sunscreen every morning.** It goes with every active you use.

If your skin stings, turns red or itches, stop and give it a break. If it does not settle, see a dermatologist.

Going slow is how you learn what your skin likes.

**Button:** See my starter product

Team Minimalist

**Job:** remove the biggest fear ("My skin is sensitive, I'm scared to try acids") before asking for an order.

---

## WhatsApp message (Day 2)

**Where:** WhatsApp, not SMS. It goes only to people who ticked WhatsApp opt-in on the pop-up, have not clicked Email 1 or 2, and have not ordered. Send at 11 am. It reaches people the emails missed. An SMS in India would also need a DLT-registered template.

**Category:** Marketing  **Name:** welcome_starter_pick

**Body:**
Hi {{1}}, this is Minimalist. You told us your main concern is {{2}}. One product to start with: {{3}}. Start slowly: patch test first, and add one new product at a time. Your 10% off code for your first order: {{4}}

**Button:** See my product (link to the product in their block)
**Footer:** Reply STOP to opt out

**Samples:** {{1}} Sneha, {{2}} dark spots and uneven tone, {{3}} Niacinamide 10% serum, ₹599, {{4}} WELCOME10-7KQ2

**Job:** reach people the emails missed, with their one product and the code on their phone.

---

## Email 3: Your sunscreen questions

**Send:** Day 3
**Subject:** White cast, humid days, makeup: sunscreen answers
**Preview:** The three questions people ask us most about our SPF 50.

Hi {{ first_name|default:'there' }},

These are the three questions people ask most on our sunscreen page.

**"Will it leave a white cast?"**
Here is our most-liked sunscreen review, in the buyer's own words: "No white cast, even on my dusky skin."

**"Is it sticky in humid weather?"**
How you put it on matters. Apply it on clean, dry skin as the last step of your morning routine. On humid days, skip a heavy cream underneath. Give it a minute or two to settle before you step out.

**"Can I wear it under makeup?"**
Yes. Sunscreen is your last skin care step. Let it settle, then put your makeup on top.

New to this sunscreen? Try it on a small patch of skin for a day first.

**SPF 50 sunscreen, ₹399** before your 10% off.

**Button:** Shop the SPF 50 sunscreen

Team Minimalist

**Job:** answer the doubts behind the sunscreen's 2.2% order rate, using a real review for the top one.

---

## Email 4: The 3-product routine

**Send:** Day 6
**Subject:** Just tell me what to use: a 3-product routine
**Preview:** One step in the morning, two at night. That's all.

Hi {{ first_name|default:'there' }},

You don't need a 10-step routine. Here are three products, and when to use them.

**Morning**
- Rinse your face, then **SPF 50 sunscreen, ₹399.**

**Night**
- **Salicylic Acid 2% face wash, ₹299.** Washes off the oil of the day.
- **Niacinamide 10% serum, ₹599.** A few drops on dry skin.

All three come to ₹1,297 before your 10% off.

**How to start slowly**
- Week 1: face wash at night, sunscreen in the morning.
- Week 2: add the serum, every other night.
- Week 3: serum every night, if your skin feels calm.

**Dry or sensitive skin?** Skip the acid face wash for now. Use your usual gentle cleanser, and keep the serum and sunscreen.

**Button:** Shop the 3-step routine

Team Minimalist

**Job:** give "Just tell me what to use" a complete, short answer, with a slow start built in.

---

## Email 5: Start with one (plain text)

**Send:** Day 10
**Subject:** Still deciding? Start with one
**Preview:** Your 10% off still works on your first order.

Hi {{ first_name|default:'there' }},

A quick note. Picking your first skin care product can feel like a lot. So here is the short answer again.

[Block A] For dark spots, uneven tone or dullness: start with the Niacinamide 10% serum, ₹599. Use it every other night in week one.

[Block B] For acne and oiliness: start with the Salicylic Acid 2% face wash, ₹299. Use it once a day, at night, in week one.

[Block C] For dry or sensitive skin: start with the SPF 50 sunscreen, ₹399, every morning. Add an active later, one at a time.

Your 10% off code for your first order: {% coupon_code 'WELCOME10' %}

Shop my product: (link to the product in their block)

Team Minimalist

**Job:** a calm last nudge that repeats one clear answer and the code, with no pressure.

---

**Assumptions**
1. The 10% offer is a Klaviyo unique coupon named WELCOME10, valid once on a first order, with no end date. So no email claims a deadline. If you add an end date that Klaviyo enforces, name it in Email 5's code line.
2. The pop-up saves the quiz answer on each profile, so Klaviyo can show the right block.
3. The brief has no fact on the sunscreen's texture, so Email 3 answers stickiness with how to apply it, not a claim about the formula.

**What to watch:** orders within 14 days of sign-up against today's 18%, and the sunscreen's order rate after click against today's 2.2%.
