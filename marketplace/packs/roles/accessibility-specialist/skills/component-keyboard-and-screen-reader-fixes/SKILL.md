---
name: component-keyboard-and-screen-reader-fixes
description: Rewrites interactive components (modal dialogs, menus and disclosure navigation, tabs, accordions, custom selects, carousels, forms with errors, toasts and status messages) so keyboard and screen reader users can use them. Uses native HTML first and ARIA only where needed, keeps the brand, and returns the fixed code, a change table with the WCAG criterion and what a screen reader announces before and after, a keyboard test script, and one automated check to keep the fix from breaking. Use it when an audit flags a component, a customer reports being trapped or lost, or before shipping a new component library.
---

# Component keyboard and screen reader fixes

## When to use

- An audit or checker flags a modal, menu, tab set, form or widget.
- A customer says they got stuck, lost focus, or heard "button, button, button".
- A team is building or buying a component library and wants it right before it spreads.

For a whole-page pass (headings, landmarks, contrast, reflow), use the frontend-developer kit's `accessibility-fix-pass` skill. This skill goes deep on one component at a time.

## What you need

1. The component code (HTML, JSX, Vue, Liquid or similar) and its CSS, plus the script that drives it.
2. How it should behave for a mouse user, and screenshots of each state (closed, open, error, loading).
3. The framework and version, and any component library in use.
4. Brand colours and focus styles that must stay.
5. The audit line or complaint, with personal details removed.

**Access:** level 1 to read the code; level 2 to push a branch and open a pull request with the change table in the description; level 3 to merge after review and checks pass, in the repos you name.

## Steps

### 1. Walk it with the keyboard first

Before changing anything, tab through the component in order (in a connected browser, or step by step in the code). Note where focus goes, where it disappears, what Enter, Space, Escape and the arrow keys do, and what a screen reader would announce from the markup: role, name, state.

### 2. Replace fake controls with native ones

- Clickable `div` or `span` becomes `button` (actions) or `a href` (navigation).
- Custom checkbox or radio becomes a real `input` with a visible `label`.
- Modal becomes `<dialog>` opened with `showModal()`, which handles focus containment and Escape in current browsers; still return focus to the opener on close.
- Groups of related fields get `fieldset` and `legend`.

Native elements bring keyboard support and semantics for free. ARIA is a promise: a role with no matching keyboard behaviour misleads users.

### 3. Apply the pattern for what is left

- **Disclosure menu (site navigation):** a `button` with `aria-expanded` that shows a list of links. Do not use `role="menu"` for site navigation; it changes how screen readers handle the keys.
- **Tabs:** `tablist`, `tab` and `tabpanel`, arrow keys move between tabs, only the active tab is in the Tab order, `aria-selected` on the active tab, and each panel labelled by its tab.
- **Accordion:** each header is a `button` inside a heading, with `aria-expanded` and `aria-controls`.
- **Custom select or combobox:** prefer a native `select`. If the design truly needs a combobox, follow the ARIA Authoring Practices pattern exactly and test it with each browser and screen reader pair.
- **Carousel:** a pause control, previous and next buttons with names, no auto-advance without a way to stop it, and slides that are not hidden from screen readers while visible.
- **Forms and errors:** visible labels; hints linked with `aria-describedby`; on submit, an error summary at the top that takes focus and links to each field; errors in text next to fields; `aria-invalid` on fields in error; never colour alone.
- **Status messages and toasts:** text added to a live region that exists in the page before the message (`role="status"` for polite updates, `role="alert"` only for urgent ones). Do not move focus for a status message.

### 4. Handle focus

- Opening a dialog moves focus to its first useful control or its heading.
- Closing returns focus to the control that opened it.
- Focus is always visible, with a focus indicator of at least 3:1 contrast, and never hidden behind sticky headers, cookie bars or chat widgets.
- Removing content (deleting a row, closing a toast) moves focus somewhere sensible, not to the top of the page.

### 5. Keep the brand

When a colour pair fails (text 4.5:1, large text and controls 3:1), give the nearest passing shade with both ratios and let the brand owner decide. Keep class names and props unless the change table says why they changed.

### 6. Write the change table and tests

For each change: element, problem, fix, WCAG criterion and level, and the screen reader announcement before and after. Then a keyboard script (numbered steps with the expected result) and one automated check, for example an axe-core assertion in the project's Playwright or Jest tests, with the command to run it and a note on what automated checks cannot catch.

### 7. Ship at the level granted

Level 2: branch and pull request with the table in the description. Level 3: merge after review and checks pass, then log what was merged and where.

## Checks

- Every interactive element is reachable and operable by keyboard, with visible focus.
- Every control has a name, a role and its current state.
- No ARIA repeats or contradicts native semantics.
- Focus moves into and out of dialogs correctly; Escape closes them.
- Status messages are announced without stealing focus.
- Colour pairs meet their ratios or are flagged for the brand owner.
- Behaviour for mouse users is unchanged unless agreed.
- Screen reader results are marked "not verified" if nobody ran them.
- No overlay widget is suggested; nothing claims the site is compliant.

## Output format

1. One-paragraph summary of what a keyboard or screen reader user hits now and after the fix.
2. Change table: element, problem, fix, criterion and level, announcement before, announcement after.
3. Fixed code in full (or a diff for large files).
4. Keyboard test script.
5. Screen reader spot checks for one desktop and one mobile pair, with expected announcements.
6. Automated check and how to run it.
7. Not verified, and decisions needed.

## Example of good output (short)

*Made-up business for illustration: "Tallow & Wick", a candle shop with pricing tabs for its subscription.*

> **Summary.** Today the tabs switch on click only and a screen reader reads all three panels at once. After the fix, arrow keys move between tabs, only the chosen plan's panel is read, and the selected tab is announced.
>
> | Element | Problem | Fix | Criterion | Before | After |
> |---|---|---|---|---|---|
> | Plan tabs | `div`s with click handlers | `role="tablist"` with `button role="tab"`, arrow keys, roving tabindex | 2.1.1 Keyboard (A); 4.1.2 Name, Role, Value (A) | "Monthly. Quarterly. Yearly." | "Monthly, tab, selected, 1 of 3" |
> | Panels | All visible to screen readers | Inactive panels `hidden`; each panel labelled by its tab | 1.3.1 Info and Relationships (A) | Reads all three price blocks | Reads the chosen plan only |
> | Focus ring | `outline: none` | Brand teal outline, 3.4:1 against the background | 2.4.7 Focus Visible (AA) | No visible focus | Visible ring on the active tab |
>
> **Not verified:** VoiceOver on iOS. Please check that swiping moves through the tabs in order.
