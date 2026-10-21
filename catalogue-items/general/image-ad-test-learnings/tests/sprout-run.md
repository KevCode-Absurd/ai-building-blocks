# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

An honest, well-sourced plan: every number traces to the brand file or is arithmetic on the CSV, risky claims and the mismatched vitamin count are held back, and the two kept arguments are properly backed by a buyer quote plus a winning ad. The owner gets a usable 12-ad grid and a clear gap list, though it dropped two allowed types (Product alone, In use) without strong reason, so the sprint tests less than it could.

## Judge list

- Met: Every reason to buy names three buyers, or one buyer and a past ad that beat your cost per sale.
  A1: "1 buyer ... Plus ad H1 at $29.55 against the account's $34.51." A2: "1 buyer ... Plus ad T1 at $21.21 against $34.51."
- Met: Every cell in the grid is either a real idea or marked EMPTY with the reason.
  12 cells each with a concrete frame description; "EMPTY cells: none."
- Met: The counts per row and column add up to the total.
  Rows 6+6, columns 4+4+4, dresses 6+6, "Total 12"; all consistent with 12 listed cells.
- Met: Read two cell ideas aloud. Each names something true about your product that a rival couldn't copy unchanged.
  Cell 1: tags "60+ ingredients", "6 g fiber", "methylfolate, not folic acid"; Cell 6: "vitamin C +40.1% (2.7x placebo), folate +20.5%".
- Met: It stopped at the approval and didn't start writing briefs.
  Ends with "Approval 1: do you approve this 12-ad plan... Once it's approved, I'll brief and prompt one pilot row in Stage 2."

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
*I can't make images in this chat. Stage 2 will give you image prompts, and I'll say how to turn them into pictures then.*

# Sprout image-ad sprint: Stage 1 plan (for approval)

**Product in the sprint:** Sprout Original (Adults), Low Sugar, 28 packs. The store rule allows one product per sprint. Low Sugar is the variant the brand file points gut-sensitive buyers to.
**Audience:** New to Sprout.
**Grid:** shrunk to **2 arguments × 3 types × 2 dresses = 12 ads**. Only 2 arguments pass the proof rule with what's on file (see below), so a bigger grid would be padding.

---

## 1. Photo list

| # | Photo | Real product? | Can it lead an ad? | Notes |
|---|---|---|---|---|
| P1 | Adult pouch on a soft gradient, gummies in front | Yes | **Yes** | Check that this is Low Sugar, not Sugar-Free (Sugar-Free has a white burst) `[inferred: Low Sugar]`. Check that no designed lettering is laid over the photo. The pouch's own print is fine. |
| P2 | Gummies poured into a hand | Yes | **Yes, if the hand is an adult's** | Pouring into a palm matches the brand's show-it-right rules. Confirm the hand is clearly an adult's `[inferred]`. |
| P3 | Cartoon-movie tie-in pouch | Yes | **No, not used at all** | It carries licensed cartoon and partner marks, which the never-show list rules out. |

**MISSING: photos.** There are only 2 usable photos, so I recommend running `product-image-spec-writer` and then `phone-product-photoshoot` before Stage 2. Shoot list:
1. A sealed daily pack, front and back.
2. A daily pack torn **straight across the top edge**, with gummies tipping into an adult palm.
3. A daily pack torn across the top, gummies in a small bowl or saucer.
4. The 28-pack pouch open at its resealable top only, never torn.
5. Old-way props, all unbranded: a half-used green powder tub with a dried scoop, a shaker with green residue, 3 to 4 plain pill bottles, a fiber-powder canister, a probiotic capsule bottle.
6. Settings: a morning kitchen counter with keys and a coffee mug, and a breakfast table.
7. The supplement-facts panel, close up.

---

## 2. Past results, read

These are practice numbers. The CSV has 10 rows for 9 ads because P1 is split into days 1–21 and days 22–42.

