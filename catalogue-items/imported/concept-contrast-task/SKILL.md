---
# AGENT SKILLS STANDARD FIELDS (v2)
name: variation-theory-task-designer
description: "Design a variation theory task using contrast, separation, and fusion to teach critical features of a concept. Use when students confuse similar concepts or fail to discern key distinctions."
disable-model-invocation: false
user-invocable: true
effort: medium

# EXISTING FIELDS

skill_id: "global-cross-cultural-pedagogies/variation-theory-task-designer"
skill_name: "Variation Theory Task Designer"
domain: "global-cross-cultural-pedagogies"
version: "1.0"
evidence_strength: "strong"
evidence_sources:
  - "Marton (2015) — Necessary Conditions of Learning"
  - "Marton & Booth (1997) — Learning and Awareness"
  - "Lo (2012) — Variation Theory and the Improvement of Teaching and Learning"
  - "Kullberg, Runesson Kempe & Marton (2017) — What is made possible to learn when using the variation theory of learning in teaching mathematics?"
  - "Gu, Huang & Marton (2004) — Teaching with variation: a Chinese way of promoting effective Mathematics learning"
input_schema:
  required:
    - field: "object_of_learning"
      type: "string"
      description: "The specific concept, skill, or distinction students need to learn — what they should be able to discern after the task"
    - field: "common_confusion"
      type: "string"
      description: "What students typically confuse, conflate, or fail to distinguish — the critical feature they miss"
  optional:
    - field: "student_level"
      type: "string"
      description: "Age/year group and prior knowledge"
    - field: "subject_area"
      type: "string"
      description: "The curriculum subject"
    - field: "current_task"
      type: "string"
      description: "The existing task or activity that could be redesigned using variation theory"
    - field: "lesson_context"
      type: "string"
      description: "Where this fits in the sequence — introduction, consolidation, revision"
output_schema:
  type: "object"
  fields:
    - field: "variation_analysis"
      type: "object"
      description: "Analysis of the object of learning — what must vary and what must remain invariant for students to discern the critical feature"
    - field: "task_sequence"
      type: "array"
      description: "A sequence of examples/tasks using systematic variation — contrast, separation, generalisation, fusion"
    - field: "teacher_guidance"
      type: "object"
      description: "How to present the variation — what to draw attention to, what questions to ask"
    - field: "assessment_check"
      type: "string"
      description: "How to verify that students can now discern the critical feature"
chains_well_with:
  - "explicit-instruction-sequence-builder"
  - "worked-example-fading-designer"
  - "cpa-sequence-designer"
  - "diagnostic-question-generator"
  - "curriculum-knowledge-architecture-designer"
teacher_time: "20 minutes to write the task and check the examples"
tags: ["variation-theory", "Marton", "discernment", "contrast", "critical-features", "Hong-Kong", "Sweden", "mathematics-education"]
---

# Variation Theory Task Designer

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your lesson plan** (yours): the lesson or class task, the age group, the subject and the aims.

