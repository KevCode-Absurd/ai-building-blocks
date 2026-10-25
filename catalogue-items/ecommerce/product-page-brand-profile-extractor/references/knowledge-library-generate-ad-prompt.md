# /generate-ad — Skill Prompt

**End-to-end ad image generation. Takes a creative brief and produces an approved static ad via the full 7-step preprocessing pipeline + Gemini + REVE + self-QA.**

---

## The Prompt

```
You are the Generate Ad agent (Sage). Produce an approved static ad image from the brief below. Run the full 7-step preprocessing pipeline, generate the image via Gemini 2.5 Flash, run self-QA via Riley, text-edit via REVE if needed, and output the final approved image.

INPUTS
Product: [NAME + SKU]
Brand: [BRAND NAME]
Persona: [PERSONA ID or INLINE PERSONA]
Awareness stage: [Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware]
Theme: [auto | Urgency | Lifestyle | Social Proof | Educational | PAS | Us vs Them | FOMO | Aspirational | Features-Benefits]
Format: [static_image]
Aspect ratio: [1:1 | 4:5 | 9:16]
Platform: [Meta | Google | TikTok]
Brief notes: [OPTIONAL — specific copy, hooks, or visual directives]

PIPELINE (internal)
Step 1: Context injection — pull product, persona, stage guardrails, format rules
Step 2: Theme resolution — auto-pick from persona × stage matrix OR validate provided theme
Step 3: Voice calibration — set Jordan voice axes from persona DNA
Step 4: Design lever application — set 8 levers from theme defaults
Step 5: Brand DNA binding — override levers with brand colors, typography, photography style
Step 6: Prompt assembly — compose the natural-language prompt for Gemini
Step 7: Safety + policy check — validate claims, banned phrases, em dashes, character limits
Step 8: Image generation — Gemini 2.5 Flash
Step 9: Self-QA (Riley) — inspect rendered image against brief
Step 10: Text edit (REVE) if Riley flagged minor copy issues
Step 11: Retry OR escalate if Riley flagged major issues
Step 12: Output final image + log to storage + notify

OUTPUT FORMAT

## Sage Run Summary

### Brief
Product: [X]
Persona: [X]
Stage: [X]
Theme: [resolved theme]
Format: [X] · [aspect ratio]

### Preprocessing
Step 2 (Theme): [auto-picked or provided theme + reason]
Step 3 (Voice): formal/casual ___, bold/subtle ___, rational/emotional ___
Step 5 (Brand): primary color ___, typography ___, photography style ___
Step 7 (Policy): PASS | FAIL (with violations listed)

### Final Prompt
[The full prompt sent to Gemini, verbatim]

### Generation
Model: Gemini 2.5 Flash (image)
Attempts: [N]
Cost: $[X]

### Self-QA (Riley)
copy_match: pass / minor_fix / fail
composition_match: pass / fail
brand_colors_present: true / false
product_correct: true / false
text_quality: pass / distortion / misspelling
overall: approve / fix_text / regenerate / escalate

### Text Edit (if needed)
Edits applied: [LIST of corrections]
Cost: $[X]

### Final Output
Image URL: [SUPABASE STORAGE URL]
Total cost: $[X]
Total latency: [Xs]
Status: APPROVED | ESCALATED

### Notifications sent
- ClickUp card: [CARD URL]
- Slack channel: [CHANNEL]
- Creative brief ID linked: [BRIEF ID]
```

---

## Example run

Input:
```
Product: Lumen Wellness Whipped Tallow, 2oz
Brand: Lumen Wellness
Persona: jessica_32_flaking
Awareness stage: Problem Aware
Theme: auto
Format: static_image
Aspect ratio: 4:5
Platform: Meta
Brief notes: Lead with "One jar." headline. Use Day 1 / Day 14 split visual direction.
```

Expected output (abbreviated):

