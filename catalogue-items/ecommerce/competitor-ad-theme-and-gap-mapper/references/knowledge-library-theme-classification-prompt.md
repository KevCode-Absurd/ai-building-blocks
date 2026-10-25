# Theme Classification Prompt

**The LLM prompt that turns raw competitor ad text into structured tags. Used by step [3] of the competitor research pipeline. Strict output format is the whole point.**

---

## The Prompt

```
You are a creative strategy classifier. Classify the ad below along 4 dimensions. Pick exactly ONE value from each list. Output JSON only.

AD DATA
Primary text: "{primary_text}"
Format: {format}
CTA: {cta}

DIMENSION 1 — THEME (pick exactly one)
- Urgency: scarcity, deadlines, "only 47 left", "ends tonight"
- Lifestyle: aspirational, everyday moment, product in a scene
- Social Proof: numbers, reviews, ratings, volume, testimonials
- Educational: "the reason why", "the 3 things", "how it works"
- PAS: explicit problem + agitation + solution arc in the copy
- Us vs Them: comparison, head-to-head, "their X vs our Y"
- FOMO: exclusivity, insider, "before everyone finds out"
- Aspirational: identity, status, "for people who..."
- Features-Benefits: ingredient list, spec sheet, technical detail

DIMENSION 2 — AWARENESS STAGE (pick exactly one)
- Unaware: does not name a problem or solution category
- Problem Aware: names or describes a pain; no product pitch yet
- Solution Aware: mentions solution category or compares options
- Product Aware: names the specific product; emphasizes proof or risk reversal
- Most Aware: short, offer-led, assumes trust

DIMENSION 3 — HOOK TACTIC (pick exactly one)
- Confession: creator admits being wrong / skeptical / surprised
- Bold Claim: specific number, outcome, or authoritative statement
- Relatability: "POV:", "when you", "tell me without telling me"
- Contrast: before vs after, cheap vs expensive, old way vs new way
- Curiosity: information gap, "the thing nobody tells you", "why..."

DIMENSION 4 — FORMAT (already given, just echo back)
- static_image | ugc_hifi | ugc_problem_solution | yapper | video_storyboard

OUTPUT (JSON only, no preamble, no explanation):
{
  "theme": "...",
  "stage": "...",
  "tactic": "...",
  "format": "..."
}
```

---

## Hardening rules

The LLM will sometimes fail in predictable ways. Handle them:

### Rule 1: Enforce list values

The classifier wrapper validates the returned JSON. If any of the 4 values is not in its list, retry once with this added instruction:

```
Previous response was invalid. The value "{invalid_value}" is not in the allowed list. Pick ONLY from the list provided.
```

If the second retry also fails, log the ad_id for manual review and skip to the next ad. Do not block the run.

### Rule 2: Short ad text

If `primary_text` is fewer than 20 characters, add format to the prompt and lean heavily on format signals. Short static ads (3-4 words) default to:
- theme: Features-Benefits or Aspirational
- stage: Most Aware
- tactic: Bold Claim

### Rule 3: Long ad text (500+ chars)

Truncate to 500 chars before classifying. Long-form often has multiple themes; the first 500 chars is the hook and usually carries the dominant theme.

### Rule 4: Ambiguous tactic

If tactic is hard to identify from text alone (common with purely visual ads), default:
- Format: static_image → tactic: Bold Claim
- Format: ugc_hifi → tactic: Relatability
- Format: ugc_problem_solution → tactic: Confession
- Format: video_storyboard → tactic: Curiosity
- Format: yapper → tactic: Relatability

### Rule 5: Non-English ads

If the ad is in a non-English language, prepend the prompt with:
```
The ad is in {language}. Classify based on meaning, not English keyword matching.
```

---

## Few-shot examples (append if accuracy drops)

If classification accuracy drops below 90% on manual review, add 3 few-shot examples to the system prompt:

```
EXAMPLES

Example 1
Ad text: "I was wrong about peptide serums for 6 years."
Format: ugc_hifi
→ {"theme": "PAS", "stage": "Problem Aware", "tactic": "Confession", "format": "ugc_hifi"}

Example 2
Ad text: "12,000 reviews. 4.8 stars. Restock ends Friday."
Format: static_image
→ {"theme": "Social Proof", "stage": "Product Aware", "tactic": "Bold Claim", "format": "static_image"}

Example 3
Ad text: "What I spent on skincare before vs after."
Format: video_storyboard
→ {"theme": "Us vs Them", "stage": "Solution Aware", "tactic": "Contrast", "format": "video_storyboard"}
```

---

## Cost + latency

- Model: any capable LLM (GPT-4o-mini, Claude Haiku, Gemini Flash)
- Tokens per call: ~800 input, ~40 output
- Cost per call: ~$0.002 - $0.005
- Latency per call: 1-3 seconds
- Run 25 ads in parallel (batch of 5): total time ~15 seconds

---

## Calibration

Run a manual calibration pass once per quarter:

1. Sample 50 ads from the last 3 months
2. Manually classify each
3. Compare manual to auto-classified
4. Agreement rate should be > 90%
5. If lower, add 2-3 more few-shot examples of the dimensions that are mismatching

Log calibration results in `/data/competitor-classifier-accuracy.md` (or wherever your audit trail lives).

---

## Output shape (for downstream steps)

The classifier returns this shape for every ad. Step [4] aggregates across ads.

```json
{
  "ad_id": "meta_fbid_...",
  "theme": "Social Proof",
  "stage": "Solution Aware",
  "tactic": "Relatability",
  "format": "video_storyboard"
}
```

Persist with the ad_id so re-runs don't re-classify (classification is deterministic enough to cache).

---

## What NOT to ask the classifier

Do not ask the LLM to:
- Judge ad quality (separate concern)
- Predict performance (not observable from text)
- Identify the product (use your own product database)
- Identify the creator (use face detection + creator database)

One prompt, one job. Classification only.
