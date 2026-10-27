---
name: "soc2-audit-prep"
description: "/cs:soc2-audit-prep <scope> — SOC 2 Type II readiness 6-question forcing interrogation. Observation-period focused. Use before Type II observation begins, mid-period checkpoint, or pre-field-test month-10 readiness."
---

# /cs:soc2-audit-prep — SOC 2 Type II Forcing Questions

**Command:** `/cs:soc2-audit-prep <scope>`

The SOC 2 Type II auditor pressure-tests any SOC 2 work. Six observation-period-disciplined questions before any Type II cycle.

## Before you start

Ask once for any of these that are missing. If the user cannot give one, write MISSING for it and carry on. Never invent controls, dates, exceptions or evidence.

1. Scope: the systems and teams the audit covers.
2. Trust categories planned (Security is always in).
3. The audit period: start date, end date and today's date.
4. Optional: the control list with how often each runs, the exception log, and the evidence list. A readiness report from the SOC 2 readiness planner can stand in for the control list.

No scripts or tools are needed. Work from what the user pastes. If the user says they run an ISO 27001 audit too, use question 6. Otherwise mark it not applicable.

## When to Run

- Pre-observation period (months 1-2 of cycle)
- Mid-observation period (month 6 checkpoint)
- Pre-field-test (month 10)
- Post-report (planning next cycle)
- After scope change (adding TSC category)
- After major incident during observation period

## When not to run

- Starting from nothing, with no controls written down yet: use the SOC 2 readiness planner first.
- ISO 27001 only: use the ISO 27001 audit prep coach.
- This skill prepares the user. The audit firm decides what counts as an exception and how many are acceptable. Tell the user to confirm any tolerance with their auditor. Do not state a number as the auditor's rule.

## The Six SOC 2 Type II Questions

Ask them in order. For each, mark the answer ready or gap, with one line of reason.

### 1. What's the scope, and which TSC categories are in?
**Security always required; others elective based on customer ask.**
- Common Criteria (CC1-CC9) under Security always
- Availability (A1): for SaaS with SLA commitments
- Processing Integrity (PI1): for systems processing transactional / financial data
- Confidentiality (C1): for systems handling proprietary / confidential data
- Privacy (P1-P8): for systems handling personal data (overlap with GDPR if applicable)
- AICPA AT-C 205 description of system: complete + accurate + boundaries clear

### 2. Did any control skip a cycle during observation period?
**Type II requires consistent operation. A single skipped cycle is likely to become an exception.**
- Quarterly controls (e.g., access reviews): all 4 quarters covered
- Monthly controls (e.g., vulnerability scans): all months covered
- Continuous controls (e.g., logging): no gaps during period
- Annual controls (e.g., BCP exercises, training): completed within period

### 3. Show me the change-management evidence for any control implemented mid-period.
**Mid-period changes = high audit risk.**
- New controls implemented during observation: documented with change-management
- Modified controls: rationale + effective date + impact on prior samples
- Removed controls: rationale + customer impact assessment
- Strategy: avoid mid-period changes; defer to next cycle

### 4. Where's the exception log, and what's the materiality assessment?
**Real-time exception logging, not retroactive.**
- Each exception logged when discovered, not at audit time
- Per exception: what / when / impact / remediation / owner
- Materiality assessment: does the exception affect overall control operation?
- How many exceptions per control the audit firm will accept is the auditor's call. Ask the user to confirm it with their firm.

### 5. Show me sample evidence from each TSC criterion in the FIRST month of observation.
**Not the last week. The first month.**
- Audit firm samples across the observation period
- Front-loaded evidence demonstrates operational discipline
- Back-loaded evidence (last 30 days) = "scrambling" signal
- Sample IDs should be reproducible from operational systems

### 6. Which evidence can be reused for ISO 27001?
**Only if the user also runs an ISO 27001 audit.**
- Many controls overlap between the two. Compare the user's two control lists, row by row, and name the ones that match.
- A shared artefact is cited by both audits (one collection, two reports).
- Line up the two audit calendars.
- Avoid producing duplicate evidence files for the same control.

## Output Format

Use this layout. Keep each line short. Mark anything not provided as MISSING.

```markdown
# SOC 2 Type II Audit Prep: <scope>
**Date:** YYYY-MM-DD
**Observation Period:** YYYY-MM-DD to YYYY-MM-DD

## The Decision Being Made
[scoping | pre-observation | observation-status | pre-field | report-response]

## The Six Questions
1. Scope and categories: ready | gap. <one line>
2. Skipped cycles: ready | gap. <controls>
3. Mid-period changes: ready | gap. <one line>
4. Exception log: ready | gap. <one line>
5. First-month evidence: ready | gap. <one line>
6. Reuse from ISO 27001: ready | gap | not applicable. <one line>

## TSC Scope
- Security: included
- Availability: <yes/no>
- Processing Integrity: <yes/no>
- Confidentiality: <yes/no>
- Privacy: <yes/no>

## Observation Period Status
- Months elapsed: N / 12
- Controls with a skipped cycle: <list>
- Mid-period control changes: N (each documented with change-management: yes/no)

## Exception Log
- Total exceptions logged: N
- Per exception: what, when, impact, owner, fix status (complete / in progress)
- Material exceptions (overall control affected): <list>

## Sample Evidence Coverage
- Months 1-3: complete / gaps
- Months 4-6: complete / gaps
- Months 7-9: complete / gaps
- Months 10-12: complete / gaps (only for pre-report status)

## Reuse From Other Audits
- Matching controls: <list>, or not applicable

## Audit Firm Readiness
- Scoping discussion: complete / pending
- Description of system: complete / pending
- Walkthrough rehearsal: complete / pending
- Sample preparation: complete / pending

## Verdict
ON-TRACK | NEEDS-ATTENTION | MATERIAL-RISK

## Top 3 Actions
[3 concrete next steps, each with an owner and a date within the observation period]

## Missing
[anything not provided]
```

## Next steps

- Take the top 3 actions to the person who owns compliance.
- For a full plan of controls, owners and evidence, use the SOC 2 readiness planner.
- For ISO 27001, use the ISO 27001 audit prep coach.
- Run this again at the next checkpoint.

---

**Version:** 1.0.0
