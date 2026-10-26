---
name: react19-test-patterns
description: 'Provides before/after patterns for migrating test files to React 19 compatibility, including act() imports, Simulate removal, and StrictMode call count changes.'
---

# React 19 Test Migration Patterns

Reference for all test file migrations required by React 19.

## Priority Order

Fix test files in this order; each layer depends on the previous:

1. **`act` import**  fix first, it unblocks everything else
2. **`Simulate` → `fireEvent`**  fix immediately after act
3. **Full react-dom/test-utils cleanup**  remove remaining imports
4. **StrictMode call counts**  measure actual, don't guess
5. **Async act wrapping**  for remaining "not wrapped in act" warnings
6. **Custom render helper**  verify once per codebase, not per test

---

## 1. act() Import Fix

```jsx
// Before  REMOVED in React 19:
import { act } from 'react-dom/test-utils';

// After:
import { act } from 'react';
```

If mixed with other test-utils imports:
```jsx
// Before:
import { act, Simulate, renderIntoDocument } from 'react-dom/test-utils';

// After  split the imports:
import { act } from 'react';
import { fireEvent, render } from '@testing-library/react'; // replaces Simulate + renderIntoDocument
```

---

## 2. Simulate → fireEvent

```jsx
// Before  Simulate REMOVED in React 19:
import { Simulate } from 'react-dom/test-utils';
Simulate.click(element);
Simulate.change(input, { target: { value: 'hello' } });
Simulate.submit(form);
Simulate.keyDown(element, { key: 'Enter', keyCode: 13 });

// After:
import { fireEvent } from '@testing-library/react';
fireEvent.click(element);
fireEvent.change(input, { target: { value: 'hello' } });
fireEvent.submit(form);
fireEvent.keyDown(element, { key: 'Enter', keyCode: 13 });
```

---

## 3. react-dom/test-utils Full API Map

| Old (react-dom/test-utils) | New location |
|---|---|
| `act` | `import { act } from 'react'` |
| `Simulate` | `fireEvent` from `@testing-library/react` |
| `renderIntoDocument` | `render` from `@testing-library/react` |
| `findRenderedDOMComponentWithTag` | `getByRole`, `getByTestId` from RTL |
| `findRenderedDOMComponentWithClass` | `getByRole` or `container.querySelector` |
| `scryRenderedDOMComponentsWithTag` | `getAllByRole` from RTL |
| `isElement`, `isCompositeComponent` | Remove  not needed with RTL |
| `isDOMComponent` | Remove |

---

## 4. StrictMode Call Count Fixes

React 19 StrictMode still double-invokes effects in development, so effect spy counts usually do not drop from 2 to 1 just because of the upgrade. Do not lower a count on that assumption. Some counts can still change, so update an assertion only from the real number in your failing test output. Check the React 19 upgrade notes if you are unsure what StrictMode now does.

**Strategy  always measure, never guess:**
```bash
# Run the failing test, read the actual count from the error:
npm test -- --watchAll=false --testPathPattern="[filename]" --forceExit 2>&1 | grep -E "Expected|Received"
```

```jsx
// Pattern only. Use the numbers from your own failing test output, never these placeholders:
// Before:
expect(mockFn).toHaveBeenCalledTimes(<old count>);

// After (the "Received" number printed by the failing test):
expect(mockFn).toHaveBeenCalledTimes(<measured count>);
```

If a count did not change, leave it. If you cannot explain why a count changed, mark that test "CHECK" in your report instead of editing the number to make it pass.

---

## 5. Async act Wrapping

If React still warns "not wrapped in act" after steps 1 to 4, wrap the update that triggers it:

```jsx
import { act } from 'react';

await act(async () => {
  // the click, timer or promise that updates state
});
```

Prefer Testing Library's `findBy` queries or `waitFor` when you are waiting for something to appear on screen. Use `act` only for updates your test starts itself.

---

## 6. Custom Render Helper

If your project has one shared render helper (for example `customRender` or `renderWithProviders`), check it once:

- It imports `act`, `render` and `fireEvent` from the right places (see steps 1 to 3).
- It does not use `renderIntoDocument` or any other `react-dom/test-utils` call.

Fix the helper once. Do not change it test by test.


## Inputs, guard rails and what to return

Added by AI Blocks. The method above is unchanged.

**You need:** at least one failing test file. The error output helps most.

**If something is missing:**
- No test code pasted: ask once for the file and its error output. Do not write test code from memory.
- No error output: apply steps 1 to 3 from the code alone. For step 4, ask the user to run the test and paste the real count. Never choose a number yourself.
- Testing Library version unknown: tell the user to check that their version supports React 19. Do not state a version number.
- A count changed and you cannot explain why: mark that test "CHECK". Do not change the number just to make it pass.
- If there is nothing from `react-dom/test-utils` and no failing counts, say so and stop.

**Return in this order:**
1. **Changes by step**: step number, file, before and after code.
2. **Call counts**: test name, old count, measured count.
3. **Flagged**: tests marked CHECK, with the reason.
4. **Render helper**: what changed, or "no change needed".

You cannot run the tests from a chat window. Tell the user to run the full suite on their own machine.
