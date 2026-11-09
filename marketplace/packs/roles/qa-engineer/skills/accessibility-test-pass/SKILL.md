---
name: accessibility-test-pass
description: Tests a page, flow or release against WCAG 2.2 level AA with an automated axe scan (tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa), the W3C Easy Checks, a keyboard-only pass and a screen reader pass, then writes findings tied to success criteria with steps, impact and a suggested fix, plus automated checks to add to Playwright or Cypress tests. Use it before a release that changes screens, for a quarterly check, or when a customer reports they can't use the site. It never calls a site "compliant".
---

# Accessibility test pass

## When to use

- A release changes forms, navigation, dialogs, colours or checkout.
- A customer using a screen reader, keyboard or magnifier says they are stuck.
- The team wants accessibility checks in its automated tests.
- A quarterly check is due.

For the law in each region (the EU European Accessibility Act, UK duties, the US ADA position) see the frontend developer kit. This skill tests and reports; it gives no legal ruling. Scanning and browsing the pages you name needs level 1. Adding checks to the test suite on a branch needs level 2. Making them a required check needs level 3, within your limits.

## What you need

1. The pages or flows to test, on an environment you name, and a test account if they need sign-in.
2. The target: WCAG 2.2 AA unless you choose otherwise.
3. Your users' common devices and browsers.
4. Past audit results or complaints, if any.
5. Your test framework, if checks should be automated.

## Steps

### 1. Map the flow

List each page and state in the flow: empty form, errors shown, dialog open, success page. WCAG conformance applies to full pages and complete processes, so a checkout passes only if every step passes.

### 2. Run the automated scan

Use axe (browser extension, `@axe-core/playwright` or a Cypress axe plugin) on every state from step 1, with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`. Playwright's own docs example stops at 2.1 AA, so add `wcag22aa` yourself. Record violations and the "incomplete" results; incomplete ones need a human to decide. If my AI tool can browse or run commands, I run the scan on the named environment myself. If not, run the axe browser extension on each state and paste or export the results to me.

Remember the limits. W3C says no tool alone can determine whether a site meets the standard. In a 2017 GDS test, ten free tools together found 71% of 143 planted barriers and missed 29%. A clean scan is the start, not the result.

### 3. Run the Easy Checks

The W3C's quick manual checks: page title, image alt text, headings, contrast, text resized to 200%, keyboard access and visible focus, form labels and errors, moving or flashing content, captions and transcripts, and basic structure with styles off.

### 4. Keyboard-only pass

Unplug the mouse. Tab through each state: can you reach and use every control, in a sensible order, with focus always visible and never hidden behind sticky headers (2.4.11, new in WCAG 2.2)? Can you open and close dialogs and menus, and does focus return to where it was? Is there any keyboard trap?

### 5. Screen reader pass

Use one screen reader your users are likely to have (VoiceOver on Apple devices, TalkBack on Android, NVDA on Windows). Check that each control announces a sensible name, role and state; that errors are announced when they appear; that headings and landmarks let you jump around; and that images that carry meaning are described.

### 6. Check the WCAG 2.2 additions

- **2.5.8 Target size (minimum), AA:** pointer targets at least 24 by 24 CSS pixels, or with enough spacing, or another exception.
- **2.5.7 Dragging movements, AA:** anything done by dragging also works with a single pointer.
- **3.3.7 Redundant entry, A:** don't make people re-type information they gave earlier in the same process.
- **3.3.8 Accessible authentication (minimum), AA:** sign-in doesn't depend on a memory or puzzle test without an alternative, such as allowing paste and password managers.
- **3.2.6 Consistent help, A:** help links sit in the same place across pages.

### 7. Write findings

One row per problem: ID, page and state, WCAG success criterion and level, what happens, who it affects, steps to reproduce, severity (blocks a task, makes it hard, minor), suggested fix, and how it was found (axe rule, keyboard, screen reader). Merge duplicates that come from one shared component.

### 8. Automate what can be automated

At level 2, add an axe check to existing end-to-end tests for each key state, failing on violations of the chosen tags, with known issues listed and dated rather than silently excluded. Keep the manual passes in the release checklist; automation does not replace them.

## Checks before handing over

- Every state in the flow was scanned, not just the first page.
- Keyboard and screen reader passes were done, and the screen reader and browser are named.
- Each finding cites a success criterion and level and has steps to reproduce.
- Findings blocking a task are listed first.
- The report says what was not tested (other screen readers, mobile apps, PDFs).
- The words "compliant" and "fully accessible" do not appear.
- Testing used only the environments the client named.

## Output format

1. Summary: scope, target (WCAG 2.2 AA), tools and versions, environment, date, top three problems.
2. Findings table: ID, page and state, criterion, level, what happens, who it affects, severity, steps, fix, found by.
3. Automated check code for the test suite, if requested.
4. Not tested yet.

## Example of good output (short)

*Illustrative structure, not a real business: an online pet supplies shop; checkout flow on staging. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary:** 4 pages, 9 states, axe-core through Playwright with WCAG 2.2 AA tags, keyboard pass, VoiceOver on Safari (macOS). Two findings block checkout for keyboard and screen reader users.
>
> | ID | Page and state | Criterion | What happens | Severity | Fix |
> |---|---|---|---|---|---|
> | A-01 | Delivery, address search open | 2.1.1 Keyboard (A) | The address suggestions can't be chosen with arrow keys or Enter; keyboard users can't continue | Blocks task | Use a listbox pattern with arrow-key support, or offer manual address entry |
> | A-02 | Payment, card error shown | 4.1.3 Status messages (AA) | "Card declined" appears but VoiceOver says nothing | Blocks task for screen reader users | Announce the error with a live region and move focus to it |
> | A-03 | Basket, quantity buttons | 2.5.8 Target size (AA) | + and − buttons are 16 by 16 px and touch each other | Hard | Make them at least 24 by 24 CSS px or add spacing |
>
> **Not tested yet:** NVDA and TalkBack; the order confirmation email; the PDF invoice.
