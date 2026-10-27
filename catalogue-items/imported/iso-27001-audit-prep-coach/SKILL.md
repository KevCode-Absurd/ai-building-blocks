---
name: "iso27001-audit-prep"
description: "/cs:iso27001-audit-prep <scope> — ISO 27001 ISMS audit readiness 6-question forcing interrogation. Use before annual Clause 9.2 internal audit, surveillance audit prep, or stage 1 certification readiness."
---

## Supporting material availability

This catalog copy does not include these files:

- `ra-qm-team/skills/isms-audit-expert/scripts/isms_audit_scheduler.py`
- `../../skills/compliance-os/scripts/audit_simulator.py`
- `../../skills/compliance-os/scripts/cross_framework_mapper.py`
- `../../../ra-qm-team/skills/isms-audit-expert/references/iso27001_audit_playbook.md`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

# /cs:iso27001-audit-prep — ISO 27001 ISMS Audit Forcing Questions

**Command:** `/cs:iso27001-audit-prep <scope>`

The ISO 27001 ISMS auditor pressure-tests any ISMS work. Six sample-driven questions before any internal audit, stage 1 readiness, or surveillance audit.

**What you need.** Your audit scope and audit type. If you have a report from an earlier audit or readiness check, such as a SOC 2 readiness report, share it; its findings and evidence can answer some of the six questions.

## When to Run

- Before annual Clause 9.2 internal audit
- Before stage 1 / stage 2 ISO 27001 certification audit
- Before surveillance audit (year 2 / year 3)
- After material change to ISMS scope (new business unit, new product line, new SaaS adoption)
- Post-incident (breach triggers ad-hoc ISMS audit)
- Quarterly during high-growth phase

## The Six ISMS Questions

### 1. What's the audit scope, and is rolling 3-year coverage on track?
**No 3-year coverage discipline, no defensible programme.**
- Every Clause 4-10 + every applicable Annex A control must be audited at least once per 3-year cycle
- Work out by hand, from what the user pastes, which clauses and controls were audited in the last 3 years and which are due
- Confirm auditor independence — no self-audit on any sample

### 2. When was the risk register last refreshed, and are treatments linked to Annex A controls?
**Stale risk register = certification finding.**
- Quarterly refresh expected; annual minimum
- Every high/critical risk must link to ≥ 1 Annex A control treating it
- Residual risk acceptance documented + signed
- Check the register by hand against what a stage 1 audit expects (the playbook file is not in this copy)

### 3. Show me the access review records — quarterly cadence, the last 4 quarters.
**A common finding area (the original author's view; no source is given).**
- Annex A.5.15 + A.8.2 + A.8.3 access controls
- Sample real records pulled from Okta / IAM, not curated audit-prep packs
- For each terminated employee in last 90 days: deprovisioning evidence within the time your own policy sets (for example 24 hours; ISO 27001 does not set a number)
- Privileged access reviewed at finer granularity

### 4. What's the supplier inventory + last review evidence?
**Another common finding area (the original author's view; no source is given).**
- Annex A.5.19-A.5.21 supplier management
- Critical SaaS suppliers reviewed at least annually
- DPAs signed for personal-data sub-processors (cross-check with cs-dpo-gdpr)
- AI-specific contract clauses where third-party AI services in use (cross-check with cs-aims-iso42001)

### 5. Where's the incident response evidence + post-incident review?
**A.5.24-27 + A.6.8 — high-stakes audit area.**
- Severity definitions documented + consistently applied
- Last 5 incidents have post-incident review (PIR) within the time your own policy sets (for example 30 days; ISO 27001 does not set a number)
- GDPR Article 33 / 34 notification timing aligned with A.5.24 (cross-check with cs-dpo-gdpr)
- Blameless retro culture; not punitive

### 6. What's the management review cadence + inputs?
**Clause 9.3 required inputs are prescriptive — easy to miss.**
- Required inputs: audit results, risks, performance, nonconformities, opportunities
- Schedule: annual minimum; quarterly preferred for mature programs
- Outputs documented + tracked to closure
- Integrated review across frameworks (per `multi_framework_audit_playbook.md`) preferred to separate reviews

## Workflow

**The three scripts and the playbook named in this skill are not in this copy, so do not run them or say you did.** Do the three steps by hand in the chat: (1) plan the audit scope and dates from what the user tells you, (2) walk the six questions as a mock audit, (3) list which SOC 2 and ISO 42001 controls the same evidence could cover. Say these checks were done by reading what the user pasted.

The original author ran three scripts for these steps. They are not in this copy. The overlap with SOC 2 and ISO 42001 is large but partial, and the exact share depends on scope.

## Output Format

```markdown
# ISO 27001 Audit Prep: <scope>
**Date:** YYYY-MM-DD

## The Decision Being Made
[programme-plan | finding-severity | cert-readiness | incident-followup]

## Audit Programme Status
- Clauses scheduled this year: <list>
- Annex A controls scheduled: <count>
- Rolling 3-year coverage: clean | gaps in <list>
- Auditor independence: clean | issues in <list>

## Risk Register Health
- Last refresh: YYYY-MM-DD
- High/critical risks without Annex A control link: N
- Residual risk acceptance documentation: complete | gaps

## High-Stakes Controls Status
- A.5.15 + A.8.2 + A.8.3 access control: pass/fail with sample
- A.5.19-A.5.21 supplier mgmt: pass/fail with sample
- A.5.24-27 + A.6.8 incident response: pass/fail with sample
- A.8.15-16 logging: pass/fail with sample

## Management Review Status
- Last review date: YYYY-MM-DD
- Required Article 9.3 inputs present: yes/no
- Open action items past due: N

## Cross-Framework Impact
- SOC 2 controls affected: <list>
- ISO 42001 controls affected (if applicable): <list>
- GDPR Article 32 controls affected: <list>

## Verdict
🟢 READY (no gaps that would block certification) | 🟡 CLOSE-CRITICALS-FIRST (critical gaps that can be closed before the audit) | 🔴 NOT-READY (critical gaps that cannot be closed in time, or missing core evidence). Say which questions drove the verdict.

## Top 3 Actions
[3 concrete next steps with owner + corrective-action timeline]
```

## Routing

These commands come from the original author's toolkit and are not in this copy. If you need one, use the AI Blocks item that does the same job, or ask your AI to do the check by hand.

- `/cs:compliance-readiness` — for multi-framework view
- `/cs:soc2-audit-prep` — for SOC 2 cross-walk pair (large overlap)
- `/cs:aims-audit` — for ISO 42001 AIMS cross-walk
- `/cs:gdpr-audit-prep` — for Article 32 organizational measures overlap
- `/cs:ciso-review` — for executive cybersecurity strategy
- `/cs:decide` — to log the verdict

## Related

- Agent: [`cs-ciso-iso27001`](../../agents/cs-ciso-iso27001.md)
- Skill: [`isms-audit-expert`](../../../ra-qm-team/skills/isms-audit-expert/SKILL.md)
- Playbook: [iso27001_audit_playbook.md](../../../ra-qm-team/skills/isms-audit-expert/references/iso27001_audit_playbook.md)
- Adjacent: `../soc2-audit-prep/`, `../aims-audit/`, `../gdpr-audit-prep/`, `../compliance-readiness/`

---

**Version:** 1.0.0
