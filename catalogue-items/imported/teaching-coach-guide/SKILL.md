---
# AGENT SKILLS STANDARD FIELDS (v2)
name: instructional-coaching-conversation-guide
description: "Generate a coaching conversation guide with questions, protocols, and follow-up actions for a teaching focus. Use when preparing for coaching sessions, mentoring, or peer feedback conversations."
disable-model-invocation: false
user-invocable: true
effort: medium

# EXISTING FIELDS

skill_id: "professional-learning/instructional-coaching-conversation-guide"
skill_name: "Instructional Coaching Conversation Guide"
domain: "professional-learning"
version: "1.0"
evidence_strength: "moderate"
evidence_sources:
  - "Knight (2007) — Instructional Coaching: a partnership approach to improving instruction"
  - "Knight (2018) — The Impact Cycle: what instructional coaches should do to foster powerful improvements in teaching"
  - "Kraft, Blazar & Hogan (2018) — The effect of teacher coaching on instruction and achievement: a meta-analysis"
  - "Costa & Garmston (2016) — Cognitive Coaching: developing self-directed leaders and learners"
  - "Aguilar (2013) — The Art of Coaching: effective strategies for school transformation"
input_schema:
  required:
    - field: "coaching_focus"
      type: "string"
      description: "The specific teaching practice or challenge being worked on — what the teacher wants to improve"
    - field: "teacher_context"
      type: "string"
      description: "Brief context about the teacher — experience level, subject, current situation"
  optional:
    - field: "observation_data"
      type: "string"
      description: "Data from a lesson observation, student work, or video — evidence to ground the conversation"
    - field: "coaching_phase"
      type: "string"
      description: "Where in the coaching cycle — initial goal-setting, mid-cycle check-in, or reflection on impact"
    - field: "relationship_stage"
      type: "string"
      description: "New coaching relationship, established trust, or challenging dynamic"
    - field: "teacher_disposition"
      type: "string"
      description: "The teacher's current stance — eager, resistant, overwhelmed, confident, uncertain"
    - field: "school_context"
      type: "string"
      description: "Relevant school features — coaching programme structure, leadership expectations"
output_schema:
  type: "object"
  fields:
    - field: "conversation_plan"
      type: "object"
      description: "A structured coaching conversation with specific questions, anticipated responses, and facilitator moves"
    - field: "questioning_sequence"
      type: "array"
      description: "Questions sequenced from reflective to analytical to action-planning"
    - field: "dialogue_strategies"
      type: "object"
      description: "Specific strategies for the coach — pausing, paraphrasing, probing, providing data"
    - field: "next_steps"
      type: "string"
      description: "Clear, specific next steps with accountability — what the teacher will try and when the coach will follow up"
chains_well_with:
  - "lesson-study-cycle-designer"
  - "lesson-observation-protocol-designer"
  - "reflective-practice-prompt-generator"
  - "teacher-inquiry-cycle-designer"
  - "pedagogical-content-knowledge-developer"
teacher_time: "4 minutes"
tags: ["coaching", "instructional-coaching", "Knight", "professional-learning", "feedback", "dialogue"]
---

# Instructional Coaching Conversation Guide

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What This Skill Does

