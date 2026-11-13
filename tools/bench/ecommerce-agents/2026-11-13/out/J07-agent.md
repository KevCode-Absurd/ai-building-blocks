# Minimalist welcome series: 5 emails and 1 WhatsApp for new subscribers

Five emails over six days, plus one WhatsApp message on day 3 for WhatsApp opt-ins. Email 1 keeps the pop-up's promise: a tip and 10% off. The middle of the series answers the two things that stop a first order: not knowing which active suits your skin, and fear of irritation. Each email has one job and one button. Anyone who orders leaves the series.

## Assumptions

- The pop-up gives each subscriber a unique 10% code in Klaviyo, single use, that expires 7 days after sign-up. If codes cannot expire, use the "no expiry" swaps under email 5 and never mention a deadline.
- Gross margin was not shared. At the ₹699 average first order, 10% costs about ₹70 per redeemed order. The offer is already promised, so it stays at 10%. Confirm gross profit per order stays well above ₹70. No bigger offer is added.
- About 18% buy within 14 days. This series is for the other 82%, so it front-loads the first week, when interest is highest.
- No shipping, returns or COD terms were shared, so the copy quotes none.
- Marketplace orders do not reach Klaviyo, so a marketplace buyer may get a few extra emails. That is acceptable.
- Someone on the care team answers email and WhatsApp replies in working hours.

## Timing and exit rules

| # | Send after sign-up | Job |
|---|---|---|
| 1 | At once | Deliver the code and a starting point |
| 2 | Day 1 | Read the label: why we print the strength |
| 3 | Day 2 | Match an active to your skin |
| WhatsApp | Day 3 | Personal help choosing |
| 4 | Day 4 | Start a new active without the worry |
| 5 | Day 6 | Code ends in about 24 hours (plain text) |

- **Trigger:** joins the pop-up list. **Filter:** has placed order zero times.
- **Exit:** Placed Order at any point. Add this as a flow filter so it applies to every step.
- **Pause:** skip a welcome email if the person started checkout in the last 24 hours. The checkout flow handles them.
- **WhatsApp:** only people who ticked a separate WhatsApp opt-in. Never copy email subscribers into WhatsApp.
- **Settings:** Smart Sending off for this flow, UTM tracking on. Every email carries the postal address and a one-click unsubscribe.
- **Code display:** Klaviyo creates a new code each time the coupon tag is used, so the tag appears in email 1 only. Later emails point back to it.

## Email 1: Deliver the promise

**Job:** Give the code and one clear place to start. No story yet.
**Subject A:** Your 10% off is here (21 characters)
**Subject B:** Your code, and where to start (29)
**Preview:** Plus our three best sellers and what each one is for.

Hi {{ first_name|default:'there' }},

Thanks for joining. Here is 10% off your first order:

**{% coupon_code 'WELCOME10' %}**

Use it once on beminimalist.co within 7 days.

You signed up for skin care tips, so here is the first one. Start with one new product, not five. It is easier on your skin, and you can tell what is working.

Not sure where to start? These are our three best sellers:

- **Niacinamide serum.** Our best-selling leave-on serum.
- **Sunscreen.** For every morning, whatever your skin type.
- **Salicylic acid face wash.** A rinse-off cleanser for oily skin.

Every pack names the active and its strength on the front. So you always know what goes on your skin.

**Button:** Use my 10% code → best sellers page

## Email 2: Read the label

**Job:** Build trust through the one fact on every pack: the active and its strength. This is the brand story, told as something useful.
**Subject A:** What the numbers on our packs mean (34)
**Subject B:** Why we print the percentage on the front (40)
**Preview:** A one-minute guide to reading any skin care label.

Hi {{ first_name|default:'there' }},

Look at the front of any Minimalist pack. You will see two things: the active ingredient and its strength. We lead with the formula, not a promise.

Here is how to read it:

- **The active** is the ingredient doing the main work, like niacinamide or salicylic acid.
- **The percentage** is how much of it is in the formula.
- **Higher is not always better.** The right strength depends on your skin and the rest of your routine.

Why it helps you: you can compare like with like. You can spot when two products in your routine share an active. And you can start low and build up, instead of guessing.

Tomorrow: a simple way to match an active to your skin.

Your 10% code from our first email works for 6 more days.

**Button:** See all our actives → shop all page

## Email 3: Match an active to your skin

