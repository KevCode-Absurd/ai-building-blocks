# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The script itself is safe and well sourced: every number and quote traces to brand.md, the guarantee limit is stated, and the borrowed idea cleanly avoids the banned price and discount angle. But it skips the required Belief shift, Assumed, Opening variants, Test plan and Placeholders, and the REFERENCE never quotes the ad's own words, so the owner gets a thinner, less testable deliverable than the block promises.

## Fix

In 'What you hand back', require REFERENCE to quote the ad's headline as written whenever no ID or link exists, and state that the SCRIPT block must include every element of the output shape (Belief shift, Assumed, Beat table with Evidence column, Opening variants, Selling beat, Test plan, Placeholders).

## Judge list

- Not met: REFERENCE names a real ad with an ID, a link or its own words.
  "library ID or link not given, start date not shown" and the headline's words are never quoted in REFERENCE; only a description.
- Met: The idea line would make sense for a product in another category.
  "Put the viewer's own doubt on screen in quotation marks, word for word, then answer it plainly with a concrete fact."
- Met: The idea shapes one or two named parts, not the whole script.
  "Where it acts: Part 2 (Doubt) and Part 3 (Straight answer)"; parts 1, 4, 5 are built from research only.
- Met: Every number and quote has a source from your own facts.
  Sources list ties 100%/25% DV, 6g, 80%, 3,000+, review quote and guarantee to brand.md sections.
- Met: All five distance lines say yes.
  All five lines read "yes"; script contains no 61%, no price, no discount, different order of parts.

## What went in

```text
Reference ad: Sprout's own live ad, headline as written: "'Sprout
is too expensive': here's 61% off to prove otherwise". Public Meta
Ad Library, 15+ copies live. (No competitor ad was on
file, so this uses one of ours.)
Don't borrow: the discount or the price doubt.
Research: buyer doubt from the brand file, "A gummy can't hold
enough to replace my powder." Review: "[Sprout] has been the one
thing I've been able to stick to."
Facts: one pack is about 100% of daily value for vitamins, about
25% for minerals. 6g fiber. Survey of 3,000+ customers: 80% of
surveyed users take it daily. Offer: $29.99 first order with text
sign-up, then $49.99 every 4 weeks; 30-day money-back, first order
only. Buyer stage: solution aware. Length: 20 seconds. Speaker:
narrator.

[attached: sprout/brand.md]
```

## What came out

```text
REFERENCE
Ad: Sprout (own account), public Meta Ad Library, 15+ live copies, library ID or link not given, start date not shown | What it does: the headline quotes a customer objection word for word, then answers it at once.

IDEA BORROWED
Put the viewer's own doubt on screen in quotation marks, word for word, then answer it plainly with a concrete fact.
Rests on: buyer doubt "A gummy can't hold enough to replace my powder." (brand.md, Who buys it, buyer 1), answered with "about 100% of daily value for vitamins, about 25% for minerals" (brand.md, The products, Vitamin doses, from the science page) and "6 g prebiotic fiber" (brand.md, The products, Ingredients, from the product and science pages)
Where it acts: Part 2 (Doubt) and Part 3 (Straight answer)
Other ideas considered: Win belief with one big number up front | in the reference that number is the discount, which is on the do-not-borrow list | Admit a weakness before the viewer says it | in the reference the weakness is price, also on the do-not-borrow list

SCRIPT
Type: customer-research video ad | Length: 20 s | Speaker: narrator | Stage: solution aware (has tried greens powders)

| Time | Part | Visual | Narrator (VO) | On-screen text |
|---|---|---|---|---|
| 0–3 s | 1. Scene | A half-used tub of greens powder and a crusty shaker, pushed to the back of a sunny counter. Warm cream background (#FFF7DF). | "So the powder didn't last." | none |
| 3–7 s | 2. Doubt | Hard cut to a full-frame deep forest green card (#002C17). Big chunky display type in quotation marks. | "Now you're thinking a gummy can't carry the load." | "A gummy can't hold enough to replace my powder." |
| 7–13 s | 3. Straight answer | Close-up: a hand tears one daily pack straight across its top edge. Small deep-green bears pour from the torn top into the palm. | "Honest answer: one pack gives you about 100% of your daily value for vitamins, about 25% for minerals, and 6 grams of fiber." | "~100% DV vitamins · ~25% DV minerals · 6g fiber" (DM Mono tags) |
| 13–17 s | 4. Habit proof | An adult in casual clothes grabs a pack on the way out the door, tips the gummies into a hand and keeps walking. | "And 80% of surveyed users take it daily." | "'Sprout has been the one thing I've been able to stick to.' — Sprout reviewer" / small: "80% of surveyed users take it daily. Brand survey of 3,000+ customers." |
| 17–20 s | 5. Close | The closed green adult pouch, resealable top intact, on a soft two-colour green gradient. Gummies scattered in front. | "Sprout. Rip. Tip. Enjoy." | "30-day money-back on your first order" / kelly green (#007E40) button: "Try Sprout" |

Sources
- Powder quitting as the opening scene: brand.md, Who buys it, buyer 1 ("Has quit greens powders"), and Competitors, "The old way"
- Doubt quote: brand.md, Who buys it, buyer 1, Doubts
- About 100% DV vitamins and about 25% DV minerals: brand.md, The products, Vitamin doses (science page)
- 6g fiber: brand.md, The products, Ingredients (product and science pages)
- 80% of surveyed users take it daily: brand.md, Claims it makes, survey line (brand-reported, 3,000+ customers)
- Review quote: brand.md, Who buys it, buyer 1, Says
- "Rip. Tip. Enjoy.": brand.md, How the brand writes
- 30-day money-back, first order only: brand.md, Other offers (FAQ: "This policy applies only to your initial purchase.")
- Tear and pour shots, closed pouch: brand.md, Look, Show it right

Notes
- The script answers the doubt honestly. It shows the 25% for minerals, says "about" for the daily values, and never says the pack "replaces" a powder.
- No price or discount appears, per the do-not-borrow line.
- No health-result claims are made.

DISTANCE CHECK
Order of parts differs from the reference: yes
No run of 5 or more words from it: yes
No claim, number, price or offer term from it: yes
No person, story, shot, music or sound from it: yes
Nothing from "do not borrow": yes

MISSING
MISSING: library ID or link and start date for the reference ad
MISSING: the reference ad's visuals and first seconds (only the headline was given)
MISSING: the site and date where the "one thing I've been able to stick to" review was posted

SCORE
8/8 checks = 100 out of 100 | Missed: none
```
