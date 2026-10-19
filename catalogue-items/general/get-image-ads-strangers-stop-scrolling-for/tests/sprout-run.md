# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 1 of 6 met. Invented facts: 0.

The buyer sheets, argument cuts, risky-claim screening and all the cost-per-purchase arithmetic are accurate and honest, so the owner gets a trustworthy foundation. But the run halted at Stop 1 without proposing picks, mapping the set, or drafting concepts, so there is nothing to approve visually and most of the deliverable is empty.

## Fix

In Step 2 and the output shape, add: 'Stop 1 does not end the run. Propose the picks, then fill THE SET ON THE MAP and one CONCEPT per ad, all marked WAITING, so the owner can approve or swap in one pass.'

## Judge list

- Met: Every insight marked USED has three buyers, or one buyer and a past ad that beat cost per sale
  "Bloating: used on 1 review (10) plus T1's result"; powders 1,3,4,6; regularity 7,8,9,10,11; taste 2,6,12,14,16. T1 $21.21 beats $34.51.
- Not met: No two ads share both an ad type and a reason
  "No shared code and argument | Not checked yet. There are no codes until concepts exist." No plan to read.
- Not met: Cover the headline; you can still tell what each picture is about
  "no concepts, pictures or words exist yet" — nothing to check.
- Not met: Each headline is 7 words or fewer, counts shown
  Ad table: "None yet. This fills in after Stop 1 and Stop 2." No headlines or counts.
- Not met: Cover the logo; colours, shapes and type still say the brand
  "Ad checks (full size, type, contrast, safe zone, covered logo) | Not run."
- Not met: Picture never shows a result the facts don't state
  No pictures or picture descriptions produced; rules were named ("never 'fix'") but no concept exists to check.

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
# Sprout: stranger image ads, batch of 4 (4:5 and 9:16)

**Status: stopped at Stop 1.** The skill says the owner picks the arguments, so no concepts, pictures or words exist yet. The ad table below is empty until you pick 4 arguments and approve the concepts at Stop 2.

## Ad table

| File | Code | Buyer | Argument | Headline words |
|---|---|---|---|---|
| None yet. This fills in after Stop 1 and Stop 2. | | | | |

---

## Past results

These are practice numbers. Cost per purchase (CPP) is spend divided by purchases.

| Ad | Spend | Purchases | CPP | vs account $34.51 |
|---|---|---|---|---|
| T1 Hot girl tummy | $4,200 | 198 | $21.21 | Beats |
| H1 One step never skip | $1,300 | 44 | $29.55 | Beats (see note) |
| P1 Too expensive, days 1–21 | $3,000 | 112 | $26.79 | Beats |
| P1 Too expensive, days 22–42 | $3,000 | 39 | $76.92 | Worse |
| P1 combined | $6,000 | 151 | $39.74 | Worse |
| K1 Fiber kids | $2,200 | 63 | $34.92 | Level, does not beat |
| F1 Fiber question | $1,800 | 46 | $39.13 | Worse |
| W1 Muscle weight loss | $900 | 23 | $39.13 | Worse, and the claim is unsupported |
| S1 Trusted by 1M | $1,600 | 38 | $42.11 | Worse |
| P2 Don't pay full price | $2,500 | 50 | $50.00 | Worse |
| R1 Runner | $1,000 | 10 | $100.00 | Worse, below 20 purchases |
| **Account** | **$21,500** | **623** | **$34.51** | |

What this means:
- **T1 has the clearest lead.** It has 198 purchases and costs 39% less per purchase than the account.
- **H1's lead is small.** It is 14% better, which is about the size of chance swing at 44 purchases. Treat it as a weak result.
- **P1 wore out.** Its cost per purchase nearly tripled in its second 21 days, and clicks halved.
- **Offer-led ads (P1 combined, P2, S1) all lost to the account.** This supports keeping the offer out of a stranger batch.

---

## Buyer sheets

The rule: an insight is **used** when 3 or more separate reviews say it, or 1 review says it and an ad on that argument beat the account. Anything less goes on the hunch list and stays out of copy.

### 1. The quitter who wants to stick

