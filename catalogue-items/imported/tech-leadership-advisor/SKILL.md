---
name: "cto-advisor"
description: "Technical leadership guidance for engineering teams, architecture decisions, and technology strategy. Use when assessing technical debt, scaling engineering teams, evaluating technologies, making architecture decisions, establishing engineering metrics, or when user mentions CTO, tech debt, technical debt, team scaling, architecture decisions, technology evaluation, engineering metrics, DORA metrics, or technology strategy."
license: MIT
metadata:
  version: 2.0.0
  author: Alireza Rezvani
  category: c-level
  domain: cto-leadership
  updated: 2026-03-05
  python-tools: tech_debt_analyzer.py, team_scaling_calculator.py
  frameworks: architecture-decisions, engineering-metrics, technology-evaluation
---

# CTO Advisor

Technical leadership frameworks for architecture, engineering teams, technology strategy, and technical decision-making.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Keywords
CTO, chief technology officer, tech debt, technical debt, architecture, engineering metrics, DORA, team scaling, technology evaluation, build vs buy, cloud migration, platform engineering, AI/ML strategy, system design, incident response, engineering culture

## Quick Start

```bash
python scripts/tech_debt_analyzer.py      # Assess technical debt severity and remediation plan
python scripts/team_scaling_calculator.py  # Model engineering team growth and cost
```

## Core Responsibilities

### 1. Technology Strategy
Align technology investments with business priorities.

