---
name: architecture-review
description: Reviews an existing or proposed software system against its quality goals using the cloud provider's well-architected pillars (AWS, Azure or Google Cloud), a scenario-based trade-off pass in the spirit of SEI's ATAM, a short threat model and a cost check, and returns a ranked findings list with risks, trade-offs and next steps. Use it before a launch, after an incident, before a funding or client security review, or when a system feels fragile or expensive.
---

# Architecture review

## When to use

- Before launch, or before a large client or investor looks under the hood.
- After an incident or a run of slow, costly or flaky releases.
- When the cloud bill grows faster than usage.
- When a new tech lead inherits a system and needs a fair picture.

## What you need

Ask for what exists; work with partial information and say what you could not check.

1. Goals: what the system must do, for whom, and the top quality goals (speed, uptime, security, cost, ease of change).
2. Architecture: diagrams, a design doc, or a list of services, databases, queues and third-party services. Read access to the repo (level 1) helps.
3. Load and data: users, requests or jobs per day, peaks, data size.
4. Operations: how deploys work, monitoring and alerts, recent incidents (summaries, not raw logs with personal data).
5. Cost: last three months of the cloud bill by service, or a cost explorer export.
6. Constraints: team size, skills, deadlines, compliance needs.

Never ask for passwords, access keys or secrets. A level 1 role or exports are enough for the review.

**Access:** level 1 to read cloud resources, costs, code and monitoring; level 2 to open a pull request with the report, diagrams and draft ADRs, and to draft tickets for the findings; level 3 to merge the approved pull request and create the agreed tickets, within your limits. Fixing findings in live systems is a separate job with its own limits.

## Steps

### 1. Agree what "good" means

Write the top five quality attribute scenarios with numbers (see the `system-design-doc` skill, step 1). Rank them with the owner. A review without agreed goals turns into a list of opinions.

### 2. Draw what is really there

Redraw the system context and container diagrams in Mermaid from what you were given, then ask the team to correct them. Disagreements about the diagram are often the first finding.

### 3. Walk the pillars

Use the framework for the client's cloud; the pillars map closely:

| Theme | AWS | Azure | Google Cloud |
|---|---|---|---|
| Operations | Operational excellence | Operational excellence | Operational excellence |
| Security | Security | Security | Security, privacy and compliance |
| Reliability | Reliability | Reliability | Reliability |
| Performance | Performance efficiency | Performance efficiency | Performance optimization |
| Cost | Cost optimization | Cost optimization | Cost optimization |
| Sustainability | Sustainability | (workload guide) | Sustainability |

For each theme ask a few pointed questions, for example:
- **Reliability:** What happens when each dependency is slow or down? Are there timeouts and retries with backoff? Are handlers idempotent? When was a backup last restored?
- **Security:** Where are the trust boundaries? Is every tenant check enforced in one place? Where do secrets live? Who has admin access?
- **Performance:** Which flow has the worst p95? Is anything cached that should not be, or not cached that should be?
- **Operations:** Can the team deploy and roll back in minutes? Do alerts go to a person who can act?
- **Cost:** Which five line items make up most of the bill? Is anything idle (unattached IP addresses, oversized databases, forgotten environments)?

### 4. Run the scenarios

For each ranked scenario, trace it through the diagram. Note:
- **Risks:** choices that threaten a scenario.
- **Sensitivity points:** one setting or component the scenario depends on heavily (a single database, a cache expiry).
- **Trade-off points:** where improving one scenario hurts another (adding replicas helps uptime but adds cost and consistency questions).
- **Non-risks:** what is fine, so the team knows what not to touch.

### 5. Quick threat model

Draw a data flow with trust boundaries for the most exposed flow. Walk STRIDE across each boundary. Check against the OWASP Top 10:2025 headings, starting with broken access control. Use the `threat-model` skill for anything bigger.

### 6. Rank the findings

Score each finding on impact (how badly a goal is hurt) and likelihood, then effort to fix. Group into:
- **Fix now:** high impact, likely, or a security exposure.
- **Plan:** high impact, needs design work; write an ADR.
- **Watch:** low impact or unlikely; note a trigger to revisit.

### 7. Write the report

Lead with the three most important findings in plain words, then the full table. Every finding names the evidence, why it matters, a recommendation and an owner to agree.

## Checks before handing over

- Goals were agreed before findings were written.
- Diagrams were checked with the team.
- Each finding cites evidence (a doc, a config export, a bill line, an incident), or is marked "not verified".
- Recommendations include at least one cheap, quick fix.
- No finding says "secure", "compliant" or "production-ready" as a verdict.
- No secrets, keys or personal data appear in the report.
- Next steps are listed with what needs the owner's approval.

## Output format

1. Summary: the three findings that matter most
2. Scope, what was reviewed, what was not, and what was not verified
3. Quality scenarios (ranked)
4. Current architecture (context and container diagrams in Mermaid)
5. Findings table: ID, theme, finding, evidence, impact, likelihood, effort, recommendation, group
6. Trade-off and sensitivity points
7. Threat model summary
8. Cost notes with sources and dates
9. Proposed ADRs
10. Next steps and approvals needed

## Example of good output (short)

> **Top finding 1 (fix now).** Tenant filtering is done in 23 separate query functions; three of the reports endpoints do not filter at all (evidence: repo search, files listed in appendix A). One missed filter would expose another customer's data, which breaks scenario S1. Recommendation: move tenant scoping into a single data-access layer or database row-level security, add a test per endpoint that proves cross-tenant reads fail. Effort: about one week. Needs owner approval: yes (ADR-012 proposed).
>
> | ID | Theme | Finding | Impact | Likelihood | Effort | Group |
> |---|---|---|---|---|---|---|
> | F2 | Reliability | Email sending inside the checkout request; provider outage blocks checkout | High | Medium | 2 days (queue + idempotent worker) | Fix now |
> | F3 | Cost | 11 public IPv4 addresses on stopped test servers | Low | Certain | 1 hour | Fix now |
