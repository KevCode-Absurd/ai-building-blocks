# Build an e-learning module, from source material to launch

**Trigger:** A client needs a self-paced module from an SOP, policy, slide deck or expert notes, for staff or customers, delivered through an LMS.

**Cadence:** Runs once per module. Typical rhythm: outline sign-off, storyboard sign-off, build, test, pilot, launch, then a review after the first month of learner data.

**Access:** At the start, ask which level the client grants for the documents, authoring tool, LMS and SCORM Cloud, and the limits; record them under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Without that level, the output comes back as files and text for the client's developer.

## Steps

1. **Intake.** Confirm the learners, the device, the time per module, the source material and its version, the subject expert who confirms facts, and who signs off safety or legal content. Ask which package type the LMS accepts.
2. **Outline.** Run the `course-outline-backward-design` skill: result sentence, goals as actions, evidence, practice, minutes per lesson, accessibility notes. *Approval: the client approves the outline.*
3. **Checks first.** Run the `knowledge-check-writer` prompt for every goal, from the source material, with feedback for each option.
4. **Storyboard.** Run the `elearning-storyboard` skill: screen table, practice every few screens, build notes. Where a goal is a judgement or conversation, add a scenario with the `branching-scenario-script` skill. Where a task is best shown, add a clip with the `training-video-script-and-captions` skill.
5. **Expert review.** Send the storyboard and checks to the subject expert with every [confirm with your team] item listed. *Approval: the expert confirms facts; the client's qualified person signs off any safety or legal content.*
6. **Accessibility review of the storyboard.** Run the `accessibility-review-of-a-module` prompt and fix high-severity items before building.
7. **Build.** [L2] Build the draft module in the authoring tool, or hand the storyboard and build notes to the client's developer.
8. **Package and test.** Run the `choose-and-test-the-lms-package` prompt. [L2] Publish a test package and upload it to SCORM Cloud; then test with a test learner in the client's LMS: launch, resume, completion, score, retake, keyboard and screen reader.
9. **Pilot.** A small group of real learners takes it. Collect where they got stuck, check results by question, and time taken. Fix confusing screens and weak distractors. *Approval: the client approves the final version.*
10. **Confirm the live action list.** [L3] Show the actions and limits: which LMS area, which audience, assignment dates, whether an older version with learner records is replaced. *Approval: the client's yes.* Replacing a live module with learner records needs its own yes.
11. **Launch and log.** [L3] Publish and assign within the limits. Log every action.
12. **First-month review.** Read completion, drop-off screens and question results. Rewrite screens where many learners drop off and questions most people get wrong for the wrong reason. *Approval: the client approves changes to a live module.*

## Outputs

- Approved outline and knowledge checks
- Storyboard with build notes, scenario and video scripts where used
- Accessibility review and fixes
- Test package, test results and the settings used
- Pilot notes and final version
- Launch action log and first-month review

## Needs the client's approval

The outline, expert sign-off of facts and of any safety or legal content, the final version after the pilot, the level 3 action list and limits, replacing any live module that holds learner records, and any later change to a live module. Whether accessibility laws apply to the client is a question for their lawyer or an accessibility specialist.
