# Minimalist welcome series: 5 emails for subscribers who haven't bought yet

**The goal:** lift the 14-day first-order rate from 18%.

**What your numbers say:** the sunscreen gets the most clicks in today's welcome email (3,600) but turns only 2.2% of them into orders. The niacinamide serum turns 8.0% and the face wash 6.8%. Per click, that is about ₹48 for the serum, ₹20 for the face wash and ₹9 for the sunscreen. So the series does two things. It sends each person the one product that fits their quiz answer. And it gives the sunscreen its own email that answers the white cast question (38% of sunscreen chats).

**One offer only:** the 10% the pop-up promised. No bigger discount later in the series.

## Send timing and exit rule

| # | When | Job | Who gets it |
|---|---|---|---|
| 1 | At sign-up | Deliver the 10% code and how to read our labels | Everyone |
| 2 | Day 1, 7 pm IST | Match one product to their skin concern | Split by quiz answer |
| 3 | Day 3, 7 pm IST | Show how to start actives slowly | Everyone |
| 4 | Day 6, 7 pm IST | Answer the sunscreen questions | Everyone |
| 5 | Day 13, 10 am IST | Code ends tomorrow, plain note | Everyone |
| WhatsApp | Day 13, 6 pm IST | Same reminder, on WhatsApp | WhatsApp opt-ins who did not click email 5 |

**Exit rule:** a person leaves the series the moment they place a website order (Klaviyo flow filter: Placed Order zero times since starting this flow). Buyers then move to your post-purchase flow.

**Also set:**
- Entry filter: Placed Order zero times over all time, so past buyers never enter.
- Skip a welcome email if the person is in the cart or checkout flow (filter: Started Checkout zero times in the last 24 hours).
- After email 5, non-buyers join your regular newsletter.

**Assumptions I made:**
1. The 10% is a Klaviyo unique code, one use, first website order, that expires 14 days after sign-up. If your code has no end date, cut the deadline lines from email 5 and the WhatsApp message.
2. The quiz answer is saved to each profile as "Skin concern". People with no answer get version A of email 2.
3. Marketplace orders don't reach Klaviyo. Someone who buys there may still get these emails.
4. Emails 1 to 4 open straight into the copy. Email 5 opens with Klaviyo's first-name tag, with "there" as the fallback.
5. Your margin wasn't given. The 10% costs about ₹70 on a ₹699 order. I kept it at 10%, as promised, and did not raise it.

## The emails

### Email 1: Your code, and how to read our labels

**Job:** deliver what the pop-up promised, and teach the one rule the brand stands on.
**Subject A:** Your 10% off is inside (22)
**Subject B:** Here's what's inside, and how much (34)
**Preview:** Your first-order code, plus how to read any Minimalist label.

Thanks for joining us. Here is your code for 10% off your first order:

**{% coupon_code 'WELCOME10' %}**

It works for 14 days on beminimalist.co.

Before you shop, one thing about us. Every label tells you what's inside, and how much.

"Niacinamide 10%" means the serum has 10% niacinamide. "Salicylic acid 2%" means the face wash has 2% salicylic acid. No guessing.

This also helps you start slowly. You pick one active, at a strength you know, and add more only when your skin is ready.

Not sure where to begin? Tomorrow we'll send the one product that fits the concern you told us about.

**Button:** Shop with 10% off (links to the best sellers page)

P.S. New to actives? Start with one product, not three.

### Email 2: One product for your concern

**Job:** answer "which one is for me?" with a single product, matched to the quiz answer. Three versions, one per group.

**Version A: dark spots, uneven tone or dullness (55% of sign-ups)**
**Subject A:** Your one serum for dark spots (29)
**Subject B:** "Which serum is for me?" Here's yours (37)
**Preview:** Niacinamide 10%, ₹599. How to use it, and how to start slowly.

You told us dark spots and uneven tone bother you most. If you buy one thing, make it this.

**Niacinamide 10% serum, ₹599.** What's inside: 10% niacinamide.

How to use it: a few drops on clean, dry skin, before your moisturiser.

How to start slowly: use it every other night for the first week. If your skin feels calm, use it once a day after that.

Be patient. Tone changes slowly, so judge it after a few weeks of steady use, not a few days.

**Button:** Get the serum with 10% off

**Version B: acne and oiliness (26%)**
**Subject A:** Oily skin? Start with one face wash (35)
**Subject B:** Just tell me what to use: this one (34)
**Preview:** Salicylic acid 2%, ₹299. A two-step routine, nothing more.

You want the fewest steps that work. Here is step one.

**Salicylic acid 2% face wash, ₹299.** What's inside: 2% salicylic acid, for oily skin.

It rinses off, so it's a simple way to try your first acid.

How to start slowly: use it at night only for the first week. If your skin feels fine, use it morning and night.

Your whole routine: this face wash, then sunscreen in the morning. Two steps.

**Button:** Get the face wash with 10% off

