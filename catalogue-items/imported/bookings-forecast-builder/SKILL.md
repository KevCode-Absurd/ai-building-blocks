---
name: commercial-forecaster
description: "Use when building a quarterly bookings forecast, ARR projection, pipeline forecast, NRR projection, or commit/best-case/pipe-only board number — especially when the CRO needs to walk the board through funnel math + cohort ARR + per-stage conversion assumptions without the theatre of a single undefended number. Decomposes pipeline into commit, best-case, and pipe-only tiers; projects cohort-level NRR/GRR to surface leaky cohorts before they show up in the consolidated number; scores per-stage funnel confidence so soft-floor stages get treated differently from high-confidence ones. Every output explicitly names the conversion rate used, the data window, and the weighting choice. For Head of Commercial, RevOps, VP Sales, and CRO at quarterly forecast or board prep. NOT financial close (see finance/financial-analysis). NOT strategic CRO hiring/territory (see c-level-advisor/cro-advisor). NOT pricing (see sibling pricing-strategist)."
version: 2.8.0
author: claude-code-skills
license: MIT
tags: [commercial, forecasting, bookings, arr, nrr, grr, cohort, funnel, pipeline-math]
compatible_tools: [claude-code, codex-cli, cursor, antigravity, opencode, gemini-cli]
---

# commercial-forecaster

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **Your lead list** (yours): your leads or open deals, exported from your CRM or a sheet.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, your lead list. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose

Help Commercial leaders answer three questions at the forecast moment:

1. **What's the commit / best-case / pipe-only number?** (3-tier bookings forecast with disclosed assumptions)
2. **Which cohorts are leaking, and is the consolidated NRR hiding the leak?** (per-cohort NRR/GRR projection over horizon)
3. **Which funnel stages are reliable, and which are statistical noise?** (per-stage coefficient-of-variation confidence band)

The skill recommends **three forecast numbers + an explicit assumption block**. The CRO presents the number, the board sees the assumptions, the theatre dies.

## When to use

- Building the quarterly bookings forecast for the board
- Preparing the QBR forecast where the CFO will ask "what's the commit, what's the best-case, what's the pipe-only"
- Projecting ARR for next 4-8 quarters using cohort retention data
- Suspecting a consolidated NRR number is hiding a leaky recent cohort
- Pipeline-coverage is shrinking and you need to know which stages are still trustworthy
- You're being asked for a "single number" and you need the structured answer that surfaces the assumption

**Do not use for:**
- Backward-looking financial close + reporting → `finance/financial-analysis`
- Strategic financial planning (multi-year, scenario, fundraise) → `c-level-advisor/cfo-advisor`
- "Should we hire a VP Sales?" / territory design / comp plan → `c-level-advisor/cro-advisor`
- Setting prices → sibling `pricing-strategist` (projects revenue *at* prices already set)
- Per-deal discount approval → sibling `deal-desk`

## Workflow

### Step 1 — Intake pipeline + cohort + historical conversion data

Fill `assets/forecast_intake_template.md` (≈ 20 min). If history is thin (fewer than 12 quarters, or few deals per stage), use the shorter window you have and mark the result "low confidence". Captures: opportunity list with stage/amount/close-date/age/last-activity; historical stage-to-stage conversion across last 4Q and last 12Q; per-cohort ARR + per-quarter retention + expansion data; funnel stage names with 12-quarter conversion history.

### Step 2 — Run 3-tier bookings forecast

```
scripts/bookings_forecaster.py --input intake.json --profile saas --output markdown
```

Outputs three numbers — **commit**, **best-case**, **pipe-only** — each with the conversion rate applied, the data window used (last-4Q vs. last-12Q weighted 70/30), and the time-to-close probability adjustment. Surfaces variance between commit and pipe-only as the pipeline-risk indicator.

**The assumption block is non-optional.** If you remove it, the forecast becomes theatre.

**Input checks.** Conversion rates go in as fractions from 0 to 1 (0.32 means 32%). The script ignores any rate outside 0–1, NaN or non-numeric, and says so in the warnings. An opportunity with a missing or invalid amount is left out of every total with a warning naming it; it is never counted as $0. Fix the warnings before the number goes on a slide.

### Step 3 — Project cohort-level ARR

```
scripts/cohort_arr_projector.py --input intake.json --output markdown
```

Computes per-cohort NRR + GRR over the projection horizon. Flags any cohort whose NRR is declining vs. the trailing-cohort average — these are the leaky cohorts that the consolidated number can hide for a while before the leak surfaces in the topline (a rule of thumb of 2-3 quarters, not a measured figure).