Designs a structured coaching conversation between an instructional coach and a teacher — using Knight's (2007, 2018) partnership approach and the Impact Cycle model — that helps the teacher identify a specific improvement focus, analyse evidence from their practice, and commit to a concrete next step. The critical principle is that effective coaching is a PARTNERSHIP: the coach does not tell the teacher what to do (that's directing) or simply affirm what the teacher already thinks (that's cheerleading). Instead, the coach uses questions, data, and dialogue to help the teacher think more clearly about their practice and make their own decisions about what to change. The output is a conversation plan with specific questions, anticipated responses, dialogue strategies for the coach (pausing, paraphrasing, probing), and clear next steps with accountability. AI is specifically valuable here because designing a coaching conversation requires anticipating the teacher's likely responses, selecting the right questions for the right moment, and balancing challenge with support — a real-time facilitation skill that benefits from advance planning.

## Evidence Foundation

Knight (2007) established the partnership principles of instructional coaching: equality (the coach and teacher are equal partners), choice (the teacher decides what to work on), voice (the teacher's perspective is central), dialogue (real conversation, not one-way telling), reflection (the teacher examines their own practice), and praxis (learning is applied in the classroom). Knight (2018) operationalised these principles into the Impact Cycle: Identify (what's the current reality and what's the goal?), Learn (what strategy could close the gap?), Improve (implement, monitor, adjust). Kraft, Blazar & Hogan (2018) conducted a meta-analysis of 60 teacher coaching studies and found a pooled effect size of 0.49 standard deviations on instruction quality and 0.18 on student achievement — making coaching one of the most effective forms of professional development. They found that coaching is most effective when it is sustained (not one-off), focused on specific practices (not general), and includes observation and feedback cycles. Costa & Garmston (2016) developed Cognitive Coaching, emphasising that the coach's primary tool is questioning — questions that help teachers become more self-directed, self-monitoring, and self-modifying. Aguilar (2013) added the emotional dimension: effective coaching requires attention to the teacher's emotions, beliefs, and identity — not just their techniques.

## Input Schema

The teacher must provide:
- **Coaching focus:** What they're working on. *e.g. "I want to improve my questioning — I ask too many closed questions and don't give students enough think time" / "My Year 10 class is disengaged and I can't work out why" / "I've been told I need to differentiate more but I don't know where to start"*
- **Teacher context:** Brief background. *e.g. "NQT, first year of teaching, Science, generally enthusiastic but overwhelmed" / "Experienced teacher (12 years), English, recently had a critical observation and is defensive" / "Middle leader, 6 years, Maths, keen to improve but time-poor"*

Optional (injected by context engine if available):
- **Observation data:** Evidence to ground the conversation
- **Coaching phase:** Where in the cycle
- **Relationship stage:** New, established, or challenging
- **Teacher disposition:** Eager, resistant, overwhelmed, etc.
- **School context:** Coaching programme structure

## Prompt

```
You are an expert in instructional coaching, with deep knowledge of Knight's (2007, 2018) partnership approach, the Impact Cycle, Kraft, Blazar & Hogan's (2018) meta-analysis of coaching effectiveness, Costa & Garmston's (2016) Cognitive Coaching, and Aguilar's (2013) attention to the emotional dimension of coaching. You understand that effective coaching is a partnership where the coach uses questions and data to help the teacher think more clearly, not a directive process where the coach tells the teacher what to do.

CRITICAL PRINCIPLES:
- **Partnership, not direction.** The coach does not have the answers — the coach has the questions that help the teacher find their own answers. If the coach does all the talking, it's not coaching.
- **Data, not opinion.** Ground conversations in observable evidence (lesson observation data, student work, video clips), not subjective impressions. "I noticed 4 out of 25 students responded to your questions" is data. "Your questioning needs work" is opinion.
- **Specific, not general.** "Improve your differentiation" is too vague to act on. "Next lesson, provide three versions of the practice task at different difficulty levels" is specific enough to try.
- **The teacher decides.** The coach may suggest, model, or provide options — but the teacher chooses what to work on and what to try. Choice creates ownership; direction creates compliance.

Your task is to design a coaching conversation for:

**Coaching focus:** {{coaching_focus}}
**Teacher context:** {{teacher_context}}

The following optional context may or may not be provided. Use whatever is available; ignore any fields marked "not provided."

**Observation data:** {{observation_data}} — if not provided, design the conversation to elicit the teacher's own perception of the issue, and recommend that observation data be gathered before the next meeting.
**Coaching phase:** {{coaching_phase}} — if not provided, assume this is an initial coaching conversation (Identify phase).
**Relationship stage:** {{relationship_stage}} — if not provided, assume early-stage relationship where trust is being built.
**Teacher disposition:** {{teacher_disposition}} — if not provided, design for a willing but uncertain teacher.
**School context:** {{school_context}} — if not provided, design for a standard school coaching programme.

Apply Knight's Impact Cycle:

1. **Identify Phase:**
   - Help the teacher articulate the current reality: what's happening now?
   - Help the teacher define a clear goal: what would "better" look like?
   - Use data to bridge the gap between current reality and goal.

2. **Learn Phase:**
   - Explore strategies that could close the gap.
   - The coach may offer options, model a strategy, share research, or facilitate the teacher's own problem-solving.
   - The teacher selects the strategy to try.

3. **Improve Phase:**
   - The teacher implements the strategy.
   - The coach observes or the teacher self-monitors.
   - Review: did the strategy work? Adjust if needed.

For EACH question, provide:
- The question itself
- Why this question matters (what it's designed to surface)
- How to respond to likely answers (including if the teacher deflects, becomes defensive, or gives a surface-level answer)

Return your output in this exact format:

## Coaching Conversation: [Focus Area]

**Focus:** [What the teacher is working on]
**Teacher:** [Brief context]
**Phase:** [Identify / Learn / Improve]

### Conversation Plan

**Opening (5 minutes):**
[How to begin — building rapport, setting the agenda, establishing the partnership frame]

**Exploration (15 minutes):**
[Core questions to explore the focus area — with anticipated responses and follow-up moves]

**Action Planning (10 minutes):**
[Questions that move toward a specific next step]

**Closing (5 minutes):**
[Summarise, confirm next steps, schedule follow-up]

### Key Coaching Moves

[Specific dialogue strategies — pausing, paraphrasing, probing — with examples of each]

### If the Conversation Gets Stuck

[What to do when the teacher deflects, becomes defensive, gives surface answers, or the conversation loses focus]

### Next Steps Template

[A clear format for the agreed next step — what the teacher will try, when, and when the coach will follow up]

**Self-check before returning output:** Verify that (a) the conversation is a partnership, not a lecture, (b) questions are open and reflective, not leading, (c) the conversation is grounded in or moves toward evidence, (d) the next step is specific and achievable, and (e) the coach's role is to facilitate the teacher's thinking, not to provide all the answers.
```

## Example Output

This is a shortened outline. The scenario is made up to show the layout. Use your own focus, teacher notes and observation data.

**Scenario:** *Coaching focus: "[WHAT THE TEACHER WANTS TO IMPROVE]" / Teacher context: "[YEARS TEACHING, SUBJECT, HOW THEY FEEL ABOUT IT]" / Observation data: "[WHAT THE COACH COUNTED OR NOTED]" / Coaching phase: "Identify, first conversation on this focus"*

---

## Coaching Conversation: [Focus Area]

**Focus:** [What the teacher is working on]
**Teacher:** [Brief context]
**Phase:** Identify

### Conversation Plan

**Opening (5 minutes):** A real check-in, then: "Before I share what I noticed, I'd like to hear your view. What's your sense of how [FOCUS] goes in your lessons?"
*Why:* Asking the teacher's view first honours the partnership. If their view differs from the data, that gap is the discussion.

**Exploration (15 minutes):** Look at the data together. Ask, "What do you notice?" Then, "What do you think is behind that?" Let the teacher name the cause.

**Action Planning (10 minutes):** Ask the teacher to pick one strategy to try. Ask what would tell them it worked.

**Closing (5 minutes):** The teacher says the agreed step back in their own words.

### Key Coaching Moves

- **Pause.** After a question, wait. Count to five in your head before you speak.
- **Paraphrase.** Say the teacher's words back in slightly different language to check you understood.
- **Probe.** When the answer is on the surface, ask what specifically happens in the moment.
- **Give data, not opinion.** Say what you recorded, not what you think of it.

### If the Conversation Gets Stuck

- **The teacher deflects:** Acknowledge the frustration, then move to what the teacher can control.
- **The teacher gets defensive:** Say the data is a starting point, and the focus is growth, not judgement.
- **Only surface answers:** Ask for a concrete example, such as what a better version would sound like.

### Next Steps Template

**What:** [One small thing the teacher will try]
**When:** [Date of the lesson]
**Support:** [What the coach will do, such as observe and record]
**Follow-up:** [Date of the next meeting]

---

## Known Limitations

1. **Coaching conversations require trust.** The conversation above assumes a willing teacher in a supportive coaching relationship. If the teacher is actively resistant (not just nervous but hostile to coaching), the conversation design must change — trust-building must precede instructional focus. This skill does not address severely resistant coaching dynamics, which require different strategies.

2. **Coaching is most effective as part of a sustained cycle.** One coaching conversation produces limited change. The meta-analysis by Kraft et al. (2018) found that coaching effects come from sustained cycles of goal-setting, observation, feedback, and adjustment. This conversation plan is one step in what should be an ongoing cycle.

3. **The coach needs coaching skills, not just the conversation plan.** Reading a script of questions is not the same as facilitating a genuine coaching dialogue. The pausing, paraphrasing, probing, and responsive facilitation described above require practice. Coaches should receive training and, ideally, coaching on their own coaching practice.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Media literacy lesson builder](https://useaiblocks.com/skills/media-literacy-lesson-builder). It takes the plan.
- The [Practice problem set writer](https://useaiblocks.com/skills/practice-problem-set-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
