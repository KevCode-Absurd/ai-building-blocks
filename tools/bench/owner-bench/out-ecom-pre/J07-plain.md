# Minimalist welcome series: 5 emails and 1 WhatsApp message

## What the data says

- **The sunscreen gets the most clicks but the fewest orders.** Niacinamide 10%: 232 orders from 2,900 clicks (8.0%). Salicylic acid 2% face wash: 116 from 1,700 (6.8%). SPF 50 sunscreen: 79 from 3,600 (2.2%). The sunscreen page questions explain why: white cast (38%), sticky in humidity (27%), under makeup (12%). One email answers those questions.
- **Most want help with tone or oil.** 44% chose dark spots, 26% acne and oiliness. Email 2 sends each person to one product by quiz answer.
- **Most are nervous.** 61% are new to actives, so Email 3 is about starting slowly.
- **Timing.** 18% buy within 14 days, so the series runs inside that window.

## Assumptions

- The 10% code is unique per person and lasts 14 days. If yours lasts longer, change the line in Email 5.
- The quiz answer is saved as a profile property in Klaviyo (`skin_concern`).
- Dryness and sensitivity (19% together) get the sunscreen as their first step. They fear acids most, so we don't push one. If you sell a plain moisturiser, swap it in.
- The pop-up has an optional WhatsApp opt-in. If it doesn't, skip the WhatsApp message.
- Check every line about texture or finish against the product page before sending.

## Timing and exit rule

| # | Send | Job |
|---|---|---|
| 1 | Right after sign-up | Send the code and show how we label |
| 2 | Day 1 | Match the person to one product |
| 3 | Day 3 | Take away the fear of irritation |
| 4 | Day 6 | Answer the sunscreen questions |
| 5 | Day 11 | Show the short routine and remind them about the code |
| WhatsApp | Day 13, 7 pm | Last reminder, one day before the code ends |

**Trigger:** someone joins the pop-up list.

**Exit rule:** a person leaves the flow as soon as they place an order on the website. In Klaviyo, set the flow filter to "Placed Order zero times since starting this flow". Check it again before each email. They also leave if they unsubscribe. Marketplace orders don't reach Klaviyo, so Email 5 has a line for those buyers.

**Other settings:** send between 9 am and 8 pm IST.

---

## Email 1: Welcome and code

**Send:** right after sign-up
**Job:** send the promised code, and show what makes us different: we tell you what's inside, and how much.

**Subject:** Your 10% code, and how we label things
**Preview:** Here's what's inside, and how much.

**Body:**

Hi {{ first_name|default:"there" }},

Thanks for joining. Here is your 10% code for your first order:

**{{ discount_code }}**

It works for 14 days on everything on our site.

Every Minimalist product names its active ingredient and its strength on the front. So you don't see "brightening serum". You see "Niacinamide 10%". You don't see "clear skin wash". You see "Salicylic Acid 2%".

You should know what goes on your skin, and how much. That makes it easier to choose and to start slowly.

Over the next two weeks, we'll send a few short emails. Each covers one thing: which product fits your skin, how to start without irritation, and how to keep your routine short.

Good skin care doesn't need to be confusing, and it doesn't need to cost a lot.

The Minimalist team

**CTA button:** See what's inside our best sellers

**Link:** best sellers page, with the code applied at checkout

---

## Email 2: Your first product

**Send:** Day 1
**Job:** answer "I don't know which serum is for me" with one clear pick, based on their quiz answer. Build three versions with a conditional split on `skin_concern`.

### Version A: Dark spots and uneven tone, or dullness (55%)

**Subject:** For dark spots: start with this one
**Preview:** Niacinamide 10%. One product, not ten.

**Body:**

Hi {{ first_name|default:"there" }},

You told us dark spots and uneven tone are your main concern. If you try one product, make it this one.

**Niacinamide 10% serum, ₹599**

What's inside: niacinamide at 10%. Niacinamide is a form of vitamin B3. With steady use, it helps even out the look of skin tone and keep oil in check.

How to use it: 2 to 3 drops on clean skin, then moisturiser. In the day, add sunscreen on top. Sunscreen matters a lot when you're working on uneven tone.

How to start slowly: use it every other night for the first week. If your skin feels fine, use it every night.

**CTA button:** Get the Niacinamide 10% serum

### Version B: Acne and oiliness (26%)

**Subject:** For oily skin: start with your face wash
**Preview:** Salicylic acid 2%. One easy swap.

**Body:**

Hi {{ first_name|default:"there" }},

You told us acne and oiliness are your main concern. The easiest first step is to change your face wash. There's no new step to add.

**Salicylic Acid 2% face wash, ₹299**

What's inside: salicylic acid at 2%. It works inside the pores to help clear out oil and keep them clean.

How to use it: wet your face, massage a small amount for about 30 seconds, then rinse.

