# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

This is a careful, honest plan: every cost figure is correct arithmetic from the CSV, two-way figures (discount %, 21 vitamins, star rating) are held back, risky claims are kept out, and the two EMPTY cells are marked with reasons. Its one real flaw is that rows C, D and E sit in the grid without the proof the skill requires (three buyers or a winning past ad), with the shrink deferred to later instead of done now, so the owner may approve a 48-ad grid built partly on hunches.

## Fix

In Step 2 and 'If something is missing', add: an argument that lacks 3 named buyers or 1 buyer plus a winning ad is dropped from the grid in Stage 1 and the grid shrunk now; it may not be kept in the grid with a note to verify later.

## Judge list

- Not met: Every reason to buy names three buyers, or one buyer and a past ad that beat your cost per sale.
  Row C: "A doubt the brand file records for the largest buyer group"; Rows D and E "must each be backed by 3 or more separate reviewers" later.
- Met: Every cell in the grid is either a real idea or marked EMPTY with the reason.
  "E3 OW · Camera | EMPTY. The only honest 'old way' here is generic gummy vitamins, and nothing is on file"; all other 48 cells have ideas.
- Met: The counts per row and column add up to the total.
  Rows 10+10+10+10+8 = 48; columns 10+8+10+10+10 = 48; "Camera: 24 ads. Lo-fi: 24 ads."
- Met: Read two cell ideas aloud. Each names something true about your product that a rival couldn't copy unchanged.
  C7 "Blood vitamin C up 40.1% (2.7x placebo)"; B2 "pack on a kitchen scale reading about 20 g... 6 g of it is prebiotic fiber".
- Met: It stopped at the approval and didn't start writing briefs.
  "Approval 1: do you approve this grid, or want changes? I'll start the Row A pilot only after a clear yes."

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
*No image tool is connected here, so I'll write the plan and, later, the prompts. I can't draw the pictures.*

# Sprout: 50-ad sprint, Stage 1 plan (for approval)

**Product in this sprint:** Sprout Original (Adults), shown as **Low Sugar** throughout. Gut-sensitive buyers are pointed to Low Sugar, and Sugar-Free upsets some stomachs.

**Kids is left out.** The store rules allow one product per sprint. There is also no Kids pouch photo, and Kids needs its own parent-facing rows. K1 ran at $34.92 per purchase, about the account's $34.51, so it is worth its own sprint later.

**Audience:** New to Sprout.

---

## 1. Photo list

| # | What it shows | Can it lead an ad? |
|---|---|---|
| 1 | Adult pouch on a soft gradient, gummies in front | **Yes, if** it has no added lettering beyond the pouch's own print. Please confirm the variant: Sugar-Free has a white burst. Low Sugar is needed. |
| 2 | Gummies poured into a hand | **Yes, if** the hand is clearly an adult's and there is no text. Please confirm whether a daily pack is visible. If it is, it must be torn straight across the top. |
| 3 | Cartoon-movie tie-in pouch | **No.** It carries licensed cartoon and partner marks. It is not used anywhere in the sprint. |

**MISSING: photos.** There are only 2 usable photos, so run `product-image-spec-writer`, then `get-a-full-product-photoshoot-from-phone-photos`, before Stage 2. Shot list:

- A single daily pack torn straight across the top, with gummies pouring into a palm and into a small bowl.
- The Low Sugar and Sugar-Free pouches side by side.
- The pouch open at its resealable top, with daily packs inside.
- All 28 packs laid out in a 4 x 7 grid.
- The ingredients panel, legible.
- Props for the old way, all unbranded:
  - a half-used greens powder tub and scoop
  - a dirty shaker
  - a fiber powder canister and a glass of clumpy water
  - 5 plain pill bottles

---

## 2. What is held back or kept out

**Held back until the brand confirms one live figure:**