**Version C: dryness or sensitivity (19%)**
**Subject A:** Sensitive skin? Don't start with acids (38)
**Subject B:** The calm first step for dry skin (32)
**Preview:** Start with daily SPF 50. Add one active later, slowly.

You told us your skin is dry or sensitive. So our advice may surprise you: don't start with an acid.

Start with sunscreen, every morning.

**SPF 50 sunscreen, ₹399.** What's inside: SPF 50 sun protection.

How to start slowly: patch test it first, as with any new product. Then use it daily for a few weeks.

Once that feels easy, you can add one active. In two days we'll show you how to do that safely.

**Button:** Get the sunscreen with 10% off

### Email 3: How to start actives without the worry

**Job:** remove the fear of irritation. 61% of sign-ups said they are new to actives.
**Subject A:** Scared to try acids? Start like this (36)
**Subject B:** The slow way to start actives (29)
**Preview:** A simple plan for your first two weeks. No 10-step routine.

"My skin is sensitive. I'm scared to try acids."

We hear this a lot. More than half the people who join us are new to actives. Here is how to start slowly.

1. **Patch test first.** Put a little on a small patch of skin, like behind your ear. Wait 24 hours.
2. **One new product at a time.** Give it two weeks before you add another.
3. **Go slow, then build.** Face wash: night only in week one. Serum: every other night in week one. Then daily, if your skin is calm.
4. **Wear sunscreen every morning.**

If your skin stings, turns red or itches, stop and rinse it off. If it doesn't settle, talk to a doctor.

That's it. One product, a slow start, and sunscreen.

**Button:** See my starter product (links to the product from their email 2 version)

### Email 4: Will it leave a white cast?

**Job:** answer the three questions that stop sunscreen orders.
**Subject A:** Will it leave a white cast? (26)
**Subject B:** "No white cast, even on my dusky skin" (38)
**Preview:** Your top three sunscreen questions, answered.

"Every sunscreen makes me look grey." If that's you, this email is for you.

**Will it leave a white cast?** This is the question we get most. Our most-liked sunscreen review says: "No white cast, even on my dusky skin."

**Is it sticky in humid weather?** Our tip: put on a thin, even layer on dry skin. Wait a few minutes before you step out.

**Can I wear it under makeup?** Make it the last step of your skin care. Let it set for a few minutes, then start your makeup.

**How much?** Two finger-lengths for your face and neck.

How to start slowly: patch test it first, like any new product.

**SPF 50 sunscreen, ₹399.**

**Button:** Try the SPF 50 with 10% off

### Email 5: Your code ends tomorrow

**Job:** a plain-text reminder from a real person, with the short version of the whole series.
**Format:** plain text, no images.
**Subject A:** Your 10% code ends tomorrow (27)
**Subject B:** A quick note before your code ends (34)
**Preview:** Still deciding? Here's where to start, in three lines.

Hi {{ first_name|default:"there" }},

A short note. Your 10% code ends tomorrow:

{% coupon_code 'WELCOME10' %}

If you're still deciding, here is the simple version:

- Dark spots or uneven tone: Niacinamide 10% serum, ₹599.
- Oily skin: Salicylic acid 2% face wash, ₹299.
- Sensitive, or not sure: SPF 50 sunscreen, ₹399.

Pick one. Start slowly. Add the next one in a few weeks, if you want.

Questions? Just reply to this email. A person on our team reads every reply.

Mohit
Co-founder, Minimalist

**Button (text link):** Use my code before it ends

## WhatsApp message (one, on day 13)

**Where it fits:** day 13 at 6 pm IST, only to people who ticked a separate WhatsApp opt-in at sign-up, have not ordered, and did not click email 5. Many people miss an email but read WhatsApp. Never send it to email-only subscribers.

**Category:** Marketing. **Name:** welcome_code_reminder. **Language:** English.
**Header:** Your 10% code ends tomorrow (27 of 60)
**Body:** Hi {{1}}, your 10% code {{2}} for your first Minimalist order ends tomorrow. Not sure where to start? Pick one product for your main skin concern and use it every other day in week one. (185 of 1,024)
**Footer:** Reply STOP to opt out
**Button:** Shop now (links to beminimalist.co)
**Sample values:** {{1}} = Sneha, {{2}} = WELCOME10

## How to measure it

- Run the new series against today's single email, 50/50, at the same time, for 60 days. That's about 4,700 people per side. It can spot a change of about 2 points (18% to 20%).
- Judge on the 14-day order rate and revenue per subscriber. Watch unsubscribes as a guardrail. Ignore opens.
- Watch the sunscreen's click-to-order rate. Today it is 2.2%. Email 4 should lift it.
- Next test: timing. Send email 2 four hours after sign-up instead of on day 1.

## To confirm before you switch it on

- The code really expires 14 days after sign-up.
- Mohit signs email 5, and someone reads the replies.
- You have permission to quote the sunscreen review.
- Each WhatsApp message costs less than the profit from the orders it brings.