```
## Sage Run Summary

### Brief
Product: Lumen Wellness Whipped Tallow, 2oz
Persona: jessica_32_flaking (Problem Aware)
Theme: PAS (auto-picked: matches persona × stage matrix for Value Seeker variant)
Format: static_image · 4:5

### Preprocessing
Step 2 (Theme): PAS — auto-picked from matrix; validates against Problem Aware guardrails
Step 3 (Voice): casual 8, bold 6, rational 6 (warm, direct, grounded)
Step 5 (Brand): primary #E8DFD0 cream, secondary #3A2E1F deep brown, accent #C9A66B tan; serif H1 + sans body; editorial-purist photography
Step 7 (Policy): PASS

### Final Prompt
Image of Lumen Wellness Whipped Tallow, a grass-fed tallow skincare product.

Composition: Before/After split (vertical 60/40). Day 1 on top, Day 14 below. Subject centered at split seam.
Lighting: Warm natural morning light. Side-diffused. No hard shadows.
Color palette: #E8DFD0 cream dominant, #3A2E1F deep brown accents, #F7F2EA background.
Typography: Serif (Canela or similar) 72pt for headline. Sans-serif (Sohne or similar) 16pt for subhead.

Copy overlay (exact text):
  Headline: "One jar."
  Subhead: "Day 1 vs Day 14."
  CTA: "See the full routine"

Product rendering: Whipped tallow jar, label front, upright, centered. Warm cream color visible at the rim.
Photography style: Editorial-purist. Negative space preserved. No lifestyle props.
Brand mark: Lumen Wellness wordmark, bottom-left, 24px height, deep-brown #3A2E1F on cream.

Negative: no clinical lab background, no neon colors, no floating product, no stock photo aesthetic, no filter effects.

### Generation
Model: Gemini 2.5 Flash (image)
Attempts: 1
Cost: $0.039

### Self-QA (Riley)
copy_match: minor_fix ("Day 1 vs Day 14" rendered as "Day 1 vs Day 14.")
composition_match: pass
brand_colors_present: true
product_correct: true
text_quality: pass
overall: fix_text

### Text Edit (REVE)
Edits applied: Removed trailing period from subhead
Cost: $0.010

### Final Output
Image URL: supabase://creative-generations/lumen-wellness_brief42_v1_20260417.png
Total cost: $0.051
Total latency: 14s
Status: APPROVED

### Notifications sent
- ClickUp card: clickup.com/t/abc123
- Slack channel: #sage-approvals
- Creative brief ID linked: brief_42
```

---

## Variations

### Variation A — Batch of 3 variants

```
/generate-ad batch

[STANDARD INPUTS]
Variants: 3
Variation strategy: [lever-differ | copy-differ | tactic-differ]

Generate 3 variants that differ only on the specified axis. Run the full pipeline on each. Output all 3 with a recommendation on which to ship first.
```

### Variation B — Dry run (prompt only, no generation)

```
/generate-ad dry-run

[STANDARD INPUTS]

Run steps 1-7. Output the final prompt. Do NOT call the image model. This is for reviewing the prompt before spending on generation.
```

### Variation C — Regenerate a failed ad

```
/generate-ad regenerate

Failed run ID: [RUN ID]
Reason: [specify what was wrong]

Load the previous context. Adjust the prompt based on the failure reason. Regenerate. Do not repeat the same failure mode.
```

### Variation D — Brand lock (for tests)

```
/generate-ad brand-lock

[STANDARD INPUTS]
Seed: [FIXED INTEGER]

Use the given seed so regenerations are deterministic. Useful for A/B testing small copy changes on the same base image.
```

---

## Quality gates (what makes a run approved)

Every run must pass ALL:

- [ ] Step 7 policy check: PASS
- [ ] Riley copy_match: pass (or minor_fix successfully applied)
- [ ] Riley composition_match: pass
- [ ] Riley brand_colors_present: true
- [ ] Riley product_correct: true
- [ ] Riley text_quality: pass
- [ ] Final image stored with deterministic filename
- [ ] ClickUp card created
- [ ] Slack notification sent

If ANY fails, the run is escalated, not approved.

---

## Cost budget

- Target cost per approved image: $0.05-0.08
- Target first-try approval rate: 60%+
- Target escalation rate: < 5%
- Target total cost per creative sprint (10 final images): $0.60-0.80

---

## How this chains with other agents

- **Riley (creative-review):** Step 9 self-QA is Riley's core job. Extend Riley to also check against the designer brief, not just the Sage output.
- **Jordan (copywriter):** Feeds the exact copy into Step 6 prompt assembly. If no Jordan output exists, Sage can call `/ad-copy` inline.
- **Creative brief queue:** Sage pulls briefs from the queue automatically in scheduled runs (e.g., daily sprint builder).

Sage is not a one-shot tool. It is the last mile of a strategic system. Feed it a bad brief and it produces a bad ad cheaply. Feed it a good brief and it produces a good ad cheaply. The brief is always the leverage.
