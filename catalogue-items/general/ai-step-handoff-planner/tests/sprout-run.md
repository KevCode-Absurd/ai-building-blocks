# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The plan locks every risky Sprout claim into a card with its conditions, blocks the conflicting discount percentages and risky health lines, and gives each step only what it needs. It is honest about what is missing (budget, reviews, photos, placement) and the owner could hand it straight to a developer.

## Judge list

- Met: Every claim travels as a whole card, with its amount, conditions and who it applies to.
  C4: "First order only, new customers only, needs the SMS discount. Not for Sugar-Free... limited flavours or Kids"; C2 carries study size, vitamins, 12 weeks.
- Met: The checking step gets the actual output and the original brief, not a summary.
  Step 7 Needs: "The actual image file. The actual copy.json. The original brief.json. cards.json."
- Met: The fixing step gets only the failed part and what depends on it.
  Step 8 Needs: "Only the failed field or the failed image. The named fault. The cards and on-image words that depend on it."
- Met: Counts, budgets and sums are left to code, not to the AI.
  "Code checks run between steps (not done by a model)"; "Before each call, code reserves the estimated cost"; character counts by code.
- Met: Nothing failed or partial is marked as a success, and no stock or made-up output fills a gap.
  "Failed or partial work stays failed or partial. It is never filled with stock or made-up output"; not_checked never counts as pass.

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
# Sprout ad chain: handoff plan

## 1. Claim cards

These cards are the only source for claims. Steps pick cards by ID and never reword them. If an ad uses a card's **Wording**, it must also carry that card's **Travels with** text word for word in the same ad, in the copy or on the image. Code checks this after every step.

| ID | Wording (exact) | Travels with (exact) | Limits | Source · label |
|---|---|---|---|---|
| C1 | "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack." | (none) | Per 1 daily pack, Adults (about 20 g). Never "per gummy". Never "20+" or "over 20". Kids pack facts: MISSING, so not for Kids ads. | Product page, science page · checked brand fact |
| C2 | "Clinically tested for nutrient absorption." | "2025 study of 120 healthy adults: blood vitamin C up 40.1%, folate up 20.5% after 12 weeks." | Randomized, double-blind, placebo-controlled, adults aged 23 to 59. Measured 2 vitamins in the blood only. Never "works", "proven", energy, immunity or "clinically backed formula". Adults only. | Science page · checked brand fact |
| C3 | "95% of surveyed users take Sprout at least 4-6x per week, with 80% taking daily." | "Brand survey of 3,000+ customers after 3 months." | "Of surveyed users" is never dropped. | Product page · checked brand fact (brand-reported) |
| C4 | "$29.99 for your first 28 packs ($1.07/day) with our new-customer text sign-up discount." | "Renews at $49.99 every 4 weeks ($1.78/day)." | Sprout Original Adults, Low Sugar, 28-pack subscription. First order only, new customers only, needs the SMS discount. Not for Sugar-Free (renews at $54.99, first-order price not shown), limited flavours or Kids. Never "DISCOUNT AUTO-APPLIED" alone. | Product page plan box and footer · checked brand fact |
| C5 | "30-day money-back guarantee on your first order." | (none) | Initial purchase only. Never "30-day guarantee" without "first order". | Product page FAQ · checked brand fact |
| C6 | "Supports digestion and gut health." | (none) | "Supports" only. Never fix, cure, relieve or end bloating, IBS or irregularity. | Product page · checked brand fact |
| C7 | "Third-party tested for 70 pesticides, 4 heavy metals, 16 contaminants, and 9 microbial contaminants." | (none) | Lot tested Sep 2026. Recheck the date before use. | Product page · checked brand fact |
| C8 | "Vegan, pectin-based, and free from gluten, dairy, tree nuts, peanuts, caffeine, synthetic sweeteners, and synthetic dyes." | (none) | Sugar-Free contains sugar alcohols. Never imply "no sweeteners at all". | Science page, ingredients panel · checked brand fact |
| C9 | "Made with methylfolate, not folic acid." | (none) | (none) | Science page · checked brand fact |
| C10 | "67% of surveyed users experienced better, more regular digestion." | "Brand survey of 3,000+ customers after 3 months." | Same as C3. | Product page · checked brand fact (brand-reported) |
| C11 | "52% of surveyed users feel more energized." | "Brand survey of 3,000+ customers after 3 months." | Same as C3. Never "boosts energy". | Product page · checked brand fact (brand-reported) |
| C12 | "4.75 stars from 109,639 reviews on our site." | (none) | On-site widget, read 13 Oct 2026. Never "4.8 from 100,000". Recheck before use. | Product page widget · checked brand fact (brand-reported) |

