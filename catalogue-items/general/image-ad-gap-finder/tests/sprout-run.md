# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, fully traceable plan: every rate, median and budget figure recomputes correctly from the CSV, the three picks are distinct types tied to real signals, and all claims and picture details come from the brand file. It correctly refused to see images or reviews it wasn't sent and kept risky claims (weight loss, 1M+, 61% off, per-gummy dosing) out of the new cards.

## Judge list

- Met: Every ad you run has one code, and headline-only codes are marked.
  "P1  The offer · · Warm (headline only)" through "F1  The moment · · New (headline only, carousel)"; all six coded, dress blank.
- Met: Every signal shows the numbers behind it and had enough clicks or sales to read.
  "P2 2.45% ... buys per click is 0.90% ... on 50 purchases"; R1 excluded: "only 10 purchases, under the read point of 20."
- Met: The picks are different types, and each traces to a signal.
  Checked fact (Row 2), Old way new way (Row 1), Look inside (Row 1); three distinct types, each cites a row with numbers.
- Met: Every quote is word for word, and every number has its source.
  "Rip. Tip. Enjoy.", "sloshing chalky powders" match brand file; study numbers cite "Science page"; medians derived from the CSV.
- Met: Each card's headline is 7 words or fewer, or 12 for a real quote.
  "Blood vitamin C up 40.1%" (5), "No shaker. No chalk. Just gummies." (6), "What's inside one daily pack" (5); counts verified.

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
GRID (6 image ads)
What is it?        Product alone      0                                      not captured
What is it?        Look inside        0                                      not captured
Is it for me?      The moment         3  F1, W1, R1                          not captured
Is it for me?      Old way, new way   0                                      not captured
Is it for me?      In use             0                                      not captured
Can I believe it?  Their words        0                                      not captured
Can I believe it?  Checked fact       0                                      not captured
Why now?           The offer          3  P1, P2, S1                          not captured
Why now?           The occasion       0                                      not captured
Per question: What is it? 0 · Is it for me? 3 · Can I believe it? 0 · Why now? 3
Codes (all headline only, so dress is blank; audience is read from the headline because targeting wasn't captured):
- P1  The offer · · Warm (headline only)
- P2  The offer · · Warm (headline only)
- S1  The offer · · New (headline only)
- W1  The moment · · New (headline only)
- R1  The moment · · New (headline only)
- F1  The moment · · New (headline only, carousel)
T1, H1 and K1 are videos. They are not on the grid, but they count in the medians.
Empty types: Product alone, Look inside, Old way new way, In use, Their words, Checked fact, The occasion
MISSING: image (all 6 ads, so every dress cell is "not captured")

SIGNALS  (median 1.30% click rate, 2.77% buys per click; all 10 rows. MISSING: ad dates, so the rows may not cover the same dates)
1 Click rate is under 1.30% on 4 of 6 image ads: P1 1.25% (both windows together), S1 1.25%, F1 1.10%, R1 0.70%. All are past 100 clicks. No ad runs under "What is it?" and only one "Is it for me?" type is used.  -> What is it? / Is it for me?
2 P2 has the best click rate at 2.45%, which is 1.9x the median. Its buys per click is 0.90%, about a third of 2.77%, on 50 purchases. W1 shows the same pattern: 1.40% click rate, 2.56% buys per click, 23 purchases.  -> Can I believe it?
3 P1's click rate fell from 1.50% to 0.92% (-38.7%) between days 1-21 and days 22-42. Clicks were 3,750 and 1,780. Buys per click fell from 2.99% to 2.19% (112 and 39 purchases). These windows are 21 days, not a fortnight.  -> The look has worn out.
   Not picked. The fix is the same offer in an unused dress, but the current dress is MISSING: image, and there is no offer with dates on file.
Not read:
- One dress: MISSING: image.
- Review doubts: MISSING: source. The 20 reviews weren't attached.
- Warm vs New: targeting wasn't captured.
- Why now share: 3 of 6 is half, not most.
- R1 buys per click: only 10 purchases, under the read point of 20.

BUDGET
$6,120 / (20 x $43.40) = 7.0 tests -> capped at 3
- $6,120 is the daily pace of the 6 image ads ($437) x 14 days.
- $43.40 is $13,800 image spend / 318 purchases.

CARD 1
Code        Checked fact · Designed · Warm
Signal      Row 2: P2 2.45% click rate vs 1.30% median, 0.90% buys per click vs 2.77% (50 purchases). W1 2.56% buys per click (23 purchases).
Picture     Deep forest green (#002C17) background. A huge sunflower-yellow "+40.1%" fills the top half. A closed adult Low Sugar pouch sits small, bottom right, with a few matte green bears scattered in front. Small DM Mono tag: "2025 STUDY".
Words       "Blood vitamin C up 40.1%" (5) + "Folate up 20.5%" + "12-week double-blind study, 120 adults" + "Clinically tested for nutrient absorption"
Proof       Science page: 2025, 12 weeks, randomized, double-blind, placebo-controlled, 120 healthy adults aged 23-59. Blood vitamin C +40.1% (2.7x placebo), folate +20.5% (2.9x placebo).
Read it by  Buys per click at 20 purchases. Win line is 3.46% (25% over the 2.77% median). Anything between 2.77% and 3.46% is a tie.
Breaks if   P2's clickers weren't doubting that it works but doubting the price jump after the first order. Then proof of absorption won't move buys per click.

CARD 2
Code        Old way, new way · Camera · New
Signal      Row 1: click rate under the 1.30% median on 4 of 6 image ads (0.70% to 1.25%). No Old way, new way ad is running.
Picture     Split frame on a cream (#FFF7DF) kitchen counter, bright light.
            - Left: an unbranded half-used tub of green powder, a shaker with clumps on the rim, a dusty spoon, three unlabelled pill bottles.
            - Right: one adult daily pack torn straight across its top edge, a small handful of green bears poured into an open palm, the closed adult pouch behind.
Words       "No shaker. No chalk. Just gummies." (6) + "1 pack a day. No water, no mixing." + "60+ ingredients, 21 vitamins & minerals, 6g fiber" + "Rip. Tip. Enjoy."
Proof       Brand file: no water, no mixing, no shaker. Label: 60+ ingredients, 21 vitamins & minerals, 6g prebiotic fiber per pack. The usual way is drawn from the brand's own line "sloshing chalky powders", unbranded.
Read it by  Click rate at 100 link clicks. Win line is 1.63% (25% over the 1.30% median). Anything between 1.30% and 1.63% is a tie.
Breaks if   Strangers who never used powder don't see themselves on the left. Or the doubt "a gummy can't hold enough to replace my powder" stops the click.

CARD 3
Code        Look inside · Designed · New
Signal      Row 1: click rate under the 1.30% median on 4 of 6 image ads. No "What is it?" ad is running at all.
Picture     Warm cream background. One adult daily pack torn straight across its top edge, with a small handful of matte deep-green bears poured out in front. Thin forest-green callout lines run from the gummies to 3 labels in Work Sans bold. The closed adult pouch sits small in one corner.
Words       "What's inside one daily pack" (5) + "21 vitamins & minerals" + "6g prebiotic fiber" + "Methylfolate, not folic acid"
Proof       Product page and science page: 21 vitamins and minerals, 6g prebiotic fiber blend, folate 400 mcg DFE as methylfolate. All per pack, not per gummy.
Read it by  Click rate at 100 link clicks. Win line is 1.63% (25% over the 1.30% median). Anything between 1.30% and 1.63% is a tie.
Breaks if   It reads like a supplement facts panel and doesn't stop the scroll. Or viewers take the labels as per gummy.

CUT CLAIMS
W1     "Support Muscle While You Lose Weight": no evidence on file for muscle or weight loss. Pause W1 and don't reword it as "body goals".
S1     "Trusted by 1M+": no customer count on file. The nearest figures are 109,639 to 118,002 reviews (brand widgets) and a survey of 3,000+.
P1, P2, S1  "61% off": appears only in ads. Site plan boxes show 49% to 58%, and no terms or dates are on file. Kept out of new cards until terms and dates are found.
Card 1 "The results are in. Sprout works." and "for energy, immunity": the study measured blood vitamin C and folate only.
Card 3 "Each gummy delivers 100% of your daily needs": wrong unit. It is per pack.

SCORE  100/100 (4 of 4 checks)
Missed: none
MISSING:
- image: all 6 ads, so dress is uncoded and signal 3 can't be acted on.
- source: the 20 reviews weren't attached.
- Ad dates.
- Ad targeting.
- Offer terms and dates for "61% off".
```
