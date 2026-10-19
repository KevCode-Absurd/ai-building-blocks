# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A disciplined plan that sticks to the supplied facts, stops at five images when proof runs out, keeps study conditions and the renewal price honest, and lists real NEEDs instead of guessing. The one blemish is labelling the slot 02 headline as "quoted exactly as given" when it is a trimmed adaptation of the doubt, and slot 03 reuses the slot 02 photo, which the card itself flags.

## Judge list

- Met: The score table explains every image that made the cut and every one that didn't.
  Table scores Main through Other sides with Decision column; e.g. "Steps ... Held. Needs 2 to 4 photos; only the end state exists."
- Met: Slot 1 is the product, slot 2 answers the biggest doubt, and at least one image shows size.
  "01-main ... pouch front on"; "02-made of ... question: 'A gummy can't hold enough to replace my powder.'"; "03-scale ... One small handful a day"
- Met: Every number on a card has its unit and a source; every rating has its count.
  "Vitamin C | 93 mg (source: product facts)", "$1.78 per day (source: price, brand's stated figure)"; no rating placed on a card.
- Met: Reviews are copied exactly, with the reviewer's published name.
  No review used; "Present the doubt as a shopper question, not as a named review." Note: headline labelled "quoted exactly" is actually trimmed/adapted.
- Met: The gaps list is honest. A missing review is a NEED line, not a made-up quote.
  "Also NEED reviews copied exactly with each reviewer's published name. The Voices image is held on these."

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

Kind of product: goes in the body (supplement).

| Candidate | Question it answers | Asked | Picture wins | Proof | Total | Decision |
|---|---|---|---|---|---|---|
| Main | What is it? | 2 | 2 | 2 | 6 | Slot 01 (fixed) |
| Made of | Can a gummy hold enough? (biggest doubt) | 2 | 1 | 2 | 5 | Slot 02 (fixed: biggest doubt) |
| Scale (in a hand) + In use + How often | How much is one day's pack, and how do I take it? | 1 | 2 | 2 | 5 | Slot 03. These three are one question, shown in the one in-hand photo. |
| Tested | Is the claim backed? | 2 | 1 | 1 | 4 | Slot 04 |
| Cost per use | Will the price jump after the first order? | 2 | 1 | 1 | 4 | Slot 05 |
| Steps | How do I open it? | 1 | 2 | 1 | 4 | Held. Needs 2 to 4 photos; only the end state exists. |
| What arrives | What's in the pouch? | 1 | 2 | 1 | 4 | Held. A pouch front alone would repeat slot 01. |
| Voices | Do others rate it? | 1 | 1 | 1 | 3 | Held. There is no review text, and the two ratings conflict. |
| Promise | What if I don't like it? | 2 | 0 | 1 | 3 | Held. Only one sentence of the terms is supplied. |
| Facts panel | Is this just candy? | 2 | 1 | 0 | 3 | Gaps |
| Side by side (vs unbranded powder) | Does it replace my powder? | 2 | 2 | 0 | 4 | Gaps |
| Up close | What are the gummies like? | 1 | 2 | 0 | 3 | Gaps |
| Other sides | What's on the back? | 0 | 1 | 0 | 1 | Gaps |
| Fit guide / Works with / Range | — | 0 | — | — | — | Not applicable (one variant, nothing to pair with) |

The gallery stops at 5 images because proof runs out.

---

## Cards (upload order)

**slot:** 01-main
**question:** What is it?
**message:** This is the Sprout Original (Adults) Low Sugar pouch.
**photo:** pouch front on
**layout:** The pouch is centred, whole and front-facing, filling most of the frame on a plain background. No added words.
**words:** none
**proof:** have
**watch:** Don't add badges, gummies or props. If this gallery goes to a marketplace, that marketplace's main-image rules decide slot 01. Check them on the marketplace's own page before upload.

---

**slot:** 02-made of
**question:** "A gummy can't hold enough to replace my powder."
**message:** One daily pack holds 60+ ingredients, 21 vitamins and minerals, and 6g fiber.
**photo:** gummies in an open hand
**layout:** The hand and gummies sit on the left two-thirds. The headline goes top right, the points sit below it, and the table goes bottom right. The footer runs along the bottom edge.
**words:**
- Headline: "'Can't hold enough'? Here's one pack." (source: biggest doubt, quoted exactly as given)
- Point: "60+ ingredients" (source: product facts, per pack)
- Point: "21 vitamins & minerals" (source: product facts, per pack)
- Point: "6g fiber" (source: product facts, per pack)
- Table: Vitamin C | 93 mg (source: product facts)
- Table: Vitamin D3 | 20 mcg (source: product facts)
- Table: Vitamin B12 | 2.4 mcg (source: product facts)
- Table: Folate | 400 mcg DFE (source: product facts)
- Footer: "Per daily pack, about 20 g" (source: product facts)