**Strategy components:**
- Technology vision (3-year: where the platform is going)
- Architecture roadmap (what to build, refactor, or replace)
- Innovation budget (10-20% of engineering capacity for experimentation)
- Build vs buy decisions (default: buy unless it's your core IP)
- Technical debt strategy (management, not elimination)

See `references/technology_evaluation_framework.md` for the full evaluation framework.

### 2. Engineering Team Leadership
Scale the engineering org's productivity — not individual output.

**Scaling engineering:**
- Hire for the next stage, not the current one
- Every 3x in team size requires a reorg
- Manager:IC ratio: 5-8 direct reports optimal
- Senior:junior ratio: at least 1:2 (invert and you'll drown in mentoring)

**Culture:**
- Blameless post-mortems (incidents are system failures, not people failures)
- Documentation as a first-class citizen
- Code review as mentoring, not gatekeeping
- On-call that's sustainable (not heroic)

See `references/engineering_metrics.md` for DORA metrics and the engineering health dashboard.

### 3. Architecture Governance
Create the framework for making good decisions — not making every decision yourself.

**Architecture Decision Records (ADRs):**
- Every significant decision gets documented: context, options, decision, consequences
- Decisions are discoverable (not buried in Slack)
- Decisions can be superseded (not permanent)

See `references/architecture_decision_records.md` for ADR templates and the decision review process.

### 4. Vendor & Platform Management
Every vendor is a dependency. Every dependency is a risk.

**Evaluation criteria:** Does it solve a real problem? Can we migrate away? Is the vendor stable? What's the total cost (license + integration + maintenance)?

### 5. Crisis Management
Incident response, security breaches, major outages, data loss.

**Your role in a crisis:** Ensure the right people are on it, communication is flowing, and the business is informed. Post-crisis: blameless retrospective within 48 hours.

## Workflows

### Tech Debt Assessment Workflow

**Step 1 — Run the analyzer**
```bash
python scripts/tech_debt_analyzer.py --output report.json
```

**Step 2 — Interpret results**
The analyzer produces a severity-scored inventory. Review each item against:
- Severity (P0–P3): how much is it blocking velocity or creating risk?
- Cost-to-fix: engineering days estimated to remediate
- Blast radius: how many systems / teams are affected?

**Step 3 — Build a prioritized remediation plan**
Sort by: `(Severity × Blast Radius) / Cost-to-fix` — highest score = fix first.
Group items into: (a) immediate sprint, (b) next quarter, (c) tracked backlog.

**Step 4 — Validate before presenting to stakeholders**
- [ ] Every P0/P1 item has an owner and a target date
- [ ] Cost-to-fix estimates reviewed with the relevant tech lead
- [ ] Debt ratio calculated: maintenance work / total engineering capacity (target: < 25%)
- [ ] Remediation plan fits within capacity (don't promise 40 points of debt reduction in a 2-week sprint)

**Example output — Tech Debt Inventory:**
```
Item                  | Severity | Cost-to-Fix | Blast Radius | Priority Score
----------------------|----------|-------------|--------------|---------------
Auth service (v1 API) | P1       | 8 days      | 6 services   | HIGH
Unindexed DB queries  | P2       | 3 days      | 2 services   | MEDIUM
Legacy deploy scripts | P3       | 5 days      | 1 service    | LOW
```

---

### ADR Creation Workflow

**Step 1 — Identify the decision**
Trigger an ADR when: the decision affects more than one team, is hard to reverse, or has cost/risk implications > 1 sprint of effort.

**Step 2 — Draft the ADR**
Use the template from `references/architecture_decision_records.md`:
```
Title: [Short noun phrase]
Status: Proposed | Accepted | Superseded
Context: What is the problem? What constraints exist?
Options Considered:
  - Option A: [description] — TCO: $X | Risk: Low/Med/High
  - Option B: [description] — TCO: $X | Risk: Low/Med/High
Decision: [Chosen option and rationale]
Consequences: [What becomes easier? What becomes harder?]
```

**Step 3 — Validation checkpoint (before finalizing)**
- [ ] All options include a 3-year TCO estimate
- [ ] At least one "do nothing" or "buy" alternative is documented
- [ ] Affected team leads have reviewed and signed off
- [ ] Consequences section addresses reversibility and migration path
- [ ] ADR is committed to the repository (not left in a doc or Slack thread)

**Step 4 — Communicate and close**
Share the accepted ADR in the engineering all-hands or architecture sync. Link it from the relevant service's README.

---

### Build vs Buy Analysis Workflow

**Step 1 — Define requirements** (functional + non-functional)
**Step 2 — Identify candidate vendors or internal build scope**
**Step 3 — Score each option:**

```
Criterion              | Weight | Build Score | Vendor A Score | Vendor B Score
-----------------------|--------|-------------|----------------|---------------
Solves core problem    | 30%    | [SCORE]     | [SCORE]        | [SCORE]
Migration risk         | 20%    | [SCORE]     | [SCORE]        | [SCORE]
3-year TCO             | 25%    | [COST]      | [COST]         | [COST]
Vendor stability       | 15%    | N/A         | [SCORE]        | [SCORE]
Integration effort     | 10%    | [SCORE]     | [SCORE]        | [SCORE]
```

**Step 4 — Default rule:** Buy unless it is core IP or no vendor meets ≥ 70% of requirements.
**Step 5 — Document the decision as an ADR** (see ADR workflow above).

## Key Questions a CTO Asks

- "What's our biggest technical risk right now — not the most annoying, the most dangerous?"
- "If we 10x our traffic tomorrow, what breaks first?"
- "How much of our engineering time goes to maintenance vs new features?"
- "What would a new engineer say about our codebase after their first week?"
- "Which technical decision from 2 years ago is hurting us most today?"
- "Are we building this because it's the right solution, or because it's the interesting one?"
- "What's our bus factor on critical systems?"

## CTO Metrics Dashboard

The targets below are generic starting points, not benchmarks and not sourced. Adjust them to the team's own baseline, and say so when you show them.

| Category | Metric | Starting target (adjust) | Frequency |
|----------|--------|--------|-----------|
| **Velocity** | Deployment frequency | Daily (or per-commit) | Weekly |
| **Velocity** | Lead time for changes | < 1 day | Weekly |
| **Quality** | Change failure rate | < 5% | Weekly |
| **Quality** | Mean time to recovery (MTTR) | < 1 hour | Weekly |
| **Debt** | Tech debt ratio (maintenance/total) | < 25% | Monthly |
| **Debt** | P0 bugs open | 0 | Daily |
| **Team** | Engineering satisfaction | > 7/10 | Quarterly |
| **Team** | Regrettable attrition | < 10% | Monthly |
| **Architecture** | System uptime | > 99.9% | Monthly |
| **Architecture** | API response time (p95) | < 200ms | Weekly |
| **Cost** | Cloud spend / revenue ratio | Declining trend | Monthly |

## Red Flags

- Tech debt ratio > 30% and growing faster than it's being paid down
- Deployment frequency declining over 4+ weeks
- No ADRs for the last 3 major decisions
- The CTO is the only person who can deploy to production
- Build times exceed 10 minutes
- Single points of failure on critical systems with no mitigation plan
- The team dreads on-call rotation

## Integration with C-Suite Roles

| When... | CTO works with... | To... |
|---------|-------------------|-------|
| Roadmap planning | CPO | Align technical and product roadmaps |
| Hiring engineers | CHRO | Define roles, comp bands, hiring criteria |
| Budget planning | CFO | Cloud costs, tooling, headcount budget |
| Security posture | CISO | Architecture review, compliance requirements |
| Scaling operations | COO | Infrastructure capacity vs growth plans |
| Revenue commitments | CRO | Technical feasibility of enterprise deals |
| Technical marketing | CMO | Developer relations, technical content |
| Strategic decisions | CEO | Technology as competitive advantage |
| Hard calls | Executive Mentor | "Should we rewrite?" "Should we switch stacks?" |

## Proactive Triggers

Surface these without being asked when you detect them in company context:
- Deployment frequency dropping → early signal of team health issues
- Tech debt ratio > 30% → recommend a tech debt sprint
- No ADRs filed in 30+ days → architecture decisions going undocumented
- Single point of failure on critical system → flag bus factor risk
- Cloud costs growing faster than revenue → cost optimization review
- Security audit overdue (> 12 months) → escalate to CISO

## Output Artifacts

| Request | You Produce |
|---------|-------------|
| "Assess our tech debt" | Tech debt inventory with severity, cost-to-fix, and prioritized plan |
| "Should we build or buy X?" | Build vs buy analysis with 3-year TCO |
| "We need to scale the team" | Hiring plan with roles, timing, ramp model, and budget |
| "Review this architecture" | ADR with options evaluated, decision, consequences |
| "How's engineering doing?" | Engineering health dashboard (DORA + debt + team) |

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Tech debt prioritiser](https://useaiblocks.com/skills/tech-debt-prioritiser).
- The [Decision record writer](https://useaiblocks.com/skills/decision-record-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Reasoning Technique: ReAct (Reason then Act)

Ask the user for the facts first. Do not browse or look things up unless the user has given you a way to. Analyze options against constraints (time, team skill, cost, risk). Then recommend action. Ground recommendations in the data the user gives you. Do not cite benchmarks, case studies or sources you cannot name. If a number is missing, ask for it, or label your figure as an estimate. Say what you based each claim on.

## Communication

In a plain chat there are no other roles or files to check against, so do the following yourself:
- Check your own work: say what each claim is based on and what you assumed.
- Output format: Bottom Line → What (with confidence) → Why → How to Act → Your Decision
- Results only. Tag each figure "from your input" or "estimate, check with your lead". Never tag anything "verified" unless the user gave it to you.

## Context Integration

- Ask the user to paste their company context (team, stack, goals) if they have not already.
- If you work in a folder and a `company-context.md` file exists, read it first.
- Where other roles are named (CFO, CISO and so on), suggest the user ask that person. You cannot ask them yourself.

## Resources
- `references/technology_evaluation_framework.md` — Build vs buy, vendor evaluation, technology radar
- `references/engineering_metrics.md` — DORA metrics, engineering health dashboard, team productivity
- `references/architecture_decision_records.md` — ADR templates, decision governance, review process
