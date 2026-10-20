# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A tight, usable six-card carousel that sticks to the facts given, uses only the two real quotes and the one approved claim, and discloses the text sign-up condition and first-order guarantee limit on the offer card. Placeholders for the unnamed brand and honest flags on the pills gap and the powder assumption make it easy for the owner to finish.

## Judge list

- Met: Cover every card but the first. Would card one alone make you want to swipe?
  "Quit your greens powder, your pills, or a whole shelf of gummies? Swipe to see what fits in one small handful instead." Opens a question, hints the answer.
- Met: The last card is 20 words or fewer and starts with the action.
  "Tap Shop now. First box $29.99 with text sign-up, then $49.99 every 4 weeks. 30-day money-back, first order." 18 words, counted.
- Met: No two cards, or a card and its headline, say the same thing.
  Each card carries one idea; headlines add ("Supports digestion and gut health" under the ingredient card, "Fewer bottles to buy" under the quote).
- Met: Every quote matches a real review word for word, with its source.
  "the drink was definitely gritty/chalky" and "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." match reviews 3 and 5; sources labelled Review 3/5 as given.
- Met: For people new to your brand, the product isn't named on card one.
  Card 1 shows an unbranded counter; product named only on card 6 ("Meet [product name]").
- Met: Nothing appears that isn't in your facts, such as a deadline, a count or a result.
  All numbers ($29.99, $49.99, 60+, 21, 6 g, 30-day) are from the input; ship date and gummy count left off and flagged MISSING.

## What went in

```text
Cards: 6
Buyer: people who quit greens powders, pills or a shelf of
gummies. They know the kinds of fix, not us. Doubt: "A gummy
can't hold enough to replace my powder."
Facts: 1 daily pack = 60+ ingredients, 21 vitamins and minerals,
6 g prebiotic fiber, in a small handful of gummies. About 25% of
daily value for minerals. Allowed: "Supports digestion and gut
health." Brand line: "No more gagging on pills, sloshing chalky
powders, or cleaning messy counters."
Offer: $29.99 first box with the text sign-up, then $49.99 every
4 weeks. Guarantee: 30-day money-back, first order only.
Quotes: review 3 "the drink was definitely gritty/chalky".
Review 5 "I also stopped buying separate probiotic gummies, b12
gummies, and multivitamin gummies."
```

## What came out

```text
Shape: Fixes that failed | Knows the kinds of fix, not this product | Cards: 6

1 The opener: tried one of these?
  Picture:  One stretch of kitchen counter holding a greens powder tub, a pill bottle and a row of gummy bottles. No brand is visible.
  Card:     Quit your greens powder, your pills, or a whole shelf of gummies? Swipe to see what fits in one small handful instead.   (22)
  Headline: For anyone who's quit a supplement      (34)

2 Fix one: the powder, and why it fell short
  Picture:  The same counter and framing, with a half-drunk shaker of green drink. Grit clings to the inside of the glass.
  Card:     Fix one: the greens powder. One reviewer's verdict: "the drink was definitely gritty/chalky."   (13)
  Headline: Review 3, word for word                 (23)

3 Fix two: the gummy shelf, and why it fell short
  Picture:  The same counter, with several separate unbranded gummy bottles lined up in a row.
  Card:     Fix two: a separate gummy for every need, until the shelf fills with bottles.   (14)
  Headline: Each bottle its own purchase            (28)

4 What works and why (answers "a gummy can't hold enough")
  Picture:  A real product photo of one daily pack torn open on the same counter, with a small handful of gummies in an open palm. The product is shown but not named.
  Card:     Can a gummy hold enough? One daily pack: 60+ ingredients, 21 vitamins and minerals and 6 g prebiotic fiber.   (19)
  Headline: Supports digestion and gut health       (33)

5 Proof: one customer's shelf
  Picture:  The same counter with the gummy bottles gone. One real daily pack sits where they stood.
  Card:     "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." Review 5   (14)
  Headline: Fewer bottles to buy                    (20)

6 The offer
  Picture:  A real product photo of the box, with its name visible, on the same counter in the same light.
  Card:     Tap Shop now. First box $29.99 with text sign-up, then $49.99 every 4 weeks. 30-day money-back, first order.   (18)
  Headline: Meet [product name]                     (19, with the placeholder in place)

Visual thread: Every card uses the same eye-level shot of one stretch of kitchen counter, the same soft morning daylight from the left and the same neutral background with one accent colour. Text sits in the same top block in the same typeface on every card. Real product photos appear on cards 4 to 6 only.

Main text: Quit your greens powder, your pills or a shelf of gummies? One reviewer called the drink "definitely gritty/chalky." Another "stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." [Product name] puts 60+ ingredients, 21 vitamins and minerals and 6 g prebiotic fiber into one daily pack, a small handful of gummies. Supports digestion and gut health. Your first box is $29.99 with text sign-up, then $49.99 every 4 weeks. 30-day money-back on your first order.
Button: Shop now

Flags
MISSING: These facts are not on file and need filling in:
- Product name and brand name. Card 6's headline and the main text use a placeholder, so recount the headline's characters once the name is in.
- Number of gummies per daily pack. "Small handful" is used instead of a count.
- Ship date. It is left off the last card.
- Brand colours and look.
- Real product photos for cards 4 to 6.

Quotes to check:
- Confirm that reviews 3 and 5 are real and quoted exactly, and note where each was posted.
- I have assumed review 3 describes a powder the reviewer used before switching. It doesn't say they quit because of it, and the cards don't claim that.

Left out, and why:
- **Pills card.** Nothing from buyers says why pills fell short, so pills appear only on card 1.
- **Brand line ("No more gagging on pills, sloshing chalky powders, or cleaning messy counters").** It describes what buyers went through, but no buyer brief or review backs it. Add it once a review says the same.
- **"About 25% of daily value for minerals."** This is true, but it needs context to sit beside the "enough?" question. It belongs on the landing page and is not hidden.

CHECKS MISSED  none

Would you like to check it before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), or write the landing page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer)? You can also type your own next step.
```
