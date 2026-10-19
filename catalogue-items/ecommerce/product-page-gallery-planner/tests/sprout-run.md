# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 4 of 5 met. Invented facts: 2.

This is a careful, honest plan that avoids made-up reviews and puts missing facts in a clear gaps list. It slips on the output shape, has a score table that is not in the requested format, and is overscored at 100/100.

## Fix

In step 8 and the output shape, require the SCORES lines in `<type> a+p+pr = total -> slot|gap|cut` format with a Missed line per failed check, and make Step 8 count a check as failed if any card carries a NEED on a figure's source.

## Judge list

- Met: The score table explains every image that made the cut and every one that didn't.
  Table lists 18 candidates with slot, Held, Gaps or Does not apply, and reasons; tie-break is stated.
- Met: Slot 1 is the product, slot 2 answers the biggest doubt, and at least one image shows size.
  01-main pouch; 02-made-of answers 'Can a gummy hold enough to replace my powder?'; 03-scale hand shot.
- Not met: Every number on a card has its unit and a source; every rating has its count.
  Card 01 says 'filling about 85% of the frame' with no source; it is a layout instruction, not a fact, but it is unsourced.
- Met: Reviews are copied exactly, with the reviewer's published name.
  No reviews used; Voices went to gaps with 'NEED: reviews copied exactly'. The 02 headline is flagged as a framed doubt.
- Met: The gaps list is honest. A missing review is a NEED line, not a made-up quote.
  'NEED: reviews copied exactly, with each reviewer's published name. Waiting: voices.'

## Invented

- number: filling about 85% of the frame (Layout figure, not a product fact, but it is not in the marketplace rules or inputs.)
- number: $1.785 (Arithmetic: 49.99/28, worked out from the inputs.)

## Safety

- Card 04 puts '+40.1%' and '+20.5%' under 'Blood levels after 12 weeks' without stating they are vs placebo; it flags the basis as a NEED but still treats the table as usable.
- Card 05 headline 'What each renewal costs' answers the price-jump doubt, but the first-order price is missing, so a buyer could be misled until it is supplied (flagged as a NEED).

## What went in

```text
Product: Sprout Original (Adults), Low Sugar, pouch of 28 daily
packs. One pack a day, about 20 g, "a small handful" of gummies.
Tear the pack across the top, tip the gummies into your palm.
Facts: "60+ ingredients, 21 vitamins & minerals, and 6g fiber" per
pack; vitamin C 93 mg, D3 20 mcg, B12 2.4 mcg, folate 400 mcg DFE.
Study: 2025, 12 weeks, randomized, double-blind, placebo-controlled,
120 healthy adults aged 23 to 59. Blood vitamin C +40.1%, folate
+20.5%. Third-party tested for 70 pesticides and 4 heavy metals.
Price: renews at $49.99 every 4 weeks ($1.78/day).
Guarantee: 30-day money-back, "This policy applies only to your
initial purchase."
Ratings: 4.8 from 100,000 (header); 4.75 from 109,639 (widget).
Photos: pouch front on; gummies in an open hand.
Doubts: "A gummy can't hold enough to replace my powder." (most
common) / "Will the price jump after the first order?" / "Is this
just candy?"
```

## What came out

