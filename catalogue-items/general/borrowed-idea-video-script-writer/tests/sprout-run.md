# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The script itself is solid: one clean idea, every number traced to the brand file, the per-pack unit kept right, the survey labelled correctly and the guarantee's first-order limit stated. But the SCRIPT section drops the belief shift, opening variants, test plan and placeholders the shape calls for, so the owner gets one draft with no way to test it or vary the hook.

## Fix

In 'What you hand back', list the SCRIPT block's required lines explicitly (Belief shift, Assumed, beat table, Opening variants, Selling beat, Test plan, Placeholders) instead of pointing to the other skill's format, and add to 'Check before you hand it back': 'SCRIPT includes a belief shift, at least two opening variants and a test plan.'

## Judge list

- Met: REFERENCE names a real ad with an ID, a link or its own words.
  "Sprout (own account), Meta Ad Library ... seen live 30 Sept 2026 with 15+ copies" matches ads.md #1; words paraphrased, not quoted.
- Met: The idea line would make sense for a product in another category.
  "Open by speaking the buyer's own objection word for word, then answer it straight away with plain facts."
- Met: The idea shapes one or two named parts, not the whole script.
  "Where it acts: Hook, Proof"; Habit and Close beats come from the brand's method.
- Met: Every number and quote has a source from your own facts.
  "~100% DV VITAMINS / ~25% DV MINERALS / 6G FIBER" (brand.md); "80% of surveyed users ... 3,000+ customers" (brand.md); review is reviews.md #1.
- Met: All five distance lines say yes.
  All five read "yes"; no 61%, no price, no "too expensive" wording appears in the script.

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
Ad: Sprout (own account), Meta Ad Library, library ID not shown, seen live 30 Sept 2026 with 15+ copies, start date not shown | What it does: its first line puts a buyer's objection in quote marks, in the buyer's voice, and the rest of the ad answers it.

IDEA BORROWED
Open by speaking the buyer's own objection word for word, then answer it straight away with plain facts.
Rests on: buyer doubt "A gummy can't hold enough to replace my powder." (brand.md, Who buys it #1). The answer uses: about 100% of daily value for vitamins and about 25% for minerals per pack, and 6 g prebiotic fiber (brand.md, Science page and Product page).
Where it acts: Hook, Proof
Other ideas considered: Answer the objection with a deal | barred by "do not borrow" (the discount and price doubt). Lead with one big number to stop the scroll | in this account it pulls toward offer-led ads, and it does not address the "not enough" doubt.

SCRIPT
Type: problem/objection, solution aware | Length: 20 s | Speaker: narrator (off camera) | Buyer: the quitter who wants to stick (brand.md, ~40%)

| Time | Part | Narrator (VO) | On screen (text) | Visual | Source |
|---|---|---|---|---|---|
| 0–3 s | Hook | "'A gummy can't hold enough to replace my powder.'" | "A gummy can't hold enough to replace my powder." in the chunky display font, in quote marks | Warm cream #FFF7DF background. A half-used tub of greens powder and a shaker sit on a counter. Green dust is on the counter. | Buyer doubt, brand.md Who buys it #1 |
| 3–10 s | Proof | "Fair doubt. One pack: about 100% daily value for vitamins, about a quarter for minerals, plus 6 grams of fiber." | Three stacked tags in DM Mono: "~100% DV VITAMINS" / "~25% DV MINERALS" / "6G FIBER" | A hand tears one daily pack straight across its top edge. Deep-green bears pour into the palm. The tub slides out of frame. | Science page (vitamin and mineral doses), Product page (6 g fiber) |
| 10–15 s | Habit | "No shaker. No chalk. 80% of surveyed users take it daily." | "'Sprout has been the one thing I've been able to stick to.' — Sprout reviewer" / small line: "80% of surveyed users take it daily. Brand survey, 3,000+ customers." | An adult in casual clothes at home eats from the palm on the way out the door. The green 28-pack pouch is closed on the counter, resealable top up. | Review quote, brand.md Who buys it #1. Survey: brand.md Claims (fine to repeat, brand-reported) |
| 15–20 s | Close | "Rip. Tip. Enjoy. 30-day money-back on your first order." | "30-DAY MONEY-BACK · FIRST ORDER ONLY" with a kelly green #007E40 button "Try Sprout" | The adult pouch sits on a soft two-colour gradient with gummies scattered in front. | Brand line, brand.md How the brand writes. Guarantee: Product page FAQ |

VO word count: 48 (about 20 s at a relaxed narrator pace).
Claims kept to: nutrient amounts per pack (not per gummy) and the survey, labelled "of surveyed users". There is no "replaces your powder" promise, no health outcome, and no cancel promise.

DISTANCE CHECK
Order of parts differs from the reference: yes
No run of 5 or more words from it: yes
No claim, number, price or offer term from it: yes
No person, story, shot, music or sound from it: yes
Nothing from "do not borrow": yes

MISSING
MISSING: the reference ad's library ID or link, and its start date (only the headline and a 30 Sept sighting were given)
MISSING: what the reference ad shows in its first seconds (visuals and format were not captured, so the read rests on the headline alone)
MISSING: the source, name and date of the review "Sprout has been the one thing I've been able to stick to." (brand.md gives it as a typical buyer line, not a cited review)
MISSING: the survey's method and date behind "80% of surveyed users take it daily" (brand-reported, unverified)
```
