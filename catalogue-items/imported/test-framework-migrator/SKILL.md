---
name: test-framework-migration-skill
description: "Migrates and converts test automation scripts between Selenium, Playwright, Puppeteer, and Cypress."
risk: critical
source: https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill
source_repo: LambdaTest/agent-skills
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/LambdaTest/agent-skills/blob/main/LICENSE
---

<!-- Licence note: the MIT line in the header above is the original author's licence, and it covers this skill text. LICENSE-CONTENT (CC BY 4.0) from sickn33's collection applies only where no more specific upstream notice exists. -->

# Test Framework Migration Skill
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

## When to Use

Use this skill to convert browser test scripts between Selenium, Playwright, Puppeteer and Cypress. Use it when the user asks to migrate, convert or port tests from one of these frameworks to another, rewrite tests in a different framework, or switch from one to another, such as Selenium to Playwright.

**When not to use:** one small test (rewrite it by hand), tests staying in the same framework, or a framework that is not in the table in Step 4.


You are a senior QA automation architect. You migrate test automation scripts from one framework (Selenium, Playwright, Puppeteer, Cypress) to another by applying API mappings, lifecycle changes, and pattern conversions from the skill reference docs.

## Step 1 — Detect Source Framework

Determine the **source** framework from the user message or from open files:

| Signal in message or code | Source framework |
|---------------------------|------------------|
| "Selenium", "WebDriver", "driver.findElement", "By.id", "ChromeDriver" | Selenium |
| "Playwright", "page.getByRole", "expect(locator).toBeVisible", "@playwright/test" | Playwright |
| "Puppeteer", "page.$", "page.goto", "puppeteer.launch" | Puppeteer |
| "Cypress", "cy.get", "cy.visit", "cy.contains", "cy.should" | Cypress |

If ambiguous (e.g. user says "convert my tests" with no file open), ask: "Which framework are your current tests in (Selenium, Playwright, Puppeteer, or Cypress)?"

## Step 2 — Detect Target Framework

Determine the **target** framework from the user message:

| User says... | Target |
|--------------|--------|
| "to Playwright", "to playwright" | Playwright |
| "to Selenium", "to WebDriver" | Selenium |
| "to Puppeteer" | Puppeteer |
| "to Cypress" | Cypress |

If the user only names the source (e.g. "convert my Selenium tests"), ask: "Which framework do you want to migrate to (Playwright, Puppeteer, Cypress, or keep Selenium with another language)?"

## Step 3 — Detect Language

| Source → Target | Language note |
|----------------|---------------|
| Selenium (Java/Python/C#) → Playwright | Playwright is typically JS/TS; migration usually implies rewriting to TypeScript or JavaScript. Mention this if source is Java/C#/Python. |
| Selenium (JS) → Playwright | Same language (JS/TS) possible. |
| Playwright/Puppeteer/Cypress → Selenium | Target can be Java, Python, JS, C#. Prefer same as project or ask. |
| Playwright ↔ Puppeteer ↔ Cypress | Typically stay in JS/TS. |

For language matrix details (which frameworks support which languages), see [reference/overview.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/overview.md).

## Step 4 — Route to Reference

**Always read** the matching reference file before generating migrated code:

| Source → Target | Reference file |
|----------------|----------------|
| Selenium → Playwright | [reference/selenium-to-playwright.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/selenium-to-playwright.md) |
| Playwright → Selenium | [reference/playwright-to-selenium.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/playwright-to-selenium.md) |
| Selenium → Puppeteer | [reference/selenium-to-puppeteer.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/selenium-to-puppeteer.md) |
| Puppeteer → Selenium | [reference/puppeteer-to-selenium.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/puppeteer-to-selenium.md) |
| Puppeteer → Playwright | [reference/puppeteer-to-playwright.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/puppeteer-to-playwright.md) |
| Playwright → Puppeteer | [reference/playwright-to-puppeteer.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/playwright-to-puppeteer.md) |
| Cypress → Playwright | [reference/cypress-to-playwright.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/cypress-to-playwright.md) |
| Playwright → Cypress | [reference/playwright-to-cypress.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/playwright-to-cypress.md) |
| Selenium → Cypress | [reference/selenium-to-cypress.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/selenium-to-cypress.md) |
| Cypress → Selenium | [reference/cypress-to-selenium.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/cypress-to-selenium.md) |

If the pair is not in the table, say so and suggest the closest supported migration (e.g. add WebDriverIO later as a new reference file). Tests that need WebdriverIO or any other framework not in the table are out of scope. Convert them to the nearest supported framework first, then adjust by hand. If you cannot read the guide for the pair, tell the user the conversion is an untested draft.

## Step 5 — Apply Mappings

Using the reference doc:

1. **Locators** — Convert using the API mapping table (e.g. `By.id("x")` → `page.getByRole(...)` or `page.locator('#x')`).
2. **Waits** — Convert wait strategy (explicit wait / auto-wait / cy.should).
3. **Actions** — Map click, type, select, etc.
4. **Assertions** — Map to target's assertion style.
5. **Lifecycle** — Adjust setup/teardown (driver vs page, launch vs connect).
6. **Cloud (TestMu)** — If user runs on cloud, point to target framework's cloud docs after migration. TestMu (LambdaTest's cloud) needs its own account and may be a paid plan. Local runs need none of it.

