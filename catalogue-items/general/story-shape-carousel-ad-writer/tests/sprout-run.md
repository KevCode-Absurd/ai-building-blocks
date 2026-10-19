# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 6 met. Invented facts: 0.

A clean, usable six-card carousel: the fixes-that-failed arc fits the powder-quitter, every number and offer term is real, the renewal price and first-order-only guarantee are stated plainly, and only the approved health claim is used. It misses on two details: the card 2 headline largely repeats the card, and neither quote carries its source, so the owner must patch those before running it.

## Fix

In step 4 add: "A headline may not reuse any key word from its card; if it does, rewrite it." In step 3 and the check list add: "Write the source (e.g. 'brand site review') right after every quote on the card and in the hand-back."

## Judge list

- Met: Cover every card but the first. Would card one alone make you want to swipe?
  "Quit your greens powder? Your pills? That shelf of gummies? Here's why each one lost you." Opens a question, no brand, promises the swipe.
- Met: The last card is 20 words or fewer and starts with the action.
  "Sign up by text. $29.99 first box, then $49.99 every 4 weeks. 30-day money-back on your first order." 18 words, action first.
- Not met: No two cards, or a card and its headline, say the same thing.
  Card 2 says "wipe the counter ... gritty/chalky"; its headline "Chalky, sloshing, and a mess to clean" mostly rewords it; only "sloshing" is new.
- Not met: Every quote matches a real review word for word, with its source.
  Both quotes are word for word (reviews 3 and 5), but cards say only "As one reviewer said" / "One reviewer"; source (brand site) never stated.
- Met: For people new to your brand, the product isn't named on card one.
  Card 1 picture: "No brand shown"; words name only powder, pills and gummy bottles.
- Met: Nothing appears that isn't in your facts, such as a deadline, a count or a result.
  All numbers ($29.99, $49.99, 60+, 21, 6 g, 30-day first order) are in the input; no dates added; "product box" is a loose read of the input's "first box".

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
Shape: Fixes that failed | Knows the kinds of fix, not us | Cards: 6

Card 1 | Open the question: why did each fix lose you? | Real kitchen counter, flat front-on framing, soft morning light, neutral palette. A greens powder tub with scoop, a pill organizer and a row of gummy bottles side by side. No brand shown | "Quit your greens powder? Your pills? That shelf of gummies? Here's why each one lost you." (16) | Swipe: three fixes, one reason each (35)

Card 2 | Fix 1: powder, and why it fell short | Same counter, framing and light. A glass with chalky residue, a scoop and a dusting of spilled powder | "The powder. Scoop, shake, sip, then wipe the counter. As one reviewer said: "the drink was definitely gritty/chalky."" (18) | Chalky, sloshing, and a mess to clean (37)

Card 3 | Fix 2: pills, and why they fell short | Same counter, framing and light. An open pill organizer and a large capsule held between two fingers | "The pills. A handful a day, and at least one that fights you on the way down." (17) | Easy to skip when it's a fight to swallow (41)

Card 4 | Fix 3: the gummy shelf, and why it fell short | Same counter, framing and light. Separate gummy bottles labelled probiotic, B12 and multivitamin | "The gummy shelf: one bottle per need. One reviewer: "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies."" (21) | So what did they switch to? Swipe. (34)

Card 5 | What works and why. Answers "a gummy can't hold enough." Product seen, not named | Same counter, now clear. Real product photo: one opened daily pack with a small handful of gummies in a palm | "One daily pack: 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber, in a small handful of gummies." (19) | Supports digestion and gut health (33)

Card 6 | The offer and action. Product named | Same counter, framing and light. Real photo of the product box with one pack beside it, logo visible | "Sign up by text. $29.99 first box, then $49.99 every 4 weeks. 30-day money-back on your first order." (18) | [Brand] Daily Pack: no gagging, no mess (39)

Visual thread: the same kitchen counter on every card, shot front-on at the same height with the same soft morning light and neutral palette. The clutter of cards 1–4 clears to one pack on card 5. Real product photos only on cards 5–6.

Main text: Quit your greens powder, your pills, or a shelf of gummies? Here's why each one falls short: chalky drinks, pills that fight you on the way down, one bottle for every need. [Brand] puts 60+ ingredients, 21 vitamins and minerals and 6 g prebiotic fiber into one daily pack of gummies. It supports digestion and gut health. No more gagging on pills, sloshing chalky powders, or cleaning messy counters. Sign up by text: $29.99 for your first box, then $49.99 every 4 weeks. 30-day money-back on your first order.

Button: Sign Up

Flags:
- Quotes to confirm: review 3 ("the drink was definitely gritty/chalky") needs confirmation that it describes a powder the reviewer used before, not your product. If it describes your product, drop it from card 2. Review 5 is quoted word for word. Add the reviewer names or initials and the review source for both.
- Brand and product name not given. "[Brand]" and "[Brand] Daily Pack" are placeholders.
- MISSING: real date. There is no ship timing, so the last card leaves out "what ships when." Add it if the store has one, and keep the card at 20 words or fewer.
- "About 25% of daily value for minerals" is left out on purpose because it could feed the "not enough" doubt. Use it only if you want full disclosure on card 5 or in the main text.
- No claim says the pack "replaces" powders or pills. Only "Supports digestion and gut health" is used as a health claim.
- The headline on card 3 is 41 characters. Trim it to "Hard to keep up when it fights you" (34) if the field truncates.
- No price per item or per day appears, because there are no per-gummy or per-use numbers to back it.
```