How to start slowly: use it once a day, at night, for the first week. If your skin feels fine, use it morning and night.

**CTA button:** Get the Salicylic Acid 2% face wash

### Version C: Dryness or sensitivity (19%)

**Subject:** Sensitive skin? Start here, not with acids
**Preview:** The gentlest first step is sunscreen.

**Body:**

Hi {{ first_name|default:"there" }},

You told us your skin is dry or sensitive. So our advice is simple: don't start with an acid.

Start with daily sunscreen. It doesn't exfoliate, and it protects your skin every day.

**SPF 50 sunscreen, ₹399**

What's inside: broad sun protection at SPF 50.

How to use it: every morning, as the last step. Use about two finger-lengths for your face and neck.

How to start slowly: try it on a small patch near your jaw for two days first. If your skin feels fine, use it on your whole face.

Actives can come later. There's no rush.

**CTA button:** Get the SPF 50 sunscreen

---

## Email 3: How to start slowly

**Send:** Day 3
**Job:** take away the biggest fear, irritation. This is for the 61% who are new to actives.

**Subject:** Scared to try actives? Read this first
**Preview:** Four simple rules for starting slowly.

**Body:**

Hi {{ first_name|default:"there" }},

Many people tell us, "My skin is sensitive, I'm scared to try acids." That's a fair worry. Here's how to start any active slowly.

**1. Try a small patch first.**
Put a little on the side of your jaw for two days. If there's no redness or stinging, go ahead.

**2. Add one new product at a time.**
Wait two weeks before you add the next one. Then, if something doesn't suit you, you'll know which one it was.

**3. Start with fewer days.**
Use a serum every other night, or an acid face wash once a day. Use it more often only when your skin feels comfortable.

**4. Wear sunscreen every morning.**
Actives work best when your skin is protected from the sun.

A little tingling for a few seconds can be normal. If you get burning, lasting redness or peeling, stop and give your skin a break.

That's why we print the strength on every pack. You know what you're starting with.

**CTA button:** Find a product to start with

**Link:** the product from their Email 2 version

---

## Email 4: Sunscreen questions

**Send:** Day 6
**Job:** turn sunscreen clicks into orders. Answer the three questions people ask most on that page.

**Subject:** "Will it leave a white cast?"
**Preview:** Your top 3 sunscreen questions, answered.

**Body:**

Hi {{ first_name|default:"there" }},

Our SPF 50 sunscreen gets more questions than anything else we sell. Here are the top three.

**"Will it leave a white cast?"**
This is the question we get most. Here's what one of our most liked reviews says: "No white cast, even on my dusky skin." To keep the finish even, spread it in two thin layers instead of one thick one.

**"Is it sticky in humid weather?"**
Use the right amount, about two finger-lengths for face and neck, and pat it in. Give it a minute or two to settle before you step out or add anything else.

**"Can I wear it under makeup?"**
Yes. Make it the last step of your skin care. Wait a few minutes for it to set, then apply makeup as usual.

How to start slowly: if sunscreens have bothered you before, patch test near your jaw for two days first.

SPF 50 for ₹399. With your 10% code, it's ₹359.

**CTA button:** Get the SPF 50 sunscreen

---

## Email 5: The short routine, and your code

**Send:** Day 11
**Job:** answer "Just tell me what to use" with the full 3-step routine, and remind them the code ends in 3 days.

**Subject:** A 3-step routine. That's all.
**Preview:** Your 10% code ends in 3 days.

**Body:**

Hi {{ first_name|default:"there" }},

You don't need a 10-step routine. Most people do well with three steps.

**Morning**
1. Salicylic Acid 2% face wash
2. SPF 50 sunscreen

**Night**
1. Salicylic Acid 2% face wash
2. Niacinamide 10% serum (2 to 3 drops)

How to start slowly: add one product at a time, two weeks apart. Start with the one that fits your main concern. Use actives every other day at first.

All three cost ₹1,297. With your 10% code, they cost ₹1,167.

Your code **{{ discount_code }}** works until {{ code_expiry_date }}. After that, our prices stay fair, as always.

Bought from us on a marketplace? Thank you, and please ignore this email.

**CTA button:** Shop the 3-step routine

**Link:** a collection page with all three products

---

## WhatsApp message

**Send:** Day 13 at 7 pm IST, one day before the code ends. Only to people who opted in to WhatsApp and haven't ordered. Use a pre-approved WhatsApp template.
**Job:** a short, last reminder on the channel people check most. It stays calm, with no pressure.

**Message:**

Hi {{ first_name }}, this is Minimalist. Your 10% code {{ discount_code }} ends tomorrow. Not sure where to start? Pick one product for your main skin concern, and use it every other day at first. Shop here: {{ link }}
Reply STOP to opt out.

---

**Track:** 14-day buy rate (18% today), sunscreen click-to-order rate (2.2% today), and orders per recipient for each Email 2 version.
