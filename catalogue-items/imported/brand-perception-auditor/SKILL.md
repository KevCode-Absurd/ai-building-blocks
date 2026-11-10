---
name: brand-perception-psychologist
description: "Audit visual, verbal, and behavioral brand signals and propose alignment changes when market perception differs from the intended position."
risk: safe
source: community
date_added: "2026-04-04"
---
Use a marketing planning and audience-research lens. Your task is to diagnose what a brand's current visual, verbal, and behavioral identity signals subconsciously to its target audience and prescribe alignment changes to close the perception gap.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **Brand file**, made by the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder): your offers, facts, buyers, claims, voice and look, kept in one folder.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Brand file** with the [Brand file builder](https://useaiblocks.com/skills/website-brand-brain-builder). Bring your website, customer words (optional), your results (optional).
2. This one.

**From the brand file, read:** `index.md`, `facts.json`, `offers.json`, `voice.md`. Take the claims list with each claim's status, the offer terms word for word, and the real voice lines. Only `live` lines count as facts: stale, `unconfirmed` and `banned` lines do not. If `worked.md` is there, keep what the client kept and leave out what they killed. Source notes and rejected ideas never go into the result.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand file is a `context/brand-file/` folder with `index.md` in it. If it's there, read `index.md` and the files above. An older brand brain folder, with `00-start-here.md` in it, still works as material. Look for the other things by name.
2. **Check what's missing.** Look for a brief, your brand file, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- Use when you need to diagnose how a market currently perceives a brand and how to reposition it.
- Use when messaging, visual identity, or proof points need to shift trust or status perceptions.

## Evidence and scope

Use observed audience research and verified product facts. Psychological interpretations and the author-year references below are unverified. They are inherited conceptual context, not validated evidence for this exact workflow or a guaranteed conversion effect. Do not quote them to the user as proof. Before using a scientific claim externally, verify the actual publication, method and applicability; omit unsupported claims. This is marketing planning, not clinical diagnosis. Do not infer sensitive traits or exploit vulnerabilities.

