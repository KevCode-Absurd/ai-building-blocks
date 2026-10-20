# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A disciplined page that carries the ad's habit promise, uses only supplied prices and real review quotes, and marks every gap (shipping cost, cancel steps, guarantee conditions, rating) as MISSING rather than guessing. The owner can hand this to a builder almost as-is; the only soft spot is the rhetorical "That is why 95%..." linking convenience to the survey number, which the survey itself did not test.

## Judge list

- Met: The headline carries the ad's main words, and the first offer is the one the ad named.
  "One step you'll never skip: your daily greens, in one pack of gummies." Ad named no offer; page leads with subscribe $49.99 / first box $29.99.
- Met: Each body heading states an answer to a real doubt from your customer words.
  "Buyers say it tastes like a treat. A few say it takes a few days." answers R12/R18; "Pause or cancel any time" answers R17/R20.
- Met: The renewal price, shipping, delivery time and returns terms all appear before the last button. Any your facts don't give shows there as MISSING, never a guess.
  Cost block: "Then: $49.99, charged every 4 weeks", "MISSING: the one-time shipping cost", "Arrives in 3-5 days", "first order only".
- Met: Every price, number and timeframe on the page appears in your facts.
  $29.99, $49.99, $66.65, 28 packs, 3-5 days, 95% all from input; 25% and 55% savings are arithmetic on given prices.
- Met: No rating, review count, badge or deadline appears that you didn't supply.
  "MISSING: a rating to show. The ratings on file disagree... so none is used." No counts, badges or deadlines.
- Met: Buttons say the same thing all the way down the page.
  "Start my first pouch" on first screen, sticky button and closing.

## What went in

```text
Facts: Sprout Original (Adults) greens gummies, Low Sugar. Pouch of 28
daily packs; tear one open, eat the handful inside. 60+ ingredients,
21 vitamins and minerals, 6 g prebiotic fiber per pack. Vegan, pectin
base. Subscribe: $49.99 every 4 weeks. First box $29.99 only with the
text sign-up discount. One-time $66.65. "Pause Or Cancel Any Time."
30-day money-back guarantee, first order only. Ships within 24 hours,
arrives in 3-5 days on average. Free shipping on the first order.
One-time orders say "No Free Shipping"; that cost is not stated. Survey (say "of surveyed users"): 95% take it at least 4-6x a
week. Ratings on file disagree (4.8, 4.75, 4.74, 4.0). Sugar-Free uses
sugar alcohols.

Ad: "One Step I Never Skip". No offer named. Buyer: has quit powders
and pill stacks, wants one habit that lasts.

Customer words: sprout/reviews.md, R1 to R20 and the two fragments.
Bought again (subscription).

[attached: sprout/reviews.md]
```

## What came out