- **Wants:** one habit that lasts.
- **Tried, and why it let them down:**
  - Greens powders were "gritty/chalky" (3), "choking on" it (4), and meant cleaning "a shaker bottle or extra dishes" (6).
  - Separate gummy stacks (5).
  - **Used** for powders (reviews 1, 3, 4, 6). The stack point is a hunch (review 5 only).
- **Moment that makes them look today:** another half-used tub of powder, and the shaker in the sink (1, 3, 4, 6).
- **Their words:**
  - "the one thing I've been able to stick to" (1)
  - "I WANT to take [Sprout] and don't forget" (2)
  - "easier for me to manage" (5)
  - "not having to clean a shaker bottle" (6)
- **Habit insight: used.** Reviews 1, 2, 5, 6 and 15 say it, and H1 beat the account (weakly).
- **Doubts:**
  - "A gummy can't hold enough." This comes from the brand's buyer profile, not a review, so it is a hunch and stays out of copy.
  - "They are expensive" (retailer).

### 2. The gut-fix seeker

- **Wants:** to feel normal.
- **Tried:** fiber powders and probiotics. This is from the brand's buyer profile, not a review, so it is a hunch.
- **Moment:** irregularity that has gone on for years (7, 8, 9, 11).
- **Their words:**
  - "normal for the 1st time in 15 years" (7)
  - "do their job, but not aggressively" (8)
  - "the solution to my problems with regularity" (9)
  - "Feel lighter, less bloated" (10)
- **Insights:**
  - **Regularity: used** (reviews 7, 8, 9, 10, 11).
  - **Bloating: used** on 1 review (10) plus T1's result.
- **Doubts:**
  - "Will this upset my stomach?"
  - The Sugar-Free gummy "worked too well". That is 1 review, so point this buyer to Low Sugar and don't build copy on it.
- **Rules for this buyer:**
  - Review 7 is told as one buyer's story only.
  - The GLP-1 reviews (11, 14) stay out. There are only 2, and the brand rule says not to repeat them.

### 3. The busy parent

- **Wants:** no fight at the table, and something easy for themselves.
- **Their words:**
  - "So easy to grab and eat on my way to the billion things" (15)
  - "the only one they love eating. They think it's a treat." (16)
  - "my kids love them too" (17)
- **Insights:**
  - **Kids love it: hunch.** Only reviews 16 and 17 say it, and K1 only matched the account.
  - **Easy for the parent:** this folds into the habit insight above.
- **Doubts:** "Is this just candy?" and "Is the sugar okay for kids?" Neither is in the reviews.

### 4. The price doubter

Not a stranger, because they already know the brand. They belong in a ready-buyer batch made with "Get one image ad ready to make". The subscription-trap worry appears in reviews 17 and 20, so it is a hunch, and no ad may promise an easy cancel.

### Cross-buyer: taste

- **Tastes like a treat: used.** Reviews 2, 6, 12, 14 and 16 say it ("tastes like fruit snacks I ate as a kid", 12).
- **Counter-doubt:** reviews 18 and 19 say the taste was off at first.

### Hunch list (stays out of copy)

- Replacing a pill or gummy stack (5)
- Energy (13, 14)
- GLP-1 (11, 14)
- Kids love it (16, 17)
- Subscription trap (17, 20)
- "A gummy can't hold enough"
- Concern about quality or testing (no reviews)

---

## Arguments, with cuts

Format: buyer | the problem | what only this product does | the proof.

### Kept: pick 4 at Stop 1

| # | Argument | Fits type |
|---|---|---|
| **A1** | Quitter \| chalky powder plus a shaker to clean \| 1 torn pack of gummies, no water or shaker, holding 60+ ingredients, 21 vitamins and minerals, and 6 g fiber \| Reviews 1, 3, 4, 6; product page | Old way, new way |
| **A2** | Quitter \| supplements never stick \| one pre-portioned daily pack, 28 to a pouch, that you want to eat \| Reviews 1, 2, 5, 6, 15; H1 result; "95% of surveyed users take it 4–6x per week, 80% daily" | In use (gummies-in-hand photo) |
| **A3** | Gut \| irregularity \| 6 g prebiotic fiber plus 21 vitamins and minerals in one gummy pack, "supports digestion and gut health" \| Reviews 7, 8, 9, 10, 11; "67% of surveyed users" | Look inside, or Their words (review 7, word for word) |
| **A4** | Gut \| bloating ("hot girl tummy") \| the same 6 g prebiotic fiber, worded as "supports", never "fix" \| Review 10 plus T1 result | The moment, Lo-fi |
| **A5** | Quitter \| "is a gummy actually doing anything?" \| own 12-week placebo-controlled study: blood vitamin C up 40.1%, folate up 20.5% \| Science page | Checked fact |