**Job:** Answer the biggest doubt, "which one is right for me?", and lead to one product.
**Subject A:** Which active suits your skin? (29)
**Subject B:** Oily, dry or sensitive? Start here (34)
**Preview:** Three skin types, three simple starting points.

Hi {{ first_name|default:'there' }},

Before a first order, many people ask us the same thing: which one is right for me? Pick the line that sounds most like your skin.

**Oily, or feels congested by midday?**
Start with the salicylic acid face wash. It rinses off, so it is an easy first step into actives.

**Oily, with an uneven-looking tone?**
Try the niacinamide serum. It is our best-selling serum, and it stays on your skin.

**Dry, sensitive, or not sure?**
Start with sunscreen every morning. Add an active later, one at a time.

Whatever your skin, sunscreen every morning is the habit worth keeping.

Still unsure? Reply with your skin type and what bothers you most. A real person on our team will answer.

Your 10% code works for 5 more days.

**Button:** Find my starting product → best sellers page

## WhatsApp message: day 3

**Why here:** the doubt is personal, and a chat answers it faster than an email. It reaches people who did not click email 3.
**Category:** Marketing template. **Audience:** WhatsApp opt-ins who have not ordered.

> Hi {{1}}, this is Minimalist. Not sure which active suits your skin? Tap your skin type below and our team will suggest one product to start with. Your 10% welcome code works until {{2}}.

**Quick-reply buttons:** Oily | Dry or sensitive | Not sure
**Footer:** Reply STOP to opt out
**Samples:** {{1}} = Priya, {{2}} = 20 Nov
**Replies:** answer with the matching line from email 3 and one product link.

## Email 4: Start without the worry

**Job:** Answer the fear of irritation with a plain plan for the first two weeks.
**Subject A:** New to actives? Start slow (26)
**Subject B:** How to try a new active, step by step (37)
**Preview:** Patch test, one product at a time, and when to stop.

Hi {{ first_name|default:'there' }},

Worried a new active might not agree with your skin? That is a fair worry. Here is how we suggest you start any new product.

1. **Patch test first.** Apply a little behind your ear or on your jawline and wait a day.
2. **One new product at a time.** Wait about two weeks before adding the next, so you know what your skin likes.
3. **Go slow with leave-ons.** Use a serum every other night in week one. Move to daily if your skin feels fine.
4. **Wear sunscreen every morning.**
5. **Know when to stop.** If your skin stings, burns or turns red and it does not settle, rinse it off and stop. If you have a skin condition, check with a dermatologist before you start.

Knowing the strength on the pack makes this easier. You always know what you are starting with.

Your 10% code works for 3 more days.

**Button:** Start with one product → best sellers page

## Email 5: The code ends tomorrow

**Job:** One honest reminder before the code expires, in plain text from a person.
**Subject A:** Your 10% code ends tomorrow (27)
**Subject B:** Before your welcome code runs out (33)
**Preview:** One product to start with, if you are still deciding.

Hi {{ first_name|default:'there' }},

A quick note from the Minimalist team. The 10% code in your welcome email ends in about 24 hours. After that, it will not work at checkout.

If you are still deciding, our advice is to start with one product, not a full routine:

- Oily or congested: the salicylic acid face wash.
- Uneven-looking tone: the niacinamide serum.
- Sensitive or not sure: the sunscreen.

Questions? Just reply. A person reads every reply.

The Minimalist team

**Link (plain text):** Use my code before it ends → best sellers page

**No expiry swaps:** Subject "The one product to start with". Replace the first paragraph with "If you are still deciding, here is where to start." Remove the day counts in emails 2 to 4 and the WhatsApp line "works until {{2}}".

## How to judge it

- **Main measure:** placed order rate within 14 days of sign-up, against today's 18%. Also track revenue per recipient and unsubscribe rate. Not opens.
- **First test:** timing, not copy. For example, email 2 at 8 hours against day 1. That needs about 1,000 subscribers per version. Below that, run it as written and review monthly.
- **Offer cost:** track code redemptions. Each costs about ₹70 at the average order.

## To confirm

- Code type and 7-day expiry are set in Klaviyo.
- Product wording in emails 1, 3 and 5 matches the approved claims on each product page.
- Who answers email and WhatsApp replies, and their hours.
- A named person to sign email 5. A real name reads warmer than "the team".
