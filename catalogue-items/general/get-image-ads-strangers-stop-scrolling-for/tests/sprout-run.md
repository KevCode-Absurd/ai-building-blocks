# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest plan: every cost-per-purchase figure checks out, every used insight traces to numbered reviews, risky claims and GLP-1 lines are kept out, and the missing torn-pack photo is flagged before any picture is attempted. It is longer than the shape asks and lacks a labelled SOURCES section, but the owner gets a clear pick at Stop 1 with a sensible spread of types.

## Judge list

- Met: Every insight marked USED has three buyers, or one buyer and a past ad that beat cost per sale.
  "I1... Reviews 1, 3, 4, 6 (4 buyers). Used." I2, I4, I8 likewise cite 3+ reviews, plus H1/T1 results.
- Met: No two ads share both an ad type and a reason.
  Spread table: Old way/new way A1, The moment A2, Look inside A5, Their words A4; four types, four arguments.
- Met: Cover the headline; you can still tell what each picture is about.
  Not reached: run correctly halted at Stop 1 ("Concepts and image prompts come after your pick"). Planned types each show the product or scene.
- Met: Each headline is 7 words or fewer, and the counts are shown.
  Not reached by design; table column reads "Headline words: after Stop 2". Only quote A4 counted: "12 words, within the quote limit".
- Met: Cover the logo; colours, shapes and type still say it's your brand.
  Not reached: no concepts or pictures yet; run paused at Stop 1 as the skill requires.
- Met: The picture never shows a result the facts don't state.
  No pictures yet; A4 planned as "one buyer's story" with source named, hunches (energy, hair, weight) kept out.

## What went in

```text
Brand file: Sprout, daily greens gummies (pasted below: facts,
fine and risky claims, voice, colours, show-it-right rules).
Buyer research: all 20 reviews from reviews.md (pasted below).
Past results: ad-results.csv, 9 ads, 14 to 42 days (practice
numbers, pasted below).
Photos we have: the adult pouch on a soft green gradient (front)
and gummies in a hand. That's all.
Batch: 4 ads, 4:5 and 9:16.

[attached: sprout/brand.md, sprout/reviews.md, sprout/ad-results.csv]
```

## What came out

