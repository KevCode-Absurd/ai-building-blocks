# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest first pass: the audit, doubt groups and 10-slot plan all trace back to Sprout's files, the confusing discount percentages and inflated star rating are refused, and the price and guarantee are stated plainly. It correctly stopped at Stop 1 with a clear list of missing photos and facts instead of guessing.

## Judge list

- Met: The audit of your current gallery came before the plan.
  Section '1. Gallery audit' with per-image verdicts and 'Question families no image answers' precedes '3. Plan'.
- Met: The biggest stopper is answered in slot 2, with quotes in customers' own words.
  Group A 'Stopper, so it takes slot 2' with three verbatim quotes incl. 'I hate subscriptions because I feel like they are a trap...' (brand site).
- Met: Every word on every image is in the plan with a source.
  Each slot lists 'Words and sources'; e.g. 'Then $49.99 every 4 weeks, about $1.78 a day' (price table); new headline is labelled as new.
- Met: You saw two finished images before the rest were made.
  No images made yet; run halted at Stop 1: 'The rest won't be made until you've signed those off.'
- Met: Files are numbered in upload order, and nothing was handed over while a note was open.
  Nothing handed over; open NEED items listed and the run stops: 'please approve or edit... and fill in the NEED items'.

## What went in

```text
Product: Sprout Original (Adults), Low Sugar, 28 daily packs.
Brand facts: [sprout/brand.md]
Photos: pouch front on; gummies in an open hand.

Current gallery, in order (files attached):
1 pouch alone on a soft two-colour gradient
2 pouch with gummies scattered in front, same gradient
3 an adult pouring gummies into a hand

Customer words:
- "I hate subscriptions because I feel like they are a trap so I
  canceled it before the gummies even arrived." (brand site)
- "I have tried multiple times to cancel my subscription." (review
  site)
- "They are expensive" (retailer)
- "I thought the first pack I tried tasted terrible, but after the
  third day they started tasting better" (retailer)
- "The sugar free [Sprout] worked too well." (review site)
Pre-sale questions from the brand file: "Will the price jump after
the first order?" / "A gummy can't hold enough to replace my
powder." / "Will this upset my stomach more?"

[attached: sprout/brand.md]
```

## What came out

