# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest first half of the workflow: it audited the gallery, counted the doubts with real quotes, planned eight images using only sourced facts, and kept every risky claim and the discount mess off the images. It correctly stopped at Stop 1 with a clear list of what the owner must supply before anything is made.

## Judge list

- Met: The audit of your current gallery came before the plan.
  Section '1. Gallery audit' with keep/drop/fix rows precedes '3. Plan'; it also flags 'NEED: the 3 live gallery files'.
- Met: The biggest stopper is answered in slot 2, with quotes in customers' own words.
  Group A (subscription trap, cancelling, price jump) marked Stopper, three verbatim quotes with sources, 'Slot 2' shows price, renewal and guarantee.
- Met: Every word on every image is in the plan with a source.
  Plan table lists words per slot with sources; unknown lines marked 'cancel or skip line: NEED', 'one verbatim review: NEED'.
- Met: You saw two finished images before the rest were made.
  No images made yet; run halts at 'Stop 1' and says it will make 'slots 01 and 02 as test images' after approval.
- Met: Files are numbered in upload order, and nothing was handed over while a note was open.
  Slots numbered 01-08 in order; nothing handed over, open NEEDs listed in the gaps list.

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
No image tool is connected in this chat, so I'll write the image prompts and you'll generate the pictures elsewhere.

## 1. Gallery audit

I only received `sprout/brand.md`. The three gallery images weren't attached, so this audit is based on your descriptions. **NEED: the 3 live gallery files in upload order**, so I can confirm them on a phone strip before Stop 2.

| # | What it shows | Job | Question it answers | Verdict |
|---|---|---|---|---|
| 1 | Pouch alone on a soft two-colour gradient | Main | What is it? | **Keep, check.** It must be the Low Sugar pouch. The Sugar-Free pouch has a white burst on it. |
| 2 | Pouch with gummies scattered in front, same gradient | Main again | What is it? | **Drop.** It does the same job as #1, which is a finding. Its slot is better used for a doubt. |
| 3 | Adult pouring gummies into a hand | In use | How do I take it? | **Fix.** Gummies must pour from a daily pack torn straight across the top, never from the big pouch. Add words. Don't caption the person as a customer. |

**Question families no image answers:**
- What's in it (Made of)
- Is it tested, and does it work (Tested)
- How much is a serving (Scale)
- How often do I take it (How often)
- What does it cost, and what happens at renewal (Cost per use, Promise)
- What arrives (What arrives)
- Will it suit my stomach and taste (Works with / label)
- What does the back say (Other sides)
- What others say (Voices)

## 2. Doubt groups

Return reasons and pre-sale questions count double.

| Group | Fear | Count | Type | Quotes, word for word (source) | Route |
|---|---|---|---|---|---|
| **A. Price jumps, subscription trap, cancelling** | I'll overpay or get stuck | **4** (1 + 1 + pre-sale ×2) | **Stopper.** One buyer cancelled before delivery. | "I hate subscriptions because I feel like they are a trap so I canceled it before the gummies even arrived." (brand site) / "I have tried multiple times to cancel my subscription." (review site) / "Will the price jump after the first order?" (pre-sale, brand file) | Cost per use, Promise, What arrives. **Slot 2.** |
| **B. Will it upset my stomach** | It won't suit me | **3** (pre-sale ×2 + 1) | **Stopper** | "Will this upset my stomach more?" (pre-sale, brand file) / "The sugar free [Sprout] worked too well." (review site) | Made of, label panel. NEED: a third quote. |
| **C. A gummy can't hold enough** | It won't work | **2** (pre-sale ×2) | **Stopper** | "A gummy can't hold enough to replace my powder." (pre-sale, brand file) | Made of, Tested, Up close. NEED: 2 more quotes. |
| **D. Too expensive** | I'll overpay | 1 | Grumble | "They are expensive" (retailer) | Cost per use, in slot 2 with A. |
| **E. Taste takes time** | It won't suit me | 1 | Grumble | "I thought the first pack I tried tasted terrible, but after the third day they started tasting better" (retailer) | Flavour line in slot 5. No taste promise. |

The biggest stopper is A, so slot 2 shows the price, the renewal and the guarantee.

