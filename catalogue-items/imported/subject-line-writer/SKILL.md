---
name: subject-line-psychologist
description: "Draft email subject lines and notification copy matched to audience and sequence position when earning attention requires clarity and truthful curiosity."
risk: safe
source: community
date_added: "2026-04-04"
---
Use a marketing planning and audience-research lens. Your task is to engineer email subject lines and notification copy that achieve opens through psychological triggers matched to the audience and sequence position.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **Brand file** (its buyers part), made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.
- **A draft** (yours): the ad, page, email or script you want checked or improved.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your brand file.
3. This one.

**From the brand file, read:** `index.md`, `offers.json`, `facts.json`, `voice.md`. Take the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a buyer brief, your brand file, a draft. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- Use when email subject lines need stronger open-rate psychology without losing clarity.
- Use when you want multiple subject-line angles tuned to curiosity, relevance, or urgency.

## Evidence and scope

Use observed audience research and verified product facts. Psychological interpretations and the author-year references below are inherited conceptual context, not validated evidence for this exact workflow or a guaranteed conversion effect. Before using a scientific claim externally, verify the actual publication, method and applicability; omit unsupported claims. This is marketing planning, not clinical diagnosis. Do not infer sensitive traits or exploit vulnerabilities.

Original contribution: [PR 451](https://github.com/sickn33/agentic-awesome-skills/pull/451) by MMEHDI0606; [immutable source snapshot](https://github.com/MMEHDI0606/antigravity-awesome-skills/blob/9c61357e3e6bb167946036f52ac1e28fc82e04d0/skills/subject-line-psychologist/SKILL.md). This identifies the contributed instructions, not scientific validation or a new upstream endorsement.

## CONTEXT GATHERING

Before writing subject lines, establish:

1. **The Target Human** - psychographic profile, awareness stage, and trust stage.
2. **The Objective** - open, re-open, or urgent response.
3. **The Output** - subject lines for a specific email or alert.
4. **Constraints** - length, preview pane, sender identity, and ethics.

If the sequence context is unclear, ask before proceeding.

## PSYCHOLOGICAL FRAMEWORK: OPEN-TRIGGER SIGNALING

### Mechanism
People open messages when the subject line signals relevance, opens a curiosity gap, or creates a recognizable interruption in routine. The best subject lines are stage-aware and promise a payoff that the email actually delivers (Loewenstein curiosity gap; self-referential processing; pattern interrupt logic; Moyer-Gusé et al., 2022; Dragojevic et al., 2024).

### Execution Steps

**Step 1 - Define the open reason**
Decide whether the subject line should trigger curiosity, identity, urgency, reassurance, or specificity.
*Planning hypothesis (verify before presenting as research): different attention states respond to different cues (attentional capture research; Song et al., 2024).*

**Step 2 - Build the smallest useful gap**
Create a gap the reader can plausibly close by opening the message.
*Planning hypothesis (verify before presenting as research): curiosity works when the answer is accessible and relevant (curiosity research; Green & Brock, 2000).*

**Step 3 - Add self-reference when useful**
Use the reader's own problem, role, or aspiration if it feels natural.
*Planning hypothesis (verify before presenting as research): self-relevance increases attention and processing (Moyer-Gusé et al., 2022; Ooms et al., 2019).*

**Step 4 - Check sender trust interaction**
Make sure the subject line and sender name work together.
*Planning hypothesis (verify before presenting as research): open behavior depends on trust, not just wording (Rowley et al., 2015).*

**Step 5 - Sanity-check for promise continuity**
Confirm the email body resolves the promise cleanly.
*Planning hypothesis (verify before presenting as research): overpromising harms trust and future opens (Nagy et al., 2022).*

## DECISION MATRIX

### Variable: sequence position
- If first email -> use clarity and relevance.
- If mid-sequence -> use curiosity or proof.
- If final ask -> use specificity and decision clarity.

### Variable: audience temperature
- If cold -> use low-pressure relevance.
- If warm -> use curiosity plus outcome.
- If hot -> use directness and immediacy.

### Variable: device context
- If mobile-heavy -> keep the subject line short and front-load the mechanism.
- If desktop-heavy -> you can support a slightly longer thought.
- If mixed -> optimize for the shortest readable version.

## FAILURE MODES - DO NOT DO THESE

**Failure Mode 1**
- Agents typically: write bait-y subject lines.
- Why it fails psychologically: the open may happen once, but trust drops over time.
- Instead: make the gap real and satisfied by the email.

**Failure Mode 2**
- Agents typically: personalize in a creepy way.
- Why it fails psychologically: overly specific personalization can trigger discomfort.
- Instead: keep personalization useful and unsurprising.

**Failure Mode 3**
- Agents typically: ignore preview truncation.
- Why it fails psychologically: the mechanism disappears before the open.
- Instead: front-load the useful cue.

## ETHICAL GUARDRAILS

This skill must:
- Be truthful.
- Avoid deceptive urgency.
- Preserve reader consent and trust.

The line between persuasion and manipulation is using the subject line to earn attention honestly versus manufacturing false intrigue or threat to force an open. Never cross it.

## SKILL CHAINING

Optional context from related skills (equivalent supplied research is sufficient; do not create a prerequisite cycle):
- [ ] `@sequence-psychologist`
- [ ] `@customer-psychographic-profiler`
- [ ] `@awareness-stage-mapper`

This skill's output feeds into:
- [ ] `@sequence-psychologist`
- [ ] `@copywriting-psychologist`

## OUTPUT QUALITY CHECK

Before finalizing output, the agent asks:
- [ ] Does the subject line create a real open trigger?
- [ ] Is it matched to sequence position?
- [ ] Does it fit the sender trust context?
- [ ] Is it short enough for the device context?
- [ ] Does the email body satisfy the promise?

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Email draft readiness checker](https://useaiblocks.com/prompts/email-send-readiness-scorer). It takes the draft.
- The [Newsletter draft and subject editor](https://useaiblocks.com/skills/weekly-newsletter-keeper).
- The [Email schedule planner](https://useaiblocks.com/skills/email-cadence-planner). It takes the draft.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

**User request:**

> Rewrite these email subject lines for stronger open-rate psychology while preserving clarity and truthful claims.

**Illustrative output:** For a requested account export, use “Your CSV export is ready” only after the export succeeds; do not disguise a marketing email as a transactional notification.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
