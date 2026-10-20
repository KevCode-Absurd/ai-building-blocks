# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

Four light, sensible fixes that keep every number, offer, emoji and list mark exactly where it was, plus a useful flags list that catches the real probiotics-versus-prebiotics error and the vague "$5 per extra person" line. Fixes 3 and 4 touch lines that already read fine in the brand's casual voice, so the owner could reasonably skip them, but nothing was broken or invented.

## Judge list

- Met: Each fixed line can be read aloud in one breath without tripping
  "It's $29.99 for your first order. That's less than $1.10 a day for 60+ whole-food ingredients..." splits cleanly; read mode relaxes breath.
- Met: Every number, price and claim in the fixed text matches the original exactly
  $29.99, $1.10/day, 60+, 21, $20, $5, 6g all unchanged; "&" became "and" and "online-exclusive" became "online only", same meaning.
- Met: No new sentence added, no line shorter except by splitting
  Fix 1 and Fix 4 split one sentence into two; Fix 2 and 3 only restore small words ("This offer is", "Are you").
- Met: Brand's own phrases and emojis still there
  "Emojis and list marks kept in place: 💚 (once), ✅ (three times)." and 💚 kept at the head of Fix 1.
- Met: 0 to 5 fixes, voice not rewritten
  Four fixes; "Big news...", the three ✅ lines and "Shop Sprout." left as is.

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
FIX 1
Where: Text 1, second sentence (after 💚)
Failing phrase: "$29.99 for your first order, that's less than $1.10/day for 60+ whole-food ingredients, 21 vitamins & minerals, and gut-supporting probiotics in one daily gummy pack."
Rule: Whole sentence and one breath. It opens on a fragment, then a comma splice runs two ideas into one long line.
Fixed: "💚 It's $29.99 for your first order. That's less than $1.10 a day for 60+ whole-food ingredients, 21 vitamins and minerals, and gut-supporting probiotics, all in one daily gummy pack."

FIX 2
Where: Text 1, closing line
Failing phrase: "Online-exclusive offer."
Rule: Whole sentence. It's a fragment with its small words cut for punch.
Fixed: "This offer is online only. Shop Sprout."

FIX 3
Where: Text 2, opening line
Failing phrase: "Feeling off in your gut lately?"
Rule: Whole sentence. The small words "are you" are cut.
Fixed: "Are you feeling off in your gut lately?"

FIX 4
Where: Text 2, second sentence
Failing phrase: "to help keep your gut balanced without powders or prep."
Rule: Verb early, no tail clause, one breath. The point waits at the end of a long run.
Fixed: "Sprout supports digestion with 6g of fiber, prebiotics, and daily vitamins. They help keep your gut balanced, without powders or prep."

LEFT AS IS
- Text 1: "Big news: your first order of Sprout just got a lot more affordable. 💚"
- Text 1: "✅ $20 off your first order"
- Text 1: "✅ +$5 off for every extra person"
- Text 1: "✅ Third-party tested."
- Text 1: "Shop Sprout."
- Emojis and list marks kept in place: 💚 (once), ✅ (three times).
- Brand phrases: "Rip. Tip. Enjoy." and "like, ridiculously easy" don't appear in either text, so none were added. Both texts already use the brand's casual "you" voice, and that voice was kept.

FLAGS FOR THE CLAIMS CHECK (not changed)
- "$29.99 for your first order" next to "$20 off your first order": confirm $29.99 is the price after the $20 discount. Also confirm the regular price that implies.
- "less than $1.10/day": $29.99 at under $1.10 a day needs at least 28 packs, and the pack count isn't stated. Confirm the supply length.
- "+$5 off for every extra person": it's unclear what an "extra person" is (household member, referral, added subscription). Also unclear whether it stacks with the $20 off, or whether there's a cap.
- "60+ whole-food ingredients" and "6g of fiber" in a daily gummy pack need substantiation.
- "gut-supporting probiotics" (Text 1) against "prebiotics" (Text 2): check that both are in the product and that the texts are consistent.
- "supports digestion" and "help keep your gut balanced": these are structure/function health claims. They may need substantiation and a supplement disclaimer.
- "Third-party tested": say tested for what, and by whom.
- "Are you feeling off in your gut lately?": this addresses the reader's health directly. It may break Meta's personal attributes policy, so check it before it goes live.

STILL FAILING: none
```
