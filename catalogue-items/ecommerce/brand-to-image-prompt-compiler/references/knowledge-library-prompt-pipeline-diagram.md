# Prompt Pipeline Diagram

**The 7-step prompt preprocessing pipeline that turns a raw brief into a final image-generation prompt. Every step has a job. Every step is a layer that can be inspected.**

---

## The pipeline, at a glance

```
[Raw Brief Input]
       ↓
[1] Context Injection
       ↓
[2] Theme Resolution
       ↓
[3] Persona Voice Calibration
       ↓
[4] Design Lever Application
       ↓
[5] Brand DNA Binding
       ↓
[6] Prompt Assembly
       ↓
[7] Safety + Policy Check
       ↓
[Final Prompt → Image Model]
```

Each step consumes the previous step's output, adds or resolves context, and emits a richer intermediate representation. By the time the final prompt reaches the image model (Gemini / REVE / Flux), it is a full creative spec, not a shot in the dark.

---

## Step 1 — Context Injection

**Input:** Raw brief (product name, persona ID, stage, format)

**Job:** Pull all the structured context from your database that the brief references but does not spell out.

**What it pulls:**
- Product details (name, price, category, SKU, positioning)
- Persona profile (voice axes, quotable phrases, what-not-to-say)
- Stage guardrails (for the given awareness stage)
- Format rules (for the given format: static / UGC / video storyboard)

**Output:** A fully hydrated JSON context object with no unresolved references.

**Common failures:**
- Product not in DB → block with human-readable error
- Persona missing → use brand-wide default, flag low confidence

---

## Step 2 — Theme Resolution

**Input:** Hydrated context + desired theme (or "auto-pick")

**Job:** Select the theme that fits persona × stage × gap, OR validate the human-specified theme against the stage guardrails.

**What it does:**
- If theme = "auto", look up the persona-stage-theme-matrix
- If theme is specified, validate it does not violate stage guardrails
- Pull the theme's spine (copy structure, visual structure, half-life)

**Output:** Resolved theme + theme spine attached to context.

**Common failures:**
- Theme violates stage (e.g., Urgency at Unaware) → warn and substitute
- No theme winner in matrix → fall back to theme category default

---

## Step 3 — Persona Voice Calibration

**Input:** Context + resolved theme

**Job:** Apply persona voice axes to the copy generation directives.

**What it does:**
- Read persona's formal_casual, bold_subtle, rational_emotional axes
- Translate to explicit prompt instructions
- Attach voice descriptors (adjectives)
- Attach quotable phrases that may be used
- Attach "what not to say" list

**Output:** Voice-aware directives embedded in the prompt spec.

**Example translation:**
```
Persona voice: formal_casual=8, bold_subtle=6, rational_emotional=6
Descriptors: ["honest", "direct", "worn-out"]

→ "Write in a casual, direct voice. Lean specific and honest. Contractions ON. No marketing clichés."
```

---

## Step 4 — Design Lever Application

**Input:** Context + theme spine

**Job:** Configure the 8 design levers for the image.

**The 8 levers:**
1. Layout (archetype — hero, split, grid, etc)
2. Composition (rule of thirds, centered, golden ratio, etc)
3. Lighting (studio, natural, editorial, dramatic)
4. Color palette (from brand DNA or theme default)
5. Typography hierarchy (H1 size, H2 size, body)
6. Product framing (hero, secondary, environmental)
7. Subject (person, object, abstract, none)
8. Mood (clean, bold, warm, cold)

**What it does:**
- Apply theme-specific lever defaults (from theme-library-catalog)
- Override with brand DNA where specified
- Override with brief-specific instructions
- Emit the lever config

**Output:** Design lever config object with all 8 set.

---

## Step 5 — Brand DNA Binding

**Input:** Context + theme + levers

**Job:** Bind the brand's visual DNA so the image looks like the brand, not a generic stock ad.

**What it binds:**
- Primary + secondary brand colors
- Typography families
- Photography style reference (editorial, clinical, lifestyle, etc)
- Packaging rendering rules (how the product must appear)
- Brand mark placement rules
- Forbidden visual patterns (competitor styles to avoid)

**Output:** Brand-aware prompt spec.

**Common failures:**
- Brand DNA not extracted yet → use category default, flag low confidence
- Conflicting lever + brand rule → brand rule wins

---

## Step 6 — Prompt Assembly

**Input:** Fully bound spec with context, theme, voice, levers, brand

**Job:** Compose the final natural-language prompt for the image model.

**Structure (in this order):**
1. Product identity block ("Image of [product name], [product type]")
2. Scene / composition block (layout, framing, subject)
3. Lighting + color block (palette, mood, style)
4. Typography + copy block (headline, subhead, CTA — exact text)
5. Brand marks + packaging block
6. Negative prompt (what to avoid)