**Blocked list.** Code rejects any of these if found in copy, prompt or image text.

| ID | Blocked | Why |
|---|---|---|
| B1 | Any discount percentage (49%, 52%, 55%, 58%, 61%, "up to") | The live pages conflict. MISSING: which percentage, if any, is approved. Use C4 instead. |
| B2 | "Fix the Hot Girl Tummy", weight loss or muscle, "revive whole body vitality", energy or immunity from the study, "[Sprout] works", "35,000+ studies", "per gummy", 30/60/90-day results, "breaks down immediately / bioavailability", "Most fiber supplements contain only 5g", "$1.26 vs $3.60", "Less than 1% use our guarantee", "1M+ customers" | Risky or unsupported, per the brand file |
| B3 | GLP-1 as a brand claim, e.g. "help fill the gaps while eating less on a GLP-1" | Drug-adjacent. Reviews 11 and 14 are customer words only. |
| B4 | Kids: "bright minds", "brain health" | Claims about children. Kids facts are MISSING anyway. |
| B5 | Easy-cancel promises beyond "Pause Or Cancel Any Time" | Cancelling is the loudest public complaint |
| B6 | Cartoon or partner characters and marks | Brand rule. Use the flavour description only. |

**Other facts and how they are labelled**

- **Checked brand fact:**
  - Format: 28 packs a pouch; "small handful" of gummies.
  - Flavours and sugar levels.
  - Look and colours.
  - The "show it right" rules.
  - Voice lines.
  - Shipping: "typically ship within 24 hours and on average arrive 3-5 days later".
- **Customer words** (quoted research, never a testimonial in the ad):
  - The 20 reviews, each tagged R1 to R20.
  - R11 and R14 also carry the tag `GLP-1: research only`.
  - Buyer quotes from the brand file.
- **Guess to test:**
  - Everything under "What is known to work".
  - Every **(inferred)** item.
  - Buyer shares.
- **Creative choice:**
  - Angle, hook, scene and layout, as decided in steps 3 to 5.

`MISSING: the text of the 20 reviews` (not attached).

## 2. Handoff cards

**Step 1. Brand reading** (can open files, so it gets pointers)

- **Needs:**
  - Pointers to `sprout/brand.md`, `sprout/product-page.md`, the reviews file and `cards.json`, which holds this section as locked.
- **May use:**
  - The site pages, fetched if the tool allows.
- **Returns:** `facts.json`, containing:
  - `facts[]`, each with `{id, text, label, source}`.
  - `reviews[]`, each with `{R#, text, tags}`. R11 and R14 are tagged GLP-1.
  - `proposed_cards[]`. New claims go here and only become cards after a human approves them.
  - `conflicts[]`.
- **Never lose:**
  - The cards. This step reads them and may not edit them.
  - The labels.
  - Review text word for word.

**Step 2. Buyer** (no file access, so text is pasted)

- **Needs (pasted):**
  - The text of one buyer segment.
  - Reviews whose tags match that segment, in full.
- **May use:**
  - Doubts and quotes from the brand file for that segment.
- **Returns:** `buyer.json`, containing:
  - `segment`
  - `situation`
  - `tried_before[]`
  - `doubts[]`, as quotes with R#.
  - `words[]`, as quotes with R#.
  - `label: customer words`
- **Never lose:**
  - Exact quote wording and R# for every quote.
  - The GLP-1 tag on R11 and R14.
