---
# AGENT SKILLS STANDARD FIELDS (v2)
name: dialogic-teaching-move-generator
description: "Generate follow-up teaching moves that extend student thinking after a specific classroom response. Use when a student says something worth exploring and the teacher wants to deepen the dialogue."
disable-model-invocation: false
user-invocable: true
effort: medium

# EXISTING FIELDS

skill_id: "questioning-discussion/dialogic-teaching-move-generator"
skill_name: "Dialogic Teaching Move Generator"
domain: "questioning-discussion"
version: "1.0"
evidence_strength: "strong"
evidence_sources:
  - "Mercer (2000) — Words and Minds: how we use language to think together"
  - "Alexander (2008, 2020) — Towards Dialogic Teaching: rethinking classroom talk"
  - "Michaels et al. (2008) — Deliberative discourse idealized and realized: accountable talk in the classroom"
  - "Resnick et al. (2015) — Accountable talk: instructional dialogue that builds the mind"
  - "Cazden (2001) — Classroom Discourse: the language of teaching and learning"
input_schema:
  required:
    - field: "student_response"
      type: "string"
      description: "The specific student response the teacher needs to follow up on"
    - field: "learning_goal"
      type: "string"
      description: "What the teacher wants students to understand or be able to do"
    - field: "subject_context"
      type: "string"
      description: "Subject area and topic being discussed"
  optional:
    - field: "student_level"
      type: "string"
      description: "Age/year group and verbal confidence level"
    - field: "student_profiles"
      type: "array"
      description: "From context engine: language levels, confidence with discussion, cultural factors"
    - field: "response_quality"
      type: "string"
      description: "Teacher's assessment of the response — correct, partially correct, incorrect, unclear, or superficial"
    - field: "classroom_context"
      type: "string"
      description: "Whole class, small group, or one-to-one; stage of the lesson"
output_schema:
  type: "object"
  fields:
    - field: "move_options"
      type: "array"
      description: "3-5 specific teacher follow-up moves with exact wording, move type label, and rationale"
    - field: "move_selection_guidance"
      type: "string"
      description: "When to choose each move depending on context and goals"
    - field: "dialogue_extension"
      type: "object"
      description: "How to extend the dialogue further after each move — likely student responses and second-turn follow-ups"
    - field: "common_pitfalls"
      type: "string"
      description: "Moves to avoid in this situation and why"
chains_well_with:
  - "socratic-questioning-sequence-generator"
  - "discussion-protocol-selector"
  - "checking-for-understanding-protocol-designer"
  - "think-aloud-script-generator"
teacher_time: "2 minutes"
tags: ["dialogic-teaching", "teacher-moves", "revoicing", "classroom-talk", "accountable-talk"]
---

# Dialogic Teaching Move Generator

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

Takes a specific student response during classroom dialogue and generates high-quality teacher follow-up moves — the exact words a teacher could say next to deepen thinking, extend reasoning, invite other voices, or challenge assumptions. Each move is labelled by type (revoicing, pressing for reasoning, inviting participation, challenging, building on), with a rationale explaining why that move is appropriate at this moment. AI is specifically valuable here because expert dialogic teaching requires split-second decisions about what to say next — decisions that depend on simultaneously analysing the quality of the student's response, the learning goal, the room's dynamics, and the repertoire of productive talk moves. Even experienced teachers default to evaluating ("Good answer!") or moving on, rather than using the response as a springboard for deeper collective thinking.

## Evidence Foundation

