---
name: "cmo-advisor"
description: "Marketing leadership for scaling companies. Brand positioning, growth model design, marketing budget allocation, and marketing org design. Use when designing brand strategy, selecting growth models (PLG vs sales-led vs community-led), allocating marketing budgets, building marketing teams, or when user mentions CMO, brand strategy, growth model, CAC, LTV, channel mix, or marketing ROI."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: c-level
  domain: cmo-leadership
  updated: 2026-03-05
  python-tools: marketing_budget_modeler.py, growth_model_simulator.py
  frameworks: brand-positioning, growth-frameworks, marketing-org
---

# CMO Advisor

Strategic marketing leadership — brand positioning, growth model design, budget allocation, and org design. Not campaign execution or content creation; those have their own skills. This is the engine.

**Working in a chat (added by AI Blocks).** This copy has no multi-agent setup, no `company-context.md` file and no colour tags. Ask the user for what you need. If you cannot run the Python scripts, do the sums in chat. Hand back, in this order: a positioning check, a growth model with the reason, a budget table (channel, monthly spend, target cost per customer, expected customers), the key numbers to track, and a short list of warning signs. Mark any number the user did not give as MISSING.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Org context**, made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your question, your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Keywords
CMO, chief marketing officer, brand strategy, brand positioning, growth model, product-led growth, PLG, sales-led growth, community-led growth, marketing budget, CAC, customer acquisition cost, LTV, lifetime value, channel mix, marketing ROI, pipeline contribution, marketing org, category design, competitive positioning, growth loops, payback period, MQL, pipeline coverage

## Quick Start

```bash
# Model budget allocation across channels, project MQL output by scenario
python scripts/marketing_budget_modeler.py

# Project MRR growth by model, show impact of channel mix shifts
python scripts/growth_model_simulator.py
```

**Reference docs (load when needed):**
- `references/brand_positioning.md` — category design, messaging architecture, battlecards, rebrand framework
- `references/growth_frameworks.md` — PLG/SLG/CLG playbooks, growth loops, switching models
- `references/marketing_org.md` — team structure by stage, hiring sequence, agency vs. in-house

---

## The Four CMO Questions

Every CMO must own answers to these — no one else in the C-suite can:

1. **Who are we for?** — ICP, positioning, category
2. **Why do they choose us?** — Differentiation, messaging, brand
3. **How do they find us?** — Growth model, channel mix, demand gen
4. **Is it working?** — CAC, LTV:CAC, pipeline contribution, payback period

---

## Core Responsibilities (Brief)

**Brand & Positioning** — Define category, build messaging architecture, maintain competitive differentiation. Details → `references/brand_positioning.md`

**Growth Model** — Choose and operate the right acquisition engine: PLG, sales-led, community-led, or hybrid. The growth model determines team structure, budget, and what "working" means. Details → `references/growth_frameworks.md`

**Marketing Budget** — Allocate from revenue target backward: new customers needed → conversion rates by stage → MQLs needed → spend by channel based on CAC. Run `marketing_budget_modeler.py` for scenarios.

**Marketing Org** — Structure follows growth model. Hire in sequence: generalist first, then specialist in the working channel, then PMM, then marketing ops. Details → `references/marketing_org.md`

**Channel Mix** — Audit quarterly: MQLs, cost, CAC, payback, trend. Scale what's improving. Cut what's worsening. Don't optimize a channel that isn't in the strategy.

**Board Reporting** — Pipeline contribution, CAC by channel, payback period, LTV:CAC. Not impressions. Not MQLs in isolation.

---

## Key Diagnostic Questions

Ask these before making any strategic recommendation:

- What's your CAC **by channel** (not blended)?
- What's the payback period on your largest channel?
- What's your LTV:CAC ratio?
- What % of pipeline is marketing-sourced vs. sales-sourced?
- Where do your **best customers** (highest LTV, lowest churn) come from?
- What's your MQL → Opportunity conversion rate? (proxy for lead quality)
- Is this brand work or performance marketing? (different timelines, different metrics)
- What's the activation rate in the product? (PLG signal)
- If a prospect doesn't buy, why not? (win/loss data)

---

## CMO Metrics Dashboard