**Output:** A 200-400 word single prompt string ready for the image model.

**Example final prompt structure:**
```
Image of [product name], a [category] product.

Composition: [layout archetype]. [Composition rules]. Subject placed at [position].

Lighting: [lighting style]. [Shadow rules].

Color palette: [primary] dominant, [secondary] accents, [neutral] background.

Typography: [H1 font family], [H1 size]. [H2 family], [H2 size]. Copy must read exactly:
  Headline: "[EXACT COPY]"
  Subhead: "[EXACT COPY]"
  CTA: "[EXACT COPY]"

Product rendering: [exact product description, label orientation, photography style].

Brand mark: [size, placement, color].

Negative: no text distortion, no extra logos, no bokeh unless specified, no stock photo look.
```

---

## Step 7 — Safety + Policy Check

**Input:** Final prompt

**Job:** Validate against legal + platform + brand policy before sending to the image model.

**What it checks:**
- Banned claims (no "cure", "guaranteed results", "FDA-approved" unless true)
- Banned language (brand's what-not-to-say list)
- Em dashes (no)
- ALL CAPS sentences (no)
- Banned phrases (game-changer, revolutionary, etc)
- Platform policy (Meta forbids before/after for certain categories — apply)
- Character limits (platform-specific)

**Output:** Either (a) approved prompt → send to image model, or (b) rejected prompt + list of violations → return to Step 6 for adjustment.

**This is the last line of defense.** Do not skip it.

---

## Where each step lives (repo reference)

Approximate locations in a typical agent codebase:

| Step | Module |
|---|---|
| 1 — Context Injection | `lib/agents/sage/context-loader.ts` |
| 2 — Theme Resolution | `lib/prompts/theme-resolver.ts` |
| 3 — Voice Calibration | `lib/prompts/voice-calibrator.ts` |
| 4 — Design Levers | `lib/agents/sage/design-levers.ts` |
| 5 — Brand DNA Binding | `lib/brand/dna-binder.ts` |
| 6 — Prompt Assembly | `lib/prompts/prompt-optimizer.ts` |
| 7 — Safety Check | `lib/prompts/policy-check.ts` |

All 7 callable from the orchestrator at `lib/agents/sage/pipeline.ts`.

---

## Why split it into 7 steps?

### Debuggability
When an image comes out wrong, you can inspect the output of each step and find WHERE the signal broke. Wrong lighting? Check lever output (step 4). Wrong copy? Check assembly (step 6). Wrong brand colors? Check DNA binding (step 5).

### Reusability
Every step is a pure function. You can run the theme resolver in isolation for strategy work, or the voice calibrator for copy-only jobs. No monolith.

### Testability
Each step has fixed input and output shapes. Write a unit test per step. Run the whole pipeline as an integration test on sample briefs.

### Human-in-the-loop
After any step, a human can edit the intermediate output and resume. For example, auto-theme-resolves may be overridden by a strategist at step 2, then the rest of the pipeline runs with the human choice.

---

## Cost + latency per run

| Step | Cost | Latency |
|---|---|---|
| 1 — Context Injection | ~$0.001 (DB) | 100-300ms |
| 2 — Theme Resolution | ~$0.002 (small LLM) | 300-500ms |
| 3 — Voice Calibration | $0 (rules) | <50ms |
| 4 — Design Levers | $0 (rules) | <50ms |
| 5 — Brand DNA Binding | ~$0.001 (DB) | 100-200ms |
| 6 — Prompt Assembly | ~$0.01 (medium LLM) | 1-3s |
| 7 — Safety Check | $0 (rules + small LLM fallback) | 100-500ms |
| **Total preprocessing** | **~$0.015** | **~2-5s** |
| Image generation (Gemini 2.5 Flash) | ~$0.039/image | 5-15s |

Total cost per image: ~$0.05. Total time: ~10-20s.

---

## Failure modes

| Step | Failure | Recovery |
|---|---|---|
| 1 | Product not in DB | Block, return error to caller |
| 2 | No valid theme for persona × stage | Fall back to category default, flag low confidence |
| 3 | Persona missing | Use brand-wide default, flag |
| 4 | Lever conflict | Brand rule wins, log for human review |
| 5 | Brand DNA missing | Use category default, flag |
| 6 | Assembly LLM fails | Retry once; on second fail, fall back to rule-based template |
| 7 | Policy violation | Return to step 6 with violation list; retry max 2x before escalating to human |

---

## When to extend this pipeline

Add a step when:
- You need a new reusable transformation (e.g., "translate to localized market")
- A new compliance domain requires its own check (e.g., medical claims validation)
- You need to support a new image model that requires a different prompt shape

Never add a step just to encode a one-off exception. Solve those at step 6 or step 7.
