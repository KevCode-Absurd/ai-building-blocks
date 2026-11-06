---
name: component-build
description: Builds or fixes one React or Vue component (or a plain HTML, CSS and JavaScript widget) with a props table, every state (default, hover, focus, loading, empty, error, success, disabled), keyboard and screen reader support, and user-style tests in the project's own test tool. Use it when someone needs a new form, filter, table, modal, menu or card, wants an old component moved to hooks or the Composition API, or has a component that renders wrong.
---

# Component build

## When to use

- A new reusable part: a form, filter bar, data table, modal, tabs, menu, card list or toast.
- A component that renders wrong, flickers or loses its state.
- An old class component moved to hooks, or a Vue Options API component moved to the Composition API, with the same props and behaviour.
- Tests for a component nobody wants to touch.

Not for whole design systems, pixel-perfect work from a design file I cannot see, or back-end code.

## What you need

1. The brief: what the component does, who uses it and where it appears.
2. The stack: framework and version (from `package.json`), TypeScript or not, styling approach (CSS Modules, Tailwind, plain CSS), test tool (Vitest, Jest, Vue Test Utils, Testing Library).
3. Nearby code the component must fit with: one similar component, the folder tree, any shared hooks or composables.
4. Data shapes: real field names and types from the API or a sample response with personal data removed.
5. Design notes or screenshots for each state, if they exist.

If the brief leaves a choice open, pick the common default for that stack and label it "my choice". Never invent API fields; use a clearly marked placeholder instead.

**Access:** level 1 to read the repo; level 2 to push a branch and open a pull request; level 3 to merge and deploy it, within your limits.

## Steps

### 1. Write the contract first

List every prop with type, default and whether it is required, then every event or callback the component sends out. Write down each user action (click, type, select, submit, close) and each state. Typical states:

| State | Ask yourself |
|---|---|
| Default | What does it look like with typical data? |
| Hover and focus | Is focus visible and not hidden behind a sticky header? |
| Loading | Does the layout hold its size, or does it jump? |
| Empty | What does the user see and do when there is no data? |
| Error | Is the message next to the problem, in plain words, with a way to retry? |
| Success | How does the user know it worked? |
| Disabled | Why is it disabled, and is that explained? |

### 2. Pick native elements

Use `<button>`, `<a>`, `<label>`, `<input>`, `<select>`, `<dialog>` and `<details>` before building custom widgets. A custom widget needs the matching ARIA role and the keyboard behaviour that role promises, so only build one when no native element fits. For modals, use `<dialog>` with `showModal()` and return focus to the opener on close.

### 3. Keep state small

- Derive values during render rather than copying props into state.
- Put user-triggered logic in event handlers.
- Keep side effects (subscriptions, timers, fetches) in one effect or composable, with clean-up and protection against stale responses.
- Reset state with a `key` when the item being shown changes.

### 4. Build mobile first

Start at a narrow phone width with flexible units, grid and flexbox. Avoid fixed widths. Check the layout reflows at 320 CSS pixels without sideways scrolling, and that tap targets are at least 24 by 24 CSS pixels or well spaced.

### 5. Make it safe

Let the framework escape output. If the component must show HTML from a CMS or user, sanitise it with a maintained library before rendering. Validate URLs before using them in `href` or `src`.

### 6. Write tests like a user

Render the component, find elements by role, label or visible text, click and type, then check what appears. Cover each state and at least one edge case: an empty list, very long text, a slow response, a failed request. For a fix, first write a test that fails because of the bug; for a refactor, first write tests that pin today's behaviour.

### 7. Self-check and hand over

Run the checks below, then write the hand-over in the output format. **Level 2:** push the files to a branch and open the pull request, with the hand-over as its description. **Level 3:** merge it once review and checks pass, within your limits.

## Checks before handing over

- Every prop in the table is used, and every prop used is in the table.
- Every state from step 1 is reachable and covered by a test or a manual test step.
- All controls work by keyboard; focus order is logical; focus is visible.
- Every input has a label; every icon-only button has an accessible name.
- Contrast passes 4.5:1 for text and 3:1 for interface parts; if a brand colour fails, the nearest passing shade is offered and flagged.
- No raw HTML from user or CMS data.
- Every import is real; every new package has a version and a reason; no package was added that the project already covers.
- For refactors, public props and events are unchanged unless the brief says otherwise.
- The file tree matches the files, and run and test commands are given.
- Anything not checked (visual rendering, real devices, screen readers) is listed as "not verified".

## Output format

1. Summary: what the component does, in two sentences.
2. Assumptions and "my choice" decisions.
3. Props and events table.
4. States table with how each is reached.
5. File tree.
6. Complete files: component, styles, tests, and a story file if the project uses Storybook.
7. How to run: install, test and preview commands.
8. Manual test list: widths, keyboard-only steps, screen reader spot checks, slow network.
9. Not verified, and what the reviewer should look at in the pull request.

## Example of good output (short)

*Made-up business for illustration: "Harbour Lane Bikes", a bike hire shop.*

> **Summary.** `BookingFilter` lets customers filter available bikes by date, size and type, and tells the parent when filters change. React 19 with TypeScript, CSS Modules and Vitest with Testing Library, matching the repo.
>
> **My choices.** Date input uses native `<input type="date">` (no date library in the repo). Debounce on the size field is 300 ms; change in `BookingFilter.tsx` line 12 if you prefer another value.
>
> | Prop | Type | Default | Required | Notes |
> |---|---|---|---|---|
> | `bikeTypes` | `{ id: string; label: string }[]` | none | yes | From `/api/bike-types` |
> | `status` | `"idle" \| "loading" \| "error"` | `"idle"` | no | Parent owns the request |
> | `onChange` | `(filters: Filters) => void` | none | yes | Fires after debounce |
>
> | State | How to reach it | Test |
> |---|---|---|
> | Empty | `bikeTypes=[]` | "shows 'No bike types yet' and disables the type select" |
> | Error | `status="error"` | "shows retry button; clicking it calls onRetry" |
>
> **Not verified.** I have not seen this render. Please check the date input on iOS Safari, where native date pickers look different.
