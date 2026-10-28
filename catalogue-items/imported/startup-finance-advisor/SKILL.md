---
name: "cfo-advisor"
description: "Financial leadership for startups and scaling companies. Financial modeling, unit economics, fundraising strategy, cash management, and board financial packages. Use when building financial models, analyzing unit economics, planning fundraising, managing cash runway, preparing board materials, or when user mentions CFO, burn rate, runway, fundraising, unit economics, LTV, CAC, term sheets, or financial strategy."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: c-level
  domain: cfo-leadership
  updated: 2026-03-05
  python-tools: burn_rate_calculator.py, unit_economics_analyzer.py, fundraising_model.py
  frameworks: financial-planning, fundraising-playbook, cash-management
---

# CFO Advisor

Strategic financial frameworks for startup CFOs and finance leaders. Numbers-driven, decisions-focused.

This is **not** a financial analyst skill. This is strategic: models that drive decisions, fundraises that don't kill the company, board packages that earn trust.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **Financial statements** (yours): the income statement, balance sheet and cash flow statement, for the periods you have.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A spreadsheet** with the [Startup cash forecast builder](https://useaiblocks.com/skills/startup-runway-forecaster). Bring a spreadsheet.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, financial statements. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude:** It can run the Python scripts when code tools are on, and shows each step of the maths.
- **ChatGPT:** Its data analysis tool can load your spreadsheet and edit the scripts.
<!-- /needs -->

## What you need

Ask once for anything below that is missing. Mark what stays missing as `MISSING: <what>`. Never invent a figure.

- Monthly revenue, costs and cash balance for the last 6 to 12 months.
- Customer counts and churn, ideally by signup month (cohort).
- Planned hires and spend.
- Optional: fundraising plans or term sheet details, ARR and net new ARR, a `company-context.md` file with background on the company.

## Quick Start: the three Python scripts

The scripts need Python 3.9 or newer and no extra packages. **They do not read your files.** Each one runs on made-up sample data written inside the script, so the output is a demonstration, not the user's numbers.

```bash
# Burn rate & runway scenarios (base/bull/bear); also accepts --scenario and --csv
python scripts/burn_rate_calculator.py

# Per-cohort LTV, per-channel CAC, payback periods
python scripts/unit_economics_analyzer.py

# Dilution modeling, cap table projections, round scenarios; --exit <millions>
python scripts/fundraising_model.py
```

To use the founder's real numbers, either (a) edit the sample-data function in the script (`make_sample_configs`, `make_sample_cohorts`, `build_sample_model`) and run it, or (b) do the same maths in the chat and show every step. If your AI cannot run code, use (b). Always say which route you took, and never show sample-data output as if it were the founder's.

## Key Questions (ask these first)