- **MISSING:** which buyer this run targets. If it is set by hand, paste only that segment.

**Step 3. Brief** (pasted)

- **Needs:**
  - The full text of all cards C1 to C12.
  - The blocked list.
  - `buyer.json`.
- **May use:**
  - The "known to work" lines, labelled as guesses to test.
  - Product format facts.
- **Returns:** `brief.json`, containing:
  - `buyer_segment`
  - `angle` (creative choice)
  - `hypothesis_tested`
  - `card_ids[]` (at most 3)
  - `on_image_words`, as exact strings.
  - `product_shown`, with each photo's role.
  - `cta`
  - `format`
- **Never lose:**
  - Card IDs, with each card's "Travels with" text counted as part of the card.
- **MISSING:**
  - Ad placement and size.
  - Character limits.
  - Which CTA buttons are allowed.

**Step 4. Copy** (pasted)

- **Needs:**
  - `brief.json`.
  - The full text of the selected cards only.
  - Customer words from `buyer.json`.
  - The voice section and the brand's existing lines.
  - The blocked list.
- **May use:**
  - Format facts, e.g. "Rip. Tip. Enjoy." and "small handful".
- **Returns:** `copy.json`, containing:
  - `primary_text`
  - `headline`
  - `description`
  - `cta`
  - `card_ids_used[]`
- **Never lose:**
  - Card wording and its "Travels with" text, word for word.
  - Customer words, used as research only, never as a quoted testimonial.

**Step 5. Image prompt** (pasted)

- **Needs:**
  - The "Look" section.
  - The "Show it right" rules.
  - `on_image_words` and `product_shown` from the brief.
  - Product photo files with their roles.
- **May use:**
  - The photo style line: bright, sunny, two-colour gradient, everyday adults.
- **Returns:** `prompt.json`, containing:
  - `prompt`
  - `must_not[]`: no torn big pouch, no side or corner tear, no partner marks.
  - `exact_text[]`
  - `reference_images[]`, each with `{file, role}`.
  - `aspect`
- **Never lose:**
  - The exact on-image words.
  - Photo roles.
  - Pouch and pack rules.
- **MISSING:**
  - The product photo files.
  - Whether the image tool accepts reference images.

**Step 6. Image tool**

- **Needs:**
  - `prompt.json` as plain fields.
  - The reference image files.
- **May use:** nothing else.
- **Returns:**
  - The image file.
  - Tool metadata: seed, model and usage.
- **Never lose:**
  - The reference images and their roles.

**Step 7. Check** (can open files, so it gets pointers)

- **Needs:**
  - The actual image file.
  - The actual `copy.json`.
  - The original `brief.json`.
  - `cards.json`.
  - The blocked list.
  - The "show it right" rules.
  - The results of the code checks.
- **May use:**
  - `buyer.json`, to judge fit.
- **Returns:** `check.json` with one entry per check, each holding:
  - `{check, pass|fail|not_checked, fault, location, card_id}`
- **Never lose:**
  - Any fault.
  - The rule that a check it cannot do counts as `not_checked`, never `pass`.
- **MISSING:** whether the checker model can see images. If it cannot, the image checks report `not_checked` and the run stays partial.

**Step 8. Fix** (pasted)

- **Needs:**
  - Only the failed field or the failed image.
  - The named fault.
  - The cards and on-image words that depend on it.
- **May use:**
  - The brief's angle line.
- **Returns:**
  - The repaired field in the same shape. An image fault returns a repaired `prompt.json`, which goes back through step 6.
  - `card_ids_used[]`.
  - The result always goes back through step 7.
- **Never lose:**
  - Untouched fields.
  - Card wording.

**Code checks run between steps** (not done by a model):

- JSON shape.
- Every card ID exists.
- Each used card's Wording and Travels-with text appear word for word.
- Every number, `%` and `$` in the copy, prompt or image text matches a used card.
- No blocked string appears.
- Character counts.
- OCR on the image to compare its text with `on_image_words`, if OCR is available.

## 3. Bundle order

