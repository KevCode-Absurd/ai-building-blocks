# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

The page picks up the ad's habit promise, uses only supplied prices and verbatim reviews, keeps the guarantee's first-order limit and the renewal price visible, and avoids every disputed rating. The owner can use it almost as is, once shipping cost and the cancel steps are filled in from the MISSING list.

## Judge list

- Met: The headline carries the ad's main words, and the first offer is the one the ad named.
  "Headline: The one step you'll never skip." Ad named no offer, so main offer used: "Subscribe: $49.99 every 4 weeks."
- Met: Each body heading states an answer to a real doubt from your customer words.
  "It tastes like fruit snacks, not a glass of greens" answers doubt 1 (R3, R4, R12, R18); all six headings map to sourced doubts.
- Met: The renewal price, shipping, delivery time and returns terms all appear before the last button.
  Cost block: "renews at $49.99 every 4 weeks", "Shipping cost: MISSING", "arrives in 3 to 5 days", "first order only"; closing button follows.
- Met: Every price, number and timeframe on the page appears in your facts.
  $49.99, $29.99, $66.65, 28 packs, 6 g, 95%, 24 hours, 3-5 days all in input; "25% less" is 49.99/66.65 worked out.
- Met: No rating, review count, badge or deadline appears that you didn't supply.
  "No rating line: The ratings on file disagree ... so none is used." No counts, badges or deadlines anywhere.
- Met: Buttons say the same thing all the way down the page.
  "Start my first pouch" in first screen, sticky button and closing.

## What went in

