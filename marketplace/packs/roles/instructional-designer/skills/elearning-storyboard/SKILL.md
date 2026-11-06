---
name: elearning-storyboard
description: Writes a screen-by-screen e-learning storyboard a developer can build from in Rise, Storyline, Captivate or an LMS - numbered screens with on-screen text, narration, visual, interaction, feedback and build notes; practice every few screens; knowledge checks tied to each goal with feedback for right and wrong answers; accessibility notes for WCAG 2.2 AA (captions, alt text, keyboard, contrast, target size, drag alternatives, timing); and a packaging and test plan (SCORM 1.2, SCORM 2004, xAPI or cmi5, tested in SCORM Cloud and the client's LMS). Use it to turn an outline, SOP, policy or slide deck into an interactive module. Builds draft content in the client's authoring tool or LMS only with level 2 access, and publishes only with level 3.
---

# E-learning storyboard

## When to use

- An agreed outline or a piece of source material (SOP, policy, slide deck, help article) needs to become a self-paced module.
- A slide deck is being "converted to e-learning" and risks becoming a page-turner.
- A developer or the client will build the module and needs a clear plan.

Do not use it for regulated or safety-critical training without the client's expert signing off every rule and warning, or to publish a course without the client's OK at the right access level.

## Access needed

- **Level 1 (read):** source material, outline, brand and template rules, the LMS's supported standards, past module reports.
- **Level 2 (read and draft):** build the module as a draft in the client's authoring tool or LMS; export a test package; upload it to a test area such as SCORM Cloud.
- **Level 3 (read, write and publish):** publish the approved module to the client's LMS and assign it to the agreed audience within the limits set. Replacing a live module that already has learner records, or deleting one, needs a new yes. Log every action.

## What you need

1. The approved outline or goals (or run the `course-outline-backward-design` skill first).
2. The source material, with its version date.
3. Learners, their device, and the time per module.
4. The authoring tool and LMS, and the package standard the LMS supports.
5. Brand or template rules, and whether narration will be recorded.
6. Who confirms facts (subject expert) and who signs off safety or legal content.

## Steps

### 1. Map goals to the source

For each goal, find the part of the material that teaches it. Anything the goal needs that is not in the material: mark [confirm with your team].

### 2. Write the checks first

For each goal, write the knowledge check: a scenario or task question with one best answer, plausible distractors from real mistakes, options of similar length, and feedback for every option that says why. Avoid "all of the above".

### 3. Plan the flow

Hook (a realistic problem), short teach, worked example, practice, feedback, check. Put a practice moment at least every three screens. Long reference text goes into a downloadable resource, not onto screens.

### 4. Write the storyboard

One row per screen:

| # | On-screen text | Narration | Visual | Interaction | Feedback | Build notes |

- On-screen text: short, ideally under 60 words, readable on a phone.
- Narration: written to be read aloud; never word-for-word the same as long on-screen text. Time it by reading aloud.
- Visual: what it shows and why; alt text for informative images, "decorative" for the rest.
- Interaction: click, tab, accordion, scenario choice, text entry. If you plan a drag-and-drop, add a click or keyboard alternative.
- Feedback: for every choice, what happened and why.
- Build notes: layout, triggers, focus order, what is a button.

### 5. Add the accessibility plan

Against WCAG 2.2 AA, note per module: captions and a transcript for any audio or video; audio description, or visual information written into the narration; alt text; colour contrast of at least 4.5:1 for normal text; everything usable by keyboard with visible focus that is not hidden by fixed bars; click targets of at least 24 by 24 CSS pixels; no drag-only interactions; time limits that can be turned off or extended; no colour-only cues; and no re-entering answers already given.

### 6. Plan packaging and testing

Confirm with the LMS admin which standard and version to publish (SCORM 1.2 if unsure, as it is the most widely supported; SCORM 2004, xAPI or cmi5 if the LMS supports them and the client needs their tracking). Set what counts as complete (slides viewed, quiz passed, or both) and the pass mark the client confirms. Test the package in SCORM Cloud, then with a test learner in the client's LMS: launch, bookmark and resume, completion, score, and a screen reader and keyboard pass.

### 7. Final check against the source

Every rule, step and term matches the source and its order. Warnings stay word for word. Timings fit the minutes given.

## Checks

- Every goal has a check, and every check has practice before it.
- Practice at least every three screens.
- Feedback explains why for every option.
- On-screen text is short and plain; narration timed.
- WCAG 2.2 AA items are covered in the build notes.
- Completion rule, pass mark and package standard confirmed with the client.
- Tested in SCORM Cloud and the client's LMS before launch.
- At level 2 or 3, only the named module was changed, and the log is updated.

## Output format

1. Cover: module title, goals, time, source version, tool, package standard, approvers.
2. Storyboard table.
3. Knowledge checks with feedback.
4. Accessibility plan.
5. Packaging and test checklist.
6. Confirm with your team.

## Example of good output (short)

*Made-up business for illustration: Pellow Energy call centre, 20-minute Rise module "Take a meter reading by phone", SOP v4.*

> | # | On-screen text | Narration | Visual | Interaction | Feedback | Build notes |
> |---|---|---|---|---|---|---|
> | 6 | "A customer reads you 48213. Last month was 49002. What do you do?" | "Readings go up, not down. Here's one that went down." | Meter photo; alt: "Electric meter showing 48213" | Choose one of three replies | A: "Right. A lower reading usually means a misread digit, so you ask them to read it again, slowly." B and C: why not | Scenario block; options as buttons, keyboard reachable |
>
> **Check for goal 3:** "The customer's reading is lower than last month. What is your first step?" Best answer: ask them to read each digit again. Distractor: "log it and flag for review" (a real habit the SOP says to avoid, section 4.2).
>
> **Package:** SCORM 1.2 confirmed with your LMS admin; complete when the quiz is passed at the pass mark you confirm; test in SCORM Cloud, then a test learner in your LMS.
