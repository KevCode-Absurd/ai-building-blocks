---
name: vendor-review
description: Evaluate a vendor — cost analysis, risk assessment, and recommendation. Use when reviewing a new vendor proposal, deciding whether to renew or replace a contract, comparing two vendors side-by-side, or building a TCO breakdown and negotiation points before procurement sign-off.
argument-hint: "<vendor name or proposal>"
---

# /vendor-review

> The `~~knowledge base` and `~~procurement` names below stand for a document store and a purchasing system the user may have connected to their AI. If none is connected, skip the "If Connectors Available" section and work from what the user pastes or uploads.

Evaluate a vendor with structured analysis covering cost, risk, performance, and fit.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **A shortlist** (yours): the selected options, with the reasons and criteria used.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, an audit report, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Usage

```
/vendor-review $ARGUMENTS
```

## What I Need From You

- **Vendor name**: Who are you evaluating?
- **Context**: New vendor evaluation, renewal decision, or comparison?
- **Details**: Contract terms, pricing, proposal document, or current performance data
- **Earlier work**: A shortlist of vendors or a proposal document from an earlier step. I compare the vendors on it.

## Evaluation Framework

### Cost Analysis (Total Cost of Ownership)
- Total cost of ownership (not just license fees)
- Implementation and migration costs
- Training and onboarding costs
- Ongoing support and maintenance
- Exit costs (data migration, contract termination)

### Risk Assessment
- Vendor financial stability
- Security and compliance posture
- Concentration risk (single vendor dependency)
- Contract lock-in and exit terms
- Business continuity and disaster recovery

### Performance Metrics
- SLA compliance
- Support response times
- Uptime and reliability
- Feature delivery cadence
- Customer satisfaction

### Comparison Matrix
When comparing vendors, produce a side-by-side matrix covering: pricing, features, integrations, security, support, contract terms, and references.

## Output

**Cost rule:** use only costs that appear in the documents the user gave you. If a cost is not there, write "not provided" or "estimate, to confirm with vendor" in that cell. Never show a guessed cost as a specific figure, and never total a column that has a missing cost without saying the total is partial.

```markdown
## Vendor Review: [Vendor Name]
**Date:** [Date] | **Type:** [New / Renewal / Comparison]

### Summary
[2-3 sentence recommendation]

### Cost Analysis
| Component | Annual Cost | Notes |
|-----------|-------------|-------|
| License/subscription | $[X] | [Per seat, flat, usage-based] |
| Implementation | $[X] | [One-time] |
| Support/maintenance | $[X] | [Included or add-on] |
| **Total Year 1** | **$[X]** | |
| **Total 3-Year** | **$[X]** | |

### Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk] | High/Med/Low | High/Med/Low | [Mitigation] |

### Strengths
- [Strength 1]
- [Strength 2]

### Concerns
- [Concern 1]
- [Concern 2]

### Recommendation
[Proceed / Negotiate / Pass] — [Reasoning]

### Negotiation Points
- [Leverage point 1]
- [Leverage point 2]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Vendor scorecard builder](https://useaiblocks.com/skills/vendor-scorecard-builder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If Connectors Available

This section applies only when the user has those tools connected. Otherwise skip it.

If **~~knowledge base** is connected:
- Search for existing vendor evaluations, contracts, and performance reviews
- Pull procurement policies and approval thresholds

If **~~procurement** is connected:
- Pull current contract terms, spend history, and renewal dates
- Compare pricing against existing vendor agreements

## Tips

1. **Upload the proposal** — I can extract pricing, terms, and SLAs from vendor documents.
2. **Compare vendors** — "Compare Vendor A vs Vendor B" gets you a side-by-side analysis.
3. **Include current spend** — For renewals, knowing what you pay now helps evaluate price changes.

Changed by AI Blocks (2026-10-28): refreshed the generated Before you start and After this guidance from catalogue metadata.
