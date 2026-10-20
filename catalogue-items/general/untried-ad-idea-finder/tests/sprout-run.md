# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, well-sourced gap map: every cost-per-sale and revenue figure is arithmetic on the CSV, every quote traces to a review or page, and the five ideas sit in genuinely different cells with real offers and the first-order guarantee limit stated. The owner can brief Idea 1 straight away, with the right warnings to recheck prices and fix the page's Us vs Them numbers first.

## Judge list

- Met: The first line grades the evidence the map rests on.
  "Evidence grade: Mixed. The Meta Ad Library ... is observed ... The 9-ad export ... is measured"
- Met: Nothing is called a winner without numbers and dates; 'still running' isn't a win.
  "Won: $21.21/sale, 198 sales"; observed ads marked "Running. Observed."; missing calendar dates flagged in CHECKS MISSED.
- Met: Each idea fills a different gap and has its own test question.
  Gaps 1–5 are distinct cells (M1×L3, M8×L5, M3×L2, M2×L3, M6×L4); tests differ (side by side vs percent, terms, demo vs line, label proof, order size).
- Met: Every proof named is in what you gave it; one review number checked.
  "80% of surveyed users take it daily ... 3,000+ customers" matches brand.md survey; review 3 "$94 a month ... gritty/chalky" matches reviews.md.
- Met: Who it's for and what they gain show in the first second of every idea.
  Each idea has a who/gain link table; e.g. Idea 3 "0–1s ... On screen: 'The supplement you'll actually stick with.'"
- Met: Ideas use only the brand's claims, prices and offers; side by side shows a row where the other wins.
  "Keep the guarantee row, where the powder wins: 90 days against 30 days, first order only"; offers are $29.99 w/ text sign-up, $49.99 renewal, Buy 2 Save $5.

## What went in

```text
Evidence: the brand's ad library page (sprout/ads.md: 15 live
headlines, copies live, the mix of the 40 newest ads) and
practice results for 9 ads (sprout/ad-results.csv).
Brand file: sprout/brand.md and sprout/product-page.md.
Buyers: the four in the brand file. Reviews: sprout/reviews.md.
Competitors: the five described in the brand file.
People on camera: a paid former pro athlete only. No founder
story on file. Formats: any.

[attached: sprout/brand.md, sprout/reviews.md, sprout/ads.md, sprout/product-page.md, sprout/ad-results.csv]
```

## What came out