Output includes the consolidated NRR/GRR trajectory + the cohort heatmap + a leaky-cohort callout.

Retention and expansion go in as percentages (93 means 93%). Gross retention must be 0–100; an invalid value falls back to the stated default curve with a warning. A cohort with no starting ARR is left out with a warning, never counted as $0.

### Step 4 — Score per-stage funnel confidence

```
scripts/funnel_confidence_scorer.py --input intake.json --output markdown
```

Per stage: mean conversion %, standard deviation, coefficient of variation (CoV = StDev / Mean), confidence band (HIGH < 10%, MEDIUM 10-25%, LOW 25-50%, VERY LOW > 50%). Recommends treatment per stage: extend-data-window, treat-as-soft-floor, or commit-quality. History values must be percentages from 0 to 100; invalid values are dropped and listed. A stage whose mean conversion is 0% is marked UNKNOWN / do-not-use, because its variance cannot be scored.

### Step 5 — Assemble the forecast deck

Take the 3-tier bookings number + cohort heatmap + funnel confidence into the QBR / board deck. **The assumption block goes on the slide with the number.** If the slide has a single number and no assumption block, the slide is theatre.

## Scripts

- `scripts/bookings_forecaster.py` — 3-tier bookings forecast (commit / best-case / pipe-only) with disclosed conversion-rate + data-window + weighting block
- `scripts/cohort_arr_projector.py` — per-cohort NRR/GRR projection over horizon with leaky-cohort callout
- `scripts/funnel_confidence_scorer.py` — per-stage CoV-based confidence bands with treatment recommendation

All scripts: stdlib only. `--help` and `--sample` work on all three.

## References

The three files below are the author's reading lists. They name authors and firms but do not prove any figure. Check any claim at its source before you quote it, and do not present a claim as sourced unless you have checked it.

- `references/saas_forecasting_canon.md` — Skok, Tunguz, OpenView, BVP, Pacific Crest/KeyBanc, ProfitWell, Patrick Campbell
- `references/cohort_analysis_canon.md` — Andrew Chen (a16z), Brian Balfour, Skok, Ramanujam, OpenView, Lenny Rachitsky, Reforge
- `references/forecast_anti_patterns.md` — McKinsey, Tunguz, OpenView, MIT Sloan, Bain, Forrester, Pacific Crest

## Assumptions

- **Historical conversion is the prior, not the truth.** Last 4Q is weighted 70%, last 12Q is weighted 30%. These weights and the CoV bands (10/25/50%) are this skill's own starting defaults, not industry benchmarks. The blend captures regime change (recent slowdown) without overfitting to a single bad quarter. Window + weighting are surfaced in every output.
- **A forecast without a disclosed assumption block is theatre.** This is the skill's hard rule. The CLI refuses to omit the assumption block.
- **Cohort decomposition tends to reveal leaks sooner than the consolidated number does (a rule of thumb of 2-3 quarters, not a measured lead time).** Reporting NRR without per-cohort breakdown hides the leak.
- **CoV (coefficient of variation) is the right discipline for stage confidence.** A stage with mean conversion 40% and stdev 4% (CoV 10%) is HIGH confidence; mean 40% stdev 20% (CoV 50%) is VERY LOW. The same average masks very different reliability.
- **Industry profile tunes priors, not truth.** Profile shifts default stage-conversion rates by industry; your historical data overrides.
- **The skill emits three numbers and an assumption block.** The CRO picks the commit number, owns the trade-off, and walks the board through the variance.

## Anti-patterns

- **Single-number forecast with no confidence band.** The board asks for "the number"; the discipline is to present three with named assumptions. See `forecast_anti_patterns.md`.
- **Using last-12-quarter conversion blindly.** Hides recent slowdown. The 70/30 blend on last-4Q vs. last-12Q corrects this.
- **Reporting NRR without cohort decomposition.** The consolidated number can be flat while a recent cohort is leaking 15 pp; the leak can surface in the topline a few quarters later (a rule of thumb). Always decompose.
- **Treating best-case as commit.** The CFO will eat you. Best-case includes weighted-stage opps that have a < 50% time-to-close probability; commit only includes commit-grade stages.
- **Hiding the assumption block.** The skill refuses; if you remove it manually, you own the theatre.
- **No leaky-cohort callout.** If `cohort_arr_projector.py` flags a cohort and you suppress the flag in the deck, the leak owns you next quarter.
- **Ignoring late-stage opp age.** A "verbal" deal that's been verbal for 180 days is not a commit. The bookings forecaster downweights stalled opps automatically; do not re-up them by hand.
- **No pipeline-coverage check.** Industry rule of thumb: forecast > pipeline ÷ 3 is anti-pattern. The tool surfaces the ratio; respect it.