| Ad | Spend | Purchases | Cost per purchase | vs account $34.51 |
|---|---|---|---|---|
| T1 Hot girl tummy (video UGC) | $4,200 | 198 | **$21.21** | 39% better |
| H1 One step never skip (video) | $1,300 | 44 | **$29.55** | 14% better |
| P1 Too expensive, days 1–21 | $3,000 | 112 | $26.79 | better, then fatigued |
| P1 Too expensive, days 22–42 | $3,000 | 39 | $76.92 | much worse |
| P1 whole run | $6,000 | 151 | $39.74 | worse |
| K1 Fiber kids | $2,200 | 63 | $34.92 | about level, not better |
| F1 Fiber question | $1,800 | 46 | $39.13 | worse |
| W1 Muscle weight loss | $900 | 23 | $39.13 | worse |
| S1 Trusted by 1M | $1,600 | 38 | $42.11 | worse |
| P2 Don't pay full price | $2,500 | 50 | $50.00 | worse |
| R1 Runner | $1,000 | 10 | $100.00 | worse |

**Account totals:** $21,500 spend, 623 purchases, **$34.51 per purchase**.

P1's cost per purchase nearly tripled in its second three weeks. Plan to read this sprint within about 3 weeks.

---

## 3. The arguments

### Kept (2)

**A1, Habit:**
- **Buyer:** the quitter who wants to stick.
- **Problem:** has quit greens powders, pill stacks and multivitamins because they're unpleasant.
- **What only this product does:** a day's nutrition in one tear-open pack you eat. No water, no mixing, no shaker.
- **Proof:**
  - 60+ ingredients and 6 g fiber in 1 pack.
  - "95% of users take [Sprout] at least 4-6x per week with 80% taking daily". This is a brand-reported survey of 3,000+ customers and always carries "of surveyed users".
  - 2025 study, 12 weeks, 120 adults: blood vitamin C up 40.1% (2.7x placebo), folate up 20.5% (2.9x placebo).
- **Backing:** 1 buyer, *"Sprout has been the one thing I've been able to stick to."* Plus ad H1 ("One Step I Never Skip") at $29.55 against the account's $34.51.

**A2, Gut:**
- **Buyer:** the gut-fix seeker.
- **Problem:** bloating and irregularity. Fiber powders and probiotics didn't do it.
- **What only this product does:** 6 g prebiotic fiber in a Low Sugar gummy pack you eat.
- **Proof:**
  - 6 g prebiotic fiber, including inulin.
  - "Supports digestion and gut health."
  - "67% … experienced better, more regular digestion", always with "of surveyed users".
- **Backing:** 1 buyer, *"My bowel movements are normal for the 1st time in 15 years!"* Plus ad T1 at $21.21 against $34.51.
- **Rule for this row:** keep the argument but **not** the word "Fix". The claim stays at "supports".

### Left out, and why

| Argument | Why it's out |
|---|---|
| Busy parent ("so easy to grab…") | Only 1 buyer quote. K1 ($34.92) didn't beat the account. It is also a Kids product, which would need its own rows. |
| Powder quitter (chalky, gritty, $94 a month) | The brand file says reviewers name this, but I can't name 3 separate buyers, and no ad has run on it. It lives on here as the Old way, new way type. |
| Price ("too expensive") | The quotes are doubts, not a problem the product solves. P1 beat the account only in its first 21 days. P2 and S1 lost. |
| Fiber (general) | F1 lost at $39.13. No buyer quote on file. |
| Weight loss / muscle | W1 lost. The claim is unsupported. |
| Runner | R1 lost at $100. No buyer on file. |
| Social proof (1M+, star rating) | S1 lost. The rating is stated 4 different ways. |
| Hair | No buyer, no results, a risky claim. |

**MISSING: research.** Your message mentions 20 reviews, but none came through. Only the brand file's buyer groups and their 4 quotes arrived. With the reviews, the parent and powder-quitter arguments may reach 3 named buyers. The grid could then grow to 4×4 or 5×5.

