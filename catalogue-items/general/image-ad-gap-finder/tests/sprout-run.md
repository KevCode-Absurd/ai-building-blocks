# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The analysis is accurate and useful: every rate, median and budget figure recomputes from the CSV, the picks are sensibly tied to P2's click-but-don't-buy pattern, and the cut-claims log is on point. The only real slip is Card A's 8-word headline, which breaks the block's length rule, and the word count the output shape asks for was never shown.

## Fix

In step 6 Words, require the headline word count to be written in brackets after the headline (as the output shape shows) and add a recount to the self-check so an 8-word non-quote headline is caught before scoring.

## Judge list

- Met: Every ad you run has one code, and headline-only codes are marked.
  "P1 ... The offer · — · Warm (headline only)"; all six image ads coded once, dress blank, videos noted as off-map.
- Met: Every signal shows the numbers behind it and had enough clicks or sales to read.
  "P2 clicks at 2.45% ... across 5,569 clicks ... converts at 0.90% ... across 50 purchases"; wear-out on 3,750 then 1,780 clicks.
- Met: The picks are different types, and each traces to a signal.
  Card A "Checked fact", Card B "Their words", both tied to the "Click rate fine, buys per click under the median" row.
- Met: Every quote is word for word, and every number has its source.
  "Proof: Science page ... 40.1% ... 20.5%"; "reviews page shows 4.74 from 118,002"; all rates recompute from the CSV.
- Not met: Each card's headline is 7 words or fewer, or 12 for a real quote.
  "Blood vitamin C up 40.1% in 12 weeks" is 8 words and not a customer quote; word count not shown.

## What went in

```text
Image ads running now (ad-results.csv, practice numbers). The
images weren't captured, only headlines:
P1 image: "'Sprout is too expensive': here's 61% off to prove
   otherwise" (two 21-day windows)
P2 image: "Don't Pay Full Price. You Literally Don't Have To.
   (61% off inside)"
S1 image: "Trusted by 1M+: Take 61% OFF"
W1 image: "Support Muscle While You Lose Weight"
R1 image: "The Daily Nutrition Every Runner Forgets"
F1 carousel: "Struggling to Get Enough Fiber?"
Full results for all 10 rows pasted below (T1, H1, K1 are videos).
Buyer doubts: all 20 reviews (pasted below).
Claims and offers: Sprout brand file (pasted below).

[attached: sprout/brand.md, sprout/ad-results.csv]
```

## What came out