Notes on the kept arguments:
- **A3 and A4 overlap.** They share the same answer, but the problems differ, so they count as two arguments. Picking both puts 2 of 4 ads on the gut buyer. One is enough unless you want to test this buyer twice.
- **A4 needs a rival-proof fact.** Bloat relief is the TikTok rival's angle, so the ad must carry "6 g prebiotic fiber + 21 vitamins and minerals" or a rival could run it word for word.
- **A5 limits.** The headline states the study result only. The doubt is a hunch and can't be the hook. The ad must not say "works", "energy" or "immunity".

### Cut

| Argument | Why |
|---|---|
| Taste alone ("tastes like a treat") | Any rival gummy could say it word for word. Folded into A1 and A2 as a support line. |
| Kids: picky eaters, greens without the fight | Hunch (2 reviews, K1 only level), and MISSING kids pouch photo |
| Kids: "Methylfolate, not folic acid" | No buyer research behind it |
| Third-party tested for 70 pesticides and 4 heavy metals | No buyer research. Can return as a support line on A5. |
| Replaces a shelf of separate bottles | Hunch (1 review, no result) |
| Energy | Hunch, and the brand's study didn't test energy |
| Fills gaps on a GLP-1 | Hunch, and drug-adjacent. The brand rule says customers may say it, the brand may not. |
| Support muscle while you lose weight | No evidence on file, and W1 lost to the account |
| $1.78 a day vs $2.63 for a big-name powder | Price doubter isn't a stranger. A "Why now?" ad isn't allowed in a batch of 4, and the comparison needs a fresh check. |

### Spread rules your picks must fit

- **No offer ads.** "Why now?" types are capped at 1 in 5, so a batch of 4 gets none: no discount, no "61% off", no gifts.
- **Mostly "What is it?" and "Is it for me?" types**, with at most 1 "Can I believe it?" ad.
- **3 types and 2 dresses** are only required at 6 or more ads. Aim for 3 types and 2 dresses anyway, so results can be read by type.
- **No two ads may share a code and an argument.**

---

## MISSING

- **Product view: the torn daily pack.** The pack opens straight across its top with gummies pouring out ("Rip. Tip."). This is the brand's core act, and it can't be drawn without a real photo. Until there is one, ads show only the pouch front or gummies in a hand.
- **Product view: the kids pouch.** This blocks every kids ad.
- **Product view: the Sugar-Free pouch and the limited flavours.** Not needed for this batch.
- **Product view: a person using it in a real place.** In use is limited to the hand photo.
- **Proof: grams of sugar.** Not captured, so no ad can make a sugar claim.
- **Proof: the brand's survey (3,000+ customers).** It is brand-reported and is always quoted with "of surveyed users".

---

## Check record

| Check | Result |
|---|---|
| Every used insight has 3 reviews, or 1 review plus a result | Pass. Bloating rests on 1 review plus T1. The habit result (H1) is weak. |
| Hunches out of copy | Pass. Ten hunch items are listed. |
| "Why now?" types at most 1 in 5 | Planned at 0 of 4 |
| 3 types and 2 dresses | Not required at 4 ads. Aimed for at Stop 2. |
| No shared code and argument | Not checked yet. There are no codes until concepts exist. |
| Risky claims screened | Not used: "fix", weight loss, energy, immunity, "works", 4.8 stars, "per gummy". All are excluded from the kept arguments. |
| Stop 1 | **Pending: owner picks 4 of A1–A5.** |
| Stop 2 | Not reached. Concepts and the first picture of each dress come after Stop 1. |
| Ad checks (full size, type, contrast, safe zone, covered logo) | Not run. There are no ads yet. |
```
