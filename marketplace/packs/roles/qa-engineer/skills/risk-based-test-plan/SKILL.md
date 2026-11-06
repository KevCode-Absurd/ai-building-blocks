---
name: risk-based-test-plan
description: Turns a spec, user stories, screens or a feature description into a risk-ranked test plan with numbered test cases (steps, test data, concrete expected results, priority), boundary and edge cases, acceptance tests in pass or fail form, entry and exit criteria, and a list of open questions and gaps. Use it before a new feature is tested, when a small team has no tester, when acceptance criteria are vague, or when a release needs a clear rule for "ready to ship".
---

# Risk-based test plan

## When to use

- A feature is about to be built or tested and nobody has written down what "working" means.
- A small team has no QA person and needs test cases a developer or the owner can run.
- The spec is thin and someone needs to find the gaps before code is written.
- A release needs written exit criteria instead of a feeling.

This skill writes the plan and cases. Running them, automating them or filing bugs uses the other skills. Reading the spec needs level 1. Saving test cases into a test management tool or tickets as drafts needs level 2; publishing them as the team's official plan or linking them to tickets needs level 3, within your limits.

## What you need

1. The spec, user stories, designs or a plain description of the feature, and who uses it (customers, staff, admins).
2. What would hurt most if it broke: money, personal data, bookings, sign-in, legal or safety exposure.
3. The platforms that matter: browsers, devices, screen sizes, assistive technology.
4. The environments testing can use, and what test data and accounts exist.
5. The release date and who decides a release is ready.
6. Past bugs or complaints in this area, if any.

If some of this is missing, start anyway and put the questions at the top of the plan.

## Steps

### 1. Restate the feature as rules

Write each behaviour as one checkable sentence: "A booking for more than 8 people is refused with the message 'Call us for groups over 8'." Where the spec is silent or vague, write the question instead. Untestable words ("fast", "user-friendly", "works properly") become questions too.

### 2. List what could go wrong

For each rule, ask: wrong input, missing input, too much input, wrong user, wrong order, repeated action, slow or lost connection, outside service down, two people at once, time zones and month ends, old data, very large data. Add anything from past bugs.

### 3. Rank the risks

Score each risk on likelihood (low, medium, high) and impact (low, medium, high), with a one-line reason. Impact is high when failure loses money, exposes personal data, blocks a core task, breaks a legal duty or can't be undone. Sort by impact first, then likelihood. Do not invent a numeric score scale the client hasn't agreed; words and reasons are enough.

### 4. Choose the approach per risk

- **High:** scripted cases at boundaries and error paths, more than one test level (for example an API test plus one browser test), roles and permissions, and a short exploratory session with a charter.
- **Medium:** scripted happy path plus the main edge cases.
- **Low:** a smoke check.

Mark which cases are worth automating: stable, repeated every release, and costly to run by hand. Point the rest to manual runs or exploratory sessions.

### 5. Write the test cases

One row per case: ID, title, preconditions, steps (numbered commands), test data, expected result (a concrete value, message, state or record), priority, and automate (yes or no). Normal path first, then boundaries (just below, on, just above each limit), then errors, then roles, then interruption (back button, refresh, double-click, lost connection).

### 6. Write acceptance tests

For each requirement, one or more pass or fail checks in plain yes or no form, or Given/When/Then if the team uses it. Each must be checkable by someone who didn't write it.

### 7. Set entry and exit criteria

- **Entry:** build deployed to the named environment, test data ready, blocking questions answered.
- **Exit:** all high-priority cases pass; no open bug of the agreed top severities; medium bugs listed and accepted by a named person; accessibility checks done for changed screens; smoke test plan ready for after deploy.

Write who can accept a known bug. If the client wants to ship with a failing high-priority case, that is their decision; record it with the risk.

### 8. List environments, data and gaps

Which environment, which browsers and devices, which accounts, how data is reset. Then a "not covered yet" list: devices not tested, performance and security (out of scope for this skill), integrations that can't be reached from staging.

## Checks before handing over

- Every expected result is concrete; none says "works", "correctly" or "as expected".
- Every high-impact risk has boundary and error cases, not just the happy path.
- Cases use made-up data; no real customer details.
- Questions about vague rules are listed at the top, not buried.
- Exit criteria name who can accept a known bug.
- Environments are the ones the client named; nothing in the plan writes to production without a fresh yes.
- The "not covered yet" list exists.

## Output format

1. Summary: feature, users, top three risks, environments, release date.
2. Open questions (numbered).
3. Risk table: risk, likelihood, impact, reason, approach.
4. Test case table: ID, title, preconditions, steps, data, expected, priority, automate.
5. Acceptance tests per requirement.
6. Entry and exit criteria.
7. Environments, browsers, devices and data.
8. Not covered yet.

## Example of good output (short)

*Made-up business for illustration: "Copper Kettle Bistro", a restaurant with an online booking form (date, time, party size, allergies, confirmation email).*

> **Top risks:** (1) double bookings when two people book the last table at once; (2) allergy notes lost between the form and the kitchen email; (3) bookings for past dates or closed days accepted.
>
> **Open questions:** Q1. What is the largest party the form accepts? The spec says "large groups call us" with no number. Q2. Are allergy notes required to reach the kitchen, or only the confirmation email?
>
> | ID | Title | Steps | Data | Expected | Priority |
> |---|---|---|---|---|---|
> | BK-01 | Book a table for 2 tomorrow | 1. Open /book 2. Pick tomorrow, 19:00, 2 people 3. Submit | test01@example.com | "Booking confirmed" page with a reference; one email to test01@example.com within 5 minutes | High |
> | BK-07 | Party size on the limit | As BK-01 with 8 people | as above | Booking confirmed (pending Q1) | High |
> | BK-08 | Party size above the limit | As BK-01 with 9 people | as above | Form shows the group message and does not submit (pending Q1) | High |
> | BK-12 | Double-click Submit | As BK-01, double-click Submit | as above | One booking and one email, not two | High |
> | BK-15 | Allergy note with 500 characters | As BK-01, paste a 500-character note | lorem text | Note saved in full or the form states the limit before submit | Medium |
>
> **Exit:** BK-01 to BK-12 pass on staging in Chrome, Safari and Firefox on mobile and desktop; no open S1 or S2 bugs; owner accepts any S3.
>
> **Not covered yet:** load from many bookings at once; the kitchen printer; screen reader pass on the date picker.