**Makes it better (optional):**
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **Your notes** (yours): what to keep, change or drop.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Worked-example practice ladder builder](https://useaiblocks.com/skills/worked-example-practice). Bring your lesson plan, a plan (optional), your notes (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your lesson plan, a plan, your notes. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What This Skill Does

Designs learning tasks using variation theory — a framework developed by Ference Marton and colleagues in Sweden and Hong Kong that explains how learners come to discern critical features of concepts through systematic patterns of variation and invariance. The core principle is deceptively simple: to notice a feature, a learner must experience it VARYING while other features remain constant. If everything changes at once, no single feature becomes salient. The skill analyses the object of learning to identify its critical features (what students must discern), identifies common confusions (what students fail to distinguish), and designs a sequence of examples that systematically vary and hold invariant the right dimensions to make the critical feature visible. The output includes a variation analysis, a task sequence using the four patterns of variation (contrast, separation, generalisation, fusion), teacher guidance for drawing attention to the variation, and an assessment check. AI is specifically valuable here because designing effective variation sequences requires simultaneously considering what varies, what stays the same, and how each example relates to every other example in the sequence — a combinatorial challenge that benefits from systematic design.

## Evidence Foundation

Marton & Booth (1997) established the theoretical foundation: learning is a change in the way a person experiences or understands something, and this change requires the learner to discern features they previously did not notice. Discernment requires variation — you cannot notice a feature that never changes. Marton (2015) formalised this into four patterns of variation: CONTRAST (experiencing what something IS against what it IS NOT), SEPARATION (varying one dimension while holding others constant, to isolate the critical feature), GENERALISATION (varying irrelevant features while holding the critical feature constant, to show that the concept applies across contexts), and FUSION (varying multiple critical features simultaneously, to develop integrated understanding). Lo (2012) demonstrated the application of variation theory to lesson design in Hong Kong, showing that teachers who designed lessons using systematic variation produced significantly better student understanding than teachers who used varied examples without systematic design — it is not variety that matters, but the PATTERN of variation. Kullberg, Runesson Kempe & Marton (2017) applied variation theory to mathematics education, showing how carefully sequenced examples that vary one feature at a time help students discern mathematical structures they would otherwise miss. Gu, Huang & Marton (2004) documented the Chinese mathematical tradition of "teaching with variation" (bianshi jiaoxue), showing that Chinese mathematics instruction systematically uses variation to develop conceptual understanding — a practice embedded in Chinese pedagogy long before Marton formalised the theory.

## Input Schema

The teacher must provide:
- **Object of learning:** What students need to learn to discern. *e.g. "The difference between area and perimeter — students confuse the two because they both involve measuring shapes" / "When to use 'effect' vs 'affect' — students use them interchangeably" / "The distinction between speed and velocity — students treat them as synonyms"*
- **Common confusion:** What students get wrong. *e.g. "Students think bigger shapes always have bigger perimeters" / "Students default to 'effect' in all contexts" / "Students don't understand why direction matters in velocity"*

Optional (injected by context engine if available):
- **Student level:** Year group and prior knowledge
- **Subject area:** The curriculum subject
- **Current task:** An existing task to redesign
- **Lesson context:** Where this fits in the sequence

## Prompt

```
You are an expert in variation theory as developed by Ference Marton and colleagues, with deep knowledge of Marton & Booth (1997), Marton (2015), Lo (2012), Kullberg et al. (2017), and the Chinese tradition of teaching with variation (Gu, Huang & Marton, 2004). You understand that learning requires discernment, discernment requires variation, and effective variation is SYSTEMATIC — not random variety, but carefully designed patterns where specific features vary while others are held constant.

CRITICAL PRINCIPLES:
- **Identify the critical feature.** The object of learning has multiple features, but the CRITICAL feature is the one students must discern to understand the concept. Everything else in the design serves to make this feature visible.
- **Use the four patterns of variation:**
  - **Contrast:** Show what the concept IS alongside what it IS NOT (e.g., show area AND perimeter of the same shape, so the difference becomes visible)
  - **Separation:** Vary the critical feature while holding everything else constant (e.g., change the perimeter of a shape while keeping the area the same — this separates perimeter from area in the learner's experience)
  - **Generalisation:** Hold the critical feature constant while varying irrelevant features (e.g., show that area = length × width works for rectangles of different sizes, orientations, and colours — the concept generalises across surface variations)
  - **Fusion:** Vary multiple critical features simultaneously (e.g., vary both area and perimeter together, so students must attend to both — this develops integrated understanding)
- **Sequence matters.** Contrast first (to create awareness), then separation (to isolate), then generalisation (to extend), then fusion (to integrate). This sequence scaffolds discernment from initial noticing to full understanding.
- **Less is more.** A few carefully chosen examples with systematic variation are more powerful than many random examples. Each example should differ from the previous one in a deliberate, minimal way.

Your task is to design a variation theory task for:

**Object of learning:** {{object_of_learning}}
**Common confusion:** {{common_confusion}}

The following optional context may or may not be provided. Use whatever is available; ignore any fields marked "not provided."

**Student level:** {{student_level}} — if not provided, design for a general secondary school context.
**Subject area:** {{subject_area}} — if not provided, infer from the object of learning.
**Current task:** {{current_task}} — if not provided, design a new task from scratch.
**Lesson context:** {{lesson_context}} — if not provided, design for an introduction to the distinction.

Return your output in this exact format:

## Variation Theory Task: [Object of Learning]

**Object of learning:** [What students must discern]
**Critical feature:** [The specific feature that must become visible]
**Common confusion:** [What students currently conflate]

### Variation Analysis

[Analysis of the object of learning: what are its features, which is the critical feature, what must vary and what must remain invariant for the critical feature to become visible]

### Task Sequence

**Phase 1 — Contrast (What IS it vs. what ISN'T it?)**
[Examples that place the concept alongside its common confusion, making the difference visible]

**Phase 2 — Separation (Isolating the critical feature)**
[Examples where ONLY the critical feature varies while everything else stays the same]

**Phase 3 — Generalisation (The concept across contexts)**
[Examples where the critical feature stays constant but surface features vary — showing the concept holds across different cases]

**Phase 4 — Fusion (Integrating multiple features)**
[Examples where multiple features vary simultaneously — requiring students to attend to and coordinate several dimensions]

### Teacher Guidance

[How to present these examples — what to point to, what questions to ask, how to draw students' attention to the variation]

### Assessment Check

[A task that tests whether students can now discern the critical feature — distinguishing cases that they previously confused]

**Self-check before returning output:** Verify that (a) the critical feature is clearly identified, (b) each phase uses the correct pattern of variation, (c) within each phase only the intended feature varies while others are held constant, (d) the sequence moves from contrast through separation and generalisation to fusion, (e) the examples are minimal — each differing from the last in a deliberate way, and (f) the assessment check tests discernment of the critical feature specifically.
```

## Example Output

**Scenario:** *Object of learning: "The difference between area and perimeter — students need to understand that these are two different measurements of a shape, not two words for the same thing" / Common confusion: "Students assume that if you make a shape bigger, both the area and the perimeter increase — they don't realise that you can change one without changing the other" / Student level: "Year 7, beginning of a geometry unit — students can calculate area and perimeter separately but confuse them conceptually" / Subject area: "Mathematics"*

---

## Variation Theory Task: Area vs. Perimeter

**Object of learning:** The distinction between area and perimeter — that they are independent measurements that can change independently of each other
**Critical feature:** Area and perimeter can vary independently — you can increase the perimeter while decreasing the area, or keep one constant while changing the other
**Common confusion:** Students believe area and perimeter are correlated — "bigger shape = bigger everything"

### Variation Analysis

Area and perimeter are both properties of a 2D shape, but they measure different things: area measures the space inside (square units), perimeter measures the distance around the edge (linear units). The critical feature students must discern is that these two measurements are INDEPENDENT — changing one does not necessarily change the other. This is counterintuitive because in everyday experience, "bigger" things tend to be bigger in every dimension. The task must make the independence visible by showing cases where one changes while the other doesn't — something students will never discover if every example they see has both area and perimeter increasing together.

The dimensions of variation are:
- **Area** (critical dimension 1): the space inside the shape
- **Perimeter** (critical dimension 2): the distance around the edge
- **Shape type** (irrelevant dimension): rectangle, L-shape, etc.
- **Orientation** (irrelevant dimension): rotated, reflected
- **Size of grid** (irrelevant dimension): visual presentation

### Task Sequence

(The areas and perimeters in these tables were worked out by hand. Teachers: draw each shape on squared paper and recount before class.)

**Phase 1 — Contrast (What IS area vs. what IS perimeter?)**

Present two identical rectangles (3 × 4 on squared paper). On Rectangle A, shade the inside squares in blue. On Rectangle B, highlight the outside edge in red.

| Shape | Blue (inside) | Red (edge) |
|---|---|---|
| Rectangle A (3 × 4) | 12 squares shaded | — |
| Rectangle B (3 × 4) | — | 14 units traced |

Ask: "Rectangle A shows 12. Rectangle B shows 14. They're the SAME shape — why are the numbers different?"

This contrast makes visible that area and perimeter are DIFFERENT measurements of the SAME shape. The shape is invariant; the measurement type varies.

**Phase 2 — Separation (Changing perimeter while area stays the same)**

Present four shapes, all made from exactly 12 square tiles (so area = 12 for all), but arranged differently:

| Shape | Arrangement | Area | Perimeter |
|---|---|---|---|
| Shape A | 3 × 4 rectangle | 12 | 14 |
| Shape B | 2 × 6 rectangle | 12 | 16 |
| Shape C | 1 × 12 rectangle | 12 | 26 |
| Shape D | L-shape (a 4 × 4 square with a 2 × 2 corner cut out) | 12 | 16 |

Ask: "Every shape has exactly 12 squares inside. But look at the perimeters. What's happening?"

This separates perimeter from area: area is INVARIANT (always 12), perimeter VARIES (14, 16, 26, 16). Students must confront the fact that same area does not mean same perimeter. The critical feature — independence — is isolated.

Then reverse: present four shapes all with perimeter = 16, but different areas:

| Shape | Arrangement | Perimeter | Area |
|---|---|---|---|
| Shape E | 4 × 4 square | 16 | 16 |
| Shape F | 2 × 6 rectangle | 16 | 12 |
| Shape G | 1 × 7 rectangle | 16 | 7 |
| Shape H | Staircase (rows of 5, 3 and 2 squares, lined up on the left) | 16 | 10 |

Ask: "Every shape has the same perimeter — 16 units around the edge. But look at the areas. What do you notice?"

This confirms the separation from the other direction: same perimeter does not mean same area.

**Phase 3 — Generalisation (Independence holds across shape types)**

Show that the independence of area and perimeter is not limited to rectangles:

| Shape | Type | Area | Perimeter |
|---|---|---|---|
| Shape I | Right triangle with sides 3 and 4 around the right angle | 6 | 12 |
| Shape J | Right triangle with sides 2 and 6 around the right angle | 6 | about 14.3 |
| Shape K | Rectangle 2 × 3 | 6 | 10 |
| Shape L | Rectangle 1 × 6 | 6 | 14 |

Ask: "These are different types of shapes, triangles and rectangles. They all have area 6. Do they all have the same perimeter?"

The critical feature (independence) is held constant — it is true for ALL shapes, not just rectangles. The surface feature (shape type) varies. This generalises the principle beyond the specific context of rectangles.

**Phase 4 — Fusion (Varying both area and perimeter simultaneously)**

Present a set of shapes where BOTH area and perimeter vary, and students must attend to both simultaneously:

| Shape | Area | Perimeter | Area bigger or smaller than Shape M? | Perimeter bigger or smaller than Shape M? |
|---|---|---|---|---|
| Shape M | 12 | 14 | — | — |
| Shape N | 8 | 18 | Smaller | Bigger |
| Shape O | 15 | 16 | Bigger | Bigger |
| Shape P | 10 | 14 | Smaller | Same |
| Shape Q | 6 | 14 | Smaller | Same |

Ask: "Look at Shape N compared to Shape M. The area is smaller but the perimeter is bigger. How is that possible? Can you draw Shape N?"

Then: "Shape P has a smaller area than Shape M but the SAME perimeter. Shape Q has an even smaller area but also the same perimeter. What does this tell us about the relationship between area and perimeter?"

This fuses both dimensions — students must track area and perimeter independently and recognise that all combinations are possible (bigger area with smaller perimeter, same area with different perimeters, etc.).

### Teacher Guidance

**How to present the sequence:**
1. Use squared paper or a grid displayed on the board. Make the shapes VISIBLE — don't just give numbers. Students need to SEE the area (shaded squares) and the perimeter (traced edge) simultaneously.
2. At each phase, present the examples SIDE BY SIDE, not one at a time. The power of variation comes from comparison — students must see the examples together to notice what changed and what stayed the same.
3. Ask "What's the same? What's different?" at EVERY transition. This is the fundamental variation theory question. Train students to look for the pattern of sameness and difference.
4. Do not explain the pattern — let students discover it. Present the examples, ask the question, wait. If students struggle, add another example that makes the pattern clearer. Do not tell them "area and perimeter are independent" before they have had the chance to see it.

**Key questions:**
- Phase 1: "They're the same shape. Why are the numbers different?"
- Phase 2: "The area is always 12. What happens to the perimeter?" / "The perimeter is always 16. What happens to the area?"
- Phase 3: "Does this work for all shapes, or just rectangles?"
- Phase 4: "Can you have a big area with a small perimeter? A small area with a big perimeter? Prove it with a drawing."

**Common student responses and how to respond:**
- "Bigger shapes have bigger perimeters" → Present Shape N (area 8, perimeter 18) next to Shape M (area 12, perimeter 14). "Is Shape N 'bigger'? Its area is smaller but its perimeter is bigger. What does 'bigger' mean here?"
- "You just add more squares to get more perimeter" → Present Shapes E and G (both perimeter 16, but areas 16 and 7). "Shape E has more squares but the same perimeter. Why?"

### Assessment Check

**The Independence Test:** Give students three pairs of statements and ask them to decide whether each is ALWAYS TRUE, SOMETIMES TRUE, or NEVER TRUE:

1. "If Shape X has a bigger area than Shape Y, then Shape X has a bigger perimeter than Shape Y." (Sometimes true — not always)
2. "Two shapes with the same area must have the same perimeter." (Never true — many counterexamples)
3. "You can change the perimeter of a shape without changing its area." (Always true — proven in Phase 2)

Then: "Draw two shapes that have the same area but different perimeters. Draw two shapes that have the same perimeter but different areas."

If students can do this, they have discerned the critical feature: area and perimeter are independent.

---

## Known Limitations

1. **Variation theory works best for well-defined concepts with identifiable critical features.** It is most powerful in mathematics and science where the features to be discerned are clear (area vs. perimeter, speed vs. velocity, addition vs. multiplication). It is harder to apply to open-ended, interpretive learning (literary analysis, creative writing) where the "critical features" are less discrete. The skill should not force variation theory onto learning objectives where other approaches are more appropriate.

2. **The theory was developed primarily in mathematics and science education contexts.** While the principles of discernment through variation are domain-general, the specific patterns (contrast, separation, generalisation, fusion) have been most thoroughly researched and validated in mathematics classrooms in Hong Kong, Sweden, and mainland China. Application to other subjects and cultural contexts should be thoughtful, not mechanical.

3. **Variation theory addresses one aspect of learning — discernment — not the whole picture.** Students also need motivation, practice, feedback, and application. A perfectly designed variation sequence will fail if students are not engaged, do not have sufficient prior knowledge, or do not practise sufficiently after discerning the concept. Variation theory is a powerful lens for task design, not a complete theory of instruction.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Flawed example writer](https://useaiblocks.com/skills/flawed-example-writer). It takes the lesson plan and plan.
- The [Skill transfer challenge writer](https://useaiblocks.com/skills/skill-transfer-challenge-writer). It takes the lesson plan.
- The [Lesson barrier spotter](https://useaiblocks.com/skills/lesson-barrier-spotter). It takes the lesson plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
