# Test a flow before it is built

**Trigger:** a new or redesigned flow (sign-up, booking, checkout, onboarding) is about to go to development, or a live flow is losing people. Usually two to four weeks of elapsed time, most of it recruiting and running sessions.

## Steps

1. **Intake and access (access.md questions).** Confirm the flow, the user group, the task, what success means and the deadline. Ask which access level the client grants in each tool (design tool, prototype, research tool, analytics, issue tracker) and record it as "Access I have". Until they answer, work at level 1.
2. **Spec the flow (skill: text-wireframe-spec).** If there is no spec yet, write the screen list, flow map and every state. Level 1; level 2 if the client wants draft frames in their design tool.
   **Approval point 1:** the client agrees the spec, including open questions and who answers them.
3. **Fix the words (skill: interface-microcopy).** Buttons, labels, errors and empty states for the flow, with a term list. Level 1.
4. **Review before testing (skill: usability-review).** Walk the flow as the user, rank problems by severity, fix the obvious ones so the test finds deeper problems. Run the accessibility-quick-check prompt on each screen. Level 1.
5. **Plan the test (prompt: usability-test-plan).** Research question, screener, three to five tasks, script, note grid. If the flow touches sign-up, payments or cancellation, also run the deceptive-design-check prompt.
   **Approval point 2:** the client approves the plan, the screener, the consent wording and any participant incentives or panel spend.
6. **Recruit and run the sessions.** The client or their team recruits and runs moderated sessions; I can sit in as note-taker if they share a recording or notes.
   - Level 2: build an unmoderated version in the client's research tool as an unlaunched draft.
   - Level 3: after the client confirms the action list and limits (which study, which audience, panel budget cap, dates), launch the unmoderated study and log it. Ask again before spending above the cap or sending to a new audience.
7. **Read the results (prompt: session-notes-to-findings).** Task results as counts, findings with quotes from the notes, severity, fixes and a retest plan.
8. **Hand over fixes.**
   - Level 1: deliver the fix list.
   - Level 2: add fixes as comments or in a copy of the design file; prepare tickets as a draft list or import file.
   - Level 3: create tickets in the agreed project, or update the shared design file, within the client's limits; log each action.
   **Approval point 3:** the client decides which fixes go into the build.
9. **Retest.** A second small round on the changed screens, using the same tasks where possible.

## Outputs

- Wireframe spec with every state, and microcopy table with a term list.
- Pre-test review with severity-ranked problems and accessibility notes.
- Test plan: question, screener, tasks, script, note grid, consent wording.
- Findings report with task counts, quotes, severity, fixes and a retest plan.
- Tickets or design comments (level 2 or 3), and an action log of every change made in the client's tools.

## Needs the client's approval

- The access level for each tool, and the limits for level 3 (projects, studies, audiences, panel budget cap, dates).
- The spec and its open questions (point 1).
- The test plan, screener, consent wording and any spend on incentives or panels (point 2).
- Which fixes are built (point 3).
- Anything involving children, health, money or other sensitive topics, before recruiting.
- Anything outside the level 3 limits, asked again each time.
