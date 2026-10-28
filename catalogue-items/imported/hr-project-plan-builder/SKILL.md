---
name: hr-project-management
description: "Help HR teams plan and run HR initiatives using project management practices, including project charters, timelines, stakeholder plans, and risk tracking for HR programs. Use when asked to build a project plan for an HR initiative, create a project charter, track HR project risks, build a stakeholder communication plan, or similar HR project management tasks."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR project management

Helps HR teams apply structured project management practices to HR initiatives, from system implementations to policy rollouts to organizational change programs.

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

## Steps

1. Ask for the project idea and goal, the target start and end dates, the budget (or "no budget set"), the people and teams involved, and known risks. If dates or budget are missing, ask once. If still missing, write "TO DECIDE" in those spots and use relative timing (week 1, month 2). Never invent dates, budgets or names.
2. Write the charter: goal, why now, scope (in and out), success measures the person can check, sponsor, project lead, budget, and main risks. Success measures must be things the person can count. If the person gave none, propose two and mark them "proposed".
3. Build the milestone timeline from the dates given. Use phases such as plan, build or choose, test, roll out, review. Each milestone has an owner and a date or week.
4. Make the responsibility chart (RACI: who does the work, who signs it off, who is asked, who is told) across HR, IT, legal, finance and the business, using only the groups the person named plus any the project clearly needs. Say which are added.
5. Write the communication plan: audience, message, channel, timing.
6. List the top 5 to 8 risks, each with likelihood (low, medium, high), impact, a fix and an owner. Add the usual HR risks: low take-up, payroll or data errors, legal or works council review, and change fatigue.
7. Add a change control rule: how a scope change is raised, who decides and what must be checked (cost, date, risk).
8. Write the weekly status report template and, at the end, the lessons-learned template.
9. Finish with "Before you start": the three decisions the sponsor must make.

## Output

```markdown
## HR project plan: <project name>

### Charter
Goal / Why now / In scope / Out of scope / Success measures / Sponsor / Lead / Budget / Main risks

### Milestones
| Milestone | Owner | Date or week |
|-----------|-------|--------------|

### Who does what (RACI)
| Task | Responsible | Accountable | Consulted | Informed |

### Communication plan
| Audience | Message | Channel | When |

### Risks
| Risk | Likelihood | Impact | Fix | Owner |

### Change control
<how a change is raised and decided>

### Weekly status report template
Status (green, amber, red) / Done this week / Next week / Risks and decisions needed / Budget and dates

### Lessons-learned template
What worked / What did not / What we would change

### Before you start
- <decision>
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Staff announcement writer](https://useaiblocks.com/skills/staff-announcement-writer). It takes the plan.
- The [Shift schedule planner](https://useaiblocks.com/skills/shift-schedule-planner). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Supported tasks

- Drafting project charters for HR initiatives
- Building project timelines and milestone plans
- Creating stakeholder maps and communication plans
- Designing RACI charts for HR project roles
- Building risk registers and mitigation plans for HR projects
- Drafting status report templates for HR project updates
- Creating project scope documents and change control processes
- Designing a project governance structure (steering committee, working groups)
- Building a post-implementation review process
- Drafting resource and budget plans for HR initiatives
- Creating a lessons-learned template for closed HR projects
- Designing rollout/phasing plans for multi-phase HR programs

## Key prompts

### Project setup and planning

1. "Draft a project charter for [HR initiative, e.g., HRIS implementation]."
2. "Build a project timeline with milestones for a [duration] HR initiative."
3. "Create a RACI chart defining roles across HR, IT, and business stakeholders for [project]."
4. "Draft a scope document defining what is and isn't included in [HR project]."
5. "Design a phased rollout plan for [HR program] across [number] of locations or business units."

### Stakeholder and risk management

1. "Create a stakeholder map identifying key groups affected by [HR project]."
2. "Draft a communication plan for keeping stakeholders informed throughout [project]."
3. "Build a risk register identifying top risks and mitigation plans for [HR project]."
4. "Draft a change control process for handling scope changes mid-project."
5. "Create a governance structure with a steering committee for [large HR initiative]."

### Reporting and closure

1. "Draft a weekly status report template for an HR project."
2. "Create a post-implementation review checklist for [HR project]."
3. "Draft a lessons-learned template to capture insights after project closure."
4. "Write an executive summary update on project progress, risks, and next steps."
5. "Draft a go-live readiness checklist for [HR system/program launch]."

## Tips

- Define scope and success criteria explicitly at the start; ambiguous scope is the top cause of HR project overrun.
- Build a stakeholder map early, since HR projects usually touch legal, IT, finance, and business leaders.
- Track risks actively throughout the project, not just at kickoff.
- Hold a post-implementation review to capture lessons before the team disperses to the next initiative.

## Common mistakes

- Launching an HR project without a written charter or clearly defined success criteria.
- Underestimating the change management and communication workload relative to the technical/process workload.
- Letting scope creep in without a formal change control process.
- Skipping the post-implementation review, losing lessons that would improve future projects.