| Item | Why it is held |
|---|---|
| "21 vitamins & minerals" | The site also says "20+" and "over 20". |
| First-order price | Shown as $29.99 on the product page and birthday banner, but $45.33 on the how-it-works page. |
| Every discount % | 49, 52, 55, 58 and 61 are all live at once. |
| Testing counts | 70 + 4 + 16 + 9 named, against "35 substances tested". |
| Star rating | 4.8, 4.75, 4.74 and 4.0 all appear. |
| "Trusted by 1M+" | No source on file. |
| "$1.26 vs $3.60" a serving | The comparison is dated. |

**Kept out (risky claims):**
- "Fix" or any treatment wording
- Weight loss or muscle
- Hair
- Energy or immunity
- The 30/60/90-day results timeline
- "Works", in the broad sense
- GLP-1
- The fiber "5 g" comparison
- "Less than 1% use the guarantee"

---

## 3. Past results (practice numbers)

The file has 10 rows covering 9 ads, because P1 is split into two 21-day windows.

| Ad | Cost per purchase |
|---|---|
| **Account** | **$21,500 / 623 = $34.51** |
| T1 Hot girl tummy | **$21.21** (beats the account) |
| P1 Too expensive, days 1–21 | **$26.79** (beats the account) |
| P1 Too expensive, days 22–42 | $76.92 (tired after 3 weeks) |
| H1 One step never skip | **$29.55** (beats the account) |
| K1 Fiber kids | $34.92 |
| F1 Fiber question | $39.13 |
| W1 Muscle weight loss | $39.13 (claim kept out) |
| S1 Trusted by 1M | $42.11 |
| P2 Dont pay full price | $50.00 (high clicks, low buying) |
| R1 Runner | $100.00 |

---

## 4. The 5 arguments

Each is written as `buyer | problem | what only this product does | proof`.

| Row | Argument | Why it qualifies |
|---|---|---|
| **A. Stick with it** | Quitter who wants to stick \| has quit powders, pill stacks and multis \| one pack a day you want to eat: rip, tip, no water, no shaker \| "95% of surveyed users take Sprout at least 4–6x per week with 80% taking daily" (brand survey, 3,000+ customers) | The brand file names it the top review theme ("I finally stuck with a supplement"). H1 ran at $29.55 against $34.51. |
| **B. Gut** | Gut-fix seeker \| bloating, irregularity, done with gritty fiber drinks \| 6 g prebiotic fiber in a gummy, Low Sugar \| "Supports digestion and gut health"; "67% of surveyed users experienced better, more regular digestion" | T1 ran at $21.21, the best in the account. The wording moves from "fix" to "supports". |
| **C. Enough in it** | Powder switcher \| "A gummy can't hold enough to replace my powder" \| 60+ ingredients and 6 g fiber per pack: about 100% DV of the vitamins, about 25% of the minerals \| label; 2025 randomized, double-blind, placebo-controlled study of 120 adults over 12 weeks: blood vitamin C +40.1% (2.7x placebo), folate +20.5% (2.9x placebo) | A doubt the brand file records for the largest buyer group (about 40%). |
| **D. On the way out the door** | Busy parent, buying for themselves \| no time for their own routine \| a sachet you grab and eat anywhere \| format facts: 1 pack, about 20 g, no water or mixing; ships within 24 h, arrives in 3–5 days on average | Busy-parent group (about 25%), with the quote "So easy to grab and eat on my way to the billion things I have to do as a mom." |
| **E. Not just candy** | Skeptic, a parent or a quitter \| "Is this just candy?" \| pectin base, methylfolate (not folic acid), B12 as methylcobalamin, no synthetic dyes or sweeteners \| science page and ingredients panel; NSF, GMP and FDA-registered facilities in the US and Canada | A doubt the brand file records for parents. This is the weakest row. |

**MISSING: research.** The 20 reviews were not attached. Only the brand file's summaries and quotes were. Before Stage 2:
- Rows **D and E** must each be backed by 3 or more separate reviewers.
- If either fails, drop **E first**, then D. That shrinks the grid to 4 x 4 x 2 = 32 ads.

---

## 5. The 5 ad types and why

