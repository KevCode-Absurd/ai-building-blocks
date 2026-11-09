---
name: bug-report-and-triage
description: Turns a customer complaint, screenshot, test failure or rough note into a bug report a developer can act on (a unique summary, numbered steps to reproduce, expected and actual results, environment, frequency, evidence with private data removed, suggested severity), plans what to try when a bug can't be reproduced, triages a list of bugs (duplicates merged, grouped by area, ordered by severity and reach) and reviews a proposed fix against the bug. Use it when bugs arrive as vague complaints, when a backlog of bugs needs an order, or before a fix is merged.
---

# Bug report and triage

## When to use

- A customer or colleague says "it's broken" and a developer needs something to act on.
- A test failed and the failure must be written up.
- A bug happens only sometimes and nobody can reproduce it.
- A backlog of bugs needs duplicates merged and a fix order.
- A fix is ready and someone must check it covers the bug and what to re-test.

Reading complaints, logs and the tracker needs level 1. Drafting reports and triage notes in the tracker needs level 2. Filing, labelling, merging duplicates and closing tickets needs level 3, within the projects you name. Reproducing a bug happens only in the environments you name; reproducing on production needs a fresh yes if any step writes data.

## What you need

1. The original words of the complaint, email or test failure, with personal data removed.
2. Screenshots, screen recordings, error text, logs or the failing test output.
3. Where and when: page or screen, account type, device, browser, app version, time.
4. For triage: the bug list as an export (ID, title, description, reporter, date, any labels).
5. Your severity scale, if you have one. If not, I propose one.

## Steps

### 1. Separate facts from guesses

List what was observed (exact error text, what the screen showed, time) apart from what someone thinks caused it. A report with "probably the cache" in its title sends the developer the wrong way.

### 2. Write the summary

Place plus problem plus condition: "Invoice page shows blank content for invoices with more than 50 lines". Not "Invoice bug" and not a proposed fix. It should be unique enough to find in a search [Mozilla bug writing guidelines].

### 3. Reproduce in a named environment

Try the steps on the environment the client named, with a test account. Vary one thing at a time: browser, account role, data size, network speed, time of day. Record how often it happens (every time, 3 of 10 tries, once). If a step would write to production, stop and ask first.

### 4. Write the steps

Short numbered commands anyone can follow, starting from a clear state ("Signed in as a test customer with 1 saved card"). Include the exact data. Mark any step you are unsure of.

### 5. Expected and actual

One line each, concrete: "Expected: one order, one charge. Actual: two orders, two charges of £24.00." Copy error text exactly into a code block.

### 6. Environment and evidence

Environment, URL (without tokens), version, browser and device. Evidence list: screenshots with names, emails and card numbers blurred; log lines with secrets masked. Never paste passwords, keys or customer data into the report.

### 7. Suggest severity, separately from priority

If the client has no scale, propose one and use it consistently:
- **S1 Blocker:** data loss, money taken wrongly, security exposure, or a core task impossible for many users with no workaround.
- **S2 Major:** a core task fails for some users, or a workaround is painful.
- **S3 Minor:** a non-core problem with a workaround.
- **S4 Trivial:** cosmetic.

Priority (how soon) is the owner's call and weighs reach, deadlines and cost. Mozilla, for example, keeps severity and priority as separate fields [Mozilla severity guide].

### 8. When it won't reproduce

Write a plan instead of closing it: what was tried, the differences between your setup and the reporter's, and the next three experiments, each with what a pass or fail would mean ("If it fails only on Safari 17, the date input is the suspect").

### 9. Triage a list

1. Normalise titles to place plus problem.
2. Merge duplicates: keep the clearest report as the main one and link the others, keeping their extra symptoms.
3. Group by area (checkout, sign-in, admin).
4. Order by severity, then reach (how many users or orders), then age.
5. Flag reports that need more information, with the exact question.
6. Suggest a fix order and say which items could be fixed together.

### 10. Review a fix

Compare the fix description or pull request with the report: does it address the cause or only the symptom? Does it cover the variants found in step 3? Is there a test that fails before the fix and passes after? List what to re-test, including nearby features that share the changed code.

## Checks before handing over

- The summary names place and problem, not a fix.
- Steps start from a clear state and use exact data.
- Expected and actual are concrete and different.
- Frequency is stated.
- No personal data, passwords or tokens anywhere, including screenshots and URLs.
- Facts and guesses are in separate sections.
- Severity follows the stated scale; priority is left to the owner or marked as a suggestion.
- For triage: every merged duplicate links to the main report.

## Output format

**Bug report:** Summary; Environment; Preconditions; Steps to reproduce; Expected; Actual; Frequency; Severity (suggested); Evidence; Notes and guesses; What I tried that did not reproduce it.

**Triage:** a table with ID, normalised title, area, severity, reach, duplicates merged, needs info, suggested order; then a short list of themes (for example "4 of the top 10 are in the address form").

**Fix review:** cause covered (yes, no, partly); variants covered; test present; re-test list.

## Example of good output (short)

*Illustrative structure, not a real business: an online invoicing tool. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary:** Invoice page shows a blank body for invoices with more than 50 line items
>
> **Environment:** staging.[domain], release 4.12, current Chrome on Windows 11 and Safari on iPhone
>
> **Preconditions:** signed in as test user "qa-owner"; invoice INV-TEST-0051 with 51 line items exists
>
> **Steps to reproduce:**
> 1. Open Invoices.
> 2. Open INV-TEST-0051.
>
> **Expected:** the invoice shows all 51 lines and the total £1,530.00.
> **Actual:** header and footer show; the body is blank. The console shows:
> ```
> TypeError: Cannot read properties of undefined (reading 'tax')
> ```
> **Frequency:** 5 of 5 tries. Invoices with 50 lines show normally (5 of 5).
> **Severity (suggested):** S2. Customers with large invoices can't see them; the PDF download works as a workaround.
> **Evidence:** screenshot-0051-blank.png (customer details blurred), console log above.
> **Notes and guesses:** the 50-line boundary suggests paging of line items; not confirmed.
