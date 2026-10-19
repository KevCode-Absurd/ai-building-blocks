# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The edits are clean, numbers are untouched, and it correctly flags the probiotics/prebiotics mix-up and the $1.10/day math for the claims check. But it stripped the brand's ✅ emojis, over-edited a perfectly natural opener, and skipped the LEFT AS IS section where kept brand phrases should be listed.

## Fix

In step 5 and the Never-change list, add: "Keep list emojis (✅, 💚) the brand's text uses; turn each item into a whole phrase after its mark rather than deleting the marks." Also make LEFT AS IS a required section, listing every brand phrase and emoji kept." ,"fix_note":""}

## Judge list

- Met: Say each fixed line aloud once; one breath without tripping
  "You get $20 off your first order, plus $5 off for every extra person." All fixed lines read cleanly in one breath.
- Met: Every number, price and claim in the fixed text matches the original exactly
  "$29.99", "$1.10 a day", "60+", "21", "6g", "$20 off", "$5 off" all preserved; probiotics kept and flagged.
- Met: No new sentence added; no line shorter except by splitting
  Text 1 stays 7 sentences (7 of 7); Text 2 goes 2 to 3 only by splitting the second sentence.
- Not met: Brand's own phrases and emojis still there
  "You get $20 off your first order, plus $5 off..." drops all three ✅ emojis from the brand's ad; only 💚 survives, and no LEFT AS IS notes it.
- Met: A good script gets 0 to 5 fixes
  Five fixes total (3 in Text 1, 2 in Text 2), though Text 2 was entirely rewritten, including a natural opener "Feeling off in your gut lately?"

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
## Text 1

**Fix 1: second sentence**
- **At fault:** "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack."
- **Rules broken:** It isn't a whole sentence, because it opens on a fragment and then splices into "that's." Two ideas share one sentence: the price and what the price buys. "/day" and "&" aren't how anyone says it.
- **Fixed:** "Your first order is $29.99. That's less than $1.10 a day for 60+ whole-food ingredients, 21 vitamins and minerals, and gut-supporting probiotics, all in one daily gummy pack."

**Fix 2: checkmark list**
- **At fault:** "✅ $20 off your first order ✅ +$5 off for every extra person ✅ Third-party tested."
- **Rules broken:** This is a stack of fragments in read text, with the small words cut. Three items start with the same mark.
- **Fixed:** "You get $20 off your first order, plus $5 off for every extra person. Sprout is also third-party tested."

**Fix 3: offer line**
- **At fault:** "Online-exclusive offer."
- **Rule broken:** It's a fragment standing on its own.
- **Fixed:** "This is an online-exclusive offer."

**Full fixed Text 1:**
Big news: your first order of Sprout just got a lot more affordable. 💚 Your first order is $29.99. That's less than $1.10 a day for 60+ whole-food ingredients, 21 vitamins and minerals, and gut-supporting probiotics, all in one daily gummy pack. You get $20 off your first order, plus $5 off for every extra person. Sprout is also third-party tested. This is an online-exclusive offer. Shop Sprout.

## Text 2

**Fix 1: opening question**
- **At fault:** "Feeling off in your gut lately?"
- **Rule broken:** It isn't a whole sentence, because the small words were cut for punch.
- **Fixed:** "Has your gut been feeling off lately?"

**Fix 2: second sentence**
- **At fault:** "...and daily vitamins to help keep your gut balanced without powders or prep."
- **Rules broken:** Two ideas share one sentence: what's in it, and no powders or prep. A long tail clause keeps the reader waiting.
- **Fixed:** "Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins. It helps keep your gut balanced, with no powders or prep."

**Full fixed Text 2:**
Has your gut been feeling off lately? Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins. It helps keep your gut balanced, with no powders or prep.

## Flags for the claims check (left as written)
- **$29.99 and "less than $1.10/day":** $29.99 is about $1.00 a day over 30 days and about $1.07 over 28. Confirm how many days the first order covers.
- **"$20 off" and "+$5 off for every extra person":** Confirm whether $29.99 is the price after the $20 discount, and how the $5 per person applies.
- **Health and testing claims:** Verify "Third-party tested," "60+ whole-food ingredients," "21 vitamins & minerals" and "6g of fiber." Also verify the claim wording in "gut-supporting," "supports digestion" and "keep your gut balanced."
- **Probiotics vs prebiotics:** Text 1 says "probiotics" and Text 2 says "prebiotics." Confirm which the product contains, or whether it has both.

## Read-aloud score
- **Text 1:** before 2 of 7 = 29, after 7 of 7 = 100.
- **Text 2:** before 0 of 2 = 0, after 3 of 3 = 100.
- **Combined:** before 2 of 9 = 22, after 10 of 10 = 100.
- **Lines still failing:** none.
```
