---
name: accessibility-fix-pass
description: Reviews a page or component against WCAG 2.2 level AA and fixes what code can fix, such as headings and landmarks, labels and accessible names, keyboard access and focus order, visible and unobscured focus, colour contrast, target size, alt text, error messages, modals and reflow at 320 CSS pixels. Returns the fixed code, a change table that maps each fix to a WCAG criterion, keyboard and screen reader test steps, and the issues that need a person to decide. Use it before launch, after an automated checker flags errors, or when a customer reports they cannot use the site.
---

# Accessibility fix pass

## When to use

- An automated checker (axe DevTools, WAVE, Lighthouse) shows errors and the team wants them fixed properly.
- A customer says they cannot use a form, menu or checkout with a keyboard or screen reader.
- Before launching a page, a component library or a shop that sells to EU consumers.
- After a redesign changed colours, fonts or navigation.

This is a code fix pass, not a legal audit or a certificate. I never say a site "is compliant".

## What you need

1. The page code (HTML, or the component files) and, if possible, the CSS.
2. Screenshots at phone and desktop width, including focus states and error states.
3. Any automated checker results (axe, WAVE or Lighthouse export).
4. Brand colours and fonts, and whether they can change.
5. Known complaints from users, in their words, with personal details removed.

**Access:** level 1 to read the code and checker results; level 2 to put the fixes on a branch and open a pull request; level 3 to merge and deploy them, within your limits.

## Steps

### 1. Structure

- One `h1`; headings in order without skipped levels used for styling.
- Landmarks: `header`, `nav`, `main`, `footer`; a skip link to `main` on pages with long navigation.
- `lang` attribute on the `html` element.
- Page title that says what the page is.

### 2. Names and labels

- Every input has a visible `<label>` linked by `for` and `id`; placeholder text is not a label.
- Icon-only buttons and links have an accessible name (visually hidden text or `aria-label`).
- Links say where they go; no "click here" lists.
- Images: meaningful images get alt text from the brief; decorative images get `alt=""`.

### 3. Keyboard and focus

- Tab through the whole page. Every action reachable by mouse is reachable by keyboard, in a logical order.
- Focus is always visible, and not hidden behind sticky headers, cookie bars or chat widgets (WCAG 2.2, 2.4.11).
- Custom widgets follow the ARIA Authoring Practices pattern for their role, or are replaced by native elements.
- Modals: use `<dialog>` with `showModal()`, Escape closes, focus returns to the opener.
- No keyboard traps outside modals.

### 4. Visual

- Text contrast at least 4.5:1, large text and interface parts at least 3:1. If a brand colour fails, offer the nearest passing shade and flag it.
- Information is not given by colour alone (for example, red borders for errors also need text).
- Pointer targets at least 24 by 24 CSS pixels, or spaced so a 24-pixel circle around each does not overlap another.
- Content reflows at 320 CSS pixels wide without sideways scrolling; text can be zoomed to 200%.

### 5. Forms and errors

- Errors are announced in text next to the field and summarised at the top on submit.
- Required fields are marked in text, not only with an asterisk colour.
- Do not ask for the same information twice in one process (WCAG 2.2, 3.3.7).
- Login steps allow paste and password managers (WCAG 2.2, 3.3.8).

### 6. Motion and media

- Respect `prefers-reduced-motion` for animations.
- Videos have captions; auto-playing media can be paused.

### 7. ARIA clean-up

Remove ARIA that repeats native semantics or contradicts it. Bad ARIA is worse than none.

### 8. Write the change table and test steps

Map each fix to a WCAG 2.2 criterion and level. List what still needs a person: content decisions (alt text wording, plain-language rewrites), brand colour changes, third-party widgets the team does not control.

**Level 2:** put the fixed files on a branch and open a pull request with the change table in its description. **Level 3:** merge and deploy it after review, within your limits, and log both.

## Checks before handing over

- Each fix cites a WCAG 2.2 criterion number and level.
- Fixed code is complete and does not change behaviour beyond the fix.
- Keyboard test steps cover every interactive element on the page.
- Screen reader spot checks are listed for at least one desktop and one mobile reader, marked "not verified" if I could not run them.
- Third-party widgets are listed with what the vendor must fix.
- No claim of compliance; the report says what was checked and what was not.

## Output format

1. Summary: the three issues that block people most, in plain words.
2. Change table: element, problem, fix, WCAG criterion and level, file and line.
3. Fixed files in full (or a diff for large files).
4. Keyboard test steps.
5. Screen reader spot checks.
6. Needs a decision: content, colours, third-party widgets.
7. Not verified.

## Example of good output (short)

*Illustrative structure, not a real business: an event caterer with a quote form. Copy the shape, never the content: every fact comes from the client's own context.*

> **Summary.** People using a keyboard cannot open the menu on phones, the quote form has no labels, and the grey helper text fails contrast.
>
> | Element | Problem | Fix | WCAG | File |
> |---|---|---|---|---|
> | Mobile menu toggle | `div` with click handler, not focusable | Replaced with `<button aria-expanded>` | 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A) | `header.html` L14 |
> | Quote form inputs | Placeholder only, no label | Added visible `<label for>` | 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A) | `quote.html` L40-71 |
> | Helper text `#9a9a9a` on white | Contrast 2.8:1 | Changed to `#6b6b6b` (5.3:1). Brand team to confirm. | 1.4.3 Contrast (Minimum) (AA) | `styles.css` L88 |
> | Chat widget button | Covers focused "Send" button on phones | Vendor setting or offset needed | 2.4.11 Focus Not Obscured (Minimum) (AA) | Third party |
>
> **Not verified.** I could not run VoiceOver or NVDA. Please check the form error summary is read out on submit.
