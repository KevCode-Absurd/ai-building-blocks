---
name: change-request
description: Create a change management request with impact analysis and rollback plan. Use when proposing a system or process change that needs approval, preparing a change record for CAB review, documenting risk and rollback steps before a deployment, or planning stakeholder communications for a rollout.
argument-hint: "<change description>"
---

# /change-request

> No connected tools are needed. Everything works from text pasted into the chat. The tool names marked ~~ below (ticket system, project tracker, chat) are optional, and the original skill's CONNECTORS.md file is not part of this item.

Create a structured change request with impact analysis, risk assessment, and rollback plan. If an earlier step gave you a plan for the change, use it to fill in the implementation plan, timeline and owners.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Usage

```
/change-request $ARGUMENTS
```

## Change Management Framework

Write the request in these steps:

1. Say what is changing, who is affected and how big it is (Low, Medium or High).
2. Write the impact analysis and risk assessment.
3. Write the plan: communication, training, support and a timeline with dates.
4. Write the rollback plan and who can trigger it.
5. List approvers (for example the change advisory board, or CAB) with status Pending.
6. Say how you will measure adoption after the change goes live.

The assess-plan-execute-sustain framework below gives the questions for each step:

### 1. Assess
- What is changing?
- Who is affected?
- How significant is the change? (Low / Medium / High)
- What resistance should we expect?

### 2. Plan
- Communication plan (who, what, when, how)
- Training plan (what skills are needed, how to deliver)
- Support plan (help desk, champions, FAQs)
- Timeline with milestones

### 3. Execute
- Announce and explain the "why"
- Train and support
- Monitor adoption
- Address resistance

### 4. Sustain
- Measure adoption and effectiveness
- Reinforce new behaviors
- Address lingering issues
- Document lessons learned

## Communication Principles

- Explain the **why** before the **what**
- Communicate early and often
- Use multiple channels
- Acknowledge what's being lost, not just what's being gained
- Provide a clear path for questions and concerns

## Output

```markdown
## Change Request: [Title]
**Requester:** [Name] | **Date:** [Date] | **Priority:** [Critical/High/Medium/Low]
**Status:** Draft | Pending Approval | Approved | In Progress | Complete

### Description
[What is changing and why]

### Business Justification
[Why this change is needed — cost savings, compliance, efficiency, risk reduction]

### Impact Analysis
| Area | Impact | Details |
|------|--------|---------|
| Users | [High/Med/Low/None] | [Who is affected and how] |
| Systems | [High/Med/Low/None] | [What systems are affected] |
| Processes | [High/Med/Low/None] | [What workflows change] |
| Cost | [High/Med/Low/None] | [Budget impact] |

### Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk] | [H/M/L] | [H/M/L] | [How to mitigate] |

### Implementation Plan
| Step | Owner | Timeline | Dependencies |
|------|-------|----------|--------------|
| [Step] | [Person] | [Date] | [What it depends on] |

### Communication Plan
| Audience | Message | Channel | Timing |
|----------|---------|---------|--------|
| [Who] | [What to tell them] | [How] | [When] |

### Rollback Plan
[Step-by-step plan to reverse the change if needed]
- Trigger: [When to roll back]
- Steps: [How to roll back]
- Verification: [How to confirm rollback worked]

### Approvals Required
| Approver | Role | Status |
|----------|------|--------|
| [Name] | [Role] | Pending |
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Recurring task procedure writer](https://useaiblocks.com/skills/repeat-task-step-guide-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If Connectors Available (optional)

If you have none of these, skip this section and paste the finished request into your own tool.

If **~~ITSM** (your IT service ticket system) is connected:
- Create the change request ticket automatically
- Pull change advisory board schedule and approval workflows

If **~~project tracker** is connected:
- Link to related implementation tasks and dependencies
- Track change progress against milestones

If **~~chat** is connected:
- Draft stakeholder notifications for the communication plan
- Post change updates to the relevant team channels

## Tips

1. **Be specific about impact** — "Everyone" is not an impact assessment. "200 users in the billing team" is.
2. **Always have a rollback plan** — Even if you're confident, plan for failure.
3. **Communicate early** — Surprises create resistance. Previews create buy-in.

Changed by AI Blocks (2026-10-28): refreshed the generated Before you start and After this guidance from catalogue metadata.
