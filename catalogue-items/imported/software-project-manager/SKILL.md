---
name: project-management
description: "Manages software projects end-to-end — decomposing work into tasks, tracking progress across sprints, generating status reports, and integrating with tools like Jira, Linear, GitHub Issues, and Trello. Use when the user requests project management or provides relevant inputs for this workflow."
license: "MIT"
metadata:
  author: "awesome-ai-agent-skills contributors"
  version: "1.1.0"
---

# Project Management

This skill enables an AI agent to serve as a project management co-pilot for software teams. Beyond a plain prompt, it fixes a Fibonacci story point scale, work-in-progress limits for Kanban and a standard report layout, so plans and reports look the same every sprint. It covers the full lifecycle: breaking high-level goals into actionable tasks with acceptance criteria, estimating effort in story points, organizing work into sprints or Kanban boards, tracking progress with burndown data, identifying blockers and risks, and generating stakeholder-ready status reports. The agent integrates with Jira, Linear, GitHub Issues, and Trello so that all changes are reflected in the team's actual project tracker.

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

## Workflow

1. **Gather Project Context**
   Collect the project name, team roster (with roles and capacity), high-level goals, key deadlines, and the preferred methodology (Scrum, Kanban, or a hybrid). If a project tracker is already in use, connect to its API and import the current backlog, labels, and sprint configuration so the agent starts from the existing state rather than a blank slate.

2. **Decompose Work into Tasks**
   Break each high-level goal into epics, then into user stories, and finally into sub-tasks small enough to complete in one to two days. Write each user story in the standard format: "As a [role], I want [capability] so that [benefit]." Attach acceptance criteria as a checklist on every story. Identify dependencies between tasks and flag any that form a critical path. Assign story-point estimates using the Fibonacci scale (1, 2, 3, 5, 8, 13) based on complexity, uncertainty, and effort.

3. **Plan Sprints or Populate the Board**
   For Scrum teams, create a sprint with a start date, end date, and sprint goal. Pull stories from the top of the prioritized backlog until the team's velocity (the trailing three-sprint average of story points) is reached. For Kanban teams, enforce work-in-progress (WIP) limits per column and ensure the board columns match the team's workflow (e.g., Backlog → In Progress → Review → Done). Push the plan to the connected project tracker via its API.

4. **Track Progress and Surface Blockers**
   Poll the project tracker on a configurable interval (default: daily). Calculate burndown and cumulative-flow metrics. Detect when a task has been "In Progress" longer than its estimate and flag it as at risk. Identify dependency chains where a blocked upstream task is stalling downstream work. Post a daily digest to the team's Slack or Teams channel summarizing completed items, in-progress items, and blockers.

5. **Manage Risks and Dependencies**
   Maintain a risk register with each entry containing a description, likelihood (low/medium/high), impact (low/medium/high), an assigned owner, and a mitigation plan. When a new risk is identified — such as a team member going on leave or a third-party API deprecation — add it to the register and notify the project lead. Track cross-team dependencies by linking external issues and alerting when their status changes.

6. **Generate Status Reports**
   Produce sprint review or weekly status reports in Markdown (or export to PDF/Confluence). Each report includes: sprint goal and whether it was met, completed stories with their point total, stories carried over, burndown chart data, velocity trend over the last five sprints (for the report only; plan capacity from the trailing three-sprint average), top risks, and action items for the next period. Tailor the level of detail to the audience — executives get a one-page summary, the team gets the full breakdown. If no tracker is connected and the user has not given sprint figures, ask for the data first (points done, points carried over, velocity, risks). Never invent burndown, velocity or risk figures; mark any number you could not get as a placeholder, such as `[POINTS DONE]`.

## Usage

Provide the agent with your project details and what you need. The agent adapts to your methodology and tooling.

Tracker and Slack or Teams sync need your own account and an access key, and some plans may cost money. Without them, the plan comes back as text to copy into your tracker.

```
"Create a sprint plan for the TaskMaster mobile app. We're a team of 4 with a velocity of 34 points. Sprint starts Monday and runs two weeks. Pull from the existing backlog in Linear."
```

```
"Generate a weekly status report for Project Atlas. Include burndown, completed items, and open risks."
```

```
"Break down this feature into user stories with acceptance criteria: 'Users should be able to export their data in CSV and JSON formats.'"
```

```
"Add a risk to the register: 'Payment provider is deprecating API v2 on March 1. We need to migrate to v3.'"
```

## Examples

Both examples use invented data for illustration. The "pushed to Linear" and Slack lines happen only when the agent has access to a tracker or Slack. Without it, hand back the plan as text.

### Example 1 — Creating a Sprint Plan with User Stories

**User input:**
```
"Plan sprint 12 for the Lumen project. Sprint goal: launch the notifications feature. Team: Alice (frontend, 8 pts capacity), Bob (backend, 10 pts), Carol (fullstack, 8 pts). Two-week sprint starting Feb 17."
```

