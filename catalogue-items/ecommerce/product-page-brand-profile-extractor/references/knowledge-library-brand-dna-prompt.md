# /brand-dna — Skill Prompt

**Extracts complete brand DNA from a product URL. Visual DNA, voice DNA, competitive positioning, and marketing angles — in one run.**

---

## The Prompt

```
You are the Brand DNA Extractor. Extract the complete brand DNA from the inputs below. Use the BRAND DNA TEMPLATE schema (10 sections). Fill every section with evidence from the inputs. Where evidence is thin, mark the section with "LOW CONFIDENCE — needs founder interview".

INPUTS
Brand URL: [URL]
Product URL: [URL]
Additional context: [about page, social media handles, press mentions, reviews — paste or link]
Founder interview notes (if any): [PASTE]
Existing brand assets (if any): [logos, color guide, brand book]

WORKFLOW
1. Scrape the homepage, product page, and about page.
2. Pull visible color palette from product photography + site UI.
3. Identify typography families (via font inspection or manual identification).
4. Classify photography style (editorial / clinical / lifestyle / studio / purist / cinematic).
5. Extract voice from homepage copy + product descriptions + hero statements.
6. Identify marketing angles from ad library (if accessible) + site copy.
7. Identify competitive positioning from site claims + pricing + category benchmarks.
8. Output the complete 10-section DNA template.

OUTPUT FORMAT

# Brand DNA — [BRAND NAME]

## 1. Brand Identity
One-sentence statement: [...]
Origin story: [...]
Problem solved: [...]
For: [...]
Not for: [...]

## 2. Visual DNA
Primary colors:
- Primary 1: #______ (source: homepage hero / product packaging / etc)
- Primary 2: #______
- Primary 3: #______
Secondary colors: #______, #______
Neutrals: #______, #______, #______
Forbidden colors: [LIST + WHY]
Typography: [FAMILIES + USES]
Photography style: [ONE + REASONING]
Lighting: [PRIMARY + AVOID]
Composition: [RULES]

## 3. Voice DNA
Voice axes: formal/casual ___, bold/subtle ___, rational/emotional ___, warm/cold ___, playful/serious ___
Descriptors: [3-5 ADJECTIVES]
Phrases we use: [5 EXACT PHRASES FROM SITE]
Phrases we never use: [3 WITH REASONS]
Banned words (brand-specific): [LIST]

## 4. Packaging + Product DNA
[Hero photography rules, packaging variants, colors, forbidden framings]

## 5. Brand Mark
[Logo inventory, clear space, min size, placement defaults, color rules]

## 6. Marketing Angles
Top 5 used: [RANKED]
2 avoided: [WITH WHY]
Proof points: [LIST]

## 7. Competitive Positioning
Direct competitors: [3 WITH URLS]
Not direct (overlap-but-different): [2 WITH WHY]
Single biggest differentiator: [ONE SENTENCE]
2x2 position: [PRICE + STYLE QUADRANT]

## 8. Compliance + Legal
Category rules: [LIST IF ANY]
Required disclosures: [LIST]
Forbidden claims: [LIST]
Platform-specific: [META / GOOGLE / TIKTOK NOTES]

## 9. Forbidden Patterns
[5+ THINGS THE BRAND NEVER DOES]

## 10. Confidence Notes
Strong evidence: [LIST OF SECTIONS HIGH CONFIDENCE]
Low confidence: [LIST OF SECTIONS NEEDING FOUNDER INTERVIEW]
Next steps: [WHAT TO ASK FOUNDER TO FILL GAPS]
```

---

## Example run

Input:
```
Brand URL: lumen-wellness.com
Product URL: lumen-wellness.com/products/whipped-tallow
Additional context: Founder podcast appearance transcript, 50 recent reviews
Founder interview: None
```

Expected output (abbreviated):