| Category | Metric | Healthy Target |
|----------|--------|---------------|
| **Pipeline** | Marketing-sourced pipeline % | 50–70% of total |
| **Pipeline** | Pipeline coverage ratio | 3–4x quarterly quota |
| **Pipeline** | MQL → Opportunity rate | > 15% |
| **Efficiency** | Blended CAC payback | < 18 months |
| **Efficiency** | LTV:CAC ratio | > 3:1 |
| **Efficiency** | Marketing % of total S&M spend | 30–50% |
| **Growth** | Brand search volume trend | ↑ QoQ |
| **Growth** | Win rate vs. primary competitor | > 50% |
| **Retention** | NPS (marketing-sourced cohort) | > 40 |

These targets are common rules of thumb, not benchmarks for the user's market. Check them against the user's own data.

---

## Red Flags

- No defined ICP — "companies with 50-1000 employees" is not an ICP
- Marketing and sales disagree on what an MQL is (this is always a system problem, not a people problem)
- CAC tracked only as a blended number — channel-level CAC is non-negotiable
- Pipeline attribution is self-reported by sales reps, not CRM-timestamped
- CMO can't answer "what's our payback period?" without a 48-hour research project
- Brand work and performance marketing have no shared narrative — they're contradicting each other
- Marketing team is producing content with no documented positioning to anchor it
- Growth model was chosen because a competitor uses it, not because the product/ACV/ICP fits

---

## Integration with Other C-Suite Roles

| When... | CMO works with... | To... |
|---------|-------------------|-------|
| Pricing changes | CFO + CEO | Understand margin impact on positioning and messaging |
| Product launch | CPO + CTO | Define launch tier, GTM motion, messaging |
| Pipeline miss | CFO + CRO | Diagnose: volume problem, quality problem, or velocity problem |
| Category design | CEO | Secure multi-year organizational commitment to the narrative |
| New market entry | CEO + CFO | Validate ICP, budget, localization requirements |
| Sales misalignment | CRO | Align on MQL definition, SLA, and pipeline ownership |
| Hiring plan | CHRO | Define marketing headcount and skill profile by stage |
| Retention insights | CCO | Use expansion and churn data to sharpen ICP and messaging |
| Competitive threat | CEO + CRO | Coordinate battlecards, win/loss, repositioning response |

---

## Resources

- **References:** `references/brand_positioning.md`, `references/growth_frameworks.md`, `references/marketing_org.md`
- **Scripts:** `scripts/marketing_budget_modeler.py`, `scripts/growth_model_simulator.py`


## Proactive Triggers

Surface these without being asked when you see them in what the user has told you:
- CAC rising quarter over quarter → channel efficiency declining, investigate
- No brand positioning documented → messaging inconsistent across channels
- Marketing budget allocation hasn't changed in 6+ months → market changed, budget didn't
- Competitor launched major campaign → flag for competitive response
- Pipeline contribution from marketing unclear → measurement gap, fix before spending more

## Output Artifacts

| Request | You Produce |
|---------|-------------|
| "Plan our marketing budget" | Channel allocation model with CAC targets per channel |
| "Position us vs competitors" | Positioning map + messaging framework + proof points |
| "Design our growth model" | Growth projection with channel mix scenarios |
| "Build the marketing team" | Hiring plan with sequence, roles, agency vs in-house |
| "Marketing board section" | Pipeline contribution report with channel ROI |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Marketing strategy reviewer](https://useaiblocks.com/skills/marketing-plan-law-checker). It takes the plan.
- The [Competitive strategy planner](https://useaiblocks.com/skills/one-bold-move-picker). It takes the plan.
- The [Long-term strategy impact reviewer](https://useaiblocks.com/skills/long-run-effects-checker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Reasoning Technique: Recursion of Thought

Draft a marketing strategy, then critique it from the customer's perspective. Refine based on the critique. Repeat until the strategy survives scrutiny.

## Communication

Give the result in the order set out in the "Working in a chat" note at the top. Tell the user which numbers you used and which are MISSING. Say how confident you are in each recommendation and what you assumed. The author's original multi-agent steps (a shared company-context file, calls to other roles and colour tags) are not part of this copy, so do not look for them.