No customer words were given for "It won't look like the photos". It is covered by the label panel (slot 6) only.

## 3. Plan

Every word below is listed with its source. Nothing appears on an image unless it is in this list.

| Slot | Type | Question | Photo | Words, with sources |
|---|---|---|---|---|
| 01 | Main | What is it? | Pouch front on, Low Sugar (existing #1, kept) | None typed. The wordmark and "28 Daily Packs" are on the photographed pack. |
| 02 | Cost per use + Promise | What do I pay, and what happens after the first order? | Pouch front on, small, beside a plain price panel | "Subscription: $49.99 every 4 weeks ($1.78/day)" / "One-time: $66.65 ($2.38/day)" / "30-day money-back guarantee, first order only" (price table, FAQ) / cancel or skip line: **NEED** the site's exact wording |
| 03 | Made of + Scale | Can a gummy hold enough? | Gummies in an open hand (your photo) | "60+ ingredients. 21 vitamins & minerals. 6g fiber." / "In 1 pack: a small handful." (product page, science page) / "About 100% DV for vitamins, about 25% for minerals" (science page) |
| 04 | Tested | Is there proof? | Pouch, with a type panel | "Clinically tested for nutrient absorption" / "12-week randomized, placebo-controlled study, 120 adults: blood vitamin C +40.1%, folate +20.5%" / "Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants" (science page, product page) |
| 05 | Steps / How often | Is it a hassle? | Existing #3, fixed: daily pack torn across the top, pouring into a palm | "Rip. Tip. Enjoy." / "1 pack a day. No water, no mixing, no shaker." / "Strawberry & sweet greens" (brand lines, product page) |
| 06 | Other sides / label | Will it suit my stomach? | **NEED:** a readable photo of the back or supplement facts panel | "Low Sugar" / "Pectin base, vegan" / "Free from gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners, synthetic dyes" (ingredients panel, science page) / sugar grams: **NEED** |
| 07 | What arrives | What's in the box? | **NEED:** a photo of the pouch with the daily packs laid out | "28 daily packs. 1 a day. 4 weeks." (product page FAQ) |
| 08 | Voices | Do people stick with it? | Gummies close-up, or the pouch | "95% of surveyed users take Sprout at least 4-6x per week, 80% daily" (brand survey, 3,000+ customers) / rating: "4.74 from 118,002 reviews on sprout.example" (reviews page) / one verbatim review: **NEED**, with its source |

**Kept off on purpose:**
- **Percent-off figures and "$29.99 first order."** Four discounts are live at once (49%, 52%, 55%, 61%) and $29.99 needs the SMS small print. They would go stale or contradict the buy box. If you want a first-order line on 02, it needs its own approved wording and the condition "with SMS sign-up, new customers only."
- **Brand claims flagged as risky.** "Fix the Hot Girl Tummy", "[Sprout] works", "4.8 stars from 100,000", "per gummy", "$1.26 vs $3.60" and any easy-cancel promise are all left out.
- **Any line saying Low Sugar is gentler on the stomach.** No fact on file supports it.

**Gaps list:**
- NEED: the 3 current gallery files, to confirm the audit.
- NEED: confirmation that the hero photo is the Low Sugar variant.
- NEED (photo job): a daily pack torn straight across the top, pouring into a palm, for 05.
- NEED (photo job): a readable label or supplement facts panel, for 06.
- NEED (photo job): contents laid out, pouch plus packs, for 07.
- NEED (fact): grams of sugar per pack.
- NEED (fact): whether Low Sugar contains any sugar alcohols.
- NEED (fact): the site's exact cancel and skip wording.
- NEED (review): verbatim quotes with sources. Groups B and C need at least 3 each, and 08 needs 1.
- NEED: whether the store theme uses 4:5 as well as square.
- NEED: whether this gallery also goes to a retailer marketplace. If it does, that version opens with the platform's plain main image.
- Dense panels (02, 04, 06) are best finished by a designer, not set by the image tool.

**Stop 1:** please approve or edit the audit, the doubt groups, the plan and every word above. Fill whatever NEEDs you can. After that I'll lock the photos and make slots 01 and 02 as test images.
```
