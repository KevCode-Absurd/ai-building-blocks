# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 3 of 6 met. Invented facts: 0.

The analysis that exists is careful and honest: every cost-per-sale is correctly computed from the CSV, missing dates are flagged, and proof is tied to sources. But the run hit its length limit mid Lens 4, so the owner gets no Lens 5, no ranked gaps, no proof-to-collect list and none of the five ad ideas, which were the whole point.

## Fix

In 'What you hand back', add a length rule: keep the record and lens tables to one terse line per ad with no repeated notes, and state that the ranked gaps and five ideas must always be delivered even if the lenses are compressed.

## Judge list

- Met: The first line grades the evidence the map rests on.
  "**Evidence grade:** Two sources of different strength. - **Observed:** the Meta Ad Library... - **Measured:** ad-results.csv"
- Met: Nothing is called a winner without numbers and dates. "Still running" isn't treated as a win.
  "**Won**, $4,200, 198 sales, $21.21 a sale, 30 days (measured, dates MISSING)"; library ads marked "Running (observed)". Dates flagged MISSING, not assumed.
- Not met: Each idea fills a different gap and has its own test question. No two ask the same thing.
  Output stops mid Lens 4; no GAPS section and no Ideas A to E exist.
- Met: Every proof named is in what you gave it. Check one review number against your file.
  "67% more regular digestion; 52% more energized" matches brand.md survey; "#3 '$94 a month… gritty/chalky'" matches reviews.md.
- Not met: Who it's for and what they gain show in the first second of every idea.
  No ideas were written; output truncated before the GAPS and IDEA sections.
- Not met: The ideas use only your claims, prices and offers, and a side by side shows a row where the other option wins.
  No ideas exist to check. Proof table does note the competitor's "90-day guarantee" (a row where the other option wins), but no ad side by side was written.

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
# ad-gap-map-2026-10-18.md

**Evidence grade:** Two sources of different strength.
- **Observed:** the Meta Ad Library (ads.md: 15 headlines with copy counts, and the mix of the 40 newest ads, pulled 30 Sept and 4 Oct 2026). This shows what is running. It shows no results.
- **Measured:** ad-results.csv, with spend and sales for 9 ads; P1 is split into two 21-day windows. **MISSING: calendar start and end dates for every row.** You called these "practice results", so confirm they come from the live account before any "won" below is treated as settled.
- **Benchmark for "won" and "lost":** you gave no break-even, so I used the average cost per sale across the file: $21,500 ÷ 623 sales = $34.51. Swap in your own rule if you have one. Under 20 sales counts as "too little spend to tell".

---

## 1. Record

Ad numbers follow ads.md; CSV codes are in brackets. The library did not capture format or product, so the CSV format is used where it exists. Otherwise the cell says "not known, ask". Product is inferred as Original Adults unless the ad is a Kids ad.

