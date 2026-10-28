---
name: feature-risk-assessment
description: >
  Deeper risk assessment for a single feature or product area when the launch
  review found something that needs more than a line item. Structured analysis:
  what could go wrong, how likely, how bad, what mitigates it. Use when user
  says "deep dive on this risk", "risk assessment for [feature]", "what could
  go wrong with", or when launch-review flags a novel issue.
---

# Feature Risk Assessment

> **Plain-chat note (added by AI Blocks).** What to have ready: a description of the feature, the data it uses, who the users are and where they live, and any earlier review notes. No config files are needed.
>
> Use any company risk notes the user pastes; otherwise ask for their risk appetite and past legal issues. Return the 2-4 page assessment in the chat. Where the text suggests another assessment, say it as a next step (for example, "also write a privacy impact assessment").
>
> Never invent a case, law, fine or enforcement action. If you cannot name a real one, write "no citation found". For checking, Westlaw is a paid service and CourtListener is free. If the user has neither, they can check the regulator's own website.
>
> This is a first check, not legal advice.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## How to run it in chat

1. Gather the feature description, the data it uses, who the users are and where they live, and any earlier review notes.
2. Ask for the company's risk appetite and any past legal trouble. If the user has none, say so in the result.
3. Write the sections in this order: What we're assessing, The risks, Regulatory landscape (only if relevant), Precedent (only if known), Options, Recommendation.
4. Tag every case, law or fine as unchecked, then stop and ask the user to check each one (see Citation check) before the result goes to a decision maker.
5. End with next-step choices for the user.

---

## Purpose

The launch review is broad. This is deep. When a single issue needs more than a table row — a novel AI feature, a children's product, something a regulator is actively looking at — this skill produces a standalone assessment.

Not every launch needs one. Most don't. This is for the 10% where "PIA done, shipped" isn't the right level of scrutiny.

## When to run this

- Launch review found a pattern that's **not in the calibration table** (novel)
- Launch review found something in the **"usually blocks"** category
- GC or leadership asked "what's the risk here" and wants more than a one-liner
- The feature is in an area with **active regulatory attention** (AI, children, biometric, health)
- Someone outside legal is worried and a structured answer would help

If none of the above, the launch review is enough. Don't generate paperwork for its own sake.

## Structure

### 1. What we're assessing

One paragraph. What the feature does, what's new about it, why it got escalated to a full assessment.

### 2. The risks

For each distinct risk (aim for 2-5, not 15):

```markdown
### Risk [N]: [Short name]

**Scenario:** [What would have to happen for this to go wrong. Be specific —
not "data breach" but "the recommendation algo surfaces a user's sensitive
category interest to someone who shouldn't see it because X."]

**Who gets hurt:** [Users? The company? A third party? Specific.]

**How likely:** [Low / Medium / High — with a reason. "Low — would require
both X and Y to fail simultaneously." Not just a vibes rating.]

**How bad if it happens:** [Low / Medium / High — with a reason. "High —
regulatory fine + class action exposure + press" vs. "Low — one angry
tweet, no actual harm."]

**Existing mitigations:** [What already reduces the likelihood or impact]

**Gap:** [What's missing, if anything]

**Residual risk:** [After existing mitigations — is this acceptable or does
it need more?]
```

### 3. Regulatory landscape (if relevant)

Only include if a regulator is actively interested in this space. If so:

- Which regulator, what they've said/done recently
- How this feature would look to them
- Whether we'd rather they hear about it from us or from a headline

### 4. Precedent (if any)

Has another company done something similar? What happened?

- If nothing bad happened → useful, not dispositive
- If something bad happened → what was different about their situation, does it apply here

Don't overweight precedent. Regulators change priorities; one company getting away with something doesn't mean the next one will.

### 5. Options

Present 2-3 realistic paths:

```markdown
| Option | Description | Risk reduction | Cost |
|---|---|---|---|
| A: Ship as designed | [current plan] | None | None |
| B: Ship with [mitigation] | [change] | [how much] | [eng effort, timeline, UX] |
| C: Don't ship [component] | [scope cut] | [how much] | [product impact] |
```

### 6. Recommendation

Pick one. Explain why. Acknowledge what you're trading off.