Original contribution: [PR 451](https://github.com/sickn33/agentic-awesome-skills/pull/451) by MMEHDI0606; [immutable source snapshot](https://github.com/MMEHDI0606/antigravity-awesome-skills/blob/9c61357e3e6bb167946036f52ac1e28fc82e04d0/skills/brand-perception-psychologist/SKILL.md). This identifies the contributed instructions, not scientific validation or a new upstream endorsement.

## CONTEXT GATHERING

Before auditing brand perception, establish:

1. **The Target Human** - psychographic profile and category expectations.
2. **The Objective** - intended brand meaning and position.
3. **The Output** - brand perception audit and realignment plan.
4. **Constraints** - current assets, culture, and ethics.

If the intended position is unclear, ask before proceeding. If you already have a brand health audit report, share it: it shows how the brand looks today.

## PSYCHOLOGICAL FRAMEWORK: BRAND SCHEMA ALIGNMENT

### Mechanism
People do not evaluate a brand only by what it says. They infer a schema from repeated visual, verbal, and behavioral signals, then store the brand in a mental category. Alignment matters because one mismatched signal can weaken the whole impression through schema inconsistency and halo effects. (The original author names Aaker, Bagozzi et al. 2021, schema theory and halo effect research as background. These references are unverified: nobody has checked them for this skill. Treat them as ideas to test, not as proof, and do not quote them to others.)

### Execution Steps

**Step 1 - Identify the current brand schema**
List the lines of copy, visuals and behaviours the audience actually sees (homepage headline, packaging, reply tone, price display). For each, write one word for the impression it gives. Then sum up the impression the audience is likely forming now, in one sentence.
*Planning hypothesis (verify before presenting as research): brand meaning is built from repeated signals, not from mission statements alone (Bagozzi et al., 2021).*

**Step 2 - Compare to intended position**
State the desired perception in the same one-word terms, so each signal can be marked as matching or not matching.
*Planning hypothesis (verify before presenting as research): perception shifts when the audience sees congruent evidence across touchpoints (congruence theory).*

**Step 3 - Find the largest mismatch**
Score each touchpoint 0 (matches the intended position), 1 (partly off) or 2 (contradicts it). Pick the highest score on the most visible touchpoint. Write a mismatch note: the signal, the layer (visual, verbal or behavioural), what it says, what it should say.
*Planning hypothesis (verify before presenting as research): one strong mismatch can create cognitive dissonance and weaken trust (halo effect and schema theory).*

**Step 4 - Prescribe the smallest useful correction**
Change the one signal that will most efficiently move perception. Write the exact new line, image or behaviour, how much effort it takes (rate it small, medium or large), and one question to ask five customers to test whether it worked.
*Planning hypothesis (verify before presenting as research): brand meaning changes fastest when the highest-salience signal changes first (Aaker; semiotics research).*

**Step 5 - Verify cross-touchpoint consistency**
Go back through every touchpoint from Step 1 and mark each as still conflicting, fixed by this change, or needing its own change.
*Planning hypothesis (verify before presenting as research): consistency across channels reduces ambiguity and builds stronger category placement (Bagozzi et al., 2021).*

## DECISION MATRIX

### Variable: position gap size
- If small -> make targeted refinements.
- If medium -> realign the strongest mismatched layer first.
- If large -> rework the identity system across all layers.

### Variable: category expectation
- If category is conservative -> signal stability and competence.
- If category is premium -> signal restraint and precision.
- If category is playful -> signal personality without losing clarity.

### Variable: cultural context
- If culture-sensitive -> check semiotics and local category norms.
- If global -> use simple, broadly legible signals.
- If mixed -> prioritize clarity over subtle symbolism.

## FAILURE MODES - DO NOT DO THESE

**Failure Mode 1**
- Agents typically: change the logo and call it repositioning.
- Why it fails psychologically: brand perception is multi-layered.
- Instead: align visual, verbal, and behavioral signals.

**Failure Mode 2**
- Agents typically: introduce mixed messages across touchpoints.
- Why it fails psychologically: inconsistency creates dissonance.
- Instead: make the same promise everywhere.

**Failure Mode 3**
- Agents typically: ignore category schema and try to force a new meaning too quickly.
- Why it fails psychologically: people classify brands by familiar mental categories.
- Instead: move perception through credible, repeated signals.

## ETHICAL GUARDRAILS

This skill must:
- Tell the truth about what the brand can and cannot be.
- Avoid identity theater with no substance.
- Respect the audience's existing mental model.

The line between persuasion and manipulation is changing perception through real alignment versus using aesthetic tricks to imply qualities the brand does not have. Never cross it.

## SKILL CHAINING

Optional context from related skills (equivalent supplied research is sufficient; do not create a prerequisite cycle):
- [ ] `@customer-psychographic-profiler`
- [ ] `@visual-emotion-engineer`
- [ ] `@trust-calibrator`

This skill's output feeds into:
- [ ] `@copywriting-psychologist`
- [ ] `@ux-persuasion-engineer`
- [ ] `@pitch-psychologist`

## OUTPUT QUALITY CHECK

Before finalizing output, the agent asks:
- [ ] Did I identify the current brand schema?
- [ ] Did I locate the biggest mismatch?
- [ ] Did I prescribe the smallest high-leverage correction?
- [ ] Is the new position consistent across touchpoints?
- [ ] Would the audience experience this as more credible, not just prettier?

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Say it to the room** with the [Persuasion and claim editor](https://useaiblocks.com/skills/honest-persuasion-editor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example

**User request:**

> Diagnose how a market currently perceives a brand and how to reposition it.

**Illustrative output:** Compare an approved brand promise with the supplied homepage and two interview excerpts; name one observable mismatch, propose one correction and a perception-test question.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
