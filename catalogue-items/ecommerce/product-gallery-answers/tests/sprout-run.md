# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest first half: it admits the image files didn't arrive, audits from the owner's descriptions, ranks the subscription-trap fear correctly into slot 2, and puts only sourced, approved claims on the images while keeping the conflicting discounts and risky health lines off. Gaps are clearly marked NEED/MISSING and it stops at Stop 1 as the skill requires; the only loose spot is the informal 'seven different discounts' count, which is a rough tally of the brand file's list rather than a stated fact for the gallery.

## Judge list

- Met: The audit of your current gallery came before the plan.
  Section 1 'Gallery audit and unanswered questions' with keep/fix/drop rows precedes Section 3 'Plan, words and sources'.
- Met: The biggest stopper is answered in slot 2, with quotes in customers' own words.
  'A. Price and the subscription trap ... Stopper. Biggest, so it takes slot 2' with 'I hate subscriptions because I feel like they are a trap...' (brand site).
- Met: Every word on every image is in the plan with a source.
  Plan table has a 'Words on image' and 'Source' column per slot, e.g. '$49.99 every 4 weeks ... $1.78 a day' -> price table.
- Met: You saw two finished images before the rest were made, unless you asked for it all in one go.
  'Once approved, I'll write slots 01 and 02 as test prompts for you to approve before the rest.' No images made yet.
- Met: Files are numbered in upload order, and nothing was handed over while a note was open.
  Slots numbered 01–09; 'Parts 4 and 5 ... come after you approve this', with NEED/MISSING notes still open.

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
I can't draw images in this chat, so every image will come to you as a prompt. The product image spec writer, gallery planner and image checker skills aren't added here, so I ran those steps myself from the skill page. Those skills would do them more thoroughly.

**Stopped at Stop 1.** Parts 4 and 5 of the hand-back (final files with alt text, check results and review sheet) come after you approve this and then the first two test images.

---

## 1. Gallery audit and unanswered questions

Only `sprout/brand.md` came through. The three gallery images and the two product photos did not, so I read the gallery from your descriptions. Treat these verdicts as provisional until I see the files on a phone strip.

| # | Shows | Job | Question it answers | Verdict |
|---|---|---|---|---|
| 1 | Pouch alone on a soft two-colour gradient | What is it | "What is this?" | **Drop.** It does the same job as #2, and #2 also shows the gummies. |
| 2 | Pouch with gummies scattered in front, same gradient | What is it | "What is this, and what's inside?" | **Keep as the new slot 1.** NEED: confirm the pouch shown is Low Sugar. Sugar-Free has a white burst, and showing it here would be the wrong variant. |
| 3 | An adult pouring gummies into a hand | In use | "How do I take it?" | **Fix.** If the gummies pour from the big pouch, that breaks the brand's own rule: you tear a daily pack straight across its top. Remake it from a torn daily pack. |

