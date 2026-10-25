# Copy Prompt Pack

**Copy-paste these into Claude Code or any LLM. Each prompt is scoped to one copy component so you can mix, match, and iterate without regenerating the whole set.**

---

## Prompt 1 — Full Ad Copy Set (the master prompt)

```
You are Jordan, a copywriter agent. Generate 5 ad copy sets for the product below.

Product: [PRODUCT NAME]
Category: [CATEGORY]
Price: [PRICE]
Marketing theme: [Urgency | Lifestyle | Social Proof | Problem/Solution | Features/Benefits | Us vs Them | FOMO | Educational | Aspirational]
Awareness stage: [Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware]
Target persona: [ONE SENTENCE DESCRIPTION]
Key benefit: [CORE OUTCOME]
Top objection to handle: [OBJECTION]
Offer: [DISCOUNT, FREE SHIPPING, RISK REVERSAL, or NONE]
Brand voice: [2-3 ADJECTIVES]
Existing winning headlines (if any): [PASTE OR LEAVE BLANK]

Rules:
- Headlines: 4-6 words, under 40 characters
- Each of 5 sets must use a DIFFERENT angle: benefit, pain point, proof, curiosity, urgency
- CTA: 2-4 words, no "Buy"
- No em dashes, no ALL CAPS sentences
- Banned: game-changer, revolutionary, leverage, unlock, skyrocket, delve, at the end of the day
- At least 3 different frameworks across the 5 sets

Output format per set:
Set [N] — Angle: [angle name] — Framework: [framework name]
Headline: [text] ([char count])
Subheadline: [text] ([char count])
Body: [text]
CTA: [text]
```

---

## Prompt 2 — Headline Only (fast iteration)

```
Write 10 headlines for [PRODUCT] targeting [PERSONA] at the [AWARENESS STAGE] stage.

Two each from these 5 angles: benefit, pain point, proof, curiosity, urgency.

Rules: 4-6 words each, under 40 chars, no em dashes, no exclamation marks, no banned AI words (game-changer, revolutionary, leverage, unlock, skyrocket, delve).

Format: [angle] | [headline] | ([char count])
```

---

## Prompt 3 — Subheadline Only (headline already locked)

```
My headline is: "[LOCKED HEADLINE]"

Write 4 subheadline options. Each must:
- Be 6-12 words
- Add a NEW dimension the headline does not cover
- Never restate the headline

One option should lead with evidence. One with audience identity. One with mechanism. One with stakes.
```

---

## Prompt 4 — Body Copy Only (for static ads)

```
Product: [PRODUCT]
Headline on ad: [HEADLINE]
Awareness stage: [STAGE]
Theme: [THEME]

Write 4 body copy variants. Each 1-2 lines. Static ad. Must be scannable.

Variant A: PAS (Problem, Agitate, Solve)
Variant B: Feature-Benefit-Proof
Variant C: Testimonial pull quote + verified buyer tag
Variant D: Educational one-liner that positions the brand as expert
```

---

## Prompt 5 — CTA Only

```
Write 6 CTAs for a [THEME] ad in the [AWARENESS STAGE] stage.

Rules:
- 2-4 words
- No "Buy"
- CTA style matches the stage: soft for Unaware/Problem Aware, direct for Product Aware/Most Aware
- Include 2 action verbs (Shop, Get, Try, Claim), 2 exploration verbs (Learn, Discover, Explore, See), and 2 urgency verbs (Claim, Grab, Save)
```

---

## Prompt 6 — Awareness-Stage Adaptation (one angle, 5 ads)

```
Core messaging angle: [ONE SENTENCE ABOUT THE PRODUCT MECHANISM OR BENEFIT]

Adapt this single angle into 5 separate ad copy sets, one for each awareness stage:

1. Unaware — pattern interrupt + curiosity gap, soft CTA
2. Problem Aware — agitate the pain + hint at solution, "Discover how"
3. Solution Aware — solution category + unique differentiator, "Compare now"
4. Product Aware — product benefit + social proof or urgency, "Shop now"
5. Most Aware — direct offer + scarcity, "Claim discount"

For each stage, give me: hook line, body line, CTA. Show the character counts.
```

---

## Prompt 7 — Voice Calibration Tuning

```
Rewrite the copy below using these voice axes:

formal_casual: [1-10]  (1 = luxury press release, 10 = text from a friend)
bold_subtle: [1-10]    (1 = gentle suggestion, 10 = commanding claim)
rational_emotional: [1-10]  (1 = data-led, 10 = feeling-led)

Descriptors the tone must match: [2-3 adjectives]

Copy to rewrite:
[PASTE ORIGINAL COPY]
```

---

## Prompt 8 — A/B Test Recommendation

```
Here are 5 copy sets I just generated: [PASTE SETS]

For each pair I could test, tell me:
1. Which variable is isolated (angle, framework, tone, CTA)
2. Which 2 sets to test FIRST and why
3. Minimum impressions per variant for significance
4. What metric to measure (CTR for top-funnel, CVR for bottom-funnel)
5. Kill criteria: when do I stop the test and declare a winner or loser
```
