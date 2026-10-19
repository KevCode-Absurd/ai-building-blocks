# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A usable, well-argued page that keeps every price, claim and guarantee line inside the supplied facts, drops the risky review and the ad's stray "probiotics" word, and flags the $29.99 renewal gap and pause/cancel terms instead of guessing. The owner's main job before publishing is to answer the MISSING list, especially what the $29.99 first order renews at, so the three-button offer block can't be read as a one-off deal.

## Judge list

- Met: The word "Advertisement" sits above the headline, and nothing looks like a newspaper.
  Output opens "**Advertisement**" before the headline; no masthead, byline, dateline or publication name anywhere.
- Met: The headline uses the ad's words and doesn't name your brand or product.
  "Struggling to Get Enough Fiber? It May Be How You're Taking It" repeats the ad line, no Sprout or product name.
- Met: No button appears before section 5.
  First button, "[Button: See Sprout pack options]", comes after the four tests in section 5.
- Met: Every price, guarantee line and claim matches your facts word for word.
  "$49.99 every 4 weeks", "$29.99 with our text-message sign-up discount", "$66.65", "30-day money-back guarantee, first order only"; only $1.79/day rounds a cent off the site's $1.78.
- Met: No quote, doctor, founder line or rating appears that you didn't supply.
  Only reviews 8 (truncated, disclosed) and 18 appear with sources; review 10 dropped with reason; rating listed as MISSING.
- Met: Read only the subheads. They should tell the story.
  "Gut supplements fail at the taking" > "has to pass four tests" > "passes all four" > proof > fit > "Subscribing saves $16.66" > last line.

## What went in

```text
Facts: Sprout greens gummies. Pouch of 28 daily packs. Tear one open,
eat the small handful of gummies. 60+ ingredients, 21 vitamins and
minerals, 6 g prebiotic fiber per pack. Vegan, pectin base. Low Sugar
or Sugar-Free (Sugar-Free uses sugar alcohols). Third-party tested for
70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants.
Subscribe: $49.99 every 4 weeks. First order $29.99 only with the
text-message sign-up discount. One-time: $66.65. Guarantee: 30-day
money-back, first order only. Ships within 24 hours, arrives in 3-5 days
on average. Fine to say: "Supports digestion and gut health".
Never: "fix", weight loss, energy or immunity claims.

Ad: "Struggling to Get Enough Fiber?" Main text: "Feeling off in your gut
lately? [Sprout] supports digestion with 6g of fiber, prebiotics, and
daily vitamins to help keep your gut balanced without powders or prep."
No offer named. Buyer: the gut-fix seeker (bloating, irregularity).

Why the usual fix fails: people quit supplements because they're
unpleasant (chalky powders, pills that make you gag, a shelf of
bottles). Sprout is one you want to eat.

Quotes: reviews 8, 10 and 18 from reviews.md.

[attached: sprout/reviews.md]
```

## What came out

