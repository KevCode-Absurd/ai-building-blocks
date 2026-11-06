# Patient data incident response

**Trigger:** Anyone at the practice suspects patient or client data went where it should not: a letter or email to the wrong person, a lost phone or laptop, a shared login used by a leaver, records visible to the wrong user, a vendor reporting a breach. Start the same day.

This workflow organises the admin. Whether something is a reportable breach, and what the notices say, is decided by the practice's privacy lead with a qualified adviser. Check this with local rules.

## Steps

1. **Contain (same hour).** Stop it getting worse: recall the email if possible, ask the wrong recipient to delete it and confirm, disable the lost device or the leaver's login, remove the wrong user's access. At level 3 I can make a user inactive or remove a role when the owner says so; I never delete records. *Approval: owner or privacy lead says what to disable.*
2. **Log (same day).** Open an entry in the incident log: incident ID, date and time found, who found it, what happened in plain words, what data (types, not contents), how many people, containment done. The legal clocks start from when the practice found out or should have: in the US, patient notices are due without unreasonable delay and no later than 60 calendar days after discovery; under the EU GDPR, the supervisory authority is told within 72 hours where feasible. *Approval: none to log; logging is always right.*
3. **Tell the privacy lead (same day).** Send the log entry and the facts known. Do not guess at what was seen.
4. **Gather facts (days 1 to 3).** Access reports from the practice system, the sent email, the device record, the vendor's notice. Keep a timeline. Use IDs, not names, in the log.
5. **Support the decision (privacy lead, with an adviser).** Prepare a one-page summary: what happened, data types, people affected, risk factors, containment. The privacy lead decides whether to notify patients, a regulator or anyone else. *Approval: privacy lead and owner.*
6. **Draft notices if needed (level 2).** Draft plain-language notices for the privacy lead to approve: what happened, what data, what the practice is doing, what people can do, how to get answers. *Approval: every notice needs a fresh yes from the privacy lead, even at level 3.*
7. **Fix the cause (weeks 1 to 4).** Change the procedure, the role or the training that let it happen. Use the `system-access-plan` prompt if access was the cause. Record the training given.
8. **Close and review.** Close the log entry with the decision, notices sent (by whom, when), fixes made and the date reviewed. Keep the record as long as the practice's retention rules require; in the US, HIPAA documentation is kept six years.

## Outputs

- Incident log entry and timeline
- One-page summary for the privacy lead
- Draft notices (if the privacy lead decides to notify)
- Fix list with owners and dates
- Closed entry with review date

## Needs the client's approval

What to disable, every decision on notification, every notice, and changes to procedures or roles.