Mercer (2000) introduced the concept of "interthinking" — the idea that dialogue is not just communication but a tool for thinking together. He identified three types of classroom talk: disputational (disagreement without reasoning), cumulative (uncritical agreement), and exploratory (critical, constructive engagement with evidence and reasoning). Mercer argues that exploratory talk is the type most likely to support learning. Alexander (2008, 2020) built on this with his framework of dialogic teaching, identifying five principles: collective (learning together), reciprocal (listening and sharing), supportive (freely expressed ideas without fear), cumulative (building on each other's contributions), and purposeful (directed toward learning goals). Michaels et al. (2008) operationalised dialogic teaching into specific, teachable "talk moves" — revoicing ("So you're saying..."), pressing for reasoning ("What makes you think that?"), inviting others ("Who can add to what she said?"), and challenging ("Does anyone disagree?"). Resnick et al. (2015) report benefits from using these accountable talk moves in reading and mathematical reasoning. These research summaries are the author's and were not checked here, so do not quote them to a class or a school as proven results. Cazden (2001) identified the dominant classroom discourse pattern as IRE (Initiate-Respond-Evaluate) and argued that breaking this pattern, by replacing evaluation with follow-up moves, improves the quality of classroom thinking.

## Input Schema

The teacher must provide:
- **Student response:** The exact or paraphrased student response to follow up on. *e.g. "The character is selfish because she didn't share the food" / "I think the answer is 42 because I multiplied 6 by 7" / "Photosynthesis is when plants eat sunlight"*
- **Learning goal:** What the teacher wants students to understand. *e.g. "Students should understand that character motivation is complex and influenced by context" / "Students should be able to explain the relationship between light energy and chemical energy in photosynthesis"*
- **Subject context:** Subject and topic. *e.g. "Year 9 English — analysing character in Of Mice and Men" / "Year 7 Science — photosynthesis"*

Optional (injected by context engine if available):
- **Student level:** Age/year group and verbal confidence
- **Student profiles:** Language levels, discussion confidence, cultural factors
- **Response quality:** Teacher's assessment of the response (correct, partially correct, incorrect, unclear, superficial)
- **Classroom context:** Whole class, small group, or one-to-one

## Prompt

```
You are an expert in dialogic teaching and classroom discourse, with deep knowledge of Mercer's (2000) interthinking framework, Alexander's (2008, 2020) dialogic teaching principles, and Michaels et al.'s (2008) accountable talk moves. You understand that the teacher's response to a student's contribution is the single most important moment in classroom dialogue — it determines whether thinking deepens or dies.

Your task is to generate high-quality teacher follow-up moves for this situation:

**Student response:** {{student_response}}
**Learning goal:** {{learning_goal}}
**Subject context:** {{subject_context}}

The following optional context may or may not be provided. Use whatever is available; ignore any fields marked "not provided."

**Student level:** {{student_level}} — if not provided, generate moves appropriate for a secondary school student with moderate verbal confidence.
**Student profiles:** {{student_profiles}} — if not provided, assume a mixed class where some students are confident in discussion and others are reluctant to speak.
**Response quality:** {{response_quality}} — if not provided, analyse the student response yourself and determine whether it is correct, partially correct, incorrect, unclear, or superficial.
**Classroom context:** {{classroom_context}} — if not provided, assume whole-class dialogue.

Apply these evidence-based principles:

1. **Break the IRE pattern (Cazden, 2001):**
   - The default classroom pattern is Initiate (teacher asks) → Respond (student answers) → Evaluate (teacher says "Good" or "Not quite"). This pattern kills thinking because it tells students their job is to guess what the teacher wants, not to reason.
   - NEVER generate moves that simply evaluate ("Good answer!", "Not quite, try again"). Instead, generate moves that USE the student's response to push thinking forward.

2. **Use specific talk move types (Michaels et al., 2008):**
   - **Revoicing:** Restating the student's idea to check understanding and make it available to the class. "So you're saying that..." / "Let me see if I've got this — you think..."
   - **Pressing for reasoning:** Asking the student to explain WHY they think what they think. "What's your evidence for that?" / "What makes you say that?" / "Can you walk us through your thinking?"
   - **Inviting others:** Bringing other students into the dialogue. "Who agrees or disagrees with what Jamie said?" / "Can anyone build on that?" / "Does this connect to what Priya said earlier?"
   - **Challenging:** Introducing a counter-example, complication, or alternative perspective. "What if someone argued the opposite?" / "But what about [counter-example]?" / "How would you respond to someone who said...?"
   - **Building on:** Connecting the student's idea to the learning goal or to another concept. "That connects to something we looked at last week..." / "You've actually identified the key principle here..."

3. **Match the move to the response quality:**
   - If the response is CORRECT but SUPERFICIAL: press for reasoning or challenge to deepen.
   - If the response is PARTIALLY CORRECT: revoice to clarify, then press for the missing element.
   - If the response is INCORRECT: do not evaluate negatively. Instead, revoice to make the claim visible, then challenge with a counter-example or invite others to respond.
   - If the response is UNCLEAR: revoice tentatively ("Are you saying...?") to give the student a chance to clarify.
   - If the response is EXCELLENT: build on it and invite others to engage with the idea.

4. **Promote exploratory talk (Mercer, 2000):**
   - The goal is not to get the "right answer" out of one student — it's to create a dialogue where the class thinks together.
   - Every move should aim to keep the dialogue going, not close it down.
   - Moves should model the norms of exploratory talk: giving reasons, considering alternatives, building on others' ideas.

5. **Maintain Alexander's (2008) five principles:**
   - Collective: moves should involve the whole class, not just the responding student.
   - Reciprocal: moves should position the teacher as genuinely listening, not just waiting for the right answer.
   - Supportive: moves should maintain psychological safety — a wrong answer should be treated as a valuable contribution to the dialogue.
   - Cumulative: moves should connect this response to previous contributions.
   - Purposeful: moves should steer toward the learning goal without being coercive.

Return your output in this exact format:

## Dialogic Teaching Moves: [Brief description of the situation]

**Student said:** [The student response]
**Learning goal:** [The learning goal]
**Response analysis:** [Your assessment: correct/partially correct/incorrect/unclear/superficial, with brief explanation]

### Recommended Moves

For each move (generate 4–5):
- **Move [N]: [Move type]**
  **Say:** "[The exact words the teacher could say]"
  **Why this move:** [Why this is appropriate here — what it does to the thinking in the room]
  **Likely student response:** [What the student or class is likely to say or do next]
  **Second-turn follow-up:** [What to say after the likely response]

### Move Selection Guide

[When to choose each move — e.g. "Use Move 1 if the class is quiet and you need to make the idea visible before discussing it. Use Move 3 if several students look like they want to respond."]

### Moves to Avoid Here

[1–2 specific moves that would be counterproductive in this situation, and why — e.g. "Avoid saying 'Good try' and moving on — this evaluates the response without deepening thinking and signals to the class that the answer was wrong."]

**Self-check before returning output:** Verify that (a) no move simply evaluates the response ("Good!", "Not quite"), (b) at least one move invites other students into the dialogue, (c) at least one move presses for reasoning, (d) the moves collectively steer toward the learning goal without being coercive, and (e) the exact wording sounds natural — like something a teacher would actually say in a classroom, not a textbook instruction.
```

## Example Output

This is the shape of a good answer, with placeholders where your own details go. Replace every bracket with the real student words, topic and goal. Never reuse a placeholder as if it were a fact about the text or the class.

**Scenario:** *Student response: "[STUDENT'S EXACT WORDS]" / Learning goal: "[WHAT STUDENTS SHOULD UNDERSTAND]" / Subject context: "[YEAR GROUP, SUBJECT AND TOPIC]"*

---

## Dialogic Teaching Moves: [TOPIC]

**Student said:** "[STUDENT'S EXACT WORDS]"
**Learning goal:** [WHAT STUDENTS SHOULD UNDERSTAND]
**Response analysis:** [Right, partly right, wrong, unclear or thin, and why. Name what the student got right and what is missing against the learning goal.]

### Recommended Moves

**Move 1: Revoicing + Pressing for Reasoning**
**Say:** "So you're saying [REVOICE THE CLAIM]. What makes you think that, rather than [ALTERNATIVE EXPLANATION]?"
**Why this move:** [Why it fits this answer and this goal.]
**Likely student response:** [What the student is likely to say next.]
**Second-turn follow-up:** [What to ask if they answer as predicted.]

**Move 2: Challenging with a Counter-Example**
**Say:** "[A CASE THAT CHANGES THE CONTEXT OF THE CLAIM]. Does your idea still hold? Where is the line?"
**Why this move:** [Why it fits.]
**Likely student response:** [Prediction.]
**Second-turn follow-up:** [Next question.]

**Move 3: Inviting Others**
**Say:** "[STUDENT'S NAME] says [CLAIM]. Who sees it differently?"
**Why this move:** [Why it fits.]
**Likely student response:** [Prediction.]
**Second-turn follow-up:** [Next question.]

(Moves 4 and 5 follow the same shape: building on the idea and connecting it to the learning goal, and pressing for evidence from the work or text the class is using.)

### Move Selection Guide

- **Use Move 1** as your default when the student is confident and the class is engaged.
- **Use Move 2** when the class is used to debate and you want to move faster toward the goal.
- **Use Move 3** when other students want to speak or one student dominates.

### Moves to Avoid Here

1. **Avoid: "Good point, but actually [THE ANSWER YOU WANT]."** This is the IRE pattern (teacher asks, student answers, teacher judges) in disguise. The "but actually" cancels the praise and hands the student the answer instead of letting the class reason to it.

2. **Avoid: "Does anyone else want to add something?"** It is too vague. Give other students something specific to respond to, such as "Who sees it differently?"

---

## Known Limitations

1. **The quality of the output depends entirely on the accuracy of the student response provided.** A paraphrased or simplified version of what a student said will produce different moves than the exact words. Teachers should try to capture the student's actual language — the specific words students use often reveal their thinking more precisely than a teacher's summary.

2. **Dialogic moves require a classroom culture that supports them.** If students are not accustomed to being pressed for reasoning, challenged, or asked to respond to peers, these moves can feel threatening or confusing. Building a dialogic classroom culture is a long-term project — teachers should introduce these moves gradually, starting with revoicing (lowest risk) and adding pressing and challenging as students become comfortable. This skill generates the moves but cannot build the culture.

3. **The generator cannot read the room.** In live classroom dialogue, the teacher's choice of move depends on body language, tone of voice, emotional state, group dynamics, and dozens of other contextual cues that cannot be captured in a text description. The moves provided are starting points — the teacher must use professional judgment about which move fits the moment. A move that's perfect for a confident class on a good day may be counterproductive for the same class when they're tired or anxious.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Student mistake analyser](https://useaiblocks.com/skills/student-mistake-analyser). It takes the document.
- The [Student work criteria reviewer](https://useaiblocks.com/skills/student-work-gap-finder). It takes the document.
- The [Student rubric feedback writer](https://useaiblocks.com/skills/student-work-marking-desk). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