## Distinct from

- **`finance/financial-analysis`** — backward-looking financial close, GAAP/IFRS reporting, variance vs. budget. commercial-forecaster is forward-looking pipeline math.
- **`c-level-advisor/cfo-advisor`** — strategic multi-year financial planning, fundraise scenarios, runway. commercial-forecaster is one input to the CFO, not the strategy.
- **`c-level-advisor/cro-advisor`** — strategic CRO judgment: "do we hire a VP Sales?", territory design, comp plan, when to add a sales engineer. commercial-forecaster is the math the CRO uses; cro-advisor is the judgment the CRO applies.
- **sibling `pricing-strategist`** — sets the price (model + range). commercial-forecaster *projects revenue at those prices*. Pricing comes first; forecast comes after.
- **sibling `deal-desk`** — per-deal scoring + discount approval routing. commercial-forecaster aggregates the pipeline that deal-desk operates on day-by-day.

## Forcing-question library (Matt Pocock grill discipline)

Walked one at a time by `/cs:grill-commercial` or the orchestrator. Recommended answer plus a short reason per question. The numbers are this skill's own starting defaults and rules of thumb, not sourced benchmarks. Check them against your own history. Never bundled.

1. **"What conversion rate are you using, and is it last-4Q or last-12Q?"**
   Recommended: a 70/30 blend (last-4Q weighted 70%, last-12Q weighted 30%). Last-12Q alone hides recent slowdown; last-4Q alone overfits one bad quarter.
   Why: a single window can miss a change in conversion. The 70/30 blend is this skill's own default, not an industry standard. Check it against your own history.

2. **"What's your pipeline coverage ratio, and is your commit above pipeline ÷ 3?"**
   Recommended: 3x coverage is a common floor in SaaS sales (a rule of thumb); below 3x means your commit is structurally unsupported.
   Why: 3x is a common rule of thumb in SaaS sales, not a sourced benchmark. Compare it with your own coverage and close rates.

3. **"Can you show me NRR by cohort, not just consolidated?"**
   Recommended: never report a consolidated NRR without the per-cohort breakdown. Leaky cohorts hide in averages.
   Why: splitting retention by cohort shows a leak sooner than one blended number does. This is a rule of thumb, not a measured lead time.

4. **"What's the variance (CoV) on each stage's conversion rate over the last 12 quarters?"**
   Recommended: CoV < 10% → commit-grade; 10-25% → moderate; 25-50% → soft floor only; > 50% → do not use this stage for forecasting.
   Why: a stage whose conversion swings a lot is a weaker base for a forecast. These bands are this skill's own starting defaults. Check them against your history.

5. **"How long has each late-stage opp been in late-stage?"**
   Recommended: stage-age > 2x the median stage-duration → treat as stalled, exclude from commit, keep in pipe-only.
   Why: deals that sit far longer than usual in a stage rarely close on time. The 2x cut-off is a starting default, not a sourced figure.

6. **"Is your best-case forecast within 30% of your pipe-only?"**
   Recommended: if best-case is < 50% of pipe-only, your stage-conversion assumptions are pessimistic and you're sandbagging; if best-case > 80% of pipe-only, you're hockey-sticking.
   Why: forecasts tend to err low (sandbagging) or high (hockey-sticking). The 50% and 80% lines are starting defaults, not sourced benchmarks.

7. **"What assumption block accompanies the number on the board slide?"**
   Recommended: every forecast number on a board slide names (a) the conversion rate, (b) the data window, (c) the weighting choice, (d) the pipeline-coverage ratio. No assumption block = the slide is theatre.
   Why: a number is easier to challenge and fix when its assumptions are on the slide. No figure is claimed for how much this helps.

Walk depth-first. Lock 1-3 before opening 4-7. After all 7 are answered, invoke `bookings_forecaster.py` → `cohort_arr_projector.py` → `funnel_confidence_scorer.py` in sequence.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Sell it** with the [Forecast narrative writer](https://useaiblocks.com/skills/forecast-narrative-writer).
- The [Sales pipeline and forecast checker](https://useaiblocks.com/skills/pipeline-and-forecast-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