After generating migrated code, validate against the "Gotchas" section of the reference to avoid common pitfalls.

## Cross-References for Deep Patterns

| Need | Where to look |
|------|----------------|
| Full Playwright patterns, POM, cloud | `playwright-skill` and [playwright-skill/reference/cloud-integration.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/../playwright-skill/reference/cloud-integration.md) |
| Full Selenium patterns, POM, cloud | `selenium-skill` and [selenium-skill/reference/cloud-integration.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/../selenium-skill/reference/cloud-integration.md) |
| Full Puppeteer patterns, cloud | `puppeteer-skill` and [puppeteer-skill/reference/cloud-integration.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/../puppeteer-skill/reference/cloud-integration.md) |
| Full Cypress patterns, cloud | `cypress-skill` and [cypress-skill/reference/cloud-integration.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/../cypress-skill/reference/cloud-integration.md) |
| TestMu capabilities (all frameworks) | [shared/testmu-cloud-reference.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/../shared/testmu-cloud-reference.md) |

## Validation Workflow

After generating migrated code:

1. Ensure every locator/action/assertion was converted using the reference mapping (no leftover source API).
2. Ensure lifecycle (setup/teardown) matches target framework.
3. If target is Playwright: use auto-wait assertions (`expect(locator).toBeVisible()`), not raw `waitForTimeout`.
4. If target is Cypress: no async/await with `cy` commands; use chain style.
5. If target is Selenium: use explicit `WebDriverWait`, never `Thread.sleep`.

## Reference Files Summary

| File | When to read |
|------|--------------|
| [reference/overview.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/overview.md) | Framework comparison, language matrix, when to migrate |
| [reference/playbook.md](https://github.com/LambdaTest/agent-skills/tree/main/test-framework-migration-skill/reference/playbook.md) | Full migration workflow, debugging table, CI/CD checklist, best practices |
| `reference/<source>-to-<target>.md` | Before converting any script for that pair |

## Example

**User request:**

> Convert this Selenium test to Playwright.

**Input shape (Selenium, JavaScript):**

```javascript
await driver.get('[PAGE URL]');
await driver.findElement(By.id('[ELEMENT ID]')).click();
await driver.wait(until.elementLocated(By.css('[SELECTOR]')), 5000);
```

**Output shape (Playwright):**

```javascript
await page.goto('[PAGE URL]');
await page.locator('#[ELEMENT ID]').click();
await expect(page.locator('[SELECTOR]')).toBeVisible();
```

The real conversion follows the pair's guide. The reply also lists anything that needs a manual check.

## Next steps

After the manual review list is cleared, run the converted suite in CI. For patterns the migration does not cover, write new tests in the target framework (see the browser-test-writer item).

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
