---
name: code-review
description: Reviews one pull request, diff or set of changed files, including AI-written code, for behaviour, edge cases, risks (data loss, security, secrets, unsafe input, missing permission checks), tests and clarity, following Google's code review guidance and labelled Conventional Comments (praise, issue, suggestion, question, nitpick, with blocking or non-blocking), each pointing to file and line, and ends with a clear merge state. Use it when a small team has no second reviewer, before merging risky changes, or to check code an AI wrote.
---

# Code review

## When to use

- A pull request needs a reviewer and the team has nobody free.
- A change touches money, permissions, personal data or data deletion.
- AI wrote the code and someone needs to check it before merge.
- A developer wants a plan for answering review comments they received.

I read code, and run it only where my AI tool can run commands in your project; where a claim needs running and I could not, I say so. Posting comments on the pull request needs level 2. Merging needs level 3, within your limits. I do not approve changes to security-critical or safety systems on my own; a named person on your team makes that call.

## What you need

1. The pull request description: what the change should do and why, and the linked issue.
2. The diff, or the changed files in full plus enough surrounding code to understand them.
3. How it is tested: the tests in the change, CI results, manual test notes.
4. The project's style guide, linters and conventions, if any.
5. Who will use the change and how (an API, a page, a background job).

**Access:** level 1 to read the pull request; level 2 to post review comments on it; level 3 to merge it when it is ready, within your limits.

## Steps

### 1. Read the description, then the code

Know what the change is meant to do before judging how. If the description is missing or vague, the first comment asks for it.

### 2. Check size and shape

If the change mixes refactoring with behaviour changes, or is too large to review well, say so first and suggest a split. A review of a change that is too big is a weak review.

### 3. Check behaviour

Does it do what the description says? Walk through the main path, then edge cases: empty input, very large input, wrong types, missing optional fields, repeated runs, concurrent calls, time zones, failures from outside services.

### 4. Check risk

- **Access:** is every action checked against who may do it?
- **Input:** is outside input validated, and are queries parameterised and output encoded?
- **Secrets:** any key, token or password in code, config or tests?
- **Data:** can it delete or overwrite data? Is there a migration, and can it be reversed?
- **Errors:** are errors handled, logged without personal data, and not swallowed?
- **Dependencies:** new packages with a version, a reason and a maintained source?

### 5. Check tests

What is covered, what is missing, and would the tests fail if the code broke? Tests that only check a mock was called prove little. Suggest the one or two tests that would catch a regression.

### 6. Check clarity

Names, structure, comments that explain why, dead code, duplication, consistency with the surrounding code.

### 7. Extra checks for AI-written code

- Every import and function exists in the stated versions; no invented packages or APIs.
- Error handling is real, not a generic catch-all.
- Edge cases from step 3 are handled, not just the happy path.
- No copied secrets, placeholder credentials or disabled security checks.
- Tests test behaviour, not the AI's own mocks.

### 8. Write labelled comments

One comment per point, with file and line, a label and, if it blocks, the word blocking. **Level 2:** post them on the pull request; otherwise hand them over as a list. Offer a short code sample when it helps. Say what is good, specifically.

### 9. End with a merge state

- **Ready:** no blocking items.
- **Ready after must-fix items:** list them.
- **Needs rework:** say why, and what a better shape would be.

Approve when the change improves the code overall, even if it is not perfect.

## Checks before handing over

- Every comment has a label, a location and a reason.
- Blocking items are truly about correctness, risk or tests, not taste.
- Style points the formatter or style guide already settles are not raised.
- Claims that need running are marked "needs running".
- At least one specific praise comment where deserved.
- The summary and merge state come first.
- No secrets from the diff are repeated in the review; if one was committed, the review says to rotate it.

## Output format

1. Summary: what the change does, overall assessment, merge state.
2. Blocking items (numbered).
3. All comments in file order: `label (decoration): subject`, file and line, reason, suggested fix.
4. Missing tests to add.
5. Questions for the author.
6. Not reviewed (files not shared, generated code skipped).

## Example of good output (short)

*Made-up business for illustration: "Lark & Ivy Florists", an online flower shop.*

> **Summary.** Adds a discount code field to checkout. The flow is clear and well tested for valid codes. Merge state: ready after 2 must-fix items.
>
> **Blocking**
> 1. `issue (blocking): a fixed-amount code can make the total negative` - `checkout/totals.ts:58`. A £10 code on an £8 order gives -£2, and the payment call then fails. Cap the discount at the order subtotal and add a test for it. Please confirm with whoever owns pricing whether delivery can be discounted too.
> 2. `issue (blocking): code check is case-sensitive but codes are stored upper case` - `discounts/lookup.ts:21`. `spring10` fails. Normalise with `.trim().toUpperCase()` before lookup.
>
> **Other**
> - `suggestion (non-blocking): add a test for an expired code` - `discounts/lookup.test.ts`.
> - `nitpick (non-blocking): rename d to discount` - `totals.ts:52`.
> - `praise: the error message tells the customer exactly why a code failed` - `DiscountField.tsx:34`.