```text
**Advertisement**

---

## RECOGNISE

### 1. Headline and standfirst

# Struggling to Get Enough Fiber? It May Be How You're Taking It

Most people who give up on a gut supplement don't quit because of what's on the label. They quit because taking it every day was a chore. Here's what to look for in one you'll keep taking, without powders or prep.

*[Image 1: hero]*
*Caption: One pouch holds 28 daily packs.*

### 2. The moment

**Your gut feels off, and you're tired of thinking about it**

Feeling off in your gut lately? Bloated by the afternoon. Not as regular as you'd like.

You know fiber matters. You've probably bought something for it already.

And it's probably still sitting in the cupboard.

---

## UNDERSTAND

### 3. Why it keeps happening

**Gut supplements fail at the taking, not the label**

There's the chalky powder you have to measure, shake and choke down. There's the pill big enough to make you gag. There's the shelf of separate bottles you're meant to work through every morning.

Each one asks for a little effort and a little unpleasantness, every single day.

So you skip a day. Then a week. Then you stop. The fiber never reaches you because the routine never sticks.

### 4. What a supplement would need

**A gut supplement you'll keep taking has to pass four tests**

1. **No powder, no prep.** Nothing to mix, shake or wash up.
2. **Nothing hard to get down.** No chalky drink, no big pill.
3. **One serving, one step.** Not a shelf of bottles.
4. **A real dose of fiber.** Grams, not a sprinkle.

---

## BELIEVE

### 5. The product against those tests

**Sprout is a small handful of gummies that passes all four**

Sprout greens gummies come in a pouch of 28 daily packs. Tear one open and eat the small handful of gummies inside.

**No powder, no prep.** There's no scoop, no shaker and no glass to rinse. The pack is the whole routine.

**Nothing hard to get down.** It's a chewy gummy, not a gritty drink or a tablet.

**One serving, one step.** One pack a day carries more than 60 ingredients, including 21 vitamins and minerals.

**A real dose of fiber.** Every pack has 6 g of prebiotic fiber.

*[Image 2: open pack]*
*Caption: One pack is a small handful of gummies. Tear, eat, done.*

**[Button: See Sprout pack options]**
30-day money-back guarantee, first order only.
Ships within 24 hours, arrives in 3-5 days on average.

*(On phones, this button stays in view from here to the end of the page.)*

### 6. Proof you can show

**6 g of prebiotic fiber to support digestion and gut health**

Each pack carries 6 g of prebiotic fiber. Sprout supports digestion and gut health.

> "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved."
> *Customer review, Sprout website*

*[Image 3: back-of-pack panel]*
*Caption: 6 g prebiotic fiber and 21 vitamins and minerals in every pack.*

**More than 60 ingredients on a vegan pectin base**

Sprout gummies are vegan and set with pectin, not gelatin. Each pack holds 21 vitamins and minerals among its 60+ ingredients.

MISSING: the full ingredient list, the fiber source, and what each key ingredient does.

*[Image 4: gummy close-up]*
*Caption: Made on a vegan pectin base.*

**Third-party tested for more than 90 contaminants**

Sprout is third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants and 9 microbial contaminants.

MISSING: the name of the testing lab or standard.

### 7. Honest fit

**Made for people who've given up on powders and pills**

Sprout suits you if you want fiber and daily vitamins in one step, and every other routine has ended up in the cupboard. It's vegan.

**Two versions: Low Sugar or Sugar-Free**

Choose Low Sugar or Sugar-Free. Sugar-Free is sweetened with sugar alcohols.

MISSING: who should choose which version, and who Sprout isn't right for.

**The taste can take a few days**

Not everyone loves the first pack:

> "I thought the first pack I tried tasted terrible, but after the third day they started tasting better"
> *Customer review, retailer site*

MISSING: when a change in digestion might be noticed, as the business states it.

---

## DECIDE

### 8. The offer

**Subscribing saves $16.66 on every pouch**

*[Image 5: clean pouch shot]*
*Caption: 28 packs, one a day, covers 28 days.*

Every pouch holds 28 daily packs, so one pouch covers 28 days.

**Subscribe: $49.99 every 4 weeks**
About $1.79 a day. That's $16.66 less per pouch than buying once.
**[Button: Subscribe for $49.99]**
30-day money-back guarantee, first order only.
Ships within 24 hours, arrives in 3-5 days on average.

**First order: $29.99 with our text-message sign-up discount**
Sign up for texts to get your first order for $29.99. That's $36.66 less than the one-time price.
**[Button: Get my first order for $29.99]**
30-day money-back guarantee, first order only.
Ships within 24 hours, arrives in 3-5 days on average.

**One-time purchase: $66.65**
About $2.38 a day for the 28 days.
**[Button: Buy once for $66.65]**
30-day money-back guarantee, first order only.
Ships within 24 hours, arrives in 3-5 days on average.

MISSING: whether the $29.99 first order applies to the subscription, the one-time purchase, or both, and what renews after it.
MISSING: the store's own wording for pausing and cancelling a subscription.
MISSING: delivery cost.

### 9. Questions left

**"How much fiber am I actually getting?"**
6 g of prebiotic fiber in every daily pack.

**"What if I don't like the taste?"**
Some customers say the taste grows on them over the first few days. If Sprout isn't right for you, your first order is covered by our 30-day money-back guarantee.

**"Low Sugar or Sugar-Free?"**
Both come in the same 28-pack pouch. Sugar-Free is sweetened with sugar alcohols. Low Sugar is not sugar-free.

**"Is it vegan?"**
Yes. The gummies are made on a pectin base.

**"Is the money-back guarantee on every order?"**
No. The 30-day money-back guarantee covers your first order only.

**"How fast does it arrive?"**
Orders ship within 24 hours and arrive in 3-5 days on average.

**"Can I pause or cancel my subscription?"**
MISSING: the store's pause and cancel terms.

### 10. The last word

**From a cupboard full of supplements you've given up on, to one small pack a day**

**[Button: Choose my Sprout pack]**
30-day money-back guarantee, first order only.
Ships within 24 hours, arrives in 3-5 days on average.

---

## Subheads alone

1. Struggling to Get Enough Fiber? It May Be How You're Taking It
2. Your gut feels off, and you're tired of thinking about it
3. Gut supplements fail at the taking, not the label
4. A gut supplement you'll keep taking has to pass four tests
5. Sprout is a small handful of gummies that passes all four
6. 6 g of prebiotic fiber to support digestion and gut health
7. More than 60 ingredients on a vegan pectin base
8. Third-party tested for more than 90 contaminants
9. Made for people who've given up on powders and pills
10. Two versions: Low Sugar or Sugar-Free
11. The taste can take a few days
12. Subscribing saves $16.66 on every pouch
13. From a cupboard full of supplements you've given up on, to one small pack a day

---

## Page brief

- **Ad's first line:** "Struggling to Get Enough Fiber?" Main text: "Feeling off in your gut lately? [Sprout] supports digestion with 6g of fiber, prebiotics, and daily vitamins to help keep your gut balanced without powders or prep."
- **Buyer:** someone with bloating and irregularity who wants help with their gut and has tried supplements before.
- **Problem:** not getting enough fiber, and a gut that feels off.
- **Cause:** people quit supplements because taking them is unpleasant: chalky powders, pills that make you gag, a shelf of bottles.
- **Tests:** no powder or prep; nothing hard to get down; one serving, one step; a real dose of fiber (6 g).
- **Offer:** no offer named in the ad. Subscribe $49.99 every 4 weeks; first order $29.99 with text-message sign-up discount; one-time $66.65. 30-day money-back guarantee on the first order only. Ships within 24 hours, arrives in 3-5 days on average.

---

## Image list

| Slot | Real product photo | Caption |
|---|---|---|
| 1. Hero (section 1) | Sprout pouch with one daily pack beside it, same variant and pack as the ad image | One pouch holds 28 daily packs. |
| 2. Section 5 | One pack torn open, the small handful of gummies in a hand | One pack is a small handful of gummies. Tear, eat, done. |
| 3. Section 6 | Back-of-pack nutrition or supplement facts panel | 6 g prebiotic fiber and 21 vitamins and minerals in every pack. |
| 4. Section 6 | Close-up of the gummies | Made on a vegan pectin base. |
| 5. Section 8 | Clean product shot of the pouch on a plain background | 28 packs, one a day, covers 28 days. |

No customer photos are used, because none were supplied with permission.

---

## MISSING list

- The ad's image, and which variant (Low Sugar or Sugar-Free) and flavour it showed. This determines the hero photo.
- The real product photo files for every slot.
- The full ingredient list, the fiber source, and what each key ingredient does.
- The name of the third-party testing lab or standard.
- Flavours. With no flavour facts, the taste test rests on format (gummy, not powder or pill).
- Who should choose Low Sugar and who should choose Sugar-Free, as the business states it.
- Who Sprout is not right for.
- When a change in digestion might be noticed, as the business states it.
- Whether the $29.99 first order applies to the subscription, the one-time purchase, or both, and what it renews at.
- The subscription pause and cancel wording. "Cancel any time" is left off the page until these terms are confirmed.
- Delivery cost.
- Who pays return postage under the money-back guarantee, and how to claim it.
- A rating. None was supplied in the facts. The reviews file shows the brand's claimed 4.8 from 100,000 reviews and a public 4.0 from 2,411, so confirm which rating the business can show before adding one.
- Review 8 is used only up to its first sentence. Its closing line, "This is huge for someone who suffers from chronic IBS!", implies a result for a medical condition, which the business could not claim itself.
- Review 10 ("Feel lighter, less bloated and overall good.") is left out. "Lighter" can read as weight loss, and "less bloated" is a specific result. Both go beyond the approved claim "Supports digestion and gut health".
- A daily fiber recommendation, which would show readers what 6 g means. None was supplied, so none is stated.
```