| # | Headline (copies live) | Moment | Value (layer) | Level | Opening | Format | Product | Proof leaned on | Result (grade) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | "'Sprout is too expensive': here's 61% off to prove otherwise" [P1] (15+) | Price doubt | Save money (practical) | Knows product | Proof first (buyer's objection in their words) | Image | Adults, sub | Discount | Days 1–21: **won**, $3,000, 112 sales, $26.79 a sale. Days 22–42: **lost**, $3,000, 39 sales, $76.92 a sale (measured, dates MISSING) |
| 2 | "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)" [P2] (8+) | Price doubt | Save money (practical) | Ready to buy | Curiosity (insider) | Image | Adults, sub | Discount | **Lost**, $2,500, 50 sales, $50.00 a sale, 30 days. 2.45% of viewers clicked; 0.90% of clickers bought (measured, dates MISSING) |
| 3 | "Get up to 61% OFF + 4 FREE gifts: online exclusive" (10 with sister) | At the store shelf | Save money (practical) | Ready to buy | Gain | not known, ask | Adults | Discount, gifts | Running (observed) |
| 4 | "Trusted by 1M+: Take 61% OFF" [S1] (4) | Price doubt | Save money (practical) | Ready to buy | Proof first (customer count, brand-reported) | Image | Adults | "1M+" (no source) | **Lost**, $1,600, 38 sales, $42.11 a sale, 30 days (measured, dates MISSING) |
| 5 | "We're Lowering Our Prices 🔥" (1) | Price doubt | Save money (practical) | Knows product | News | not known, ask | Adults, sub | Price cut | Running (observed) |
| 6 | "Fix the Hot Girl Tummy" [T1] (5) | Bloated, gut off | Relief (feeling) | Knows problem | Gain (risky word "Fix") | Video 28s UGC | Adults | not known, ask (UGC content not captured) | **Won**, $4,200, 198 sales, $21.21 a sale, 30 days (measured, dates MISSING) |
| 7 | "Struggling to Get Enough Fiber?" [F1] | Bloated, gut off | Get enough fiber (practical) | Knows problem | Curiosity (question) | Carousel | Adults | Number: 6 g fiber | **Lost**, $1,800, 46 sales, $39.13 a sale, 30 days (measured, dates MISSING) |
| 8 | "Nutrition for Healthy Hair" (6, all made 2 Oct) | Hair, beauty (inferred) | Look good (life) | Knows problem | Gain | not known, ask | Adults | none on file | Running (observed) |
| 9 | "Support Muscle While You Lose Weight" [W1] (1) | On a weight-loss plan | Keep muscle (practical) | Knows problem | Gain | Image | Adults | none on file (claim unsupported) | **Lost**, $900, 23 sales, $39.13 a sale, 14 days (measured, dates MISSING) |
| 10 | "The Daily Nutrition Every Runner Forgets" [R1] (2) | Training (inferred) | Be a runner (life) | Doesn't see problem | Curiosity | Image | Adults | none | **Too little spend to tell**, $1,000, 10 sales (measured, dates MISSING) |
| 11 | "Perks That Really Pile Up" (7) | Knows brand, wants perks | Belonging, savings (life/practical) | Knows product | Gain | not known, ask | VIP subscription | Perks | Running (observed) |
| 12 | "One Step I Never Skip" [H1] (1, plus "Nutrition Made Ridiculously Easy") | Daily slot, sticking with it | Less effort (practical) | Knows problem | Curiosity (first-person line) | Video 20s | Adults | not known, ask | **Won**, $1,300, 44 sales, $29.55 a sale, 16 days (measured, dates MISSING) |
| 13 | "He Asked What Day It Was. I Handed Him a Gummy." (1) | Partner at home (inferred) | not known, ask | Doesn't see problem | Curiosity (scene) | not known, ask | not named | none | Running (observed) |
| 14 | "Fiber Kids Won't Fight" [K1] | Picky-eater kids | No fight at table (feeling) | Knows problem | Gain | Video 15s | Kids | Number: fiber | **About even**, $2,200, 63 sales, $34.92 a sale, 30 days (measured, dates MISSING) |
| 15 | "Methylfolate, Not Folic Acid" | Label-reading parent | Peace of mind (feeling) | Knows kinds of fix | News (a fact) | not known, ask | Kids | Why it's made this way | Running (observed) |
| – | Kids: tie-in "Vitamins They Actually Want"; "The veggies they won't eat…"; "One pack a day keeps the gut happy 💩" | Picky-eater kids | Fun, no fight (feeling) | Knows problem | Gain | not known, ask | Kids | none | Running (observed) |
| – | "The Lemon Aid Stand is open. 🍋" | Knows brand | Fun (feeling) | Knows product | News (flavour) | not known, ask | Raspberry Lemonade | none | Running (observed) |
| – | "30 Days Of [a fitness app], Free" | not known, ask | Free gift (practical) | Ready to buy | Gain | not known, ask | Adults | Partner gift | Running (observed) |
| – | "Perfect Supplement for Weight Loss Support…" | On a weight-loss plan | Weight loss (practical) | Knows problem | Gain | not known, ask | Adults | none (unsupported) | Running (observed) |

