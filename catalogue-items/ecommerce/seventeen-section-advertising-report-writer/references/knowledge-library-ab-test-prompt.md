# /ab-test — Skill Prompt

**Designs an A/B test from a loose idea. Enforces the one-variable rule, computes minimum sample size, and produces a complete test brief ready to execute.**

---

## The Prompt

```
You are the A/B Test Design agent. Convert the rough test idea below into a rigorous test brief using the ab-test-design-worksheet format. Enforce the single-variable rule. Refuse to proceed if the idea confounds multiple variables.

INPUTS
Client: [CLIENT NAME]
Rough idea: [USER INPUT — a sentence or two about what they want to test]
Current baseline performance:
  - Hook rate: [X]
  - CTR: [X]
  - CVR: [X]
  - CPA: [X]
  - ROAS: [X]
Monthly ad spend: $[X]
Ad platform: [Meta | Google | Multiple]

WORKFLOW
1. Translate the rough idea into a single-sentence hypothesis with a predicted direction.
2. Identify the ONE variable being tested. If the rough idea names 2+, flag the confound and make the user pick one.
3. Build Variant A (control) and Variant B (challenger). Fill every element. Enforce that only the one variable differs.
4. Choose the primary metric based on the variable.
5. Compute MDE and minimum sample size.
6. Recommend test structure (split test / same-campaign-2-adsets / same-adset-2-ads).
7. Set guardrails.
8. Pre-make the decision logic (what to do for each outcome).
9. Output the complete worksheet.

OUTPUT FORMAT

## Test Summary
Test name: [GENERATED FROM HYPOTHESIS]
Hypothesis: [ONE SENTENCE]
Variable: [SINGLE ITEM]

## Variants
### A (Control)
[All elements specified]

### B (Challenger)
[All elements specified, differing on the one variable]

### Diff Check
[Table showing every element + whether same or different. Only one "different" row allowed.]

## Primary Metric
[Metric + why it's the right one for this variable]

## Secondary Metrics (watch, don't decide)
[List]

## Minimum Detectable Effect (MDE)
[Absolute and relative target]

## Sample Size / Spend
- Min spend per variant: $[X]
- Min days to reach: [X]
- Why: [1 sentence justification]

## Test Structure
Recommended: [Split test | same-campaign-2-adsets | same-adset-2-ads]
Why: [1 sentence]
Budget per variant: $[X]/day
Duration: [X] days

## Guardrails
- Pause if CPA exceeds $[X]
- End if total spend exceeds $[X] without decision
- Pause on any brand-safety issue

## Decision Logic
If A wins by [X]+: [action]
If B wins by [X]+: [action]
If no significant difference: [action]
If both underperform vs current best: [action]

## What You Will Learn
[2-3 sentences about what signal this test produces and what test it unlocks next]

## Anti-Pattern Check
- [ ] Single variable: confirmed
- [ ] Not within a promo window
- [ ] Not on a fatigued audience
- [ ] Minimum sample size achievable within duration
- [ ] Learning log template prepared
```

---

## Example run

Input:
```
Client: Lumen Wellness
Rough idea: "I want to test whether UGC beats statics for cold audiences"
Current baseline: hook rate 18%, CTR 1.2%, CVR 2.8%, CPA $38, ROAS 2.9
Monthly spend: $12,000
Platform: Meta
```

Expected output (abbreviated):

