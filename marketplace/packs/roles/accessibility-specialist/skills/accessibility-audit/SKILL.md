---
name: accessibility-audit
description: Evaluates a website, web app, mobile screens or a key flow (sign-up, checkout, booking, application) against WCAG 2.2 at a chosen level, usually AA, following W3C's WCAG-EM steps. Combines automated checks with manual keyboard, zoom, form, media and screen reader checks, ranks barriers by who they stop on key tasks, and returns a dated report with scope, method, a findings table, developer tickets and notes for the accessibility statement. Use it before a launch or tender, after a redesign, after a customer complaint, or when a checker shows errors nobody can act on. Never certifies compliance; it reports what was checked.
---

# Accessibility audit

## When to use

- Before launching a site, app or redesign, or before answering a tender that names WCAG or EN 301 549.
- When a customer says they could not complete a task with a keyboard, screen reader, magnifier or voice control.
- When an automated checker shows dozens of errors and the team needs them ranked and explained.
- Once a year for a full sample, with the quarterly check in `workflows/quarterly-accessibility-check.md` in between.

This is an evaluation against a standard. It is not a legal opinion or a certificate. The report says what was checked, how and when, and what was not.

## What you need

1. The pages, screens or flows in scope, and the tasks people do there, ranked by importance.
2. The target standard and level (default WCAG 2.2 AA), and any law, contract or tender that names one.
3. Access to the pages: public URLs, a test account with dummy data, or code and screenshots at phone and desktop width.
4. Any checker exports (axe, WAVE, Lighthouse, Accessibility Insights), earlier audits and customer complaints with personal details removed.
5. Who can run screen reader checks: a team member, a tester, or a disabled user taking part with consent.

**Access:** level 1 to read pages, code and results and run automated checks through a connected browser or test runner; level 2 to file draft tickets or open a pull request with fixes; level 3 to create tickets in the named project or merge fixes, within your limits.

**Two modes.** With a browser tool connected, I load pages, run axe-core based checks and step through with the keyboard in a scripted browser. With web search connected, I confirm the current WCAG version and the relevant legal pages before writing dates. With neither, I work from code, screenshots and exports and mark each check by its evidence.

## Steps

### 1. Define the scope (WCAG-EM step 1)

Write down: product, version or date, URLs or screens in scope, target level, the key tasks, the browsers and assistive technologies to cover, and what is out of scope (for example a third-party payment page). Agree it with the client before testing.

### 2. Explore (step 2)

List the page types (home, category, product, form, account, checkout, help) and the shared parts (header, menu, footer, cookie banner, chat widget). List every step of each key process. A process only conforms if every step does.

### 3. Sample (step 3)

Pick a structured sample: one of each page type, every step of each key process, every template with forms or media, plus a few random pages. For a small site, test every page.

### 4. Run automated checks

Run one engine across the sample and keep the export. Record each issue with page, element and rule. Treat the results as detected issues, not the full picture: tools miss many barriers, and a clean scan does not mean the page is accessible.

### 5. Run manual checks

For each sampled page:
- **Keyboard:** Tab and Shift+Tab through everything. Every action works; the order makes sense; focus is always visible and never hidden by sticky headers, cookie bars or chat widgets; no traps; Escape closes dialogs and focus returns to the opener.
- **Structure:** page title, language, one main heading, heading levels in order, landmarks, link text that makes sense alone.
- **Forms:** visible labels, instructions, required fields marked in text, errors in text next to the field and in a summary, no repeated entry of the same information, sign-in that allows paste and password managers.
- **Visual:** text contrast 4.5:1 (3:1 for large text), controls and focus indicators 3:1, nothing shown by colour alone, zoom to 200%, reflow at 320 CSS pixels wide, target sizes.
- **Images and media:** alt text fits each image's job; charts have their data in text; videos have captions, transcripts and audio description where visuals carry meaning; moving content can be paused.
- **Screen reader spot checks:** at least one desktop pair (NVDA or JAWS with a Chromium browser) and one mobile pair (VoiceOver on iOS or TalkBack). Write what should be announced. If nobody ran it, mark "not verified".
- **Cognitive load:** clear words, consistent help in the same place, time limits that can be extended.

### 6. Write findings

One row per barrier, not per checker rule. Merge duplicates across pages into one finding with a page list.

Rate each finding:
- **Blocker:** stops a key task for some users (keyboard trap, unlabelled payment field, inaccessible CAPTCHA).
- **Serious:** makes a key task hard or error-prone.
- **Moderate:** slows people down or confuses them.
- **Minor:** best practice or cosmetic.

### 7. Turn findings into tickets

For each blocker and serious finding: title, where, barrier, who it affects, criterion and level, fix (code snippet where possible), and an acceptance test a developer can run.

### 8. Note the statement

List known problems in plain words with planned fix dates, third-party content that fails, and how people can ask for help or an alternative. These feed the statement prompt.

## Checks

- Scope, level, date, tools and assistive technologies are written at the top.
- Every step of each key process is in the sample.
- Every finding names who it affects and a WCAG criterion with its level.
- Automated, manual and "not verified" results are labelled apart.
- No finding was copied from a checker without looking at the element.
- Third-party content is listed with the vendor's responsibility.
- No words such as "compliant", "certified" or "fully accessible".
- Legal questions are flagged for the client's lawyer.

## Output format

1. Summary: the five barriers that stop people most, in plain words.
2. Scope and method box: standard, level, sample, tools, assistive technologies, dates, out of scope, not verified.
3. Findings table: ID, where, barrier, who it affects, criterion and level, severity, fix, test.
4. Developer tickets for blockers and serious findings.
5. Statement notes: known problems, third-party content, contact route.
6. Next steps: fix order and the retest date.

## Example of good output (short)

*Illustrative structure, not a real business: a three-clinic dental group with an online booking flow. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary.** Keyboard users cannot choose a time slot; the date fields have no labels; error messages show as red borders only; the chat button covers the "Confirm booking" button when it has focus on phones; the clinic photos have file names as alt text.
>
> **Scope.** Booking flow (4 steps) and 6 page types, WCAG 2.2 AA, tested 4 to 5 November 2026 with axe-core, keyboard in Chrome and Firefox, NVDA with Chrome. VoiceOver on iOS: not verified.
>
> | ID | Where | Barrier | Who it affects | Criterion | Severity | Fix | Test |
> |---|---|---|---|---|---|---|---|
> | B1 | Booking step 2, time slots | Slots are `div`s with click handlers; Tab skips them | Keyboard and switch users | 2.1.1 Keyboard (A) | Blocker | Use `button` elements in a labelled group | Tab reaches each slot; Enter selects it |
> | B2 | Step 3, date of birth | Three inputs with placeholder text only | Screen reader and voice control users | 3.3.2 Labels or Instructions (A) | Serious | Visible labels and a `fieldset` with a `legend` | NVDA announces "Day, Date of birth" |
> | B3 | Step 4 on phones | Chat button hides the focused "Confirm booking" button | Keyboard and magnifier users | 2.4.11 Focus Not Obscured (Minimum) (AA) | Serious | Offset the widget or set the vendor's position option | Focused button fully visible at 320 px |
