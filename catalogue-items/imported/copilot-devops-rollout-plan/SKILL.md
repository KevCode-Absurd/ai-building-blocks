---
name: devops-rollout-plan
description: 'Generate comprehensive rollout plans with preflight checks, step-by-step deployment, verification signals, rollback procedures, and communication plans for infrastructure and application changes'
---

# DevOps Rollout Plan Generator

Your goal is to create a comprehensive, production-ready rollout plan for infrastructure or application changes.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **A test report** (yours): what was tested, what passed, what failed and why.
- **A plan** (yours): the goals, steps, constraints and dates for this work.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Bicep deployment preflight checker](https://useaiblocks.com/skills/copilot-azure-deployment-preflight). Bring a codebase, a plan (optional).
2. **A test report** with the [Code and documentation consistency checker](https://useaiblocks.com/skills/copilot-docs-sync-audit). Bring a codebase.
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase, a test report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Input Requirements

Gather these details before generating the plan:

### Change Description
- What's changing (infrastructure, application, configuration)
- Version or state transition (from/to)
- Problem solved or feature added

### Environment Details
- Target environment (dev, staging, production, all)
- Infrastructure type (Kubernetes, VMs, serverless, containers)
- Affected services and dependencies
- Current capacity and scale

### Constraints & Requirements
- Acceptable downtime window
- Change window restrictions
- Approval requirements
- Regulatory or compliance considerations

### Risk Assessment
- Blast radius of change
- Data migrations or schema changes
- Rollback complexity and safety
- Known risks

## Output Format

Generate a structured rollout plan with these sections:

### 1. Executive Summary
- What, why, when, duration
- Risk level and rollback time
- Affected systems and user impact
- Expected downtime

### 2. Prerequisites & Approvals
- Required approvals (technical lead, security, compliance, business)
- Required resources (capacity, backups, monitoring, rollback automation)
- Pre-deployment backups

### 3. Preflight Checks
- Infrastructure health validation
- Application health baseline
- Dependency availability
- Monitoring baseline metrics
- Go/no-go decision checklist

### 4. Step-by-Step Rollout Procedure
**Phases**: Pre-deployment, deployment, progressive verification
- Specific commands for each step
- Validation after each step
- Duration estimates

### 5. Verification Signals
**Immediate** (0-2 min): Deployment success, pods/containers started, health checks passing
**Short-term** (2-5 min): Application responding, error rates acceptable, latency normal
**Medium-term** (5-15 min): Sustained metrics, stable connections, integrations working
**Long-term** (15+ min): No degradation, capacity healthy, business metrics normal

### 6. Rollback Procedure
**Decision Criteria**: When to initiate rollback
**Rollback Steps**: Automated, infrastructure revert, or full restore
**Post-Rollback Verification**: Confirm system health restored
**Communication**: Stakeholder notification

### 7. Communication Plan
- Pre-deployment (T-24h): Schedule and impact notice
- Deployment start: Commencement notice
- Progress updates: Status every X minutes
- Completion: Success confirmation
- Rollback (if needed): Issue notification

**Stakeholder Matrix**: Who to notify, when, via what method, with what content

### 8. Post-Deployment Tasks
- Immediate (1h): Verify criteria met, review logs
- Short-term (24h): Monitor metrics, review errors
- Medium-term (1 week): Post-deployment review, lessons learned

### 9. Contingency Plans
Scenarios: Partial failure, performance degradation, data inconsistency, dependency failure
For each: Symptoms, response, timeline

### 10. Contact Information
- Primary and secondary on-call
- Escalation path
- Emergency contacts (infrastructure, security, database, networking)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Bicep deployment preflight checker](https://useaiblocks.com/skills/copilot-azure-deployment-preflight). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Plan Customization

Adapt based on:
- **Infrastructure Type**: Kubernetes, VMs, serverless, databases
- **Risk Level**: Low (simplified), medium (standard), high (additional gates)
- **Change Type**: Code deployment, infrastructure, configuration, data migration
- **Environment**: Production (full plan), staging (simplified), development (minimal)

## Remember

- Always have a tested rollback plan
- Communicate early and often
- Monitor metrics, not just logs
- Document everything
- Learn from each deployment
- Never deploy on Friday afternoon (unless critical)
- Never skip verification steps
- Never assume "it should work"
