# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, honest plan: every cost-per-purchase figure checks out against the CSV, risky figures (star ratings, discount percentages, vitamin count) are held back, and the tie-in pouch is correctly barred. It is small (11 ads) because it treated the 20 reviews as missing and asked for them rather than guessing, so the owner should send them and get a fuller grid before approving.

## Judge list

- Met: Every reason to buy names three buyers, or one buyer and a past ad that beat your cost per sale.
  Row A: quote + "H1 'One Step I Never Skip' ran at $29.55 against the $34.51 account cost." Row B: quote + "T1 ran at $21.21 against $34.51."
- Met: Every cell in the grid is either a real idea or marked EMPTY with the reason.
  "B6 ... EMPTY. There is only one gut figure on file, and reusing 67% would duplicate B5." C1–C6 EMPTY with Row C reasons.
- Met: The counts per row and column add up to the total.
  Rows 6+5+0=11, columns 4+4+3=11, "By dress: Camera 6, Designed 5" = 11.
- Met: Read two cell ideas aloud. Each names something true about your product that a rival couldn't copy unchanged.
  A4: "The new way has three: Rip. Tip. Enjoy."; A1: "28 daily packs", "6 g fiber", "one deep-green pouch".
- Met: It stopped at the approval and didn't start writing briefs.
  Ends with "Approval 1: the plan. To approve, confirm or change:" and no briefs follow.

## What went in

```text
Brand file: Sprout, daily greens gummies (pasted below: facts,
fine and risky claims, prices and the discount mess, voice, look,
show-it-right rules).
Buyers: the four buyer groups in the brand file, plus all 20
reviews (pasted below).
Past results: ad-results.csv, 9 ads (practice numbers, pasted).
Photos: the adult pouch on a soft gradient with gummies in front;
gummies poured into a hand; the cartoon-movie tie-in pouch.
Audience: new to Sprout. Run stage 1 only and stop for my approval.

[attached: sprout/brand.md, sprout/ad-results.csv]
```

## What came out

