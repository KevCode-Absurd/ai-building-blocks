---
name: competitive-battlecard-creation
description: Build sales battlecards with feature comparisons, objection handling scripts, positioning statements, and win themes for competitive deal scenarios. Use when the user requests competitive battlecard creation or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Competitive Battlecard Creation

Build structured sales battlecards that arm reps with everything they need to win against specific competitors. This skill researches competitor products, maps feature-level comparisons, drafts objection handling scripts, creates positioning statements and win themes, and packages the output into a quick-reference format reps can pull up mid-call.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Competitors** (yours): the brands buyers compare you with.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Competitors** with the [Deal competitor playbook builder](https://useaiblocks.com/skills/deal-competitor-playbook-builder). Bring your question, a spreadsheet (optional), meeting notes (optional), a tool connection (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for competitors, your question. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Workflow

1. **Research the Competitor** — Gather current intelligence on the competitor: product capabilities, pricing model, recent product launches, G2/Gartner reviews, customer complaints, leadership changes, and public roadmap signals. Pull from their website, changelog, job postings (which reveal investment areas), and customer review sites. Use public pages only. Skip anything behind a login or paywall, and never scrape a site against its terms.

2. **Identify Strengths and Weaknesses** — Map the competitor's genuine strengths (don't ignore them — reps need to acknowledge what the competitor does well) and exploitable weaknesses. Categorize weaknesses as product gaps, architectural limitations, pricing disadvantages, support deficiencies, or market positioning misalignment.

3. **Map Feature Comparison** — Build a side-by-side feature comparison across the dimensions that matter most to your buyers. Use objective, verifiable claims. Add a source and date column to the table, and mark any row you cannot source as unverified. Mark each feature as strong advantage, slight advantage, parity, or disadvantage. This table becomes the centerpiece of the battlecard.

4. **Draft Objection Handlers** — Write talk tracks for the 5–8 most common objections reps hear when competing against this vendor. Each handler follows a structure: acknowledge the objection, reframe the conversation, deliver your counter-point with proof, and bridge to your differentiator.

5. **Create Win Themes and Talk Tracks** — Develop 3–4 high-level win themes (e.g., "Total cost of ownership," "Time to value," "Scale without complexity") with supporting talk tracks that connect your strengths to the prospect's priorities. Include landmine questions reps can plant early in the deal to steer evaluation criteria in your favor.

## Usage

Provide the competitor name, your product's key differentiators, the target buyer persona, and any known competitive dynamics. The skill outputs a complete battlecard.

**Example prompt:**
> Create a battlecard for competing against [COMPETITOR]. We sell [PRODUCT], [WHAT IT IS]. Our advantages are [A, B, C]. Their advantages are [X, Y]. Target buyer is [ROLE] at [TYPE OF COMPANY].

## When not to use

Skip the battlecard for a rival the team has never met in a deal. Keep a simple competitor list until they show up.

## Examples

**These examples show the layout only.** Every name, number, quote, result and price is a placeholder in square brackets. In a real battlecard, fill each one from a sourced, dated fact. Where you have no source, leave the placeholder and mark it unverified. Never write an invented customer, quote or result into a card.

### Example 1: Full Competitive Battlecard

**Competitor:** [COMPETITOR NAME]
**Our Product:** [YOUR PRODUCT]
**Target Buyer:** [BUYER ROLE AND COMPANY SIZE]

---

**Competitor Snapshot** (each line with source and date)

- [Founded, size and funding, only from a public source: URL, date]
- [Where they are strong and where they are weaker: URL, date]
- [Recent launches or news: URL, date]
- [What reviewers often say, from a named review site: URL, date]

---

**Feature Comparison**

| Capability | Our product | Competitor | Advantage | Source and date |
|---|---|---|---|---|
| [Capability 1] | [What we do] | [What they do] | Strong lead / Slight lead / Even / Behind | [URL, date or "unverified"] |
| [Capability 2] | [What we do] | [What they do] | [Rating] | [URL, date or "unverified"] |

---

**Objection Handlers**

**"[Objection a rep hears]"**

Acknowledge: [A true thing the competitor does well.]
Reframe: [Why the buyer's own situation changes the question.]
Counter: [Proof: [customer, result, source, date]. Use only a result the customer has agreed you may share.]
Bridge: [A question that moves the buyer back to your differentiator.]

(Repeat for 5 to 8 objections.)

---

**Win Themes**

1. **[Theme, such as time to value]** — "[Talk track that links your strength to the buyer's priority, backed by a sourced fact.]"
2. **[Theme]** — "[Talk track.]"
3. **[Theme]** — "[Talk track.]"

**Landmine Questions:**
- "[A question a rep can ask early that makes the buyer check something where you are stronger.]"

---

### Example 2: Quick-Reference Deal Scenario Card

**Scenario:** [Where the deal stands, and the buyer's main concern, such as total cost over a set number of years.]

**Key plays:**
- [Ask the buyer for the competitor's full quote, including implementation, extra seats and add-ons.]
- [Show our cost model, using the buyer's own numbers: [headcount], [growth], [price], [term].]
- [Reference customer: [customer, result, source, date], only with the customer's permission.]

**Cost comparison (use the buyer's real quotes, not guesses):**

| Cost Component | Our product | Competitor |
|---|---|---|
| Platform licence | [amount, source] | [amount, source] |
| Implementation | [amount, source] | [amount, source] |
| Add-ons | [amount, source] | [amount, source] |
| **Total** | [sum] | [sum] |

## Best Practices

- Update battlecards quarterly at minimum — stale competitive intel is worse than no battlecard because it breeds false confidence.
- Acknowledge competitor strengths honestly; reps who dismiss a well-known competitor lose credibility with informed buyers.
- Write objection handlers in conversational language, not marketing copy — reps need to sound natural on a live call.
- Include landmine questions that reps can plant early in the evaluation to shift criteria toward your strengths before the competitor's demo.
- Tag each claim with a source and date so reps know how fresh the intel is.
- Keep the battlecard to a single scrollable page or two-sided PDF — if reps can't find the answer in 10 seconds, the card is too long.

## Edge Cases

- **Competitor launches a new product mid-deal** — Maintain a rapid-response process where product marketing pushes a battlecard addendum within 48 hours of major competitor announcements.
- **Prospect shares competitor's pricing directly** — Use it to build a live TCO comparison on the call, but never store or redistribute the competitor's proprietary pricing externally.
- **Competitor you've never lost to** — Still build a battlecard. Their presence in a deal changes buyer expectations and evaluation criteria even if they don't win.
- **Multiple competitors in the same deal** — Create a deal-specific composite card that covers all active competitors rather than requiring reps to flip between three separate battlecards.
- **Former competitor customer on your team** — Leverage their insider knowledge for battlecard input, but scrub any confidential or NDA-protected information before publishing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Live objection responder](https://useaiblocks.com/skills/live-objection-responder). It takes the document.
- The [Deal health reviewer](https://useaiblocks.com/skills/deal-health-reviewer). It takes the document.
- The [Pre-sales proof of concept planner](https://useaiblocks.com/skills/proof-of-concept-plan). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
