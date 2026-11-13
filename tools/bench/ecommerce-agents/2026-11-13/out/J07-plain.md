# Minimalist welcome series: 5 emails and 1 WhatsApp message

## Assumptions

- The pop-up code is WELCOME10. It gives 10% off the first order on beminimalist.co and expires 14 days after sign-up. Swap in your real code and expiry. If the code never expires, cut the expiry lines in Email 5 and the WhatsApp message.
- On a ₹699 first order, 10% off is about ₹70.
- Product names are written plainly below. Add the exact active and % from each pack wherever a product is named. That is how the brand speaks, and it should be the same here.
- The pop-up asks for an optional phone number with a separate WhatsApp opt-in. If it does not, skip the WhatsApp message.
- Marketplace orders do not reach Klaviyo, so a few people who buy elsewhere will keep getting emails. That is fine, since no email is pushy.

## Flow setup in Klaviyo

- **Trigger:** added to the pop-up sign-up list.
- **Flow filter:** Placed Order zero times since starting this flow. Klaviyo checks this before every send, so a buyer exits at the next step.
- **Exit rule:** leave the flow on first order, on unsubscribe, or after the WhatsApp message on day 13. Buyers move to the post-purchase flow.

| Step | Timing | Job |
|---|---|---|
| Email 1 | Right away | Deliver the code and point to a starting place |
| Email 2 | Day 1 | Match each skin concern to one active |
| Email 3 | Day 3 | Calm the fear of irritation |
| Email 4 | Day 6 | Show why naming the % builds trust |
| Email 5 | Day 11 | Give a simple routine and a fair code reminder |
| WhatsApp | Day 13 | Last reminder, the day before the code ends |

About 18% buy within 14 days today. The series aims at the other 82%, who mostly stall on "which one is right for me, and will it hurt my skin?"

---

## Email 1: Your 10% off is here

**Send:** right away
**Job:** keep the pop-up's promise in seconds, then lower the effort of the first choice.
**Subject:** Your 10% off, plus where to start
**Preview text:** Code inside. And a quick way to pick your first active.

**Body:**

Hi {first_name|there},

Welcome to Minimalist. Here is the 10% off we promised.

**Your code: WELCOME10**
Use it on your first order within 14 days.

A quick word on how we work. Every product names its active ingredient and its strength on the front of the pack. No secret blends. You always know what you are putting on your skin.

Not sure where to begin? Most people start with one of these three:

- **Oily skin or visible pores?** Start with our Niacinamide serum.
- **Breakouts and congested skin?** Start with our Salicylic acid face wash.
- **Not sure at all?** Start with our Sunscreen. Every routine needs one.

Over the next two weeks we will send you a few short, useful emails. You will learn how to pick an active and how to start it gently.

Team Minimalist

**CTA button:** Shop with 10% off (links to the best sellers collection with the code applied)

---

## Email 2: Which active suits your skin?

**Send:** day 1
**Job:** answer the main question that stops people from buying. Match each concern to one product.
**Subject:** Which active is right for your skin?
**Preview text:** A 30-second guide. Pick your concern, get one product.

**Body:**

Hi {first_name|there},

The most common question we get is simple: "Which one should I use?"

Here is the short answer. Find the line that sounds like you.

**"My skin gets oily by noon and my pores look big."**
Try our Niacinamide serum. It is a light, water-based serum that suits oily and combination skin. Use a few drops after cleansing.

**"I get clogged pores and breakouts."**
Try our Salicylic acid face wash. Salicylic acid is a BHA that works inside the pore. It is a wash-off product, so contact with skin is short. That makes it an easy first step into actives.

**"My skin is dry or sensitive, or I am new to all this."**
Start with our Sunscreen. Use it every morning, whatever your skin type. It also matters more once you add actives to your routine.

**One rule: start with one product.** If you add three new things at once and your skin reacts, you will not know which one caused it.

Still unsure? Reply to this email and tell us your skin type and your main concern. We will point you to one product.

Team Minimalist

**CTA buttons (three, one per concern):** Oily skin | Breakout-prone skin | New to actives
Each links to its product page. Optional: tag each click in Klaviyo with a profile property (skin_concern) for later personalisation.

---

## Email 3: Worried about irritation?

**Send:** day 3
**Job:** name the fear of irritation openly and give a safe, practical way to start.
**Subject:** Nervous about trying actives? Read this first
**Preview text:** Patch test, start slow, one product at a time.

**Body:**

Hi {first_name|there},

A lot of people tell us they want to try actives but are scared their skin will react. That is a fair worry. Here is how to start gently.