**Patterns**
1. **The two cheapest sales came from ads built on a buyer's moment, not a discount** (measured, dates MISSING). T1 cost $21.21 a sale and H1 $29.55. The offer ads P2 and S1 cost $50.00 and $42.11. P1 won only in its first 21 days.
2. **The same P1 ad cost nearly three times as much per sale in days 22–42** ($26.79 → $76.92) on the same $3,000. The file does not show why.
3. **Offer-led ads brought smaller first orders:** $31–34 of revenue per sale against $40–49 for the others. Renewals are not in the file, so lifetime value is not known. Ask.
4. **The library bets the other way** (observed). 19 of the 40 newest ads are offer-led, and the habit cell that won (H1) has 1 copy.

---

## 2. Proof on hand

| Kind | On file (source) | Past ads leaned on it? |
|---|---|---|
| Showing it work | The ritual only: tear the daily pack straight across the top and pour the gummies into a palm (brand file, "Show it right"). No footage of results is on file. | Not known, ask (formats not captured; T1 is UGC with unknown content) |
| Customer's own words | 20 reviews (reviews.md), most picked by the brand for its own site. Strongest: #1 "the one thing I've been able to stick to", #3 "$94 a month… gritty/chalky", #4 "choking on [powder]", #7, #8 "not aggressively", #15, #16, #17 "subscriptions… a trap" | **Yes, objection only.** P1 quotes the price doubt. No praise quote seen in any headline |
| Number with a source | **Label** (brand file): 60+ ingredients, 21 vitamins and minerals (vitamins about 100% DV, minerals about 25%), 6 g prebiotic fiber. **Study** (science page): 2025, 12 weeks, 120 adults, vitamin C +40.1%, folate +20.5%. **Testing** (product page): 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial, Sep 2026. **Survey** (brand-reported, 3,000+, always "of surveyed users"): 95% take it 4–6x a week, 80% daily; 67% more regular digestion; 52% more energized. **Not usable:** "4.8 from 100,000" (conflicting counts), "1M+" (no source), "61% of Americans" (footnote just says "Source"), the stat with the missing number | **Yes:** fiber (F1, K1), "1M+" (S1), methylfolate (#15). The study and the survey: not seen in ads |
| Side by side with the old way | A big-name greens powder at about $79 a month, $2.63 a serving, with a 90-day guarantee (brand file, captured Sept–Oct 2026; recheck before use). Sprout renews at $49.99 every 4 weeks, $1.78 a day (product page). Review #3 "$94 a month". The page's $1.26 vs $3.60 is dated: don't use it | **No** |
| Why it's made this way | Methylfolate (not folic acid), methylcobalamin B12, pectin instead of gelatin (vegan), single daily packs, Low Sugar vs Sugar-Free (Sugar-Free uses sugar alcohols), free-from list (brand file) | **Kids only** (#15) |
| Safe yes | 30-day money-back guarantee, **first order only** (FAQ). "Pause Or Cancel Any Time" (plan box). Free shipping on the first subscription order. HSA/FSA eligible through a third party. Ships within 24 hours. Note: cancelling is the loudest complaint on public sites (review #20) | **No** (shown only in the page's announcement bar) |

People: one paid former pro athlete (product page, disclosed as paid). An endorsement is not one of the six kinds above.

---

## 3. Lens 1: moments

| Prompt | Moment (written as a situation) | Source | Status |
|---|---|---|---|
| Why | Has quit a greens powder and wants something that sticks | Review #3, #4 (brand site) | **Open** |
| Why | Has quit every supplement before | Review #1, #2 (brand site) | **Thin** (H1, 1 copy) |
| When | Morning rush, grabs a pack on the way out | Review #15 (brand site) | **Thin** (only via H1) |
| When | Renewal day, or restarting after cancelling | Review #17 (brand site) | **Open** |
| Where | At the store shelf, seeing the $19.97 12-pack | Brand file, price doubter. Inferred: check before briefing | Thin (#3) |
| While doing what | On a weight-loss plan or a GLP-1 | Reviews #11, #14 (brand site widget) | Thin (W1, plus one weight-loss line). Claim-risky |
| While doing what | Training for runs | Inferred: check before briefing | Thin (R1) |
| With whom | Picky-eater kids at the table | Review #16 (Kids page) | Covered (K1 plus 4 Kids headlines) |
| With whom | The parent buying for herself | Review #15 (brand site); brand file, busy parent | **Open** |
| With whom | Partner at home | Inferred: check before briefing | Thin (#13) |
| With what else | The shelf of separate bottles | Review #5 (brand site) | **Open** |
| How they feel | Bloated, gut feels off | Review #10 (retailer) | Covered (T1, 5 copies, plus gut lines) |
| How they feel | Gut-sensitive and afraid it'll make things worse | Brand file, gut buyer's doubts; review #8 | **Open** |
| How they feel | "They are expensive" | Retailer short review | **Covered, crowded** (#1–#5) |
| How they feel | Distrusts subscriptions | Review #17 (brand site), #20 (review site) | **Open** |

---

## 4. Lens 2: value

| Layer | Values ads lead with | Not led with yet |
|---|---|---|
| Practical | Save money (#1–#5, crowded); get fiber (F1, K1); less effort (H1, thin); keep muscle (W1) | Skip the shaker and the prep (review #6); one order for the whole house |
| Feeling | Relief from bloating (T1); no fight at the table (K1); fun (Kids, flavours) | **Less worry:** about the subscription terms (review #17), about the stomach getting worse (gut buyer). **Pride:** "I WANT to take it" (review #2) |
| Life | Look good (#8 hair); be a runner (R1); VIP belonging (#11) | **The person who finally sticks with something** (review #1) |
| Bigger than me | none | none, and no proof on file (vegan is not a planet claim) |

**What others lean on** (described in the brand file; their ads were not pulled):
- The big greens powder: value for nutrition, backed by science.
- The TikTok wellness brand: bloat relief. The gut-relief value is contested.
- The celebrity line: sales of up to 45% off.
- The doctor-backed brand: medical authority.
- The vegan family brand: trust and a gentle tone.

---

## 5. Lens 3: buyer knowledge

| Level | What runs | Status |
|---|---|---|
| Doesn't see the problem | R1, #13 | Thin (R1 too little to tell). The page stat with the missing number can't help |
| Knows the problem | T1, F1, K1, H1, W1, #8, Kids lines | Enough |
| Knows the kinds of fix | #15 (Kids only) | **Nothing for adults** |
| Knows the product | P1, #5, #11, Lemon Aid | Enough |
| Ready to buy | P2, S1, #3, fitness-app gift | Enough (crowded) |

**Grid: moments × levels** (ad, then proof used; "–" = nothing running)

| Moment | Doesn't see | Knows problem | Knows kinds of fix | Knows product | Ready to buy |
|---|---|---|---|---|---|
| Price doubt | – | – | – | P1 (objection, discount); #5 (price news) | P2 (discount); S1 ("1M+") |
| At the store shelf | – | – | – | – | #3 (discount, gifts) |
| Bloated, gut off | – | T1 (not known); F1 (6 g fiber); gut main text | – | – | – |
| Gut-sensitive, afraid it'll get worse | – | – | **–** | – | – |
| Picky-eater kids | – | K1 (fiber); Kids lines (none) | – | Lemon Aid (none) | – |
| Label-reading parent | – | – | #15 (why it's made) | – | – |
| Quit a greens powder | – | – | **–** | – | – |
| Shelf of bottles | – | – | **–** | – | – |
| Daily slot, sticking with it | – | H1 (not known) | – | – | – |
| Parent buying for herself | **–** | – | – | – | – |
| Distrusts subscriptions | – | – | – | – | **–** |
| On a weight-loss plan / GLP-1 | – | W1 (none); weight-loss line (none) | – | – | – |
| Training | R1 (none) | – | – | – | – |
| Hair | – | #8 (none) | – | – | – |
| Partner at home | #13 (none) | – | – | – | – |
| Wants perks | – | – | – | #11 (perks) | fitness-app gift |

---

## 6. Lens 4: openings

| Family | Used by | Status |
|---|---|---|
| Gain | T1, K1, #3, #8, W1, #11, Kids lines | Used |
| News | #5 (price), Lemon Aid (flavour), #15 (a fact) | Used. **A study result as news: unused** |
| Curiosity | F1, R1, P2, H1, #13 | Used |
| Proof first | S1 (unsourced count), P1 (objection quote) | **Thin.** Unused: a demo first; a customer's praise first; a sourced number first (study, survey, testing); a side by side first |
| Needs | An expert opening needs a real expert (none on file). A star-rating
```