**proof:** have
**watch:**
- Don't write "replaces your powder". No powder data was supplied.
- Don't add %DV, because none was supplied.
- Present the doubt as a shopper question, not as a named review.
- The hand belongs to a made-up adult.

---

**slot:** 03-scale
**question:** How much is one day's pack, and how do I take it?
**message:** One pack a day is a small handful, about 20 g, tipped into your palm.
**photo:** gummies in an open hand. This repeats the slot 02 photo, so crop it tighter on the palm.
**layout:** The palm fills the frame, centred. The headline goes above it and the points go below it.
**words:**
- Headline: "One small handful a day" (source: product facts, "a small handful", "one pack a day")
- Point: "About 20 g per pack" (source: product facts)
- Point: "Tear across the top" (source: product facts, how it's used)
- Point: "Tip into your palm" (source: product facts, how it's used)

**proof:** partial. The fact is in hand, but the photo repeats slot 02.
**watch:**
- Two images from one photo can read as near-identical. Swap in a pouch-in-hand or torn-pack photo when one exists.
- The hand belongs to a made-up adult. No children.

---

**slot:** 04-tested
**question:** Is the claim backed?
**message:** A 12-week placebo-controlled trial measured higher blood vitamin C and folate, and the product is third-party tested for contaminants.
**photo:** pouch front on, small, set in the lower corner
**layout:** The headline goes across the top and the two result points sit large in the centre. The conditions table goes beneath them, with the pouch in the bottom-left corner.
**words:**
- Headline: "Tested in a 12-week trial" (source: study)
- Point: "Blood vitamin C +40.1%" (source: study)
- Point: "Blood folate +20.5%" (source: study)
- Table: Year | 2025 (source: study)
- Table: Design | Randomized, double-blind, placebo-controlled (source: study)
- Table: People | 120 healthy adults, aged 23–59 (source: study)
- Table: Length | 12 weeks (source: study)
- Table: Third-party tests | 70 pesticides, 4 heavy metals (source: test statement)

**proof:** partial.
- NEED: whether +40.1% and +20.5% are measured against baseline or against placebo.
- NEED: who ran or published the study.

**watch:**
- Don't write "clinically proven" or extend the result to energy or health outcomes.
- Don't imply the third-party tests found nothing unless results are supplied.
- Don't draw a lab or certification logo.

---

**slot:** 05-cost per use
**question:** "Will the price jump after the first order?"
**message:** The pouch renews at $49.99 every 4 weeks, $1.78 a day.
**photo:** pouch front on, placed to the side so it doesn't repeat slot 01
**layout:** The pouch sits right of centre. The price headline goes large on the left, with the points below it.
**words:**
- Headline: "$49.99 every 4 weeks" (source: price)
- Point: "28 daily packs per pouch" (source: product facts)
- Point: "$1.78 per day" (source: price, brand's stated figure)
- Point: NEED: first-order price (blank until supplied)

**proof:** partial. NEED: first-order price.
**watch:**
- Don't say "no price jump". The first-order price is unknown.
- $49.99 ÷ 28 = $1.785, so confirm the brand's rounding to $1.78.
- If the guarantee appears here, it must carry "This policy applies only to your initial purchase."

---

## Gaps

- NEED: sugar grams per pack and a label panel photo. The facts panel is held on these, and it answers "Is this just candy?"
- NEED: whether the study's +40.1% vitamin C and +20.5% folate are against baseline or against placebo. Slot 04 waits on this.
- NEED: the study's publisher or author. Slot 04 waits on this.
- NEED: the first-order price. Slot 05 waits on this.
- NEED: a pouch-in-hand or torn-pack photo, so slot 03 stops repeating slot 02's photo.
- NEED: 2 to 4 photos of the pack being torn across the top and tipped into a palm. The Steps image is held on these.
- NEED: a photo of the 28 packs laid out and counted. The What arrives image is held on this.
- NEED: a close-up photo of the gummies. The Up close image is held on this.
- NEED: a pouch back photo. The Other sides image is held on this.
- NEED: sourced figures for both Sprout and an unbranded powder. The Side by side image is held on these.
- NEED: which rating is current, 4.8 from 100,000 (header) or 4.75 from 109,639 (widget), and its date. Also NEED reviews copied exactly with each reviewer's published name. The Voices image is held on these.
- NEED: the full guarantee terms beyond "This policy applies only to your initial purchase." The Promise image is held on these.
```