```text
## 1. The grid

All six image ads are coded from headlines only, so the dress is blank for every one. Audience is inferred from the headline wording. T1, H1 and K1 are videos. They are left off the map but counted in the medians.

| Ad | Code |
|---|---|
| P1 "'Sprout is too expensive': here's 61% off…" | The offer · — · Warm (headline only) |
| P2 "Don't Pay Full Price… (61% off inside)" | The offer · — · Warm (headline only) |
| S1 "Trusted by 1M+: Take 61% OFF" | The offer · — · Ready (headline only). The call to act is the offer, so it is filed there rather than under Their words. |
| W1 "Support Muscle While You Lose Weight" | The moment · — · New (headline only) |
| R1 "The Daily Nutrition Every Runner Forgets" | The moment · — · New (headline only) |
| F1 "Struggling to Get Enough Fiber?" (carousel) | The moment · — · New (headline only) |

| Question | Type | Camera | Designed | Lo-fi | Dress blank | Total |
|---|---|---|---|---|---|---|
| What is it? | Product alone | ? | ? | ? | 0 | 0 |
| What is it? | Look inside | ? | ? | ? | 0 | 0 |
| Is it for me? | The moment | ? | ? | ? | 3 (W1, R1, F1) | 3 |
| Is it for me? | Old way, new way | ? | ? | ? | 0 | 0 |
| Is it for me? | In use | ? | ? | ? | 0 | 0 |
| Can I believe it? | Their words | ? | ? | ? | 0 | 0 |
| Can I believe it? | Checked fact | ? | ? | ? | 0 | 0 |
| Why now? | The offer | ? | ? | ? | 3 (P1, P2, S1) | 3 |
| Why now? | The occasion | ? | ? | ? | 0 | 0 |

- **Ads per question:**
  - What is it? 0
  - Is it for me? 3
  - Can I believe it? 0
  - Why now? 3
- **Empty types (7 of 9):** Product alone, Look inside, Old way new way, In use, Their words, Checked fact, The occasion.
- **Dress cells:** none of the 27 can be placed until the images are seen.

MISSING: image. No ad image was captured, so dress cannot be coded and the "every ad sits in one dress" row cannot be read.

MISSING: source. The 20 reviews were mentioned but not included. The review-doubt row is not counted. The brand file lists doubts, but without repeat counts.

MISSING: source. There are no terms or dates for the 61% off. Ads say "61%" and "up to 61%", while the site shows 49%, 52%, 55% and 58% at the same time.

## 2. Signals

**How the medians were worked out**
- Medians are across all 9 ads, videos included. P1's two windows are combined into one ad.
- Click-rate median is 1.25%. Buys-per-click median is 2.73%.
- Run dates aren't in the file (only days live, 14 to 42). The medians assume the ads overlapped.

| Ad | Click rate | Buys/click | Purchases | Readable? |
|---|---|---|---|---|
| T1 (video) | 1.65% | 4.00% | 198 | yes |
| P1 days 1–21 | 1.50% | 2.99% | 112 | yes |
| P1 days 22–42 | 0.92% | 2.19% | 39 | yes |
| P1 combined | 1.25% | 2.73% | 151 | yes |
| P2 | 2.45% | 0.90% | 50 | yes |
| H1 (video) | 1.35% | 3.38% | 44 | yes |
| K1 (video) | 1.20% | 3.10% | 63 | yes |
| F1 | 1.10% | 3.02% | 46 | yes |
| S1 | 1.25% | 2.38% | 38 | yes |
| W1 | 1.40% | 2.56% | 23 | yes |
| R1 | 0.70% | 1.86% | 10 | click rate only (buys/click below 20 purchases) |

**Rows that fired**
- **Click rate fine, buys per click under the median → "Can I believe it?"**
  - P2 clicks at 2.45%, which is 96% above the median, across 5,569 clicks.
  - It converts at 0.90%, which is 67% below the median, across 50 purchases.
  - S1 sits at the click median and 13% under on buys. That is within the chance swing, so it doesn't count.
- **Wear-out → same type and message in an unused dress.**
  - P1's click rate fell from 1.50% to 0.92%, a 39% drop on 3,750 and then 1,780 clicks.
  - The windows are 21 days each, not fortnights.
  - This is not briefed for two reasons. The offer has no dated terms on file. And the dress P1 already uses is unknown.

**Rows that did not fire**
- **Click rate under the median on most ads:** no. 3 of 6 image ads are at or under it.
- **Most ads are Why now types:** no. It is exactly half (3 of 6).
- **Warm vs New:** no audience-level results.
- **One dress:** cannot be read without the images.
- **Review doubts:** the reviews were not included.

**Budget**
- Image ads spend about $437 a day, so two weeks is about $6,120.
- Image cost per purchase is $43.40 ($13,800 ÷ 318). Reading one new ad takes 20 × $43.40 = $868.
- $6,120 ÷ $868 ≈ 7 new ads the budget could read, so the ceiling of 3 applies.
- Only one row produced a briefable pick (P2), so 2 cards follow, both answering it.

## 3. Ad cards

### Card A
- **Code:** Checked fact · Designed · Warm
- **Signal:** P2 click rate 2.45% (+96% vs median) but buys per click 0.90% (−67%), on 50 purchases. People click and then don't believe it's worth the money.
- **Picture:**
  - Deep forest green background (#002C17).
  - Huge "+40.1%" in the chunky display font, in sunflower yellow (#FFCC2E), filling the top half.
  - Bottom right: the green Low Sugar Adults pouch, standing and closed.
  - Next to the pouch, one daily pack torn straight across its top edge, with a few matte green bears spilling into a small pile on the surface.
  - Small DM Mono tag at the bottom.
- **Words:**
  - Headline: "Blood vitamin C up 40.1% in 12 weeks"
  - "Folate up 20.5%, too."
  - Tag: "12-week, double-blind, placebo-controlled study · 120 adults · 2025"
  - Footer: the standard FDA line
- **Proof:** Science page. 2025 randomized, double-blind, placebo-controlled study of 120 healthy adults aged 23 to 59. Blood vitamin C rose 40.1% (2.7x placebo) and folate rose 20.5% (2.9x placebo). The claim stays at absorption only: no energy, no immunity, no "works".
- **Read it by:** buys per click at 20 purchases. It wins at 3.41% or better (25% over the 2.73% median). Anything closer is a tie. Run it beside the current ads, not against Card B.
- **Where it breaks:** a price doubter's question is "is it worth $49.99?", not "does it absorb?". A blood number may not answer price, and a lab-number headline cuts against the brand's no-lab-coat voice.

### Card B
- **Code:** Their words · Designed · Warm
- **Signal:** the same row as Card A. P2 clicks at 2.45% (+96%) and converts at 0.90% (−67%), on 50 purchases.
- **Picture:**
  - Warm cream background (#FFF7DF).
  - A big rounded white review card in the centre, holding five yellow stars (the fifth about three-quarters filled, to match 4.74) and the rating in deep forest green Work Sans bold.
  - A hand coming in from the lower left, palm up, holding a few green bears that were poured from a pack torn across the top.
  - The Adults pouch is partly visible behind the card.
- **Words:**
  - Headline: "4.74 stars from 118,002 reviews"
  - "The one supplement people stick with." (brand voice, no quote marks)
  - Source line: "Ratings on sprout.example reviews page, Oct 2026"
- **Proof:** the reviews page shows 4.74 from 118,002, captured Sept–Oct 2026. Use this exact figure, not "4.8 from 100,000".
  - Recheck the number on launch day.
  - A word-for-word customer quote can replace the second line once the 20 reviews are supplied with their sources.
- **Read it by:** buys per click at 20 purchases. It wins at 3.41% or better. Anything closer is a tie. Run it beside the current ads, not against Card A.
- **Where it breaks:** the rating comes from the brand's own page. A skeptic who searches finds 4.0 from 2,411 on a public review site, and that gap can deepen the doubt.

## 4. Cut-claims log

| Claim | Where | Why cut | Don't bring back as |
|---|---|---|---|
| "Support Muscle While You Lose Weight" | W1 (running) | No evidence on file for muscle or weight loss. Pause W1. | "toning", "lean", "body goals", "while you diet" |
| "Trusted by 1M+" | S1 (running) | No customer count on file. The nearest figures are 3,000+ surveyed and 118,002 reviews. | "a million fans", "1M+ happy customers", any rounded-up count |
| "61% off" stated flat | P1, P2, S1 | No terms or dates on file, and the site shows 49–58% at the same time | any % off without its live terms and dates |
| "4.8 stars from 100,000 reviews" | Site-wide | Doesn't match any one source | "nearly 5 stars", "100K+ reviews" (use 4.74 / 118,002 with its source) |
| "Sprout works" / "for energy, immunity" | Science and shop pages | The study measured blood vitamin C and folate only | "proven results", "clinically proven energy" |
| "backed by 35,000+ studies" | Science page | Those studies are on the ingredients, not the product | "science-backed ingredients" counts implying product studies |
| "Each gummy delivers 100%…" | Science page | Wrong unit: it's per pack | any per-gummy dose claim |
| "Fix the Hot Girl Tummy" | T1 (video) | "Fix" implies treatment. The limit is "supports digestion". | "cure", "end bloating", "get rid of" |

## 5. Score

SCORE 100/100 (4 of 4 checks)
```