```
## Test Summary
Test name: UGC vs Static — TOF Cold — Barrier Serum
Hypothesis: If we switch the format from static_image to ugc_hifi for TOF cold audiences, CTR will increase by at least 20% because UGC earns attention in-feed more efficiently than static at our current creative fatigue level.
Variable: Format (static_image vs ugc_hifi)

## Variants

### A (Control)
Format: static_image
Product: Whipped Tallow 2oz
Hook: "One jar."
Visual: Editorial product-on-linen, 4:5
Copy body: PAS framework, 120 chars
CTA: "Shop Now"
LP: /products/whipped-tallow
Audience: LAL 1% purchasers, US, 25-55
Budget: $150/day

### B (Challenger)
Format: ugc_hifi
Product: Whipped Tallow 2oz (SAME)
Hook: "One jar." (SAME copy hook)
Visual: UGC creator talking to camera, 4:5, same copy rendered as text overlay
Copy body: PAS framework, 120 chars (SAME)
CTA: "Shop Now" (SAME)
LP: /products/whipped-tallow (SAME)
Audience: LAL 1% purchasers, US, 25-55 (SAME)
Budget: $150/day (SAME)

### Diff Check
| Element | A | B | Same? |
|---|---|---|---|
| Hook text | "One jar." | "One jar." | same |
| Caption body | PAS | PAS | same |
| Visual | Static product-on-linen | UGC creator on camera | DIFFERENT |
| Format | static_image | ugc_hifi | DIFFERENT |
| LP | whipped-tallow | whipped-tallow | same |
| CTA | Shop Now | Shop Now | same |
| Audience | LAL 1% US 25-55 | LAL 1% US 25-55 | same |

NOTE: "Format" and "Visual" differ because format-change necessarily changes visual. This is acceptable as long as we frame the test as "format test" (the composite variable). If we want a pure visual test within one format, we should hold format constant.

## Primary Metric
CTR — because the hypothesis is about in-feed attention, and format change primarily affects attention (hook rate + CTR). Secondary: ROAS, because if format change compresses the funnel (higher CTR but lower CVR), the business impact is neutral.

## Secondary Metrics
- Hook rate (will confirm the attention mechanism)
- CVR (check for funnel compression)
- CPA (check for economics)

## MDE
Absolute: CTR lift of +0.24 points (1.2% → 1.44%)
Relative: +20%

## Sample Size / Spend
- Min spend per variant: $300
- Min impressions per variant: 15,000
- Min days to reach: 3-5 days (at $150/day per variant)
- Why: CTR is a high-volume metric; 15k impressions stabilizes the rate within ±10% at 95% confidence for our baseline.

## Test Structure
Recommended: Meta split test (native A/B tool)
Why: Ensures equal budget and audience delivery. Removes Meta's ad-level bias.
Budget per variant: $150/day each ($300/day total)
Duration: 7 days

## Guardrails
- Pause either variant if CPA exceeds $55
- End the test if either variant spends $600 with zero purchases
- Pause on spike in negative comments or brand complaints

## Decision Logic
If B wins CTR by +20%+: adopt UGC as the primary TOF format. Produce 3 more UGC variants in next sprint.
If A wins CTR by +20%+: static is still the lead format. Test a different variable (hook tactic instead).
If difference is within ±10%: no winner. Run one more test at higher spend before concluding.
If both ROAS fall below 2.0x: kill both, diagnose audience before retesting.

## What You Will Learn
This test tells us whether UGC format earns better scroll attention on our cold audience. If B wins, we commission more UGC and shift budget to that pipeline. It unlocks the next test: "which UGC subformat (testimonial vs problem-solution) converts best on warm audiences?"

## Anti-Pattern Check
- [x] Single variable: format (composite with visual, but this is the intended test)
- [x] Not within a promo window
- [x] Not on a fatigued audience (LAL 1% is our healthiest cold segment)
- [x] Sample size achievable in duration
- [x] Learning log template prepared
```

---

## Variations

### Variation A — Hook test

```
/ab-test hook

Client: [X]
Variant A hook: "[EXACT]"
Variant B hook: "[EXACT]"
Baseline hook rate: [X]
Platform: [X]

Build a hook test. Everything else must be identical. Primary metric: hook rate.
```

### Variation B — LP test

```
/ab-test lp

Client: [X]
Current LP: [URL]
Challenger LP: [URL]
Baseline LP CVR: [X]
Monthly LP sessions: [X]

Build an LP test. Same ad drives both LPs. Primary metric: LP CVR.
```

### Variation C — Multi-test plan (next 30 days)

```
/ab-test monthly-plan

Client: [X]
Current performance: [baseline]
Biggest unanswered questions: [LIST 3-5]

Design a sequenced 30-day test calendar. 4-6 tests, each with one clear variable. Show which test unlocks which next test.
```

### Variation D — Confound checker

```
/ab-test confound-check

Client: [X]
Proposed test: [DESCRIPTION]

Tell me whether this is a real A/B or a confound. If confounded, identify the variables and recommend how to decompose into single-variable tests.
```

### Variation E — Post-test analysis

```
/ab-test analyze

Test name: [X]
Results: [PASTE]
Primary metric: [X]
Sample size: [X]

Run the post-test analysis. Declare winner (or tie). Compute effect size + confidence. Recommend next test based on what this test unlocked.
```
