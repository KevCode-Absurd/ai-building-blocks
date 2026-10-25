# Image Generation Architecture

**The full pipeline that takes a creative brief and produces a client-ready ad image. Three models, seven preprocessing steps, one self-QA loop. Keeps cost around $0.05/image and failure rate under 5%.**

---

## The end-to-end flow

```
[Creative Brief]
       ↓
[1-7] Prompt Preprocessing Pipeline (see prompt-pipeline-diagram.md)
       ↓
[8] Image Generation (Gemini 2.5 Flash)
       ↓
[9] Self-QA (Riley inspection)
       ↓
   ┌───Pass──→ [10] Text Edit (REVE Fast, if needed)
   │                        ↓
   └───Fail──→ [11] Retry OR Escalate
                            ↓
              [12] Final Image → Storage → ClickUp card
```

---

## Models used

| Stage | Model | Cost | Why |
|---|---|---|---|
| Image generation | Gemini 2.5 Flash (image) | ~$0.039/image | Fast, good subject consistency, handles product rendering |
| Text/copy edits | REVE Fast Edit | ~$0.01/edit | Precise text corrections without regenerating the whole image |
| Self-QA inspection | Gemini 2.5 Flash (vision) | ~$0.002/inspection | Multimodal eval of the rendered image against spec |
| Emergency regen | Flux Pro 1.1 | ~$0.04/image | Used only if Gemini fails twice |

Total typical cost per final image: **$0.05 - $0.08**.

---

## Step-by-step

### Step 1-7 — Prompt Preprocessing
See `prompt-pipeline-diagram.md` for the full 7-step preprocessing. Ends with a final natural-language prompt and a policy-check pass.

### Step 8 — Image Generation

**Input:** Final prompt from step 7

**Model call:**
```
POST gemini/2.5-flash/image
{
  "prompt": "[FINAL PROMPT]",
  "aspect_ratio": "1:1" | "4:5" | "9:16",
  "seed": random | fixed-for-variations
}
```

**Output:** PNG or JPEG binary + metadata (seed, model version, generation ID)

**Common failures:**
- Prompt too long (> 1500 tokens) → truncate the negative block, retry
- Model refuses prompt (safety flag) → return to Step 7 policy check; adjust prompt
- Generation timeout → retry once with same seed; on second fail, switch to Flux Pro

---

### Step 9 — Self-QA (Riley inspection)

**Input:** Rendered image + original brief

**Model call (Gemini vision):**
```
Inspect the image below against the brief. Check:

1. Does the visible copy match the brief exactly?
   Brief headline: "[EXPECTED]"
   Brief subhead: "[EXPECTED]"
   Brief CTA: "[EXPECTED]"

2. Does the composition match the brief's layout?
   Expected: [LAYOUT]

3. Are the brand colors present and correctly used?
   Primary: #______
   Secondary: #______

4. Is the product rendered correctly?
   Expected: [DESCRIPTION — orientation, label, packaging]

5. Is there any text distortion, wrong spelling, or garbled typography?

Output JSON:
{
  "copy_match": "pass" | "minor_fix" | "fail",
  "copy_issues": ["specific errors"],
  "composition_match": "pass" | "fail",
  "brand_colors_present": true | false,
  "product_correct": true | false,
  "text_quality": "pass" | "has_distortion" | "has_misspelling",
  "overall": "approve" | "fix_text" | "regenerate" | "escalate"
}
```

**Decision tree:**
- `overall = "approve"` → Step 12 (final)
- `overall = "fix_text"` → Step 10 (REVE edit)
- `overall = "regenerate"` → Step 11 (retry generation, max 2 total)
- `overall = "escalate"` → Step 11 (escalate to human)

---

### Step 10 — Text Edit (REVE Fast)

**When to use:** Copy is wrong or distorted, but composition and everything else is good.

**Input:** The Gemini-generated image + specific copy edit

**Model call:**
```
POST reve/edit
{
  "image": "[PNG BASE64]",
  "edit_instruction": "Replace headline text with exactly: '[CORRECT COPY]'. Keep font, size, position, and color the same. Do not alter any other element of the image."
}
```

**Output:** Edited PNG. Run Step 9 again to validate the edit.

**Hard limit:** Max 2 text edits per image. On third failure, regenerate entirely.

---

### Step 11 — Retry OR Escalate