```text
# Sprout: Stage 1 plan (grid for approval)

**Audience:** New to Sprout · **Product:** Sprout Original (Adults), one product only · **Grid:** shrunk to 3 × 3 × 2 = 18 cells, 11 filled, 7 EMPTY (reasons below)

## Missing inputs

- **MISSING: research.** The 20 reviews were not included in what you pasted. Only the brand file's four buyer groups and one quote per group arrived. With one quote each, an argument qualifies only if an ad on it beat the account's cost per purchase. Two arguments pass that test, so the grid shrinks instead of being padded.
- **MISSING: photos.** There are only 2 usable photos. The Camera cells for "Old way, new way" need a shoot. Run `product-image-spec-writer` before Stage 2, and `get-a-full-product-photoshoot-from-phone-photos` is suggested before the sprint.
- **MISSING: live offer.** No offer has a single set of terms or a date. Six discount levels are live at once (49, 52, 55, 58 and 61% off, plus "$20 off"). The $29.99 price depends on the SMS discount, and the guarantee covers the first order only. Because of this, there is no "Why now?" column.
- **MISSING: source.** The brand file does not name which review site each buyer quote came from. That is needed before any "Their words" ad. The survey's date and method are also not on file.

## 1. Photo list

| # | Shows | Can lead an ad? |
|---|---|---|
| P-1 | Adult pouch on a soft 2-colour gradient, gummies scattered in front | **Yes.** Real product, no designed lettering, no child. *Confirm the variant:* it should be Low Sugar (no white burst), because the gut row points sensitive stomachs to Low Sugar. |
| P-2 | Gummies poured into a hand | **Yes.** *Confirm* it is an adult hand. If a daily pack is visible, confirm it is torn straight across the top. |
| P-3 | Cartoon-movie tie-in pouch | **No.** It carries licensed cartoon marks, which the brand's never-show list forbids. It is also a limited flavour, not the sprint product. |

**Suggested shoot (minimum):**
- An unbranded half-used greens tub with a crusted shaker and 3 unbranded pill bottles on a kitchen counter.
- The same counter with one daily pack torn across the top and a handful of bears beside it.
- An unbranded fiber-powder canister with a glass of cloudy fiber drink and a spoon.
- A single daily pack, torn and untorn, on cream #FFF7DF.

## 2. Arguments (format: buyer | problem | what only Sprout does | proof)

**Past results check.** The practice numbers cover 9 ads. P1 appears as two 21-day rows. Totals are $21,500 spend and 623 purchases, so the **account cost per purchase is $34.51**.

| Ad | Cost per purchase | Beats $34.51? |
|---|---|---|
| T1 Hot girl tummy | $21.21 | Yes |
| H1 One step never skip | $29.55 | Yes |
| K1 Fiber kids | $34.92 | No (by $0.41, and it is a different product) |
| P1 Too expensive | $39.74 overall: $26.79 in days 1–21, then $76.92 in days 22–42 | No |
| F1, W1 | $39.13 | No |
| S1 | $42.11 | No |
| P2 | $50.00 | No |
| R1 | $100.00 | No |

**Row A: Habit**
- **Buyer:** The quitter who wants to stick (about 40%).
- **Problem:** Has quit greens powders, pill stacks and multivitamins, and nothing lasts.
- **What only Sprout does:** One daily pack you tear and eat. No water, no mixing, no shaker ("Rip. Tip. Enjoy.").
- **Proof:**
  - Buyer quote: "Sprout has been the one thing I've been able to stick to."
  - H1 "One Step I Never Skip" ran at $29.55 against the $34.51 account cost.
  - Survey: "95% of users take [Sprout] at least 4-6x per week with 80% taking daily" (of surveyed users, brand survey of 3,000+).
  - This is the brand's top review theme and is barely used in ads.

**Row B: Gut**
- **Buyer:** The gut-fix seeker (about 25%).
- **Problem:** Bloating and irregularity after trying fiber powders and probiotics.
- **What only Sprout does:** 6 g prebiotic fiber in a gummy you eat, not a drink you finish. Low Sugar for sensitive stomachs.
- **Proof:**
  - Buyer quote: "My bowel movements are normal for the 1st time in 15 years!"
  - T1 ran at $21.21 against $34.51.
  - Survey: "67% ... experienced better, more regular digestion" (of surveyed users).
- **Claim rules:** Claims stay at "Supports digestion and gut health". "Fix" is never reused.

**Row C: EMPTY.** No third argument meets the evidence bar yet. The candidates below would qualify if 3 or more of the 20 reviews say the same thing:
- **Busy parent:** "So easy to grab and eat on my way to…". K1 does not beat $34.51, and it sells Kids, which needs its own rows.
- **Powder texture and taste:** "gritty/chalky".
- **Price doubter:** P1 beat $34.51 only for its first 21 days. Every discount figure it would use is stated more than one way.

## 3. Types and why

| Column | Question | Type | Proof on file |
|---|---|---|---|
| 1 | What is it? | Look inside | Label facts: 60+ ingredients, 6 g prebiotic fiber, methylfolate not folic acid, B12 as methylcobalamin, pectin base, vegan, free from gluten and dairy |
| 2 | Is it for me? | Old way, new way | The old way is in the brand file, unbranded: powder tub and shaker, pill-bottle shelf, fiber powder. The new way comes from the product page facts. |
| 3 | Can I believe it? | Checked fact | Survey figures with "of surveyed users", source line: brand survey of 3,000+ customers |

**Types left out:**
- **Why now? (Offer, Occasion):** no dated live offer and no real date. The New audience allows only 1 such column anyway.
- **Their words:** only one quote per argument, and its source site is unnamed.
- **In use:** shares the "Is it for me?" question with Old way, new way, which fits both rows more tightly.
- **Product alone:** too neutral to test an argument.

## 4. Dresses

**Camera** and **Designed.** The past results do not record dress, so this is treated as no history.

## 5. The cells

**Figures held back in every cell:**
- "21 vitamins & minerals" (the site also says "20+" and "over 20").
- Every star rating (4.8, 4.75, 4.74 and 4.0 all appear).
- Every discount percentage.
- "Trusted by 1M+" (from S1, not on file).
- "35,000+ studies" and any energy or immunity claim from the study. The study measured blood vitamin C and folate only.

| Code | Argument | Idea (what is in the frame) |
|---|---|---|
| A1 · Look inside · Camera · New | Habit | P-1 with thin callouts to the pouch and the bears in front: "28 daily packs", "60+ ingredients", "6 g fiber", "no water, no shaker". The whole routine that used to need a tub, a shaker and a pill shelf, in one deep-green pouch. |
| A2 · Look inside · Designed · New | Habit | Flat illustration of one daily pack torn straight across the top, bears spilling into a palm. The labels belong to the *pack*, not to single gummies (avoiding the brand's own "each gummy" error): 60+ ingredients, 6 g prebiotic fiber, methylfolate, B12 as methylcobalamin. The idea is that "Sachet is a fancy word for our gummy pack". |
| A3 · Old way, new way · Camera · New | Habit | *Needs the shoot.* Left: unbranded half-used greens tub, crusted shaker and 3 unbranded pill bottles on a kitchen counter. Right: the same counter wiped clean, one Sprout pack torn at the top, a few bears beside it. Objects only, no hands or faces. |
| A4 · Old way, new way · Designed · New | Habit | Two illustrated step strips. The old way has five steps: scoop, add water, shake, rinse the shaker, swallow pills. The new way has three: Rip. Tip. Enjoy. It is a count of steps, not a promise of results. |
| A5 · Checked fact · Camera · New | Habit | P-2 (adult hand holding today's handful) with "80% of surveyed users take it daily" set beside the palm, and a DM Mono source line: "brand survey, 3,000+ customers". |
| A6 · Checked fact · Designed · New | Habit | A 7-day strip in brand greens with days filled in, carrying the other survey figure: "95% of surveyed users take it 4–6x a week". It uses the same source line as A5, but a different number and picture. |
| B1 · Look inside · Camera · New | Gut | P-1 (Low Sugar pouch confirmed) with callouts on the bears: "6 g prebiotic fiber", "pectin base, no gelatin", "Low Sugar". The fiber this buyer was stirring into water sits in the green bears in front of the pouch. |
| B2 · Look inside · Designed · New | Gut | Illustrated torn daily pack with a "free-from" list beside it: gluten, dairy, tree nuts, peanuts, caffeine, synthetic dyes, plus "vegan" and "pectin base". The angle is what *isn't* in it, for a buyer worried about upsetting her stomach. |
| B3 · Old way, new way · Camera · New | Gut | *Needs the shoot.* Left: unbranded fiber-powder canister, a glass of cloudy fiber drink with a spoon still in it, an unbranded probiotic bottle. Right: one torn Sprout pack and a handful of bears on a saucer. Objects only. |
| B4 · Old way, new way · Designed · New | Gut | Illustrated "drink it vs eat it": a tall glass of thick fiber drink you have to finish, beside a small palmful of green bears ("no water, no mixing"). No unsourced fiber comparison: the "most only contain 5g" line is held back. |
| B5 · Checked fact · Camera · New | Gut | P-2 with "67% of surveyed users experienced better, more regular digestion" and the survey source line. It carries the claim "Supports digestion and gut health", with no "fix" and no before-and-after body. |
| B6 · Checked fact · Designed · New | Gut | **EMPTY.** There is only one gut figure on file, and reusing 67% would duplicate B5. |
| C1–C6 | — | **EMPTY.** No third argument qualifies (see Row C above). |

## 6. Counts per row and column

| | Look inside | Old way, new way | Checked fact | Row total |
|---|---|---|---|---|
| A Habit | 2 | 2 | 2 | **6** |
| B Gut | 2 | 2 | 1 | **5** |
| C (EMPTY) | 0 | 0 | 0 | **0** |
| **Column total** | **4** | **4** | **3** | **11** |

By dress: Camera 6, Designed 5. Two of the Camera cells (A3, B3) depend on the shoot.

## 7. Budget check

- **Purchases needed.** Read a group at about 20 purchases. 2 rows × 20 = 40 purchases, and 3 columns × 20 = 60, so about **60 purchases** reads every row and column.
- **Cost.** 60 × $34.51 ≈ **$2,070**, on practice numbers. If the gut row keeps T1's $21.21, it may read sooner.
- **Weaker pooling.** Each group pools only 3 to 6 ads instead of 10. One weak ad can move its group by a sixth to a third, so treat close results as ties.
- **Fatigue.** P1's cost per purchase nearly tripled after day 21. Plan to read inside about 3 weeks.
- **Growing the grid.** Once the reviews arrive and Row C qualifies, the grid becomes a full 3 × 3 × 2. If two more arguments and one more type qualify, it becomes 4 × 4 × 2 = 32 cells, needing about 80 purchases (about $2,760).

**Approval 1: the plan.** To approve, confirm or change:
- The 2 arguments, and whether to send the 20 reviews so Row C can qualify.
- The 3 types.
- Camera and Designed as the 2 dresses.
- The shoot list.
- That P-1 is the Low Sugar variant.
```
