---
name: "ma-playbook"
description: "M&A strategy for acquiring companies or being acquired. Due diligence, valuation, integration, and deal structure. Use when evaluating acquisitions, preparing for acquisition, M&A due diligence, integration planning, or deal negotiation."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: c-level
  domain: ma-strategy
  updated: 2026-03-05
---

# M&A Playbook

Frameworks for both sides of M&A: acquiring companies and being acquired.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **The deal terms** (yours): the price, payment terms, discounts, fees and dates of the deal.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, the deal terms. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This is a planning task in text. Claude, ChatGPT or Gemini can run it from pasted notes.
<!-- /needs -->

## Keywords
M&A, mergers and acquisitions, due diligence, acquisition, acqui-hire, integration, deal structure, valuation, LOI, term sheet, earnout

## What to ask for first, and what to hand back

**Ask for:** a description of the deal and the parties, which side the person is on (buying or being bought), their reason for the deal, their timeline, and, optionally, any financial figures they have. If the side, reason or timeline is missing, ask once. If it is still missing, write `MISSING: <what>`. Never invent figures, multiples, comparable deals or facts about the target. Any number in the framework below is the author's illustration, not data.

**Hand back, in this order:**

1. **Why this deal**: the buy-versus-build test and what is really being bought, in a few sentences.
2. **Due diligence checklist**: by area (financial, technical, legal, people, market, customers), with the questions to ask and what the person must collect.
3. **Valuation checks**: the methods to cross-check the price, and what the person must verify with current comparables.
4. **Red flags**: the ones that fit this deal, with the evidence from what the person told you.
5. **Integration plan** (buyer) or **preparation plan and negotiation points** (seller).
6. **Pre-signing list**: the checks below, each marked done, open or not applicable.

If the person is being acquired, replace sections 2 and 3 with readiness signs and a data room list. End with the limits stated at the bottom of this file.

## Quick Start

**Acquiring:** Start with strategic rationale → target screening → due diligence → valuation → negotiation → integration.

**Being Acquired:** Start with readiness assessment → data room prep → advisor selection → negotiation → transition.

## When You're Acquiring

### Strategic Rationale (answer before anything else)
- **Buy vs Build:** Can you build this faster/cheaper? If yes, don't acquire.
- **Acqui-hire vs Product vs Market:** What are you really buying? Talent? Technology? Customers?
- **Integration complexity:** How hard is it to merge this into your company?

### Due Diligence Checklist
| Domain | Key Questions | Red Flags |
|--------|--------------|-----------|
| Financial | Revenue quality, customer concentration, burn rate | >30% revenue from 1 customer |
| Technical | Code quality, tech debt, architecture fit | Monolith with no tests |
| Legal | IP ownership, pending litigation, contracts | Key IP owned by individuals |
| People | Key person risk, culture fit, retention risk | Founders have no lockup/earnout |
| Market | Market position, competitive threats | Declining market share |
| Customers | Churn rate, NPS, contract terms | High churn, short contracts |

### Valuation Approaches

The ranges below are **illustrative, not current market data** — always verify against current market comps before using them in a model or negotiation.

- **Revenue multiple:** Industry-dependent (illustrative range: 2-15x ARR for SaaS, varying with growth rate, NRR, and rate environment)
- **Comparable transactions:** What similar companies sold for — the most defensible anchor
- **DCF:** For profitable companies only (most startups: use multiples)
- **Acqui-hire:** Illustrative range: $1-3M per engineer in hot talent markets

**Sources to verify against (check the latest edition):** the SaaS Capital Index (private SaaS revenue multiples, updated monthly), Software Equity Group (SEG) Annual/Quarterly SaaS M&A Reports (transaction multiples), and Aventis Advisors' SaaS valuation multiples reports. Cross-check at least two before anchoring a price.

### Integration Frameworks
See `references/integration-playbook.md` for the 100-day integration plan.

## When You're Being Acquired

### Readiness Signals
- Inbound interest from strategic buyers
- Market consolidation happening around you
- Fundraising becomes harder than operating
- Founder ready for a transition

### Preparation (6-12 months before)
1. Clean up financials (audited if possible)
2. Document all IP and contracts
3. Reduce customer concentration
4. Lock up key employees
5. Build the data room
6. Engage an M&A advisor

### Negotiation Points
| Term | What to Watch | Your Leverage |
|------|--------------|---------------|
| Valuation | Earnout traps (unreachable targets) | Multiple competing offers |
| Earnout | Milestone definitions, measurement period | Cash-heavy vs earnout-heavy split |
| Lockup | Duration, conditions | Your replaceability |
| Rep & warranties | Scope of liability | Escrow vs indemnification cap |
| Employee retention | Who gets offers, at what terms | Key person dependencies |

## Red Flags (Both Sides)

- No clear strategic rationale beyond "it's a good deal"
- Culture clash visible during due diligence and ignored
- Key people not locked in before close
- Integration plan doesn't exist or is "we'll figure it out"
- Valuation based on projections, not actuals

## Verification Loop (before any LOI or signature)

This skill frames the deal. The original skill pointed to scripts from sibling skills (a term sheet analyzer, a contract risk scanner, a training-data audit and a data-asset valuator). Those scripts are not in this folder, so do not run or pretend to run them. They are optional extras from the original author's collection. Use these plain checks instead, and mark each one done, open or not applicable:

1. **Legal terms.** Read the letter of intent or term sheet for earnout traps (targets that cannot be reached), uncapped indemnity, vague IP ownership and unclear lockups. Any item that looks wrong goes to the person's lawyer before signing.
2. **Data and consent.** If the target holds personal data or trains AI on data, ask where the data came from, what consent covers it, and who owns it. Undocumented consent is a reason to reduce the price or walk away. Ask a privacy lawyer to confirm.
3. **Valuation math.** This playbook stays qualitative. Ask for the target's actual financial statements and a model from the person's accountant or finance lead. Never present a valuation number as fact.

Loop the findings back into the negotiation-points table above before the next counter.

## Limits

This is a planning checklist, not legal, tax or financial advice, and not a formal valuation. Use a lawyer, an accountant and, where needed, an M&A advisor before any letter of intent or signature. For asset-only sales, public companies or regulated industries, specialist advice is needed on top of this.

## Integration with C-Suite Roles

| Role | Contribution to M&A |
|------|-------------------|
| CEO | Strategic rationale, negotiation lead |
| CFO | Valuation, deal structure, financing |
| GC | LOI/term sheet review, contract risk scan, regulatory triggers |
| CDO | Data diligence: training-data rights, data-asset valuation |
| CTO | Technical due diligence, integration architecture |
| CHRO | People due diligence, retention planning |
| COO | Integration execution, process merge |
| CPO | Product roadmap impact, customer overlap |

## Resources
- `references/integration-playbook.md` — 100-day post-acquisition integration plan
- `references/due-diligence-checklist.md` — comprehensive DD checklist by domain
- Optional, not included here: the general-counsel-advisor skill (term sheet analyzer and contract risk scanner) from the original collection
- Optional, not included here: the chief-data-officer-advisor skill (data diligence and data-asset valuation) from the original collection

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Business diligence meeting question planner](https://useaiblocks.com/skills/diligence-meeting-prep-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