---

## 4. The 3 types, and why

| Type | Question | Proof on file | Why it's in |
|---|---|---|---|
| **Look inside** | What is it? | 60+ ingredients, 6 g prebiotic fiber, methylfolate (not folic acid), vitamin C 93 mg, D3 20 mcg, B12 2.4 mcg, pectin base, vegan, the free-from list | It answers the quitter's doubt "A gummy can't hold enough to replace my powder." The vitamin count **"21" is held back** because the site also says "20+" and "over 20". |
| **Old way, new way** | Is it for me? | Brand facts on both sides: chalky powders, pills, shaker, a shelf of bottles, and the fiber powders and probiotics gut seekers tried. All shown unbranded, with objects, no body or face. | It is the open lane. The powder-quitter story barely appears in ads. |
| **Checked fact** | Can I believe it? | The survey (with its source and what it counts) and the 2025 study (with what it measured) | It turns a soft claim into a sourced number. |

That covers 3 of the 4 questions. There are 0 "Why now?" types, within the New-audience limit of 1.

### Types not used

| Type | Why not |
|---|---|
| **The offer** | No single live figure: the discount is stated as 49%, 52%, 55%, 58%, 61% and "$20 off". $29.99 is clear but depends on the text-message sign-up. Offer-led ads already dominate the account and mostly lost to its cost per purchase. |
| **The occasion** | No real date on file. |
| **Their words** | The 2 quotes have no original review site or date (MISSING: source). |
| **Product alone and In use** | Usable photos exist, but Look inside and Old way, new way answer the same questions with a named doubt behind them. Both are first in line if the grid grows. |

---

## 5. The 2 dresses

**Camera** and **Designed.** No dress history on file for image ads, so this is the default (MISSING: dress history). T1's UGC video suggests Lo-fi has been tried in video, which is one more reason to leave it out here.

---

## 6. The 12 cells

Code: `argument · type · dress · audience`

