---
name: customer-psychographic-profiler
description: "Build an evidence-grounded customer profile of motivations, fears, identity, and trust barriers before positioning, copywriting, or funnel design."
risk: safe
source: community
date_added: "2026-04-04"
---
Use a marketing planning and audience-research lens. Your task is to build a deep psychological profile of a target customer including desires, fears, identity, worldview, and emotional drivers. You do not produce generic audience summaries. You infer the psychological structure that downstream skills will use as their foundation.

Before producing any output, complete the diagnostic protocol below. Then apply the framework. Then produce the profile.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **Org context**, made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `foundation/brand-dna.md`, `foundation/customers.md`, `foundation/markets.md`, `facts.json`, `offers.json`, `references.md`. Take the buyers, the main promise, approved claims only, and the options buyers weigh. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for your org context, customer words. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- Use when you need a deep psychographic profile before positioning, copy, or funnel design.
- Use when demographics are not enough and you need motivations, anxieties, and identity cues.

## Evidence and scope

Use observed audience research and verified product facts. Psychological interpretations and the author-year references below are inherited conceptual context, not validated evidence for this exact workflow or a guaranteed conversion effect. Before using a scientific claim externally, verify the actual publication, method and applicability; omit unsupported claims. This is marketing planning, not clinical diagnosis. Do not infer sensitive traits or exploit vulnerabilities.

Original contribution: [PR 451](https://github.com/sickn33/agentic-awesome-skills/pull/451) by MMEHDI0606; [immutable source snapshot](https://github.com/MMEHDI0606/antigravity-awesome-skills/blob/9c61357e3e6bb167946036f52ac1e28fc82e04d0/skills/customer-psychographic-profiler/SKILL.md). This identifies the contributed instructions, not scientific validation or a new upstream endorsement.

## CONTEXT GATHERING

Before profiling, establish:

1. **The Target Human**
   - Demographics only if they change behavior materially
   - Psychographics: values, fears, desires, status concerns, identity commitments
   - Context of use and category history
   - Emotional state at point of contact

2. **The Objective**
   - What the customer is trying to achieve, avoid, signal, or become

3. **The Output**
   - A structured psychographic profile that downstream skills can consume

4. **Constraints**
   - Brand, category, culture, and ethical boundaries

If any of this is missing, ask before proceeding.

## PSYCHOLOGICAL FRAMEWORK: IDENTITY-NEED MAPPING LADDER

### Mechanism
People do not buy or act from demographics. They act from identity protection, need satisfaction, and a subjective story about what this choice says about them. Use self-determination theory, identity theory, and values-based segmentation to identify the needs and self-concept the customer is trying to preserve or advance (Deci & Ryan; Bagozzi et al., 2021; Qasim et al., 2019; Smith et al., 2008).

### Execution Steps

**Step 1 - Collect surface signals**
List the explicit facts the user gives you, then separate them from interpretation. Use only observable details first.
*Planning hypothesis (verify before presenting as research): psychographic segmentation is more reliable when grounded in observed behavior than in demographic stereotypes (Yankelovich & Meer, 2006; Bagozzi et al., 2021).*

**Step 2 - Infer the dominant need state**
Classify the customer by the need they are most trying to satisfy: security, competence, autonomy, belonging, status, self-expression, or self-actualization.
*Planning hypothesis (verify before presenting as research): SDT and need-based behavior change research show motivation is strongest when autonomy, competence, and relatedness are matched (Ng et al., 2012; Sheeran et al., 2020).*

**Step 3 - Identify identity commitments**
Determine which self-image the customer is protecting or pursuing. Note what they want to be seen as, and what they refuse to be seen as.
*Planning hypothesis (verify before presenting as research): self-identity predicts consumer behavior and intention beyond norms and past behavior (Smith et al., 2008; Quach et al., 2025).*

**Step 4 - Map fears and friction**
Name the concrete fears, status losses, and trust barriers that would stop action. Separate rational objections from emotional threat.
*Planning hypothesis (verify before presenting as research): trust, skepticism, and perceived risk shape consumer response across categories (Nagy et al., 2022; Rowley et al., 2015).*

**Step 5 - Write the psychographic profile**
Return a compact profile with worldview, values, aspirations, anxieties, motivators, language cues, and buying triggers.
*Planning hypothesis (verify before presenting as research): values-based and identity-based consumer models outperform surface-only segmentation in explaining behavior (Zhang et al., 2025; Lavuri et al., 2023).*

## DECISION MATRIX

### Variable: identity salience
- If identity is central to the category -> emphasize self-concept, belonging, and symbolic meaning.
- If identity is weak or incidental -> emphasize utility, clarity, and low-friction progress.
- If identity is contested -> surface tensions carefully and avoid overclaiming.

### Variable: trust level
- If trust is low -> prioritize proof, transparency, and risk reduction.
- If trust is moderate -> combine proof with aspiration.
- If trust is high -> move faster into desired-state language and specificity.

### Variable: purchase motivation
- If the motive is avoidance -> highlight relief, safety, and error prevention.
- If the motive is achievement -> highlight competence, status, and visible progress.
- If the motive is belonging -> highlight similarity, community, and social validation.

## FAILURE MODES - DO NOT DO THESE

**Failure Mode 1**
- Agents typically: reduce the audience to age, job title, or income.
- Why it fails psychologically: demographics do not explain motivation, identity, or threat perception.
- Instead: profile the need, self-concept, and emotional stakes.

**Failure Mode 2**
- Agents typically: project their own preferences onto the customer.
- Why it fails psychologically: projection produces false certainty and bad downstream copy.
- Instead: separate observed signals from inference and label uncertainty.

**Failure Mode 3**
- Agents typically: flatten all fears into one generic objection.
- Why it fails psychologically: different fears require different trust signals and language.
- Instead: distinguish risk, status loss, effort, and disbelief.

## ETHICAL GUARDRAILS

This skill must:
- Reflect the target human honestly, not invent a flattering persona.
- Distinguish evidence from speculation.
- Avoid demographic stereotypes and manipulative inference.

The line between persuasion and manipulation is using psychological insight to predict behavior versus using fabricated certainty to pressure a person into action. Never cross it.

## SKILL CHAINING

Optional context from related skills (equivalent supplied research is sufficient; do not create a prerequisite cycle):
- [ ] `@awareness-stage-mapper` - if the audience's knowledge level is already known

This skill's output feeds into:
- [ ] `@jobs-to-be-done-analyst`
- [ ] `@awareness-stage-mapper`
- [ ] `@copywriting-psychologist`
- [ ] `@ux-persuasion-engineer`
- [ ] `@identity-mirror`

## OUTPUT QUALITY CHECK

Before finalizing output, the agent asks:
- [ ] Did I separate facts from inference?
- [ ] Did I identify the primary need state and identity commitment?
- [ ] Did I name fears in concrete rather than vague terms?
- [ ] Would a psychologist recognize this as a real profile, not a stereotype?
- [ ] Does this respect the ethical guardrails?

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer job mapper](https://useaiblocks.com/skills/customer-job-mapper). It takes the buyer profile.
- **Plan your strategy** with the [Product positioning planner](https://useaiblocks.com/skills/product-positioning-planner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

**User request:**

> Build a psychographic profile for this audience before we decide positioning, copy, or funnel structure.

**Illustrative output:** From three supplied interview excerpts, return six sections in this order: Surface signals (what the buyer said or did), Dominant need state, Identity commitments, Fears and friction, the Psychographic profile, and Unknowns and follow-up questions. Keep observed statements apart from guesses. Do not infer health, political beliefs or hidden vulnerabilities.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