- **What's your burn multiple?** (Net burn ÷ Net new ARR. > 2x is a problem.)
- **If fundraising takes 6 months instead of 3, do you survive?** (If not, you're already behind.)
- **Show me unit economics per cohort, not blended.** (Blended hides deterioration.)
- **What's your NDR?** (> 100% means you grow without signing a single new customer.)
- **What are your decision triggers?** (At what runway do you start cutting? Define now, not in a crisis.)

## Core Responsibilities

| Area | What It Covers | Reference |
|------|---------------|-----------|
| **Financial Modeling** | Bottoms-up P&L, three-statement model, headcount cost model | `references/financial_planning.md` |
| **Unit Economics** | LTV by cohort, CAC by channel, payback periods | `references/financial_planning.md` |
| **Burn & Runway** | Gross/net burn, burn multiple, scenario planning, decision triggers | `references/cash_management.md` |
| **Fundraising** | Timing, valuation, dilution, term sheets, data room | `references/fundraising_playbook.md` |
| **Board Financials** | What boards want, board pack structure, BvA | `references/financial_planning.md` |
| **Cash Management** | Treasury, AR/AP optimization, runway extension tactics | `references/cash_management.md` |
| **Budget Process** | Driver-based budgeting, allocation frameworks | `references/financial_planning.md` |

## CFO Metrics Dashboard

These targets are rules of thumb from the skill's author. They are not tested standards and they vary by stage and market. Present them as "common targets to check against your own market".

| Category | Metric | Target | Frequency |
|----------|--------|--------|-----------|
| **Efficiency** | Burn Multiple | < 1.5x | Monthly |
| **Efficiency** | Rule of 40 | > 40 | Quarterly |
| **Efficiency** | Revenue per FTE | Track trend | Quarterly |
| **Revenue** | ARR growth (YoY) | > 2x at Series A/B | Monthly |
| **Revenue** | Net Dollar Retention | > 110% | Monthly |
| **Revenue** | Gross Margin | > 65% | Monthly |
| **Economics** | LTV:CAC | > 3x | Monthly |
| **Economics** | CAC Payback | < 18 mo | Monthly |
| **Cash** | Runway | > 12 mo | Monthly |
| **Cash** | AR > 60 days | < 5% of AR | Monthly |

## Red Flags

- Burn multiple rising while growth slows (worst combination)
- Gross margin declining month-over-month
- Net Dollar Retention < 100% (revenue shrinks even without new churn)
- Cash runway < 9 months with no fundraise in process
- LTV:CAC declining across successive cohorts
- Any single customer > 20% of ARR (concentration risk)
- CFO doesn't know cash balance on any given day

## Working with other roles

The original skill is built for a team of AI roles (CEO, COO, CRO and so on). You are one AI in one chat, so do not call other roles. Where another function matters, name the question the founder should take to that person.

| When... | Take the question to... | About... |
|---------|-------------------|-------------|
| Headcount plan changes | CEO + COO | Full loaded cost of every new hire |
| Revenue targets shift | Head of sales | Budget, CAC targets, quota capacity |
| Roadmap scope changes | CTO + product lead | R&D spend vs. revenue impact |
| Fundraising | CEO | Financial story, model, data room |
| Compensation design | HR lead | Total comp cost, equity grants, burn impact |
| Pricing changes | Product + sales | ARR impact, LTV change, margin impact |

## Resources

- `references/financial_planning.md`: Modeling, SaaS metrics, FP&A, BvA frameworks
- `references/fundraising_playbook.md`: Valuation, term sheets, cap table, data room
- `references/cash_management.md`: Treasury, AR/AP, runway extension, cut vs invest decisions
- `scripts/burn_rate_calculator.py`: Runway modeling with hiring plan + scenarios (sample data inside)
- `scripts/unit_economics_analyzer.py`: Per-cohort LTV, per-channel CAC (sample data inside)
- `scripts/fundraising_model.py`: Dilution, cap table, multi-round projections (sample data inside)

## Proactive Triggers

Surface these without being asked when you detect them in the numbers given:
- Runway < 18 months with no fundraising plan: raise the alarm early
- Burn multiple > 2x for 2+ consecutive months: spending outpacing growth
- Unit economics deteriorating by cohort: acquisition strategy needs review
- No scenario planning done: build base/bull/bear before you need them
- Budget vs actual variance > 20% in any category: investigate immediately

## Output Artifacts

| Request | You Produce |
|---------|-------------|
| "How much runway do we have?" | Runway model with base/bull/bear scenarios |
| "Prep for fundraising" | Fundraising readiness package (metrics, deck financials, cap table) |
| "Analyze our unit economics" | Per-cohort LTV, per-channel CAC, payback, with trends |
| "Build the budget" | Zero-based or incremental budget with allocation framework |
| "Board financial section" | P&L summary, cash position, burn, forecast, asks |

## Reasoning Technique: Chain of Thought

Work through financial logic step by step. Show all math. Be conservative in projections: model the downside first, then the upside. Never round in your favor.

## What you hand back

Use this order for every answer:

1. **Bottom line.** One or two sentences with the answer.
2. **What we found.** The numbers, each tagged `verified` (taken from the user's figures), `medium` (worked out from them) or `assumed` (an assumption you made, listed).
3. **Why it matters.** The reason, in plain words.
4. **How to act.** The next two or three moves, and the decision triggers (for example, the runway at which to start cutting).
5. **Your decision.** The one choice the founder must make.

End with `CHECKS MISSED:` and any step you could not do (or "none").

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Startup financial model builder](https://useaiblocks.com/skills/startup-financial-model-builder). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limits and next steps

This is a planning aid, not accounting, tax, legal or investment advice. Raising money, cutting staff or signing a term sheet are real decisions: tell the founder to have an accountant, lawyer or experienced adviser check the numbers and terms first. After this, suggest rerunning the runway view each month with new actuals, and taking the board pack outline to the board.
