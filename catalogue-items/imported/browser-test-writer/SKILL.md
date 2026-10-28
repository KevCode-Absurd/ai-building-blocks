---
name: "generate"
description: >-
  Generate Playwright tests. Use when user says "write tests", "generate tests",
  "add tests for", "test this component", "e2e test", "create test for",
  "test this page", or "test this feature".
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **The product spec** (yours): what to build and how to tell it's done: a requirements doc or user stories.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, the product spec. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Supporting material availability

This catalog copy does not include these files:

- `../pw/templates/auth/login.md`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

# Generate Playwright Tests

Generate production-ready Playwright tests from a user story, URL, component name, or feature description.

## Input

`$ARGUMENTS` contains what to test. Examples:
- `"user can log in with email and password"`
- `"the checkout flow"`
- `"src/components/UserProfile.tsx"`
- `"the search page with filters"`

You can also share a document of test scenarios or user stories. Each one becomes a test.

## Steps

### 1. Understand the Target

Parse `$ARGUMENTS` to determine:
- **User story**: Extract the behavior to verify
- **Component path**: Read the component source code
- **Page/URL**: Identify the route and its elements
- **Feature name**: Map to relevant app areas

### 2. Explore the Codebase

Use the `Explore` subagent to gather context. If your AI has no such subagent, read the same files yourself:

- Read `playwright.config.ts` for `testDir`, `baseURL`, `projects`
- Check existing tests in `testDir` for patterns, fixtures, and conventions
- If a component path is given, read the component to understand its props, states, and interactions
- Check for existing page objects in `pages/`
- Check for existing fixtures in `fixtures/`
- Check for auth setup (`auth.setup.ts` or `storageState` config)

### 3. Select Templates

Check `templates/` in this plugin for matching patterns:

| If testing... | Load template from |
|---|---|
| Login/auth flow | `../pw/templates/auth/login.md` (not in this copy: write the login step from the project's own `auth.setup.ts` or a test that already logs in) |
| CRUD operations | `templates/crud/` |
| Checkout/payment | `templates/checkout/` |
| Search/filter UI | `templates/search/` |
| Form submission | `templates/forms/` |
| Dashboard/data | `templates/dashboard/` |
| Settings page | `templates/settings/` |
| Onboarding flow | `templates/onboarding/` |
| API endpoints | `templates/api/` |
| Accessibility | `templates/accessibility/` |

If the template files are not available, write the test by hand from the project's own tests and auth setup. Do not say you loaded a template.

Adapt the template to the specific app — replace `{{placeholders}}` with actual selectors, URLs, and data.

### 4. Generate the Test

Follow these rules:

**Structure:**
```typescript
import { test, expect } from '@playwright/test';
// Import custom fixtures if the project uses them

test.describe('Feature Name', () => {
  // Group related behaviors

  test('should <expected behavior>', async ({ page }) => {
    // Arrange: navigate, set up state
    // Act: perform user action
    // Assert: verify outcome
  });
});
```

**Locator priority** (use the first that works):
1. `getByRole()` — buttons, links, headings, form elements
2. `getByLabel()` — form fields with labels
3. `getByText()` — non-interactive text content
4. `getByPlaceholder()` — inputs with placeholder text
5. `getByTestId()` — when semantic options aren't available

**Assertions** — always web-first:
```typescript
// GOOD — auto-retries
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByRole('alert')).toHaveText('Success');

// BAD — no retry
const text = await page.textContent('.msg');
expect(text).toBe('Success');
```

**Never use:**
- `page.waitForTimeout()`
- `page.$(selector)` or `page.$$(selector)`
- Bare CSS selectors unless absolutely necessary
- `page.evaluate()` for things locators can do

**Always include:**
- Descriptive test names that explain the behavior
- Error/edge case tests alongside happy path
- Proper `await` on every Playwright call
- `baseURL`-relative navigation (`page.goto('/')` not `page.goto('http://...')`)

### 5. Match Project Conventions

- If project uses TypeScript → generate `.spec.ts`
- If project uses JavaScript → generate `.spec.js` with `require()` imports
- If project has page objects → use them instead of inline locators
- If project has custom fixtures → import and use them
- If project has a test data directory → create test data files there

### 6. Generate Supporting Files (If Needed)

- **Page object**: If the test touches 5+ unique locators on one page, create a page object
- **Fixture**: If the test needs shared setup (auth, data), create or extend a fixture
- **Test data**: If the test uses structured data, create a JSON file in `test-data/`

### 7. Verify

Run the generated test:

```bash
npx playwright test <generated-file> --reporter=list
```

If it fails:
1. Read the error
2. Fix the test (not the app)
3. Run again
4. If it's an app issue, report it to the user

## Output

- Generated test file(s) with path
- Any supporting files created (page objects, fixtures, data)
- Test run result
- Coverage note: what behaviors are now tested

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