```markdown
**Recommended: Option [X]**

[Why. What risk remains. Why that's acceptable. Who accepts it.]

**If the answer is "not my call":** [Who decides, what they need to know]
```

## Calibration check

Before finalizing, check against the company risk notes the user pasted. If there are none, ask these first: What is your company's risk appetite? Have you had past legal trouble or a regulator contact? Has the Launch legal reviewer already looked at this feature?

- Is this risk assessment calibrated to *this company*, or is it generic?
- A risk that's "High" at a company under a consent decree might be "Medium" at one that isn't
- The assessment should reflect the actual regulatory posture, litigation history, and risk appetite the user gave you

## Handoffs

- **To AI governance:** If the deep-dive was triggered by an AI feature — which
  it often is — suggest an AI impact assessment as a next step, in parallel or
  immediately after. The feature risk assessment frames the decision; the AIA
  documents the AI system specifically in the format AI governance needs. They're
  not duplicates: the FRA is a product-legal decision doc; the AIA is the
  governance record.
- **To privacy:** If the feature involves new data collection or processing,
  suggest the Privacy impact assessment writer as a next step. The FRA's risk section
  will likely overlap with the PIA's — flag that overlap so work isn't duplicated,
  but both docs need to exist.
- **To AI governance vendor review:** If the feature uses a new AI vendor,
  suggest a vendor AI review as a next step if not already done
  during the launch review.

## Output format

Standalone doc, 2-4 pages. If the user pasted setup notes with a work-product header, put it at the top. If not, start with the line "First check, not legal advice."

Not a slide deck, not a memo to file — a decision document someone reads and then decides.

Return it in the chat. If the doc will be shared widely, such as in a broad ticket, ask the user's lawyer first whether the header should stay.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Contract summary writer](https://useaiblocks.com/skills/contract-plain-summary). It takes the audit report.
- The [AI law gap checker](https://useaiblocks.com/skills/new-ai-rule-gap-checker). It takes the audit report.
- The [Privacy policy drift checker](https://useaiblocks.com/skills/privacy-policy-drift-checker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Citation check

*Paid or free:* Westlaw is paid. CourtListener and regulator websites are free.

If the assessment cites cases, statutes, regulations, or enforcement actions — in the Regulatory landscape or Precedent sections especially — those citations were generated by an AI model and have not been verified against a primary source. Before the decision document goes to a decisionmaker, verify each citation against a legal research tool (Westlaw, CourtListener, or your firm's research platform) for accuracy, good law status, and current enforcement posture. A risk assessment built on a fabricated enforcement action is worse than no assessment.

> **No silent supplement.** If a research query to the configured legal research tool returns few or no results for the regime or precedent the assessment needs, report what was found and stop. Do NOT fill the gap from web search or model knowledge without asking. Say: "The search returned [N] results from [tool]. Coverage appears thin for [regime / precedent]. Options: (1) broaden the search query, (2) try a different research tool, (3) search the web — results will be tagged `[web search — verify]` and should be checked against the issuing authority before relying, or (4) flag as unverified and stop. Which would you like?" A lawyer decides whether to accept lower-confidence sources.
>
> **Source attribution.** Tag every citation in the Regulatory landscape and Precedent sections with where it came from: `[Westlaw]`, `[CourtListener]`, `[regulator site]`, or the MCP tool name for citations retrieved from a legal research connector; `[web search — verify]` for web-search citations; `[model knowledge — verify]` for citations recalled from training data; `[user provided]` for citations from the feature team. Citations tagged `verify` carry higher fabrication risk and should be checked first. Never strip or collapse the tags — the decisionmaker needs to see which citations to verify first.

## Close with the next-steps decision tree

End with a short list of next-step choices. Customize the options to what this skill just produced — the five default branches (draft the X, escalate, get more facts, watch and wait, something else) are a starting point, not a lock-in. The tree is the output; the lawyer picks.

## What this skill does not do

- It doesn't assess every feature. Most features get a launch review and that's it.
- It doesn't make the decision. It frames the decision. Someone with authority picks an option.
- It doesn't do quantitative risk modeling. If the company has a formal risk framework with numbers, use that — this is qualitative.