```text
## Score table

Kind of product: goes in or on the body (supplement). Marketplace: not stated, so this is planned as an own-site gallery.

| Candidate | Asked | Picture wins | Proof | Total | Decision |
|---|---|---|---|---|---|
| Main (pouch alone) | 2 | 2 | 2 | 6 | **01** |
| Scale (in a hand) | 2 | 2 | 2 | 6 | **03** |
| Made of (amounts) | 2 | 1 | 1 | 4 | **02** (answers the biggest doubt) |
| Tested (2025 study) | 2 | 1 | 1 | 4 | **04** |
| Cost per use | 2 | 1 | 1 | 4 | **05** |
| How often | 1 | 1 | 2 | 4 | Held. Its only photo is the hand shot, which is already used in 03 and 05. |
| In use (tipping into palm) | 1 | 2 | 1 | 4 | Held. No photo of the moment. |
| Steps (tear, tip) | 1 | 2 | 1 | 4 | Held. No photo of either step. |
| What arrives (28 packs) | 1 | 2 | 1 | 4 | Held. No photo of the packs laid out. |
| Up close (gummy texture) | 2 | 2 | 0 | 4 | Gaps |
| Side by side (vs unbranded powder) | 2 | 2 | 0 | 4 | Gaps |
| Facts panel | 1 | 1 | 1 | 3 | Held. No label photo and no sugar figure. |
| Tested (70 pesticides, 4 heavy metals) | 1 | 1 | 1 | 3 | Held. No lab, date or results. |
| Promise (30-day money-back) | 1 | 0 | 1 | 2 | Held. A sentence does this better, and the full terms are missing. |
| Voices | 1 | 1 | 0 | 2 | Gaps |
| Other sides (pouch back) | 1 | 1 | 0 | 2 | Gaps |
| Range | 0 | 1 | 0 | 1 | Gaps. Only one variant is supplied. |
| Fit guide / Works with | 0 | 0 | 0 | 0 | Does not apply |

Tie-break among the 4s: a higher "Asked" score wins first, then having a real photo to build from.

## Cards (upload order)

**slot:** 01-main
- **question:** What is it?
- **message:** Sprout Original (Adults), Low Sugar, 28-pack pouch.
- **photo:** Pouch front on.
- **layout:** Pouch centred and whole, filling about 85% of the frame, on a plain light background. No added words.
- **words:** None added. Only what is printed on the pack.
- **proof:** have
- **watch:** Do not add badges, stickers or a "Low Sugar" callout beyond the printed pack. Do not crop the pouch edges.

**slot:** 02-made-of
- **question:** Can a gummy hold enough to replace my powder?
- **message:** One daily pack holds 60+ ingredients, with stated amounts.
- **photo:** Pouch front on, used small. The label panel photo is needed to verify the amounts.
- **layout:** Pouch small on the left third. Headline at the top. Points and table on the right two-thirds.
- **words:**
  - Headline: "A gummy can't hold enough?" (source: most common customer doubt, shortened)
  - Point: "60+ ingredients per pack" (source: facts, "60+ ingredients… per pack")
  - Point: "21 vitamins & minerals" (source: facts)
  - Point: "6g fiber per pack" (source: facts)
  - Table rows (source: facts):
    - Vitamin C | 93 mg
    - Vitamin D3 | 20 mcg
    - Vitamin B12 | 2.4 mcg
    - Folate | 400 mcg DFE
- **proof:** partial. NEED: label panel photo to confirm the printed amounts.
- **watch:**
  - Do not say it "replaces" powder, because nothing supports that.
  - Do not add %DV figures, which were not supplied.
  - The headline is a framed question. Do not style it as a review quote with a name.

**slot:** 03-scale
- **question:** How big is a day's dose?
- **message:** One pack is a small handful, about 20 g.
- **photo:** Gummies in an open hand.
- **layout:** Hand photo full frame. Headline across the top. Two points at the bottom left, clear of the gummies.
- **words:**
  - Headline: "One day's pack, in one hand" (source: facts, one pack a day)
  - Point: "About 20 g per pack" (source: facts)
  - Point: "\"A small handful\" of gummies" (source: facts)
- **proof:** have
- **watch:**
  - Do not state a gummy count, which was not supplied.
  - Do not enlarge or retouch the gummies.
  - Confirm the hand is an adult's and not an identifiable named person.

**slot:** 04-tested
- **question:** Does it actually raise my nutrient levels?
- **message:** In a 12-week controlled study, blood vitamin C and folate went up.
- **photo:** Pouch front on, used small.
- **layout:** Pouch small at the top right. Headline at the top left. Table across the lower two-thirds.
- **words:**
  - Headline: "Blood levels after 12 weeks" (source: study facts)
  - Table rows (source: study facts supplied):
    - Vitamin C in blood | +40.1%
    - Folate in blood | +20.5%
    - Study | 2025, 12 weeks, randomized, double-blind, placebo-controlled
    - People | 120 healthy adults, aged 23 to 59
- **proof:** partial. NEED: study citation, and whether the % changes are against placebo or against baseline.
- **watch:**
  - Keep all conditions on the image.
  - Do not extend the results to the other vitamins.
  - Do not use "proven" or "clinically proven".
  - Label the comparison basis once it is known.

**slot:** 05-cost-per-use
- **question:** Will the price jump after the first order?
- **message:** Renewals are $49.99 every 4 weeks, which is $1.78 a day.
- **photo:** Gummies in an open hand, cropped differently from 03.
- **layout:** Hand on the right third. Headline and price block on the left two-thirds.
- **words:**
  - Headline: "What each renewal costs" (source: price facts)
  - Point: "$49.99 every 4 weeks" (source: price facts)
  - Point: "28 packs: $1.78 a day" (source: price facts, "$1.78/day")
- **proof:** partial. NEED: the first-order price.
- **watch:**
  - $49.99 ÷ 28 = $1.785. The brand states $1.78, so confirm it before use.
  - Do not imply "no price jump" until the first-order price is known. If the first order is cheaper, say so plainly on the image.

## Gaps

- NEED: first-order price, and how it compares with the $49.99 renewal. Waiting: 05-cost-per-use.
- NEED: study citation (who ran it, where it was published) and the comparison basis for +40.1% and +20.5%. Waiting: 04-tested.
- NEED: supplement facts label panel photo. Waiting: 02-made-of (to verify) and facts panel.
- NEED: sugar grams per pack, to back "Low Sugar" and answer "Is this just candy?". Waiting: facts panel and up close.
- NEED: real close-up photo of the gummies. Waiting: up close.
- NEED: photos of tearing the pack and tipping the gummies into the palm. Waiting: steps and in use.
- NEED: photo of the 28 packs laid out and counted. Waiting: what arrives.
- NEED: photo of the pouch back. Waiting: other sides.
- NEED: lab name, test date, batch, and results against limits for the 70 pesticides and 4 heavy metals. Waiting: tested (clean).
- NEED: reviews copied exactly, with each reviewer's published name. Waiting: voices.
- NEED: which rating is current, 4.8 from 100,000 (header) or 4.75 from 109,639 (widget). Waiting: voices.
- NEED: full guarantee terms beyond "This policy applies only to your initial purchase." Waiting: promise.
- NEED: sourced facts for an unbranded powder alternative. Waiting: side by side.
- NEED: confirmation that the hand in the photo is an adult's and not an identifiable named person. Waiting: 03-scale and 05-cost-per-use.
- NEED: whether this gallery is going on a marketplace, and which one. If so, check its main-image rules on its own page and move this 01 to 02. Waiting: 01-main.

SCORE 100/100 (6 of 6 checks)
```