| Order | Stable start (cached) | Changing part (last) |
|---|---|---|
| 1 | Output rules → `cards.json` pointer → blocked list → brand file pointers | Reviews file pointer |
| 2 | Output rules → labels → buyer segment text | Matching reviews |
| 3 | Output rules → C1 to C12 → blocked list → format facts → "known to work" guesses | `buyer.json` |
| 4 | Output rules → voice → blocked list | Selected cards → buyer words → brief |
| 5 | Output rules → look → show-it-right → photo roles | `on_image_words`, `product_shown` |
| 6 | (none) | Prompt and references |
| 7 | Check list → cards → blocked list → show-it-right | Brief → copy → image → code results |
| 8 | Output rules | Failed part → fault → dependent cards |

What was cut compared with today's "whole file plus 20 reviews to every step":

- The reviews go only to steps 1 and 2.
- Competitors, merch, electrolytes, the Kids line (for Adults ads) and the "Page facts" setup notes are cut from steps 2 to 8.
- No claim card is cut.

## 4. Run rules

**Save for each step:**

- Input fingerprint (a hash of the bundle).
- Skill and prompt version.
- Model and settings.
- The exact request.
- The raw reply.
- The checked result and its status (`checked`, `failed`, `partial` or `not_run`).
- Provider usage.
- Cost.
- Retry count and the reason for each retry.

**Retries:**

| Failure | Action | Cap |
|---|---|---|
| Parse or shape failure | Rerun the same step | 2 |
| Image tool error (timeout or server error) | Rerun the image tool | 2 |
| Named check fault | Step 8, then step 7 again | 2 rounds per fault |

- When a cap is hit, the run is marked `failed: <fault>` and stops.
- "Make it better" with no named fault is never a reason to retry.

**Budget:**

- `MISSING: budget`.
- Before each call, code reserves the estimated cost.
- A new call starts only if spent + reserved + the next estimate is within the budget.
- Retries draw on the same budget.
- When a job finishes, its reservation is released and replaced with the actual cost.

**Resume:**

- A resumed run starts from the last step whose status is `checked` and whose fingerprint matches.
- Failed or partial work stays failed or partial. It is never filled with stock or made-up output.

**Measuring:**

- Usage has not been measured yet.
- Code estimates each bundle at characters ÷ 4 tokens. These are labelled `estimate`.
- Provider usage is recorded separately as `measured`. The two are never mixed in one total.

## 5. Shortfalls and trade-offs

**Missing inputs:**

- `MISSING: review text (20 reviews)`
- `MISSING: which buyer this run targets`
- `MISSING: ad placement, size and character limits`
- `MISSING: product photo files, and whether the image tool accepts them`
- `MISSING: whether the checker can see images`
- `MISSING: budget`
- `MISSING: which discount percentage is approved`. Until one is approved, all percentages stay blocked and C4 carries the offer.
- `MISSING: Kids pack nutrition facts`. Until they arrive, the cards are for Adults ads only.

**Trade-offs:**

- **Length:** carrying C2 and C4 with their "Travels with" text makes the copy longer. If a placement's character limit is too short for that, the brief should not pick those cards. The text is never cut.
- **Testimonials:** customer words cannot appear as quoted testimonials, so review lines shape the voice but are not quoted in the ad.
- **Bundle size:** step 3 gets all 12 cards so it can choose. That costs tokens, but it means no card ever arrives without its limits.

## 6. Score

| Check | Result |
|---|---|
| Every claim travels as a whole card, with its limits | Pass |
| No step depends on a reference it can't open | Pass. Pointers go only to steps 1 and 7; the rest get pasted text. |
| Checkers and fixers get what they need to judge or repair the real output | Pass. The checker gets the real image and copy plus the brief and cards. The fixer gets the failed part, the fault and the dependent cards. |
| Counts, budgets and sums are done by code | Pass |
| Nothing failed or partial is reported as a success | Pass. `not_checked` is never counted as a pass. |
| Measured usage is reported apart from estimates | Pass |

**6 / 6 × 100 = 100.** No checks missed. The score measures the plan against its own checks, not the MISSING inputs listed above.
```
