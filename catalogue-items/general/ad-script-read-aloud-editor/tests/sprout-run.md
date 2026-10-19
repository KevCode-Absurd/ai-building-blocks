# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The rewrites are clean, every price and number survives, and the probiotics-versus-prebiotics catch is genuinely useful for the claims check. But it dropped two of the brand's ✅ emojis, left out the LEFT AS IS section entirely, and spent fixes on lines like "Feeling off in your gut lately?" that already read fine.

## Fix

In the Never change rule, add: "Keep every emoji and checkmark list exactly where it sits; a ✅ list in an ad is brand formatting, not a fragment stack." In What you hand back, add: "Always include a LEFT AS IS section, even if it is one line."

## Judge list

- Met: Say each fixed line aloud once. You can get through it in one breath without tripping.
  "Your first order is $29.99. That's less than $1.10 a day for 60+ whole-food ingredients..." reads cleanly; read mode relaxes the breath test.
- Met: Every number, price and claim in the fixed text matches the original exactly.
  $29.99, $1.10, 60+, 21, $20, $5, 6g all kept; "probiotics" left as written and flagged.
- Met: No new sentence was added, and no line got shorter except by splitting in two.
  Fixes 1 and 5 split one sentence into two; "Shop Sprout." was already present; nothing new added.
- Not met: Your brand's own phrases and emojis are still there.
  Three ✅ became one: "You get $20 off your first order, plus $5 off for every extra person. ✅ And it's third-party tested."
- Met: A good script gets 0 to 5 fixes. Dozens of small changes mean it rewrote your voice.
  Exactly 5 fixes, though Fix 4 ("Have you been feeling off in your gut lately?") rewrites a plain line that already worked.

## What went in

```text
Mode: read (the main text above a Meta ad). Audience: general.
Brand lines: "Rip. Tip. Enjoy." "We made daily nutrition, like,
ridiculously easy."

Text 1:
Big news: your first order of Sprout just got a lot more
affordable. 💚 $29.99 for your first order, that's less than
$1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals,
and gut-supporting probiotics in one daily gummy pack. ✅ $20 off
your first order ✅ +$5 off for every extra person ✅ Third-party
tested. Online-exclusive offer. Shop Sprout.

Text 2:
Feeling off in your gut lately? Sprout supports digestion with 6g
of fiber, prebiotics, and daily vitamins to help keep your gut
balanced without powders or prep.
```

## What came out

```text
**Text 1, sentence 2**
- **Words at fault:** "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack."
- **Rule broken:** One idea per sentence, and each line a whole sentence. The price and the per-day value share one comma-spliced line, and the opening has no verb.
- **Fixed text:** "Your first order is $29.99. That's less than $1.10 a day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack."

**Text 1, offer list**
- **Words at fault:** "✅ $20 off your first order ✅ +$5 off for every extra person ✅ Third-party tested."
- **Rule broken:** Read text should run as whole sentences. Here it's a string of fragments.
- **Fixed text:** "You get $20 off your first order, plus $5 off for every extra person. ✅ And it's third-party tested."

**Text 1, closing**
- **Words at fault:** "Online-exclusive offer."
- **Rule broken:** Whole sentence with its small words in place. This is a fragment sitting alone, and "online-exclusive" is ad wording people don't say.
- **Fixed text:** "This offer is only available online. Shop Sprout."

**Text 2, sentence 1**
- **Words at fault:** "Feeling off in your gut lately?"
- **Rule broken:** Whole sentence with its small words in place. The subject and verb were cut.
- **Fixed text:** "Have you been feeling off in your gut lately?"

**Text 2, sentence 2**
- **Words at fault:** "to help keep your gut balanced without powders or prep."
- **Rule broken:** One idea per sentence, with no tail clause that keeps the reader waiting. "Without powders or prep" is a second idea tacked onto the end, and it reads as if it describes the gut.
- **Fixed text:** "Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins that help keep your gut balanced. And you don't need any powders or prep."

**Flags for the claims check (left as written)**
- **Text 1, offer math:** "$29.99 for your first order" and "$20 off your first order." Confirm the regular price is $49.99 and that both lines describe the same offer.
- **Text 1, per-day figure:** "less than $1.10/day." Confirm this matches the number of daily packs in a first order.
- **Text 1, extra-person discount:** "+$5 off for every extra person." The terms are unclear: who counts as an extra person, whether there's a cap, and whether it applies only to the first order.
- **Text 1, testing claim:** "Third-party tested." Confirm this is substantiated.
- **Text 2, fiber claim:** "6g of fiber." Confirm per daily pack, and that it holds for a gummy format.
- **Text 2, digestion claims:** "supports digestion" and "help keep your gut balanced." These are structure/function claims that need review.
- **Across both texts, ingredients:** Text 1 says "probiotics" and Text 2 says "prebiotics." Confirm whether the product contains one or both.
```