**1. Patch test first.**
Apply a small amount behind your ear or on your inner arm. Wait 24 hours. If you see redness, itching or burning, do not use it on your face.

**2. Start slow.**
Use a new leave-on active two or three times a week for the first two weeks. Then move to daily if your skin is happy.

**3. One new product at a time.**
Give each new product about two weeks before you add the next.

**4. Keep the rest of your routine simple.**
A gentle cleanser, a moisturiser and sunscreen. That is enough while your skin gets used to something new.

**5. Wear sunscreen every morning.**
This one is not optional when you use actives.

**6. Know when to stop.**
Mild tingling for a moment can happen. Lasting redness, burning or peeling is your cue to stop. If your skin stays irritated, see a dermatologist.

Every pack tells you the active and its strength. So you are never guessing what is in the bottle.

Team Minimalist

**CTA button:** Read the full how-to-use guide (links to the product's usage section or a routine guide page)
Secondary text link: Shop with your 10% off

---

## Email 4: Why we print the %

**Send:** day 6
**Job:** build trust in the brand's main difference and show the three best sellers as a clear shortlist.
**Subject:** Why we print the % on every pack
**Preview text:** Because you should know exactly what you are using.

**Body:**

Hi {first_name|there},

Pick up most skin care and try to find out how much of the active is inside. Often you cannot.

We think you should know. So every Minimalist pack names two things on the front:

- **The active ingredient**, like niacinamide or salicylic acid.
- **Its strength**, as a percentage.

Why it matters to you:

- **You can compare.** Two serums with the same active can have very different strengths.
- **You can start low.** If your skin is sensitive, a known strength helps you choose with care.
- **You can track what works.** If something suits you, you know exactly what to buy again.

Our three most-bought products are a good place to see this in action:

- **Niacinamide serum:** our most popular serum, for oily and combination skin.
- **Sunscreen:** for daily use, for every skin type.
- **Salicylic acid face wash:** a wash-off way to start with a BHA.

Your 10% off is still waiting.

Team Minimalist

**CTA button:** See our best sellers (links to the best sellers collection with the code applied)

---

## Email 5: A 3-step routine, and your code ends soon

**Send:** day 11
**Job:** turn interest into a first order. Give one simple routine and a fair, true reminder that the code is ending.
**Subject:** Your 10% off ends in 3 days
**Preview text:** Plus the simple 3-step routine most people start with.

**Body:**

Hi {first_name|there},

A quick reminder: your code **WELCOME10** ends in 3 days.

If you have been waiting to decide, here is the simplest routine to start with. It uses just three products.

**Morning**
1. Wash with our Salicylic acid face wash, or your usual gentle cleanser if your skin is dry.
2. Apply a few drops of our Niacinamide serum.
3. Finish with our Sunscreen.

**Night**
1. Wash your face.
2. Apply the Niacinamide serum.
3. Moisturise.

New to actives? Start with one product from this list, not all three. Add the next one after two weeks. And patch test each one first.

Your 10% off works on any first order on our site.

Team Minimalist

**CTA button:** Use my 10% off (links to the best sellers collection with the code applied)

P.S. Not sure which one to start with? Hit reply and tell us your skin type. A real person will answer.

---

## WhatsApp message: last reminder

**Send:** day 13, to people who opted in to WhatsApp and still have not ordered. Send between 11 am and 7 pm.
**Job:** reach people who missed Email 5 in a busy inbox. It goes out once, the day before the code ends.
**Template type:** marketing template, approved in advance.

**Message:**

Hi {first_name}, this is Minimalist. Your 10% off code WELCOME10 ends tomorrow. Not sure where to start? Oily skin: Niacinamide serum. Breakouts: Salicylic acid face wash. Everyone: Sunscreen. Shop here: {short_link}
Reply STOP to opt out.

---

## Notes for setup

- **Reply handling:** Emails 2 and 5 invite replies. Send replies to a monitored inbox and answer within one working day. Keep answers to product fit and usage, never diagnosis.
- **Copy rules kept throughout:** no medical claims, no "cures" or "treats", no before-and-after promises, no made-up reviews or results. If you add reviews later, use only real ones with permission.
- **What to watch:** placed-order rate within 14 days of sign-up, against today's 18%. Also watch clicks per concern button in Email 2, and reply volume. For a clean read, hold back 10% of new sign-ups for the first month. Send them only Email 1, then compare.
- **First test to run:** in Email 5, test the subject above against "Your 3-step starter routine (10% off ends soon)".
