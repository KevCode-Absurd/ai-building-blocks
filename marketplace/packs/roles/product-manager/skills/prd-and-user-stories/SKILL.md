---
name: prd-and-user-stories
description: Writes a product requirements document (PRD) for one feature and the user stories the team builds from - problem and evidence, users, goals with success and guardrail metrics, scope (in, out, later), stories with numbered pass-or-fail acceptance criteria checked against INVEST, edge cases, risks and open questions with owners, rollout and rollback, and a launch checklist. Can file the stories in Jira, Linear or GitHub at the access level granted. Use when a scoped feature needs a spec, when meeting notes need turning into stories, or when a team keeps building something other than what was meant.
---

# PRD and user stories

A good spec lets the team build the right thing without a meeting to explain it, and lets a tester say pass or fail. It is short, it says what is out as clearly as what is in, and its acceptance criteria are written before the build starts.

## When to use

- A feature has passed discovery and has an agreed scope.
- Meeting notes or a request need turning into stories.
- The team asks "what does done mean?"
- Before filing issues in Jira, Linear or GitHub.

## What you need

- The problem brief and scope (see discovery-and-first-version-scope).
- Designs or sketches, if any (Figma links are fine).
- The goal and how it will be measured.
- Known constraints: tech, legal, data, deadlines the team agreed.
- **Access I have** per tool: level 1 to read existing issues and docs; level 2 to draft the PRD page and unassigned backlog issues; level 3 to create, assign and schedule issues in the agreed project, within the limits.

## Steps

1. **Restate the problem and evidence** in three to five lines, with sources. Link the brief.
2. **Name the users** and the situation they are in when they need this.
3. **Set goals and measures.** One success metric tied to the goal, with a target and how it is measured; one or two guardrail metrics that must not get worse. Choose them goals-first: goal, then the user behaviour that signals success, then the metric (HEART). Report per user where totals would mislead.
4. **Write scope:** in, out and later, each with a one-line reason. Out-of-scope items prevent quiet creep.
5. **Write the stories.** Use "As a [type of user], I want [action], so that [result]" when it helps; use a plain statement when it reads better. Keep each story small enough to finish in one sprint; group bigger ones under an epic.
6. **Write acceptance criteria for each story,** numbered, each one pass or fail, in a Given / When / Then form or a plain checklist. Cover the main path, empty states, errors, permissions and limits.
7. **Check each story against INVEST:** Independent, Negotiable, Valuable, Estimable, Small, Testable. Rewrite any that fail; untestable stories are not ready.
8. **List edge cases and risks,** and open questions with the person who must answer each.
9. **Note data and AI points.** If the feature uses personal data, note the purpose and flag a privacy check; if it profiles or evaluates people, flag a data protection impact assessment. If it uses AI, run the ai-feature-responsible-launch skill.
10. **Plan rollout and rollback:** who gets it first (staff, a small share of users, everyone), behind a feature flag if available, what is watched, and how to switch it off.
11. **Write the launch checklist:** help text, support briefing, tracking events firing, pages updated, privacy notice if data changes, rollback tested.
12. **File the work.**
    - Level 1: give the stories as text the team can paste.
    - Level 2: create the PRD as a draft page and the stories as unassigned backlog issues, linked to the epic. Log each.
    - Level 3: create and assign issues to the people and sprint or cycle agreed, within the limits; post a short note in the agreed channel. Ask again before notifying anyone outside the agreed list.

## Checks

- Problem and evidence first; assumptions labelled.
- One success metric with a target, and at least one guardrail.
- Every story has numbered, testable acceptance criteria.
- Every story passes INVEST or is marked "not ready" with the reason.
- Out of scope is written down.
- Rollback is possible and named.
- No dates unless the team agreed them.

## Output format

1. **Access I have.**
2. **PRD:** problem and evidence; users; goals and metrics; scope (in, out, later); stories with acceptance criteria; edge cases; risks and open questions (owner each); data and AI notes; rollout and rollback; launch checklist.
3. **Story list** ready to file, with epic and labels.
4. **Action log** of anything created in tools.

## Example of good output (short)

*Illustrative structure, not a real business: a physio clinic whose customers should be able to reschedule their own bookings in the clinic's web app; five staff handle reschedule calls today. Copy the shape, never the content: every fact comes from the client's own context.*

**Goal:** fewer reschedule calls. **Success metric:** reschedules done online as a share of all reschedules, per week (target set with the clinic after two weeks of baseline). **Guardrail:** no-show rate does not rise.

**Scope:** In: reschedule to another open slot with the same therapist, up to 24 hours before. Out: changing therapist (later), cancelling with refund (out: needs a policy decision).

**Story 1:** As a patient with a booking, I want to move it to another open slot with the same therapist, so that I don't have to call.

Acceptance criteria:
1. Given a booking more than 24 hours away, when I choose "Reschedule", I see only open slots for the same therapist.
2. When I pick a slot and confirm, the old slot is released and the new one is booked, and I get a confirmation email.
3. Given a booking less than 24 hours away, "Reschedule" is not shown and I see the clinic's phone number.
4. If the slot is taken while I am confirming, I see "That time was just taken" and the list refreshes.

**INVEST:** passes. **Open question:** does the 24-hour rule apply to first appointments? Owner: clinic manager.