```text
# Sprout Original (Adults) landing page: "One Step I Never Skip"

## Page brief

- **Buyer:** An adult who has quit greens powders and pill stacks and wants one daily habit that lasts.
- **Reason to buy:** A daily pack of greens gummies that is easy enough to keep taking.
- **Offer:** The ad named none, so the page leads with the main offer.
  - Subscribe: $49.99 every 4 weeks.
  - First box $29.99 with the text sign-up discount.
  - One-time $66.65 is shown beside it.
- **Variant:** Original (Adults), Low Sugar, pouch of 28 daily packs.
- **Ad's opening line:** "One Step I Never Skip"
- **How it's bought:** Used up and bought again (subscription).
- **Not on this page:** Kids (R15, R16, R17) and Sugar-Free are separate buyers and variants, so each gets its own page.
- **Picture:** The ad image wasn't supplied, so the picture match was not checked against the real ad.

## First screen

**Headline:** One step you'll never skip: your daily greens, in one pack of gummies.

**What it is:** Greens gummies in daily packs. Tear one open and eat the handful inside. No powder, no shaker, no pill stack.

**Picture note:**
- Show the Sprout Original (Adults) Low Sugar pouch, with one daily pack torn open and the gummies in hand.
- Match the pack and variant the ad showed. MISSING: the ad image, to confirm.
- **Gallery order:**
  1. The pouch and one daily pack.
  2. The back of the pack (60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber).
  3. A pack being opened on the go.
  4. The pouch next to a phone or coffee cup, for size.

**Buy area (in the first phone screen, under the gallery):**
- ◉ **Subscribe: $49.99 every 4 weeks.** 25% less than one-time. First box $29.99 with the text sign-up discount.
- ○ **One-time: $66.65.** No free shipping.
- Pouch of 28 daily packs. Low Sugar.

**Proof:** 95% of surveyed users take it at least 4-6x a week.

**Button:** Start my first pouch

**Risk line:** 30-day money-back guarantee on your first order. Pause or cancel any time.

**Near the buy area, not inside it:** Free shipping on your first order. Ships within 24 hours. Arrives in 3-5 days on average.

**Sticky button when the buy area scrolls away:** Start my first pouch

## Doubt list

Doubts are listed most common first. Each source is counted once per doubt.

| # | Doubt, in the buyer's words | Sources | Answered in |
|---|---|---|---|
| 1 | "Will it help my digestion?" | R7, R8, R9, R10, R11, R14, fragment "worked too well" (Sugar-Free) | Section 1; Q&A (sugar alcohols) |
| 2 | "Will I like the taste?" | R6, R12, R14, R16, R18, R19 | Section 2 |
| 3 | "Will I actually stick to it?" | R1, R2, R5, R6, R15, plus the survey | First screen; Section 3 |
| 4 | "Is it better than the powder I quit?" | R3, R4, R6 | Section 4 |
| 5 | "Can it replace my pile of gummies and pills?" | R5 | Section 4 |
| 6 | "Is it worth the money?" | R3, fragment "They are expensive" | Section 5; Cost block |
| 7 | "Can I actually cancel the subscription?" | R17, R20 | Section 6; Q&A |
| 8 | "Will I feel more energy?" | R13, R14 | Q&A |

**Not used on the page:** R11 and R14 tie the gummies to a GLP-1 medication. A customer may say that, but the brand should not repeat it as its own claim, so neither quote appears.

## Body sections

### 1. Every pack carries 6 g of prebiotic fiber

Each daily pack has 6 g of prebiotic fiber, along with 21 vitamins and minerals and 60+ ingredients, on a vegan pectin base.

Here is what some buyers wrote. These are their stories, not a promise of yours:

> "My bowel movements are normal for the 1st time in 15 years!"

> "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved."

> "Feel lighter, less bloated and overall good."

### 2. Buyers say it tastes like a treat. A few say it takes a few days.

> "[Sprout] literally tastes like fruit snacks I ate as a kid."

That is not everyone's first bite:

> "I thought the first pack I tried tasted terrible, but after the third day they started tasting better"

If it isn't for you, your first order is covered by the 30-day money-back guarantee.

MISSING: the flavour name of Original Low Sugar.

### 3. One pack a day, with nothing to mix and nothing to wash

Tear the pack open and eat the handful inside. There is no shaker bottle, no scoop and no sink full of dishes. That is why 95% of surveyed users take it at least 4-6x a week.

> "The issue has never been nutritive content. It's always been an issue of consistency like many things. [Sprout] has been the one thing I've been able to stick to."

> "It's wild I WANT to take [Sprout] and don't forget."

### 4. 60+ ingredients and 21 vitamins and minerals, in one pack instead of a shelf

You get your greens, prebiotic fiber, vitamins and minerals in one daily step.

> "I've been choking on [a big-name greens powder] for the last few years"

> "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies. I just take these now and it's easier for me to manage."

### 5. Subscribing costs 25% less than buying once

- Subscribe: $49.99 every 4 weeks.
- One-time: $66.65.
- Your first box is $29.99 with the text sign-up discount. That is 55% less than one-time.

A pouch holds 28 daily packs, which is four weeks at one a day. It ships every 4 weeks, so the next pouch arrives as you finish the last.

> "I was taking [a big-name greens powder] but even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky."

### 6. Pause or cancel any time

You are not locked in. Pause or cancel whenever you like.

MISSING: the exact steps to pause or cancel, in the store's own words. These should sit right here.

> "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived. We quickly decided to resubscribe because we love [Sprout] so much!"

### Fold-out panels near the buy area

- **Ingredients:**
  - 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber per pack.
  - Vegan, pectin base.
  - MISSING: the full ingredient list and sugar per pack for Low Sugar.
- **How to use:** Tear one daily pack open and eat the handful inside, once a day. MISSING: any timing or with-food guidance.
- **Shipping and returns:** Repeat the cost block below.

The price, renewal price and guarantee line stay outside the panels.

## Cost block (above the last button)

**Subscribe:**
- First box: $29.99 with the text sign-up discount. MISSING: the first-box price without the text sign-up.
- Then: $49.99, charged every 4 weeks.
- Each box: one pouch of 28 daily packs.

**One-time:**
- $66.65 for one pouch of 28 daily packs.
- No free shipping. MISSING: the one-time shipping cost.

**Shipping:**
- Free on your first order.
- MISSING: the shipping cost on subscription renewals.
- MISSING: whether a free-shipping minimum exists.

**Delivery:** Ships within 24 hours. Arrives in 3-5 days on average.

**Guarantee:**
- 30-day money-back guarantee, first order only.
- MISSING: when the 30 days start, whether opened pouches qualify, how to claim, and who pays any return postage.

**Pause or cancel:** Any time. MISSING: how.

## Comparison

Left out. No facts are held for the powder or pill-stack side, only customer opinions, which are quoted in Section 4 instead.

## Questions and answers

**"I tried the sugar-free one and it 'worked too well.' Will this one do that?"**
This page is for Original Low Sugar. The Sugar-Free version uses sugar alcohols. MISSING: whether Low Sugar contains sugar alcohols.

**"Will I feel more energy?"**
We don't promise that. One buyer wrote:

> "clean feeling energy and mental focus ... without the sugar crash"

**"I've tried to cancel subscriptions before and couldn't. How do I cancel this one?"**
Pause or cancel any time. MISSING: the step-by-step way to cancel.

**"What if I don't like it?"**
Your first order comes with a 30-day money-back guarantee. MISSING: how to claim.

**"How long does a pouch last?"**
28 daily packs, so four weeks at one a day. The subscription ships every 4 weeks.

**"Is it vegan?"**
Yes. It is made on a pectin base.

**"Is there a bigger pack?"**
MISSING: whether an 84-pack is sold, and its price. R14 mentions "Original Low Sugar 84 packs".

## Closing

**Line:** Make greens the one step you never skip.

**Button:** Start my first pouch

**Risk line:** 30-day money-back guarantee on your first order. Pause or cancel any time.

## Left empty

- MISSING: the ad image or frames, to match the picture, pack and variant.
- MISSING: the Original Low Sugar flavour name.
- MISSING: the full ingredient list and sugar per pack.
- MISSING: whether Low Sugar contains sugar alcohols.
- MISSING: how-to-use timing or guidance.
- MISSING: the first-box price without the text sign-up discount.
- MISSING: the one-time shipping cost.
- MISSING: the subscription renewal shipping cost, and any free-shipping minimum.
- MISSING: the guarantee conditions (start date, opened packs, how to claim, return postage).
- MISSING: how to pause or cancel, in the store's own words.
- MISSING: the survey's size and date.
- MISSING: whether an 84-pack exists, and its price.
- MISSING: a rating to show. The ratings on file disagree (4.8, 4.75, 4.74, 4.0), so none is used.

## Checks missed

none
```
