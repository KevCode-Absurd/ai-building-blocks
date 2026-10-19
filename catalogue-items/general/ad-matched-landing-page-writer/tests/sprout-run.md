# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 6 met. Invented facts: 0.

A careful, usable page: the headline picks up the ad, every number traces to the facts, reviews are quoted verbatim with the IBS and bowel stories framed as one buyer's experience, and no rating or claim is made up. The only gap is shipping cost, which the owner never supplied, so the cost block carries a MISSING line instead of the fee and the page cannot fully state the total before the last button.

## Fix

In 'What you need', make shipping cost (or the free-shipping rule for each purchase option) a required input and add to 'If something is missing': if shipping cost is not given, ask for it before writing, since the cost block cannot be completed without it.

## Judge list

- Met: Headline carries the ad's main words, and the first offer is the one the ad named
  "Make greens the one step you never skip." Ad named no offer; page uses main offer "Subscribe: $49.99 every 4 weeks."
- Met: Each body heading states an answer to a real doubt from customer words
  "It's a handful of fruit gummies, not a gritty shake" answers taste doubt (R6, R12, R18, R19); all five headings map to review-sourced doubts.
- Not met: Renewal price, shipping, delivery time and returns terms all appear before the last button
  Renewal, 3-5 days, first-order guarantee present; "MISSING: shipping cost for subscription and one-time orders" so shipping cost absent, correctly flagged.
- Met: Every price, number and timeframe on the page appears in the facts
  $49.99, $66.65, $29.99, 28 packs, 4 weeks, 24 hours, 3-5 days, 95% all supplied; "Save 25%" is arithmetic on given prices.
- Met: No rating, review count, badge or deadline that wasn't supplied
  "MISSING: one verified rating. Ratings on file disagree ... so no rating line is used." No counts, badges or deadlines.
- Met: Buttons say the same thing all the way down
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

- **Buyer:** Has quit greens powders and pill stacks and wants one daily habit that lasts.
- **Reason to buy:** One small step a day: tear a pack, eat a handful. No shaker and no row of bottles.
- **Offer:** The ad named no offer, so this page uses the main offer: Subscribe, $49.99 every 4 weeks.
- **Ad's opening line:** "One Step I Never Skip"
- **Product and variant:** Sprout Original (Adults), Low Sugar, pouch of 28 daily packs.
- **Note:** Only the ad's headline was supplied, not its image or video frames. The picture match below has not been checked against the real ad.

## First screen (phone)

- **Headline:** Make greens the one step you never skip.
- **What it is:** Greens gummies in daily packs. Tear one open and eat the handful inside.
- **Picture:** The Sprout Original (Adults) Low Sugar pouch with one torn daily pack and the gummy handful beside it. Match the pack and variant shown in the ad. (Not checked against the real ad.)
- **Buy area:**
  - Variant: Original (Adults), Low Sugar, 28 daily packs.
  - **Subscribe: $49.99 every 4 weeks.** Save 25% against one-time.
  - One-time: $66.65.
- **Proof:** 95% of surveyed users take it at least 4 to 6 times a week.
- **Button:** Start my first pouch
- **Risk line:** 30-day money-back guarantee on your first order. Pause Or Cancel Any Time.
- **Sticky button:** "Start my first pouch" follows the shopper once the buy area scrolls away.