**Finding:** two of three images (#1 and #2) do one job.

**Question families no image answers:**
- What will I pay, and will it jump? (cost per day, renewal, guarantee)
- What's in it, and is it enough? (ingredients, doses)
- Does it work? (study, testing)
- Will it suit me? (Low Sugar vs Sugar-Free, diet, stomach)
- What arrives, and how big is it? (28 packs, gummy size)
- Do people keep taking it?

---

## 2. Doubt groups

Pre-sale questions count double. I also counted the "canceled before the gummies even arrived" line double, because it undid a sale the way a return does.

| Group | Fear | Count | Type | Quotes (word for word, source) | Route |
|---|---|---|---|---|---|
| **A. Price and the subscription trap** | I'll overpay or get stuck | **6** (2+1+1+2) | **Stopper. Biggest, so it takes slot 2.** | "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." (brand site) / "Will the price jump after the first order?" (brand file, pre-sale) / "They are expensive" (retailer) | Cost per use, Promise |
| B. Stomach | It won't suit me | 3 (1+2) | Stopper (pre-sale) | "Will this upset my stomach more?" (brand file, pre-sale) / "The sugar free [Sprout] worked too well." (review site) | Range (Low Sugar vs Sugar-Free), Made of |
| C. Is there enough in a gummy | It won't work | 2 | Stopper (pre-sale) | "A gummy can't hold enough to replace my powder." (brand file, pre-sale) | Made of, Tested |
| D. Taste at first | It won't suit me | 1 | Grumble (they kept going) | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (retailer) | Up close (flavour named). No taste promise. |

Group A also includes "I have tried multiple times to cancel my subscription." (review site), counted once. Only three quotes are kept per group.

There were no customer words for "it's a hassle" or "it won't look like the photos". Steps and What arrives are still planned, because the brand's core idea is ease and no image currently shows the daily pack or the size.

---

## 3. Plan, words and sources

Shape: square. 4:5 too if your theme uses it (MISSING: theme shape). Every word below is quoted from `brand.md`, or reworded from a fact in it, as noted.

| Slot | Type | Answers | Photo | Words on image | Source |
|---|---|---|---|---|---|
| **01** | Hero | What is it | Current #2: Low Sugar pouch front on, gummies in front, gradient | None beyond the pack itself | n/a |
| **02** | Cost per use + Promise | Group A: will the price jump, is it a trap | Pouch + one daily pack, cream #FFF7DF | **"The real numbers."** / "Subscription: $49.99 every 4 weeks. That's $1.78 a day." / "Or buy once: $66.65" / "30-day money-back guarantee on your first order" | Price table, late Sept to mid Oct 2026; FAQ: "applies only to your initial purchase" |
| 03 | Made of | Group C: enough in it? | Daily pack + readable facts panel (NEED) | **"1 tiny pack. A lot inside."** / "60+ ingredients · 21 vitamins & minerals · 6g prebiotic fiber" / small: "About 100% daily value for vitamins, about 25% for minerals" | Product page, science page |
| 04 | Tested (study) | Group C: does it work? | Gummies in open hand (your photo) | **"Clinically tested for nutrient absorption"** / "Blood vitamin C: +40.1%" / "Blood folate: +20.5%" / small: "2025 study · 12 weeks · 120 healthy adults · randomized, double-blind, placebo-controlled" | Science page |
| 05 | Steps / In use | Hassle; replaces current #3 | Daily pack torn straight across the top, gummies pouring into a palm (NEED) | **"Rip. Tip. Enjoy."** / "No water. No mixing. No shaker." | Brand line; What it is |
| 06 | Range + Works with | Group B: stomach, diet | Low Sugar pouch beside Sugar-Free pouch, each labelled (NEED Sugar-Free photo) | **"Pick your sweet."** / "Low Sugar (this one)" / "Sugar-Free: sweetened with sugar alcohols" / "Vegan · Pectin, no gelatin · Free from gluten, dairy, nuts, caffeine, synthetic dyes & sweeteners" | Product page, ingredients panel, science page |
| 07 | What arrives + Scale + Up close | Size, taste (Group D) | Pouch + 28 packs laid out; a few gummies on a fingertip (NEED) | **"28 daily packs. 1 pouch."** / "Strawberry & sweet greens" | Product page FAQ; flavour "Fresh & Sweet" |
| 08 | Tested (lab) | Quality, trust | Pouch front on, gradient | **"Third-party tested"** / "70 pesticides · 4 heavy metals · 16 contaminants · 9 microbial contaminants" / "Made in NSF, GMP and FDA-registered facilities in the US and Canada" | Product page |
| 09 | Voices (survey) | Habit, the open lane | Adult with pouch at home, casual, sunny | **"Turns out people keep taking it."** / "95% of surveyed users take Sprout at least 4–6x per week, with 80% taking daily." / small: "Brand survey of 3,000+ customers" | Brand survey |

**Kept off the gallery on purpose:**
- Any "% off" figure. Seven different discounts are live at once, so any one of them feeds Group A.
- "$29.99 first order": it only applies with the SMS sign-up discount.
- "Fix the Hot Girl Tummy" and any star rating: the sources conflict.
- "Replaces your powder": no support on file.
- Anything about energy or immunity from the study: it measured two vitamins in the blood.
- Any easy-cancel promise.

**Build notes:**
- Prices on 02 should be a designer-set, editable text layer, rechecked on the upload day.
- 03, 04 and 08 are dense panels, so a designer should set them.
- Logos come only from the photographed pack.
- No partner or tie-in marks anywhere.

### Gaps list

- NEED: the three current gallery files and the two product photos (only text came through).
- NEED: confirm the pouch in current #2 is Low Sugar.
- NEED photo: daily pack torn straight across the top, pouring into a palm (slot 05).
- NEED photo: readable supplement facts panel (slot 03).
- NEED photo: Sugar-Free pouch, for the labelled comparison (slot 06). Without it, 06 shows Low Sugar alone with the free-from line.
- NEED photo: 28 packs laid out, plus gummies against a fingertip (slot 07).
- MISSING: grams of sugar and the sweetener in Low Sugar. Without them, 06 can't say what Low Sugar uses, only what Sugar-Free uses.
- MISSING: the site's exact words on skipping or cancelling. If they exist and are verified, one line can go on 02. That would answer the loudest complaint.
- MISSING: gummy count per adult pack (the file says "a small handful", about 20 g).
- MISSING: whether the theme uses 4:5.
- CONFLICT: the site says both "21" and "20+" vitamins and minerals. The plan uses 21 (science page). Please confirm.

---

**Stop 1:** do you approve the audit, the doubt groups, the plan and every word above? You can also tell me what to change. Once approved, I'll write slots 01 and 02 as test prompts for you to approve before the rest.
```
