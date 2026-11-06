# Exam countdown, from course material to exam day

**Trigger:** A learner (or a parent, teacher or training provider for them) has a fixed exam date and a pile of course material. Runs once per exam, from the first session to exam day.

**Cadence:** Set-up in the first session; short sessions on the planned days; a check-in each week to adjust the plan from practice scores.

**Access:** At the start, ask which level the client grants for the course folder, the calendar, the class tool and any messaging tool, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Without that level, the output comes back as files and text.

## Steps

1. **Agree the ground rules.** Confirm what the exam is, which material to use, and that nothing produced will be handed in for a mark. Run the `integrity-check-before-helping` prompt for any task that might be marked. If the learner is under 18, record the safeguarding set-up: the adult I report to, parental consent, the safeguarding contact, and what is logged. *Approval: the learner, or the parent for a child, confirms the ground rules.*
2. **Read and map the material.** Run `revision-notes-and-plan`, steps 1 to 3: topics in course order, weights, gaps marked [not in your notes].
3. **Make the notes.** Same skill, steps 4 to 6: revision notes with self-tests, a summary sheet and a glossary. [L2] Save them in the learner's folder.
4. **Build the deck.** Run `flashcard-deck-builder` for the facts, terms and formulas worth memorising. [L2] Save the import file; the learner imports it into Anki or Quizlet.
5. **Set a baseline.** Run `practice-exam-builder` for a first practice test weighted by the outline. The learner sits it without notes and returns the answers.
6. **Plan to the exam.** Run the `study-plan-from-practice-scores` prompt on the baseline. [L2] Draft the sessions in the calendar. *Approval: the learner (or parent) approves the plan.*
7. **Confirm the live action list.** [L3] Show the actions and limits: which calendar, which folder, which reminders, whether a class quiz is posted (practice only), for how long. *Approval: the client's yes.*
8. **Run the sessions.** Each session: a short self-test on earlier topics, new work in small steps, practice with a high success rate, and a few questions to finish. When the learner is stuck, use the `hint-ladder` prompt. [L3] Keep the calendar up to date and send agreed reminders.
9. **Check in weekly.** Review practice scores and the deck's review history if the learner shares it. Adjust the plan: more time on weak topics, less on mastered ones. Note any sign of stress or distress and follow the safeguarding route if needed.
10. **Final practice.** A second full practice exam near the end, then a review of every wrong answer with the reason. Keep the last day light.
11. **Close.** After the exam, share the action log and a short note on what worked for next time.

## Outputs

- Ground rules and safeguarding record
- Revision notes, summary sheet, glossary
- Flashcard import files and import steps
- Baseline and final practice exams with answer keys and score guides
- Day-by-day plan, updated weekly
- Action log of every live change

## Needs the client's approval

The ground rules (material, what is marked, safeguarding set-up), the study plan, the level 3 action list and limits, and anything outside them: contacting the learner directly for the first time, a new group of learners, anything that counts towards a mark (never done), or deleting files. Check this with local rules on safeguarding and data where the learner lives.