```text
# ad-gap-map.md

**Evidence grade:** Mixed. The Meta Ad Library (sprout/ads.md, pulled 30 Sept and 4 Oct 2026) is **observed**: it shows what is running, never results. The 9-ad export (sprout/ad-results.csv, which you call practice results) is **measured**: spend, clicks, purchases and revenue by ad, with days live. MISSING: calendar start and end dates for the export, so it cannot be lined up against the Ad Library dates. Measured calls use this rule: **won** means cost per sale is below the set median ($39.13), **lost** means above it, and **too little to tell** means fewer than 20 sales. No other rule was given.

---

## 1. Record

Moment codes (M1 to M13) are defined in Lens 1. Knowledge levels (L1 to L5) are defined in Lens 3.

| # | Headline (copies live) | Moment | Value led with (layer) | Level | Opening | Format | Product | Proof leaned on | Result (grade) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | "'Sprout is too expensive': here's 61% off…" (15+) | M7 price check | Save money (practical) | L4 | Curiosity (objection quoted) | image | Adults Original | Offer, objection in buyer's words | **P1 days 1–21: won** ($26.79/sale, 112 sales). **Days 22–42: lost** ($76.92/sale, 39 sales). Measured. |
| 2 | "Don't Pay Full Price…(61% off inside)" (8+) | M7 | Save money (practical) | L5 | Curiosity | image | Adults | Offer | **Lost**: $50/sale, 50 sales; 5,569 clicks but 0.90% bought. Measured. |
| 3 | "Get up to 61% OFF + 4 FREE gifts: online exclusive" (10) | M7 (seen on a store shelf) | Save money (practical) | L5 | Gain | not known, ask | Adults | Offer, gifts | Running. Observed. |
| 4 | "Trusted by 1M+: Take 61% OFF" (4) | M7 | Belong, save (practical) | L4 | Proof first (a number) | image | Adults | "1M+" customers (brand-reported) | **Lost**: $42.11/sale, 38 sales. Measured. |
| 5 | "We're Lowering Our Prices 🔥" (1) | M7 | Save money (practical) | L4 | News | not known, ask | Adults | Birthday price cut | Running. Observed. |
| 6 | "Fix the Hot Girl Tummy" (5) | M4 bloated | Relief (feeling) | L2 | Gain (pain in slang) | video 28s UGC | Adults | not known, ask (UGC person) | **Won**: $21.21/sale, 198 sales, the best in the set. Measured. Uses the risky word "Fix". |
| 7 | "Struggling to Get Enough Fiber?" | M4 | Easy fiber (practical) | L2 | Curiosity (question) | carousel | Adults | 6 g fiber (label) | At the median: $39.13/sale, 46 sales. No call. Measured. |
| 8 | "Nutrition for Healthy Hair" (6) | M10 hair (inferred) | Look good (life) | L2 | Gain | not known, ask | Adults | none on file for hair | Running (all made 2 Oct). Observed. Risky claim. |
| 9 | "Support Muscle While You Lose Weight" (1) | M11 GLP-1 / weight loss | Body goal (life) | L2 | Gain | image | Adults | none on file | At the median: $39.13/sale, 23 sales, 14 days. No call. Measured. **Unsupported claim.** |
| 10 | "The Daily Nutrition Every Runner Forgets" (2) | M9 runner (inferred) | Identity (life) | L1 | Curiosity | image | Adults | none | **Too little to tell**: 10 sales, $100/sale. Measured. |
| 11 | "Perks That Really Pile Up" (7) | M12 member | Savings, a minor sense of superiority (practical, feeling) | L5 | Gain | not known, ask | VIP membership | Offer | Running. Observed. |
| 12 | "One Step I Never Skip" (1) | M3 daily slot | Sticking with it (life) | L2 | Curiosity (first person) | video 20s | Adults | not known, ask | **Won**: $29.55/sale, 44 sales, 16 days. Measured. |
| 13 | "He Asked What Day It Was. I Handed Him a Gummy." (1) | M3 (scene) | not known | L1 | Curiosity (scene) | not known, ask | Adults | none | Running. Observed. |
| 14 | "Fiber Kids Won't Fight" | M5 picky eater | No fight at the table (feeling) | L2 | Gain | video 15s | Kids | 6 g fiber | **Won**: $34.92/sale, 63 sales. Measured. |
| 15 | "Methylfolate, Not Folic Acid" | M5 | Peace of mind (feeling) | L3 | News (a fact) | not known, ask | Kids | Why it's made this way | Running. Observed. |
| — | Kids: tie-in fun / "veggies they won't eat" / "gut happy 💩" / "Lemon Aid Stand is open" | M5 | Fun, ease (feeling) | L2 to L4 | News, gain | not known, ask | Kids, limited flavours | Flavour news | Running. Observed. |
| — | "30 Days Of [fitness app], Free" / "Perfect Supplement for Weight Loss Support" | M7 / M11 | Gift / body goal | L5 / L2 | Gain | not known, ask | Adults | Partner gift / none | Running. Observed. Weight-loss line is risky. |
| — | Main text A: "$29.99… +$5 off for every extra person" | M7, M6 (thin) | Save money | L5 | Gain | not known, ask | Adults (+ extra person) | Label numbers, "third-party tested", **"probiotics" (an error: the product holds prebiotic fiber, no probiotics)** | Running. Observed. |
| — | Main text B: "Feeling off in your gut lately?" | M4 | Relief | L2 | Curiosity | not known, ask | Adults | 6 g fiber | Running. Observed. |

**Patterns**
1. **Offer ads fade, and a high click count does not mean sales.** P1 kept the same $3,000 spend, but its cost per sale went from $26.79 (days 1–21) to $76.92 (days 22–42). P2 drew the most clicks in the set, yet only 0.90% of those clicks bought. Measured.
2. **Pain, habit and kids ads sold cheapest, and brought bigger orders.** T1 cost $21.21 a sale, H1 $29.55 and K1 $34.92. The offer ads (P1 overall, P2, S1) cost $39.74 to $50 a sale. Revenue per order was $42 to $49 for the first group and $31 to $34 for the offer ads. Measured, but calendar dates are MISSING.
3. **The ads and the page show different discounts.** Every ad says 61% off. The page shows 52%, 55%, 49% or 58%, depending on where you land. This may explain P2's low buy rate. That is a hypothesis, observed from the ads and page, not measured.

---

## 2. Proof on hand

| Kind | On file (source) | Past ads leaned on it? |
|---|---|---|
| Showing it work | The pack tears straight across the top and the gummies pour into a palm ("Rip. Tip. Enjoy.", brand.md product rules). This can be filmed with hands only. No proof of effects can be shown. | not known, ask (formats not captured beyond the 9 rows) |
| Customer's own words | Reviews 1–20 (reviews.md). Most are hand-picked on the brand site. 9 and 10 are from a retailer, 20 from a review site. | Thin. #1 quotes an objection, not a review. T1's UGC script is not known. |
| Number with a source | Label: 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber. 2025 study (12 weeks, 120 adults, placebo-controlled): blood vitamin C +40.1%, folate +20.5%. Survey (brand-reported, 3,000+ customers, after 3 months): 95% take it 4–6x a week, 80% daily, 67% report better digestion. Testing: 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial, outside lab Sept 2026. | Yes: label numbers (#3, F1, main text). **Not used: the study and the survey.** |
| Side by side with the old way | Us vs Them on the page: $1.26 vs $3.60 per serving (dated, recheck). Competitor research: a big-name greens powder at about $79 a month ($2.63 a serving), Sept–Oct 2026. Reviews 3, 4, 6: "$94 a month", "gritty/chalky", "choking", "clean a shaker bottle". | **None** |
| Why it's made this way | Pectin base, vegan. Methylfolate, B12 as methylcobalamin. One flat daily pack, no water or mixing. Third-party tested. | Kids only (#15) |
| Safe yes | 30-day money-back, **first order only**. "Pause Or Cancel Any Time" (site words). Renewal shown as "$49.99 each 4 weeks". HSA/FSA via a third-party service. | **None in headlines.** "Third-party tested" appears in one main text. |

---

## 3. Lens 1: moments

| Code | Moment (as a situation) | Prompt | Source | Coverage |
|---|---|---|---|---|
| M1 | Quitting the greens powder: gritty, pricey, a shaker to rinse | why | Reviews 3, 4, 6 | **Open** |
| M2 | Clearing a shelf of separate bottles | with what else | Review 5 | **Open** |
| M3 | The daily slot: grab a pack on the way out | when / where | Reviews 2, 15; review 1 on consistency | Thin (H1, #13) |
| M4 | Bloated or irregular, wanting to feel normal | how they feel | Reviews 7–10 | Covered (T1, F1, main text B) |
| M5 | The picky eater at the table | with whom | Review 16 | Covered (K1, #15, kids lines) |
| M6 | The parent buying for herself and the kids in one go | with whom | Reviews 15, 17 | Thin (one main text: "+$5 per extra person") |
| M7 | Price check, seen on a store shelf: "too expensive" | how they feel | Retailer: "They are expensive"; brand.md buyer 4 | Covered heavily |
| M8 | Wary of subscriptions on a first order | how they feel | Review 17 ("a trap"), review 20 | **Open** |
| M9 | Training or running | while doing what | inferred: check before briefing | Covered (R1, too little to tell) |
| M10 | Hair and beauty | why | inferred: check before briefing | Covered (#8, observed) |
| M11 | On a GLP-1, eating less | with what else | Reviews 11, 14 | Thin (W1 and one ad). Drug-adjacent. |
| M12 | Lapsed and restarting, or a member deciding to stay | how they feel | Review 17 | Thin (#11 perks only) |
| M13 | The first few days, before the taste grows on you | how they feel | Review 18 | Open (weak as a lead) |

---

## 4. Lens 2: value

| Layer | Led with by ads | Not led with yet |
|---|---|---|
| Practical | Save money (#1–5, P1, P2, S1, fitness gift). Easy fiber (F1). | **Less effort compared with the old way** ("no shaker, no rinse", reviews 6 and 3). **Money well spent** compared with what you paid before. |
| Feeling | Relief from bloat (T1). No fight with the kids (K1). Perks, a minor sense of superiority (#11). | **Less worry about the subscription** (reviews 17, 20). **Feeling in control** ("I finally stuck with it", reviews 1, 2). |
| Life | Hair (#8), body goal (W1), runner (R1), "One Step I Never Skip" (H1) | The pride of the parent who handles the whole family in one order (review 15) |
| Bigger than me | none | No proof on file. Not ranked. |

What others lean on (competitor descriptions in brand.md, not results): the big greens powder leads with science and a 90-day guarantee. The TikTok brand leads with bloat relief in creator videos. The celebrity line leads with sitewide sales. The vegan liquid brand leads with trust badges.

---

## 5. Lens 3: buyer knowledge, and the grid

| Level | What runs | Mark |
|---|---|---|
| L1 Doesn't see the problem | R1, #13 | Thin |
| L2 Knows the problem | T1, F1, H1, K1, #8, W1, kids lines, main text B | Enough |
| L3 Knows the kinds of fix (powders, pills, other gummies) | #15 (Kids only) | **Nothing for adults** |
| L4 Knows the product | P1, S1, #5, kids flavour news | Enough |
| L5 Ready to buy | P2, #3, #11, fitness gift, main text A | Enough (crowded) |

**Grid (moment × level). Each cell lists its ads and the proof they used. Blank means not run.**

| | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| M1 powder quitter | | | **— (gap 1)** | | |
| M2 bottle shelf | | | **— (gap 4)** | | |
| M3 daily slot | #13 (none) | H1 won (not known). **Demo opening untried (gap 3)** | | | |
| M4 bloated | | T1 won (UGC), F1 at median (label), main text B (label) | | | |
| M5 picky eater | | K1 won (label), kids lines | #15 (why it's made) | flavour news | |
| M6 parent for self + kids | | | | **— (gap 5)** | main text A (offer) |
| M7 price check | | | | P1 won then lost, S1 lost (number), #5 | P2 lost, #3, fitness gift (offer) |
| M8 subscription-wary | | | | | **— (gap 2)** |
| M9 runner | R1 too little | | | | |
| M10 hair | | #8 (none) | | | |
| M11 GLP-1 | | W1 at median (none) | | | |
| M12 member / lapsed | | | | | #11 (offer) |
| M13 taste, first days | | | | | |

---

## 6. Lens 4: openings

| Family | Used? | Ads |
|---|---|---|
| Gain | Used | #3, T1, #8, W1, K1, #11 |
| News | Used | #5, #15, flavour launches |
| Curiosity | Used | #1, P2, F1, R1, H1, #13 |
| Proof first | **Thin**: only "1M+" (S1, lost). **Unused: a demo first, a customer's words first, the study number first, the terms first.** | S1 |
| Expert first | Needs: a real expert (none on file). The paid athlete is a spokesperson, not an expert. | — |
| Verified-review first | Needs: verified reviews. The on-file reviews are brand-picked; the review site shows 4.0. Any quote must name its source. | — |

What others lean on: creator videos (the TikTok brand), science and podcast proof (the greens powder).

---

## 7. Lens 5: form

**Formats known:** image (P1, P2, S1, W1, R1), video 28s UGC (T1), video 20s (H1), video 15s (K1), carousel (F1). The other formats were not captured.

**Not run (as far as the record shows):** side-by-side image, hands-only demo video, the athlete. The athlete is the only person with agreement on file. No ad with him appears, so whether he was tried is not known, ask. MISSING: who appears in T1's UGC video and whether their rights cover reuse.

| Product or plan | Ads |
|---|---|
| Adults Original Low Sugar subscription | Most ads |
| Kids | K1, #15, 4 more lines |
| Limited flavours | 2 of the 40 newest |
| VIP membership | 7 copies |
| **Household order (Adults + Kids, Buy 2 Save $5)** | **0 headlines** (1 main-text mention) |
| Sugar-Free | 0. It is held back because sugar alcohols upset some stomachs. |
| 84-pack sizes | 0 |
| Electrolyte pack | 0. Its facts were not captured, so it can't carry an ad. |

**The product that most deserves ads and has none:** the household order. The busy parent is about 25% of buyers. Their doubt is "Two subscriptions is too much money" (brand.md), and "Buy 2 Save $5" answers it directly. K1 shows Kids ads can win on measured results.

What others lean on: the doctor-backed brand and the big greens powder sell on grocery-shelf bottles and tubs. That is the "old way" a side by side can show.

---

## 8. Ranked gaps

| Rank | Gap (cell) | Reach | Proof on hand, unused by past ads | Cost | Known from |
|---|---|---|---|---|---|
| 1 | Powder quitter at L3: the side by side with the old way (M1×L3) | High (~40% buyer; reviews 1, 3, 4, 6) | Side by side, plus customer's words | Low (image) | What's running: none. Results: offer ads fade. |
| 2 | Subscription-wary at L5: the safe yes (M8×L5) | High (buyer 4, most ads aim here; reviews 17, 20) | Safe yes (terms) | Low (image) | Results: P2 bought on only 0.90% of clicks; P1 fades |
| 3 | Daily slot: a demo first, not a line first (M3×L2 opening) | High (~40%; reviews 1, 2, 15) | Showing it work, plus the survey number | Low–medium (hands-only video) | Results: H1 won in this cell |
| 4 | Bottle-shelf quitter at L3: label and study proof for adults (M2×L3) | Medium (part of buyer 1; review 5) | Why it's made this way, plus the study number | Low (carousel) | What's running: only Kids has used ingredient hooks |
| 5 | Parent buying for self + kids at L4 (M6×L4) | Medium (~25%; reviews 15, 16, 17) | Customer's words, plus Buy 2 Save $5 | Low (image) | Running: one main-text line. Results: K1 won. |

**Open but held back from the ranking:**
- **M11 GLP-1.** The proof is customer words only (reviews 11, 14), and the brand must not repeat them as its own claim.
- **The athlete.** He is available, but there is no moment on file for him. R1, the runner ad, was too little to tell.
- **M12 lapsed restart.** There is only one review behind it.

---

## 9. Proof worth collecting

- **Verified third-party reviews**, with consent to quote. Today the gap is 4.8 on the brand's header against 4.0 on the review site.
- **Customers on camera with written rights**, especially powder quitters and parents. The only person on file is the paid athlete. MISSING: rights for the T1 UGC person.
- **Grams of sugar per pack**, Adults and Kids. This would answer "Is the sugar okay for kids?" MISSING.
- **Freshly dated competitor prices** to replace the page's $1.26 vs $3.60.
- **A count of lapsed subscribers who came back**, with their stories, for M12.
- **The missing number** in "[number missing] of U.S. adults don't meet…", and real sources for the "61% of Americans" footnotes.
- **Proof for "bigger than me" value.** None is on file.
- **Page facts:** whether one checkout can mix Adults and Kids, the Kids renewal price (the $74.98 line is unexplained), and the Kids page URL. All MISSING.

---

## 10. Five ideas, in final order

### Idea 1: The tub vs the pack
- **Gap:** 1 (M1×L3). **Proof:** side by side (a big-name greens powder at about $79 a month, $2.63 a serving, brand.md Sept–Oct 2026, against Sprout's $49.99 every 4 weeks, $1.78 a day), plus customer's words (review 3, brand site).
- **Test:** If this wins, we learn that people who already know powders buy on a fair side by side with the old way, not on a percent off.
- **Lenses:** M1 powder quitter · practical, effort and money well spent · L3 · proof first (side by side) · static comparison image · Adults Original Low Sugar subscription.
- **Doubt:** "They are expensive" (retailer). **Belief:** it costs less a day than the powder I quit, with no prep. **Fact behind it:** $1.78 a day at renewal against $2.63 a serving (both dated Sept–Oct 2026, recheck before live), and one pack that you tear and eat.
- **Promise limit:**
  - Never say it holds more nutrition than a powder.
  - Never say it is the cheapest greens gummy. The powder brand's own gummies are $49 a month.
  - Never name the competitor.
  - Keep the guarantee row, where the powder wins: 90 days against 30 days, first order only.
- **Why new:** No Sprout ad has ever compared against the old way, and no adult ad speaks to people who already know the kinds of fix. The top review theme, quitting the powder, has no ad.
- **Headlines:** "Quit your greens powder? Here's the side by side." · "No shaker. No chalk. No gritty sip." · "Your greens powder vs. one tear-open pack."
- **Opening (image):** Two columns, "The tub" and "The pack".
  - Rows: prep ("scoop, shake, rinse" vs "rip, tip, eat"); price (about $2.63 a serving vs $1.78 a day at renewal); guarantee (90 days vs 30 days, first order).
  - Top strip, the quote: "…it was still $94 a month and the drink was definitely gritty/chalky." Reviewer, brand site.
- **Offer:** $29.99 for the first 28 packs with the text sign-up discount, then $49.99 every 4 weeks. Free shipping on the first order. 30-day money-back on the first order only. **Action:** Start Now. **Page:** sprout.example/products/sprout.
- **Label:** guess.

| Link | Mark | Carried by |
|---|---|---|
| Who | strong | Headline ("Quit your greens powder?") and the tub in the picture |
| Gain | strong | Prep and price rows |
| Proof | strong | Dated prices and a sourced quote |
| Risk | thin → strong after fix | Fix: added the guarantee row with the first-order limit stated |
| Step | thin | The page's Us vs Them shows different, older numbers, below the fold. Fix it before launch. |

### Idea 2: Every number up front
- **Gap:** 2 (M8×L5). **Proof:** the safe yes (product page: "Renews at $49.99 each 4 weeks", "Pause Or Cancel Any Time", 30-day guarantee on the initial purchase), plus customer's words (review 17, brand site).
- **Test:** If this wins, we learn that showing the renewal price and the terms turns clicks into first orders better than a percent-off headline. P2 bought on only 0.90% of its clicks.
- **Lenses:** M8 subscription-wary · feeling, less worry · L5 · proof first (the terms) · image with three short facts · Adults Original Low Sugar subscription.
- **Doubt:** "I hate subscriptions because I feel like they are a trap" (review 17). **Belief:** I know exactly what I'll pay, and I can stop. **Fact behind it:** the renewal price and pause/cancel line are printed on the plan box.
- **Promise limit:**
  - Never say "easy to cancel", "risk-free" or "no strings". Cancelling is the loudest complaint on review sites (review 20).
  - The guarantee covers the first order only.
  - No percent figure.
  - Always state the text sign-up condition on $29.99.
- **Why new:** Every Sprout price ad hides the renewal behind a percent. This one leads with the number the price doubter fears, using the terms the brand already prints.
- **Headlines:** "Hate subscriptions? Here's every number before you start." · "$29.99 first box. $49.99 after. Pause anytime." · "The whole price, in one picture."
- **Opening (image):** Three lines on cream:
  - "First 28 packs: $29.99 (with text sign-up)"
  - "Then $49.99 every 4 weeks"
  - "Pause or cancel any time. 30-day money-back on your first order."
  - Under them: "21 vitamins & minerals. 6g fiber. 1 pack a day."
  - Small quote: "I hate subscriptions… We quickly decided to resubscribe." Reviewer, brand site.
- **Offer:** as stated, the brand's own terms. **Action:** Start Now. **Page:** sprout.example/products/sprout.
- **Label:** guess.

| Link | Mark | Carried by |
|---|---|---|
| Who | strong | Headline ("Hate subscriptions?") |
| Gain | thin → strong after fix | Fix: added the product strip (21 vitamins, 6g fiber) under the terms |
| Proof | strong | The page's own terms |
| Risk | strong | Terms in the picture |
| Step | thin | The page says "DISCOUNT AUTO-APPLIED" and shows 52%/55%, while $29.99 needs the text sign-up. Align the page before launch. |

### Idea 3: Rip. Tip. Out the door.
- **Gap:** 3 (M3×L2, opening). **Proof:** showing it work (the tear-and-pour, brand.md product rules), plus a number with a source (survey: 80% of surveyed users take it daily, brand-reported, 3,000+ customers).
- **Test:** If this wins, we learn that a silent product demo opens as well as a first-person line in the habit cell, where H1 already won.
- **Lenses:** M3 daily slot · feeling, in control, and practical, effort · L2 · proof first (demo) · hands-only video, 15s · Adults Original Low Sugar.
- **Doubt:** "It's always been an issue of consistency" (review 1, brand site). **Belief:** this is one I'll actually keep taking. **Fact behind it:** one pack, no water or shaker, and 80% of surveyed users take it daily.
- **Promise limit:**
  - No "you'll never miss a day".
  - Survey figures always say "of surveyed users".
  - No claims about effects.
  - Tear the pack straight across the top only. Never show the big pouch torn.
- **Why new:** No Sprout ad opens on the product being used. H1 owns the habit idea with words alone, so this tests the picture against the line in the same moment.
- **Headlines:** "Rip. Tip. Enjoy. That's the whole routine." · "No water. No shaker. Out the door." · "80% of surveyed users take it daily."
- **First five seconds:**
  - 0–1s: close-up, a hand tears a green daily pack straight across the top. On screen: "The supplement you'll actually stick with."
  - 1–3s: green bears tip into a palm, with keys and a coffee cup by the door.
  - 3–5s: the hand closes and the door opens. On screen: "80% of surveyed users take it daily", and small text: "brand survey, 3,000+ customers".
- **Offer:** $29.99 first 28 packs with text sign-up, renews at $49.99 every 4 weeks, 30-day money-back on the first order. **Action:** Start Now. **Page:** sprout.example/products/sprout.
- **Label:** measured cell (H1 won at $29.55 a sale, 44 sales, 16 days; dates MISSING). The demo opening itself is a guess.

| Link | Mark | Carried by |
|---|---|---|
| Who | thin → strong after fix | Hands-only can't show whose moment it is. Fix: the first-second caption ("…you'll actually stick with") and the door, keys and coffee setting. |
| Gain | strong | The demo |
| Proof | strong | The demo plus a sourced survey number |
| Risk | thin | Fix: caption the first-order guarantee at the end card |
| Step | strong | One page |

### Idea 4: The shelf, in one pack
- **Gap:** 4 (M2×L3). **Proof:** why it's made this way (methylfolate, methylcobalamin, pectin, from the science page and ingredients panel), plus a number with a source (2025 study: blood vitamin C +40.1%, folate +20.5%, 120 adults, 12 weeks, placebo-controlled).
- **Test:** If this wins, we learn that adults respond to label and study proof, which only Kids ads have used so far.
- **Lenses:** M2 bottle shelf · practical, less to manage · L3 · news (a fact they didn't know) · carousel, 4 cards · Adults Original Low Sugar.
- **Doubt:** "A gummy can't hold enough to replace my powder" (brand.md, buyer 1). **Belief:** this one pack is properly made and was tested in people. **Fact behind it:** 21 vitamins and minerals plus 6 g prebiotic fiber per pack, and the study results.
- **Promise limit:**
  - Never say "replaces your medicine" or anything prescribed.
  - No probiotics.
  - The doses are per pack, never per gummy.
  - Minerals are about 25% of daily value, so never say "100% of everything".
  - The study shows absorption of 2 vitamins only: no energy or immunity claims.
- **Why new:** Sprout has never shown its adult label or its study in an ad. Review 5's "I stopped buying separate… gummies" moment has no ad at all.
- **Headlines:** "Five bottles on the shelf. One pack in your bag." · "Methylfolate and methylcobalamin. Read the adult label." · "Blood vitamin C up 40.1% in a 12-week study."
- **Opening (carousel):**
  - Card 1: a row of mismatched bottles, then one green pack. "I just take these now and it's easier for me to manage." Reviewer, brand site.
  - Card 2: "1 pack: 21 vitamins & minerals, 6g prebiotic fiber, folate as methylfolate, B12 as methylcobalamin."
  - Card 3: the study, with its design spelled out.
  - Card 4: the offer.
- **Offer:** $29.99 first 28 packs with text sign-up, then $49.99 every 4 weeks, 30-day money-back on the first order. **Action:** Start Now. **Page:** sprout.example/products/sprout.
- **Label:** guess.

| Link | Mark | Carried by |
|---|---|---|
| Who | thin → strong after fix | Fix: lead headline names the shelf of bottles, and card 1 shows it |
| Gain | strong | Card 2 |
| Proof | strong | Label and study, both sourced |
| Risk | thin | The guarantee is on card 4 only. Acceptable. |
| Step | strong | One page |

### Idea 5: One for you, one for them
- **Gap:** 5 (M6×L4). **Proof:** customer's words (review 15, "on my way to the billion things I have to do as a mom", and review 16, "the only one they love eating", both brand site), plus the offer "Buy 2 Save $5" (brand.md).
- **Test:** If this wins, we learn whether a two-pouch household order brings a bigger first order than the Kids-only ad, which took about $48.60 per order.
- **Lenses:** M6 parent for self and kids · life, the parent who handles everyone, and practical, money · L4 · gain · static image, green and yellow pouches with gummies scattered · household order, Adults + Kids.
- **Doubt:** "Two subscriptions is too much money" (brand.md, buyer 3). **Belief:** one order covers us both, for less. **Fact behind it:** Buy 2 Save $5 when more than one adult or kid is on the order.
- **Promise limit:**
  - No "strong bodies, bright minds" or brain claims.
  - No tie-in characters.
  - Never call it candy.
  - "1 pack a day" is shown for both.
  - No Kids price until it is confirmed.
- **Why new:** The household order has no headline of its own, only a "+$5" line in one main text. Every Kids ad sells the kid, never the parent's own pack in the same order.
- **Headlines:** "One green pack for you. One yellow for them." · "'The only one they love eating.' One for you too." · "Buy 2, save $5: you and the kids."
- **Opening (image):** Green Adults pouch and yellow Kids pouch side by side on a soft gradient. One torn daily pack in front of each, gummies scattered. Quote card: "So easy to grab and eat on my way to the billion things I have to do as a mom." Reviewer, brand site. Badge: "Buy 2 Save $5."
- **Offer:** Buy 2 Save $5. **Action:** Start Now. **Page:** MISSING (product page or Kids page; URL not on file).
- **Label:** guess (K1 won measured in the Kids cell, not in this one).

| Link | Mark | Carried by |
|---|---|---|
| Who | strong | Two pouches, the quote |
| Gain | strong | Headline |
| Proof | strong | Sourced quotes |
| Risk | thin | The Kids renewal is unclear |
| Step | **MISSING** | MISSING: whether one checkout can hold Adults and Kids, the Kids renewal price ($74.98 unexplained), and the landing page URL. This is why it moved to last. |

---

**Also flag before any reuse:**
- T1's "Fix" should read "supports".
- W1 and the weight-loss line have no evidence on file.
- Main text A says "probiotics", but the product has prebiotic fiber only.

CHECKS MISSED: The measured results carry spend, sales and days live but no calendar dates (MISSING), so "measured" here rests on durations, not dates.

---

The biggest gap is the adult buyer who already knows powders and pills (level L3). No adult ad speaks to them, even though quitting the powder is the top review theme. Make Idea 1, the tub vs the pack, first: it is a cheap image built on proof the brand already holds, but recheck both prices and fix the page's Us vs Them numbers before it goes live.
```