| Question | Type | Proof that allows it |
|---|---|---|
| What is it? | **Look inside** | Every label comes from the ingredients panel or the science page. |
| Is it for me? | **Old way, new way** | Uses the brand's own named old ways: a powder tub and shaker, a shelf of pill bottles. Shown as objects only, all unbranded. |
| Is it for me? | **In use** | Photo 2, plus the facts on how the pack opens: torn straight across the top, poured into a palm or bowl. |
| Can I believe it? | **Checked fact** | The study, the survey (always "of surveyed users") and label numbers. Each comes with its source and what it counts. |
| Why now? | **The offer** | Only the terms that agree everywhere they appear. See the box below. |

**Why other types were left out:**
- **Product alone:** there is one pouch photo, so it would make 10 near-copies.
- **Their words:** the quotes on file have no named source.
- **The moment:** there is only one buyer quote per moment.
- **The occasion:** there is no real date.

**Offers used**, all stated without a %:
- Free shipping on the first order.
- 30-day money-back guarantee, **first order only**.
- Renews at $49.99 every 4 weeks, which is $1.78 a day.
- Buy 2, save $5.
- HSA/FSA eligible through a third-party service.

**MISSING: live offer.** The brand needs to confirm one first-order price and its start and end dates. No urgency is used anywhere. Easy cancelling is never promised.

**Audience rule:** there is 1 "Why now?" type out of 5, so price-led ads are 10 of 48.

## 6. The 2 dresses

**Camera** and **Lo-fi**.

- The CSV doesn't log dress. Judging by their opening lines, the past image ads (P1, P2, S1, W1, R1) look like Designed text-led offer cards. The only phone-made ad was a video (T1).
- So for images, Camera and Lo-fi are the least tested.
- Lo-fi is always our own design: hands and objects, with no customer voice and no implied person.
- If the past images were actually photos, swap Lo-fi for Designed.

---

## 7. The 48 cells

Codes are `type · dress · New`.

Type abbreviations used in the cell tables:
- LI: Look inside
- OW: Old way, new way
- IU: In use
- CF: Checked fact
- OF: The offer

**Row A: Stick with it**

| Cell | Idea |
|---|---|
| A1 LI · Camera | One daily pack torn straight across the top, beside a coffee mug on a cream counter, bears spilling out. Three callouts: "1 pack a day", "about 20 g", "no water, no mixing". |
| A2 LI · Lo-fi | Phone shot from above of the pouch open at its resealable top, daily packs fanned inside. A sticky note reads "28 packs = 4 weeks". |
| A3 OW · Camera | The back of a pantry shelf: a half-used unbranded greens tub with a dried crust on the scoop. The Sprout pouch sits at the front of the shelf. |
| A4 OW · Lo-fi | Phone shot of a shaker in the sink with green residue, next to one torn Sprout pack on the drying rack. That's the cleanup chore that's gone. |
| A5 IU · Camera | Adult hand pouring bears from a top-torn pack into a palm, right beside the coffee maker. The pack lives where the morning habit already is. |
| A6 IU · Lo-fi | Phone shot of an office desk: laptop, a top-torn pack, a small handful of bears in an open palm. |
| A7 CF · Camera | Pouch on the gradient, with "80% of surveyed users take it daily". Source line: brand survey of 3,000+ customers. |
| A8 CF · Lo-fi | An index card propped against a torn pack: "95% of surveyed users take it 4–6x a week". Same source line. |
| A9 OF · Camera | Pouch, with "28 days to see if it sticks". Terms: 30-day money-back on the first order only; renews at $49.99 every 4 weeks. |
| A10 OF · Lo-fi | Phone shot of all 28 packs in a 4 x 7 grid on a table, one torn. Terms: free shipping on the first order. |

**Row B: Gut**