```
# Brand DNA — Lumen Wellness

## 1. Brand Identity
One-sentence statement: Grass-fed tallow skincare made for people who want one jar to replace their entire shelf.
Origin story: Founded after the founder's family dermatologist-prescribed routine stopped working. Product built around single-ingredient-philosophy tallow from regenerative ranches.
Problem solved: Barrier breakdown, cyclical flaking, multi-step routine fatigue.
For: Women 28-45, wellness-aligned, tried 3+ serums, reducing to essentials.
Not for: High-frequency acne-treatment seekers; anti-aging-obsessed buyers; budget-first shoppers.

## 2. Visual DNA
Primary colors:
- Primary 1: #E8DFD0 (cream / neutral hero — source: homepage + packaging)
- Primary 2: #3A2E1F (deep brown — source: logo + accents)
- Primary 3: #C9A66B (warm tan — source: button + CTA color)
Secondary colors: #F2EBDD (pale cream), #736049 (mid brown)
Neutrals: #FFFFFF, #F7F2EA, #1E1A14
Forbidden colors: Neon, cool blues, pure black (brand uses off-black only)
Typography: Serif primary (Canela or similar) for H1; sans-serif body (Sohne or similar)
Photography style: Editorial-purist. Warm natural light. Never clinical.
Lighting: Natural, warm, morning-golden. Avoid flash, neon, cool fluorescent.
Composition: Negative space emphasis. Product often off-center. Rule of thirds dominant.

## 3. Voice DNA
Voice axes: formal/casual 7, bold/subtle 6, rational/emotional 5, warm/cold 8, playful/serious 4
Descriptors: honest, warm, confident, grounded, quiet
Phrases we use:
  1. "One jar."
  2. "Made with single-origin tallow."
  3. "No water, no filler."
  4. "For the shelf reduction era."
  5. "The return to simple."
Phrases we never use:
  1. "Game-changer" (marketing cliché — clashes with quiet-confidence voice)
  2. "Revolutionary" (over-promises; category is ancestral, not revolutionary)
  3. "Luxurious" (we are functional, not luxury)
Banned: revolutionary, game-changer, unlock, leverage, level up, clinical-grade

## 4. Packaging + Product DNA
Hero photography rules: Jar upright, label centered, warm cream background.
Packaging variants: 2oz, 4oz, refill pouch.
Product inside: pale cream-yellow, semi-solid.
Forbidden framings: Floating product (breaks grounded voice), clinical lab backgrounds.

## 5. Brand Mark
Primary lockup (horizontal), monogram available. Bottom-left default placement in ads.
Minimum 24px. Clear space = height of the "B". Dark brown on cream, cream on dark brown. Never on the product itself.

## 6. Marketing Angles
Top 5 used:
  1. Shelf reduction / minimalism
  2. Ingredient transparency
  3. Ancestral / traditional practice
  4. Sourcing story (regenerative ranches)
  5. Single-ingredient philosophy
Avoided:
  1. Anti-aging (clashes with wellness-first voice)
  2. Cure-promises (regulatory + brand voice)
Proof points:
  - Single-origin sourcing from 3 named ranches
  - Zero water, zero emulsifiers
  - 14-day barrier result photos
  - 30-day refund policy

## 7. Competitive Positioning
Direct: Primally Pure, Fatco, Vintage Tradition
Not direct: CeraVe (mass-market), Drunk Elephant (serum-focused luxury)
Differentiator: Sourced single-origin from regenerative ranches, not white-label tallow.
2x2 position: Mid-price, purist-wellness quadrant.

## 8. Compliance + Legal
Category: Skincare — avoid drug claims.
Required: Ingredient list, weight, manufacturer name.
Forbidden: "Treats", "cures", "heals", "dermatologist-approved" (unless true and documented).
Platform-specific: Meta restricts before/after in certain cases; use day 1 / day 14 photos with explicit labels.

## 9. Forbidden Patterns
- Neon colors
- Clipart illustrations
- Stock photo aesthetic
- Clinical lab backgrounds
- Multi-product hero shots (violates "one jar" voice)
- Over-filtered photography
- Politicized messaging

## 10. Confidence Notes
Strong evidence: Sections 1, 2, 3, 6 (site + reviews provided rich signal)
Low confidence: Sections 5 (need the full brand guide), 7 (need founder-stated competitor view), 8 (need legal review)
Next steps:
  - Request brand guide PDF from founder
  - 30-min founder interview on competitive positioning
  - Legal review of forbidden claims list
```

---

## Variations

### Variation A — Refresh only

```
/brand-dna refresh

Existing DNA: [PASTE OR LINK]
New evidence: [new site version / new product / new founder statement]

Output ONLY the sections that have changed. Flag each change with a reason.
```

### Variation B — Visual DNA only (for image pipeline)

```
/brand-dna visual-only

Brand URL: [URL]
Product URL: [URL]

Extract sections 2, 4, 5, 9 ONLY. Skip voice, angles, compliance. This is the short DNA the image pipeline needs.
```

### Variation C — Voice DNA only (for copy pipeline)

```
/brand-dna voice-only

Brand URL: [URL]
Recent customer reviews: [PASTE]
Recent ad copy: [PASTE]

Extract section 3 ONLY. Calibrate voice axes, descriptors, phrases we use, phrases we never use.
```

### Variation D — Competitive gap analysis

```
/brand-dna competitive-gap

Our DNA: [PASTE]
Competitor DNA (if extracted): [PASTE]

Compare section 6 (marketing angles) and section 7 (positioning). Output: (a) angles we lean on that they don't, (b) angles they lean on that we don't, (c) where they are winning on voice that we could challenge.
```

---

## How this chains into the agent stack

1. Run `/brand-dna` at the start of every new client engagement
2. Store the output in a brand DNA document (markdown or database record)
3. Sage (image gen) binds to this DNA at step 5 of the prompt pipeline
4. Jordan (copywriter) pulls voice DNA for every copy job
5. Riley (creative review) uses sections 2, 4, 5, 9 for QA checks
6. Re-run on refresh triggers (rebrand, new line, 90 days)