**Retry logic:**
- Generation attempt 1 fails → retry with same seed + prompt, max 30 sec
- Attempt 2 fails → retry with modified prompt (remove non-essential constraints)
- Attempt 3 fails → switch model to Flux Pro 1.1
- Attempt 4 fails → escalate to human

**Escalation path:**
- Post to ClickUp: "Image generation failed after 4 attempts. Brief ID: [X]. Human review required."
- Attach: all 4 generated attempts, the final prompt, and the Riley inspection output

---

### Step 12 — Final Output

**Actions:**
1. Upload final image to S3 / Supabase storage with deterministic filename: `{brand}_{brief_id}_{variant}_{timestamp}.png`
2. Create ClickUp card in the designated approval list
3. Attach: final image, brief, prompt, Riley inspection report
4. Notify Slack channel for creative approval
5. Log cost (generation + edits + inspection) to the brand's creative budget

---

## Storage schema

### `generation_runs`
- run_id (pk)
- brief_id (fk)
- final_prompt
- model_used (gemini_2_5_flash | flux_pro_1_1)
- attempts (int)
- total_cost_usd
- status (approved | fixed_text | regenerated | escalated)
- final_image_url

### `inspection_results`
- inspection_id (pk)
- run_id (fk)
- attempt_number
- copy_match, composition_match, brand_colors_present, product_correct, text_quality
- overall_decision
- raw_response_json

---

## Cost model (expected)

| Outcome | Generation | Inspection | Edit | Total |
|---|---|---|---|---|
| First-try approve (60%) | $0.039 | $0.002 | — | $0.041 |
| Text edit needed (25%) | $0.039 | $0.002 | $0.012 | $0.053 |
| Regenerate once (12%) | $0.078 | $0.004 | — | $0.082 |
| Escalate (3%) | $0.156 | $0.008 | — | $0.164 + human time |
| **Weighted average** | | | | **~$0.06/image** |

Budget assumption: $6 in AI cost per 100 images shipped. Human review cost applied on top for the 3% escalation path.

---

## Throughput

- Single pipeline run: 10-30 seconds (preprocessing 2-5s + generation 5-15s + inspection 3-5s + optional edit 2-5s)
- Parallel: run up to 10 pipelines concurrently per worker; 100+ images/hour capacity
- With Render worker + BullMQ: 500+ images/day sustainable

---

## Quality bar (what counts as "approved")

An image is approved ONLY when:

1. Every copy element matches the brief exactly
2. No text distortion or misspellings
3. All brand colors present and correctly placed
4. Product rendered to spec (orientation, label, packaging)
5. No forbidden patterns (per brand DNA Section 9)
6. Composition matches the requested layout archetype

Below the bar = rejected. We do not ship "close enough."

---

## Failure modes + mitigations

| Mode | Frequency | Mitigation |
|---|---|---|
| Garbled text | 15-20% of first-try | REVE edit pass; Gemini improves with explicit font + spacing instructions |
| Wrong product rendering | 5-10% | Include a product reference image in the prompt (few-shot) |
| Brand color drift | 5-10% | Explicit hex codes in prompt; Riley checks; regenerate if drift > threshold |
| Extra logos / watermarks | 2-5% | Strong negative prompt; post-process crop if minor |
| Banned phrases in copy | <1% | Step 7 policy check; retry with substitution |
| Platform policy violation | <1% | Pre-submit platform check before posting to Ads Manager |

---

## Integration points

- **Trigger:** Slack `/generate-ad` OR creative brief queue in strategy dashboard
- **Worker:** `worker/agent-system.ts` routes to `lib/agents/sage/` module
- **Storage:** Supabase storage bucket `creative-generations/`
- **Approval:** ClickUp card in `Sage Output Review` list
- **Notification:** Slack bot posts image + approval buttons
- **Downstream:** approved creatives → Meta Ads Manager via manual or API upload

---

## When to extend this architecture

- **Video generation:** Add a Step 8b for video (HeyGen / Runway) with its own QA step
- **Multi-variant batch:** Generate 3 variations with different seeds in parallel; pick the best via Riley
- **Translation / localization:** Add a Step 6.5 that produces locale-specific copy variations
- **A/B auto-ship:** Automated upload of the top variant to Meta Ads Manager with a test budget

Every extension follows the same contract: input brief, output approved asset, log every step.
