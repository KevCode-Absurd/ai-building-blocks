---
name: usability-review
description: Reviews one page, screen or flow as a named type of user, step by step, against Nielsen's ten usability heuristics and the key WCAG 2.2 checks, then ranks each problem by severity (0 to 4) and turns the top ones into fixes with a way to confirm each worked. Use it before user testing, before a redesign is built, or when a flow loses people and nobody knows why. It finds likely problems; it does not prove behaviour, so it ends with what to test with real users.
---

# Usability review

## When to use

- A sign-up, checkout, booking or onboarding flow loses people and the team does not know where or why.
- A prototype is about to go to user testing and you want to remove the obvious problems first, so the test finds the deeper ones.
- A redesign is about to be built and nobody has walked it as a user.
- A client wants a quick, cheap read before paying for research.

Do not use it to claim what users do. A review predicts likely problems. Watching five people per round shows real behaviour [knowledge.md, section 3]. Do not review screens you cannot see: ask for screenshots, a prototype link or a live URL.

## What you need

1. **The flow:** screenshots in order, a prototype link, or a live URL, plus the start and end point.
2. **Who the user is:** one to three user types from the client's notes (for example "first-time customer on a phone", "returning admin on a laptop"). Never invent a persona with made-up quotes; describe the user by task and context only.
3. **The task and success:** what the user is trying to get done, and what "done" means.
4. **Known pain:** analytics drop-off points, support tickets, complaints, session notes, if any.
5. **Constraints:** platform (web, iOS, Android), brand rules, legal text that cannot change.
6. **Access I have:** the level the client grants in each tool (1 read, 2 read and draft, 3 read, write and publish). This skill needs level 1 only: viewing the design, prototype or live site. Until the client answers, work at level 1.

## Steps

1. **Write the task as the user would say it.** One sentence, in their words: "I want to book a 30-minute appointment for Thursday." List the steps the flow expects, from entry to success.
2. **Walk each step as each user type.** At each step write three things: what they see, what they expect to happen, what they would do next. Note any moment where the expected and actual next step differ. That gap is where people get lost.
3. **Check against the ten heuristics** [knowledge.md, section 2]. For each step ask: Does the screen show what is happening? Are the words the user's words? Can they go back or undo? Is it consistent with the rest of the product and with platform norms? Does it prevent errors before they happen? Can they see options rather than remember them? Is there a faster path for repeat users? Is anything on screen that does not help this step? Do errors say what happened and how to fix it? Is help there when needed?
4. **Run the key accessibility checks** on each screen. Text contrast at least 4.5:1 (3:1 for large text). Visible labels on every field. Errors not shown by colour alone. Focus visible and not hidden behind sticky headers. Tap targets at least the platform size (44 by 44 points on Apple, 48 by 48 dp on Android, never below 24 by 24 CSS pixels on the web unless an exception applies). No memory or puzzle test at sign-in without an alternative, and paste allowed in password fields. Link text that makes sense alone. Mark anything you cannot check from screenshots (keyboard order, screen reader output) as "test with assistive technology".
5. **Check for deceptive design.** Hidden or hard-to-find cancel, pre-ticked consent or add-ons, fake urgency, confirm-shaming, costs added late. Flag each one plainly.
6. **Log every problem in one table.** Location (screen and element), what happens, which user type it hurts, which heuristic or check it breaks, and evidence (what you saw, or the analytics or ticket it matches).
7. **Rate severity.** For each problem judge how often people will meet it, how badly it hurts when they do, and whether they keep meeting it. Score 0 to 4: 0 not a problem, 1 cosmetic, 2 minor, 3 major, 4 catastrophe that blocks the task. Say in one line why you chose the score. If a second reviewer is available, rate separately and compare.
8. **Write fixes for every problem rated 3 or 4.** One or two sentences each, specific enough to build ("Move the 'Apply code' link under the order total and make it a 44-point-high button"), plus how to confirm it worked (a test task, an analytics event to watch, a support tag to count).
9. **Turn fixes into tasks.** Owner role (designer, developer, writer), effort (small, medium, large) and done-when.
10. **List what to test with real users.** The three to five questions this review could not answer, phrased as test tasks.
11. **Apply changes only at the right level.** Level 1: hand over the report. Level 2: with access to the design tool, add the fixes to a copy of the file or as comments, and name where they are; with access to the issue tracker, prepare the tasks as a draft list or import file for the client to add. Level 3: after the client confirms the list of actions and limits (which file or project, which kinds of change), create the tickets or update the shared design, and log each action.

## Checks

- Every problem has a location, evidence and a severity with a reason.
- Nothing is stated as user behaviour unless it came from sessions or analytics; review judgements are labelled "likely".
- Accessibility items that need a keyboard or screen reader test are marked, not guessed.
- Every fix for a severity 3 or 4 problem has a way to confirm it worked.
- No invented personas, quotes, numbers or business rules.
- Any level 2 or 3 action is in the action log.

## Output format

1. Scope: flow, user types, task, success, sources used, access level.
2. Step-by-step walkthrough (see, expect, do) per user type.
3. Problem table: number, location, problem, who it hurts, rule broken, evidence, severity and reason.
4. Top fixes: fix, owner role, effort, done-when, how to confirm.
5. What to test with real users.
6. Action log (if any level 2 or 3 work).

## Example of good output (short)

*Lark & Loaf is a made-up bakery used only to show the format: a mobile pre-order flow for collection. User type: first-time customer on a phone. Access I have: level 1 (prototype link).*

| # | Location | Problem | Who it hurts | Rule | Evidence | Severity |
|---|---|---|---|---|---|---|
| 1 | Step 3, collection time | Time slots are grey text on beige; past slots look the same as open ones | Everyone; worse in sunlight | Contrast; system status | Measured about 2.6:1 | 3: most users meet it, and picking a closed slot fails at payment |
| 2 | Step 4, payment | "Create an account" is required before paying | First-time customers | User control; error prevention | No guest option visible | 4: blocks the task for anyone unwilling to sign up |
| 3 | Basket | "Remove" is a 16 px icon | Phone users | Target size | 16 x 16 px, no spacing | 2: annoying, recoverable |

**Fix 2:** add "Continue as guest" above "Create an account" and ask for an email only for the receipt. Owner: designer and developer. Effort: medium. Done when a guest can pay without a password. Confirm: test task "Order two loaves for Saturday without making an account"; watch checkout completion for two weeks.