| # | Code | Idea (what's really in the frame) |
|---|---|---|
| 1 | A1 · Look inside · Camera · New | One daily pack torn straight across its top on a morning kitchen counter, next to car keys and a coffee mug. A small handful of green bears tipped into an adult palm. Three DM Mono tags point at the pack: "60+ ingredients", "6 g fiber", "methylfolate, not folic acid". *(Needs shoot items 2 and 6.)* |
| 2 | A1 · Look inside · Designed · New | Cream #FFF7DF layout. A sealed daily pack drawn as a cutaway, with a column beside it headed "in 1 pack" listing panel lines: vitamin C 93 mg, D3 20 mcg, B12 2.4 mcg, 6 g prebiotic fiber, 60+ ingredients. The vitamin and mineral count is left off. |
| 3 | A1 · Old way, new way · Camera · New | One kitchen shelf, two halves. Left: a half-used unbranded green powder tub with a crusted scoop, a shaker with dried green residue, a row of plain pill bottles. Right: the 28-pack pouch standing closed at its resealable top, one daily pack beside it. Objects only. *(Needs shoot item 5.)* |
| 4 | A1 · Old way, new way · Designed · New | A two-column morning to-do list in Work Sans. Old routine: "scoop, shake, rinse the shaker, swallow the pills", crossed out. New routine: the brand's "Rip. Tip. Enjoy." next to the pouch cut out from P1. |
| 5 | A1 · Checked fact · Camera · New | P2 (gummies in an adult hand) with one number in the chunky display font: 80% of surveyed users take it daily. A DM Mono source line: "brand survey of 3,000+ customers". |
| 6 | A1 · Checked fact · Designed · New | Deep forest #002C17 panel with the study set as a plain fact card: blood vitamin C +40.1% (2.7x placebo), folate +20.5% (2.9x placebo), 12 weeks, 120 adults, 2025, randomized and placebo-controlled. It says it measured absorption, nothing more. |
| 7 | A2 · Look inside · Camera · New | The Low Sugar pouch from P1 with one daily pack torn across its top in front. Tags: "6 g prebiotic fiber", "inulin", "Low Sugar", "pectin base, no gelatin". *(Needs shoot item 2; confirm the Low Sugar variant.)* |
| 8 | A2 · Look inside · Designed · New | A fiber-first label view. A huge "6 g" in the display font. Under it, the greens from the panel (kale, spinach, broccoli, beet) and a free-from row: gluten, dairy, tree nuts, peanuts, synthetic dyes, synthetic sweeteners. |
| 9 | A2 · Old way, new way · Camera · New | A bathroom cabinet shelf of tried-and-quit gut kit: an unbranded fiber-powder canister, a glass of cloudy, gritty fiber drink, an unbranded probiotic bottle. Beside it, one torn daily pack on a clean saucer with the bears inside. No body. *(Needs shoot item 5.)* |
| 10 | A2 · Old way, new way · Designed · New | A drawn split. Left: a tall glass of thick, clumpy fiber drink with the steps "stir, wait, chug". Right: a palm-sized pile of green bears with one step, "eat". |
| 11 | A2 · Checked fact · Camera · New | A breakfast table with the Low Sugar pouch closed at its top and one torn pack beside a mug. Overlay: 67% of surveyed users report better, more regular digestion. DM Mono source line. *(Needs the survey line's full wording.)* |
| 12 | A2 · Checked fact · Designed · New | A simple bar of 100 small bears on cream, 67 of them kelly green #007E40, labelled "67% of surveyed users: better, more regular digestion". The DM Mono footer names the survey (brand-reported, 3,000+ customers). |

**EMPTY cells:** none.

### Rules every cell follows
- Daily packs are torn only across the top. The pouch is never shown torn.
- No child, no generated customer or expert, no competitor, no partner marks.
- No body changing.
- No discount percentage, no star rating, no "21".
- Every survey number carries "of surveyed users".

---

## 7. Counts

| Group | Ads |
|---|---|
| Row A1 Habit | 6 |
| Row A2 Gut | 6 |
| Column Look inside | 4 |
| Column Old way, new way | 4 |
| Column Checked fact | 4 |
| Camera | 6 |
| Designed | 6 |
| **Total** | **12** |

---

## 8. Budget check

1. Read each group at about 20 purchases. Each ad counts once in its row and once in its column.
2. The 3 columns need 3 × 20 = **60 purchases**. That also covers the 2 rows, which need 40.
3. At the account's $34.51 per purchase: **about $2,070**.
4. At the median ad's $39.13: **about $2,350**.
5. A new audience may cost more. Past ads here ranged from $21 to $100 per purchase.
6. Aim for about 5 purchases per ad, read within about 3 weeks (see P1's fatigue).
7. Stage 4 rule: a group 25% or more better than the sprint's median cost per purchase is a winner. Anything closer is a tie.

---

## Gaps to fill later

- **MISSING: research.** The 20 reviews weren't included. They could add the parent and powder-quitter arguments and grow the grid.
- **MISSING: photos.**
  - Confirm P1 is Low Sugar.
  - Confirm P2's hand is an adult's.
  - Shoot list items 1–7 above. Cells 1, 3, 7 and 9 depend on them.
- **MISSING: source.**
  - The full wording of the "67% … digestion" survey line.
  - The survey's date and method.
  - The original review site and date for the 2 kept quotes.
- **MISSING: live offer.** One confirmed discount figure and its end date. Needed before any Offer column.
- **MISSING: dress history** for image ads.
- **MISSING: a real date** for an Occasion type, such as the birthday price cut or the next limited flavour.

**Approval 1:** do you approve this 12-ad plan as it stands? Or tell me what to change: arguments, types, dresses or cells. Once it's approved, I'll brief and prompt one pilot row in Stage 2.
```
