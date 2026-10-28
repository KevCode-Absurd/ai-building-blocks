---
name: opportunity-solution-tree
description: "Build an Opportunity Solution Tree (OST) to structure product discovery — map a desired outcome to opportunities, solutions, and experiments. Based on Teresa Torres' Continuous Discovery Habits. Use when structuring discovery work, mapping opportunities to solutions, or deciding what to build next."
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, customer words. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Opportunity Solution Tree (OST)

A visual framework for structuring continuous product discovery. Connects a desired **outcome** to customer **opportunities**, possible **solutions**, and **experiments** to validate them.

### Domain Context

The **Opportunity Solution Tree** (Teresa Torres, *Continuous Discovery Habits*) is the backbone of modern product discovery. It prevents teams from jumping to solutions by forcing them to first map the opportunity space.

**Structure (4 levels):**

1. **Desired Outcome** (top) — The measurable business or product outcome the team is pursuing. Should be a single, clear metric (e.g., "increase 7-day retention to 40%"). This comes from your OKRs or product strategy.

2. **Opportunities** (second level) — Customer needs, pain points, or desires discovered through research. These are problems worth solving — not features. Frame them from the customer's perspective: "I struggle to..." or "I wish I could..." Prioritize using Opportunity Score: **Importance × (1 − Satisfaction)** (Dan Olsen, *The Lean Product Playbook*). Normalize Importance and Satisfaction to 0–1.

3. **Solutions** (third level) — Possible ways to address each opportunity. Generate multiple solutions per opportunity — don't commit to the first idea. The **Product Trio** (PM + Designer + Engineer) should ideate together. "Best ideas often come from engineers."

4. **Experiments** (bottom) — Fast, cheap tests to validate whether a solution actually addresses the opportunity. Use assumption testing (Value, Usability, Viability, Feasibility risks). Prefer experiments with "skin-in-the-game" (Alberto Savoia) over opinion-based validation.

**Key principles:**

- **One outcome at a time.** Don't try to solve everything. Focus the tree on a single desired outcome.
- **Opportunities, not features.** "Never allow customers to design solutions. Prioritize opportunities (problems), not features."
- **Compare and contrast.** Always generate at least 3 solutions per opportunity before choosing. Avoid the "first idea" trap.
- **Discovery is not linear.** Loop back if experiments fail. Kill solutions that don't validate. Explore new branches.
- **Continuous, not periodic.** Update the tree weekly as you learn from interviews, analytics, and experiments.

### Instructions

You are helping a product team build an Opportunity Solution Tree for **$ARGUMENTS**.

### Input Requirements
- A desired outcome or business metric to improve
- Customer research data (interviews, surveys, analytics, feedback)
- Optionally: existing opportunities or solution ideas to organize

### Process

1. **Define the desired outcome** — Confirm or help articulate a single, measurable outcome at the top of the tree.

2. **Map opportunities** — From provided research, identify 3-7 customer opportunities (needs/pains). Group related opportunities. Frame each from the customer's perspective.

3. **Prioritize opportunities** — Use Opportunity Score or qualitative assessment to rank. Focus on the top 2-3. Importance and Satisfaction scores must come from counted research answers, such as survey or interview tallies. If the person gave no such data, rank qualitatively and label every score you give as an estimate. Do not invent numbers.

4. **Generate solutions** — For each prioritized opportunity, brainstorm 3+ solutions from PM, Designer, and Engineer perspectives.

5. **Design experiments** — For the most promising solutions, suggest 1-2 fast experiments. Specify: hypothesis, method, metric, success threshold.

6. **Visualize the tree** — Present the full OST in a clear hierarchical format.

Think step by step. Save as markdown if substantial.

---

### Further Reading

- [The Extended Opportunity Solution Tree](https://www.productcompass.pm/p/the-extended-opportunity-solution-tree)
- [What Is Product Discovery? The Ultimate Guide Step-by-Step](https://www.productcompass.pm/p/what-exactly-is-product-discovery)
- [Product Trio: Beyond the Obvious](https://www.productcompass.pm/p/product-trio)
- [Continuous Product Discovery Masterclass (CPDM)](https://www.productcompass.pm/p/cpdm) (video course)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Plan your strategy** with the [Product outcome roadmap planner](https://useaiblocks.com/skills/outcome-based-roadmap). It takes the plan.
- The [Job name picker](https://useaiblocks.com/skills/job-name-picker). It takes the customer needs and plan.
- The [Customer experience journey mapper](https://useaiblocks.com/skills/job-experience-mapper). It takes the customer needs.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