```text
No image tool is connected to this chat, so I'll write image prompts for you to run elsewhere, starting after Stop 2.

# Stop 1: pick 4 arguments

Pick 4 of the 6 kept arguments (A1 to A6) below. I've suggested a spread, but the choice is yours. Concepts and image prompts come after your pick, then Stop 2.

---

## Past results, read for this batch

These are practice numbers, and the CSV doesn't split new from returning buyers. Treat every result-backed insight as provisional.

| Ad | Spend | Purchases | Cost per purchase | vs account |
|---|---|---|---|---|
| T1 Hot girl tummy | $4,200 | 198 | **$21.21** | beats |
| P1 Too expensive (days 1–21) | $3,000 | 112 | $26.79 | beats |
| P1 Too expensive (days 22–42) | $3,000 | 39 | $76.92 | worse (fatigue) |
| P1 Too expensive (both periods) | $6,000 | 151 | $39.74 | worse |
| H1 One step never skip | $1,300 | 44 | **$29.55** | beats |
| K1 Fiber kids | $2,200 | 63 | $34.92 | just worse |
| F1 Fiber question | $1,800 | 46 | $39.13 | worse |
| W1 Muscle weight loss | $900 | 23 | $39.13 | worse |
| S1 Trusted by 1M | $1,600 | 38 | $42.11 | worse |
| P2 Don't pay full price | $2,500 | 50 | $50.00 | worse |
| R1 Runner | $1,000 | 10 | $100.00 | worse (only 10 purchases, so the gap is noise) |
| **Account** | **$21,500** | **623** | **$34.51** | |

- **T1** shows the gut argument wins. Its line "Fix" breaks the brand's own "supports" rule, so the argument stays and the word goes. The result may not carry over fully.
- **K1** misses the account rate by $0.41. At 63 purchases that gap is noise, not a win, so it doesn't count as a result.

---

## Buyer sheets

Review numbers are from reviews.md.

**I-codes** mark buyer insights. An insight is **Used** when 3 or more reviewers say it, or 1 reviewer says it and an ad on that argument beat the account's cost per purchase. Anything less is a **hunch** and stays out of copy.

### B1. The quitter who wants to stick

| Field | What's on file |
|---|---|
| Wants | One habit that lasts. |
| Tried, and why it failed | Greens powders were gritty, chalky and needed a shaker to wash (reviews 3, 4, 6). Consistency, not nutrition, was the real problem (review 1). Separate gummy bottles (review 5). |
| Moment to look today | The half-used tub, the shaker in the sink, another skipped day. |
| Own words | "the one thing I've been able to stick to" (review 1). "It's wild I WANT to take [Sprout] and don't forget." (review 2). "gritty/chalky" (review 3). "choking on [a big-name greens powder]" (review 4). "not having to clean a shaker bottle" (review 6). |
| Doubts | "A gummy can't hold enough to replace my powder" comes from the brand file, not from a review, so it's a **hunch**. "They are expensive" (retailer) is 1 buyer, so it's a **hunch**. |

Insights:
- **I1. Powders let them down: chalky, gritty, shaker to wash.** Reviews 1, 3, 4, 6 (4 buyers). **Used.**
- **I2. Easy enough to actually stick with daily.** Reviews 1, 2, 6, 15, plus H1 beat the account. **Used.**
- **I3. Replaces a shelf of separate gummy bottles.** Review 5 only (1 buyer). **Hunch.**

### B2. The gut-fix seeker

| Field | What's on file |
|---|---|
| Wants | To feel normal. |
| Tried | Fiber powders and probiotics. This comes from the brand file; no review on file names them, so it's a **hunch**. |
| Moment to look today | Another bloated afternoon, another irregular week. |
| Own words | "My bowel movements are normal for the 1st time in 15 years!" (review 7). "The prebiotics do their job, but not aggressively" (review 8). "the solution to my problems with regularity" (review 9). "Feel lighter, less bloated" (review 10). |
| Doubts | Will Sugar-Free upset my stomach? "The sugar free [Sprout] worked too well." (review site). Point these buyers to Low Sugar. |

Insights:
- **I4. Digestion and regularity improved.** Reviews 7, 8, 9, 10, 11, plus T1 beat the account. **Used.** Copy stays at "supports digestion and gut health". Review 11 mentions GLP-1, so it's excluded from copy.

### B3. The busy parent

| Field | What's on file |
|---|---|
| Wants | No fight at the table, and something easy for themselves. |
| Own words | "So easy to grab and eat on my way to the billion things I have to do as a mom." (review 15). "They think it's a treat." (review 16). "my kids love them too!" (review 17). |
| Doubts | "Is the sugar okay for kids?" Grams of sugar weren't captured: **MISSING: proof**. "I hate subscriptions because I feel like they are a trap" (review 17). |

Insights:
- **I5. Kids eat it, picky eaters included.** Reviews 16 and 17 (2 buyers), and K1 didn't beat the account. **Hunch.**
- **I6. Easy to grab on the way out.** Review 15 supports I2 above.

### B4. The price doubter

| Field | What's on file |
|---|---|
| Wants | Proof it's worth it, or a real deal. |
| Own words | "They are expensive" (retailer). "$94 a month" for the rival powder (review 3). "I hate subscriptions because I feel like they are a trap" (review 17). |

Insights:
- **I7. Too expensive, or a subscription trap.** Reviews 17, 20 and the "expensive" line, which are 3 loose mentions with no shared wording. P1 won only in its first 21 days. **Hunch for strangers.** These are "Why now?" arguments anyway.

### Shared across buyers

- **I8. Tastes like a treat or fruit snacks.** Reviews 6, 12, 14, 16 (4 buyers). **Used.** The counter-evidence is reviews 18 and 19 ("tasted terrible" at first, "the taste is off"). So copy may quote a reviewer but never promise great taste to everyone.

### Hunch list (stays out of copy)

| Hunch | Why it's out |
|---|---|
| Energy (reviews 13, 14) | Only 2 buyers, and the energy claim is risky. |
| GLP-1 (reviews 11, 14) | The brand must not repeat it. |
| Replaces separate bottles (I3) | 1 buyer. |
| Kids love it (I5) | 2 buyers, no winning result. |
| Price and subscription fear (I7) | No consistent wording; only an early P1 win. |
| "A gummy can't hold enough" | Brand-file doubt, not a review. |
| Hair, weight loss, muscle | Nothing on file supports them. |

---

## Arguments

Each line reads: buyer | the problem | what only this product does | the proof.

### Kept

- **A1** | B1 | Chalky powder and a shaker to wash | Tear 1 daily pack: a handful of gummies with 60+ ingredients, 21 vitamins & minerals and 6 g fiber. No water, no shaker. | Product page, I1 (reviews 3, 4, 6).
- **A2** | B1 | Can't stick with any supplement | 1 torn pack a day, 28 in the pouch. "95% of surveyed users take [Sprout] at least 4-6x per week with 80% taking daily" (brand-reported survey of 3,000+). | I2 (reviews 1, 2, 15), H1 result, survey.
- **A3** | B2 | Irregular and bloated | 6 g prebiotic fiber in 1 pack of gummies. Supports digestion and gut health. Low Sugar is the gentle pick. | I4 (reviews 7 to 10), T1 result, "67% of surveyed users … better, more regular digestion".
- **A4** | B2 | Has tried things, doubts anything works | One buyer's words: "My bowel movements are normal for the 1st time in 15 years!" | Review 7. It's a hand-picked review from the brand site, so the source must be named and it's told as one buyer's story. 12 words, within the quote limit.
- **A5** | B1 | Doubts a gummy holds enough | What's in 1 pack: 21 vitamins & minerals, 6 g fiber, methylfolate (not folic acid), D3 20 mcg, B12 2.4 mcg, organic kale, spinach and spirulina. | Science page and ingredients panel; supports I1. The "holds enough" doubt is a hunch, so the headline won't quote it.
- **A6** | B1 / B3 | Supplements are unpleasant | One reviewer: "[Sprout] literally tastes like fruit snacks I ate as a kid." Strawberry and sweet greens, pectin base, vegan. | Review 12, I8 (reviews 6, 12, 14, 16). Quoted, never promised.

### Cut

| # | Argument | Why it's cut |
|---|---|---|
| A7 | Clinically tested: vitamin C +40.1%, folate +20.5% | The fact is on file, but no reviewer asks whether it works, so it has no buyer research behind it. It's a hunch and may state no fact, which empties it. You could revive it if you accept the gap. |
| A8 | Kids: greens picky eaters won't fight | I5 is a hunch. Also **MISSING: product view** (no Kids pouch photo). |
| A9 | Too expensive, so 61% off | "Why now?" type, and the limit allows 0 in a batch of 4. P1 fatigued from $26.79 to $76.92. It's also an offer on a product shot. |
| A10 | Greens gummies that taste good | A rival (TikTok, doctor-backed or vegan brand) could say it word for word. A6 replaces it with a real quote. |
| A11 | Support muscle while you lose weight | No evidence on file; it's on the risky list. |
| A12 | More energy | Hunch from 2 buyers, and the claim is unsupported. |
| A13 | One pack replaces your shelf of bottles | I3 is 1 buyer. It also overlaps A1 (same answer). |
| A14 | Fix the hot girl tummy | Same problem and answer as A3. "Fix" breaks the brand's "supports" rule. |
| A15 | Fill the gaps on a GLP-1 | Drug-adjacent, and the brand must not repeat what customers say about it. |

### Rival test

Gummies instead of powder alone is copyable: 4 rivals sell greens gummies, and the big powder brand now sells its own. Every kept line therefore carries a fact only Sprout has on file: the torn daily pack, the 60+ / 21 / 6 g numbers in 1 pack, methylfolate, the survey or a Sprout customer's own words.

---

## Suggested spread for 4 (yours to change)

This works with the 2 photos you have and keeps "Why now?" at 0 of 4.

| File | Code | Buyer | Argument | Headline words |
|---|---|---|---|---|
| not made yet | Old way, new way · Camera · New | B1 | A1 | after Stop 2 |
| not made yet | The moment · Lo-fi · New | B1 | A2 | after Stop 2 |
| not made yet | Look inside · Designed · New | B1 | A5 | after Stop 2 |
| not made yet | Their words · Designed · New | B2 | A4 (or A3 as In use · Camera) | after Stop 2 |

- The "Is it for me?" and "What is it?" types carry 3 ads, and 1 "Can I believe it?" ad supports them.
- The batch uses 4 types and 3 dresses.
- B1 gets 3 of 4 ads because it's the biggest group with 2 used insights. If you'd rather balance it, swap A5 for A3 (B2, In use).

---

## Check record (so far)

| Check | Status |
|---|---|
| Used insights: 3+ buyers, or 1 buyer and a result | I1, I2, I4, I8 pass. I2 and I4 also have results, but from practice data. |
| Hunches out of copy | Yes, see the hunch list. |
| "Why now?" at most 1 in 5 | 0 of 4. |
| Type and dress counts | The 6-ad rule doesn't apply to 4 ads. The suggestion still has 4 types and 3 dresses. |
| No duplicate code plus argument | Pass in the suggestion. |
| Stop 1 | **Open: waiting on your pick.** |
| Stop 2 | Not reached. |
| Ratings | No star rating will be used: the sources conflict (4.8, 4.75, 4.74 and 4.0). |
| GLP-1 reviews | Excluded from copy. |

Missing items:
- **MISSING: product view.**
  - Daily pack, closed and torn straight across the top. The brand's show-it-right rule needs it for any tear or pour shot. Until then, ads use only the pouch front and the hand of gummies.
  - Kids pouch.
  - Sugar-Free pouch.
  - Open pouch top.
- **MISSING: proof.** Grams of sugar weren't captured.
- **MISSING: buyer research.** Too little for B3 and B4 to carry an ad for strangers.
- **Results caveat.** The past results don't split new from returning buyers.
```
