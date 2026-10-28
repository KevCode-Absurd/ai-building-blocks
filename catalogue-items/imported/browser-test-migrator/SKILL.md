---
name: "migrate"
description: >-
  Migrate from Cypress or Selenium to Playwright. Use when user mentions
  "cypress", "selenium", "migrate tests", "convert tests", "switch to
  playwright", "move from cypress", or "replace selenium".
---

# Migrate to Playwright

Interactive migration from Cypress or Selenium to Playwright with file-by-file conversion.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Input

`$ARGUMENTS` can be:
- `"from cypress"` — migrate Cypress test suite
- `"from selenium"` — migrate Selenium/WebDriver tests
- A file path: convert a specific test file
- Empty: auto-detect source framework

## Steps

### 1. Detect Source Framework

Use `Explore` subagent to scan:
- `cypress/` directory or `cypress.config.ts` → Cypress
- `selenium`, `webdriver` in `package.json` deps → Selenium
- `.py` test files with `selenium` imports → Selenium (Python)

### 2. Assess Migration Scope

Count files and categorize:

```
Migration Assessment:
- Total test files: X
- Cypress custom commands: Y
- Cypress fixtures: Z
- Estimated effort: [small|medium|large]
```

| Size | Files | Approach |
|---|---|---|
| Small (1-10) | Convert sequentially | Direct conversion |
| Medium (11-30) | Batch in groups of 5 | Use sub-agents |
| Large (31+) | Use `/batch` | Parallel conversion with `/batch` |

### 3. Set Up Playwright (If Not Present)

Run `/pw:pw-init` first if Playwright isn't configured.

### 4. Convert Files

> **AI Blocks note (before you change any file):** show the user the assessment and the list of files you will change, and wait for a yes. Check the project is under version control with no unsaved changes, and suggest a new branch. If it is not, ask the user to make a backup copy first. Write the Playwright tests as new files and leave the old tests in place until the user has run the new ones and agrees to remove them.

For each file, apply the appropriate mapping:

#### Cypress → Playwright

Load `cypress-mapping.md` for complete reference.

Key translations:
```
cy.visit(url)           → page.goto(url)
cy.get(selector)        → page.locator(selector) or page.getByRole(...)
cy.contains(text)       → page.getByText(text)
cy.find(selector)       → locator.locator(selector)
cy.click()              → locator.click()
cy.type(text)           → locator.fill(text)
cy.should('be.visible') → expect(locator).toBeVisible()
cy.should('not.exist')  → expect(locator).toHaveCount(0)   (not not.toBeVisible: that also passes for hidden elements)
cy.get('[data-cy=x]')   → page.locator('[data-cy=x]'), or getByTestId('x') after setting testIdAttribute: 'data-cy' in the config
cy.should('have.text')  → expect(locator).toHaveText(text)
cy.intercept()          → page.route()
cy.wait('@alias')       → page.waitForResponse()
cy.fixture()            → JSON import or test data file
```

**Cypress custom commands** → Playwright fixtures or helper functions
**Cypress plugins** → Playwright config or fixtures
**`before`/`beforeEach`** → `test.beforeAll()` / `test.beforeEach()`

#### Selenium → Playwright

Load `selenium-mapping.md` for complete reference.

Key translations:
```
driver.get(url)                    → page.goto(url)
driver.findElement(By.id('x'))     → page.locator('#x') (getByTestId reads data-testid, not id)
driver.findElement(By.css('.x'))   → page.locator('.x') or page.getByRole(...)
element.click()                    → locator.click()
element.sendKeys(text)             → locator.fill(text)
element.getText()                  → locator.textContent()
WebDriverWait + ExpectedConditions → expect(locator).toBeVisible()
driver.switchTo().frame()          → page.frameLocator()
Actions                            → locator.hover(), locator.dragTo()
```

### 5. Upgrade Locators

During conversion, upgrade selectors to Playwright best practices:
- `#id` → `getByRole()` when the element has a role and name; keep `locator('#id')` otherwise. Do not switch to `getByTestId()` unless the element has a `data-testid` attribute
- `.class` → `getByRole()` or `getByText()`
- `[data-testid]` → `getByTestId()`. For another attribute such as `data-cy`, set `testIdAttribute` in `playwright.config.ts` first (playwright.dev/docs/locators)
- Keep the meaning of each check: "does not exist" becomes `toHaveCount(0)`, "not visible" becomes `toBeHidden()`
- XPath → role-based locators

### 6. Convert Custom Commands / Utilities

- Cypress custom commands → Playwright custom fixtures via `test.extend()`
- Selenium page objects → Playwright page objects (keep structure, update API)
- Shared helpers → TypeScript utility functions

### 7. Verify Each Converted File

After converting each file:

```bash
npx playwright test <converted-file> --reporter=list
```

Fix any compilation or runtime errors before moving to the next file.

### 8. Clean Up

After all files are converted:
- Remove Cypress/Selenium dependencies from `package.json`
- Remove old config files (`cypress.config.ts`, etc.)
- Update CI workflow to use Playwright
- Update README with new test commands

Ask user before deleting anything.

## Output

- Conversion summary: files converted, total tests migrated
- Any tests that couldn't be auto-converted (manual intervention needed)
- Updated CI config
- Before/after comparison of test run results

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