```text
Facts: Sprout Original (Adults) greens gummies, Low Sugar. Pouch of 28
daily packs; tear one open, eat the handful inside. 60+ ingredients,
21 vitamins and minerals, 6 g prebiotic fiber per pack. Vegan, pectin
base. Subscribe: $49.99 every 4 weeks. First box $29.99 only with the
text sign-up discount. One-time $66.65. "Pause Or Cancel Any Time."
30-day money-back guarantee, first order only. Ships within 24 hours,
arrives in 3-5 days on average. Shipping cost on one-time orders: not
stated. Survey (say "of surveyed users"): 95% take it at least 4-6x a
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
## Page brief

- **Buyer:** An adult who has given up on greens powders and pill stacks and wants one daily habit that lasts.
- **Reason to buy:** One small pack a day that is easy to keep taking.
- **Offer:** The ad named no offer, so this page leads with the main one: Sprout Original (Adults) Low Sugar, subscribe at $49.99 every 4 weeks. The one-time price ($66.65) and the text sign-up first box ($29.99) appear in the buy area.
- **Ad's opening line:** "One Step I Never Skip"
- **Kept off this page:** Parents buying for kids (R15, R16, R17) need their own page. The Sugar-Free and cartoon-movie tie-in variants (R11, R19) are not shown here.
- **No rating line:** The ratings on file disagree (4.8, 4.75, 4.74, 4.0), so none is used.

## First screen

- **Headline:** The one step you'll never skip.
- **What-it-is line:** Greens gummies in daily packs. Tear one open and eat the handful inside. No powder, no shaker, no pill stack.
- **Picture note:** The Sprout Original (Adults) Low Sugar pouch of 28 daily packs, with one pack torn open and the gummies in a hand. MISSING: what the ad's picture showed, to confirm it is the same pack and variant.
- **Gallery order:**
  1. Pouch and one pack (what it is)
  2. Gummies out of the pack, with the "60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber" panel (what's inside)
  3. Pack being torn open on the go (in use)
  4. Pack next to a phone or keys (size)
- **Buy area (right under the gallery):**
  - Original (Adults), Low Sugar, 28 daily packs
  - **Subscribe: $49.99 every 4 weeks.** 25% less than one-time. Pause Or Cancel Any Time.
  - First box $29.99 when you sign up for texts.
  - One-time: $66.65
- **Proof:** 95% of surveyed users take it at least 4-6x a week.
- **Button:** Start my first pouch
- **Risk line:** 30-day money-back guarantee on your first order. Pause Or Cancel Any Time.
- **Near the buy area, outside it:** Shipping: MISSING: shipping cost and any free-shipping minimum. Ships within 24 hours and arrives in 3 to 5 days on average.
- **Sticky button when the buy area scrolls away:** Start my first pouch

## Doubt list

| # | Doubt, in the buyer's words | Sources | Answered in |
|---|---|---|---|
| 1 | "Will it taste gritty/chalky like my powder?" | R3, R4, R6, R12, R14, R16, R18, R19 | Section 1 |
| 2 | "Will I actually stick with it this time?" | R1, R2, R5, R6, R15 | Section 2 |
| 3 | "Does it do anything for my gut?" | R7, R8, R9, R10, R11, R13, R14 | Section 3 |
| 4 | "Can I stop buying separate probiotic, b12 and multivitamin gummies?" | R5 | Section 4 |
| 5 | "They are expensive." | R3, fragment (retailer) | Section 5, Cost block |
| 6 | "Is the subscription a trap?" / "I have tried multiple times to cancel." | R17, R20 | Section 6, Q&A |
| 7 | "Will it work too well?" (sugar alcohols) | Fragment (review site) | Q&A |

R11 and R19 concern the tie-in flavour. R11 and R14 make GLP-1 claims and are not quoted.

## Body sections

### 1. It tastes like fruit snacks, not a glass of greens

There's no scoop and no gritty glass. You tear a pack open and eat the gummies.

> "[Sprout] literally tastes like fruit snacks I ate as a kid." (brand site)

> "10/10 would recommend. The convenience and taste are huge! Like mixed berries! Plus not having to clean a shaker bottle or extra dishes for greens stuff in powder form, is absolutely excellent!" (brand site)

Not everyone loves the first pack. One buyer said so, and also said what happened next:

> "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (retailer)

If it never grows on you, your first order is covered by the 30-day money-back guarantee.

### 2. It's the habit people keep: 95% of surveyed users take it at least 4-6x a week

Most greens fail on consistency, not on what's in them. A pack you want to eat is a pack you don't skip.

> "I've tried a few green powders over the years. The issue has never been nutritive content. It's always been an issue of consistency like many things. [Sprout] has been the one thing I've been able to stick to." (brand site)

> "It's wild I WANT to take [Sprout] and don't forget." (brand site)

Each pack is one day, so it goes wherever you go.

> "So easy to grab and eat on my way to the billion things I have to do as a mom." (brand site)

### 3. Every pack has 6 g of prebiotic fiber. Here's what buyers say it did for them

These are individual buyers' experiences, not promises.

> "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved. This is huge for someone who suffers from chronic IBS!" (brand site)

> "Feel lighter, less bloated and overall good." (retailer)

> "[Sprout] have been the solution to my problems with regularity." (retailer)

One buyer's story:

> "My bowel movements are normal for the 1st time in 15 years!" (brand site)

### 4. 60+ ingredients and 21 vitamins and minerals in one daily pack

Several bottles become one pouch you take once a day.

> "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies. I just take these now and it's easier for me to manage." (brand site)

The gummies are vegan and made with a pectin base.

### 5. $49.99 every 4 weeks on subscription, 25% less than buying once

A subscription pouch holds 28 daily packs and ships every 4 weeks, so one pouch lasts until the next one arrives. Buying a single pouch once costs $66.65. Sign up for texts and your first box is $29.99.

One buyer compared it with what they paid before:

> "I was taking [a big-name greens powder] but even with their monthly subscription discount it was still $94 a month and the drink was definitely gritty/chalky." (brand site)

### 6. Pause Or Cancel Any Time, and your first order has a 30-day money-back guarantee

You can try it without committing for good.

> "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived. We quickly decided to resubscribe because we love [Sprout] so much!" (brand site)

## Cost block

- **Subscribe:** $49.99 every 4 weeks for 28 daily packs. It renews at $49.99 every 4 weeks until you pause or cancel.
- **First box with text sign-up:** $29.99. After that, $49.99 every 4 weeks. The $29.99 price applies only with the text sign-up discount.
- **One-time:** $66.65 for 28 daily packs, with no renewal.
- **Shipping cost:** MISSING: shipping cost for subscription and one-time orders, and any free-shipping minimum.
- **Delivery:** Ships within 24 hours and arrives in 3 to 5 days on average.
- **Guarantee:** 30-day money-back guarantee, on your first order only. MISSING: how to claim it, and whether opened pouches qualify.
- **Pause or cancel:** Pause Or Cancel Any Time. MISSING: how to pause or cancel (account page, email or phone).

## Comparison

Not included. The supplied facts cover Sprout only. There are no verified prices, ingredients or formats for the powders or pill stacks this buyer uses now. One customer's figure (R3, $94 a month) is quoted in Section 5 as their own words, not as a fact.

## Questions and answers

**What if I hate the taste at first?**
One buyer found the first pack "tasted terrible, but after the third day they started tasting better." If it doesn't grow on you, your first order has a 30-day money-back guarantee.

**I've tried multiple times to cancel subscriptions before. Can I actually cancel this one?**
The store's terms are "Pause Or Cancel Any Time." MISSING: the exact steps to pause or cancel. They need to be stated here, because one review-site buyer reported trouble cancelling (R20).

**Will it "work too well," like the sugar alcohol ones?**
The Sugar-Free version is the one made with sugar alcohols. This page sells Original Low Sugar. MISSING: confirmation of whether Original Low Sugar contains any sugar alcohols.

**How long does one pouch last?**
A pouch holds 28 daily packs, one a day. That covers the 4 weeks until your next subscription pouch.

**What's in it?**
Each pack has 60+ ingredients, 21 vitamins and minerals and 6 g of prebiotic fiber. It's vegan with a pectin base. MISSING: the full ingredient list and the sugar per pack.

**How soon will it get here?**
It ships within 24 hours and arrives in 3 to 5 days on average.

**What does it cost in total?**
- Subscription: $49.99 every 4 weeks, or $29.99 for your first box with text sign-up.
- One-time: $66.65.
- Shipping: MISSING.

## Closing

- **Line:** The one step you'll never skip starts with one pack a day.
- **Button:** Start my first pouch
- **Risk line:** 30-day money-back guarantee on your first order. Pause Or Cancel Any Time.

## Left empty

- MISSING: what the ad's picture showed (product, pack, variant)
- MISSING: a single verified rating (the figures on file disagree, so none is shown)
- MISSING: shipping cost for subscription orders
- MISSING: shipping cost for one-time orders
- MISSING: free-shipping minimum, if any
- MISSING: how to claim the 30-day money-back guarantee, and its conditions (opened pouches, return of product)
- MISSING: how to pause or cancel (method and steps)
- MISSING: full ingredient list
- MISSING: sugar per pack for Original Low Sugar
- MISSING: whether Original Low Sugar contains sugar alcohols
- MISSING: flavour name of Original Low Sugar
- MISSING: number of gummies per pack
- MISSING: survey size and date behind "95% of surveyed users"
- MISSING: approved health claims beyond the ingredient facts
- MISSING: prices for other pack sizes or bundles (an 84-pack is mentioned in R14), and which option, if any, is "most popular"
- MISSING: verified facts on competitor powders and pill stacks, needed for a comparison
```