| Cell | Idea |
|---|---|
| B1 LI · Camera | Macro of a torn Low Sugar pack and bears. Callouts: "6 g prebiotic fiber", "inulin", "pectin base, no gelatin". |
| B2 LI · Lo-fi | Phone shot of one pack on a kitchen scale reading about 20 g, with a note: "6 g of it is prebiotic fiber". |
| B3 OW · Camera | A toiletry bag with an unbranded fiber powder in a leaking zip bag, beside a stack of sealed Sprout packs. That's travelling with fiber, old and new. |
| B4 OW · Lo-fi | Phone shot of a glass with undissolved fiber clumps at the bottom, next to one torn pack and no glass. |
| B5 IU · Camera | Adult hand pouring bears into a small bowl at a sunny kitchen table, with the Low Sugar pouch behind. |
| B6 IU · Lo-fi | Phone shot of a top-torn pack sticking out of a jeans pocket, one bear between two fingers. There's no shaker to carry. |
| B7 CF · Camera | Low Sugar pouch on the gradient: "6 g prebiotic fiber per pack", with "Supports digestion and gut health". Source: label. |
| B8 CF · Lo-fi | A handwritten card: "67% of surveyed users had better, more regular digestion". Source: brand survey of 3,000+ customers. |
| B9 OF · Camera | Low Sugar pouch, answering "Will this upset my stomach?": "Try Low Sugar. 30-day money-back on the first order only." |
| B10 OF · Lo-fi | Phone shot of the Low Sugar and Sugar-Free pouches side by side, with a hand-drawn arrow to Low Sugar: "gut-sensitive? start here". Terms: free shipping on the first order. |

**Row C: Enough in it**

| Cell | Idea |
|---|---|
| C1 LI · Camera | Macro of a small handful of bears. Callouts: vitamin C 93 mg, D3 20 mcg, B12 2.4 mcg, "about 100% DV vitamins, about 25% minerals, per pack". |
| C2 LI · Lo-fi | Phone shot of the ingredients panel, with the greens list highlighted in pen: kale, spinach, spirulina, chlorella, wheatgrass, broccoli, beet. |
| C3 OW · Camera | A level scoop of green powder beside a small handful of bears. Old side: "1 scoop + water + shaker". New side: "1 pack, 60+ ingredients". |
| C4 OW · Lo-fi | Phone shot of a cobbled-together shelf of 5 plain unlabelled bottles, with the Sprout pouch beside it. |
| C5 IU · Camera | Adult hand holding a full palm of bears from one pack, showing the serving is a handful, not one gummy. |
| C6 IU · Lo-fi | Phone shot of one bear pinched between thumb and finger, with a sticky note: "per pack, not per gummy: 60+ ingredients". |
| C7 CF · Camera | Pouch, with "Blood vitamin C up 40.1% (2.7x placebo)". Source line: 2025 randomized, double-blind, placebo-controlled study, 120 adults, 12 weeks. |
| C8 CF · Lo-fi | An index card: "Folate up 20.5%, 2.9x placebo", same study, "as methylfolate". |
| C9 OF · Camera | Pouch, with "$1.78 a day on subscription, 60+ ingredients". Terms: renews at $49.99 every 4 weeks. |
| C10 OF · Lo-fi | Phone shot of a shopping-list notepad with "greens powder, multi, fiber" crossed out and "Sprout: $1.78/day on sub" written in. Terms: free shipping on the first order. |

**Row D: On the way out the door**

| Cell | Idea |
|---|---|
| D1 LI · Camera | One sealed pack beside car keys and a lip balm for scale. Labels: "about 20 g", "no water", "28 per pouch". |
| D2 LI · Lo-fi | Phone flat lay of an adult tote's contents: keys, sunglasses, a school-pickup lanyard and one torn pack. No child anywhere. |
| D3 OW · Camera | A passenger footwell with a leaking unbranded shaker rolled under the seat, against a single Sprout pack in the cup holder. |
| D4 OW · Lo-fi | Phone shot of a fridge whiteboard with "mix greens drink" crossed out, and a Sprout pack held on by a magnet. |
| D5 IU · Camera | Adult hand tipping bears into a palm at the front door, keys in the same hand and a backpack on the hook. |
| D6 IU · Lo-fi | Phone shot from a folding chair at a sports-field sideline: a top-torn pack, bears in a palm, coffee in the cup holder. Field only, no people. |
| D7 CF · Camera | Pouch, with "Ships within 24 hours, arrives in 3–5 days on average". Source: site shipping terms. |
| D8 CF · Lo-fi | A sticky note on the pouch: "Rip. Tip. Enjoy. 1 pack, about 20 g, no water." Source: product page. |
| D9 OF · Camera | Two adult Low Sugar pouches side by side: "Buy 2, save $5", one for each adult on the order. |
| D10 OF · Lo-fi | Phone shot of a mailer box on a doormat, opened, with the pouch inside. Terms: free shipping on the first order. |