**Agent output:**
```
## Sprint 12 — Lumen
**Goal:** Launch the notifications feature
**Dates:** Feb 17 – Feb 28, 2025
**Team capacity:** 26 story points

### Selected Stories (24 pts of 26 capacity)

| ID     | Story                                              | Points | Assignee | Depends On |
|--------|-----------------------------------------------------|--------|----------|------------|
| LUM-41 | As a user, I want to receive in-app notifications    | 5      | Alice    | —          |
| LUM-43 | As a user, I want to configure notification prefs    | 3      | Alice    | LUM-41     |
| LUM-42 | As a user, I want to receive push notifications      | 8      | Bob      | LUM-41     |
| LUM-44 | Build notification service with WebSocket delivery   | 8      | Carol    | —          |

Load per person: Alice 8 of 8, Bob 8 of 10, Carol 8 of 8. Held back for the next sprint: LUM-45 (history page, 5 pts) and LUM-46 (integration tests, 3 pts), because they would push Carol over her capacity.

### Acceptance Criteria (example — LUM-42)
- [ ] Push notification is delivered to iOS and Android within 5 seconds
- [ ] Notification payload includes title, body, and deep-link URL
- [ ] Notifications respect the user's quiet-hours setting
- [ ] Failed deliveries are retried up to 3 times with exponential backoff

### Dependencies
  LUM-42 → LUM-41 (push requires in-app infrastructure)
  LUM-43 → LUM-41 (preferences build on the in-app screen)

[Only with tracker and Slack access: sprint pushed to Linear, Slack channel notified.]
[Without access: copy these stories into your tracker.]
```

### Example 2 — Generating a Project Status Report with Burndown Data

**User input:**
```
"Generate the sprint 11 retrospective report for Project Atlas. We use GitHub Issues."
```

**Agent output:**
````
## Project Atlas — Sprint 11 Status Report
**Sprint dates:** Feb 3 – Feb 14, 2025
**Sprint goal:** Complete user profile redesign — ✅ Met

### Summary
- **Planned:** 30 story points across 9 stories
- **Completed:** 28 story points (8 stories)
- **Carried over:** 1 story (ATLAS-87, 2 pts — blocked by design review)

### Burndown Data

| Day       | Ideal Remaining | Actual Remaining |
|-----------|-----------------|------------------|
| Feb 3     | 30              | 30               |
| Feb 4     | 27              | 28               |
| Feb 5     | 24              | 25               |
| Feb 6     | 21              | 22               |
| Feb 7     | 18              | 18               |
| Feb 10    | 15              | 14               |
| Feb 11    | 12              | 10               |
| Feb 12    | 9               | 6                |
| Feb 13    | 6               | 4                |
| Feb 14    | 0               | 2                |

### Velocity Trend (last 5 sprints)
  Sprint 7: 24 pts | Sprint 8: 28 pts | Sprint 9: 26 pts | Sprint 10: 30 pts | Sprint 11: 28 pts
  **Average velocity:** 27.2 pts

### Open Risks
| Risk                                  | Likelihood | Impact | Owner  | Mitigation                        |
|---------------------------------------|------------|--------|--------|-----------------------------------|
| Design system migration incomplete    | Medium     | High   | Alice  | Parallel-run old and new systems  |
| Third-party image CDN latency spikes  | Low        | Medium | Bob    | Add fallback CDN configuration    |

### Action Items
1. Complete design review for ATLAS-87 by Feb 17 (owner: Carol)
2. Schedule performance testing for new profile page (owner: Bob)
3. Update onboarding docs to reflect profile redesign (owner: Alice)
````

## Best Practices

- **Keep stories small and testable.** Any story estimated above 8 points should be split. Large stories hide complexity and make progress tracking unreliable.
- **Write acceptance criteria before development begins.** Criteria remove ambiguity, serve as the basis for test cases, and give the team a shared definition of "done."
- **Respect velocity — do not overcommit.** Use the team's trailing three-sprint average as the capacity ceiling. Overloaded sprints lead to carryover and demoralize the team.
- **Make blockers visible immediately.** Surface blocked tasks in daily digests and tag the person who can unblock them. A blocker that sits unreported for days is a silent schedule risk.
- **Maintain a living risk register.** Review risks at every sprint planning meeting. Close risks that are no longer relevant and add new ones as they emerge. A stale risk register provides false confidence.
- **Automate report generation.** Manually assembling status reports is error-prone and time-consuming. Use the agent to pull data directly from the project tracker so reports are always accurate and consistent.

## Edge Cases

- **Empty backlog.** If no stories exist when a sprint plan is requested, prompt the user to create or import stories before planning. Do not create a sprint with zero items.
- **Team member at zero capacity.** If a team member is on leave for the entire sprint, exclude them from assignment but keep them listed as a reviewer or stakeholder if applicable. Adjust total capacity accordingly.
- **Circular dependencies.** If task A depends on B and B depends on A, flag the cycle and ask the user to resolve it before planning proceeds. Never silently schedule mutually blocking tasks.
- **Tracker API outage.** If the project tracker API is unreachable, generate the plan in Markdown locally and queue the sync for when the API recovers. Inform the user that changes are saved locally but not yet pushed.
- **Mid-sprint scope changes.** If a new high-priority item is added mid-sprint, warn the user about the impact on the sprint goal and suggest which existing item to deprioritize to make room. Log the scope change in the sprint report.
- **Cross-project dependencies.** When a task depends on work owned by another team or project, create a linked external reference and set up a webhook or polling check to notify the team when the dependency is resolved.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Project risk portfolio planner](https://useaiblocks.com/skills/project-risk-portfolio). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
