---
name: trust-calibrator
description: "Diagnose audience trust barriers and calibrate proof, certainty, and credibility signals when messaging overclaims or fails to reassure."
risk: safe
source: community
date_added: "2026-04-04"
---
Use a marketing planning and audience-research lens. Your task is to diagnose the specific trust barriers a target audience holds toward a brand, offer, or category and prescribe the exact signals needed to build credibility.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A draft** (yours): the ad, page, email or script you want checked or improved.

**Makes it better (optional):**
- **Org context** (its buyers part), made by the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder): who you are, your buyers, voice, look, markets, claims and offers, kept in one folder.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Org context** with the [Org context builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the org context, read:** `index.md`, `foundation/claims.md`, `foundation/dos-donts.md`, `facts.json`, `offers.json`, `voice.md`. Take the claims list with each claim's status, the offer terms word for word, and the real voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: an org context is a `context/org-context/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older `context/brand-file/` folder, or a brand folder with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a draft, your org context. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- Use when messaging needs the right level of certainty, proof, and claim strength for a skeptical audience.
- Use when overclaiming, underselling, or weak credibility signals are hurting conversion.

## Evidence and scope

Use observed audience research and verified product facts. Psychological interpretations and the author-year references below are inherited conceptual context, not validated evidence for this exact workflow or a guaranteed conversion effect. Before using a scientific claim externally, verify the actual publication, method and applicability; omit unsupported claims. This is marketing planning, not clinical diagnosis. Do not infer sensitive traits or exploit vulnerabilities.

Original contribution: [PR 451](https://github.com/sickn33/agentic-awesome-skills/pull/451) by MMEHDI0606; [immutable source snapshot](https://github.com/MMEHDI0606/antigravity-awesome-skills/blob/9c61357e3e6bb167946036f52ac1e28fc82e04d0/skills/trust-calibrator/SKILL.md). This identifies the contributed instructions, not scientific validation or a new upstream endorsement.

## CONTEXT GATHERING

Before calibrating trust, establish:

1. **The Target Human** - psychographic profile and skepticism level.
2. **The Objective** - what trust must unlock.
3. **The Output** - trust audit and trust-building prescription.
4. **Constraints** - category risk, history, and ethics.

If the trust problem is unclear, ask before proceeding.

## PSYCHOLOGICAL FRAMEWORK: CREDIBILITY LADDER

### Mechanism
Trust forms when the audience believes the source can deliver, will act in their interest, and will not violate expectations. Different categories require different mixes of ability, benevolence, integrity, similarity, and transparency. Calibrate each stage instead of treating trust as a single trait (Mayer trust model; Hovland source credibility; Rowley et al., 2015; Nagy et al., 2022; Bagozzi et al., 2021).

### Execution Steps

**Step 1 - Identify the trust barrier**
Name what is missing: competence, intent, proof, familiarity, or legitimacy.
*Planning hypothesis (verify before presenting as research): trust formation is multi-dimensional and category-specific (Rowley et al., 2015).*

**Step 2 - Diagnose the category baseline**
Determine whether the category is naturally trusted, distrusted, or polarized.
*Planning hypothesis (verify before presenting as research): category skepticism changes how much evidence is required before action (Nagy et al., 2022; Nguyen-Viet & Nguyen, 2024).*

**Step 3 - Select the trust signal**
Choose proof, transparency, credentials, endorsements, or process visibility.
*Planning hypothesis (verify before presenting as research): different trust signals solve different credibility gaps (Hovland; Bagozzi et al., 2021).*

**Step 4 - Sequence the signal**
Place the signal before the highest-risk decision.
*Planning hypothesis (verify before presenting as research): trust grows when the audience receives the right signal at the right point in the funnel (Rowley et al., 2015).*

**Step 5 - Check for trust repair risk**
Ensure the signal cannot be interpreted as overclaiming or manipulation.
*Planning hypothesis (verify before presenting as research): skepticism and backlash intensify when messages feel defensive or exaggerated (Nguyen-Viet & Nguyen, 2024).*

## DECISION MATRIX

### Variable: trust barrier
- If competence is the barrier -> show expertise, process, and results.
- If benevolence is the barrier -> show care, support, and customer interest.
- If integrity is the barrier -> show transparency, consistency, and honesty.
- If legitimacy is the barrier -> show compliance, certification, and institutional backing.

### Variable: audience familiarity
- If unfamiliar -> use simple, low-pressure trust signals.
- If somewhat familiar -> add proof and comparisons.
- If already familiar -> reduce clutter and let evidence speak.

### Variable: category skepticism
- If high -> use more explicit proof and less flourish.
- If medium -> blend proof with narrative.
- If low -> keep trust signals minimal and clean.

## FAILURE MODES - DO NOT DO THESE

**Failure Mode 1**
- Agents typically: assume one testimonial fixes trust.
- Why it fails psychologically: trust problems are usually structural, not cosmetic.
- Instead: match the signal to the actual barrier.

**Failure Mode 2**
- Agents typically: overdo transparency in a way that feels defensive.
- Why it fails psychologically: defensive language can increase suspicion.
- Instead: be clear, calm, and bounded.

**Failure Mode 3**
- Agents typically: use trust signals out of sequence.
- Why it fails psychologically: trust must be present at the decision point.
- Instead: place signals where the risk is felt.

## ETHICAL GUARDRAILS

This skill must:
- Build trust with real evidence.
- Avoid fake intimacy and fake authority.
- Respect uncertainty when the evidence is incomplete.

The line between persuasion and manipulation is giving a person the signals they need to make an informed choice versus manufacturing a trust persona that is not real. Never cross it.

## SKILL CHAINING

Optional context: any research the user already has about their buyers is enough. Do not stop to ask for other skills.

This skill's output feeds into the Social proof placer on AI Blocks (social-proof-placer), which decides where each piece of proof goes on the page. Its upstream names (`@social-proof-architect`, `@copywriting-psychologist`, `@pitch-psychologist`, `@sequence-psychologist`) are not in this library.

## OUTPUT QUALITY CHECK

Before finalizing output, the agent asks:
- [ ] Did I identify the actual trust barrier?
- [ ] Did I choose the right trust signal?
- [ ] Did I place it at the right decision point?
- [ ] Did I avoid defensive over-explaining?
- [ ] Does the output feel credible, calm, and real?

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Write the landing page** with the [Customer evidence placement planner](https://useaiblocks.com/skills/social-proof-placer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

**User request:**

> Calibrate the certainty, proof, and claim strength in this message for a skeptical audience.

**Illustrative output (landing page headline):**

- Message: "Grow your list 10x with our popup tool."
- Trust barrier: proof. A visitor in a distrusted category (growth tools that overpromise) cannot check "10x".
- Signal: one named customer result with its real before and after numbers, placed right under the headline, before the sign-up button.
- Claim strength: soften the headline to what you can show, such as "See how [named customer] grew their list in [timeframe]", and drop the "10x" unless you can prove it.

Use only proof the user really has.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
