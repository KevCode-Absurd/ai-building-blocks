# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable plan: every fact the owner listed becomes a locked card with its conditions, risky site claims go on a block list, and each step gets only what it needs. The owner still has to supply the reviews file, product photos, ad format and a budget, all of which are clearly marked MISSING rather than guessed.

## Judge list

- Met: Every claim travels as a whole card, with its amount, conditions and who it applies to.
  C4: "$29.99 first order with the text sign-up discount for new customers. Renews at $49.99 each 4 weeks." Limits name product, plan, new customers.
- Met: The checking step gets the actual output and the original brief, not a summary.
  Step 7 Needs: "Paths to the actual image, the actual copy and the original brief... Never a summary of any of these."
- Met: The fixing step gets only the failed part and what depends on it.
  Step 8 Needs: "Only the failed part... The named fault from step 7... The list of parts that depend on it."
- Met: Counts, budgets and sums are left to code, not to the AI.
  "Code runs before the model check... Character counts." and "Code keeps a ledger of spent plus reserved"; estimates "computed by code".
- Met: Nothing failed or partial is marked as a success, and no stock or made-up output fills a gap.
  "A failed or partial result stays marked as such. It is never filled with stock images, sample copy or invented output."

## What went in

```text
Our steps:
1. Brand reading: from the site, product page and reviews
2. Buyer: one buyer with their doubts and words
3. Brief: one ad idea
4. Copy: the ad text
5. Image prompt
6. Image made by the image tool
7. Check: the image and copy against the brief
8. Fix: repair what failed

Today every step gets the whole brand file plus all 20 reviews.
Usage: not measured. Fixed: none. Steps 1 and 7 run in a tool
that can open files; the rest can't.

Facts the steps rely on: "60+ ingredients, 21 vitamins &
minerals, and 6g fiber" in 1 pack. "Clinically tested for
nutrient absorption" (2025 study, 120 healthy adults, vitamin C
+40.1%, folate +20.5%). Survey: "95% of users take [Sprout] at
least 4-6x per week", always "of surveyed users". $29.99 first
order only with the text sign-up, renews at $49.99 every 4 weeks.
30-day money-back, first order only. Reviews 11 and 14 mention
GLP-1: customer words only, never the brand's claim.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
## 1. Claim cards

Cards travel word for word, with their limits. A step may pick cards by ID. It never rewrites, shortens or merges them. Where a card has a required partner, the partner goes into the same ad.

| ID | Wording (exact) | Limits that travel with it | Source |
|---|---|---|---|
| **C1** | "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack" | Sprout Original (Adults), 1 pack (about 20 g). The claim is per **pack**, never per gummy. Never use "20+" or "over 20". Not confirmed for Kids packs. | Product page, science page |
| **C2a** | "Clinically tested for nutrient absorption" | Must appear with C2b in the same ad. Covers absorption of 2 nutrients only. Never stretch it to energy, immunity, "it works" or "clinically backed formula". | Science page |
| **C2b** | "2025 study: 12 weeks, randomized, double-blind, placebo-controlled, 120 healthy adults aged 23 to 59. Blood vitamin C up 40.1% (2.7x placebo), folate up 20.5% (2.9x placebo)." | Adults only. The numbers are blood levels, not felt benefits. | Science page |
| **C3** | "95% of surveyed users take Sprout at least 4-6x per week" | "of surveyed users" is part of the wording and can't be dropped. Requires footnote **C3f**: "Brand-reported survey of 3,000+ customers after 3 months." | Brand survey |
| **C4** | "$29.99 first order with the text sign-up discount for new customers. Renews at $49.99 each 4 weeks." | Covers only: Sprout Original (Adults), Low Sugar, 28 packs, subscription. The first order needs the promotional SMS discount and is for new customers only. "$29.99" never appears without the rest of this card. No per-day price unless it is a new card. | Plan box, footer small print |
| **C5** | "30-day money-back guarantee on your first order." | Initial purchase only ("This policy applies only to your initial purchase."). Never "30-day guarantee" alone. | FAQ |
| **C6** | "Supports digestion and gut health" | "Supports" only. Never fix, relieve, cure or flatten. | Label bullet |
| **C7** | "Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants" | Lot testing. Don't add "35 substances". | Product page |
| **C8** | "Vegan. Pectin base, no gelatin. Free from gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners and synthetic dyes." | The free-from list is whole. Don't add items. | Science page, ingredients panel |
| **C9** | "Methylfolate, not folic acid" | Adults pack: folate 400 mcg DFE as methylfolate. | Science page |
| **CW-GLP1** | Reviews 11 and 14, verbatim. MISSING: review text (the reviews file was not attached). | **Customer words** (quoted research only). It may shape the buyer step's understanding. It never appears in copy, the image or the brief as a claim or testimonial. The word "GLP-1" in any output is a fail. | Reviews 11, 14 |

**Block list (B).** These go to every writing step and to the checker. Any match is a fail.
- Discount percentages: 49%, 52%, 55%, 58%, 61%, "up to".
- "4 free gifts", "$20 off", "Buy 2 Save $5". None of these has a card.
- Star ratings and review counts (4.8, 100,000, 1M+). None has a sourced card.
- "Fix" / "Hot Girl Tummy".
- Weight loss and muscle claims.
- Hair growth.
- "Revive whole body vitality".
- "Mental clarity", "energy", "immunity", "stress relief" as benefits.
- "Works" / "clinically backed".
- "35,000+ studies".
- "Per gummy".
- 30/60/90-day results.
- "Fast bioavailability".
- GLP-1.
- Kids "bright minds" or "brain health".
- "Most fiber supplements contain only 5g".
- "$1.26 vs $3.60".
- "First smart gummy" / "fills the gaps".
- "Less than 1% use our guarantee".
- Any cancel promise beyond "Cancel anytime".
- Kids prices: the renewal is unclear, so there is no card.

## 2. Fact labels (non-claim facts)

| Label | Facts |
|---|---|
| **Checked brand fact** | <ul><li>28 daily packs per pouch.</li><li>Adults pack about 20 g, "a small handful" of gummies.</li><li>Original flavour is "Fresh & Sweet" (strawberry and sweet greens).</li><li>Low Sugar or Sugar-Free. Sugar-Free uses sugar alcohols.</li><li>Ships "typically within 24 hours and on average arrive 3-5 days later".</li><li>One-time price $66.65.</li><li>The show-it-right rules and the look (section 3).</li><li>Brand voice lines.</li></ul> |
| **Customer words** | <ul><li>Quotes in the brand file, e.g. "Sprout has been the one thing I've been able to stick to", "after the third day they started tasting better".</li><li>Reviews R01–R20.</li><li>Research only, never a testimonial.</li></ul> |
| **Guess to test** | <ul><li>Buyer shares (rough estimates).</li><li>All "what works" angles: price objection, habit/stick-with-it open lane, gut slang, limited flavours.</li><li>Mostly-mobile traffic (inferred).</li><li>Sugar-Free upsetting some stomachs (customer reports plus an inferred missing warning).</li></ul> |
| **Creative choice** | <ul><li>Angle, hook, scene and line choices made in steps 3–5.</li></ul> |

## 3. Handoff cards

**Paste or point.**
- Steps 1 and 7 can open files, so they get file paths and card IDs.
- Steps 2, 3, 4, 5 and 8 get pasted text only.
- Step 6 gets the prompt and any reference images.
- Every artefact is saved as a file so step 7 can open the real output.

**Identity rules (IR).** These apply wherever an image is involved.
- **IR1:** The daily pack is torn straight across its top edge only. Never the side, the bottom or a corner.
- **IR2:** Gummies pour from the torn top into a palm or bowl.
- **IR3:** The big pouch opens only at its resealable top and is never shown torn.
- **IR4:** No cartoon tie-in characters and no partner brand marks. Use the flavour description only.
- **IR5:** Adult pouch is a glossy deep green stand-up foil pouch with a big yellow wordmark, a yellow bear face top right and "28 Daily Packs" at the bottom. Sugar-Free adds a white burst.
- **IR6:** Gummies are small, opaque, soft matte deep-green bears, about thumbnail height.

### Step 1: Brand reading (can open files)
- **Needs:**
  - Paths to `sprout/brand.md`, `sprout/product-page.md` and the reviews file (MISSING: reviews file path).
  - This plan's claim cards and block list, as a file.
  - The job: confirm each card still matches the live sources, and report drift. It does not rewrite.
- **May use:** Other site pages, if it can open them.
- **Returns** (fixed shape):
  - `cards_status`: per card ID, one of `match` / `changed` / `not found`, with the source line quoted.
  - `facts`: label plus source for each fact.
  - `reviews`: R01–R20 verbatim, each with ID, buyer type guess and theme.
  - `conflicts`: a list.
- **Never lose:** Card wording and limits; the CW-GLP1 rule; IR1–IR6.

### Step 2: Buyer (text pasted)
- **Needs:**
  - The buyer chosen for this run (MISSING: who picks it).
  - That buyer's brand-file profile (wants, doubts, quote).
  - The reviews tagged to that buyer, verbatim, with IDs.
  - The card list (full text) so it can map doubts to answers.
- **May use:**
  - Reviews from other buyers that share a doubt, whole and never excerpted mid-sentence.
  - CW-GLP1 as research only.
- **Returns:**
  - `buyer_id`.
  - `who` (1 line).
  - `wants` (1 line).
  - `doubts`: up to 3. Each is verbatim with its R-ID, or marked as the brand file's wording.
  - `words`: 3–5 verbatim quotes with R-IDs.
  - `answers`: doubt → card IDs, or "no card".
- **Never lose:**
  - Quotes stay verbatim and labelled as customer words.
  - Card IDs.
- **Don't send:** Look, competitors, merch, the electrolyte pack, other buyers' profiles, prices outside C4.

### Step 3: Brief (text pasted)
- **Needs:**
  - Step 2 output.
  - All claim cards (full text) and the block list.
  - The "what works" hypotheses, labelled as guesses.
  - A voice summary with the brand lines.
  - IR1–IR6 (so the scene idea is legal).
  - The competitor descriptions relevant to the buyer's doubt.
- **May use:** The limited-flavour rule (subscribers get it for 1 month, then revert to Original) if the angle uses a flavour.
- **Returns:**
  - `angle` and `hypothesis_tested`.
  - `doubt_answered`, with its R-ID.
  - `cards_to_state`: IDs, with required partners listed (C2a+C2b, C3+C3f, C4 whole).
  - `on_image_words`: exact text, or "none".
  - `scene` (product, hands, setting).
  - `format` (MISSING: placement, aspect ratio, character limits).
- **Never lose:** Card IDs with partners; the CW-GLP1 exclusion; IR rules referenced in `scene`.

### Step 4: Copy (text pasted)
- **Needs:**
  - The brief.
  - The full text of only the cards in `cards_to_state`, with their limits.
  - Buyer `words` and `doubts`, verbatim.
  - Voice notes and brand lines.
  - The block list.
- **May use:** Brand lines: "Rip. Tip. Enjoy.", "Tastes like a treat, works like a supplement.", "No more gagging on pills, sloshing chalky powders, or cleaning messy counters."
- **Returns:**
  - `primary_text`, `headline`, `description`, `cta`.
  - `on_image_words`: must equal the brief's, character for character.
  - `footnotes`: C2b, C3f or C4 as needed.
  - `cards_used`: IDs.
- **Never lose:** Card text verbatim, including "of surveyed users", "first order", "new customers" and "Renews at $49.99 each 4 weeks."
- **Don't send:** Look, image rules, other cards, competitors.

### Step 5: Image prompt (text pasted)
- **Needs:**
  - The brief's `scene`.
  - The copy's `on_image_words`, verbatim.
  - IR1–IR6.
  - The look:
    - Colours: #00582D, #002C17, #FFF7DF, #007E40, #FFCC2E, #581E5A.
    - Fonts: Work Sans bold for headings, Work Sans medium for body, DM Mono for tags, plus the chunky display font.
    - Photo style: bright, sunny, a 2-colour gradient, everyday adults; never clinical.
  - Product photos with roles (MISSING: no photo files provided; the gallery was inferred).
- **May use:** Pouch and gummy changes for a limited flavour, as long as IR4 holds.
- **Returns:**
  - `prompt`.
  - `must_not` list (side or corner tears, a torn big pouch, characters, partner marks, clinical look).
  - `exact_text_strings`.
  - `aspect_ratio` (MISSING).
  - `reference_images` with roles (MISSING).
- **Never lose:** On-image words exactly; IR1–IR6.
- **Don't send:** Buyer quotes, card limits beyond the on-image words, prices unless C4 is on the image as a whole card.

### Step 6: Image made by the image tool
- **Needs:** The prompt, `must_not`, the exact text strings and reference images (if the tool accepts them).
- **Returns:**
  - Image file saved to a path.
  - Tool settings, seed and raw response.
- **Never lose:** Exact text strings.

### Step 7: Check (can open files)
- **Needs:**
  - Paths to the actual image, the actual copy and the original brief.
  - The step 2 buyer output.
  - The full claim card file.
  - The block list.
  - IR1–IR6.
  - The code-check report (below).
  - Never a summary of any of these.
- **Code runs before the model check:**
  - Card text verbatim match.
  - Required partners present.
  - Block-list scan, including "GLP-1".
  - `on_image_words` the same in brief, copy and prompt.
  - Character counts.
- **The model judges:**
  - Image against IR1–IR6.
  - Rendered on-image text against `exact_text_strings`.
  - Whether the brief's doubt is answered.
  - Whether the voice fits.
  - Whether any implied claim goes beyond its card (e.g. the image suggests weight loss).
- **Returns** one row per check:
  - `check_id`
  - `pass` / `fail`
  - `part` (field name or image region)
  - `fault` (named)
  - `card_or_rule_id`
  - `depends_on_it` (e.g. a headline change affects `on_image_words` → image)
- **Overall status:** `checked` / `failed` / `partial`.
- **Never lose:** Every card and IR checked by ID.

### Step 8: Fix (text pasted)
- **Needs:**
  - Only the failed part (the field text, or the prompt for an image fault).
  - The named fault from step 7.
  - The full text of the card or rule involved.
  - The list of parts that depend on it.
  - The brief's angle line.
- **Returns:**
  - The replacement for the failed part only, in the same field shape.
  - `cards_used`.
  - A note on which dependents must re-run (e.g. a prompt change → step 6 → step 7).
- **Never lose:** Card text verbatim. It may not soften a card to fix a length fault; it raises a length fault back as a fail instead.

## 4. Bundle order (per step, so the start can be cached)

1. **Stable start**, byte-identical across runs for that role:
   - Role rules.
   - Block list.
   - Claim cards (all, or the role's fixed subset).
   - IR1–IR6 (image roles and the checker).
   - Product facts.
   - Voice or look for that role.
2. **Changing part, last:**
   - Chosen buyer and reviews.
   - Brief.
   - Draft or output under check.
   - Named fault.

Trim order when over budget:
1. Duplicates (keep the sourced wording).
2. Other buyers, the Kids line, the electrolyte pack and merch.
3. Unused formats.
4. Setup notes meant for people.
5. Sample outputs.

Reviews are dropped whole, never cut mid-quote. If a bundle is still over budget, raise the budget or split the step, and record that.

## 5. Run rules

**Save per step:**
- Input fingerprint (a hash of the exact bundle).
- Skill version.
- Model and settings.
- The exact request.
- The raw reply.
- The checked result and its status.
- Provider-reported usage.
- Cost.
- Retry count and reasons.

**Resume:**
- Start from the last step whose result is `checked`.
- A `failed` or `partial` result stays marked as such. It is never filled with stock images, sample copy or invented output.
- A fingerprint change upstream invalidates downstream results.

**Retries:**
- Only for a named, fixable failure: invalid shape, card mismatch, blocked term, a broken IR, wrong rendered text.
- Steps 2–5: at most 2 retries each.
- Step 6: at most 2 regenerations per named fault.
- Fix loop (8 → 7): at most 2 rounds per ad. After that the ad is reported as `failed`, with the last check report.
- Every retry is re-checked: code checks plus step 7.

**Budget:**
- Total budget: MISSING.
- Code keeps a ledger of spent plus reserved (an estimated maximum for each call still running).
- A call starts only if spent + reserved + its estimate fits the budget.
- Retries draw on the same ledger.

**Measure:**
- Usage is not measured today. Plan with estimates computed by code at about 4 characters per token.
- After each call, record the provider's real usage and report it separately from the estimates.
- No token figures are given here.

## 6. Shortfalls and trade-offs

- MISSING: the reviews file, including the text of reviews 11 and 14. CW-GLP1 can't be filled until it exists.
- MISSING: product photo files and their roles. Without them step 6 has no references, so IR5/IR6 accuracy rests on the prompt alone.
- MISSING: ad placement, aspect ratio and character limits. Copy length checks can't run.
- MISSING: total budget.
- MISSING: who picks the buyer per run.
- **No discount-percentage card.** The most-copied angle ("61% off") can't run until a percentage card with its conditions is confirmed. The site shows 49% to 61% at once. The price-doubter angle can use C4 instead.
- **No star-rating card.** If wanted, add one with its source named, e.g. the on-page widget at 4.75 from 109,639.
- **C1 is not confirmed for Kids.** The Kids renewal price is unclear, so Kids ads need their own cards before use.
- **No sugar card.** Sugar grams and the Low Sugar vs. Sugar-Free panel were not captured. Gut-focused ads can't make sugar claims or tell gut-sensitive buyers which option to pick, beyond leaving Sugar-Free out.
- **Policy decision needed:** the site carries the FDA line but the brand's ads don't. Decide whether ads must carry it, and add it as a card if so.
- **C4 is long for an image.** Putting "$29.99" on the image means the whole card goes on the image. The trade-off is keeping price off the image and in the primary text.
```
