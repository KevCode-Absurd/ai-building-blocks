---
name: assessment-blueprint-and-mark-scheme
description: Builds fair quizzes, end-of-unit and end-of-course tests and marking rubrics from the client's own material. Starts with a blueprint of topics, question counts, formats and marks agreed before any item is written, then writes items tagged to a source section, a learner copy, an answer key with a reason for every option, mark schemes with mark points, rubrics with descriptors and examples per level, and CSV or Moodle GIFT import files. Use it when a teacher, trainer or assessor needs a test, a rubric two markers apply the same way, or a question bank for an LMS. Never copies real exam questions and never makes pass or fail decisions about named people. Imports into an LMS as hidden drafts with level 2 access and releases quizzes to named classes only with level 3.
---

# Assessment blueprint and mark scheme

## When to use

- A teacher needs an end-of-unit quiz or test with a mark scheme.
- A trainer needs an end-of-course test with a pass mark the client sets.
- A department wants a rubric for an essay, project, speech or practical that two markers apply the same way.
- A team is loading a question bank into Moodle, Google Forms, Microsoft Forms or another quiz tool.
- A placement test needs to sort learners into levels described in the client's own descriptors.

Do not use it for accredited exams that need official sign-off, to reproduce real or leaked exam papers, to take tests for anyone, or to decide pass or fail for named people. The teacher or assessor makes those decisions.

## Access needed

- **Level 1 (read):** the syllabus, notes, SOPs or textbook pages the test must cover; past quiz results with names removed.
- **Level 2 (read and draft):** import items into a hidden question bank category; build a hidden quiz.
- **Level 3 (read, write and publish):** release the agreed quiz to the named class on the agreed dates; enter marks the teacher approved. Changing released grades or deleting submissions needs a fresh yes.

## What you need

1. The material, and only that material. Items are written from it.
2. Purpose: check learning (formative), end of unit (summative), placement or certification of training.
3. Topics or outcomes, with weights if the course has them.
4. Count, formats (multiple choice, short answer, extended answer, practical), total marks, time allowed.
5. Learners: age, reading level, access needs described without names, and whether the test is timed online.
6. Output: printable, LMS import (CSV or GIFT), or both. Pass mark if the client sets one.

## Steps

### 1. Blueprint before items

A table: topic or outcome, weight, number of items, format, marks, thinking level (recall, apply, explain or judge). Match the client's weights within one question. Show the blueprint and wait for agreement before writing. If the material is too thin for the count, say so: "Twenty items from one page will repeat. I recommend twelve."

### 2. Write items from named sections

Each item comes from one section of the material, tagged in the key, for example [SOP 3.2] or [Textbook p. 41]. For multiple choice: one clearly right answer; three wrong options built from real mistakes; options of similar length and grammar; no "all of the above"; no double negatives; avoid "always" and "never" as giveaway words. For short answer: say how much is expected ("two reasons"). For extended answer: a clear command word and what a full answer covers.

### 3. Check for cueing

No item gives away another item's answer. No grammatical clue in the stem points to one option. Right answers are spread across positions.

### 4. Mark schemes

For each written item: a model answer, mark points that add up to the marks, what to accept, what to reject, and how to award partial credit. For levels-based items, a short descriptor per band.

### 5. Rubrics

3 to 5 criteria tied to the task's goal. Four levels with a plain descriptor in each cell and a short example of work at that level. Descriptors describe the work, not the learner. Marks per level add to the total. Then run a two-marker check: two people mark the same three samples and compare; rewrite any cell where they disagree.

### 6. Learner copy

Instructions first (time, marks, what to do), items numbered, marks shown per item, space to answer. For online tests, timers can be extended or turned off unless speed is what is being tested, and images have alt text.

### 7. Answer key

A table: item, answer, marks, reason, source tag, and a note on why each wrong option is wrong. List items you cut and why.

### 8. Import files

Build last, one row or entry per item, then check every row is complete. CSV columns follow the target tool's template. In Moodle GIFT, an item looks like `::Q1:: Stem {=right ~wrong ~wrong ~wrong}`; feedback follows `#`; special characters (`~ = # { } :`) inside text are escaped with a backslash. Import one item into a test category first and check how it displays.

### 9. Take it cold

Answer every item without the key. Any item with two defensible answers is rewritten or cut.

## Checks

- Blueprint agreed; counts and weights match.
- Every item is tagged to the client's material; nothing from outside it without a [check] note.
- One right answer per closed item; a reason and wrong-option notes in the key.
- Mark points add up to item marks; item marks add up to the total.
- Rubric descriptors are specific enough that two markers agree; each level has an example.
- No real exam questions; no named learners; no pass or fail decision about a person.
- Import file has the same number of items as the learner copy and opens without errors.
- Online version: adjustable timing, alt text and readable contrast.

## Output format

1. **Blueprint table** (agreed first).
2. **Learner copy**, numbered, marks shown.
3. **Answer key and mark scheme** table, with source tags and wrong-option notes.
4. **Rubric** grid, if asked, with examples per level and the two-marker check result.
5. **Import file** in a code block (CSV or GIFT), plus a readable copy.
6. **Weak spots:** the two items I trust least, and why.

## Example

*Made-up example: "Hearth & Crumb Bakery" is invented for illustration.*

**Blueprint (agreed):**

| Topic (SOP section) | Weight | Items | Format | Marks |
|---|---|---|---|---|
| Oven start-up checks (2) | 30% | 6 | MCQ | 6 |
| Hot surfaces and PPE (3) | 30% | 6 | MCQ | 6 |
| Cleaning schedule (4) | 25% | 5 | MCQ | 5 |
| What to do in a fault (5) | 15% | 3 | Short answer | 3 |

Pass mark 16 of 20, set by the client.

**Item 7 [SOP 3.2]:** Before cleaning the deck oven, what must be true?
A. The oven is switched off and below the temperature on the SOP label (key)
B. The oven door is open for five minutes
C. A supervisor is in the room
D. The cleaning cloth is damp

**Key note:** B is a step in SOP 3.3, after cooling, a common order mistake. C and D appear in the SOP but are not conditions for starting.

**GIFT:**

```text
::Q7:: Before cleaning the deck oven, what must be true? {=The oven is switched off and below the temperature on the SOP label ~The oven door is open for five minutes ~A supervisor is in the room ~The cleaning cloth is damp}
```

**Weak spot:** Item 12 leans on a temperature the SOP gives only on a label photo; confirm it with the kitchen manager.
