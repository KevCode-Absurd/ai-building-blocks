---
name: learning-memory
description: Use when capturing or restoring a learner's persistent profile to personalize teaching across sessions.
version: 1.1.0
authors:
  - edu-agent-skills contributors
tags: [memory, personalization, cross-session, learner-profile]
status: stable
---

# Purpose

Maintain a structured learner profile across sessions so agents start at the right depth, avoid re-teaching covered material, and prioritize known weak areas.

# Activation

- New session begins and prior context may exist. Learner references prior sessions or covered topics. Session ends and state should be preserved. Agent needs to personalize without re-asking onboarding questions.
- **Skip if**: one-off session with no continuity desired, no persistent storage available, or narrow stateless task.
- **Routing**: run at session start (restore) and end (save). Feed weak areas to `weak-area-tracker`. Profile drives `find-your-level` for returning learners with uncertain level.

# Inputs

- Prior session summary/profile, current session transcript, concepts + outcomes, learner self-reports, error patterns from assessment skills.

# Profile Schema (compact)

```yaml
learner_profile:
  level: beginner | intermediate | advanced
  stated_goal: "<goal>"
  learning_style: code-first | concept-first | mixed
  weak_areas: [{topic, type, last_seen, correction_attempted}]
  covered_topics: [{topic, confidence: low|medium|high, last_confirmed}]
  active_checkpoint: "<last concept/milestone in progress>"
  session_count: N
  last_session: "<ISO date>"
```

# Workflow

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

**Makes it better (optional):**
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Session Start (Restore)
1. **Retrieve** — Check for prior profile. If exists: summarize and confirm accuracy with learner. If none: run `find-your-level`.
2. **Staleness Check** — Last session 2+ weeks ago → flag for light review. Goal changed → update target.
3. **Inject** — Feed relevant profile data (level, weak areas, last checkpoint) into current session. Don't re-explain confirmed material unless requested.

## Session End (Save)
4. **Extract** — Record: concepts covered, understanding outcomes, new weak areas, self-reported confidence.
5. **Update** — Merge into profile. Promote "in-progress" → "covered" when confirmed. Add new weak areas.
6. **Handoff** — Output compact summary: where to resume, what to skip, top 1–2 priorities for next session.

# Rules

- DO: confirm profile accuracy with learner at session start — never assume stale data is current.
- DO: base profile updates on observable evidence, not assumptions.
- DO: cap weak-area list at 5 active items.
- DO: frame all profile data as "what we'll focus on" not "what went wrong."
- DON'T: re-teach confirmed topics without request or regression evidence.
- DON'T: skip the session-end save — always output the handoff note.
- DON'T: treat "covered" as "fully mastered" — watch for regression signals.

# Output

Session start: restored profile summary + confirmation prompt. Session end: concepts covered with outcomes, new/resolved weak areas, and handoff note (resume point + priorities + skip list). Write the handoff note as a short bulleted list with three parts:
- Resume point: the last concept or milestone in progress.
- Skip list: topics already confirmed, with the date.
- Priorities: the top one or two things for next time.
Keep the whole note under about 120 words.

This skill mentions `find-your-level` and `weak-area-tracker`. In this catalogue they are the Learning level check and the Study gap tracker. If you do not have them, ask the learner two or three short questions to find their level, and keep the weak-area list in this profile.

# Checklist

- [ ] Profile confirmed with learner at session start.
- [ ] Staleness check performed if 2+ week gap.
- [ ] Session outcomes logged with evidence.
- [ ] Handoff note produced at session end.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Study gap tracker](https://useaiblocks.com/skills/study-gap-tracker). It takes the document.
- The [Overloaded lesson checker](https://useaiblocks.com/skills/overloaded-lesson-checker). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