**Row E: Not just candy**

| Cell | Idea |
|---|---|
| E1 LI · Camera | Macro of matte green bears. Callouts: "pectin, no gelatin", "methylfolate, not folic acid", "B12 as methylcobalamin", "no synthetic dyes". |
| E2 LI · Lo-fi | Phone shot of a pen-ticked checklist next to the pouch: free from gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners, synthetic dyes. |
| E3 OW · Camera | **EMPTY.** The only honest "old way" here is generic gummy vitamins, and nothing is on file about what they contain. |
| E4 OW · Lo-fi | **EMPTY.** Same reason. |
| E5 IU · Camera | Adult fingers holding one opaque, soft-matte bear up to window light, with a top-torn pack in the other hand. |
| E6 IU · Lo-fi | Phone shot of one pack's handful in a small ceramic bowl beside a planner. Only the pack's portion is shown, no candy dish. |
| E7 CF · Camera | Pouch, with "Made in NSF, GMP and FDA-registered facilities in the US and Canada". Never "FDA-approved". |
| E8 CF · Lo-fi | An index card: "Folate: 400 mcg DFE, as methylfolate, not folic acid". Source: science page. |
| E9 OF · Camera | Pouch, with "Vegan. Methylfolate. No synthetic dyes." Terms: free shipping on the first order. |
| E10 OF · Lo-fi | Phone shot of the pouch with a hand-lettered tag: "HSA/FSA eligible", plus the fine print "through a third-party service". |

**Recommended pilot row: A (Stick with it).** It has the open lane in the ads, a result that beat the account, and the cleanest proof.

---

## 8. Counts

| | Look inside | Old way | In use | Checked fact | Offer | **Row** |
|---|---|---|---|---|---|---|
| A Stick with it | 2 | 2 | 2 | 2 | 2 | **10** |
| B Gut | 2 | 2 | 2 | 2 | 2 | **10** |
| C Enough in it | 2 | 2 | 2 | 2 | 2 | **10** |
| D Out the door | 2 | 2 | 2 | 2 | 2 | **10** |
| E Not just candy | 2 | 0 | 2 | 2 | 2 | **8** |
| **Column** | **10** | **8** | **10** | **10** | **10** | **48** |

- Camera: 24 ads. Lo-fi: 24 ads.
- The Old way column and Row E are read on 8 ads each.

## 9. Budget check

| Grid | Ads | Purchases needed | Budget |
|---|---|---|---|
| 5 x 5 x 2 (this plan) | 48 | about 100 | about 100 x $34.51 = **about $3,450** |
| 4 x 4 x 2 (drop Row E) | 32 | about 80 | about $2,760 |
| 3 x 3 x 2 | 18 | about 60 | about $2,070 |

- **About 100 purchases** reads all 5 rows and all 5 columns at about 20 each.
- These are practice numbers, and a new audience usually costs more per purchase. Treat these budgets as the floor.
- P1 tripled in cost after 3 weeks. Plan to read groups within about 3 weeks.

---

**Approval 1:** do you approve this grid, or want changes? I'll start the Row A pilot only after a clear yes. Before Stage 2 I'll need:
- the 20 reviews, to confirm rows D and E
- the confirmed first-order price and offer dates
- the missing photos
```
