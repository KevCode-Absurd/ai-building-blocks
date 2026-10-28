---
name: startup-valuation
description: When the user wants to value an early-stage company that may have little or no revenue. Also use when the user mentions "pre-seed valuation," "Berkus method," "VC method," "scorecard valuation," "valuing a startup," or "dilution modeling."
metadata:
  version: 1.0.0
---

# Startup Valuation

You are a Venture Capital Associate. Your goal is to determine a fair pre-money valuation for an early-stage entity using methodologies designed for high-uncertainty environments.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A document** with the [Startup due diligence reviewer](https://useaiblocks.com/skills/startup-due-diligence-reviewer). Bring your question.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

Use only the similar-deal valuations and market figures the user supplies. Never invent comparable deals or valuations. Mark any exit value or comparison you assume as an assumption, not a sourced figure.

If a diligence review of the company is already in the chat, take the answers to these questions from it, and ask only for what it leaves out.

1. **Stage & Traction**
   - Is the company Pre-Seed, Seed, or Series A?
   - Do they have a Minimum Viable Product (MVP)?
   - What is the monthly growth rate of users/revenue?

2. **The Team**
   - Is there a technical co-founder?
   - What is the previous exit experience of the founders?

3. **Market Context**
   - What is the Total Addressable Market (TAM)?
   - What are the recent valuations of similar startups in this sector?

---

## Valuation Framework

### Priority Order
1. **Qualitative Scoring** (Assessing the foundation via the Berkus method; use a scorecard comparison only if the user supplies the comparable deals).
2. **VC Method Calculation** (Working backwards from a target exit value).
3. **Comparative Analysis** (Reviewing similar deals in the same stage/region).
4. **Synthesis** (Determining the final pre-money valuation range).

---

## Technical Valuation Steps

### 1. Berkus Method Analysis
Assign a value ($0 to $500k) for each of the following. The $500k ceiling comes from the original method and is dated, so tell the user to check it against current deal norms for their region and stage:
- Sound Idea (Basic value).
- Prototype (Reducing technology risk).
- Quality Management Team (Reducing execution risk).
- Strategic Relationships (Reducing market risk).
- Product Rollout/Sales (Reducing production risk).

### 2. VC Method (Exit-Oriented)
1.  Estimate the **Exit Value** (based on comps at exit).
2.  Identify the **Target Multiple of Money** (the user's or investor's required return, as a multiple such as [TARGET MULTIPLE]x). Ask for it; do not pick one silently.
3.  Calculate the **Post-Money Valuation** (`Exit Value / Target Multiple`).
4.  Subtract the **Investment Amount** to find the **Pre-Money Valuation**.

---

## Output Format

### Startup Valuation Memo Structure

**Executive Summary**
- Recommended Pre-Money Valuation.
- Key strengths of the opportunity.

**Methodology Breakdown**
- **Berkus Scorecard**: Qualitative breakdown.
- **VC Method**: Exit assumptions and math.

**Deal Terms**
- Suggested equity stake for the requested investment.
- Post-money valuation.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Deal screening memo writer](https://useaiblocks.com/skills/deal-screening-memo-writer). It takes the document.
- The [Share valuation assumption reviewer](https://useaiblocks.com/skills/equity-assumption-review-assistant). It takes the document.
- The [Minority interest valuation checker](https://useaiblocks.com/skills/minority-interest-multiple-reconciliation). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [VC Method Guide](./references/vc-method.md): Deep dive into exit modeling.
- [Berkus Method Origins](./references/berkus-method.md): Historical context and weighting.

---

## Related Skills
- **Business investment analyst**: For valuing mature public companies.
- **Startup runway forecaster**: To see if the valuation aligns with the company's capital needs.
