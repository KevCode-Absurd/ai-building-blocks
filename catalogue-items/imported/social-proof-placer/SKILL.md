---
name: social-proof-architect
description: "Select and place genuine testimonials, case studies, and other proof when an audience needs evidence at specific trust barriers."
risk: safe
source: community
date_added: "2026-04-04"
---
Use a marketing planning and audience-research lens. Your task is to select, frame, and place the right type of social proof for a specific audience and context. You do not add proof as decoration. You match proof type to the trust gap.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Org context** (its buyers part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Makes it better (optional):**
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`, `foundation/claims.md`, `foundation/customer-talk.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context, customer words. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- Use when testimonials, logos, numbers, or case studies need to be structured for maximum trust impact.
- Use when social proof exists but is weakly placed or not tied to the buyer's main hesitation.

## Evidence and scope

Do not cite any author, year or study named below in your answer to the user. They are background ideas only. Never present them as research.

Use observed audience research and verified product facts. Psychological interpretations and the author-year references below are inherited conceptual context, not validated evidence for this exact workflow or a guaranteed conversion effect. Before using a scientific claim externally, verify the actual publication, method and applicability; omit unsupported claims. This is marketing planning, not clinical diagnosis. Do not infer sensitive traits or exploit vulnerabilities.

Original contribution: [PR 451](https://github.com/sickn33/agentic-awesome-skills/pull/451) by MMEHDI0606; [immutable source snapshot](https://github.com/MMEHDI0606/antigravity-awesome-skills/blob/9c61357e3e6bb167946036f52ac1e28fc82e04d0/skills/social-proof-architect/SKILL.md). This identifies the contributed instructions, not scientific validation or a new upstream endorsement.

## CONTEXT GATHERING

Before designing social proof, establish:

1. **The Target Human** - psychographic profile, trust level, and awareness stage.
2. **The Objective** - what doubt or hesitation the proof must reduce.
3. **The Output** - proof strategy for landing pages, email, decks, or flows.
4. **Constraints** - category norms, compliance, and ethical limits.

If the trust gap is unclear, ask before proceeding.

## PSYCHOLOGICAL FRAMEWORK: TRUST-GAP MATCHING

### Mechanism
The author-year references in this skill are unverified background. Do not present them to the user as research.

People use social proof as a shortcut for uncertainty reduction, especially when they cannot evaluate quality directly. The wrong proof type can backfire if the audience values similarity, authority, or outcome volume differently. Match the proof signal to the trust barrier (Cialdini; Nagy et al., 2022; Rowley et al., 2015; Li et al., 2021; Du et al., 2023).

### Execution Steps

**Step 1 - Identify the trust gap**
Name what is missing: ability, benevolence, integrity, popularity, similarity, or legitimacy.
*Planning hypothesis (verify before presenting as research): trust formation depends on distinct credibility dimensions, not one generic confidence factor (Mayer trust model; Rowley et al., 2015).*

**Step 2 - Select the proof type**
Choose peer similarity, authority, usage volume, certification, or outcome case studies.
*Planning hypothesis (verify before presenting as research): similarity, authority, and bandwagon cues do not work equally across categories (Li et al., 2021; Bagozzi et al., 2021).*

**Step 3 - Match proof to awareness stage**
Use softer proof early and stronger proof later when skepticism increases.
*Planning hypothesis (verify before presenting as research): proof is most persuasive when it supports rather than replaces the audience's own reasoning (ELM; Quick et al., 2018).*

**Step 4 - Frame the proof honestly**
Use real context, not cherry-picked outcomes.
*Planning hypothesis (verify before presenting as research): fake or overstated proof creates backlash and skepticism once detected (Nguyen-Viet & Nguyen, 2024; Nagy et al., 2022).*

**Step 5 - Place proof where doubt peaks**
Insert proof immediately before a risky decision, not randomly.
*Planning hypothesis (verify before presenting as research): trust is stage-specific and should be deployed at the friction point, not only in a testimonial block (Rowley et al., 2015; Du et al., 2023).*

## DECISION MATRIX

### Variable: proof type
- If the audience is peer-led -> use similarity, examples, and real user stories.
- If the audience is expert-led -> use authority, credentials, and data.
- If the audience is legitimacy-led -> use certification, compliance, and institutional signals.
- If the audience is outcome-led -> use numbers, before/after evidence, and case studies.

### Variable: trust stage
- If trust is low -> use low-friction proof with high transparency.
- If trust is moderate -> combine peer proof with outcome proof.
- If trust is high -> keep proof minimal and let the offer lead.

### Variable: category risk
- If risk is high -> use more specific, verifiable proof.
- If risk is medium -> use a mix of testimonials and numbers.
- If risk is low -> use lighter social proof and avoid clutter.

## FAILURE MODES - DO NOT DO THESE

**Failure Mode 1**
- Agents typically: use authority proof for a peer-driven audience.
- Why it fails psychologically: the audience reads it as distant or irrelevant.
- Instead: match proof source to the trust gap.

**Failure Mode 2**
- Agents typically: add fake-volume language or cherry-picked testimonials.
- Why it fails psychologically: credibility backlash is stronger than the original doubt.
- Instead: use verifiable, contextual proof.

**Failure Mode 3**
- Agents typically: place proof after the decision point.
- Why it fails psychologically: it arrives too late to reduce anxiety.
- Instead: insert proof at the hesitation point.

## ETHICAL GUARDRAILS

This skill must:
- Use real proof only.
- Preserve context and nuance.
- Avoid manufactured consensus.

The line between persuasion and manipulation is presenting evidence that helps a real decision versus simulating popularity or expertise that does not exist. Never cross it.

## SKILL CHAINING

Optional context from related skills (equivalent supplied research is sufficient; do not create a prerequisite cycle):
- [ ] `@customer-psychographic-profiler`
- [ ] `@trust-calibrator`
- [ ] `@awareness-stage-mapper`

This skill's output feeds into:
- [ ] `@copywriting-psychologist`
- [ ] `@pitch-psychologist`
- [ ] `@sequence-psychologist`
- [ ] landing-page drafts

## OUTPUT QUALITY CHECK

Before finalizing output, the agent asks:
- [ ] Did I identify the actual trust gap?
- [ ] Did I match proof type to the audience?
- [ ] Did I place proof at the point of doubt?
- [ ] Is the proof real and contextual?
- [ ] Would this increase trust without feeling forced?

## Output format

Give the answer in this order:

1. **Trust gap**: the main doubt, in one sentence.
2. **Doubt table**: one row per doubt, with the proof type that answers it, the exact proof the user supplied, and the placement point on the page.
3. **Weak claim flags**: claims that are vague, cherry-picked or cannot be checked, each with a fix or a note to drop it.
4. **Quality check**: the five questions above, answered yes or no.

If the user gave no reviews or quotes, ask for the exact words, the date and where each came from. Do not write any for them.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Store testimonial placement planner](https://useaiblocks.com/skills/store-social-proof-placer).
- The [Landing page and email copywriter](https://useaiblocks.com/skills/honest-conversion-copywriter).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

**User request:**

> Reorganize these testimonials, logos, metrics, and case studies to maximize trust without overstating the evidence.

**Illustrative output:** Place an authorized testimonial beside the feature it actually discusses; include its context and date, and do not present one testimonial as a typical customer outcome.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