**Gallery order:**
1. The pouch and one daily pack (what it is).
2. The torn pack with the handful of gummies (what's inside).
3. Eating it on the go, with no shaker or glass in sight (in use).
4. One pack next to a phone or car keys (size).
5. The label panel showing 60+ ingredients, 21 vitamins and minerals and 6 g prebiotic fiber.

## Doubt list

Each source is counted once.

| # | Doubt (buyer's phrasing) | Sources | Answered in |
|---|---|---|---|
| 1 | "Will it help my digestion and regularity?" | R7, R8, R9, R10, R11 (5) | Section 1 |
| 2 | "Will it taste okay, or will I choke it down?" | R6, R12, R18, R19 (4) | Section 2 |
| 3 | "Is it easier than my powder or my pile of gummies and pills?" | R3, R4, R5, R15 (4) | Section 3 |
| 4 | "Will I actually stick to it this time?" | R1, R2 (2) | First screen, Section 4 |
| 5 | "Is the subscription a trap? Can I cancel?" | R17, R20 (2) | Section 5, Cost block |
| 6 | "Will it give me energy?" | R13, R14 (2) | Q&A |
| 7 | "Is it worth the price?" | "They are expensive" (1) | Cost block, Q&A |
| 8 | "Will the sugar-free one upset my stomach?" | "The sugar free [Sprout] worked too well." (1) | Q&A |
| 9 | "Will my kids eat it?" | R16 (1) | Not answered here. The Kids product is a different buyer and page (see Left empty). |

R11 and R14 also raise GLP-1 medication. The page makes no claim about it, by design.

## Body sections

**1. Every pack carries 6 g of prebiotic fiber**

That fiber comes alongside 60+ ingredients and 21 vitamins and minerals, all in one daily pack.

One buyer with chronic IBS put it this way: "The prebiotics do their job, but not aggressively, and I feel like my overall digestion has improved." (brand site)

Another wrote: "My bowel movements are normal for the 1st time in 15 years!" (brand site) That is one person's story, not a promise.

**2. It's a handful of fruit gummies, not a gritty shake**

"[Sprout] literally tastes like fruit snacks I ate as a kid." (brand site)

Not everyone loves the first pack. One retailer reviewer said: "I thought the first pack I tried tasted terrible, but after the third day they started tasting better." (retailer)

The gummies are vegan, made on a pectin base.

**3. No shaker, no scoop, no row of bottles: tear, eat, done**

The whole routine is one pack: tear it open and eat the handful inside. Nothing to mix and nothing to wash.

"I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies. I just take these now and it's easier for me to manage." (brand site)

"So easy to grab and eat on my way to the billion things I have to do as a mom." (brand site)

**4. Built to be the one you keep taking**

95% of surveyed users take it at least 4 to 6 times a week.

"I've tried a few green powders over the years. The issue has never been nutritive content. It's always been an issue of consistency like many things. [Sprout] has been the one thing I've been able to stick to." (brand site)

"It's wild I WANT to take [Sprout] and don't forget." (brand site)

**5. Pause Or Cancel Any Time, and your first order has a 30-day money-back guarantee**

A pouch holds 28 daily packs, and the subscription ships every 4 weeks, so a new pouch arrives as the last one runs out.

If it isn't for you, the store's terms read: "Pause Or Cancel Any Time." Your first order is covered by a 30-day money-back guarantee.

## Cost block (directly above the last button)

- **Subscribe:** $49.99 every 4 weeks, charged every 4 weeks until you pause or cancel.
- **Text sign-up discount:** Your first box is $29.99 only if you sign up by text. After that, $49.99 every 4 weeks.
- **One-time:** $66.65. Subscribing saves 25%.
- **What you get:** 1 pouch of 28 daily packs.
- **Shipping:** Ships within 24 hours and arrives in 3 to 5 days on average. MISSING: shipping cost for subscription and one-time orders, and any free-shipping minimum.
- **Guarantee:** 30-day money-back guarantee, first order only. MISSING: how to claim it and any conditions, such as opened packs.
- **Cancel:** Pause Or Cancel Any Time. MISSING: the steps to pause or cancel, in the store's words.

**Fold-out panels:** Ingredients, How to use, Shipping and returns. The price, renewal price and guarantee line stay outside the panels.

## Comparison

Not included. There are no supplied facts on the buyer's current powder or pill stack to hold against Sprout's.

## Questions and answers

**Will it give me energy?**
We don't make that claim. Some customers describe it, for example: "clean feeling energy and mental focus ... without the sugar crash" (brand site).

**Is it worth the price?**
Subscribe is $49.99 every 4 weeks for 28 daily packs, 25% less than the $66.65 one-time price. With the text sign-up discount, your first box is $29.99.

**I've heard the sugar-free one can upset your stomach. Is this that one?**
No. This page is the Low Sugar version. The Sugar-Free version uses sugar alcohols, which some people find hard on the stomach.

**How long does one pouch last?**
A pouch holds 28 daily packs, one a day, and the subscription ships every 4 weeks.

**Is it vegan?**
Yes. The gummies are vegan, on a pectin base.

**What if it's not for me?**
Your first order has a 30-day money-back guarantee, and you can Pause Or Cancel Any Time.

## Closing

- **Line:** One pack a day. The one step you never skip.
- **Button:** Start my first pouch
- **Risk line:** 30-day money-back guarantee on your first order. Pause Or Cancel Any Time.

## Left empty

- MISSING: the ad's image or video frames, for the picture match.
- MISSING: shipping cost for subscription and one-time orders, and any free-shipping minimum.
- MISSING: how to claim the guarantee and its conditions.
- MISSING: the steps to pause or cancel.
- MISSING: one verified rating. Ratings on file disagree (4.8, 4.75, 4.74, 4.0), so no rating line is used.
- MISSING: the full ingredient list for the Ingredients panel.
- MISSING: sugar per pack for Low Sugar.
- MISSING: flavour name of Original Low Sugar.
- MISSING: price per day. Not given in the facts, so not shown.
- MISSING: Kids product facts. That doubt belongs on its own page.
- MISSING: an approved brand position on GLP-1 questions. None is made here.

## Score

6 / 7 checks passed = **86 / 100**

- Missed: "The renewal price, shipping and returns terms are all stated before the last button." The shipping cost is not in the supplied facts for either order type, so it is flagged as MISSING rather than guessed.
```
