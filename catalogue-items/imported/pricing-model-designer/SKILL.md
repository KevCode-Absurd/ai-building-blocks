---
name: pricing-strategist
description: "Use when designing or revisiting product pricing — selecting a pricing model (subscription seat-based, usage-based, value-based, freemium, or hybrid), running Van Westendorp Price Sensitivity Meter analysis on WTP survey data, or designing Good/Better/Best packaging tiers. Recommends a model and a price range with trade-offs, never a single number. For Commercial leads, Product Marketing, and CMOs at the pricing-design moment — not deal-by-deal discounting, not brand positioning."
version: 2.8.0
author: claude-code-skills
license: MIT
tags: [commercial, pricing, packaging, wtp, van-westendorp, value-based-pricing, saas-pricing]
compatible_tools: [claude-code, codex-cli, cursor, antigravity, opencode, gemini-cli]
---

# pricing-strategist

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Price survey planner](https://useaiblocks.com/skills/willingness-to-pay-survey). Bring product data.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose

Help Commercial, Product Marketing, and CMO functions answer three questions at the pricing-design moment:

1. **Which pricing model fits this product + customer + market?** (subscription seat-based, usage-based, value-based, freemium, hybrid)
2. **What does the customer actually pay before it feels too expensive?** (Van Westendorp PSM on WTP survey responses)
3. **How should we package this into tiers?** (Good / Better / Best — with anti-pattern detection)

The skill recommends **a model and a range**. The human picks the number, owns the trade-offs, and runs the GTM.

## When to use

- Launching a new SaaS / API / AI tool and choosing the first pricing model
- Revisiting pricing after 18+ months of GTM data (model shift, not just price increase)
- Designing or redesigning tier packaging (Good/Better/Best, Bronze/Silver/Gold)
- You have Van Westendorp survey data and want the optimal price range
- A board / exec is asking "what should we charge?" and you need the structured answer
- You suspect your packaging has anti-patterns (decoy tier, feature dump, no upgrade trigger)

**Do not use for:**
- Per-deal discount approval → a deal desk or sales lead (not in this library)
- Strategic positioning, brand, category creation → a marketing lead
- Whole-company revenue strategy → a revenue or sales leader
- Technical-sale enablement → a sales engineer

## Workflow

### Step 1 — Assess customer context

Fill `assets/pricing_brief_template.md` (≈ 20 min). Capture: industry, deal size avg, customer count, value drivers, adoption curve, consumption pattern (seat / usage / value / hybrid), competitor models.

### Step 2 — Pick the pricing model

Run `scripts/pricing_model_picker.py --input brief.json --profile saas --output markdown`. `brief.json` holds the answers from Step 1, with these fields (use the user's real answers; leave a field out if unknown):
- `industry`: text, e.g. "[INDUSTRY]"
- `deal_size_avg`: number, average deal size
- `customer_count`: whole number
- `value_drivers`: list of text, what customers gain
- `adoption_curve`: text, e.g. "bottom-up"
- `consumption_pattern`: numbers from 0 to 1 for `seat-based`, `usage-based`, `value-based`, `hybrid`
- `competitor_pricing_models`: list of text

Output ranks 5 models by fit-score 0-100 with trade-offs. Decision logic is deterministic: low usage variance + high seat-attach → subscription wins; power-law usage + variable customer value → usage-based wins.

### Step 3 — Validate WTP with Van Westendorp PSM

If a survey plan from the willingness to pay survey planner is in the chat, use its questions and its sums to read the answers you collected.

If you have survey data (≥ 4 questions per respondent: too cheap / bargain / getting expensive / too expensive), run `scripts/wtp_analyzer.py --input survey.json --output markdown`. `survey.json` is `{"respondents": [{"too_cheap": [PRICE], "bargain": [PRICE], "getting_expensive": [PRICE], "too_expensive": [PRICE]}, ...]}`, one entry per person, with the prices they gave. Output: 4 intersection points (OPP, IDP, PMC, PME) and the Range of Acceptable Prices.

PSM gives a **range**, not the price. See `references/van_westendorp_methodology.md` for common misinterpretations.

### Step 4 — Design packaging

Run `scripts/packaging_designer.py --input features.json --profile saas --output markdown`. `features.json` holds `segments` (list of customer groups), optional `current_pricing` (`good`, `better`, `best` prices), and `features`: a list where each has `name`, `importance` (0 to 1), `cost_to_serve` (relative cost, e.g. 1 for average) and `segment_fit` (0 to 1 per segment). Take these from the user's own feature list. Output: 3-tier Good/Better/Best assignment with anti-pattern flags (decoy tier, feature dump, no upgrade trigger, Bronze loss leader, Enterprise no-anchor).

### Step 5 — Decide

Hand back one markdown report with these sections, in order: the ranked models with fit scores and trade-offs; the four price points and the Range of Acceptable Prices (with the sample-size warning if there are fewer than 30 respondents); the Good, Better, Best tiers with their features; and the packaging flags. Take it into the pricing committee. Skill does not commit the number — you do.

## Scripts

- `scripts/pricing_model_picker.py` — 5-model fit scorer (subscription / usage / value / freemium / hybrid)
- `scripts/wtp_analyzer.py` — Van Westendorp PSM implementation
- `scripts/packaging_designer.py` — Good/Better/Best tier designer with anti-pattern detection

All scripts: stdlib only. `--help` and `--sample` work on all three. The `--sample` data is made-up demo data. Never quote it as a result for the user's product.

## Quick example

```bash
# Emits a scored 5-model pricing-fit recommendation (subscription / usage / value / freemium / hybrid) for the built-in example
cd commercial/skills/pricing-strategist && python3 scripts/pricing_model_picker.py --sample
```

## References

- `references/saas_pricing_canon.md` — Skok, Tunguz, Campbell, Ramanujam, BVP, Shevlin, Stanford GSB
- `references/van_westendorp_methodology.md` — original 1976 paper, NMS refinement, Conjoint.ly, Sawtooth, ESOMAR, Lipovetsky, Decision Analyst
- `references/packaging_anti_patterns.md` — ProfitWell, OpenView, BVP vertical SaaS, Ramanujam, Poyar, SaaS Capital

## Assumptions

- Pricing decisions are joint: Commercial owns the model + tier shape, Product owns the features-per-tier, Finance owns the discount envelope, Legal owns the contract.
- Van Westendorp PSM is a **directional** tool. N ≥ 30 minimum, N ≥ 100 preferred. Below 30, the script emits a sample-size warning.
- "Value-based pricing" requires a measurable customer value driver (revenue lift, cost saved, time recovered). If you can't measure it, don't pick value-based.
- Industry profiles tune defaults — they don't override your data.
- This is a decision-support skill, not a price oracle. Output is a model + range, never the number.

## Anti-patterns

- **Recommending a specific number.** This skill emits a model and a range. Final price is a human commercial decision involving deal-desk policy, competitive intel, and strategic intent that this skill cannot know.
- **Using PSM with N < 30.** Statistical noise dominates. The script warns; respect the warning.
- **Treating PSM as "the price."** PSM gives a Range of Acceptable Prices (RAP) and an Optimal Price Point (OPP). Test the range in market, don't anchor on a single intersection.
- **Picking value-based pricing without a measurable value metric.** Without instrumentation to show customer ROI, value-based collapses into "whatever they'll pay" — which is just bad usage-based pricing.
- **Designing tiers before picking a model.** Tier structure depends on the model. Run pricing_model_picker first.
- **Packaging "feature dumps" into the Best tier.** If Best has about 3x the features for about 2x the price, customers buy Better and never upgrade. See `packaging_anti_patterns.md`.
- **Hidden usage-based pricing inside subscription tiers.** "Up to 100k API calls/mo, then $X per 1k" disguised as a "Pro tier" is two pricing models in one. Customers notice. Pick one.
- **Confusing this skill with deal approval.** Pricing strategy = the menu. A deal desk approves discounts off the menu. Different decision, different cadence, different owner.

## Distinct from

- **A deal desk** — per-deal discount approval and deal scoring. Works daily on existing pricing.
- **A marketing lead** — strategic positioning, brand, category. This skill takes positioning as input, it does not create it.
- **A revenue leader** — full-funnel revenue strategy, comp plans, territory design. Pricing is one input.
- **A sales engineer** — technical sale and trial scoping. Works after pricing is set.

## Forcing-question library (Matt Pocock grill discipline)

Do not quote any percentage, threshold or author finding from this section to the user as fact. The original author attached figures to named authors. None were checked, so they have been taken out. Where a limit matters, work it out from the user's own data.

Ask these one at a time. Give a recommended answer for each. Never bundle them.

1. **"Is your customer paying for outcomes, seats, or usage?"**
   Recommended: outcomes (value-based) if you can measure them; usage if marginal cost is variable; seats only if usage is roughly flat per user.
   Note: seat-based pricing on a product whose usage varies a lot can leave money on the table.

2. **"Do you have a measurable value metric, or are you guessing?"**
   Recommended: instrument the value metric BEFORE going to market with value-based pricing. Without it, value-based collapses into bad usage-based pricing.

3. **"How much does usage vary between your heaviest customers and a typical one?"**
   Recommended: very high variance favours usage-based pricing; low variance favours subscription; in between, a hybrid with usage overage. Ask the user for their own numbers and choose the cut-offs with them. Never invent a threshold.

4. **"What's your competitor's pricing model, and why are you choosing the same or different?"**
   Recommended: surface the differentiation hypothesis explicitly. Identical pricing = identical value claim.

5. **"What sample size do you have for WTP analysis, and is it segmented?"**
   Recommended: the script's minimum is 30 respondents per segment, with 100 or more preferred. Below that, treat the range as noise.

6. **"What's the ONE feature that forces a tier upgrade?"**
   Recommended: every Better and Best tier needs a single non-negotiable upgrade trigger. Without one, buyers may default to the cheapest tier.

Walk depth-first. Lock 1-3 before opening 4-6. After all 6 are answered, invoke `pricing_model_picker.py` → `wtp_analyzer.py` → `packaging_designer.py` in sequence.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Price survey planner](https://useaiblocks.com/skills/willingness-to-pay-survey).
- The [Price test planner](https://useaiblocks.com/skills/price-test-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