```text
## 1. Gallery audit

**NEED: photo files for the current gallery.** Only `sprout/brand.md` came through. The three images are not attached. This audit works from your descriptions and is provisional until I can match each file to the live gallery on a phone.

**Facts locked for this variant** (brand.md, Look and Products):
- Glossy deep-green stand-up foil pouch, yellow wordmark, yellow bear face top right, "28 Daily Packs" at the bottom.
- Low Sugar has **no white burst**. Sugar-Free has one.
- Gummies are small, opaque, matte deep-green bears, about thumbnail height.
- 1 pack is about 20 g, "a small handful."

| # | What it shows | Job | Question it answers | Verdict |
|---|---|---|---|---|
| 1 | Pouch alone on a soft two-colour gradient | Main image | What is it? | **Fix.** Merge with #2 into one hero (pouch plus gummies in front, the brand's own look). Confirm it is the Low Sugar pouch with no white burst. |
| 2 | Pouch with gummies scattered in front, same gradient | Main image again | What is it? | **Drop as a separate slot.** It does the same job as #1. Its best part moves into the new slot 1. |
| 3 | Adult pouring gummies into a hand | In use | How do I take it? | **Keep, if checked.** The gummies must come from a daily pack torn straight across the top. A torn big pouch, or a side, bottom or corner tear, means fix. NEED: the file, and confirmation that this is a real brand photo of a real person. |

**Finding:** two of the three images do the same job. The gallery only answers "what is it" and "how do I take it."

**Question families no image answers:**
- What it costs, including after the first order (Cost per use)
- What's in one pack, and is it enough (Made of)
- Is it tested (Tested)
- How often, and what arrives (How often, What arrives)
- How big a pack and a serving really are (Scale)
- Low Sugar vs Sugar-Free (Range)
- What the gummies look like close up (Up close)
- What the label says (label panel)
- What other people say (Voices)
- What the guarantee covers (Promise)

## 2. Doubt groups

Counting rule: pre-sale questions count ×2. The subscription "trap" quote also counts ×2, because the buyer cancelled before delivery, which undid the sale.

| Group | Fear | Count | Type | Quotes (word for word, source) | Route |
|---|---|---|---|---|---|
| **A. Price, renewal and cancelling** | I'll overpay or get stuck | **6** (trap ×2, cancel 1, expensive 1, price jump ×2) | **Stopper, so it takes slot 2** | "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." (brand site) / "I have tried multiple times to cancel my subscription." (review site) / "Will the price jump after the first order?" (pre-sale, brand file) | Cost per use, Promise, What arrives |
| **B. Stomach** | It won't suit me | 3 (pre-sale ×2, review 1) | Stopper | "Will this upset my stomach more?" (pre-sale, brand file) / "The sugar free [Sprout] worked too well." (review site) | Range (Low Sugar vs Sugar-Free), Made of |
| **C. Enough inside** | It won't work | 2 (pre-sale ×2) | Stopper | "A gummy can't hold enough to replace my powder." (pre-sale, brand file) | Made of, Tested, label panel |
| **D. Taste** | It won't suit me | 1 | Grumble | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (retailer) | Up close (states the flavour, promises nothing about taste) |

- Groups B, C and D have fewer than three quotes. That is all the customer words hold. **NEED: review**, either more pre-sale questions or return reasons, so the counts can be checked.
- Hassle and "won't look like the photos": 0 mentions in what you supplied. Hassle still gets a slot (slot 4), because "easy" is the product's whole reason to exist.

## 3. Plan

Shapes: square for every image, plus 4:5 if the theme uses it (**NEED: confirm**). Each shape will be composed on its own.

This is the brand's own site, not a marketplace, so slot 1 can be styled. It stays text-free.

### Slot 1: Main image (What is it?)
- **Shows:** Low Sugar pouch, front on, on a cream-to-green gradient, with a few green bears scattered in front.
- **Words:** none beyond what is printed on the pack.
- **Photo:** pouch front on (yours).
- **Must not appear:** a white Sugar-Free burst, a torn pouch, any second product.

### Slot 2: Cost per use and Promise (answers Group A)
- **Shows:** a clean price card beside a single daily pack.
- **Words and sources:**
  - "The price, before you ask." (new headline, brand voice)
  - "First order: $29.99 with our text sign-up offer" (price table, footer small print)
  - "Then $49.99 every 4 weeks, about $1.78 a day" (price table)
  - "30-day money-back guarantee on your first order" (FAQ: "applies only to your initial purchase")
  - A cancel/skip line, **NEED: fact**. I need the site's exact cancel wording. Nothing will go beyond it.
- **Notes:**
  - No "% off" figures. The site runs 52%, 55%, 49%, 58% and 61% at the same time, which is the very confusion this slot exists to clear up.
  - Prices change. This panel should be set by a designer as a dated, editable text layer, not by the image tool.

### Slot 3: Made of (answers Group C)
- **Shows:** one torn daily pack with its gummies, plus three big number tags.
- **Words and sources:**
  - "60+ ingredients. 21 vitamins & minerals. 6g fiber. In 1 pack." (product page)
  - "Clinically tested for nutrient absorption" (science page)
  - "12-week placebo-controlled study, 120 adults: blood vitamin C up 40.1%, folate up 20.5%." (science page, 2025 study)
- **Notes:**
  - "Per pack," never "per gummy."
  - The study is not claimed to show energy, immunity or "it works."
  - No claim that it replaces a powder.
  - **NEED: fact.** The site says both 21 and "20+" vitamins and minerals. Please confirm that the label says 21.

### Slot 4: Steps and How often (Hassle; the habit story)
- **Shows:** a daily pack torn straight across the top, with gummies pouring into a palm. This could be the current image #3, if it passes the check.
- **Words and sources:**
  - "Rip. Tip. Enjoy." (brand line)
  - "1 pack a day. No more gagging on pills, sloshing chalky powders, or cleaning messy counters." (serving fact, brand line)

### Slot 5: Range (answers Group B)
- **Shows:** the Low Sugar pouch (marked "this one") next to the Sugar-Free pouch with its white burst.
- **Words and sources:**
  - "Low Sugar or Sugar-Free. Sugar-Free uses sugar alcohols." (product page)
  - "Sensitive stomach? Start with Low Sugar." (brand file guidance)
  - "Vegan. Pectin, no gelatin. Free from gluten, dairy, nuts, synthetic dyes and sweeteners." (ingredients panel, science page)
  - "Supports digestion and gut health." (approved claim)
- **NEED: fact.** Grams of sugar per pack for Low Sugar were not captured. Without that number, "Low Sugar" is left unexplained.
- **NEED: photo.** A Sugar-Free pouch, front on.

### Slot 6: Up close and Scale (answers Group D, plus Scale)
- **Shows:** a small handful of bears in an open adult palm, close up.
- **Words and sources:**
  - "A small handful a day." (product page)
  - "Original: strawberry and sweet greens." (product page)
- **Photo:** gummies in an open hand (yours).
- **Note:** no taste promise such as "delicious from day one."

### Slot 7: What arrives
- **Shows:** 28 daily packs laid out in a grid next to the pouch. The pouch is closed at its resealable top.
- **Words and sources:**
  - "28 daily packs. 1 a day. 4 weeks." (FAQ)
  - "Ships within 24 hours, usually arrives in 3–5 days." (site: "typically ship within 24 hours and on average arrive 3-5 days later")
- **NEED: photo.** Contents laid out. **NEED: fact.** Pouch and daily-pack dimensions.

### Slot 8: Tested
- **Shows:** the pouch with four tested-for tags.
- **Words and sources:**
  - "Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants." (product page)
  - "Made in NSF, GMP and FDA-registered facilities in the US and Canada." (product page)
- **Open question:** the page also says "35 substances tested," which does not match 70+4+16+9. That line stays off the image until the brand explains it.

### Slot 9: Voices (the open lane: "I finally stuck with it")
- **Shows:** one real customer review, word for word, with a rating line.
- **Words and sources:**
  - "Sprout has been the one thing I've been able to stick to." (customer quote, brand file). **NEED: review**, meaning its source and reviewer name as shown.
  - "95% of surveyed users take Sprout at least 4-6x per week with 80% taking daily." (brand survey, 3,000+ customers)
  - Rating: "4.75 from 109,639 reviews on sprout.example", with a date. This uses the on-page widget's figure, with its source named. The "4.8 / 100,000" figure is refused.
- **Notes:** no faces unless the brand supplies a real customer photo. No made-up customers.

### Slot 10: Label panel
- **Shows:** the readable supplement facts panel.
- **Words:** none added.
- **NEED: photo.** A flat, sharp shot of the label panel. This slot is for a designer, not the image tool.

### Refused, each with the version used instead
- "Fix the Hot Girl Tummy" → "Supports digestion and gut health"
- "[Sprout] works" / "energy, immunity" → "Clinically tested for nutrient absorption," plus the two study numbers
- "up to 61% OFF + 4 FREE gifts" → the plain price in slot 2
- "4.8 stars from 100,000 reviews" → 4.75 from 109,639, with its source named
- "Each gummy delivers 100%…" → per pack

### Gaps list
- **NEED: photo**
  - The current gallery files
  - A daily pack torn straight across the top
  - The 28 packs laid out
  - The label panel
  - A Sugar-Free pouch, front on
- **NEED: fact**
  - The site's exact cancel/skip wording
  - Grams of sugar per pack (Low Sugar)
  - Confirmation that the label says 21 vitamins and minerals
  - What "35 substances tested" means
  - Pouch and pack dimensions
  - Whether the $29.99 and $49.99 prices are still live
  - Whether the theme uses 4:5
- **NEED: review**
  - The source and name for the "stick to" quote
  - More pre-sale questions or return reasons

---

**Stop 1:** please approve or edit the audit, the doubt groups, the 10-slot plan and every line of words above, and fill in the NEED items, especially the cancel wording and the sugar grams. Once you approve, I'll lock the photos and make slots 1 and 2 as test images. The rest won't be made until you've signed those off.
```
